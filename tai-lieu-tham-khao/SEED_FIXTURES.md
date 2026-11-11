# 📐 BỘ 16 CÂU HỎI MẪU SYNTHETIC: ƯỚC LƯỢNG TRƯỚC KHI TÍNH ĐÚNG (FIXTURES)
> **Áp dụng cho:** Tiêu chí Acceptance Criteria B-02, B-03, B-06, B-08 & B-12  
> **Chương trình:** Toán Lớp 3 — Chuẩn GDPT 2018 (Bộ sách Kết nối tri thức với cuộc sống & Cánh diều)  
> **Bộ đề mã:** `uoc-luong-toan-lop-3`  
> **Vị trí tích hợp:** Phiếu bài tập chuyên đề: *"Luyện tập ước lượng và làm tròn số trong phạm vi 1.000"*  
> **Cấu trúc:** 16 câu hỏi phân bố đều 4 mạch kiến thức: **4 câu Phép cộng 2 chữ số, 4 câu Phép trừ 2 chữ số, 4 câu Phép nhân, 4 câu Phép chia**.  
> **Thiết kế mới:** Bộ đếm thời gian thích ứng tối đa 60 giây/pha, phân bổ trọng số **Ước lượng 70%** (55% Base + 15% Time Bonus) & **Đặt tính đúng 30%** (25% Base + 5% Time Bonus), phân cấp logic sư phạm 5 bậc (Điểm neo Vàng 🥇, Điểm neo Bạc 🥈, Nhập kết quả đúng ⚠️, Trong khoảng 💡, Ngoài khoảng ❌).

---

## 1. Bảng đặc tả sư phạm toàn diện 16 câu hỏi mẫu

| STT | Mã câu | Phép tính (Prompt) | Mạch kiến thức / Phân loại | Điểm neo Vàng (Gold Anchor) | Các điểm neo Bạc hợp lệ (Silver Anchors) | Khoảng ước lượng hợp lý $[E_{min}, E_{max}]$ | Kết quả đúng ($A$) | Lời giải thích sư phạm cho học sinh Lớp 3 |
|:---:|:---|:---|:---|:---:|:---|:---:|:---:|:---|
| **I** | **PHÉP CỘNG CÁC SỐ CÓ 2 CHỮ SỐ** | | | | | | | |
| 1 | `est-add-01` | **38 + 49 = ?** | Cộng có nhớ (Cả hai số làm tròn lên) | **90**<br/>($40 + 50$) | `[88, 89, 70]`<br/>(Làm tròn 1 số: $38+50=88$, $40+49=89$; xuống cả hai: $30+40=70$) | **[74, 100]** | **87** | *"Làm tròn 38 lên 40, làm tròn 49 lên 50. Ta nhẩm 40 + 50 = 90. Khi đặt tính: 38 + 49 = 87 (8 + 9 = 17, viết 7 nhớ 1; 3 + 4 = 7, thêm 1 bằng 8)."* |
| 2 | `est-add-02` | **54 + 27 = ?** | Cộng có nhớ (Một số làm tròn xuống, một số làm tròn lên) | **80**<br/>($50 + 30$) | `[77, 84, 90, 70]`<br/>(Làm tròn 1 số: $50+27=77$, $54+30=84$; lên cả hai: $60+30=90$; xuống cả hai: $50+20=70$) | **[70, 95]** | **81** | *"Làm tròn 54 xuống 50, làm tròn 27 lên 30. Ta nhẩm 50 + 30 = 80. Khi đặt tính: 54 + 27 = 81 (4 + 7 = 11, viết 1 nhớ 1; 5 + 2 = 7, thêm 1 bằng 8)."* |
| 3 | `est-add-03` | **61 + 28 = ?** | Cộng không nhớ (Một số làm tròn xuống, một số làm tròn lên) | **90**<br/>($60 + 30$) | `[88, 91, 80]`<br/>(Làm tròn 1 số: $60+28=88$, $61+30=91$; xuống cả hai: $60+20=80$) | **[75, 100]** | **89** | *"Làm tròn 61 xuống 60, làm tròn 28 lên 30. Ta nhẩm 60 + 30 = 90. Khi đặt tính: 61 + 28 = 89 (1 + 8 = 9; 6 + 2 = 8)."* |
| 4 | `est-add-04` | **45 + 36 = ?** | Cộng có nhớ (Số tận cùng bằng 5 làm tròn lên) | **90**<br/>($50 + 40$) | `[80, 85, 86, 70]`<br/>(Nếu 45 làm tròn xuống: $40+40=80$; làm tròn 1 số: $45+40=85$, $50+36=86$; xuống cả hai: $40+30=70$) | **[70, 95]** | **81** | *"Làm tròn 45 lên 50 (hàng đơn vị là 5), làm tròn 36 lên 40. Ta nhẩm 50 + 40 = 90. Khi đặt tính: 45 + 36 = 81 (5 + 6 = 11, viết 1 nhớ 1; 4 + 3 = 7, thêm 1 bằng 8)."* |
| **II** | **PHÉP TRỪ CÁC SỐ CÓ 2 CHỮ SỐ** | | | | | | | |
| 5 | `est-sub-01` | **72 - 38 = ?** | Trừ có nhớ (Số bị trừ làm tròn xuống, số trừ làm tròn lên) | **30**<br/>($70 - 40$) | `[32, 40, 35]`<br/>(Làm tròn 1 số: $72-40=32$; số trừ làm tròn xuống: $70-30=40$; đệm neo: $35$) | **[25, 42]** | **34** | *"Làm tròn 72 xuống 70, làm tròn 38 lên 40. Ta nhẩm 70 - 40 = 30. Khi đặt tính: 72 - 38 = 34 (2 không trừ được 8, lấy 12 - 8 = 4 nhớ 1; 3 thêm 1 bằng 4, 7 - 4 = 3)."* |
| 6 | `est-sub-02` | **85 - 29 = ?** | Trừ có nhớ (Số bị trừ tận cùng bằng 5 làm tròn lên) | **60**<br/>($90 - 30$) | `[50, 55, 61]`<br/>(85 làm tròn xuống: $80-30=50$; làm tròn 1 số: $85-30=55$, $90-29=61$) | **[47, 68]** | **56** | *"Làm tròn 85 lên 90 (hàng đơn vị là 5), làm tròn 29 lên 30. Ta nhẩm 90 - 30 = 60. Khi đặt tính: 85 - 29 = 56 (15 - 9 = 6 nhớ 1; 2 thêm 1 bằng 3, 8 - 3 = 5)."* |
| 7 | `est-sub-03` | **91 - 43 = ?** | Trừ có nhớ (Cả hai số đều làm tròn xuống) | **50**<br/>($90 - 40$) | `[40, 47, 51]`<br/>(43 làm tròn lên: $90-50=40$; làm tròn 1 số: $90-43=47$, $91-40=51$) | **[40, 58]** | **48** | *"Làm tròn 91 xuống 90, làm tròn 43 xuống 40. Ta nhẩm 90 - 40 = 50. Khi đặt tính: 91 - 43 = 48 (11 - 3 = 8 nhớ 1; 4 thêm 1 bằng 5, 9 - 5 = 4)."* |
| 8 | `est-sub-04` | **67 - 21 = ?** | Trừ không nhớ (Số bị trừ làm tròn lên, số trừ làm tròn xuống) | **50**<br/>($70 - 20$) | `[47, 49, 40]`<br/>(Làm tròn 1 số: $67-20=47$, $70-21=49$; 67 làm tròn xuống: $60-20=40$) | **[38, 55]** | **46** | *"Làm tròn 67 lên 70, làm tròn 21 xuống 20. Ta nhẩm 70 - 20 = 50. Khi đặt tính: 67 - 21 = 46 (7 - 1 = 6; 6 - 2 = 4)."* |
| **III** | **PHÉP NHÂN SỐ CÓ 2 CHỮ SỐ VỚI SỐ CÓ 1 CHỮ SỐ** | | | | | | | |
| 9 | `est-mul-01` | **29 × 3 = ?** | Nhân có nhớ (Thừa số 1 làm tròn lên) | **90**<br/>($30 \times 3$) | `[75, 80, 85, 100]`<br/>(Nhẩm theo bội số 25: $25 \times 3 = 75$; lân cận điểm neo 80, 85, 100) | **[75, 105]** | **87** | *"Làm tròn 29 thành 30. Ta nhẩm 30 × 3 = 90. Khi đặt tính: 29 × 3 = 87 (3 × 9 = 27 viết 7 nhớ 2; 3 × 2 = 6, thêm 2 bằng 8)."* |
| 10 | `est-mul-02` | **48 × 4 = ?** | Nhân có nhớ lớn (Thừa số 1 làm tròn lên) | **200**<br/>($50 \times 4$) | `[160, 180, 210]`<br/>(48 làm tròn xuống 40: $40 \times 4 = 160$; làm tròn 45: $45 \times 4 = 180$; đệm: 210) | **[160, 230]** | **192** | *"Làm tròn 48 thành 50. Ta nhẩm 50 × 4 = 200. Khi đặt tính: 48 × 4 = 192 (4 × 8 = 32 viết 2 nhớ 3; 4 × 4 = 16, thêm 3 bằng 19)."* |
| 11 | `est-mul-03` | **19 × 5 = ?** | Nhân có nhớ vượt 100 (Thừa số 1 làm tròn lên) | **100**<br/>($20 \times 5$) | `[90, 105, 110]`<br/>(Làm tròn 18: $18 \times 5 = 90$; lân cận điểm neo 105, 110) | **[80, 115]** | **95** | *"Làm tròn 19 thành 20. Ta nhẩm 20 × 5 = 100. Khi đặt tính: 19 × 5 = 95 (5 × 9 = 45 viết 5 nhớ 4; 5 × 1 = 5, thêm 4 bằng 9)."* |
| 12 | `est-mul-04` | **82 × 4 = ?** | Nhân làm tròn xuống (Thừa số 1 làm tròn xuống) | **320**<br/>($80 \times 4$) | `[300, 330, 340]`<br/>(Lân cận điểm neo 300, 330, 340) | **[275, 375]** | **328** | *"Làm tròn 82 thành 80. Ta nhẩm 80 × 4 = 320. Khi đặt tính: 82 × 4 = 328 (4 × 2 = 8; 4 × 8 = 32)."* |
| **IV** | **PHÉP CHIA TRONG PHẠM VI 1.000** | | | | | | | |
| 13 | `est-div-01` | **84 : 4 = ?** | Chia hết (Số bị chia làm tròn xuống) | **20**<br/>($80 : 4$) | `[22, 23, 25]`<br/>(Thương lân cận 22, 23, 25) | **[17, 26]** | **21** | *"Làm tròn 84 thành 80. Ta nhẩm 80 : 4 = 20. Khi đặt tính chia: 84 : 4 = 21 (8 chia 4 được 2; 4 chia 4 được 1)."* |
| 14 | `est-div-02` | **178 : 6 = ?** | Chia có dư (Làm tròn đến bội số của 6) | **30**<br/>($180 : 6$) | `[25, 28, 32]`<br/>(Bội số 150 : 6 = 25; thương lân cận 28, 32) | **[24, 36]** | **29** | *"Làm tròn 178 thành 180 (bội số tròn chục của 6). Ta nhẩm 180 : 6 = 30. Kết quả tính: 178 : 6 = 29 (dư 4)."* |
| 15 | `est-div-03` | **48 : 6 = ?** | Chia trong bảng cửu chương | **8**<br/>(Bảng chia 6) | `[7, 9, 10]`<br/>(Thương lân cận trong bảng cửu chương) | **[6, 10]** | **8** | *"48 chia cho 6 bằng đúng 8 trong bảng chia 6 (vì 6 × 8 = 48)."* |
| 16 | `est-div-04` | **245 : 8 = ?** | Chia có dư (Làm tròn về bội số tròn chục của 8) | **30**<br/>($240 : 8$) | `[28, 29, 31, 32]`<br/>(Thương lân cận 28, 29, 31, 32) | **[25, 36]** | **30** | *"Làm tròn 245 thành 240 (bội số của 8). Ta nhẩm 240 : 8 = 30. Kết quả tính: 245 : 8 = 30 (dư 5)."* |

---

## 2. Định dạng JSON chuẩn sẵn sàng tích hợp vào `data/seed.json`

Bộ câu hỏi được gán mã đề `uoc-luong-toan-lop-3`, liên kết trực tiếp với bài học `bai-16` ("Luyện tập chung: Các phép tính trong phạm vi 1.000"):

```json
{
  "uoc-luong-toan-lop-3": {
    "lessonId": "bai-16",
    "title": "Phiếu luyện tập: Ước lượng trước khi tính đúng (Cộng, Trừ, Nhân, Chia)",
    "kind": "exercise",
    "starReward": 50,
    "durationMinutes": 20,
    "questions": [
      {
        "id": "est-add-01",
        "type": "estimate",
        "prompt": "38 + 49 = ?",
        "points": 10,
        "category": "Ước lượng phép cộng",
        "correctAnswer": "{\"exact\":87,\"gold_anchor\":90,\"silver_anchors\":[88,89,70],\"estimate_min\":74,\"estimate_max\":100,\"explanation\":\"Làm tròn 38 lên 40, làm tròn 49 lên 50. Ta nhẩm 40 + 50 = 90. Khi đặt tính: 38 + 49 = 87.\"}"
      },
      {
        "id": "est-add-02",
        "type": "estimate",
        "prompt": "54 + 27 = ?",
        "points": 10,
        "category": "Ước lượng phép cộng",
        "correctAnswer": "{\"exact\":81,\"gold_anchor\":80,\"silver_anchors\":[77,84,90,70],\"estimate_min\":70,\"estimate_max\":95,\"explanation\":\"Làm tròn 54 xuống 50, làm tròn 27 lên 30. Ta nhẩm 50 + 30 = 80. Khi đặt tính: 54 + 27 = 81.\"}"
      },
      {
        "id": "est-add-03",
        "type": "estimate",
        "prompt": "61 + 28 = ?",
        "points": 10,
        "category": "Ước lượng phép cộng",
        "correctAnswer": "{\"exact\":89,\"gold_anchor\":90,\"silver_anchors\":[88,91,80],\"estimate_min\":75,\"estimate_max\":100,\"explanation\":\"Làm tròn 61 xuống 60, làm tròn 28 lên 30. Ta nhẩm 60 + 30 = 90. Khi đặt tính: 61 + 28 = 89.\"}"
      },
      {
        "id": "est-add-04",
        "type": "estimate",
        "prompt": "45 + 36 = ?",
        "points": 10,
        "category": "Ước lượng phép cộng",
        "correctAnswer": "{\"exact\":81,\"gold_anchor\":90,\"silver_anchors\":[80,85,86,70],\"estimate_min\":70,\"estimate_max\":95,\"explanation\":\"Làm tròn 45 lên 50 (hàng đơn vị là 5), làm tròn 36 lên 40. Ta nhẩm 50 + 40 = 90. Khi đặt tính: 45 + 36 = 81.\"}"
      },
      {
        "id": "est-sub-01",
        "type": "estimate",
        "prompt": "72 - 38 = ?",
        "points": 10,
        "category": "Ước lượng phép trừ",
        "correctAnswer": "{\"exact\":34,\"gold_anchor\":30,\"silver_anchors\":[32,40,35],\"estimate_min\":25,\"estimate_max\":42,\"explanation\":\"Làm tròn 72 xuống 70, làm tròn 38 lên 40. Ta nhẩm 70 - 40 = 30. Khi đặt tính: 72 - 38 = 34.\"}"
      },
      {
        "id": "est-sub-02",
        "type": "estimate",
        "prompt": "85 - 29 = ?",
        "points": 10,
        "category": "Ước lượng phép trừ",
        "correctAnswer": "{\"exact\":56,\"gold_anchor\":60,\"silver_anchors\":[50,55,61],\"estimate_min\":47,\"estimate_max\":68,\"explanation\":\"Làm tròn 85 lên 90 (hàng đơn vị là 5), làm tròn 29 lên 30. Ta nhẩm 90 - 30 = 60. Khi đặt tính: 85 - 29 = 56.\"}"
      },
      {
        "id": "est-sub-03",
        "type": "estimate",
        "prompt": "91 - 43 = ?",
        "points": 10,
        "category": "Ước lượng phép trừ",
        "correctAnswer": "{\"exact\":48,\"gold_anchor\":50,\"silver_anchors\":[40,47,51],\"estimate_min\":40,\"estimate_max\":58,\"explanation\":\"Làm tròn 91 xuống 90, làm tròn 43 xuống 40. Ta nhẩm 90 - 40 = 50. Khi đặt tính: 91 - 43 = 48.\"}"
      },
      {
        "id": "est-sub-04",
        "type": "estimate",
        "prompt": "67 - 21 = ?",
        "points": 10,
        "category": "Ước lượng phép trừ",
        "correctAnswer": "{\"exact\":46,\"gold_anchor\":50,\"silver_anchors\":[47,49,40],\"estimate_min\":38,\"estimate_max\":55,\"explanation\":\"Làm tròn 67 lên 70, làm tròn 21 xuống 20. Ta nhẩm 70 - 20 = 50. Khi đặt tính: 67 - 21 = 46.\"}"
      },
      {
        "id": "est-mul-01",
        "type": "estimate",
        "prompt": "29 × 3 = ?",
        "points": 10,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":87,\"gold_anchor\":90,\"silver_anchors\":[75,80,85,100],\"estimate_min\":75,\"estimate_max\":105,\"explanation\":\"Làm tròn 29 thành 30. Ta nhẩm 30 × 3 = 90. Khi đặt tính: 29 × 3 = 87.\"}"
      },
      {
        "id": "est-mul-02",
        "type": "estimate",
        "prompt": "48 × 4 = ?",
        "points": 10,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":192,\"gold_anchor\":200,\"silver_anchors\":[160,180,210],\"estimate_min\":160,\"estimate_max\":230,\"explanation\":\"Làm tròn 48 thành 50. Ta nhẩm 50 × 4 = 200. Khi đặt tính: 48 × 4 = 192.\"}"
      },
      {
        "id": "est-mul-03",
        "type": "estimate",
        "prompt": "19 × 5 = ?",
        "points": 10,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":95,\"gold_anchor\":100,\"silver_anchors\":[90,105,110],\"estimate_min\":80,\"estimate_max\":115,\"explanation\":\"Làm tròn 19 thành 20. Ta nhẩm 20 × 5 = 100. Khi đặt tính: 19 × 5 = 95.\"}"
      },
      {
        "id": "est-mul-04",
        "type": "estimate",
        "prompt": "82 × 4 = ?",
        "points": 10,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":328,\"gold_anchor\":320,\"silver_anchors\":[300,330,340],\"estimate_min\":275,\"estimate_max\":375,\"explanation\":\"Làm tròn 82 thành 80. Ta nhẩm 80 × 4 = 320. Khi đặt tính: 82 × 4 = 328.\"}"
      },
      {
        "id": "est-div-01",
        "type": "estimate",
        "prompt": "84 : 4 = ?",
        "points": 10,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":21,\"gold_anchor\":20,\"silver_anchors\":[22,23,25],\"estimate_min\":17,\"estimate_max\":26,\"explanation\":\"Làm tròn 84 thành 80. Ta nhẩm 80 : 4 = 20. Khi đặt tính chia: 84 : 4 = 21.\"}"
      },
      {
        "id": "est-div-02",
        "type": "estimate",
        "prompt": "178 : 6 = ?",
        "points": 10,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":29,\"gold_anchor\":30,\"silver_anchors\":[25,28,32],\"estimate_min\":24,\"estimate_max\":36,\"explanation\":\"Làm tròn 178 thành 180 (bội số của 6). Ta nhẩm 180 : 6 = 30. Kết quả tính: 178 : 6 = 29 (dư 4).\"}"
      },
      {
        "id": "est-div-03",
        "type": "estimate",
        "prompt": "48 : 6 = ?",
        "points": 10,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":8,\"gold_anchor\":8,\"silver_anchors\":[7,9,10],\"estimate_min\":6,\"estimate_max\":10,\"explanation\":\"48 chia cho 6 bằng đúng 8 trong bảng chia 6.\"}"
      },
      {
        "id": "est-div-04",
        "type": "estimate",
        "prompt": "245 : 8 = ?",
        "points": 10,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":30,\"gold_anchor\":30,\"silver_anchors\":[28,29,31,32],\"estimate_min\":25,\"estimate_max\":36,\"explanation\":\"Làm tròn 245 thành 240. Ta nhẩm 240 : 8 = 30. Kết quả tính: 245 : 8 = 30 (dư 5).\"}"
      }
    ]
  }
}
```

---

## 3. Nguyên tắc sư phạm và cách kiểm soát sai số ước lượng

### 3.1. Phân loại kỹ thuật làm tròn nhẩm
1. **Làm tròn cùng chiều (Cả hai cùng tăng hoặc cùng giảm):**
   - Ví dụ $38 + 49 \rightarrow 40 + 50 = 90$ (Cả hai cùng tăng). Tổng ước lượng ($90$) sẽ lớn hơn một chút so với kết quả đúng ($87$).
   - Ví dụ $91 - 43 \rightarrow 90 - 40 = 50$ (Cả hai cùng giảm). Hiệu ước lượng ($50$) duy trì sự cân bằng rất tốt so với kết quả đúng ($48$).
2. **Làm tròn ngược chiều (Một số tăng, một số giảm):**
   - Ví dụ $54 + 27 \rightarrow 50 + 30 = 80$ (54 giảm 4, 27 tăng 3). Sai số tự triệt tiêu bù trừ nhau, kết quả ước lượng $80$ cực sát kết quả đúng $81$ (độ lệch chỉ $1$ đơn vị!).
   - Ví dụ $72 - 38 \rightarrow 70 - 40 = 30$ (Số bị trừ giảm 2, số trừ tăng 2). Hiệu ước lượng $30$ bé hơn kết quả đúng $34$, nằm hoàn toàn trong phạm vi an toàn.

### 3.2. Phân cấp logic sư phạm 5 bậc cho chấm điểm ước lượng
Hệ thống thiết kế **ƯỚC LƯỢNG LÀ TRỌNG TÂM CHIẾM 70% TỔNG ĐIỂM** (55% Base + 15% Time Bonus) và **ĐẶT TÍNH ĐÚNG CHIẾM 30% TỔNG ĐIỂM** (25% Base + 5% Time Bonus):

1. 🥇 **Điểm neo Vàng (Gold Anchor - 100% Base ước lượng, tương đương 55% tổng điểm):**
   - Học sinh áp dụng chuẩn xác quy tắc làm tròn đến hàng chục SGK Toán 3 cho các toán hạng ($E = E_{gold}$).
   - Thông điệp phản hồi: *"Xuất sắc! Em đã làm tròn đúng quy tắc hàng chục và nhẩm ra điểm neo Vàng 🌟"*.
2. 🥈 **Điểm neo Bạc (Silver Anchors - 75% Base ước lượng, tương đương 41.25% tổng điểm):**
   - Học sinh áp dụng làm tròn 1 toán hạng hoặc chiến lược làm tròn hợp lệ ($E \in SilverAnchors$).
   - Thông điệp phản hồi: *"Rất tốt! Em đã ước lượng sát với điểm neo Bạc 🥈. Hãy thử làm tròn cả hai số để nhẩm nhanh hơn nhé!"*.
3. ⚠️ **Nhập đáp án tính đúng vào ô ước lượng (Exact Match in Estimate Box - 50% Base, tương đương 27.5% tổng điểm):**
   - Học sinh tính ra kết quả đúng rồi gõ vào ô ước lượng ($E = A$). Hệ thống ghi nhận 50% Base và hiển thị lời nhắc nhở sư phạm.
   - Thông điệp phản hồi: *"Em đã điền kết quả tính đúng vào ô ước lượng! Mục đích ước lượng là rèn kỹ năng nhẩm làm tròn trước khi tính. Lần sau em hãy làm tròn các số nhé! 💡"*.
4. 💡 **Trong khoảng nhưng không theo quy tắc / gõ bừa (In-range Random/No-rule - 35% Base, tương đương 19.25% tổng điểm):**
   - Giá trị nằm trong khoảng $[E_{min}, E_{max}]$ nhưng không trùng Điểm neo Vàng hay Bạc.
   - Thông điệp phản hồi: *"Con số này khá gần kết quả, nhưng chưa theo quy tắc làm tròn tròn chục 🌱. Gợi ý: Hãy làm tròn các số về hàng chục gần nhất rồi nhẩm nhé!"*.
5. ❌ **Ngoài khoảng (Out-of-range - 0% điểm):**
   - Giá trị lệch quá xa thực tế ($E < E_{min}$ hoặc $E > E_{max}$).
   - Thông điệp phản hồi: Hướng dẫn chi tiết cách làm tròn các số hạng và tính nhẩm.

### 3.3. Cơ chế bộ đếm thời gian thích ứng 60 giây và Thưởng tốc độ (Time Bonus)
- Mỗi pha có đồng hồ đếm ngược từ 60 giây về 0 giây ($T_{max} = 60s$).
- **Thưởng tốc độ Pha 1 (Ước lượng - tối đa 15%):**
  $$\text{Bonus}_{est} = \text{round}\left(15 \times \frac{\max(0, 60 - t_{est})}{60}\right)$$
  *(Chỉ áp dụng khi học sinh đạt điểm Base logic ước lượng > 0).*
- **Thưởng tốc độ Pha 2 (Tính đúng - tối đa 5%):**
  $$\text{Bonus}_{exact} = \text{round}\left(5 \times \frac{\max(0, 60 - t_{exact})}{60}\right)$$
  *(Chỉ áp dụng khi kết quả tính đúng 100%).*
- **Xử lý Timeout (60s):** Khi hết 60 giây ở Pha 1, hệ thống tự động khóa ô nhập và tự động chuyển sang Pha 2. Dữ liệu đã nhập được bảo toàn và chấm điểm Base bình thường, nhận 0% Time Bonus.
