import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="flex h-16 w-full items-center justify-around bg-primary px-6 text-secondary">
      <Link
        to="/"
        aria-label="MindWell home"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21c-4 0-7-3-7-7 0-5 4-9 7-11 3 2 7 6 7 11 0 4-3 7-7 7Z" />
          <path d="M12 21V9" />
        </svg>
      </Link>

      <ul className="flex items-center gap-1 text-lg font-medium">
        <li>
          <Link
            to="/journal"
            className="rounded-full px-4 py-2 transition hover:bg-secondary/10"
          >
            Journal
          </Link>
        </li>
        <li>
          <Link
            to="/trackmood"
            className="rounded-full px-4 py-2 transition hover:bg-secondary/10"
          >
            Track Mood
          </Link>
        </li>
        <li>
          <Link
            to="/quotes"
            className="rounded-full px-4 py-2 transition hover:bg-secondary/10"
          >
            Quotes
          </Link>
        </li>
      </ul>
    </nav>
  );
}
