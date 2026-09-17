import { LegalPage } from '@/components/legal-page'

export const metadata = { title: 'Subscription Terms — Lunara' }

export default function SubscriptionTermsPage() {
  return (
    <LegalPage eyebrow="Lunara billing" title="Subscription Terms" updated="September 17, 2026">
      <p>
        These Subscription Terms apply to recurring Lunara memberships and supplement the Terms of
        Use and Privacy Notice. The price, plan benefits, billing frequency, and any trial or
        promotional terms shown immediately before purchase are part of your subscription agreement.
      </p>

      <h2>1. Automatic renewal</h2>
      <p>
        Paid Lunara memberships are recurring monthly subscriptions unless the purchase screen says
        otherwise. By subscribing, you authorize the applicable payment provider to charge the
        displayed subscription price, plus applicable taxes, at the start of each billing period
        until you cancel.
      </p>

      <h2>2. Clear price and plan terms</h2>
      <p>
        The current price and billing interval are displayed before checkout. A subscription is not
        required to use the Free plan where that plan is available. Paid tiers provide the recurring
        features shown on the pricing page and are designed to remain ad-free while the paid
        entitlement is active.
      </p>

      <h2>3. Cancellation</h2>
      <p>
        You may cancel future renewal through the Lunara account billing controls or through the app
        store that processed the subscription, as applicable. Cancellation does not normally end
        access immediately; unless applicable law or platform rules provide otherwise, paid access
        continues through the end of the current paid billing period and the account then returns to
        the available Free tier.
      </p>

      <h2>4. Refunds</h2>
      <p>
        Subscription charges and partially used billing periods are generally non-refundable to the
        extent permitted by law. Refund rights provided by applicable consumer law or the billing
        platform remain available. Purchases made through Apple or Google may be subject to their
        refund processes and policies.
      </p>

      <h2>5. Price changes</h2>
      <p>
        Subscription prices may change. Where required, notice will be provided before a new price
        applies and any additional consent required by law or an app-store platform will be obtained.
        If you do not agree to a future price change, you may cancel before the new price takes effect.
      </p>

      <h2>6. Failed payments</h2>
      <p>
        If a renewal payment fails, the payment provider may retry the charge, provide a grace period,
        place the subscription on hold, or cancel it according to its rules. Access may be limited
        after applicable grace or recovery periods end.
      </p>

      <h2>7. Trials and promotions</h2>
      <p>
        If Lunara offers a free or discounted trial, the purchase screen will state the trial period,
        the price that follows, and when billing begins. Unless the offer specifically says otherwise,
        a trial converts to the disclosed paid subscription if it is not canceled before the trial
        ends.
      </p>

      <h2>8. Platform billing</h2>
      <p>
        Web subscriptions may be processed by Stripe. Native mobile subscriptions may be processed by
        Apple App Store or Google Play where required. The billing platform&apos;s transaction,
        cancellation, refund, and payment-method rules may also apply.
      </p>

      <h2>9. No forced ratings or reviews</h2>
      <p>
        Access, rewards, refunds, support, or subscription benefits are never conditioned on leaving a
        positive rating or public review. Feedback to Lunara is separate from optional app-store review
        requests.
      </p>

      <h2>10. Contact</h2>
      <p>
        Billing questions may be sent to lovealways@allpathproperties.com. Your account billing page
        should remain the primary place to view your current plan and access cancellation controls.
      </p>
    </LegalPage>
  )
}
