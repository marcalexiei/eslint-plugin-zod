import { describe, expect, it } from 'vitest';

import { getRuleURL } from './meta.js';

describe('getRuleURL', () => {
  /** @see https://github.com/marcalexiei/eslint-plugin-zod/pull/97 */
  it('should provide correct URLs (no hash please)', () => {
    const RULE_ID = 'rule-id-mock';
    expect(getRuleURL(RULE_ID)).toMatch(
      /^https:\/\/github\.com\/marcalexiei\/eslint-plugin-zod\/blob\/v\d+\.\d+\.\d+\/docs\/rules\/rule-id-mock\.md$/,
    );
  });
});
