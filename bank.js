'use strict';
/*
 * Question bank for the Units 1-2 English exam.
 * Each item: { id, section, topic, q, options, answer, explanation, marks, src }
 *   answer = index of the single correct option.
 *   src    = traceability record: { file, excerpt, treatment }.
 * The answer key is used only server-side for grading and is never sent to the browser.
 */
const BLUEPRINT = [
  { section: 'vocab',       arName: 'المفردات',             type: 'mcq',         count: 30, marksEach: 1,   max: 30 },
  { section: 'grammar',     arName: 'القواعد',              type: 'mcq',         count: 30, marksEach: 1,   max: 30 },
  { section: 'verbforms',   arName: 'صيغ الكلمات والأفعال', type: 'gap',         count: 10, marksEach: 1,   max: 10 },
  { section: 'reading',     arName: 'القراءة والاستيعاب',   type: 'reading',     count: 10, marksEach: 1,   max: 10 },
  { section: 'translation', arName: 'الترجمة',              type: 'translation', count: 4,  marksEach: 2.5, max: 10 },
  { section: 'literature',  arName: 'الأدب (حول العالم)',   type: 'literature',  count: 5,  marksEach: 2,   max: 10 },
  { section: 'writing',     arName: 'الكتابة (فقرة)',       type: 'writing',     count: 1,  marksEach: 20,  max: 20 },
];
const WRITING_RUBRIC = [
  { key: 'relevance',    ar: 'الالتزام بالموضوع', marks: 4 },
  { key: 'grammar',      ar: 'القواعد',            marks: 5 },
  { key: 'vocabulary',   ar: 'المفردات',           marks: 4 },
  { key: 'spelling',     ar: 'الإملاء والترقيم',   marks: 3 },
  { key: 'organization', ar: 'الترابط والتنظيم',   marks: 4 },
];
const READING_PASSAGE = {
  title: 'The Hidden Side of Fame',
  text: [
    'Fame has always attracted people throughout history. Many dream of being recognised, admired, and loved by others. But behind the bright lights of success, there is often a hidden side that few ever see.',
    'Every one of us dreams of becoming famous one day or another. Sportsmen and champions of games and sports enjoy great fame. Film stars, singers and musicians are known all over the world. They have admirers and fans who follow them on social media and hang their photographs on the walls of their houses. Politicians and great men are famous people and their fame goes far and wide. Anyhow, fame is not easily obtained, but it is the result of hard work and suffering.',
    'The life of famous people is not an easy one. It is very busy and full of troubles and responsibilities. They appear smiling but in fact, they are unhappy and their time is arranged for them. Newspapers and magazines write about them and sometimes about their private lives, so this annoys them. Their smallest mistakes appear larger to those who dislike them. Though fame has its troubles, a great number of people desire to get it.',
  ].join('\n\n'),
};
const WRITING_PROMPT =
  'Write a well-organised paragraph of 100-150 words on the topic: "Social media does more harm than good." ' +
  'Give your opinion, support it with reasons and at least one example, and use vocabulary and grammar from Units 1-2.';
const Q = [];
const SRC = 'references/questions.md';
const vocab = [
  ['A lifestyle account shows only carefully selected achievements and removes ordinary moments. The account is best described as...', ['balanced', 'curated', 'mindful', 'unrelated'], 1, 'A "curated" account presents only selected, ideal content.', 'a lifestyle account shows only carefully selected'],
  ['Doctors recommend regular exercise to counter the effects of a ... lifestyle.', ['active', 'energetic', 'sedentary', 'athletic'], 2, 'A "sedentary" lifestyle involves little physical activity.', 'Doctors recommend regular exercise to counter the effects of a/an routine'],
  ['A lifestyle with very little movement is described as...', ['balanced', 'mindful', 'sedentary', 'curated'], 2, '"Sedentary" means very little movement.', 'A lifestyle with very little movement is'],
  ['Paying careful attention to the present moment is called...', ['social comparison', 'mindfulness', 'agency', 'nutrition'], 1, '"Mindfulness" is careful attention to the present moment.', 'Paying careful attention to the present moment is'],
  ['Language that strongly favours one side shows...', ['bias', 'agency', 'nutrition', 'pressure'], 0, '"Bias" is one-sidedness that supports one point of view.', 'Language that strongly favors one side shows'],
  ['Food that provides the body with what it needs supports good...', ['comparison', 'nutrition', 'isolation', 'advertising'], 1, '"Nutrition" is about the food the body needs.', 'Food that provides the body with what it needs supports good'],
  ['A ... is a health expert who gives advice on diet.', ['representative', 'curator', 'nutritionist', 'journalist'], 2, 'A "nutritionist" advises about diet.', 'a health expert who gives advice on diet and nutrition'],
  ['The power to make choices and act independently is...', ['bias', 'agency', 'isolation', 'pressure'], 1, '"Agency" is the power to make choices and act.', 'The power to make choices and act independently is'],
  ['A barrier in the environment that limits genuine choice is a ...', ['structural barrier', 'highlight reel', 'rhetorical question', 'intensifier'], 0, 'A "structural barrier" is an environmental obstacle to choice.', 'A barrier in the environment that limits genuine choice is a'],
  ["Belief in one's own ability to succeed is...", ['bias', 'social comparison', 'sedentary behaviour', 'self-efficacy'], 3, '"Self-efficacy" is belief in one\'s ability to succeed.', "Belief in one's ability to succeed is"],
  ['The word "sedentary" means...', ['energetic', 'active', 'mindful', 'inactive'], 3, '"Sedentary" is closest in meaning to "inactive".', 'The word "sedentary" means'],
  ['The ability to recover after difficulty is...', ['resilience', 'curation', 'bias', 'pressure'], 0, '"Resilience" is the ability to recover and adapt.', 'The ability to recover after difficulty is'],
  ['A gentle policy that encourages a choice without forcing it is a ...', ['comparison', 'nudge', 'claim', 'bias'], 1, 'A "nudge" gently encourages without removing freedom.', 'A gentle policy that encourages a choice without forcing it is a'],
  ['The phrase "highlight-reel effect" is closest in meaning to...', ['real image', 'complete picture', 'curated reality', 'honest view'], 2, 'It means showing only selected, idealised moments.', 'The phrase "highlight-reel effect" is closest in meaning to'],
  ['Challenger is known as brilliant but extremely ...', ['careless', 'shy', 'difficult', 'ordinary'], 2, 'In the source, Challenger is brilliant but very difficult.', 'Challenger is known as brilliant but extremely'],
  ["\"Constant criticism can seriously damage a teenager's self-esteem.\" The underlined noun has an antonymous meaning to...", ['self-respect', 'self-worth', 'self-confidence', 'self-doubt'], 3, 'Self-esteem means self-worth; its antonym is self-doubt.', 'Constant criticism can seriously damage a teenagers self-esteem'],
  ['"The report used hedging to avoid making absolute claims." The underlined noun is closest in meaning to...', ['certainty', 'caution', 'confidence', 'assertiveness'], 1, '"Hedging" expresses caution rather than certainty.', 'The report used hedging to avoid making absolute claims'],
  ['A fair report should present both viewpoints using...', ['emotional language', 'persuasive language', 'neutral language', 'exaggerated language'], 2, 'A fair report uses neutral language.', 'A fair report should present both viewpoints using'],
  ['Sharing only awards and celebrations online can create a ...', ['social connection', 'highlight-reel effect', 'balanced view', 'factual impression'], 1, 'Showing only best moments creates the highlight-reel effect.', 'Sharing only awards and celebrations online can create a'],
  ['The importance of regular sleep is often ... by busy students.', ['appreciated', 'exaggerated', 'underestimated', 'measured'], 2, 'Busy students often underestimate the importance of sleep.', 'The importance of regular sleep is often by busy students'],
  ['The researchers wanted results that could be tracked over time. They wanted results that were...', ['imaginary', 'emotional', 'selective', 'measurable'], 3, '"Measurable" results can be tracked.', 'The researchers wanted results that could be tracked over time'],
  ['Packaged snacks with added sugar and preservatives are usually...', ['natural food', 'fresh produce', 'processed food', 'raw food'], 2, 'Such snacks are "processed food".', 'Packaged snacks with added sugar and preservatives are usually'],
  ['An ... culture usually places strong emphasis on personal freedom and independence.', ['collective', 'cooperative', 'individualistic', 'communal'], 2, '"Individualistic" emphasises personal freedom.', 'An culture usually places strong emphasis on personal freedom and independence'],
  ['Regular exercise can ... improved physical and emotional well-being.', ['result in', 'damage', 'avoid', 'cancel'], 0, '"Result in" means lead to.', 'Regular exercise can improved physical and emotional wellbeing'],
  ['Losing interest in hobbies for a long time and feeling persistently sad may indicate...', ['mindfulness', 'nutrition', 'well-being', 'depression'], 3, 'These are possible signs of depression.', 'Losing interest in hobbies for a long time and feeling persistently sad'],
  ['"Daily mindfulness exercises helped the athlete remain calm." The underlined noun has an antonymous meaning to...', ['awareness', 'focus', 'distraction', 'attentiveness'], 2, 'Mindfulness = attentiveness; its antonym is distraction.', 'Daily mindfulness exercises helped the athlete remain calm'],
  ['Checking whether you really need an item before buying it shows...', ['social comparison', 'mindful consumption', 'processed food', 'dissatisfaction'], 1, 'Deciding carefully before buying is mindful consumption.', 'Checking whether you really need an item before buying it'],
  ["Improving sleep quality and reducing daily stress may strengthen a person's...", ['dissatisfaction', 'competition', 'isolation', 'well-being'], 3, 'These habits strengthen well-being.', 'Improving sleep quality and reducing daily stress may strengthen a persons'],
  ['Learning to plan your time can help you ... a heavy workload.', ['fail to meet', 'result in', 'cope with', 'set up'], 2, '"Cope with" means manage a heavy workload.', 'Learning to plan your time can help you a heavy workload'],
  ['"Her resilience helped her recover quickly after several disappointing results." The underlined noun is closest in meaning to...', ['vulnerability', 'adaptability', 'fragility', 'weakness'], 1, 'Resilience is close to adaptability (ability to recover).', 'Her resilience helped her recover quickly after several disappointing results'],
];
vocab.forEach((v, i) => Q.push({ id: 'V' + String(i + 1).padStart(2, '0'), section: 'vocab', topic: 'Unit 1 - Well-being, media & society', q: v[0], options: v[1], answer: v[2], explanation: v[3], marks: 1, src: { file: SRC, excerpt: v[4], treatment: 'rephrased/corrected' } }));
const grammar = [
  ['He remained calm ... he was facing a very difficult situation.', ['although', 'because of', 'despite', 'due to'], 0, 'A clause follows, so the conjunction "although" is needed.', 'He remained calm he was facing a very difficult situation'],
  ['"Constantly telling students that they cannot succeed can be disempowering." The underlined adjective is closest in meaning to...', ['supportive', 'motivating', 'discouraging', 'empowering'], 2, 'Disempowering is close to discouraging.', 'Constantly telling students that they cannot succeed can be disempowering'],
  ['Giving learners more freedom can encourage them to ... of their own progress.', ['lose control', 'take ownership', 'give up', 'avoid responsibility'], 1, '"Take ownership" fits with encouraging independence.', 'Giving learners more freedom can encourage them to of their progress'],
  ['In a ... workplace, employees are expected to support shared goals and cooperate closely.', ['competitive', 'collectivist', 'individualistic', 'independent'], 1, 'Shared goals and cooperation describe a collectivist workplace.', 'In a workplace, employees are expected to support shared goals'],
  ['Which sentence is the most neutral?', ['Anyone who rests is lazy.', 'This routine is absolutely perfect for everyone.', 'Some students may find an early routine helpful.', 'Only unsuccessful people miss a workout.'], 2, 'It uses cautious, unbiased language.', 'Which sentence is the most neutral?'],
  ['Which factor is most likely to weaken a claim based on a school survey?', ['A clearly described sample', 'A very small or unrepresentative sample', 'A question about stress', 'A table showing percentages'], 1, 'An unrepresentative sample weakens a claim.', 'Which factor is most likely to weaken a claim based on a school survey'],
  ['"A mindful student thinks before sharing photos online." The underlined adjective has an antonymous meaning to...', ['attentive', 'aware', 'thoughtful', 'careless'], 3, 'Mindful is close to attentive; its antonym is careless.', 'A mindful student thinks before sharing photos online'],
  ['Which persuasive technique is used in "Do we really want screens to replace every face-to-face experience?"', ['An intensifier', 'A rhetorical question', 'A hedging word', 'A word family'], 1, 'A question asked for effect is a rhetorical question.', 'Do we really want screens to replace every face-to-face experience'],
  ['Which of the following is an intensifier?', ['might', 'never', 'extremely', 'could'], 2, '"Extremely" strengthens the word it modifies.', 'Which of the following is an intensifier'],
  ['In "an amazing achievement," "amazing" is an ... expressing personal judgement.', ['intensifier', 'neutral expression', 'evaluative adjective', 'rhetorical question'], 2, '"Amazing" expresses a personal evaluative judgement.', 'In an amazing achievement, amazing is an'],
  ['Choose the correct sentence. (present-participle clause)', ['Students who sleeps regularly often concentrate more effectively.', 'Students slept regularly often concentrate more effectively.', 'Students sleeping regularly often concentrate more effectively.', 'Sleeping regularly, concentration improves the students.'], 2, '"Students sleeping regularly..." is the correct present-participle clause.', 'Students who sleeps regularly often concentrate more effectively'],
  ['Choose the correct sentence. (participle sharing the subject)', ['Chosen balanced meals, teenagers can support steady energy levels.', 'Teenagers choosing balanced meals, they can support steady energy levels.', 'Choosing balanced meals, steady energy supports teenagers.', 'Choosing balanced meals, teenagers can support steady energy levels.'], 3, 'The participle "Choosing..." must share the subject "teenagers".', 'Choosing balanced meals, teenagers can support steady energy levels'],
  ['Choose the correct sentence. (defining relative clause)', ['The habits, that reduce stress are different for each person.', 'The habits which reduce stress can be practiced daily.', 'The habits reducing stress, they can be practiced daily.', 'The habits which reducing stress can be practiced daily.'], 1, '"which reduce stress" is a correct defining relative clause.', 'The habits which reduce stress can be practiced daily'],
  ['Which of the following is the correct form? (conditional)', ['If schools offered counseling, students may felt better supported.', 'If schools had offer counseling, students would have felt better supported.', 'If schools offer counseling, students would have felt better supported yesterday.', 'If schools offer counseling, students may feel better supported.'], 3, 'Open present conditional with "may" is correct.', 'If schools offered counseling, students may felt better supported'],
  ['Which of the following is the correct form? (relative clause)', ['Teenagers which practice mindfulness often manage stress more effectively.', 'Teenagers practiced mindfulness, they often manage stress more effectively.', 'Teenagers who practice mindfulness often manage stress more effectively.', 'Practicing mindfulness, stress manages teenagers more effectively.'], 2, 'People take "who", not "which".', 'Teenagers who practice mindfulness often manage stress more effectively'],
  ['Choose the correct sentence. (non-defining relative clause)', ['The bridge, which was built in 1920, is still in use.', 'The bridge, who was built in 1920, is still in use.', 'The bridge, whose was built in 1920, is still in use.', 'The bridge, where was built in 1920, is still in use.'], 0, '"which" refers to the thing "the bridge".', 'The bridge, which was built in 1920, is still in use'],
  ['Choose the correct sentence. (relative pronoun for a thing)', ['The report who was published yesterday has attracted considerable attention.', 'The report where was published yesterday has attracted considerable attention.', 'The report whose was published yesterday has attracted considerable attention.', 'The report that was published yesterday has attracted considerable attention.'], 3, '"that" introduces the relative clause for a thing.', 'The report that was published yesterday has attracted considerable attention'],
  ['Which of the following is the correct form? (reduced relative, plural subject)', ['The documents finding in the archive were more valuable than expected.', 'The documents found in the archive was more valuable than expected.', 'The documents found in the archive were more valuable than expected.', 'The documents were found in the archive were more valuable than expected.'], 2, 'Reduced passive "found" + plural verb "were".', 'The documents found in the archive were more valuable than expected'],
  ['Which of the following is the correct form? (reduced relative, present participle)', ['The woman waiting outside is the director of the company.', 'The woman waited outside is the director of the company.', 'The woman waiting outside are the director of the company.', 'The woman to waiting outside is the director of the company.'], 0, 'Present participle "waiting outside" modifies "the woman".', 'The woman waiting outside is the director of the company'],
  ['Choose the correct sentence. (passive + reduced relative)', ['The candidates selecting for the final interview will be contacted tomorrow.', 'The candidates selected for the final interview will be contacted tomorrow.', 'The candidates selected for the final interview will be contact tomorrow.', 'The candidates were selected for the final interview will be contacted tomorrow.'], 1, 'Reduced passive "selected" + future passive "will be contacted".', 'The candidates selected for the final interview will be contacted tomorrow'],
  ['The museum, ... was renovated last year, attracts thousands of visitors.', ['that', 'which', 'where', 'what'], 1, '"which" is used for things in a non-defining clause.', 'The museum, was renovated last year, attracts thousands of visitors'],
  ['... enough evidence, the committee would reconsider its decision.', ['If there were', 'If there is', 'If there will be', 'If there had'], 0, 'Second conditional: "If there were..., would reconsider".', 'enough evidence, the committee would reconsider its decision'],
  ['Students ... regularly read outside class tend to develop stronger vocabulary.', ['which', 'whose', 'who', 'whom'], 2, '"who" refers to people who read outside class.', 'Students regularly read outside class tend to develop stronger vocabulary'],
  ['... by their health goals, many individuals choose to adopt a more active lifestyle.', ['Motivating', 'Motivated', 'Motivate', 'Who motivated'], 1, 'Reduced passive "Motivated by...".', 'by their health goals, many individuals choose to adopt a more active lifestyle'],
  ['If the study ... more schools, the findings would have been more conclusive.', ['includes', 'have included', 'included', 'had included'], 3, 'Third conditional: "If the study had included...".', 'If the study more schools, the findings would have been more conclusive'],
  ["... having free time, let's have coffee together.", ['Unless', 'If', 'Without', 'In case of'], 1, '"If" introduces the condition for the invitation.', "having free time, lets have coffee together"],
  ["You can't have a good job ... good qualifications.", ['unless', 'if', 'without', 'in case'], 2, '"without" fits the negative meaning.', "You cant have a good job good qualifications"],
  ["He was very careful, ... he wouldn't make that silly mistake.", ["Wasn't he", 'Were he', 'Is he', "Isn't he"], 1, 'Inverted conditional: "Were he careful, he wouldn\'t...".', "careful, he wouldnt make that silly mistake"],
  ['No sooner ... she finished speaking than the audience erupted into applause.', ['had', 'did', 'hardly had', 'scarcely had'], 0, '"No sooner had she finished..." is the correct inversion.', 'she finished speaking than the audience erupted into applause'],
  ['Not ... to the meeting, Hany decided not to attend.', ['invite', 'inviting', 'invited', 'to invite'], 2, 'Reduced passive negative: "Not invited to...".', 'to the meeting, Hany decided not to attend'],
];
grammar.forEach((v, i) => Q.push({ id: 'G' + String(i + 1).padStart(2, '0'), section: 'grammar', topic: 'Units 1-2 Grammar', q: v[0], options: v[1], answer: v[2], explanation: v[3], marks: 1, src: { file: SRC, excerpt: v[4], treatment: 'copied/corrected' } }));
const verbforms = [
  ["Supportive relationships can strengthen a young person's ... (resilient).", ['resilient', 'resilience', 'resiliently', 'resiliences'], 1, 'A possessive noun needs the noun form "resilience".', '(resilient) after setbacks'],
  ['The new ramp improved the ... of the community sports centre. (accessible)', ['accessible', 'access', 'accessibly', 'accessibility'], 3, '"the ... of" needs the noun "accessibility".', 'The new ramp improved the (accessible) of the community sports center'],
  ["Regular exercise has a ... effect on teenagers' mental health. (significance)", ['significance', 'significant', 'significantly', 'signify'], 1, 'An adjective is needed before the noun "effect".', 'Regular exercise has a significance effect on teenagers mental health'],
  ['Schools should encourage every student to ... in physical activity. (participation)', ['participation', 'participate', 'participating', 'participant'], 1, 'After "to" we need the base verb "participate".', 'Schools should encourage every student to (participation) in physical activity'],
  ['The final match was highly ... until the final whistle. (compete)', ['compete', 'competition', 'competitive', 'competitively'], 2, 'An adjective is needed after "highly".', 'The final match was highly compete until the final whistle'],
  ['Affordable facilities improve the ... of physical activity for young people. (accessible)', ['accessible', 'access', 'accessibility', 'accessibly'], 2, 'The noun "accessibility" is required.', 'Affordable facilities improve the accessible of physical activity'],
  ['Clear information can ... students to make more independent health choices. (power)', ['power', 'powerful', 'empower', 'empowerment'], 2, 'A verb is needed after "can": "empower".', 'Clear information can power students to make more independent health choices'],
  ['Creative activities improve cognitive ... and help people adapt. (flexible)', ['flexible', 'flexibly', 'flexibility', 'flex'], 2, 'The noun "flexibility" is required.', 'Creative activities improve cognitive flexible'],
  ['The students participated ... in the school sports competition. (active)', ['active', 'actively', 'activity', 'activeness'], 1, 'An adverb is needed to modify "participated".', 'The students participated active in the school sports competition'],
  ['Teenagers ... by supportive families may maintain healthier habits. (encourage)', ['encourage', 'encouraging', 'encouraged', 'encouragement'], 2, 'Reduced passive "encouraged by...".', 'Teenagers encourage by supportive families may maintain healthier habits'],
];
verbforms.forEach((v, i) => Q.push({ id: 'F' + String(i + 1).padStart(2, '0'), section: 'verbforms', topic: 'Word & verb forms', q: v[0], options: v[1], answer: v[2], explanation: v[3], marks: 1, src: { file: SRC, excerpt: v[4], treatment: 'corrected' } }));
const reading = [
  ['What is the main idea of the passage?', ['Famous people are always happy and free.', 'Fame brings both admiration and difficulties.', 'Only sportsmen can be famous.', 'Fame is easy to get if you work a little.'], 1, 'The passage presents both the admiration and the troubles of fame.'],
  ['From the passage, we can infer that most famous people...', ['have no responsibilities', 'control their own time freely', 'may feel lonely or stressed despite their success', 'enjoy reading about themselves in newspapers'], 2, 'The passage says they appear smiling but are in fact unhappy.'],
  ['Famous people may appear smiling although...', ['they have admirers and fans', 'their time is arranged for them', 'they are far from being happy', 'their fame has gone far'], 2, 'They smile outwardly but are often unhappy.'],
  ['"Their time is arranged for them." This means...', ['they are free to do what they like', 'their freedom is far', 'they have free time', 'they are not free to do what they like'], 3, 'It means they are not free to decide their own time.'],
  ["Why do newspapers and magazines write about famous people's private lives?", ['Because famous people enjoy it', 'To make them happy', "To attract readers' attention", 'To protect their privacy'], 2, "The aim is to attract readers' attention."],
  ['The word "obtained" in the passage is closest in meaning to...', ['reached', 'given', 'avoided', 'imagined'], 0, '"Obtained" is close to "reached" (gained).'],
  ['The pronoun "them" in "Newspapers and magazines write about them" refers to...', ['newspapers', 'magazines', 'famous people', 'lives'], 2, '"them" refers to the famous people being written about.'],
  ["\"Writing about famous people's private lives ... them.\" The verb that fits is...", ['pleases', 'annoys', 'entertains', 'surprises'], 1, 'The passage states it "annoys them".'],
  ['According to the passage, fame is the result of...', ['luck alone', 'hard work and suffering', 'social media', 'private lives'], 1, 'It is "the result of hard work and suffering".'],
  ['Which statement is TRUE according to the passage?', ['Famous people have no responsibilities.', 'Famous people can freely arrange their own time.', 'A great number of people still desire fame.', "Newspapers always protect famous people's privacy."], 2, 'The passage ends: "a great number of people desire to get it".'],
];
reading.forEach((v, i) => Q.push({ id: 'R' + String(i + 1).padStart(2, '0'), section: 'reading', topic: 'Reading comprehension', q: v[0], options: v[1], answer: v[2], explanation: v[3], marks: 1, src: { file: SRC, excerpt: 'Fame passage', treatment: 'copied/corrected' } }));

const translation = [
  ['Choose the correct English translation: "بفضل التقدم الهائل في وسائل الاتصالات، أصبح العالم قرية عالمية، فلا يمكن لأي دولة أن تعيش في معزل."', ['Due to the enormous progress in the means of communications, the world has become a global village. No country can live in isolation.', 'Because of the frightening progress in communication, the world became a global village so every country can live in isolation.', 'Thanks to the huge renaissance in the means of transport, the world has become a global village, so no country can live in balance.', 'Despite the enormous progress in communication matters, the world has become a global village, so any country can live in balance.'], 0, 'This option preserves "means of communications", "global village" and "live in isolation".'],
  ['Choose the correct English translation: "تنفذ الحكومة الكثير من المشروعات القومية العملاقة كمحطات توليد الطاقة الشمسية واستصلاح الأراضي في صعيد مصر."', ['The government is implementing many mega national projects such as solar energetic stations and land reclamation in Upper Egypt.', 'The government is implementing many mega national projects such as solar power stations and land reclamation in Upper Egypt.', 'The government is implementing many mega international projects such as solar power stations and land reclamation in Upper Egypt.', 'The government is implementing much mega national projects such as solar power stations and ground reclamation in Upper Egypt.'], 1, '"solar power stations" and "national projects" are correct.'],
  ['Choose the correct Arabic meaning of: "Despite the many benefits of social networking sites, they sometimes spread rumours and create chaos in society."', ['رغم الفوائد الكثيرة لمواقع التواصل الاجتماعي فإنها غالبا تنشر الحقائق وتخلق النظام في المجتمع.', 'رغم الفوائد الكثيرة لمواقع التواصل الاجتماعي فإنها أحيانا تنشر الشائعات وتخلق الفوضى في المجتمع.', 'رغم قلة فوائد مواقع التواصل الاجتماعي فإنها أحيانا تنشر الشائعات وتخلق الفوضى في المجتمع.', 'رغم الفوائد الكثيرة لوسائل المواصلات فإنها أحيانا تنشر الشائعات وتخلق الفوضى في المجتمع.'], 1, '"sometimes" = أحيانا، "rumours" = الشائعات، "chaos" = الفوضى.'],
  ['Choose the correct Arabic translation: "The government tries hard to reform and develop slums with the aim of providing a decent life for people."', ['تحاول الحكومة جاهدة إصلاح وتطوير المناطق العشوائية بهدف توفير حياة كريمة للناس.', 'تحاول الحكومة بصعوبة إبلاغ وتطوير المناطق العشوائية بهدف توفير حياة كريمة للناس.', 'تحاول الحكومة جاهدة إصلاح وتطوير المناطق العشوائية بهدف توفير حياة حديثة للناس.', 'بالكاد تحاول الحكومة إصلاح وتطوير المناطق العشوائية بهدف توفير حياة كريمة للناس.'], 0, '"tries hard" = تحاول جاهدة، "slums" = المناطق العشوائية، "decent life" = حياة كريمة.'],
];
translation.forEach((v, i) => Q.push({ id: 'T' + String(i + 1).padStart(2, '0'), section: 'translation', topic: 'Translation (Ar/En)', q: v[0], options: v[1], answer: v[2], explanation: v[3], marks: 2.5, src: { file: SRC, excerpt: 'Translation items', treatment: 'copied/corrected' } }));

const literature = [
  ['Around the World in Eighty Days: Why was Fogg so confident that he could travel around the world in eighty days?', ['Because he owned his own train company.', 'Because he had calculated the journey precisely and trusted his plan.', 'Because Passepartout promised to pay for everything.', 'Because the newspapers told him it was impossible.'], 1, 'Fogg relied on careful calculation and a methodical plan.'],
  ["How does the description of Fogg's house reflect his personality?", ['It is untidy and full of surprises.', 'It is neat, precise and orderly, like Fogg himself.', 'It is decorated with photographs of famous people.', 'It changes every week according to his mood.'], 1, 'His orderly, precise house mirrors his exact, methodical nature.'],
  ["What differences can you see between Fogg and Passepartout's personalities?", ['Both of them are equally calm and unemotional.', 'Fogg is calm and exact, while Passepartout is more excitable and impulsive.', 'Fogg is lazy, while Passepartout works very hard.', 'Passepartout is richer and more educated than Fogg.'], 1, 'Fogg is calm and exact; Passepartout is livelier and more impulsive.'],
  ['Do you think Fogg and Passepartout will get along well in the future?', ['No, because they disagree about everything.', 'Yes, because their different personalities complement each other.', 'No, because Fogg dismisses Passepartout immediately.', 'Yes, because they are exactly the same person.'], 1, 'Their complementary personalities help them cooperate.'],
  ["Why do you think Fogg's interview with Passepartout was so short?", ['Because Passepartout was not interested in the job.', 'Because Fogg valued precise, business-like efficiency.', 'Because the interview happened by telephone.', 'Because Fogg could not speak French at all.'], 1, "Fogg's brief interview reflects his exact, efficient character."],
];
literature.forEach((v, i) => Q.push({ id: 'L' + String(i + 1).padStart(2, '0'), section: 'literature', topic: 'Literature', q: v[0], options: v[1], answer: v[2], explanation: v[3], marks: 2, src: { file: SRC, excerpt: 'Around the World in Eighty Days questions', treatment: 'rephrased' } }));

const WRITING = { id: 'W01', section: 'writing', topic: 'Paragraph writing', q: WRITING_PROMPT, marks: 20 };

/* ---------------- validation ---------------- */
function validateBank() {
  const errors = [];
  const ids = new Set();
  const texts = new Map();
  for (const it of Q) {
    if (ids.has(it.id)) errors.push('Duplicate id: ' + it.id);
    ids.add(it.id);
    if (!it.q || !String(it.q).trim()) errors.push('Missing question text: ' + it.id);
    if (!Array.isArray(it.options) || it.options.length < 2) errors.push('Missing choices: ' + it.id);
    if (!Number.isInteger(it.answer) || it.answer < 0 || it.answer >= (it.options || []).length) errors.push('Invalid answer key: ' + it.id);
    if (!it.marks || it.marks <= 0) errors.push('Missing marks: ' + it.id);
    const norm = (it.options || []).map((o) => String(o).trim().toLowerCase());
    if (new Set(norm).size !== norm.length) errors.push('Duplicate choices in ' + it.id);
    const key = String(it.q).trim().toLowerCase();
    if (texts.has(key)) errors.push('Duplicate question text: ' + it.id + ' / ' + texts.get(key));
    else texts.set(key, it.id);
  }
  const bySec = {};
  for (const it of Q) bySec[it.section] = (bySec[it.section] || 0) + 1;
  for (const b of BLUEPRINT) {
    if (b.section === 'writing') continue;
    const n = bySec[b.section] || 0;
    if (n !== b.count) errors.push('Section ' + b.section + ' has ' + n + ' questions, expected ' + b.count);
  }
  if (!READING_PASSAGE || !READING_PASSAGE.text) errors.push('Missing reading passage');
  if (!WRITING || !WRITING.q) errors.push('Missing paragraph prompt');
  const sum = BLUEPRINT.reduce((s, b) => s + b.max, 0);
  if (sum !== 120) errors.push('Blueprint total is not 120: ' + sum);
  const rubricSum = WRITING_RUBRIC.reduce((s, r) => s + r.marks, 0);
  if (rubricSum !== 20) errors.push('Writing rubric total is not 20: ' + rubricSum);
  return { ok: errors.length === 0, errors, counts: bySec, totalMarks: sum };
}

/* ---------------- public payload (NO answer key) ---------------- */
function publicExam() {
  return {
    blueprint: BLUEPRINT,
    totalMarks: BLUEPRINT.reduce((s, b) => s + b.max, 0),
    readingPassage: READING_PASSAGE,
    writingPrompt: WRITING_PROMPT,
    writingRubric: WRITING_RUBRIC,
    durationMinutes: 60,
    hardLimitMinutes: 90,
    questions: Q.map((it) => ({ id: it.id, section: it.section, topic: it.topic, q: it.q, options: it.options, marks: it.marks })),
  };
}

/* ---------------- grading (server-side only) ---------------- */
function gradeObjective(answers) {
  const details = [];
  const bySection = {};
  let objective = 0, objectiveMax = 0, correct = 0, answered = 0, unanswered = 0;
  for (const it of Q) {
    const marks = it.marks;
    objectiveMax += marks;
    const raw = answers ? answers[it.id] : undefined;
    const isAns = raw !== undefined && raw !== null && raw !== '';
    let ok = false, studentAns = raw;
    if (isAns) {
      answered++;
      const s = String(raw);
      const chosen = it.options.findIndex((o) => String(o) === s);
      ok = chosen === it.answer;
      studentAns = chosen >= 0 ? it.options[chosen] : s;
    } else {
      unanswered++;
    }
    const awarded = ok ? marks : 0;
    objective += awarded;
    if (ok) correct++;
    if (!bySection[it.section]) bySection[it.section] = { correct: 0, total: 0, score: 0, max: 0, count: 0 };
    const s = bySection[it.section];
    s.count++; s.max += marks; s.score += awarded; s.total++;
    if (ok) s.correct++;
    details.push({
      id: it.id, section: it.section, question: it.q, options: it.options, marks,
      studentAnswer: isAns ? studentAns : null,
      correctAnswer: it.options[it.answer],
      correct: ok, answered: isAns, explanation: it.explanation,
    });
  }
  return { objective, objectiveMax, correct, answered, unanswered, bySection, details };
}

module.exports = { BLUEPRINT, WRITING_RUBRIC, READING_PASSAGE, WRITING_PROMPT, WRITING, Q, validateBank, publicExam, gradeObjective };
