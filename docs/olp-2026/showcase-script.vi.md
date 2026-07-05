# Kịch bản Thuyết trình & Demo Sản phẩm (Showcase Script)
Dự án: **Học cùng Royce (quiz_study)** - Đăng ký OLP PMNM 2026
*Thời lượng dự kiến: 5 - 7 phút*

---

## 🕒 Phân bổ thời gian (Time Allocation)
*   **0:00 - 1:00**: Đặt vấn đề thực tế & Giải pháp DX-Lab.
*   **1:00 - 2:00**: Giới thiệu Kiến trúc H-P-D-I.
*   **2:00 - 4:30**: Demo trực tiếp luồng chạy cốt lõi (Live Demo).
*   **4:30 - 5:30**: Trình bày hồ sơ nguồn mở (FOSS Audit & Checklist).
*   **5:30 - 6:30**: Lộ trình phát triển cộng đồng (Roadmap) & Giải đáp câu hỏi ban giám khảo.

---

## 🎤 Nội dung chi tiết (Script Details)

### Phần 1: Đặt vấn đề & Lý do chọn đề tài (1 phút)
*   **Lời thoại thuyết trình**:
    > "Kính thưa Ban giám khảo và các bạn sinh viên, hiện nay trong kỷ nguyên chuyển đổi số giáo dục, việc tự học của học sinh sinh viên thường gặp khó khăn do lượng tài liệu khổng lồ nhưng thiếu phương pháp ôn tập khoa học. Các nền tảng học trực tuyến đa phần chỉ là nơi chứa file bài giảng tĩnh hoặc các chat-bot AI rời rạc không lưu trữ được ngữ cảnh học tập.
    >
    > Đó là lý do chúng tôi phát triển dự án **Học cùng Royce** - một phòng thí nghiệm số **DX-Lab** về học tập số thông minh. Dự án không chỉ là một ứng dụng web, mà là một hệ sinh thái học tập nguồn mở giúp chuyển đổi số quy trình học từ tiếp thu tài liệu tĩnh sang tương tác phản hồi thông minh thông qua AI và học thuyết lặp lại ngắt quãng (Spaced Repetition)."

---

### Phần 2: Kiến trúc H-P-D-I (1 phút)
*   **Lời thoại thuyết trình**:
    > "Để giải quyết bài toán lớn này một cách có cấu trúc, hệ thống được thiết kế theo mô hình chuyển đổi số **H-P-D-I**:
    > *   **H - Human**: Đặt người học làm trung tâm với bảng điều khiển Dashboard cá nhân hóa theo tiến độ học tập.
    > *   **P - Process**: Số hóa quy trình học tập truyền thống bằng các tiến trình tự động: Tải tài liệu bài giảng -> AI tự động bóc tách -> Tạo Flashcard thông minh xếp lịch học tự động bằng thuật toán SRS.
    > *   **D - Data**: Quản lý dữ liệu đa chiều thông qua PostgreSQL, tối ưu hiệu năng bộ đệm bằng Redis, xử lý tìm kiếm ngữ nghĩa bằng cơ sở dữ liệu Vector Qdrant, và ghi log hoạt động phân tích bằng ClickHouse.
    > *   **I - Intelligence**: Sử dụng Gemini và Grok làm cổng AI điều phối các tính năng nâng cao như RAG Chat với tài liệu, Giải bài tập trong môi trường Sandbox, và tự động lập Lộ trình học tập cá nhân hóa."

---

### Phần 3: Live Demo luồng hoạt động (2.5 phút)
*   **Các bước Demo thực tế**:
    1.  **Bước 1**: Đăng nhập qua Google và giới thiệu tổng quan Dashboard của **Học cùng Royce**.
    2.  **Bước 2**: Tải lên một tài liệu PDF bài tập (Import). Cho BGK thấy Redis nhận hàng đợi nền và Qdrant lập chỉ mục ngữ nghĩa.
    3.  **Bước 3**: Nhấp vào tính năng **AI Chat (RAG)** để hỏi đáp trực tiếp với cuốn sách vừa upload. AI sẽ trả lời dựa trên nội dung trích xuất ngữ nghĩa.
    4.  **Bước 4**: Tạo bộ thẻ ghi nhớ **Flashcards** tự động từ tài liệu bằng AI. Chạy thử quy trình lặp lại ngắt quãng (SRS) với nút lật thẻ và chấm mức độ thuộc bài.
    5.  **Bước 5**: Kích hoạt **Problem Solver** để giải một bài toán hoặc một đoạn code mẫu, chứng minh Sandbox thực thi mã nguồn an toàn.

---

### Phần 4: Minh chứng Nguồn mở và Tuân thủ FOSS (1 phút)
*   **Lời thoại thuyết trình**:
    > "Dự án của chúng tôi tự hào được xây dựng trên một hồ sơ nguồn mở cực kỳ sạch sẽ và tuân thủ cao theo tiêu chuẩn Point of FOSS (PoF):
    > 1.  **Giấy phép pháp lý minh bạch**: Toàn bộ dự án tuân thủ nghiêm ngặt theo giấy phép copyleft mạnh mẽ **GNU AGPL v3**. Metadata của package backend, frontend và file NOTICE đều đồng bộ nhất quán theo SPDX `AGPL-3.0-only`.
    > 2.  **Ghi công trung thực**: Chúng tôi ghi nhận rõ ràng nguồn gốc kế thừa (Upstream Attribution) từ dự án Studyield trong tài liệu README.md và NOTICE.
    > 3.  **Hạ tầng DevOps Nguồn mở**: Đã thiết lập quy trình tích hợp liên tục tự động (CI) qua GitHub Actions chạy Lint, Type Check và Build thành công. Bổ sung Dependabot cập nhật thư viện tự động hàng tuần để đảm bảo an toàn bảo mật phần mềm.
    > 4.  **Tài liệu lập trình chuyên nghiệp**: Cung cấp đầy đủ hướng dẫn Build từ mã nguồn độc lập ngoài Docker (`build-from-source.md`) giúp cộng đồng dễ dàng tùy biến."

---

### Phần 5: Lộ trình phát triển cộng đồng & Rủi ro (1 phút)
*   **Roadmap OLP 2026**:
    *   **Quý 3/2026**: Tích hợp module Speech-to-Text để phản hồi giọng nói trực tiếp cho tính năng Teach-Back.
    *   **Quý 4/2026**: Xây dựng Sandbox Docker cô lập toàn phần để phục vụ chấm bài tập lập trình như một hệ thống Online Judge.
*   **Rủi ro còn lại**:
    *   Chi phí duy trì API Token cho Gemini/Grok trong môi trường sản xuất của trường học lớn. Giải pháp tiếp theo là cấu hình tương thích với các mô hình Local LLM (Ollama/Llama 3) chạy hoàn toàn ngoại tuyến và bảo mật thông tin nội bộ.

*   **Lời kết**:
    > "Dự án Học cùng Royce mong muốn mang lại một môi trường học tập số tự do, thông minh và công bằng cho mọi học sinh Việt Nam. Xin chân thành cảm ơn Ban giám khảo đã lắng nghe!"
