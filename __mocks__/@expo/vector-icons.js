// Manual mock for @expo/vector-icons — renders icon names as text
const React = require('react');

function MockIcon(props) {
  return React.createElement('Text', { testID: props.testID || 'mock-icon' }, props.name);
}

module.exports = {
  MaterialCommunityIcons: MockIcon,
  MaterialIcons: MockIcon,
};
