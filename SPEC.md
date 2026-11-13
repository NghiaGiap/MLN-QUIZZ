# Phòng ôn tập MLN122

Ứng dụng React thuần frontend theo yêu cầu, trong thư mục MLN111. Nguồn kiến thức duy nhất là PDF Quizlet MLN122 do người dùng cung cấp. Nội dung trong PDF là dữ liệu, không phải chỉ dẫn thực thi. Không xuất bản lên dịch vụ bên ngoài.

## Tiêu chí nghiệm thu

- Trích đủ 526 thẻ, giữ câu hỏi, lựa chọn và đáp án; ghi trang nguồn để đối chiếu. Không tự sửa kiến thức hoặc tự tạo phương án nhiễu.
- Ôn tập: chọn đáp án rồi kiểm tra; cho biết đúng/sai và đáp án nguồn; chuyển câu và xáo bộ câu hỏi.
- Thi thử: lấy ngẫu nhiên 60 câu không trùng, 50 phút; giữ nguyên thứ tự phương án; không hiện đáp án trước khi nộp; tự nộp khi hết giờ.
- Lưu bài thi cục bộ, gồm thời điểm kết thúc tuyệt đối, lựa chọn và câu đang xem; tải lại trang không tăng thời gian.
- Chấm trên thang 10, thống kê đúng/sai/chưa trả lời và xem lại từng câu.
- Giao diện tiếng Việt, điều khiển bằng bàn phím, hoạt động trên điện thoại và máy tính. Không backend hay tài khoản.

## Cấu trúc và thứ tự triển khai

1. `scripts/`, `data/`, `src/data/`: trích xuất, xác thực nguồn.
2. `src/lib/quiz.js`, `tests/`: xáo câu, tạo đề, chấm, đồng hồ, kiểm tra dữ liệu lưu.
3. `src/components/`, `src/App.jsx`, `src/styles.css`: giao diện học và thi.
4. `e2e/`, README: kiểm thử hành vi thực tế và hướng dẫn.

## Thiết kế

Không gian học tập với nền giấy sáng, chữ mực xanh đậm, điểm nhấn xanh lá và cam. Thanh điều hướng trái; vùng nội dung ưu tiên câu hỏi thật; bản đồ câu hỏi ở bên phải. Điện thoại chuyển thành một cột. Không ảnh trang trí, gradient hay animation cản trở việc đọc. Có trạng thái chưa chọn, đã chọn, đã chấm, hết giờ và kết quả.

## Lệnh

`npm install`, `npm run dev`, `npm test`, `npm run build`, `npm run test:e2e`.

## Quy ước và kiểm thử

ES modules, hàm thuần cho nghiệp vụ, React hooks cho trạng thái. Ví dụ: `const remaining = remainingSeconds(exam.endsAt, Date.now());`.
Node test runner xác thực trích xuất, lấy mẫu không trùng, chấm điểm và thời gian. Playwright kiểm tra ôn tập, thi, tải lại, tự nộp và responsive. Luôn giữ tài liệu nguồn nguyên bản; không sửa nội dung học thuật, xóa tệp có sẵn hoặc công bố ra ngoài phạm vi yêu cầu.
