AGENT TODO — ENGLISH UNIT 1–2 EXAM WEBSITE

1. MAIN OBJECTIVE

Build a complete, functional, mobile-friendly English exam website for Units 1–2.

The website is intended for one student. The instructions, welcome screen, rules, menus, timer warnings, results explanations, and other interface elements must be in Arabic. The actual examination questions, answer choices, reading passage, and writing prompt must be in English.

The total examination score must be EXACTLY 120 marks.

Do not build a generic quiz template. The website must feel like a proper English examination with a clean interface, a realistic difficulty level, varied question types, and reliable grading.

Before coding, inspect the repository and understand its existing structure and requirements. Preserve useful existing code and assets where possible.

---

2. EXAM SOURCE MATERIAL — HIGHEST PRIORITY

Locate and inspect:

"references/questions.md"

This file contains approximately 1,800 lines of OCR-extracted questions. The content may contain:

- OCR mistakes.
- Missing or incorrect punctuation.
- Duplicated questions.
- Incorrectly recognized words.
- Broken formatting.
- Questions and answers that are not arranged logically.
- Incomplete questions or answer choices.
- Mixed question types.

Do not blindly copy questions from this file.

Required extraction process

1. Read the entire file, not just the first few hundred lines.
2. Identify all recognizable question types, grammar topics, vocabulary topics, reading exercises, writing prompts, and relevant examples.
3. Correct obvious OCR errors only when the intended text is clear.
4. Identify duplicates and remove redundant questions.
5. Reject questions whose meaning, intended answer, or source context cannot be established reliably.
6. Do not invent missing source text and pretend it came from the file.
7. Build an organized internal question bank before generating the exam.
8. Review the question bank for coverage, accuracy, difficulty, and answer-key correctness.

Minimum required examination content

The final exam must contain at least:

- 30 vocabulary multiple-choice questions.
- 30 grammar multiple-choice questions.
- 1 reading comprehension passage with related questions.
- 1 paragraph-writing question.
- Additional questions representing the other question types found in "references/questions.md".

The 30 vocabulary and 30 grammar questions are minimum requirements, not the entire examination.

The final exam must cover Units 1–2 appropriately. Do not introduce advanced vocabulary, grammar, or question structures that exceed the source material's level.

Rephrasing policy

You may rewrite questions, change names, create new sentences using the same grammar rules, and adapt source questions to produce a better examination.

However:

- Preserve the original educational objective.
- Preserve approximately the same difficulty.
- Ensure there is one unambiguously correct answer for single-answer multiple-choice questions.
- Avoid changing a simple source question into a significantly harder one.
- Do not create questions merely to increase the question count.
- Avoid excessive repetition of the same rule or vocabulary item.
- Ensure distractors are plausible but clearly incorrect.

For example, if the source tests the present simple, the replacement should still test the present simple rather than an unrelated advanced grammar concept.

Source traceability

Maintain an internal record of where each question came from.

For each question, record:

- Question ID.
- Category and topic.
- Source line or source excerpt, when identifiable.
- Whether it was copied, corrected, or rephrased.
- Correct answer.
- Explanation of the answer.
- Assigned marks.

This information is for development and review. It does not need to be shown to the student.

If source line numbers are unreliable because of OCR formatting, use a short source excerpt or another stable identifier instead.

---

3. EXAM STRUCTURE AND MARK DISTRIBUTION

Create an exam blueprint BEFORE implementing the question bank.

The exam must total exactly 120 marks.

Mandatory minimums:

- Vocabulary MCQ: at least 30 questions.
- Grammar MCQ: at least 30 questions.
- Reading: at least one passage and related comprehension questions.
- Writing: at least one paragraph prompt.
- Other question types: represent the additional formats found in the source file.

Do not assume that all questions must have equal marks.

Create a clear scoring table that defines:

- Number of questions in each section.
- Marks per question or subquestion.
- Maximum marks for each section.
- Total examination marks.

Verify programmatically that:

"SUM(all section maximum marks) === 120"

The minimum 30 vocabulary and 30 grammar questions must be preserved even if the remaining source question types require a large question bank.

Do not silently reduce the number of required questions to make the total easier to manage.

Writing marks

The paragraph-writing question must be graded manually by the examiner after submission.

Create a writing rubric appropriate to the student's level. It should evaluate:

- Relevance to the prompt.
- Grammar.
- Vocabulary.
- Spelling and punctuation.
- Organization and coherence.

Assign a defined number of marks to each criterion. The writing rubric must fit inside the 120-mark total.

Do not automatically claim that an AI-generated writing score is an official or definitive grade.

Reading section

Use one suitable English reading passage with questions that assess comprehension rather than obscure outside knowledge.

Use a mixture of question formats when supported by the source material, such as:

- Multiple choice.
- True or false.
- Short answers.
- Vocabulary in context.

Do not make the reading passage disproportionately difficult compared with Units 1–2.

---

4. SINGLE-FILE WEBSITE REQUIREMENT

The website must be deployable on Wispybute/Wispbyte using a single application file.

First, inspect the hosting environment and determine exactly what it supports.

Prefer a single "server.js" that can run all our files

The finished website must work when deployed, not merely in the development environment.

---

5. ARABIC INTERFACE AND ENGLISH EXAM

The student-facing interface must be Arabic, with proper RTL layout.

Use a readable Arabic font stack and ensure Arabic text is displayed correctly on mobile devices.

The examination itself must remain in English.

Arabic UI elements should include:

- Welcome screen.
- Name field.
- Instructions.
- Examination rules.
- Section navigation.
- Countdown.
- Warning messages.
- Submission confirmation.
- Results.
- Saving and export instructions.
- Writing-grading status.

Use "dir="rtl"" for Arabic interface elements and appropriate LTR direction for English questions, passages, answer choices, and writing fields.

Do not allow Arabic interface text to accidentally change the direction or punctuation of English questions.

Welcome screen

Before the exam begins, show a clean introductory screen containing:

1. Exam title.
2. Student name input.
3. Brief explanation of the examination.
4. Total score: 120 marks.
5. Initial duration: 60 minutes.
6. Explanation of the focus and tab-switching rules.
7. Explanation of the submission and grading process.
8. A checkbox confirming that the student has read the rules.
9. A clearly visible start button.

Validate the name field before starting.

Do not start the countdown while the student is still reading the welcome screen.

---

6. COUNTDOWN AND TIME LIMITS

The normal examination duration is 60 minutes.

The examination must never continue beyond 90 minutes of actual elapsed time.

Implement:

- A visible countdown.
- Automatic submission when the examination deadline is reached.
- Persistent tracking of the original start time.
- A clear warning when little time remains.
- Recovery after an accidental page reload when possible.

Tab-switching penalty

When the student leaves the exam tab or switches to another application, apply the requested time penalty.

The intended rule is:

Time passes at 3× speed while the exam is considered inactive.

For example:

- 1 minute actively spent = 1 minute of exam time.
- 1 minute inactive = 3 minutes of exam time.

Avoid incorrectly multiplying the entire countdown repeatedly every time the visibility event fires.

Track active and inactive periods accurately. Handle:

- Tab visibility changes.
- Window focus changes where supported.
- Returning to the exam.
- Repeated switching.
- Browser throttling.
- Reloads.
- Mobile browsers that suspend background tabs.

The total real elapsed duration must never exceed the 90-minute hard deadline.

If the student reaches the deadline, freeze the examination and automatically submit the saved answers.

Fairness and transparency

Explain the penalty clearly in Arabic before the exam begins.

Display a small warning when the student returns to the exam after switching away.

Do not use an ambiguous timer that jumps unpredictably.

Important technical limitation: a client-side website cannot reliably prove that a student never switched applications or tampered with the browser clock. Implement robust client-side detection, but do not describe it as tamper-proof.

---

7. BONUS SYSTEM

Implement a small bonus system that rewards correct answers and answer streaks without making the examination unfair.

However, the final official examination score must remain exactly 120 marks.

Use two separate values:

1. Base examination score: maximum 120.
2. Bonus points: a separate, capped display.

Suggested design:

- Small bonus rewards for a streak of consecutive correct answers.
- A limited random bonus for answering selected questions correctly.
- Clear Arabic notifications when a bonus is awarded.
- A visible record of earned bonuses.

Requirements:

- The bonus system must never increase the official examination score beyond 120.
- Bonuses must not compensate for an incorrect answer in the base score.
- Random bonuses must not change the correct answer or the difficulty of a question.
- Bonus calculations must be deterministic once awarded and must not be duplicated after a reload.
- Do not reveal the answer key through the bonus animation.
- Do not allow the student to repeatedly answer the same question to farm bonuses.

If the bonus is intended to affect the final grade, define a fair normalization rule in advance. Otherwise, keep bonus points separate from the official score.

---

8. IMMEDIATE GRADING FOR OBJECTIVE QUESTIONS

When the student submits the examination, automatically grade all questions with objectively verifiable answers.

This includes:

- Multiple choice.
- True or false.
- Matching questions, where supported.
- Fill-in-the-blank questions with reliable answer keys.
- Other objective formats that can be graded unambiguously.

Calculate the student's result using the marks assigned to each question.

Example:

Vocabulary: 24/30

Grammar: 26/30

Reading: 14/20

Objective score: 64/80

Writing: Pending manual grading

Final score: Pending

These are illustrative values only; the actual figures must follow the approved scoring blueprint.

Results page

After submission:

- Show the score for each section.
- Show the objective score immediately.
- Show the total objective marks available.
- Clearly label the writing score as pending.
- Show unanswered questions.
- Provide a breakdown of correct and incorrect objective answers.
- Display the final score only after the writing has been graded.

For every objectively graded question, show:

- The student's answer.
- The correct answer.
- Whether the answer was correct.
- A short explanation, where appropriate.

The answer review must never accidentally award marks for an unanswered question.

If a question permits multiple correct answers, explicitly define the accepted-answer rules.

---

9. ANSWER SAVING AND EXAM EXPORT

All answers must be saved after submission so the examiner can review and grade the student's work.

The submitted record should contain:

- Exam ID.
- Student name.
- Submission timestamp.
- Exam start timestamp.
- Submission reason: normal submission or timeout.
- Question IDs.
- Student responses.
- Correct answers for objective questions.
- Per-question marks.
- Objective score.
- Writing response.
- Writing rubric.
- Bonus points.
- Time spent, where available.
- Answered and unanswered question counts.

Export format

Provide a clearly visible Arabic button to export the submitted examination as a downloadable JSON file.

Also consider a readable HTML or TXT report for convenient manual grading.

The export must be easy to open on Android without special software.

Use a meaningful filename, such as:

"English_Units_1-2_StudentName_ExamID.json"

Sanitize the filename before downloading.

The exported file must include the student's complete writing response and enough information to reconstruct the result.

Persistence

Save answers locally during the examination to protect against accidental reloads.

Use browser storage appropriately and handle unavailable storage gracefully.

Explain that browser storage is not a permanent server-side backup.

If the hosting environment supports a backend or durable file storage, use an appropriate persistent submission mechanism.

If the website is restricted to a single static HTML file with no backend, implement a reliable downloadable submission file and clearly explain that the examiner must receive that file manually.

Never claim that answers have been permanently uploaded or delivered to the examiner when they only exist in browser storage.

---

10. ONE ATTEMPT PER DEVICE/IP

The intended policy is that the student should only be able to complete one examination attempt.

Implement the strongest method supported by the hosting environment.

Client-side measures

- Generate a unique exam ID.
- Save the attempt state persistently.
- Store the submission state after completion.
- Block restarting a completed attempt in the same browser profile.
- Detect an existing incomplete attempt and offer to resume it.
- Prevent accidental double submission.
- Do not reset the exam by refreshing the page.

Security limitations

Browser storage cannot reliably enforce one attempt per device because it can be cleared or bypassed.

IP-based enforcement requires a backend. Even with a backend, IP addresses can be shared by multiple users or change over time.

If server-side functionality is available, implement a server-side attempt registry and document how device/IP identifiers are handled.

If the deployment supports only static HTML:

- Implement a best-effort local attempt lock.
- Clearly document its limitations.
- Do not pretend it guarantees one attempt per IP or device.

Do not collect unnecessary personal information.

---

11. MOBILE-FIRST USER EXPERIENCE

The website must work especially well on Android phones and tablets.

Requirements:

- Responsive layout.
- Readable English text.
- Large touch targets.
- Easy-to-select answers.
- No accidental horizontal scrolling.
- No tiny buttons.
- No overlapping timer or navigation.
- Smooth transitions without distracting animations.
- Accessible contrast.
- Clear section progress.
- Stable layout when the on-screen keyboard opens.
- A writing field that supports long paragraphs.
- Confirmation before final submission.

Provide a question navigator showing:

- Answered questions.
- Unanswered questions.
- Current question.
- Section progress.

The student must be able to move between questions without losing answers.

Do not accidentally clear a student's response when changing sections.

---

12. EXAM SECURITY AND ANSWER-KEY HANDLING

Because this may be deployed as a single static HTML file, the correct answers embedded in JavaScript can be inspected by a technically knowledgeable student.

Do not claim that client-side answer keys are secret.

If a backend is available, keep answer keys server-side and submit answers for grading through the server.

If only static hosting is available, prioritize a reliable exam experience, transparent limitations, and preventing accidental answer exposure in the normal interface.

Do not display correct answers before the student submits.

Do not reveal the correct answer in the HTML interface, question hints, bonus notifications, or hidden feedback before submission.

Disable answer-changing after final submission.

---

13. QUESTION BANK QUALITY CONTROL

Before considering the project complete, validate the question bank.

Run automated checks where possible.

Check for:

- Missing question text.
- Missing choices.
- Duplicate IDs.
- Duplicate questions.
- Invalid answer keys.
- Questions with no correct answer.
- Multiple correct answers in single-answer questions.
- Missing marks.
- Invalid section references.
- Incorrect total marks.
- Missing reading passage.
- Missing paragraph prompt.
- Fewer than 30 vocabulary MCQs.
- Fewer than 30 grammar MCQs.
- Question difficulty inconsistent with the source material.

Manually review every question that appears ambiguous or depends on an uncertain OCR correction.

Verify that each answer key is correct independently of the original OCR where necessary.

Do not fabricate validation results. If a check has not been performed, report that honestly.

---

14. REQUIRED TESTING

Test the finished website in a real browser environment where possible.

At minimum, verify:

1. The welcome screen appears before the timer starts.
2. The name is validated.
3. Arabic interface text displays correctly.
4. English questions display in the correct direction.
5. All required question types appear.
6. There are at least 30 vocabulary MCQs.
7. There are at least 30 grammar MCQs.
8. The score blueprint totals exactly 120.
9. Correct answers receive the correct marks.
10. Incorrect and unanswered questions receive appropriate marks.
11. The timer counts down correctly.
12. Tab switching applies the intended time penalty.
13. Repeated tab switching does not corrupt the timer.
14. The 90-minute deadline triggers automatic submission.
15. Refreshing the page does not erase an active attempt.
16. Completed attempts cannot be restarted in the same browser profile.
17. The submission export contains all responses.
18. The writing answer is preserved in full.
19. The writing grade remains pending until manually assigned.
20. Bonuses cannot exceed their configured limits.
21. Repeated submissions cannot duplicate scores or bonuses.
22. The interface works on a narrow mobile screen.
23. The single-file deployment works on the intended hosting service.
24. The exam can be completed without console errors.

If automated browser testing is unavailable, perform the strongest feasible checks and explicitly report which tests remain unverified.

---

15. ADDITIONAL IMPROVEMENTS

Implement these improvements where practical without compromising the core requirements.

A. Section progress

Show a progress bar and the number of answered questions.

B. Final review screen

Before submission, show unanswered questions and ask the student to confirm submission.

If time expires, skip the confirmation and submit automatically.

C. Writing preservation

Autosave the paragraph frequently so a temporary interruption does not destroy the student's work.

D. Examiner-friendly results

Make the exported report readable and include a separate writing section that can be reviewed without navigating the original website.

E. Exam integrity

Assign stable question IDs and store the exact question text and answer choices used in the attempt. This prevents later question-bank changes from making old submissions impossible to grade.

F. Clear grading status

Distinguish between:

- Objective grading complete.
- Writing awaiting review.
- Final grade complete.

G. Accessibility

Support keyboard navigation, visible focus indicators, appropriate labels, and readable error messages.

H. Visual design

Create a polished examination interface, not a generic dashboard.

Use a restrained color palette, clear typography, a professional welcome screen, a prominent countdown, consistent question cards, and subtle feedback animations.

Avoid unnecessary decoration that distracts from the examination.

---

16. IMPLEMENTATION WORKFLOW

Work in this order.

Phase 1 — Repository inspection

- Inspect the project structure.
- Read "references/questions.md" completely.
- Identify the existing framework, if any.
- Inspect the deployment requirements.
- Identify missing information and technical constraints.

Phase 2 — Question analysis

- Classify the source questions.
- Correct reliable OCR errors.
- Remove duplicates.
- Build the question bank.
- Define the exam blueprint.
- Verify the 120-mark total.

Phase 3 — Exam design

- Define sections and scoring.
- Define the writing rubric.
- Define the bonus rules.
- Define timer behavior.
- Define attempt restrictions and saving behavior.

Phase 4 — Implementation

- Build the single-file website.
- Implement the Arabic interface.
- Add the English question bank.
- Implement timer and submission logic.
- Implement grading and answer review.
- Implement answer persistence and export.
- Implement attempt locking.

Phase 5 — Validation

- Run question-bank validation.
- Verify all scoring calculations.
- Test timer edge cases.
- Test persistence and exports.
- Test mobile layout.
- Test deployment compatibility.

Phase 6 — Final delivery

- Ensure the intended website entry point is self-contained.
- Remove unnecessary dependencies.
- Preserve useful repository files.
- Do not delete source references.
- Provide a concise completion report containing:
  1. Files created or modified.
  2. Question counts by category.
  3. Total marks and section breakdown.
  4. Timer and bonus behavior.
  5. Answer export and persistence behavior.
  6. Attempt restriction limitations.
  7. Tests actually completed.
  8. Known limitations or unfinished tasks.

Do not claim success until the implementation and scoring have been checked.

FINAL ACCEPTANCE CRITERIA

The project is complete only when:

- The website runs in the intended hosting environment.
- It meets the single-file deployment requirement.
- The examination is based on the actual source material.
- It includes at least 30 vocabulary MCQs and 30 grammar MCQs.
- It includes reading, paragraph writing, and the other supported source question types.
- Its official score totals exactly 120 marks.
- The countdown and tab-switching penalty work as specified.
- The hard real-time limit is 90 minutes.
- Objective answers are graded immediately after submission.
- Writing is preserved and awaits manual grading.
- The student can export a complete submission.
- The interface is Arabic and the examination is English.
- All unverified capabilities and security limitations are disclosed.

Prioritize correctness, educational quality, data preservation, and a working final product over rushing to produce a visually impressive demo.
