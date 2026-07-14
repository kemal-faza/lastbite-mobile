import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Override Android hardware back button behaviour.
 * Callback fires when the user presses the hardware back button.
 * Returns a cleanup function (for use with useCallback).
 */
export function useBackHandler(onBack: () => void) {
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true; // prevent default (exit app / go to home)
    });
    return () => handler.remove();
  }, [onBack]);
}
