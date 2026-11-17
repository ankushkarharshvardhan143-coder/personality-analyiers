import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { normalizeUserName } from '../lib/analyzer';

interface RegistrationScreenProps {
  initialName?: string;
  onBeginQuiz: (userName: string) => void;
  onCancel: () => void;
}

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  initialName = '',
  onBeginQuiz,
  onCancel,
}) => {
  const [nameInput, setNameInput] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBeginQuiz(normalizeUserName(nameInput));
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 space-y-8">
        <div className="space-y-2">
          <p className="text-xs font-medium text-blue-700">
            Step 1 of 2 · User Registration
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Enter candidate name
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your name labels the assessment header and the exported row in{' '}
            <code className="font-mono text-xs text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
              personality_results.csv
            </code>
            . Leave it blank to continue as Guest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="candidate-name"
              className="block text-sm font-medium text-slate-800"
            >
              Candidate Name
            </label>
            <input
              ref={inputRef}
              id="candidate-name"
              name="candidateName"
              type="text"
              maxLength={30}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Aarav Sharma (or press Enter for Guest)"
              className="w-full min-h-[44px] px-4 py-2.5 text-base text-slate-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Will record as: {normalizeUserName(nameInput)}</span>
              <span className="font-mono tabular-nums">{nameInput.length}/30</span>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-[44px] px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              Begin 30 Questions
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
