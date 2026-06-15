import Razorpay from 'razorpay'
import { createServiceClient } from '@/lib/supabase/service'

export async function checkAndActivateSubscription(userId: string): Promise<void> {
  try {
    const supabase = createServiceClient()

    const { data: user } = await supabase
      .from('users')
      .select('subscription_status, payment_intent_id')
      .eq('id', userId)
      .single()

    if (!user || user.subscription_status !== 'payment_pending' || !user.payment_intent_id) {
      return
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const payment = await razorpay.payments.fetch(user.payment_intent_id)

    if (payment.status === 'captured') {
      const { data: logEntry } = await supabase
        .from('payments_log')
        .select('plan_months')
        .eq('user_id', userId)
        .eq('razorpay_payment_id', user.payment_intent_id)
        .maybeSingle()

      const planMonths = logEntry?.plan_months ?? 1
      const expiresAt = new Date(Date.now() + planMonths * 30 * 24 * 60 * 60 * 1000).toISOString()

      await supabase
        .from('users')
        .update({
          subscription_status: 'active',
          subscription_expires_at: expiresAt,
        })
        .eq('id', userId)

      const p = payment as unknown as Record<string, unknown>
      await supabase.from('payments_log').insert({
        user_id: userId,
        razorpay_payment_id: user.payment_intent_id,
        razorpay_order_id: (p.order_id as string) ?? null,
        amount: (p.amount as number) ?? null,
        plan_months: planMonths,
        status: 'captured',
        event_type: 'payment.captured_fallback',
      })
    }
  } catch {
    // Best-effort fallback — errors must not crash the caller
  }
}
