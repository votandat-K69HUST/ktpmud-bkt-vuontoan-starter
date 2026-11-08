# 📐 BỘ 12 CÂU HỎI MẪU SYNTHETIC: ƯỚC LƯỢNG TRƯỚC KHI TÍNH ĐÚNG (FIXTURES)
> **Áp dụng cho:** Tiêu chí Acceptance Criteria B-02 & B-03  
> **Chương trình:** Toán Lớp 3 — Phạm vi 1.000 (Bộ sách Kết nối tri thức & Cánh diều)  
> **Bộ đề mã:** `uoc-luong-nhan-chia-lop-3`  
> **Vị trí tích hợp:** Thuộc Bài 16 ("Luyện tập chung: Phép nhân và phép chia trong phạm vi 1.000")  

---

## 1. Bảng đặc tả sư phạm 12 câu hỏi mẫu

| STT | Mã câu | Phép tính (Prompt) | Phân loại | Điểm neo làm tròn ($E_{anchor}$) | Khoảng ước lượng hợp lý $[E_{min}, E_{max}]$ | Kết quả đúng ($A$) | Lời giải thích sư phạm cho học sinh |
|:---:|:---|:---|:---|:---:|:---:|:---:|:---|
| 1 | `est-mul-01` | **29 × 3** | Nhân số có 2 chữ số | Làm tròn 29 thành 30 $\rightarrow 30 \times 3 =$ **90** | **[75, 105]** | **87** | *"Làm tròn 29 gần bằng 30. Ta nhẩm 30 × 3 = 90. Khi đặt tính: 29 × 3 = 87."* |
| 2 | `est-mul-02` | **48 × 6** | Nhân có nhớ | Làm tròn 48 thành 50 $\rightarrow 50 \times 6 =$ **300** | **[245, 345]** | **288** | *"Làm tròn 48 gần bằng 50. Ta nhẩm 50 × 6 = 300. Khi đặt tính: 48 × 6 = 288."* |
| 3 | `est-mul-03` | **19 × 5** | Nhân có nhớ | Làm tròn 19 thành 20 $\rightarrow 20 \times 5 =$ **100** | **[80, 115]** | **95** | *"Làm tròn 19 gần bằng 20. Ta nhẩm 20 × 5 = 100. Khi đặt tính: 19 × 5 = 95."* |
| 4 | `est-mul-04` | **82 × 4** | Nhân không nhớ | Làm tròn 82 thành 80 $\rightarrow 80 \times 4 =$ **320** | **[275, 375]** | **328** | *"Làm tròn 82 thành 80. Ta nhẩm 80 × 4 = 320. Khi đặt tính: 82 × 4 = 328."* |
| 5 | `est-mul-05` | **71 × 7** | Nhân không nhớ | Làm tròn 71 thành 70 $\rightarrow 70 \times 7 =$ **490** | **[420, 560]** | **497** | *"Làm tròn 71 thành 70. Ta nhẩm 70 × 7 = 490. Khi đặt tính: 71 × 7 = 497."* |
| 6 | `est-mul-06` | **98 × 9** | Nhân số sát 100 | Làm tròn 98 thành 100 $\rightarrow 100 \times 9 =$ **900** | **[750, 1000]** | **882** | *"Làm tròn 98 thành 100. Ta nhẩm 100 × 9 = 900. Khi đặt tính: 98 × 9 = 882."* |
| 7 | `est-div-01` | **48 : 6** | Chia trong bảng | Bảng chia 6 $\rightarrow$ ước lượng **8** | **[6, 10]** | **8** | *"48 chia cho 6 bằng đúng 8 trong bảng chia 6."* |
| 8 | `est-div-02` | **84 : 4** | Chia hết | Làm tròn 84 thành 80 $\rightarrow 80 : 4 =$ **20** | **[17, 25]** | **21** | *"Làm tròn 84 thành 80. Ta nhẩm 80 : 4 = 20. Khi đặt tính chia: 84 : 4 = 21."* |
| 9 | `est-div-03` | **178 : 6** | Chia có dư | Làm tròn 178 thành 180 $\rightarrow 180 : 6 =$ **30** | **[24, 35]** | **29** | *"Làm tròn 178 thành 180 (bội số của 6). Ta nhẩm 180 : 6 = 30. Kết quả tính: 178 : 6 = 29 (dư 4)."* |
| 10 | `est-div-04` | **245 : 8** | Chia có dư | Làm tròn 245 thành 240 $\rightarrow 240 : 8 =$ **30** | **[25, 36]** | **30** | *"Làm tròn 245 thành 240. Ta nhẩm 240 : 8 = 30. Kết quả tính: 245 : 8 = 30 (dư 5)."* |
| 11 | `est-div-05` | **356 : 5** | Chia có dư | Làm tròn 356 thành 350 $\rightarrow 350 : 5 =$ **70** | **[60, 82]** | **71** | *"Làm tròn 356 thành 350. Ta nhẩm 350 : 5 = 70. Kết quả tính: 356 : 5 = 71 (dư 1)."* |
| 12 | `est-div-06` | **492 : 7** | Chia có dư | Làm tròn 492 thành 490 $\rightarrow 490 : 7 =$ **70** | **[59, 81]** | **70** | *"Làm tròn 492 thành 490. Ta nhẩm 490 : 7 = 70. Kết quả tính: 492 : 7 = 70 (dư 2)."* |

---

## 2. Định dạng JSON sẵn sàng tích hợp vào `data/seed.json`

Bộ câu hỏi sẽ được gán mã `uoc-luong-nhan-chia-lop-3`, liên kết với bài học `bai-16` ("Luyện tập chung"):

```json
{
  "uoc-luong-nhan-chia-lop-3": {
    "lessonId": "bai-16",
    "title": "Phiếu luyện tập: Ước lượng trước khi tính đúng",
    "kind": "exercise",
    "starReward": 40,
    "durationMinutes": 15,
    "questions": [
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
        "prompt": "48 × 6 = ?",
        "points": 5,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":288,\"estimate_min\":245,\"estimate_max\":345,\"rounded_anchor\":300,\"explanation\":\"Làm tròn 48 thành 50. Ta nhẩm 50 × 6 = 300. Khi đặt tính: 48 × 6 = 288.\"}"
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
        "id": "est-mul-05",
        "type": "estimate",
        "prompt": "71 × 7 = ?",
        "points": 5,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":497,\"estimate_min\":420,\"estimate_max\":560,\"rounded_anchor\":490,\"explanation\":\"Làm tròn 71 thành 70. Ta nhẩm 70 × 7 = 490. Khi đặt tính: 71 × 7 = 497.\"}"
      },
      {
        "id": "est-mul-06",
        "type": "estimate",
        "prompt": "98 × 9 = ?",
        "points": 5,
        "category": "Ước lượng phép nhân",
        "correctAnswer": "{\"exact\":882,\"estimate_min\":750,\"estimate_max\":1000,\"rounded_anchor\":900,\"explanation\":\"Làm tròn 98 thành 100. Ta nhẩm 100 × 9 = 900. Khi đặt tính: 98 × 9 = 882.\"}"
      },
      {
        "id": "est-div-01",
        "type": "estimate",
        "prompt": "48 : 6 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":8,\"estimate_min\":6,\"estimate_max\":10,\"rounded_anchor\":8,\"explanation\":\"48 chia cho 6 bằng đúng 8 trong bảng chia 6.\"}"
      },
      {
        "id": "est-div-02",
        "type": "estimate",
        "prompt": "84 : 4 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":21,\"estimate_min\":17,\"estimate_max\":25,\"rounded_anchor\":20,\"explanation\":\"Làm tròn 84 thành 80. Ta nhẩm 80 : 4 = 20. Khi đặt tính chia: 84 : 4 = 21.\"}"
      },
      {
        "id": "est-div-03",
        "type": "estimate",
        "prompt": "178 : 6 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":29,\"estimate_min\":24,\"estimate_max\":35,\"rounded_anchor\":30,\"explanation\":\"Làm tròn 178 thành 180 (bội số của 6). Ta nhẩm 180 : 6 = 30. Kết quả tính: 178 : 6 = 29 (dư 4).\"}"
      },
      {
        "id": "est-div-04",
        "type": "estimate",
        "prompt": "245 : 8 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":30,\"estimate_min\":25,\"estimate_max\":36,\"rounded_anchor\":30,\"explanation\":\"Làm tròn 245 thành 240. Ta nhẩm 240 : 8 = 30. Kết quả tính: 245 : 8 = 30 (dư 5).\"}"
      },
      {
        "id": "est-div-05",
        "type": "estimate",
        "prompt": "356 : 5 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":71,\"estimate_min\":60,\"estimate_max\":82,\"rounded_anchor\":70,\"explanation\":\"Làm tròn 356 thành 350. Ta nhẩm 350 : 5 = 70. Kết quả tính: 356 : 5 = 71 (dư 1).\"}"
      },
      {
        "id": "est-div-06",
        "type": "estimate",
        "prompt": "492 : 7 = ?",
        "points": 5,
        "category": "Ước lượng phép chia",
        "correctAnswer": "{\"exact\":70,\"estimate_min\":59,\"estimate_max\":81,\"rounded_anchor\":70,\"explanation\":\"Làm tròn 492 thành 490. Ta nhẩm 490 : 7 = 70. Kết quả tính: 492 : 7 = 70 (dư 2).\"}"
      }
    ]
  }
}
```
