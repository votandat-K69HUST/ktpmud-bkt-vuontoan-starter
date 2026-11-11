# 📐 BỘ 16 CÂU HỎI MẪU SYNTHETIC: ƯỚC LƯỢNG TRƯỚC KHI TÍNH ĐÚNG (FIXTURES)
> **Áp dụng cho:** Tiêu chí Acceptance Criteria B-02, B-03, B-06 & B-08  
> **Chương trình:** Toán Lớp 3 — Chuẩn GDPT 2018 (Bộ sách Kết nối tri thức với cuộc sống & Cánh diều)  
> **Bộ đề mã:** `uoc-luong-toan-lop-3`  
> **Vị trí tích hợp:** Phiếu bài tập chuyên đề: *"Luyện tập ước lượng và làm tròn số trong phạm vi 1.000"*  
> **Cấu trúc:** 16 câu hỏi phân bố đều 4 mạch kiến thức: **4 câu Phép cộng 2 chữ số, 4 câu Phép trừ 2 chữ số, 4 câu Phép nhân, 4 câu Phép chia**.

---

## 1. Bảng đặc tả sư phạm toàn diện 16 câu hỏi mẫu

| STT | Mã câu | Phép tính (Prompt) | Mạch kiến thức / Phân loại | Điểm neo làm tròn ($E_{anchor}$) | Khoảng ước lượng hợp lý $[E_{min}, E_{max}]$ | Kết quả đúng ($A$) | Lời giải thích sư phạm cho học sinh Lớp 3 |
|:---:|:---|:---|:---|:---|:---:|:---:|:---|
| **I** | **PHÉP CỘNG CÁC SỐ CÓ 2 CHỮ SỐ** | | | | | | |
| 1 | `est-add-01` | **38 + 49 = ?** | Cộng có nhớ (Cả hai số làm tròn lên) | Làm tròn 38 $\rightarrow$ 40, 49 $\rightarrow$ 50<br/>$\Rightarrow 40 + 50 =$ **90** | **[75, 100]** | **87** | *"Làm tròn 38 lên 40, làm tròn 49 lên 50. Ta nhẩm 40 + 50 = 90. Khi đặt tính: 38 + 49 = 87 (8 + 9 = 17, viết 7 nhớ 1; 3 + 4 = 7, thêm 1 bằng 8)."* |
| 2 | `est-add-02` | **54 + 27 = ?** | Cộng có nhớ (Một số làm tròn xuống, một số làm tròn lên) | Làm tròn 54 $\rightarrow$ 50, 27 $\rightarrow$ 30<br/>$\Rightarrow 50 + 30 =$ **80** | **[70, 95]** | **81** | *"Làm tròn 54 xuống 50, làm tròn 27 lên 30. Ta nhẩm 50 + 30 = 80. Khi đặt tính: 54 + 27 = 81 (4 + 7 = 11, viết 1 nhớ 1; 5 + 2 = 7, thêm 1 bằng 8)."* |
| 3 | `est-add-03` | **61 + 28 = ?** | Cộng không nhớ (Một số làm tròn xuống, một số làm tròn lên) | Làm tròn 61 $\rightarrow$ 60, 28 $\rightarrow$ 30<br/>$\Rightarrow 60 + 30 =$ **90** | **[75, 100]** | **89** | *"Làm tròn 61 xuống 60, làm tròn 28 lên 30. Ta nhẩm 60 + 30 = 90. Khi đặt tính: 61 + 28 = 89 (1 + 8 = 9; 6 + 2 = 8)."* |
| 4 | `est-add-04` | **45 + 36 = ?** | Cộng có nhớ (Số tận cùng bằng 5 làm tròn lên) | Làm tròn 45 $\rightarrow$ 50, 36 $\rightarrow$ 40<br/>$\Rightarrow 50 + 40 =$ **90** | **[70, 95]** | **81** | *"Làm tròn 45 lên 50 (hàng đơn vị là 5), làm tròn 36 lên 40. Ta nhẩm 50 + 40 = 90. Khi đặt tính: 45 + 36 = 81 (5 + 6 = 11, viết 1 nhớ 1; 4 + 3 = 7, thêm 1 bằng 8)."* |
| **II** | **PHÉP TRỪ CÁC SỐ CÓ 2 CHỮ SỐ** | | | | | | |
| 5 | `est-sub-01` | **72 - 38 = ?** | Trừ có nhớ (Số bị trừ làm tròn xuống, số trừ làm tròn lên) | Làm tròn 72 $\rightarrow$ 70, 38 $\rightarrow$ 40<br/>$\Rightarrow 70 - 40 =$ **30** | **[25, 42]** | **34** | *"Làm tròn 72 xuống 70, làm tròn 38 lên 40. Ta nhẩm 70 - 40 = 30. Khi đặt tính: 72 - 38 = 34 (2 không trừ được 8, lấy 12 - 8 = 4 nhớ 1; 3 thêm 1 bằng 4, 7 - 4 = 3)."* |
| 6 | `est-sub-02` | **85 - 29 = ?** | Trừ có nhớ (Số bị trừ tận cùng bằng 5 làm tròn lên) | Làm tròn 85 $\rightarrow$ 90, 29 $\rightarrow$ 30<br/>$\Rightarrow 90 - 30 =$ **60** | **[47, 68]** | **56** | *"Làm tròn 85 lên 90 (hàng đơn vị là 5), làm tròn 29 lên 30. Ta nhẩm 90 - 30 = 60. Khi đặt tính: 85 - 29 = 56 (15 - 9 = 6 nhớ 1; 2 thêm 1 bằng 3, 8 - 3 = 5)."* |
| 7 | `est-sub-03` | **91 - 43 = ?** | Trừ có nhớ (Cả hai số đều làm tròn xuống) | Làm tròn 91 $\rightarrow$ 90, 43 $\rightarrow$ 40<br/>$\Rightarrow 90 - 40 =$ **50** | **[40, 58]** | **48** | *"Làm tròn 91 xuống 90, làm tròn 43 xuống 40. Ta nhẩm 90 - 40 = 50. Khi đặt tính: 91 - 43 = 48 (11 - 3 = 8 nhớ 1; 4 thêm 1 bằng 5, 9 - 5 = 4)."* |
| 8 | `est-sub-04` | **67 - 21 = ?** | Trừ không nhớ (Số bị trừ làm tròn lên, số trừ làm tròn xuống) | Làm tròn 67 $\rightarrow$ 70, 21 $\rightarrow$ 20<br/>$\Rightarrow 70 - 20 =$ **50** | **[38, 55]** | **46** | *"Làm tròn 67 lên 70, làm tròn 21 xuống 20. Ta nhẩm 70 - 20 = 50. Khi đặt tính: 67 - 21 = 46 (7 - 1 = 6; 6 - 2 = 4)."* |
| **III** | **PHÉP NHÂN SỐ CÓ 2 CHỮ SỐ VỚI SỐ CÓ 1 CHỮ SỐ** | | | | | | |
| 9 | `est-mul-01` | **29 × 3 = ?** | Nhân có nhớ (Thừa số 1 làm tròn lên) | Làm tròn 29 $\rightarrow$ 30<br/>$\Rightarrow 30 \times 3 =$ **90** | **[75, 105]** | **87** | *"Làm tròn 29 thành 30. Ta nhẩm 30 × 3 = 90. Khi đặt tính: 29 × 3 = 87 (3 × 9 = 27 viết 7 nhớ 2; 3 × 2 = 6, thêm 2 bằng 8)."* |
| 10 | `est-mul-02` | **48 × 4 = ?** | Nhân có nhớ lớn (Thừa số 1 làm tròn lên) | Làm tròn 48 $\rightarrow$ 50<br/>$\Rightarrow 50 \times 4 =$ **200** | **[160, 230]** | **192** | *"Làm tròn 48 thành 50. Ta nhẩm 50 × 4 = 200. Khi đặt tính: 48 × 4 = 192 (4 × 8 = 32 viết 2 nhớ 3; 4 × 4 = 16, thêm 3 bằng 19)."* |
| 11 | `est-mul-03` | **19 × 5 = ?** | Nhân có nhớ vượt 100 (Thừa số 1 làm tròn lên) | Làm tròn 19 $\rightarrow$ 20<br/>$\Rightarrow 20 \times 5 =$ **100** | **[80, 115]** | **95** | *"Làm tròn 19 thành 20. Ta nhẩm 20 × 5 = 100. Khi đặt tính: 19 × 5 = 95 (5 × 9 = 45 viết 5 nhớ 4; 5 × 1 = 5, thêm 4 bằng 9)."* |
| 12 | `est-mul-04` | **82 × 4 = ?** | Nhân làm tròn xuống (Thừa số 1 làm tròn xuống) | Làm tròn 82 $\rightarrow$ 80<br/>$\Rightarrow 80 \times 4 =$ **320** | **[275, 375]** | **328** | *"Làm tròn 82 thành 80. Ta nhẩm 80 × 4 = 320. Khi đặt tính: 82 × 4 = 328 (4 × 2 = 8; 4 × 8 = 32)."* |
| **IV** | **PHÉP CHIA TRONG PHẠM VI 1.000** | | | | | | |
| 13 | `est-div-01` | **84 : 4 = ?** | Chia hết (Số bị chia làm tròn xuống) | Làm tròn 84 $\rightarrow$ 80<br/>$\Rightarrow 80 : 4 =$ **20** | **[17, 26]** | **21** | *"Làm tròn 84 thành 80. Ta nhẩm 80 : 4 = 20. Khi đặt tính chia: 84 : 4 = 21 (8 chia 4 được 2; 4 chia 4 được 1)."* |
| 14 | `est-div-02` | **178 : 6 = ?** | Chia có dư (Làm tròn đến bội số của 6) | Làm tròn 178 $\rightarrow$ 180<br/>$\Rightarrow 180 : 6 =$ **30** | **[24, 36]** | **29** | *"Làm tròn 178 thành 180 (bội số tròn chục của 6). Ta nhẩm 180 : 6 = 30. Kết quả tính: 178 : 6 = 29 (dư 4)."* |
| 15 | `est-div-03` | **48 : 6 = ?** | Chia trong bảng cửu chương | Bảng chia 6<br/>$\Rightarrow$ Điểm neo: **8** | **[6, 10]** | **8** | *"48 chia cho 6 bằng đúng 8 trong bảng chia 6 (vì 6 × 8 = 48)."* |
| 16 | `est-div-04` | **245 : 8 = ?** | Chia có dư (Làm tròn về bội số tròn chục của 8) | Làm tròn 245 $\rightarrow$ 240<br/>$\Rightarrow 240 : 8 =$ **30** | **[25, 36]** | **30** | *"Làm tròn 245 thành 240 (chia hết cho 8). Ta nhẩm 240 : 8 = 30. Kết quả tính: 245 : 8 = 30 (dư 5)."* |

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
        "points": 5,
        "category": "Ước lượng phép cộng",
        "correctAnswer": "{\"exact\":87,\"estimate_min\":75,\"estimate_max\":100,\"rounded_anchor\":90,\"explanation\":\"Làm tròn 38 lên 40, làm tròn 49 lên 50. Ta nhẩm 40 + 50 = 90. Khi đặt tính: 38 + 49 = 87.\"}"
      },
      {
        "id": "est-add-02",
        "type": "estimate",
        "prompt": "54 + 27 = ?",
        "points": 5,
        "category": "Ước lượng phép cộng",
        "correctAnswer": "{\"exact\":81,\"estimate_min\":70,\"estimate_max\":95,\"rounded_anchor\":80,\"explanation\":\"Làm tròn 54 xuống 50, làm tròn 27 lên 30. Ta nhẩm 50 + 30 = 80. Khi đặt tính: 54 + 27 = 81.\"}"
      },
      {
        "id": "est-add-03",
        "type": "estimate",
        "prompt": "61 + 28 = ?",
        "points": 5,
        "category": "Ước lượng phép cộng",
        "correctAnswer": "{\"exact\":89,\"estimate_min\":75,\"estimate_max\":100,\"rounded_anchor\":90,\"explanation\":\"Làm tròn 61 xuống 60, làm tròn 28 lên 30. Ta nhẩm 60 + 30 = 90. Khi đặt tính: 61 + 28 = 89.\"}"
      },
      {
        "id": "est-add-04",
        "type": "estimate",
        "prompt": "45 + 36 = ?",
        "points": 5,
        "category": "Ước lượng phép cộng",
        "correctAnswer": "{\"exact\":81,\"estimate_min\":70,\"estimate_max\":95,\"rounded_anchor\":90,\"explanation\":\"Làm tròn 45 lên 50 (hàng đơn vị là 5), làm tròn 36 lên 40. Ta nhẩm 50 + 40 = 90. Khi đặt tính: 45 + 36 = 81.\"}"
      },
      {
        "id": "est-sub-01",
        "type": "estimate",
        "prompt": "72 - 38 = ?",
        "points": 5,
        "category": "Ước lượng phép trừ",
        "correctAnswer": "{\"exact\":34,\"estimate_min\":25,\"estimate_max\":42,\"rounded_anchor\":30,\"explanation\":\"Làm tròn 72 xuống 70, làm tròn 38 lên 40. Ta nhẩm 70 - 40 = 30. Khi đặt tính: 72 - 38 = 34.\"}"
      },
      {
        "id": "est-sub-02",
        "type": "estimate",
        "prompt": "85 - 29 = ?",
        "points": 5,
        "category": "Ước lượng phép trừ",
        "correctAnswer": "{\"exact\":56,\"estimate_min\":47,\"estimate_max\":68,\"rounded_anchor\":60,\"explanation\":\"Làm tròn 85 lên 90 (hàng đơn vị là 5), làm tròn 29 lên 30. Ta nhẩm 90 - 30 = 60. Khi đặt tính: 85 - 29 = 56.\"}"
      },
      {
        "id": "est-sub-03",
        "type": "estimate",
        "prompt": "91 - 43 = ?",
        "points": 5,
        "category": "Ước lượng phép trừ",
        "correctAnswer": "{\"exact\":48,\"estimate_min\":40,\"estimate_max\":58,\"rounded_anchor\":50,\"explanation\":\"Làm tròn 91 xuống 90, làm tròn 43 xuống 40. Ta nhẩm 90 - 40 = 50. Khi đặt tính: 91 - 43 = 48.\"}"
      },
      {
        "id": "est-sub-04",
        "type": "estimate",
        "prompt": "67 - 21 = ?",
        "points": 5,
        "category": "Ước lượng phép trừ",
        "correctAnswer": "{\"exact\":46,\"estimate_min\":38,\"estimate_max\":55,\"rounded_anchor\":50,\"explanation\":\"Làm tròn 67 lên 70, làm tròn 21 xuống 20. Ta nhẩm 70 - 20 = 50. Khi đặt tính: 67 - 21 = 46.\"}"
      },
      {
        "id": "est-mul-01",
        "type": "estimate",
        "prompt": "29 × 3 = ?",
        "points": 5,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":87,\"estimate_min\":75,\"estimate_max\":105,\"rounded_anchor\":90,\"explanation\":\"Làm tròn 29 thành 30. Ta nhẩm 30 × 3 = 90. Khi đặt tính: 29 × 3 = 87.\"}"
      },
      {
        "id": "est-mul-02",
        "type": "estimate",
        "prompt": "48 × 4 = ?",
        "points": 5,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":192,\"estimate_min\":160,\"estimate_max\":230,\"rounded_anchor\":200,\"explanation\":\"Làm tròn 48 thành 50. Ta nhẩm 50 × 4 = 200. Khi đặt tính: 48 × 4 = 192.\"}"
      },
      {
        "id": "est-mul-03",
        "type": "estimate",
        "prompt": "19 × 5 = ?",
        "points": 5,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":95,\"estimate_min\":80,\"estimate_max\":115,\"rounded_anchor\":100,\"explanation\":\"Làm tròn 19 thành 20. Ta nhẩm 20 × 5 = 100. Khi đặt tính: 19 × 5 = 95.\"}"
      },
      {
        "id": "est-mul-04",
        "type": "estimate",
        "prompt": "82 × 4 = ?",
        "points": 5,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":328,\"estimate_min\":275,\"estimate_max\":375,\"rounded_anchor\":320,\"explanation\":\"Làm tròn 82 thành 80. Ta nhẩm 80 × 4 = 320. Khi đặt tính: 82 × 4 = 328.\"}"
      },
      {
        "id": "est-div-01",
        "type": "estimate",
        "prompt": "84 : 4 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":21,\"estimate_min\":17,\"estimate_max\":26,\"rounded_anchor\":20,\"explanation\":\"Làm tròn 84 thành 80. Ta nhẩm 80 : 4 = 20. Khi đặt tính chia: 84 : 4 = 21.\"}"
      },
      {
        "id": "est-div-02",
        "type": "estimate",
        "prompt": "178 : 6 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":29,\"estimate_min\":24,\"estimate_max\":36,\"rounded_anchor\":30,\"explanation\":\"Làm tròn 178 thành 180 (bội số của 6). Ta nhẩm 180 : 6 = 30. Kết quả tính: 178 : 6 = 29 (dư 4).\"}"
      },
      {
        "id": "est-div-03",
        "type": "estimate",
        "prompt": "48 : 6 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":8,\"estimate_min\":6,\"estimate_max\":10,\"rounded_anchor\":8,\"explanation\":\"48 chia cho 6 bằng đúng 8 trong bảng chia 6.\"}"
      },
      {
        "id": "est-div-04",
        "type": "estimate",
        "prompt": "245 : 8 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":30,\"estimate_min\":25,\"estimate_max\":36,\"rounded_anchor\":30,\"explanation\":\"Làm tròn 245 thành 240. Ta nhẩm 240 : 8 = 30. Kết quả tính: 245 : 8 = 30 (dư 5).\"}"
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

### 3.2. Thuật toán chấp nhận ước lượng (Deterministic Acceptance Formula)
Một giá trị ước lượng $E$ do học sinh nhập vào được công nhận là **Hợp lý** khi thỏa mãn ít nhất một trong hai điều kiện sau trong `server/scoring.js`:
1. **Tiêu chuẩn sai số tương đối:** $\frac{|E - A|}{A} \le 15\%$ (với $\Delta_{min} = \max(2, \lceil 0.15 \times A \rceil)$).
2. **Tiêu chuẩn khoảng neo sư phạm:** $E \in [E_{min}, E_{max}]$ với $[E_{min}, E_{max}]$ được cấu hình riêng cho từng câu hỏi như bảng trên.

Quy tắc này đảm bảo các em học sinh dù làm tròn theo trực giác chuẩn SGK (chạm điểm neo $E_{anchor}$) hay nhẩm sát kết quả thực tế đều được khích lệ và ghi nhận điểm số xứng đáng!
