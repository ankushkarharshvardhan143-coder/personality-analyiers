import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type ActiveView = 'overview' | 'register' | 'quiz' | 'results' | 'daa' | 'history';

interface TopBarProps {
  activeView: ActiveView;
  onNavigate: (view: 'overview' | 'daa' | 'history') => void;
  onStartNew: () => void;
  hasActiveQuiz: boolean;
  onResumeQuiz: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onNavigate,
  onStartNew,
  hasActiveQuiz,
  onResumeQuiz,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAssessmentActive =
    activeView === 'register' || activeView === 'quiz' || activeView === 'results';

  const handleMobileNav = (action: () => void) => {
    setMobileMenuOpen(false);
    action();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        <button
          type="button"
          onClick={() => handleMobileNav(() => onNavigate('overview'))}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
        >
          Personality Analyzer
        </button>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activeView === 'overview'
                ? 'border-blue-600 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={hasActiveQuiz ? onResumeQuiz : onStartNew}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isAssessmentActive
                ? 'border-blue-600 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Assessment
          </button>
          <button
            type="button"
            onClick={() => onNavigate('daa')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activeView === 'daa'
                ? 'border-blue-600 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            DAA Lab
          </button>
          <button
            type="button"
            onClick={() => onNavigate('history')}
            className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activeView === 'history'
                ? 'border-blue-600 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Results
          </button>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleMobileNav(onStartNew)}
            className="min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            Start Analysis
          </button>
          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden min-h-[40px] min-w-[40px] inline-flex items-center justify-center text-slate-700 hover:text-slate-900 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-1 text-sm font-medium"
        >
          <button
            type="button"
            onClick={() => handleMobileNav(() => onNavigate('overview'))}
            className={`min-h-[44px] px-3 text-left rounded-lg ${
              activeView === 'overview'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => handleMobileNav(hasActiveQuiz ? onResumeQuiz : onStartNew)}
            className={`min-h-[44px] px-3 text-left rounded-lg ${
              isAssessmentActive
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Assessment
          </button>
          <button
            type="button"
            onClick={() => handleMobileNav(() => onNavigate('daa'))}
            className={`min-h-[44px] px-3 text-left rounded-lg ${
              activeView === 'daa'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            DAA Lab
          </button>
          <button
            type="button"
            onClick={() => handleMobileNav(() => onNavigate('history'))}
            className={`min-h-[44px] px-3 text-left rounded-lg ${
              activeView === 'history'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Saved Results
          </button>
        </nav>
      )}
    </header>
  );
};
