'use strict';
/* ===== English Exam U1-U2 — student client =====
 * Arabic interface (RTL), English exam (LTR).
 * Timer: 60 min nominal, time runs x3 while tab/window is inactive, hard 90-min real limit.
 * The answer key never reaches the browser; grading happens on the server at submission.
 * Bonus points are computed at submission (so they cannot leak the key during the exam)
 * and are always kept separate from the official 120-mark score.
 */

const TOTAL_MARKS = 120;
const DURATION_MIN = 60;
const HARD_LIMIT_MIN = 90;
const INACTIVE_MULTIPLIER = 3;
const BONUS_CAP = 20;
const LS_KEY = 'u1u2_exam_state_v1';
const LS_DONE = 'u1u2_exam_done_v1';

let EX = null;
let state = null;
let tickHandle = null;
let lastTick = 0;
let submitting = false;

const $ = (id) => document.getElementById(id);
const uid = () => 'X' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function fmt(sec){ sec = Math.max(0, Math.floor(sec)); const m = Math.floor(sec / 60), s = sec % 60; return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0'); }
function sanitize(name){ return (name || 'student').replace(/[^\w\-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 40) || 'student'; }
function esc(s){ return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
function saveState(){ try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch(e){} }
function loadState(){ try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch(e){ return null; } }
function toast(msg, warn){ const box = $('toast'); const d = document.createElement('div'); if (warn) d.className = 'warn'; d.textContent = msg; box.appendChild(d); setTimeout(() => d.remove(), 4500); }

/* ---------- boot ---------- */
async function boot(){
  await fetchExam();
  const done = localStorage.getItem(LS_DONE);
  const srv = await checkAttempt();
  if (done || (srv && srv.blocked)) {
    showBlocked(done ? null : srv.prior);
    return;
  }
  const ls = loadState();
  if (ls && !ls.submitted && ls.answers) showResume();
  wireWelcome();
}
async function fetchExam(){
  const r = await fetch('/api/exam', { cache: 'no-store' });
  EX = await r.json();
}
async function checkAttempt(){
  try { const r = await fetch('/api/attempt', { cache: 'no-store' }); return await r.json(); }
  catch(e){ return { ok: true, blocked: false }; }
}

function showBlocked(prior){
  $('blocked').innerHTML = '<div class="warnbanner">لقد سُجّلت محاولة مكتملة سابقاً من هذا الجهاز/الشبكة' +
    (prior && prior.name ? (' للطالب: ' + esc(prior.name)) : '') +
    '. لا يُسمح بمحاولة ثانية. يمكن للمصحح الوصول إلى التقرير الكامل في مجلد data على الخادم، أو إلى ملف التصدير الذي حصل عليه الطالب.</div>';
  $('startBtn').disabled = true;
  $('nameInput').disabled = true;
  $('agree').disabled = true;
}
function showResume(){
  $('resume').innerHTML = '<div class="goodbanner">توجد محاولة غير مكتملة محفوظة في هذا المتصفح. يمكنك المتابعة من حيث توقفت دون فقدان إجاباتك.</div>';
  const b = document.createElement('button');
  b.className = 'btn small secondary'; b.style.marginTop = '8px'; b.textContent = 'استئناف المحاولة';
  b.onclick = () => startExam(true, null);
  $('resume').appendChild(b);
}

/* ---------- welcome ---------- */
function wireWelcome(){
  $('startBtn').onclick = async () => {
    const name = $('nameInput').value.trim();
    if (name.length < 3) { $('startErr').textContent = 'الرجاء إدخال اسم صحيح (٣ أحرف على الأقل).'; return; }
    if (!/^[\p{L}\p{M} .'\-]+$/u.test(name)) { $('startErr').textContent = 'الاسم يحتوي على رموز غير مسموح بها.'; return; }
    if (!$('agree').checked) { $('startErr').textContent = 'يجب تأكيد قراءة التعليمات أولاً.'; return; }
    $('startErr').textContent = '';
    const chk = await checkAttempt();
    if (chk && chk.blocked) { showBlocked(chk.prior); return; }
    startExam(false, name);
  };
}

/* ---------- start / resume ---------- */
function startExam(resume, name){
  if (resume) { state = loadState(); }
  if (!state || !state.answers) {
    const now = Date.now();
    state = {
      examId: uid(), name: name, startedAt: now,
      answers: {}, writing: '', cur: 0,
      activeElapsed: 0, warnings: 0, lastReturnWarningAt: 0,
      submitted: false, submitReason: null, submittedAt: null, bonuses: null,
    };
  }
  $('welcome').classList.add('hidden');
  $('exam').classList.remove('hidden');
  wireExamControls();
  renderAll();
  startTimer();
  saveState();
}
function wireExamControls(){
  $('prevBtn').onclick = () => go(state.cur - 1);
  $('nextBtn').onclick = () => go(state.cur + 1);
  $('reviewBtn').onclick = () => { renderReview(); $('exam').classList.add('hidden'); $('review').classList.remove('hidden'); window.scrollTo({ top: 0 }); };
  $('submitBtn').onclick = () => { renderReview(); $('exam').classList.add('hidden'); $('review').classList.remove('hidden'); window.scrollTo({ top: 0 }); };
  $('backBtn').onclick = () => { $('review').classList.add('hidden'); $('exam').classList.remove('hidden'); renderAll(); window.scrollTo({ top: 0 }); };
  $('confirmSubmit').onclick = () => finalSubmit('normal');
}

/* ---------- timer ---------- */
function startTimer(){
  if (tickHandle) clearInterval(tickHandle);
  lastTick = Date.now();
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('blur', onVis);
  window.addEventListener('focus', onFocus);
  tickHandle = setInterval(tick, 250);
}
function onVis(){ if (document.hidden) lastTick = Date.now(); else applyElapsed(); }
function onFocus(){
  applyElapsed();
  const now = Date.now();
  if (state && state.activeElapsed > 5 && now - (state.lastReturnWarningAt || 0) > 8000) {
    state.lastReturnWarningAt = now;
    state.warnings = (state.warnings || 0) + 1;
    toast('تم اكتشاف عودتك إلى الامتحان بعد مغادرة الصفحة. الوقت خارج الصفحة يُحتسب بثلاثة أضعاف.', true);
  }
}
function applyElapsed(){
  const now = Date.now();
  let delta = (now - lastTick) / 1000;
  if (delta < 0) delta = 0;
  if (delta > 300) delta = 300; /* clamp after throttling */
  lastTick = now;
  let mult = 1;
  if (document.hidden || !document.hasFocus()) mult = INACTIVE_MULTIPLIER;
  state.activeElapsed += delta * mult;
  checkDeadlines();
}
function tick(){ applyElapsed(); renderTimer(); saveState(); }
function checkDeadlines(){
  if (state.submitted) return;
  const remain = DURATION_MIN * 60 - state.activeElapsed;
  const hardRemain = HARD_LIMIT_MIN * 60 - (Date.now() - state.startedAt) / 1000;
  if (remain <= 0) autoSubmit('timeup_60');
  else if (hardRemain <= 0) autoSubmit('timeup_90');
}
function renderTimer(){
  const remain = DURATION_MIN * 60 - state.activeElapsed;
  const el = $('timer'); el.textContent = fmt(remain);
  el.classList.toggle('warn', remain <= 600 && remain > 120);
  el.classList.toggle('danger', remain <= 120);
  if (remain <= 300 && remain > 240 && !state._warn5) { state._warn5 = true; toast('تنبيه: بقي أقل من 5 دقائق!', true); }
  if (remain <= 60 && remain > 30 && !state._warn1) { state._warn1 = true; toast('تنبيه: بقي أقل من دقيقة واحدة!', true); }
}

/* ---------- rendering ---------- */
function sectionAr(sec){ const b = EX.blueprint.find((x) => x.section === sec); return b ? b.arName : sec; }
function isAnswered(qid){ const a = state.answers[qid]; return a !== undefined && a !== null && a !== ''; }
function go(i){ if (!state) return; state.cur = Math.max(0, Math.min(i, EX.questions.length - 1)); saveState(); renderAll(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function renderAll(){ if (!state.submitted) { renderProgress(); renderNav(); renderQuestionCard(); } }
function renderProgress(){
  const ans = EX.questions.filter((q) => isAnswered(q.id)).length;
  $('qProgress').textContent = ans + '/' + EX.questions.length + ' سؤال مُجاب';
  $('progBar').style.width = (ans / EX.questions.length * 100) + '%';
  $('bonusBadge').textContent = 'المكافآت: ' + (state.bonusTotal || 0) + ' / ' + BONUS_CAP;
}
function renderNav(){
  const g = $('navGrid'); g.innerHTML = '';
  EX.questions.forEach((q, i) => {
    const b = document.createElement('button');
    b.textContent = i + 1;
    b.className = (isAnswered(q.id) ? 'ans ' : '') + (i === state.cur ? 'cur' : '');
    b.title = sectionAr(q.section);
    b.setAttribute('aria-label', 'سؤال ' + (i + 1));
    b.onclick = () => go(i);
    g.appendChild(b);
  });
}
function renderQuestionCard(){
  const i = state.cur;
  const q = EX.questions[i];
  $('secTitle').textContent = sectionAr(q.section);
  $('sectionBadge').textContent = sectionAr(q.section);
  const card = $('questionCard');
  card.innerHTML = '<div class="badge">سؤال ' + (i + 1) + ' من ' + EX.questions.length + ' — ' + q.marks + ' درجة</div>' +
    '<div class="qtext en" dir="ltr">' + esc(q.q) + '</div>';

  if (q.section === 'reading') {
    const p = EX.readingPassage;
    card.insertAdjacentHTML('beforeend',
      '<details class="rev"><summary>عرض قطعة القراءة (The Hidden Side of Fame)</summary>' +
      '<div class="en" dir="ltr"><b>' + esc(p.title) + '</b><p>' + esc(p.text).replace(/\n\n/g, '</p><p>') + '</p></div></details>');
  }

  const chosen = state.answers[q.id];
  q.options.forEach((opt, oi) => {
    const label = document.createElement('label');
    label.className = 'opt' + (String(chosen) === String(opt) ? ' sel' : '');
    const input = document.createElement('input');
    input.type = 'radio'; input.name = 'q_' + q.id;
    input.checked = String(chosen) === String(opt);
    input.onchange = () => { state.answers[q.id] = opt; saveState(); renderNav(); renderProgress(); renderQuestionCard(); };
    const span = document.createElement('span');
    span.className = 'en'; span.dir = 'ltr'; span.textContent = opt;
    label.appendChild(input); label.appendChild(span);
    card.appendChild(label);
  });

  if (state.cur === EX.questions.length - 1) {
    card.insertAdjacentHTML('beforeend',
      '<div class="sectionwrap"><b>سؤال الكتابة (20 درجة)</b><p class="en" dir="ltr">' + esc(EX.writingPrompt) + '</p>' +
      '<textarea id="writingBox" placeholder="Write your paragraph here (English)..." aria-label="Writing answer"></textarea>' +
      '<div class="muted small">تُحفظ إجابتك تلقائياً أثناء الكتابة، وتُصحَّح يدوياً بعد التسليم.</div></div>');
    const box = $('writingBox');
    box.value = state.writing || '';
    let t = null;
    box.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.writing = box.value; saveState(); }, 600); });
  }
}

/* ---------- review ---------- */
function unansweredList(){ return EX.questions.filter((q) => !isAnswered(q.id)); }
function renderReview(){
  const miss = unansweredList();
  let html = '';
  if (miss.length) {
    html += '<div class="warnbanner">لديك ' + miss.length + ' سؤال/أسئلة بدون إجابة. يمكنك الرجوع وإكمالها قبل التسليم.</div>';
    html += '<div class="sectionwrap">' + miss.map((q, k) => '<div>' + (k + 1) + '. <span class="en" dir="ltr">' + esc(q.q.slice(0, 90)) + '</span></div>').join('') + '</div>';
  } else {
    html += '<div class="goodbanner">لقد أجبت عن جميع الأسئلة. بقي سؤال الكتابة إن لم تكتبه بعد.</div>';
  }
  const wr = (state.writing || '').trim();
  html += '<div class="sectionwrap"><b>الكتابة:</b> ' + (wr ? ('مكتوبة (' + wr.split(/\s+/).length + ' كلمة)') : 'فارغة حتى الآن') + '</div>';
  html += '<p class="muted">لن تتمكن من تغيير إجاباتك بعد التسليم النهائي.</p>';
  $('reviewBody').innerHTML = html;
}

/* ---------- bonus (evaluated at submission; deterministic; never leaks the key) ---------- */
function computeBonuses(details){
  const bonuses = [];
  let total = 0;
  const isCorrect = (id) => { const d = details.find((x) => x.id === id); return d && d.correct; };
  /* streak bonus: +1 at every run of 3 consecutive correct answers */
  let run = 0;
  EX.questions.forEach((q) => {
    if (isCorrect(q.id)) {
      run++;
      if (run % 3 === 0 && total < BONUS_CAP) { bonuses.push({ qid: q.id, points: 1, reason: 'سلسلة ' + run + ' إجابات صحيحة متتالية' }); total += 1; }
    } else { run = 0; }
  });
  /* limited deterministic random bonus: +1 on correct answers at positions divisible by 7 */
  EX.questions.forEach((q, i) => {
    if (isCorrect(q.id) && i % 7 === 3 && total < BONUS_CAP) { bonuses.push({ qid: q.id, points: 1, reason: 'مكافأة إضافية على إجابة صحيحة' }); total += 1; }
  });
  return { bonuses: bonuses, bonusTotal: Math.min(total, BONUS_CAP) };
}

/* ---------- submission ---------- */
async function autoSubmit(reason){
  if (submitting || state.submitted) return;
  toast('انتهى الوقت. يتم تسليم الامتحان تلقائياً.', true);
  await finalSubmit(reason);
}
async function finalSubmit(reason){
  if (submitting || state.submitted) return;
  submitting = true;
  const box = $('writingBox'); if (box) state.writing = box.value;
  state.submitted = true;
  state.submitReason = reason;
  state.submittedAt = Date.now();
  saveState();
  $('exam').classList.add('hidden');
  $('review').classList.add('hidden');
  $('results').classList.remove('hidden');

  const timeSpentSec = Math.round(state.activeElapsed);
  const realElapsedSec = Math.round((state.submittedAt - state.startedAt) / 1000);
  const submission = {
    examId: state.examId, name: state.name,
    submittedAt: state.submittedAt, startedAt: state.startedAt,
    submitReason: reason, answers: state.answers, writing: state.writing,
    rubric: EX.writingRubric, warnings: state.warnings || 0,
    timeSpentSec: timeSpentSec, realElapsedSec: realElapsedSec,
  };

  $('results').innerHTML = '<div class="card center"><h2>جارٍ التصحيح...</h2><p class="muted">يتم الآن حساب درجتك الموضوعية على الخادم.</p></div>';
  let res = null;
  try {
    const r = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ submission: submission }) });
    res = await r.json();
  } catch(e) { res = null; }

  if (!res || !res.result) {
    $('results').innerHTML = '<div class="card"><h2>تعذّر إكمال التصحيح على الخادم</h2>' +
      '<p class="muted">حدثت مشكلة في الاتصال بالخادم. يمكنك تصدير إجاباتك ومراجعة إجاباتك أدناه.</p><div id="offline"></div></div>';
    return renderResultsOffline(submission);
  }
  renderResults(res.result, submission);
}

/* ---------- results ---------- */
function secName(s){ return sectionAr(s); }
function renderResults(result, submission){
  const b = computeBonuses(result.details);
  state.bonusTotal = b.bonusTotal; state.bonuses = b.bonuses;
  localStorage.setItem(LS_DONE, JSON.stringify({ examId: state.examId, name: state.name, submittedAt: state.submittedAt }));
  saveState();

  const objective = result.objective, objectiveMax = result.objectiveMax;
  const reasonAr = submission.submitReason === 'normal' ? 'تسليم عادي (من الطالب)' :
    (submission.submitReason === 'timeup_60' ? 'انتهاء مدة الامتحان (60 دقيقة)' : 'بلوغ الحد الأقصى الفعلي (90 دقيقة)');

  let rows = '';
  EX.blueprint.forEach((bp) => {
    if (bp.section === 'writing') return;
    const s = result.bySection[bp.section] || { correct: 0, count: 0, score: 0, max: bp.max };
    rows += '<div class="stat"><span>' + esc(bp.arName) + '</span><b>' + s.score + ' / ' + s.max + '   (صحيح ' + s.correct + ' من ' + s.count + ')</b></div>';
  });
  rows += '<div class="stat"><span>الكتابة (تُرصد يدوياً)</span><b><span class="pill pending">قيد الانتظار / 20</span></b></div>';

  let banner = '';
  if (b.bonusTotal > 0) banner = '<div class="goodbanner">حصلت على ' + b.bonusTotal + ' نقطة مكافأة (منفصلة عن الدرجة الرسمية التي تبقى من 120).</div>';

  $('results').innerHTML =
    '<div class="card">' +
    '<h2>تم التسليم — ' + esc(state.name) + '</h2>' +
    '<p class="muted">رقم الامتحان: ' + esc(state.examId) + ' — سبب التسليم: ' + reasonAr + '</p>' +
    banner +
    '<div class="sectionwrap">' +
    '<div class="stat"><span>الدرجة الموضوعية (فورية)</span><b>' + objective + ' / ' + objectiveMax + '</b></div>' +
    rows +
    '<div class="stat"><span>الدرجة النهائية</span><b><span class="pill pending">قيد الانتظار</span> — تظهر بعد رصد الكتابة</b></div>' +
    '</div>' +
    '<p class="muted small">الدرجة الرسمية للامتحان = 120. أما نقاط المكافأة فهي عرض منفصل ولا تزيد الدرجة الرسمية.</p>' +
    '<div class="row"><button class="btn" id="exportBtn">تصدير الإجابات (ملف JSON)</button>' +
    '<button class="btn secondary" id="reportBtn">تصدير تقرير مقروء (HTML)</button></div>' +
    '<div id="exportMsg" class="muted small"></div>' +
    '</div>' +
    '<div class="card"><h3>مراجعة الأسئلة (بعد التسليم فقط)</h3><div id="reviewList"></div></div>';

  $('exportBtn').onclick = () => downloadExport(result, submission, b);
  $('reportBtn').onclick = () => downloadReport(result, submission, b);
  renderAnswerReview(result);
  window.scrollTo({ top: 0 });
}
function renderAnswerReview(result){
  const host = $('reviewList');
  const groups = {};
  result.details.forEach((d) => { (groups[d.section] = groups[d.section] || []).push(d); });
  let html = '';
  Object.keys(groups).forEach((sec) => {
    html += '<div class="sectionwrap"><h3>' + esc(secName(sec)) + '</h3>';
    groups[sec].forEach((d) => {
      const mark = d.correct ? '<span class="pill done">صحيحة</span>' : (d.answered ? '<span class="pill" style="background:#34161a;color:#fecaca">خاطئة</span>' : '<span class="pill" style="background:#243447">بدون إجابة</span>');
      html += '<details class="rev"><summary>' + d.id + ' ' + mark + ' <span class="en" dir="ltr">' + esc(d.question.slice(0, 70)) + '</span></summary>' +
        '<div class="en" dir="ltr"><p><b>' + esc(d.question) + '</b></p>' +
        '<p>إجابتك: ' + (d.answered ? esc(d.studentAnswer) : '<i>لم تُجب</i>') + '</p>' +
        '<p>الإجابة الصحيحة: ' + esc(d.correctAnswer) + '</p></div>' +
        '<div class="explain">' + esc(d.explanation) + '</div></details>';
    });
    html += '</div>';
  });
  host.innerHTML = html;
}

/* fallback when offline: no answer key available, show a clear limitation */
function renderResultsOffline(submission){
  let rows = '';
  EX.blueprint.forEach((bp) => { if (bp.section !== 'writing') rows += '<div class="stat"><span>' + esc(bp.arName) + '</span><b>' + bp.max + ' درجة</b></div>'; });
  $('results').innerHTML = '<div class="card"><h2>ملخص التسليم</h2>' +
    '<p class="muted">سبب التسليم: ' + esc(submission.submitReason) + ' — رقم الامتحان: ' + esc(submission.examId) + '</p>' +
    '<div class="sectionwrap">' + rows + '</div>' +
    '<p class="warnbanner">لم يتوفر تصحيح فوري لعدم الوصول للخادم. يمكنك تصدير إجاباتك الآن، وسيحتاج المصحح لتصحيحها يدوياً.</p>' +
    '<button class="btn" id="exportBtn2">تصدير الإجابات (ملف JSON)</button>' +
    '<div id="exportMsg"></div></div>';
  localStorage.setItem(LS_DONE, JSON.stringify({ examId: submission.examId, name: submission.name, submittedAt: submission.submittedAt }));
  $('exportBtn2').onclick = () => downloadExport(null, submission, null);
}

/* ---------- export ---------- */
function dl(filename, text, mime){
  try {
    const blob = new Blob([text], { type: mime || 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    $('exportMsg').textContent = 'تم تنزيل الملف: ' + filename + ' (افتحه من مجلد التنزيلات).';
  } catch(e) { $('exportMsg').textContent = 'تعذّر التنزيل على هذا المتصفح.'; }
}
function buildRecord(result, submission, b){
  const objective = result ? result.objective : null;
  const writing = state.writing || '';
  const words = writing.trim() ? writing.trim().split(/\s+/).length : 0;
  const rubric = (EX.writingRubric || []).map((r) => ({ criterion: r.ar, max: r.marks, awarded: null }));
  const detail = result ? result.details.map((d) => ({
    id: d.id, section: d.section, question: d.question, choices: d.options, marks: d.marks,
    studentAnswer: d.studentAnswer, correctAnswer: d.correctAnswer, correct: d.correct,
    answered: d.answered, explanation: d.explanation,
  })) : [];
  return {
    schema: 'English-Exam-U1-U2/v1',
    examId: state.examId, studentName: state.name,
    startedAt: state.startedAt, submittedAt: state.submittedAt,
    submitReason: submission.submitReason,
    timeSpentSec: submission.timeSpentSec, realElapsedSec: submission.realElapsedSec,
    tabSwitchWarnings: submission.warnings,
    totalExamMarks: TOTAL_MARKS,
    objectiveScore: objective, objectiveMax: result ? result.objectiveMax : null,
    correctCount: result ? result.correct : null,
    answeredCount: result ? result.answered : null,
    unansweredCount: result ? result.unanswered : null,
    bySection: result ? result.bySection : null,
    bonuses: b ? b.bonuses : [],
    bonusTotal: b ? b.bonusTotal : 0,
    bonusNote: 'Bonus points are separate from the official 120-mark score.',
    writing: { prompt: EX.writingPrompt, response: writing, wordCount: words, gradeStatus: 'pending', rubric },
    questions: detail,
    answers: state.answers,
  };
}
function downloadExport(result, submission, b){
  const rec = buildRecord(result, submission, b);
  const fn = 'English_Units_1-2_' + sanitize(state.name) + '_' + state.examId + '.json';
  dl(fn, JSON.stringify(rec, null, 2), 'application/json');
}
function downloadReport(result, submission, b){
  const rec = buildRecord(result, submission, b);
  let rows = '';
  EX.blueprint.forEach((bp) => {
    if (bp.section === 'writing') return;
    const s = (rec.bySection || {})[bp.section] || { score: '-', max: bp.max };
    rows += '<tr><td>' + bp.arName + '</td><td>' + s.score + ' / ' + s.max + '</td></tr>';
  });
  let qs = rec.questions.map((q) => '<tr><td>' + q.id + '</td><td>' + esc(q.correct ? 'correct' : (q.answered ? 'wrong' : 'blank')) + '</td><td>' + esc(q.studentAnswer || '-') + '</td><td>' + esc(q.correctAnswer) + '</td></tr>').join('');
  const html = '<!DOCTYPE html><html lang="en" dir="ltr"><head><meta charset="utf-8"><title>Report ' + esc(rec.examId) + '</title>' +
    '<style>body{font-family:sans-serif;margin:24px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;text-align:left}td{padding:6px}</style></head><body>' +
    '<h1>English Exam Report — Units 1-2</h1>' +
    '<p>Student: ' + esc(rec.studentName) + ' | Exam ID: ' + esc(rec.examId) + '</p>' +
    '<p>Submitted: ' + new Date(rec.submittedAt).toISOString() + ' | Reason: ' + esc(rec.submitReason) + '</p>' +
    '<p>Objective: ' + rec.objectiveScore + ' / ' + rec.objectiveMax + ' | Writing: PENDING / 20 | Bonus: ' + rec.bonusTotal + '</p>' +
    '<h2>Section scores</h2><table>' + rows + '</table>' +
    '<h2>Writing response</h2><pre style="white-space:pre-wrap;border:1px solid #ccc;padding:10px">' + esc(rec.writing.response) + '</pre>' +
    '<h2>Answer detail</h2><table><tr><th>ID</th><th>Result</th><th>Student</th><th>Correct</th></tr>' + qs + '</table>' +
    '</body></html>';
  const fn = 'English_Units_1-2_Report_' + sanitize(state.name) + '_' + state.examId + '.html';
  dl(fn, html, 'text/html');
}

/* ---------- go ---------- */
boot();
