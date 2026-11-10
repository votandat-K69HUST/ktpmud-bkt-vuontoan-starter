# PROGRESS — 173820_n04 — Track B

- Starter: ktpmud-bkt-vuontoan-starter · tag bkt-2026-v1
- Fork: https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter

## PC-1 — 11/11/2026

### 1.1. Tiến độ theo acceptance criteria
<!-- Track A: A-01…A-11 · Track B: B-01…B-10 (đề thi Mục 7.3 / 8.3). Đủ mọi mã. -->
| Mã | Trạng thái (Chưa / Đang / Xong) | Bằng chứng (link commit / CI / file) | Ghi chú |
|---|---|---|---|
| B-01 | Đang | Thiết kế: [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Tích hợp trực tiếp vào `lesson.html`, đang hoàn thiện khối render thẻ 2 pha |
| B-02 | Đang | Bảng đặc tả fixture: [`artifacts/SEED_FIXTURES.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/SEED_FIXTURES.md) | Bộ câu hỏi chuẩn mở rộng đủ cả 4 phép tính (+, -, ×, :) theo SGK Toán 3 Kết nối tri thức |
| B-03 | Đang | Công thức toán học: [`artifacts/DECISIONS.md#adr-01`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Thuật toán tất định 4 phép tính: sai số 15%, $\Delta_{min} = \max(3, \lceil 0.15 \times A \rceil)$ cho phép cộng/trừ 2 chữ số, điểm neo làm tròn hàng chục |
| B-04 | Đang | Thiết kế bảo mật API: [`artifacts/DECISIONS.md#adr-03`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Thiết kế endpoint `GET /questions` bóc tách loại bỏ `correct_answer` và khoảng ước lượng |
| B-05 | Đang | Thiết kế transaction: [`artifacts/DECISIONS.md#adr-03`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Lưu `attempts`, cập nhật `progress` và cộng sao trong một SQLite Transaction đồng bộ |
| B-06 | Đang | Thiết kế UX 2 tầng: [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Phản hồi UX 2 tầng độc lập (Ước lượng nhẩm & Đặt tính đúng) kèm lời khuyên sư phạm |
| B-07 | Xong | Nguyên vẹn [`server/auth.js`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/server/auth.js) | Giữ nguyên 100% auth, session và route quản trị giáo viên |
| B-08 | Đang | Test matrix: [`artifacts/DECISIONS.md#adr-05`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Lập ma trận ca kiểm thử toàn diện: Normal, Boundary, Invalid cho cả 4 phép tính (+, -, ×, :) |
| B-09 | Đang | Môi trường Node 20 LTS & package.json | Cấu hình script `npm test` với Jest và Supertest trên Node 20 LTS |
| B-10 | Đang | Thiết kế CI: [`artifacts/DECISIONS.md#adr-05`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Thiết lập workflow GitHub Actions chạy `npm ci` và `npm test` tự động |
| B-11 | Xong | Nhật ký kiểm duyệt: [`artifacts/AI_USE.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/AI_USE.md) | Kiểm chứng 100% đề xuất AI, không đưa bí mật/PII vào repo; chỉ dùng dữ liệu synthetic |
| B-12 | Đang | Thiết kế A11y: [`artifacts/DECISIONS.md#adr-04`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) | Thiết kế điều hướng phím Tab/Enter, focus ring tương phản cao, thông điệp tiếng Việt thân thiện |

### 1.2. Sửa đổi bắt buộc từ Checkpoint 1
<!-- Các mục ❗ trong nhận xét Checkpoint 1 của nhóm. Nếu không có, ghi "Không có". -->
| Mục | Trạng thái | Bằng chứng |
|---|---|---|
| Không có | Xong | Báo cáo Scope Gate đã nộp đầy đủ tại [`artifacts/CHECKPOINT_1_REPORT.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/CHECKPOINT_1_REPORT.md) |

### 1.3. Timeline dự kiến đến khi hoàn thành
| Việc | Vai trò phụ trách | Mốc (CP2 15/11 · M3 · Freeze 19/11 · M4 20/11) | Ngày dự kiến |
|---|---|---|---|
| Cài đặt module `server/scoring.js` (hỗ trợ 4 phép tính) & Unit tests | Backend / Architect | M2 | 11/11/2026 |
| Nạp các câu seed vào `data/seed.json` & mở rộng route `POST /submissions` | Backend / Architect | M2 | 12/11/2026 |
| Cập nhật UI làm bài 2 pha trên `lesson.js` & phản hồi 2 tầng | Frontend / UX | M2 | 13/11/2026 |
| Tối ưu A11y phím Tab/Enter & hoàn thiện Vertical Slice | Frontend / UX | CP2 (15/11) | 14/11/2026 |
| Demo nội bộ 5 phút với TA/GV | Cả nhóm | Checkpoint 2 | 15/11/2026 |
| Viết trọn bộ Integration Tests & cấu hình script `npm test` | BA / Tester | M3 | 16/11/2026 |
| Thiết lập GitHub Actions CI `.github/workflows/ci.yml` | Backend / Architect | M3 | 17/11/2026 |
| Rà soát Security & hoàn thiện tài liệu bàn giao handoff | Cả nhóm | M3 | 18/11/2026 |
| Chốt Code Freeze & gắn tag release `bkt-2026-173820_n04-rc1` | Cả nhóm | Freeze (23:59 19/11) | 19/11/2026 |
| Mở Pull Request vào `fossbk-spec/ktpmud-project` | Lead | M4 (20/11) | 20/11/2026 |
| Thuyết trình demo 7 phút & vấn đáp cá nhân 8 phút | Cả nhóm | Viva (BKT 2) | 21/11/2026 |

### 1.4. Rủi ro / đang vướng
- Xử lý các phép toán có kết quả nhỏ ở phép trừ 2 chữ số (ví dụ $32 - 17 = 15$): Đã giải quyết triệt để trong ADR-01 bằng công thức $\Delta_{min} = \max(3, \lceil 0.15 \times A \rceil)$ và khoảng neo sư phạm $[E_{anchor} - 5, E_{anchor} + 5]$.
- Thao tác phím bấm liên tục: Cần bảo đảm khi học sinh nhấn Tab/Enter ở ô thứ 2 sẽ nhảy mượt mà tới câu hỏi kế tiếp hoặc nút nộp bài.

### 1.5. Câu hỏi cho GV
- Q1: Trong trường hợp học sinh lớp 3 nhập kết quả ước lượng dạng số tròn chục (ví dụ phép chia 178 : 6 nhẩm làm tròn 180 : 6 = 30), nếu học sinh ước lượng 30 nhưng kết quả phép chia nguyên là 29 (dư 4) thì độ lệch tuyệt đối là 1 đơn vị có được xem là đạt điểm ước lượng tối đa không? (Nhóm đã thiết kế chấp nhận trường hợp này theo ADR-01).

### 1.6. Phân công (alias hoặc vai trò, KHÔNG ghi họ tên/MSSV)
| Alias / vai trò | Đầu việc chính | Commit/PR tiêu biểu |
|---|---|---|
| **Lead / BA / Tester** | Đặc tả yêu cầu `REQUIREMENTS.md`, bộ fixture `SEED_FIXTURES.md` (4 phép tính), bộ automated test Jest | [`a17368e`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/a17368ebb690b96a9c1657848a314151e2b4fab0) |
| **Backend / Architect** | Thiết kế kiến trúc `DECISIONS.md` (4 phép tính), lập trình module `server/scoring.js`, mở rộng API & SQLite, cấu hình CI | [`a17368e`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/a17368ebb690b96a9c1657848a314151e2b4fab0) |
| **Frontend / UX** | Thiết kế giao diện 2 pha trên `lesson.js`, phản hồi 2 tầng, điều hướng phím Tab/Enter A11y, làm slide demo | [`a17368e`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/commit/a17368ebb690b96a9c1657848a314151e2b4fab0) |

## PC-2 — 18/11/2026

### 2.1. Đối chiếu timeline PC-1
| Việc (theo bảng 1.3) | Kế hoạch | Thực tế | Lệch & lý do |
|---|---|---|---|

### 2.2. Tiến độ theo acceptance criteria (cập nhật toàn bộ bảng 1.1)
| Mã | Trạng thái | Bằng chứng | Ghi chú |
|---|---|---|---|

### 2.3. Sẵn sàng nộp bài (đề thi Mục 6)
| Deliverable | Có / Chưa | Đường dẫn |
|---|---|---|
| README.md (cài đặt / chạy / test) | | |
| REQUIREMENTS.md | | |
| DECISIONS.md / ADR | | |
| Test tự động + CI xanh | | |
| TEST_REPORT.md | | |
| SECURITY_PRIVACY_CHECKLIST.md | | |
| AI_USE.md | | |
| CONTRIBUTIONS.md | | |
| Slide / demo script ≤ 7 phút | | |

### 2.4. Việc còn lại đến Freeze (23:59 19/11)
| Việc | Vai trò phụ trách | Hạn |
|---|---|---|

### 2.5. Rủi ro / câu hỏi cho GV
- 

## Kết quả cuối — Freeze 19/11/2026
- Tag: bkt-2026-<mã nhóm>-rc1 · SHA: 
- Trạng thái cuối từng mã AC: (cập nhật bảng 2.2 hoặc ghi "như 2.2 trừ: …")
- Những việc trong timeline chưa hoàn thành và lý do:
