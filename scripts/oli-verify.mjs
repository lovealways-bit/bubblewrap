import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const required = [
  'commander/MANUSCRIPT.md',
  'commander/OLI_APP_REGISTRY.json',
  'commander/OLI_CAPABILITIES.json',
  'lib/oli/registry.ts',
  'lib/oli/system-prompt.ts',
  'lib/oli/command-router.ts',
  'app/api/oli/context/route.ts',
  'app/api/oli/health/route.ts',
  'app/api/oli/command/route.ts',
  'components/oli/oli-commander-dock.tsx',
  'app/oli/page.tsx',
]

const missing = required.filter((relative) => !fs.existsSync(path.join(root, relative)))
if (missing.length) {
  console.error('Oli verification failed. Missing required files:')
  for (const file of missing) console.error(`- ${file}`)
  process.exit(1)
}

const apps = JSON.parse(fs.readFileSync(path.join(root, 'commander/OLI_APP_REGISTRY.json'), 'utf8'))
const capabilities = JSON.parse(fs.readFileSync(path.join(root, 'commander/OLI_CAPABILITIES.json'), 'utf8'))

const validStates = new Set(['LIVE', 'READY', 'PLANNED', 'BLOCKED', 'GRAY'])
const invalidCapabilities = capabilities.capabilities.filter((item) => !validStates.has(item.state))

if (invalidCapabilities.length) {
  console.error('Oli verification failed. Invalid capability states:')
  for (const item of invalidCapabilities) console.error(`- ${item.id}: ${item.state}`)
  process.exit(1)
}

const repoNames = new Set(apps.github.repositories.map((repo) => repo.fullName))
const linkedUnknownRepos = apps.vercel.projects
  .filter((project) => project.repo && !repoNames.has(project.repo))
  .map((project) => `${project.name} -> ${project.repo}`)

if (linkedUnknownRepos.length) {
  console.error('Oli verification failed. Vercel projects reference repositories absent from the verified GitHub snapshot:')
  for (const item of linkedUnknownRepos) console.error(`- ${item}`)
  process.exit(1)
}

if (apps.github.observedRepositoryCount !== apps.github.repositories.length) {
  console.error('Oli verification failed. observedRepositoryCount does not match repositories.length')
  process.exit(1)
}

if (apps.vercel.observedProjectCount !== apps.vercel.projects.length) {
  console.error('Oli verification failed. observedProjectCount does not match projects.length')
  process.exit(1)
}

console.log(
  JSON.stringify(
    {
      ok: true,
      verifiedSnapshot: apps.verifiedAt,
      repositories: apps.github.repositories.length,
      deploymentProjects: apps.vercel.projects.length,
      capabilities: capabilities.capabilities.length,
      states: capabilities.capabilities.reduce((acc, item) => {
        acc[item.state] = (acc[item.state] || 0) + 1
        return acc
      }, {}),
    },
    null,
    2,
  ),
)
