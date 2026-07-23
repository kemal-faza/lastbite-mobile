import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';

// @rn-primitives/slot uses JSX syntax that Jest can't parse
jest.mock('@rn-primitives/slot', () => ({
  Slot: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

/** Helper: cast toJSON result for tree navigation */
function getTree(renderResult: Awaited<ReturnType<typeof render>>) {
  return renderResult.toJSON() as Record<string, any> | null;
}

describe('Button', () => {
  describe('plain variant', () => {
    it('renders children directly without wrapper View', async () => {
      const result = await render(
        <Button variant="plain" className="flex-row p-4">
          <Text>Label</Text>
        </Button>
      );

      const tree = getTree(result);
      if (!tree || !tree.children) {
        throw new Error('Tree is empty');
      }

      // Structure: Pressable > Animated.View > children
      const pressable = tree;
      const animatedView: any = pressable.children[0];
      if (!animatedView || !animatedView.children) {
        throw new Error('Animated.View is empty');
      }

      // Before fix: first child of Animated.View is 'View' (wrapper)
      // After fix: first child is 'Text' (direct child)
      const firstChild: any = animatedView.children[0];
      expect(firstChild?.type).toBe('Text');
    });

    it('passes className to inner Animated.View (not outer Pressable)', async () => {
      const result = await render(
        <Button variant="plain" className="flex-row p-4">
          <Text>Test</Text>
        </Button>
      );

      const tree = getTree(result);
      if (!tree || !tree.children) {
        throw new Error('Tree is empty');
      }

      // Outer Pressable should NOT have className (avoids visual duplication)
      expect(tree.props).not.toHaveProperty('className');

      // Inner Animated.View should have the className for both styling + layout
      const animatedView: any = tree.children[0];
      expect(animatedView?.props?.className).toContain('flex-row');
      expect(animatedView?.props?.className).toContain('p-4');
    });

    it('passes className to inner Animated.View for layout cascade', async () => {
      const result = await render(
        <Button variant="plain" className="flex-row items-center gap-2">
          <Text>Icon</Text>
          <Text>Label</Text>
        </Button>
      );

      const tree = getTree(result);
      if (!tree || !tree.children) {
        throw new Error('Tree is empty');
      }

      // Structure: Pressable > Animated.View > children
      const animatedView: any = tree.children[0];

      // Animated.View should receive the flex layout className
      expect(animatedView?.props?.className).toContain('flex-row');
      expect(animatedView?.props?.className).toContain('items-center');
      expect(animatedView?.props?.className).toContain('gap-2');
    });

    it('preserves onPress callback', async () => {
      const onPress = jest.fn();
      const { getByTestId } = await render(
        <Button variant="plain" className="flex-row p-4" testID="btn" onPress={onPress}>
          <Text>Press Me</Text>
        </Button>
      );

      fireEvent.press(getByTestId('btn'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('default variant', () => {
    it('renders children', async () => {
      const { getByText } = await render(
        <Button variant="default">
          <Text>Default Button</Text>
        </Button>
      );
      expect(getByText('Default Button')).toBeTruthy();
    });
  });

  describe('icon size', () => {
    it('renders with icon size', async () => {
      const result = await render(
        <Button variant="plain" size="icon">
          <Text>*</Text>
        </Button>
      );

      const tree = getTree(result);
      if (!tree) throw new Error('Tree is empty');

      expect(tree).toBeTruthy();
    });
  });
});
