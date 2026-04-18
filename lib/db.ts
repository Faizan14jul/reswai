import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

export type WaitlistSignup = {
  id: number;
  email: string;
  role: string | null;
  created_at: string;
};

type PageView = {
  id: number;
  path: string;
  visitor_key: string | null;
  created_at: string;
};

type Store = {
  waitlistSignups: WaitlistSignup[];
  pageViews: PageView[];
};

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "resw-ai.json");

declare global {
  var __reswSchemaPromise: Promise<void> | undefined;
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || "";
}

function isProductionDatabaseEnabled() {
  return Boolean(getDatabaseUrl());
}

async function ensureRemoteSchema() {
  if (!isProductionDatabaseEnabled()) {
    return;
  }

  if (!global.__reswSchemaPromise) {
    const sql = neon(getDatabaseUrl());
    global.__reswSchemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS waitlist_signups (
          id BIGSERIAL PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          role TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS page_views (
          id BIGSERIAL PRIMARY KEY,
          path TEXT NOT NULL,
          visitor_key TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `;
    })();
  }

  await global.__reswSchemaPromise;
}

function ensureLocalStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(
      dbPath,
      JSON.stringify({ waitlistSignups: [], pageViews: [] } satisfies Store, null, 2),
      "utf8"
    );
  }
}

function readLocalStore(): Store {
  ensureLocalStore();
  return JSON.parse(fs.readFileSync(dbPath, "utf8")) as Store;
}

function writeLocalStore(store: Store) {
  ensureLocalStore();
  fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), "utf8");
}

export async function addWaitlistSignup(email: string, role?: string) {
  const normalizedEmail = email.toLowerCase().trim();

  if (isProductionDatabaseEnabled()) {
    await ensureRemoteSchema();
    const sql = neon(getDatabaseUrl());

    const existing = (await sql`
      SELECT id, email, role, created_at
      FROM waitlist_signups
      WHERE email = ${normalizedEmail}
      LIMIT 1
    `) as WaitlistSignup[];

    if (existing.length) {
      return existing[0];
    }

    const rows = (await sql`
      INSERT INTO waitlist_signups (email, role)
      VALUES (${normalizedEmail}, ${role?.trim() || null})
      RETURNING id, email, role, created_at
    `) as WaitlistSignup[];

    return rows[0];
  }

  const store = readLocalStore();
  const existing = store.waitlistSignups.find((item) => item.email === normalizedEmail);

  if (existing) {
    return existing;
  }

  const signup: WaitlistSignup = {
    id: Date.now(),
    email: normalizedEmail,
    role: role?.trim() || null,
    created_at: new Date().toISOString(),
  };

  store.waitlistSignups.unshift(signup);
  writeLocalStore(store);
  return signup;
}

export async function getWaitlistSignups(limit = 100): Promise<WaitlistSignup[]> {
  if (isProductionDatabaseEnabled()) {
    await ensureRemoteSchema();
    const sql = neon(getDatabaseUrl());

    return (await sql`
      SELECT id, email, role, created_at
      FROM waitlist_signups
      ORDER BY created_at DESC
      LIMIT ${limit}
    `) as WaitlistSignup[];
  }

  const store = readLocalStore();
  return store.waitlistSignups.slice(0, limit);
}

export async function addPageView(pathname: string, visitorKey?: string) {
  if (isProductionDatabaseEnabled()) {
    await ensureRemoteSchema();
    const sql = neon(getDatabaseUrl());

    const rows = (await sql`
      INSERT INTO page_views (path, visitor_key)
      VALUES (${pathname}, ${visitorKey || null})
      RETURNING id, path, visitor_key, created_at
    `) as PageView[];

    return rows[0];
  }

  const store = readLocalStore();
  const pageView: PageView = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    path: pathname,
    visitor_key: visitorKey || null,
    created_at: new Date().toISOString(),
  };

  store.pageViews.push(pageView);
  writeLocalStore(store);
  return pageView;
}

function isSameMonth(date: Date, target: Date) {
  return date.getUTCFullYear() === target.getUTCFullYear() && date.getUTCMonth() === target.getUTCMonth();
}

export async function getOverviewStats() {
  if (isProductionDatabaseEnabled()) {
    await ensureRemoteSchema();
    const sql = neon(getDatabaseUrl());

    const [waitlistTotal] = (await sql`
      SELECT COUNT(*)::int AS count FROM waitlist_signups
    `) as Array<{ count: number }>;
    const [currentMonthTraffic] = (await sql`
      SELECT COUNT(*)::int AS count
      FROM page_views
      WHERE created_at >= date_trunc('month', now())
    `) as Array<{ count: number }>;
    const [lastMonthTraffic] = (await sql`
      SELECT COUNT(*)::int AS count
      FROM page_views
      WHERE created_at >= date_trunc('month', now()) - interval '1 month'
        AND created_at < date_trunc('month', now())
    `) as Array<{ count: number }>;
    const [currentMonthWaitlist] = (await sql`
      SELECT COUNT(*)::int AS count
      FROM waitlist_signups
      WHERE created_at >= date_trunc('month', now())
    `) as Array<{ count: number }>;
    const [activeVisitors] = (await sql`
      SELECT COUNT(*)::int AS count
      FROM page_views
      WHERE created_at >= now() - interval '5 minutes'
    `) as Array<{ count: number }>;
    const trafficSeries = (await sql`
      SELECT to_char(date_trunc('hour', created_at), 'YYYY-MM-DD HH24:00') AS label,
             COUNT(*)::int AS count
      FROM page_views
      WHERE created_at >= now() - interval '24 hours'
      GROUP BY 1
      ORDER BY 1 ASC
    `) as Array<{ label: string; count: number }>;

    return {
      waitlistTotal: waitlistTotal.count,
      currentMonthTraffic: currentMonthTraffic.count,
      lastMonthTraffic: lastMonthTraffic.count,
      currentMonthWaitlist: currentMonthWaitlist.count,
      activeVisitors: activeVisitors.count,
      trafficSeries,
    };
  }

  const store = readLocalStore();
  const now = new Date();
  const currentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const previousMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const currentMonthTraffic = store.pageViews.filter((item) => isSameMonth(new Date(item.created_at), currentMonth)).length;
  const lastMonthTraffic = store.pageViews.filter((item) => isSameMonth(new Date(item.created_at), previousMonth)).length;
  const currentMonthWaitlist = store.waitlistSignups.filter((item) =>
    isSameMonth(new Date(item.created_at), currentMonth)
  ).length;
  const activeVisitors = store.pageViews.filter((item) => new Date(item.created_at) >= fiveMinutesAgo).length;

  const trafficMap = new Map<string, number>();
  store.pageViews
    .filter((item) => new Date(item.created_at) >= twentyFourHoursAgo)
    .forEach((item) => {
      const date = new Date(item.created_at);
      const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(
        date.getUTCDate()
      ).padStart(2, "0")} ${String(date.getUTCHours()).padStart(2, "0")}:00`;
      trafficMap.set(key, (trafficMap.get(key) || 0) + 1);
    });

  const trafficSeries = Array.from(trafficMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, count]) => ({ label, count }));

  return {
    waitlistTotal: store.waitlistSignups.length,
    currentMonthTraffic,
    lastMonthTraffic,
    currentMonthWaitlist,
    activeVisitors,
    trafficSeries,
  };
}

export function getOwnerEmail() {
  return process.env.ADMIN_EMAIL || "faizanraza14jy@gmail.com";
}
