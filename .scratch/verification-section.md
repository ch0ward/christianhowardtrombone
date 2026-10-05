## Verification — the rules are enforced, not remembered

```
npm run verify        # clean, build, then check the built output
```

`tools/verify.mjs` checks the built HTML in `_site/` against the rules in this file, and
**the Pages workflow runs it on every pull request.** A violation fails the check, so it
is caught on the PR and never reaches `main`. No dependencies; it reads the build.

Enforced today: one `<h1>` per page · meta description ≤160 · OG tags and canonical
present · no sentence over 38 words · no contractions · no `&nbsp;` in an `<h1>` · banned
academic register · "the University of Northwestern", never bare · no LinkedIn · never
"ABD" · "DSSO" spelled out · no executable JavaScript · nav links resolve to real pages ·
every referenced image exists · no `border-radius` · homepage weight budget.

**Two things it deliberately does not do.**

*Horizontal overflow at 320 / 375 / 768 / 1366* needs a real browser and is still a human
step. So is looking at the hero. The preview pane's screenshots degrade after heavy use —
they start returning black or shrunken frames for pages that render fine. Close the tab and
open a fresh one; don't debug the page.

*It does not judge.* It catches mechanical violations, not a limp sentence or a photograph
that crops him out. Those still need reading and looking.

**Changing a rule means changing two places** — the prose here and the check in
`tools/verify.mjs`. That is deliberate: a rule that exists only as prose gets re-derived
and re-broken, and one that exists only as code loses the reason it was written.

**Test the checker by breaking things**, not by watching it pass:
`node tools/verify.mjs <dir>` takes a directory, so copy `_site`, inject a violation, and
confirm it fires.

