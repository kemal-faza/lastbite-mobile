// Mock react-native for all tests - prevents Flow syntax parsing errors in bun
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
