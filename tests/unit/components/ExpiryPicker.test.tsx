import { render, fireEvent } from '@testing-library/react-native';
import { ExpiryPicker } from '@/components/ExpiryPicker';

describe('ExpiryPicker', () => {
  it('renders all expiry options', async () => {
    const { getByText } = await render(<ExpiryPicker value="" onChange={jest.fn()} />);
    expect(getByText('Hari Ini')).toBeTruthy();
    expect(getByText('< 1 Jam')).toBeTruthy();
    expect(getByText('< 3 Jam')).toBeTruthy();
    expect(getByText('< 6 Jam')).toBeTruthy();
  });

  it('highlights selected option', async () => {
    const { getByText } = await render(<ExpiryPicker value="Hari Ini" onChange={jest.fn()} />);
    const selected = getByText('Hari Ini');
    expect(selected.props.className).toContain('text-white');
  });

  it('calls onChange when option pressed', async () => {
    const onChange = jest.fn();
    const { getByText } = await render(<ExpiryPicker value="" onChange={onChange} />);
    fireEvent.press(getByText('< 1 Jam'));
    expect(onChange).toHaveBeenCalledWith('< 1 Jam');
  });

  it('displays error message when provided', async () => {
    const { getByText } = await render(<ExpiryPicker value="" onChange={jest.fn()} error="Required" />);
    expect(getByText('Required')).toBeTruthy();
  });
});
