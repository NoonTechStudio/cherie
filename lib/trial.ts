/**
 * Calculate days remaining using calendar days only (midnight to midnight).
 * Registered at 7 PM today still shows "3 days left" until midnight.
 * After midnight the count drops by 1 — no hourly drift.
 */
export function daysRemaining(expiryDateStr: string): number {
  const now = new Date()
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const expiry = new Date(expiryDateStr)
  const expiryMidnight = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate())

  return Math.round((expiryMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Returns trial_expires_at for a new user: 23:59:59 on the 3rd calendar
 * day from today (inclusive of today as day 1).
 * Register on Jul 1 → expires Jul 3 at 23:59:59 → blocked from Jul 4.
 */
export function trialExpiryDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 2)   // +2 because today itself is day 1
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}
