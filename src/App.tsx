/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
import { ActiveView, TopBar } from './components/TopBar';
import { OverviewScreen } from './components/OverviewScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { DaaLabScreen } from './components/DaaLabScreen';
import { HistoryScreen } from './components/HistoryScreen';
import {
  AnswerChoice,
  GreedyStep,
  MergeSortStep,
  QUESTION_COUNT,
  SavedResultRow,
  TraitScore,
  analyzeScores,
  computeScoresFromAnswers,
} from './lib/analyzer';

interface CompletedSession {
  userName: string;
  ranked: TraitScore[];
  answers: Array<AnswerChoice | null>;
  greedySteps: GreedyStep[];
  mergeSteps: MergeSortStep[];
}

function createEmptyAnswers(): Array<AnswerChoice | null> {
  return Array.from({ length: QUESTION_COUNT }, () => null);
}

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('autostart') === '1' ? 'register' : 'overview';
  });

  const [userName, setUserName] = useState<string>('Guest');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Array<AnswerChoice | null>>(() =>
    createEmptyAnswers()
  );
  const [completedSession, setCompletedSession] = useState<CompletedSession | null>(null);

  const [saveState, setSaveState] = useState<'saving' | 'saved' | 'error'>('saving');
  const [saveError, setSaveError] = useState<string | undefined>(undefined);

  const [historyRows, setHistoryRows] = useState<SavedResultRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const response = await fetch('/api/results');
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = (await response.json()) as { rows: SavedResultRow[] };
      setHistoryRows(Array.isArray(data.rows) ? data.rows : []);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : 'Failed to fetch history');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === 'history') {
      fetchHistory();
    }
  }, [activeView, fetchHistory]);

  const persistResult = useCallback(
    async (nameToSave: string, rankedToSave: TraitScore[]) => {
      setSaveState('saving');
      setSaveError(undefined);
      try {
        const response = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: nameToSave,
            ranked: rankedToSave.map((t) => ({ name: t.name, score: t.score })),
          }),
        });
        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error || 'Failed to save result');
        }
        setSaveState('saved');
      } catch (err) {
        setSaveState('error');
        setSaveError(err instanceof Error ? err.message : 'Could not save result file');
      }
    },
    []
  );

  const handleStartNew = () => {
    setAnswers(createEmptyAnswers());
    setQuestionIndex(0);
    setCompletedSession(null);
    setActiveView('register');
  };

  const handleBeginQuiz = (normalizedName: string) => {
    setUserName(normalizedName);
    setAnswers(createEmptyAnswers());
    setQuestionIndex(0);
    setCompletedSession(null);
    setActiveView('quiz');
  };

  const handleSelectAnswer = (qIndex: number, choice: AnswerChoice) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = choice;
      return next;
    });
  };

  const handleFinishQuiz = () => {
    const finalScores = computeScoresFromAnswers(answers);
    const analysis = analyzeScores(finalScores);
    const snapshotAnswers = [...answers];
    setCompletedSession({
      userName,
      ranked: analysis.ranked,
      answers: snapshotAnswers,
      greedySteps: analysis.greedySteps,
      mergeSteps: analysis.mergeSteps,
    });
    setActiveView('results');
    persistResult(userName, analysis.ranked);
  };

  const handleCancelQuiz = () => {
    // TC12: Canceling mid-quiz discards progress and saves nothing to CSV
    setAnswers(createEmptyAnswers());
    setQuestionIndex(0);
    setActiveView('overview');
  };

  const handleNavigate = (view: 'overview' | 'daa' | 'history') => {
    setActiveView(view);
  };

  const hasActiveQuiz =
    activeView === 'quiz' ||
    (answers.some((a) => a !== null) && completedSession === null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeView={activeView}
        onNavigate={handleNavigate}
        onStartNew={handleStartNew}
        hasActiveQuiz={hasActiveQuiz}
        onResumeQuiz={() => setActiveView('quiz')}
      />

      <main className="flex-1">
        {activeView === 'overview' && (
          <OverviewScreen
            onStartAnalysis={handleStartNew}
            onOpenDaaLab={() => setActiveView('daa')}
            onOpenHistory={() => setActiveView('history')}
          />
        )}

        {activeView === 'register' && (
          <RegistrationScreen
            onBeginQuiz={handleBeginQuiz}
            onCancel={() => setActiveView('overview')}
          />
        )}

        {activeView === 'quiz' && (
          <QuizScreen
            userName={userName}
            questionIndex={questionIndex}
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onGoToQuestion={setQuestionIndex}
            onFinishQuiz={handleFinishQuiz}
            onCancelQuiz={handleCancelQuiz}
          />
        )}

        {activeView === 'results' && completedSession && (
          <ResultsScreen
            userName={completedSession.userName}
            ranked={completedSession.ranked}
            answers={completedSession.answers}
            greedySteps={completedSession.greedySteps}
            mergeSteps={completedSession.mergeSteps}
            saveState={saveState}
            saveError={saveError}
            onRetrySave={() => persistResult(completedSession.userName, completedSession.ranked)}
            onRetake={handleStartNew}
            onViewHistory={() => setActiveView('history')}
          />
        )}

        {activeView === 'daa' && <DaaLabScreen />}

        {activeView === 'history' && (
          <HistoryScreen
            rows={historyRows}
            loading={historyLoading}
            error={historyError}
            onRefresh={fetchHistory}
            onStartNew={handleStartNew}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>Personality Analyzer · C++ DAA Minor Project Web Edition</span>
          <span>For educational self-reflection only · Greedy Method &amp; Merge Sort</span>
        </div>
      </footer>
    </div>
  );
}
