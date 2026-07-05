# Đánh giá mức độ sẵn sàng Nguồn mở (Open Source Readiness Audit)
Dự án: **Học cùng Royce (quiz_study)** - OLP PMNM 2026

Bảng đánh giá chi tiết tính tuân thủ và vệ sinh mã nguồn mở (FOSS Hygiene) theo tiêu chí của Olympic Tin học Sinh viên Việt Nam - Phần mềm Nguồn mở (OLP PMNM) và Point of FOSS (PoF) sau khi thực hiện khắc phục và chuẩn hóa.

| Tiêu chí OLP/PoF | Hiện trạng repo | Bằng chứng file/link | Rủi ro bị trừ điểm | Kết quả xử lý |
| :--- | :--- | :--- | :--- | :--- |
| **Giấy phép (License)** | Đã đồng bộ hoàn toàn giấy phép GNU AGPL v3 (`AGPL-3.0-only`) trên toàn hệ thống. | - [LICENSE](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/LICENSE)<br>- [backend/package.json](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/backend/package.json) | **Không còn** | Đã chuyển đổi `"license"` từ `Apache-2.0` và `UNLICENSED` sang `AGPL-3.0-only` đồng bộ ở cả Backend và Frontend. |
| **Tài liệu bản quyền (NOTICE)** | File NOTICE đã được sửa đổi và chứa đầy đủ ghi nhận bản quyền AGPL v3 và ghi công cho Upstream. | - [NOTICE](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/NOTICE) | **Không còn** | Đã sửa đổi nội dung tệp NOTICE và ghi rõ: *"This project is a fork of Studyield (https://github.com/studyield/studyield)"*. |
| **Metadata Gói (Package Metadata)** | File package.json ở backend và frontend đã thống nhất tên dự án mới và giấy phép thực tế. | - [backend/package.json](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/backend/package.json)<br>- [frontend/package.json](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/frontend/package.json) | **Không còn** | Tên package đổi thành `hoc-cung-royce-backend/frontend` và license đổi thành `AGPL-3.0-only`. |
| **Liên kết GitHub (README Links)** | Tất cả các tệp README ngôn ngữ khác nhau đã được tự động quét và sửa các liên kết trỏ sang repo chính xác. | - [README.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/README.md) | **Không còn** | Toàn bộ liên kết github đổi sang `ROYCE-8425/quiz_study`. |
| **Quản lý mã nguồn (Source Control)** | Dự án sử dụng Git với lịch sử rõ ràng, phân định đúng nhánh phát triển độc lập. | - `.git` history | **Không có** | Nhánh phát triển FOSS hiện tại là `chore/olp-foss-readiness`. |
| **Theo dõi lỗi (Issue Tracker)** | Các mẫu báo lỗi và đề xuất tính năng (Issue Templates) được định cấu hình chuẩn xác. | - `.github/ISSUE_TEMPLATE/` | **Không có** | Đã có sẵn cấu hình biểu mẫu bug/feature. |
| **Mẫu đóng góp (PR Template)** | Quy trình đóng góp Pull Request đã có mẫu chuẩn để hướng dẫn lập trình viên cộng đồng. | - `.github/PULL_REQUEST_TEMPLATE.md` | **Không có** | Đã có sẵn mẫu đóng góp Pull Request. |
| **Tích hợp liên tục (CI)** | Có workflow GitHub Actions chạy kiểm tra Lint, Typecheck và Build cho mỗi commit/PR. | - [.github/workflows/ci.yml](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/.github/workflows/ci.yml) | **Không có** | Workflow CI tự động chạy ổn định. |
| **Tài liệu Build (Build-from-Source)** | Tài liệu hướng dẫn build từ mã nguồn ngoài Docker được xây dựng đầy đủ và chi tiết. | - [build-from-source.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/docs/development/build-from-source.md) | **Không còn** | Đã viết hướng dẫn chi tiết cách cấu hình env, build backend/frontend cục bộ độc lập. |
| **Cấu hình Docker (Docker compose)** | Docker compose hoạt động tốt và được xác minh cú pháp không có cảnh báo. | - [docker-compose.yml](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/docker-compose.yml) | **Không có** | Đã chạy kiểm thử cấu hình Docker compose. |
| **Quy trình Release** | Hướng dẫn phát hành phiên bản mới bằng SemVer và tạo GitHub Release đã sẵn sàng. | - [release-process.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/docs/development/release-process.md) | **Không còn** | Đã tài liệu hóa các bước bump version, tag và viết release notes. |
| **Lịch sử thay đổi (Changelog)** | File CHANGELOG.md ghi nhận chi tiết các bước cập nhật dự án. | - [CHANGELOG.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/CHANGELOG.md) | **Không có** | Lưu trữ thông tin phát hành chuẩn chỉnh. |
| **Bảo mật (Security)** | Quy trình phản hồi và báo cáo lỗ hổng bảo mật được thiết lập qua email chính chủ. | - [SECURITY.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/SECURITY.md) | **Không có** | Thông tin liên hệ bảo mật trỏ về `trannhuy8425@gmail.com`. |
| **Hướng dẫn đóng góp (Contributing)** | Tài liệu Contributing đã cập nhật đầy đủ các liên kết và hướng dẫn tham gia cộng đồng. | - [CONTRIBUTING.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/CONTRIBUTING.md) | **Không có** | Đảm bảo tính mở rộng cao cho lập trình viên. |
| **Bảo trì phụ thuộc (Dependency Hygiene)** | Đã tích hợp Dependabot giúp tự động hóa cảnh báo cập nhật thư viện hàng tuần. | - [.github/dependabot.yml](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/.github/dependabot.yml) | **Không còn** | Dependabot được cấu hình quét định kỳ các thư mục backend, frontend và actions. |
| **Vệ sinh bí mật (Secret Hygiene)** | Tất cả các file lưu trữ key, secret, token thực tế đều được gitignore bảo vệ. | - `.gitignore` | **Không có** | Không rò rỉ khóa hay mật khẩu nhạy cảm lên repo GitHub. |
| **Ghi công Upstream** | Phần ghi nhận công trạng của dự án gốc Studyield đã được thêm trang trọng vào đầu README.md. | - [README.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/README.md) | **Không còn** | Thể hiện sự tôn trọng bản quyền khoa học và triết lý FOSS. |

---

## Kết quả kiểm thử build thực tế (Verify Build Results)
Đã chạy kiểm tra build cục bộ thực tế từ mã nguồn nguồn mở thành công trên môi trường Windows máy khách:

1.  **Lệnh chạy Backend**:
    ```bash
    cd backend
    npm ci
    npm run build
    ```
    *Kết quả*: **Thành công**. Biên dịch mã nguồn NestJS biên dịch sang thư mục `/dist` mà không gặp lỗi TypeScript nào.
2.  **Lệnh chạy Frontend**:
    ```bash
    cd frontend
    npm ci
    npm run build
    ```
    *Kết quả*: **Thành công**. Vite đóng gói và tối ưu hóa 3583 modules thành công, tạo thư mục đầu ra `/dist` sẵn sàng phục vụ tĩnh.
3.  **Kiểm tra cấu hình Docker**:
    ```bash
    docker compose --env-file .env.docker config --quiet
    ```
    *Kết quả*: **Thành công**. Cú pháp tệp `docker-compose.yml` hợp lệ. Dùng `--quiet` để xác minh cấu hình mà không in giá trị trong `backend/.env` ra terminal.

    **Lưu ý bảo mật**: Không đưa output đầy đủ của `docker compose config` vào báo cáo công khai, vì Docker Compose có thể resolve `env_file` và hiển thị secret cục bộ.

---

## Rủi ro FOSS còn lại và Kế hoạch xử lý (Remaining Risks & Mitigation)

Dù các lỗi FOSS Hygiene lớn đã được giải quyết ở nhánh này, dự án vẫn còn một số rủi ro cần ghi nhận trung thực:

1.  **Độ phủ kiểm thử tự động (Test Coverage) thấp**:
    *   *Mô tả*: Dự án hiện tại chủ yếu được kiểm định thủ công và kiểm thử E2E tích hợp qua docker; chưa có các bộ unit test phủ rộng toàn bộ logic backend/frontend.
    *   *Khắc phục tiếp theo*: Lập kế hoạch bổ sung unit test cho các service nghiệp vụ cốt lõi trong `/backend/src/modules/content` và `/backend/src/modules/flashcards`.
2.  **Tên miền tài liệu (Documentation Domain) chưa được triển khai**:
    *   *Mô tả*: Tên miền tài liệu `docs.trannhuy.online` hiện chưa được cấu hình deploy và trỏ DNS (đã tạm thời cập nhật các liên kết trỏ trực tiếp đến file hướng dẫn `/docs/development/build-from-source.md` trên GitHub).
    *   *Khắc phục tiếp theo*: Thiết lập deploy tài liệu bằng Docusaurus hoặc MkDocs thông qua GitHub Pages khi repo được chuyển sang chế độ công khai hoàn toàn.
3.  **Sự phụ thuộc vào Cloud API ngoại vi**:
    *   *Mô tả*: Các tính năng AI thông minh sử dụng Grok/Gemini yêu cầu API Key trực tiếp của Google/xAI. Điều này có thể ảnh hưởng đến khả năng chạy offline 100% khi BGK chấm điểm.
    *   *Khắc phục tiếp theo*: Bổ sung tùy chọn kết nối Ollama với các model mã nguồn mở chạy local (như Llama 3) tại file cấu hình để hệ thống có thể chạy offline hoàn toàn khi chấm điểm OLP.
