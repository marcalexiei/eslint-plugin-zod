import { readFileSync } from 'node:fs';

const packageJSON = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as {
  name: string;
  version: string;
  repository: { url: string; directory: string };
};

const { name: PLUGIN_NAME, version: PLUGIN_VERSION, repository } = packageJSON;

export { PLUGIN_NAME, PLUGIN_VERSION };

export function getRuleURL(ruleID: string): string {
  // e.g., https://github.com/marcalexiei/eslint-zod/blob/HEAD/plugins/eslint-plugin-zod/docs/rules/array-style.md
  return `${repository.url}/blob/HEAD/${repository.directory}/docs/rules/${ruleID}.md`;
}
