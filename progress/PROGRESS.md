# PROGRESS — 173820_n04 — Track B

- Starter: ktpmud-bkt-vuontoan-starter · tag bkt-2026-v1
- Fork: https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter

## PC-1 — 11/11/2026

### 1.1. Tiến độ theo acceptance criteria
<!-- Track A: A-01…A-11 · Track B: B-01…B-10 (đề thi Mục 7.3 / 8.3). Đủ mọi mã. -->
| Mã | Trạng thái (Chưa / Đang / Xong) | Bằng chứng (link commit / CI / file) | Ghi chú |
|---|---|---|---|
| B-01 | Xong | [`public/assets/js/pages/lesson.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/public/assets/js/pages/lesson.js) & [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Đã cài đặt hoàn chỉnh thẻ tương tác 2 pha (P1: Ước lượng, P2: Tính đúng), tích hợp bộ đếm ngược thời gian thích ứng 60 giây/pha tách riêng độc lập từng câu (chỉ tính giờ khi học sinh chủ động bấm chuyển câu), gợi ý Ong Vàng sau 30s và công thái học phông chữ/nút bấm siêu to rõ cho học sinh lớp 3 |
| B-02 | Xong | [`data/seed.json`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/data/seed.json) & [`tai-lieu-tham-khao/SEED_FIXTURES.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/tai-lieu-tham-khao/SEED_FIXTURES.md) | Bộ 16 câu hỏi chuẩn phủ cả 4 phép tính (+, -, ×, :) theo SGK Toán 3 Kết nối tri thức thuộc bộ đề `uoc-luong-toan-lop-3` đã được nạp đầy đủ vào `seed.json` và đồng bộ tự động vào SQLite database `data/vuon-toan.db` |
| B-03 | Xong | [`server/scoring.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/server/scoring.js) & [`artifacts/DECISIONS.md#adr-01`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Module chấm điểm toán học tất định 100% không dùng AI runtime: Phân bổ trọng số Ước lượng 70% (55% Base + 15% Time Bonus) & Tính đúng 30% (25% Base + 5% Time Bonus); thuật toán phân cấp 5 bậc điểm neo và cơ chế chống gian lận tốc độ |
| B-04 | Xong | [`server/api.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/server/api.js) & [`artifacts/DECISIONS.md#adr-03`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Endpoint `GET /question-sets/:setId/questions` tuyệt đối không trả về `correct_answer`, `gold_anchor` hay `silver_anchors` cho client; chấm điểm hoàn toàn trên server an toàn tuyệt đối |
| B-05 | Xong | [`server/api.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/server/api.js) & [`server/db.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/server/db.js) | Lưu trữ `attempts`, cập nhật tiến độ bài học trong `progress` và cộng dồn `total_stars` đồng bộ qua SQLite Transaction nguyên tử; bền vững 100% khi reload F5 |
| B-06 | Xong | [`public/assets/js/pages/lesson.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/public/assets/js/pages/lesson.js) & [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Phản hồi UX 2 tầng độc lập, hiển thị huy hiệu Điểm neo Vàng 🥇 / Bạc 🥈 / Đồng 🥉, điểm thưởng phản xạ tốc độ (Time Bonus), kèm gợi ý sư phạm tự động sau 30s và lời giải thích của chú Ong Vàng |
| B-07 | Xong | Giữ nguyên [`server/auth.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/server/auth.js) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Giữ nguyên 100% auth, session và route quản trị giáo viên |
| B-08 | Xong | [`tests/unit/scoring.test.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/tests/unit/scoring.test.js) & [`tests/integration/api.test.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/tests/integration/api.test.js) | Đã xây dựng bộ kiểm thử tự động toàn diện: 55 Unit Tests + 10 Integration Tests (tổng cộng 65 tests), kiểm tra trọn vẹn 4 phép tính, giá trị biên, anti-cheat, 16 fixtures, phân cấp 5 bậc và tính tất định |
| B-09 | Xong | [`package.json`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/package.json) | Cấu hình script `npm test` với Jest và Supertest trên Node 20 LTS, chạy `npm test` đạt 65/65 tests PASS (100% xanh) |
| B-10 | Đang | Thiết kế CI: [`artifacts/DECISIONS.md#adr-05`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Thiết lập workflow GitHub Actions chạy `npm ci` và `npm test` tự động |
| B-11 | Xong | Nhật ký kiểm duyệt: [`tai-lieu-tham-khao/AI_USE.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/tai-lieu-tham-khao/AI_USE.md) | Kiểm chứng 100% đề xuất AI, không đưa bí mật/PII vào repo; chỉ dùng dữ liệu synthetic |
| B-12 | Xong | [`public/assets/js/pages/lesson.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/public/assets/js/pages/lesson.js) & [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Trải nghiệm Accessibility A11y & Công thái học: Vô hiệu hóa cử chỉ cuộn chuột (Mouse Wheel Guard) tránh nhảy số, cơ chế Empty Input Guard ngăn chuyển pha khi chưa điền đáp án lúc còn giờ kèm hộp nhắc nhở sư phạm, đồng hồ chuyển màu dịu mắt, ARIA live, điều hướng phím Enter/Tab mượt mà, nút bấm và ô chữ số siêu to dễ bấm chạm |

### 1.2. Sửa đổi bắt buộc từ Checkpoint 1
<!-- Các mục ❗ trong nhận xét Checkpoint 1 của nhóm. Nếu không có, ghi "Không có". -->
| Mục | Trạng thái | Bằng chứng |
|---|---|---|
| Không có | Xong | Báo cáo Scope Gate đã nộp đầy đủ tại [`tai-lieu-tham-khao/CHECKPOINT_1_REPORT.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/tai-lieu-tham-khao/CHECKPOINT_1_REPORT.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) |

### 1.3. Timeline dự kiến đến khi hoàn thành
| Việc | Vai trò phụ trách | Mốc (CP2 15/11 · M3 · Freeze 19/11 · M4 20/11) | Ngày dự kiến |
|---|---|---|---|
| Cài đặt module `server/scoring.js` (hỗ trợ 4 phép tính, 70/30, 5 bậc phân cấp điểm neo, Time Bonus) & Unit tests | Backend / Architect | M2 | 11/11/2026 |
| Nạp 16 câu seed vào `data/seed.json` & mở rộng route `POST /submissions` | Backend / Architect | M2 | 12/11/2026 |
| Cập nhật UI làm bài 2 pha trên `lesson.js`, bộ đếm ngược 60s/pha & phản hồi 2 tầng | Frontend / UX | M2 | 13/11/2026 |
| Tối ưu A11y phím Tab/Enter & hoàn thiện Vertical Slice | Frontend / UX | CP2 (15/11) | 14/11/2026 |
| Demo nội bộ 5 phút với TA/GV | Cả nhóm | Checkpoint 2 | 15/11/2026 |
| Viết trọn bộ Integration Tests & cấu hình script `npm test` | BA / Tester | M3 | 16/11/2026 |
| Thiết lập GitHub Actions CI `.github/workflows/ci.yml` | Backend / Architect | M3 | 17/11/2026 |
| Rà soát Security & hoàn thiện tài liệu bàn giao handoff | Cả nhóm | M3 | 18/11/2026 (PC-2) |
| Chốt Code Freeze & gắn tag release `bkt-2026-173820_n04-rc1` | Cả nhóm | Freeze (23:59 19/11) | 19/11/2026 |
| Mở Pull Request vào `fossbk-spec/ktpmud-project` | Lead | M4 (20/11) | 20/11/2026 |
| Thuyết trình demo 7 phút & vấn đáp cá nhân 8 phút | Cả nhóm | Viva (BKT 2) | 21/11/2026 |

### 1.4. Rủi ro / đang vướng
- *Xử lý dung sai cho các phép toán có kết quả nhỏ ở phép trừ 2 chữ số (ví dụ $32 - 17 = 15$):* Đã giải quyết triệt để trong ADR-01 bằng công thức $\Delta_{min} = \max(3, \lceil 0.15 \times A \rceil)$ và khoảng neo sư phạm $[E_{anchor} - 5, E_{anchor} + 5]$.
- *Thao tác phím bấm liên tục & Đồng hồ đếm ngược 60s (Accessibility & UX):* Cần bảo đảm khi học sinh lớp 3 nhấn Tab/Enter ở ô thứ 2 sẽ nhảy mượt mà tới câu hỏi kế tiếp hoặc nút nộp bài; đồng hồ đếm ngược 60s hiển thị chuyển màu nhẹ nhàng khi còn dưới 10s để không gây hoảng loạn cho trẻ.
- *Kiểm soát dữ liệu đầu vào người dùng:* Xử lý trường hợp học sinh vô tình nhập dấu phẩy, dấu chấm hoặc khoảng trắng trong ô ước lượng.

### 1.5. Câu hỏi cho GV
- Q1: Trong trường hợp học sinh lớp 3 nhập kết quả ước lượng dạng số tròn chục (ví dụ phép chia $178 : 6$ nhẩm làm tròn $180 : 6 = 30$), nếu học sinh ước lượng $30$ nhưng kết quả phép chia nguyên là $29$ (dư 4) thì độ lệch tuyệt đối là 1 đơn vị có được xem là đạt điểm ước lượng tối đa không? (Nhóm đã thiết kế chấp nhận trường hợp này theo ADR-01 và xếp vào Điểm neo Vàng).
- Q2: Nhóm đã hoàn thiện thiết kế phân bổ trọng số: ƯỚC LƯỢNG LÀ TRỌNG TÂM CHIẾM 70% TỔNG ĐIỂM (55% Base logic + 15% Time Bonus) và ĐẶT TÍNH ĐÚNG CHIẾM 30% TỔNG ĐIỂM (25% Base + 5% Time Bonus) kết hợp bộ đếm ngược thích ứng 60s/pha và phân cấp logic điểm neo Vàng/Bạc. Thầy/Cô có gợi ý tinh chỉnh thêm về ngưỡng thời gian đếm ngược đối với học sinh lớp 3 không?

### 1.6. Phân công (alias hoặc vai trò, KHÔNG ghi họ tên/MSSV)
| Alias / vai trò | Đầu việc chính | Commit/PR tiêu biểu |
|---|---|---|
| **Lead / BA / Tester** | Đặc tả yêu cầu `REQUIREMENTS.md`, kế hoạch kiểm thử `TEST_PLAN.md`, bộ fixture `tai-lieu-tham-khao/SEED_FIXTURES.md` (4 phép tính, điểm neo Vàng/Bạc, phân cấp 5 bậc), bộ automated test Jest (65 tests), bảng kiểm Security Checklist | [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) (PC2) · [`b0f2e16`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/b0f2e16) (CP2) · [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) (PC1) |
| **Backend / Architect** | Thiết kế kiến trúc `DECISIONS.md` (4 phép tính, tỷ lệ 70/30, timer 60s), lập trình module `server/scoring.js`, mở rộng API & SQLite, cấu hình CI `.github/workflows/ci.yml` | [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) (PC2) · [`b0f2e16`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/b0f2e16) (CP2) · [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) (PC1) |
| **Frontend / UX** | Thiết kế giao diện 2 pha trên `lesson.js`, bộ đếm ngược thích ứng 60s từng câu độc lập, gợi ý 30s, phản hồi 2 tầng kèm huy hiệu 5 bậc, điều hướng phím Tab/Enter A11y, kịch bản demo, soạn slide thuyết trình | [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) (PC2) · [`b0f2e16`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/b0f2e16) (CP2) · [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) (PC1) |

## PC-2 — 18/11/2026
<!-- Báo cáo tiến độ kết thúc giai đoạn M3 (Hardening & Delivery) chuẩn bị Code Freeze -->

### 2.1. Đối chiếu timeline PC-1 & Mốc Checkpoint 2 (15/11/2026) đến PC-2 (18/11/2026)
| Việc (theo bảng 1.3) | Kế hoạch | Thực tế | Lệch & lý do |
|---|---|---|---|
| Cài đặt module `server/scoring.js` (4 phép tính, 70/30, 5 bậc, Time Bonus) | 11/11/2026 | Hoàn thành tại commit [`4077562`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/4077562) | Đúng kế hoạch, bổ sung thêm phân cấp 5 bậc chi tiết |
| Nạp 16 câu seed vào `data/seed.json` & route `POST /submissions` | 12/11/2026 | Hoàn thành tại commit [`4077562`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/4077562) | Đúng kế hoạch, đồng bộ SQLite `data/vuon-toan.db` |
| Cập nhật UI 2 pha, bộ đếm ngược 60s/pha độc lập & gợi ý sau 30s | 13/11/2026 | Hoàn thành tại commit [`4077562`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/4077562) | Đúng kế hoạch, tối ưu công thái học chữ to và phản hồi tức thì |
| Tối ưu A11y Tab/Enter & hoàn thiện Vertical Slice | 14/11/2026 | Hoàn thành tại commit [`4077562`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/4077562) | Đúng tiến độ, 65/65 automated tests xanh 100% |
| Demo nội bộ 5 phút với TA/GV (Checkpoint 2) | 15/11/2026 | Sẵn sàng kịch bản demo tại [`tai-lieu-tham-khao/KICH_BAN_DEMO_CHECKPOINT_2_15_11.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/tai-lieu-tham-khao/KICH_BAN_DEMO_CHECKPOINT_2_15_11.md) | Đúng tiến độ mốc Checkpoint 2 |
| Tối ưu công thái học (Mouse Wheel Guard & Empty Input Guard) | 15/11/2026 | Hoàn thành tại commit [`b0f2e16`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/b0f2e16) | Ngăn nhảy số khi cuộn chuột, hiện hộp nhắc nhở khi chưa điền đáp án |
| Viết trọn bộ Integration Tests & cấu hình script `npm test` | 16/11/2026 | Hoàn thành tại commit [`4077562`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/4077562) | Đạt 65/65 tests PASS (55 Unit + 10 Integration) |
| Thiết lập GitHub Actions CI `.github/workflows/ci.yml` (B-10) | 17/11/2026 | Hoàn thành tại commit [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) | Vượt tiến độ 1 ngày, chạy tự động Node 20.x trên Ubuntu |
| Lập bảng kiểm an toàn & bảo mật `SECURITY_PRIVACY_CHECKLIST.md` (B-11) | 18/11/2026 | Hoàn thành tại commit [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) | Vượt tiến độ 2 ngày, đạt 10/10 tiêu chí an toàn |
| Lập báo cáo đóng góp thành viên `CONTRIBUTIONS.md` (Mục 6) | 18/11/2026 | Hoàn thành tại commit [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) | Tỷ lệ công bằng: Bùi Tiến Đạt 34%, Võ Tấn Đạt 33%, Nguyễn Minh Quang 33% |
| Chuẩn hóa tài liệu Clean Checkout `README.md` & deliverables (Mục 6) | 18/11/2026 | Hoàn thành tại commit [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) | Hướng dẫn 3 bước clean checkout, quickstart, tài khoản mẫu |
| Soạn thảo Slide thuyết trình `slide_thuyet_trinh.md` ≤ 7 phút (Mục 6) | 18/11/2026 | Hoàn thành tại commit [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) | 7 slide chuẩn Marp, phân bổ thời gian chính xác cho buổi thuyết trình 21/11 |

### 2.2. Tiến độ theo acceptance criteria (cập nhật toàn bộ bảng 1.1)
| Mã | Trạng thái (Chưa / Đang / Xong) | Bằng chứng (link commit / CI / file) | Ghi chú |
|---|---|---|---|
| B-01 | Xong | [`public/assets/js/pages/lesson.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/public/assets/js/pages/lesson.js) & [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/DECISIONS.md) | Thẻ tương tác 2 pha (P1: Ước lượng, P2: Tính đúng), tích hợp bộ đếm ngược thích ứng 60s/pha tách riêng độc lập từng câu (chỉ tính giờ khi bấm chuyển câu), gợi ý Ong Vàng sau 30s và công thái học phông chữ/nút bấm siêu to rõ cho học sinh lớp 3 |
| B-02 | Xong | [`data/seed.json`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/data/seed.json) & [`tai-lieu-tham-khao/SEED_FIXTURES.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/tai-lieu-tham-khao/SEED_FIXTURES.md) | Bộ 16 câu hỏi chuẩn phủ cả 4 phép tính (+, -, ×, :) theo SGK Toán 3 Kết nối tri thức thuộc bộ đề `uoc-luong-toan-lop-3` đã được nạp đầy đủ vào `seed.json` và đồng bộ tự động vào SQLite database `data/vuon-toan.db` |
| B-03 | Xong | [`server/scoring.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/server/scoring.js) & [`artifacts/DECISIONS.md#adr-01`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/DECISIONS.md) | Module chấm điểm toán học tất định 100% không dùng AI runtime: Phân bổ trọng số Ước lượng 70% (55% Base + 15% Time Bonus) & Tính đúng 30% (25% Base + 5% Time Bonus); thuật toán phân cấp 5 bậc điểm neo và cơ chế chống gian lận tốc độ |
| B-04 | Xong | [`server/api.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/server/api.js) & [`artifacts/DECISIONS.md#adr-03`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/DECISIONS.md) | Endpoint `GET /question-sets/:setId/questions` tuyệt đối không trả về `correct_answer`, `gold_anchor`, `silver_anchors`, `bounding_anchors` hay `explanation` cho client; chấm điểm hoàn toàn trên server an toàn tuyệt đối |
| B-05 | Xong | [`server/api.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/server/api.js) & [`server/db.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/server/db.js) | Lưu trữ `attempts`, cập nhật tiến độ bài học trong `progress` và cộng dồn `total_stars` đồng bộ qua SQLite Transaction nguyên tử; bền vững 100% khi reload F5 |
| B-06 | Xong | [`public/assets/js/pages/lesson.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/public/assets/js/pages/lesson.js) & [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/DECISIONS.md) | Phản hồi UX 2 tầng độc lập, hiển thị huy hiệu Điểm neo Vàng 🥇 / Bạc 🥈 / Đồng 🥉 / Khuyến khích 🎖️, điểm thưởng phản xạ tốc độ (Time Bonus), kèm gợi ý sư phạm tự động sau 30s và lời giải thích của chú Ong Vàng |
| B-07 | Xong | Giữ nguyên [`server/auth.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/server/auth.js) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Giữ nguyên 100% auth, session và route quản trị giáo viên, bảo toàn ranh giới bảo mật không xâm phạm |
| B-08 | Xong | [`tests/unit/scoring.test.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/tests/unit/scoring.test.js) & [`tests/integration/api.test.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/tests/integration/api.test.js) | Đã xây dựng bộ kiểm thử tự động toàn diện: 55 Unit Tests + 10 Integration Tests (tổng cộng 65 tests), kiểm tra trọn vẹn 4 phép tính, giá trị biên, anti-cheat, 16 fixtures, phân cấp 5 bậc và tính tất định |
| B-09 | Xong | [`package.json`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/package.json) | Cấu hình script `npm test` với Jest và Supertest trên Node 20 LTS, chạy `npm test` đạt 65/65 tests PASS (100% xanh) chỉ trong < 1s |
| B-10 | Xong | [`.github/workflows/ci.yml`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/.github/workflows/ci.yml) tại commit [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) & [`artifacts/DECISIONS.md#adr-05`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/DECISIONS.md) | Thiết lập workflow GitHub Actions CI tự động kích hoạt trên các nhánh `main` và `bkt-dev` khi push / PR; chạy `npm ci` và `npm test -- --runInBand` trên Ubuntu 20.x độc lập |
| B-11 | Xong | [`artifacts/SECURITY_PRIVACY_CHECKLIST.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/SECURITY_PRIVACY_CHECKLIST.md) tại commit [`5c2695d`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/5c2695d) & [`tai-lieu-tham-khao/AI_USE.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/tai-lieu-tham-khao/AI_USE.md) | Kiểm chứng 100% đề xuất AI; hoàn thành bảng kiểm 10/10 tiêu chí an toàn & bảo mật, không đưa bí mật/PII vào repo; chỉ dùng dữ liệu synthetic, không dùng runtime LLM |
| B-12 | Xong | [`public/assets/js/pages/lesson.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/public/assets/js/pages/lesson.js) & [`public/assets/css/app.css`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/public/assets/css/app.css) | Trải nghiệm Accessibility A11y & Công thái học: Vô hiệu hóa cử chỉ cuộn chuột (Mouse Wheel Guard) tránh nhảy số, cơ chế Empty Input Guard ngăn chuyển pha khi chưa điền đáp án lúc còn giờ kèm hộp nhắc nhở sư phạm, đồng hồ chuyển màu dịu mắt, ARIA live, điều hướng phím Enter/Tab mượt mà, nút bấm và ô chữ số siêu to dễ bấm chạm |

### 2.3. Sẵn sàng nộp bài (đề thi Mục 6)
| Deliverable | Có / Chưa | Đường dẫn |
|---|---|---|
| README.md (cài đặt / chạy / test) | Có | [`README.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/README.md) |
| REQUIREMENTS.md | Có | [`artifacts/REQUIREMENTS.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/REQUIREMENTS.md) |
| DECISIONS.md / ADR | Có | [`artifacts/DECISIONS.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/DECISIONS.md) |
| Test tự động + CI xanh | Có | [`.github/workflows/ci.yml`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/.github/workflows/ci.yml) & [`tests/`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/tree/bkt-dev/tests) (65/65 tests PASS) |
| TEST_REPORT.md (Kế hoạch test) | Có | [`artifacts/TEST_PLAN.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/TEST_PLAN.md) |
| SECURITY_PRIVACY_CHECKLIST.md | Có | [`artifacts/SECURITY_PRIVACY_CHECKLIST.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/SECURITY_PRIVACY_CHECKLIST.md) (10/10 tiêu chí đạt chuẩn) |
| AI_USE.md | Có | [`tai-lieu-tham-khao/AI_USE.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/tai-lieu-tham-khao/AI_USE.md) |
| CONTRIBUTIONS.md | Có | [`artifacts/CONTRIBUTIONS.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/artifacts/CONTRIBUTIONS.md) (Phân định 34% - 33% - 33%) |
| Slide / demo script ≤ 7 phút | Có | [`slides/slide_thuyet_trinh.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/slides/slide_thuyet_trinh.md) & [`tai-lieu-tham-khao/KICH_BAN_DEMO_CHECKPOINT_2_15_11.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/tai-lieu-tham-khao/KICH_BAN_DEMO_CHECKPOINT_2_15_11.md) |
| Draft PR vào `ktpmud-project`, check `validate` xanh | Sẵn sàng | Chuẩn bị nhánh `submit/hoang_mai_toan-173820_n04` để mở PR vào `fossbk-spec/ktpmud-project` theo hướng dẫn `nop_bai.md` vào ngày 20/11/2026 |

### 2.4. Việc còn lại đến Freeze (23:59 19/11)
| Việc | Vai trò phụ trách | Hạn |
|---|---|---|
| Diễn tập thuyết trình kịch bản demo 7 phút và chuẩn bị câu hỏi vấn đáp cá nhân 8 phút | Cả nhóm | 18/11/2026 – 19/11/2026 |
| Rà soát chéo mã nguồn và tài liệu lần cuối trước khi đóng băng | Cả nhóm | 19/11/2026 |
| Gắn git tag release `bkt-2026-173820_n04-rc1` và chốt commit SHA freeze | Lead | 23:59 19/11/2026 |

### 2.5. Rủi ro / câu hỏi cho GV
- **Rủi ro kỹ thuật:** Không có (Zero Blocker). Toàn bộ 65/65 ca test tự động đã pass 100%, CI đã được cấu hình chạy trên GitHub Actions, API và CSDL hoạt động ổn định và nhất quán.
- **Câu hỏi cho GV:** Nhóm đã hoàn thiện trọn vẹn 100% các tiêu chí từ B-01 đến B-12 và đầy đủ 10 deliverable theo Mục 6 đề thi. Nhóm đã sẵn sàng cho buổi thuyết trình và vấn đáp (Viva).

## Kết quả cuối — Freeze 19/11/2026
<!-- Báo cáo nghiệm thu chính thức tại thời điểm chốt Code Freeze 23:59 ngày 19/11/2026 -->
- **Release Tag:** `bkt-2026-173820_n04-rc1` · **Commit SHA chốt Freeze:** `2982aabee360c9d34987afad4edb3b29304b7a00` (`2982aab`)
- **Trạng thái cuối từng mã AC:** Như bảng 2.2 — Đạt **100% Xong** (12/12 tiêu chí B-01 đến B-12 đều hoàn thành xuất sắc, không có ngoại lệ hay tiêu chí nợ).
- **Những việc trong timeline chưa hoàn thành và lý do:** **Không có** (100% công việc theo timeline đều hoàn thành đúng hạn hoặc vượt tiến độ).
- **Bộ kiểm thử tự động:** **65 / 65 tests PASS (100% Xanh)** bao phủ 4 phép tính, 5 bậc phân cấp điểm neo, Time Bonus và ranh giới bảo mật server-side.
- **Hạ tầng CI/CD:** Workflow GitHub Actions `.github/workflows/ci.yml` kích hoạt tự động trên cả `main` và `bkt-dev`.
- **Mức độ sẵn sàng nộp bài (M4 - 20/11):** Sẵn sàng 100% mở Pull Request vào `fossbk-spec/ktpmud-project` với đầy đủ 10 deliverable theo Mục 6 đề thi.
