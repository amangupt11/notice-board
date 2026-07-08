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
