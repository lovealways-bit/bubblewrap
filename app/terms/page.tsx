// DRAFT: plain-language Terms of Service. Needs attorney review before being treated as final.
import Link from 'next/link'
import { LegalPage, H2, LEGAL_CONTACT_EMAIL } from '@/components/legal-page'

export const metadata = { title: 'Terms of Service | Lunara' }

export default function Page() {
  return (
    <LegalPage title="Terms of Service" updated="October 4, 2026">
        <p>
          These terms cover your use of Lunara, a service run by AllPath, based in Columbus,
          Ohio. By creating an account or making a purchase you agree to these terms.
        </p>
        <H2>Your account</H2>
        <p>
          Keep your sign-in details private and tell us if you think someone else is using your
          account. You are responsible for activity on your account.
        </p>
        <H2>Purchases and subscriptions</H2>
        <p>
          Prices are shown before you pay. Payments are processed by Stripe. Monthly plans renew
          automatically every month at the price shown until you cancel. Canceling stops the next
          charge. One-time purchases are charged once and are not subscriptions.
        </p>
        <p>
          Refunds follow our <Link href="/refund" className="underline underline-offset-2">Refund policy</Link>.
        </p>
        <H2>Acceptable use</H2>
        <p>
          Do not misuse the service, try to break or overload it, access other people&apos;s
          accounts, or use it for anything unlawful.
        </p>
        <H2>Content and availability</H2>
        <p>
          We work to keep the service available and accurate, but it is provided as is. Features
          may change over time. We may suspend accounts that break these terms.
        </p>
        <H2>Changes</H2>
        <p>
          We may update these terms. If a change is significant we will let you know before it
          takes effect.
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
