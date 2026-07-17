import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const submissions = await prisma.assessment.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      companyName: true,
      contactName: true,
      contactEmail: true,
      totalScore: true,
      stage: true,
      createdAt: true,
      companyProfile: true,
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center px-6 py-16">
      <div className="mx-auto w-full max-w-[960px] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-kx-navy text-2xl font-bold">
              KODRYX AI Maturity Assessment
            </h1>
            <p className="kx-caption">Admin — All Submissions</p>
          </div>
          <a
            href="/assessment"
            className="rounded-md bg-kx-navy px-5 py-2.5 text-white font-body text-sm font-semibold transition-colors duration-200 hover:bg-kx-navy/90"
          >
            New Assessment
          </a>
        </div>

        {submissions.length === 0 ? (
          <div className="rounded border border-kx-grey-100 p-12 text-center">
            <p className="font-body text-kx-grey">No submissions yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded border border-kx-grey-100">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-kx-grey-100 bg-kx-grey-50">
                  <th className="text-left px-4 py-3 font-semibold text-kx-navy">Company</th>
                  <th className="text-left px-4 py-3 font-semibold text-kx-navy">Industry</th>
                  <th className="text-left px-4 py-3 font-semibold text-kx-navy">Contact</th>
                  <th className="text-right px-4 py-3 font-semibold text-kx-navy">Score</th>
                  <th className="text-left px-4 py-3 font-semibold text-kx-navy">Stage</th>
                  <th className="text-left px-4 py-3 font-semibold text-kx-navy">Submitted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => {
                  const profile = sub.companyProfile as { industry?: string } | null;
                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-kx-grey-50 hover:bg-kx-grey-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-semibold text-kx-navy">
                        {sub.companyName}
                      </td>
                      <td className="px-4 py-3 text-kx-grey">
                        {profile?.industry ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-kx-grey">
                        <span>{sub.contactName}</span>
                        <br />
                        <span className="text-xs opacity-60">{sub.contactEmail}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-kx-gold">
                        {sub.totalScore}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full border border-kx-navy px-3 py-0.5 text-xs text-kx-navy">
                          {sub.stage}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-kx-grey text-xs">
                        {new Date(sub.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/results/${sub.id}`}
                          className="text-kx-gold hover:underline text-xs font-semibold"
                        >
                          View Report →
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-center kx-caption">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""} total
        </p>
      </div>
    </main>
  );
}
