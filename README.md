## Mahirsn Link Hub

Link management system built with **Next.js App Router**, **Prisma + SQLite**, **Tailwind**, and a custom LinkHub UI.

### Features

- Public LinkHub page with neon/shimmer UI and animated cards
- Links stored in SQLite via Prisma
- Optional icon upload per link (`/public/uploads`)
- `isCopyable` links copy to clipboard instead of navigating
- `description` text support (text-only entries allowed)
- Admin dashboard at `/admin`:
  - Password gate (via `ADMIN_PASSWORD`)
  - Add / edit / delete links
  - Drag-and-drop reordering with `@dnd-kit`

---

## 1. Local development

Requirements:

- Node.js 20+
- npm (comes with Node)

Install and run dev server:

```bash
npm install
npx prisma db push        # ensure SQLite schema is applied
npm run dev
```

Then open:

- Public page: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`

### Admin password (dev)

Create `.env.local` in the project root:

```bash
ADMIN_PASSWORD=your-strong-password
```

Restart `npm run dev` after changing `.env.local`.

---

## 2. Production build & start (same server)

```bash
npm install          # once
npx prisma db push   # once per schema change
npm run build
npm run start        # serves on http://localhost:3000
```

Put your web server / reverse proxy (IIS, Nginx, etc.) in front of `http://localhost:3000` and point your domain (e.g. `mahirsn.net`) at it.

Environment variables for production:

- `.env.local` (or OS env vars) on the server should define:

```bash
ADMIN_PASSWORD=your-production-password
```

SQLite database file is `dev.db` in the project root (ignored by git). Back this up if you want to preserve links.

---

## 3. Moving to another server / VDS

On the **old** server:

- Copy the project folder (excluding `node_modules`) to the new server
- Make sure you also copy:
  - `.env.local` (or re-create it with the same `ADMIN_PASSWORD`)
  - `dev.db` (if you want to preserve existing links)

On the **new** server, inside the project folder:

```bash
npm install
npx prisma db push     # safe; keeps schema in sync
npm run build
npm run start
```

Then configure your reverse proxy to point your domain to `http://localhost:3000`.

If you want the app to keep running after logout on Linux, you can use `pm2`:

```bash
npm install -g pm2
pm2 start "npm run start" --name mahirsn-site
pm2 save
pm2 startup
```

---

## 4. GitHub workflow

To push this project to GitHub:

```bash
# 1. In the project root
git init            # already done by create-next-app

# 2. Commit current work
git add .
git commit -m "Set up Mahirsn link hub"

# 3. Create a repo on GitHub (via UI) named e.g. mahirsn-site,
#    then add it as the remote and push:
git remote add origin git@github.com:<your-username>/mahirsn-site.git
git push -u origin master
```

After this, normal workflow is:

```bash
git add .
git commit -m "Your change description"
git push
```
