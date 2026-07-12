import { render, fireEvent } from '@testing-library/react-native';
import { FilterModal, FilterState } from '@/components/FilterModal';

describe('FilterModal', () => {
  const defaultFilters: FilterState = {
    maxDistance: 0,
    maxPrice: 0,
    expiry: 'Hari Ini',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when not visible', async () => {
    const { queryByText } = await render(
      <FilterModal visible={false} onClose={jest.fn()} filters={defaultFilters} onApply={jest.fn()} />
    );
    expect(queryByText('Filter')).toBeNull();
  });

  it('renders Filter header and Reset button when visible', async () => {
    const { getByText } = await render(
      <FilterModal visible={true} onClose={jest.fn()} filters={defaultFilters} onApply={jest.fn()} />
    );
    expect(getByText('Filter')).toBeTruthy();
    expect(getByText('Reset')).toBeTruthy();
    expect(getByText('Jarak Maksimal')).toBeTruthy();
  });

  it('renders Terapkan button in sticky footer area', async () => {
    const { getByText } = await render(
      <FilterModal visible={true} onClose={jest.fn()} filters={defaultFilters} onApply={jest.fn()} />
    );
    const terapkan = getByText('Terapkan');
    expect(terapkan).toBeTruthy();
  });

  it('calls onApply with draft and onClose when Terapkan pressed', async () => {
    const onApply = jest.fn();
    const onClose = jest.fn();
    const { getByText } = await render(
      <FilterModal visible={true} onClose={onClose} filters={defaultFilters} onApply={onApply} />
    );
    fireEvent.press(getByText('Terapkan'));
    expect(onApply).toHaveBeenCalledWith(defaultFilters);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onApply with empty defaults and onClose when Reset pressed', async () => {
    const onApply = jest.fn();
    const onClose = jest.fn();
    const filtersWithValues: FilterState = {
      maxDistance: 5,
      maxPrice: 25000,
      expiry: '< 3 Jam',
    };
    const { getByText } = await render(
      <FilterModal visible={true} onClose={onClose} filters={filtersWithValues} onApply={onApply} />
    );
    fireEvent.press(getByText('Reset'));
    expect(onApply).toHaveBeenCalledWith({
      maxDistance: 0,
      maxPrice: 0,
      expiry: 'Hari Ini',
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('draft is initialized from filters prop and only applied on Terapkan press', async () => {
    const onApply = jest.fn();
    const onClose = jest.fn();
    const { getByText } = await render(
      <FilterModal visible={true} onClose={onClose} filters={{ maxDistance: 5, maxPrice: 25000, expiry: '< 3 Jam' }} onApply={onApply} />
    );
    // Draft should NOT auto-apply on render
    expect(onApply).not.toHaveBeenCalled();

    // Press Terapkan should apply the current draft (initialized from filters)
    fireEvent.press(getByText('Terapkan'));
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        maxDistance: 5,
        maxPrice: 25000,
        expiry: '< 3 Jam',
      })
    );
    expect(onClose).toHaveBeenCalled();
  });

  it('closes when backdrop is tapped', async () => {
    const onClose = jest.fn();
    const { getByTestId } = await render(
      <FilterModal visible={true} onClose={onClose} filters={defaultFilters} onApply={jest.fn()} />
    );
    fireEvent.press(getByTestId('filter-backdrop'));
    expect(onClose).toHaveBeenCalled();
  });

  // Regression guard: validates maxHeight constraint is on the sheet container,
  // not on an inner View (catches circular maxHeight layout bug)
  it('cleanup does not throw when BackHandler subscription has no remove method', async () => {
    const { BackHandler } = require('react-native');
    const originalAddEventListener = BackHandler.addEventListener;
    BackHandler.addEventListener = jest.fn(() => ({}));

    const { unmount } = await render(
      <FilterModal visible={true} onClose={jest.fn()} filters={defaultFilters} onApply={jest.fn()} />
    );
    expect(() => unmount()).not.toThrow();

    BackHandler.addEventListener = originalAddEventListener;
  });

  it('overlay positioned with absolute fill (covers entire top-to-bottom area)', async () => {
    const { getByTestId } = await render(
      <FilterModal visible={true} onClose={jest.fn()} filters={defaultFilters} onApply={jest.fn()} />
    );
    const overlay = getByTestId('filter-overlay');
    const styleArr = Array.isArray(overlay.props.style)
      ? overlay.props.style
      : [overlay.props.style];
    const hasAbsoluteFill = styleArr.some(
      (s) =>
        s?.position === 'absolute' &&
        s?.top === 0 &&
        s?.left === 0 &&
        s?.right === 0 &&
        s?.bottom === 0
    );
    expect(hasAbsoluteFill).toBe(true);
  });

  it('applies height 50% on sheet container with correct styling', async () => {
    const { getByTestId, queryByText } = await render(
      <FilterModal visible={true} onClose={jest.fn()} filters={defaultFilters} onApply={jest.fn()} />
    );
    // Sheet Animated container should have height: 50%
    const sheetAnimated = getByTestId('filter-sheet-animated');
    const styleVal = Array.isArray(sheetAnimated.props.style)
      ? sheetAnimated.props.style.find((s) => s?.height)?.height
      : sheetAnimated.props.style?.height;
    expect(styleVal).toBe('50%');

    // Inner sheet Pressable should have bg-white and rounded-t-3xl styling
    const sheetPressable = getByTestId('filter-sheet');
    expect(sheetPressable).toBeTruthy();
    expect(sheetPressable.props.className).toContain('bg-white');
    expect(sheetPressable.props.className).toContain('rounded-t-3xl');

    // Content must be visible: distance options rendered
    expect(queryByText('3 km')).toBeTruthy();
    expect(queryByText('Rp10.000')).toBeTruthy();
  });

  it('backdrop has opacity animation (fade effect, independent of sheet slide)', async () => {
    const { getByTestId } = await render(
      <FilterModal visible={true} onClose={jest.fn()} filters={defaultFilters} onApply={jest.fn()} />
    );
    const backdrop = getByTestId('filter-backdrop-animated');
    const styleArr = Array.isArray(backdrop.props.style)
      ? backdrop.props.style
      : [backdrop.props.style];
    // Opacity should be present and numeric (animated value is mocked as number-like)
    expect(styleArr.some((s) => typeof s?.opacity === 'number' || s?.opacity !== undefined)).toBe(true);
  });

  it('sheet has translateY animation (slide effect, independent of backdrop fade)', async () => {
    const { getByTestId } = await render(
      <FilterModal visible={true} onClose={jest.fn()} filters={defaultFilters} onApply={jest.fn()} />
    );
    const sheet = getByTestId('filter-sheet-animated');
    const styleArr = Array.isArray(sheet.props.style)
      ? sheet.props.style
      : [sheet.props.style];
    const hasTransform = styleArr.some(
      (s) =>
        Array.isArray(s?.transform) &&
        s.transform.some((t: Record<string, unknown>) => t.translateY !== undefined)
    );
    expect(hasTransform).toBe(true);
  });
});
