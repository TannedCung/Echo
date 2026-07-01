"use client";

import { Input } from "@/components/ui/input";
import { optionsFor, type PublicQuestion } from "@/lib/ielts/objective-scoring";
import { cn } from "@/lib/utils";

interface ObjectiveQuestionsProps {
  questions: PublicQuestion[];
  responses: Record<string, string>;
  onChange: (id: string, value: string) => void;
  /** Continuous numbering offset (questions are 1-indexed in the label). */
  startIndex?: number;
  disabled?: boolean;
}

/**
 * Renders a list of objective questions (Reading/Listening) as accessible form
 * controls: radio groups for multiple-choice and True/False/Not Given, and a
 * short text field for gap-fill. Controlled by the parent surface, which owns the
 * responses and submits them for server-side grading. Never receives answers.
 */
export function ObjectiveQuestions({
  questions,
  responses,
  onChange,
  startIndex = 0,
  disabled,
}: ObjectiveQuestionsProps) {
  return (
    <ol className="flex flex-col gap-6">
      {questions.map((question, i) => {
        const number = startIndex + i + 1;
        const options = optionsFor(question);
        const isChoice = options.length > 0;
        return (
          <li key={question.id} className="flex flex-col gap-2">
            <p className="text-sm font-medium">
              <span className="text-muted-foreground">{number}. </span>
              {question.prompt}
            </p>

            {isChoice ? (
              <div
                role="radiogroup"
                aria-label={`Question ${number}`}
                className="flex flex-col gap-1.5"
              >
                {options.map((option) => {
                  const checked = responses[question.id] === option;
                  return (
                    <label
                      key={option}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border px-3 py-2 text-sm transition-colors",
                        checked
                          ? "border-primary bg-primary-soft text-primary"
                          : "border-border hover:bg-muted",
                        disabled && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={checked}
                        disabled={disabled}
                        onChange={() => onChange(question.id, option)}
                        className="accent-primary size-4"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <Input
                  value={responses[question.id] ?? ""}
                  disabled={disabled}
                  onChange={(e) => onChange(question.id, e.target.value)}
                  placeholder="Type your answer"
                  aria-label={`Question ${number}`}
                  className="max-w-sm"
                />
                {question.wordLimit && (
                  <span className="text-muted-foreground text-xs">{question.wordLimit}</span>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
