'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { FAMILY_FIELDS, publishForFamilies, selfCheck } = require('./publisher');

const publisherSource = fs.readFileSync(path.join(__dirname, 'publisher.js'), 'utf8');
const magazineSource = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

test('self-check strips a sample that carries forbidden fields', () => {
  const published = selfCheck();
  assert.deepEqual(Object.keys(published), [
    'title',
    'stage',
    'neighbourhood',
    'keystoneQuestion',
    'bigIdea',
    'questionsToExplore',
    'outcomeCode',
    'outcomeDescription',
  ]);
});

test('a Strapi-shaped record keeps family fields and drops the working file', () => {
  const raw = {
    data: {
      id: 14,
      attributes: {
        title: 'Identity',
        stage: 'Primary',
        neighbourhood: 'Belonging',
        keystoneQuestion: 'developed with the students',
        bigIdea: 'belonging',
        questionsToExplore: [],
        outcomeCode: '',
        outcomeDescription: '',
        weeklyPlan: 'WEEKLY-PLAN-SECRET',
        assessmentNotes: 'ASSESSMENT-NOTES-SECRET',
        reportComments: 'REPORT-COMMENT-SECRET',
        engagementRating: 4,
        adjustments: 'ADJUSTMENT-SECRET',
        evidence: ['EVIDENCE-SECRET'],
        studentRecords: [{ studentName: 'STUDENT-NAME-SECRET' }],
      },
    },
  };

  const published = publishForFamilies(raw);
  assert.equal(published.title, 'Identity');
  assert.deepEqual(published.questionsToExplore, []);
  assert.equal(published.outcomeCode, '');
  assert.equal(JSON.stringify(published).includes('SECRET'), false);
  for (const key of Object.keys(published)) {
    assert.equal(FAMILY_FIELDS.includes(key), true);
  }
});

test('several outcomes keep code and description only', () => {
  const published = publishForFamilies({
    title: 'Identity',
    outcomes: [
      { outcomeCode: 'ONE', outcomeDescription: 'First', mark: 12, studentName: 'STUDENT-NAME-SECRET' },
      { code: 'TWO', description: 'Second', evidence: 'EVIDENCE-SECRET' },
    ],
  });
  assert.deepEqual(published.outcomeCode, ['ONE', 'TWO']);
  assert.deepEqual(published.outcomeDescription, ['First', 'Second']);
  assert.equal(JSON.stringify(published).includes('SECRET'), false);
});

test('the publisher source has no mutation client', () => {
  assert.match(publisherSource, /Weekly plans, assessment notes, report comments, engagement ratings/);
  assert.match(publisherSource, /adjustments, evidence, and student records are refused/);
  assert.equal(/\bfetch\s*\(/.test(publisherSource), false);
  assert.equal(/XMLHttpRequest|axios|http\.request|https\.request/.test(publisherSource), false);
  assert.equal(/\/api\//.test(publisherSource), false);
  assert.equal(/\b(POST|PUT|PATCH|DELETE)\b/.test(publisherSource), false);
  assert.equal(/strapi/i.test(publisherSource), false);
});

test('the magazine does not invent outcome codes, names, or scores', () => {
  assert.match(magazineSource, /id="primary-identity"/);
  assert.match(magazineSource, /https:\/\/curriculum\.nsw\.edu\.au\/stages\/primary/);
  assert.match(magazineSource, /not a saved program/);
  assert.equal(/\b[A-Z]{2,3}\d-[A-Z0-9]{2,}/.test(magazineSource), false);
  assert.equal(/\b(NAPLAN|PAT)\b/.test(magazineSource), false);
  assert.equal(/\bgrade(s)?\b/i.test(magazineSource), false);
  assert.equal(/<form\b/i.test(magazineSource), false);
  assert.equal(/<button\b/i.test(magazineSource), false);
});
