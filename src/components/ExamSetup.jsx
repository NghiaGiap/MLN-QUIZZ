import {
  ArrowUpRight,
  Clock3,
  FileCheck2,
  ListChecks,
  Shuffle,
} from "lucide-react";

export default function ExamSetup({ onStart, questionCount, reviewCount }) {
  return (
    <section className="exam-setup">
      <div className="setup-copy">
        <span className="eyebrow">SẴN SÀNG THỬ SỨC?</span>
        <h2>
          Một đề thi mới.
          <br />
          Một bước tự tin hơn.
        </h2>
        <p>
          Dành một khoảng thời gian tập trung để biết mình đã nắm chắc đến đâu.
        </p>
        <div className="exam-specs">
          <div>
            <strong>60</strong>
            <span>câu ngẫu nhiên</span>
          </div>
          <div>
            <strong>
              50<span> phút</span>
            </strong>
            <span>thời gian làm bài</span>
          </div>
        </div>
        <button className="button primary start-exam" onClick={onStart}>
          Bắt đầu làm bài <ArrowUpRight size={20} />
        </button>
        <p className="setup-footnote">Đồng hồ bắt đầu ngay khi bạn nhấn nút.</p>
      </div>
      <div className="exam-rules">
        <span className="rules-label">CÁCH THỨC LÀM BÀI</span>
        <div>
          <Shuffle />
          <section>
            <h3>Mỗi lần là một đề khác</h3>
            <p>
              60 câu không trùng, chọn ngẫu nhiên từ {questionCount} câu hỏi.{" "}
              {reviewCount > 0 &&
                `${reviewCount} câu cần làm rõ vẫn có thể đọc ở phần ôn tập.`}
            </p>
          </section>
        </div>
        <div>
          <ListChecks />
          <section>
            <h3>Đọc kỹ, chọn đủ đáp án</h3>
            <p>
              Có câu chọn một hoặc nhiều đáp án. Bạn có thể quay lại sửa trước
              khi nộp.
            </p>
          </section>
        </div>
        <div>
          <Clock3 />
          <section>
            <h3>50 phút, tính liên tục</h3>
            <p>
              Bài tự nộp khi hết giờ. Tải lại trang vẫn giữ lựa chọn và thời
              gian còn lại.
            </p>
          </section>
        </div>
        <div>
          <FileCheck2 />
          <section>
            <h3>Biết điểm, hiểu lỗi sai</h3>
            <p>Xem điểm trên thang 10 và đáp án từng câu sau khi nộp bài.</p>
          </section>
        </div>
      </div>
    </section>
  );
}
