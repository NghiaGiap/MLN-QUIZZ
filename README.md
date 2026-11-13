# Ôn. — Phòng học MLN122

Web React thuần frontend dùng **526 câu hỏi và đáp án** trong PDF “Thẻ ghi nhớ_ MLN122 - CHUẨN NHUNG HOÀNG _ Quizlet.pdf”. Dự án được đặt trong thư mục **MLN111** theo yêu cầu; tên học phần trên giao diện là **MLN122** theo tài liệu nguồn.

## Chạy trên Windows

Máy đã có sẵn dependencies. Mở terminal và chạy:

```powershell
Set-Location 'D:\FPT_University_Study\FPT_FALL2026\MLN111'
npm.cmd run dev
```

Mở địa chỉ Local được in ra, thường là **http://127.0.0.1:5173**. Hoặc nhấp đúp **CHAY_WEB.bat** để khởi động và mở trình duyệt. Giữ cửa sổ terminal mở trong lúc dùng; Ctrl+C để dừng.

Nếu chuyển dự án sang máy khác, cài Node.js 22.12 trở lên và chạy `npm.cmd ci` trước. Đã kiểm tra bằng Node.js 24.15.0.

## Cách sử dụng

- **Ôn tập:** chọn một hoặc nhiều phương án rồi nhấn **Kiểm tra đáp án**. Đáp án đúng và ghi chú nguồn xuất hiện sau khi kiểm tra. **Làm lại** để trả lời lại câu đó.
- **Điều hướng:** dùng Câu trước/Câu tiếp, bản đồ câu hỏi hoặc tìm kiếm. Nhập một số từ 1 đến 526 để đến câu gốc tương ứng; cũng có thể tìm bằng từ khóa không dấu.
- **Xáo câu hỏi:** đổi thứ tự ôn tập, vẫn giữ lựa chọn và kết quả trong phiên hiện tại. Thứ tự các phương án không đổi.
- **Thi thử:** tạo đề gồm 60 câu ngẫu nhiên không trùng, làm trong 50 phút. Bản đồ hiển thị câu đã chọn; có thể sửa lựa chọn trước khi nộp. Không công bố đáp án hoặc liên kết PDF trong vùng câu hỏi trước khi nộp.
- **Nộp bài:** hiển thị xác nhận, điểm thang 10, số câu đúng/sai/chưa trả lời và đáp án từng câu. Mỗi câu đúng có trọng số bằng nhau; câu nhiều đáp án chỉ đúng khi chọn đủ và không chọn thừa.
- **Hết giờ:** tự động nộp, kể cả khi đang ở chế độ ôn tập. Khi quay lại tab hoặc tải lại trang, thời gian được tính từ thời điểm hết hạn cố định.
- **Khôi phục:** bài thi, lựa chọn, vị trí câu và kết quả được lưu trong localStorage trên cùng trình duyệt và địa chỉ truy cập. Đề mới thay bài trước. Tiến độ ôn tập tồn tại trong phiên trang hiện tại.

Không cần tài khoản, API key, cơ sở dữ liệu hoặc backend ứng dụng. Dữ liệu không gửi đến dịch vụ bên ngoài. Nên làm bài trong một tab; đổi trình duyệt, xóa dữ liệu trình duyệt hoặc đổi cổng/địa chỉ sẽ dùng vùng lưu khác. Nếu trình duyệt chặn lưu, web hiện cảnh báo.

## Nội dung nguồn

PDF gốc được sao chép nguyên vẹn tại `public/source.pdf`. Mỗi câu có số thứ tự gốc và số trang PDF để đối chiếu. `src/data/questions.json` là dữ liệu dùng trong web; `data/extracted-raw.json` giữ hai cột văn bản trước khi chuẩn hóa.

Đã trích đủ 526 thẻ, gồm 25 câu nhiều đáp án, 36 câu có ghi chú; có câu chỉ có 3 phương án và có câu có 5 phương án đúng như PDF. Chỉ chuẩn hóa xuống dòng, ký tự ẩn và bỏ nhãn “(NHUNG HOÀNG)” lặp lại trong câu; chữ cái đáp án được viết hoa. Không tự tạo câu hỏi, phương án hoặc sửa kiến thức.

**Lưu ý:** một số câu gốc có lỗi viết hoặc nội dung chưa rõ. Ví dụ câu 139 thiếu phần kết của câu hỏi và có ghi chú giải thích trong PDF; câu 270 có phương án kết thúc giữa câu ngay trong nguồn. Ứng dụng giữ theo nguồn, không xác nhận tính đúng đắn học thuật của toàn bộ bộ đề. Có thể mở PDF để đối chiếu.

Trích lại dữ liệu (chỉ cần khi thay dữ liệu nguồn):

```powershell
python -m pip install -r scripts/requirements.txt
python scripts/extract_questions.py public/source.pdf
npm.cmd test
```

## Kiểm thử và build

```powershell
npm.cmd test
npm.cmd run test:e2e
npm.cmd run build
npm.cmd run preview
```

- Node test runner: kiểm tra 526 câu, lựa chọn/đáp án hợp lệ, lấy mẫu, chấm một/nhiều đáp án, thời gian và dữ liệu khôi phục.
- Playwright: 6 luồng trình duyệt với Microsoft Edge, gồm ôn tập, tìm kiếm, thi/nộp/tạo đề mới, tải lại trang, hết giờ và responsive 320/390/768/1024/1440px. Cần cài Microsoft Edge; đổi `channel` trong `playwright.config.js` nếu dùng Chromium khác.
- `dist/` là bản tĩnh sau build. Dùng `npm.cmd run preview` để xem; không mở bằng cách nhấp đúp `dist/index.html`.
- Định dạng code: `npx prettier --write src tests e2e *.js package.json`.

## Cấu trúc

```text
src/App.jsx               Điều phối chế độ học và thi
src/useExam.js            Lưu bài, đồng hồ, khóa bài và tự nộp
src/components/           Câu hỏi, bản đồ, thiết lập thi, kết quả, hộp xác nhận
src/lib/quiz.js           Nghiệp vụ xáo câu, tạo đề, chấm và khôi phục
src/data/questions.json   526 câu đã trích từ PDF
src/styles.css            Giao diện responsive
public/source.pdf         Bản sao nguyên vẹn tài liệu nguồn
scripts/                  Công cụ trích xuất; không cần để chạy web
tests/                    Kiểm thử logic và dữ liệu
e2e/                      Kiểm thử trình duyệt
```

Tài liệu nền tảng: [React useEffect](https://react.dev/reference/react/useEffect), [Vite](https://vite.dev/guide/).
