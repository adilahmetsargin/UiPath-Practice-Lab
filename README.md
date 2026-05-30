# UiPath Practice Lab

UiPath Practice Lab is a full-stack Next.js practice platform for learning UiPath and RPA through hands-on tasks instead of long passive lessons.

## Stack

- TypeScript
- Next.js App Router
- Tailwind CSS
- shadcn/ui-style components
- Supabase-ready auth, database, progress tracking
- Optional Hugging Face Inference API feedback
- Local mock data and mock AI feedback when services are not configured

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill values as needed:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
HF_TOKEN=
HF_MODEL=
```

The app works without these values. Supabase status is shown on `/settings`, and AI feedback falls back to a local reviewer when `HF_TOKEN` is empty.

## Supabase Setup

1. Create a Supabase project.
2. Enable email authentication in Supabase Auth.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Run `supabase/seed.sql`.
5. Add your Supabase project URL and anon key to `.env.local`.

## Database Tables

- `profiles`: user dashboard fields, current level, XP, progress percentage
- `lessons`: learning path levels
- `tasks`: practical UiPath/RPA tasks
- `submissions`: explanation, screenshot note, selector issue, or error note with AI feedback JSON
- `progress`: completed tasks per user
- `badges`: badge definitions
- `user_badges`: earned badges per user

## Main Routes

- `/`: landing page
- `/dashboard`: XP, current level, badges, and next tasks
- `/auth`: Supabase sign-in/sign-up plus Demo mode for local progress testing
- `/scenarios`: browser-based scenario tasks with screenshot evidence upload and AI review
- `/studio`: fake UiPath Studio-style visual workflow screen
- `/learning`: 13-level learning path
- `/learning/[lessonId]`: lesson detail with task cards, hints, completion, notes, AI feedback link
- `/practice`: internal fake websites for UiPath automation
- `/progress`: level and badge progress
- `/ai-feedback`: workflow explanation review
- `/settings`: integration status

## Practice Websites

- `/practice/login-form`
- `/practice/order-form`
- `/practice/product-table`
- `/practice/invoice-list`
- `/practice/dynamic-buttons`
- `/practice/error-simulation`
- `/practice/search-page`
- `/practice/excel-data-entry`

## Content

The app ships with 13 levels and 52 practical tasks in `lib/course-data.ts`, covering RPA basics, UiPath Studio, variables, selectors, Excel, web automation, email, documents, scraping, debugging, REFramework, mini projects, and QA/RPA interview preparation.

Scenario tasks live in `lib/scenario-data.ts`. They ask the learner to open a practice website, perform browser actions, attach screenshot evidence, write the actual steps followed, and submit the proof for AI/mock review.

Progress currently saves completed task IDs in browser localStorage for demo/testing. Supabase tables are included so cloud sync can be connected after authentication is configured.
