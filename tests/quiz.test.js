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
  shuffleOptionKeys,
  displayOptions,
} from "../src/lib/quiz.js";

const bank = JSON.parse(
  readFileSync(new URL("../src/data/questions.json", import.meta.url)),
);

test("imports all 555 explained questions with valid, nonempty options and keys", () => {
  assert.equal(bank.length, 555);
  assert.equal(new Set(bank.map((q) => q.id)).size, 555);
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
    assert.ok(q.explanation.length >= 100);
  }
});

test("shuffle preserves the complete bank and does not mutate input", () => {
  const input = [1, 2, 3, 4];
  const result = shuffle(input, () => 0);
  assert.deepEqual(input, [1, 2, 3, 4]);
  assert.deepEqual([...result].sort(), input);
  assert.notDeepEqual(result, input);
});

test("retry changes option order while labels stay sequential and scoring uses source keys", () => {
  const question = bank[0];
  const original = question.options.map((o) => o.key);
  const order = shuffleOptionKeys(question, original, () => 0.999);
  assert.notDeepEqual(order, original);
  assert.deepEqual(order.toSorted(), original.toSorted());
  const options = displayOptions(question, order);
  assert.deepEqual(
    options.map((o) => o.label),
    ["A", "B", "C", "D"],
  );
  for (const option of options) {
    assert.equal(
      option.text,
      question.options.find((o) => o.key === option.key).text,
    );
  }
  const correctOption = options.find((o) => question.correct.includes(o.key));
  assert.equal(isCorrect(question, [correctOption.key]), true);
  assert.notEqual(correctOption.label, correctOption.key);
  assert.deepEqual(
    question.options.map((o) => o.key),
    original,
  );
  const retry = shuffleOptionKeys(question, order, () => 0.999);
  assert.notDeepEqual(retry, order);
});

test("option labels cover three to five choices and preserve multiple-answer identity", () => {
  for (const question of bank) {
    const options = displayOptions(question, shuffleOptionKeys(question));
    assert.deepEqual(
      options.map((o) => o.label),
      "ABCDE".slice(0, question.options.length).split(""),
    );
    assert.equal(
      isCorrect(
        question,
        options
          .filter((o) => question.correct.includes(o.key))
          .map((o) => o.key),
      ),
      true,
    );
  }
});

test("shuffled all-of-the-above wording stays meaningful; source text is preserved", () => {
  const question = {
    options: [
      { key: "A", text: "Tất cả phương án trên" },
      { key: "B", text: "Các đáp án trên đều sai" },
    ],
  };
  const options = displayOptions(question, ["B", "A"]);
  assert.equal(options[0].displayText, "Các đáp án còn lại đều sai");
  assert.equal(options[1].displayText, "Tất cả phương án còn lại");
  assert.equal(options[1].text, "Tất cả phương án trên");
  assert.equal(
    displayOptions(question)[0].displayText,
    "Tất cả phương án trên",
  );
});

test("a new exam reshuffles repeated questions compared with the previous exam", () => {
  const subset = bank.filter((q) => q.examEligible !== false).slice(0, 60);
  const previous = createExam(subset, 1000);
  const next = createExam(subset, 2000, previous.optionOrders);
  for (const id of next.ids)
    assert.notDeepEqual(next.optionOrders[id], previous.optionOrders[id]);
});

test("exam samples exactly 60 unique questions and gives precisely 50 minutes", () => {
  const exam = createExam(bank, 1000);
  assert.equal(exam.ids.length, 60);
  assert.equal(new Set(exam.ids).size, 60);
  assert.equal(exam.endsAt - exam.startedAt, 50 * 60 * 1000);
  assert.deepEqual(exam.answers, {});
  assert.ok(exam.ids.every((id) => bank.some((q) => q.id === id)));
  assert.equal(Object.keys(exam.optionOrders).length, 60);
  for (const id of exam.ids) {
    assert.deepEqual(
      exam.optionOrders[id].toSorted(),
      bank
        .find((q) => q.id === id)
        .options.map((o) => o.key)
        .toSorted(),
    );
  }
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
  assert.equal(
    restoreExam(JSON.stringify({ ...exam, optionOrders: {} }), bank),
    null,
  );
  assert.equal(
    restoreExam(
      JSON.stringify({
        ...exam,
        optionOrders: { ...exam.optionOrders, [exam.ids[0]]: ["A", "A"] },
      }),
      bank,
    ),
    null,
  );
  const legacy = { ...exam };
  delete legacy.optionOrders;
  assert.deepEqual(restoreExam(JSON.stringify(legacy), bank), legacy);
  assert.deepEqual(
    displayOptions(bank[0]).map((o) => o.key),
    bank[0].options.map((o) => o.key),
  );
});
