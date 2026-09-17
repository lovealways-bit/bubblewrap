export type MusicPluginPermissionRecord = {
  plugin: 'Midify' | 'Background Music' | 'Apple Music' | 'Spotify'
  connected: true
  appPermission: 'Use my default'
  effectiveDefault: 'Allow low-risk actions'
  note: string
  verifiedAt: string
}

const VERIFIED_AT = '2026-09-17'

export const MUSIC_PLUGIN_PERMISSIONS: MusicPluginPermissionRecord[] = [
  {
    plugin: 'Midify',
    connected: true,
    appPermission: 'Use my default',
    effectiveDefault: 'Allow low-risk actions',
    note: 'ChatGPT automatically approves low-risk actions under the current default. This does not grant Bubblewrap production credentials.',
    verifiedAt: VERIFIED_AT,
  },
  {
    plugin: 'Background Music',
    connected: true,
    appPermission: 'Use my default',
    effectiveDefault: 'Allow low-risk actions',
    note: 'ChatGPT automatically approves low-risk actions under the current default. This does not grant Bubblewrap production credentials.',
    verifiedAt: VERIFIED_AT,
  },
  {
    plugin: 'Apple Music',
    connected: true,
    appPermission: 'Use my default',
    effectiveDefault: 'Allow low-risk actions',
    note: 'ChatGPT automatically approves low-risk actions under the current default. Consumer account access remains separate from MusicKit or developer credentials.',
    verifiedAt: VERIFIED_AT,
  },
  {
    plugin: 'Spotify',
    connected: true,
    appPermission: 'Use my default',
    effectiveDefault: 'Allow low-risk actions',
    note: 'ChatGPT automatically approves low-risk actions under the current default. Consumer account access remains separate from Spotify developer credentials and quota mode.',
    verifiedAt: VERIFIED_AT,
  },
]
