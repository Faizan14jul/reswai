import { AdminLoginForm } from "./AdminLoginForm";
import { LogoutButton } from "./LogoutButton";
import { getAdminSession, isAdminConfigured } from "@/lib/auth";
import { getOverviewStats, getOwnerEmail, getWaitlistSignups } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatMonthDelta(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? "0%" : "+100%";
  }

  const delta = ((current - previous) / previous) * 100;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(0)}%`;
}

export default async function AdminPage() {
  const session = await getAdminSession();
  const ownerEmail = getOwnerEmail();
  const adminConfigured = isAdminConfigured();

  if (!session) {
    return (
      <main className="min-h-screen px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center">
          <div className="grid gap-4">
            <AdminLoginForm ownerEmail={ownerEmail} />
            {!adminConfigured ? (
              <div className="surface-card w-full max-w-md rounded-[24px] p-5 text-sm leading-7 text-orange-100/85">
                Admin password is not configured yet. Add <code>ADMIN_PASSWORD_HASH</code> for production, or
                <code> ADMIN_PASSWORD</code> only for local development.
              </div>
            ) : null}
          </div>
        </div>
      </main>
    );
  }

  const stats = await getOverviewStats();
  const signups = await getWaitlistSignups(100);
  const monthDelta = formatMonthDelta(stats.currentMonthTraffic, stats.lastMonthTraffic);
  const maxTraffic = Math.max(...stats.trafficSeries.map((item) => item.count), 1);

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/45">RESW AI admin</p>
            <h1 className="mt-3 font-[family:var(--font-display)] text-4xl font-semibold text-white sm:text-5xl">
              Waitlist control center
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/68">
              Signed in as {session.email}. This dashboard is locked to the owner account only.
            </p>
          </div>
          <LogoutButton />
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article className="surface-card rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">Total waitlist users</p>
            <p className="mt-4 text-4xl font-semibold text-white">{stats.waitlistTotal}</p>
            <p className="mt-2 text-sm text-white/62">Total email submissions captured.</p>
          </article>

          <article className="surface-card rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">Traffic this month</p>
            <p className="mt-4 text-4xl font-semibold text-white">{stats.currentMonthTraffic}</p>
            <p className="mt-2 text-sm text-white/62">Compared to last month: {monthDelta}</p>
          </article>

          <article className="surface-card rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">Waitlist this month</p>
            <p className="mt-4 text-4xl font-semibold text-white">{stats.currentMonthWaitlist}</p>
            <p className="mt-2 text-sm text-white/62">New users added during the current month.</p>
          </article>

          <article className="surface-card rounded-[28px] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">Live traffic</p>
            <p className="mt-4 text-4xl font-semibold text-white">{stats.activeVisitors}</p>
            <p className="mt-2 text-sm text-white/62">Page views recorded in the last 5 minutes.</p>
          </article>
        </section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="surface-card rounded-[30px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-white/45">Traffic overview</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Last 24 hours</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/65">
                Last month: {stats.lastMonthTraffic}
              </div>
            </div>

            <div className="mt-8 flex h-64 items-end gap-3">
              {stats.trafficSeries.length ? (
                stats.trafficSeries.map((item) => (
                  <div key={item.label} className="flex flex-1 flex-col items-center justify-end gap-3">
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-violet-500 via-sky-500 to-orange-400"
                      style={{ height: `${Math.max((item.count / maxTraffic) * 100, 8)}%` }}
                    />
                    <span className="text-center text-[10px] uppercase tracking-[0.18em] text-white/45">
                      {item.label.slice(11, 13)}h
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[24px] border border-dashed border-white/12 text-sm text-white/55">
                  Traffic data will appear after visitors start opening the site.
                </div>
              )}
            </div>
          </article>

          <article className="surface-card rounded-[30px] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">Owner account</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Single-email access</h2>
            <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/62">Admin email</p>
              <p className="mt-2 text-lg font-medium text-white">{ownerEmail}</p>
            </div>
            <div className="mt-4 rounded-[24px] border border-orange-400/20 bg-orange-400/8 p-5 text-sm leading-7 text-orange-100/85">
              This panel reads credentials from <code>.env.local</code>. For production, keep
              <code> ADMIN_PASSWORD_HASH</code> as a bcrypt hash. Plain text is supported only as a local dev fallback.
            </div>
          </article>
        </section>

        <section className="surface-card mt-8 rounded-[30px] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/45">User data</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Latest waitlist submissions</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/65">
              Showing latest {signups.length} users
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[24px] border border-white/10">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-white/6 text-sm text-white/65">
                <tr>
                  <th className="px-4 py-4 font-medium">Email</th>
                  <th className="px-4 py-4 font-medium">Role</th>
                  <th className="px-4 py-4 font-medium">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {signups.length ? (
                  signups.map((signup) => (
                    <tr key={signup.id} className="border-t border-white/8 text-sm text-white/78">
                      <td className="px-4 py-4">{signup.email}</td>
                      <td className="px-4 py-4">{signup.role || "Not provided"}</td>
                      <td className="px-4 py-4">{new Date(signup.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-white/55">
                      No waitlist users yet. Once someone joins, their email will appear here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
