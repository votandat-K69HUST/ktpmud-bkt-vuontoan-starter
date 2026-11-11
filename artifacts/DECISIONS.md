# 🏛️ NHẬT KÝ QUYẾT ĐỊNH KIẾN TRÚC (ARCHITECTURE DECISION RECORDS - ADRs)
> **Dự án:** Vườn Toán Lớp 3 — Trường Tiểu học Hoàng Mai  
> **Dạng bài mở rộng:** "Ước lượng trước khi tính đúng" (Track 2 / Track B)  
> **Phạm vi toán học:** Cả 4 phép tính: Phép cộng 2 chữ số, Phép trừ 2 chữ số, Phép nhân và Phép chia (Theo SGK Toán 3 Kết nối tri thức với cuộc sống)  
> **Mã đề:** `KTPMUD-BKT-2026-PILOT` | **Mã nhóm:** `173820_n04`  
> **Nhóm tác giả:** Bùi Tiến Đạt (BA/Tester), Võ Tấn Đạt (Backend/Architect), Nguyễn Minh Quang (Frontend/UX)  
> **Trạng thái:** Chốt phương án kiến trúc toàn diện (Mở rộng tổng quát 4 phép tính)  

---

## 📌 BỐI CẢNH HỆ THỐNG BROWNFIELD & CĂN CỨ THIẾT KẾ

Để đảm bảo tính khả thi cao nhất và tuyệt đối không phá vỡ hệ thống hiện có, các quyết định kiến trúc trong tài liệu này được xây dựng dựa trên việc phân tích trực tiếp mã nguồn nền tảng (Brownfield Architecture Reference):

1. **Bảng dữ liệu `questions` (`server/db.js`):**
   - Schema gốc: `(id, set_id, lesson_id, type, prompt, options_json, correct_answer, points, category, sort_order)`.
   - Hệ thống cũ hiện có 4 loại câu hỏi (`multiple-choice`, `input`, `compare`, `paint`), trong đó cột `correct_answer` luôn lưu trữ giá trị phẳng dạng TEXT (chuỗi so sánh bằng tuyệt đối).
   - **Căn cứ quyết định:** Bổ sung loại câu hỏi mới `type = 'estimate'` mà không can thiệp thay đổi cấu trúc bảng SQL (tránh lệnh `ALTER TABLE` gây rủi ro corrupt hoặc mất đồng bộ trên file CSDL SQLite `vuon-toan.db`). Thay vào đó, trường `correct_answer` được thiết kế mở rộng phi phá vỡ (Non-breaking Extension) để chứa cấu trúc JSON đặc tả quy tắc ước lượng và đáp án chuẩn.

2. **Luồng chấm bài & Ghi nhận tiến độ `/api/submissions` (`server/api.js`):**
   - Luồng gốc: Lấy danh sách câu hỏi theo `set_id`, so khớp từng câu bằng `given === String(q.correct_answer).trim().toLowerCase()`.
   - Tính tổng điểm `percent = Math.round((earned / max) * 100)`, tính số sao tăng thêm `starsEarned = Math.round(Math.max(0, percent - oldBest) / 100 * starReward)`.
   - Bọc toàn bộ quá trình lưu `attempts`, cập nhật `progress` và cộng sao người dùng vào một **SQLite Transaction** đồng bộ (`better-sqlite3`).
   - **Căn cứ quyết định:** Kế thừa toàn bộ cơ chế SQLite Transaction để đảm bảo tính bền vững dữ liệu (F5 không mất điểm), đồng thời phân nhánh xử lý chuyên biệt cho `type = 'estimate'` với cơ chế chấm điểm 2 tầng độc lập (Ước lượng nhẩm và Tính đúng) và trả về cấu trúc chi tiết phản hồi sư phạm 2 tầng.

3. **Giao diện bài tập `public/lesson.html` & `public/assets/js/pages/lesson.js`:**
   - Cơ chế gốc: Hàm `render()` duyệt danh sách câu hỏi từ API `GET /api/question-sets/:setId/questions`, render các thẻ `<article>` với `opt-btn` hoặc thẻ `<input>` thuần túy; khi ấn nút nộp bài sẽ gọi API `POST /api/submissions`.
   - **Căn cứ quyết định:** Bổ sung khối render Thẻ tương tác 2 pha (Phased Interaction Card) cho `type = 'estimate'` ngay trong `lesson.js`. Học sinh nhập ước lượng ở Pha 1, nhập kết quả chính xác ở Pha 2; hỗ trợ hoàn chỉnh điều hướng bàn phím (Tab, Enter) và vòng lấy nét (Focus Ring) theo tiêu chuẩn khả năng tiếp cận (Accessibility - A11y).

---

## 📑 MỤC LỤC CÁC QUYẾT ĐỊNH KIẾN TRÚC (ADRs)

1. [ADR-01: Mô hình toán học sư phạm & Thuật toán ước lượng tất định cho CẢ 4 PHÉP TÍNH (+, -, ×, :)](#adr-01-mô-hình-toán-học-sư-phạm--thuật-toán-ước-lượng-tất-định-cho-cả-4-phép-tính) *(Tiêu chí B-03)*
2. [ADR-02: Thiết kế Schema CSDL SQLite mở rộng (Non-Breaking Extension) tương thích 4 phép tính](#adr-02-thiết-kế-schema-csdl-sqlite-mở-rộng-non-breaking-extension-tương-thích-4-phép-tính) *(Tiêu chí B-02, B-07)*
3. [ADR-03: Thiết kế API Contract, Cơ chế chấm 2 tầng & Bảo mật đáp án Server-side](#adr-03-thiết-kế-api-contract-cơ-chế-chấm-2-tầng--bảo-mật-đáp-án-server-side) *(Tiêu chí B-04, B-05, B-07)*
4. [ADR-04: Thiết kế Trải nghiệm Người dùng (UX thẻ 2 pha) & Khả năng tiếp cận Accessibility](#adr-04-thiết-kế-trải-nghiệm-người-dùng-ux-thẻ-2-pha--khả-năng-tiếp-cận-accessibility) *(Tiêu chí B-06, B-12)*
5. [ADR-05: Chiến lược Kiểm thử tự động (Unit & Integration) bao phủ 4 phép tính & CI Pipeline](#adr-05-chiến-lược-kiểm-thử-tự-động-unit--integration-bao-phủ-4-phép-tính--ci-pipeline) *(Tiêu chí B-08, B-09, B-10)*

---

## ADR-01: Mô hình toán học sư phạm & Thuật toán ước lượng tất định cho CẢ 4 PHÉP TÍNH

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt & Mở rộng tổng quát 70/30 + Time-Bonus Tiers + Anchor Matching)

### 2. Bối cảnh & Yêu cầu sư phạm
Theo Chương trình GDPT 2018 và bộ sách giáo khoa **Toán 3 — Kết nối tri thức với cuộc sống**, kỹ năng ước lượng kết quả phép tính giúp học sinh xây dựng trực giác số (Number Sense), phát hiện sai lệch lớn trước khi đặt tính.

Trong hệ thống cũ, bài kiểm tra chỉ so sánh chuỗi bằng nhau tuyệt đối: `given === String(q.correct_answer).trim().toLowerCase()`. Với dạng bài mới *"Ước lượng trước khi tính đúng"*, học sinh cần thực hiện 2 thao tác:
1. **Pha 1 (Ước lượng nhẩm):** Quan sát phép tính, làm tròn nhẩm trong đầu theo quy tắc làm tròn đến hàng chục để đưa ra con số ước lượng.
2. **Pha 2 (Tính đúng & Mẹo bù trừ):** Thực hiện đặt tính ra nháp hoặc áp dụng mẹo tính nhanh/bù trừ để tìm kết quả chính xác.

**Bài toán đặt ra:** Hệ thống phải hỗ trợ thuật toán ước lượng tổng quát, tất định 100% (deterministic), không phụ thuộc vào LLM/AI lúc runtime (B-03), kiểm thử tự động được toàn diện cho **CẢ 4 PHÉP TÍNH CĂN BẢN CỦA TOÁN LỚP 3**:
- Phép cộng 2 chữ số (có nhớ và không nhớ trong phạm vi 100).
- Phép trừ 2 chữ số (có nhớ và không nhớ trong phạm vi 100).
- Phép nhân số có 2 hoặc 3 chữ số với số có 1 chữ số (trong phạm vi 1.000).
- Phép chia số có 2 hoặc 3 chữ số cho số có 1 chữ số (trong phạm vi 1.000).

Đồng thời, hệ thống giải quyết triệt để 3 bài toán sư phạm nâng cao:
1. **Cơ chế đếm ngược thời gian (Visual Countdown Timer tối đa 60 giây cho mỗi pha):** Đo lường và thúc đẩy tốc độ phản xạ nhẩm tự nhiên của học sinh tiểu học.
2. **Công thức thưởng điểm theo tốc độ suy luận (Time-Bonus Tiers):** Thưởng điểm lũy tiến cho học sinh có tốc độ nhẩm siêu tốc mà vẫn bảo toàn tuyệt đối 100% điểm tư duy nếu làm bài ở tốc độ cơ bản.
3. **Thuật toán đối chiếu logic sư phạm phân cấp điểm neo (Hierarchical Anchor Matching):** Phân biệt rạch ròi giữa học sinh làm tròn chuẩn SGK (Điểm neo Vàng), học sinh có chiến lược làm tròn linh hoạt (Điểm neo Bạc), học sinh nhập đáp án tính đúng vào ô ước lượng, và học sinh đoán mò/gõ bừa số lẻ trong dải dung sai.

---

### 3. Đặc tả toán học cho quy tắc làm tròn chuẩn SGK Toán 3

#### A. Quy tắc làm tròn số về hàng chục gần nhất ($\text{roundTen}$)
Đối với số tự nhiên $n$ có hàng đơn vị là $u = n \pmod{10}$:
$$\text{roundTen}(n) = \begin{cases} 
n - u & \text{nếu } u \in \{1, 2, 3, 4\} \quad (\text{làm tròn xuống hàng chục gần nhất}) \\ 
n + (10 - u) & \text{nếu } u \in \{5, 6, 7, 8, 9\} \quad (\text{làm tròn lên hàng chục gần nhất}) \\ 
n & \text{nếu } u = 0 \quad (\text{đã là số tròn chục}) 
\end{cases}$$
*(Ví dụ chuẩn SGK: $34 \rightarrow 30$, $38 \rightarrow 40$, $75 \rightarrow 80$, $41 \rightarrow 40$)*.

#### B. Điểm neo ước lượng sư phạm ($E_{anchor}$) cho 4 phép tính

1. **Phép cộng 2 chữ số ($A + B$):**
   Cả hai số hạng đều được làm tròn đến hàng chục:
   $$E_{gold} = \text{roundTen}(A) + \text{roundTen}(B)$$
   *Ví dụ:* $38 + 47 \longrightarrow 40 + 50 = 90$ (Kết quả tính đúng: $85$).

2. **Phép trừ 2 chữ số ($A - B$):**
   Cả số bị trừ và số trừ đều được làm tròn đến hàng chục:
   $$E_{gold} = \text{roundTen}(A) - \text{roundTen}(B)$$
   *Ví dụ:* $73 - 28 \longrightarrow 70 - 30 = 40$ (Kết quả tính đúng: $45$).

3. **Phép nhân ($X \times Y$):**
   Thừa số có 2 chữ số được làm tròn đến hàng chục, thừa số 1 chữ số giữ nguyên:
   $$E_{gold} = \text{roundTen}(X) \times Y$$
   *Ví dụ:* $29 \times 3 \longrightarrow 30 \times 3 = 90$ (Kết quả tính đúng: $87$).

4. **Phép chia ($X : Y$):**
   Số bị chia $X$ được làm tròn về số tròn chục gần nhất hoặc bội số tròn chục gần nhất chia hết cho số chia $Y$:
   $$E_{gold} = \text{roundTen}(X) : Y$$
   *Ví dụ:* $178 : 6 \longrightarrow 180 : 6 = 30$ (Kết quả tính đúng: $29$ dư 4; thương nguyên là $29$).

---

### 4. Thuật toán đối chiếu logic sư phạm phân cấp điểm neo (Hierarchical Anchor Matching)

Để phản ánh chính xác chất lượng tư duy số học và phân biệt năng lực thật sự với việc đoán mò, hệ thống áp dụng thuật toán **Phân cấp điểm neo logic** 5 cấp độ cho Pha 1:

| Cấp độ Điểm Neo | Đặc tả Logic Sư phạm & Tình huống Học sinh | Tỷ lệ Base Score Pha 1 | Huy hiệu Đạt được | Phản hồi & Gợi ý Sư phạm |
|:---|:---|:---:|:---:|:---|
| **1. Điểm neo Vàng (Gold Anchor)** | Làm tròn **cả 2 số** về hàng chục theo chuẩn SGK Toán 3 Kết nối tri thức. Ví dụ: $38 + 47 \rightarrow 40 + 50 = 90$. | **100%** | 🥇 **Huy hiệu Vàng** | *"Xuất sắc! Em ước lượng chuẩn theo điểm neo SGK (làm tròn số tròn chục)."* |
| **2. Điểm neo Bạc (Silver Anchors)** | Chiến lược làm tròn linh hoạt: Làm tròn 1 số, giữ nguyên số còn lại (ví dụ $40 + 47 = 87$ hoặc $38 + 50 = 88$); hoặc cùng floor/ceil hàng chục ($30 + 40 = 70$). | **75%** | 🥈 **Huy hiệu Bạc** | *"Rất tốt! Em ước lượng theo chiến lược làm tròn linh hoạt hợp lý."* |
| **3. Điểm neo Bằng Đáp án Đúng (Exact Match in Estimate)** | Học sinh tính nhẩm ra kết quả chính xác rồi điền luôn vào ô ước lượng ($E_{given} == A_{exact}$ với $A_{exact}$ là số lẻ, ví dụ nhập 85). | **50%** | 🥉 **Huy hiệu Đồng** | *"Em tính nhẩm ra đúng kết quả! Tuy nhiên, ở bước ước lượng, em nên làm tròn thành số tròn chục để kiểm tra nhanh nhé!"* |
| **4. Dung sai Không Theo Neo (Tolerance Only - Non-Anchor)** | Nhập số lẻ bất kỳ nằm trong dải dung sai $\pm 15\%$ (hoặc $\pm \Delta_{min}$) nhưng **KHÔNG** theo bất kỳ điểm neo logic nào (Đoán mò / gõ số lẻ, ví dụ $83, 89$). | **35%** *(Khuyến khích)* | 🌱 **Huy hiệu Khuyến khích** | *"Ước lượng nằm trong khoảng gần đúng. Gợi ý: Em hãy làm tròn về số tròn chục để nhẩm nhanh và chính xác hơn nhé!"* |
| **5. Ngoài Dải Dung Sai (Out of Tolerance)** | Ước lượng lệch quá ngưỡng sai số cho phép (độ lệch lớn hơn $\Delta_{min}$ và nằm ngoài khoảng cho phép). | **0%** | ❌ **Cần cố gắng** | *"Ước lượng chưa thật sát. Em hãy làm tròn các số về hàng chục gần nhất để nhẩm nhé!"* |

---

### 5. Cơ chế đếm ngược thời gian (Visual Countdown Timer 60s) & Thưởng tốc độ (Time-Bonus Tiers)

#### A. Cơ chế đếm ngược Visual Countdown Timer
- Mỗi pha làm bài (Pha 1: Ước lượng, Pha 2: Tính đúng) được trang bị bộ đếm ngược độc lập tối đa **60 giây** ($T_{max} = 60s$).
- Visual Countdown Widget hiển thị trực quan tiến trình thời gian và đổi màu theo 3 mức cảnh báo:
  * $t \in [30s, 60s]$: Màu xanh ngọc (Bình tĩnh suy nghĩ).
  * $t \in [15s, 30s]$: Màu vàng hổ phách (Cần tập trung chốt kết quả).
  * $t \in [0s, 15s]$: Màu đỏ nhấp nháy (Sắp hết thời gian).
- Khi hết 60s ở Pha 1: Hệ thống tự động chốt giá trị hiện tại (hoặc giá trị rỗng nếu chưa nhập), tự động kích hoạt chuyển sang Pha 2 và ghi nhận $t_1 = 60s$.
- Khi hết 60s ở Pha 2: Hệ thống tự động ghi nhận $t_2 = 60s$ và sẵn sàng nộp bài.
- Thời gian làm bài từng pha được Client ghi nhận và gửi lên Server:
  $$t_1 = \text{estimate\_time\_seconds}, \quad t_2 = \text{exact\_time\_seconds} \quad (0 \le t_1, t_2 \le 60)$$

#### B. Công thức thưởng điểm theo tốc độ suy luận (Time-Bonus Tiers)
Hệ thống khuyến khích phản xạ nhẩm nhanh nhưng tuyệt đối không gây áp lực: Học sinh làm bài ở tốc độ cơ bản vẫn giữ trọn vẹn 100% điểm tư duy logic.

1. **Pha 1 (Ước lượng nhẩm) — Quỹ Time Bonus tối đa 15% tổng điểm ($P_{tb1} = 0.15 \times P$):**
   - $t_1 \le 15s$: **Tốc độ vàng (Gold Speed)** $\longrightarrow$ Thưởng **100%** quỹ time bonus:
     $$Score_{est\_time} = 1.0 \times 0.15 \times P = 0.15 \times P$$
   - $15s < t_1 \le 30s$: **Tốc độ tiêu chuẩn (Silver Speed)** $\longrightarrow$ Thưởng **50%** quỹ time bonus:
     $$Score_{est\_time} = 0.5 \times 0.15 \times P = 0.075 \times P$$
   - $30s < t_1 \le 60s$: **Tốc độ cơ bản (Bronze Speed)** $\longrightarrow$ Thưởng **0%** quỹ time bonus:
     $$Score_{est\_time} = 0 \times P \quad \text{(Vẫn giữ trọn vẹn 100% điểm Base Logic)}$$
   - **Điều kiện ràng buộc:** Chỉ kích hoạt thưởng Time Bonus Pha 1 khi điểm Base Logic $> 0$ (nghĩa là ước lượng nằm trong dải dung sai hoặc theo điểm neo). Nếu ước lượng sai hoàn toàn ($0\%$ Base), học sinh nhận $0$ điểm Time Bonus dù nộp trong $1$ giây.

2. **Pha 2 (Tính đúng & Mẹo bù trừ) — Quỹ Time Bonus tối đa 5% tổng điểm ($P_{tb2} = 0.05 \times P$):**
   - $t_2 \le 20s$: **Mẹo bù trừ siêu tốc / Tốc độ vàng** $\longrightarrow$ Thưởng **100%** quỹ time bonus:
     $$Score_{exact\_time} = 1.0 \times 0.05 \times P = 0.05 \times P$$
   - $20s < t_2 \le 40s$: **Đặt tính tiêu chuẩn ra nháp (Silver Speed)** $\longrightarrow$ Thưởng **50%** quỹ time bonus:
     $$Score_{exact\_time} = 0.5 \times 0.05 \times P = 0.025 \times P$$
   - $40s < t_2 \le 60s$: **Tốc độ cơ bản (Bronze Speed)** $\longrightarrow$ Thưởng **0%** quỹ time bonus:
     $$Score_{exact\_time} = 0 \times P \quad \text{(Vẫn giữ trọn 100% điểm Base Kết quả = 25% tổng điểm)}$$
   - **Điều kiện ràng buộc:** Chỉ kích hoạt thưởng Time Bonus Pha 2 khi học sinh tính **CHÍNH XÁC** kết quả đặt tính ($A_{given} == A_{exact}$).

---

### 6. Mô hình chuyển dịch trọng số: ƯỚC LƯỢNG CHIẾM 70% TỔNG ĐIỂM - TÍNH ĐÚNG CHIẾM 30% TỔNG ĐIỂM

Nhằm tôn vinh kỹ năng "cảm nhận số" (Number Sense) và đưa việc ước lượng thành năng lực tư duy trung tâm của học sinh lớp 3 theo đúng tinh thần SGK mới, cơ cấu điểm số câu hỏi được chuẩn hóa theo tỷ lệ **70 / 30**:

$$\text{Tổng điểm câu hỏi } (P) = \underbrace{70\% \times P}_{\text{Pha 1: Ước lượng nhẩm}} + \underbrace{30\% \times P}_{\text{Pha 2: Đặt tính tính đúng}}$$

Chi tiết các thành phần điểm:
```
┌────────────────────────────────────────────────────────────────────────┐
│                        TỔNG ĐIỂM CÂU HỎI (100% P)                      │
├─────────────────────────────────────────┬──────────────────────────────┤
│        PHA 1: ƯỚC LƯỢNG NHẨM (70%)      │    PHA 2: TÍNH ĐÚNG (30%)    │
├────────────────────┬────────────────────┼───────────────┬──────────────┤
│ 55% Base Logic     │ 15% Time Bonus     │ 25% Base K/Q  │ 5% Time Bonus│
│ (Phân cấp điểm neo)│ (Tốc độ nhẩm)      │ (Đặt tính)    │ (Tốc độ tính)│
└────────────────────┴────────────────────┴───────────────┴──────────────┘
```

- **Ví dụ với câu hỏi chuẩn 10 điểm ($P = 10$):**
  * Pha 1: Điểm Base tối đa $5.5$ điểm, Time Bonus tối đa $1.5$ điểm $\Rightarrow$ Tối đa $7.0$ điểm.
  * Pha 2: Điểm Base tối đa $2.5$ điểm, Time Bonus tối đa $0.5$ điểm $\Rightarrow$ Tối đa $3.0$ điểm.
  * Tổng điểm trọn vẹn: $7.0 + 3.0 = 10.0$ điểm.

---

### 7. Công thức kiểm tra ước lượng hợp lý & Tổng hợp điểm số tất định

Gọi:
- $A \in \mathbb{N}^+$: Kết quả tính toán chính xác của phép tính (đối với phép chia là thương nguyên).
- $E \in \mathbb{R}$: Giá trị ước lượng do học sinh nhập vào.
- $\Delta_{min}$: Ngưỡng chênh lệch tuyệt đối tối thiểu theo phép toán:
  * Đối với Phép cộng và Phép trừ 2 chữ số ($+$, $-$): $\Delta_{min} = \max(3, \lceil 0.15 \times A \rceil)$.
  * Đối với Phép nhân và Phép chia ($\times$, $:$): $\Delta_{min} = \max(2, \lceil 0.15 \times A \rceil)$.

- Công thức tính điểm tổng hợp của câu hỏi:
  $$Score_{total} = \Big(P \times 0.55 \times \text{AnchorRatio}(E) + P \times 0.15 \times \text{TimeRatio}_1\Big) + \Big(P \times 0.25 \times \text{ExactValid} + P \times 0.05 \times \text{TimeRatio}_2\Big)$$

Trong đó:
- $\text{AnchorRatio}(E) \in \{1.0, 0.75, 0.50, 0.35, 0.0\}$ theo kết quả phân cấp điểm neo tại Mục 4.
- $\text{TimeRatio}_1 \in \{1.0, 0.5, 0.0\}$ (chỉ khác 0 nếu $\text{AnchorRatio} > 0$).
- $\text{ExactValid} \in \{1, 0\}$ ($= 1$ nếu $A_{given} == A$).
- $\text{TimeRatio}_2 \in \{1.0, 0.5, 0.0\}$ (chỉ khác 0 nếu $\text{ExactValid} == 1$).

---

### 8. Mã nguồn chuẩn hóa hoàn chỉnh: `server/scoring.js`

Module tính điểm độc lập, chạy trên Node.js thuần, tích hợp đầy đủ 4 phép tính, Hierarchical Anchor Matching, Time-Bonus Tiers và tỷ trọng 70/30:

```javascript
'use strict';

/**
 * Quy tắc làm tròn số tự nhiên về hàng chục gần nhất theo chuẩn SGK Toán 3
 * (1, 2, 3, 4 -> làm tròn xuống; 5, 6, 7, 8, 9 -> làm tròn lên)
 */
function roundToTen(n) {
  const num = Math.round(Number(n));
  if (isNaN(num)) return 0;
  const unit = Math.abs(num) % 10;
  if (unit === 0) return num;
  if (unit < 5) return num - unit;
  return num + (10 - unit);
}

/**
 * Tính điểm neo Vàng (Gold Anchor) chuẩn SGK Toán 3 Kết nối tri thức
 */
function calculateGoldAnchor(operation, op1, op2) {
  const o1 = Number(op1);
  const o2 = Number(op2);
  switch (operation) {
    case '+':
      return roundToTen(o1) + roundToTen(o2);
    case '-':
      return roundToTen(o1) - roundToTen(o2);
    case '*':
    case 'x':
    case '×':
      return roundToTen(o1) * o2;
    case ':':
    case '/':
    case '÷':
      return o2 !== 0 ? Math.round(roundToTen(o1) / o2) : 0;
    default:
      return 0;
  }
}

/**
 * Tập hợp các điểm neo Bạc (Silver Anchors - làm tròn 1 số hoặc cận tròn chục)
 */
function calculateSilverAnchors(operation, op1, op2) {
  const o1 = Number(op1);
  const o2 = Number(op2);
  const anchors = new Set();

  if (operation === '+') {
    // Làm tròn 1 số, giữ nguyên số còn lại
    anchors.add(roundToTen(o1) + o2);
    anchors.add(o1 + roundToTen(o2));
    // Cận dưới (cùng floor hàng chục) & Cận trên (cùng ceil hàng chục)
    const floor1 = Math.floor(o1 / 10) * 10;
    const floor2 = Math.floor(o2 / 10) * 10;
    const ceil1 = Math.ceil(o1 / 10) * 10;
    const ceil2 = Math.ceil(o2 / 10) * 10;
    anchors.add(floor1 + floor2);
    anchors.add(ceil1 + ceil2);
  } else if (operation === '-') {
    anchors.add(roundToTen(o1) - o2);
    anchors.add(o1 - roundToTen(o2));
    const floor1 = Math.floor(o1 / 10) * 10;
    const floor2 = Math.floor(o2 / 10) * 10;
    const ceil1 = Math.ceil(o1 / 10) * 10;
    const ceil2 = Math.ceil(o2 / 10) * 10;
    anchors.add(floor1 - floor2);
    anchors.add(ceil1 - ceil2);
  } else if (operation === '*' || operation === 'x' || operation === '×') {
    const floor1 = Math.floor(o1 / 10) * 10;
    const ceil1 = Math.ceil(o1 / 10) * 10;
    anchors.add(floor1 * o2);
    anchors.add(ceil1 * o2);
  } else if (operation === ':' || operation === '/' || operation === '÷') {
    if (o2 !== 0) {
      const floor1 = Math.floor(o1 / 10) * 10;
      const ceil1 = Math.ceil(o1 / 10) * 10;
      anchors.add(Math.round(floor1 / o2));
      anchors.add(Math.round(ceil1 / o2));
    }
  }

  const gold = calculateGoldAnchor(operation, op1, op2);
  anchors.delete(gold);
  return Array.from(anchors).filter(v => v > 0);
}

/**
 * Tính ngưỡng chênh lệch tuyệt đối Delta_min tối thiểu cho dải dung sai +-15%
 */
function getDeltaMin(operation, exact) {
  const a = Math.abs(Number(exact));
  const baseDelta = Math.ceil(0.15 * a);
  if (operation === '+' || operation === '-') {
    return Math.max(3, baseDelta);
  }
  return Math.max(2, baseDelta);
}

/**
 * Phân cấp điểm neo logic cho Pha 1 (Hierarchical Anchor Matching)
 * @returns {{ tier: string, baseRatio: number, badge: string, feedback: string }}
 */
function matchEstimateAnchor(rule, estNum) {
  const operation = rule.operation || '+';
  const exact = Number(rule.exact);
  const goldAnchor = rule.rounded_anchor || calculateGoldAnchor(operation, rule.operand1, rule.operand2);
  const silverAnchors = calculateSilverAnchors(operation, rule.operand1, rule.operand2);
  const deltaMin = getDeltaMin(operation, exact);

  // 1. Điểm neo Vàng: Chuẩn SGK làm tròn cả 2 số đến hàng chục
  if (estNum === goldAnchor) {
    return {
      tier: 'GOLD_ANCHOR',
      baseRatio: 1.0, // 100% Base Score (55% tổng điểm)
      badge: 'VÀNG',
      feedback: `Xuất sắc! Em ước lượng ${estNum} chuẩn theo điểm neo SGK (làm tròn số tròn chục). 🥇`
    };
  }

  // 2. Điểm neo Bạc: Làm tròn 1 số hoặc cận tròn chục dưới/trên
  if (silverAnchors.includes(estNum)) {
    return {
      tier: 'SILVER_ANCHOR',
      baseRatio: 0.75, // 75% Base Score (41.25% tổng điểm)
      badge: 'BẠC',
      feedback: `Rất tốt! Em ước lượng ${estNum} theo chiến lược làm tròn linh hoạt hợp lý. 🥈`
    };
  }

  // 3. Học sinh nhập đáp án tính đúng vào ô ước lượng (E_given == A_exact với A_exact lẻ)
  if (estNum === exact) {
    return {
      tier: 'EXACT_MATCH_IN_ESTIMATE',
      baseRatio: 0.50, // 50% Base Score (27.5% tổng điểm)
      badge: 'ĐỒNG',
      feedback: `Em tính nhẩm ra đúng kết quả ${estNum}! Tuy nhiên, ở bước ước lượng, em nên làm tròn thành số tròn chục (ví dụ ${goldAnchor}) để kiểm tra nhanh nhé! 💡`
    };
  }

  // 4. Nằm trong dải dung sai +-15% nhưng KHÔNG theo điểm neo logic (Đoán mò / gõ số lẻ)
  const minBound = rule.estimate_min != null ? Number(rule.estimate_min) : exact - deltaMin;
  const maxBound = rule.estimate_max != null ? Number(rule.estimate_max) : exact + deltaMin;
  const inTolerance = (Math.abs(estNum - exact) <= deltaMin) || (estNum >= minBound && estNum <= maxBound);

  if (inTolerance) {
    return {
      tier: 'TOLERANCE_ONLY',
      baseRatio: 0.35, // 35% Base Score (19.25% tổng điểm - Điểm khuyến khích)
      badge: 'KHUYẾN KHÍCH',
      feedback: `Ước lượng ${estNum} nằm trong khoảng gần đúng. Gợi ý: Em hãy làm tròn về số tròn chục (${goldAnchor}) để nhẩm nhanh và chính xác hơn nhé! 🌱`
    };
  }

  // 5. Nằm ngoài dải dung sai
  return {
    tier: 'OUT_OF_RANGE',
    baseRatio: 0.0, // 0%
    badge: 'CẦN CỐ GẮNG',
    feedback: `Ước lượng ${estNum} chưa thật sát. ${rule.explanation || `Em hãy làm tròn các số về hàng chục gần nhất để được ${goldAnchor} nhé!`} ✏️`
  };
}

/**
 * Đánh giá Time-Bonus Tiers theo thời gian thao tác từng pha
 * @param {number} t1 Thời gian ước lượng (giây)
 * @param {number} t2 Thời gian tính đúng (giây)
 */
function evaluateTimeBonus(t1, t2) {
  // Chuẩn hóa thời gian (0 <= t <= 60s)
  const timeEst = Math.min(60, Math.max(0, Number(t1) || 60));
  const timeExact = Math.min(60, Math.max(0, Number(t2) || 60));

  // Pha 1: Tối đa 15% tổng điểm
  let estTimeRatio = 0;
  let estSpeedTier = 'BRONZE_SPEED'; // 30-60s: 0% bonus
  if (timeEst <= 15) {
    estTimeRatio = 1.0; // 100% time bonus
    estSpeedTier = 'GOLD_SPEED';
  } else if (timeEst <= 30) {
    estTimeRatio = 0.5; // 50% time bonus
    estSpeedTier = 'SILVER_SPEED';
  }

  // Pha 2: Tối đa 5% tổng điểm
  let exactTimeRatio = 0;
  let exactSpeedTier = 'BRONZE_SPEED'; // 40-60s: 0% bonus
  if (timeExact <= 20) {
    exactTimeRatio = 1.0; // 100% time bonus (Mẹo bù trừ siêu tốc)
    exactSpeedTier = 'GOLD_SPEED';
  } else if (timeExact <= 40) {
    exactTimeRatio = 0.5; // 50% time bonus (Đặt tính tiêu chuẩn)
    exactSpeedTier = 'SILVER_SPEED';
  }

  return {
    timeEst,
    timeExact,
    estTimeRatio,
    estSpeedTier,
    exactTimeRatio,
    exactSpeedTier
  };
}

/**
 * Thuật toán đánh giá câu hỏi ước lượng theo mô hình 70/30 và Time-Bonus Tiers
 * @param {Object} rule Quy tắc chấm từ correct_answer
 * @param {Object} studentAnswer { estimate, exact, estimate_time_seconds, exact_time_seconds }
 * @returns {Object} Kết quả đánh giá chi tiết
 */
function evaluateEstimateQuestion(rule, studentAnswer) {
  const operation = rule.operation || '+';
  const exactExpected = Number(rule.exact);
  const totalPoints = rule.points || 10;

  // Trọng số chuyển dịch: Ước lượng 70% (55% Base + 15% Speed), Tính đúng 30% (25% Base + 5% Speed)
  const WEIGHTS = {
    estBase: 0.55,
    estSpeed: 0.15,
    exactBase: 0.25,
    exactSpeed: 0.05
  };

  // 1. Chuẩn hóa & kiểm tra hợp lệ dữ liệu nhập
  const rawEst = studentAnswer && studentAnswer.estimate != null ? String(studentAnswer.estimate).trim() : '';
  const rawExact = studentAnswer && studentAnswer.exact != null ? String(studentAnswer.exact).trim() : '';
  const estTimeSec = studentAnswer ? studentAnswer.estimate_time_seconds : 60;
  const exactTimeSec = studentAnswer ? studentAnswer.exact_time_seconds : 60;

  const estNum = Number(rawEst);
  const exactNum = Number(rawExact);

  const isEstValid = rawEst !== '' && !isNaN(estNum) && isFinite(estNum) && estNum > 0;
  const isExactValid = rawExact !== '' && !isNaN(exactNum) && isFinite(exactNum) && exactNum >= 0;

  // 2. Đánh giá Pha 1: Ước lượng nhẩm phân cấp điểm neo (Hierarchical Anchor Matching)
  let anchorResult = {
    tier: 'OUT_OF_RANGE',
    baseRatio: 0.0,
    badge: 'CẦN CỐ GẮNG',
    feedback: 'Vui lòng nhập số ước lượng hợp lệ.'
  };

  if (isEstValid) {
    anchorResult = matchEstimateAnchor(rule, estNum);
  }

  const isEstimateOk = anchorResult.baseRatio > 0;
  const pointsEstBase = Math.round(totalPoints * WEIGHTS.estBase * anchorResult.baseRatio * 100) / 100;

  // 3. Đánh giá Pha 2: Tính đúng kết quả
  const isExactOk = isExactValid && Math.round(exactNum) === exactExpected;
  const pointsExactBase = isExactOk ? Math.round(totalPoints * WEIGHTS.exactBase * 100) / 100 : 0;

  // 4. Đánh giá Tốc độ & Time-Bonus Tiers (Chỉ thưởng khi học sinh có tư duy đúng)
  const timeEval = evaluateTimeBonus(estTimeSec, exactTimeSec);
  
  // Time bonus Pha 1 chỉ cộng khi học sinh đạt Base ước lượng > 0
  const pointsEstTime = isEstimateOk
    ? Math.round(totalPoints * WEIGHTS.estSpeed * timeEval.estTimeRatio * 100) / 100
    : 0;

  // Time bonus Pha 2 chỉ cộng khi kết quả tính đúng
  const pointsExactTime = isExactOk
    ? Math.round(totalPoints * WEIGHTS.exactSpeed * timeEval.exactTimeRatio * 100) / 100
    : 0;

  // 5. Tổng hợp điểm số & trạng thái hoàn thành
  const earnedEstPoints = Math.round((pointsEstBase + pointsEstTime) * 100) / 100;
  const earnedExactPoints = Math.round((pointsExactBase + pointsExactTime) * 100) / 100;
  const earnedPoints = Math.round((earnedEstPoints + earnedExactPoints) * 100) / 100;
  const isFullyCorrect = isEstimateOk && isExactOk;

  // Phản hồi Pha 2
  const opSymbol = rule.operation === '*' ? '×' : rule.operation === '/' ? ':' : rule.operation;
  const expression = rule.operand1 != null && rule.operand2 != null
    ? `${rule.operand1} ${opSymbol} ${rule.operand2} = ${rule.exact}`
    : `kết quả đúng là ${rule.exact}`;

  let feedbackExact = '';
  if (isExactOk) {
    const speedNote = timeEval.exactSpeedTier === 'GOLD_SPEED' ? ' Em áp dụng mẹo bù trừ tính nhẩm siêu tốc! ⚡' : '';
    feedbackExact = `Chính xác! Phép tính ${expression}.${speedNote} Em làm bài rất cẩn thận! 👏`;
  } else {
    feedbackExact = `Chưa chính xác rồi. Phép tính đúng là: ${expression}. Em hãy kiểm tra lại nhé! ✏️`;
  }

  return {
    isEstimateOk,
    isExactOk,
    isFullyCorrect,
    anchorTier: anchorResult.tier,
    badge: anchorResult.badge,
    timeEval: {
      timeEst: timeEval.timeEst,
      timeExact: timeEval.timeExact,
      estSpeedTier: timeEval.estSpeedTier,
      exactSpeedTier: timeEval.exactSpeedTier
    },
    scoringBreakdown: {
      estimateBase: pointsEstBase,
      estimateTime: pointsEstTime,
      estimateTotal: earnedEstPoints,
      exactBase: pointsExactBase,
      exactTime: pointsExactTime,
      exactTotal: earnedExactPoints
    },
    earnedPoints,
    maxPoints: totalPoints,
    expected: {
      exact: exactExpected,
      goldAnchor: rule.rounded_anchor || calculateGoldAnchor(operation, rule.operand1, rule.operand2),
      silverAnchors: calculateSilverAnchors(operation, rule.operand1, rule.operand2),
      estimateRange: [rule.estimate_min, rule.estimate_max]
    },
    feedbackEstimate: anchorResult.feedback,
    feedbackExact,
    explanation: rule.explanation || `Điểm neo làm tròn SGK là ${rule.rounded_anchor || calculateGoldAnchor(operation, rule.operand1, rule.operand2)}. ${expression}.`
  };
}

module.exports = {
  roundToTen,
  calculateGoldAnchor,
  calculateSilverAnchors,
  getDeltaMin,
  matchEstimateAnchor,
  evaluateTimeBonus,
  evaluateEstimateQuestion
};
```

---

## ADR-02: Thiết kế Schema CSDL SQLite mở rộng (Non-Breaking Extension) tương thích 4 phép tính

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt)

### 2. Hiện trạng CSDL SQLite (`server/db.js`)
Bảng `questions` hiện hữu có cấu trúc:
```sql
CREATE TABLE IF NOT EXISTS questions (
  id             TEXT PRIMARY KEY,
  set_id         TEXT NOT NULL,
  lesson_id      TEXT,
  type           TEXT NOT NULL,     -- 'multiple-choice', 'input', 'compare', 'paint'
  prompt         TEXT NOT NULL,
  options_json   TEXT,
  correct_answer TEXT NOT NULL,     -- Hiện đang lưu chuỗi phẳng
  points         INTEGER NOT NULL DEFAULT 1,
  category       TEXT DEFAULT '',
  sort_order     INTEGER NOT NULL
);
```

### 3. Quyết định mở rộng phi phá vỡ (Non-Breaking JSON Storage)
Thay vì thực hiện `ALTER TABLE` thêm các cột mới như `estimate_min`, `estimate_max`, `exact_result` (gây rủi ro lỗi cú pháp trên các bản backup SQLite có sẵn, đòi hỏi viết lại toàn bộ seeder `seedIfEmpty` và làm phức tạp hóa các câu lệnh `INSERT` của giáo viên), chúng tôi quyết định:
- Với câu hỏi cũ (`multiple-choice`, `input`, `compare`, `paint`): Cột `correct_answer` tiếp tục lưu chuỗi phẳng (ví dụ: `"A"`, `"9"`, `"="`, `"green"`).
- Với câu hỏi ước lượng mới: Đặt `type = 'estimate'`, và lưu trữ cấu trúc JSON hoàn chỉnh ngay trong cột `correct_answer`.

### 4. Đặc tả JSON lưu trữ cho CẢ 4 PHÉP TÍNH

#### A. Phép cộng 2 chữ số (Addition)
```json
{
  "operation": "+",
  "operand1": 38,
  "operand2": 47,
  "exact": 85,
  "rounded_anchor": 90,
  "estimate_min": 75,
  "estimate_max": 95,
  "rounding_rules": { "op1_rounded": 40, "op2_rounded": 50 },
  "explanation": "Làm tròn 38 -> 40, 47 -> 50. Nhẩm ước lượng: 40 + 50 = 90. Đặt tính: 38 + 47 = 85."
}
```

#### B. Phép trừ 2 chữ số (Subtraction)
```json
{
  "operation": "-",
  "operand1": 73,
  "operand2": 28,
  "exact": 45,
  "rounded_anchor": 40,
  "estimate_min": 35,
  "estimate_max": 55,
  "rounding_rules": { "op1_rounded": 70, "op2_rounded": 30 },
  "explanation": "Làm tròn 73 -> 70, 28 -> 30. Nhẩm ước lượng: 70 - 30 = 40. Đặt tính: 73 - 28 = 45."
}
```

#### C. Phép nhân (Multiplication)
```json
{
  "operation": "*",
  "operand1": 29,
  "operand2": 3,
  "exact": 87,
  "rounded_anchor": 90,
  "estimate_min": 75,
  "estimate_max": 100,
  "rounding_rules": { "op1_rounded": 30, "op2_same": 3 },
  "explanation": "Làm tròn 29 -> 30. Nhẩm ước lượng: 30 × 3 = 90. Đặt tính: 29 × 3 = 87."
}
```

#### D. Phép chia (Division)
```json
{
  "operation": ":",
  "operand1": 178,
  "operand2": 6,
  "exact": 29,
  "rounded_anchor": 30,
  "estimate_min": 25,
  "estimate_max": 35,
  "rounding_rules": { "op1_rounded": 180, "op2_same": 6 },
  "explanation": "Làm tròn 178 -> 180. Nhẩm ước lượng: 180 : 6 = 30. Đặt tính: 178 : 6 = 29 (dư 4)."
}
```

---

## ADR-03: Thiết kế API Contract, Cơ chế chấm 2 tầng & Bảo mật đáp án Server-side

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt)

### 2. Bảo mật chống lộ đáp án tại `GET /api/question-sets/:setId/questions` (B-04)
Đề thi quy định bắt buộc: Học sinh mở Inspect Network hoặc đọc mã nguồn trang web tuyệt đối không thể thấy đáp án đúng, khoảng dung sai hay điểm neo trước khi hoàn thành bài nộp.

**Triển khai an toàn tại `server/api.js`:**
```javascript
router.get('/question-sets/:setId/questions', requireAuth, (req, res) => {
  // Chỉ SELECT các trường phục vụ hiển thị, TUYỆT ĐỐI KHÔNG SELECT correct_answer
  const rows = db.prepare(`
    SELECT id, type, prompt, options_json, points, category, sort_order 
    FROM questions WHERE set_id=? ORDER BY sort_order
  `).all(req.params.setId);
  
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy bộ câu hỏi.' });

  res.json({
    setId: req.params.setId,
    questions: rows.map(r => ({
      id: r.id,
      type: r.type,
      prompt: r.prompt,
      points: r.points,
      category: r.category,
      options: r.options_json ? JSON.parse(r.options_json) : undefined
    }))
  });
});
```

### 3. API Contract nộp bài & Phản hồi 2 tầng tại `POST /api/submissions`

- **Request Body gửi từ Client (Bổ sung tham số thời gian từng pha):**
```json
{
  "setId": "uoc-luong-toan-3-tong-hop",
  "answers": {
    "est-add-01": { 
      "estimate": 90, 
      "exact": 85, 
      "estimate_time_seconds": 12, 
      "exact_time_seconds": 18 
    },
    "est-sub-01": { 
      "estimate": 40, 
      "exact": 45, 
      "estimate_time_seconds": 14, 
      "exact_time_seconds": 22 
    },
    "est-mul-01": { 
      "estimate": 90, 
      "exact": 87, 
      "estimate_time_seconds": 10, 
      "exact_time_seconds": 15 
    },
    "est-div-01": { 
      "estimate": 30, 
      "exact": 29, 
      "estimate_time_seconds": 15, 
      "exact_time_seconds": 25 
    }
  },
  "durationSec": 150
}
```

- **Logic chấm phân nhánh trên Server:**
```javascript
const detail = questions.map(q => {
  max += q.points;
  if (q.type === 'estimate') {
    let rule = {};
    try { rule = JSON.parse(q.correct_answer); } catch (_) {}
    rule.points = q.points;
    const evalRes = evaluateEstimateQuestion(rule, answers[q.id]);
    earned += evalRes.earnedPoints;
    if (evalRes.isFullyCorrect || evalRes.isExactOk) correct++;
    return {
      questionId: q.id,
      type: 'estimate',
      correct: evalRes.isFullyCorrect,
      isEstimateOk: evalRes.isEstimateOk,
      isExactOk: evalRes.isExactOk,
      anchorTier: evalRes.anchorTier,
      badge: evalRes.badge,
      timeEval: evalRes.timeEval,
      scoringBreakdown: evalRes.scoringBreakdown,
      earnedPoints: evalRes.earnedPoints,
      maxPoints: q.points,
      given: answers[q.id],
      expected: evalRes.expected,
      feedbackEstimate: evalRes.feedbackEstimate,
      feedbackExact: evalRes.feedbackExact,
      explanation: evalRes.explanation
    };
  } else {
    // Logic so khớp chuỗi truyền thống cho 4 dạng câu hỏi cũ
    const given = answers[q.id] == null ? '' : String(answers[q.id]).trim().toLowerCase();
    const ok = given === String(q.correct_answer).trim().toLowerCase();
    if (ok) { earned += q.points; correct++; }
    return { questionId: q.id, type: q.type, correct: ok, correctAnswer: q.correct_answer };
  }
});
```

- **Tính bền vững dữ liệu qua SQLite Transaction (B-05):**
Toàn bộ việc lưu trữ `attempts`, cập nhật điểm tốt nhất trong `progress` và cộng dồn `total_stars` được thực hiện đồng bộ trong `const tx = db.transaction(...)`. Khi học sinh nhấn F5 (Reload trang), kết quả được phục hồi 100% từ SQLite.

---

## ADR-04: Thiết kế Trải nghiệm Người dùng (UX thẻ 2 pha) & Khả năng tiếp cận Accessibility

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt & Bổ sung Countdown Timer + Huy hiệu Logic)

### 2. Thẻ tương tác 2 pha (Phased Interaction Card) kèm Visual Countdown Timer 60s
Giao diện trực quan dành riêng cho học sinh 8–9 tuổi, tích hợp đồng hồ đếm ngược trực quan tối đa 60 giây cho mỗi pha làm bài:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Câu 1 • 10 điểm • Phép cộng ước lượng                                   │
│ 38 + 47 = ?                                  ⏱️ Đếm ngược: [████░░] 28s │
├────────────────────────────────────────────────────────────────────────┤
│ 🐝 Ong Vàng mách nước: Em hãy làm tròn 38 và 47 về hàng chục để nhẩm! │
│                                                                        │
│ [Pha 1: Ước lượng nhẩm]  (Tối đa 60s • 70% tổng điểm)                  │
│ Em đoán kết quả khoảng: [  90  ]  (Số tròn chục: 80, 90, 100...)       │
│                                                                        │
│ [Pha 2: Đặt tính tính đúng]  (Tối đa 60s • 30% tổng điểm)              │
│ Kết quả chính xác là:   [  85  ]                                       │
└────────────────────────────────────────────────────────────────────────┘
```

#### Chi tiết tương tác của Visual Countdown Timer:
- **Tiến trình thời gian màu sắc động:**
  * **Xanh lá tươi (`#10B981`):** Thời gian còn $30s - 60s$. Trạng thái thoải mái, tập trung tư duy.
  * **Vàng hổ phách (`#F59E0B`):** Thời gian còn $15s - 30s$. Nhắc nhở sắp hết mốc Tốc độ vàng.
  * **Đỏ cảnh báo nhấp nháy (`#EF4444` pulse):** Thời gian dưới $15s$. Báo hiệu học sinh chuẩn bị chốt số.
- **Tự động chuyển pha khi hết giờ:**
  * Khi hết 60s ở Pha 1: Input ước lượng được khóa (readonly), timer tự động reset về 60s cho Pha 2, con trỏ phím tự động nhảy sang ô Đặt tính chính xác.
  * Khi hết 60s ở Pha 2: Input tính đúng được khóa, hệ thống hiển thị thông báo sẵn sàng nộp bài.
- **Client-side Recording:** Đo lường chính xác `estimate_time_seconds` và `exact_time_seconds` gửi kèm payload nộp bài.

### 3. Phản hồi huy hiệu logic (Logic Badges) & Gợi ý sư phạm cá nhân hóa (B-06)
Sau khi nộp bài, mỗi thẻ câu hỏi hiển thị bảng tổng kết chi tiết gồm huy hiệu đạt được và gợi ý sư phạm 2 tầng:

1. **Hệ thống Huy hiệu Logic (Pedagogical Logic Badges):**
   - 🥇 **Huy hiệu Vàng (Gold Badge):** Đạt điểm neo chuẩn SGK (Gold Anchor) và hoàn thành trong mốc Tốc độ vàng ($\le 15s$). Biểu dương phản xạ nhẩm siêu đẳng.
   - 🥈 **Huy hiệu Bạc (Silver Badge):** Đạt điểm neo linh hoạt (Silver Anchor) hoặc đạt Tốc độ tiêu chuẩn ($15-30s$).
   - 🥉 **Huy hiệu Đồng (Bronze Badge):** Học sinh tính ra kết quả đúng rồi điền vào ô ước lượng, hoặc làm bài ở tốc độ cơ bản ($30-60s$).
   - 🌱 **Huy hiệu Khuyến khích (Encouragement Badge):** Ước lượng nằm trong khoảng dung sai $\pm 15\%$ nhưng gõ bừa số lẻ; hệ thống khích lệ và hướng dẫn cách làm tròn số tròn chục.

2. **Gợi ý sư phạm động ngữ cảnh (Contextual Pedagogical Hints):**
   - *Tình huống 1 (Làm tròn chuẩn SGK):* *"Xuất sắc! Em đã làm tròn 38 thành 40, 47 thành 50 và nhẩm 40 + 50 = 90 cực kỳ chuẩn xác! 🎉"*
   - *Tình huống 2 (Dùng điểm neo linh hoạt):* *"Rất tốt! Em đã sử dụng mẹo làm tròn một số để nhẩm nhanh. Hãy thử làm tròn cả hai số xem sao nhé! 🥈"*
   - *Tình huống 3 (Gõ đáp án đúng vào ô ước lượng):* *"Ong Vàng khen em tính nhẩm rất cừ khi ra đúng 85! Tuy nhiên, ở bước ước lượng, mục tiêu là làm tròn số tròn chục (như 90) để phát hiện lỗi sai nhanh hơn em nhé! 💡"*
   - *Tình huống 4 (Gõ số lẻ trong dải dung sai):* *"Ước lượng của em khá gần rồi. Nhưng thay vì đoán mò số lẻ 83, em hãy làm tròn 38 $\rightarrow$ 40, 47 $\rightarrow$ 50 để ra ngay số tròn chục 90 nhé! 🌱"*
   - *Tình huống 5 (Mẹo tính nhanh Pha 2):* *"Quá nhanh! Em chỉ mất 12 giây để tính ra 85, em đã dùng mẹo bù trừ: $38 + 50 - 3 = 85$ đúng không nào? ⚡"*

### 4. Khả năng tiếp cận Accessibility (A11y - B-12)
- **Điều hướng phím Tab tuần tự:**
  $$\text{Ô Ước lượng (Tab)} \longrightarrow \text{Ô Kết quả đúng (Tab)} \longrightarrow \text{Câu tiếp theo (hoặc Nút Nộp)}$$
- **Phím Enter thông minh:** Nhấn `Enter` tại ô Pha 1 sẽ chốt giá trị ước lượng và tự động chuyển con trỏ xuống ô Pha 2; nhấn `Enter` tại ô Pha 2 sẽ chuyển sang câu hỏi tiếp theo.
- **ARIA Live Region (`role="timer"` & `aria-live="polite"`):** Hỗ trợ học sinh sử dụng Screen Reader nghe thông báo thời gian còn lại ở các mốc quan trọng (30 giây, 15 giây, hết giờ) mà không làm gián đoạn việc nhập liệu.
- **Vòng lấy nét tương phản cao:** Sử dụng lớp `focus:ring-4 focus:ring-primary-fixed focus:outline-none` đảm bảo học sinh nhìn rõ vị trí con trỏ bàn phím.
- **Ngôn ngữ sư phạm thân thiện:** Văn phong tiếng Việt khích lệ, gần gũi, dùng hình tượng chú Ong Vàng chăm chỉ hướng dẫn học tập.

---

## ADR-05: Chiến lược Kiểm thử tự động (Unit & Integration) bao phủ 4 phép tính & CI Pipeline

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt & Bổ sung Test Cases Time-Bonus + Hierarchical Anchors)

### 2. Công nghệ kiểm thử & Tài liệu kế hoạch chi tiết
- Sử dụng **Jest 29** (kèm `supertest` để kiểm thử HTTP API trên Express).
- Cấu hình chạy nhanh, không cần build step, tương thích Node 20 LTS.
- **Tài liệu hiện thực hóa chi tiết:** Toàn bộ kế hoạch kiểm thử tự động, bảng ma trận ca kiểm thử (Normal, Boundary, Invalid, Time-Bonus Tiers, Hierarchical Anchor Matching, Tỷ trọng 70/30) cho cả 4 phép tính, kịch bản integration tests và tiêu chí nghiệm thu A11y được đặc tả chi tiết tại tài liệu [`artifacts/TEST_PLAN.md`](TEST_PLAN.md).

### 3. Ma trận kiểm thử tự động (Test Matrix) bao phủ CẢ 4 PHÉP TÍNH

> 📄 **Hiện thực hóa ma trận kiểm thử:** Bảng ca kiểm thử chi tiết từng giá trị đầu vào, điểm neo sư phạm SGK Toán 3, kỳ vọng đầu ra và kịch bản bảo mật/giao dịch được đặc tả đầy đủ trong tài liệu [artifacts/TEST_PLAN.md](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/artifacts/TEST_PLAN.md) (hoặc [`artifacts/TEST_PLAN.md`](TEST_PLAN.md)).

```
tests/
├── unit/
│   └── scoring.test.js          # Kiểm thử thuật toán ước lượng tất định 4 phép tính & Time Bonus
│       ├── 1. Phép toán 4 dạng & Điểm neo chuẩn SGK
│       │   ├── Phép cộng 2 chữ số (+): 38 + 47 (Gold: 90, Exact: 85)
│       │   ├── Phép trừ 2 chữ số (-): 73 - 28 (Gold: 40, Exact: 45)
│       │   ├── Phép nhân (×): 29 × 3 (Gold: 90, Exact: 87)
│       │   └── Phép chia (:): 178 : 6 (Gold: 30, Exact: 29)
│       ├── 2. Phân cấp điểm neo logic (Hierarchical Anchor Matching)
│       │   ├── Gold Anchor: 100% Base Score (55% tổng điểm)
│       │   ├── Silver Anchor: 75% Base Score (41.25% tổng điểm)
│       │   ├── Exact in Estimate: 50% Base Score (27.5% tổng điểm)
│       │   ├── Tolerance Only non-anchor: 35% Base Score (19.25% tổng điểm)
│       │   └── Out of Range: 0% Score
│       ├── 3. Thưởng tốc độ (Time-Bonus Tiers)
│       │   ├── Pha 1: <=15s (100% bonus = 15%), 15-30s (50% bonus = 7.5%), 30-60s (0% bonus)
│       │   ├── Pha 2: <=20s (100% bonus = 5%), 20-40s (50% bonus = 2.5%), 40-60s (0% bonus)
│       │   └── Anti-Cheat: Base = 0 hoặc sai đáp án -> Không thưởng Time Bonus
│       ├── 4. Trọng số chuyển dịch 70/30 (55 + 15 / 25 + 5)
│       └── 5. Boundary & Invalid Inputs (Thời gian âm, >60s, NaN, chuỗi ký tự, rỗng)
└── integration/
    ├── api_security.test.js     # Tiêu chí B-04 (Chống lộ đáp án khi GET /questions)
    └── api_submissions.test.js  # Tiêu chí B-05 & B-06 (Chấm 2 tầng 4 phép tính, Time Payload & F5 bền vững)
```

### 4. Quy trình CI Pipeline tự động (`.github/workflows/ci.yml` - B-10)
Pipeline được kích hoạt tự động trên các sự kiện `push` và `pull_request` vào nhánh `main` và nhánh nộp bài:
1. `actions/checkout@v4`: Kéo toàn bộ mã nguồn.
2. `actions/setup-node@v4`: Khởi tạo môi trường Node.js 20 LTS.
3. `npm ci`: Cài đặt dependencies sạch từ `package-lock.json`.
4. `npm test`: Thực thi toàn bộ Unit và Integration tests, bảo đảm pass 100% không cảnh báo lỗi.

---

## ⚖️ TỔNG HỢP SO SÁNH CÁC PHƯƠNG ÁN & ĐÁNH GIÁ ĐỘ ĐÁNH ĐỔI (TRADE-OFFS)

| Phương án xem xét | Ưu điểm | Nhược điểm | Đánh giá & Kết luận |
|:---|:---|:---|:---|
| **P/A 1: Dùng LLM lúc runtime để chấm ước lượng** | Có thể hiểu được ngôn ngữ tự nhiên của học sinh | Vi phạm tiêu chí B-03, độ trễ cao, phụ thuộc mạng ngoài, không tất định, tốn chi phí | ❌ **Loại bỏ** |
| **P/A 2: ALTER TABLE bảng `questions` thêm cột** | Các cột tường minh trong schema SQL | Nguy cơ làm hỏng file CSDL cũ `vuon-toan.db`, vi phạm B-07, phải sửa nhiều câu lệnh INSERT | ❌ **Loại bỏ** |
| **P/A 3: Giữ nguyên Schema, lưu JSON trong `correct_answer`** | Hoàn toàn tương thích ngược, an toàn 100% với CSDL cũ, linh hoạt mở rộng cho cả 4 phép tính | Cần parse JSON khi chấm câu hỏi `type = 'estimate'` | ✅ **Lựa chọn chính thức (ADR-02)** |
| **P/A 4: Chỉ áp dụng ước lượng cho Nhân & Chia** | Phạm vi hẹp hơn, dễ cài đặt ban đầu | Không bao phủ đầy đủ chương trình Toán 3 (thiếu Cộng/Trừ có nhớ 2 chữ số theo SGK) | ❌ **Mở rộng toàn diện lên 4 phép tính (ADR-01)** |