import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { preferEnumOverLiteralUnion } from './prefer-enum-over-literal-union.js';

const ruleTester = new RuleTester();

ruleTester.run(preferEnumOverLiteralUnion.name, preferEnumOverLiteralUnion, {
  valid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'named z import',
      code: dedent`
        import { z } from 'zod';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'union with a non-literal element',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal('foo'), z.literal('bar'), z.int()])
      `,
    },
    {
      // https://github.com/gajus/eslint-plugin-zod/issues/6
      name: 'should error only for literal strings',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal('foo'), z.literal(5)])
      `,
    },
  ],
  invalid: [
    {
      name: 'namespace import',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal('foo'), z.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod';
        z.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'namespace import (keeps original string format)',
      code: dedent`
        import * as z from 'zod';
        z.union([z.literal("foo"), z.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as z from 'zod';
        z.enum(["foo", 'bar'])
      `,
    },
    {
      name: 'namespace import different from z',
      code: dedent`
        import * as zod from 'zod';
        zod.union([zod.literal('foo'), zod.literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: dedent`
        import * as zod from 'zod';
        zod.enum(['foo', 'bar'])
      `,
    },
    {
      name: 'named import',
      code: dedent`
        import { union, literal } from 'zod';
        union([literal('foo'), literal('bar')])
      `,
      errors: [{ messageId: 'useEnum' }],
      output: null,
    },
  ],
});
