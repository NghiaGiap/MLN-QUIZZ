import { useEffect, useState } from "react";
import bank from "./data/questions.json";
import {
  createExam,
  remainingSeconds,
  restoreExam,
  STORAGE_KEY,
} from "./lib/quiz.js";

export default function useExam() {
  const [exam, setExam] = useState(() => {
    try {
      return restoreExam(localStorage.getItem(STORAGE_KEY), bank);
    } catch {
      return null;
    }
  });
  const [seconds, setSeconds] = useState(() =>
    exam ? remainingSeconds(exam.endsAt) : 3000,
  );
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    if (!exam) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exam));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [exam]);
  useEffect(() => {
    if (!exam || exam.submittedAt !== null) return;
    const tick = () => {
      const remaining = remainingSeconds(exam.endsAt);
      setSeconds(remaining);
      if (remaining === 0)
        setExam((current) =>
          current && current.submittedAt === null
            ? { ...current, submittedAt: current.endsAt, timedOut: true }
            : current,
        );
    };
    tick();
    const interval = setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [exam?.endsAt, exam?.submittedAt]);
  function answer(id, keys) {
    setExam((current) => {
      if (!current || current.submittedAt !== null) return current;
      if (remainingSeconds(current.endsAt) === 0)
        return { ...current, submittedAt: current.endsAt, timedOut: true };
      return { ...current, answers: { ...current.answers, [id]: keys } };
    });
  }
  function submit() {
    setExam((current) => {
      if (!current || current.submittedAt !== null) return current;
      const timedOut = remainingSeconds(current.endsAt) === 0;
      return {
        ...current,
        submittedAt: timedOut ? current.endsAt : Date.now(),
        timedOut,
      };
    });
  }
  return {
    exam,
    seconds,
    storageError,
    start: () => {
      const next = createExam(bank, Date.now(), exam?.optionOrders);
      setSeconds(3000);
      setExam(next);
    },
    answer,
    submit,
    navigate: (index) => setExam((current) => ({ ...current, index })),
  };
}
