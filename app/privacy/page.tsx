import { LegalPage } from '@/components/legal-page'

export const metadata = { title: 'Privacy Notice — Lunara' }

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Lunara legal" title="Privacy Notice" updated="September 17, 2026">
      <p>
        This Privacy Notice explains how Lunara collects, uses, shares, stores, and protects personal
        information when you use the website, app, subscriptions, readings, Oli assistant, feedback
        tools, and related services.
      </p>

      <h2>1. Information we collect</h2>
      <p>
        Depending on how you use Lunara, we may collect account details such as name and email;
        authentication and device information; subscription and entitlement status; transaction
        references from payment providers; reading history and saved preferences; optional birth
        information you choose to provide for personalized features; feedback and support messages;
        consent choices; app usage and diagnostic information; and information you submit to Oli.
      </p>

      <h2>2. Sensitive and personal reading data</h2>
      <p>
        Birth time, birth location, private reading questions, relationship information, personal
        notes, and conversation content can be sensitive in context. Lunara does not use these
        categories for third-party advertising targeting. We minimize their use to the feature you
        requested, account support, safety, and other purposes described here.
      </p>

      <h2>3. How we use information</h2>
      <p>
        We use information to provide and personalize Lunara; authenticate accounts; save readings;
        process purchases and subscriptions; provide customer support; operate Oli and web research;
        detect abuse and security threats; measure and improve service performance when permitted;
        maintain legal and financial records; send communications you request or consent to; and
        comply with applicable law.
      </p>

      <h2>4. Payments</h2>
      <p>
        Payment card information is processed by payment providers such as Stripe or the applicable
        app store. Lunara generally receives transaction identifiers, status, product, customer, and
        subscription information rather than full payment-card numbers. Payment providers process
        information under their own privacy terms.
      </p>

      <h2>5. Advertising</h2>
      <p>
        The Free plan may display advertising through providers such as Google AdSense. Paid Lunara
        plans are designed to be ad-free. Advertising providers may process device, browser, network,
        consent, and advertising identifiers according to applicable law and your choices. Lunara
        does not send private birth data, private reading content, relationship questions, or Oli
        conversation text to advertising providers for ad targeting. We do not sell personal
        information for money. Certain advertising technologies may be considered “sharing,”
        targeted advertising, or a sale under some privacy laws; where applicable, Lunara will
        provide required notices and choices.
      </p>

      <h2>6. Oli, AI, and web research</h2>
      <p>
        When you use Oli, the text needed to answer your request may be sent to an AI service
        provider. If a question requires current external information, Oli may use a web-search tool,
        which can send a search query derived from your request to obtain public sources. We design
        Oli to avoid placing unnecessary private profile details into web searches. Do not submit
        secrets or information you do not want processed for the requested feature.
      </p>

      <h2>7. Analytics and consent</h2>
      <p>
        Lunara may use analytics to understand feature usage, reliability, and performance. Where
        consent is required, analytics and personalized advertising are conditioned on that consent.
        Account-level personalization, analytics, and marketing choices may be separated so that
        declining optional processing does not block basic service access.
      </p>

      <h2>8. Service providers and disclosures</h2>
      <p>
        We may disclose information to vendors that help provide hosting, databases, authentication,
        payments, AI, analytics, advertising, communications, security, and app distribution. We may
        also disclose information when reasonably necessary to comply with law, protect rights and
        safety, investigate fraud or abuse, complete a business transaction subject to appropriate
        safeguards, or with your direction or consent.
      </p>

      <h2>9. Retention</h2>
      <p>
        We retain information for as long as reasonably needed to provide the service, maintain
        account and transaction records, resolve disputes, enforce agreements, meet legal or tax
        obligations, prevent fraud, and support legitimate operational needs. Retention periods vary
        by data type. Data may be deleted or de-identified when no longer needed, subject to backup
        cycles and legal requirements.
      </p>

      <h2>10. Security</h2>
      <p>
        We use reasonable administrative, technical, and organizational safeguards appropriate to
        the nature of the service. No method of transmission or storage is completely secure, and we
        cannot guarantee absolute security. Please use a unique password and report suspected account
        compromise promptly.
      </p>

      <h2>11. Your privacy choices and rights</h2>
      <p>
        Depending on where you live and which laws apply, you may have rights to access, correct,
        delete, obtain a copy of, or restrict certain uses of personal information; opt out of
        targeted advertising or certain sharing; withdraw consent; or appeal a privacy decision.
        Some information may be retained where legally permitted or required. Requests may require
        identity verification.
      </p>

      <h2>12. Children</h2>
      <p>
        Lunara is not directed to children under 13 and paid services are intended for adults or
        users lawfully authorized by a parent or guardian. We do not knowingly collect personal
        information from children under 13 without legally sufficient authorization. If you believe
        a child has provided information improperly, contact us so it can be reviewed.
      </p>

      <h2>13. International use</h2>
      <p>
        Lunara may process information in the United States and other locations where service
        providers operate. Where required, appropriate legal mechanisms and safeguards should be used
        for international transfers.
      </p>

      <h2>14. Changes to this Notice</h2>
      <p>
        We may update this Notice as the product, providers, or legal requirements change. Material
        changes will be communicated through the app, website, email, or another appropriate method.
      </p>

      <h2>15. Contact</h2>
      <p>
        Privacy questions or requests may be sent to lovealways@allpathproperties.com. Before broad
        commercial launch, the operator should confirm jurisdiction-specific privacy notices,
        consumer-request procedures, and data-processing agreements with qualified counsel.
      </p>
    </LegalPage>
  )
}
