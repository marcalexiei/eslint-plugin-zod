import { describe, expect, it } from 'vitest';

import {
  ZOD_IMPORT_SOURCES,
  isZodImportSource,
} from './is-zod-import-source.js';

describe('ZOD_IMPORT_SOURCES', () => {
  it('contains all expected sources', () => {
    expect(ZOD_IMPORT_SOURCES).toStrictEqual([
      'zod',
      'zod/mini',
      'zod/v4',
      'zod/v4-mini',
      'zod/v3',
    ]);
  });
});

describe('isZodImportSource', () => {
  describe("allowedSource: 'zod'", () => {
    it.each(['zod', 'zod/v4', 'zod/v3'])("returns true for '%s'", (source) => {
      expect(isZodImportSource(source, 'zod')).toBe(true);
    });

    it.each(['zod/mini', 'zod/v4-mini', 'zod-schema', 'lodash', ''])(
      "returns false for '%s'",
      (source) => {
        expect(isZodImportSource(source, 'zod')).toBe(false);
      },
    );
  });

  describe("allowedSource: 'zod-mini'", () => {
    it.each(['zod/mini', 'zod/v4-mini'])("returns true for '%s'", (source) => {
      expect(isZodImportSource(source, 'zod-mini')).toBe(true);
    });

    it.each(['zod', 'zod/v4', 'zod/v3', 'lodash', ''])(
      "returns false for '%s'",
      (source) => {
        expect(isZodImportSource(source, 'zod-mini')).toBe(false);
      },
    );
  });
});
