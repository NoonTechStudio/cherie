import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

const PLAN_CONFIG = {
  '1mo': { amount: 7900,  months: 1 },
  '3mo': { amount: 22200, months: 3 },
  '6mo': { amount: 44400, months: 6 },
} as const

type PlanId = keyof typeof PLAN_CONFIG

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let planId: PlanId = '1mo'
  try {
    const body = await request.json() as { plan?: string }
    if (body.plan && body.plan in PLAN_CONFIG) {
      planId = body.plan as PlanId
    }
  } catch {
    // default to 1mo if body parsing fails
  }

  const { amount, months } = PLAN_CONFIG[planId]

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      notes: {
        user_id: user.id,
        plan_months: String(months),
      },
    })

    return NextResponse.json({
      order_id: order.id,
      razorpay_key: process.env.RAZORPAY_KEY_ID!,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
