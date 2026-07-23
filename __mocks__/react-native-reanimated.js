// Manual mock for react-native-reanimated (v4 uses ESM that Jest on Node < 24.9 can't load)
const AnimatedMock = {
  View: 'Animated.View',
  createAnimatedComponent: (Component) => Component,
};

module.exports = {
  __esModule: true,
  default: AnimatedMock,
  useSharedValue: (init) => ({ value: init }),
  useAnimatedStyle: (cb) => cb(),
  withSpring: (val) => val,
  withTiming: (val, _config) => val,
  withSequence: (...vals) => vals[vals.length - 1],
};
