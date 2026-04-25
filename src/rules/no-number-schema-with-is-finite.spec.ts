import { RuleTester } from '@typescript-eslint/rule-tester';
import dedent from 'dedent';

import { noNumberSchemaWithIsFinite } from './no-number-schema-with-is-finite.js';

const ruleTester = new RuleTester();

ruleTester.run('no-number-schema-with-is-finite', noNumberSchemaWithIsFinite, {
  valid: [
    {
      name: 'z.number() without isFinite',
      code: dedent`
        import * as z from 'zod';
        const n = z.number();
      `,
    },
  ],
  invalid: [
    {
      name: 'z.number().isFinite',
      code: dedent`
        import * as z from 'zod';
        void z.number().isFinite;
      `,
      errors: [{ messageId: 'deprecated' }],
    },
    {
      name: 'z.number().min(0).isFinite',
      code: dedent`
        import * as z from 'zod';
        void z.number().min(0).isFinite;
      `,
      errors: [{ messageId: 'deprecated' }],
    },
  ],
});
