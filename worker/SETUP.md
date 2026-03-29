# Contact Worker — Setup & Deployment

This Worker handles contact form submissions from sovereign-miner.com.
It accepts a JSON POST, validates the fields, and writes to a Cloudflare D1 database.

---

## Stack

- **Cloudflare Workers** — serverless function, runs at the edge
- **Cloudflare D1** — serverless SQLite database, bound to the Worker
- **Wrangler** — Cloudflare's CLI for local dev and deployment

---

## Prerequisites

- Cloudflare account (the one your Pages site is on)
- Node.js installed locally
- Wrangler CLI installed: `npm install -g wrangler`
- Authenticated: `wrangler login`

---

## First-time setup

### 1. Install dependencies

```shell
cd worker/
npm install
```

### 2. Create the D1 database

```shell
npx wrangler d1 create sovereign-miner-db
```

This prints output like:

```
[[d1_databases]]
binding = "DB"
database_name = "sovereign-miner-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` value and paste it into `wrangler.toml`, replacing `REPLACE_WITH_YOUR_DATABASE_ID`.

### 3. Initialise the database schema

Local (for dev):
```shell
npm run db:init:local
```

Remote (production):
```shell
npm run db:init:remote
```

### 4. Test locally

```shell
npm run dev
```

The Worker runs at `http://localhost:8787`. Test with curl:

```shell
curl -X POST http://localhost:8787/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello from curl"}'
```

You should get: `{"success":true}`

Check it landed in the local DB:
```shell
npm run db:list:local
```

### 5. Deploy to production

```shell
npm run deploy
```

Wrangler will print the Worker URL, something like:
`https://sovereign-miner-contact.YOUR_SUBDOMAIN.workers.dev`

### 6. Route through your domain (optional but recommended)

In your Cloudflare dashboard, go to **Workers & Pages > sovereign-miner-contact > Settings > Triggers > Add Custom Domain** and set it to `api.sovereign-miner.com`.

This lets your form POST to `https://api.sovereign-miner.com/contact` instead of the workers.dev URL.

---

## Update params.toml

Once deployed, update `config/_default/params.toml` in the Hugo site:

```toml
contact_form_action = "https://api.sovereign-miner.com/contact"
```

---

## Reading submissions

To view submissions in your remote DB at any time:

```shell
npm run db:list:remote
```

Or query directly in the Cloudflare dashboard under **D1 > sovereign-miner-db > Console**.

---

## Deployment reference

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server at localhost:8787 |
| `npm run deploy` | Deploy Worker to production |
| `npm run db:init:local` | Create tables in local dev DB |
| `npm run db:init:remote` | Create tables in production D1 |
| `npm run db:list:local` | Read submissions from local DB |
| `npm run db:list:remote` | Read submissions from production D1 |
