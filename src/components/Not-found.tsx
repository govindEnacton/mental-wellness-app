import { Link } from "react-router";

export default function Notfound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-semibold text-primary">404</p>
      <h1 className="mt-3 text-2xl font-semibold">This page wandered off</h1>
      <p className="mt-2 text-tertiary">It happens. Take a breath and head somewhere calmer.</p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-primary px-5 py-2 font-medium text-[#323437] transition hover:opacity-90"
      >
        Back to dashboard
      </Link>
    </section>
  );
}
