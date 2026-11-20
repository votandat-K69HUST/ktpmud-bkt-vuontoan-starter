---
marp: true
theme: gaia
_class: lead
paginate: true
backgroundColor: #f1f5f9
color: #0f172a
footer: 'Track B: Vườn Toán Lớp 3  •  Nhóm 173820_N04  •  KTPMUD Hackathon 2026'
---

# 🌱 VƯỜN TOÁN LỚP 3
## Mở Rộng Dạng Bài: "Ước Lượng Trước Khi Tính Đúng" (Track 2)
### Kiến trúc Brownfield — Chấm điểm Tất định — Công thái học Tiểu học

**Mã đề thi:** `KTPMUD-BKT-2026-PILOT` · **Slug:** `hoang_mai_toan`  
**Nhóm thực hiện:** `173820_n04` · **Lớp:** 173820

**Thành viên nhóm:**
- **Bùi Tiến Đạt (202414018)** — Lead / BA / QA Tester (34%)
- **Võ Tấn Đạt (202414021)** — Backend / System Architect (33%)
- **Nguyễn Minh Quang (20233605)** — Frontend / UX Engineer (33%)

> ⏱️ **Thời lượng thuyết trình:** Đúng 7 phút (420 giây) + 8 phút Vấn đáp Q&A

<!-- 
SPEAKER NOTES (Phút 0:00 - 0:40):
"Kính chào Thầy/Cô trong Hội đồng chấm thi và các bạn sinh viên. 
Em là Võ Tấn Đạt, đại diện cho nhóm 173820_n04, cùng hai bạn Bùi Tiến Đạt và Nguyễn Minh Quang. 
Hôm nay, nhóm em xin phép được trình bày giải pháp kỹ thuật mở rộng tính năng 'Ước lượng trước khi tính đúng' cho nền tảng Vườn Toán Lớp 3 - Track B. 
Với thời lượng đúng 7 phút, bài trình bày của nhóm em sẽ đi qua 6 trọng tâm: từ bài toán sư phạm, kiến trúc thuật toán tất định, thiết kế công thái học tiểu học, an toàn dữ liệu, bộ test 65 ca xanh đến kế hoạch phát triển tương lai. Em xin phép bắt đầu ạ!"
-->

---

## 🎯 Slide 2: Đặt Vấn Đề & Ý Nghĩa Sư Phạm (GDPT 2018)
### *Từ thói quen lười nhẩm tính đến Năng lực cảm nhận số (Number Sense)*

* **Thực trạng học sinh lớp 3:**
  - Học sinh thường vội vã đặt tính cột dọc ra nháp mà **bỏ qua bước nhẩm độ lớn**.
  - Dễ mắc lỗi sai thô thiển nhưng không tự phát hiện: quên nhớ hàng chục ($38 + 49 = 77$), nhầm hàng đơn vị, đoán thương quá xa trong phép chia.
* **Mục tiêu của Chương trình GDPT 2018 (SGK Kết nối tri thức với cuộc sống):**
  - Rèn luyện **Kỹ năng làm tròn số đến hàng chục gần nhất** ($\text{roundTen}$).
  - Hình thành **Phản xạ ước lượng nhẩm** trước khi thao tác cơ học.
  - Xây dựng **Trực giác số (Number Sense)** và cơ chế tự kiểm soát lỗi sai (Self-Regulation).

```
   [ Đọc phép toán: 38 + 49 ] 
           │
           ▼
   [ Bước 1: ƯỚC LƯỢNG NHẨM ] ➔ 38≈40, 49≈50 ➔ 40+50 = 90
           │
           ▼
   [ Bước 2: ĐẶT TÍNH ĐÚNG  ] ➔ 38 + 49 = 87
           │
           ▼
   [ Bước 3: ĐỐI CHIẾU SƯ PHẠM ] ➔ 87 rất sát 90 ➔ Tự tin đáp án đúng!
```

> ⏱️ **Thời gian phân bổ:** Phút 0:40 – 1:30 (50 giây) · **Người trình bày:** Lead / BA

<!-- 
SPEAKER NOTES (Phút 0:40 - 1:30):
"Thưa Thầy/Cô, trong quá trình khảo sát thực tế dạy học Toán lớp 3, nhóm nhận thấy một vấn đề nhức nhối: khi gặp bài toán cộng trừ có nhớ hay nhân chia, các em học sinh có thói quen cắm cúi đặt tính ra giấy nháp ngay lập tức mà hoàn toàn bỏ qua bước nhẩm độ lớn của con số. Hậu quả là các em rất hay mắc lỗi cơ bản như quên nhớ—ví dụ 38 + 49 lại ra 77—nhưng không hề hay biết bài mình sai.
Theo chương trình GDPT 2018, kỹ năng ước lượng và làm tròn số là hạt nhân để xây dựng Number Sense—năng lực cảm nhận số. 
Khi học sinh nhẩm làm tròn 38 lên 40, 49 lên 50, tổng ước lượng phải xấp xỉ 90. Nếu tính ra 77, các em sẽ giật mình nhận ra sai lệch quá xa và có phản xạ tự kiểm tra lại. 
Đó chính là lý do nhóm xây dựng dạng bài 2 pha: bắt buộc ước lượng nhẩm trước, sau đó mới tính đúng để đối chiếu!"
-->

---

## ⚙️ Slide 3: Kiến Trúc Core Math Engine Tất Định
### *Trọng số 70/30 · Phân cấp 5 Bậc Điểm Neo · Thưởng Tốc Độ Time Bonus*

* **Đổi mới trọng tâm — Ước lượng chiếm 70% tổng điểm:**
  - **Pha 1: Ước lượng nhẩm (Tối đa 70%):** 55% Base logic + 15% Time Bonus.
  - **Pha 2: Đặt tính đúng (Tối đa 30%):** 25% Base logic + 5% Time Bonus.
* **Phân cấp 5 bậc Điểm neo Logic Sư phạm (Deterministic 100% không dùng AI lúc runtime):**
  1. 🥇 **Điểm neo Vàng (`GOLD_ANCHOR` - 100% Base):** Làm tròn chuẩn SGK cả 2 toán hạng ($38 + 49 \rightarrow 40 + 50 = 90$).
  2. 🥈 **Điểm neo Bạc (`SILVER_ANCHOR` - 75% Base):** Làm tròn linh hoạt 1 toán hạng ($54 + 27 \rightarrow 50 + 27 = 77$ hoặc $54 + 30 = 84$).
  3. 🥉 **Hạng Đồng (50% Base):** Nhập ngay kết quả tính đúng vào ô ước lượng (`EXACT_MATCH_IN_ESTIMATE`) hoặc làm tròn cận trên/dưới.
  4. 🌱 **Điểm khuyến khích (`TOLERANCE_ONLY` - 35% Base):** Nằm trong dung sai $\pm 15\%$ nhưng không theo quy tắc.
  5. ✏️ **Ngoài khoảng (`OUT_OF_RANGE` - 0% Base):** Sai lệch quá lớn hoặc nhập ký tự lạ.
* **Công thức thưởng tốc độ thích ứng & Anti-cheat:**
  $$\text{TimeBonus}_{est} = \text{round}\left(15 \times \frac{\max(0, 60 - t_{est})}{60}\right) \quad (\text{Chỉ thưởng khi điểm logic } > 0)$$

> ⏱️ **Thời gian phân bổ:** Phút 1:30 – 2:40 (70 giây) · **Người trình bày:** Backend / Architect

<!-- 
SPEAKER NOTES (Phút 1:30 - 2:40):
"Để hiện thực hóa triết lý sư phạm này, kiến trúc lõi server/scoring.js của nhóm tạo ra một bước đột phá:
Thứ nhất, nhóm quyết định đảo ngược trọng số truyền thống: ƯỚC LƯỢNG LÀ TRỌNG TÂM CHIẾM 70% TỔNG ĐIỂM, tính đúng chỉ chiếm 30%. Nếu chia 50/50, học sinh sẽ chỉ chăm chú tính đúng để ăn chắc điểm. 70% sẽ thúc đẩy các em tự tin ước lượng nhẩm nhanh!
Thứ hai, server không dùng bất kỳ mô hình AI nào lúc runtime để đảm bảo tính tất định 100%. Nhóm phân cấp 5 bậc điểm neo: từ Điểm neo Vàng chuẩn SGK, Điểm neo Bạc linh hoạt, đến việc xử lý tinh tế trường hợp học sinh 'khôn lỏi' tính ra kết quả đúng rồi điền vào ô ước lượng—hệ thống chấm 50% điểm và hiện lời khuyên nhắc nhở giúp em hiểu bản chất.
Thứ ba, công thức Time Bonus thưởng điểm theo tốc độ suy luận, nhưng có cơ chế Anti-cheat chặt chẽ: nếu em gõ bừa số sai trong 2 giây, hệ thống cho 0 điểm và tuyệt đối không cộng dù chỉ 1 điểm thưởng thời gian!"
-->

---

## 🎨 Slide 4: Thiết Kế Trải Nghiệm UX 2 Pha & Công Thái Học Tiểu Học
### *Bộ Đếm 60s Độc Lập Từng Câu · Ong Vàng Sau 30s · Bộ Đôi Bảo Vệ Thao Tác*

* **UX Thẻ Tương Tác 2 Pha (`lesson.js`):**
  - Pha 1: Ô tính đúng bị khóa, ép phản xạ ước lượng. Sau khi nộp $\rightarrow$ mở Pha 2 và giữ nguyên số ước lượng làm mốc đối chiếu.
* **Bộ đếm thời gian 60s độc lập từng câu (Per-Question Isolated Timer):**
  - Đồng hồ đếm ngược riêng cho từng câu; hoàn thành Câu 1 thì dừng lại hoàn toàn.
  - Học sinh chủ động bấm *"Làm Câu tiếp theo"* mới tính giờ Câu 2 $\rightarrow$ **Giải tỏa 100% áp lực tâm lý dồn dập**.
* **Cơ chế trợ giảng — Chú Ong Vàng xuất hiện sau 30 giây:**
  - Nếu sau 30s học sinh chưa điền được số, chú Ong Vàng tự động gợi ý cách làm tròn theo SGK.
* **Bộ đôi bảo vệ công thái học (Ergonomics Guard — Tiêu chí B-12):**
  - 🛡️ **Mouse Wheel Guard:** Chặn triệt để sự kiện cuộn chuột `wheel` trên ô số, không lo bị nhảy số khi cuộn trang xem đề.
  - 🛑 **Empty Input Guard:** Ngăn chặn việc bấm Enter / Next khi ô còn rỗng lúc còn thời gian; hiển thị hộp nhắc nhở màu hổ phách dịu dàng và tự động focus con trỏ.

> ⏱️ **Thời gian phân bổ:** Phút 2:40 – 3:50 (70 giây) · **Người trình bày:** Frontend / UX

<!-- 
SPEAKER NOTES (Phút 2:40 - 3:50):
"Chuyển sang phần giao diện người dùng trên lesson.js, nhóm đặc biệt chú trọng đến tâm sinh lý của trẻ 8-9 tuổi:
Thứ nhất, nhiều hệ thống kiểm tra có đồng hồ chạy dồn dập khiến trẻ tiểu học hoảng loạn. Nhóm em thiết kế bộ đếm 60s hoàn toàn độc lập cho từng câu. Làm xong câu 1, đồng hồ dừng hẳn. Bé có thể nghỉ ngơi, uống ngụm nước rồi bấm 'Làm Câu tiếp theo' thì đồng hồ câu mới bắt đầu chạy!
Thứ hai, nếu sau 30s bé bị 'kẹt' tư duy, chú Ong Vàng thân thiện sẽ bay ra gợi ý quy tắc làm tròn SGK để bé không bị nản lòng.
Thứ ba, đây là điểm sáng công thái học của nhóm: Trẻ em dùng chuột rất vụng về, khi cuộn trang rất dễ vô tình làm lăn con lăn chuột khiến số trong ô bị nhảy mà không biết. Nhóm đã tích hợp Mouse Wheel Guard triệt tiêu 100% sự kiện cuộn chuột trên ô số! Đồng thời có Empty Input Guard ngăn bé bấm vội Enter làm mất lượt khi ô còn rỗng. Tất cả đều hỗ trợ 100% phím bấm Tab/Enter cho các bạn khuyết tật vận động theo chuẩn A11y!"
-->

---

## 🔒 Slide 5: An Toàn Hệ Thống & Bền Vững Dữ Liệu
### *Tuân Thủ Ranh Giới Brownfield · Anti-Cheat Server-Side · Bền Vững SQLite*

* **Tuân thủ ranh giới an toàn tuyệt đối (Acceptance Criteria B-07):**
  - Giữ nguyên 100% file xác thực `server/auth.js`, cơ chế session cookie httpOnly và các route quản trị giáo viên. Không gây hồi quy (Zero Regression).
* **Bảo mật đề thi & Chống gian lận Client-side (Tiêu chí B-04):**
  - Endpoint `GET /api/question-sets/:id/questions` bóc tách triệt để đáp án.
  - Học sinh mở F12 DevTools hoặc tab Network **tuyệt đối không thể tìm thấy đáp án đúng** hay khoảng điểm neo.
* **Bền vững trạng thái với SQLite Transaction (Tiêu chí B-05):**
  - Quá trình lưu `attempts`, cập nhật điểm tốt nhất trong `progress` và cộng dồn sao `total_stars` được bọc trọn vẹn trong một **Transaction nguyên tử** (`better-sqlite3`).
  - **F5 Reload Test:** Khi học sinh bấm tải lại trang hoặc rớt mạng nhẹ, điểm số và số sao đã tích lũy vẫn bảo toàn nguyên vẹn 100%.

| Lớp bảo vệ | Cơ chế thực thi | Kết quả kiểm chứng |
|:---|:---|:---:|
| **API Defense** | Bóc tách server-side tại `api.js` | F12 sạch 100% |
| **Auth Boundary** | Giữ nguyên `server/auth.js` | Zero bug, an toàn |
| **Data Integrity** | SQLite Atomic Transaction | F5 reload không mất bài |

> ⏱️ **Thời gian phân bổ:** Phút 3:50 – 4:50 (60 giây) · **Người trình bày:** Backend / Architect

<!-- 
SPEAKER NOTES (Phút 3:50 - 4:50):
"Về mặt an toàn hệ thống và kiến trúc dữ liệu:
Một trong những yêu cầu khắt khe nhất của bài thi là tuân thủ ranh giới an toàn brownfield B-07. Nhóm cam kết không sửa đổi bất kỳ dòng nào trong server/auth.js cũng như hệ thống session cookie và phân quyền giáo viên.
Thứ hai, để chống gian lận đề thi (B-04), khi client gọi API lấy danh sách câu hỏi, server lập tức lọc bỏ hoàn toàn các trường correct_answer, gold_anchor hay silver_anchors. Dù học sinh có am hiểu công nghệ mở F12 Inspect thì dữ liệu nhận về cũng hoàn toàn sạch sẽ!
Thứ ba, toàn bộ quá trình nộp bài, tính điểm, cập nhật sao được thực hiện bằng Transaction đồng bộ trong better-sqlite3. Khi học sinh làm xong, dù có vô tình bấm F5 tải lại trang hay tắt trình duyệt mở lại, tiến độ và sao tích lũy vẫn được hiển thị nguyên vẹn từ cơ sở dữ liệu!"
-->

---

## 🧪 Slide 6: Đảm Bảo Chất Lượng & Tự Động Hóa CI/CD
### *Bộ Kiểm Thử 65/65 Tests Xanh · Phủ Kín Biên & Lỗi Nhập Liệu · GitHub Actions*

* **Chiến lược kiểm thử toàn diện (Jest 29 & Supertest):**
  - **55 Unit Tests (`scoring.test.js`):** Kiểm tra thuật toán làm tròn `roundTen()`, 5 bậc điểm neo cho cả 4 phép tính (+, -, ×, :), công thức thưởng thời gian và cơ chế Anti-cheat.
  - **10 Integration Tests (`api.test.js`):** Kiểm thử toàn bộ chu kỳ API `/api/submissions`, giấu đáp án câu hỏi và tính bền vững khi tải lại trang.
  - **Bao phủ 100% các ca bất thường:** Chuỗi chữ (`abc`), ký tự đặc biệt, số âm, số thực, ô rỗng, spam phím.

```
PASS tests/integration/api.test.js (10 tests)
PASS tests/unit/scoring.test.js    (55 tests)

Test Suites: 2 passed, 2 total
Tests:       65 passed, 65 total
Snapshots:   0 total
Time:        0.943 s (Siêu tốc < 1 giây)
```

* **Tự động hóa CI Pipeline (GitHub Actions - B-10):**
  - Cấu hình `.github/workflows/ci.yml` tự động chạy `npm ci` và `npm test` trên mọi Push và Pull Request.
  - Đạt chuẩn **Clean Checkout 3 bước**: Clone $\rightarrow$ `npm ci` $\rightarrow$ `npm test` (Xanh 100%).

> ⏱️ **Thời gian phân bổ:** Phút 4:50 – 5:50 (60 giây) · **Người trình bày:** Lead / QA Tester

<!-- 
SPEAKER NOTES (Phút 4:50 - 5:50):
"Về công tác đảm bảo chất lượng phần mềm do bạn Bùi Tiến Đạt phụ trách:
Repo starter ban đầu hoàn toàn chưa có cấu hình kiểm thử tự động. Nhóm đã thiết lập từ đầu môi trường test hiện đại với Jest 29 và Supertest.
Hiện tại, dự án sở hữu bộ test đồ sộ gồm 65 ca test tự động, trong đó có 55 unit tests và 10 integration tests.
Bộ test không chỉ kiểm tra các trường hợp chuẩn mà còn bao phủ toàn bộ các ca kiểm thử biên (Boundary), các tình huống học sinh nhập chữ, nhập số âm, nhập khoảng trắng hay spam dữ liệu rỗng.
Toàn bộ 65 ca test chạy hoàn tất chỉ trong 0.94 giây và đạt tỷ lệ 100% Pass xanh lá!
Đồng thời, nhóm đã thiết lập GitHub Actions CI tự động kích hoạt kiểm thử mỗi khi có Pull Request, đảm bảo không có bất kỳ dòng code lỗi nào lọt vào nhánh chính!"
-->

---

## 🚀 Slide 7: Tổng Kết Kết Quả & Định Hướng Phát Triển
### *Hoàn Thành 100% Tiêu Chí Nghiệm Thu · Sẵn Sàng Bàn Giao Handoff*

* **Kết quả đạt được của Nhóm 173820_n04:**
  - ✅ **Hoàn thành trọn vẹn 12/12 Acceptance Criteria (B-01 đến B-12)**.
  - ✅ **Vertical Slice chạy mượt mà end-to-end**, sẵn sàng demo trực tiếp.
  - ✅ **Bộ hồ sơ tài liệu quy chuẩn:** SRS (`REQUIREMENTS.md`), 5 ADRs (`DECISIONS.md`), Test Plan (`TEST_PLAN.md`), Nhật ký đóng góp (`CONTRIBUTIONS.md`), Nhật ký AI minh bạch (`AI_USE.md`).
  - ✅ **Đóng gói bản phát hành:** Tag `bkt-2026-173820_n04-rc1` sạch sẽ, sẵn sàng nộp PR.
* **Định hướng phát triển tương lai (Handoff Roadmap):**
  1. *Thích ứng hóa lộ trình học:* Dựa vào chỉ số Time Bonus để gợi ý bài tập nâng cao hoặc hỗ trợ học sinh tiếp thu chậm.
  2. *Âm thanh sư phạm tích cực:* Bổ sung âm thanh chúc mừng sinh động khi học sinh đạt Huy hiệu Vàng.
  3. *Báo cáo giáo viên chuyên sâu:* Thêm biểu đồ phân tích kỹ năng ước lượng vào dashboard Góc Giáo Viên.

---

### 🎉 Xin trân trọng cảm ơn Thầy/Cô và Hội đồng chấm thi!
**Nhóm 173820_n04 sẵn sàng bước vào phần Vấn đáp Q&A và Live Demo!**

> ⏱️ **Thời gian phân bổ:** Phút 5:50 – 7:00 (70 giây) · **Người trình bày:** Toàn bộ thành viên

<!-- 
SPEAKER NOTES (Phút 5:50 - 7:00):
"Tổng kết lại, nhóm 173820_n04 đã hoàn thành xuất sắc toàn bộ 12 tiêu chí nghiệm thu từ B-01 đến B-12 của Track B, từ một codebase brownfield ban đầu trở thành một sản phẩm giáo dục hoàn chỉnh, thân thiện và an toàn.
Hồ sơ bàn giao của nhóm đã sẵn sàng 100% với đầy đủ tài liệu kiến trúc, kế hoạch test và nhật ký đóng góp minh bạch để các khóa sau có thể tiếp tục kế thừa và phát triển thêm các tính năng âm thanh sư phạm hay báo cáo phân tích cho giáo viên.
Nhóm em xin chân thành cảm ơn sự lắng nghe và hướng dẫn tận tình của Thầy/Cô trong suốt thời gian qua. Sau đây, nhóm em xin phép được mời Thầy/Cô bước vào phần Live Demo trực tiếp hệ thống và phần vấn đáp chuyên sâu ạ!"
-->
