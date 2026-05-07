import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noEmptyCustomSchema } from './no-empty-custom-schema.js';

const ruleTester = new RuleTester();

ruleTester.run(noEmptyCustomSchema.name, noEmptyCustomSchema, {
  valid: [
    {
      name: 'namespace with validator',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom((val) => typeof val === "string");
      `,
    },
    {
      name: 'named with validator',
      code: dedent`
        import { custom } from 'zod/mini';
        custom((val) => typeof val === "string");
      `,
    },
    {
      name: 'type and function',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom<\`\${number}px\`>((val) => {
          return typeof val === "string" ? /^\\d+px$/.test(val) : false;
        });
      `,
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        z.custom();
      `,
    },
    {
      name: 'custom wrapped with optional',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.optional(
          z.custom((val) => typeof val === 'string', { error: 'Error' })
        );
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'named',
      code: dedent`
        import { custom } from 'zod/mini';
        custom();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'named z',
      code: dedent`
        import { z } from 'zod/mini';
        z.custom();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'type without function',
      code: dedent`
        import * as z from 'zod/mini';
        z.custom<\`\${number}px\`>();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.custom();
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
    {
      name: 'wrapped with optional',
      code: dedent`
        import * as z from 'zod/mini';
        const userSchema = z.optional(z.custom());
      `,
      errors: [{ messageId: 'noEmptyCustomSchema' }],
    },
  ],
});
