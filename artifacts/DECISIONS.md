# 🏛️ NHẬT KÝ QUYẾT ĐỊNH KIẾN TRÚC (ARCHITECTURE DECISION RECORDS - ADRs)
> **Dự án:** Vườn Toán Lớp 3 — Trường Tiểu học Hoàng Mai  
> **Dạng bài mở rộng:** "Ước lượng trước khi tính đúng" (Track 2 / Track B)  
> **Mã đề:** `KTPMUD-BKT-2026-PILOT` | **Mã nhóm:** `173820_n04`  
> **Nhóm tác giả:** Bùi Tiến Đạt, Võ Tấn Đạt, Nguyễn Minh Quang  
> **Trạng thái:** Chốt phương án kiến trúc phục vụ Checkpoint 1 (08/11/2026)  

---

## 📑 MỤC LỤC CÁC QUYẾT ĐỊNH (ADRs)
1. [ADR-01: Định nghĩa toán học sư phạm & Thuật toán chấm ước lượng tất định (Deterministic Scoring)](#adr-01-định-nghĩa-toán-học-sư-phạm--thuật-toán-chấm-ước-lượng-tất-định) *(Tiêu chí B-03)*
2. [ADR-02: Thiết kế Schema CSDL mở rộng cho SQLite (Non-Breaking Extension)](#adr-02-thiết-kế-schema-csdl-mở-rộng-cho-sqlite) *(Tiêu chí B-02, B-07)*
3. [ADR-03: Thiết kế API Contract, Cơ chế chấm 2 tầng & Bảo mật đáp án Server-side](#adr-03-thiết-kế-api-contract-cơ-chế-chấm-2-tầng--bảo-mật-đáp-án-server-side) *(Tiêu chí B-04, B-05, B-07)*
4. [ADR-04: Thiết kế Trải nghiệm Người dùng (UX 2 tầng) & Khả năng tiếp cận Accessibility](#adr-04-thiết-kế-trải-nghiệm-người-dùng-ux-2-tầng--khả-năng-tiếp-cận-accessibility) *(Tiêu chí B-06, B-12)*
5. [ADR-05: Chiến lược Kiểm thử tự động (Unit & Integration) & GitHub Actions CI](#adr-05-chiến-lược-kiểm-thử-tự-động-unit--integration--github-actions-ci) *(Tiêu chí B-08, B-09, B-10)*

---

## ADR-01: Định nghĩa toán học sư phạm & Thuật toán chấm ước lượng tất định

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt)

### 2. Bối cảnh (Context)
- Trong hệ thống cũ, việc chấm điểm chỉ dựa vào so sánh chuỗi bằng nhau tuyệt đối: `given === String(q.correct_answer).trim().toLowerCase()`.
- Với dạng bài mới *"Ước lượng trước khi tính đúng"*, học sinh lớp 3 phải thực hiện 2 thao tác tư duy:
  1. **Bước 1 (Ước lượng):** Quan sát phép tính (ví dụ: $29 \times 3$), làm tròn nhẩm trong đầu về số tròn chục gần nhất ($29 \rightarrow 30$, nhẩm $30 \times 3 = 90$), đưa ra con số ước lượng.
  2. **Bước 2 (Tính đúng):** Thực hiện đặt tính ra nháp để tìm kết quả chính xác ($29 \times 3 = 87$).
- **Thách thức:** Thế nào là một ước lượng "hợp lý"? Nếu học sinh đoán 85, 90, 80 thì có được tính là đúng không? Làm sao để việc chấm điểm hoàn toàn **tất định (deterministic)**, không dùng AI lúc runtime (B-03) và có thể viết unit test bao phủ toàn bộ các ca bình thường và ca biên?

### 3. Quyết định thiết kế (Decision)
Chúng tôi định nghĩa mô hình toán học sư phạm cho thuật toán ước lượng như sau:

#### A. Định nghĩa toán học về Ước lượng Hợp lý
Gọi:
- $A \in \mathbb{N}^+$: Kết quả tính toán chính xác của phép toán ($A > 0$).
- $E \in \mathbb{R}$: Giá trị ước lượng do học sinh nhập vào.
- $E_{anchor} \in \mathbb{N}^+$: Điểm neo ước lượng chuẩn sư phạm (Pedagogical Rounding Anchor), thu được bằng cách làm tròn số hạng/thừa số/số bị chia về hàng chục gần nhất:
  - Phép nhân $x \times y$: $E_{anchor} = \text{roundTen}(x) \times y$. (Ví dụ $29 \times 3 \rightarrow 30 \times 3 = 90$).
  - Phép chia $x : y$: $E_{anchor} = \text{roundTen}(x) : y$ (hoặc bội số tròn chục gần nhất của $y$). (Ví dụ $178 : 6 \rightarrow 180 : 6 = 30$).

Giá trị ước lượng $E$ của học sinh được công nhận là **HỢP LÝ** khi thỏa mãn **ÍT NHẤT MỘT TRONG HAI ĐIỀU KIỆN TẤT ĐỊNH**:

1. **Điều kiện Sai số tương đối (Relative Error Tolerance $\le 15\%$):**
   $$\text{Error}(E, A) = \frac{|E - A|}{A} \le 0.15$$
   Để tránh sai số do số quá nhỏ (ví dụ $48 : 6 = 8$, $15\%$ của 8 là $1.2$), ngưỡng chênh lệch tuyệt đối cho phép tối thiểu được bảo đảm là $\Delta_{min} = \max(2, \lceil 0.15 \times A \rceil)$:
   $$|E - A| \le \Delta_{min}$$

2. **Điều kiện Khoảng neo sư phạm (Pedagogical Anchor Interval):**
   Mỗi câu hỏi có thể định nghĩa khoảng biên giáo viên mong đợi $[E_{min}, E_{max}]$. Mặc định:
   $$E_{min} = \min(A - \Delta_{min}, E_{anchor} - 10)$$
   $$E_{max} = \max(A + \Delta_{min}, E_{anchor} + 10)$$
   Nếu $E \in [E_{min}, E_{max}]$ thì ước lượng được xem là hợp lý.

#### B. Cơ cấu phân bổ điểm số của câu hỏi
Mỗi câu hỏi dạng `estimate` có trọng số điểm là $P$ (mặc định $P = 5$ điểm hoặc do giáo viên cấu hình):
- **Điểm ước lượng ($P_{est}$):** Chiếm $40\%$ số điểm ($P_{est} = 0.4 \times P$, ví dụ 2 điểm).
- **Điểm kết quả chính xác ($P_{exact}$):** Chiếm $60\%$ số điểm ($P_{exact} = 0.6 \times P$, ví dụ 3 điểm).
- Tổng điểm đạt được của câu hỏi: $P_{earned} = (isEstimateOk \times P_{est}) + (isExactOk \times P_{exact})$.
- Trạng thái `correct` của câu hỏi (để tính `correctCount` trên thanh tiến độ): Đạt khi học sinh làm đúng cả 2 phần hoặc đạt kết quả chính xác $isExactOk = \text{true}$.

#### C. Mã nguồn chuẩn hóa thuật toán (`server/scoring.js`)
Thuật toán được đóng gói thành một module độc lập không phụ thuộc Express, dễ dàng unit test:
```javascript
function evaluateEstimateQuestion(rule, studentAnswer) {
  // Chuẩn hóa đầu vào
  const rawEst = studentAnswer && studentAnswer.estimate != null ? String(studentAnswer.estimate).trim() : '';
  const rawExact = studentAnswer && studentAnswer.exact != null ? String(studentAnswer.exact).trim() : '';

  const estNum = Number(rawEst);
  const exactNum = Number(rawExact);

  const isEstValidNumber = rawEst !== '' && !isNaN(estNum) && estNum > 0;
  const isExactValidNumber = rawExact !== '' && !isNaN(exactNum) && exactNum >= 0;

  // 1. Chấm kết quả chính xác
  const isExactOk = isExactValidNumber && exactNum === rule.exact;

  // 2. Chấm ước lượng tất định
  let isEstimateOk = false;
  if (isEstValidNumber) {
    const delta = Math.abs(estNum - rule.exact);
    const tolerance = Math.max(2, Math.ceil(0.15 * rule.exact));
    const inTolerance = delta <= tolerance;
    const inAnchorRange = (estNum >= rule.estimate_min && estNum <= rule.estimate_max);
    isEstimateOk = inTolerance || inAnchorRange;
  }

  // 3. Tính điểm thành phần
  const totalPoints = rule.points || 5;
  const estPoints = Math.round(totalPoints * 0.4 * 10) / 10;
  const exactPoints = Math.round(totalPoints * 0.6 * 10) / 10;
  const earnedPoints = (isEstimateOk ? estPoints : 0) + (isExactOk ? exactPoints : 0);

  return {
    isEstimateOk,
    isExactOk,
    isFullyCorrect: isEstimateOk && isExactOk,
    earnedPoints,
    maxPoints: totalPoints,
    feedback: generatePedagogicalFeedback(rule, estNum, exactNum, isEstimateOk, isExactOk)
  };
}
```

### 4. Hệ quả & Lợi ích (Consequences)
- **Tất định 100%:** Cùng một dữ liệu đầu vào luôn sinh ra cùng một kết quả, không có yếu tố ngẫu nhiên hay phụ thuộc network.
- **Tính sư phạm cao:** Khuyến khích học sinh dám nhẩm làm tròn số, không phạt nặng nếu ước lượng lệch một khoảng nhỏ tự nhiên.
- **Dễ dàng kiểm thử tự động:** Cho phép viết trọn vẹn test matrix gồm Normal, Boundary và Invalid inputs.

---

## ADR-02: Thiết kế Schema CSDL mở rộng cho SQLite

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt)

### 2. Bối cảnh
Bảng `questions` hiện tại trong [server/db.js](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/server/db.js) có cấu trúc:
```sql
CREATE TABLE IF NOT EXISTS questions (
  id             TEXT PRIMARY KEY,
  set_id         TEXT NOT NULL,
  lesson_id      TEXT,
  type           TEXT NOT NULL,     -- 'multiple-choice', 'input', 'compare', 'paint'
  prompt         TEXT NOT NULL,
  options_json   TEXT,
  correct_answer TEXT NOT NULL,     -- Lưu chuỗi so sánh trực tiếp
  points         INTEGER NOT NULL DEFAULT 1,
  category       TEXT DEFAULT '',
  sort_order     INTEGER NOT NULL
);
```
Ta cần lưu trữ cho câu hỏi ước lượng:
- Giá trị kết quả chính xác (`exact`, kiểu số nguyên).
- Ngưỡng ước lượng tối thiểu (`estimate_min`).
- Ngưỡng ước lượng tối đa (`estimate_max`).
- Điểm neo làm tròn chuẩn (`rounded_anchor`).
- Lời giải thích sư phạm (`explanation`).

### 3. Các phương án kiến trúc được đánh giá

| Tiêu chí | Phương án A: ALTER TABLE thêm cột | Phương án B: Mã hóa JSON trong `correct_answer` | Phương án C: Tạo bảng phụ `question_estimates` |
|:---|:---|:---|:---|
| **Độ xâm lấn codebase** | Cao (cần migration ALTER TABLE, sửa nhiều câu lệnh SQL INSERT) | **Rất thấp (Không cần đổi cấu trúc bảng SQL)** | Cao (cần quan hệ foreign key, JOIN truy vấn) |
| **Tương thích ngược** | Nguy cơ lỗi nếu DB cũ đã tồn tại | **Hoàn toàn tương thích ngược 100%** | Phải viết lại seeder |
| **Tuân thủ B-07** | Có nguy cơ xung đột schema cũ | **Tuyệt đối an toàn, tuân thủ nghiêm ngặt** | Phức tạp hóa truy vấn |
| **Quyết định** | Loại bỏ | ✅ **CHỌN PHƯƠNG ÁN B** | Loại bỏ |

### 4. Chi tiết triển khai Phương án B
Khi `type = 'estimate'`:
- Cột `type`: Ghi `'estimate'`.
- Cột `correct_answer`: Lưu chuỗi JSON biểu diễn quy tắc chấm:
  ```json
  {
    "exact": 87,
    "estimate_min": 75,
    "estimate_max": 100,
    "rounded_anchor": 90,
    "explanation": "Làm tròn 29 thành 30, ước lượng 30 × 3 = 90. Đặt tính: 29 × 3 = 87."
  }
  ```
- Đối với 4 dạng câu hỏi cũ (`multiple-choice`, `input`, `compare`, `paint`), cột `correct_answer` vẫn lưu chuỗi thuần túy như cũ. Không một dòng code cũ nào bị phá vỡ.

---

## ADR-03: Thiết kế API Contract, Cơ chế chấm 2 tầng & Bảo mật đáp án Server-side

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt)

### 2. Yêu cầu bảo mật Server-side (Tiêu chí B-04)
Đề thi quy định nghiêm ngặt: API `GET /api/question-sets/:setId/questions` **tuyệt đối không được trả về đáp án đúng** hoặc khoảng ước lượng cho client trước khi nộp bài.

**Giải pháp kỹ thuật tại `server/api.js`:**
```javascript
router.get('/question-sets/:setId/questions', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT id, type, prompt, options_json, points, category, sort_order 
    FROM questions WHERE set_id=? ORDER BY sort_order
  `).all(req.params.setId);
  
  if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy bộ câu hỏi.' });

  // Tuyệt đối không chọn correct_answer từ CSDL
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

### 3. API Payload nộp bài & Phản hồi (`POST /api/submissions`)
- **Request Body gửi từ Client:**
  ```json
  {
    "setId": "uoc-luong-nhan-chia-lop-3",
    "answers": {
      "est-mul-01": { "estimate": 90, "exact": 87 },
      "est-div-01": { "estimate": 8, "exact": 8 }
    },
    "durationSec": 125
  }
  ```
- **Response trả về cho Client sau khi chấm:**
  ```json
  {
    "scorePercent": 100,
    "correctCount": 2,
    "totalCount": 2,
    "starsEarned": 40,
    "totalStars": 1290,
    "detail": [
      {
        "questionId": "est-mul-01",
        "type": "estimate",
        "isEstimateOk": true,
        "isExactOk": true,
        "correct": true,
        "pointsEarned": 5,
        "maxPoints": 5,
        "givenEstimate": 90,
        "givenExact": 87,
        "expected": {
          "exact": 87,
          "estimateRange": [75, 100],
          "roundedAnchor": 90
        },
        "feedbackEstimate": "Ước lượng rất sát! (90 gần sát 87)",
        "feedbackExact": "Kết quả tính chính xác hoàn toàn: 29 × 3 = 87",
        "explanation": "Làm tròn 29 thành 30, ước lượng 30 × 3 = 90. Đặt tính: 29 × 3 = 87."
      }
    ]
  }
  ```

### 4. Tính bền vững dữ liệu (Tiêu chí B-05)
Toàn bộ thao tác ghi nhận kết quả được bọc trong một **SQLite Transaction** duy nhất:
- Ghi một bản ghi vào bảng `attempts` kèm toàn bộ `answers_json`.
- Cập nhật bảng `progress` (ghi nhận điểm cao nhất `best_score` và cờ `completed = 1` nếu $\ge 50\%$).
- Cộng sao vào bảng `users` cho người dùng.
- Nhờ cơ chế WAL và commit tức thời của SQLite, khi người dùng bấm **F5 (Reload trang)**, toàn bộ tiến độ được nạp lại nguyên vẹn từ bảng `progress`.

---

## ADR-04: Thiết kế Trải nghiệm Người dùng (UX 2 tầng) & Khả năng tiếp cận Accessibility

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt)

### 2. Thiết kế Thẻ tương tác 2 pha (Phased Interaction Card)
Học sinh lớp 3 tiếp nhận thông tin theo từng bước tuần tự. Do đó, thẻ câu hỏi `estimate` trên giao diện [public/assets/js/pages/lesson.js](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/public/assets/js/pages/lesson.js) được chia thành 2 khu vực rõ ràng:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Câu 1 • 5 điểm • Phép nhân ước lượng                                  │
│ 29 × 3 = ?                                                             │
├────────────────────────────────────────────────────────────────────────┤
│ 🐝 Ong Vàng mách nước: Hãy làm tròn số rồi nhẩm ước lượng trước nhé!   │
│                                                                        │
│ [Bước 1: Ước lượng kết quả]                                            │
│ Em đoán khoảng: [  90  ]  (Ví dụ: 80, 90, 100...)                      │
│                                                                        │
│ [Bước 2: Đặt tính và tính đúng]                                        │
│ Kết quả chính xác: [  87  ]                                            │
└────────────────────────────────────────────────────────────────────────┘
```

### 3. Phản hồi 2 tầng trực quan sau khi chấm bài (Tiêu chí B-06)
Khi học sinh bấm nộp bài, mỗi câu hỏi dạng `estimate` sẽ hiển thị thẻ kết quả gồm 2 nhãn độc lập:
- **Tầng 1 (Ước lượng):**
  - ✅ *"Ước lượng hợp lý: 90 sát với 87"* (Hộp màu xanh lá lá cây).
  - ⚠️ *"Ước lượng chưa sát: 40 khá xa 87. Lời khuyên: Em làm tròn 29 thành 30 để nhẩm nhé!"* (Hộp màu vàng nhạt).
- **Tầng 2 (Kết quả tính đúng):**
  - ✅ *"Phép tính chính xác: 29 × 3 = 87"* (Hộp màu xanh lá).
  - ❌ *"Phép tính chưa đúng: 29 × 3 = 87"* (Hộp màu đỏ cam kèm hướng dẫn).

### 4. Khả năng tiếp cận bằng bàn phím (Tiêu chí B-12)
- Các trường nhập liệu (`input`) có thuộc tính `tabindex`, hỗ trợ di chuyển tuần tự:
  $$\text{Ô Ước lượng (Tab)} \longrightarrow \text{Ô Kết quả đúng (Tab)} \longrightarrow \text{Câu tiếp theo (hoặc Nút Nộp bài)}$$
- Khi nhấn phím `Enter` tại ô kết quả cuối cùng, hệ thống tự động kích hoạt tiến trình nộp bài.
- Giao diện có viền `focus:ring-4 focus:ring-primary-fixed` với độ tương phản cao, hỗ trợ học sinh khiếm thị nhẹ hoặc gặp khó khăn khi dùng chuột.

---

## ADR-05: Chiến lược Kiểm thử tự động (Unit & Integration) & GitHub Actions CI

### 1. Trạng thái: `ACCEPTED` (Đã phê duyệt)

### 2. Lựa chọn Test Runner
- **Lựa chọn:** `jest` (kèm `supertest` để test HTTP endpoints).
- **Lý do chọn:** Chạy cực nhanh, hỗ trợ Node 20 LTS bản địa, không cần cấu hình phức tạp, báo cáo độ phủ (coverage) trực quan bằng HTML và terminal.

### 3. Ma trận ca kiểm thử tự động (Test Matrix - Tiêu chí B-08)

```
tests/
├── unit/
│   └── scoring.test.js          # Kiểm thử thuật toán ước lượng tất định
│       ├── 1. Normal Cases (Ước lượng chuẩn, sai số <= 15%)
│       ├── 2. Boundary Cases (Ngưỡng biên 15.0%, 15.1%, biên cận dưới, biên cận trên)
│       ├── 3. Pedagogical Anchor Cases (Làm tròn hàng chục chuẩn dù sai số lệch nhẹ)
│       └── 4. Invalid Input Cases (Chuỗi chữ, số âm, số 0, khoảng trắng, ký tự đặc biệt)
└── integration/
    ├── api_security.test.js     # Tiêu chí B-04 (Chống lộ đáp án khi GET /questions)
    └── api_submissions.test.js  # Tiêu chí B-05 & B-06 (Chấm 2 tầng & reload DB bền vững)
```

### 4. Cấu hình CI Pipeline (`.github/workflows/ci.yml` - Tiêu chí B-10)
Pipeline CI được kích hoạt trên mọi hành động `push` hoặc `pull_request` vào nhánh `main` và nhánh nộp bài:
1. `actions/checkout@v4`: Kéo mã nguồn.
2. `actions/setup-node@v4`: Cài đặt Node.js 20 LTS.
3. `npm ci`: Cài đặt sạch các dependency từ `package-lock.json`.
4. `npm test`: Thực thi toàn bộ bộ test và đảm bảo pass 100%.
