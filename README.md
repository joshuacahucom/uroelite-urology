# UroElite Urology Clinic — static rebuild

A static, performance-tuned recreation of [uroeliteurology.com](https://uroeliteurology.com/), deployed on Vercel.

The original site is a client-rendered React app (~830 KB of JavaScript). This rebuild keeps the same
markup, Tailwind classes, copy, images and behaviour, but ships plain HTML with:

- **Inlined, purged CSS** per page (no render-blocking stylesheet requests)
- **Self-hosted, subset fonts** (Plus Jakarta Sans + DM Serif Display, preloaded)
- **Responsive WebP images** (`srcset`/`sizes`, hero image preloaded with `fetchpriority="high"`)
- **One ~6 KB script** (`assets/app.*.js`, readable source in `src/app.js`) for the booking modal,
  mobile menu, accordions, reviews carousel, service/FAQ/blog filters, newsletter toast and scroll-to-top
- **Deferred third parties**: the LeadConnector chat widget, Meta Pixel, hero video, Google Maps and the
  embedded booking calendar load on the visitor's first interaction (scroll, tap, mouse move or key press)
- Server-rendered `<title>`, meta description, canonical and JSON-LD on every page
  (the original only sets most of these client-side)

## Structure

```
index.html, services.html, … one file per route (Vercel cleanUrls serves /services etc.)
blog/*.html                 blog posts
assets/app.<hash>.js        runtime (minified from src/app.js)
assets/img/*.webp           responsive images
assets/fonts/*.woff2        subset fonts
vercel.json                 clean URLs + long-lived caching for /assets
sitemap.xml, robots.txt
```

## Local preview

```bash
npx serve .
```

## Notes

- Booking widget: `https://schedule.uroeliteurology.com/widget/booking/1WgOJFGMAdXu2MXvcGYC`
- The original's rotating "X just booked" popup used hard-coded sample names; only the genuine
  booking-confirmation notice (triggered by the booking widget's `postMessage`) is kept.
- `/mens-health-cebu` is listed in the original sitemap but errors on the live site, so it is omitted.
