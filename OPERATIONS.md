# OPERATIONS MANUAL

## 1. Architecture

The system consists of a React/Vite frontend and a Node/Express/Prisma backend.
Production deployment targets:
- Frontend: Static host (e.g. Vercel, Netlify)
- Backend: Node.js host (e.g. Render, Railway)
- Database: Supabase PostgreSQL
- Storage: Private Cloud Storage (e.g. AWS S3)
- Payments: Razorpay Live

## 2. Environment Variables

Variables are maintained separately for the frontend and backend. See `.env.example` in the root and `backend/.env.example` for the required keys.
**NEVER commit real `.env` files to version control.**

## 3. Deployment Process

### Frontend
1. Set `VITE_API_URL` to the production backend URL.
2. Run `npm run build`.
3. Deploy the `/dist` directory to static hosting.

### Backend
1. Ensure all `DATABASE_URL` and secret environment variables are provided in the hosting configuration.
2. Run `npm run build`.
3. Start the server using the compiled output.
4. Verify `/api/health` returns `200 OK`.

## 4. Database Migration

1. Do **not** use `prisma migrate reset` or `db push` in production.
2. Use `npx prisma migrate deploy` to safely apply pending migrations against Supabase PostgreSQL.

## 5. Backup and Recovery

### Database
- Automated daily backups should be enabled in the Supabase project dashboard.
- **Recovery:** In an incident, use Supabase Point-in-Time Recovery (PITR) to restore the database to a known good state.

### Digital Storage
- Ensure Object Versioning and Accidental Deletion Protection are enabled on your chosen S3-compatible provider.
- **Recovery:** Retrieve lost assets via the provider's version history panel.

## 6. Secret Rotation

1. **JWT Secrets:** Generate new strong random strings for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`. Update them in the backend environment. *Note: this will force all currently logged-in users to re-authenticate.*
2. **Razorpay:** Generate a new Key Secret in the Razorpay Dashboard. Update `RAZORPAY_KEY_SECRET`. Disable the old key.
3. **Database:** Update the database password via Supabase settings, then immediately update the `DATABASE_URL` in the backend environment to avoid downtime.

## 7. Incident Response Plan

1. **Detect:** Monitor uptime using external probes against `/api/health` and the frontend URL.
2. **Confirm:** Check logs and verify the extent of the outage.
3. **Contain:** If the database or payments are compromised, place the application in maintenance mode or disable the Razorpay webhook.
4. **Diagnose:** Inspect the safe production logs (which strip sensitive data).
5. **Recover:** Roll back the deployment (frontend/backend) to the last known-good state. If data is corrupted, use the documented recovery procedures.
6. **Verify:** Perform a smoke test (Homepage -> Cart -> Checkout -> Download).
7. **Document:** Write a post-mortem documenting the root cause and mitigation steps.

## 8. Rollback Procedure

- **Frontend/Backend:** Use the hosting provider's instant rollback feature (e.g. Vercel/Render rollback) to revert to the previous successful build.
- **Database:** Do not rollback migrations. Write a forward migration to safely revert schema changes, or perform a Point-in-Time Recovery if data is catastrophically destroyed.
