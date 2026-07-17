import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-6 rounded-lg border border-kx-grey-100 px-8 py-12 text-center">
        <Image
          src="/logo-kodryx.png"
          alt="Kodryx AI"
          width={120}
          height={123}
          priority
        />
        <h1 className="font-display text-kx-navy text-3xl font-bold">
          KODRYX AI Maturity Assessment™
        </h1>
        <p className="font-body text-kx-grey text-base">
          A 5-8 minute AI-readiness assessment that generates an
          executive-grade report — maturity score, SWOT, opportunity matrix,
          ROI estimate, and a phased transformation roadmap.
        </p>
        <Link
          href="/assessment"
          className="rounded-md bg-kx-navy px-6 py-3 text-white transition-colors duration-200 hover:bg-kx-navy/90"
        >
          Start Assessment
        </Link>
      </div>
    </main>
  );
}
