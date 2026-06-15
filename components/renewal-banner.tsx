interface RenewalBannerProps {
  expiresAt: Date
}

export function RenewalBanner({ expiresAt }: RenewalBannerProps) {
  const msRemaining = expiresAt.getTime() - Date.now()
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))

  if (daysRemaining > 7) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-800">
      {daysRemaining <= 0 ? (
        'Your subscription has expired.'
      ) : (
        <>
          {daysRemaining} day{daysRemaining === 1 ? '' : 's'} left to renew.
        </>
      )}{' '}
      <a href="/payment" className="font-semibold underline underline-offset-2">
        Subscribe for ₹149
      </a>
    </div>
  )
}
