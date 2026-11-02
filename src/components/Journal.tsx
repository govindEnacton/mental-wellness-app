import { useState, type FormEvent } from "react";
import { journalCreatedAt, loadJournalEntries, saveJournalEntries, tags, type JournalEntry } from "../models/journal";
import { localDate } from "../models/date";

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadJournalEntries);
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");
  const [date, setDate] = useState(() => localDate(new Date()));
  const today = localDate(new Date());

  const addEntry = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || !tag || !date || date > today) return;

    const next = [
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        createdAt: journalCreatedAt(date),
        tag,
      },
      ...entries,
    ];
    if (!saveJournalEntries(next)) {
      alert("Could not save your journal. Check your browser storage and try again.");
      return;
    }
    setEntries(next);
    setText("");
    setTag("");
    setDate(localDate(new Date()));
  };

  const removeEntry = (id: string) => {
    const canDelete = confirm("Delete this journal entry? This cannot be undone.");
    if (canDelete) {
      const next = entries.filter((item) => item.id !== id);
      if (saveJournalEntries(next)) setEntries(next);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <header>
        <h1 className="text-3xl font-semibold text-primary">Journal</h1>
        <p className="mt-1 text-tertiary">Write freely. No one else can read this.</p>
      </header>

      <form onSubmit={addEntry} className="mt-6 rounded-[2rem] border border-tertiary/30 bg-secondary/70 p-4 shadow-sm sm:p-6">
        <label htmlFor="journal-entry" className="text-sm font-medium">How was your day?</label>
        <textarea
          id="journal-entry"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="A few honest lines are enough…"
          rows={5}
          className="mt-2 w-full resize-y rounded-xl border border-tertiary/40 bg-transparent p-4 outline-none transition focus:border-primary"
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label className="text-sm" htmlFor="journal-tag">
            Category
            <select
              id="journal-tag"
              required
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="mt-1 block rounded-lg border border-tertiary/40 bg-secondary p-2"
            >
              <option value="" disabled>Select a category</option>
              {tags.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="text-sm" htmlFor="journal-date">
            Date
            <input
              id="journal-date"
              type="date"
              required
              max={today}
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="mt-1 block rounded-lg border border-tertiary/40 bg-secondary p-2"
            />
          </label>

          <button
            type="submit"
            disabled={!text.trim() || !tag || !date || date > today}
            className="rounded-full bg-primary px-6 py-2 font-medium text-[#323437] transition hover:opacity-90 disabled:opacity-50"
          >
            Add journal
          </button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold">Past entries</h2>
        {entries.length === 0 ? (
          <p className="mt-2 text-tertiary">No entries yet.</p>
        ) : (
          <ul className="mt-3 space-y-4">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-2xl border border-tertiary/30 bg-secondary/70 p-4 shadow-sm transition hover:border-primary/40"
              >
                {entry.tag && (
                  <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                    {entry.tag}
                  </span>
                )}
                <p className="mt-2 whitespace-pre-wrap">{entry.text}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-tertiary">
                  <time dateTime={entry.createdAt}>
                    {new Date(entry.createdAt).toLocaleString()}
                  </time>
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    className="cursor-pointer rounded-lg border border-alert bg-alert/10 px-2 py-1 text-alert transition hover:bg-alert hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
