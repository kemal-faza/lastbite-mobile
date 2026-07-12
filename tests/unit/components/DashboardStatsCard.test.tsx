import { render } from '@testing-library/react-native';
import DashboardStatsCard from '@/components/DashboardStatsCard';

describe('DashboardStatsCard', () => {
  it('should export DashboardStatsCard as a function component', () => {
    expect(typeof DashboardStatsCard).toBe('function');
  });

  it('renders title and value', async () => {
    const { getByText } = await render(
      <DashboardStatsCard title="Active Orders" value={10} />
    );
    expect(getByText('Active Orders')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
  });

  it('renders string values (like formatted currency)', async () => {
    const { getByText } = await render(
      <DashboardStatsCard title="Revenue" value="Rp 2.500.000" />
    );
    expect(getByText('Revenue')).toBeTruthy();
    expect(getByText('Rp 2.500.000')).toBeTruthy();
  });
});
