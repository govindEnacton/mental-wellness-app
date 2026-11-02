# Mental Wellness Journal — Tasks

Progress: All core and additional spec features are implemented.

## Core features

- [x] React + TypeScript + Vite + Tailwind project with routing
- [x] Journal text editor with a required category tag (Grateful, Stressful, Reflective)
- [x] Journal entries saved to localStorage, listed newest first, and deletable with confirmation
- [x] 10-step mood picker (Angry through Excited)
- [x] Multiple mood entries per day, with date and time selection
- [x] One mood entry per minute validation
- [x] Mood trend chart: selected day, this month, last month
- [x] Daily quote fetched from dummyjson and cached per day
- [x] Quote card with a gentle entrance animation
- [x] Calming gradients, soft cards, and smooth transitions
- [x] Responsive navbar and page layouts
- [x] Dark mode toggle with saved preference and no first-paint flash

## Dashboard and calendar

- [x] Greeting, current date, and quick links to journal and mood tracking
- [x] Today's mood and journal summary
- [x] This month's mood and journal counts
- [x] Calendar with previous/next month navigation and a Today shortcut
- [x] Calendar shows each day's average mood emoji and a journal-entry dot
- [x] Selecting a date shows that day's mood entries and journal text
- [x] Calendar helpers and dashboard data helpers covered by tests

## Verification

- [x] `bun run build`
- [x] `bun run lint`
- [x] `bun test`

## Notes

- dummyjson (`https://dummyjson.com/quotes/random`) replaces ZenQuotes because ZenQuotes does not send CORS headers for browser requests.
- TrackMood keeps the requested desktop dimensions; it stacks vertically on smaller screens.
- Mood ratings saved under the old 5-point scale are interpreted as the new 10-point scale. Clear `mood-entries` in localStorage if you have old test data.
