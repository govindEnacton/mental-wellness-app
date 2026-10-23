# Mental Wellness Journal — Tasks

Progress: **7 done / 25 remaining** (rough item count, not effort-weighted)

## ✅ Done

- [x] React + TypeScript + Vite project scaffolded ✅
- [x] React Router installed and configured (`BrowserRouter`) ✅
- [x] Component files created: Dashboard, Journal, Quotes, TrackMood, Navbar, Not-found ✅
- [x] Routing skeleton for `/`, `/journal`, `/quotes` ✅
- [x] 404 page and catch-all route ✅
- [x] Inspirational quote: fetch + render + loading state (currently dummyjson.com, not ZenQuotes) ✅
- [x] TypeScript build (`tsc -b && vite build`) and ESLint pass ✅

## Remaining — Functionality (do first)

### Journal

- [ ] Journal text editor
- [ ] Date for each entry (default: today)
- [ ] Category tags per entry (Grateful, Stressful, etc.)
- [ ] Save entries to localStorage
- [ ] Load and display past entries

### Mood tracker

- [ ] Mood picker with icons (happy, sad, stressed, etc.)
- [ ] Save one mood per date
- [ ] Persist moods to localStorage
- [ ] Mood trend chart over time
- [ ] Implement `TrackMood.tsx` and wire `/trackmood` (route currently `element={""}`)

### Quotes

- [ ] One quote per day (cache by date) instead of a new random quote per page load
- [ ] Optional: switch back to ZenQuotes via a proxy/backend (browser CORS blocks it)

### App and calendar

- [ ] Navbar with links to all pages (`Navbar.tsx` exists but is empty)
- [ ] Dashboard overview content (currently just "hey")
- [ ] Calendar view of journal entries and moods
- [ ] Calendar month navigation (previous/next month)
- [ ] Select a date to see that day's entry and mood

## Remaining — UI (do last)

- [ ] Calming color palette and gradients
- [ ] Responsive layout (mobile and desktop)
- [ ] Smooth transitions and quote animations
- [ ] Dark mode toggle with saved preference
- [ ] Style the journal editor and tags
- [ ] Style the mood picker and trend chart
- [ ] Style the calendar
- [ ] Style the navbar
