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

  return {
    View: 'View',
    Text: 'Text',
    Image: 'Image',
    Pressable: 'Pressable',
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
    TextInput: 'TextInput',
    TouchableOpacity: 'TouchableOpacity',
    Modal: 'Modal',
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

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  MaterialIcons: 'MaterialIcons',
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
