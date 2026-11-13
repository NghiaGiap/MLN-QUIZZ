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
  assert.ok(bank.some((q) => q.examEligible === false));
  for (let i = 0; i < 10; i++) {
    const exam = createExam(bank);
    assert.equal(exam.ids.length, 60);
    assert.ok(
      exam.ids.every(
        (id) => bank.find((q) => q.id === id).examEligible !== false,
      ),
    );
  }
  assert.throws(() =>
    createExam(bank.map((q) => ({ ...q, examEligible: false }))),
  );
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
