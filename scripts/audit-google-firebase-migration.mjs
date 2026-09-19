const required = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'NEXT_PUBLIC_STRIPE_PRICE_CORE',
  'NEXT_PUBLIC_STRIPE_PRICE_PLUS',
  'NEXT_PUBLIC_STRIPE_PRICE_PERSONAL',
  'NEXT_PUBLIC_STRIPE_PRICE_BIRTH_CHART',
  'NEXT_PUBLIC_STRIPE_PRICE_PERSONAL_READING',
]

const optional = [
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_STRIPE_PRICE_CUSTOM_DECK',
  'DATABASE_URL',
]

const expectedProject = 'synchpathways-30f11'
const present = (name) => Boolean(process.env[name]?.trim())

console.log('Lunara Google/Firebase migration readiness')
console.log('Target Firebase project:', expectedProject)
console.log('')

let failed = false
for (const name of required) {
  const ok = present(name)
  console.log(`${ok ? 'OK ' : 'MISS'} ${name}`)
  if (!ok) failed = true
}

for (const name of optional) {
  console.log(`${present(name) ? 'OK ' : 'INFO'} ${name}`)
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
if (projectId && projectId !== expectedProject) {
  failed = true
  console.log('')
  console.log(`MISMATCH NEXT_PUBLIC_FIREBASE_PROJECT_ID=${projectId}; expected ${expectedProject}`)
}

console.log('')
console.log(
  failed
    ? 'BLOCKED: migration configuration is incomplete. Production cutover must remain off.'
    : 'CONFIG READY: values are present. This does not replace end-to-end auth/billing verification.',
)

process.exitCode = failed ? 1 : 0
