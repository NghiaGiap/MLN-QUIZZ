# Biên soạn nội dung MLN122

## Kết quả

- 526 câu ban đầu được giữ ID; 29 mục hỏi/đáp khác được biên tập thành câu độc lập 527–555.
- Mỗi câu trong 555 câu có giải thích riêng, thường 2 câu văn; bài tính có phép tính và giả định cần thiết.
- 555 câu đều được chấm điểm và tham gia thi; 15 câu từng được đánh dấu rà soát đã được đưa lại theo yêu cầu người dùng.
- 63 mục hiệu chỉnh được ghi ở `data/editorial-updates.json`; 12 mục thay khóa đáp án, các mục còn lại sửa cách hỏi, lỗi chữ, lựa chọn hoặc xác định phạm vi giải thích theo học phần.
- Runtime chỉ nhập `src/data/questions.json`. PDF ban đầu được lưu ngoài public, không có liên kết trong giao diện và không nằm trong bản `dist/`.

## Cách biên soạn

Giải thích được viết theo khái niệm, quan hệ nguyên nhân hoặc công thức mà câu hỏi kiểm tra; không sinh bằng mẫu lặp “vì đáp án là …”. Không chép đoạn giáo trình. Những khẳng định thuộc một mô hình lý luận được đặt trong ngữ cảnh học phần, không trình bày như khẳng định vô điều kiện về mọi nền kinh tế thực tế.

Những biến thể có lựa chọn đầy đủ được tách riêng; những mục chỉ có câu hỏi hoặc đáp án ngắn được biên tập thêm lựa chọn để thành câu độc lập. Việc bổ sung này thể hiện rõ trong `data/alternate-questions.json`, không giả định mọi chữ của câu mới đều có sẵn trong tài liệu ban đầu. Mục “Kiểu trả lời khác” được chuyển thành một câu về chức năng. Các ghi chú chỉ giải thích hoặc công thức không bị tạo thành câu giả.

Mỗi biến thể có `variantOf` và khóa đáp án riêng. Ví dụ câu 2 chọn số ba nhưng câu biến thể 527 chọn trình tự ba giai đoạn; chữ cái đúng khác nhau. Các câu 341 và 412 cũng có chữ cái biến thể khác câu cha. Chấm sau xáo dựa vào định danh lựa chọn, không theo vị trí chữ cái.

## Một số hiệu chỉnh khóa đáp án

| Câu | Hiệu chỉnh                                                    | Căn cứ nội dung                                                                                                       |
| --- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 70  | Trọng nông                                                    | Trường phái chuyển trọng tâm từ lưu thông sang sản xuất, trước hết nông nghiệp.                                       |
| 71  | Thể chế chưa đầy đủ                                           | Đây là lý do hoàn thiện; có nhiều loại thị trường tự nó không phải khuyết điểm.                                       |
| 150 | Mốc kế hoạch năm năm đầu tiên 1928                            | Làm rõ câu hỏi về đẩy mạnh công nghiệp hóa theo kế hoạch; sửa mốc thay vì giữ đầu những năm 1930.                     |
| 190 | Tiền tượng trưng                                              | Sức mua vượt giá trị vật liệu hoặc chi phí tạo ra nó; giữ khóa tiền tượng trưng. Đồng thời tách phần câu tiếp bị lẫn. |
| 238 | Tư bản sản xuất                                               | Phân chia bất biến/khả biến áp dụng cho các bộ phận tư bản sản xuất.                                                  |
| 256 | Độc quyền nhà nước                                            | Phân công xã hội làm tăng nhu cầu đầu tư ngành quy mô lớn và điều tiết chung.                                         |
| 275 | Giá trị có thể thay đổi                                       | Phụ thuộc thời gian lao động xã hội cần thiết; không cố định vĩnh viễn hoặc luôn biến đổi vô điều kiện.               |
| 283 | Quy luật có tính lịch sử                                      | Không chấp nhận ý cho rằng quy luật khách quan do con người tùy đặt ra.                                               |
| 386 | Điều kiện tăng năng suất                                      | Máy móc không phải nguồn tự tạo giá trị thặng dư.                                                                     |
| 392 | Biểu hiện bằng tiền của giá trị sức lao động                  | Không nhầm giá trị lao động hoặc biểu hiện tiền của giá cả.                                                           |
| 409 | Hai công thức cùng đúng                                       | m/v và tỷ lệ thời gian thặng dư/tất yếu cùng phản ánh tỷ suất giá trị thặng dư.                                       |
| 450 | Có công dụng, giá cả nhưng không trực tiếp do lao động tạo ra | Phân biệt giá cả quyền/tài nguyên với giá trị lao động của hàng hóa thông thường.                                     |

Những lỗi công thức được sửa ngay trong lựa chọn, ví dụ câu 271 là quy luật sản xuất giá trị thặng dư và câu 301 có chi phí k = c + v. Câu 80 làm rõ tăng 100 điểm phần trăm; câu 83 bỏ mâu thuẫn hai số lượng sản phẩm. Tất cả thay đổi có bản ghi; bộ 526 câu ban đầu được lưu riêng để đối chiếu lịch sử.

## 15 câu được đưa lại vào chấm điểm và thi thử

Các ID: **52, 123, 149, 162, 190, 206, 209, 228, 274, 297, 345, 360, 440, 480, 535**.

Theo chỉ dẫn mới của người dùng, giữ nguyên câu hỏi, lựa chọn và khóa đáp án hiện có của 15 câu trên. Tất cả được chấm đúng/sai, tính vào độ chính xác và có thể xuất hiện trong đề 60 câu. Đã bỏ trạng thái cần làm rõ, viết lại giải thích theo khái niệm và cách khái quát của học phần Kinh tế chính trị Mác–Lênin.

Đây là quy ước chấm của bộ ôn tập, không phải thay đổi lý luận để hợp thức hóa mọi câu chữ. Ví dụ câu 274 vẫn giải thích điều kiện ra đời sản xuất hàng hóa là phân công lao động xã hội và sự tách biệt tương đối về kinh tế, đồng thời phân biệt với ý tăng sản lượng trong đáp án quy ước. Câu 345 vẫn nêu giá trị thặng dư là nguồn của tích lũy và khối lượng của nó có ảnh hưởng đến quy mô tích lũy. Câu 209 không phủ nhận mối liên hệ giữa tích lũy, sự giàu có và mâu thuẫn xã hội. Câu 360 giải thích định nghĩa theo p và điều kiện có thể thay p bằng m.

## Tài liệu đã tham khảo để đối chiếu

Các liên kết sau dùng đối chiếu khái niệm cơ bản hoặc mốc cụ thể. Đây không phải chứng nhận thẩm định học thuật độc lập của giảng viên cho toàn bộ 555 câu.

- [Bài giảng chương 1, Bộ môn Kinh tế chính trị – Đại học Thương mại](https://tmu-moodle.tmu.edu.vn/moodledata/filedir/26/0f/260f0eab6cc3630181f37b58dbbad31da18e6552.pdf): đối tượng, chức năng, lịch sử thuật ngữ.
- [Bài giảng chương 2 – Đại học Thương mại](https://tmu-moodle.tmu.edu.vn/moodledata/filedir/1e/c6/1ec69169ba834e904bb0e9f7b5b3ce71e2458044.pdf): hàng hóa, lao động, thị trường và các chủ thể.
- [Bài giảng chương 3 – Đại học Thương mại](https://tmu-moodle.tmu.edu.vn/moodledata/filedir/64/eb/64eb7850e57a077f71912cbb903204a52d04f9e3.pdf): sức lao động, c/v, tuần hoàn, chi phí, tích lũy, lợi nhuận và địa tô.
- [Bài giảng chương 5 – Đại học Thương mại](https://tmu-moodle.tmu.edu.vn/moodledata/filedir/a0/de/a0de9337223bf59c9bc2cce5ec1fcacc9dcbf0df.pdf): hoàn thiện thể chế và lợi ích kinh tế.
- [Marx, Capital I, chương 9](https://www.marxists.org/archive/marx/works/1867-c1/ch09.htm): cấu thành vốn và tỷ suất giá trị thặng dư.
- [Lênin, Imperialism, chương VII](https://www.marxists.org/archive/lenin/works/1916/imp-hsc/ch07.htm): khái quát các đặc điểm độc quyền.
- [ASEAN – giới thiệu và lịch sử](https://asean.org/about-us/): Việt Nam gia nhập 28/7/1995.
- [WTO – hồ sơ Việt Nam](https://www.wto.org/english/thewto_e/countries_e/vietnam_e.htm): thành viên từ 11/1/2007.
- [APEC – lịch sử mở rộng năm 1998](https://www.apec.org/press/blogs/2006/0717_pe_ttt_academiccenter): phân biệt mốc APEC với ASEM.
- [ASEM – Việt Nam là thành viên sáng lập](https://aseminfoboard.org/asem_press_releases/viet-nam-as-a-founding-member-of-asem-welcomes-the-celebration-of-asem-day-2019/): mốc 1996.
- [Science Museum Group – John Kay](https://collection.sciencemuseumgroup.org.uk/people/cp12807/john-kay): con thoi bay 1733.
- [Đại học Sư phạm Hà Nội – tài liệu lịch sử Liên Xô](https://staff.hnue.edu.vn/directories/TeachingSubjects.aspx?tsubject=2152&username=thanhvn): phân biệt bước đầu công nghiệp hóa và kế hoạch 1928–1932.
- [OECD – giới thiệu tổ chức](https://www.oecd.org/en/about.html): tên viết tắt.

## Duy trì nội dung

Chỉnh giải thích tại `data/explanations/`, câu tách tại `data/alternate-questions.json`, và hiệu chỉnh tại `data/editorial-updates.json`, rồi chạy `npm run data:build`. Script xác thực tính đầy đủ, sinh JSON runtime và báo cáo. Không ghi đè trực tiếp file runtime nếu muốn giữ quy trình tái tạo được.

Nội dung vẫn cần được đối chiếu với giáo trình và quy ước ra đề của lớp, đặc biệt cách phân kỳ lịch sử, thuật ngữ theo mô hình tiền vàng và cách hiểu đáp án quy ước ở những câu diễn đạt chưa chặt chẽ.
