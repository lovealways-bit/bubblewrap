// DRAFT: plain-language Privacy Policy. Needs attorney review before being treated as final.
import { LegalPage, H2, LEGAL_CONTACT_EMAIL } from '@/components/legal-page'

export const metadata = { title: 'Privacy Policy | Lunara' }

export default function Page() {
  return (
    <LegalPage title="Privacy Policy" updated="October 4, 2026">
        <p>
          This policy explains what information AllPath (Columbus, Ohio) collects when you use
          Lunara and how we use it.
        </p>
        <H2>What we collect</H2>
        <p>
          Account details you give us, such as your name and email address, the content you create
          in the app, and basic technical data such as device and usage logs.
        </p>
        <H2>Payments</H2>
        <p>
          Payments are handled by Stripe. We do not see or store your full card number. We keep a
          record of your plan, purchases, and billing status.
        </p>
        <H2>How we use it</H2>
        <p>
          To run and improve the service, provide what you paid for, keep accounts secure, and
          contact you about your account or purchases. We do not sell your personal information.
        </p>
        <H2>Who we share it with</H2>
        <p>
          Service providers that help us run the app, such as hosting, database, and payment
          processing, and only as needed to provide the service or when required by law.
        </p>
        <H2>Your choices</H2>
        <p>
          You can ask us to access, correct, or delete your information by emailing us. You can
          cancel your plan at any time.
        </p>
        <H2>Contact</H2>
        <p>
          AllPath, Columbus, Ohio. Email{' '}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="underline underline-offset-2">
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
    </LegalPage>
  )
}
