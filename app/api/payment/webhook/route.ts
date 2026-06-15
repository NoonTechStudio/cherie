import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { createServiceClient } from '@/lib/supabase/service'

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

  if (event !== 'payment.captured' && event !== 'payment.failed') {
    return NextResponse.json({ received: true })
  }

  const entity = body.payload.payment.entity
  const paymentId: string = entity.id
  const orderId: string | null = entity.order_id ?? null
  const amount: number | null = entity.amount ?? null
  const userId: string = entity.notes?.user_id
  const planMonths: number = parseInt(entity.notes?.plan_months ?? '1', 10) || 1

  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id in notes' }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (event === 'payment.captured') {
    const { data: existingUser } = await supabase
      .from('users')
      .select('payment_intent_id')
      .eq('id', userId)
      .single()

    if (existingUser?.payment_intent_id !== paymentId) {
      const expiresAt = new Date(Date.now() + planMonths * 30 * 24 * 60 * 60 * 1000).toISOString()
      await supabase
        .from('users')
        .update({
          subscription_status: 'active',
          subscription_expires_at: expiresAt,
          payment_intent_id: paymentId,
        })
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
