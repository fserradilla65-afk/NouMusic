const { version, versionCode } = require('./package.json')

const intentFilters = [
  {
    autoVerify: false,
    action: 'VIEW',
    data: ['music.youtube.com'].map((host) => ({
      scheme: 'https',
      host,
    })),
    category: ['BROWSABLE', 'DEFAULT'],
  },
]

module.exports = ({ config }) => {
  return {
    ...config,
    name: 'NouMusic',
    slug: 'noumusic',
    version,
    icon: './assets/images/sandia.png',
    scheme: 'noumusic',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'jp.nonbili.noumusic',
    },
    android: {
      versionCode,
      permissions: [
        'RECORD_AUDIO',
        'MODIFY_AUDIO_SETTINGS',
        'CAMERA',
        'FOREGROUND_SERVICE',
        'FOREGROUND_SERVICE_MEDIA_PLAYBACK',
        'BLUETOOTH',
        'BLUETOOTH_CONNECT',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
      ],
      adaptiveIcon: {
        foregroundImage: './assets/images/sandia.png',
        monochromeImage: './assets/images/monochrome-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'jp.nonbili.noumusic',
      intentFilters,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      './plugins/withAndroidPlugin.js',
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/sandia.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#f9fafb',
          dark: {
            image: './assets/images/sandia.png',
            backgroundColor: '#27272a',
          },
        },
      ],
      'expo-asset',
      'expo-font',
      [
        'expo-localization',
        {
          // Usamos 'pt' en lugar de 'pt-BR' para evitar el error de AAPT
          supportedLocales: ['en', 'de', 'es', 'fr', 'id', 'pt', 'ru', 'zh'],
        },
      ],
      'expo-share-intent',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
    },
  }
}
