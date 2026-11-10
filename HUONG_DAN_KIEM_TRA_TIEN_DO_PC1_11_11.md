# 🎯 HƯỚNG DẪN TOÀN DIỆN: BUỔI KIỂM TRA TIẾN ĐỘ PC-1 (11/11/2026)
> **Sự kiện:** Progress Check 1 (PC-1) — Hackathon Marathon 2026  
> **Thời gian:** **Thứ Tư, ngày 11/11/2026, từ 9:30 đến 11:30 (120 phút)**  
> **Địa điểm:** Trực tiếp tại phòng học trên lớp (Offline)  
> **Đối tượng:** Nhóm 04 (Lớp 173820) — Track 2 (Track B: Vườn Toán Lớp 3)  
> **Nguồn đặc tả gốc:** [GitHub Issue #19](https://github.com/fossbk-spec/ktpmud-project/issues/19) & [Trang đề thi Progress Check](https://fossbk-spec.github.io/ktpmud-book/exams/KTPMUD_Hack_Marathon_2026_Progress_Check.html)  

---

## 📌 MỤC LỤC
1. [Bản chất & Ý nghĩa của buổi kiểm tra PC-1](#1-bản-chất--ý-nghĩa-của-buổi-kiểm-tra-pc-1)
2. [Kịch bản 120 phút tại lớp (Timeline chi tiết)](#2-kịch-bản-120-phút-tại-lớp-timeline-chi-tiết)
3. [Nội dung cần nộp: Cấu trúc file `progress/PROGRESS.md`](#3-nội-dung-cần-nộp-cấu-trúc-file-progressprogressmd)
4. [Lấy thông tin từ đâu & Chuẩn bị trước như thế nào?](#4-lấy-thông-tin-từ-đâu--chuẩn-bị-trước-như-thế-nào)
5. [Quy tắc nộp comment trên Issue #17](#5-quy-tắc-nộp-comment-trên-issue-17)
6. [Bí quyết trả lời Stand-up 4–5 phút với Giảng viên](#6-bí-quyết-trả-lời-stand-up-45-phút-với-giảng-viên)

---

## 1. Bản chất & Ý nghĩa của buổi kiểm tra PC-1

- **Không tính điểm số riêng:** Buổi PC-1 không chấm điểm theo thang điểm 10 hay 100 riêng biệt.
- **Bắt buộc tham gia 100%:** Nội dung nộp tại PC-1 là **bằng chứng đánh giá đóng góp cá nhân** và là **cơ sở dữ liệu để Thầy/Cô vấn đáp ngẫu nhiên vào ngày 21/11 (Bài kiểm tra 2)**.
- **Cảnh báo kỷ luật:** Nhóm vắng mặt hoặc comment nộp sau 11:30 sẽ bị ghi nhận vào biên bản hồ sơ quá trình và bị giảng viên truy vấn kỹ trong buổi vấn đáp cuối kỳ.

---

## 2. Kịch bản 120 phút tại lớp (Timeline chi tiết)

| Khung giờ | Hoạt động cụ thể của nhóm | Việc nhóm cần làm |
|:---|:---|:---|
| **09:30 – 09:40** *(10p)* | **Khai mạc & Lưu ý của GV** | Lắng nghe Giảng viên phổ biến mục tiêu buổi kiểm tra tiến độ giữa M2. |
| **09:40 – 10:20** *(40p)* | **Cập nhật & Đẩy code lên Fork** | - Mở file `progress/PROGRESS.md` trên máy.<br>- Rà soát lần cuối các bằng chứng (commit hash, file path).<br>- Commit và `git push origin bkt-dev` (hoặc `main`). |
| **10:20 – 11:20** *(60p)* | **Stand-up 4–5 phút với GV/TA** | - Cả nhóm đứng báo cáo trực tiếp với GV/TA theo format 3 câu hỏi.<br>- **GV sẽ chỉ định ngẫu nhiên 1 bạn** giải thích 1 mục trong file. |
| **Trước 11:30** | **Comment xác nhận trên GitHub** | Đại diện nhóm đăng đúng **1 comment** vào [GitHub Issue #17](https://github.com/fossbk-spec/ktpmud-project/issues/17). |

---

## 3. Nội dung cần nộp: Cấu trúc file `progress/PROGRESS.md`

File duy nhất được dùng để kiểm tra tiến độ là:
👉 **`progress/PROGRESS.md`** (nằm trong thư mục `progress/` ở repo fork của nhóm).

Cấu trúc file gồm 6 mục bắt buộc cho buổi PC-1:

### 3.1. Header thông tin chung
```markdown
# PROGRESS — 173820_n04 — Track B
- Starter: ktpmud-bkt-vuontoan-starter · tag bkt-2026-v1
- Fork: https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter
```

### 3.2. Mục 1.1: Tiến độ theo Acceptance Criteria (AC)
Bảng cập nhật toàn bộ tiêu chí của Track B (B-01 đến B-12).
- Trạng thái chỉ được ghi một trong ba chữ: `Chưa` / `Đang` / `Xong`.
- **QUY TẮC SỐNG CÒN:** Dòng nào ghi `Xong` **bắt buộc phải có BẰNG CHỨNG** (link commit SHA, link file, hoặc test run). Ghi "Xong" mà không có bằng chứng sẽ bị hệ thống tự động coi là "Chưa".

### 3.3. Mục 1.2: Sửa đổi bắt buộc từ Checkpoint 1
- Nếu ở Checkpoint 1 (08/11) TA/GV có nhận xét mục có ký hiệu ❗ cần sửa thì ghi vào đây kèm bằng chứng đã sửa.
- Nếu Checkpoint 1 không bị bắt lỗi hoặc chưa có phản hồi riêng: **Ghi rõ: `"Không có"`**.

### 3.4. Mục 1.3: Timeline dự kiến đến khi hoàn thành
Liệt kê các đầu việc từ 11/11 đến Freeze (19/11) và Submit (20/11) kèm vai trò phụ trách và ngày dự kiến.

### 3.5. Mục 1.4: Rủi ro / Đang vướng
Nêu các thách thức kỹ thuật nhóm đang gặp (ví dụ: tối ưu phản hồi 2 tầng khi học sinh nhấn Enter, hoặc kiểm soát sai số ước lượng với phép chia có dư).

### 3.6. Mục 1.5: Câu hỏi cho Giảng viên (Q&A)
Ghi câu hỏi kỹ thuật nhóm muốn GV giải đáp trực tiếp (GV sẽ trả lời bằng reply dưới comment của nhóm).

### 3.7. Mục 1.6: Phân công vai trò
- **CẤM:** Tuyệt đối **KHÔNG GHI HỌ TÊN HOẶC MSSV** (chính sách an toàn dữ liệu cá nhân PII của cuộc thi).
- **ĐƯỢC DÙNG:** Chỉ dùng **Alias hoặc Vai trò** (ví dụ: `Lead / BA`, `Backend / Architect`, `Frontend / UX`).

---

## 4. Lấy thông tin từ đâu & Chuẩn bị trước như thế nào?

> [!TIP]
> **NHÓM HOÀN TOÀN CÓ THỂ SOẠN THẢO VÀ CHUẨN BỊ TRƯỚC 100% Ở NHÀ!**  
> Không cần đợi đến sáng 11/11 mới ngồi gõ file. Khi chuẩn bị sẵn:
> - Lên lớp nhóm chỉ cần kiểm tra lại commit SHA mới nhất.
> - Tiết kiệm toàn bộ 40 phút đầu để tập dượt phần Stand-up vấn đáp.

### Nguồn trích xuất thông tin có sẵn:
1. **Thông tin yêu cầu & AC:** Lấy từ [artifacts/REQUIREMENTS.md](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/artifacts/REQUIREMENTS.md) đã hoàn thành hôm 08/11.
2. **Quyết định kiến trúc & bằng chứng:** Lấy từ [artifacts/DECISIONS.md](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/artifacts/DECISIONS.md) và commit hash `a17368e`.
3. **Bộ câu hỏi mẫu:** Lấy từ [artifacts/SEED_FIXTURES.md](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/artifacts/SEED_FIXTURES.md).
4. **Báo cáo scope:** Lấy từ [artifacts/CHECKPOINT_1_REPORT.md](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/artifacts/CHECKPOINT_1_REPORT.md).

---

## 5. Quy tắc nộp comment trên Issue #17

### 5.1. Nơi nộp comment
Truy cập đúng địa chỉ:  
👉 **`https://github.com/fossbk-spec/ktpmud-project/issues/17`**

### 5.2. Khung giờ nộp hợp lệ
⏰ **CHỈ TÍNH TRONG KHUNG GIỜ: 9:30 – 11:30 ngày 11/11/2026** (theo giờ ghi nhận của máy chủ GitHub).  
*(Đăng trước 9:30 hoặc sau 11:30 đều bị coi là không hợp lệ).*

### 5.3. Cú pháp comment chuẩn (Chỉ đăng duy nhất 1 comment / nhóm)
```text
Nhóm: 173820_n04 · Track: B
Fork: https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter
Commit PC-1: a17368ebb690b96a9c1657848a314151e2b4fab0
```

> [!WARNING]
> - Nếu trong khung giờ 9:30–11:30 nhóm có commit thêm mã nguồn mới, **hãy BẤM NÚT EDIT (sửa) comment cũ** để đổi mã SHA. **TUYỆT ĐỐI KHÔNG đăng comment mới**.
> - Không bình luận hay chat thảo luận trong Issue #17.
> - Tuyệt đối không force-push (`git push -f`) làm mất commit SHA đã nộp.

---

## 6. Bí quyết trả lời Stand-up 4–5 phút với Giảng viên

Khi đến lượt nhóm stand-up với GV/TA:

### Cấu trúc 3 câu trả lời mẫu:
1. **Đã xong gì (kèm bằng chứng):**
   > *"Thưa Thầy/Cô, nhóm đã hoàn thành toàn bộ Giai đoạn M1 và mở rộng bài toán bao phủ cả 4 phép tính (+, -, ×, :) bám sát SGK Toán 3 Kết nối tri thức: phân tích 12 tiêu chí AC, chốt 5 bản quyết định kiến trúc ADR (thuật toán ước lượng tất định kết hợp sai số $\le 15\%$ và điểm neo hàng chục, schema JSON không làm đổi cấu trúc SQLite cũ), và bộ 16 câu hỏi synthetic. Tất cả đã push lên GitHub ở commit `a17368e`."*
2. **Sắp làm gì (Giai đoạn M2):**
   > *"Hiện tại nhóm đang hiện thực module `server/scoring.js`, mở rộng route `POST /api/submissions` và dựng UI thẻ 2 pha trên `lesson.html` để hoàn thành Vertical Slice chạy được trước Checkpoint 2 (15/11)."*
3. **Đang vướng gì:**
   > *"Nhóm đang cân nhắc thêm trường hợp học sinh dùng bàn phím: khi nhấn Enter ở ô ước lượng thì tự nhảy sang ô tính đúng, và nhấn Enter lần 2 thì nộp bài."*

### Chuẩn bị cho câu hỏi ngẫu nhiên:
Giảng viên sẽ chọn ngẫu nhiên một thành viên trong nhóm để hỏi. Cả 3 bạn cần nắm rõ:
- **Võ Tấn Đạt (Backend):** Nắm vững thuật toán ước lượng trong `DECISIONS.md` (ADR-01) và cách lưu JSON trong `correct_answer`.
- **Bùi Tiến Đạt (BA/Tester):** Nắm vững 12 tiêu chí AC trong `REQUIREMENTS.md` và các ca kiểm thử Normal / Boundary / Invalid.
- **Nguyễn Minh Quang (Frontend):** Nắm vững cách dựng giao diện thẻ 2 pha và điều hướng phím Tab/Enter (A11y).
