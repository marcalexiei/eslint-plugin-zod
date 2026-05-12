import { describe, expect, it } from 'vitest';

import { zodImportScope, zodMiniImportScope } from './zod-import-scope.js';

describe('zodSources', () => {
  it('contains all expected sources', () => {
    expect(zodImportScope.sources).toStrictEqual(['zod', 'zod/v4', 'zod/v3']);
  });

  describe('isAllowed', () => {
    it.each(['zod', 'zod/v4', 'zod/v3'])("returns true for '%s'", (source) => {
      expect(zodImportScope.isAllowed(source)).toBe(true);
    });

    it.each(['zod/mini', 'zod/v4-mini', 'zod-schema', 'lodash', ''])(
      "returns false for '%s'",
      (source) => {
        expect(zodImportScope.isAllowed(source)).toBe(false);
      },
    );
  });
});

describe('zodMiniSources', () => {
  it('contains all expected sources', () => {
    expect(zodMiniImportScope.sources).toStrictEqual(['zod/mini', 'zod/v4-mini']);
  });

  describe('isAllowed', () => {
    it.each(['zod/mini', 'zod/v4-mini'])("returns true for '%s'", (source) => {
      expect(zodMiniImportScope.isAllowed(source)).toBe(true);
    });

    it.each(['zod', 'zod/v4', 'zod/v3', 'lodash', ''])("returns false for '%s'", (source) => {
      expect(zodMiniImportScope.isAllowed(source)).toBe(false);
    });
  });
});
