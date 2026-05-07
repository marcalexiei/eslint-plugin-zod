import { describe, expect, it } from 'vitest';

import { getRuleURL } from './meta.js';

describe('getRuleURL', () => {
  /** @see https://github.com/marcalexiei/eslint-zod/pull/97 */
  it('should provide correct URLs (no hash please)', () => {
    const RULE_ID = 'rule-id-mock';
    expect(getRuleURL(RULE_ID)).toMatch(
      /^https:\/\/github\.com\/marcalexiei\/eslint-zod\/blob\/HEAD\/plugins\/eslint-plugin-zod-mini\/docs\/rules\/rule-id-mock\.md$/,
    );
  });
});
