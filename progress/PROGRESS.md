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
| B-12 | Xong | [`public/assets/js/pages/lesson.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/bkt-dev/public/assets/js/pages/lesson.js) & [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Trải nghiệm Accessibility A11y & Công thái học: Đồng hồ chuyển màu dịu mắt, ARIA live thông báo hỗ trợ đọc màn hình, điều hướng phím Enter/Tab mượt mà giữa các pha, nút bấm và ô chữ số siêu to dễ bấm chạm |

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
| **Lead / BA / Tester** | Đặc tả yêu cầu `REQUIREMENTS.md`, kế hoạch kiểm thử `TEST_PLAN.md`, bộ fixture `tai-lieu-tham-khao/SEED_FIXTURES.md` (4 phép tính, điểm neo Vàng/Bạc, phân cấp 5 bậc), bộ automated test Jest | [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) |
| **Backend / Architect** | Thiết kế kiến trúc `DECISIONS.md` (4 phép tính, tỷ lệ 70/30, timer 60s), lập trình module `server/scoring.js`, mở rộng API & SQLite, cấu hình CI | [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) |
| **Frontend / UX** | Thiết kế giao diện 2 pha trên `lesson.js`, bộ đếm ngược thích ứng 60s, phản hồi 2 tầng kèm huy hiệu Vàng/Bạc, điều hướng phím Tab/Enter A11y, làm slide demo | [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) |

## PC-2 — 18/11/2026
<!-- Phần dưới đây sẽ được nhóm điền tiếp tại buổi PC-2 ngày 18/11/2026 theo hướng dẫn đề thi -->

### 2.1. Đối chiếu timeline PC-1
| Việc (theo bảng 1.3) | Kế hoạch | Thực tế | Lệch & lý do |
|---|---|---|---|

### 2.2. Tiến độ theo acceptance criteria (cập nhật toàn bộ bảng 1.1)
| Mã | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|

### 2.3. Sẵn sàng nộp bài (đề thi Mục 6)
| Deliverable | Có / Chưa | Đường dẫn |
|---|---|---|
| README.md (cài đặt / chạy / test) | Có | [`README.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/README.md) |
| REQUIREMENTS.md | Có | [`artifacts/REQUIREMENTS.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/REQUIREMENTS.md) |
| DECISIONS.md / ADR | Có | [`artifacts/DECISIONS.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) |
| Test tự động + CI xanh | | |
| TEST_REPORT.md (Kế hoạch test) | Có | [`artifacts/TEST_PLAN.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/TEST_PLAN.md) |
| SECURITY_PRIVACY_CHECKLIST.md | | |
| AI_USE.md | Có | [`tai-lieu-tham-khao/AI_USE.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/tai-lieu-tham-khao/AI_USE.md) |
| CONTRIBUTIONS.md | | |
| Slide / demo script ≤ 7 phút | | |
| Draft PR vào `ktpmud-project`, check `validate` xanh | | |

### 2.4. Việc còn lại đến Freeze (23:59 19/11)
| Việc | Vai trò phụ trách | Hạn |
|---|---|---|

### 2.5. Rủi ro / câu hỏi cho GV
- 

## Kết quả cuối — Freeze 19/11/2026
<!-- Phần dưới đây sẽ được nhóm điền tại thời điểm chốt Code Freeze 23:59 ngày 19/11/2026 -->
- Tag: bkt-2026-173820_n04-rc1 · SHA: 
- Trạng thái cuối từng mã AC: (cập nhật bảng 2.2 hoặc ghi "như 2.2 trừ: …")
- Những việc trong timeline chưa hoàn thành và lý do:
