import type { AssessmentQuestion } from "./placement.ts";

// Form values must be explicit option indices; numeric coercion accepts blanks,
// whitespace and other representations that the radio controls never produce.
export function assessmentAnswers(form: FormData, questions: readonly AssessmentQuestion[]): number[] {
  return questions.map(question => {
    const values = form.getAll(question.id);
    const value = values[0];
    if (values.length !== 1 || typeof value !== "string" || !/^(0|[1-9][0-9]*)$/.test(value)) {
      throw new Error("Answer every question once");
    }
    const index = Number(value);
    if (!Number.isSafeInteger(index) || index >= question.options.length) {
      throw new Error("Invalid answer option");
    }
    return index;
  });
}
