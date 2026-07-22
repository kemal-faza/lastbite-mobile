import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Button } from '@/components/ui/button';

jest.mock('@/components/ui/text', () => ({
  TextClassContext: {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  },
  Text: 'Text',
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('Button', () => {
  it('renders children', async () => {
    const { getByText } = await render(<Button><Text>Click</Text></Button>);
    expect(getByText('Click')).toBeTruthy();
  });

  it('renders default variant', async () => {
    const { getByText } = await render(
      <Button variant="default"><Text>Default</Text></Button>
    );
    expect(getByText('Default')).toBeTruthy();
  });

  it('renders plain variant', async () => {
    const { getByText } = await render(
      <Button variant="plain"><Text>Plain</Text></Button>
    );
    expect(getByText('Plain')).toBeTruthy();
  });

  it('renders destructive variant', async () => {
    const { getByText } = await render(
      <Button variant="destructive"><Text>Destructive</Text></Button>
    );
    expect(getByText('Destructive')).toBeTruthy();
  });

  it('renders outline variant', async () => {
    const { getByText } = await render(
      <Button variant="outline"><Text>Outline</Text></Button>
    );
    expect(getByText('Outline')).toBeTruthy();
  });

  it('renders outline-primary variant', async () => {
    const { getByText } = await render(
      <Button variant="outline-primary"><Text>Outline Primary</Text></Button>
    );
    expect(getByText('Outline Primary')).toBeTruthy();
  });

  it('renders secondary variant', async () => {
    const { getByText } = await render(
      <Button variant="secondary"><Text>Secondary</Text></Button>
    );
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('renders ghost variant', async () => {
    const { getByText } = await render(
      <Button variant="ghost"><Text>Ghost</Text></Button>
    );
    expect(getByText('Ghost')).toBeTruthy();
  });

  it('renders link variant', async () => {
    const { getByText } = await render(
      <Button variant="link"><Text>Link</Text></Button>
    );
    expect(getByText('Link')).toBeTruthy();
  });

  it('renders with size icon', async () => {
    const { getByText } = await render(
      <Button size="icon"><Text>+</Text></Button>
    );
    expect(getByText('+')).toBeTruthy();
  });

  it('renders with size sm', async () => {
    const { getByText } = await render(
      <Button size="sm"><Text>Small</Text></Button>
    );
    expect(getByText('Small')).toBeTruthy();
  });

  it('renders with size lg', async () => {
    const { getByText } = await render(
      <Button size="lg"><Text>Large</Text></Button>
    );
    expect(getByText('Large')).toBeTruthy();
  });

  it('renders plain variant with size icon', async () => {
    const { getByText } = await render(
      <Button variant="plain" size="icon"><Text>Icon</Text></Button>
    );
    expect(getByText('Icon')).toBeTruthy();
  });
});
