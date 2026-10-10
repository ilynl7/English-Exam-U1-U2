'use strict';
/*
 * Question-bank validator + traceability dumper.
 * Usage:  node tools/validate.js
 * Exits with code 1 if any check fails. Writes data/question-bank.json
 * (internal development record: source excerpt, treatment, mark, answer).
 */
const fs = require('fs');
const path = require('path');
const bank = require('../bank.js');

const OUT = path.join(__dirname, '..', 'data', 'question-bank.json');
const problems = [];

const res = bank.validateBank();
if (!res.ok) problems.push(...res.errors);

/* --- extra independent checks beyond validateBank() --- */
const ids = new Set();
for (const it of bank.Q) {
  if (ids.has(it.id)) problems.push('Duplicate id ' + it.id);
  ids.add(it.id);
  if (!it.src || !it.src.excerpt) problems.push('Missing source traceability: ' + it.id);
  /* exactly one correct answer */
  if (typeof it.answer !== 'number') problems.push('Non-index answer for ' + it.id);
}
if (bank.WRITING_RUBRIC.reduce((s, r) => s + r.marks, 0) !== 20) problems.push('Writing rubric != 20');
if (bank.BLUEPRINT.reduce((s, b) => s + b.max, 0) !== 120) problems.push('Blueprint total != 120');
if (!bank.READING_PASSAGE || !bank.READING_PASSAGE.text) problems.push('No reading passage');
if (!bank.WRITING_PROMPT) problems.push('No writing prompt');

const bySection = {};
for (const it of bank.Q) bySection[it.section] = (bySection[it.section] || 0) + 1;

console.log('== Blueprint ==');
for (const b of bank.BLUEPRINT) {
  console.log(`  ${b.section.padEnd(12)} ${String(b.max).padStart(3)} marks  (${bySection[b.section] || (b.section === 'writing' ? 1 : 0)} q)`);
}
console.log('  TOTAL        ' + bank.BLUEPRINT.reduce((s, b) => s + b.max, 0) + ' marks');
console.log('== Counts ==');
console.log('  objective questions:', bank.Q.length);
console.log('  reading passage:', bank.READING_PASSAGE ? 'yes' : 'no');
console.log('  writing prompt:', bank.WRITING_PROMPT ? 'yes' : 'no');
console.log('  writing rubric total:', bank.WRITING_RUBRIC.reduce((s, r) => s + r.marks, 0));

/* --- traceability dump (dev only, contains the answer key) --- */
try {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalMarks: 120,
    blueprint: bank.BLUEPRINT,
    questions: bank.Q.map((it) => ({
      id: it.id, section: it.section, topic: it.topic, marks: it.marks,
      source: it.src, answerIndex: it.answer, answerText: it.options[it.answer], explanation: it.explanation,
    })),
  }, null, 2));
  console.log('== Wrote ' + path.relative(path.join(__dirname, '..'), OUT) + ' ==');
} catch (e) {
  problems.push('Could not write traceability file: ' + e.message);
}

if (problems.length) {
  console.error('\nVALIDATION FAILED:');
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log('\nVALIDATION PASSED');
