import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { createServiceClient } from '@/lib/supabase/service'

const PLAN_MONTHS: Record<number, number> = {
  7900: 1,
  22200: 3,
  44400: 6,
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature') ?? ''

  const computedHmac = createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex')

  let isValid = false
  try {
    const expected = Buffer.from(computedHmac, 'hex')
    const received = Buffer.from(signature, 'hex')
    isValid = expected.length > 0 && received.length === expected.length && timingSafeEqual(expected, received)
  } catch {
    isValid = false
  }

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const body = JSON.parse(rawBody)
  const event: string = body.event
  const supabase = createServiceClient()

  // Payment Links fire this event
  if (event === 'payment_link.paid') {
    const paymentEntity = body.payload.payment.entity
    const paymentId: string = paymentEntity.id
    const amount: number = paymentEntity.amount
    const contact: string = paymentEntity.contact ?? ''

    // Normalize: strip country code, keep last 10 digits
    const mobile = contact.replace(/^\+?91/, '').replace(/\D/g, '').slice(-10)
    const planMonths = PLAN_MONTHS[amount] ?? 1

    if (!mobile) {
      return NextResponse.json({ error: 'Missing contact' }, { status: 400 })
    }

    const { data: userRecord } = await supabase
      .from('users')
      .select('id, payment_intent_id')
      .eq('mobile', mobile)
      .single()

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Idempotency: skip if already processed this payment
    if (userRecord.payment_intent_id !== paymentId) {
      const expiresAt = new Date(Date.now() + planMonths * 30 * 24 * 60 * 60 * 1000).toISOString()
      await supabase
        .from('users')
        .update({ subscription_status: 'active', subscription_expires_at: expiresAt, payment_intent_id: paymentId })
        .eq('id', userRecord.id)

      await supabase.from('payments_log').insert({
        user_id: userRecord.id,
        razorpay_payment_id: paymentId,
        amount,
        plan_months: planMonths,
        status: 'captured',
        event_type: event,
      })
    }

    return NextResponse.json({ received: true })
  }

  // Legacy: dynamic checkout.js orders
  if (event === 'payment.captured' || event === 'payment.failed') {
    const entity = body.payload.payment.entity
    const paymentId: string = entity.id
    const orderId: string | null = entity.order_id ?? null
    const amount: number | null = entity.amount ?? null
    const userId: string = entity.notes?.user_id
    const planMonths: number = parseInt(entity.notes?.plan_months ?? '1', 10) || 1

    if (!userId) return NextResponse.json({ error: 'Missing user_id in notes' }, { status: 400 })

    if (event === 'payment.captured') {
      const { data: existingUser } = await supabase.from('users').select('payment_intent_id').eq('id', userId).single()
      if (existingUser?.payment_intent_id !== paymentId) {
        const expiresAt = new Date(Date.now() + planMonths * 30 * 24 * 60 * 60 * 1000).toISOString()
        await supabase
          .from('users')
          .update({ subscription_status: 'active', subscription_expires_at: expiresAt, payment_intent_id: paymentId })
          .eq('id', userId)
      }
    }

    await supabase.from('payments_log').insert({
      user_id: userId,
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      amount,
      plan_months: planMonths,
      status: event === 'payment.captured' ? 'captured' : 'failed',
      event_type: event,
    })

    return NextResponse.json({ received: true })
  }

  return NextResponse.json({ received: true })
}
