import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noUnknownSchema } from './no-unknown-schema.js';

const ruleTester = new RuleTester();

ruleTester.run(noUnknownSchema.name, noUnknownSchema, {
  valid: [
    {
      name: 'with another zod/mini schema',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.string();
      `,
    },
    {
      name: 'nested object',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.object({ name: z.string() });
      `,
    },
    {
      name: 'not zod',
      code: 'something.unknown()',
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        const userSchema = z.unknown();
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.unknown();
      `,
      errors: [{ messageId: 'noZUnknown' }],
    },
    {
      name: 'named import',
      code: dedent`
        import { unknown } from 'zod/mini';
        const userSchema = unknown();
      `,
      errors: [{ messageId: 'noZUnknown' }],
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        const userSchema = z.unknown();
      `,
      errors: [{ messageId: 'noZUnknown' }],
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        const userSchema = z.unknown();
      `,
      errors: [{ messageId: 'noZUnknown' }],
    },
    {
      name: 'inside an object',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.object({ prop: z.unknown() });
      `,
      errors: [{ messageId: 'noZUnknown', line: 2, column: 37, endColumn: 48 }],
    },
  ],
});
