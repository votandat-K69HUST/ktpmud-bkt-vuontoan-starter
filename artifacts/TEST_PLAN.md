# TEST_PLAN — KẾ HOẠCH KIỂM THỬ TỰ ĐỘNG & BẢO ĐẢM CHẤT LƯỢNG
> **Dự án:** Vườn Toán Lớp 3 — Track B (Thêm dạng bài *"Ước lượng trước khi tính đúng"*)  
> **Nhóm thực hiện:** 173820_n04 · Lớp 173820  
> **Mốc hoàn thành:** Giai đoạn M1 / M2 — Phục vụ Checkpoint 1 (11/11/2026) & Checkpoint 2 (15/11/2026)  
> **Tài liệu căn cứ:** [`artifacts/REQUIREMENTS.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/REQUIREMENTS.md), [`artifacts/DECISIONS.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/artifacts/DECISIONS.md) (ADR-01 đến ADR-05), [`tai-lieu-tham-khao/SEED_FIXTURES.md`](https://github.com/votandat-K69HUST/ktpmud-bkt-vuontoan-starter/blob/main/tai-lieu-tham-khao/SEED_FIXTURES.md).

---

## 📌 Tổng quan mục tiêu kiểm thử & Công cụ

Tài liệu này xác lập kế hoạch và ma trận kiểm thử toàn diện cho tính năng *"Ước lượng trước khi tính đúng"*, bao phủ trọn vẹn **CẢ 4 PHÉP TÍNH** (Cộng 2 chữ số, Trừ 2 chữ số, Nhân, Chia trong phạm vi 1.000) bám sát chương trình **Toán Lớp 3 — Sách Kết nối tri thức với cuộc sống**.

### Công nghệ & Công cụ kiểm thử (theo ADR-05):
- **Test Runner:** **Jest 29** (chạy trên môi trường Node.js 20 LTS, cấu hình `"test": "jest --runInBand"` trong `package.json`).
- **HTTP Integration Testing:** **Supertest** để kiểm thử Express API mà không cần mở cổng network thật.
- **Tách biệt module (Decoupling):** Toàn bộ thuật toán kiểm tra ước lượng và chấm điểm được đóng gói độc lập trong module `server/scoring.js`. Nhờ đó, 100% logic toán học và chấm điểm được kiểm thử đơn vị (Unit Test) trực tiếp, siêu tốc, không phụ thuộc vào trạng thái cơ sở dữ liệu SQLite hay Web Server.
- **Tự động hóa CI:** GitHub Actions workflow chạy tự động `npm ci` và `npm test` trên mỗi Pull Request.

---

## 1. Quy tắc toán học & Tiêu chí nghiệm thu được kiểm thử

Dựa trên mô hình toán học tất định tại **ADR-01** và đặc tả yêu cầu tại **REQUIREMENTS.md**:

1. **Kết quả tính chính xác ($A$):**
   - Luôn là một số nguyên không âm đối với chương trình lớp 3.
   - Đối với phép chia có dư ($a : b = q$ dư $r$), kết quả đặt tính đúng $A$ là thương số nguyên $q = \lfloor a / b \rfloor$.

2. **Quy tắc xác định khoảng ước lượng hợp lý $[E_{min}, E_{max}]$:**
   - **Khoảng dung sai tương đối:** Sai số cơ bản $\epsilon = 15\%$, với độ lệch tối thiểu $\Delta$:
     - Đối với phép cộng và trừ 2 chữ số: $\Delta_{min} = \max(3, \lceil 0.15 \times A \rceil)$ (đảm bảo không bị quá khắt khe khi hiệu số nhỏ như $32 - 17 = 15$).
     - Đối với phép nhân và phép chia: $\Delta_{min} = \max(2, \lceil 0.15 \times A \rceil)$.
     - Khoảng dung sai đối xứng: $[A - \Delta, A + \Delta]$.
   - **Khoảng bao bọc điểm neo sư phạm ($E_{anchor}$):**
     - Điểm neo làm tròn hàng chục theo SGK Toán 3 Kết nối tri thức: $[E_{anchor} - 5, E_{anchor} + 5]$.
   - **Khoảng chấp nhận chính thức:**
     $$E_{min} = \min(A - \Delta, E_{anchor} - 5), \quad E_{max} = \max(A + \Delta, E_{anchor} + 5)$$

3. **Quy chuẩn làm sạch & Kiểm tra đầu vào (Sanitization):**
   - Loại bỏ khoảng trắng thừa đầu cuối: `rawInput.trim()`.
   - Kiểm tra định dạng số nguyên dương hợp lệ bằng biểu thức chính quy: `/^\d{1,6}$/`.
   - Từ chối ngay lập tức: chuỗi rỗng, chữ cái, số thập phân (`.`, `,`), số âm, ký tự đặc biệt, số quá lớn (> 6 chữ số).

4. **Đánh giá phản hồi 2 tầng, Phân bổ điểm số 70/30 & Time-Bonus Tiers (ADR-01 & ADR-04):**
   - **Trọng số điểm chuyển dịch 70/30:**
     * **Pha 1 (Ước lượng nhẩm):** Chiếm **70%** tổng điểm câu hỏi ($0.70 \times P$), gồm:
       - **55% Base Logic ($0.55 \times P$):** Điểm tư duy sư phạm được đánh giá theo thuật toán Phân cấp điểm neo (Hierarchical Anchor Matching).
       - **15% Time Bonus ($0.15 \times P$):** Thưởng tốc độ suy luận theo mốc thời gian hoàn thành Pha 1 ($t_1$).
     * **Pha 2 (Đặt tính tính đúng & mẹo bù trừ):** Chiếm **30%** tổng điểm câu hỏi ($0.30 \times P$), gồm:
       - **25% Base Kết quả ($0.25 \times P$):** Điểm chính xác tuyệt đối của phép tính đặt tính.
       - **5% Time Bonus ($0.05 \times P$):** Thưởng tốc độ tính toán hoặc áp dụng mẹo bù trừ nhanh ở Pha 2 ($t_2$).
     * **Tổng điểm câu hỏi:**
       $$Score_{total} = (Score_{est\_base} + Score_{est\_time}) + (Score_{exact\_base} + Score_{exact\_time})$$
   - **Thuật toán Phân cấp điểm neo logic (Hierarchical Anchor Matching):**
     * **Điểm neo Vàng (Gold Anchor - chuẩn SGK Toán 3):** Làm tròn cả 2 số đến hàng chục $\rightarrow$ **100% Base Score** ($0.55 \times P$).
     * **Điểm neo Bạc (Silver Anchors - chiến lược linh hoạt):** Làm tròn 1 số hoặc cận tròn chục dưới/trên $\rightarrow$ **75% Base Score** ($0.75 \times 0.55 \times P = 0.4125 \times P$).
     * **Nhập kết quả tính đúng vào ô ước lượng ($E_{given} == A_{exact}$ với $A_{exact}$ lẻ):** $\rightarrow$ **50% Base Score** ($0.50 \times 0.55 \times P = 0.275 \times P$) + nhắc nhở sư phạm làm tròn số tròn chục.
     * **Nằm trong dải dung sai $\pm 15\%$ nhưng không theo neo logic (Đoán mò số lẻ):** $\rightarrow$ **35% Base Score** ($0.35 \times 0.55 \times P = 0.1925 \times P$ - Điểm khuyến khích tư duy gần đúng) + gợi ý sư phạm.
     * **Nằm ngoài dải dung sai:** $\rightarrow$ **0%** điểm.
   - **Quy tắc thưởng điểm theo tốc độ suy luận (Time-Bonus Tiers):**
     * Mỗi pha làm bài được trang bị Visual Countdown Timer đếm ngược tối đa 60 giây ($0 \le t_1, t_2 \le 60$).
     * **Pha 1 (Ước lượng nhẩm) — Quỹ Time Bonus tối đa 15% tổng điểm ($P_{tb1} = 0.15 \times P$):**
       - $t_1 \le 15s$: **Tốc độ vàng (Gold Speed)** $\rightarrow$ Thưởng **100%** quỹ bonus ($1.0 \times 0.15 \times P$).
       - $15s < t_1 \le 30s$: **Tốc độ tiêu chuẩn (Silver Speed)** $\rightarrow$ Thưởng **50%** quỹ bonus ($0.5 \times 0.15 \times P = 0.075 \times P$).
       - $30s < t_1 \le 60s$: **Tốc độ cơ bản (Bronze Speed)** $\rightarrow$ **0%** bonus (Giữ trọn vẹn 100% điểm tư duy Base Logic).
       - *Điều kiện tiên quyết:* Chỉ cộng Time Bonus Pha 1 khi điểm Base Logic $> 0$.
     * **Pha 2 (Tính đúng & mẹo bù trừ) — Quỹ Time Bonus tối đa 5% tổng điểm ($P_{tb2} = 0.05 \times P$):**
       - $t_2 \le 20s$: **Mẹo bù trừ siêu tốc (Gold Speed)** $\rightarrow$ Thưởng **100%** quỹ bonus ($1.0 \times 0.05 \times P$).
       - $20s < t_2 \le 40s$: **Đặt tính tiêu chuẩn ra nháp (Silver Speed)** $\rightarrow$ Thưởng **50%** quỹ bonus ($0.5 \times 0.05 \times P = 0.025 \times P$).
       - $40s < t_2 \le 60s$: **Tốc độ cơ bản (Bronze Speed)** $\rightarrow$ **0%** bonus (Giữ trọn vẹn 100% điểm Base Kết quả).
       - *Điều kiện tiên quyết:* Chỉ cộng Time Bonus Pha 2 khi học sinh tính **CHÍNH XÁC** kết quả đặt tính ($A_{given} == A$).
   - Trạng thái `correct` của câu hỏi trong báo cáo tổng quan: Đạt khi và chỉ khi học sinh làm đúng cả 2 phần (Ước lượng hợp lý VÀ Đặt tính chính xác).

---

## 2. Danh mục 16 câu hỏi mẫu (Fixtures) được kiểm thử tự động

Toàn bộ 16 câu hỏi synthetic đã định nghĩa trong `tai-lieu-tham-khao/SEED_FIXTURES.md` được đưa vào bộ kiểm thử để xác minh tính nhất quán: mọi phép tính có đáp án nguyên, điểm neo sư phạm chuẩn SGK, và ước lượng ví dụ của học sinh đều nằm trọn trong khoảng chấp nhận.

| STT | Mã câu | Phép tính (Prompt) | Phân loại nghiệp vụ | Đáp án đúng ($A$) | Điểm neo làm tròn ($E_{anchor}$) | Khoảng chấp nhận $[E_{min}, E_{max}]$ | Ước lượng mẫu học sinh | Sai số % thực tế |
|:---:|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **I** | **PHÉP CỘNG 2 CHỮ SỐ** | | | | | | | |
| 1 | `est-add-01` | **38 + 49 = ?** | Cộng có nhớ (2 số làm tròn lên) | **87** | 40 + 50 = **90** | **[74, 100]** | 90 | 3,4% |
| 2 | `est-add-02` | **54 + 27 = ?** | Cộng có nhớ (1 xuống, 1 lên) | **81** | 50 + 30 = **80** | **[68, 95]** | 80 | 1,2% |
| 3 | `est-add-03` | **61 + 28 = ?** | Cộng không nhớ | **89** | 60 + 30 = **90** | **[75, 103]** | 90 | 1,1% |
| 4 | `est-add-04` | **45 + 36 = ?** | Tận cùng 5 làm tròn lên | **81** | 50 + 40 = **90** | **[68, 95]** | 90 | 11,1% |
| **II** | **PHÉP TRỪ 2 CHỮ SỐ** | | | | | | | |
| 5 | `est-sub-01` | **72 - 38 = ?** | Trừ có nhớ (1 xuống, 1 lên) | **34** | 70 - 40 = **30** | **[25, 42]** | 30 | 11,8% |
| 6 | `est-sub-02` | **85 - 29 = ?** | Tận cùng 5 làm tròn lên | **56** | 90 - 30 = **60** | **[47, 68]** | 60 | 7,1% |
| 7 | `est-sub-03` | **91 - 43 = ?** | Cả hai số làm tròn xuống | **48** | 90 - 40 = **50** | **[40, 58]** | 50 | 4,2% |
| 8 | `est-sub-04` | **67 - 21 = ?** | Trừ không nhớ | **46** | 70 - 20 = **50** | **[38, 55]** | 50 | 8,7% |
| **III** | **PHÉP NHÂN** | | | | | | | |
| 9 | `est-mul-01` | **29 × 3 = ?** | Nhân 2 chữ số có nhớ | **87** | 30 × 3 = **90** | **[73, 101]** | 90 | 3,4% |
| 10 | `est-mul-02` | **48 × 4 = ?** | Nhân 2 chữ số nhớ lớn | **192** | 50 × 4 = **200** | **[163, 221]** | 200 | 4,2% |
| 11 | `est-mul-03` | **19 × 5 = ?** | Tích tiệm cận 100 | **95** | 20 × 5 = **100** | **[80, 110]** | 100 | 5,3% |
| 12 | `est-mul-04` | **82 × 4 = ?** | Làm tròn xuống | **328** | 80 × 4 = **320** | **[278, 378]** | 320 | 2,4% |
| **IV** | **PHÉP CHIA** | | | | | | | |
| 13 | `est-div-01` | **84 : 4 = ?** | Chia hết trong phạm vi 100 | **21** | 80 : 4 = **20** | **[15, 26]** | 20 | 4,8% |
| 14 | `est-div-02` | **178 : 6 = ?** | Chia có dư (dư 4), làm tròn bội số | **29** | 180 : 6 = **30** | **[24, 35]** | 30 | 3,4% |
| 15 | `est-div-03` | **48 : 6 = ?** | Chia bảng cửu chương | **8** | Bảng chia = **8** | **[6, 10]** | 8 | 0,0% |
| 16 | `est-div-04` | **245 : 8 = ?** | Chia có dư (dư 5), tròn chục | **30** | 240 : 8 = **30** | **[25, 35]** | 30 | 0,0% |

> **Ghi chú sư phạm:**  
> - Với phép chia có dư (ví dụ $178 : 6$), nếu học sinh làm tròn số bị chia theo hàng chục đơn thuần ($178 \rightarrow 180$) thì $180 : 6 = 30$ là phép chia nhẩm lý tưởng nhất. Cả điểm neo $30$ và kết quả nguyên $29$ đều được thuật toán bảo đảm tính hợp lý.

---

## 3. Bộ Unit Tests cho module chấm điểm (`server/scoring.js`)

File kiểm thử: `tests/unit/scoring.test.js`.

### 3.1. Nhóm ca kiểm thử bình thường (Normal Cases)
| Mã Test | Dữ liệu đầu vào & Ngữ cảnh | Thời gian thực hiện | Kết quả kỳ vọng |
|:---|:---|:---:|:---|
| **UT-NORM-01** | Câu `est-add-01` ($38 + 49 = 87$): Nhập ước lượng $90$ (Gold Anchor), tính đúng $87$ | $t_1 = 12s, t_2 = 18s$ | `estimateOk = true`, `exactOk = true`, `anchorTier = 'GOLD_ANCHOR'`, `badge = 'VÀNG'`, `score = 10.0/10` (Full 70% Est + 30% Exact) |
| **UT-NORM-02** | Câu `est-sub-01` ($72 - 38 = 34$): Nhập ước lượng $30$ (Gold Anchor), tính đúng $34$ | $t_1 = 14s, t_2 = 19s$ | `estimateOk = true`, `exactOk = true`, `score = 10.0/10`, Đạt Tốc độ vàng cả 2 pha |
| **UT-NORM-03** | Câu `est-mul-02` ($48 \times 4 = 192$): Nhập ước lượng $200$, tính đúng $192$ | $t_1 = 10s, t_2 = 15s$ | `estimateOk = true`, `exactOk = true`, `score = 10.0/10`, Mẹo bù trừ siêu tốc |
| **UT-NORM-04** | Câu `est-div-02` ($178 : 6 = 29$ dư 4): Nhập ước lượng $30$, tính đúng $29$ | $t_1 = 15s, t_2 = 25s$ | `estimateOk = true`, `exactOk = true`, `score = 9.75/10` ($t_2 \in [20, 40]$ đạt 50% time bonus Pha 2) |
| **UT-NORM-05** | Vòng lặp tự động chạy trọn vẹn cả **16 fixture** với các giá trị ước lượng mẫu ở Mục 2 | $t_1 = 12s, t_2 = 18s$ | 100% (16/16 câu) đạt kết quả hợp lý, chính xác và điểm tối đa |
| **UT-NORM-06** | Tính tất định (Determinism): Chạy cùng một bộ input 100 lần liên tiếp | $t_1 = 10s, t_2 = 15s$ | Trả về 100 lần output giống nhau từng byte |

### 3.2. Nhóm ca kiểm thử giá trị biên (Boundary Cases)
| Mã Test | Dữ liệu đầu vào & Ngữ cảnh | Thời gian thực hiện | Kết quả kỳ vọng |
|:---|:---|:---:|:---|
| **UT-BND-01** | Ước lượng chạm đúng biên dưới $E = E_{min}$ ($74$ với câu `est-add-01`) | $t_1 = 20s, t_2 = 30s$ | `estimateOk = true` (Chấp nhận cận dưới trong dung sai), đạt điểm khuyến khích |
| **UT-BND-02** | Ước lượng dưới biên dưới 1 đơn vị: $E = E_{min} - 1$ ($73$ với câu `est-add-01`) | $t_1 = 20s, t_2 = 30s$ | `estimateOk = false`, `tier = 'OUT_OF_RANGE'`, $0$ điểm Pha 1 |
| **UT-BND-03** | Ước lượng chạm đúng biên trên $E = E_{max}$ ($100$ với câu `est-add-01`) | $t_1 = 20s, t_2 = 30s$ | `estimateOk = true` (Chấp nhận cận trên trong dung sai) |
| **UT-BND-04** | Ước lượng vượt biên trên 1 đơn vị: $E = E_{max} + 1$ ($101$ với câu `est-add-01`) | $t_1 = 20s, t_2 = 30s$ | `estimateOk = false`, `tier = 'OUT_OF_RANGE'`, $0$ điểm Pha 1 |
| **UT-BND-05** | Phép trừ có hiệu số nhỏ ($32 - 17 = 15$): Thử nghiệm cận với $\Delta_{min} = 3$ | $t_1 = 10s, t_2 = 15s$ | Điểm neo $30 - 20 = 10$, cận dưới được bảo vệ không âm |
| **UT-BND-06** | Phép nhân số lớn nhất trong bộ đề ($82 \times 4 = 328$): Biên $[278, 378]$ | $t_1 = 10s, t_2 = 15s$ | Đảm bảo bao trùm cả điểm neo $320$ |
| **UT-BND-07** | Biên thời gian Pha 1 mốc vàng: $t_1 = 15.0s$ vs $t_1 = 15.1s$ | $t_1 = 15.0s \rightarrow 100\%$ bonus ($1.5$đ); $t_1 = 15.1s \rightarrow 50\%$ bonus ($0.75$đ) | Xác nhận ranh giới $\le 15s$ chính xác |
| **UT-BND-08** | Biên thời gian Pha 1 mốc tiêu chuẩn: $t_1 = 30.0s$ vs $t_1 = 30.1s$ | $t_1 = 30.0s \rightarrow 50\%$ bonus ($0.75$đ); $t_1 = 30.1s \rightarrow 0\%$ bonus ($0$đ) | Xác nhận ranh giới $\le 30s$ chính xác |
| **UT-BND-09** | Biên thời gian Pha 2 mốc vàng: $t_2 = 20.0s$ vs $t_2 = 20.1s$ | $t_2 = 20.0s \rightarrow 100\%$ bonus ($0.5$đ); $t_2 = 20.1s \rightarrow 50\%$ bonus ($0.25$đ) | Xác nhận ranh giới $\le 20s$ chính xác |
| **UT-BND-10** | Biên thời gian Pha 2 mốc tiêu chuẩn: $t_2 = 40.0s$ vs $t_2 = 40.1s$ | $t_2 = 40.0s \rightarrow 50\%$ bonus ($0.25$đ); $t_2 = 40.1s \rightarrow 0\%$ bonus ($0$đ) | Xác nhận ranh giới $\le 40s$ chính xác |
| **UT-BND-11** | Chạm trần thời gian tối đa: $t_1 = 60.0s, t_2 = 60.0s$ | $t_1 = 60s, t_2 = 60s$ | Nhận $0\%$ Time Bonus, giữ trọn vẹn điểm Base Logic và Base Kết quả |

### 3.3. Nhóm ca kiểm thử dữ liệu không hợp lệ (Invalid Inputs & Negative Scenarios)
| Mã Test | Dữ liệu đầu vào & Tình huống | Kết quả kỳ vọng |
|:---|:---|:---|
| **UT-INV-01** | Giá trị rỗng `""`, `null`, `undefined` ở một hoặc cả hai ô | Không throw exception, trả về `valid = false`, `earnedPoints = 0` |
| **UT-INV-02** | Chuỗi ký tự chữ: `"abc"`, `"ba mươi"`, `"NaN"` | Báo lỗi định dạng, yêu cầu nhập số nguyên dương |
| **UT-INV-03** | Số âm: `"-10"`, `"-87"` | Báo lỗi định dạng (Toán lớp 3 không dùng số âm) |
| **UT-INV-04** | Số thập phân có dấu chấm hoặc dấu phẩy: `"25.5"`, `"25,5"` | Báo lỗi: Ước lượng học sinh tiểu học phải là số nguyên |
| **UT-INV-05** | Chuỗi có khoảng trắng ở giữa: `"2 5"`, ký hiệu toán `"20+5"` | Từ chối dữ liệu không hợp lệ |
| **UT-INV-06** | Chuỗi có khoảng trắng đầu/cuối: `"  90  "`, `" 87 "` | Tự động `trim()` và xử lý hợp lệ bình thường |
| **UT-INV-07** | Số quá lớn: `"99999999"` (> 6 chữ số) | Bị chặn bởi regex bảo vệ tràn số |
| **UT-INV-08** | Thời gian âm ($t_1 = -5$, $t_2 = -10$) | Tự động chuẩn hóa về $0$ hoặc clamp an toàn, không sinh điểm âm |
| **UT-INV-09** | Thời gian vượt ngưỡng tối đa ($t_1 = 120s$, $t_2 = 300s$) | Tự động clamp về $60s$, nhận $0\%$ time bonus an toàn |
| **UT-INV-10** | Thời gian là chuỗi hoặc không hợp lệ (`t = "nhanh"`, `t = NaN`, `t = null`) | Tự động fallback về $60s$ (0% time bonus), không gây crash |

### 3.4. Nhóm ca kiểm thử Phân cấp điểm neo logic (Hierarchical Anchor Matching Matrix)
Đánh giá năng lực tư duy số học dựa trên bài toán $38 + 49 = 87$ ($P = 10$, Base Pha 1 = 5.5đ):

| Mã Test | Cấp độ Điểm Neo | Giá trị Học sinh nhập ($E$) | Tỷ lệ Base | Điểm Base Pha 1 | Huy hiệu | Lời nhắc & Phản hồi Sư phạm |
|:---|:---|:---:|:---:|:---:|:---:|:---|
| **UT-ANC-01** | **Điểm neo Vàng (Gold Anchor)** | $90$ ($40 + 50$) | **100%** | **5.50 / 5.5** | 🥇 Vàng | *"Xuất sắc! Em ước lượng chuẩn theo điểm neo SGK (làm tròn số tròn chục)."* |
| **UT-ANC-02** | **Điểm neo Bạc (Silver 1 - Làm tròn 1 số)** | $89$ ($40 + 49$) hoặc $88$ ($38 + 50$) | **75%** | **4.13 / 5.5** | 🥈 Bạc | *"Rất tốt! Em ước lượng theo chiến lược làm tròn linh hoạt hợp lý."* |
| **UT-ANC-03** | **Điểm neo Bạc (Silver 2 - Cận làm tròn)** | $70$ ($30 + 40$ cùng floor hàng chục) | **75%** | **4.13 / 5.5** | 🥈 Bạc | *"Rất tốt! Em ước lượng theo chiến lược làm tròn linh hoạt hợp lý."* |
| **UT-ANC-04** | **Nhập Kết quả Đúng vào ô ước lượng** | $87$ (Bằng chính xác $A_{exact}$, số lẻ) | **50%** | **2.75 / 5.5** | 🥉 Đồng | *"Em tính nhẩm ra đúng kết quả! Tuy nhiên, ở bước ước lượng, em nên làm tròn thành số tròn chục (ví dụ 90) để kiểm tra nhanh nhé! 💡"* |
| **UT-ANC-05** | **Dung sai Không theo neo (Đoán mò số lẻ)** | $83$ hoặc $91$ (Nằm trong dải $[74, 100]$ nhưng không theo logic neo) | **35%** | **1.93 / 5.5** | 🌱 Khuyến khích | *"Ước lượng nằm trong khoảng gần đúng. Gợi ý: Em hãy làm tròn về số tròn chục (90) để nhẩm nhanh và chính xác hơn nhé! 🌱"* |
| **UT-ANC-06** | **Nằm ngoài dải dung sai** | $60$ hoặc $110$ (Vượt quá dung sai $\pm 15\%$ và ngoài khoảng neo) | **0%** | **0.00 / 5.5** | ❌ Cố gắng | *"Ước lượng chưa thật sát. Em hãy làm tròn các số về hàng chục gần nhất để được 90 nhé! ✏️"* |

### 3.5. Nhóm ca kiểm thử Thưởng tốc độ suy luận (Time-Bonus Tiers Matrix)
Đánh giá quỹ thưởng tốc độ cho câu hỏi chuẩn 10 điểm ($P = 10$, Quỹ time bonus: Pha 1 = 1.5đ, Pha 2 = 0.5đ):

| Mã Test | Pha thực hiện | Thời gian $t$ | Mốc Tốc độ | Tỷ lệ Thưởng | Điểm thưởng Time Bonus | Ghi chú & Ràng buộc sư phạm |
|:---|:---|:---:|:---|:---:|:---:|:---|
| **UT-TIME-01** | **Pha 1 (Ước lượng)** | $t_1 = 8s \le 15s$ | Tốc độ vàng | **100%** | **+1.50 điểm** | Thưởng trọn vẹn quỹ tốc độ Pha 1 |
| **UT-TIME-02** | **Pha 1 (Ước lượng)** | $t_1 = 22s \in (15, 30]$ | Tốc độ tiêu chuẩn | **50%** | **+0.75 điểm** | Thưởng mức tiêu chuẩn |
| **UT-TIME-03** | **Pha 1 (Ước lượng)** | $t_1 = 45s \in (30, 60]$ | Tốc độ cơ bản | **0%** | **+0.00 điểm** | Không thưởng bonus, bảo lưu 100% Base Score |
| **UT-TIME-04** | **Pha 2 (Tính đúng)** | $t_2 = 12s \le 20s$ | Mẹo bù trừ siêu tốc | **100%** | **+0.50 điểm** | Thưởng trọn vẹn quỹ tốc độ Pha 2 |
| **UT-TIME-05** | **Pha 2 (Tính đúng)** | $t_2 = 28s \in (20, 40]$ | Đặt tính tiêu chuẩn | **50%** | **+0.25 điểm** | Thưởng mức tiêu chuẩn |
| **UT-TIME-06** | **Pha 2 (Tính đúng)** | $t_2 = 52s \in (40, 60]$ | Tốc độ cơ bản | **0%** | **+0.00 điểm** | Không thưởng bonus, bảo lưu 100% Base Score |
| **UT-TIME-07** | **Anti-Cheat Pha 1** | $t_1 = 2s$, nhưng ước lượng sai (ngoài dung sai) | N/A | **0%** | **0.00 điểm** | **Không cộng time bonus** khi điểm Base Pha 1 = 0 |
| **UT-TIME-08** | **Anti-Cheat Pha 2** | $t_2 = 3s$, nhưng tính sai kết quả | N/A | **0%** | **0.00 điểm** | **Không cộng time bonus** khi kết quả tính sai |

### 3.6. Nhóm ca kiểm thử Phân bổ điểm số tổng hợp 70/30 (Scoring 70/30 Matrix)
Quy chuẩn câu hỏi 10 điểm ($P = 10$): Pha 1 tối đa 7.0 điểm (5.5 Base + 1.5 Time); Pha 2 tối đa 3.0 điểm (2.5 Base + 0.5 Time):

| Mã Test | Tình huống bài làm học sinh | Điểm Pha 1 (70%) | Điểm Pha 2 (30%) | Tổng điểm ($P=10$) | Huy hiệu & Xếp loại |
|:---|:---|:---:|:---:|:---:|:---|
| **UT-SCR-01** | **Xuất sắc toàn diện:** Gold Anchor ($t_1 \le 15s$) + Tính đúng ($t_2 \le 20s$) | $5.5 + 1.5 = \mathbf{7.0}$ | $2.5 + 0.5 = \mathbf{3.0}$ | **10.0 / 10** (100%) | 🥇 **Huy hiệu Vàng** (Tư duy & Tốc độ hoàn hảo) |
| **UT-SCR-02** | **Tư duy tốt, tốc độ tiêu chuẩn:** Gold Anchor ($t_1 = 25s$) + Tính đúng ($t_2 = 35s$) | $5.5 + 0.75 = \mathbf{6.25}$ | $2.5 + 0.25 = \mathbf{2.75}$ | **9.0 / 10** (90%) | 🥈 **Huy hiệu Bạc** |
| **UT-SCR-03** | **Điểm neo Bạc + Tính đúng:** Silver Anchor ($t_1 \le 15s$) + Tính đúng ($t_2 \le 20s$) | $4.13 + 1.5 = \mathbf{5.63}$ | $2.5 + 0.5 = \mathbf{3.0}$ | **8.63 / 10** (86.3%) | 🥈 **Huy hiệu Bạc** |
| **UT-SCR-04** | **Điền đáp án đúng vào ước lượng:** $E = A_{exact}$ ($t_1 \le 15s$) + Tính đúng ($t_2 \le 20s$) | $2.75 + 1.5 = \mathbf{4.25}$ | $2.5 + 0.5 = \mathbf{3.0}$ | **7.25 / 10** (72.5%) | 🥉 **Huy hiệu Đồng** |
| **UT-SCR-05** | **Đoán mò số lẻ trong dung sai:** Dung sai non-anchor ($t_1 = 20s$) + Tính đúng ($t_2 = 25s$) | $1.93 + 0.75 = \mathbf{2.68}$ | $2.5 + 0.25 = \mathbf{2.75}$ | **5.43 / 10** (54.3%) | 🌱 **Huy hiệu Khuyến khích** |
| **UT-SCR-06** | **Ước lượng đúng nhưng tính sai:** Gold Anchor ($t_1 \le 15s$) + Tính sai kết quả | $5.5 + 1.5 = \mathbf{7.0}$ | $0.0 + 0.0 = \mathbf{0.0}$ | **7.0 / 10** (70.0%) | ⚠️ Giữ trọn 70% điểm ước lượng |
| **UT-SCR-07** | **Ước lượng sai nhưng tính đúng:** Ngoài dung sai ($t_1 = 10s$) + Tính đúng ($t_2 \le 20s$) | $0.0 + 0.0 = \mathbf{0.0}$ | $2.5 + 0.5 = \mathbf{3.0}$ | **3.0 / 10** (30.0%) | ✏️ Chỉ nhận 30% điểm tính đúng |
| **UT-SCR-08** | **Sai cả hai:** Ngoài dung sai + Tính sai kết quả | $0.0 + 0.0 = \mathbf{0.0}$ | $0.0 + 0.0 = \mathbf{0.0}$ | **0.0 / 10** (0%) | ❌ Cần ôn tập lại |

### 3.7. Nhóm ca kiểm thử tương thích ngược (Backward Compatibility)
| Mã Test | Dạng câu hỏi | Dữ liệu kiểm thử | Kết quả kỳ vọng |
|:---|:---|:---|:---|
| **UT-BC-01** | Câu trắc nghiệm `multiple-choice` | Đáp án khớp `correct_answer` gốc | Chấm đúng 100%, không bị ảnh hưởng bởi logic `estimate` |
| **UT-BC-02** | Câu điền số `input` | Chuỗi nguyên văn gốc | Giữ nguyên quy tắc so khớp chuỗi gốc |
| **UT-BC-03** | Câu so sánh `compare` & nối hình `paint` | Đáp án hợp lệ cũ | Hệ thống hoạt động chính xác như trước khi thêm Track B |

---

## 4. Bộ Integration Tests qua API (`server/api.js`)

File kiểm thử: `tests/integration/submissions.test.js`.  
Sử dụng tài khoản synthetic có sẵn trong CSDL (`hocsinh01` / `MatKhau123!`).

| Mã Test | Endpoint & Hành động | Kết quả kiểm chứng (Assertions) | Thỏa mãn AC |
|:---|:---|:---|:---:|
| **IT-API-01** | `GET /api/question-sets/uoc-luong-toan-lop-3/questions` | Mọi câu hỏi trả về **KHÔNG ĐƯỢC CHỨA** các trường: `correct_answer`, `exact`, `estimate_min`, `estimate_max`. Client chỉ nhận: `id`, `type`, `prompt`, `points`, `category`. | **B-04** |
| **IT-API-02** | `POST /api/submissions` với payload nộp bài đầy đủ tham số thời gian:<br>`answers[qId] = { estimate, exact, estimate_time_seconds, exact_time_seconds }` | Phản hồi HTTP 200, trả về điểm số chi tiết chuẩn 70/30 (`scoringBreakdown`, `timeEval`), phân cấp điểm neo (`anchorTier`), huy hiệu (`badge`), và phản hồi sư phạm 2 tầng. | **B-05, B-06** |
| **IT-API-03** | Kiểm tra CSDL sau khi nộp bài qua `POST /api/submissions` | Bản ghi được tạo trong bảng `attempts`; trường `score` và `completed` trong bảng `progress` được cập nhật đồng bộ trong Transaction. | **B-05** |
| **IT-API-04** | Bền vững dữ liệu (Reload / F5): Gọi `GET /api/me/progress` sau khi nộp bài | Tiến độ bài học và số sao thưởng của học sinh vẫn được bảo toàn nguyên vẹn. | **B-05** |
| **IT-API-05** | Gọi `POST /api/submissions` với payload chứa chữ hoặc thiếu trường | Trả về HTTP 400 Bad Request kèm thông báo lỗi rõ ràng, không làm crash server. | Robustness |
| **IT-API-06** | Gọi `POST /api/submissions` khi client cũ hoặc payload thiếu `estimate_time_seconds` / `exact_time_seconds` | Server tự động fallback về thời gian cơ bản (60s), chấm điểm an toàn (0% time bonus), không báo lỗi HTTP 500. | Robustness & BC |

---

## 5. Kế hoạch kiểm tra Giao diện & Khả năng tiếp cận (Manual / UI A11y)

Tiến hành kiểm thử thao tác trực tiếp trên trình duyệt theo kịch bản:

| Mã Test | Nội dung kiểm tra | Tiêu chuẩn đạt | Thỏa mãn AC |
|---|---|---|---|
| **UI-A11Y-01** | **Điều khiển hoàn toàn bằng bàn phím (No-Mouse flow):**<br>- Nhấn `Tab` để di chuyển focus vào ô *"Ước lượng"*.<br>- Nhập số, nhấn `Enter` để chốt pha 1 và tự động nhảy focus sang ô *"Tính kết quả đúng"*.<br>- Nhập kết quả đặt tính, nhấn `Enter` lần 2 để kích hoạt nút Nộp bài. | Toàn bộ luồng làm bài thực hiện mượt mà không cần dùng chuột; vòng lặp focus không bị kẹt. | **B-12** |
| **UI-A11Y-02** | **Chỉ báo tiêu điểm (Focus Ring Visual):** | Khi focus bằng phím Tab, viền input hiển thị rõ nét (độ tương phản cao `ring-2 ring-primary-500`), hỗ trợ học sinh thị lực kém. | **B-12** |
| **UI-A11Y-03** | **Hiển thị trực quan phản hồi 2 tầng (Feedback Banner):** | Sau khi nộp bài, hiển thị 2 thẻ/badge màu sắc riêng biệt: Huy hiệu ước lượng (Xanh lá nếu hợp lý, Vàng nếu hơi lệch) và Huy hiệu tính đúng (Xanh lá nếu đúng, Đỏ nếu sai) kèm lời khuyên giải thích sư phạm. | **B-06** |
| **UI-A11Y-04** | **Trải nghiệm trên màn hình nhỏ (Mobile/Tablet):** | Bàn phím số ảo hiển thị đúng trên thiết bị cảm ứng khi focus vào ô số (`inputmode="numeric"`). | Usability |

---

## 6. Kiểm tra quy trình, ranh giới an toàn & CI (Process & Security)

| Mã Test | Tiêu chí kiểm tra | Phương pháp thực hiện | Kỳ vọng | Thỏa mãn AC |
|---|---|---|---|---|
| **SEC-01** | **Bảo toàn ranh giới bảo mật:** Không sửa file auth và route cấm | Chạy lệnh: `git diff bkt-2026-v1 -- server/auth.js` | Không có bất kỳ thay đổi nào (`diff` rỗng). | **B-07** |
| **SEC-02** | **An toàn thông tin & PII:** Không đưa bí mật, mật khẩu thật hoặc dữ liệu cá nhân vào repo | Quét mã nguồn với regex tìm secret, key, token; kiểm tra file `PROGRESS.md` không có Họ tên/MSSV. | Tuyệt đối sạch, chỉ sử dụng tài khoản synthetic `hocsinh01`..`99`. | **B-11** |
| **PRC-01** | **Clean Checkout Reproducibility:** Cài đặt và chạy test từ repo sạch | Chạy thử nghiệm trên thư mục mới:<br>`git clone ...`<br>`npm ci`<br>`npm test` | Cài đặt trơn tru, toàn bộ test suite pass 100% không báo lỗi. | **B-09** |
| **PRC-02** | **Tự động hóa CI (GitHub Actions):** | Kiểm tra file `.github/workflows/ci.yml` khi push code hoặc mở Pull Request | GitHub Actions kích hoạt, hoàn thành kiểm thử và báo icon xanh `Pass`. | **B-10** |

---

## 7. Giới hạn đã biết & Biện pháp khắc phục (Known Limitations)

1. **Kiểm soát thứ tự thời gian giữa 2 pha:**
   - *Giới hạn:* Phía client thông qua giao diện người dùng khóa ô tính đúng cho đến khi học sinh nhập xong ô ước lượng. Tuy nhiên, API HTTP là phi trạng thái (stateless) nên nhận cả 2 giá trị trong một payload `POST /api/submissions`.
   - *Biện pháp:* API bảo đảm không bao giờ gửi đáp án đúng cho client trước khi học sinh nộp bài (B-04). Nhờ đó, học sinh không thể tra cứu đáp án từ DevTools trong lúc làm bài.
2. **Kiểm thử tự động giao diện (E2E UI Testing):**
   - *Giới hạn:* Dự án không tích hợp các framework nặng như Cypress hay Playwright để giữ cho repo gọn nhẹ và đảm bảo chạy nhanh trên máy chấm của ban tổ chức.
   - *Biện pháp:* Toàn bộ logic nghiệp vụ được kiểm thử tự động 100% bằng Jest Unit & Integration Tests. Các tính năng A11y và giao diện được nghiệm thu thủ công bằng checklist tại Mục 5 và ghi chép minh chứng vào `artifacts/TEST_REPORT.md`.
