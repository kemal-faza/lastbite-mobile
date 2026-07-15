import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '@/components/SearchBar';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('SearchBar', () => {
  it('renders with placeholder', async () => {
    const { getByPlaceholderText } = await render(
      <SearchBar value="" onChangeText={jest.fn()} placeholder="Cari..." />
    );
    expect(getByPlaceholderText('Cari...')).toBeTruthy();
  });

  it('calls onChangeText when typing', async () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = await render(
      <SearchBar value="" onChangeText={onChangeText} placeholder="Cari..." />
    );
    fireEvent.changeText(getByPlaceholderText('Cari...'), 'nasi');
    expect(onChangeText).toHaveBeenCalledWith('nasi');
  });

  it('calls onSubmit when submitting', async () => {
    const onSubmit = jest.fn();
    const { getByPlaceholderText } = await render(
      <SearchBar value="nasi" onChangeText={jest.fn()} onSubmit={onSubmit} placeholder="Cari..." />
    );
    fireEvent(getByPlaceholderText('Cari...'), 'submitEditing');
    expect(onSubmit).toHaveBeenCalled();
  });

  it('shows clear button when value is not empty', async () => {
    const onChangeText = jest.fn();
    const { getByTestId } = await render(
      <SearchBar value="nasi" onChangeText={onChangeText} placeholder="Cari..." />
    );
    fireEvent.press(getByTestId('searchbar-clear'));
    expect(onChangeText).toHaveBeenCalledWith('');
  });
});
