# The Sovereign Miner — Repository Workflow

**Author:** Cooper Oscarfono
**Email:** cooper@oscarfono.com
**Site:** [sovereign-miner.com](https://sovereign-miner.com)

This document describes the workflow for maintaining and publishing The Sovereign Miner: commit conventions, content structure, branching, and deployment process. The site is built with Hugo, deployed to Cloudflare Pages.

---

## Repository Structure

```
sovereign-miner/
├── content/              — all posts and pages (Markdown)
│   ├── blog/             — FIFO lifestyle, mining industry, finance posts
│   └── pages/            — about, contact, etc.
├── layouts/              — Hugo layout overrides and custom shortcodes
│   ├── page/
│   │   └── contact.html  — custom contact form (self-hosted API)
│   └── shortcodes/       — accordion, notice, button
├── static/
│   └── images/           — all post and page images
├── assets/               — CSS/JS source (Tailwind)
├── hugo.yaml             — site configuration
├── .gitignore
├── CONTRIBUTING.md       — this document
└── README.md             — setup and local dev instructions
```

---

## Git Identity

Before committing on a new machine, confirm your identity is set correctly:

```shell
git config --global user.name "Cooper Oscarfono"
git config --global user.email "cooper@oscarfono.com"
```

Verify:

```shell
git config --global --list | grep user
```

Check recent commits are attributed correctly:

```shell
git log --format="%an <%ae>" -5
```

All five should show `Cooper Oscarfono <cooper@oscarfono.com>`. If any show a hostname address, fix it:

```shell
git config --global user.name "Cooper Oscarfono"
git config --global user.email "cooper@oscarfono.com"
git commit --amend --reset-author --no-edit  # fix most recent commit only
git push --force-with-lease origin main       # only if not yet pushed
```

---

## Branching Strategy

`main` is always deployable. Cloudflare Pages builds from `main` automatically on push.

- Small changes (copy edits, front matter fixes, image swaps) can go directly on `main`.
- New posts, structural changes, or layout work should use a feature branch, merged when ready to publish.

```shell
# Start a new post or feature
git checkout -b post/fifo-roster-patterns

# ... write and test locally ...

git checkout main
git merge --no-ff post/fifo-roster-patterns -m "feat: add FIFO roster patterns post"
git branch -d post/fifo-roster-patterns
```

---

## Commit Conventions

### Format

```
<type>: <short summary>

<optional body — what changed and why>
```

- Summary line: 72 characters max, sentence case, no trailing period
- Body: wrap at 72 characters, blank line between summary and body
- Reference issues with `Fixes #N` or `Relates to #N` at the end of the body

### Types

| Type | When to use |
|------|-------------|
| `feat` | New post published or new section/feature added |
| `fix` | Correcting broken markup, front matter, links, or shortcodes |
| `content` | Draft work, edits to existing posts, copy updates |
| `style` | CSS, Tailwind, layout adjustments with no content change |
| `refactor` | Restructuring layouts or templates without changing output |
| `docs` | README, CONTRIBUTING, or config documentation only |
| `chore` | Dependency updates, config changes, housekeeping |
| `assets` | Adding or updating images, SVGs, or static files |

### Examples

Good:

```
feat: publish FIFO tax deductions post
fix: broken accordion shortcode on fifo-life overview page
content: expand the Exit section with Southeast Asia cost breakdown
assets: add hero SVG for The Money section
style: adjust mobile padding on post header
chore: update hugo.yaml baseURL for production
```

Bad:

```
updates
fixed stuff
new post
tweaks
wip
```

---

## Content Structure

### Front Matter

All posts use YAML front matter. Required fields:

```yaml
---
title: "Your Post Title"
meta_title: "SEO title if different from post title"
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

Notes:
- `author` is always `the-sovereign-miner` (slug, not display name)
- `image` path is relative to `/images/` root in `static/`
- `draft: true` while writing; flip to `false` when ready to publish
- `slug` should be lowercase, hyphenated, and match the intended URL path

### Writing Style

- Australian English spelling throughout (realise, colour, organise, favour)
- Direct and experience-based — write from what you know, not from what sounds professional
- Prose paragraphs preferred over bullet lists; use lists only where a list genuinely serves the content
- No em-dashes
- Financial figures in AUD, noted as such (e.g. "$120,000 AUD")
- External links inline where relevant
- Internal links to posts not yet written: use plain text with an italicised *coming soon* note, not anchor tags

### Shortcodes

**Accordion** — collapsible block:
```
{{< accordion title="What is a DIDO roster?" >}}
Content goes here.
{{< /accordion >}}
```

**Notice** — callout box, sits inside accordions where needed:
```
{{< notice "tip" >}}
Your tip text here.
{{< /notice >}}

{{< notice "warning" >}}
Your warning text here.
{{< /notice >}}
```

**Button** — call to action:
```
{{< button label="Read More" link="/blog/post-slug/" style="solid" >}}
```

---

## Local Development

```shell
# Install Hugo (extended version required for Tailwind)
# See README.md for installation instructions

# Serve locally with drafts visible
hugo server -D

# Build for production
hugo --minify
```

The local server runs at `http://localhost:1313` by default. Drafts (`draft: true`) are only visible with the `-D` flag.

---

## Deployment

The site deploys automatically via Cloudflare Pages on every push to `main`. There is no manual deploy step.

Build settings (configured in Cloudflare dashboard):
- Build command: `hugo --minify`
- Build output directory: `public`
- Environment variable: `HUGO_VERSION` set to the version in use locally

To verify the deployed build matches what you expect, check the Cloudflare Pages dashboard for build logs after pushing.

---

## Images

All images live in `static/images/`. Reference them in front matter and content as `/images/filename.ext`.

Conventions:
- Post hero images: descriptive filename matching the post slug (e.g. `fifo-tax-deductions-hero.jpg`)
- Section SVGs: `section-[name].svg` (e.g. `section-the-money.svg`)
- Keep image file sizes reasonable — compress JPEGs before committing

For photorealistic imagery (equipment, machinery, outback landscapes), use an AI image generator (Midjourney, Adobe Firefly, DALL-E 3) or stock photography rather than attempting SVG.

---

## Contact Form

The contact page uses a custom layout at `layouts/page/contact.html`. It POSTs JSON to a self-hosted Express API at `https://api.sovereign-miner.com/contact`. Frontend validation is handled in vanilla JS within the template.

Do not replace this with Formspree, Netlify Forms, or any third-party form service.

---

## Housekeeping

### Check for stale branches

```shell
git branch -a
```

Delete merged or abandoned branches:

```shell
git branch -d branch-name
git push origin --delete branch-name
```

### Verify main is clean before pushing

```shell
git status
git log --oneline -5
```

`main` should always be in a state that Cloudflare can build successfully. If you are mid-draft, use `draft: true` in front matter rather than leaving broken markup in the branch.
