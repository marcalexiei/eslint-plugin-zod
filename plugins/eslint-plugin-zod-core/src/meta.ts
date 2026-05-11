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
  return `${repository.url}/blob/HEAD/${repository.directory}/docs/rules/${ruleID}.md`;
}
