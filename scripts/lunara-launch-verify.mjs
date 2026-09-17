import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const failures = []
const warnings = []

function read(file) {
  const target = path.join(root, file)
  if (!fs.existsSync(target)) {
    failures.push(`Missing ${file}`)
    return ''
  }
  return fs.readFileSync(target, 'utf8')
}

function requireContains(file, needle, label = needle) {
  const text = read(file)
  if (!text.includes(needle)) failures.push(`${file} missing ${label}`)
}

function requireFile(file) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing ${file}`)
}

const requiredFiles = [
  'app/terms/page.tsx',
  'app/privacy/page.tsx',
  'app/subscription-terms/page.tsx',
  'app/api/oli/route.ts',
  'app/api/feedback/route.ts',
  'components/oli-assistant.tsx',
  'components/adsense-slot.tsx',
  'lib/oli.ts',
  'lib/legal.ts',
  'public/ads.txt',
  'V0_LUNARA_FINAL_LAUNCH_README.md',
]

requiredFiles.forEach(requireFile)

requireContains('app/layout.tsx', "'google-adsense-account': 'ca-pub-4805370280965046'", 'AdSense meta verification')
requireContains('app/layout.tsx', '<OliAssistant />', 'global Oli mount')
requireContains('public/ads.txt', 'google.com, pub-4805370280965046, DIRECT, f08c47fec0942fa0', 'authorized seller line')
requireContains('lib/subscription/entitlements.ts', 'return tier ? tier.adsEnabled : true', 'server-derived ad entitlement')
requireContains('app/actions/subscription.ts', 'recordLegalAcceptance', 'versioned legal acceptance')
requireContains('app/actions/subscription.ts', 'legalAccepted', 'checkout legal guard')
requireContains('app/api/oli/route.ts', "type: 'web_search'", 'current OpenAI web_search tool')
requireContains('lib/oli.ts', "'gpt-5.6-luna'", 'cost-sensitive Oli default model')
requireContains('components/pricing-cards.tsx', 'renew monthly', 'auto-renewal disclosure')
requireContains('components/offer-checkout-card.tsx', 'one-time digital service', 'one-time service disclosure')

const envExample = read('.env.example')
for (const envName of [
  'OPENAI_API_KEY=',
  'OPENAI_OLI_MODEL=gpt-5.6-luna',
  'NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4805370280965046',
  'NEXT_PUBLIC_ADSENSE_FREE_FEED_SLOT=',
  'NEXT_PUBLIC_ADSENSE_FREE_BANNER_SLOT=',
  'NEXT_PUBLIC_APP_STORE_URL=',
  'NEXT_PUBLIC_PLAY_STORE_URL=',
]) {
  if (!envExample.includes(envName)) failures.push(`.env.example missing ${envName}`)
}

if (!process.env.OPENAI_API_KEY) warnings.push('OPENAI_API_KEY is not set in this shell. Oli API will return 503 until configured in Vercel.')
if (!process.env.NEXT_PUBLIC_ADSENSE_FREE_FEED_SLOT) warnings.push('AdSense feed slot is intentionally pending Google ad-unit creation.')
if (!process.env.NEXT_PUBLIC_ADSENSE_FREE_BANNER_SLOT) warnings.push('AdSense banner slot is intentionally pending Google ad-unit creation.')
if (!process.env.NEXT_PUBLIC_APP_STORE_URL && !process.env.NEXT_PUBLIC_PLAY_STORE_URL) warnings.push('Native store review links are intentionally hidden until real listings exist.')

if (warnings.length) {
  console.log('\nLunara launch warnings:')
  for (const warning of warnings) console.log(`  ⚠ ${warning}`)
}

if (failures.length) {
  console.error('\nLunara launch verification FAILED:')
  for (const failure of failures) console.error(`  ✖ ${failure}`)
  process.exit(1)
}

console.log('\n✓ Lunara launch structure verified.')
console.log('Next: run the production build and manually test the checklist in V0_LUNARA_FINAL_LAUNCH_README.md.')
