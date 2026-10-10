# AGENTS.md — English-Exam-U1-U2

Repository memory for future sessions. See `README.md` for the full specification.

## What this is
A single-student English exam website for Units 1–2. Arabic (RTL) interface,
English (LTR) exam content. Official total score is exactly **120 marks**.

## Layout
- `server.js` — single Node.js entry point (built-ins only, no dependencies).
  Serves `public/`, exposes `/api/exam` (no answer key), `/api/attempt`,
  `/api/submit` (server-side grading). Run with `node server.js` (port 3000).
- `bank.js` — question bank + blueprint + rubric + `validateBank()` +
  `gradeObjective()`. Answer key lives here and never reaches the browser.
- `public/` — `index.html`, `styles.css`, `app.js` (client logic).
- `tools/validate.js` — `node tools/validate.js` validates the bank, prints the
  blueprint, and writes `data/question-bank.json` (dev traceability record).
- `references/questions.md` — OCR source material (do not delete).

## Blueprint (must total 120)
vocab 30 · grammar 30 · verbforms 10 · reading 10 · translation 10 ·
literature 10 · writing 20. 89 objective questions + 1 writing task.

## Rules that must not regress
- Blueprint total === 120; writing rubric sums to 20; writing stays "pending".
- The `/api/exam` payload must never contain answers (`correctAnswer`).
- Timer: 60-min nominal, x3 while tab inactive, hard 90-min real limit with
  auto-submit (`timeup_60` / `timeup_90`).
- Bonuses are a separate capped display (max 20) and never change the 120.
- `data/` and `server.log` are runtime artifacts (git-ignored).

## Test approach
Automated browser tests use `puppeteer-core` against system Chromium
(`/usr/bin/chromium`); no headless browser package is bundled with the repo.
The attempt lock keys on IP + user-agent, so tests that start several
attempts need distinct browser contexts (and user agents) or a server restart.
