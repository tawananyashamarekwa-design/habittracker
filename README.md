# StudyBoard — Student Tracker (with cloud sync)

A personal student tracker: timetable, assignments/exams, finances, habits, and quotes.
Your data lives in **Supabase** and **syncs across devices** — add something on your
phone, sign in on your laptop with the same email, and it's there.

---

## Run it (first time)

You need **Node.js 18 or newer**. Check with:

    node -v

If that prints a version (e.g. v20.11.0), you're set. Otherwise install the LTS
version from https://nodejs.org and reopen your terminal.

From inside this folder:

    npm install      # downloads dependencies — do this once
    npm run dev      # starts the app

Open the printed address (e.g. http://localhost:5173).

Stop anytime with Ctrl + C.

---

## First use

1. The app opens on a sign-in screen.
2. Click "Create an account", enter any email + a password (6+ characters), submit.
3. You're in. It starts empty — add your classes, assignments, etc.

## Sync to another device

- On your laptop: run the app and sign in with the SAME email and password.
  Your data loads from the cloud.
- On your phone (same Wi-Fi): when `npm run dev` runs it prints a Network address
  like http://192.168.1.x:5173. Open that on your phone, sign in with the same
  account. Add something on one device, refresh the other — it appears.

Refresh to pull the latest. (Live "instant" updates without refreshing can be
added later — ask when you want it.)

---

## Files

- src/supabaseClient.js — your Supabase project connection (URL + anon key)
- src/data.js          — loads and saves every table to the cloud
- src/Login.jsx        — the sign-in / sign-up screen
- src/App.jsx          — shows Login or the tracker depending on sign-in state
- src/StudentTracker.jsx — the app itself
- src/main.jsx, index.html, package.json, vite.config.js — project setup

---

## Want it on your phone without a laptop running?

Right now the phone needs your laptop's dev server on the same Wi-Fi. To use it
anywhere, the app can be deployed free (e.g. Vercel or Netlify) — then it's a
normal web address you open on any device. Ask and I'll walk you through it.

---

## Security note

The key in supabaseClient.js is the anon (public) key — it's designed to live in
front-end code. Your data is protected by Row Level Security rules in the database,
which only let a signed-in user read and write their own rows. Never put the
service_role (secret) key in these files.
