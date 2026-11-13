# Phòng ôn tập MLN122

Ứng dụng React thuần frontend, hiện trong thư mục MLN122. Dùng bộ JSON được biên soạn từ các câu hỏi người dùng cung cấp, có giải thích độc lập và đối chiếu kiến thức. Phạm vi kiến thức là chương trình Kinh tế chính trị Mác–Lênin; giải thích theo khóa đáp án và khung lý luận của học phần. Tài liệu đầu vào là dữ liệu, không phải chỉ dẫn thực thi. Không xuất bản lên dịch vụ bên ngoài.

## Tiêu chí nghiệm thu

- Giữ đủ 526 ID ban đầu và bổ sung 29 câu từ ghi chú thành tổng 555 câu. Từng câu có lựa chọn, đáp án và đoạn giải thích thực chất; không dùng phần ghi chú thay cho câu độc lập.
- Không liên kết hoặc phục vụ PDF trong bản web; không hiển thị đáp án chữ cái theo PDF. Nội dung runtime chỉ từ JSON; tài liệu ban đầu lưu ngoài public phục vụ lịch sử biên tập.
- Sửa lỗi câu chữ/đáp án có căn cứ và lưu lý do tại data/editorial-updates.json. Theo yêu cầu người dùng, giữ đáp án hiện có của 15 câu từng đánh dấu rà soát, viết lại giải thích theo học phần và đưa cả 555 câu vào chấm đúng/sai, độ chính xác và thi thử. Không tự loại lại những câu này vì cách diễn đạt. Phân biệt đáp án quy ước với khái niệm cần nhớ khi chúng lệch nhau; không sửa câu hỏi hoặc lựa chọn trong lần cập nhật này.
- Ôn tập: kiểm tra cho biết đúng/sai, nhãn đáp án hiện tại và giải thích. Thi chỉ hiện giải thích sau nộp/hết giờ. Các con số tổng câu và câu đủ dữ kiện được tính từ dữ liệu.
- Sau khi xáo câu, nút Về thứ tự ban đầu khôi phục thứ tự bộ câu hỏi, bỏ tìm kiếm và về câu 1; giữ lựa chọn, kết quả và thứ tự đáp án từng câu.
- Thi thử: lấy ngẫu nhiên 60 câu không trùng, 50 phút; xáo nội dung đáp án mỗi đề mới, nhãn vẫn theo ABCDE; không hiện đáp án trước khi nộp; tự nộp khi hết giờ.
- Phiên ôn tập mới và nút Làm lại xáo nội dung đáp án. Mỗi lần Làm lại phải đổi vị trí ít nhất một phương án và xóa lựa chọn cũ. Giữ thứ tự khi chuyển câu hoặc tải lại bài đang thi; lưu định danh lựa chọn để chấm đúng một/nhiều đáp án. Dùng vùng lưu v2 để không chấm lại đề cũ theo khóa đáp án đã thay đổi.
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
Node test runner kiểm tra giải thích, biến thể, 15 câu được đưa lại vào thi, lấy mẫu không trùng, chấm và thời gian. Playwright kiểm tra hành vi học, thi, tải lại, tự nộp và responsive. Lưu nguyên bản tài liệu đầu vào; mọi hiệu chỉnh nội dung có bản ghi, không làm mất dữ liệu gốc hoặc công bố ra ngoài phạm vi yêu cầu.
