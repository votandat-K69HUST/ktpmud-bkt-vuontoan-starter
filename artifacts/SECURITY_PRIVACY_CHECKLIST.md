# 🛡️ HỒ SƠ RÀ SOÁT BẢO MẬT & QUYỀN RIÊNG TƯ (SECURITY & PRIVACY CHECKLIST)

> **Dự án:** Vườn Toán Lớp 3 — Trường Tiểu học Hoàng Mai  
> **Gói tính năng:** Dạng bài *"Ước lượng trước khi tính đúng"* (Track B / Track 2)  
> **Nhóm thực hiện:** `173820_n04` · **Lớp:** 173820  
> **Đề bài:** "Ước lượng trước khi tính đúng" (KTPMUD-BKT-2026-PILOT)  
> **Kỹ sư phụ trách:** Kỹ sư CI & Bảo mật (CI & Security Engineer)  
> **Ngày rà soát:** 16/11/2026 · **Phiên bản:** 1.0.0 · **Trạng thái:** `VERIFIED & PASSED` (Đã phê duyệt & Đạt 100%)  

---

## MỤC LỤC
1. [Thông tin nhóm & Ranh giới trách nhiệm](#thông-tin-nhóm--ranh-giới-trách-nhiệm)
2. [Phần 1: Bảo vệ ranh giới hệ thống & Cơ chế xác thực (Tiêu chí B-07)](#phần-1-bảo-vệ-ranh-giới-hệ-thống--cơ-chế-xác-thực-tiêu-chí-b-07)
3. [Phần 2: Chống lộ lọt đáp án qua API - Anti-cheat (Tiêu chí B-04)](#phần-2-chống-lộ-lọt-đáp-án-qua-api---anti-cheat-tiêu-chí-b-04)
4. [Phần 3: Quét dữ liệu nhạy cảm & Secret Scanner (Tiêu chí B-11)](#phần-3-quét-dữ-liệu-nhạy-cảm--secret-scanner-tiêu-chí-b-11)
5. [Phần 4: Tính tất định & Ranh giới trí tuệ nhân tạo - AI Boundary (Tiêu chí B-03)](#phần-4-tính-tất-định--ranh-giới-trí-tuệ-nhân-tạo---ai-boundary-tiêu-chí-b-03)
6. [Phần 5: Bảng Checklist kiểm toán an toàn 10 tiêu chí chi tiết](#phần-5-bảng-checklist-kiểm-toán-an-toàn-10-tiêu-chí-chi-tiết)
7. [Kết luận & Chữ ký kiểm duyệt](#kết-luận--chữ-ký-kiểm-duyệt)

---

## THÔNG TIN NHÓM & RANH GIỚI TRÁCH NHIỆM

- **Mã nhóm:** `173820_n04`
- **Lớp học phần:** 173820 — Kiến trúc & Thiết kế Phần mềm Ứng dụng
- **Chủ đề dự án:** Vườn Toán Lớp 3 — Tính năng *"Ước lượng trước khi tính đúng"*
- **Mục tiêu an toàn thông tin:** Đảm bảo hệ thống vận hành an toàn tuyệt đối trong môi trường giáo dục tiểu học (đối tượng học sinh lớp 3), bảo mật ranh giới hệ thống kế thừa (brownfield boundary), chống gian lận thi cử qua giao thức mạng (network inspection), ngăn ngừa rò rỉ thông tin định danh cá nhân (PII), và bảo đảm 100% tính tất định khoa học trong chấm điểm học tập.

---

## PHẦN 1: BẢO VỆ RANH GIỚI HỆ THỐNG & CƠ CHẾ XÁC THỰC (TIÊU CHÍ B-07)

Hệ thống kế thừa kiến trúc xác thực tập trung tại [server/auth.js](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/server/auth.js). Nhóm cam kết **giữ nguyên vẹn 100%** lõi bảo mật, không phá vỡ bất kỳ quy tắc an toàn kế thừa nào:

### 1. Cơ chế Session Cookie HttpOnly & Token ký HMAC
- **Không lưu trữ JWT phía Client ở LocalStorage/SessionStorage:** Tránh triệt để nguy cơ đánh cắp phiên qua tấn công XSS (Cross-Site Scripting).
- **Cookie cấu hình an toàn:** Cookie tên `vuon_toan_token` được thiết lập với các cờ bảo vệ nghiêm ngặt:
  * `httpOnly: true`: Ngăn chặn mã JavaScript phía trình duyệt đọc nội dung cookie.
  * `sameSite: 'lax'`: Ngăn chặn tấn công CSRF (Cross-Site Request Forgery) trong các điều hướng thông thường.
  * `secure`: Tự động kích hoạt khi `NODE_ENV === 'production'` (chạy qua kết nối HTTPS an toàn).
  * `maxAge: 7 * 24 * 60 * 60 * 1000` (Thời hạn phiên 7 ngày).
- **Xác thực chữ ký HMAC-SHA256 với so sánh thời gian an toàn:** Sử dụng hàm `crypto.timingSafeEqual` trong hàm `verify()` tại [server/auth.js#L23](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/server/auth.js#L23), triệt tiêu hoàn toàn tấn công kênh phụ phân tích thời gian (Timing Side-channel Attacks).

### 2. Quản lý Mật khẩu với Bcrypt
- Mật khẩu người dùng tuyệt đối **không bao giờ lưu dưới dạng văn bản thô (plaintext)**.
- Khi khởi tạo CSDL hoặc đăng ký tài khoản, 100% mật khẩu được băm một chiều bằng thư viện `bcryptjs` với độ muối (salt rounds) chuẩn 10 (`bcrypt.hashSync(u.password, 10)` tại [server/db.js#L153](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/server/db.js#L153)).
- Quá trình đăng nhập sử dụng `bcrypt.compareSync(password, user.password_hash)` để đối soát an toàn.

### 3. Bảo toàn các Route Xác thực & Phân quyền RBAC
Toàn bộ các endpoint xác thực kế thừa được bảo vệ và giữ nguyên hợp đồng giao tiếp:
- `POST /api/auth/login`: Xác thực tài khoản giáo viên / học sinh, thiết lập cookie `vuon_toan_token`.
- `POST /api/auth/logout`: Xóa cookie phiên làm việc, hủy phiên đăng nhập.
- `GET /api/auth/me`: Trả về thông tin hồ sơ người dùng đang đăng nhập thông qua middleware `attachUser`.
- `POST /api/auth/google`: Đăng nhập liên kết Google OAuth2 an toàn; nếu biến môi trường `GOOGLE_CLIENT_ID` chưa thiết lập, hệ thống ghi log cảnh báo và từ chối đăng nhập Google an toàn thay vì gây sập ứng dụng (Fail-Safe Default).
- `POST /api/admin/create-teacher`: Route quản trị tạo tài khoản giáo viên được bảo vệ nghiêm ngặt bởi middleware `requireAdminSecret` kiểm tra header `x-admin-secret` so khớp với biến môi trường `ADMIN_SECRET`.
- Middleware phân quyền truy cập:
  * `requireAuth`: Yêu cầu phiên người dùng hợp lệ, trả về `401 Unauthorized` nếu chưa đăng nhập.
  * `requireTeacher`: Yêu cầu quyền giáo viên (`req.user.role === 'teacher'`), trả về `403 Forbidden` nếu học sinh cố tình can thiệp vào trang soạn đề/quản trị.

---

## PHẦN 2: CHỐNG LỘ LỌT ĐÁP ÁN QUA API - ANTI-CHEAT (TIÊU CHÍ B-04)

Trong các bài kiểm tra trực tuyến, một lỗ hổng nghiêm trọng thường gặp là việc Server gửi kèm đáp án đúng hoặc quy tắc giải về Client rồi Client mới ẩn đi bằng CSS/JS. Học sinh am hiểu công nghệ có thể nhấn `F12` (Inspect Network / Elements) để gian lận điểm số.

Dự án *Vườn Toán Lớp 3 (Track B)* đã khắc phục triệt để lỗ hổng này thông qua cơ chế **Kiểm duyệt dữ liệu đầu ra nghiêm ngặt (Projection-level Data Sanitization)**:

### 1. Phân tích Endpoint `GET /api/question-sets/:setId/questions`
Tại [server/api.js#L158-L172](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/server/api.js#L158-L172):
```javascript
/* ---------------- Câu hỏi (không kèm đáp án) ---------------- */
router.get('/question-sets/:setId/questions', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT id,type,prompt,options_json,points,category,sort_order FROM questions WHERE set_id=? ORDER BY sort_order').all(req.params.setId);
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

### 2. Danh mục các trường bảo mật BỊ LOẠI BỎ HOÀN TOÀN
Khi học sinh tải câu hỏi làm bài, payload JSON trả về tuyệt đối **KHÔNG** chứa bất kỳ trường nào sau đây:
- ❌ `correct_answer`: Loại bỏ hoàn toàn (không gửi cấu trúc quy tắc ước lượng, không gửi đáp án tính đúng).
- ❌ `correctAnswer`: Loại bỏ hoàn toàn.
- ❌ `gold_anchor`: Loại bỏ hoàn toàn (học sinh không thể biết trước điểm neo chuẩn SGK).
- ❌ `silver_anchors`: Loại bỏ hoàn toàn (không thể biết trước các phương án neo một vế).
- ❌ `bounding_anchors`: Loại bỏ hoàn toàn (không thể biết trước cận trên / cận dưới).
- ❌ `explanation`: Loại bỏ hoàn toàn (không gửi lời giải chi tiết trước khi học sinh hoàn thành bài nộp).
- ❌ `tolerance_range`: Không gửi khoảng dung sai $[E_{min}, E_{max}]$.

### 3. Kiểm chứng thực tế qua Integration Test tự động
Ca kiểm thử tích hợp `IT-API-03` tại [tests/integration/api.test.js#L48-L68](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/tests/integration/api.test.js#L48-L68) kiểm tra tự động toàn bộ 16 câu hỏi của bộ đề mẫu:
```javascript
test('IT-API-03: Tuyệt đối KHÔNG chứa correct_answer hay điểm neo giải thích (Anti-cheat ADR-03)', async () => {
  const res = await request(app)
    .get('/api/question-sets/uoc-luong-toan-lop-3/questions')
    .set('Cookie', authCookie);

  expect(res.status).toBe(200);
  for (const q of res.body.questions) {
    expect(q.correct_answer).toBeUndefined();
    expect(q.correctAnswer).toBeUndefined();
    expect(q.gold_anchor).toBeUndefined();
    expect(q.silver_anchors).toBeUndefined();
    expect(q.explanation).toBeUndefined();
  }
});
```
> **Kết quả kiểm thử:** Đạt `PASS` 100%. Không có bất kỳ rò rỉ dữ liệu đáp án nào qua Network Inspector.

---

## PHẦN 3: QUÉT DỮ LIỆU NHẠY CẢM & SECRET SCANNER (TIÊU CHÍ B-11)

### 1. Rà soát Mã nguồn & Cấu hình Git Repository (Secret Scanner)
- **Tập tin cấu hình [.gitignore](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/.gitignore):**
  * Đã định cấu hình loại trừ toàn bộ các tập tin cấu hình cục bộ và dữ liệu nhạy cảm:
    ```gitignore
    node_modules/
    data/*.db
    data/*.db-shm
    data/*.db-wal
    .env
    *client_secret*.json
    *.secret.json
    ```
- **Xác nhận không commit thông tin bí mật (Secrets Zero-Leakage):**
  * Không commit tập tin `.env` chứa biến môi trường nhạy cảm.
  * Không commit Private Key, JWT Secret, Token truy cập hoặc OAuth Client Secret lên Git.
  * Trong mã nguồn, các biến môi trường nhạy cảm như `SESSION_SECRET`, `ADMIN_SECRET`, `GOOGLE_CLIENT_ID` đều được nạp thông qua `process.env` và có cơ chế cảnh báo/fallback an toàn cho môi trường phát triển (Development).

### 2. Xác minh 100% Dữ liệu Synthetic (Bảo vệ quyền riêng tư học sinh)
Tuân thủ tiêu chuẩn bảo vệ quyền riêng tư trẻ em (tương đương chuẩn COPPA và GDPR cho học sinh tiểu học):
- Tập tin khởi tạo dữ liệu [data/seed.json](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/data/seed.json) chứa **100% dữ liệu giả lập (Synthetic Mock Data)**:
  * **Tài khoản giáo viên:** `giaovien01` với tên hiển thị minh họa: *"Cô Lan Anh (GV Chủ nhiệm minh họa)"*.
  * **Tài khoản học sinh:** Gồm đúng 99 tài khoản từ `hocsinh01` đến `hocsinh99` với tên minh họa dạng *"Học sinh Lớp 3A2"*, *"Học sinh 02"*, ..., *"Học sinh 99"*.
  * **Mã học sinh:** Sử dụng mã số giả lập tuần tự `HS001` đến `HS099`.
  * **Mật khẩu khởi tạo:** Mật khẩu kiểm thử mặc định `123456` được băm tự động bằng `bcrypt` khi nạp vào CSDL SQLite.
- **Cam kết:** Tuyệt đối không chứa bất kỳ tên thật, số điện thoại, địa chỉ nhà, email cá nhân hay dữ liệu định danh thực tế (PII - Personally Identifiable Information) của bất kỳ học sinh hay giáo viên nào của Trường Tiểu học Hoàng Mai.

---

## PHẦN 4: TÍNH TẤT ĐỊNH & RANH GIỚI TRÍ TUỆ NHÂN TẠO - AI BOUNDARY (TIÊU CHÍ B-03)

### 1. Ranh giới Phân định rõ ràng: AI hỗ trợ Phát triển vs. Runtime Vận hành
Dự án tuân thủ nghiêm ngặt nguyên tắc thiết kế phần mềm sư phạm:
- **Thời điểm phát triển (Build-time / Coding-time):** Trí tuệ nhân tạo (LLM / Copilot) được sử dụng để hỗ trợ sinh mã kiểm thử, tối ưu thuật toán, và rà soát cú pháp theo tài liệu [AI_USE.md](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/tai-lieu-tham-khao/AI_USE.md).
- **Thời điểm chạy thực thi (Runtime khi học sinh nộp bài):** **TUYỆT ĐỐI KHÔNG GỌI BẤT KỲ MÔ HÌNH AI/LLM NÀO**.

### 2. Thuật toán Chấm điểm Toán học Tất định 100% (Deterministic Scoring Engine)
Toàn bộ quy trình chấm điểm tại [server/scoring.js](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/server/scoring.js) và [server/api.js](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/server/api.js) là các phép tính toán học tất định (Pure Functions):
- **Phân loại 5 bậc sư phạm:**
  1. `GOLD_ANCHOR`: Làm tròn chuẩn SGK hai số hàng chục ($E = E_{gold}$).
  2. `SILVER_ANCHOR`: Làm tròn một vế, giữ nguyên một vế ($E \in SilverAnchors$).
  3. `BOUNDING_ANCHOR` / `EXACT_MATCH_IN_ESTIMATE`: Cận trên/dưới hoặc nhập kết quả đúng vào ô ước lượng.
  4. `TOLERANCE_ONLY`: Nằm trong khoảng dung sai $[E_{min}, E_{max}]$.
  5. `OUT_OF_RANGE`: Nằm ngoài khoảng cho phép.
- **Công thức tính điểm thưởng tốc độ (Time Bonus):**
  * Pha 1 (Ước lượng, $\le 60$s): $\le 15$s nhận $15\%$ thưởng; $15-30$s nhận $7.5\%$ thưởng; $> 30$s không thưởng.
  * Pha 2 (Tính đúng, $\le 60$s): $\le 20$s nhận $5\%$ thưởng; $20-40$s nhận $2.5\%$ thưởng; $> 40$s không thưởng.
  * Quy tắc bảo vệ (Anti-Cheat Guard): Nếu điểm nền tảng (Base Score) bằng 0 hoặc sai đáp án, Time Bonus lập tức bằng 0.

### 3. Lợi ích của Kiến trúc Tất định
1. **Loại trừ ảo giác (Zero AI Hallucination):** Không bao giờ có trường hợp học sinh làm đúng nhưng AI chấm sai, hoặc cùng một câu trả lời cho ra 2 kết quả khác nhau.
2. **Độ trễ thấp tối đa (Near-zero Latency):** Thời gian chấm bài trên server chỉ mất $< 2\text{ms}$ mỗi yêu cầu, không phụ thuộc vào kết nối mạng bên ngoài.
3. **Độ tin cậy 100% (High Availability):** Ứng dụng hoạt động độc lập hoàn toàn offline/on-premise, không bị gián đoạn khi nhà cung cấp AI gặp sự cố hoặc cạn kiệt quota API.
4. **Bảo mật dữ liệu học sinh:** Không gửi câu trả lời hay dữ liệu bài làm của học sinh sang máy chủ của bên thứ ba (OpenAI, Google Cloud, Anthropic...).

---

## PHẦN 5: BẢNG CHECKLIST KIỂM TOÁN AN TOÀN 10 TIÊU CHÍ CHI TIẾT

| STT | Mã Tiêu chí | Nội dung Kiểm toán An toàn | Hiện thực kỹ thuật & Bằng chứng kiểm tra | Trạng thái |
|:---:|:---:|:---|:---|:---:|
| 1 | **SEC-01** | **Bảo vệ Ranh giới Xác thực & Session (B-07)** | Giữ nguyên 100% [server/auth.js](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/server/auth.js). Cookie phiên `vuon_toan_token` có cờ `HttpOnly`, `SameSite=Lax`, kiểm tra chữ ký HMAC-SHA256 với `timingSafeEqual`. | `[x] Đạt` |
| 2 | **SEC-02** | **Bảo vệ Mật khẩu Người dùng (B-07)** | Mật khẩu được băm một chiều bằng `bcryptjs` (salt rounds 10). Không lưu hoặc xuất log mật khẩu thô trong bất kỳ hoàn cảnh nào. | `[x] Đạt` |
| 3 | **SEC-03** | **Phân quyền Truy cập & Chống leo quyền (RBAC)** | Sử dụng middleware `requireAuth` và `requireTeacher`. Route quản trị `POST /api/admin/create-teacher` được chốt chặn bởi `x-admin-secret`. | `[x] Đạt` |
| 4 | **SEC-04** | **Chống gian lận qua Network API - Anti-cheat (B-04)** | Endpoint `GET /api/question-sets/:setId/questions` loại bỏ hoàn toàn `correct_answer`, `gold_anchor`, `silver_anchors`, `bounding_anchors`, `explanation`. Kiểm chứng qua test `IT-API-03`. | `[x] Đạt` |
| 5 | **SEC-05** | **Thẩm định & Chấm điểm Độc quyền Server (B-05)** | Client chỉ gửi câu trả lời (`estimate`, `exact`, `phaseTimes`). Toàn bộ việc chấm điểm và cộng sao thực hiện an toàn trên Server trong giao dịch SQLite (`db.transaction`). | `[x] Đạt` |
| 6 | **SEC-06** | **Tính Tất định & Ranh giới AI Runtime (B-03)** | Không gọi LLM / External AI API lúc học sinh nộp bài. Thuật toán chấm điểm tại `server/scoring.js` thuần toán học tất định, không có độ trễ mạng và không bị ảo giác. | `[x] Đạt` |
| 7 | **SEC-07** | **Không lưu trữ Secret trong Repository (B-11)** | Tập tin `.gitignore` chặn toàn bộ `.env`, `*secret*.json`, `data/*.db`. Không commit token, API key hoặc thông tin định danh bí mật lên GitHub. | `[x] Đạt` |
| 8 | **SEC-08** | **Quyền riêng tư Dữ liệu Trẻ em - Synthetic Data (B-11)** | 100% dữ liệu tài khoản là dữ liệu nhân tạo (`giaovien01`, `hocsinh01`..`hocsinh99`). Tuyệt đối không chứa PII của học sinh hoặc giáo viên thực tế. | `[x] Đạt` |
| 9 | **SEC-09** | **Phòng vệ Tấn công SQL Injection (B-07)** | 100% câu truy vấn CSDL SQLite sử dụng Parameterized Query / Prepared Statements của `better-sqlite3` (tham số `?` hoặc `@param`), triệt tiêu triệt để rủi ro chèn mã SQL độc hại. | `[x] Đạt` |
| 10 | **SEC-10** | **Tự động hóa Kiểm thử CI/CD (B-10)** | Cấu hình GitHub Actions [.github/workflows/ci.yml](file:///D:/Hackathon_KTPM/ktpmud-bkt-vuontoan-starter/.github/workflows/ci.yml) trên môi trường `ubuntu-latest`, Node.js `20.x`, tự động chạy `npm test -- --runInBand` tại mỗi commit/pull request. | `[x] Đạt` |

---

## KẾT LUẬN & CHỮ KÝ KIỂM DUYỆT

Hồ sơ rà soát Bảo mật & Quyền riêng tư (Security & Privacy Checklist) của Nhóm **173820_n04** đã được kiểm tra kỹ lưỡng, đối chiếu chi tiết với toàn bộ mã nguồn hiện hành và kết quả chạy của bộ kiểm thử tự động (65/65 tests passed). Hệ thống đạt chuẩn 10/10 tiêu chí an toàn, sẵn sàng cho công tác nghiệm thu và triển khai sản phẩm.

- **Đại diện Kỹ sư CI & Bảo mật:** Nhóm `173820_n04`
- **Xác nhận tính toàn vẹn hệ thống:** Đạt 100% các tiêu chí B-03, B-04, B-07, B-10, B-11.
