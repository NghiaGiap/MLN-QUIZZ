# Ôn. — Phòng học MLN122

Web React thuần frontend với **555 câu có giải thích**, gồm 526 câu ban đầu và 29 câu độc lập tách từ ghi chú. Dự án hiện nằm trong thư mục **MLN122**. Web chạy bằng dữ liệu JSON đã biên soạn; không cần đọc PDF, gọi AI hay kết nối dịch vụ bên ngoài khi sử dụng.

## Chạy trên Windows

Máy đã có sẵn dependencies. Mở terminal và chạy:

```powershell
Set-Location 'D:\FPT_University_Study\FPT_FALL2026\MLN122'
npm.cmd run dev
```

Mở địa chỉ Local được in ra, thường là **http://127.0.0.1:5173**. Hoặc nhấp đúp **CHAY_WEB.bat** để khởi động và mở trình duyệt. Giữ cửa sổ terminal mở trong lúc dùng; Ctrl+C để dừng.

Nếu chuyển dự án sang máy khác, cài Node.js 22.12 trở lên và chạy `npm.cmd ci` trước. Đã kiểm tra bằng Node.js 24.15.0.

## Cách sử dụng

- **Ôn tập:** chọn một hoặc nhiều phương án rồi nhấn **Kiểm tra đáp án**. Web hiển thị đáp án theo nhãn hiện tại và đoạn **Vì sao đáp án này đúng?**. **Làm lại** xóa lựa chọn của câu đó và xáo lại nội dung đáp án; nhãn luôn theo A, B, C, D (hoặc E).
- **Điều hướng:** dùng Câu trước/Câu tiếp, bản đồ câu hỏi hoặc tìm kiếm. Nhập số từ 1 đến 555 để đến câu tương ứng; cũng có thể tìm bằng từ khóa không dấu. Các câu 527–555 là những câu độc lập tách từ ghi chú, có lựa chọn và đáp án riêng.
- **Xáo câu hỏi:** đổi thứ tự ôn tập, vẫn giữ lựa chọn, thứ tự đáp án và kết quả trong phiên hiện tại. Phiên ôn tập mới xáo đáp án của toàn bộ câu hỏi.
- **Về thứ tự ban đầu:** xuất hiện cạnh nút xáo khi thứ tự câu đã thay đổi. Khôi phục thứ tự bộ câu hỏi, xóa từ khóa và về câu 1; vẫn giữ lựa chọn, kết quả và thứ tự đáp án của từng câu.
- **Thi thử:** tạo đề gồm 60 câu ngẫu nhiên không trùng từ **540 câu đủ dữ kiện**, làm trong 50 phút. Mỗi đề mới xáo nội dung đáp án, giữ nhãn A–B–C–D–E. Quay lại câu hoặc tải lại trang giữ nguyên thứ tự, lựa chọn và hạn giờ. Đáp án và giải thích chỉ hiện sau khi nộp hoặc hết giờ.
- **Nộp bài:** hiển thị xác nhận, điểm thang 10, số câu đúng/sai/chưa trả lời và đáp án từng câu. Mỗi câu đúng có trọng số bằng nhau; câu nhiều đáp án chỉ đúng khi chọn đủ và không chọn thừa.
- **Hết giờ:** tự động nộp, kể cả khi đang ở chế độ ôn tập. Khi quay lại tab hoặc tải lại trang, thời gian được tính từ thời điểm hết hạn cố định.
- **Khôi phục:** bài thi, lựa chọn, vị trí câu và kết quả được lưu trong localStorage trên cùng trình duyệt và địa chỉ truy cập. Đề mới thay bài trước. Tiến độ ôn tập tồn tại trong phiên trang hiện tại.

Không cần tài khoản, API key, cơ sở dữ liệu hoặc backend ứng dụng. Dữ liệu không gửi đến dịch vụ bên ngoài. Nên làm bài trong một tab; đổi trình duyệt, xóa dữ liệu trình duyệt hoặc đổi cổng/địa chỉ sẽ dùng vùng lưu khác. Nếu trình duyệt chặn lưu, web hiện cảnh báo.

Chấm điểm dựa trên định danh lựa chọn, không dựa vào chữ cái hiển thị sau xáo. Cụm “phương án trên”/“đáp án trên” được hiển thị thành “phương án còn lại”/“đáp án còn lại” khi đã xáo. Không còn chữ cái đáp án PDF hoặc liên kết mở PDF trong giao diện.

**15 câu cần làm rõ** vẫn có thể đọc và xem giải thích ở phần ôn tập, nhưng không bị tô đúng/sai chắc chắn, không đưa vào thi thử và không tính vào tỷ lệ chính xác. Xem danh sách và lý do trong `data/content-report.json`.

Bản này hiệu chỉnh nội dung và một số đáp án nên dùng vùng lưu bài thi **v2** để tránh chấm lại bài cũ bằng đáp án mới. Dữ liệu bài v1 vẫn nằm nguyên trong trình duyệt nhưng không được nạp vào bộ câu đã sửa.

## Nội dung và biên tập

`src/data/questions.json` là bộ độc lập dùng trong web, mỗi câu có lựa chọn, đáp án, giải thích và trạng thái đủ dữ kiện. Không có ghi chú “Kiểu hỏi khác” hay số trang PDF cần xử lý lúc chạy.

Phần giải thích được biên soạn theo nội dung từng câu, có phân biệt công thức, giả định và điểm dễ nhầm. Các biến thể được tách thành 29 câu với đáp án độc lập, không sao chép máy móc chữ cái từ câu cha. Đã ghi nhận 63 mục hiệu chỉnh câu chữ, dữ kiện hoặc lựa chọn, trong đó 12 mục thay khóa đáp án. Các nội dung chưa đủ chắc chắn được đánh dấu để tránh học nhầm.

Tài liệu tham khảo và phạm vi đối chiếu nằm trong [CONTENT_REVIEW.md](CONTENT_REVIEW.md). Giải thích là nội dung hỗ trợ ôn tập, không thay thế yêu cầu của giảng viên hoặc một vòng thẩm định học thuật độc lập.

Tạo lại bộ dữ liệu đã biên soạn từ JSON, không cần PDF:

```powershell
npm.cmd run data:build
npm.cmd test
```

Lệnh biên tập dữ liệu cần Python 3.10 trở lên; chạy web thông thường chỉ cần Node.js. Bộ câu hỏi đã được tạo sẵn và lưu trong dự án.

## Kiểm thử và build

```powershell
npm.cmd test
npm.cmd run test:e2e
npm.cmd run build
npm.cmd run preview
```

- Node test runner: 15 kiểm tra dữ liệu, giải thích, tách biến thể, lọc câu chưa rõ, lấy mẫu, xáo đáp án, chấm điểm, thời gian và khôi phục.
- Playwright: 9 luồng trình duyệt với Microsoft Edge, gồm ôn tập, tìm kiếm, phục hồi thứ tự, thi/nộp/tạo đề mới, tải lại, hết giờ, giải thích, câu chưa rõ và responsive 320/390/768/1024/1440px. Cần cài Microsoft Edge; đổi `channel` trong `playwright.config.js` nếu dùng Chromium khác.
- `dist/` là bản tĩnh sau build. Dùng `npm.cmd run preview` để xem; không mở bằng cách nhấp đúp `dist/index.html`.
- Định dạng code: `npx prettier --write src tests e2e *.js package.json`.

## Cấu trúc

```text
src/App.jsx               Điều phối chế độ học và thi
src/useExam.js            Lưu bài, đồng hồ, khóa bài và tự nộp
src/components/           Câu hỏi, bản đồ, thiết lập thi, kết quả, hộp xác nhận
src/lib/quiz.js           Nghiệp vụ xáo câu, tạo đề, chấm và khôi phục
src/data/questions.json   555 câu có giải thích, dùng trực tiếp khi chạy
src/styles.css            Giao diện responsive
data/explanations/        Giải thích biên soạn cho 526 câu ban đầu
data/alternate-questions.json  29 câu tách riêng
data/editorial-updates.json   Nội dung hiệu chỉnh và lý do
data/content-report.json      Tổng hợp biên tập và câu cần làm rõ
data/original-questions.json  Lưu trữ bộ câu ban đầu, không nhập trong web
data/reference/           Bản gốc lưu ngoài public để đối chiếu biên tập
scripts/                  Công cụ biên tập; không cần để chạy web
tests/                    Kiểm thử logic và dữ liệu
e2e/                      Kiểm thử trình duyệt
```

Tài liệu nền tảng: [React useEffect](https://react.dev/reference/react/useEffect), [Vite](https://vite.dev/guide/).
