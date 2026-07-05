# Point of FOSS (PoF) Checklist
Dự án: **Học cùng Royce (quiz_study)** - Đăng ký OLP PMNM 2026

Tài liệu này đối chiếu các tiêu chí kỹ thuật về phát triển Phần mềm Nguồn mở (FOSS) theo mô hình đánh giá **Point of FOSS (PoF)** nhằm chứng minh tính hoàn thiện nguồn mở của dự án.

---

## 1. Giấy phép và Tính pháp lý (License & Legal)
- [x] **Giấy phép nguồn mở rõ ràng**: Toàn bộ dự án được cấp phép nhất quán theo giấy phép tự do nguồn mở mạnh mẽ: **GNU Affero General Public License v3** (đã đăng ký trong SPDX là `AGPL-3.0-only`).
  - [LICENSE](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/LICENSE) - Tệp chứa toàn bộ văn bản giấy phép AGPL v3.
- [x] **File thông báo bản quyền (NOTICE)**: Tệp NOTICE ở thư mục gốc chứa các thông tin ghi nhận tác quyền, giấy phép tổng thể, danh sách các thư viện phụ thuộc và tuyên bố ghi công hợp pháp.
  - [NOTICE](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/NOTICE) - Chứa tuyên bố bản quyền của Học cùng Royce Contributors và ghi công Upstream.
- [x] **Ghi công nguồn gốc (Upstream Attribution)**: Ghi công rõ ràng và minh bạch cho dự án gốc **Studyield** (`studyield/studyield`) tại phần đầu tiên của `README.md`.
- [x] **Thống nhất package metadata**: Cả hai file cấu hình chính đều ghi nhận đúng thông tin giấy phép AGPL v3:
  - `backend/package.json` -> `"license": "AGPL-3.0-only"`
  - `frontend/package.json` -> `"license": "AGPL-3.0-only"`

---

## 2. Quản lý mã nguồn và Lịch sử Git (Version Control & Git Hygiene)
- [x] **Sử dụng Git chuyên nghiệp**: Lịch sử commit sạch sẽ, phân định rõ các tính năng phát triển mới, các hoạt động refactor và nâng cấp thương hiệu.
- [x] **Không lọt khóa bảo mật (Secret Hygiene)**: Các khóa API (Gemini, Grok) và chuỗi bí mật mã hóa JWT được quản lý hoàn toàn bằng biến môi trường `.env`. Tệp `.env` được đưa vào `.gitignore` để ngăn chặn rò rỉ khóa lên GitHub.
  - [.gitignore](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/.gitignore)

---

## 3. Khả năng Build từ mã nguồn (Buildability)
- [x] **Tài liệu hướng dẫn Build chi tiết**: Hướng dẫn cụ thể cách thiết lập môi trường chạy cục bộ ngoài Docker cho NestJS và React.
  - [build-from-source.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/docs/development/build-from-source.md)
- [x] **Quản lý cấu hình container**: Tệp cấu hình Docker Compose được định dạng chuẩn, tách biệt giữa môi trường phát triển và cấu hình volume cơ sở dữ liệu.
  - [docker-compose.yml](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/docker-compose.yml)

---

## 4. Quản lý thư viện phụ thuộc (Dependency Management)
- [x] **Sử dụng Lockfile chuẩn**: File `package-lock.json` được lưu giữ trong git giúp cố định phiên bản cài đặt thư viện của các nhà phát triển và ban giám khảo, tránh lỗi "build success on my machine but fail on others".
- [x] **Theo dõi cập nhật tự động**: Đã tích hợp cấu hình **Dependabot** để tự động kiểm tra lỗ hổng bảo mật của các thư viện npm theo tuần và gửi cảnh báo cập nhật.
  - [.github/dependabot.yml](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/.github/dependabot.yml)

---

## 5. Tích hợp liên tục (CI)
- [x] **GitHub Actions Workflow**: Có kịch bản kiểm tra chất lượng mã nguồn tự động chạy mỗi khi có Pull Request hoặc Commit đẩy lên nhánh chính (`main`, `develop`), tự động chạy: Lint, Type Check và Build.
  - [.github/workflows/ci.yml](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/.github/workflows/ci.yml)

---

## 6. Cộng tác và Cộng đồng (Community Engagement)
- [x] **Quy tắc ứng xử (Code of Conduct)**: Có tệp `CODE_OF_CONDUCT.md` thiết lập chuẩn mực ứng xử văn minh trong cộng đồng nhà phát triển đóng góp.
  - [CODE_OF_CONDUCT.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/CODE_OF_CONDUCT.md)
- [x] **Tài liệu hướng dẫn đóng góp (Contributing)**: Hướng dẫn chi tiết cách viết code, quy chuẩn commit, tạo pull request và quy tắc làm việc chung.
  - [CONTRIBUTING.md](file:///c:/Users/199X/OneDrive/M%C3%A1y%20t%C3%ADnh/VOCA/English-level-up-tips/CONTRIBUTING.md)
- [x] **Mẫu Pull Request (PR Template)**: Có tệp `.github/PULL_REQUEST_TEMPLATE.md` giúp người đóng góp điền đầy đủ các thông tin cần thiết về thay đổi mã nguồn trước khi gửi PR.
- [x] **Mẫu Báo cáo lỗi (Issue Templates)**: Cấu hình sẵn các mẫu Issue để người dùng báo cáo bug hoặc đề xuất tính năng mới đúng quy chuẩn.
  - `.github/ISSUE_TEMPLATE/`
