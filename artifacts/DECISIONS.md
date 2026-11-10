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

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt & Mở rộng tổng quát)

### 2. Bối cảnh & Yêu cầu sư phạm
Theo Chương trình GDPT 2018 và bộ sách giáo khoa **Toán 3 — Kết nối tri thức với cuộc sống**, kỹ năng ước lượng kết quả phép tính giúp học sinh xây dựng trực giác số (Number Sense), phát hiện sai lệch lớn trước khi đặt tính.

Trong hệ thống cũ, bài kiểm tra chỉ so sánh chuỗi bằng nhau tuyệt đối: `given === String(q.correct_answer).trim().toLowerCase()`. Với dạng bài mới *"Ước lượng trước khi tính đúng"*, học sinh cần thực hiện 2 thao tác:
1. **Pha 1 (Ước lượng):** Quan sát phép tính, làm tròn nhẩm trong đầu theo quy tắc làm tròn đến hàng chục để đưa ra con số ước lượng.
2. **Pha 2 (Tính đúng):** Thực hiện đặt tính ra nháp để tìm kết quả chính xác.

**Bài toán đặt ra:** Hệ thống phải hỗ trợ thuật toán ước lượng tổng quát, tất định 100% (deterministic), không phụ thuộc vào LLM/AI lúc runtime (B-03), kiểm thử tự động được toàn diện cho **CẢ 4 PHÉP TÍNH CĂN BẢN CỦA TOÁN LỚP 3**:
- Phép cộng 2 chữ số (có nhớ và không nhớ trong phạm vi 100).
- Phép trừ 2 chữ số (có nhớ và không nhớ trong phạm vi 100).
- Phép nhân số có 2 hoặc 3 chữ số với số có 1 chữ số (trong phạm vi 1.000).
- Phép chia số có 2 hoặc 3 chữ số cho số có 1 chữ số (trong phạm vi 1.000).

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
   $$E_{anchor} = \text{roundTen}(A) + \text{roundTen}(B)$$
   *Ví dụ:* $38 + 47 \longrightarrow 40 + 50 = 90$ (Kết quả tính đúng: $85$).

2. **Phép trừ 2 chữ số ($A - B$):**
   Cả số bị trừ và số trừ đều được làm tròn đến hàng chục:
   $$E_{anchor} = \text{roundTen}(A) - \text{roundTen}(B)$$
   *Ví dụ:* $73 - 28 \longrightarrow 70 - 30 = 40$ (Kết quả tính đúng: $45$).

3. **Phép nhân ($X \times Y$):**
   Thừa số có 2 chữ số được làm tròn đến hàng chục, thừa số 1 chữ số giữ nguyên:
   $$E_{anchor} = \text{roundTen}(X) \times Y$$
   *Ví dụ:* $29 \times 3 \longrightarrow 30 \times 3 = 90$ (Kết quả tính đúng: $87$).

4. **Phép chia ($X : Y$):**
   Số bị chia $X$ được làm tròn về số tròn chục gần nhất hoặc bội số tròn chục gần nhất chia hết cho số chia $Y$:
   $$E_{anchor} = \text{roundTen}(X) : Y$$
   *Ví dụ:* $178 : 6 \longrightarrow 180 : 6 = 30$ (Kết quả tính đúng: $29$ dư 4; thương nguyên là $29$).

---

### 4. Công thức kiểm tra ước lượng hợp lý tất định

Gọi:
- $A \in \mathbb{N}^+$: Kết quả tính toán chính xác của phép tính (đối với phép chia là phần thương nguyên).
- $E \in \mathbb{R}$: Giá trị ước lượng do học sinh nhập vào.
- $E_{anchor} \in \mathbb{N}^+$: Điểm neo ước lượng sư phạm.

Giá trị ước lượng $E$ của học sinh được công nhận là **HỢP LÝ** khi thỏa mãn **ÍT NHẤT MỘT TRONG HAI ĐIỀU KIỆN**:

#### Điều kiện 1: Sai số tương đối kết hợp ngưỡng chênh lệch tuyệt đối tối thiểu $\Delta_{min}$
Sai số tương đối chuẩn là $15\%$:
$$\text{RelativeError}(E, A) = \frac{|E - A|}{A} \le 0.15$$

Tuy nhiên, đối với các phép toán tiểu học, nếu kết quả $A$ nhỏ (ví dụ $A = 15$ trong phép trừ $32 - 17 = 15$), sai số $15\% \times 15 = 2.25$ là quá hẹp đối với tâm lý học sinh lớp 3 khi làm tròn. Do đó, hệ thống áp dụng **ngưỡng chênh lệch tuyệt đối tối thiểu $\Delta_{min}$**:
- **Đối với Phép cộng và Phép trừ 2 chữ số ($+$, $-$):**
  $$\Delta_{min} = \max(3, \lceil 0.15 \times A \rceil)$$
- **Đối với Phép nhân và Phép chia ($\times$, $:$):**
  $$\Delta_{min} = \max(2, \lceil 0.15 \times A \rceil)$$

Ước lượng $E$ đạt điều kiện dung sai khi:
$$|E - A| \le \Delta_{min}$$

#### Điều kiện 2: Khoảng neo sư phạm (Pedagogical Anchor Interval)
Để tôn trọng tư duy làm tròn chuẩn của học sinh dù kết quả làm tròn có thể chênh lệch nhẹ so với kết quả thật, mỗi câu hỏi được bảo đảm một khoảng neo sư phạm:
$$[E_{anchor} - \text{buffer}, E_{anchor} + \text{buffer}]$$
Trong đó $\text{buffer} = 5$ (đối với phép cộng, trừ) hoặc cấu hình tường minh $[E_{min}, E_{max}]$ trong câu hỏi:
$$E_{min} \le E \le E_{max}$$

> **Quy tắc tổng hợp:**
> $$\text{isEstimateOk} \iff \Big(|E - A| \le \Delta_{min}\Big) \lor \Big(E \ge E_{min} \land E \le E_{max}\Big)$$

---

### 5. Mã nguồn chuẩn hóa hoàn chỉnh: `server/scoring.js`

Module tính điểm độc lập, chạy trên Node.js thuần, hỗ trợ đầy đủ 4 phép tính:

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
 * Tính điểm neo sư phạm E_anchor cho 4 phép tính
 */
function calculatePedagogicalAnchor(operation, op1, op2) {
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
 * Tính ngưỡng chênh lệch tuyệt đối Delta_min tối thiểu
 */
function getDeltaMin(operation, exact) {
  const a = Math.abs(Number(exact));
  const baseDelta = Math.ceil(0.15 * a);
  // Phép cộng và trừ 2 chữ số yêu cầu Delta_min = max(3, ceil(0.15 * A))
  if (operation === '+' || operation === '-') {
    return Math.max(3, baseDelta);
  }
  // Phép nhân và chia: Delta_min = max(2, ceil(0.15 * A))
  return Math.max(2, baseDelta);
}

/**
 * Tạo câu phản hồi sư phạm 2 tầng khích lệ học sinh lớp 3
 */
function generatePedagogicalFeedback(rule, estNum, exactNum, isEstimateOk, isExactOk) {
  const opSymbol = rule.operation === '*' ? '×' : rule.operation === '/' ? ':' : rule.operation;
  const expression = rule.operand1 != null && rule.operand2 != null
    ? `${rule.operand1} ${opSymbol} ${rule.operand2} = ${rule.exact}`
    : `kết quả đúng là ${rule.exact}`;

  let feedbackEstimate = '';
  if (isEstimateOk) {
    feedbackEstimate = `Tuyệt vời! Em ước lượng ${estNum} rất hợp lý và sát với thực tế. 🎉`;
  } else {
    feedbackEstimate = `Ước lượng ${estNum} chưa thật sát. ${rule.explanation || 'Em hãy thử làm tròn các số về hàng chục gần nhất để nhẩm nhé!'} 🌱`;
  }

  let feedbackExact = '';
  if (isExactOk) {
    feedbackExact = `Chính xác! Phép tính ${expression}. Em làm bài rất cẩn thận! 👏`;
  } else {
    feedbackExact = `Chưa chính xác rồi. Phép tính đúng là: ${expression}. Em hãy kiểm tra lại nhé! ✏️`;
  }

  return {
    feedbackEstimate,
    feedbackExact,
    explanation: rule.explanation || `Làm tròn nhẩm đưa về điểm neo ${rule.rounded_anchor || ''}. ${expression}.`
  };
}

/**
 * Thuật toán đánh giá câu hỏi ước lượng tất định tổng quát cho CẢ 4 PHÉP TÍNH
 * @param {Object} rule Quy tắc chấm từ correct_answer
 * @param {Object} studentAnswer { estimate, exact }
 * @returns {Object} Kết quả đánh giá chi tiết
 */
function evaluateEstimateQuestion(rule, studentAnswer) {
  const operation = rule.operation || '+';
  const exactExpected = Number(rule.exact);

  // 1. Chuẩn hóa & kiểm tra tính hợp lệ của đầu vào
  const rawEst = studentAnswer && studentAnswer.estimate != null ? String(studentAnswer.estimate).trim() : '';
  const rawExact = studentAnswer && studentAnswer.exact != null ? String(studentAnswer.exact).trim() : '';

  const estNum = Number(rawEst);
  const exactNum = Number(rawExact);

  const isEstValid = rawEst !== '' && !isNaN(estNum) && isFinite(estNum) && estNum > 0;
  const isExactValid = rawExact !== '' && !isNaN(exactNum) && isFinite(exactNum) && exactNum >= 0;

  // 2. Chấm kết quả tính đúng (so sánh bằng số học chính xác)
  const isExactOk = isExactValid && Math.round(exactNum) === exactExpected;

  // 3. Chấm ước lượng tất định (2 điều kiện)
  let isEstimateOk = false;
  if (isEstValid) {
    const delta = Math.abs(estNum - exactExpected);
    const deltaMin = getDeltaMin(operation, exactExpected);

    // Điều kiện 1: Nằm trong dung sai sai số tương đối (với ngưỡng sàn Delta_min)
    const inTolerance = delta <= deltaMin;

    // Điều kiện 2: Nằm trong khoảng neo sư phạm cấu hình hoặc đệm neo
    const minBound = rule.estimate_min != null ? Number(rule.estimate_min) : (rule.rounded_anchor ? rule.rounded_anchor - 5 : exactExpected - deltaMin);
    const maxBound = rule.estimate_max != null ? Number(rule.estimate_max) : (rule.rounded_anchor ? rule.rounded_anchor + 5 : exactExpected + deltaMin);
    const inAnchorRange = estNum >= minBound && estNum <= maxBound;

    isEstimateOk = inTolerance || inAnchorRange;
  }

  // 4. Tính điểm thành phần (40% ước lượng, 60% tính đúng)
  const totalPoints = rule.points || 5;
  const estWeight = rule.estimate_weight != null ? rule.estimate_weight : 0.4;
  const exactWeight = rule.exact_weight != null ? rule.exact_weight : 0.6;

  const pointsEst = Math.round(totalPoints * estWeight * 10) / 10;
  const pointsExact = Math.round(totalPoints * exactWeight * 10) / 10;

  const earnedPoints = (isEstimateOk ? pointsEst : 0) + (isExactOk ? pointsExact : 0);
  const isFullyCorrect = isEstimateOk && isExactOk;

  // 5. Sinh phản hồi 2 tầng
  const feedback = generatePedagogicalFeedback(rule, isEstValid ? estNum : rawEst, isExactValid ? exactNum : rawExact, isEstimateOk, isExactOk);

  return {
    isEstimateOk,
    isExactOk,
    isFullyCorrect,
    earnedPoints,
    maxPoints: totalPoints,
    expected: {
      exact: exactExpected,
      estimateRange: [rule.estimate_min, rule.estimate_max],
      roundedAnchor: rule.rounded_anchor || calculatePedagogicalAnchor(operation, rule.operand1, rule.operand2)
    },
    feedbackEstimate: feedback.feedbackEstimate,
    feedbackExact: feedback.feedbackExact,
    explanation: feedback.explanation
  };
}

module.exports = {
  roundToTen,
  calculatePedagogicalAnchor,
  getDeltaMin,
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

- **Request Body gửi từ Client:**
```json
{
  "setId": "uoc-luong-toan-3-tong-hop",
  "answers": {
    "est-add-01": { "estimate": 90, "exact": 85 },
    "est-sub-01": { "estimate": 40, "exact": 45 },
    "est-mul-01": { "estimate": 90, "exact": 87 },
    "est-div-01": { "estimate": 30, "exact": 29 }
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

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt)

### 2. Thẻ tương tác 2 pha (Phased Interaction Card) trên `lesson.js`
Giao diện trực quan dành riêng cho học sinh 8–9 tuổi:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Câu 1 • 5 điểm • Phép cộng ước lượng                                   │
│ 38 + 47 = ?                                                            │
├────────────────────────────────────────────────────────────────────────┤
│ 🐝 Ong Vàng mách nước: Em hãy làm tròn 38 và 47 về hàng chục để nhẩm! │
│                                                                        │
│ [Pha 1: Ước lượng nhẩm]                                                │
│ Em đoán kết quả khoảng: [  90  ]  (Số tròn chục: 80, 90, 100...)       │
│                                                                        │
│ [Pha 2: Đặt tính tính đúng]                                            │
│ Kết quả chính xác là:   [  85  ]                                       │
└────────────────────────────────────────────────────────────────────────┘
```

### 3. Phản hồi 2 tầng sinh động (B-06)
Sau khi nộp bài, mỗi thẻ câu hỏi hiển thị 2 khối nhận xét độc lập:
1. **Khối Ước lượng (Màu xanh / vàng hổ phách):**
   - ✅ *"Tuyệt vời! Em ước lượng 90 rất hợp lý và sát với thực tế. 🎉"*
   - ⚠️ *"Ước lượng 40 chưa thật sát. Làm tròn 38 -> 40, 47 -> 50, nhẩm 40 + 50 = 90 nhé! 🌱"*
2. **Khối Tính đúng (Màu xanh / cam):**
   - ✅ *"Chính xác! Phép tính 38 + 47 = 85. Em làm bài rất cẩn thận! 👏"*
   - ❌ *"Chưa chính xác rồi. Phép tính đúng là: 38 + 47 = 85. Em hãy kiểm tra lại nhé! ✏️"*

### 4. Khả năng tiếp cận Accessibility (A11y - B-12)
- **Điều hướng phím Tab tuần tự:**
  $$\text{Ô Ước lượng (Tab)} \longrightarrow \text{Ô Kết quả đúng (Tab)} \longrightarrow \text{Câu tiếp theo (hoặc Nút Nộp)}$$
- **Phím Enter:** Nhấn `Enter` tại bất kỳ ô nhập liệu nào cũng chuyển tiếp mượt mà hoặc kích hoạt nộp bài khi đã hoàn thành.
- **Vòng lấy nét tương phản cao:** Sử dụng lớp `focus:ring-4 focus:ring-primary-fixed focus:outline-none` đảm bảo học sinh nhìn rõ vị trí con trỏ bàn phím.
- **Ngôn ngữ sư phạm thân thiện:** Văn phong tiếng Việt khích lệ, gần gũi, dùng hình tượng chú Ong Vàng chăm chỉ hướng dẫn học tập.

---

## ADR-05: Chiến lược Kiểm thử tự động (Unit & Integration) bao phủ 4 phép tính & CI Pipeline

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt)

### 2. Công nghệ kiểm thử
- Sử dụng **Jest 29** (kèm `supertest` để kiểm thử HTTP API trên Express).
- Cấu hình chạy nhanh, không cần build step, tương thích Node 20 LTS.

### 3. Ma trận kiểm thử tự động (Test Matrix) bao phủ CẢ 4 PHÉP TÍNH

```
tests/
├── unit/
│   └── scoring.test.js          # Kiểm thử thuật toán ước lượng tất định 4 phép tính
│       ├── 1. Phép cộng 2 chữ số (+)
│       │   ├── Normal: 38 + 47 (est 90, exact 85 -> Đúng cả hai)
│       │   ├── Boundary: Delta_min = max(3, ceil(0.15 * 85)) = 13 (Biên 85 ± 13)
│       │   └── Anchor: Điểm neo 90 (40 + 50)
│       ├── 2. Phép trừ 2 chữ số (-)
│       │   ├── Normal: 73 - 28 (est 40, exact 45 -> Đúng cả hai)
│       │   ├── Boundary: Số nhỏ 32 - 17 = 15 -> Delta_min = max(3, ceil(0.15 * 15)) = 3
│       │   └── Anchor: Điểm neo 40 (70 - 30)
│       ├── 3. Phép nhân (×)
│       │   ├── Normal: 29 × 3 (est 90, exact 87 -> Đúng cả hai)
│       │   ├── Boundary: Sai số 15% biên trên 100, biên dưới 74
│       │   └── Anchor: Điểm neo 90 (30 × 3)
│       ├── 4. Phép chia (:)
│       │   ├── Normal: 178 : 6 (est 30, exact 29 -> Đúng cả hai)
│       │   ├── Boundary: 48 : 6 = 8 -> Delta_min = max(2, ceil(0.15 * 8)) = 2
│       │   └── Anchor: Điểm neo 30 (180 : 6)
│       └── 5. Invalid & Negative Inputs (Chuỗi ký tự, số âm, để trống, NaN)
└── integration/
    ├── api_security.test.js     # Tiêu chí B-04 (Chống lộ đáp án khi GET /questions)
    └── api_submissions.test.js  # Tiêu chí B-05 & B-06 (Chấm 2 tầng 4 phép tính & F5 bền vững)
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