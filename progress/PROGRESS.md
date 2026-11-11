# PROGRESS — 173820_n04 — Track B

- Starter: ktpmud-bkt-vuontoan-starter · tag bkt-2026-v1
- Fork: https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter

## PC-1 — 11/11/2026

### 1.1. Tiến độ theo acceptance criteria
<!-- Track A: A-01…A-11 · Track B: B-01…B-10 (đề thi Mục 7.3 / 8.3). Đủ mọi mã. -->
| Mã | Trạng thái (Chưa / Đang / Xong) | Bằng chứng (link commit / CI / file) | Ghi chú |
|---|---|---|---|
| B-01 | Đang | Thiết kế luồng học: [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Tích hợp trực tiếp vào `lesson.html`, đang dựng khối thẻ tương tác 2 pha có bộ đếm ngược thời gian thích ứng tối đa 60 giây cho mỗi pha (Adaptive Phase Timer) |
| B-02 | Đang | Bảng đặc tả 16 fixture: [`tai-lieu-tham-khao/SEED_FIXTURES.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/tai-lieu-tham-khao/SEED_FIXTURES.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Bộ 16 câu hỏi chuẩn phủ cả 4 phép tính (+, -, ×, :) theo SGK Toán 3 Kết nối tri thức, đã cập nhật đầy đủ Điểm neo Vàng, Điểm neo Bạc và khoảng dung sai sẵn sàng nạp vào seed.json |
| B-03 | Đang | Công thức toán học & thuật toán: [`artifacts/DECISIONS.md#adr-01`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Thuật toán tất định 4 phép tính: Phân bổ trọng số ƯỚC LƯỢNG LÀ TRỌNG TÂM 70% TỔNG ĐIỂM (55% Base + 15% Time Bonus), ĐẶT TÍNH ĐÚNG 30% (25% Base + 5% Time Bonus); phân cấp 5 bậc logic sư phạm (Điểm neo Vàng 100%, Điểm neo Bạc 75%, Đúng kết quả vào ô ước lượng 50%, Trong khoảng 35%, Ngoài khoảng 0%) |
| B-04 | Đang | Thiết kế bảo mật API: [`artifacts/DECISIONS.md#adr-03`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Thiết kế endpoint `GET /questions` bóc tách loại bỏ `correct_answer`, `gold_anchor`, `silver_anchors` và khoảng ước lượng |
| B-05 | Đang | Thiết kế transaction: [`artifacts/DECISIONS.md#adr-03`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Lưu `attempts`, cập nhật `progress` và cộng sao trong một SQLite Transaction đồng bộ |
| B-06 | Đang | Thiết kế UX 2 tầng: [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Phản hồi UX 2 tầng độc lập (Ước lượng nhẩm & Đặt tính đúng), hiển thị huy hiệu Điểm neo Vàng/Bạc, điểm thưởng thời gian tốc độ (Time Bonus), kèm nhắc nhở khi điền kết quả đúng và gợi ý sư phạm khi gõ bừa trong khoảng |
| B-07 | Xong | Giữ nguyên [`server/auth.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/server/auth.js) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Giữ nguyên 100% auth, session và route quản trị giáo viên |
| B-08 | Đang | Kế hoạch kiểm thử: [`artifacts/TEST_PLAN.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/TEST_PLAN.md) & [`artifacts/DECISIONS.md#adr-05`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Đã lập kế hoạch và ma trận ca kiểm thử chi tiết bao phủ 4 phép tính, ma trận Normal, Boundary, Invalid, 5 bậc phân cấp điểm neo (Vàng/Bạc/Exact-in-Est), bộ đếm ngược 60s và tính thưởng điểm tốc độ |
| B-09 | Đang | Môi trường Node 20 LTS & [`package.json`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/package.json) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Cấu hình script `npm test` với Jest và Supertest trên Node 20 LTS |
| B-10 | Đang | Thiết kế CI: [`artifacts/DECISIONS.md#adr-05`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Thiết lập workflow GitHub Actions chạy `npm ci` và `npm test` tự động |
| B-11 | Xong | Nhật ký kiểm duyệt: [`tai-lieu-tham-khao/AI_USE.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/tai-lieu-tham-khao/AI_USE.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Kiểm chứng 100% đề xuất AI, không đưa bí mật/PII vào repo; chỉ dùng dữ liệu synthetic |
| B-12 | Đang | Thiết kế A11y: [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) tại commit [`0c18013`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/0c1801341eb8b37828a574a7ce9a7841231aabe4) | Thiết kế bộ đếm ngược thích ứng 60s/pha với thanh tiến trình trực quan thân thiện trẻ lớp 3 (không gây áp lực tâm lý); điều hướng phím Tab/Enter mượt mà, thông báo tiếng Việt khích lệ |

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
