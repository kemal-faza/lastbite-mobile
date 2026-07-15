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

  it('parses exactly 10 screens from layout', () => {
    expect(screens).toHaveLength(10);
  });

  it('has exactly 5 visible screens + 5 hidden screens', () => {
    const visible = screens.filter((s) => !s.hrefNull);
    const hidden = screens.filter((s) => s.hrefNull);
    expect(visible).toHaveLength(5);
    expect(hidden).toHaveLength(5);
  });

  it('visible screens are: index, search, cart, orders, profile', () => {
    const visible = screens.filter((s) => !s.hrefNull).map((s) => s.name);
    expect(visible).toEqual(['index', 'search', 'cart', 'orders', 'profile']);
  });

  it('hidden screens are: product/[id], checkout, order/[id], wishlist, notifications', () => {
    const hidden = screens.filter((s) => s.hrefNull).map((s) => s.name);
    expect(hidden).toEqual([
      'product/[id]',
      'checkout',
      'order/[id]',
      'wishlist',
      'notifications',
    ]);
  });

  it('does NOT declare order/confirm/[id]', () => {
    const orderConfirm = screens.find((s) => s.name === 'order/confirm/[id]');
    expect(orderConfirm).toBeUndefined();
  });

  it('every file in (tabs)/ has a corresponding Tabs.Screen declaration', () => {
    const tabsDir = path.resolve(__dirname, '../../', TABS_DIR);

    // Find all .tsx files in (tabs)/ directory (recursive through subdirs)
    const files = fs.readdirSync(tabsDir, { recursive: true }) as string[];
    const tsxFiles = files.filter(
      (f) => f.endsWith('.tsx') && f !== '_layout.tsx',
    );

    const orphanFiles: string[] = [];

    for (const file of tsxFiles) {
      const screenName = filePathToScreenName(file);
      if (screenName === null) continue;
      if (!declaredNames.has(screenName)) {
        orphanFiles.push(file);
      }
    }

    // If there are orphan files (like order/confirm/[id].tsx before fix),
    // they will appear here. This test should pass only after fixing.
    expect(orphanFiles).toEqual([]);
  });

  it('layout file compiles and exports a component', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const TabsLayout = require('../../app/(food-saver)/(tabs)/_layout').default;
    expect(TabsLayout).toBeDefined();
    expect(typeof TabsLayout).toBe('function');
  });
});
