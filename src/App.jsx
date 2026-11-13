import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CheckCheck,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock3,
  FileText,
  Leaf,
  Search,
  ShieldCheck,
  Shuffle,
  Sparkles,
} from "lucide-react";
import bank from "./data/questions.json";
import {
  formatTime,
  isCorrect,
  shuffle,
  shuffleOptionKeys,
} from "./lib/quiz.js";
import useExam from "./useExam.js";
import QuestionCard from "./components/QuestionCard.jsx";
import QuestionNavigator from "./components/QuestionNavigator.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import ExamSetup from "./components/ExamSetup.jsx";
import ExamResult from "./components/ExamResult.jsx";

const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
const byId = Object.fromEntries(bank.map((q) => [q.id, q]));

export default function App() {
  const examState = useExam();
  const { exam, seconds, storageError } = examState;
  const [mode, setMode] = useState(() =>
    exam && exam.submittedAt === null ? "exam" : "study",
  );
  const [order, setOrder] = useState(() => bank.map((q) => q.id));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [optionOrders, setOptionOrders] = useState(() =>
    Object.fromEntries(bank.map((q) => [q.id, shuffleOptionKeys(q)])),
  );
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(
    () =>
      order
        .map((id) => byId[id])
        .filter(
          (q) =>
            !search.trim() ||
            (/^\d+$/.test(search.trim())
              ? q.id === search.trim()
              : normalize(
                  q.question + " " + q.options.map((o) => o.text).join(" "),
                ).includes(normalize(search.trim()))),
        ),
    [order, search],
  );
  const examQuestions = useMemo(
    () => exam?.ids.map((id) => byId[id]) ?? [],
    [exam?.ids],
  );
  const inExam = mode === "exam";
  const submitted = exam?.submittedAt !== null && !!exam;
  const questions = inExam ? examQuestions : filtered;
  const currentIndex = inExam
    ? (exam?.index ?? 0)
    : Math.min(index, Math.max(0, filtered.length - 1));
  const question = questions[currentIndex];
  const currentAnswers = inExam ? (exam?.answers ?? {}) : answers;
  const revealed = inExam ? submitted : !!checked[question?.id];
  const learned = Object.keys(checked).length;
  const learnedRight = bank.filter(
    (q) => checked[q.id] && isCorrect(q, answers[q.id]),
  ).length;
  const answeredCount = examQuestions.filter(
    (q) => exam?.answers[q.id]?.length,
  ).length;

  function navigate(next) {
    if (inExam) examState.navigate(next);
    else setIndex(next);
    document
      .getElementById("question-area")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function select(key) {
    if (revealed) return;
    const previous = currentAnswers[question.id] ?? [];
    const next =
      question.correct.length > 1
        ? previous.includes(key)
          ? previous.filter((k) => k !== key)
          : [...previous, key]
        : [key];
    if (inExam) examState.answer(question.id, next);
    else setAnswers((current) => ({ ...current, [question.id]: next }));
  }
  function startExam() {
    examState.start();
    setMode("exam");
    setNotice("");
  }
  function newExam() {
    setDialog({
      title: "Bắt đầu một đề thi mới?",
      description:
        "Kết quả hiện tại sẽ được thay bằng đề mới gồm 60 câu ngẫu nhiên trong 50 phút.",
      confirm: "Tạo đề mới",
      action: startExam,
    });
  }
  function submitExam() {
    setDialog({
      title: "Bạn muốn nộp bài?",
      description: `Bạn đã trả lời ${answeredCount}/60 câu. Còn ${60 - answeredCount} câu chưa trả lời. Sau khi nộp, bạn có thể xem điểm và đáp án nhưng không thể sửa bài.`,
      confirm: "Nộp bài",
      action: examState.submit,
    });
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Đến nội dung chính
      </a>
      <aside className="sidebar">
        <a
          href="#"
          className="brand"
          aria-label="Ôn — về ôn tập"
          onClick={(event) => {
            event.preventDefault();
            setMode("study");
          }}
        >
          <span className="brand-symbol">
            <BookOpen size={23} strokeWidth={1.5} />
          </span>
          <span>
            ôn<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="workspace-label">PHÒNG HỌC CỦA BẠN</div>
        <nav className="main-nav" aria-label="Chế độ học">
          <button
            className={mode === "study" ? "active" : ""}
            onClick={() => setMode("study")}
          >
            <BookOpen size={19} /> Ôn tập <ChevronRight size={15} />
          </button>
          <button
            className={inExam ? "active" : ""}
            onClick={() => setMode("exam")}
          >
            <ClipboardList size={19} /> Thi thử{" "}
            {exam && !submitted && <span className="live-dot" />}
          </button>
        </nav>
        <div className="course-block">
          <span className="workspace-label">TÀI LIỆU ĐANG HỌC</span>
          <div className="course-icon">
            <FileText size={20} />
          </div>
          <strong>MLN122</strong>
          <span>
            Kinh tế chính trị
            <br />
            Mác – Lênin
          </span>
          <div className="course-count">
            526 câu hỏi <span>·</span> 147 trang
          </div>
        </div>
        <div className="sidebar-bottom">
          <Leaf size={22} strokeWidth={1.5} />
          <p>
            Chậm một chút.
            <br />
            <strong>Hiểu sâu hơn.</strong>
          </p>
          <a href="/source.pdf" target="_blank" rel="noreferrer">
            Mở tài liệu gốc <ArrowUpRight size={14} />
          </a>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            Không gian ôn tập <ChevronRight size={14} />
            <strong>MLN122</strong>
          </div>
          <span className="local-status">
            <span className="live-dot" /> Học trên thiết bị của bạn
          </span>
        </header>
        <main id="main-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">KINH TẾ CHÍNH TRỊ MÁC – LÊNIN</span>
              <h1>
                {inExam ? "Thử sức trước kỳ thi." : "Học chắc, từng câu một."}
              </h1>
              <p>
                {inExam
                  ? "60 câu hỏi · 50 phút · Một bước chuẩn bị vững vàng hơn."
                  : "Không cần vội. Hiểu hôm nay, nhớ lâu hơn vào ngày mai."}
              </p>
            </div>
            <span className="course-badge">
              <span>HỌC PHẦN</span>
              <strong>MLN122</strong>
            </span>
          </div>
          {storageError && (
            <p className="storage-warning" role="alert">
              Trình duyệt không cho lưu bài. Hãy giữ trang này mở để tránh mất
              tiến độ thi.
            </p>
          )}
          {!inExam && (
            <>
              <section className="study-overview" aria-label="Thống kê ôn tập">
                <div>
                  <span className="stat-icon">
                    <BookOpen size={19} />
                  </span>
                  <div>
                    <span>Bộ câu hỏi</span>
                    <strong>
                      526 <small>câu</small>
                    </strong>
                  </div>
                </div>
                <div>
                  <span className="stat-icon">
                    <CheckCheck size={19} />
                  </span>
                  <div>
                    <span>Đã kiểm tra</span>
                    <strong>
                      {learned} <small>/ 526</small>
                    </strong>
                  </div>
                </div>
                <div>
                  <span className="stat-icon accent">
                    <Sparkles size={19} />
                  </span>
                  <div>
                    <span>Độ chính xác</span>
                    <strong>
                      {learned ? Math.round((learnedRight / learned) * 100) : 0}
                      <small>%</small>
                    </strong>
                  </div>
                </div>
                <p>
                  Mỗi câu đã hiểu
                  <br />
                  là một phần tự tin.
                </p>
              </section>
              <div className="study-toolbar">
                <div>
                  <h2>Góc ôn tập</h2>
                  <span>Chọn đáp án, kiểm tra và ghi nhớ.</span>
                </div>
                <div className="toolbar-controls">
                  <label className="search-box">
                    <Search size={17} />
                    <input
                      aria-label="Tìm câu hỏi hoặc số thứ tự"
                      placeholder="Tìm nội dung hoặc số câu…"
                      type="search"
                      value={search}
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setIndex(0);
                        setNotice("");
                      }}
                    />
                  </label>
                  <button
                    className="button secondary"
                    onClick={() => {
                      setOrder((current) => shuffle(current));
                      setIndex(0);
                      setNotice(
                        "Đã xáo thứ tự câu hỏi. Kết quả đã kiểm tra vẫn được giữ.",
                      );
                    }}
                  >
                    <Shuffle size={16} /> Xáo câu hỏi
                  </button>
                </div>
              </div>
              {notice && (
                <p className="notice" role="status">
                  {notice}
                </p>
              )}
            </>
          )}
          {inExam && !exam && <ExamSetup onStart={startExam} />}
          {inExam && exam && !submitted && (
            <div className="exam-bar">
              <div>
                <span className="live-dot" />
                <strong>Đang làm bài</strong>
                <span className="exam-progress">
                  {answeredCount}/60 câu đã trả lời
                </span>
              </div>
              <div>
                <span
                  className={`timer ${seconds <= 300 ? "urgent" : ""}`}
                  role="timer"
                  aria-label={`Thời gian còn lại ${formatTime(seconds)}`}
                >
                  <Clock3 size={19} />
                  {formatTime(seconds)}
                </span>
                <button className="button primary" onClick={submitExam}>
                  Nộp bài <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          )}
          {inExam && submitted && (
            <ExamResult
              exam={exam}
              questions={examQuestions}
              onRetry={newExam}
              onReview={() => {
                examState.navigate(
                  Math.max(
                    0,
                    examQuestions.findIndex(
                      (q) => !isCorrect(q, exam.answers[q.id]),
                    ),
                  ),
                );
                document
                  .getElementById("question-area")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          )}
          {!!questions.length && (!inExam || exam) && (
            <div className="learning-layout" id="question-area">
              <div>
                <QuestionCard
                  key={`${inExam}-${question.id}`}
                  question={question}
                  optionOrder={
                    inExam
                      ? exam.optionOrders?.[question.id]
                      : optionOrders[question.id]
                  }
                  index={currentIndex}
                  total={questions.length}
                  selected={currentAnswers[question.id] ?? []}
                  revealed={revealed}
                  onSelect={select}
                  onNavigate={navigate}
                  exam={inExam}
                  onCheck={() =>
                    setChecked((current) => ({
                      ...current,
                      [question.id]: true,
                    }))
                  }
                  onReset={() => {
                    setOptionOrders((current) => ({
                      ...current,
                      [question.id]: shuffleOptionKeys(
                        question,
                        current[question.id],
                      ),
                    }));
                    setChecked((current) => {
                      const next = { ...current };
                      delete next[question.id];
                      return next;
                    });
                    setAnswers((current) => ({
                      ...current,
                      [question.id]: [],
                    }));
                  }}
                />
                <div className="learning-tip">
                  <CircleHelp size={16} />
                  <p>
                    {inExam && !submitted
                      ? "Bài được tự động lưu trên trình duyệt này. Bạn có thể chuyển câu và thay đổi lựa chọn trước khi nộp."
                      : "Mẹo nhỏ: Thử giải thích vì sao đáp án đúng, thay vì chỉ ghi nhớ chữ cái."}
                  </p>
                </div>
              </div>
              <div className="right-column">
                <QuestionNavigator
                  questions={questions}
                  index={currentIndex}
                  answers={currentAnswers}
                  checked={checked}
                  onNavigate={navigate}
                  exam={inExam}
                  submitted={inExam && submitted}
                />
                {!inExam && (
                  <div className="exam-prompt">
                    <span className="eyebrow">ĐỔI NHỊP HỌC MỘT CHÚT</span>
                    <Clock3 size={26} strokeWidth={1.4} />
                    <h3>
                      Sẵn sàng cho
                      <br />
                      một bài thi thử?
                    </h3>
                    <p>
                      60 câu ngẫu nhiên, 50 phút
                      <br />
                      để thử sức chính mình.
                    </p>
                    <button onClick={() => setMode("exam")}>
                      Đến phần thi thử <ArrowUpRight size={17} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {!inExam && !questions.length && (
            <section className="empty-state">
              <Search size={28} />
              <h2>Chưa tìm thấy câu phù hợp</h2>
              <p>Thử từ khóa ngắn hơn hoặc nhập số câu từ 1 đến 526.</p>
              <button
                className="button secondary"
                onClick={() => setSearch("")}
              >
                Xem toàn bộ câu hỏi
              </button>
            </section>
          )}
          <footer className="page-footer">
            <span>
              Ôn. <span className="footer-divider">/</span> Một khoảng tập trung
              cho bạn.
            </span>
            <span>
              <ShieldCheck size={14} /> Nội dung & đáp án theo PDF gốc
            </span>
          </footer>
        </main>
      </div>
      <ConfirmDialog dialog={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}
