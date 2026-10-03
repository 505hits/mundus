import assert from "node:assert/strict";
import { assessmentAnswers } from "../src/lib/assessment-answers.ts";
import { assessmentBank } from "../src/lib/assessment-catalog.ts";
import { scorePlacement } from "../src/lib/placement.ts";
for (const language of ["en", "de", "es", "it", "fr"]) {
  for (const kind of ["placement", "progress"]) {
    const bank = assessmentBank(language, kind);
    const valid = () => {
      const form = new FormData();
      bank.questions.forEach(q => form.set(q.id, String(q.answer)));
      return form;
    };
    assert.equal(scorePlacement(assessmentAnswers(valid(), bank.questions), bank.questions).score, 24);
    const first = bank.questions[0];
    for (const value of ["", " ", "\n", "00", "+0", "-0", "0.0", "0e0", "0x0", "NaN", "Infinity", "-1", "4", "999999999999999999999999999"]) {
      const form = valid(); form.set(first.id, value);
      assert.throws(() => assessmentAnswers(form, bank.questions));
    }
    const missing = valid(); missing.delete(first.id);
    assert.throws(() => assessmentAnswers(missing, bank.questions));
    const duplicate = valid(); duplicate.append(first.id, "0");
    assert.throws(() => assessmentAnswers(duplicate, bank.questions));
    const file = valid(); file.set(first.id, new Blob(["0"]), "answer.txt");
    assert.throws(() => assessmentAnswers(file, bank.questions));
    const wrong = valid(); bank.questions.forEach(q => wrong.set(q.id, String((q.answer + 1) % q.options.length)));
    assert.equal(scorePlacement(assessmentAnswers(wrong, bank.questions), bank.questions).score, 0);
  }
}
console.log("Assessment answer validation passed for all languages and both banks");
