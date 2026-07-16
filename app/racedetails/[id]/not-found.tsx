import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10 text-center">
      <p className="text-f1-red">Race not found.</p>
      <div className="mt-4">
        <Link
          href="/"
          className="text-sm text-txt-secondary transition hover:text-txt-primary"
        >
          ← Back to calendar
        </Link>
      </div>
    </main>
  );
}
