# 🎬 KỊCH BẢN DEMO NỘI BỘ CHECKPOINT 2 (15/11/2026)
> **Mục tiêu:** Báo cáo tiến độ kết thúc giai đoạn M2 (Build) & Demo trực tiếp Vertical Slice (5 phút) với Giảng viên / Trợ giảng (TA).  
> **Dự án:** Vườn Toán Lớp 3 — Track 2 (Track B: Thêm dạng bài *"Ước lượng trước khi tính đúng"*)  
> **Mã nhóm:** `173820_n04` | **Thời lượng chuẩn:** Đúng 5 phút (4 phút trình diễn + 1 phút xin góp ý).

---

## 🧭 1. Mục tiêu cốt lõi cần đạt trong buổi Demo Checkpoint 2
Theo đề thi, **Checkpoint 2 không đánh giá điểm số chung cuộc mà nhằm kiểm tra tiến độ thực tế (Vertical Slice chạy được end-to-end)** và nhận phản hồi chỉnh sửa sớm từ TA/GV.

**3 thông điệp kỹ thuật & sư phạm then chốt nhóm cần truyền tải:**
1. **Vertical Slice hoàn chỉnh 100%:** Luồng học sinh từ Đăng nhập $\rightarrow$ Làm bài 2 pha $\rightarrow$ Chấm điểm server $\rightarrow$ Lưu SQLite bền vững khi F5 $\rightarrow$ Đạt 65/65 automated test xanh.
2. **Trọng tâm giáo dục sáng tạo:** Chuyển dịch **Ước lượng là trọng tâm chiếm 70% tổng điểm** (55% Base + 15% Time Bonus) và **Tính đúng 30%** (25% Base + 5% Time Bonus); phân cấp 5 bậc logic sư phạm rõ ràng (🥇 Vàng / 🥈 Bạc / 🥉 Đồng / 🌱 Khuyến khích / ✏️ Cần cố gắng).
3. **Trải nghiệm thân thiện lứa tuổi 8–9 (Accessibility, UX & Ergonomics):**
   - **Tách riêng thời gian từng câu:** Đồng hồ 60s/pha hoạt động độc lập cho từng câu, không chạy liên tục qua các câu khiến học sinh bị cuống; học sinh hoàn toàn chủ động bấm "Làm Câu tiếp theo".
   - **Gợi ý sư phạm sau 30 giây:** Nếu qua 30s đầu mà học sinh chưa nghĩ ra cách làm, chú Ong Vàng sẽ tự động hiện ra mách nước phép làm tròn cụ thể.
   - **Công thái học siêu to, dễ bấm:** Ô nhập số và nút bấm được phóng to (h-16 đến h-20), chữ số cực to rõ ràng, hỗ trợ 100% phím Tab/Enter và ARIA live.

---

## 👥 2. Phân vai phối hợp trong 5 phút

| Thành viên / Vai trò | Nhiệm vụ chính trong 5 phút | Thiết bị / Vị trí |
|:---|:---|:---|
| **Võ Tấn Đạt** *(Backend / Arch)* | **Thuyết trình chính:** Dẫn dắt câu chuyện bài toán sư phạm, giải thích tỷ lệ 70/30, tính tất định trên server và show kết quả `npm test`. | Đứng gần màn hình / cầm micro trình bày |
| **Nguyễn Minh Quang** *(Frontend / UX)* | **Thao tác máy tính (Driver):** Chia sẻ màn hình, thao tác trình duyệt bằng bàn phím (Tab/Enter), thực hiện các ca test mẫu trực quan. | Ngồi trực tiếp điều khiển laptop kết nối máy chiếu |
| **Bùi Tiến Đạt** *(Lead / BA / Tester)* | **Hỗ trợ & Ghi chép phản hồi:** Bấm đồng hồ canh giờ chuẩn 5 phút, giải trình về phân cấp điểm neo SGK và ghi lại ý kiến góp ý của GV/TA. | Quan sát thời gian & ghi sổ tay |

---

## ⏱️ 3. Kịch bản chi tiết từng phút (Minute-by-Minute Script)

### 🟢 Phút 0:00 – 0:45: Giới thiệu bài toán & Thiết kế đột phá
* **Người nói:** Backend / Architect
* **Màn hình hiển thị:** Trang chủ Vườn Toán Lớp 3 (`http://localhost:3000`)
* **Lời thoại mẫu:**
  > *"Kính chào Thầy/Cô và anh/chị TA. Nhóm 04 (Lớp 173820) xin phép demo tiến độ Checkpoint 2 dạng bài 'Ước lượng trước khi tính đúng'.*  
  > *Xuất phát từ thực tế học sinh lớp 3 hay lười ước lượng mà thường đặt tính ra nháp rồi điền vào, nhóm em đã thiết kế lại toàn diện:  
  > 1. Phân bổ **Ước lượng là trọng tâm chiếm 70% tổng điểm**, Tính đúng chỉ chiếm 30%.  
  > 2. Tích hợp **Bộ đếm thời gian thích ứng 60s/pha** kết hợp thưởng tốc độ phản xạ logic để kích thích tư duy nhẩm nhanh.  
  > 3. Áp dụng **Phân cấp 5 bậc điểm neo logic sư phạm** chuẩn SGK Kết nối tri thức. Sau đây nhóm xin demo trực tiếp trên hệ thống."*

---

### 🟡 Phút 0:45 – 2:30: Live Demo luồng học sinh làm bài 2 pha
* **Thao tác màn hình:** Frontend Developer
* **Lời thoại thuyết minh:**
  1. **Đăng nhập:** Nhập `hocsinh01` / `123456` $\rightarrow$ Vào **Bài 16: "Phiếu luyện tập: Ước lượng trước khi tính đúng (Cộng, Trừ, Nhân, Chia)"**.
  2. **Trình diễn Pha 1 (Ước lượng) & Gợi ý sau 30s:**
     * Hiện câu hỏi `38 + 49 = ?` với khung số cực to, rõ nét (`text-4xl`).
     * **Điểm nhấn UX/A11y:** Ô tính đúng bị khóa; đồng hồ 60s chạy độc lập cho riêng câu này (các câu khác chưa mở).
     * **Gợi ý sau 30s:** Minh họa nếu học sinh chần chừ qua 30s, hộp gợi ý cách làm tự động mở ra: *"Làm tròn 38 lên 40, 49 lên 50. Nhẩm tính: 40 + 50 = ?"*.
     * Học sinh gõ `90` vào ô Ước lượng to rõ $\rightarrow$ **Nhấn Enter**.
     * **Hệ thống tự động kích hoạt Pha 2** và chuyển con trỏ focus ngay vào ô Tính đúng.
  3. **Trình diễn Pha 2 (Tính đúng) & Tách riêng thời gian chuyển câu:**
     * Số ước lượng `90` được giữ nguyên làm mốc đối chiếu trực quan.
     * Bộ đếm 60s riêng của Pha 2 đếm ngược.
     * Học sinh tính ra kết quả chính xác `87`. Gõ `87` $\rightarrow$ **Nhấn Enter**.
     * **Đồng hồ lập tức dừng lại hoàn toàn:** Xuất hiện khối hoàn thành câu gọn gàng: *"Đã hoàn thành Câu 1"* kèm nút: `Làm Câu 2`. Không hề có áp lực thời gian chạy liên tục qua các câu!
     * Bấm `Làm Câu 2` $\rightarrow$ Màn hình cuộn mượt xuống Câu 2 và **lúc này mới bắt đầu tính giờ cho Câu 2**.
  4. **Nộp bài & Trả về thẻ kết quả tức thì (Instant Feedback):**
     * Click nút lớn **"Nộp bài & Chấm điểm"**.
     * Màn hình bung thẻ kết quả 2 tầng:
       * 🥇 **Huy hiệu VÀNG:** *"Xuất sắc! Em ước lượng 90 chuẩn theo điểm neo SGK (làm tròn số tròn chục)."*
       * ⏱️ **Thưởng tốc độ:** Đạt chuẩn Mốc Vàng ($t_1 \le 15s$, $t_2 \le 20s$).
       * 🐝 **Lời giảng chú Ong Vàng:** Giải thích chi tiết phép tính làm tròn $38 \rightarrow 40, 49 \rightarrow 50$.

---

### 🟠 Phút 2:30 – 3:45: Trình diễn các tình huống sư phạm & Chống gian lận (Anti-Cheat)
* **Người nói:** Backend & BA Tester
* **Thao tác màn hình:** Thực hiện nhanh 3 tình huống trên phiếu bài:
  1. **Tình huống 1 — Học sinh gian lận điền kết quả đúng vào ô ước lượng:**
     * Ví dụ: Đề bài `54 + 27 = ?`, học sinh nhập thẳng `81` vào ô ước lượng.
     * **Kết quả:** Hệ thống xếp vào **Điểm neo Đồng (50% Base)** kèm lời khuyên thân thiện: *"Em tính nhẩm ra đúng kết quả 81! Tuy nhiên ở bước ước lượng, em nên làm tròn thành số tròn chục (80) để kiểm tra nhanh nhé! 💡"*.
  2. **Tình huống 2 — Học sinh ước lượng theo chiến lược linh hoạt (Điểm neo Bạc):**
     * Học sinh làm tròn 1 số: $54 + 30 = 84$.
     * **Kết quả:** Hệ thống công nhận **Huy hiệu Bạc (75% Base)** 🥈 vì tư duy làm tròn hợp lý.
  3. **Tình huống 3 — Chống gian lận thời gian (Anti-Cheat):**
     * Nếu học sinh gõ số bừa quá nhanh ($t_1 = 3s$) nhưng số nằm ngoài dung sai $\rightarrow$ Hệ thống chấm **0 điểm ước lượng** và **tuyệt đối không cộng điểm thưởng thời gian**.

---

### 🔵 Phút 3:45 – 4:30: Chứng minh kiến trúc kỹ thuật, SQLite & Automated Test
* **Thao tác màn hình:**
  1. **Bền vững dữ liệu (B-05):**
     * Tại trang bài tập vừa hoàn thành, **nhấn F5 (Reload trang)**.
     * Màn hình phục hồi ngay điểm số 100%, số sao tích lũy và trạng thái hoàn thành từ bảng `attempts` và `progress` của SQLite.
  2. **Bảo mật Anti-Cheat API (B-04):**
     * Mở tab Network $\rightarrow$ Request `GET /api/question-sets/uoc-luong-toan-lop-3/questions`: Chứng minh response trả về **hoàn toàn sạch**, không hề có `correct_answer` hay điểm neo nào.
  3. **Kiểm thử tự động Jest (B-08, B-09):**
     * Mở Terminal chạy lệnh:
       ```bash
       npm test
       ```
     * Chiếu kết quả: **2 Test Suites, 65/65 tests PASS (55 Unit tests + 10 Integration tests)** xanh 100% trong 0.8 giây.

---

### ⚪ Phút 4:30 – 5:00: Kết luận & Xin ý kiến Giảng viên / TA
* **Người nói:** Lead / Cả nhóm
* **Lời kết:**
  > *"Dạ thưa Thầy/Cô, đến thời điểm hiện tại nhóm 04 đã hoàn thành trọn vẹn Vertical Slice với cả 4 phép tính (+, -, ×, :).  
  > Để chuẩn bị bước vào giai đoạn Harden trước Code Freeze (19/11), nhóm em xin phép được lắng nghe góp ý từ Thầy/Cô về:  
  > 1. Trải nghiệm màu sắc của bộ đếm 60s đã đủ dịu mắt và tránh gây căng thẳng cho học sinh lớp 3 chưa?  
  > 2. Các mốc thưởng thời gian (15s cho ước lượng và 20s cho tính đúng) có cần tinh chỉnh thêm cho phù hợp với năng lực học sinh đại trà không ạ? Nhóm em xin cảm ơn Thầy/Cô!"*

---

## ❓ 4. Cheat Sheet: Bộ câu hỏi vấn đáp dự kiến của TA/GV

| Câu hỏi TA/GV có thể hỏi | Hướng trả lời chuẩn xác của nhóm |
|:---|:---|
| **Q1: Tại sao nhóm lại chọn tỷ trọng 70% Ước lượng và 30% Tính đúng?** | Dạng bài này tên là *"Ước lượng trước khi tính đúng"*. Nếu để tỷ trọng 50/50 hoặc thấp hơn, học sinh sẽ chỉ chăm chú tính đúng để lấy điểm an toàn. Nhóm đặt 70% để khẳng định năng lực ước lượng nhẩm là kỹ năng sống và tư duy chính yếu cần rèn luyện theo đúng tinh thần SGK GDPT 2018. |
| **Q2: Nếu học sinh nhập số thập phân, chuỗi chữ hoặc số âm thì hệ thống xử lý thế nào?** | Hàm `scoring.js` có regex bảo vệ `/^\d{1,6}$/`. Nếu nhập chữ, số âm, số thập phân hoặc khoảng trắng, hệ thống chuẩn hóa về `NaN`, xếp vào bậc `OUT_OF_RANGE` (0 điểm) và đưa ra lời nhắc nhập số nguyên hợp lệ, không gây crash server. |
| **Q3: Thuật toán chấm điểm có gọi API AI nào lúc chạy không?** | **Tuyệt đối không!** 100% thuật toán chạy bằng Node.js thuần tất định trên server theo các quy tắc toán học đã đặc tả tại `artifacts/DECISIONS.md#adr-01`. AI chỉ được nhóm dùng lúc thiết kế và viết test cases (có lưu vết trong `AI_USE.md`). |
| **Q4: Làm sao ngăn học sinh gian lận xem trước đáp án bằng F12?** | Endpoint `GET /question-sets/:setId/questions` chỉ select các trường `id, type, prompt, points, category`. Toàn bộ `correct_answer`, `gold_anchor` và dải dung sai nằm an toàn trong database server. Client chỉ biết kết quả sau khi nộp bài lên `POST /submissions`. |

---

## ✅ 5. Danh sách chuẩn bị trước giờ G ngày mai
- [ ] Chạy sẵn `npm test` để bảo đảm 65 tests đều xanh.
- [ ] Khởi động server sẵn bằng `node server/index.js` (hoặc `npm start`).
- [ ] Mở sẵn trình duyệt tại `http://localhost:3000` và đăng nhập sẵn tài khoản `hocsinh01` / `123456`.
- [ ] Mở sẵn cửa sổ VS Code / Terminal tại thư mục `D:\Hackathon_KTPM\ktpmud-bkt-vuontoan-starter`.
- [ ] Chuẩn bị sẵn dây cáp HDMI / cáp chuyển đổi kết nối máy chiếu.
