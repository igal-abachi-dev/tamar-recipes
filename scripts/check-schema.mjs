import { build } from 'esbuild';
import { createSchema } from 'sanity';
import { muxInput } from 'sanity-plugin-mux-input';
import { writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temporaryModule = resolve(root, `.schema-check-${Date.now()}.mjs`);

try {
  const bundle = await build({
    entryPoints: [resolve(root, 'src/sanity/schemas/index.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    packages: 'external',
    write: false,
  });
  await writeFile(temporaryModule, bundle.outputFiles[0].text);
  const { schemaTypes } = await import(pathToFileURL(temporaryModule).href);
  const schema = createSchema({
    name: 'tamar-recipes',
    types: [...muxInput().schema.types, ...schemaTypes],
  });
  const expected = ['recipe', 'category', 'siteSettings'];
  const missing = expected.filter((type) => !schema.has(type));
  const errors =
    schema._validation?.flatMap((group) =>
      group.problems
        .filter((problem) => problem.severity === 'error')
        .map(
          (problem) =>
            `${group.path.map((item) => item.name || item.type).join('.')}: ${problem.message}`,
        ),
    ) || [];
  if (missing.length || errors.length) {
    throw new Error(
      `Sanity schema failed:\n${missing.map((type) => `Missing type: ${type}`).join('\n')}\n${errors.join('\n')}`,
    );
  }
  process.stdout.write(`Sanity schema valid: ${expected.join(', ')}\n`);
} finally {
  await unlink(temporaryModule).catch(() => {});
}
