import { Link, NavLink } from "react-router";
import ThemeButton from "./ThemeButton";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-2.5 py-1.5 text-sm font-medium transition sm:px-4 sm:text-base ${
    isActive ? "bg-[#323437] text-primary" : "hover:bg-[#323437]/10"
  }`;

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 border-b border-[#323437]/10 bg-primary/95 text-[#323437] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-2 sm:h-16 sm:flex-nowrap sm:px-6">
        <Link
          to="/"
          aria-label="MindWell home"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#323437] text-primary"
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

        <ul className="order-3 flex w-full flex-wrap items-center justify-center gap-1 sm:order-2 sm:w-auto sm:flex-1">
          <li><NavLink to="/" end className={linkClass}>Dashboard</NavLink></li>
          <li><NavLink to="/journal" className={linkClass}>Journal</NavLink></li>
          <li><NavLink to="/trackmood" className={linkClass}>Track Mood</NavLink></li>
          <li><NavLink to="/quotes" className={linkClass}>Quotes</NavLink></li>
        </ul>

        <div className="order-2 ml-auto sm:order-3 sm:ml-0">
          <ThemeButton />
        </div>
      </div>
    </nav>
  );
}
