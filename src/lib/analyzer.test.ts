import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AnswerChoice,
  QUESTIONS,
  QUESTION_COUNT,
  TRAIT_COUNT,
  analyzeScores,
  buildTraitScores,
  computeScoresFromAnswers,
  computeTraitPercentages,
  formatCSVRow,
  greedyDominantTrait,
  initializeScores,
  mergeSortTraits,
  normalizeUserName,
  parseCSVContent,
  recordAnswer,
} from './analyzer';

test('quiz contains exact 30 scenario questions with all 4 traits per question', () => {
  assert.equal(QUESTIONS.length, QUESTION_COUNT);
  assert.equal(QUESTION_COUNT, 30);
  assert.equal(TRAIT_COUNT, 4);
  for (const q of QUESTIONS) {
    assert.ok(q.category.length > 0);
    assert.equal(q.options.length, 4);
    assert.equal(q.traitForOption.length, 4);
    const uniqueTraits = new Set(q.traitForOption);
    assert.equal(uniqueTraits.size, 4);
  }
});

test('TC01-TC04: dominant trait identified accurately by both Greedy and Merge Sort', () => {
  const cases: Array<{ scores: [number, number, number, number]; expected: string }> = [
    { scores: [12, 4, 2, 2], expected: 'Introvert' },
    { scores: [3, 12, 3, 2], expected: 'Extrovert' },
    { scores: [2, 3, 12, 3], expected: 'Leader' },
    { scores: [2, 3, 3, 12], expected: 'Creative' },
  ];

  for (const tc of cases) {
    const analysis = analyzeScores(tc.scores);
    assert.equal(analysis.dominantTrait.name, tc.expected);
    assert.equal(analysis.ranked[0].name, tc.expected);
    assert.equal(analysis.ranked[0].score, analysis.dominantTrait.score);
  }
});

test('TC05 & TC06: deterministic tie-breaking preserves original trait order', () => {
  const equal = analyzeScores([5, 5, 5, 5]);
  assert.equal(equal.dominantTrait.name, 'Introvert');
  assert.deepEqual(
    equal.ranked.map((r) => r.name),
    ['Introvert', 'Extrovert', 'Leader', 'Creative']
  );

  const twoWayTie = analyzeScores([8, 8, 2, 2]);
  assert.equal(twoWayTie.dominantTrait.name, 'Introvert');
  assert.deepEqual(
    twoWayTie.ranked.map((r) => r.name),
    ['Introvert', 'Extrovert', 'Leader', 'Creative']
  );

  const secondThirdTie = analyzeScores([2, 8, 8, 2]);
  assert.equal(secondThirdTie.dominantTrait.name, 'Extrovert');
  assert.deepEqual(
    secondThirdTie.ranked.map((r) => r.name),
    ['Extrovert', 'Leader', 'Introvert', 'Creative']
  );
});

test('computeScoresFromAnswers accurately tallies weighted 1x and 2x answers and handles edits', () => {
  const answers: Array<AnswerChoice | null> = Array.from({ length: QUESTION_COUNT }, (_, idx) => {
    const leaderOption = QUESTIONS[idx].traitForOption.indexOf(2);
    return {
      optionIndex: leaderOption,
      weight: idx < 10 ? 2 : 1,
    };
  });

  const scores = computeScoresFromAnswers(answers);
  assert.deepEqual(scores, [0, 0, 40, 0]);

  // Simulate editing question 0 back to Introvert with weight 2
  const introvertOption0 = QUESTIONS[0].traitForOption.indexOf(0);
  answers[0] = { optionIndex: introvertOption0, weight: 2 };
  const updated = computeScoresFromAnswers(answers);
  assert.deepEqual(updated, [2, 0, 38, 0]);
});

test('recordAnswer bounds and weight checks', () => {
  let scores = initializeScores();
  const targetTrait = QUESTIONS[0].traitForOption[0];
  scores = recordAnswer(scores, 0, 0, 2);
  assert.equal(scores[targetTrait], 2);

  const unchanged = recordAnswer(scores, -1, 0);
  assert.deepEqual(unchanged, scores);
  const unchangedOpt = recordAnswer(scores, 0, 5);
  assert.deepEqual(unchangedOpt, scores);
});

test('computeTraitPercentages sums cleanly to 100%', () => {
  const pct1 = computeTraitPercentages([
    { score: 11 },
    { score: 5 },
    { score: 3 },
    { score: 1 },
  ]);
  assert.deepEqual(pct1, [55, 25, 15, 5]);
  assert.equal(pct1.reduce((a, b) => a + b, 0), 100);

  const pct2 = computeTraitPercentages([
    { score: 10 },
    { score: 10 },
    { score: 10 },
    { score: 3 },
  ]);
  assert.equal(pct2.reduce((a, b) => a + b, 0), 100);
});

test('TC08: blank or whitespace-only name defaults to Guest and clamps to 30 chars', () => {
  assert.equal(normalizeUserName(''), 'Guest');
  assert.equal(normalizeUserName('   '), 'Guest');
  assert.equal(normalizeUserName('Aarav'), 'Aarav');
  assert.equal(normalizeUserName('A'.repeat(40)).length, 30);
});

test('TC09: CSV row formatting and parsing handles commas and quotes cleanly', () => {
  const traits = buildTraitScores([2, 10, 5, 3]);
  const ranked = mergeSortTraits(traits);
  const dom = greedyDominantTrait(traits);
  assert.equal(traits[dom].score, ranked[0].score);

  const row1 = formatCSVRow('Aarav, Jr.', ranked, new Date(2026, 10, 17, 9, 5, 3));
  const row2 = formatCSVRow('Maya "M"', ranked, new Date(2026, 10, 17, 9, 6, 4));
  const parsed = parseCSVContent(row1 + row2);

  assert.equal(parsed.length, 2);
  assert.equal(parsed[0].userName, 'Aarav, Jr.');
  assert.equal(parsed[0].timestamp, '2026-11-17 09:05:03');
  assert.equal(parsed[0].ranked[0].name, 'Extrovert');
  assert.equal(parsed[0].ranked[0].score, 10);
  assert.equal(parsed[1].userName, 'Maya "M"');
});
