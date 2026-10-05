#!/usr/bin/env node
/**
 * House-rules verifier for christianhowardtrombone.com
 *
 * Every check here corresponds to a rule in CLAUDE.md that was written because
 * something shipped badly once. The point is that the rules bind any session --
 * a new Claude, a different account, or you at 11pm -- without anyone having to
 * remember them or re-derive the check.
 *
 * Runs against _site/, so it tests the built output rather than the source.
 * `npm run verify` locally; the Pages workflow runs it on every PR.
 *
 * Rules that need a browser (horizontal overflow at 320/375/768/1366) are NOT
 * here and still need a human with the preview open. See CLAUDE.md.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const SITE = process.argv[2] || "_site";  // overridable so the rules can be self-tested
const fails = [];
const warns = [];
const fail = (rule, where, detail) => fails.push({ rule, where, detail });
const warn = (rule, where, detail) => warns.push({ rule, where, detail });

if (!existsSync(SITE)) {
  console.error("✗ _site/ not found — run `npm run build` first.");
  process.exit(1);
}

// ---------------------------------------------------------------- helpers
const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith(".html")) pages.push(p);
  }
})(SITE);

const label = (p) => p.replace(`${SITE}/`, "/").replace(/index\.html$/, "") || "/";

/** Visible prose only: main content, with headings, definition lists and tags removed. */
function prose(html) {
  let body = html.split("<main")[1] || "";
  body = body
    .replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/g, " ")  // headings are not sentences
    .replace(/<dl[\s\S]*?<\/dl>/g, " ")                 // lists are not sentences
    .replace(/<figure[\s\S]*?<\/figure>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&rsquo;/g, "’").replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&").replace(/&ldquo;|&rdquo;/g, '"').replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ").trim();
  return body;
}

// ---------------------------------------------------------------- per page
for (const file of pages) {
  const html = readFileSync(file, "utf8");
  const where = label(file);

  // --- structure
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail("one-h1", where, `found ${h1s.length}`);

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!desc) fail("meta-description", where, "missing");
  else if (desc.length > 160) fail("meta-description", where, `${desc.length} chars (max 160)`);

  for (const tag of ["og:title", "og:description", "og:image", "og:url"]) {
    if (!html.includes(`property="${tag}"`)) fail("og-tags", where, `missing ${tag}`);
  }
  if (!html.includes('rel="canonical"')) fail("canonical", where, "missing");

  // --- copy standard
  const text = prose(html);
  for (const s of text.split(/(?<=[.!?])\s+/)) {
    // An em-dash standing alone between clauses is punctuation, not a word.
    const n = s.trim().split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
    if (n > 38) fail("sentence-length", where, `${n} words: "${s.trim().slice(0, 70)}…"`);
  }

  // Contractions: match the contraction words explicitly rather than any
  // apostrophe, so possessives (Pershing's, King's, a singer's line) don't trip it.
  const contraction = new RegExp(
    "\\b(it|that|there|here|what|who|you|we|they|i|he|she|let|do|does|did|is|are|was|were|has|have|had|could|would|should|will|ca|wo|ai)" +
    "(n)?['’](s|t|ll|re|ve|d|m)\\b", "gi");
  for (const m of text.match(contraction) || [])
    fail("no-contractions", where, `"${m}"`);

  // Scoped to h1: the rule exists because a non-breaking space in the big display
  // name stopped it wrapping and .hero's overflow:hidden silently clipped it.
  // "St.&nbsp;Paul" in a smaller heading is correct typography, not a bug.
  for (const h of html.match(/<h1[^>]*>[\s\S]*?<\/h1>/g) || [])
    if (h.includes("&nbsp;")) fail("no-nbsp-in-h1", where, h.replace(/<[^>]+>/g, "").trim().slice(0, 40));

  const banned = ["instructor of record", "primary teacher of record", "applied lessons",
                  "degree tracks", "portfolio careers", "scholarship consideration"];
  for (const b of banned)
    if (text.toLowerCase().includes(b)) fail("banned-register", where, `"${b}"`);

  // --- content rules
  for (const m of text.matchAll(/\bNorthwestern\b/g)) {
    const before = text.slice(Math.max(0, m.index - 16), m.index);
    if (!/University of\s+$/.test(before))
      fail("university-of-northwestern", where, `bare "Northwestern" after "…${before.trim()}"`);
  }

  if (/linkedin\.com/i.test(html)) fail("no-linkedin", where, "LinkedIn link present");
  if (/\bABD\b/.test(text)) fail("never-abd", where, "the DMA was conferred");
  if (/\bDSSO\b/.test(text)) fail("spell-out-dsso", where, "spell out Duluth Superior Symphony Orchestra");

  // --- security: no executable JS anywhere (CSP is script-src 'none')
  for (const s of html.match(/<script(?![^>]*application\/ld\+json)[^>]*>/g) || [])
    fail("no-javascript", where, s.slice(0, 50));
}

// ---------------------------------------------------------------- site-wide
// Nav links must resolve to a built page — no placeholder links, ever.
const home = readFileSync(join(SITE, "index.html"), "utf8");
for (const href of [...home.matchAll(/<nav[\s\S]*?<\/nav>/g)]
  .flatMap((m) => [...m[0].matchAll(/href="(\/[^"]*)"/g)].map((x) => x[1]))) {
  const target = href === "/" ? "index.html" : join(href.replace(/^\/|\/$/g, ""), "index.html");
  if (!existsSync(join(SITE, target))) fail("nav-links-resolve", href, "no such page");
}

// Images: everything referenced exists, and everything present is referenced.
const referenced = new Set();
for (const f of pages)
  for (const m of readFileSync(f, "utf8").matchAll(/\/img\/([A-Za-z0-9._-]+)/g)) referenced.add(m[1]);
const present = existsSync(join(SITE, "img")) ? readdirSync(join(SITE, "img")) : [];
for (const r of referenced) if (!present.includes(r)) fail("image-exists", `/img/${r}`, "referenced but missing");
for (const p of present) if (!referenced.has(p)) warn("image-unused", `/img/${p}`, "present but unreferenced");

// AVIF with an odd dimension decodes to pure black from sips, silently: exit 0,
// normal file size, correct dimensions reported. It only shows at the viewport
// width that picks that variant, so a hero looks fine until someone maximises
// the window. Read the ispe box out of the AVIF container and check parity.
function avifDims(file) {
  // An AVIF can carry several ispe boxes — a thumbnail's comes first. Take the
  // largest, which is the primary image.
  const b = readFileSync(file);
  const needle = Buffer.from("ispe");
  let at = 0, best = null;
  while ((at = b.indexOf(needle, at)) !== -1) {
    const w = b.readUInt32BE(at + 8), h = b.readUInt32BE(at + 12);
    if (w > 0 && h > 0 && w < 65536 && h < 65536 && (!best || w * h > best.w * best.h))
      best = { w, h };
    at += 4;
  }
  return best;
}
for (const f of present.filter((n) => n.endsWith(".avif"))) {
  const d = avifDims(join(SITE, "img", f));
  if (!d) { warn("avif-dimensions", `/img/${f}`, "no ispe box — could not read dimensions"); continue; }
  if (d.w % 2 || d.h % 2)
    fail("avif-even-dimensions", `/img/${f}`, `${d.w}x${d.h} — odd dimension, sips writes these black`);
}

// No rounded corners — sharp edges are the system, not an accident.
const css = readFileSync(join(SITE, "styles.css"), "utf8");
const radii = (css.match(/border-radius/g) || []).length;
if (radii) fail("sharp-edges", "styles.css", `${radii} border-radius declaration(s)`);

// Weight budget on the homepage: html + css + the largest image it references.
const kb = (n) => (n / 1024).toFixed(1);
const homeImgs = [...home.matchAll(/\/img\/([A-Za-z0-9._-]+)/g)].map((m) => m[1]);
const heroSizes = homeImgs
  .filter((f) => existsSync(join(SITE, "img", f)))
  .map((f) => statSync(join(SITE, "img", f)).size)
  .sort((a, b) => a - b);
// srcset + <source> means one variant is fetched; a current browser takes the
// smallest modern format offered. Budget against that, and report the spread.
const hero = heroSizes[0] || 0;
const heroWorst = heroSizes[heroSizes.length - 1] || 0;
const base = Buffer.byteLength(home) + statSync(join(SITE, "styles.css")).size;
const firstLoad = base + hero;
const BUDGET = 200 * 1024;
if (firstLoad > BUDGET) fail("weight-budget", "/", `${kb(firstLoad)} KB (budget ${kb(BUDGET)} KB)`);

// ---------------------------------------------------------------- report
const group = (list) => {
  const by = {};
  for (const i of list) (by[i.rule] ||= []).push(i);
  return by;
};
console.log(`\nverify — ${pages.length} pages, first load ${kb(firstLoad)} KB (worst-case variant ${kb(base + heroWorst)} KB)\n`);
for (const [rule, items] of Object.entries(group(warns)))
  for (const i of items) console.log(`  ⚠ ${rule.padEnd(26)} ${i.where}  ${i.detail}`);
for (const [rule, items] of Object.entries(group(fails)))
  for (const i of items) console.log(`  ✗ ${rule.padEnd(26)} ${i.where}  ${i.detail}`);

if (fails.length) {
  console.log(`\n${fails.length} failure(s). Each rule is documented in CLAUDE.md.\n`);
  process.exit(1);
}
console.log(`  ✓ all house rules pass${warns.length ? ` (${warns.length} warning(s))` : ""}\n`);
