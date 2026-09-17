export type MusicToolState =
  | 'CONNECTED_CHAT_SESSION'
  | 'AVAILABLE'
  | 'LOCAL_TOOL'
  | 'OPEN_SOURCE'
  | 'GRAY'

export type MusicToolKind =
  | 'MODEL'
  | 'CHATGPT_PLUGIN'
  | 'DAW'
  | 'MUSIC_SERVICE'
  | 'AUDIO_PROCESSING'
  | 'MIDI_ENGINE'
  | 'NOTATION'
  | 'MARKET_RESEARCH'

export type MusicToolRecord = {
  id: string
  name: string
  kind: MusicToolKind
  state: MusicToolState
  capabilities: string[]
  billing: string
  verifiedCost: string
  source: string
  productionRule: string
  userVisible: boolean
  adminVisible: boolean
  developerVisible: boolean
  lastVerifiedAt: string
}

const VERIFIED_AT = '2026-09-17'

export const MUSIC_OLI_TOOLS: MusicToolRecord[] = [
  {
    id: 'openai-gpt-5-6-luna',
    name: 'OpenAI GPT-5.6 Luna',
    kind: 'MODEL',
    state: 'AVAILABLE',
    capabilities: [
      'music reasoning',
      'tool routing',
      'MIDI planning',
      'production guidance',
      'web research orchestration',
    ],
    billing: 'metered API usage',
    verifiedCost: '$0.20 per 1M input tokens; $0.02 cached input; $1.20 per 1M output tokens',
    source: 'https://developers.openai.com/api/docs/models/gpt-5.6-luna',
    productionRule: 'Use server-side only. Verify API billing entitlement and approved spend before activation.',
    userVisible: false,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'midify-chatgpt',
    name: 'Midify',
    kind: 'CHATGPT_PLUGIN',
    state: 'CONNECTED_CHAT_SESSION',
    capabilities: [
      'generate chord progressions',
      'edit harmony',
      'expand loops',
      'build MIDI arrangements',
    ],
    billing: 'ChatGPT plugin entitlement',
    verifiedCost: 'GRAY',
    source: 'Connected ChatGPT plugin state on 2026-09-17',
    productionRule: 'Connected chat access does not automatically grant reusable Bubblewrap production API credentials.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'background-music-chatgpt',
    name: 'Background Music',
    kind: 'CHATGPT_PLUGIN',
    state: 'CONNECTED_CHAT_SESSION',
    capabilities: [
      'generate instrumental reference beds',
      'audition mood and production direction',
    ],
    billing: 'ChatGPT plugin entitlement',
    verifiedCost: 'No separate plugin payment stated in the connected plugin description; production API cost remains GRAY',
    source: 'Connected ChatGPT plugin state on 2026-09-17',
    productionRule: 'Use as a creative reference lane. Do not represent chat access as a transferable production API.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'apple-music-chatgpt',
    name: 'Apple Music',
    kind: 'MUSIC_SERVICE',
    state: 'CONNECTED_CHAT_SESSION',
    capabilities: ['music discovery', 'playlist support', 'reference listening'],
    billing: 'consumer subscription; developer program is separate if app-level developer capabilities are required',
    verifiedCost: '$11.99/month Individual; Apple Developer Program $99/year',
    source: 'https://www.apple.com/apple-music/ and https://developer.apple.com/programs/',
    productionRule: 'Keep consumer listening authorization separate from MusicKit or other developer credentials.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'spotify-chatgpt',
    name: 'Spotify',
    kind: 'MUSIC_SERVICE',
    state: 'CONNECTED_CHAT_SESSION',
    capabilities: ['catalog discovery', 'playlist workflows', 'reference listening', 'market research'],
    billing: 'consumer Premium subscription; developer-mode Web API access has separate platform restrictions',
    verifiedCost: '$12.99/month Premium Individual in the US',
    source: 'https://www.spotify.com/us/premium/ and https://developer.spotify.com/documentation/web-api',
    productionRule: 'Spotify Development Mode requires the app owner to have Premium and new apps are limited to 5 users. Review quota eligibility before public-scale integration.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'moises',
    name: 'Moises',
    kind: 'AUDIO_PROCESSING',
    state: 'AVAILABLE',
    capabilities: [
      'stem separation',
      'stem generation',
      'voice conversion',
      'DAW-integrated processing',
      'practice and production analysis',
    ],
    billing: 'free tier plus paid subscription tiers',
    verifiedCost: 'Free DAW integrations include 10 separations/month, 120 stem-generation credits/month, and 5 voice conversions/month; paid pricing is account-specific and should be verified at sign-in',
    source: 'https://moises.ai/products/integrations/',
    productionRule: 'Use the existing user subscription first. Direct commercial API rights and paid tier cost remain separate verification items.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'reaper',
    name: 'REAPER',
    kind: 'DAW',
    state: 'LOCAL_TOOL',
    capabilities: ['multitrack audio', 'MIDI editing', 'mixing', 'rendering', 'DAW exchange validation'],
    billing: 'one-time license',
    verifiedCost: '$60 discounted license or $225 commercial license',
    source: 'https://www.reaper.fm/purchase.php',
    productionRule: 'Native project files remain assets. Validate real import and export workflows before claiming direct sync.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'cakewalk-sonar',
    name: 'Cakewalk Sonar',
    kind: 'DAW',
    state: 'LOCAL_TOOL',
    capabilities: ['audio recording', 'MIDI production', 'mixing', 'arrangement', 'BandLab project integration'],
    billing: 'free tier or BandLab Membership',
    verifiedCost: 'Free tier; BandLab Pro $14.99/month or $99 first year then $149/year; Max $199 first year then $299/year',
    source: 'https://www.cakewalk.com/sonar and BandLab Membership FAQ',
    productionRule: 'Cakewalk by BandLab is sunset. Use Cakewalk Sonar for current supported workflows.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'ardour',
    name: 'Ardour',
    kind: 'DAW',
    state: 'OPEN_SOURCE',
    capabilities: ['audio recording', 'MIDI', 'mixing', 'editing', 'Linux production'],
    billing: 'open source with optional subscription for official builds and updates',
    verifiedCost: '$1, $4, $10, or $50/month subscription tiers',
    source: 'https://community.ardour.org/subscribe',
    productionRule: 'Treat local DAW access separately from any cloud connector.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'audacity',
    name: 'Audacity',
    kind: 'DAW',
    state: 'OPEN_SOURCE',
    capabilities: ['audio recording', 'wave editing', 'spectrogram analysis', 'export'],
    billing: 'free and open source',
    verifiedCost: '$0',
    source: 'https://www.audacityteam.org/',
    productionRule: 'Use for local editing and analysis. Optional cloud storage and third-party plugins are separate services.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'lmms',
    name: 'LMMS',
    kind: 'DAW',
    state: 'OPEN_SOURCE',
    capabilities: ['MIDI sequencing', 'beat creation', 'synthesis', 'VST and SoundFont workflows'],
    billing: 'free and open source',
    verifiedCost: '$0',
    source: 'https://www.lmms.io/',
    productionRule: 'Use as a local production path and interchange target.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'basic-pitch',
    name: 'Basic Pitch',
    kind: 'MIDI_ENGINE',
    state: 'OPEN_SOURCE',
    capabilities: ['audio-to-MIDI candidate transcription'],
    billing: 'open-source software plus hosting or compute if deployed',
    verifiedCost: '$0 software license cost; compute cost depends on deployment',
    source: 'Spotify Basic Pitch open-source project',
    productionRule: 'Label generated notes as inferred until musician review and preserve source audio.',
    userVisible: false,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'demucs',
    name: 'Demucs',
    kind: 'AUDIO_PROCESSING',
    state: 'OPEN_SOURCE',
    capabilities: ['local stem-separation processing candidate'],
    billing: 'open-source software plus hosting or compute if deployed',
    verifiedCost: '$0 software license cost; compute cost depends on deployment',
    source: 'Demucs open-source project',
    productionRule: 'Heavy processing belongs in a suitable worker environment, not an unbounded web request.',
    userVisible: false,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
  {
    id: 'web-midi',
    name: 'Web MIDI API',
    kind: 'MIDI_ENGINE',
    state: 'AVAILABLE',
    capabilities: ['browser MIDI device input and output when supported and permissioned'],
    billing: 'browser capability',
    verifiedCost: '$0',
    source: 'browser Web MIDI implementation',
    productionRule: 'Require secure context, explicit device permission, support checks, and graceful fallback.',
    userVisible: true,
    adminVisible: true,
    developerVisible: true,
    lastVerifiedAt: VERIFIED_AT,
  },
]

export function listMusicOliTools() {
  return MUSIC_OLI_TOOLS
}

export function listMusicOliCustomerTools() {
  return MUSIC_OLI_TOOLS.filter((tool) => tool.userVisible)
}

export function listMusicOliAdminTools() {
  return MUSIC_OLI_TOOLS.filter((tool) => tool.adminVisible)
}

export function listMusicOliDeveloperTools() {
  return MUSIC_OLI_TOOLS.filter((tool) => tool.developerVisible)
}
