import { ChevronLeft, ChevronRight, Grid2X2 } from "lucide-react";
import { isCorrect } from "../lib/quiz.js";

export default function QuestionNavigator({
  questions,
  index,
  answers,
  checked,
  onNavigate,
  exam,
  submitted,
}) {
  const pageSize = exam ? 60 : 40;
  const start = Math.floor(index / pageSize) * pageSize;
  const completed = questions.filter((q) =>
    exam ? answers[q.id]?.length : checked[q.id],
  ).length;
  return (
    <aside className="navigator">
      <div className="panel-heading">
        <h2>
          <Grid2X2 size={16} /> {exam ? "Bản đồ bài thi" : "Tiến độ ôn tập"}
        </h2>
        <span>
          {completed}/{questions.length}
        </span>
      </div>
      <div className="progress-track">
        <div style={{ width: `${(completed / questions.length) * 100}%` }} />
      </div>
      <p className="panel-description">
        {exam
          ? `${completed} câu đã trả lời`
          : "Từng câu một, tiến gần mục tiêu."}
      </p>
      <div className="question-grid">
        {questions.slice(start, start + pageSize).map((q, offset) => {
          const position = start + offset;
          const revealed = submitted || (!exam && checked[q.id]);
          const state = revealed
            ? q.examEligible === false
              ? "review"
              : isCorrect(q, answers[q.id])
                ? "right"
                : answers[q.id]?.length
                  ? "wrong"
                  : ""
            : answers[q.id]?.length
              ? "answered"
              : "";
          const label = revealed
            ? q.examEligible === false
              ? "cần làm rõ"
              : isCorrect(q, answers[q.id])
                ? "đúng"
                : answers[q.id]?.length
                  ? "sai"
                  : "chưa trả lời"
            : answers[q.id]?.length
              ? "đã chọn"
              : "chưa trả lời";
          return (
            <button
              key={q.id}
              className={`grid-number ${state} ${position === index ? "current" : ""}`}
              aria-label={`Đến câu ${position + 1}, ${label}`}
              aria-current={position === index ? "step" : undefined}
              onClick={() => onNavigate(position)}
            >
              {position + 1}
            </button>
          );
        })}
      </div>
      {!exam && questions.length > pageSize && (
        <div className="grid-pagination">
          <button
            aria-label="Nhóm câu trước"
            disabled={start === 0}
            onClick={() => onNavigate(start - pageSize)}
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            {start + 1}–{Math.min(start + pageSize, questions.length)} /{" "}
            {questions.length}
          </span>
          <button
            aria-label="Nhóm câu tiếp"
            disabled={start + pageSize >= questions.length}
            onClick={() => onNavigate(start + pageSize)}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
      <div className="grid-legend">
        <span>
          <i className="legend-current" />
          Đang xem
        </span>
        <span>
          <i className="legend-answer" />
          Đã chọn
        </span>
        {(!exam || submitted) && (
          <>
            <span>
              <i className="legend-right" />
              Đúng
            </span>
            <span>
              <i className="legend-wrong" />
              Sai
            </span>
          </>
        )}
      </div>
    </aside>
  );
}
