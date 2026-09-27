import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const packageJson = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const minimumNode = [22, 12, 0];
const currentNode = process.versions.node.split('.').map(Number);
const env = { ...readEnvFile(resolve(root, '.env')), ...process.env };
let errors = 0;
let warnings = 0;

function report(kind, message) {
  const label = kind === 'error' ? 'ERROR' : kind === 'warning' ? 'NOTE' : 'OK';
  console.log(`${label} ${message}`);
  if (kind === 'error') errors += 1;
  if (kind === 'warning') warnings += 1;
}

function versionAtLeast(actual, minimum) {
  for (let index = 0; index < minimum.length; index += 1) {
    if ((actual[index] ?? 0) > minimum[index]) return true;
    if ((actual[index] ?? 0) < minimum[index]) return false;
  }
  return true;
}

function readEnvFile(path) {
  if (!existsSync(path)) return {};
  const values = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/, '');
    }
    values[match[1]] = value;
  }
  return values;
}

function configured(name) {
  return typeof env[name] === 'string' && env[name].trim().length > 0;
}

report(
  versionAtLeast(currentNode, minimumNode) ? 'ok' : 'error',
  `Node.js ${process.versions.node}${versionAtLeast(currentNode, minimumNode) ? ' meets' : ' is below'} the required minimum 22.12.0.`,
);

const expectedPnpm = packageJson.packageManager?.match(/^pnpm@(\d+\.\d+\.\d+)/)?.[1];
if (!expectedPnpm) {
  report('warning', 'package.json does not pin a pnpm version.');
} else {
  try {
    const installedPnpm = execFileSync('pnpm', ['--version'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    report(
      installedPnpm === expectedPnpm ? 'ok' : 'warning',
      `pnpm ${installedPnpm}${installedPnpm === expectedPnpm ? ' matches' : ' differs from'} the repository version ${expectedPnpm}.`,
    );
  } catch {
    report('warning', `pnpm ${expectedPnpm} is required but was not found on PATH.`);
  }
}

if (!existsSync(resolve(root, 'node_modules'))) {
  report('warning', 'Dependencies are not installed yet; run pnpm install --frozen-lockfile.');
} else {
  report('ok', 'Dependencies are installed.');
}

if (!existsSync(resolve(root, '.env'))) {
  report(
    'warning',
    'No local .env file was found. Copy .env.example to .env if you need local Sanity or preview configuration.',
  );
}

const hasProjectId = configured('PUBLIC_SANITY_PROJECT_ID');
const hasDataset = configured('PUBLIC_SANITY_DATASET');
if (!hasProjectId) {
  report('ok', 'No Sanity project ID is configured; the local site uses sample content.');
} else {
  report(
    'ok',
    'A Sanity project ID is configured; the site will load Sanity content instead of sample content.',
  );
  if (!hasDataset) report('error', 'PUBLIC_SANITY_DATASET is missing.');
  if (
    configured('SANITY_STUDIO_PROJECT_ID') &&
    env.SANITY_STUDIO_PROJECT_ID !== env.PUBLIC_SANITY_PROJECT_ID
  ) {
    report('error', 'The website and Studio project IDs do not match.');
  }
  if (
    configured('SANITY_STUDIO_DATASET') &&
    configured('PUBLIC_SANITY_DATASET') &&
    env.SANITY_STUDIO_DATASET !== env.PUBLIC_SANITY_DATASET
  ) {
    report('error', 'The website and Studio dataset names do not match.');
  }
}

if (configured('PUBLIC_SITE_URL') && /example\.com/i.test(env.PUBLIC_SITE_URL)) {
  report(
    'ok',
    'The example site URL placeholder is configured; keep it until the real launch URL is ready.',
  );
} else if (!configured('PUBLIC_SITE_URL')) {
  report(
    'warning',
    'PUBLIC_SITE_URL is not configured; set the intended HTTPS site URL before launch.',
  );
} else {
  report(
    'warning',
    'A public site URL is configured. Confirm the content is approved before allowing search indexing.',
  );
}

if (configured('SANITY_READ_TOKEN') && configured('PREVIEW_SECRET')) {
  report('ok', 'Draft preview secrets are both configured (values were not displayed).');
} else {
  report(
    'warning',
    'Draft preview is not fully configured; this is optional for editing and publishing.',
  );
}

console.log(
  `\nSetup check finished with ${errors} error(s) and ${warnings} note(s). No environment values were displayed.`,
);
process.exitCode = errors > 0 ? 1 : 0;
