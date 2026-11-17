import React from 'react';
import { ArrowRight, BookOpen, GitBranch, History } from 'lucide-react';
import { TRAIT_DESCRIPTIONS, TRAIT_NAMES } from '../lib/analyzer';

interface OverviewScreenProps {
  onStartAnalysis: () => void;
  onOpenDaaLab: () => void;
  onOpenHistory: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onStartAnalysis,
  onOpenDaaLab,
  onOpenHistory,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
      {/* Hero section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <p className="text-sm font-medium text-blue-700 tracking-tight">
            C++ DAA Minor Project · Greedy Method &amp; Merge Sort
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 balance-text leading-[1.12]">
            Discover your dominant personality traits
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Navigate 30 real-world scenario questions across five reflective dimensions with
            adjustable conviction weights. A Greedy scan isolates your highest trait while
            stable Merge Sort ranks all four categories and records results to CSV.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onStartAnalysis}
              className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Start Analysis
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onOpenDaaLab}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <GitBranch className="w-4 h-4 text-slate-500" aria-hidden="true" />
              Explore Algorithms
            </button>
            <button
              type="button"
              onClick={onOpenHistory}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <History className="w-4 h-4 text-slate-500" aria-hidden="true" />
              Saved CSV History
            </button>
          </div>

          <p className="text-xs text-slate-500 pt-1">
            For educational self-reflection only; not a clinical or psychological diagnosis.
          </p>
        </div>

        {/* Pipeline preview panel (single-level surface, no nested cards) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Execution Pipeline
            </h2>
            <span className="font-mono text-xs text-slate-500 tabular-nums">
              n = 30 · k = 4
            </span>
          </div>

          <ol className="space-y-5">
            <li className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-700 pt-0.5 tabular-nums">
                01
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  O(n) Weighted Scenario Scoring
                </p>
                <p className="text-sm text-slate-600">
                  All 30 scenario answers map in O(1) time per step with 1x standard or 2x strong conviction.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-700 pt-0.5 tabular-nums">
                02
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  O(k) Greedy Dominant Scan
                </p>
                <p className="text-sm text-slate-600">
                  Single linear pass selects the maximum score; deterministic tie-break retains original trait order.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="font-mono text-xs font-semibold text-blue-700 pt-0.5 tabular-nums">
                03
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  O(k log k) Stable Merge Sort
                </p>
                <p className="text-sm text-slate-600">
                  Divide and conquer sorts traits descending and appends a row to personality_results.csv.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* 4 Trait categories */}
      <section className="space-y-6 border-t border-slate-200 pt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
              Four Self-Reflection Traits
            </h2>
            <p className="text-sm text-slate-600">
              Ordered deterministically for tie resolution across Greedy selection and Merge Sort.
            </p>
          </div>
          <p className="text-xs font-mono text-slate-500 tabular-nums">
            Trait indices 0–3 · 1x or 2x conviction per scenario
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRAIT_NAMES.map((name, idx) => (
            <div
              key={name}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  {name}
                </h3>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  #{idx}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {TRAIT_DESCRIPTIONS[idx]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Keyboard & workflow guide */}
      <section className="border-t border-slate-200 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="font-display text-base font-semibold text-slate-900">
              Mouse &amp; Keyboard Controls Supported
            </h2>
            <p className="text-sm text-slate-600">
              Press keys 1–4 to pick an answer, S to toggle Strong (2x) conviction,
              Left Arrow to revise, Enter to advance, and Esc to cancel without saving.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onStartAnalysis}
          className="min-h-[40px] px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Begin Questionnaire
        </button>
      </section>
    </div>
  );
};
