// Read Google Maps API key from .env (loaded automatically by Expo)
// Supports multiple var names for flexibility
const GOOGLE_MAPS_API_KEY =
  process.env.GOOGLE_MAPS_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '').replace(/^["']|["']$/g, '');

module.exports = {
  expo: {
    name: 'LastBite',
    slug: 'lastbite-mobile',
    scheme: 'lastbite',
    plugins: [
      'expo-router',
      'expo-dev-client',
      'expo-image',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'LastBite menggunakan lokasi untuk menampilkan produk Makanan Surplus terdekat.',
        },
      ],
    ],
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#e4dcca',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.lastbite.mobile',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#11676a',
      },
      package: 'com.lastbite.mobile',
      permissions: [
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
      ],
      config: {
        googleMaps: {
          apiKey: GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: 'metro',
      favicon: './assets/favicon.png',
    },
  },
};
