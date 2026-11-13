import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createExam } from "../src/lib/quiz.js";

const bank = JSON.parse(
  readFileSync(new URL("../src/data/questions.json", import.meta.url)),
);

test("all original and split questions have standalone explanations and valid choices", () => {
  assert.equal(bank.length, 555);
  assert.equal(bank.filter((q) => q.variantOf).length, 29);
  assert.equal(new Set(bank.map((q) => q.id)).size, bank.length);
  for (let id = 1; id <= 526; id++)
    assert.ok(bank.some((q) => q.id === String(id)));
  for (const q of bank) {
    assert.ok(
      q.explanation?.length >= 100,
      `Missing substantive explanation ${q.id}`,
    );
    assert.equal(q.note, undefined, `Unsplit note ${q.id}`);
    assert.equal(q.page, undefined);
    assert.ok(q.options.length >= 2);
    assert.ok(q.correct.every((key) => q.options.some((o) => o.key === key)));
    if (q.variantOf)
      assert.ok(bank.some((parent) => parent.id === q.variantOf));
    if (q.examEligible === false) assert.ok(q.reviewNote?.length > 20);
  }
});

test("alternate questions have their own correct keys rather than inheriting parent letters", () => {
  const alternate = (parent) => bank.find((q) => q.variantOf === parent);
  assert.deepEqual(alternate("2").correct, ["D"]);
  assert.deepEqual(alternate("175").correct, ["D"]);
  assert.deepEqual(alternate("265").correct, ["B"]);
  assert.deepEqual(alternate("341").correct, ["A"]);
  assert.deepEqual(alternate("412").correct, ["C"]);
});

test("unclear questions are excluded from random exams", () => {
  const restricted = bank.map((q, i) => ({ ...q, examEligible: i >= 15 }));
  for (let i = 0; i < 10; i++) {
    const exam = createExam(restricted);
    assert.equal(exam.ids.length, 60);
    assert.ok(
      exam.ids.every(
        (id) => restricted.find((q) => q.id === id).examEligible !== false,
      ),
    );
  }
  assert.throws(() =>
    createExam(bank.map((q) => ({ ...q, examEligible: false }))),
  );
});

test("all 555 questions are graded with the course answer keys, including the 15 reinstated cards", () => {
  const expected = {
    52: ["C"],
    123: ["D"],
    149: ["A"],
    162: ["A", "B", "C"],
    190: ["B"],
    206: ["A", "B", "C"],
    209: ["A"],
    228: ["A"],
    274: ["A"],
    297: ["B"],
    345: ["A"],
    360: ["D"],
    440: ["B"],
    480: ["A"],
    535: ["A"],
  };
  assert.equal(bank.filter((q) => q.examEligible !== false).length, 555);
  for (const [id, correct] of Object.entries(expected)) {
    const question = bank.find((q) => q.id === id);
    assert.equal(question.examEligible, true, id);
    assert.equal(question.reviewNote, undefined, id);
    assert.deepEqual(question.correct, correct, id);
    assert.ok(
      !/cần làm rõ|chưa đủ căn cứ|trước khi chấm/.test(question.explanation),
      id,
    );
  }
  const restored = bank.filter((q) => expected[q.id]);
  const exam = createExam([
    ...restored,
    ...bank.filter((q) => !expected[q.id]).slice(0, 45),
  ]);
  assert.ok(restored.every((q) => exam.ids.includes(q.id)));
});

test("curated corrections distinguish concepts that had conflicting keys", () => {
  const byId = Object.fromEntries(bank.map((q) => [q.id, q]));
  assert.deepEqual(byId["70"].correct, ["B"]);
  assert.deepEqual(byId["71"].correct, ["A"]);
  assert.deepEqual(byId["238"].correct, ["B"]);
  assert.deepEqual(byId["386"].correct, ["B"]);
  assert.deepEqual(byId["392"].correct, ["A"]);
  assert.deepEqual(byId["409"].correct, ["A", "C"]);
  assert.deepEqual(byId["450"].correct, ["A"]);
  assert.equal(
    existsSync(new URL("../public/source.pdf", import.meta.url)),
    false,
  );
});
