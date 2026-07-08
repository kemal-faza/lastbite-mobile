// Mock react-native for component tests
jest.mock('react-native', () => {
  const Animated = {
    View: 'Animated.View',
    Value: jest.fn(() => ({
      interpolate: jest.fn(),
      setValue: jest.fn(),
    })),
    timing: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
    loop: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
    sequence: jest.fn(() => ({ start: jest.fn(), stop: jest.fn() })),
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
    },
    Platform: { OS: 'ios', select: jest.fn((obj) => obj.ios) },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
    },
    ActivityIndicator: 'ActivityIndicator',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    TouchableOpacity: 'TouchableOpacity',
    Modal: 'Modal',
    processColor: jest.fn((color) => color),
  };
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));
