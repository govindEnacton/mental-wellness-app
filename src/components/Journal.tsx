import { useState, type FormEvent } from "react";

type JournalEntry = {
  id: string;
  text: string;
  createdAt: string;
  tag: string;
};

const tags = ["Grateful", "Stressful", "Reflective"];

function loadEntries(): JournalEntry[] {
  try {
    const entries: unknown = JSON.parse(localStorage.getItem("journal-entries") ?? "[]");
    if (!Array.isArray(entries) || !entries.every((entry) =>
      entry !== null && typeof entry === "object" &&
      typeof entry.id === "string" && typeof entry.text === "string" &&
      typeof entry.createdAt === "string" &&
      (entry.tag === undefined || typeof entry.tag === "string")
    )) throw new Error("Invalid journal entries");
    return entries;
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  try {
    localStorage.setItem("journal-entries", JSON.stringify(entries));
    return true;
  } catch {
    alert("Could not save your journal. Check your browser storage and try again.");
    return false;
  }
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);
  const [text, setText] = useState("");
  const [tag, setTag] = useState("");

  const addEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const next = [
      {
        id: crypto.randomUUID(),
        text: text.trim(),
        createdAt: new Date().toISOString(),
        tag,
      },
      ...entries,
    ];
    if (!saveEntries(next)) return;
    setEntries(next);
    setText("");
    setTag("");
  };

  const removeEntry = (id: string) => {
    const canDelete = confirm("Delete this journal entry? This cannot be undone.");
    if (canDelete) {
      const next = entries.filter((item) => item.id !== id);
      if (saveEntries(next)) setEntries(next);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-semibold text-primary">Journal</h1>

      <form onSubmit={addEntry} className="mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How was your day?"
          aria-label="Journal entry"
          rows={4}
          className="w-full rounded-lg border border-tertiary bg-transparent p-4 outline-none focus:border-primary"
        />
        <label className="mt-3 block" htmlFor="journal-tag">Category</label>
        <select
          id="journal-tag"
          required
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="rounded-lg border border-tertiary bg-secondary p-2"
        >
          <option value="">No category</option>
          {tags.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button
          type="submit"
          className="mt-3 block rounded-full bg-primary px-6 py-2 font-medium text-[#323437] transition hover:opacity-90"
        >
          Add journal
        </button>
      </form>

      {entries.length === 0 ? (
        <p className="text-tertiary">No entries yet.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-lg border border-tertiary p-4"
            >
              <p className="whitespace-pre-wrap">{entry.text}</p>
              {entry.tag && <span className="text-sm text-primary">{entry.tag}</span>}
              <div className="mt-2 flex justify-between text-sm text-tertiary">
                <time dateTime={entry.createdAt}>
                  {new Date(entry.createdAt).toLocaleString()}
                </time>
                <button
                  className="px-2 bg-alert/10 w-fit text-alert border-alert border rounded-sm hover:bg-secondary cursor-pointer"
                  onClick={() => removeEntry(entry.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
