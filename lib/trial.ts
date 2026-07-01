/**
 * Calendar-day difference between today's midnight and the expiry midnight.
 *
 * Register Jul 1 → expiry stored as Jul 4 00:00:00
 *   Jul 1 → 3   ("3 days left")
 *   Jul 2 → 2   ("2 days left")
 *   Jul 3 → 1   ("expiring tonight")
 *   Jul 4 → 0   (BLOCKED)
 */
export function daysRemaining(expiryDateStr: string): number {
  const now = new Date()
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const expiry = new Date(expiryDateStr)
  const expiryMidnight = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate())

  return Math.round((expiryMidnight.getTime() - todayMidnight.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Sets trial_expires_at to midnight that starts the 4th day (= end of 3rd day).
 * Register Jul 1 → Jul 4 00:00:00 → user is blocked when they open on Jul 4.
 */
export function trialExpiryDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 3)  // 3 full days ahead
  d.setHours(0, 0, 0, 0)      // midnight — start of that day
  return d.toISOString()
}
