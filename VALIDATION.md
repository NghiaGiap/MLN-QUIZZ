# Kiểm chứng ngày 13/11/2026

- Node.js 24.15.0, React 19.3.1, Vite 8.3.8, Microsoft Edge.
- `npm test`: **11/11** bài kiểm tra logic và dữ liệu thành công, gồm xáo lựa chọn, giữ nhãn ABCDE và chấm theo đáp án gốc.
- `npm run test:e2e`: **6/6** luồng trình duyệt thành công.
- `npm run build`: thành công, không có cảnh báo kích thước bundle sau khi tách thư viện và dữ liệu câu hỏi.
- Production preview trả HTTP 200; không có console error/warning trong lượt kiểm tra.
- Giao diện được quan sát trên desktop, điện thoại và tablet; kiểm tra tự động không tràn ngang tại 320, 390, 768, 1024, 1440px.
- Thử đảo điều kiện chấm đủ đáp án: bộ kiểm thử thất bại như mong đợi; đã khôi phục code và chạy thành công toàn bộ kiểm thử.
- Bản sao PDF khớp SHA-256 với tệp nguồn:
  `51E8E16D6AD75F51D855CE1D73CDC318ECB8D00B946FA0126AB8B52DB3D8B258`.

## Phạm vi kiểm tra

526 ID duy nhất; mỗi câu có lựa chọn không rỗng, chữ cái đáp án hợp lệ và trang nguồn. Tạo đề 60 câu không trùng, thời gian đúng 3.000 giây. Chấm sai/đúng/chưa chọn; câu nhiều đáp án yêu cầu tập lựa chọn chính xác. Kiểm tra tìm kiếm và trạng thái rỗng, xáo câu, làm lại, nộp có xác nhận, xem lại, tạo đề mới, giữ lựa chọn/vị trí/deadline sau reload, tự nộp khi hết giờ kể cả khi chuyển sang ôn tập, khôi phục đề đã hết hạn và bỏ qua dữ liệu lưu hỏng.

Sau cập nhật xáo đáp án: Làm lại đổi thứ tự nội dung nhưng giữ nhãn ABCDE, không thay dữ liệu nguồn; chấm đúng theo nội dung cho câu một/nhiều đáp án. Đề mới đổi thứ tự cả các câu trùng với đề trước. Reload và chuyển câu giữ thứ tự đã xáo, lựa chọn và deadline; dữ liệu thứ tự không hợp lệ bị từ chối, bài thi cũ không có thứ tự xáo vẫn tiếp tục được. Cụm “phương án trên” được đổi thành “phương án còn lại” khi hiển thị câu đã xáo.

Đây là xác minh chức năng và độ đầy đủ trích xuất; không phải thẩm định kiến thức hoặc đáp án học thuật trong PDF. Những chỗ mơ hồ của nguồn được giữ nguyên như mô tả trong README.
