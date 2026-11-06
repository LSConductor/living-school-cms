'use strict';

/**
 * Read-only publisher for the family magazine.
 * Weekly plans, assessment notes, report comments, engagement ratings,
 * adjustments, evidence, and student records are refused.
 * This file does not call the network and does not write to the CMS.
 */

const FAMILY_FIELDS = Object.freeze([
  'title',
  'stage',
  'neighbourhood',
  'keystoneQuestion',
  'bigIdea',
  'questionsToExplore',
  'outcomeCode',
  'outcomeDescription',
]);

const STRING_ALIASES = {
  title: ['title'],
  stage: ['stage'],
  neighbourhood: ['neighbourhood', 'neighborhood'],
  keystoneQuestion: ['keystoneQuestion', 'keystone_question', 'keystone question'],
  bigIdea: ['bigIdea', 'big_idea', 'big idea'],
};

const QUESTION_ALIASES = ['questionsToExplore', 'questions_to_explore', 'questions to explore'];

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function own(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function firstOwnString(object, keys) {
  if (!isPlainObject(object)) return undefined;
  for (const key of keys) {
    if (!own(object, key)) continue;
    if (typeof object[key] === 'string') return object[key];
  }
  return undefined;
}

function recordCandidates(raw) {
  const found = [];
  if (isPlainObject(raw)) found.push(raw);
  if (isPlainObject(raw && raw.attributes)) found.push(raw.attributes);
  if (isPlainObject(raw && raw.data)) found.push(raw.data);
  if (isPlainObject(raw && raw.data && raw.data.attributes)) found.push(raw.data.attributes);
  return found;
}

function allowListScore(object) {
  let score = 0;
  for (const field of Object.keys(STRING_ALIASES)) {
    if (firstOwnString(object, STRING_ALIASES[field]) !== undefined) score += 1;
  }
  for (const key of QUESTION_ALIASES) {
    if (own(object, key)) score += 1;
  }
  if (own(object, 'outcomeCode') || own(object, 'outcome_code') || own(object, 'outcome code')) score += 1;
  if (
    own(object, 'outcomeDescription') ||
    own(object, 'outcome_description') ||
    own(object, 'outcome description')
  ) {
    score += 1;
  }
  if (own(object, 'outcomes') || own(object, 'outcome')) score += 1;
  return score;
}

function chooseRecord(raw) {
  const candidates = recordCandidates(raw);
  if (candidates.length === 0) return null;
  let best = candidates[0];
  let bestScore = allowListScore(best);
  for (const candidate of candidates.slice(1)) {
    const score = allowListScore(candidate);
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}

function readQuestions(value) {
  if (typeof value === 'string') return [value];
  if (!Array.isArray(value)) return undefined;
  const questions = [];
  for (const item of value) {
    if (typeof item === 'string') {
      questions.push(item);
      continue;
    }
    if (!isPlainObject(item)) continue;
    const text = firstOwnString(item, ['question', 'text']);
    if (text !== undefined) questions.push(text);
  }
  return questions;
}

function readOutcomePair(item) {
  if (!isPlainObject(item)) return null;
  const code = firstOwnString(item, ['outcomeCode', 'outcome_code', 'code']);
  const description = firstOwnString(item, ['outcomeDescription', 'outcome_description', 'description']);
  if (code === undefined && description === undefined) return null;
  return { code, description };
}

function assignOutcomeField(target, field, values) {
  const present = values.filter((value) => value !== undefined);
  if (present.length === 1) target[field] = present[0];
  else if (present.length > 1) target[field] = present;
}

function nestedText(source, aliases) {
  for (const key of aliases) {
    if (!own(source, key) || !isPlainObject(source[key])) continue;
    const text = firstOwnString(source[key], ['text', 'question', 'title']);
    if (text !== undefined) return text;
  }
  return undefined;
}

function publishForFamilies(rawProgram) {
  const source = chooseRecord(rawProgram);
  if (!source) return {};

  const published = {};

  for (const field of ['title', 'stage', 'neighbourhood', 'keystoneQuestion', 'bigIdea']) {
    const direct = firstOwnString(source, STRING_ALIASES[field]);
    if (direct !== undefined) published[field] = direct;
    else {
      const nested = nestedText(source, STRING_ALIASES[field]);
      if (nested !== undefined) published[field] = nested;
    }
  }

  for (const key of QUESTION_ALIASES) {
    if (!own(source, key)) continue;
    const questions = readQuestions(source[key]);
    if (questions !== undefined) published.questionsToExplore = questions;
    break;
  }

  const pairs = [];
  if (Array.isArray(source.outcomes)) {
    for (const item of source.outcomes) {
      const pair = readOutcomePair(item);
      if (pair) pairs.push(pair);
    }
  } else if (isPlainObject(source.outcome)) {
    const pair = readOutcomePair(source.outcome);
    if (pair) pairs.push(pair);
  }

  if (pairs.length > 0) {
    assignOutcomeField(
      published,
      'outcomeCode',
      pairs.map((pair) => pair.code),
    );
    assignOutcomeField(
      published,
      'outcomeDescription',
      pairs.map((pair) => pair.description),
    );
  } else {
    const code = firstOwnString(source, ['outcomeCode', 'outcome_code', 'outcome code']);
    const description = firstOwnString(source, [
      'outcomeDescription',
      'outcome_description',
      'outcome description',
    ]);
    if (code !== undefined) published.outcomeCode = code;
    if (description !== undefined) published.outcomeDescription = description;
  }

  const ordered = {};
  for (const field of FAMILY_FIELDS) {
    if (own(published, field)) ordered[field] = published[field];
  }
  return ordered;
}

function selfCheck() {
  const sample = {
    title: 'Identity',
    stage: 'Primary K–4',
    neighbourhood: 'Belonging',
    keystoneQuestion: { text: 'developed with the students', notes: 'TEACHER-NOTE-SECRET' },
    bigIdea: 'safe, respectful foundations',
    questionsToExplore: [
      'How do my senses help me discover things?',
      { question: 'What surprised me?', notes: 'TEACHER-NOTE-SECRET', evidence: 'EVIDENCE-SECRET' },
    ],
    outcomes: [
      {
        code: 'SAMPLE-ONLY',
        description: 'sample description',
        grade: 'A',
        studentName: 'STUDENT-NAME-SECRET',
        evidence: 'EVIDENCE-SECRET',
        naplan: 640,
        pat: 91,
      },
    ],
    weeklyPlan: 'WEEKLY-PLAN-SECRET',
    assessmentNotes: 'ASSESSMENT-NOTES-SECRET',
    reportComments: 'REPORT-COMMENT-SECRET',
    engagementRating: 'ENGAGEMENT-RATING-SECRET',
    adjustments: 'ADJUSTMENT-SECRET',
    evidence: ['EVIDENCE-SECRET'],
    studentRecords: [{ studentName: 'STUDENT-NAME-SECRET', grade: 'A', naplan: 640, pat: 91 }],
    grade: 'BAND-SECRET',
    naplan: 640,
    pat: 91,
  };

  const published = publishForFamilies(sample);
  const serialised = JSON.stringify(published);
  const forbiddenKeys = [
    'weeklyPlan',
    'assessmentNotes',
    'reportComments',
    'engagementRating',
    'adjustments',
    'evidence',
    'studentRecords',
    'studentName',
    'grade',
    'naplan',
    'pat',
    'notes',
  ];

  for (const key of forbiddenKeys) {
    if (own(published, key)) throw new Error('Forbidden field was published: ' + key);
  }
  for (const key of Object.keys(published)) {
    if (!FAMILY_FIELDS.includes(key)) throw new Error('Field outside the allow-list: ' + key);
  }

  const secrets = [
    'WEEKLY-PLAN-SECRET',
    'ASSESSMENT-NOTES-SECRET',
    'REPORT-COMMENT-SECRET',
    'ENGAGEMENT-RATING-SECRET',
    'ADJUSTMENT-SECRET',
    'EVIDENCE-SECRET',
    'STUDENT-NAME-SECRET',
    'TEACHER-NOTE-SECRET',
    'BAND-SECRET',
  ];
  for (const secret of secrets) {
    if (serialised.includes(secret)) throw new Error('Forbidden value was published: ' + secret);
  }
  if (serialised.includes('640') || serialised.includes('91')) throw new Error('A score was published');
  if (published.title !== 'Identity') throw new Error('title was dropped');
  if (published.stage !== 'Primary K–4') throw new Error('stage was dropped');
  if (published.neighbourhood !== 'Belonging') throw new Error('neighbourhood was dropped');
  if (published.keystoneQuestion !== 'developed with the students') {
    throw new Error('keystone question kept more than its text');
  }
  if (published.bigIdea !== 'safe, respectful foundations') throw new Error('big idea was dropped');
  if (!Array.isArray(published.questionsToExplore) || published.questionsToExplore.length !== 2) {
    throw new Error('questions to explore were not kept as text');
  }
  if (published.questionsToExplore[1] !== 'What surprised me?') {
    throw new Error('question object kept more than its text');
  }
  if (published.outcomeCode !== 'SAMPLE-ONLY') throw new Error('outcome code was dropped');
  if (published.outcomeDescription !== 'sample description') throw new Error('outcome description was dropped');
  return published;
}

module.exports = {
  FAMILY_FIELDS,
  publishForFamilies,
  selfCheck,
};

if (require.main === module) {
  selfCheck();
  console.log('publisher self-check passed');
}
