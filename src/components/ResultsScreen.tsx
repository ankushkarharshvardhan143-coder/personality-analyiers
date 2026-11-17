import React, { useMemo, useState } from 'react';
import { CheckCircle2, Download, History, RotateCcw, AlertCircle } from 'lucide-react';
import {
  AnswerChoice,
  GreedyStep,
  MergeSortStep,
  QUESTIONS,
  TRAIT_DESCRIPTIONS,
  TRAIT_NAMES,
  TraitScore,
  computeTraitPercentages,
} from '../lib/analyzer';

interface ResultsScreenProps {
  userName: string;
  ranked: TraitScore[];
  answers: ReadonlyArray<AnswerChoice | null>;
  greedySteps: GreedyStep[];
  mergeSteps: MergeSortStep[];
  saveState: 'saving' | 'saved' | 'error';
  saveError?: string;
  onRetrySave: () => void;
  onRetake: () => void;
  onViewHistory: () => void;
}

type ResultTab = 'breakdown' | 'review' | 'trace';

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  userName,
  ranked,
  answers,
  greedySteps,
  mergeSteps,
  saveState,
  saveError,
  onRetrySave,
  onRetake,
  onViewHistory,
}) => {
  const dominant = ranked[0];
  const [activeTab, setActiveTab] = useState<ResultTab>('breakdown');
  const [selectedTraitName, setSelectedTraitName] = useState<string>(dominant.name);
  const [reviewFilter, setReviewFilter] = useState<string>('All');

  const percentages = useMemo(() => computeTraitPercentages(ranked), [ranked]);

  const percentByTraitName = useMemo(() => {
    const map = new Map<string, number>();
    ranked.forEach((item, idx) => {
      map.set(item.name, percentages[idx] ?? 0);
    });
    return map;
  }, [ranked, percentages]);

  const selectedTraitIdx = TRAIT_NAMES.indexOf(selectedTraitName);
  const selectedTraitPercent = percentByTraitName.get(selectedTraitName) ?? 0;

  // Radar chart geometry (4 axes: Introvert=top, Extrovert=right, Leader=bottom, Creative=left)
  const radarSize = 260;
  const center = radarSize / 2;
  const maxRadius = 86;

  const axisAngles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
  const radarPoints = TRAIT_NAMES.map((name, idx) => {
    const pct = percentByTraitName.get(name) ?? 0;
    const normalized = Math.min(1, pct / 65); // Scale cleanly so balanced/dominant shapes remain expressive
    const r = Math.max(12, normalized * maxRadius);
    const angle = axisAngles[idx];
    return {
      name,
      pct,
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
      labelX: center + (maxRadius + 24) * Math.cos(angle),
      labelY: center + (maxRadius + 22) * Math.sin(angle),
    };
  });

  const polygonPoints = radarPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const answeredBreakdown = useMemo(() => {
    return QUESTIONS.map((q, idx) => {
      const choice = answers[idx];
      if (!choice) return null;
      const traitIdx = q.traitForOption[choice.optionIndex];
      return {
        questionNumber: idx + 1,
        category: q.category,
        prompt: q.prompt,
        selectedText: q.options[choice.optionIndex],
        traitName: TRAIT_NAMES[traitIdx],
        weight: choice.weight,
      };
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [answers]);

  const filteredReview = useMemo(() => {
    if (reviewFilter === 'All') return answeredBreakdown;
    return answeredBreakdown.filter((item) => item.traitName === reviewFilter);
  }, [answeredBreakdown, reviewFilter]);

  const selectedTraitQuestionCount = useMemo(
    () => answeredBreakdown.filter((item) => item.traitName === selectedTraitName).length,
    [answeredBreakdown, selectedTraitName]
  );

  const selectedTraitStrongCount = useMemo(
    () =>
      answeredBreakdown.filter(
        (item) => item.traitName === selectedTraitName && item.weight === 2
      ).length,
    [answeredBreakdown, selectedTraitName]
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
      {/* Primary Result Summary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 space-y-8">
        <div className="border-b border-slate-100 pb-6 space-y-2">
          <p className="text-sm font-medium text-blue-700">Hello, {userName}!</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 balance-text">
            Dominant Trait: {dominant.name}
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl pt-1">
            {dominant.description}
          </p>
        </div>

        {/* Interactive View Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Result exploration views"
            className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start overflow-x-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'breakdown'}
              onClick={() => setActiveTab('breakdown')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'breakdown'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Trait Breakdown
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'review'}
              onClick={() => setActiveTab('review')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'review'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Answer Review ({answeredBreakdown.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'trace'}
              onClick={() => setActiveTab('trace')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'trace'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DAA Algorithm Trace
            </button>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            Sorted descending via Merge Sort
          </span>
        </div>

        {/* Tab 1: Interactive Percentage Ranking + Radar Profile */}
        {activeTab === 'breakdown' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-3">
                {ranked.map((item, idx) => {
                  const isDominant = idx === 0;
                  const pct = percentages[idx] ?? 0;
                  const isInspected = selectedTraitName === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedTraitName(item.name)}
                      className={`w-full text-left p-3.5 rounded-lg border transition-colors space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        isInspected
                          ? 'bg-slate-50 border-slate-300'
                          : 'bg-white border-transparent hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs text-slate-400 w-5 tabular-nums">
                            #{idx + 1}
                          </span>
                          <span className="font-semibold text-slate-900">{item.name}</span>
                          {isDominant && (
                            <span className="text-xs font-medium text-emerald-700">
                              · Dominant
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-semibold text-slate-900 tabular-nums">
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-md overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isDominant ? 'bg-emerald-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Inspected Trait Detail */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-base font-semibold text-slate-900">
                    {selectedTraitName} Profile · {selectedTraitPercent}%
                  </h2>
                  <span className="font-mono text-xs text-slate-500 tabular-nums">
                    {selectedTraitQuestionCount} choices · {selectedTraitStrongCount} strong (2x)
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedTraitIdx >= 0 ? TRAIT_DESCRIPTIONS[selectedTraitIdx] : ''}
                </p>
              </div>
            </div>

            {/* Interactive SVG 4-Axis Radar Chart */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center py-4 bg-slate-50/70 rounded-xl">
              <p className="text-xs font-medium text-slate-500 mb-2">
                Click any trait node to inspect
              </p>
              <svg
                width={radarSize}
                height={radarSize}
                viewBox={`0 0 ${radarSize} ${radarSize}`}
                role="img"
                aria-label="Four-trait balance radar chart"
                className="overflow-visible"
              >
                {[0.25, 0.5, 0.75, 1].map((scale) => {
                  const r = maxRadius * scale;
                  const pts = axisAngles
                    .map((a) => `${(center + r * Math.cos(a)).toFixed(1)},${(center + r * Math.sin(a)).toFixed(1)}`)
                    .join(' ');
                  return (
                    <polygon
                      key={scale}
                      points={pts}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  );
                })}

                {axisAngles.map((angle, idx) => (
                  <line
                    key={TRAIT_NAMES[idx]}
                    x1={center}
                    y1={center}
                    x2={center + maxRadius * Math.cos(angle)}
                    y2={center + maxRadius * Math.sin(angle)}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                ))}

                <polygon
                  points={polygonPoints}
                  fill="rgba(37, 99, 235, 0.16)"
                  stroke="#2563eb"
                  strokeWidth="2"
                />

                {radarPoints.map((pt) => {
                  const isActive = pt.name === selectedTraitName;
                  const isTop = pt.name === dominant.name;
                  return (
                    <g
                      key={pt.name}
                      className="cursor-pointer"
                      onClick={() => setSelectedTraitName(pt.name)}
                    >
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 6 : 4.5}
                        fill={isTop ? '#059669' : '#2563eb'}
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x={pt.labelX}
                        y={pt.labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className={`text-[11px] font-medium ${
                          isActive ? 'fill-slate-900 font-semibold' : 'fill-slate-600'
                        }`}
                      >
                        {pt.name} {pt.pct}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Answer Review */}
        {activeTab === 'review' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                Review each scenario choice and conviction weight that fed into the ranking.
              </p>
              <div
                role="group"
                aria-label="Filter answers by trait"
                className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto"
              >
                {['All', ...TRAIT_NAMES].map((trait) => (
                  <button
                    key={trait}
                    type="button"
                    onClick={() => setReviewFilter(trait)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      reviewFilter === trait
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 border-t border-b border-slate-100">
              {filteredReview.map((item) => (
                <div
                  key={item.questionNumber}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      Q{item.questionNumber} · {item.category}
                    </p>
                    <p className="font-medium text-slate-900">{item.prompt}</p>
                    <p className="text-slate-600">Chosen: {item.selectedText}</p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right font-mono text-xs tabular-nums">
                    <span className="font-semibold text-blue-700">{item.traitName}</span>
                    <span className="text-slate-500 ml-2">
                      {item.weight === 2 ? 'Strong (2x)' : 'Standard (1x)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: DAA Execution Trace */}
        {activeTab === 'trace' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Greedy Maximum Trace
                </h2>
                <span className="font-mono text-xs text-slate-500">O(k) scan</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="py-2 pr-3 font-medium">Index</th>
                      <th className="py-2 pr-3 font-medium">Trait</th>
                      <th className="py-2 pr-3 font-medium text-right">Weight Sum</th>
                      <th className="py-2 font-medium text-right">Current Best</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {greedySteps.map((step) => (
                      <tr key={step.index} className="text-slate-700">
                        <td className="py-2 pr-3 tabular-nums">i={step.index}</td>
                        <td className="py-2 pr-3">{step.candidateName}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">
                          {step.candidateScore}
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          <span className={step.updated ? 'text-emerald-700 font-semibold' : ''}>
                            {step.currentBestName} ({step.currentBestScore})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h2 className="font-display text-base font-semibold text-slate-900">
                  Merge Sort Trace
                </h2>
                <span className="font-mono text-xs text-slate-500">O(k log k)</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {mergeSteps.map((step, idx) => (
                  <div
                    key={`${step.phase}-${step.left}-${step.right}-${idx}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1.5 border-b border-slate-100 last:border-b-0"
                  >
                    <span className="text-slate-600">
                      <strong
                        className={step.phase === 'merge' ? 'text-blue-700' : 'text-slate-800'}
                      >
                        {step.phase === 'divide' ? 'Split' : 'Merge'}
                      </strong>{' '}
                      [{step.left}..{step.right}]
                    </span>
                    <span className="text-slate-800 tabular-nums">
                      {step.after.map((t) => `${t.name.slice(0, 3)}:${t.score}`).join(' · ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Status & Actions */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            {saveState === 'saving' && (
              <span className="text-slate-600">Saving result to personality_results.csv...</span>
            )}
            {saveState === 'saved' && (
              <span className="inline-flex items-center gap-2 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                Result saved in personality_results.csv
              </span>
            )}
            {saveState === 'error' && (
              <span className="inline-flex items-center gap-2 text-red-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {saveError || 'Could not save result file.'}
                <button
                  type="button"
                  onClick={onRetrySave}
                  className="underline hover:text-red-900 ml-1"
                >
                  Retry
                </button>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onViewHistory}
              className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <History className="w-4 h-4 text-slate-500" aria-hidden="true" />
              Saved Results
            </button>
            <a
              href="/api/results/csv"
              download="personality_results.csv"
              className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Download className="w-4 h-4 text-slate-500" aria-hidden="true" />
              Download CSV
            </a>
            <button
              type="button"
              onClick={onRetake}
              className="min-h-[40px] inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              New Analysis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
