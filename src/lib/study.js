import { shuffleOptionKeys } from "./quiz.js";

export const STUDY_STORAGE_KEY = "mln122-study-v1";

function bankSignature(bank) {
  // Invalidate old answers when questions, choices or keys change, not when explanations improve.
  const content = JSON.stringify(
    bank.map(({ id, question, options, correct }) => [
      id,
      question,
      options,
      correct,
    ]),
  );
  let hash = 2166136261;
  for (let i = 0; i < content.length; i++)
    hash = Math.imul(hash ^ content.charCodeAt(i), 16777619) >>> 0;
  return hash.toString(16);
}

export function createStudySession(bank, previousOrders = {}) {
  return {
    version: 1,
    bankSignature: bankSignature(bank),
    order: bank.map((q) => q.id),
    index: 0,
    answers: {},
    checked: {},
    optionOrders: Object.fromEntries(
      bank.map((q) => [q.id, shuffleOptionKeys(q, previousOrders[q.id])]),
    ),
    search: "",
  };
}

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const isPermutation = (values, expected) =>
  Array.isArray(values) &&
  values.length === expected.length &&
  new Set(values).size === values.length &&
  values.every((value) => expected.includes(value));

export function restoreStudySession(raw, bank) {
  try {
    const saved = JSON.parse(raw);
    const byId = new Map(bank.map((q) => [q.id, q]));
    if (
      !isRecord(saved) ||
      saved.version !== 1 ||
      saved.bankSignature !== bankSignature(bank) ||
      !isPermutation(saved.order, [...byId.keys()]) ||
      !Number.isInteger(saved.index) ||
      saved.index < 0 ||
      saved.index >= bank.length ||
      typeof saved.search !== "string" ||
      !isRecord(saved.answers) ||
      !isRecord(saved.checked) ||
      !isRecord(saved.optionOrders) ||
      Object.keys(saved.optionOrders).length !== bank.length
    )
      return null;
    for (const question of bank) {
      if (
        !isPermutation(
          saved.optionOrders[question.id],
          question.options.map((o) => o.key),
        )
      )
        return null;
    }
    for (const [id, keys] of Object.entries(saved.answers)) {
      const question = byId.get(id);
      if (
        !question ||
        !Array.isArray(keys) ||
        new Set(keys).size !== keys.length ||
        (question.correct.length === 1 && keys.length > 1) ||
        !keys.every((key) => question.options.some((o) => o.key === key))
      )
        return null;
    }
    if (
      Object.entries(saved.checked).some(
        ([id, checked]) =>
          !byId.has(id) || checked !== true || !saved.answers[id]?.length,
      )
    )
      return null;
    return {
      version: 1,
      bankSignature: saved.bankSignature,
      order: saved.order,
      index: saved.index,
      answers: saved.answers,
      checked: saved.checked,
      optionOrders: saved.optionOrders,
      search: saved.search,
    };
  } catch {
    return null;
  }
}
