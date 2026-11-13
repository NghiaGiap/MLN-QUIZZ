export const EXAM_SECONDS = 50 * 60;
// A revised answer bank needs a fresh exam; old attempts must not be regraded silently.
export const STORAGE_KEY = "mln122-exam-v2";

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function shuffleOptionKeys(
  question,
  previous = question.options.map((o) => o.key),
  random = Math.random,
) {
  const order = shuffle(previous, random);
  // A fresh attempt must visibly change the order, even if random returns the same permutation.
  if (
    order.length > 1 &&
    order.every((key, index) => key === previous[index])
  ) {
    order.push(order.shift());
  }
  return order;
}

export function displayOptions(question, order) {
  const options = order
    ? order.map((key) => question.options.find((o) => o.key === key))
    : question.options;
  return options.map((option, index) => ({
    ...option,
    label: String.fromCharCode(65 + index),
    displayText: order
      ? option.text.replace(/((?:phương án|đáp án)) trên/gi, "$1 còn lại")
      : option.text,
  }));
}

export function createExam(bank, now = Date.now(), previousOrders = {}) {
  const eligible = bank.filter((q) => q.examEligible !== false);
  if (eligible.length < 60)
    throw new Error("Cần ít nhất 60 câu hỏi đủ dữ kiện để tạo đề.");
  const questions = shuffle(eligible).slice(0, 60);
  return {
    ids: questions.map((q) => q.id),
    optionOrders: Object.fromEntries(
      questions.map((q) => [q.id, shuffleOptionKeys(q, previousOrders[q.id])]),
    ),
    startedAt: now,
    endsAt: now + EXAM_SECONDS * 1000,
    answers: {},
    index: 0,
    submittedAt: null,
    timedOut: false,
  };
}

export function isCorrect(question, selected = []) {
  return (
    selected.length === question.correct.length &&
    question.correct.every((key) => selected.includes(key))
  );
}

export function scoreExam(questions, answers) {
  const correct = questions.filter((q) => isCorrect(q, answers[q.id])).length;
  const unanswered = questions.filter((q) => !answers[q.id]?.length).length;
  return {
    correct,
    wrong: questions.length - correct - unanswered,
    unanswered,
    total: questions.length,
    score: ((correct / questions.length) * 10).toFixed(2),
  };
}

export function remainingSeconds(endsAt, now = Date.now()) {
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}

export function formatTime(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function restoreExam(raw, bank) {
  try {
    const exam = JSON.parse(raw);
    const byId = new Map(bank.map((q) => [q.id, q]));
    if (
      !exam ||
      !Array.isArray(exam.ids) ||
      exam.ids.length !== 60 ||
      new Set(exam.ids).size !== 60 ||
      !exam.ids.every(
        (id) => byId.has(id) && byId.get(id).examEligible !== false,
      )
    )
      return null;
    if (
      !Number.isFinite(exam.startedAt) ||
      !Number.isFinite(exam.endsAt) ||
      exam.endsAt - exam.startedAt !== EXAM_SECONDS * 1000
    )
      return null;
    if (
      !Number.isInteger(exam.index) ||
      exam.index < 0 ||
      exam.index >= 60 ||
      typeof exam.timedOut !== "boolean"
    )
      return null;
    if (
      exam.submittedAt !== null &&
      (!Number.isFinite(exam.submittedAt) || exam.submittedAt < exam.startedAt)
    )
      return null;
    if (
      !exam.answers ||
      typeof exam.answers !== "object" ||
      Array.isArray(exam.answers)
    )
      return null;
    // Older saved exams used the original PDF order; keep those attempts unchanged.
    if (exam.optionOrders !== undefined) {
      if (
        !exam.optionOrders ||
        typeof exam.optionOrders !== "object" ||
        Array.isArray(exam.optionOrders) ||
        Object.keys(exam.optionOrders).length !== 60
      )
        return null;
      for (const id of exam.ids) {
        const keys = exam.optionOrders[id];
        const expected = byId.get(id).options.map((o) => o.key);
        if (
          !Array.isArray(keys) ||
          keys.length !== expected.length ||
          new Set(keys).size !== keys.length ||
          !keys.every((key) => expected.includes(key))
        )
          return null;
      }
    }
    for (const [id, keys] of Object.entries(exam.answers)) {
      const question = byId.get(id);
      if (
        !exam.ids.includes(id) ||
        !Array.isArray(keys) ||
        new Set(keys).size !== keys.length ||
        !keys.every((key) => question.options.some((o) => o.key === key))
      )
        return null;
    }
    return exam;
  } catch {
    return null;
  }
}
