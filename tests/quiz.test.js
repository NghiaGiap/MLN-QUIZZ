import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  shuffle,
  createExam,
  scoreExam,
  remainingSeconds,
  restoreExam,
  isCorrect,
} from "../src/lib/quiz.js";

const bank = JSON.parse(
  readFileSync(new URL("../src/data/questions.json", import.meta.url)),
);

test("imports all 526 source cards with valid, nonempty options and keys", () => {
  assert.equal(bank.length, 526);
  assert.equal(new Set(bank.map((q) => q.id)).size, 526);
  for (const q of bank) {
    assert.ok(q.question.trim(), `Question ${q.id}`);
    assert.ok(q.options.length >= 2, `Options ${q.id}`);
    assert.equal(new Set(q.options.map((o) => o.key)).size, q.options.length);
    assert.ok(q.correct.length >= 1);
    assert.ok(
      q.correct.every((key) => q.options.some((o) => o.key === key)),
      `Key ${q.id}`,
    );
    assert.ok(q.options.every((o) => o.text.trim()));
    assert.ok(q.page >= 1 && q.page <= 147);
  }
});

test("shuffle preserves the complete bank and does not mutate input", () => {
  const input = [1, 2, 3, 4];
  const result = shuffle(input, () => 0);
  assert.deepEqual(input, [1, 2, 3, 4]);
  assert.deepEqual([...result].sort(), input);
  assert.notDeepEqual(result, input);
});

test("exam samples exactly 60 unique questions and gives precisely 50 minutes", () => {
  const exam = createExam(bank, 1000);
  assert.equal(exam.ids.length, 60);
  assert.equal(new Set(exam.ids).size, 60);
  assert.equal(exam.endsAt - exam.startedAt, 50 * 60 * 1000);
  assert.deepEqual(exam.answers, {});
  assert.ok(exam.ids.every((id) => bank.some((q) => q.id === id)));
});

test("grade treats unanswered as unanswered, counts correct and wrong, scales to 10", () => {
  const questions = bank.slice(0, 3);
  const wrong = questions[1].options.find(
    (o) => !questions[1].correct.includes(o.key),
  ).key;
  const result = scoreExam(questions, {
    [questions[0].id]: questions[0].correct,
    [questions[1].id]: [wrong],
  });
  assert.deepEqual(result, {
    correct: 1,
    wrong: 1,
    unanswered: 1,
    total: 3,
    score: "3.33",
  });
});

test("clock uses a fixed deadline, rounds seconds up and clamps after expiry", () => {
  assert.equal(remainingSeconds(3_000_000, 0), 3000);
  assert.equal(remainingSeconds(1001, 1000), 1);
  assert.equal(remainingSeconds(1000, 9000), 0);
});

test("multiple-choice grading requires an exact set, independent of selection order", () => {
  const question = { correct: ["A", "C"] };
  assert.equal(isCorrect(question, ["C", "A"]), true);
  assert.equal(isCorrect(question, ["A"]), false);
  assert.equal(isCorrect(question, ["A", "B", "C"]), false);
  assert.equal(isCorrect(question, []), false);
});

test("restore preserves deadline and answers; rejects corrupt, duplicate or unknown IDs", () => {
  const exam = createExam(bank, 1000);
  exam.answers[exam.ids[0]] = bank.find((q) => q.id === exam.ids[0]).correct;
  assert.deepEqual(restoreExam(JSON.stringify(exam), bank), exam);
  assert.equal(restoreExam("{bad", bank), null);
  assert.equal(
    restoreExam(
      JSON.stringify({ ...exam, ids: Array(60).fill(bank[0].id) }),
      bank,
    ),
    null,
  );
  assert.equal(
    restoreExam(
      JSON.stringify({ ...exam, ids: [...exam.ids.slice(1), "invalid"] }),
      bank,
    ),
    null,
  );
  assert.equal(
    restoreExam(JSON.stringify({ ...exam, endsAt: null }), bank),
    null,
  );
  assert.equal(
    restoreExam(
      JSON.stringify({ ...exam, answers: { [exam.ids[0]]: ["X"] } }),
      bank,
    ),
    null,
  );
  assert.equal(restoreExam(JSON.stringify({ ...exam, index: 60 }), bank), null);
});
