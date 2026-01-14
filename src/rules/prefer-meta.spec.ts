import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferMeta } from './prefer-meta.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-meta', preferMeta, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.string().meta({ description: "desc" });
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { string } from 'zod';
        string().meta({ description: "desc" });
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        z.string().meta({ description: "desc" });
      `,
    },
    {
      name: 'valid usage (not last method)',
      code: dedent`
        import * as z from 'zod';
        z.string().meta({ description: "desc" }).trim();
      `,
    },
    {
      name: 'valid usage (not last method) (named)',
      code: dedent`
        import { string } from 'zod';
        string().meta({ description: "desc" }).trim();
      `,
    },
    {
      name: 'No meta... no error',
      code: dedent`
        import * as z from 'zod';
        z.string().min(5).max(10);;
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod/issues/121
      name: 'ignores non-zod describe methods',
      code: dedent`
        import { test } from "@playwright/test";
        test.describe("test", () => {});
      `,
    },
  ],

  invalid: [
    {
      name: 'describe with string (namespace import)',
      code: dedent`
        import * as z from 'zod';
        z.string().describe("desc").trim();
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import * as z from 'zod';
        z.string().meta({ description: "desc" }).trim();
      `,
    },
    {
      name: 'describe with string (named import)',
      code: dedent`
        import { string } from 'zod';
        string().describe("desc").trim();
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import { string } from 'zod';
        string().meta({ description: "desc" }).trim();
      `,
    },
    {
      name: 'describe with string (named z import)',
      code: dedent`
        import { z } from 'zod';
        z.string().describe("desc").trim();
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import { z } from 'zod';
        z.string().meta({ description: "desc" }).trim();
      `,
    },
    {
      name: 'describe with literal',
      code: dedent`
        import * as z from 'zod';
        const desc = 'desc';
        z.string().describe(\`desc\${desc}\`).trim();
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import * as z from 'zod';
        const desc = 'desc';
        z.string().meta({ description: \`desc\${desc}\` }).trim();
      `,
    },
    {
      name: 'describe with variable',
      code: dedent`
        import * as z from 'zod';
        const desc = 'desc';
        z.string().describe(desc).trim()
      `,
      errors: [{ messageId: 'preferMeta' }],
      output: dedent`
        import * as z from 'zod';
        const desc = 'desc';
        z.string().meta({ description: desc }).trim()
      `,
    },
  ],
});
