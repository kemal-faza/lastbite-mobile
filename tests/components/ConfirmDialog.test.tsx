import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmDialog } from '@/components/ConfirmDialog';

// Mock alert-dialog: simplified version that handles open/onOpenChange, onPress, disabled
jest.mock('@/components/ui/alert-dialog', () => {
  const React = require('react');
  const { View, Text, Pressable } = require('react-native');

  const AlertDialog = ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? React.createElement(View, { testID: 'alert-dialog' }, children) : null;

  const AlertDialogContent = ({ children }: { children: React.ReactNode }) =>
    React.createElement(View, { testID: 'alert-dialog-content' }, children);

  const AlertDialogHeader = ({ children }: { children: React.ReactNode }) =>
    React.createElement(View, null, children);

  const AlertDialogTitle = ({ children }: { children: React.ReactNode }) =>
    React.createElement(Text, { testID: 'alert-dialog-title' }, children);

  const AlertDialogDescription = ({ children }: { children: React.ReactNode }) =>
    React.createElement(Text, { testID: 'alert-dialog-description' }, children);

  const AlertDialogFooter = ({ children }: { children: React.ReactNode }) =>
    React.createElement(View, null, children);

  const AlertDialogCancel = ({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) =>
    React.createElement(Pressable, { testID: 'alert-dialog-cancel', onPress },
      React.createElement(Text, null, children)
    );

  const AlertDialogAction = ({ children, onPress, disabled }: { children: React.ReactNode; onPress?: () => void; disabled?: boolean }) =>
    React.createElement(Pressable, { testID: 'alert-dialog-action', onPress, disabled },
      typeof children === 'string'
        ? React.createElement(Text, null, children)
        : children
    );

  return {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  };
});

describe('ConfirmDialog', () => {
  const defaultProps = {
    visible: true,
    title: 'Hapus Item',
    description: 'Apakah kamu yakin ingin menghapus item ini?',
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and description', async () => {
    const { getByText } = await render(<ConfirmDialog {...defaultProps} />);

    expect(getByText('Hapus Item')).toBeTruthy();
    expect(getByText('Apakah kamu yakin ingin menghapus item ini?')).toBeTruthy();
  });

  it('calls onConfirm when confirm button pressed', async () => {
    const onConfirm = jest.fn();
    const { getByTestId } = await render(
      <ConfirmDialog {...defaultProps} onConfirm={onConfirm} />
    );

    fireEvent.press(getByTestId('alert-dialog-action'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when cancel button pressed', async () => {
    const onClose = jest.fn();
    const { getByTestId } = await render(
      <ConfirmDialog {...defaultProps} onClose={onClose} />
    );

    fireEvent.press(getByTestId('alert-dialog-cancel'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows loading state when loading=true', async () => {
    const { getByTestId, queryByText } = await render(
      <ConfirmDialog {...defaultProps} loading />
    );

    const actionBtn = getByTestId('alert-dialog-action');

    expect(actionBtn.props.disabled).toBe(true);
    // confirmLabel ("Ya") should NOT be rendered when loading
    expect(queryByText('Ya')).toBeNull();
  });

  it('uses custom confirmLabel and cancelLabel', async () => {
    const { getByText } = await render(
      <ConfirmDialog
        {...defaultProps}
        confirmLabel="Iya, Hapus"
        cancelLabel="Tidak"
      />
    );

    expect(getByText('Iya, Hapus')).toBeTruthy();
    expect(getByText('Tidak')).toBeTruthy();
  });

  it('renders nothing when visible=false', async () => {
    const { toJSON } = await render(
      <ConfirmDialog {...defaultProps} visible={false} />
    );

    expect(toJSON()).toBeNull();
  });
});
