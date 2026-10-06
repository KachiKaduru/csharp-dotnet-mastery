# C# & .NET Mastery

A two-week C# / .NET study course with quizzes, coding challenges, interview practice and a spaced-repetition
Review Center. Built with **Vite + React 19 + TypeScript**, linted with **ESLint** (type-aware), tested with **Vitest**.

## Scripts

| Command             | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm install`       | Install dependencies                      |
| `npm run dev`       | Start the dev server                      |
| `npm run build`     | Typecheck (`tsc -b`) and build to `dist/` |
| `npm run preview`   | Serve the production build                |
| `npm run lint`      | ESLint (type-aware, React hooks rules)    |
| `npm run lint:fix`  | ESLint with autofix                       |
| `npm run typecheck` | TypeScript only                           |
| `npm test`          | Run unit tests once                       |

## Project layout

```
src/
  content/            Course material (edit this to change the course)
    lessons/<id>.html   Lesson bodies (plain HTML, rendered as React elements)
    lessons.json        Lesson metadata: title, section, steps, self-check, headings
    quizzes.json        Quiz questions per lesson id
    challenges.json     Coding challenges per lesson id
    interview.json      Interview Q&A per lesson id
    index.ts            Typed accessors (LESSONS, quizFor, challengesFor, ...)
  state/              Progress store: reducer, localStorage persistence, context
  lib/                Pure logic: spaced repetition, search index, HTML->React options
  components/         UI: Sidebar, LessonPage, RightPanel (Quiz/Challenge/Interview), ReviewCenter, ...
  styles/             CSS split by area (base, layout, lesson, panels)
```

## Notes

- **Progress** is stored in `localStorage` under `csharp_course_state`, in the same shape as the original
  single-file app, so existing progress carries over if served from the same origin.
- **Lesson bodies** are HTML files parsed into React elements by `html-react-parser`; every `<pre><code>` becomes a
  `CodeBlock` highlighted by highlight.js (C#, XML, Bash, JSON only, to keep the bundle small).
- **Adding a lesson**: add `src/content/lessons/<id>.html`, add its entry to `lessons.json` (give each `<h2>` an id like
  `h-<id>-<n>` so search and the "On this page" rail can link to it), and optionally add quiz/challenge/interview
  entries under the same id.
- Keyboard: `/` focuses search, `Alt+→` goes to the next lesson, `Esc` closes search/dialogs.
