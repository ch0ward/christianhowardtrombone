# christianhowardtrombone.com

Phase 1. One page, no build step, no dependencies. Edit the HTML and CSS directly.

```
index.html        the page
styles.css        all styles
CNAME             tells GitHub Pages the custom domain
robots.txt        crawler rules + sitemap pointer
sitemap.xml       one URL for now
_headers          security headers (ignored by GitHub Pages, used if you ever move to Cloudflare)
favicon.ico
img/              hero (3 widths x 2 formats), OG image, icons
```

---

## What still needs filling in

**1. Contact.** Replace `LINKEDIN_URL_HERE` with your LinkedIn profile URL. This is the only thing blocking launch. When `christian@chtrombone.com` goes live, swap that whole link for the mailto version shown in the `SWAP POINT` comment.

**2. The piece title.** The video caption currently reads "Compass Rose Brass Ensemble · April 2023" with no piece named. Add it to both the `<p class="video__caption">` and the iframe's `title` attribute. An unnamed piece is the one thing a musician reading this page will notice immediately.

**3. Read "About the video" at the bottom of this file** before you consider the video settled.

The embed uses `youtube-nocookie.com` rather than `youtube.com`. Same player, no tracking cookie set until someone presses play. Worth keeping when the Teaching page arrives and minors are on the site.

---

## Deploying to GitHub Pages

You need a GitHub account. On the free plan Pages only serves from a **public** repo, so the source is visible. Fine for this content, but keep the repo to exactly what ships. Nothing with a home address, no CV drafts. Removing a file later does not remove it from commit history.

1. Create a new public repo. Name it anything, `christianhowardtrombone` is fine.
2. Push these files to the root of the `main` branch.
3. Repo → **Settings** → **Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. Wait for the first deploy, then confirm it works at `https://<username>.github.io/<repo>/`.
5. Still on the Pages settings screen, enter `christianhowardtrombone.com` under Custom domain. The `CNAME` file in this repo already declares it, so this should match immediately.
6. Add the DNS records below at Porkbun.
7. Come back to Pages settings and tick **Enforce HTTPS**. The certificate can take up to 24 hours to issue, so if the checkbox is greyed out, it isn't broken, just wait.

### DNS at Porkbun

Your nameservers stay at Porkbun. Nothing about your email setup changes.

| Type | Host | Value |
|---|---|---|
| A | *(blank / apex)* | 185.199.108.153 |
| A | *(blank / apex)* | 185.199.109.153 |
| A | *(blank / apex)* | 185.199.110.153 |
| A | *(blank / apex)* | 185.199.111.153 |
| AAAA | *(blank / apex)* | 2606:50c0:8000::153 |
| AAAA | *(blank / apex)* | 2606:50c0:8001::153 |
| AAAA | *(blank / apex)* | 2606:50c0:8002::153 |
| AAAA | *(blank / apex)* | 2606:50c0:8003::153 |
| CNAME | www | `<username>.github.io` |

### The short domain

`chtrombone.com` does not need hosting. In Porkbun, use **URL Forwarding** on that domain, pointed at `https://christianhowardtrombone.com`, type 301 permanent, with HTTPS enabled.

---

## Before you call it live

- Load it on a phone over cell data, not wifi. Your laptop's DNS cache will lie to you about whether the domain actually resolves.
- Paste the URL into a LinkedIn message draft or an email and confirm the preview card shows your photo and the bio line. That's the `og:` tags doing their job.
- Run Lighthouse in Chrome DevTools. A page this simple should score at or near 100 on performance, accessibility, best practices, and SEO. Anything below that means something regressed.
- Search your own name in an incognito window a week after launch and see where the site lands.

---

## Notes on the build

**The hero is full-bleed**, filling the viewport at any size. The photo is an `<img>` with `object-fit: cover` rather than a CSS background, so it still gets a `srcset`, an `alt`, and priority loading. The one value worth knowing is `object-position: 66% 22%` in `styles.css`, which is what keeps his face in frame as the viewport aspect changes. Nudge those two numbers if a crop ever looks wrong on an unusual screen.

**The scrim** is the gradient sitting between photo and text. It runs dark on the left, where the type is, and clears on the right so the photo reads. If the name ever looks thin against a lighter photo, raise the first two alpha values.

**Type** is Cormorant Garamond for the name, bio, and contact link, Inter for everything else, both from Google Fonts with Georgia and system sans as fallbacks. Cormorant is what gives the page its weight, so if it fails to load the page still works but loses most of its character.

**Colors** are six CSS custom properties at the top of `styles.css`. Change them there and they propagate everywhere.

**Images** are served through a `srcset`. A phone pulls the 1600px WebP, a desktop pulls the 2400px, and the JPEGs cover anything that can't do WebP.

**Content-Security-Policy** is set via a `<meta>` tag, since GitHub Pages can't set response headers. It allows Google Fonts and the YouTube embed and blocks everything else, including all JavaScript. There is no JS on this page and there doesn't need to be.

**What's deliberately not on the homepage:** the Minnesota Orchestra substitute work. It stays in the bio paragraph, where "frequent substitute with" qualifies itself. Listed as a bare line next to two titled positions it reads as a claim you'd have to walk back.

---

## About the video

The homepage embed is `GPaUuTGZofM`, opening at 12:30 via `start=750` so playback lands on the feature instead of the top of the concert.

**It is hosted on the "Zach Gingerich" channel, not on @christianhowardtrombone.** That has four consequences worth weighing:

- You cannot set the thumbnail. YouTube's auto-picked frame is what viewers see before pressing play, and your own plan called for a custom thumbnail on every video.
- You cannot retitle it. It currently reads "2023 04 16 Compass Rose Brass Ensemble", which is a camera date-stamp rather than a label with the piece in it.
- If that channel deletes the video, makes it private, or the account lapses, your homepage video breaks and nothing tells you.
- "Watch on YouTube" sends the viewer to that channel, not yours, so the traffic your site generates builds someone else's subscriber count.

The fix, assuming Zach is fine with it, is to upload your own copy to @christianhowardtrombone, trimmed to the feature, titled with piece, ensemble, and date, with a custom thumbnail framed tight enough to read at small size. Then swap the ID in `index.html` and drop the `start=750`, since the clip would already begin in the right place.

Until then the current embed works and is worth shipping over an empty box.
