import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { consistentObjectSchemaType } from './consistent-object-schema-type.js';

const ruleTester = new RuleTester();

ruleTester.run(consistentObjectSchemaType.name, consistentObjectSchemaType, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({})
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { object } from 'zod/mini';
        object({})
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod/mini';
        z.object({})
      `,
    },
    {
      name: 'nested with allowed methods',
      options: [{ allow: ['looseObject', 'strictObject'] }],
      code: dedent`
        import * as z from 'zod/mini';
        z.looseObject({ test: z.strictObject({}) })
      `,
    },
    {
      name: 'not triggered on zod import',
      code: dedent`
        import * as z from 'zod';
        z.looseObject({})
      `,
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.object({})
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import — looseObject not allowed by default',
      code: dedent`
        import * as z from 'zod/mini';
        z.looseObject({})
      `,
      errors: [
        {
          messageId: 'consistentMethod',
          data: { actual: 'looseObject', allowedList: 'object' },
          suggestions: [
            {
              messageId: 'useMethod',
              data: { expected: 'object' },
              output: dedent`
                import * as z from 'zod/mini';
                z.object({})
              `,
            },
          ],
        },
      ],
      output: null,
    },
    {
      name: 'named import — no suggestion for Identifier callee',
      code: dedent`
        import { looseObject } from 'zod/mini';
        looseObject()
      `,
      errors: [
        {
          messageId: 'consistentMethod',
          data: { actual: 'looseObject', allowedList: 'object' },
        },
      ],
      output: null,
    },
    {
      name: 'nested looseObject',
      code: dedent`
        import * as z from 'zod/mini';
        z.object({ test: z.looseObject({}) })
      `,
      errors: [
        {
          messageId: 'consistentMethod',
          data: { actual: 'looseObject', allowedList: 'object' },
          suggestions: [
            {
              messageId: 'useMethod',
              data: { expected: 'object' },
              output: dedent`
                import * as z from 'zod/mini';
                z.object({ test: z.object({}) })
              `,
            },
          ],
        },
      ],
    },
    {
      name: 'zod/v4-mini import',
      code: dedent`
        import * as z from 'zod/v4-mini';
        z.looseObject({})
      `,
      errors: [
        {
          messageId: 'consistentMethod',
          data: { actual: 'looseObject', allowedList: 'object' },
          suggestions: [
            {
              messageId: 'useMethod',
              data: { expected: 'object' },
              output: dedent`
                import * as z from 'zod/v4-mini';
                z.object({})
              `,
            },
          ],
        },
      ],
      output: null,
    },
  ],
});
