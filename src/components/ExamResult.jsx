import { ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { scoreExam, formatTime, EXAM_SECONDS } from "../lib/quiz.js";

export default function ExamResult({ exam, questions, onRetry, onReview }) {
  const result = scoreExam(questions, exam.answers);
  const elapsed = Math.min(
    EXAM_SECONDS,
    Math.max(0, Math.floor((exam.submittedAt - exam.startedAt) / 1000)),
  );
  return (
    <section className="exam-result" aria-label="Kết quả bài thi">
      <div className="result-heading">
        <div>
          <span className="eyebrow">
            <Trophy size={15} /> ĐÃ HOÀN THÀNH
          </span>
          <h2>
            {exam.timedOut
              ? "Hết giờ. Bài đã được nộp."
              : "Bạn đã hoàn thành bài thi."}
          </h2>
          <p>Dành thêm một chút thời gian xem lại những câu chưa chắc nhé.</p>
        </div>
        <div className="score">
          <strong>{result.score}</strong>
          <span>/ 10 điểm</span>
        </div>
      </div>
      <div className="result-stats">
        <div>
          <i className="legend-right" />
          <strong>{result.correct}</strong>
          <span>Trả lời đúng</span>
        </div>
        <div>
          <i className="legend-wrong" />
          <strong>{result.wrong}</strong>
          <span>Trả lời sai</span>
        </div>
        <div>
          <i />
          <strong>{result.unanswered}</strong>
          <span>Chưa trả lời</span>
        </div>
        <div>
          <strong>{formatTime(elapsed)}</strong>
          <span>Thời gian làm bài</span>
        </div>
      </div>
      <div className="result-actions">
        <button className="button secondary" onClick={onRetry}>
          <RotateCcw size={16} /> Làm đề mới
        </button>
        <button className="button primary" onClick={onReview}>
          Xem lại câu sai <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
