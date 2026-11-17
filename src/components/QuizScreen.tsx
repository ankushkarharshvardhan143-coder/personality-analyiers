import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Grid, X } from 'lucide-react';
import { AnswerChoice, QUESTION_COUNT, QUESTIONS } from '../lib/analyzer';

interface QuizScreenProps {
  userName: string;
  questionIndex: number;
  answers: ReadonlyArray<AnswerChoice | null>;
  onSelectAnswer: (questionIndex: number, choice: AnswerChoice) => void;
  onGoToQuestion: (index: number) => void;
  onFinishQuiz: () => void;
  onCancelQuiz: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  userName,
  questionIndex,
  answers,
  onSelectAnswer,
  onGoToQuestion,
  onFinishQuiz,
  onCancelQuiz,
}) => {
  const [showNavigator, setShowNavigator] = useState(false);
  const question = QUESTIONS[questionIndex];
  const currentAnswer = answers[questionIndex];
  const selectedOption = currentAnswer?.optionIndex ?? null;
  const currentWeight: 1 | 2 = currentAnswer?.weight ?? 1;

  const answeredCount = answers.filter((a) => a !== null).length;
  const isLastQuestion = questionIndex === QUESTION_COUNT - 1;
  const allAnswered = answeredCount === QUESTION_COUNT;

  const handleChooseOption = useCallback(
    (optionIndex: number) => {
      onSelectAnswer(questionIndex, {
        optionIndex,
        weight: currentWeight,
      });
    },
    [onSelectAnswer, questionIndex, currentWeight]
  );

  const handleWeightChange = useCallback(
    (weight: 1 | 2) => {
      if (selectedOption === null) return;
      onSelectAnswer(questionIndex, {
        optionIndex: selectedOption,
        weight,
      });
    },
    [onSelectAnswer, questionIndex, selectedOption]
  );

  const handleNext = useCallback(() => {
    if (selectedOption === null) return;
    if (isLastQuestion) {
      if (allAnswered) {
        onFinishQuiz();
      } else {
        const firstUnanswered = answers.findIndex((a) => a === null);
        if (firstUnanswered !== -1) {
          onGoToQuestion(firstUnanswered);
        }
      }
    } else {
      onGoToQuestion(questionIndex + 1);
    }
  }, [
    selectedOption,
    isLastQuestion,
    allAnswered,
    onFinishQuiz,
    answers,
    onGoToQuestion,
    questionIndex,
  ]);

  const handlePrevious = useCallback(() => {
    if (questionIndex > 0) {
      onGoToQuestion(questionIndex - 1);
    }
  }, [questionIndex, onGoToQuestion]);

  // Keyboard support: 1-4 select option, S toggles conviction, Enter advances, ArrowLeft goes back, Esc cancels
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        handleChooseOption(Number(e.key) - 1);
      } else if ((e.key === 's' || e.key === 'S') && selectedOption !== null) {
        e.preventDefault();
        handleWeightChange(currentWeight === 1 ? 2 : 1);
      } else if (e.key === 'Enter' && selectedOption !== null) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' && questionIndex > 0) {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onCancelQuiz();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handleChooseOption,
    handleWeightChange,
    handleNext,
    handlePrevious,
    onCancelQuiz,
    selectedOption,
    currentWeight,
    questionIndex,
  ]);

  const progressPercent = Math.round(((questionIndex + 1) / QUESTION_COUNT) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 space-y-7">
        {/* Candidate & Question Counter */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <span>
                Candidate: <strong className="font-semibold text-slate-900">{userName}</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-700 font-medium">{question.category}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-expanded={showNavigator}
                onClick={() => setShowNavigator((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <Grid className="w-3.5 h-3.5" aria-hidden="true" />
                {answeredCount}/{QUESTION_COUNT} answered
              </button>
              <span className="font-mono font-medium text-slate-700 tabular-nums">
                Question {questionIndex + 1} / {QUESTION_COUNT}
              </span>
            </div>
          </div>

          <div
            role="progressbar"
            aria-valuenow={questionIndex + 1}
            aria-valuemin={1}
            aria-valuemax={QUESTION_COUNT}
            aria-label={`Question ${questionIndex + 1} of ${QUESTION_COUNT}`}
            className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-blue-600 transition-[width] duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Interactive 30-Question Jump Navigator */}
          {showNavigator && (
            <div className="pt-2 pb-1 border-b border-slate-100 space-y-2">
              <p className="text-xs text-slate-500">
                Jump to any question to review or adjust your answer and conviction weight:
              </p>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                {QUESTIONS.map((qItem, idx) => {
                  const ans = answers[idx];
                  const isCurrent = idx === questionIndex;
                  return (
                    <button
                      key={qItem.prompt}
                      type="button"
                      onClick={() => {
                        onGoToQuestion(idx);
                        setShowNavigator(false);
                      }}
                      className={`h-8 rounded-md font-mono text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : ans !== null
                          ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Question Prompt */}
        <div className="space-y-2">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 balance-text leading-snug">
            {question.prompt}
          </h1>
          <p className="text-xs text-slate-500">
            Select an option (keys 1–4), adjust conviction (key S), then press Enter or click Next.
          </p>
        </div>

        {/* 4 Option Buttons */}
        <div className="space-y-3" role="radiogroup" aria-label={question.prompt}>
          {question.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <button
                key={optionText}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleChooseOption(idx)}
                className={`w-full min-h-[56px] px-4 py-3.5 text-left rounded-lg border transition-colors flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  isSelected
                    ? 'bg-blue-50 border-blue-600 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-md font-mono text-xs font-semibold flex items-center justify-center shrink-0 tabular-nums border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm sm:text-base font-medium leading-snug">{optionText}</span>
                </div>
                {isSelected && (
                  <Check className="w-5 h-5 text-blue-600 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Conviction / Weight Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-y border-slate-100">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-slate-800">Response Conviction</p>
            <p className="text-xs text-slate-500">
              Strong conviction gives this scenario double weight (2x) in Greedy &amp; Merge Sort.
            </p>
          </div>
          <div
            role="group"
            aria-label="Response conviction weight"
            className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start sm:self-auto"
          >
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={() => handleWeightChange(1)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 ${
                currentWeight === 1
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard (1x)
            </button>
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={() => handleWeightChange(2)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 disabled:opacity-50 ${
                currentWeight === 2
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Strong (2x)
            </button>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={questionIndex === 0}
              onClick={handlePrevious}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              onClick={onCancelQuiz}
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <X className="w-4 h-4" aria-hidden="true" />
              Cancel
            </button>
          </div>

          <button
            type="button"
            disabled={selectedOption === null}
            onClick={handleNext}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            {isLastQuestion ? (allAnswered ? 'Finish Analysis' : 'Next Unanswered') : 'Next'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
