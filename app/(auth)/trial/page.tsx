import { redirect } from 'next/navigation'

// Trial info is now shown inline on the register page (step 2).
// Direct navigation here goes to setup-business.
export default function TrialPage() {
  redirect('/setup-business')
}
