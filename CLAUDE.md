# christianhowardtrombone.com — Claude Code Operating Guide

Personal site for Christian Howard, trombonist and educator. Hand-written HTML/CSS,
built with Eleventy, deployed to GitHub Pages. Durable brand, decisions, and project
state live in the second brain: `[[trombone-website-build]]`,
`[[trombone-website-build-log]]`, `[[Trombone Career]]`.

This repo has **no README by design** — the original one carried editorial notes about
credentials and video rights that had no business on a public repo. Operating
instructions go here, in `CLAUDE.md`, which is for Claude sessions, not visitors.

## What this is

Static site. No client-side JavaScript at all, no framework, no CSS pipeline. Eleventy
is the only dependency, and it exists solely so the header, footer, and nav live in one
file instead of being hand-copied across pages. Desktop first load is ~216KB including
the full-viewport hero photo — treat that as a budget, not a trivium.

Phase 1 (live since 2026-08-13): single page — full-bleed hero, name, affiliations,
short bio, one embedded video, contact.
Phase 2 (in progress): Home, About, and Teaching are built. Recordings, CV, and
Research are not, and each is gated — see below.

## Build and preview

```
npm install
npm run build     # → _site/
npm run serve     # → http://localhost:8080
```

`.claude/launch.json` runs `npm run serve` for live preview and screenshot QA. On a site
whose entire job is visual, verify hero framing and image sizing across breakpoints by
looking, not by reasoning about CSS.

**Eleventy's live-reload does not work here.** The dev server injects
`/.11ty/reload-client.js`, and the page's own CSP (`script-src 'none'`) blocks it. That
is the CSP doing its job. Reload the browser by hand after an edit.

## Deploy safety — production discipline

**`main` auto-deploys to production, and production is what search committees see.**
This site exists to support a faculty job application. A broken page is a broken first
impression, and nothing will alert you.

- Never commit non-trivial changes straight to `main`.
- Work on a branch, open a PR, verify the build, then merge to deploy.
- Protect `main` (require PR). Treat a merge like a live production push, because it is.
- After any deploy touching layout or assets, verify on a real phone, not just desktop.

Deployment runs through `.github/workflows/deploy.yml` (`npm ci` → `npm run build` →
upload `_site/`). **Settings → Pages → Source must be "GitHub Actions", and it must be
changed before the Eleventy structure reaches `main`.**

Phase 1 used "Deploy from a branch / `main` / root", which serves the repo root directly.
The repo root no longer contains an `index.html` — the pages are built into `_site/`,
which is gitignored. Merging on the old setting therefore does not merely fail to
deploy; it **takes the live site down** and serves a 404 at the canonical domain. Flip
the setting first, then merge.

## Architecture

```
.eleventy.js              config: input src/, output _site/
.github/workflows/        Pages build + deploy
src/
  _data/site.js           canonical URL, OG image, nav array
  _includes/base.njk      the one shared head/nav/footer
  index.njk               Home
  about.njk               About        → /about/
  teaching.njk            Teaching     → /teaching/
  sitemap.njk             generated from collections.all
  styles.css              the whole stylesheet
  img/                    hero + OG images
  *.png, favicon.ico      icons, copied to the site root
  CNAME, _headers, robots.txt
```

**Adding a page:** create `src/<name>.njk` with `layout: base.njk`, a `permalink`, a
`title`, and a `description` under 160 characters. Then add it to the `nav` array in
`src/_data/site.js` — **in the same commit, never before.** The sitemap picks it up
automatically.

## Brand — enforce on every output

Taken from the live build. Do not improvise new values; if something isn't specified
here, match what exists or ask.

```
--bg      #14120F   page background
--ink     #F2EEE6   body text
--muted   #A79E90   captions, metadata
--accent  #C9A063   links, eyebrow (brass)
--rule    #2E2A23   hairlines
--panel   #1D1A15   video frame fill
```

- **Type:** Cormorant Garamond for the name, page headings, bio, and contact link. Inter
  for everything else. Google Fonts, with Georgia and system sans as fallbacks.
- **Hero pattern:** an `<img>` with `object-fit: cover`, not a CSS background, so it keeps
  `srcset`, `alt`, and priority loading. `object-position: 66% 22%` keeps the face in
  frame as viewport aspect changes. The scrim is a 100deg gradient, heavy where type
  sits, clearing where the photo needs to read.
- **Nav:** overlaid on the hero on Home (`.nav--over-hero`, absolute, aligned to the
  1400px hero measure); in flow with a hairline on interior pages, aligned to the 820px
  content measure. No JavaScript, so there is no hamburger — the links wrap.
- **Voice:** restraint. The audience is a search committee chair opening this between
  meetings. Confidence, not ornamentation.
- **Person, by page:** third person for Home and About (they're biography). First person
  on Teaching, addressed to "you" — that page is written for prospective students and
  their families, not for a committee. Don't mix within a page.
- **Not date-heavy.** Prose that lists years reads as a CV and sells nothing to a family
  choosing a school. Dates belong in the credentials list and, when it ships, on the CV
  page. Keep "each of the last three years" over a litany of seasons.
- Dark, full-bleed, edge-to-edge. Every peer site in the research sample does this; a
  contained photo in a column reads as a document next to their posters.

**Never use `&nbsp;` in a heading.** Both `.hero h1` and `.pagehead h1` clipped their
last letters below ~375px because a non-breaking space stopped the name from wrapping,
and `.hero`'s `overflow: hidden` hid the damage instead of surfacing it. Let headings
wrap.

## Content rules — non-negotiable

These come from the brain and outrank any local judgment call. When in doubt, ask rather
than guess.

- **No LinkedIn link anywhere.** See `[[2026-08-13-decision-no-linkedin-on-music-site]]`.
  The site exists partly to keep a search committee away from a profile that opens with
  the ecommerce career.
- **No ecommerce or business career content.** It's a differentiator in application
  materials, not on this site.
- **No placeholder pages, no "coming soon," no greyed-out nav items.** A nav link ships
  in the same commit as the page it points to.
- **Titles are exact.** "Visiting Lecturer of Trombone and Euphonium" at UMN. Spell out
  "Duluth Superior Symphony Orchestra" in full, everywhere. Never "ABD" — the DMA was
  conferred April 2026.
- **Minnesota Orchestra is substitute work.** It belongs in bio prose where "frequent
  substitute with" qualifies it, never as a bare line stacked beside two titled positions.
- **Student outcomes use accurate attribution:** "students I taught, coached, or
  mentored." Never imply sole credit for a placement or admission. Don't inflate the
  King's Brass touring position to the level of an orchestral or military-band appointment.
- **Songs of Travel is not published.** Don't write "forthcoming," "accepted," or
  "published" until one is actually true.
- **UNW is current, confirmed 2026-08-14.** Christian still teaches low brass at the
  University of Northwestern – St. Paul; the site states it in the present tense on Home,
  About, and Teaching. Still unconfirmed: whether the "Brass Ensemble Director" half of
  the recorded title is active. Don't add it without asking.
- **Outbound links go to programs, not to faculty bios.** See
  `[[2026-08-14-decision-teaching-page-links-to-programs]]`. A prospective student's next
  action is auditioning, so the link belongs on the school's program and audition pages.
  A faculty bio repeats the About page, foregrounds the temporary UMN title, and breaks
  when an appointment changes.

## Security

Content-Security-Policy is set via a `<meta>` tag in `base.njk`, since GitHub Pages cannot
set response headers. It permits Google Fonts and the YouTube embed and blocks everything
else, including all JavaScript, of which the site has none. Keep it that way — if
something seems to need JS, that's a conversation, not a commit.

Video embeds use `youtube-nocookie.com`, which sets no tracking cookie until playback
starts. **This matters more now that the Teaching page can bring minors onto the site.**

## Phase 2 — what's left, and its gates

Build order, each shipping only when its gate clears. Nothing here blocks anything else.

1. ~~**Teaching**~~ — built, and rebuilt on 2026-08-14 around the two studios rather than
   around a philosophy statement. It leads with a sample-lesson invitation, gives each
   studio its own block with links out to that school's program and audition pages, then
   student outcomes, then a short "In lessons" section. The full teaching statement
   belongs in the application packet, not here. Outcomes list programs only; no students
   are named.
2. ~~**About**~~ — built. Long bio written from
   `[[christian-howard-music-master-context]]`, teaching before performance, with dates
   stripped out of the prose. The ATW panel referenced in the original plan is not in the
   vault and is not on the page.
3. **Recordings.** *Gate:* the two organ recordings, plus a static title card or
   performance photo for the audio-only UNW Wind Ensemble track so it doesn't sit as a
   dead thumbnail beside moving video. All assets labeled with piece, ensemble, and date.
   The homepage video moves here when this ships.
4. **CV.** Styled page with a prominent PDF download at the top. Don't rebuild CV
   formatting in HTML. *Gate:* current CV finalized.
5. **Research.** Build it, don't ship the link, until `[[songs-of-travel-publication]]`
   status changes. *Gate:* two source errors fixed before anything is quoted publicly —
   two sections both numbered 3.2, and "Whither While I Wander" in Figures 14, 16, and 18.
   Frame around the low brass argument as phonetic and interpretive, not slide-dependent,
   and don't describe the DMA itself as a low brass study.

## Known issue — homepage video

The featured video is hosted on `[[Zach Gingerich]]`'s channel, not Christian's. Rights
are settled (co-performer, consented), but the thumbnail can't be set, the title reads as
a camera date-stamp with no work named, "Watch on YouTube" builds Zach's subscriber count,
and **if that channel deletes or privates the video the homepage breaks silently.** The
fix is a re-upload to Christian's own channel, trimmed and titled, then swap the embed ID
and drop the `start` parameter.

## Session hygiene

- Commit per verified change. Branch, PR, merge.
- **Persist durable decisions to the brain, not just chat.** Update
  `[[trombone-website-build]]` with state and next actions; anything that closes a real
  question gets a decision file. A decision that only exists in a chat log is a decision
  you'll re-litigate in six months.
- Read `[[trombone-website-build]]` at session start before touching anything.
