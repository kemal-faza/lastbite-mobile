import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '@/components/SearchBar';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('SearchScreen (via SearchBar integration)', () => {
  it('SearchBar renders with correct placeholder', async () => {
    const { getByPlaceholderText } = await render(
      <SearchBar value="" onChangeText={jest.fn()} placeholder="Cari makanan..." />
    );
    expect(getByPlaceholderText('Cari makanan...')).toBeTruthy();
  });

  it('SearchBar calls onChangeText when typing', async () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = await render(
      <SearchBar value="" onChangeText={onChangeText} placeholder="Cari makanan..." />
    );
    fireEvent.changeText(getByPlaceholderText('Cari makanan...'), 'nasi');
    expect(onChangeText).toHaveBeenCalledWith('nasi');
  });

  it('SearchBar shows clear button and clears text', async () => {
    const onChangeText = jest.fn();
    const { getByTestId } = await render(
      <SearchBar value="nasi" onChangeText={onChangeText} placeholder="Cari makanan..." />
    );
    fireEvent.press(getByTestId('searchbar-clear'));
    expect(onChangeText).toHaveBeenCalledWith('');
  });
});
