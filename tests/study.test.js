import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createStudySession, restoreStudySession } from "../src/lib/study.js";

const bank = JSON.parse(
  readFileSync(new URL("../src/data/questions.json", import.meta.url)),
);

test("starting over clears all study progress and reshuffles every question from its previous order", () => {
  const random = Math.random;
  Math.random = () => 0;
  try {
    const previous = createStudySession(bank);
    previous.order.reverse();
    previous.index = 40;
    previous.answers = { 1: ["D"], 2: ["A"] };
    previous.checked = { 1: true };
    previous.search = "526";
    const unchanged = structuredClone(previous);
    const fresh = createStudySession(bank, previous.optionOrders);
    assert.deepEqual(
      fresh.order,
      bank.map((q) => q.id),
    );
    assert.equal(fresh.index, 0);
    assert.equal(fresh.search, "");
    assert.deepEqual(fresh.answers, {});
    assert.deepEqual(fresh.checked, {});
    for (const q of bank)
      assert.notDeepEqual(
        fresh.optionOrders[q.id],
        previous.optionOrders[q.id],
      );
    assert.deepEqual(previous, unchanged);
    assert.deepEqual(restoreStudySession(JSON.stringify(fresh), bank), fresh);
  } finally {
    Math.random = random;
  }
});

test("study restores position, question/answer order, partial answers, feedback and search", () => {
  const session = createStudySession(bank);
  session.order.reverse();
  session.index = 41;
  session.answers = { 1: ["D"], 2: ["A"], 3: [] };
  session.checked = { 1: true };
  session.search = "giá trị";
  assert.deepEqual(restoreStudySession(JSON.stringify(session), bank), session);
  assert.deepEqual(session.order, bank.map((q) => q.id).reverse());
});

test("study rejects damaged records rather than rendering missing cards or misgrading", () => {
  const damage = [
    (s) => {
      s.version = 0;
    },
    (s) => {
      s.bankSignature = "old";
    },
    (s) => {
      s.order[1] = s.order[0];
    },
    (s) => {
      s.order.pop();
    },
    (s) => {
      s.index = -1;
    },
    (s) => {
      s.index = 1.5;
    },
    (s) => {
      s.index = bank.length;
    },
    (s) => {
      s.search = {};
    },
    (s) => {
      s.answers = [];
    },
    (s) => {
      s.answers["unknown"] = ["A"];
    },
    (s) => {
      s.answers["1"] = ["X"];
    },
    (s) => {
      s.answers["1"] = ["A", "A"];
    },
    (s) => {
      s.answers["1"] = ["A", "B"];
    },
    (s) => {
      s.checked["1"] = true;
    },
    (s) => {
      s.checked = null;
    },
    (s) => {
      delete s.optionOrders["1"];
    },
    (s) => {
      s.optionOrders["1"] = ["A", "A", "B", "C"];
    },
  ];
  for (const mutate of damage) {
    const session = createStudySession(bank);
    mutate(session);
    assert.equal(
      restoreStudySession(JSON.stringify(session), bank),
      null,
      mutate.toString(),
    );
  }
  for (const raw of [null, "{broken", "null", "[]", "{}"])
    assert.equal(restoreStudySession(raw, bank), null);
});

test("answer bank changes invalidate study history, while explanation edits retain it", () => {
  const raw = JSON.stringify(createStudySession(bank));
  for (const change of [
    (q) => {
      q.question += "?";
    },
    (q) => {
      q.options[0].text += " changed";
    },
    (q) => {
      q.correct = ["A"];
    },
  ]) {
    const updated = structuredClone(bank);
    change(updated[0]);
    assert.equal(restoreStudySession(raw, updated), null);
  }
  const explanations = structuredClone(bank);
  explanations[0].explanation += " Thêm ví dụ.";
  assert.ok(restoreStudySession(raw, explanations));
});
