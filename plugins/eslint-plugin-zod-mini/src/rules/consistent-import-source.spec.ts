import { RuleTester } from '@typescript-eslint/rule-tester';

import { consistentImportSource } from './consistent-import-source.js';

const ruleTester = new RuleTester();

ruleTester.run(consistentImportSource.name, consistentImportSource, {
  valid: [
    { code: 'import * as z from "zod/mini"' },
    { code: 'import { z } from "zod/mini"' },
    { code: 'import z from "zod/mini"' },
    {
      code: 'import z from "zod/mini"',
      options: [{ sources: ['zod/mini'] }],
    },
    {
      code: 'import z from "zod/v4-mini"',
      options: [{ sources: ['zod/v4-mini'] }],
    },
    {
      code: 'import z from "zod"',
      options: [{ sources: ['zod'] }],
    },
    {
      name: 'non-zod import is ignored',
      code: 'import z from "react"',
    },
  ],
  invalid: [
    {
      name: 'zod not allowed by default',
      code: 'import * as z from "zod"',
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod', sources: '"zod/mini"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/mini', invalid: 'zod' },
              output: 'import * as z from "zod/mini"',
            },
          ],
        },
      ],
    },
    {
      name: 'zod/v4 not allowed by default',
      code: 'import z from "zod/v4"',
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v4', sources: '"zod/mini"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/mini', invalid: 'zod/v4' },
              output: 'import z from "zod/mini"',
            },
          ],
        },
      ],
    },
    {
      name: 'should keep quote style',
      code: "import z from 'zod/v4-mini'",
      options: [{ sources: ['zod/mini'] }],
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod/v4-mini', sources: '"zod/mini"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/mini', invalid: 'zod/v4-mini' },
              output: "import z from 'zod/mini'",
            },
          ],
        },
      ],
    },
    {
      name: 'multiple sources, multiple suggestions',
      code: 'import z from "zod"',
      options: [{ sources: ['zod/mini', 'zod/v4-mini'] }],
      errors: [
        {
          messageId: 'sourceNotAllowed',
          data: { source: 'zod', sources: '"zod/mini", "zod/v4-mini"' },
          suggestions: [
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/mini', invalid: 'zod' },
              output: 'import z from "zod/mini"',
            },
            {
              messageId: 'replaceSource',
              data: { valid: 'zod/v4-mini', invalid: 'zod' },
              output: 'import z from "zod/v4-mini"',
            },
          ],
        },
      ],
    },
  ],
});
