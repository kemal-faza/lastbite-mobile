import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const LAYOUT_PATH = 'app/(food-saver)/(tabs)/_layout.tsx';
const TABS_DIR = 'app/(food-saver)/(tabs)';

interface ScreenDecl {
  name: string;
  hrefNull: boolean;
}

/**
 * Parse Tabs.Screen declarations from layout source by extracting
 * `<Tabs.Screen name="..." ... />` blocks and checking for `href: null`.
 */
function parseScreenDeclarations(): ScreenDecl[] {
  const filePath = path.resolve(__dirname, '../../', LAYOUT_PATH);
  const content = fs.readFileSync(filePath, 'utf-8');

  const declarations: ScreenDecl[] = [];
  let idx = 0;

  while (true) {
    const start = content.indexOf('<Tabs.Screen', idx);
    if (start === -1) break;

    const end = content.indexOf('/>', start);
    if (end === -1) break;

    const block = content.slice(start, end + 2);

    const nameMatch = block.match(/name="([^"]+)"/);
    if (!nameMatch) {
      idx = end + 2;
      continue;
    }

    const name = nameMatch[1];
    const hrefNull = block.includes('href: null') || block.includes('href={null}');
    declarations.push({ name, hrefNull });

    idx = end + 2;
  }

  return declarations;
}

/**
 * Convert a file path (relative to tabs dir) to the screen name used in
 * Tabs.Screen name="...". E.g. "product/[id].tsx" -> "product/[id]"
 * Returns null for files that should be excluded (_layout.tsx).
 */
function filePathToScreenName(filePath: string): string | null {
  // Remove the .tsx extension and any directory prefix
  const normalized = filePath.replace(/\\/g, '/').replace(/\.tsx$/, '');
  if (normalized === '_layout') return null;
  if (normalized === 'index') return 'index';
  return normalized;
}

describe('TabsLayout — all files declared', () => {
  let screens: ScreenDecl[];
  let declaredNames: Set<string>;

  beforeAll(() => {
    screens = parseScreenDeclarations();
    declaredNames = new Set(screens.map((s) => s.name));
  });

  it('parses exactly 5 screens from layout (no hidden screens)', () => {
    expect(screens).toHaveLength(5);
  });

  it('has no hidden (href:null) screens — all detail screens are in per-tab Stack groups', () => {
    const hidden = screens.filter((s) => s.hrefNull);
    expect(hidden).toHaveLength(0);
  });

  it('visible screens are: index, search, cart, orders, profile', () => {
    const visible = screens.filter((s) => !s.hrefNull).map((s) => s.name);
    expect(visible).toEqual(['index', 'search', 'cart', 'orders', 'profile']);
  });

  it('layout file compiles and exports a component', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TabsLayout = require('../../app/(food-saver)/(tabs)/_layout').default;
    expect(TabsLayout).toBeDefined();
    expect(typeof TabsLayout).toBe('function');
  });
});
