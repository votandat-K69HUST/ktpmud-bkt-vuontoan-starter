'use strict';

const {
  roundToTen,
  calculateGoldAnchor,
  calculateSilverAnchors,
  calculateBoundingAnchors,
  getDeltaMin,
  matchEstimateAnchor,
  evaluateTimeBonus,
  evaluateEstimateQuestion
} = require('../../server/scoring');

describe('Core Math Engine & Scoring Module (ADR-01 & TEST_PLAN)', () => {

  describe('1. Hàm roundToTen(n) — Quy tắc làm tròn về hàng chục gần nhất chuẩn SGK Toán 3', () => {
    test('Làm tròn xuống khi chữ số hàng đơn vị là 1, 2, 3, 4', () => {
      expect(roundToTen(31)).toBe(30);
      expect(roundToTen(32)).toBe(30);
      expect(roundToTen(33)).toBe(30);
      expect(roundToTen(34)).toBe(30);
      expect(roundToTen(74)).toBe(70);
      expect(roundToTen('54')).toBe(50);
    });

    test('Làm tròn lên khi chữ số hàng đơn vị là 5, 6, 7, 8, 9', () => {
      expect(roundToTen(35)).toBe(40);
      expect(roundToTen(36)).toBe(40);
      expect(roundToTen(37)).toBe(40);
      expect(roundToTen(38)).toBe(40);
      expect(roundToTen(39)).toBe(40);
      expect(roundToTen(75)).toBe(80);
      expect(roundToTen('49')).toBe(50);
    });

    test('Giữ nguyên khi đã là số tròn chục', () => {
      expect(roundToTen(0)).toBe(0);
      expect(roundToTen(10)).toBe(10);
      expect(roundToTen(40)).toBe(40);
      expect(roundToTen(100)).toBe(100);
      expect(roundToTen('90')).toBe(90);
    });

    test('Xử lý an toàn với input không hợp lệ hoặc số âm', () => {
      expect(roundToTen('abc')).toBe(0);
      expect(roundToTen(null)).toBe(0);
      expect(roundToTen(undefined)).toBe(0);
      expect(roundToTen(NaN)).toBe(0);
      expect(roundToTen(-12)).toBe(-10);
      expect(roundToTen(-18)).toBe(-20);
    });
  });

  describe('2. Hàm calculateGoldAnchor(op, op1, op2) — Điểm neo Vàng chuẩn SGK cho cả 4 phép tính', () => {
    test('Phép cộng (+): Làm tròn cả 2 số hạng về hàng chục', () => {
      expect(calculateGoldAnchor('+', 38, 47)).toBe(90); // 40 + 50
      expect(calculateGoldAnchor('+', 38, 49)).toBe(90); // 40 + 50
      expect(calculateGoldAnchor('+', 54, 27)).toBe(80); // 50 + 30
      expect(calculateGoldAnchor('+', 61, 28)).toBe(90); // 60 + 30
      expect(calculateGoldAnchor('+', 45, 36)).toBe(90); // 50 + 40
    });

    test('Phép trừ (-): Làm tròn cả số bị trừ và số trừ về hàng chục', () => {
      expect(calculateGoldAnchor('-', 72, 38)).toBe(30); // 70 - 40
      expect(calculateGoldAnchor('-', 73, 28)).toBe(40); // 70 - 30
      expect(calculateGoldAnchor('-', 85, 29)).toBe(60); // 90 - 30
      expect(calculateGoldAnchor('-', 91, 43)).toBe(50); // 90 - 40
      expect(calculateGoldAnchor('-', 67, 21)).toBe(50); // 70 - 20
    });

    test('Phép nhân (*, x, ×): Làm tròn thừa số 2 chữ số, giữ nguyên thừa số 1 chữ số', () => {
      expect(calculateGoldAnchor('*', 29, 3)).toBe(90);   // 30 * 3
      expect(calculateGoldAnchor('x', 48, 4)).toBe(200);  // 50 * 4
      expect(calculateGoldAnchor('×', 19, 5)).toBe(100);  // 20 * 5
      expect(calculateGoldAnchor('*', 82, 4)).toBe(320);  // 80 * 4
      expect(calculateGoldAnchor('*', 3, 29)).toBe(90);   // op1 < 10, op2 >= 10
    });

    test('Phép chia (:, /, ÷): Làm tròn số bị chia về hàng chục chia cho số chia', () => {
      expect(calculateGoldAnchor(':', 84, 4)).toBe(20);   // 80 : 4
      expect(calculateGoldAnchor('/', 178, 6)).toBe(30);  // 180 : 6
      expect(calculateGoldAnchor('÷', 48, 6)).toBe(8);    // 50:6 ~ 8.33 -> 8
      expect(calculateGoldAnchor(':', 100, 0)).toBe(0);   // chia cho 0 an toàn
    });

    test('Phép tính không xác định trả về 0', () => {
      expect(calculateGoldAnchor('%', 10, 2)).toBe(0);
    });
  });

  describe('3. Hàm calculateSilverAnchors, calculateBoundingAnchors & getDeltaMin', () => {
    test('calculateSilverAnchors chỉ sinh các điểm neo làm tròn 1 số, giữ nguyên số còn lại', () => {
      const silversAdd = calculateSilverAnchors('+', 38, 49);
      expect(silversAdd).toContain(88); // 38 + 50
      expect(silversAdd).toContain(89); // 40 + 49
      expect(silversAdd).not.toContain(70); // 70 là bounding anchor (floor+floor), không thuộc Bạc
      expect(silversAdd).not.toContain(90); // Gold anchor đã bị loại trừ

      const silvers5427 = calculateSilverAnchors('+', 54, 27);
      expect(silvers5427).toContain(77); // 50 + 27
      expect(silvers5427).toContain(84); // 54 + 30
      expect(silvers5427).not.toContain(70); // 70 là cận dưới, không thuộc Bạc
      expect(silvers5427).not.toContain(90); // 90 là cận trên, không thuộc Bạc
      expect(silvers5427).not.toContain(80); // Gold anchor

      const silversSub = calculateSilverAnchors('-', 72, 38);
      expect(silversSub).toContain(32); // 72 - 40
      expect(silversSub).not.toContain(30);

      const silversDiv = calculateSilverAnchors(':', 178, 6);
      expect(Array.isArray(silversDiv)).toBe(true);
    });

    test('calculateBoundingAnchors sinh các cận trên / cận dưới hợp lệ (Đồng)', () => {
      const boundingsAdd = calculateBoundingAnchors('+', 38, 49);
      expect(boundingsAdd).toContain(70); // floor 30 + floor 40 = 70
      expect(boundingsAdd).not.toContain(90); // Trùng gold anchor

      const boundings5427 = calculateBoundingAnchors('+', 54, 27);
      expect(boundings5427).toContain(70); // floor 50 + floor 20 = 70
      expect(boundings5427).toContain(90); // ceil 60 + ceil 30 = 90
      expect(boundings5427).not.toContain(80); // Trùng gold anchor
    });

    test('getDeltaMin tính ngưỡng sai số tối thiểu: min 3 cho cộng/trừ, min 2 cho nhân/chia', () => {
      expect(getDeltaMin('+', 15)).toBe(3); // 15% của 15 là 2.25 -> ceil = 3 -> max(3, 3) = 3
      expect(getDeltaMin('-', 10)).toBe(3); // 15% của 10 là 1.5 -> ceil = 2 -> max(3, 2) = 3
      expect(getDeltaMin('+', 87)).toBe(14); // 15% của 87 là 13.05 -> ceil = 14
      expect(getDeltaMin('*', 10)).toBe(2); // 15% của 10 là 1.5 -> ceil = 2 -> max(2, 2) = 2
      expect(getDeltaMin(':', 8)).toBe(2);  // 15% của 8 là 1.2 -> ceil = 2 -> max(2, 2) = 2
      expect(getDeltaMin('*', 192)).toBe(29); // 15% của 192 là 28.8 -> ceil = 29
    });
  });

  describe('4. Hàm matchEstimateAnchor — Phân cấp 5 bậc điểm neo logic', () => {
    const ruleAdd = {
      operation: '+',
      operand1: 38,
      operand2: 49,
      exact: 87,
      gold_anchor: 90,
      silver_anchors: [88, 89],
      bounding_anchors: [70],
      estimate_min: 74,
      estimate_max: 100,
      explanation: 'Làm tròn 38 lên 40, 49 lên 50. Ta nhẩm 40 + 50 = 90.'
    };

    test('Bậc 1 — GOLD_ANCHOR: 100% Base Score (Huy hiệu Vàng)', () => {
      const res = matchEstimateAnchor(ruleAdd, 90);
      expect(res.tier).toBe('GOLD_ANCHOR');
      expect(res.baseRatio).toBe(1.0);
      expect(res.badge).toBe('VÀNG');
      expect(res.feedback).toContain('Xuất sắc');
    });

    test('Bậc 2 — SILVER_ANCHOR: 75% Base Score (Huy hiệu Bạc)', () => {
      const res1 = matchEstimateAnchor(ruleAdd, 88);
      expect(res1.tier).toBe('SILVER_ANCHOR');
      expect(res1.baseRatio).toBe(0.75);
      expect(res1.badge).toBe('BẠC');
      expect(res1.feedback).toContain('Rất tốt');

      const res2 = matchEstimateAnchor(ruleAdd, 89);
      expect(res2.tier).toBe('SILVER_ANCHOR');
      expect(res2.baseRatio).toBe(0.75);
    });

    test('Bậc 3a — EXACT_MATCH_IN_ESTIMATE: 50% Base Score khi nhập đúng kết quả lẻ vào ô ước lượng (Huy hiệu Đồng)', () => {
      const res = matchEstimateAnchor(ruleAdd, 87);
      expect(res.tier).toBe('EXACT_MATCH_IN_ESTIMATE');
      expect(res.baseRatio).toBe(0.50);
      expect(res.badge).toBe('ĐỒNG');
      expect(res.feedback).toContain('Em tính nhẩm ra đúng kết quả');
    });

    test('Bậc 3b — BOUNDING_ANCHOR: 50% Base Score khi ước lượng cận trên/dưới (Cùng hạng Đồng, bằng điểm Đặt tính đúng)', () => {
      const res = matchEstimateAnchor(ruleAdd, 70);
      expect(res.tier).toBe('BOUNDING_ANCHOR');
      expect(res.baseRatio).toBe(0.50);
      expect(res.badge).toBe('ĐỒNG');
      expect(res.feedback).toContain('cận trên/dưới');
    });

    test('Kiểm tra chuyên sâu phép tính 54 + 27 = 81 (Theo yêu cầu người dùng): 70 nhận Đồng, không nhận Bạc', () => {
      const rule5427 = {
        operation: '+',
        operand1: 54,
        operand2: 27,
        exact: 81,
        gold_anchor: 80,
        silver_anchors: [77, 84],
        bounding_anchors: [70, 90],
        estimate_min: 70,
        estimate_max: 95
      };

      // 80: Vàng chuẩn SGK (1.0)
      const resGold = matchEstimateAnchor(rule5427, 80);
      expect(resGold.tier).toBe('GOLD_ANCHOR');
      expect(resGold.badge).toBe('VÀNG');
      expect(resGold.baseRatio).toBe(1.0);

      // 77, 84: Bạc (0.75)
      expect(matchEstimateAnchor(rule5427, 77).badge).toBe('BẠC');
      expect(matchEstimateAnchor(rule5427, 77).baseRatio).toBe(0.75);
      expect(matchEstimateAnchor(rule5427, 84).badge).toBe('BẠC');
      expect(matchEstimateAnchor(rule5427, 84).baseRatio).toBe(0.75);

      // 70: Cận dưới floor(54) + floor(27) = 50 + 20 = 70 -> ĐỒNG (0.50)
      const res70 = matchEstimateAnchor(rule5427, 70);
      expect(res70.tier).toBe('BOUNDING_ANCHOR');
      expect(res70.badge).toBe('ĐỒNG');
      expect(res70.baseRatio).toBe(0.50);

      // 90: Cận trên ceil(54) + ceil(27) = 60 + 30 = 90 -> ĐỒNG (0.50)
      const res90 = matchEstimateAnchor(rule5427, 90);
      expect(res90.tier).toBe('BOUNDING_ANCHOR');
      expect(res90.badge).toBe('ĐỒNG');
      expect(res90.baseRatio).toBe(0.50);

      // 81: Điền kết quả đặt tính đúng vào ô ước lượng -> ĐỒNG (0.50)
      const resExactInEst = matchEstimateAnchor(rule5427, 81);
      expect(resExactInEst.tier).toBe('EXACT_MATCH_IN_ESTIMATE');
      expect(resExactInEst.badge).toBe('ĐỒNG');
      expect(resExactInEst.baseRatio).toBe(0.50);

      // Điểm số Bounding Anchor (70, 90) và Đặt tính đúng (81) phải BẰNG NHAU (0.50)
      expect(res70.baseRatio).toBe(resExactInEst.baseRatio);

      // 75, 83: Ước lượng bừa nhưng trong dải dung sai [70, 95] -> KHUYẾN KHÍCH (0.35)
      const res75 = matchEstimateAnchor(rule5427, 75);
      expect(res75.tier).toBe('TOLERANCE_ONLY');
      expect(res75.badge).toBe('KHUYẾN KHÍCH');
      expect(res75.baseRatio).toBe(0.35);

      const res83 = matchEstimateAnchor(rule5427, 83);
      expect(res83.tier).toBe('TOLERANCE_ONLY');
      expect(res83.badge).toBe('KHUYẾN KHÍCH');
      expect(res83.baseRatio).toBe(0.35);

      // 60, 100: Ngoài dải dung sai -> CẦN CỐ GẮNG (0.0)
      expect(matchEstimateAnchor(rule5427, 60).badge).toBe('CẦN CỐ GẮNG');
      expect(matchEstimateAnchor(rule5427, 60).baseRatio).toBe(0.0);
      expect(matchEstimateAnchor(rule5427, 100).badge).toBe('CẦN CỐ GẮNG');
      expect(matchEstimateAnchor(rule5427, 100).baseRatio).toBe(0.0);
    });

    test('Bậc 4 — TOLERANCE_ONLY: 35% Base Score cho số đoán mò trong dải dung sai', () => {
      // 83 nằm trong dải [74, 100] nhưng không phải neo
      const res1 = matchEstimateAnchor(ruleAdd, 83);
      expect(res1.tier).toBe('TOLERANCE_ONLY');
      expect(res1.baseRatio).toBe(0.35);
      expect(res1.badge).toBe('KHUYẾN KHÍCH');
      expect(res1.feedback).toContain('gần đúng');

      // 91 nằm trong dải [74, 100]
      const res2 = matchEstimateAnchor(ruleAdd, 91);
      expect(res2.tier).toBe('TOLERANCE_ONLY');
      expect(res2.baseRatio).toBe(0.35);
    });

    test('Bậc 5 — OUT_OF_RANGE: 0% Base Score khi ngoài dải dung sai', () => {
      const resLow = matchEstimateAnchor(ruleAdd, 60);
      expect(resLow.tier).toBe('OUT_OF_RANGE');
      expect(resLow.baseRatio).toBe(0.0);
      expect(resLow.badge).toBe('CẦN CỐ GẮNG');

      const resHigh = matchEstimateAnchor(ruleAdd, 110);
      expect(resHigh.tier).toBe('OUT_OF_RANGE');
      expect(resHigh.baseRatio).toBe(0.0);
    });

    test('Hỗ trợ linh hoạt rule không có sẵn gold_anchor/silver_anchors (tính toán động)', () => {
      const dynamicRule = {
        operation: '+',
        operand1: 38,
        operand2: 47,
        exact: 85
      };
      // Gold anchor động: 40 + 50 = 90
      const resGold = matchEstimateAnchor(dynamicRule, 90);
      expect(resGold.tier).toBe('GOLD_ANCHOR');
      expect(resGold.baseRatio).toBe(1.0);

      // Silver anchor động: 40 + 47 = 87 hoặc 38 + 50 = 88
      const resSilver = matchEstimateAnchor(dynamicRule, 88);
      expect(resSilver.tier).toBe('SILVER_ANCHOR');
      expect(resSilver.baseRatio).toBe(0.75);
    });

    test('Hỗ trợ alias rounded_anchor trong rule', () => {
      const aliasRule = {
        operation: '-',
        operand1: 73,
        operand2: 28,
        exact: 45,
        rounded_anchor: 40
      };
      const res = matchEstimateAnchor(aliasRule, 40);
      expect(res.tier).toBe('GOLD_ANCHOR');
      expect(res.baseRatio).toBe(1.0);
    });
  });

  describe('5. Hàm evaluateTimeBonus — Thưởng tốc độ suy luận từng pha', () => {
    test('Pha 1: <=15s được 100% bonus (GOLD_SPEED)', () => {
      const res = evaluateTimeBonus(10, 45);
      expect(res.estTimeRatio).toBe(1.0);
      expect(res.estSpeedTier).toBe('GOLD_SPEED');
    });

    test('Pha 1: 15s < t1 <= 30s được 50% bonus (SILVER_SPEED)', () => {
      const res = evaluateTimeBonus(22, 45);
      expect(res.estTimeRatio).toBe(0.5);
      expect(res.estSpeedTier).toBe('SILVER_SPEED');
    });

    test('Pha 1: >30s được 0% bonus (BRONZE_SPEED)', () => {
      const res = evaluateTimeBonus(45, 45);
      expect(res.estTimeRatio).toBe(0);
      expect(res.estSpeedTier).toBe('BRONZE_SPEED');
    });

    test('Pha 2: <=20s được 100% bonus (GOLD_SPEED)', () => {
      const res = evaluateTimeBonus(25, 15);
      expect(res.exactTimeRatio).toBe(1.0);
      expect(res.exactSpeedTier).toBe('GOLD_SPEED');
    });

    test('Pha 2: 20s < t2 <= 40s được 50% bonus (SILVER_SPEED)', () => {
      const res = evaluateTimeBonus(25, 30);
      expect(res.exactTimeRatio).toBe(0.5);
      expect(res.exactSpeedTier).toBe('SILVER_SPEED');
    });

    test('Pha 2: >40s được 0% bonus (BRONZE_SPEED)', () => {
      const res = evaluateTimeBonus(25, 55);
      expect(res.exactTimeRatio).toBe(0);
      expect(res.exactSpeedTier).toBe('BRONZE_SPEED');
    });

    test('Kiểm tra giá trị biên thời gian (Boundary Time Tests)', () => {
      expect(evaluateTimeBonus(15.0, 20.0).estTimeRatio).toBe(1.0);
      expect(evaluateTimeBonus(15.1, 20.1).estTimeRatio).toBe(0.5);
      expect(evaluateTimeBonus(30.0, 40.0).estTimeRatio).toBe(0.5);
      expect(evaluateTimeBonus(30.1, 40.1).estTimeRatio).toBe(0);
      expect(evaluateTimeBonus(15.0, 20.0).exactTimeRatio).toBe(1.0);
      expect(evaluateTimeBonus(15.0, 20.1).exactTimeRatio).toBe(0.5);
      expect(evaluateTimeBonus(15.0, 40.0).exactTimeRatio).toBe(0.5);
      expect(evaluateTimeBonus(15.0, 40.1).exactTimeRatio).toBe(0);
    });

    test('Chuẩn hóa an toàn thời gian âm và vượt ngưỡng > 60s', () => {
      const resNegative = evaluateTimeBonus(-10, -5);
      expect(resNegative.timeEst).toBe(0);
      expect(resNegative.timeExact).toBe(0);

      const resOver = evaluateTimeBonus(120, 300);
      expect(resOver.timeEst).toBe(60);
      expect(resOver.timeExact).toBe(60);
      expect(resOver.estTimeRatio).toBe(0);
      expect(resOver.exactTimeRatio).toBe(0);

      const resInvalid = evaluateTimeBonus('nhanh', NaN);
      expect(resInvalid.timeEst).toBe(60);
      expect(resInvalid.timeExact).toBe(60);
      expect(resInvalid.estTimeRatio).toBe(0);
      expect(resInvalid.exactTimeRatio).toBe(0);
    });
  });

  describe('6. Hàm evaluateEstimateQuestion — Tổng hợp điểm số 70/30 và Ràng buộc chống gian lận', () => {
    const sampleRule = {
      operation: '+',
      operand1: 38,
      operand2: 49,
      exact: 87,
      gold_anchor: 90,
      silver_anchors: [88, 89],
      bounding_anchors: [70],
      estimate_min: 74,
      estimate_max: 100,
      points: 10,
      explanation: 'Làm tròn 38 lên 40, 49 lên 50. Ta nhẩm 40 + 50 = 90. Khi đặt tính: 38 + 49 = 87.'
    };

    test('UT-SCR-01: Xuất sắc toàn diện — Gold Anchor (t1 <= 15s) + Tính đúng (t2 <= 20s) -> 10.0/10', () => {
      const ans = {
        estimate: 90,
        exact: 87,
        estimate_time_seconds: 12,
        exact_time_seconds: 18
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.earnedPoints).toBe(10.0);
      expect(res.maxPoints).toBe(10);
      expect(res.isEstimateOk).toBe(true);
      expect(res.isExactOk).toBe(true);
      expect(res.isFullyCorrect).toBe(true);
      expect(res.anchorTier).toBe('GOLD_ANCHOR');
      expect(res.badge).toBe('VÀNG');
      expect(res.scoringBreakdown).toEqual({
        estimateBase: 5.5,
        estimateTime: 1.5,
        estimateTotal: 7.0,
        exactBase: 2.5,
        exactTime: 0.5,
        exactTotal: 3.0
      });
    });

    test('UT-SCR-02: Tư duy tốt, tốc độ tiêu chuẩn — Gold Anchor (25s) + Tính đúng (35s) -> 9.0/10', () => {
      const ans = {
        estimate: 90,
        exact: 87,
        estimate_time_seconds: 25,
        exact_time_seconds: 35
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.earnedPoints).toBe(9.0);
      expect(res.scoringBreakdown.estimateBase).toBe(5.5);
      expect(res.scoringBreakdown.estimateTime).toBe(0.75);
      expect(res.scoringBreakdown.exactBase).toBe(2.5);
      expect(res.scoringBreakdown.exactTime).toBe(0.25);
    });

    test('UT-SCR-03: Silver Anchor (12s) + Tính đúng (18s) -> 8.63/10', () => {
      const ans = {
        estimate: 89,
        exact: 87,
        estimate_time_seconds: 12,
        exact_time_seconds: 18
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.anchorTier).toBe('SILVER_ANCHOR');
      expect(res.earnedPoints).toBe(8.63);
      expect(res.scoringBreakdown.estimateBase).toBe(4.13);
      expect(res.scoringBreakdown.estimateTime).toBe(1.5);
      expect(res.scoringBreakdown.exactTotal).toBe(3.0);
    });

    test('UT-SCR-04: Nhập kết quả đúng vào ô ước lượng (12s) + Tính đúng (18s) -> 7.25/10', () => {
      const ans = {
        estimate: 87,
        exact: 87,
        estimate_time_seconds: 12,
        exact_time_seconds: 18
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.anchorTier).toBe('EXACT_MATCH_IN_ESTIMATE');
      expect(res.badge).toBe('ĐỒNG');
      expect(res.earnedPoints).toBe(7.25);
      expect(res.scoringBreakdown.estimateBase).toBe(2.75);
      expect(res.scoringBreakdown.estimateTime).toBe(1.5);
    });

    test('UT-SCR-04b: Ước lượng cận trên/dưới (70) nhận Huy hiệu Đồng, điểm bằng Đặt tính đúng -> 7.25/10', () => {
      const ans = {
        estimate: 70,
        exact: 87,
        estimate_time_seconds: 12,
        exact_time_seconds: 18
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.anchorTier).toBe('BOUNDING_ANCHOR');
      expect(res.badge).toBe('ĐỒNG');
      expect(res.earnedPoints).toBe(7.25);
      expect(res.scoringBreakdown.estimateBase).toBe(2.75); // Bằng đúng 2.75 của EXACT_MATCH_IN_ESTIMATE
      expect(res.scoringBreakdown.estimateTime).toBe(1.5);
    });

    test('UT-SCR-05: Đoán mò số lẻ trong dung sai (20s) + Tính đúng (25s) -> 5.43/10', () => {
      const ans = {
        estimate: 83,
        exact: 87,
        estimate_time_seconds: 20,
        exact_time_seconds: 25
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.anchorTier).toBe('TOLERANCE_ONLY');
      expect(res.badge).toBe('KHUYẾN KHÍCH');
      expect(res.earnedPoints).toBe(5.43);
      expect(res.scoringBreakdown.estimateBase).toBe(1.93);
      expect(res.scoringBreakdown.estimateTime).toBe(0.75);
    });

    test('UT-SCR-06: Ước lượng đúng nhưng tính sai kết quả -> 7.0/10 (bảo lưu 70% Pha 1)', () => {
      const ans = {
        estimate: 90,
        exact: 80, // Sai
        estimate_time_seconds: 10,
        exact_time_seconds: 15
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.isEstimateOk).toBe(true);
      expect(res.isExactOk).toBe(false);
      expect(res.isFullyCorrect).toBe(false);
      expect(res.earnedPoints).toBe(7.0);
      expect(res.scoringBreakdown.estimateTotal).toBe(7.0);
      expect(res.scoringBreakdown.exactTotal).toBe(0.0);
    });

    test('UT-TIME-07 / UT-SCR-07: Ràng buộc Anti-Cheat Pha 1 — Không cộng Time Bonus khi Ước lượng sai (Base = 0)', () => {
      const ans = {
        estimate: 60, // Ngoài dải dung sai [74, 100]
        exact: 87,
        estimate_time_seconds: 2, // Siêu nhanh 2s
        exact_time_seconds: 15
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.isEstimateOk).toBe(false);
      expect(res.anchorTier).toBe('OUT_OF_RANGE');
      // Dù t1 = 2s nhưng vì ước lượng sai nên Time Bonus Pha 1 = 0!
      expect(res.scoringBreakdown.estimateBase).toBe(0);
      expect(res.scoringBreakdown.estimateTime).toBe(0);
      expect(res.scoringBreakdown.estimateTotal).toBe(0);
      // Chỉ nhận điểm Pha 2 (2.5 + 0.5 = 3.0)
      expect(res.earnedPoints).toBe(3.0);
    });

    test('UT-TIME-08: Ràng buộc Anti-Cheat Pha 2 — Không cộng Time Bonus khi Tính sai kết quả', () => {
      const ans = {
        estimate: 90,
        exact: 999, // Tính sai
        estimate_time_seconds: 12,
        exact_time_seconds: 3 // Siêu nhanh 3s
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.isExactOk).toBe(false);
      expect(res.scoringBreakdown.exactBase).toBe(0);
      expect(res.scoringBreakdown.exactTime).toBe(0);
      expect(res.scoringBreakdown.exactTotal).toBe(0);
      expect(res.earnedPoints).toBe(7.0);
    });

    test('UT-SCR-08: Sai cả hai pha -> 0.0/10', () => {
      const ans = {
        estimate: 50,
        exact: 50,
        estimate_time_seconds: 10,
        exact_time_seconds: 10
      };
      const res = evaluateEstimateQuestion(sampleRule, ans);
      expect(res.isEstimateOk).toBe(false);
      expect(res.isExactOk).toBe(false);
      expect(res.isFullyCorrect).toBe(false);
      expect(res.earnedPoints).toBe(0.0);
    });
  });

  describe('7. Kiểm thử giá trị biên & Dải dung sai (Boundary Tests)', () => {
    const boundaryRule = {
      operation: '+',
      operand1: 38,
      operand2: 49,
      exact: 87,
      gold_anchor: 90,
      silver_anchors: [88, 89],
      bounding_anchors: [70],
      estimate_min: 74,
      estimate_max: 100,
      points: 10
    };

    test('UT-BND-01: Chạm đúng biên dưới E = Emin (74) -> Chấp nhận trong dung sai', () => {
      const res = evaluateEstimateQuestion(boundaryRule, { estimate: 74, exact: 87 });
      expect(res.isEstimateOk).toBe(true);
      expect(res.anchorTier).toBe('TOLERANCE_ONLY');
    });

    test('UT-BND-02: Dưới biên dưới 1 đơn vị E = Emin - 1 (73) -> OUT_OF_RANGE', () => {
      const res = evaluateEstimateQuestion(boundaryRule, { estimate: 73, exact: 87 });
      expect(res.isEstimateOk).toBe(false);
      expect(res.anchorTier).toBe('OUT_OF_RANGE');
    });

    test('UT-BND-03: Chạm đúng biên trên E = Emax (100) -> Chấp nhận trong dung sai', () => {
      const res = evaluateEstimateQuestion(boundaryRule, { estimate: 100, exact: 87 });
      expect(res.isEstimateOk).toBe(true);
      expect(res.anchorTier).toBe('TOLERANCE_ONLY');
    });

    test('UT-BND-04: Vượt biên trên 1 đơn vị E = Emax + 1 (101) -> OUT_OF_RANGE', () => {
      const res = evaluateEstimateQuestion(boundaryRule, { estimate: 101, exact: 87 });
      expect(res.isEstimateOk).toBe(false);
      expect(res.anchorTier).toBe('OUT_OF_RANGE');
    });
  });

  describe('8. Kiểm thử dữ liệu bất thường & Bảo vệ đầu vào (Invalid Inputs)', () => {
    const testRule = {
      operation: '+',
      operand1: 38,
      operand2: 49,
      exact: 87,
      gold_anchor: 90,
      estimate_min: 74,
      estimate_max: 100,
      points: 10
    };

    test('UT-INV-01: Chuỗi rỗng, null, undefined không crash và trả về 0 điểm', () => {
      expect(evaluateEstimateQuestion(testRule, null).earnedPoints).toBe(0);
      expect(evaluateEstimateQuestion(testRule, {}).earnedPoints).toBe(0);
      expect(evaluateEstimateQuestion(testRule, { estimate: '', exact: '' }).earnedPoints).toBe(0);
      expect(evaluateEstimateQuestion(testRule, { estimate: null, exact: undefined }).earnedPoints).toBe(0);
    });

    test('UT-INV-02: Chuỗi ký tự chữ cái ("abc", "ba mươi", "NaN") bị từ chối an toàn', () => {
      const res = evaluateEstimateQuestion(testRule, { estimate: 'abc', exact: 'ba mươi' });
      expect(res.isEstimateOk).toBe(false);
      expect(res.isExactOk).toBe(false);
      expect(res.earnedPoints).toBe(0);
    });

    test('UT-INV-03: Số âm ("-10", "-87") bị từ chối', () => {
      const res = evaluateEstimateQuestion(testRule, { estimate: '-90', exact: '-87' });
      expect(res.isEstimateOk).toBe(false);
      expect(res.isExactOk).toBe(false);
      expect(res.earnedPoints).toBe(0);
    });

    test('UT-INV-04: Số thập phân ("25.5", "25,5") bị từ chối', () => {
      const res1 = evaluateEstimateQuestion(testRule, { estimate: '90.5', exact: '87' });
      expect(res1.isEstimateOk).toBe(false);

      const res2 = evaluateEstimateQuestion(testRule, { estimate: '90', exact: '87.0' });
      expect(res2.isExactOk).toBe(false);
    });

    test('UT-INV-05: Chuỗi có khoảng trắng ở giữa ("9 0", "20+5") bị từ chối', () => {
      const res = evaluateEstimateQuestion(testRule, { estimate: '9 0', exact: '20+5' });
      expect(res.isEstimateOk).toBe(false);
      expect(res.isExactOk).toBe(false);
    });

    test('UT-INV-06: Chuỗi có khoảng trắng đầu/cuối được tự động trim()', () => {
      const res = evaluateEstimateQuestion(testRule, {
        estimate: '  90  ',
        exact: ' 87 ',
        estimate_time_seconds: 10,
        exact_time_seconds: 15
      });
      expect(res.isEstimateOk).toBe(true);
      expect(res.isExactOk).toBe(true);
      expect(res.earnedPoints).toBe(10.0);
    });

    test('UT-INV-07: Số quá lớn (> 6 chữ số) bị chặn', () => {
      const res = evaluateEstimateQuestion(testRule, { estimate: '9999999', exact: '9999999' });
      expect(res.isEstimateOk).toBe(false);
      expect(res.isExactOk).toBe(false);
    });
  });

  describe('9. Kiểm thử 16 Synthetic Fixtures từ SEED_FIXTURES.md', () => {
    const fixtures = [
      // Phép cộng
      { id: 'est-add-01', prompt: '38 + 49', rule: { operation: '+', operand1: 38, operand2: 49, exact: 87, gold_anchor: 90, silver_anchors: [88, 89], bounding_anchors: [70], estimate_min: 74, estimate_max: 100 } },
      { id: 'est-add-02', prompt: '54 + 27', rule: { operation: '+', operand1: 54, operand2: 27, exact: 81, gold_anchor: 80, silver_anchors: [77, 84], bounding_anchors: [70, 90], estimate_min: 70, estimate_max: 95 } },
      { id: 'est-add-03', prompt: '61 + 28', rule: { operation: '+', operand1: 61, operand2: 28, exact: 89, gold_anchor: 90, silver_anchors: [88, 91], bounding_anchors: [80], estimate_min: 75, estimate_max: 100 } },
      { id: 'est-add-04', prompt: '45 + 36', rule: { operation: '+', operand1: 45, operand2: 36, exact: 81, gold_anchor: 90, silver_anchors: [85, 86], bounding_anchors: [70, 80], estimate_min: 70, estimate_max: 95 } },
      // Phép trừ
      { id: 'est-sub-01', prompt: '72 - 38', rule: { operation: '-', operand1: 72, operand2: 38, exact: 34, gold_anchor: 30, silver_anchors: [32], bounding_anchors: [40], estimate_min: 25, estimate_max: 42 } },
      { id: 'est-sub-02', prompt: '85 - 29', rule: { operation: '-', operand1: 85, operand2: 29, exact: 56, gold_anchor: 60, silver_anchors: [55, 61], bounding_anchors: [50], estimate_min: 47, estimate_max: 68 } },
      { id: 'est-sub-03', prompt: '91 - 43', rule: { operation: '-', operand1: 91, operand2: 43, exact: 48, gold_anchor: 50, silver_anchors: [47, 51], bounding_anchors: [40], estimate_min: 40, estimate_max: 58 } },
      { id: 'est-sub-04', prompt: '67 - 21', rule: { operation: '-', operand1: 67, operand2: 21, exact: 46, gold_anchor: 50, silver_anchors: [47, 49], bounding_anchors: [40], estimate_min: 38, estimate_max: 55 } },
      // Phép nhân
      { id: 'est-mul-01', prompt: '29 × 3', rule: { operation: '*', operand1: 29, operand2: 3, exact: 87, gold_anchor: 90, silver_anchors: [85], bounding_anchors: [60], estimate_min: 75, estimate_max: 105 } },
      { id: 'est-mul-02', prompt: '48 × 4', rule: { operation: '*', operand1: 48, operand2: 4, exact: 192, gold_anchor: 200, silver_anchors: [180], bounding_anchors: [160], estimate_min: 160, estimate_max: 230 } },
      { id: 'est-mul-03', prompt: '19 × 5', rule: { operation: '*', operand1: 19, operand2: 5, exact: 95, gold_anchor: 100, silver_anchors: [90], bounding_anchors: [50], estimate_min: 80, estimate_max: 115 } },
      { id: 'est-mul-04', prompt: '82 × 4', rule: { operation: '*', operand1: 82, operand2: 4, exact: 328, gold_anchor: 320, silver_anchors: [330], bounding_anchors: [360], estimate_min: 275, estimate_max: 375 } },
      // Phép chia
      { id: 'est-div-01', prompt: '84 : 4', rule: { operation: ':', operand1: 84, operand2: 4, exact: 21, gold_anchor: 20, silver_anchors: [22, 23, 25], bounding_anchors: [], estimate_min: 17, estimate_max: 26 } },
      { id: 'est-div-02', prompt: '178 : 6', rule: { operation: ':', operand1: 178, operand2: 6, exact: 29, gold_anchor: 30, silver_anchors: [28, 32], bounding_anchors: [25], estimate_min: 24, estimate_max: 36 } },
      { id: 'est-div-03', prompt: '48 : 6', rule: { operation: ':', operand1: 48, operand2: 6, exact: 8, gold_anchor: 8, silver_anchors: [7, 9], bounding_anchors: [10], estimate_min: 6, estimate_max: 10 } },
      { id: 'est-div-04', prompt: '245 : 8', rule: { operation: ':', operand1: 245, operand2: 8, exact: 30, gold_anchor: 30, silver_anchors: [29, 31], bounding_anchors: [28, 32], estimate_min: 25, estimate_max: 36 } }
    ];

    test('UT-NORM-05: Toàn bộ 16 câu fixture đều chấm đúng 10.0/10 khi học sinh nhập Gold Anchor và tính đúng', () => {
      fixtures.forEach(f => {
        const result = evaluateEstimateQuestion(f.rule, {
          estimate: f.rule.gold_anchor,
          exact: f.rule.exact,
          estimate_time_seconds: 12,
          exact_time_seconds: 18
        });
        expect(result.isFullyCorrect).toBe(true);
        expect(result.anchorTier).toBe('GOLD_ANCHOR');
        expect(result.badge).toBe('VÀNG');
        expect(result.earnedPoints).toBe(10.0);
      });
    });

    test('UT-NORM-06: Tính tất định (Determinism) — Chạy 100 lần liên tiếp đều trả về cùng kết quả', () => {
      const q = fixtures[0];
      const baseline = evaluateEstimateQuestion(q.rule, {
        estimate: q.rule.gold_anchor,
        exact: q.rule.exact,
        estimate_time_seconds: 10,
        exact_time_seconds: 15
      });
      for (let i = 0; i < 100; i++) {
        const current = evaluateEstimateQuestion(q.rule, {
          estimate: q.rule.gold_anchor,
          exact: q.rule.exact,
          estimate_time_seconds: 10,
          exact_time_seconds: 15
        });
        expect(current).toEqual(baseline);
      }
    });
  });

});
