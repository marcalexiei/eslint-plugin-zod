import { RuleTester } from '@typescript-eslint/rule-tester';

import { preferStringSchemaWithTrim } from './prefer-string-schema-with-trim.js';

const ruleTester = new RuleTester();

ruleTester.run('prefer-string-schema-with-trim', preferStringSchemaWithTrim, {
  valid: [
    {
      code: `
        import { z } from 'zod';
        z.string().trim();
      `,
    },
    {
      code: `
        import { z } from 'zod';
        z.string().min(1).trim();
      `,
    },
    {
      code: `
        import { z } from 'zod';
        z.string().trim().email();
      `,
    },
    {
      code: `
        import { number } from 'zod';
        number();
      `,
    },
    {
      code: `
        import * as zod from 'zod';
        zod.string().trim();
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { z } from 'zod';
        z.string();
      `,
      errors: [{ messageId: 'preferTrim' }],
      output: `
        import { z } from 'zod';
        z.string().trim();
      `,
    },
    {
      code: `
        import { z } from 'zod';
        z.string().min(1);
      `,
      errors: [{ messageId: 'preferTrim' }],
      output: `
        import { z } from 'zod';
        z.string().min(1).trim();
      `,
    },
    {
      code: `
        import { z } from 'zod';
        z.string({ required_error: "Must be a string" });
      `,
      errors: [{ messageId: 'preferTrim' }],
      output: `
        import { z } from 'zod';
        z.string({ required_error: "Must be a string" }).trim();
      `,
    },
    {
      code: `
        import * as zod from 'zod';
        zod.string();
      `,
      errors: [{ messageId: 'preferTrim' }],
      output: `
        import * as zod from 'zod';
        zod.string().trim();
      `,
    },
  ],
});
