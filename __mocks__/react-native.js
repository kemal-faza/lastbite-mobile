// Mock react-native for all tests - prevents Flow syntax parsing errors in bun
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

module.exports = {
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
  FlatList: 'FlatList',
  TextInput: 'TextInput',
  TouchableOpacity: 'TouchableOpacity',
  Modal: 'Modal',
  BackHandler: {
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  AppState: {
    currentState: 'active',
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  },
  processColor: jest.fn((color) => color),
};
