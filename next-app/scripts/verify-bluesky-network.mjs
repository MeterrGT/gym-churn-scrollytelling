import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const embedDir = path.resolve(__dirname, '../public/embeds/bluesky-hashtag-network');

const EXPECTED_INTERACTIVE_NODES = 378;
const EXPECTED_INTERACTIVE_EDGES = 5825;
const EXPECTED_INTERACTIVE_COMMUNITIES = 26;
const EXPECTED_DATA_SHA256 = 'f05651b856858b1f06ae655280f5e96d82217ad664fb7760c1f868ecfa5e537e';

const EXPECTED_FULL_NODES = 7092;
const EXPECTED_FULL_EDGES = 37206;

function assert(condition, message) {
  if (!condition) {
    console.error(`[FAIL] ${message}`);
    process.exit(1);
  }
  console.log(`[PASS] ${message}`);
}

console.log('=== Verifying Bluesky Network Embed & Full Dataset ===');

// 1. Check required files exist and report raw + gzipped sizes
const requiredFiles = [
  'interactive.html',
  'styles.css',
  'data.js',
  'app.js',
  'outputs/hashtags.graphml',
];

for (const rel of requiredFiles) {
  const fullPath = path.join(embedDir, rel);
  assert(fs.existsSync(fullPath), `File exists: ${rel}`);
  const buf = fs.readFileSync(fullPath);
  const gz = zlib.gzipSync(buf);
  console.log(
    `       Size of ${rel}: ${(buf.length / 1024).toFixed(2)} KB raw | ${(gz.length / 1024).toFixed(2)} KB gzipped`
  );
}

// 2. Verify interactive.html is CSP-clean (no inline <style>, no inline <script> body, no style="...")
const html = fs.readFileSync(path.join(embedDir, 'interactive.html'), 'utf8');
assert(!/<style[\s>]/i.test(html), 'interactive.html contains no inline <style> blocks');
assert(!/\sstyle\s*=/i.test(html), 'interactive.html contains no inline style="" attributes');
const scriptTags = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
assert(scriptTags.length === 2, 'interactive.html contains 2 external <script> tags');
for (const [, attrs, body] of scriptTags) {
  assert(/\bsrc\s*=/i.test(attrs) && body.trim() === '', `Script tag is external (${attrs.trim()})`);
}

// 3. Verify interactive visualization subset (378 nodes, 5,825 edges, 26 communities) & SHA-256
const dataJs = fs.readFileSync(path.join(embedDir, 'data.js'), 'utf8');
const prefix = "'use strict';\nconst DATA=";
assert(dataJs.startsWith(prefix), 'data.js starts with strict mode DATA declaration');
const jsonStr = dataJs.slice(prefix.length).trim().replace(/;$/, '');
const data = JSON.parse(jsonStr);

assert(
  Array.isArray(data.nodes) && data.nodes.length === EXPECTED_INTERACTIVE_NODES,
  `Interactive subset node count === ${EXPECTED_INTERACTIVE_NODES} (actual: ${data.nodes?.length})`
);
assert(
  Array.isArray(data.edges) && data.edges.length === EXPECTED_INTERACTIVE_EDGES,
  `Interactive subset edge count === ${EXPECTED_INTERACTIVE_EDGES} (actual: ${data.edges?.length})`
);
assert(
  Array.isArray(data.communities) && data.communities.length === EXPECTED_INTERACTIVE_COMMUNITIES,
  `Interactive subset community count === ${EXPECTED_INTERACTIVE_COMMUNITIES} (actual: ${data.communities?.length})`
);

const actualHash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
assert(
  actualHash === EXPECTED_DATA_SHA256,
  `Interactive DATA normalized SHA-256 matches original (${actualHash})`
);

// 4. Verify full GraphML dataset (7,092 nodes, 37,206 edges)
const graphml = fs.readFileSync(path.join(embedDir, 'outputs/hashtags.graphml'), 'utf8');
const fullNodes = (graphml.match(/<node\s/g) || []).length;
const fullEdges = (graphml.match(/<edge\s/g) || []).length;

assert(
  fullNodes === EXPECTED_FULL_NODES,
  `Full GraphML node count === ${EXPECTED_FULL_NODES} (actual: ${fullNodes})`
);
assert(
  fullEdges === EXPECTED_FULL_EDGES,
  `Full GraphML edge count === ${EXPECTED_FULL_EDGES} (actual: ${fullEdges})`
);

console.log('=== All Bluesky network integrity checks passed! ===');
