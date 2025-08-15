export const profileConfig = {
  type: 'discord' as 'static' | 'discord',

  staticImagePath: '/profile.png',

  discord: {
    userId: '150471906536062976',
    apiEndpoint: 'https://discord-presence-api.johnrich.dev',
    showStatus: true,
    connectionMode: 'websocket' as 'websocket' | 'polling',
    pollingInterval: 30000
  }
};