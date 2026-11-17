export enum Trait {
  INTROVERT = 0,
  EXTROVERT = 1,
  LEADER = 2,
  CREATIVE = 3,
}

export interface Question {
  category: string;
  prompt: string;
  options: [string, string, string, string];
  traitForOption: [Trait, Trait, Trait, Trait];
}

export interface AnswerChoice {
  optionIndex: number;
  weight: 1 | 2;
}

export interface TraitScore {
  trait: Trait;
  name: string;
  score: number;
  description: string;
}

export interface GreedyStep {
  index: number;
  candidateName: string;
  candidateScore: number;
  currentBestIndex: number;
  currentBestName: string;
  currentBestScore: number;
  updated: boolean;
}

export interface MergeSortStep {
  depth: number;
  phase: 'divide' | 'merge';
  left: number;
  mid: number;
  right: number;
  before: Array<{ name: string; score: number }>;
  after: Array<{ name: string; score: number }>;
}

export interface SavedResultRow {
  id: string;
  userName: string;
  timestamp: string;
  ranked: Array<{ name: string; score: number }>;
}

export interface TestCaseSpec {
  id: string;
  scenario: string;
  inputLabel: string;
  expectedResult: string;
  scores?: [number, number, number, number];
  expectedDominant?: string;
}

export const QUESTION_COUNT = 30;
export const TRAIT_COUNT = 4;

export const TRAIT_NAMES: readonly [string, string, string, string] = [
  'Introvert',
  'Extrovert',
  'Leader',
  'Creative',
];

export const TRAIT_DESCRIPTIONS: readonly [string, string, string, string] = [
  'You may prefer reflection, focused work and meaningful one-to-one conversations. You often think carefully before responding.',
  'You may enjoy social interaction, teamwork and communication. You often feel energised when sharing ideas with people.',
  'You may enjoy responsibility, planning and decision-making. You often help a group move toward a clear goal.',
  'You may enjoy imagination, experimentation and original ideas. You often look for fresh ways to approach a challenge.',
];

// 30 complex, scenario-based questions across 5 dimensions with varied trait-to-option orderings.
export const QUESTIONS: readonly Question[] = [
  {
    category: 'Social Energy',
    prompt: 'After an intense week of back-to-back deadlines, your Saturday opens up completely. What restores you fastest?',
    options: [
      'Quiet hours alone reading, journaling, or walking without notifications',
      'Organising a structured day trip with an itinerary and group stops',
      'Hosting or joining a lively dinner where stories and plans flow freely',
      'Diving into an unplanned side project, sketch, or experimental recipe',
    ],
    traitForOption: [Trait.INTROVERT, Trait.LEADER, Trait.EXTROVERT, Trait.CREATIVE],
  },
  {
    category: 'Team Dynamics',
    prompt: 'Your team inherits an ambiguous, high-stakes project with zero documentation and a tight deadline. Your first instinct is to:',
    options: [
      'Schedule a quick huddle so everyone voices assumptions and aligns verbally',
      'Map out milestones, assign clear owners, and set check-in checkpoints',
      'Prototype two unconventional directions to test what breaks first',
      'Spend an hour reading the codebase or brief privately before proposing a path',
    ],
    traitForOption: [Trait.EXTROVERT, Trait.LEADER, Trait.CREATIVE, Trait.INTROVERT],
  },
  {
    category: 'Decision & Conflict',
    prompt: 'Two teammates strongly disagree on a technical approach during a review, stalling the meeting. You step in to:',
    options: [
      'Propose a third hybrid design that bypasses both bottlenecks',
      'Compare trade-offs against the deadline and call a clear decision to move forward',
      'Pause and suggest both sides write their reasoning calmly for review',
      'Facilitate an open dialogue so both feel heard and find common ground',
    ],
    traitForOption: [Trait.CREATIVE, Trait.LEADER, Trait.INTROVERT, Trait.EXTROVERT],
  },
  {
    category: 'Problem Solving',
    prompt: 'When a system you rely on fails in an unfamiliar way right before a presentation, you tend to:',
    options: [
      'Isolate the root cause step-by-step in silence without extra chatter',
      'Rally a couple of colleagues immediately to brainstorm and divide checks',
      'Improvise a clever workaround or alternate demo flow on the spot',
      'Take command of the room, set backup roles, and keep the timeline intact',
    ],
    traitForOption: [Trait.INTROVERT, Trait.EXTROVERT, Trait.CREATIVE, Trait.LEADER],
  },
  {
    category: 'Adaptability & Drive',
    prompt: 'Halfway through building a project, stakeholders change the core requirements. Which reaction sounds most like you?',
    options: [
      'Excited to rethink the concept from scratch and explore fresher angles',
      'Keen to re-scope tasks, renegotiate priorities, and update the roadmap',
      'Need quiet time to process the shift and recalibrate your mental model',
      'Immediately hop on a call with stakeholders and teammates to talk it through',
    ],
    traitForOption: [Trait.CREATIVE, Trait.LEADER, Trait.INTROVERT, Trait.EXTROVERT],
  },
  {
    category: 'Social Energy',
    prompt: 'You walk into a large conference mixer where you know almost nobody. Twenty minutes later, you are most likely:',
    options: [
      'Introducing two people you just met and keeping a lively circle going',
      'Asking a speaker about an unorthodox idea or unusual edge case',
      'Having one deep, unhurried conversation in a quieter corner',
      'Helping the organiser or steering a small group toward a shared topic',
    ],
    traitForOption: [Trait.EXTROVERT, Trait.CREATIVE, Trait.INTROVERT, Trait.LEADER],
  },
  {
    category: 'Decision & Conflict',
    prompt: 'A peer submits work that meets every written requirement, yet feels uninspired and fragile under edge cases. You:',
    options: [
      'Send thoughtful, detailed written notes on the subtle flaws you noticed',
      'Sketch an alternative approach showing how it could be redesigned cleanly',
      'Define clearer quality standards and ask them to revise before sign-off',
      'Pair up live for 20 minutes to talk through improvements together',
    ],
    traitForOption: [Trait.INTROVERT, Trait.CREATIVE, Trait.LEADER, Trait.EXTROVERT],
  },
  {
    category: 'Team Dynamics',
    prompt: 'When joining an already established group whose habits feel outdated, you naturally gravitate toward:',
    options: [
      'Observing silently first to understand unspoken norms and history',
      'Building rapport with key members so everyone feels comfortable collaborating',
      'Questioning legacy assumptions and pitching bold process experiments',
      'Benchmarking bottlenecks and stepping up to coordinate cleaner workflows',
    ],
    traitForOption: [Trait.INTROVERT, Trait.EXTROVERT, Trait.CREATIVE, Trait.LEADER],
  },
  {
    category: 'Problem Solving',
    prompt: 'You are asked to learn a complex, unfamiliar domain in 48 hours. Your study strategy looks like:',
    options: [
      'Building a structured checklist of core concepts and tracking mastery milestones',
      'Tinkering directly with small experiments and unusual edge cases',
      'Studying primary docs deeply on your own with uninterrupted concentration',
      'Discussing concepts with someone experienced and quizzing each other aloud',
    ],
    traitForOption: [Trait.LEADER, Trait.CREATIVE, Trait.INTROVERT, Trait.EXTROVERT],
  },
  {
    category: 'Adaptability & Drive',
    prompt: 'Which kind of recognition feels most rewarding after months of hard effort?',
    options: [
      'Hearing that your original concept changed how the team thought about the problem',
      'Being trusted to steer a larger initiative or mentor others toward results',
      'Knowing your quiet, rigorous work held up cleanly without fanfare',
      'Sharing the celebration with a close-knit team that loved working together',
    ],
    traitForOption: [Trait.CREATIVE, Trait.LEADER, Trait.INTROVERT, Trait.EXTROVERT],
  },
  {
    category: 'Decision & Conflict',
    prompt: 'You have two competing offers: a predictable, high-authority role or an ambiguous experimental role. You weigh:',
    options: [
      'Where you have the freedom to invent and test original ideas',
      'Which role gives you clear ownership and measurable strategic impact',
      'Which team culture has the warmest daily collaboration and energy',
      'Which environment protects deep focus and thoughtful autonomy',
    ],
    traitForOption: [Trait.CREATIVE, Trait.LEADER, Trait.EXTROVERT, Trait.INTROVERT],
  },
  {
    category: 'Team Dynamics',
    prompt: 'During a brainstorming session, three safe, predictable ideas are on the board and energy drops. You:',
    options: [
      'Throw out a wild "what if" inversion to break the pattern',
      'Encourage quieter members to share what they have been holding back',
      'Group the themes, force-rank them against constraints, and assign next steps',
      'Listen carefully to spot the overlooked flaw before speaking concisely',
    ],
    traitForOption: [Trait.CREATIVE, Trait.EXTROVERT, Trait.LEADER, Trait.INTROVERT],
  },
  {
    category: 'Social Energy',
    prompt: 'In an open-plan workspace versus a remote setup, your ideal daily rhythm includes:',
    options: [
      'Frequent spontaneous huddles, whiteboarding, and quick hallway syncs',
      'Long uninterrupted blocks of solo flow with asynchronous written updates',
      'Structured standups that keep dependencies unblocked and goals visible',
      'Changing spaces or formats depending on what sparks fresh thinking',
    ],
    traitForOption: [Trait.EXTROVERT, Trait.INTROVERT, Trait.LEADER, Trait.CREATIVE],
  },
  {
    category: 'Problem Solving',
    prompt: 'You discover a recurring mistake in a team process that nobody wants to own. You respond by:',
    options: [
      'Tracing the sequence privately until you have concrete proof of why it happens',
      'Convening the stakeholders involved to hash out shared accountability',
      'Designing a clever automation or visual cue that prevents the slip naturally',
      'Taking ownership of the fix, writing the standard, and holding follow-ups',
    ],
    traitForOption: [Trait.INTROVERT, Trait.EXTROVERT, Trait.CREATIVE, Trait.LEADER],
  },
  {
    category: 'Adaptability & Drive',
    prompt: 'When you hit a prolonged creative or analytical block on a tough problem, you usually:',
    options: [
      'Step away into silence and let ideas simmer privately until clarity clicks',
      'Explain the problem out loud to a friend or colleague to spark momentum',
      'Reframe the puzzle from an unrelated field or sketch a weird analogy',
      'Break the impasse into smaller concrete deliverables and tackle the first',
    ],
    traitForOption: [Trait.INTROVERT, Trait.EXTROVERT, Trait.CREATIVE, Trait.LEADER],
  },
  {
    category: 'Decision & Conflict',
    prompt: 'A senior stakeholder pushes for an unrealistic deadline that risks quality. You handle it by:',
    options: [
      'Presenting a clear scope-vs-timeline matrix and proposing a phased rollout',
      'Building consensus with allies beforehand and having an open, candid conversation',
      'Proposing a lean, clever MVP angle that delivers the spirit in half the build',
      'Sending a calm, data-backed written memo laying out the technical risks',
    ],
    traitForOption: [Trait.LEADER, Trait.EXTROVERT, Trait.CREATIVE, Trait.INTROVERT],
  },
  {
    category: 'Team Dynamics',
    prompt: 'A new teammate looks overwhelmed during their first week on a fast-moving project. You:',
    options: [
      'Grab coffee or jump on a friendly call to make them feel welcomed into the group',
      'Pair them with clear starter tasks, milestones, and a structured onboarding doc',
      'Give them space to read while offering thoughtful 1-on-1 pointers when asked',
      'Show them an interactive sandbox or visual map so they can explore safely',
    ],
    traitForOption: [Trait.EXTROVERT, Trait.LEADER, Trait.INTROVERT, Trait.CREATIVE],
  },
  {
    category: 'Problem Solving',
    prompt: 'When evaluating a brand-new tool or methodology, what convinces you fastest?',
    options: [
      'Testing it hands-on in a small experiment to see what novel things it unlocks',
      'Seeing rigorous benchmarks, edge-case analysis, and clear underlying logic',
      'Hearing real-world stories from peers who adopted it across their teams',
      'Verifying how reliably it scales governance, predictability, and delivery',
    ],
    traitForOption: [Trait.CREATIVE, Trait.INTROVERT, Trait.EXTROVERT, Trait.LEADER],
  },
  {
    category: 'Social Energy',
    prompt: 'When you have great news or an exciting breakthrough, your immediate instinct is to:',
    options: [
      'Message or call people right away to share the energy together',
      'Savor it quietly first and reflect on what made it work',
      'Think about how to turn the momentum into the next ambitious milestone',
      'Immediately brainstorm three new spin-off ideas it makes possible',
    ],
    traitForOption: [Trait.EXTROVERT, Trait.INTROVERT, Trait.LEADER, Trait.CREATIVE],
  },
  {
    category: 'Adaptability & Drive',
    prompt: 'Looking at a calendar with three back-to-back collaborative meetings and one solo hour, you:',
    options: [
      'Protect that solo hour fiercely to think deeply and reset',
      'Enjoy the back-to-back energy of bouncing ideas across different people',
      'Use the solo hour to tighten agendas so every meeting drives decisions',
      'Bring a fresh visual prototype or provocative question into the meetings',
    ],
    traitForOption: [Trait.INTROVERT, Trait.EXTROVERT, Trait.LEADER, Trait.CREATIVE],
  },
  {
    category: 'Decision & Conflict',
    prompt: 'When two equally qualified teammates want to lead the same workstream, how do you advise resolving it?',
    options: [
      'Split ownership around clear, non-overlapping deliverables and KPIs',
      'Have an open three-way conversation about strengths and shared goals',
      'Let each draft a brief written proposal privately and compare merits',
      'Carve out an experimental track so both can pioneer complementary angles',
    ],
    traitForOption: [Trait.LEADER, Trait.EXTROVERT, Trait.INTROVERT, Trait.CREATIVE],
  },
  {
    category: 'Problem Solving',
    prompt: 'You have only 15 minutes left before an important submission and notice a minor visual inconsistency vs a subtle logic risk. You:',
    options: [
      'Quietly audit the logic trace carefully—accuracy matters most',
      'Make an executive triage call based on audience impact and lock the build',
      'Do a quick sanity check aloud with a teammate watching over your shoulder',
      'Find a clever polish tweak that elevates clarity without touching core flow',
    ],
    traitForOption: [Trait.INTROVERT, Trait.LEADER, Trait.EXTROVERT, Trait.CREATIVE],
  },
  {
    category: 'Team Dynamics',
    prompt: 'Which role on a cross-functional hackathon or sprint team makes you feel most in your element?',
    options: [
      'The architect shaping the core novel concept and visual identity',
      'The captain coordinating scope, timing, and final pitch structure',
      'The deep-focus specialist solving the hardest technical piece cleanly',
      'The connector keeping morale high, gathering feedback, and presenting live',
    ],
    traitForOption: [Trait.CREATIVE, Trait.LEADER, Trait.INTROVERT, Trait.EXTROVERT],
  },
  {
    category: 'Adaptability & Drive',
    prompt: 'When a project finishes and receives mixed feedback—praise for ambition, critique for rough edges—you feel:',
    options: [
      'Eager to catalogue every critique carefully in private and refine the craft',
      'Energised to debrief openly with users and hear their unfiltered reactions',
      'Focused on turning the feedback into an action plan for v2 delivery',
      'Proud that the risky idea sparked conversation and ready to iterate boldly',
    ],
    traitForOption: [Trait.INTROVERT, Trait.EXTROVERT, Trait.LEADER, Trait.CREATIVE],
  },
  {
    category: 'Social Energy',
    prompt: 'Friends describe your presence in a group trip or shared event most accurately as:',
    options: [
      'The planner who booked things on time and kept everyone on track',
      'The spark who brought everyone together and kept spirits lifted',
      'The observant listener who notices details and has the best 1-on-1 talks',
      'The wildcard who suggests memorable detours and unexpected experiences',
    ],
    traitForOption: [Trait.LEADER, Trait.EXTROVERT, Trait.INTROVERT, Trait.CREATIVE],
  },
  {
    category: 'Decision & Conflict',
    prompt: 'You spot a popular consensus forming in a room, but your gut tells you a crucial premise is wrong. You:',
    options: [
      'Ask a pointed, calm question that surfaces the hidden assumption',
      'Take the floor briefly to outline the alternative decision path clearly',
      'Reframe the premise with a surprising counter-example or metaphor',
      'Check privately with one or two peers after or voice a quick friendly challenge',
    ],
    traitForOption: [Trait.INTROVERT, Trait.LEADER, Trait.CREATIVE, Trait.EXTROVERT],
  },
  {
    category: 'Problem Solving',
    prompt: 'If given an open budget for one month of self-directed work, what would you build?',
    options: [
      'An original experimental prototype that nobody in the org has tried yet',
      'A deeply researched, rock-solid reference architecture or study',
      'A cross-team initiative with clear milestones that unblocks multiple groups',
      'A collaborative community showcase, workshop series, or mentorship hub',
    ],
    traitForOption: [Trait.CREATIVE, Trait.INTROVERT, Trait.LEADER, Trait.EXTROVERT],
  },
  {
    category: 'Team Dynamics',
    prompt: 'When receiving critical feedback from a manager or mentor, your most natural reaction is to:',
    options: [
      'Reflect on it internally for a day before crafting a thoughtful response',
      'Ask immediate follow-up questions live to align on expectations',
      'Translate the critique directly into measurable targets and timelines',
      'Look for an unconventional way to turn the weakness into a distinct strength',
    ],
    traitForOption: [Trait.INTROVERT, Trait.EXTROVERT, Trait.LEADER, Trait.CREATIVE],
  },
  {
    category: 'Adaptability & Drive',
    prompt: 'Under sustained pressure with multiple moving pieces, what keeps you grounded?',
    options: [
      'A prioritized checklist and decisive execution one step at a time',
      'Quiet focus blocks where distractions are completely shut out',
      'Supportive check-ins and shared momentum with teammates',
      'Stepping back to see fresh creative shortcuts nobody else noticed',
    ],
    traitForOption: [Trait.LEADER, Trait.INTROVERT, Trait.EXTROVERT, Trait.CREATIVE],
  },
  {
    category: 'Social Energy',
    prompt: 'At the end of the day, which single statement captures your authentic working style best?',
    options: [
      'I thrive when exploring original possibilities and inventing fresh approaches',
      'I thrive when taking ownership, organizing people, and driving clear outcomes',
      'I thrive on shared energy, open dialogue, and building strong connections',
      'I thrive in depth, thoughtful preparation, and focused independent craft',
    ],
    traitForOption: [Trait.CREATIVE, Trait.LEADER, Trait.EXTROVERT, Trait.INTROVERT],
  },
];

export const TEST_CASES: readonly TestCaseSpec[] = [
  {
    id: 'TC01',
    scenario: 'Introvert highest',
    inputLabel: 'Scores 12, 4, 2, 2',
    expectedResult: 'Introvert ranked first',
    scores: [12, 4, 2, 2],
    expectedDominant: 'Introvert',
  },
  {
    id: 'TC02',
    scenario: 'Extrovert highest',
    inputLabel: 'Scores 3, 12, 3, 2',
    expectedResult: 'Extrovert ranked first',
    scores: [3, 12, 3, 2],
    expectedDominant: 'Extrovert',
  },
  {
    id: 'TC03',
    scenario: 'Leader highest',
    inputLabel: 'Scores 2, 3, 12, 3',
    expectedResult: 'Leader ranked first',
    scores: [2, 3, 12, 3],
    expectedDominant: 'Leader',
  },
  {
    id: 'TC04',
    scenario: 'Creative highest',
    inputLabel: 'Scores 2, 3, 3, 12',
    expectedResult: 'Creative ranked first',
    scores: [2, 3, 3, 12],
    expectedDominant: 'Creative',
  },
  {
    id: 'TC05',
    scenario: 'Equal scores',
    inputLabel: 'Scores 5, 5, 5, 5',
    expectedResult: 'Introvert first due to fixed tie order',
    scores: [5, 5, 5, 5],
    expectedDominant: 'Introvert',
  },
  {
    id: 'TC06',
    scenario: 'Two-way maximum tie',
    inputLabel: 'Scores 8, 8, 2, 2',
    expectedResult: 'Introvert first due to fixed tie order',
    scores: [8, 8, 2, 2],
    expectedDominant: 'Introvert',
  },
  {
    id: 'TC07',
    scenario: 'Complete weighted quiz',
    inputLabel: 'Answer all 30 questions (1x or 2x conviction)',
    expectedResult: 'Result screen; percentages sum to 100%',
  },
  {
    id: 'TC08',
    scenario: 'Blank name',
    inputLabel: 'Submit without typing',
    expectedResult: 'Name becomes Guest',
  },
  {
    id: 'TC09',
    scenario: 'CSV save',
    inputLabel: 'Complete two sessions',
    expectedResult: 'Two result rows appended',
  },
  {
    id: 'TC10',
    scenario: 'Keyboard input',
    inputLabel: 'Keys 1-4, S (conviction), Enter',
    expectedResult: 'Chosen answer & weight recorded',
  },
  {
    id: 'TC11',
    scenario: 'Mouse & back navigation',
    inputLabel: 'Click options, Back, or question jump',
    expectedResult: 'Scores recalculate cleanly',
  },
  {
    id: 'TC12',
    scenario: 'Cancel',
    inputLabel: 'Press Esc or Cancel in quiz',
    expectedResult: 'No completed result is saved',
  },
];

export function normalizeUserName(rawName: string): string {
  const trimmed = rawName.trim().slice(0, 30);
  return trimmed.length === 0 ? 'Guest' : trimmed;
}

export function initializeScores(): [number, number, number, number] {
  return [0, 0, 0, 0];
}

export function recordAnswer(
  scores: [number, number, number, number],
  questionIndex: number,
  optionIndex: number,
  weight: 1 | 2 = 1
): [number, number, number, number] {
  if (questionIndex < 0 || questionIndex >= QUESTION_COUNT) return [...scores];
  if (optionIndex < 0 || optionIndex >= 4) return [...scores];
  const next: [number, number, number, number] = [...scores];
  const trait = QUESTIONS[questionIndex].traitForOption[optionIndex];
  next[trait] += weight;
  return next;
}

export function computeScoresFromAnswers(
  answers: ReadonlyArray<AnswerChoice | null>
): [number, number, number, number] {
  const scores = initializeScores();
  for (let q = 0; q < Math.min(answers.length, QUESTION_COUNT); q += 1) {
    const choice = answers[q];
    if (!choice) continue;
    if (choice.optionIndex < 0 || choice.optionIndex >= 4) continue;
    const trait = QUESTIONS[q].traitForOption[choice.optionIndex];
    scores[trait] += choice.weight === 2 ? 2 : 1;
  }
  return scores;
}

export function computeTraitPercentages(
  ranked: ReadonlyArray<Pick<TraitScore, 'score'>>
): number[] {
  const total = ranked.reduce((sum, item) => sum + Math.max(0, item.score), 0);
  if (total <= 0) return ranked.map(() => 0);

  const exact = ranked.map((item) => (Math.max(0, item.score) / total) * 100);
  const floored = exact.map((val) => Math.floor(val));
  let remainder = 100 - floored.reduce((sum, val) => sum + val, 0);

  const indicesByFraction = exact
    .map((val, idx) => ({ idx, frac: val - floored[idx] }))
    .sort((a, b) => b.frac - a.frac);

  for (let i = 0; i < indicesByFraction.length && remainder > 0; i += 1) {
    floored[indicesByFraction[i].idx] += 1;
    remainder -= 1;
  }

  return floored;
}

export function buildTraitScores(
  scores: readonly [number, number, number, number]
): TraitScore[] {
  return TRAIT_NAMES.map((name, i) => ({
    trait: i as Trait,
    name,
    score: scores[i] ?? 0,
    description: TRAIT_DESCRIPTIONS[i],
  }));
}

/**
 * DAA: Greedy Method. Returns the first maximum-scoring trait index.
 * Ties retain the first trait in the original order (O(k) time, O(1) extra space).
 */
export function greedyDominantTrait(traits: readonly TraitScore[]): number {
  if (traits.length <= 0) return -1;
  let best = 0;
  for (let i = 1; i < traits.length; i += 1) {
    if (traits[i].score > traits[best].score) {
      best = i;
    }
  }
  return best;
}

export function greedyDominantTraitWithTrace(traits: readonly TraitScore[]): {
  dominantIndex: number;
  steps: GreedyStep[];
} {
  if (traits.length <= 0) return { dominantIndex: -1, steps: [] };
  let best = 0;
  const steps: GreedyStep[] = [
    {
      index: 0,
      candidateName: traits[0].name,
      candidateScore: traits[0].score,
      currentBestIndex: 0,
      currentBestName: traits[0].name,
      currentBestScore: traits[0].score,
      updated: true,
    },
  ];
  for (let i = 1; i < traits.length; i += 1) {
    const updated = traits[i].score > traits[best].score;
    if (updated) {
      best = i;
    }
    steps.push({
      index: i,
      candidateName: traits[i].name,
      candidateScore: traits[i].score,
      currentBestIndex: best,
      currentBestName: traits[best].name,
      currentBestScore: traits[best].score,
      updated,
    });
  }
  return { dominantIndex: best, steps };
}

function mergeDescending(
  a: TraitScore[],
  left: number,
  mid: number,
  right: number,
  depth: number,
  steps: MergeSortStep[]
): void {
  const before = a.slice(left, right + 1).map((t) => ({ name: t.name, score: t.score }));
  const L = a.slice(left, mid + 1);
  const R = a.slice(mid + 1, right + 1);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < L.length && j < R.length) {
    // Descending order; left side wins ties (stable merge).
    if (L[i].score >= R[j].score) {
      a[k++] = L[i++];
    } else {
      a[k++] = R[j++];
    }
  }
  while (i < L.length) {
    a[k++] = L[i++];
  }
  while (j < R.length) {
    a[k++] = R[j++];
  }

  const after = a.slice(left, right + 1).map((t) => ({ name: t.name, score: t.score }));
  steps.push({ depth, phase: 'merge', left, mid, right, before, after });
}

function mergeSortRecursive(
  a: TraitScore[],
  left: number,
  right: number,
  depth: number,
  steps: MergeSortStep[]
): void {
  if (left >= right) return;
  const mid = left + Math.floor((right - left) / 2);
  const before = a.slice(left, right + 1).map((t) => ({ name: t.name, score: t.score }));
  steps.push({ depth, phase: 'divide', left, mid, right, before, after: before });
  mergeSortRecursive(a, left, mid, depth + 1, steps);
  mergeSortRecursive(a, mid + 1, right, depth + 1, steps);
  mergeDescending(a, left, mid, right, depth, steps);
}

/**
 * DAA: Divide and Conquer. Sorts traits in descending order by score
 * while preserving original relative order on ties.
 */
export function mergeSortTraits(traits: readonly TraitScore[]): TraitScore[] {
  const copy = traits.map((t) => ({ ...t }));
  const steps: MergeSortStep[] = [];
  if (copy.length > 1) {
    mergeSortRecursive(copy, 0, copy.length - 1, 0, steps);
  }
  return copy;
}

export function mergeSortTraitsWithTrace(traits: readonly TraitScore[]): {
  ranked: TraitScore[];
  steps: MergeSortStep[];
} {
  const copy = traits.map((t) => ({ ...t }));
  const steps: MergeSortStep[] = [];
  if (copy.length > 1) {
    mergeSortRecursive(copy, 0, copy.length - 1, 0, steps);
  }
  return { ranked: copy, steps };
}

export function analyzeScores(scores: readonly [number, number, number, number]): {
  rawTraits: TraitScore[];
  dominantIndex: number;
  dominantTrait: TraitScore;
  ranked: TraitScore[];
  greedySteps: GreedyStep[];
  mergeSteps: MergeSortStep[];
} {
  const rawTraits = buildTraitScores(scores);
  const { dominantIndex, steps: greedySteps } = greedyDominantTraitWithTrace(rawTraits);
  const { ranked, steps: mergeSteps } = mergeSortTraitsWithTrace(rawTraits);
  return {
    rawTraits,
    dominantIndex,
    dominantTrait: rawTraits[dominantIndex],
    ranked,
    greedySteps,
    mergeSteps,
  };
}

export function formatTimestamp(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function formatCSVRow(
  userName: string,
  ranked: readonly Pick<TraitScore, 'name' | 'score'>[],
  date: Date = new Date()
): string {
  const safeName = normalizeUserName(userName).replace(/"/g, '""');
  const timestamp = formatTimestamp(date);
  const cols = [`"${safeName}"`, timestamp];
  for (let i = 0; i < TRAIT_COUNT; i += 1) {
    cols.push(ranked[i].name, String(ranked[i].score));
  }
  return `${cols.join(',')}\n`;
}

export function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

export function parseCSVContent(csvText: string): SavedResultRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const rows: SavedResultRow[] = [];
  for (let idx = 0; idx < lines.length; idx += 1) {
    const cols = parseCSVLine(lines[idx]);
    if (cols.length < 10) continue;
    const ranked: Array<{ name: string; score: number }> = [];
    for (let t = 0; t < TRAIT_COUNT; t += 1) {
      ranked.push({
        name: cols[2 + t * 2],
        score: Number.parseInt(cols[3 + t * 2], 10) || 0,
      });
    }
    rows.push({
      id: `row-${idx + 1}`,
      userName: cols[0] || 'Guest',
      timestamp: cols[1],
      ranked,
    });
  }
  return rows;
}
