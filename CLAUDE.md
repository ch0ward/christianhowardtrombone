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
- **Voice:** restraint. Confidence, not ornamentation.
- **Audience, in priority order** (`[[christian-howard-website-planning-doc]]` §1):
  artist-roster and industry contacts first — the Greg Black outreach is live, and whoever
  evaluates a roster application Googles him before reading anything. Then search
  committees and prospective students. Home serves the first group; Teaching serves
  students and their families. Don't write any page for "everyone."
- **Person, by page:** third person for Home and About, first person on Teaching,
  addressed to "you." Confirmed deliberate 2026-08-14. The About bio stays third person
  because it is the block that gets lifted verbatim into concert programs, press kits,
  and other people's sites — first person there means maintaining a second copy forever.
  Teaching is Christian talking to a prospective student. **Never mix the two within a
  single page**; that is what actually reads as sloppy, not the split itself.
- **Not date-heavy.** Prose that lists years reads as a CV and sells nothing to a family
  choosing a school. Dates belong in the credentials list and, when it ships, on the CV
  page. Keep "each of the last three years" over a litany of seasons.
- **Say each fact once, on the page whose audience needs it.** Brass Methods is
  versatility evidence for a search committee, so it lives on About; it was cut from
  Teaching, where the reader is a prospective trombone student who isn't choosing on it.

## Copy standard — read this before writing a sentence

Every rule below came from a line that shipped badly and had to be rewritten. The site
is small enough that one limp sentence is a measurable share of it.

- **No academic-administrative register.** This is a website, not a faculty annual
  report. Banned outright: "instructor of record," "primary teacher of record," "applied
  lessons," "degree tracks," "portfolio careers," "scholarship consideration." Exact
  position titles are the one exception; those stay verbatim. ("Broader performing
  record" is fine — Christian likes it, and it's plain English, not jargon.)
- **No musician shorthand a parent won't parse.** "Build an audition" means prepare for
  one. Say that.
- **If a relative clause is doing the work of one word, use the word.** "Students who
  play in the ensembles without majoring in music" is "non-majors." This is the single
  worst failure mode here — long, technically-accurate constructions that no human would
  say out loud.
- **No contractions anywhere, including Teaching.** Christian's call, 2026-08-14, after
  a draft that used them. The register across the whole site is formal; Teaching earns
  its warmth from being in first person and addressed to "you," not from sounding
  casual. "You will play in studio class," not "you'll."
- **No selling, no comparatives, no brag.** A draft line offered a sample lesson and
  added that it "tells us both far more than an audition day can." Christian runs those
  audition days. State what is on offer and stop: "you are welcome to arrange a sample
  lesson with me before you audition, at no cost."
- **Plain is not the same as vague.** "Work back to what your body has to do to make it"
  traded jargon for mush. Name the actual things: "work back to the breath, the
  embouchure, and the motion that produce it."
- **Home stays brief: hero, bio, one video, contact.** Nothing else. A "Read the full
  biography" link was added during Phase 2 and removed on 2026-08-14 — About is already
  in the nav, so the link was redundant, and Christian wants the page to stay the length
  it launched at. Resist adding to it.
- **The Home bio is fixed copy. Do not rewrite it.** It is the short bio marked "FINAL,
  ship as written" in `[[christian-howard-website-planning-doc]]` §5, and it is reused
  verbatim in his email signature, program books, and roster outreach. Editing it here
  silently forks it from every other place it appears. The site's one intentional
  deviation is "Dr. Christian Howard," which the Phase 1 build added and which reinforces
  that the DMA is conferred. Its opening clause — "active across orchestral, chamber, and
  solo settings on alto, tenor, bass trombone, and euphonium" — was rewritten once as
  boilerplate and restored on request. Leave it alone.
- **"His students" on Home, "previous students" elsewhere.** Home carries the fixed short
  bio, which reads "His students have gone on to…". About and Teaching use "previous
  students" per Christian's 2026-08-14 preference. The planning doc's own note is that CV
  and application materials want "students I have taught and coached," because committees
  read the credit distinction — that is a third register for a third audience, and it is
  deliberate, not drift.
- **One list per sentence, maximum.** Two lists in one sentence is the tell that a
  sentence is doing a database's job. Split it.
- **No sentence over ~38 words.** Check the built HTML, not the source.
- **Don't repeat a proper noun in adjacent sentences.** "At the University of Minnesota …
  he taught Brass Methods at the University of Minnesota" becomes "… at Minnesota."
- **Don't start three consecutive sentences with "He."**
- **About follows the peer-bio breakdown: Teaching → Orchestral → Chamber → Festivals and
  guest work → Research → Education.** Taken from the Jeremy Marks bio, which is the
  positioning model in `[[umn-trombone-search-master-plan-v1-1]]` §25 and is reproduced in
  `[[christian-howard-website-planning-doc]]` context. One "Performance" heading was
  hiding three different kinds of work — a titled orchestral chair, chamber membership,
  and one-off guest artistry all read as equivalent when stacked in one section, which
  flattens the strongest credential. Keep the categories separate even when one of them is
  a single sentence; a short Chamber section is honest and will grow when Recordings ships.
- **Bio prose names the engagement and the role. It never narrates the tasks.** A first
  draft of the honor band work read "screening the recorded auditions and teaching the
  trombone masterclass" — that is a job description, and it is why the paragraph read as
  a list with connectives rather than as a biography. "He leads the trombone division of
  the High School Honor Band" is the bio sentence. The mechanics belong on the CV.
- **Name each institution once and hang every role off it.** Two roles at the University
  of Minnesota belong in one clause, not two sentences that repeat the name. This is what
  turns an enumeration into prose.
- **When content is list-shaped, build a list.** Student outcomes are four categories
  crossed with several names each. Three separate attempts to write them as a paragraph
  all read as awkward, because the problem was the structure, not the wording. They are a
  `<dl class="outcomes">` on Teaching now. About keeps a two-sentence summary, matching the
  flat-list style of the approved Home bio. If a sentence resists three rewrites, stop
  rewriting and ask what shape the content actually is.
- **Name a thing the same way everywhere.** The Chautauqua Music School Festival Orchestra
  is where Christian played and where a student went; About and Teaching had it under two
  different labels, which reads as two unrelated facts and throws away the more
  interesting one. Same for exact position titles and ensemble names across pages.
- **Private lessons are advertised, in person and online.** He has an active private studio
  in the Twin Cities. Don't describe the sample lesson as free or "at no cost" — the offer
  stands on its own, and pricing language does not belong on this page.
- **Never inflate while smoothing.** Merging a guest-artist credit with three attendances
  into one tidy clause silently promoted all four. Compression is where overstatement
  gets introduced; re-check every claim against
  `[[christian-howard-music-master-context]]` after a rewrite, not before.
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
- **Student outcomes say "previous students."** Christian's call, 2026-08-14, overriding
  the older "students I taught, coached, or mentored" phrasing on this site — that
  formula is hedge-fluff on a web page, and the shorter phrase is both plainer and more
  specific. The rule it was protecting still stands: **never imply he caused a placement
  or an admission**, and don't inflate the King's Brass touring position to the level of
  an orchestral or military-band appointment. Application materials may still want the
  broader phrase; see `[[christian-howard-music-master-context]]` §8.
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
3. **Recordings.** *Gate is closer than the vault suggested* — see
   `[[christian-howard-website-planning-doc]]` §7. Three assets are already in hand: the
   brass ensemble solo feature (currently on Home), a quintet performing a challenging
   work, and euphonium *Songs of Travel* from the DMA recital, which is worth having
   because it shows the second instrument at doctoral level. Two are not: the organ
   recordings are still coming, and the UNW Wind Ensemble track is audio-only and needs a
   static title card or performance photo so it doesn't sit as a dead thumbnail beside
   moving video. **The page can ship with the three in hand.** Label everything with
   piece, ensemble, and date. The Home video moves here when the organ recordings land
   and replace it. Don't lead with the quintet — a viewer has to work out which player is
   Christian.
4. **Performances.** *Not in the vault before 2026-08-14; spec is
   `[[christian-howard-website-planning-doc]]` §10.* **The only page on this site that can
   actively hurt him** — every other page ages fine, but a stale performance calendar
   tells a visitor he has stopped playing.
   - **Title it "Performances," never "Upcoming Performances."** That one word is most of
     the fix: when the upcoming list empties between seasons, the page still reads as an
     active career rather than an abandoned calendar.
   - Upcoming on top, past below. One line per entry: date, ensemble, program, venue.
   - No ticket links unless he is selling the tickets. The audience is roster contacts
     and search committees, not a ticket-buying public.
   - *Gate — and it is a real one:* Christian has to commit to a monthly five-minute
     maintenance pass. **If that will not honestly happen, do not build the page.** A
     missing performances page costs nothing; a stale one costs credibility with exactly
     the people the site is for.
5. **CV.** Styled page with a prominent PDF download at the top. Don't rebuild CV
   formatting in HTML. *Gate:* current CV finalized.
6. **Research.** Build it, don't ship the link, until `[[songs-of-travel-publication]]`
   status changes. Full title: *Interpreting the Voice: Vocal Interpretation and
   Pedagogical Applications in a Trombone Transcription of Selections from Vaughan
   Williams's Songs of Travel* (University of Minnesota, 2026). Advisors Marissa Benedict
   and Tom Ashworth; includes an interview with Weston Sprott. *Gate:* two source errors
   fixed before anything is quoted publicly — two sections both numbered 3.2, and
   "Whither While I Wander" in Figures 14, 16, and 18. Frame around the low brass argument
   as phonetic and interpretive (voiced/voiceless, plosive/fricative/nasal/approximant,
   textual stress, rubato, text painting), not slide-dependent — the one genuinely
   trombone-specific passage is the natural-vs-tongued legato discussion in §3.2. **Don't
   describe the DMA itself as a low brass study**; the completed dissertation is a
   trombone project and says so. The *publication* can reach wider than the research did.

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
