// Mock react-native for component tests
jest.mock('react-native', () => {
  const React = require('react');

  const Animated = {
    View: 'Animated.View',
    Value: jest.fn(() => ({
      interpolate: jest.fn(),
      setValue: jest.fn(),
    })),
    timing: jest.fn(() => ({ start: jest.fn((cb) => cb?.()), stop: jest.fn() })),
    parallel: jest.fn(() => ({ start: jest.fn((cb) => cb?.()), stop: jest.fn() })),
    loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
    sequence: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
  };

  // Functional FlatList that renders data items or ListEmptyComponent
  // Required so RNTL tests can verify rendered list content
  const FlatList = (props) => {
    const data = props.data || [];
    const children = data.length > 0
      ? data.map((item, index) => {
          const key = props.keyExtractor?.(item, index) ?? String(index);
          const rendered = props.renderItem?.({ item, index, separators: { highlight: () => {}, unhighlight: () => {}, updateProps: () => {} } });
          return React.createElement('View', { key }, rendered);
        })
      : (typeof props.ListEmptyComponent === 'function'
          ? React.createElement(props.ListEmptyComponent, props.ListEmptyComponent.props || {})
          : props.ListEmptyComponent || null);
    return React.createElement('View', null, children);
  };

  // Functional TextInput that supports fireEvent.changeText / onChangeText
  // Required so RNTL tests can programmatically trigger text changes
  const TextInput = (props) => {
    return React.createElement('TextInput', props);
  };

  return {
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    Pressable: 'Pressable',
    Alert: {
      alert: jest.fn(),
    },
    Animated,
    StyleSheet: {
      create: jest.fn((styles) => styles),
      flatten: jest.fn(),
      absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
    },
    Platform: { OS: 'ios', select: jest.fn((obj) => obj.ios) },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    ActivityIndicator: 'ActivityIndicator',
    ScrollView: 'ScrollView',
    FlatList,
    TextInput,
    TouchableOpacity: 'TouchableOpacity',
    Modal: 'Modal',
    KeyboardAvoidingView: 'KeyboardAvoidingView',
    RefreshControl: 'RefreshControl',
    BackHandler: {
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    AppState: {
      currentState: 'active',
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    processColor: jest.fn((color) => color),
  };
});

// Mock lottie-react-native — native module, needs stub for tests
jest.mock('lottie-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) =>
      React.createElement(View, { testID: props.testID || 'lottie-view', ...props }),
  };
});

// Mock @expo/vector-icons — uses manual mock in __mocks__/@expo/vector-icons.js
jest.mock('@expo/vector-icons');

// Mock AsyncStorage used by API client
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 1, High: 2, Low: 0 },
}));

// Mock react-native-maps
jest.mock('react-native-maps', () => {
  const MockMapView = jest.fn(function MockMapView(props) {
    // Render the children directly for testing
    return props.children || null;
  });
  return {
    __esModule: true,
    default: MockMapView,
    MapView: MockMapView,
    Marker: jest.fn(function MockMarker(props) {
      return props.children || null;
    }),
    Region: {},
    PROVIDER_GOOGLE: 'google',
  };
});

// Polyfill global.alert for components that use it directly (not Alert.alert)
global.alert = jest.fn();

// Mock expo-router segments + navigation (additive to any existing expo-router mock)
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useSegments: jest.fn(() => []),
  useRootNavigationState: jest.fn(() => ({ key: 'test' })),
  useLocalSearchParams: jest.fn(() => ({})),
  useRouter: jest.fn(() => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() })),
  Stack: { Screen: () => null },
  Tabs: { Screen: () => null },
  Drawer: { Screen: () => null },
  Redirect: () => null,
  Link: () => null,
}));

// Mock react-native-gesture-handler for testing components using Swipeable
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Swipeable: ({ children, renderRightActions }) => {
      return React.createElement(View, null,
        renderRightActions ? renderRightActions() : null,
        children
      );
    },
    GestureHandlerRootView: ({ children }) => children,
  };
});

