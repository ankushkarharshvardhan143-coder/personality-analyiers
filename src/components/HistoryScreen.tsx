import React, { useMemo, useState } from 'react';
import { Download, RefreshCw, Search, AlertCircle } from 'lucide-react';
import { SavedResultRow, TRAIT_NAMES, computeTraitPercentages } from '../lib/analyzer';

interface HistoryScreenProps {
  rows: SavedResultRow[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onStartNew: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  rows,
  loading,
  error,
  onRefresh,
  onStartNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [traitFilter, setTraitFilter] = useState<string>('All');

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesName = q.length === 0 || row.userName.toLowerCase().includes(q);
      const dominant = row.ranked[0]?.name ?? '';
      const matchesTrait = traitFilter === 'All' || dominant === traitFilter;
      return matchesName && matchesTrait;
    });
  }, [rows, searchQuery, traitFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-700">CSV Storage</p>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Saved Personality Results
          </h1>
          <p className="text-sm text-slate-600">
            Persisted sessions appended to{' '}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
              personality_results.csv
            </code>
            .
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
          <a
            href="/api/results/csv"
            download="personality_results.csv"
            className="min-h-[40px] inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            Download CSV
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <label htmlFor="history-search" className="sr-only">
            Filter by candidate name
          </label>
          <input
            id="history-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name..."
            className="w-full min-h-[40px] pl-10 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div
          role="group"
          aria-label="Filter by dominant trait"
          className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto"
        >
          {['All', ...TRAIT_NAMES].map((trait) => {
            const active = traitFilter === trait;
            return (
              <button
                key={trait}
                type="button"
                onClick={() => setTraitFilter(trait)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {trait}
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Table / States */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {error ? (
          <div className="p-10 text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-900">Unable to load saved results</p>
              <p className="text-sm text-slate-600">{error}</p>
            </div>
            <button
              type="button"
              onClick={onRefresh}
              className="min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : loading && rows.length === 0 ? (
          <div className="p-6 space-y-3" aria-busy="true" aria-label="Loading saved results">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-10 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="space-y-1">
              <h2 className="font-display text-lg font-semibold text-slate-900">
                No completed assessments yet
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Complete a 30-question analysis to append your first ranked personality record to{' '}
                <code className="font-mono text-xs">personality_results.csv</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={onStartNew}
              className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              Start First Assessment
            </button>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="text-base font-medium text-slate-900">No matching results</p>
            <p className="text-sm text-slate-600">
              Adjust your search text or trait filter to view saved sessions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-xs">
                  <th className="py-3 px-4 font-medium">Candidate</th>
                  <th className="py-3 px-4 font-medium">Timestamp</th>
                  <th className="py-3 px-4 font-medium">Dominant Trait</th>
                  <th className="py-3 px-4 font-medium text-right">Ranked Breakdown</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRows.map((row) => {
                  const dominant = row.ranked[0];
                  const pcts = computeTraitPercentages(row.ranked);
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-slate-900">{row.userName}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                        {row.timestamp}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-emerald-700 whitespace-nowrap">
                        {dominant?.name} ({pcts[0] ?? 0}%)
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-700 text-right tabular-nums whitespace-nowrap">
                        {row.ranked.map((t, idx) => `${t.name} ${pcts[idx] ?? 0}%`).join(' · ')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
