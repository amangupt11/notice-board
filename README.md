# Notice Board

A full-CRUD Notice Board built with **Next.js (Pages Router)**, **Prisma**, and a **hosted MySQL database (TiDB Cloud)**. Create, read, update, and delete notices — each with a title, body, category, priority, publish date, and an optional image. Urgent notices always sort to the top with a red badge.

## Features

- **Full CRUD** for notices, all going through API routes under `pages/api/`.
- **Server-side validation** inside the API routes (required fields, valid date) — not just in the browser.
- **Urgent-first ordering done in the database query** (Prisma `orderBy`), so Urgent notices appear above all Normal ones regardless of date, each with a red **Urgent** badge.
- **Responsive card layout** for phone and desktop.
- **Delete confirmation** dialog before anything is removed.
- **Optional image upload** (bonus) via Cloudinary.

## Tech stack

| Layer      | Choice                                              |
| ---------- | --------------------------------------------------- |
| Framework  | Next.js 16 — **Pages Router** (`pages/`)            |
| DB access  | Prisma 6                                            |
| Database   | TiDB Cloud (free, MySQL-compatible)                 |
| Styling    | Tailwind CSS v4                                      |
| Image host | Cloudinary (optional)                               |
| Hosting    | Vercel (free Hobby tier)                            |

## Project structure

```
components/     Layout, NoticeCard, NoticeForm, ConfirmDialog, UrgentBadge
lib/            prisma.js (client singleton), validate.js (server validation)
pages/          index.js (list), new.js, edit/[id].js
pages/api/      notices/index.js (GET, POST), notices/[id].js (GET, PUT, DELETE), upload.js
prisma/         schema.prisma, migrations/
```

## API

| Method | Route                | Purpose                          | Status codes         |
| ------ | -------------------- | -------------------------------- | -------------------- |
| GET    | `/api/notices`       | List notices (Urgent first)      | 200                  |
| POST   | `/api/notices`       | Create a notice                  | 201, 400             |
| GET    | `/api/notices/:id`   | Fetch one notice                 | 200, 404             |
| PUT    | `/api/notices/:id`   | Update a notice                  | 200, 400, 404        |
| DELETE | `/api/notices/:id`   | Delete a notice                  | 204, 404             |
| POST   | `/api/upload`        | Upload an image to Cloudinary    | 200, 400, 501        |

Unsupported methods return **405** with an `Allow` header.

## Running locally

**Prerequisites:** Node.js 18+ and a free hosted MySQL database (e.g. TiDB Cloud).

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables** — create a `.env` file in the project root:

   ```env
   # Hosted MySQL (TiDB Cloud). TiDB requires TLS, hence ?sslaccept=strict
   DATABASE_URL="mysql://USER:PASSWORD@HOST:4000/notice_board?sslaccept=strict"

   # Optional: Cloudinary credentials for the image-upload bonus.
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

   > `.env` is git-ignored so credentials are never committed. If you skip the
   > Cloudinary values, everything works except image upload.

3. **Apply the database schema**

   ```bash
   npx prisma migrate deploy   # apply existing migrations
   # or, for a fresh dev database:
   npx prisma migrate dev
   ```

4. **Start the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push the repo to GitHub and import it into Vercel.
2. Add the same environment variables (`DATABASE_URL`, and optionally the
   `CLOUDINARY_*` keys) in **Project → Settings → Environment Variables**.
3. Deploy. The `postinstall` script runs `prisma generate` so the Prisma Client
   is available in Vercel's build.

## One thing I'd improve with more time

Add **pagination and search/filtering** on the list page (by category and
priority), backed by the database rather than the client, plus optimistic UI
updates on create/edit/delete so the list feels instant. I'd also add automated
tests (Vitest + an integration test hitting the API routes against a test
database) to lock in the validation and ordering rules.

## How AI was used

I used **Claude Code** as a pair-programmer throughout:

- Read and summarized the assignment spec, and cross-checked the implementation
  against its hard rules (Pages Router, server-side validation, DB-level Urgent
  ordering, hosted DB, no committed secrets).
- Scaffolded the Prisma schema, API routes, React components, and pages, then
  I reviewed and adjusted the code.
- Diagnosed a Prisma 7 incompatibility (v7 removed `url` from the schema and
  requires driver adapters); on that basis we moved to Prisma 6, which matches
  TiDB's documented connection-string format and simplifies deployment.
- Verified all CRUD operations, validation, status codes, and the Urgent-first
  ordering end-to-end against the live TiDB database before finalizing.

All code was reviewed and understood before committing.
