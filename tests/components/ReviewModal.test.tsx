import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ReviewModal } from '@/components/ReviewModal';
import { ToastProvider } from '@/contexts/ToastContext';

// Mock TanStack Query — useCreateReview uses useMutation from @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useMutation: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
    error: null,
  }),
  useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));

function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

const defaultProps = {
  visible: true,
  onClose: jest.fn(),
  orderId: 'order-1',
  productName: 'Nasi Goreng Spesial',
};

describe('ReviewModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, product name, and star rating hint', async () => {
    const { getByText } = await render(
      <TestWrapper>
        <ReviewModal {...defaultProps} />
      </TestWrapper>
    );

    expect(getByText('Tulis Ulasan')).toBeTruthy();
    expect(getByText('Nasi Goreng Spesial')).toBeTruthy();
    expect(getByText('Ketuk bintang untuk memberi rating')).toBeTruthy();
  });

  it('shows error when submitting without rating', async () => {
    const { getByText } = await render(
      <TestWrapper>
        <ReviewModal {...defaultProps} />
      </TestWrapper>
    );

    await fireEvent.press(getByText('Kirim Ulasan'));

    await waitFor(() => {
      expect(getByText('Harap pilih rating terlebih dahulu')).toBeTruthy();
    });
  });

  it('resets state on close/reopen', async () => {
    const onClose = jest.fn();
    const { getByText, getByTestId, rerender } = await render(
      <TestWrapper>
        <ReviewModal {...defaultProps} onClose={onClose} />
      </TestWrapper>
    );

    expect(getByText('Ketuk bintang untuk memberi rating')).toBeTruthy();

    await fireEvent.press(getByTestId('star-4'));
    expect(getByText('Rating kamu: 4 bintang')).toBeTruthy();

    await rerender(
      <TestWrapper>
        <ReviewModal {...defaultProps} onClose={onClose} visible={false} />
      </TestWrapper>
    );
    await rerender(
      <TestWrapper>
        <ReviewModal {...defaultProps} onClose={onClose} visible={true} />
      </TestWrapper>
    );

    expect(getByText('Ketuk bintang untuk memberi rating')).toBeTruthy();
  });

  it('calls onClose after valid submit', async () => {
    const onClose = jest.fn();
    const { getByText, getByTestId } = await render(
      <TestWrapper>
        <ReviewModal {...defaultProps} onClose={onClose} />
      </TestWrapper>
    );

    await fireEvent.press(getByTestId('star-4'));
    await fireEvent.press(getByText('Kirim Ulasan'));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
