import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferMetaLast } from './prefer-meta-last.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-meta-last', preferMetaLast, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.string().meta({ description: "desc" })
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { string } from 'zod';
        string().meta({ description: "desc" })
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        z.string().meta({ description: "desc" })
      `,
    },
    {
      name: 'No meta... no error',
      code: dedent`
        import * as z from 'zod';
        z.string().min(5).max(10);
      `,
    },
    {
      name: 'multiple methods, but meta() is last',
      code: `
        import * as z from 'zod';
        z.string().min(5).max(10).meta({ description: "my string" });
      `,
    },
    {
      name: 'multiple chained meta at the end (still valid)',
      code: dedent`
        import * as z from 'zod';
        z.string().min(5).max(10).meta({ a: 1 }).meta({ b: 2 });
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod/issues/42
      name: 'meta not belonging to zod',
      code: dedent`
        export const t = initTRPC
          .meta<Meta>()
          .context<typeof createTRPCContext>()
          .create({});
      `,
    },
    {
      name: 'meta not belonging to zod',
      code: 'const t = meta<Meta>()',
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod/issues/70
      name: 'inside object',
      code: dedent`
        import * as z from 'zod';
        export const baseEventPayloadSchema = z.object({
          type: z.string(),
          action: z.string().meta({ description: "a" }),
        })
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod/issues/42
      name: 'inside looseObject',
      code: dedent`
        import * as z from 'zod';
        export const baseEventPayloadSchema = z.looseObject({
          type: z.string(),
          action: z.string().meta({ description: "a" }),
        })
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod/issues/42
      name: 'inside strictObject',
      code: dedent`
        import * as z from 'zod';
        export const baseEventPayloadSchema = z.strictObject({
          type: z.string(),
          action: z.string().meta({ description: "a" }),
        })
      `,
    },
  ],

  invalid: [
    {
      name: 'meta() before another method (namespace import)',
      code: dedent`
        import * as z from 'zod';
        z.string().meta({ description: "desc" }).trim();
      `,
      errors: [{ messageId: 'metaNotLast' }],
      output: dedent`
        import * as z from 'zod';
        z.string().trim().meta({ description: "desc" });
      `,
    },
    {
      name: 'meta() before another method (named import)',
      code: dedent`
        import { string } from 'zod';
        string().meta({ description: "desc" }).trim();
      `,
      errors: [{ messageId: 'metaNotLast' }],
      output: dedent`
        import { string } from 'zod';
        string().trim().meta({ description: "desc" });
      `,
    },
    {
      name: 'meta() before another method (named z import)',
      code: dedent`
        import { z } from 'zod';
        z.string().meta({ description: "desc" }).trim();
      `,
      errors: [{ messageId: 'metaNotLast' }],
      output: dedent`
        import { z } from 'zod';
        z.string().trim().meta({ description: "desc" });
      `,
    },
    {
      name: 'meta() followed by transform()',
      code: dedent`
        import * as z from 'zod';
        z.string().meta({ foo: "bar" }).transform(x => x.toUpperCase());
      `,
      errors: [{ messageId: 'metaNotLast' }],
      output: dedent`
        import * as z from 'zod';
        z.string().transform(x => x.toUpperCase()).meta({ foo: "bar" });
      `,
    },
    {
      name: 'meta() in the middle of the chain',
      code: dedent`
        import * as z from 'zod';
        z.string().min(5).meta({ foo: "bar" }).max(10);
      `,
      errors: [
        { messageId: 'metaNotLast', line: 2, column: 19, endColumn: 23 },
      ],
      output: dedent`
        import * as z from 'zod';
        z.string().min(5).max(10).meta({ foo: "bar" });
      `,
    },
    {
      // https://github.com/marcalexiei/eslint-plugin-zod/issues/42
      name: 'inside strictObject',
      code: dedent`
        import * as z from 'zod';
        export const baseEventPayloadSchema = z.strictObject({
          type: z.string(),
          action: z.string().meta({ description: "a" }).min(1),
        })
      `,
      errors: [
        { messageId: 'metaNotLast', line: 4, column: 22, endColumn: 26 },
      ],
      output: dedent`
        import * as z from 'zod';
        export const baseEventPayloadSchema = z.strictObject({
          type: z.string(),
          action: z.string().min(1).meta({ description: "a" }),
        })
      `,
    },
  ],
});
