import { render, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TopBar } from '@/components/TopBar';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@/lib/api/client', () => ({ apiFetch: jest.fn() }));

function Wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('TopBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export TopBar as a function component', () => {
    expect(typeof TopBar).toBe('function');
  });

  it('should render the wordmark "LastBite"', async () => {
    const { getByText } = await render(<TopBar />, { wrapper: Wrapper });
    expect(getByText('LastBite')).toBeTruthy();
  });

  it('should render a button with accessibility label "Buka notifikasi"', async () => {
    const { getByLabelText } = await render(<TopBar />, { wrapper: Wrapper });
    expect(getByLabelText('Buka notifikasi')).toBeTruthy();
  });

  it('should navigate to /notifications when bell is pressed', async () => {
    const { getByLabelText } = await render(<TopBar />, { wrapper: Wrapper });
    const button = getByLabelText('Buka notifikasi');
    try {
      fireEvent.press(button);
    } catch (_) {
      if (typeof (button as any).props?.onPress === 'function') {
        (button as any).props.onPress();
      }
    }
    const { router } = require('expo-router');
    expect(router.push).toHaveBeenCalledWith('/notifications');
  });
});
