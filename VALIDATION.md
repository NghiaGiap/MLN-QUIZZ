# Kiểm chứng ngày 13/11/2026

- Node.js 24.15.0, React 19.3.1, Vite 8.3.8, Microsoft Edge.
- `npm test`: **15/15** bài kiểm tra logic và dữ liệu thành công, gồm giải thích, biến thể, lọc câu cần làm rõ, xáo lựa chọn và chấm theo định danh đáp án.
- `npm run test:e2e`: **9/9** luồng trình duyệt thành công.
- `npm run build`: thành công, không có cảnh báo kích thước bundle sau khi tách thư viện và dữ liệu câu hỏi.
- Production preview trả HTTP 200; không có console error/warning trong lượt kiểm tra.
- Giao diện được quan sát trên desktop, điện thoại và tablet; kiểm tra tự động không tràn ngang tại 320, 390, 768, 1024, 1440px.
- Thử đảo điều kiện chấm đủ đáp án: bộ kiểm thử thất bại như mong đợi; đã khôi phục code và chạy thành công toàn bộ kiểm thử.
- Bản sao PDF khớp SHA-256 với tệp nguồn:
  `51E8E16D6AD75F51D855CE1D73CDC318ECB8D00B946FA0126AB8B52DB3D8B258`.

## Phạm vi kiểm tra

555 ID duy nhất gồm 526 câu ban đầu và 29 biến thể; mỗi câu có lựa chọn không rỗng, khóa đáp án hợp lệ và giải thích ít nhất 100 ký tự. 540 câu đủ dữ kiện để tạo đề, 15 câu cần làm rõ được loại khỏi thi và không tô đúng/sai khi ôn. Tạo đề 60 câu không trùng, thời gian đúng 3.000 giây. Chấm một/nhiều đáp án, tìm kiếm, phục hồi thứ tự, làm lại, nộp, tạo đề mới, giữ trạng thái và deadline sau reload, tự nộp cả khi đổi chế độ, bỏ qua dữ liệu lưu hỏng.

Làm lại đổi nội dung nhưng giữ nhãn ABCDE; chấm bằng định danh lựa chọn. Đề mới đổi thứ tự cả các câu trùng với đề trước. Reload giữ lựa chọn, thứ tự và deadline. Bộ nội dung mới dùng vùng lưu v2 để không chấm lại đề v1 theo khóa đáp án đã thay đổi. Cụm “phương án trên” được đổi thành “phương án còn lại” khi đã xáo.

Nút Về thứ tự ban đầu khôi phục bộ câu, xóa tìm kiếm và về câu 1; giữ lựa chọn, kết quả và thứ tự đáp án. Đã kiểm tra 5 kích thước, không tràn ngang. Đã quan sát phần giải thích trên desktop và mobile ở production preview; không có lỗi hoặc cảnh báo console.

Build dữ liệu từ JSON có tính tái tạo: chạy lại cho kết quả giống nhau. Không có PDF trong public hoặc dist. Giải thích hiển thị sau kiểm tra và sau nộp thi; biến thể chấm độc lập, không lấy nguyên chữ cái câu cha. Đã đối chiếu những sửa khóa quan trọng và ghi lịch sử tại CONTENT_REVIEW.md cùng data/content-report.json. Các kiểm tra tự động xác nhận hành vi và cấu trúc dữ liệu, không chứng nhận độc lập tính đúng đắn học thuật của toàn bộ giải thích.
