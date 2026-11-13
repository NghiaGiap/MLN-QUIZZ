import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  RotateCcw,
  X,
  ExternalLink,
} from "lucide-react";
import { isCorrect } from "../lib/quiz.js";

export default function QuestionCard({
  question,
  index,
  total,
  selected,
  revealed,
  onSelect,
  onCheck,
  onReset,
  onNavigate,
  exam = false,
}) {
  const multiple = question.correct.length > 1;
  const correct = isCorrect(question, selected);
  return (
    <section className="question-card" aria-label="Nội dung câu hỏi">
      <div className="question-meta">
        <span className="eyebrow">
          {exam ? (revealed ? "XEM LẠI BÀI THI" : "ĐỀ THI THỬ") : "LUYỆN TẬP"}{" "}
          <span className="meta-separator">/</span> CÂU{" "}
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="tag">{multiple ? "Nhiều đáp án" : "Một đáp án"}</span>
      </div>
      <fieldset className="question-fieldset" disabled={revealed}>
        <legend>
          <span className="question-title">{question.question}</span>
        </legend>
        <p className="choice-hint">
          {multiple
            ? "Chọn tất cả phương án bạn cho là đúng."
            : "Chọn một phương án bạn cho là đúng."}
        </p>
        <div className="options">
          {question.options.map((option) => {
            const chosen = selected.includes(option.key);
            const right = revealed && question.correct.includes(option.key);
            const wrong = revealed && chosen && !right;
            return (
              <label
                key={option.key}
                className={`option ${chosen ? "selected" : ""} ${right ? "correct" : ""} ${wrong ? "incorrect" : ""}`}
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name={`question-${question.id}`}
                  value={option.key}
                  checked={chosen}
                  onChange={() => onSelect(option.key)}
                />
                <span className="option-letter">{option.key}</span>
                <span className="option-copy">{option.text}</span>
                <span className="option-indicator" aria-hidden="true">
                  {right ? (
                    <Check size={17} />
                  ) : wrong ? (
                    <X size={17} />
                  ) : chosen ? (
                    <span className="selection-dot" />
                  ) : null}
                </span>
                {right && <span className="sr-only">Đáp án đúng</span>}
                {wrong && <span className="sr-only">Bạn đã chọn sai</span>}
              </label>
            );
          })}
        </div>
      </fieldset>
      {revealed && (
        <div
          className={`answer-feedback ${correct ? "positive" : "negative"}`}
          role="status"
        >
          {correct ? <CheckCheck size={22} /> : <X size={22} />}
          <div>
            <strong>
              {correct
                ? "Chính xác. Bạn đã nắm được câu này!"
                : selected.length
                  ? "Chưa chính xác. Cùng ghi nhớ lại nhé."
                  : "Bạn chưa trả lời câu này."}
            </strong>
            <p>
              Đáp án theo tài liệu: <b>{question.correct.join(", ")}</b>
              {question.note ? ` · Ghi chú: ${question.note}` : ""}
            </p>
          </div>
        </div>
      )}
      <div className="question-actions">
        <button
          className="button secondary"
          disabled={index === 0}
          onClick={() => onNavigate(index - 1)}
        >
          <ArrowLeft size={16} /> Câu trước
        </button>
        <div className="right-actions">
          {!exam &&
            (revealed ? (
              <button className="button quiet" onClick={onReset}>
                <RotateCcw size={15} /> Làm lại
              </button>
            ) : (
              <button
                className="button primary"
                disabled={!selected.length}
                onClick={onCheck}
              >
                <CheckCheck size={17} /> Kiểm tra đáp án
              </button>
            ))}
          <button
            className={`button ${exam || revealed ? "primary" : "secondary"}`}
            disabled={index === total - 1}
            onClick={() => onNavigate(index + 1)}
          >
            <span>Câu tiếp</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      <div className="source-line">
        <span>
          Câu gốc #{question.id} <span>·</span> MLN122 — NHUNG HOÀNG
        </span>
        {(!exam || revealed) && (
          <a
            href={`/source.pdf#page=${question.page}`}
            target="_blank"
            rel="noreferrer"
          >
            PDF trang {question.page} <ExternalLink size={12} />
          </a>
        )}
      </div>
    </section>
  );
}
