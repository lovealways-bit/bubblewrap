import { LegalPage, H2, LEGAL_CONTACT_EMAIL } from '@/components/legal-page'

export const metadata = { title: 'Refund Policy | Lunara' }

export default function Page() {
  return (
    <LegalPage title="Refund Policy" updated="October 4, 2026">
        <p>
          Full refund if requested within 30 days of a charge. Canceling stops the next charge.
        </p>
        <H2>How to request a refund</H2>
        <p>
          Email{' '}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="underline underline-offset-2">
            {LEGAL_CONTACT_EMAIL}
          </a>{' '}
          from the email address on your account within 30 days of the charge. Include the date and
          amount of the charge. Refunds go back to the original payment method.
        </p>
        <H2>Canceling a monthly plan</H2>
        <p>
          You can cancel at any time. Canceling stops the next charge. If you also want a refund
          for a charge made in the last 30 days, email us as described above.
        </p>
        <H2>Contact</H2>
        <p>AllPath, Columbus, Ohio.</p>
    </LegalPage>
  )
}
