# RESW AI Waitlist

Production-ready Next.js landing page + owner-only admin dashboard for RESW AI.

## Local development

1. Install dependencies:
   `npm install`
2. Start the app:
   `npm run dev`
3. Local admin login uses `.env.local`:
   - `ADMIN_EMAIL=faizanraza14jy@gmail.com`
   - `ADMIN_PASSWORD=...`

## Production deploy on Vercel

This project is ready for Vercel, but production data should use a real database.

### Recommended setup

1. Push this repo to GitHub.
2. Import the repo into Vercel.
3. In Vercel Marketplace, install a Postgres provider such as Neon.
4. Connect the storage integration to this Vercel project.
5. Make sure Vercel has one of these environment variables:
   - `DATABASE_URL`
   - `POSTGRES_URL`
6. Add these project environment variables in Vercel:
   - `ADMIN_EMAIL=faizanraza14jy@gmail.com`
   - `ADMIN_PASSWORD_HASH=<bcrypt hash>`
   - `SESSION_SECRET=<long random secret>`
7. Redeploy.

### Create the admin password hash

Run:

```bash
npm run hash:password -- "your-admin-password"
```

Copy the output into `ADMIN_PASSWORD_HASH` on Vercel.

## Notes

- Local development can use `ADMIN_PASSWORD` in `.env.local`.
- Production should use `ADMIN_PASSWORD_HASH`.
- If `DATABASE_URL` or `POSTGRES_URL` is present, the app automatically uses Neon/Postgres.
- If no database URL is present, the app falls back to local JSON storage for development only.
