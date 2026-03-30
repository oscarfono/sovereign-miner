# The Sovereign Miner

FIFO life, financial independence, and retiring on your terms.

**Stack:** Hugo · Hugoplate · Tailwind CSS · Cloudflare Pages · Cloudflare Workers
**Domain:** sovereign-miner.com

---

## Prerequisites

- Hugo extended >= 0.124.0
- Node.js >= 18 and npm (required by Hugoplate's Tailwind build)
- A Cloudflare account (already managing the domain)

---

## Project Structure
```
sovereign-miner/
├── hugo/                          ← Hugo site (Cloudflare Pages)
│   ├── hugo.toml                  ← Base URL, title, pagination
│   ├── config/_default/
│   │   ├── params.toml            ← Logo, SEO, search, social links
│   │   ├── menus.toml             ← Navigation
│   │   └── languages.toml        ← Language settings
│   ├── data/
│   │   └── theme.json             ← Colours and fonts
│   ├── content/                   ← All posts and pages (Markdown)
│   │   ├── about/
│   │   ├── authors/
│   │   └── blog/
│   ├── layouts/                   ← Hugoplate template overrides
│   │   ├── page/
│   │   │   └── contact.html       ← Custom contact form layout
│   │   └── shortcodes/            ← accordion, notice, button
│   └── assets/
│       ├── css/                   ← Custom CSS (extends Tailwind)
│       └── images/                ← All post and section images
├── worker/                        ← Cloudflare Worker (contact form handler)
│   ├── src/                       ← Worker source
│   ├── schema.sql                 ← D1 database schema
│   ├── wrangler.toml              ← Worker configuration
│   ├── package.json
│   └── SETUP.md                   ← Worker setup instructions
├── design/                        ← Logo and badge source files
├── .env.example                   ← Credential template (copy to .env)
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

> `hugo/themes/` is gitignored. The theme is pulled as a Hugo module at build time.

---

## Local Development
```shell
# Clone the repo
git clone https://github.com/oscarfono/sovereign-miner.git
cd sovereign-miner/hugo

# Fetch Hugo module dependencies (pulls theme)
hugo mod get

# Install npm dependencies (Tailwind build pipeline)
npm install

# Serve locally with drafts visible
hugo server -D
```

Local server runs at `http://localhost:1313`. Drafts (`draft: true`) are only visible with the `-D` flag.

---

## Writing Posts

Posts are written directly in Markdown and live in `hugo/content/blog/`.

Front matter is YAML. Required fields:
```yaml
---
title: "Post Title"
meta_title: "SEO title if different"
description: "One or two sentence description for SEO and social sharing."
date: 2026-01-15
image: "/images/your-post-image.jpg"
categories: ["FIFO Life"]
author: the-sovereign-miner
tags: ["tag-one", "tag-two"]
slug: "your-post-slug"
draft: false
---
```

See `CONTRIBUTING.md` for writing style, shortcode usage, and commit conventions.

---

## Images

Images live in `hugo/assets/images/`. This location enables Hugo's image processing pipeline for responsive sizing and WebP generation via the `partial "image"` helper used in layouts.

Reference images in front matter and content as `/images/filename.ext`.
```markdown
{{- partial "image" (dict "Src" "images/my-photo.jpg" "Alt" "Description") -}}

<!-- or plain Markdown for simple cases -->
![Alt text](/images/my-photo.jpg)
```

For photorealistic imagery (equipment, machinery, outback landscapes), use an AI image generator (Midjourney, Adobe Firefly, DALL-E 3) or stock photography rather than SVG.

---

## Customisation

| File | Purpose |
|------|---------|
| `hugo/hugo.toml` | Base URL, title, timezone, pagination |
| `hugo/config/_default/params.toml` | Logo, favicon, SEO, search, social links |
| `hugo/data/theme.json` | Colours and font families |
| `hugo/config/_default/menus.toml` | Navigation menu items |
| `hugo/config/_default/languages.toml` | Language settings |

See `hugo/DEVELOPER_DOCS.md` for full details on changing colours, fonts, layout, and extending Tailwind tokens.

---

## Deployment

The site deploys automatically via **Cloudflare Pages** on every push to `main`. There is no manual deploy step.

**Cloudflare Pages build settings:**

| Setting | Value |
|---------|-------|
| Build command | `hugo mod get && hugo --minify` |
| Build output directory | `public` |
| Root directory | `hugo` |
| Environment variable | `HUGO_VERSION` = *(match local version)* |

To verify a deployed build, check the Cloudflare Pages dashboard for build logs after pushing.

---

## Contact Form

The contact page POSTs JSON to a **Cloudflare Worker** at `https://api.sovereign-miner.com/contact`. The Worker validates the payload and writes submissions to a Cloudflare D1 database.

- Worker source: `worker/src/`
- Worker config: `worker/wrangler.toml`
- D1 schema: `worker/schema.sql`
- Endpoint configured via `contact_form_action` in `hugo/config/_default/params.toml`
- CORS locked to `sovereign-miner.com`
- Frontend validation handled in vanilla JS within `layouts/page/contact.html`

For Worker setup and deployment instructions, see `worker/SETUP.md`.
