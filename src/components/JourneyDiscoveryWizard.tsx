"use client";

import { useEffect, useState } from "react";
import {
  getJourneyDiscoveryQuestions,
  recommendJourneyRoles,
} from "@/lib/api";
import type {
  DiscoveryAnswers,
  DiscoveryQuestion,
  JourneyRoleRecommendation,
} from "@/types/journey";

export interface JourneyDiscoveryResult {
  roleId: string;
  roleLabel: string;
  suggestedName: string;
  reason: string;
  answers: DiscoveryAnswers;
}

interface JourneyDiscoveryWizardProps {
  onComplete: (result: JourneyDiscoveryResult) => void;
  onCancel: () => void;
}

export default function JourneyDiscoveryWizard({
  onComplete,
  onCancel,
}: JourneyDiscoveryWizardProps) {
  const [questions, setQuestions] = useState<DiscoveryQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiscoveryAnswers>({});
  const [recommendations, setRecommendations] = useState<
    JourneyRoleRecommendation[]
  >([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[step] ?? null;
  const isQuestionStep = step < questions.length;
  const isResultsStep = !isQuestionStep && recommendations.length > 0;
  const progress = questions.length
    ? Math.min(step + 1, questions.length + 1)
    : 0;

  useEffect(() => {
    let cancelled = false;

    getJourneyDiscoveryQuestions()
      .then((data) => {
        if (!cancelled) {
          setQuestions(data.questions);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load discovery questions",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingQuestions(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSelectOption(optionId: string) {
    if (!currentQuestion) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: optionId,
    }));
  }

  async function handleNext() {
    if (!currentQuestion) {
      return;
    }

    if (!answers[currentQuestion.id]) {
      setError("Choose an option to continue.");
      return;
    }

    setError(null);

    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setLoadingRecommendations(true);

    try {
      const result = await recommendJourneyRoles(answers);
      setRecommendations(result.recommendations);
      setStep(questions.length);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate recommendations",
      );
    } finally {
      setLoadingRecommendations(false);
    }
  }

  function handleBack() {
    setError(null);
    if (isResultsStep) {
      setStep(questions.length - 1);
      setRecommendations([]);
      return;
    }

    if (step > 0) {
      setStep((current) => current - 1);
    }
  }

  function handleChooseRecommendation(recommendation: JourneyRoleRecommendation) {
    onComplete({
      roleId: recommendation.roleId,
      roleLabel: recommendation.label,
      suggestedName: `${recommendation.label} path`,
      reason: recommendation.reason,
      answers,
    });
  }

  if (loadingQuestions) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-sm text-muted">Loading career discovery questions...</p>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Discover your career path
        </h2>
        <p className="mt-1 text-sm text-muted">
          Answer a few questions and we&apos;ll recommend roles that fit your
          interests.
        </p>
      </div>

      {questions.length > 0 ? (
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>
              {isResultsStep
                ? "Your recommendations"
                : `Question ${step + 1} of ${questions.length}`}
            </span>
            <span>
              Step {progress} of {questions.length + 1}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{
                width: `${(progress / (questions.length + 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {isQuestionStep && currentQuestion ? (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-sm font-medium text-foreground">
            {currentQuestion.prompt}
          </legend>
          {currentQuestion.options.map((option) => {
            const selected = answers[currentQuestion.id] === option.id;
            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
                  selected
                    ? "border-accent bg-background"
                    : "border-border hover:bg-background"
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.id}
                  checked={selected}
                  onChange={() => handleSelectOption(option.id)}
                  className="mt-0.5 accent-accent"
                />
                <span className="text-foreground">{option.label}</span>
              </label>
            );
          })}
        </fieldset>
      ) : null}

      {loadingRecommendations ? (
        <p className="text-sm text-muted">Finding roles that match your interests...</p>
      ) : null}

      {isResultsStep ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Here are the best matches from your answers. Pick one to start your
            journey.
          </p>
          {recommendations.map((recommendation, index) => (
            <button
              key={recommendation.roleId}
              type="button"
              onClick={() => handleChooseRecommendation(recommendation)}
              className="rounded-lg border border-border px-4 py-4 text-left transition-colors hover:border-accent hover:bg-background"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">
                    {index === 0 ? "Top match: " : ""}
                    {recommendation.label}
                  </p>
                  <p className="mt-1 text-sm text-muted">{recommendation.reason}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {isQuestionStep ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={loadingRecommendations || !answers[currentQuestion?.id ?? ""]}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 sm:w-auto"
          >
            {step === questions.length - 1 ? "See recommendations" : "Next"}
          </button>
        ) : null}

        {step > 0 || isResultsStep ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={loadingRecommendations}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background disabled:opacity-50 sm:w-auto"
          >
            Back
          </button>
        ) : null}

        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background sm:w-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
