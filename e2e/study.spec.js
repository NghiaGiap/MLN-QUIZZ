import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const bank = JSON.parse(
  readFileSync(new URL("../src/data/questions.json", import.meta.url)),
);
const storageKey = "mln122-exam-v2";

test("practice checks wrong/right choices, keeps feedback on navigation, and shuffles", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Kiểm tra đáp án", exact: true }),
  ).toBeDisabled();
  const initialOrder = await page.locator(".option-copy").allTextContents();
  expect(await page.locator(".option-letter").allTextContents()).toEqual([
    "A",
    "B",
    "C",
    "D",
  ]);
  await page.locator('.question-card input[value="A"]').check();
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Chưa chính xác");
  await expect(page.getByRole("status")).toContainText("Đáp án đúng:");
  await page.getByRole("button", { name: "Làm lại", exact: true }).click();
  const retryOrder = await page.locator(".option-copy").allTextContents();
  expect(retryOrder).not.toEqual(initialOrder);
  expect(await page.locator(".option-letter").allTextContents()).toEqual([
    "A",
    "B",
    "C",
    "D",
  ]);
  const rightOption = page
    .locator(".option")
    .filter({ has: page.locator('input[value="D"]') });
  const rightLabel = await rightOption.locator(".option-letter").innerText();
  await page.locator('.question-card input[value="D"]').check();
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Chính xác.");
  await expect(page.getByRole("status")).toContainText(
    `Đáp án đúng: ${rightLabel}`,
  );
  await page.getByRole("button", { name: "Câu tiếp", exact: true }).click();
  await page.getByRole("button", { name: "Câu trước", exact: true }).click();
  await expect(page.locator('.question-card input[value="D"]')).toBeChecked();
  expect(await page.locator(".option-copy").allTextContents()).toEqual(
    retryOrder,
  );
  await page.getByRole("button", { name: "Xáo câu hỏi", exact: true }).click();
  await expect(
    page.getByText("Đã xáo thứ tự câu hỏi.", { exact: false }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("restore original question order clears search and preserves checked answers", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
  });
  await page.goto("/");
  const restore = page.getByRole("button", {
    name: "Về thứ tự ban đầu",
    exact: true,
  });
  await expect(restore).toHaveCount(0);
  const initialChoices = await page.locator(".option-copy").allTextContents();
  await page.locator('.question-card input[value="D"]').check();
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await page.getByRole("button", { name: "Xáo câu hỏi", exact: true }).click();
  await expect(page.locator(".question-title")).not.toHaveText(
    bank[0].question,
  );
  await expect(restore).toBeVisible();
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.getByRole("searchbox").fill("526");
  await restore.click();
  await expect(page.getByRole("searchbox")).toHaveValue("");
  await expect(restore).toHaveCount(0);
  await expect(page.locator(".question-title")).toHaveText(bank[0].question);
  await expect(page.locator(".answer-feedback")).toContainText("Chính xác.");
  await expect(page.locator('.question-card input[value="D"]')).toBeChecked();
  expect(await page.locator(".option-copy").allTextContents()).toEqual(
    initialChoices,
  );
  await page.getByRole("button", { name: "Câu tiếp", exact: true }).click();
  await expect(page.locator(".question-title")).toHaveText(bank[1].question);
});

test("search finds source IDs, multiple answers require the full set, and empty state recovers", async ({
  page,
}) => {
  await page.goto("/");
  const multi = bank.find((q) => q.correct.length > 1);
  const search = page.getByRole("searchbox");
  await search.fill(multi.id);
  await expect(page.locator(".question-title")).toHaveText(multi.question);
  await page
    .locator(`.question-card input[value="${multi.correct[0]}"]`)
    .check();
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Chưa chính xác");
  await page.getByRole("button", { name: "Làm lại", exact: true }).click();
  for (const key of multi.correct)
    await page.locator(`.question-card input[value="${key}"]`).check();
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("Chính xác.");
  await search.fill(bank.at(-1).id);
  await expect(page.locator(".question-title")).toHaveText(
    bank.at(-1).question,
  );
  await search.fill("khong-co-cau-hoi-xyz");
  await expect(
    page.getByRole("heading", { name: "Chưa tìm thấy câu phù hợp" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Xem toàn bộ câu hỏi" }).click();
  await expect(page.locator(".question-title")).toHaveText(bank[0].question);
});

test("exam samples 60 unique questions, persists choices/index/deadline, and grades on submit", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Thi thử", exact: true }).click();
  await page
    .getByRole("button", { name: "Bắt đầu làm bài", exact: true })
    .click();
  await expect(page.getByRole("timer")).toContainText(/(50:00|49:5\d)/);
  await expect(page.locator(".question-grid button")).toHaveCount(60);
  await expect(page.locator(".answer-feedback")).toHaveCount(0);
  await expect(page.locator(".explanation")).toHaveCount(0);
  const initial = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    storageKey,
  );
  expect(new Set(initial.ids).size).toBe(60);
  expect(initial.endsAt - initial.startedAt).toBe(3_000_000);
  const first = bank.find((q) => q.id === initial.ids[0]);
  for (const key of first.correct)
    await page.locator(`.question-card input[value="${key}"]`).check();
  await page.getByRole("button", { name: "Câu tiếp", exact: true }).click();
  await page.reload();
  await expect(page.locator(".question-title")).toHaveText(
    bank.find((q) => q.id === initial.ids[1]).question,
  );
  const restored = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    storageKey,
  );
  expect(restored.endsAt).toBe(initial.endsAt);
  expect(restored.ids).toEqual(initial.ids);
  expect(restored.optionOrders).toEqual(initial.optionOrders);
  expect(restored.answers[first.id].sort()).toEqual(first.correct.toSorted());
  await page.getByRole("button", { name: "Nộp bài", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Còn 59 câu chưa trả lời",
  );
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Nộp bài", exact: true })
    .click();
  await expect(
    page.getByRole("region", { name: "Kết quả bài thi" }),
  ).toContainText("0.17");
  await expect(page.locator(".result-stats")).toContainText("59");
  await expect(
    page.getByRole("region", { name: "Giải thích đáp án" }),
  ).toContainText(bank.find((q) => q.id === initial.ids[1]).explanation);
  await expect(page.locator(".question-card input").first()).toBeDisabled();
  await page.getByRole("button", { name: "Làm đề mới" }).click();
  await page.getByRole("button", { name: "Tạo đề mới", exact: true }).click();
  await expect(page.getByRole("timer")).toContainText(/(50:00|49:5\d)/);
  const next = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    storageKey,
  );
  expect(next.answers).toEqual({});
  expect(next.ids).not.toEqual(initial.ids);
});

test("timer auto-submits at 50 minutes and an expired saved exam cannot restart on reload", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page.getByRole("button", { name: "Thi thử", exact: true }).click();
  await page
    .getByRole("button", { name: "Bắt đầu làm bài", exact: true })
    .click();
  await page.getByRole("button", { name: "Ôn tập", exact: true }).click();
  await page.clock.fastForward(50 * 60 * 1000);
  await page.getByRole("button", { name: "Thi thử", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Hết giờ. Bài đã được nộp." }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Kết quả bài thi" }),
  ).toContainText("0.00");
  await expect(page.getByRole("timer")).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: "Thi thử", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Hết giờ. Bài đã được nộp." }),
  ).toBeVisible();
  await expect(page.locator(".question-card input").first()).toBeDisabled();
});

test("expired unsent saved exam is graded immediately when reopened; invalid storage is ignored", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Thi thử", exact: true }).click();
  await page
    .getByRole("button", { name: "Bắt đầu làm bài", exact: true })
    .click();
  await page.evaluate((key) => {
    const exam = JSON.parse(localStorage.getItem(key));
    exam.startedAt = Date.now() - 3_001_000;
    exam.endsAt = exam.startedAt + 3_000_000;
    localStorage.setItem(key, JSON.stringify(exam));
  }, storageKey);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Hết giờ. Bài đã được nộp." }),
  ).toBeVisible();
  await page.evaluate(
    (key) => localStorage.setItem(key, "{broken"),
    storageKey,
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Học chắc, từng câu một." }),
  ).toBeVisible();
});

test("layouts fit 320, 390, 768, 1024 and 1440px, and keyboard can reach choices", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".question-title")).toBeVisible();
  }
  await page.getByRole("radio", { name: /^A / }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("radio", { name: /^B / })).toBeChecked();
  await expect(page.locator('a[href*=".pdf"]')).toHaveCount(0);
});

test("standalone alternate questions reveal explanations without PDF references", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".explanation")).toHaveCount(0);
  const alternate = bank.find((q) => q.variantOf === "2");
  await page.getByRole("searchbox").fill(alternate.id);
  await expect(page.locator(".question-title")).toHaveText(alternate.question);
  await page.locator('.question-card input[value="D"]').check();
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await expect(page.locator(".answer-feedback")).toContainText("Chính xác.");
  await expect(
    page.getByRole("region", { name: "Giải thích đáp án" }),
  ).toContainText(alternate.explanation);
  await expect(page.locator("body")).not.toContainText("Đáp án trong PDF");
  await expect(page.locator("body")).not.toContainText("Kiểu hỏi khác");
  await expect(page.locator('a[href*=".pdf"]')).toHaveCount(0);
});

test("unclear cards show a review note without falsely marking choices right or wrong", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("52");
  await expect(page.locator(".review-warning")).toBeVisible();
  await page.locator('.question-card input[value="C"]').check();
  await page
    .getByRole("button", { name: "Kiểm tra đáp án", exact: true })
    .click();
  await expect(page.locator(".answer-feedback")).toContainText("cần làm rõ");
  await expect(page.locator(".option.correct, .option.incorrect")).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("region", { name: "Thống kê ôn tập" }),
  ).toContainText("0%");
  await expect(
    page.getByRole("region", { name: "Giải thích đáp án" }),
  ).toBeVisible();
});
