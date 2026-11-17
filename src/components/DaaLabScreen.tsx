import React, { useMemo, useState } from 'react';
import { Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import {
  TEST_CASES,
  TRAIT_NAMES,
  analyzeScores,
} from '../lib/analyzer';

export const DaaLabScreen: React.FC = () => {
  const [scores, setScores] = useState<[number, number, number, number]>([12, 4, 2, 2]);
  const [verifiedRun, setVerifiedRun] = useState<boolean>(false);

  const analysis = useMemo(() => analyzeScores(scores), [scores]);

  const handleScoreChange = (idx: number, raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const clamped = Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(20, parsed));
    setScores((prev) => {
      const next: [number, number, number, number] = [...prev];
      next[idx] = clamped;
      return next;
    });
  };

  const presetCases = TEST_CASES.filter((tc) => tc.scores !== undefined);

  const verificationResults = useMemo(() => {
    if (!verifiedRun) return new Map<string, boolean>();
    const map = new Map<string, boolean>();
    for (const tc of presetCases) {
      if (!tc.scores || !tc.expectedDominant) continue;
      const res = analyzeScores(tc.scores);
      const isDescending = res.ranked.every(
        (item, idx, arr) => idx === 0 || arr[idx - 1].score >= item.score
      );
      const matches =
        res.dominantTrait.name === tc.expectedDominant &&
        res.ranked[0].name === tc.expectedDominant &&
        res.ranked[0].score === res.dominantTrait.score &&
        isDescending;
      map.set(tc.id, matches);
    }
    return map;
  }, [verifiedRun, presetCases]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-12">
      {/* Header */}
      <section className="space-y-2 border-b border-slate-200 pb-6">
        <p className="text-sm font-medium text-blue-700">
          Algorithm Explorer &amp; Verification
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
          DAA Lab: Greedy Method &amp; Merge Sort
        </h1>
        <p className="text-base text-slate-600 max-w-3xl">
          Inspect how the Greedy maximum scan and Divide-and-Conquer Merge Sort operate on
          any four trait scores, including tie-breaking cases from the project test suite.
        </p>
      </section>

      {/* Interactive Sandbox */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Input Trait Scores
            </h2>
            <button
              type="button"
              onClick={() => setScores([12, 4, 2, 2])}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>

          <div className="space-y-4">
            {TRAIT_NAMES.map((name, idx) => (
              <div key={name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor={`score-input-${idx}`} className="font-medium text-slate-800">
                    {name} (index {idx})
                  </label>
                  <span className="font-mono text-slate-900 font-semibold tabular-nums">
                    {scores[idx]}
                  </span>
                </div>
                <input
                  id={`score-input-${idx}`}
                  type="range"
                  min={0}
                  max={20}
                  value={scores[idx]}
                  onChange={(e) => handleScoreChange(idx, e.target.value)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <p className="text-xs font-medium text-slate-500">
              Load Test Case Presets (TC01–TC06)
            </p>
            <div className="flex flex-wrap gap-2">
              {presetCases.map((tc) => (
                <button
                  key={tc.id}
                  type="button"
                  onClick={() => tc.scores && setScores([...tc.scores])}
                  className="min-h-[36px] px-3 py-1.5 text-xs font-mono font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  {tc.id}: {tc.scores?.join(',')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Trace Output */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
          <div className="space-y-3 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-medium text-slate-500">Selected Dominant Trait</p>
              <p className="font-mono text-xs text-slate-500 tabular-nums">
                Tie-break: original trait order
              </p>
            </div>
            <p className="font-display text-2xl font-bold text-emerald-700">
              {analysis.dominantTrait.name} ({analysis.dominantTrait.score})
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="font-medium text-slate-500">Ranked Output:</span>
              <span className="font-mono text-slate-900 tabular-nums">
                {analysis.ranked.map((r) => `${r.name}(${r.score})`).join(' -> ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                1. Greedy Scan Steps (O(k))
              </h3>
              <ul className="space-y-2 text-xs font-mono">
                {analysis.greedySteps.map((s) => (
                  <li
                    key={s.index}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 text-slate-700 tabular-nums"
                  >
                    <span>
                      i={s.index} {s.candidateName}({s.candidateScore})
                    </span>
                    <span className={s.updated ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                      best={s.currentBestName}({s.currentBestScore})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">
                2. Merge Sort Steps (O(k log k))
              </h3>
              <ul className="space-y-2 text-xs font-mono">
                {analysis.mergeSteps.map((s, idx) => (
                  <li
                    key={`${s.phase}-${idx}`}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 text-slate-700 tabular-nums"
                  >
                    <span className={s.phase === 'merge' ? 'text-blue-700 font-semibold' : ''}>
                      {s.phase} [{s.left}..{s.right}]
                    </span>
                    <span>
                      {s.after.map((x) => `${x.name.slice(0, 3)}:${x.score}`).join(' ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Complexity Analysis & Pseudocode */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-slate-200 pt-10">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Complexity Analysis (n = 30 questions, k = 4 traits)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs">
                  <th className="py-2.5 pr-4 font-medium">Operation</th>
                  <th className="py-2.5 pr-4 font-medium">Best</th>
                  <th className="py-2.5 pr-4 font-medium">Average</th>
                  <th className="py-2.5 pr-4 font-medium">Worst</th>
                  <th className="py-2.5 font-medium">Extra Space</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs tabular-nums text-slate-800">
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-sm text-slate-900">
                    One answer score update
                  </td>
                  <td className="py-2.5 pr-4">O(1)</td>
                  <td className="py-2.5 pr-4">O(1)</td>
                  <td className="py-2.5 pr-4">O(1)</td>
                  <td className="py-2.5">O(1)</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-sm text-slate-900">
                    Complete quiz scoring
                  </td>
                  <td className="py-2.5 pr-4">O(n)</td>
                  <td className="py-2.5 pr-4">O(n)</td>
                  <td className="py-2.5 pr-4">O(n)</td>
                  <td className="py-2.5">O(k)</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-sm text-slate-900">
                    Greedy maximum scan
                  </td>
                  <td className="py-2.5 pr-4">O(k)</td>
                  <td className="py-2.5 pr-4">O(k)</td>
                  <td className="py-2.5 pr-4">O(k)</td>
                  <td className="py-2.5">O(1)</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-sans text-sm text-slate-900">
                    Merge Sort ranking
                  </td>
                  <td className="py-2.5 pr-4">O(k log k)</td>
                  <td className="py-2.5 pr-4">O(k log k)</td>
                  <td className="py-2.5 pr-4">O(k log k)</td>
                  <td className="py-2.5">O(k)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            Core Pseudocode
          </h2>
          <pre className="text-xs font-mono text-slate-800 bg-slate-50 rounded-lg p-4 overflow-x-auto leading-relaxed">
{`GREEDY-DOMINANT(A, n)
  best = 0
  for i = 1 to n - 1
    if A[i].score > A[best].score
      best = i
  return best

MERGE-SORT(A, left, right)
  if left >= right: return
  mid = left + (right - left) / 2
  MERGE-SORT(A, left, mid)
  MERGE-SORT(A, mid + 1, right)
  MERGE(A, left, mid, right)`}
          </pre>
        </div>
      </section>

      {/* Test Cases Matrix */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              Project Test Cases (TC01–TC12)
            </h2>
            <p className="text-sm text-slate-600">
              Verify Greedy dominant selection, Merge Sort descending order, and deterministic tie-breaking.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVerifiedRun(true)}
            className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            Run Algorithm Checks
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs">
                <th className="py-2.5 pr-4 font-medium">ID</th>
                <th className="py-2.5 pr-4 font-medium">Scenario</th>
                <th className="py-2.5 pr-4 font-medium">Input</th>
                <th className="py-2.5 pr-4 font-medium">Expected Result</th>
                <th className="py-2.5 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TEST_CASES.map((tc) => {
                const passed = verificationResults.get(tc.id);
                return (
                  <tr key={tc.id} className="text-slate-700">
                    <td className="py-2.5 pr-4 font-mono text-xs font-semibold text-slate-900">
                      {tc.id}
                    </td>
                    <td className="py-2.5 pr-4 font-medium text-slate-900">{tc.scenario}</td>
                    <td className="py-2.5 pr-4 font-mono text-xs tabular-nums">
                      {tc.inputLabel}
                    </td>
                    <td className="py-2.5 pr-4">{tc.expectedResult}</td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      {tc.scores ? (
                        verifiedRun ? (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${
                              passed ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            {passed ? 'Passed' : 'Failed'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => tc.scores && setScores([...tc.scores])}
                            className="text-xs font-medium text-blue-600 hover:underline"
                          >
                            Load in Sandbox
                          </button>
                        )
                      ) : (
                        <span className="text-xs text-slate-500">Interactive UI</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
