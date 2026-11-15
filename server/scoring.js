'use strict';

/**
 * Module Chấm điểm & Động cơ Toán học cho Dạng bài Ước lượng (Grade 3 Math)
 * Theo đặc tả ADR-01 (artifacts/DECISIONS.md)
 */

/**
 * Quy tắc làm tròn số tự nhiên về hàng chục gần nhất theo chuẩn SGK Toán 3
 * (1, 2, 3, 4 -> làm tròn xuống; 5, 6, 7, 8, 9 -> làm tròn lên)
 * @param {number|string} n
 * @returns {number}
 */
function roundToTen(n) {
  const num = Math.round(Number(n));
  if (isNaN(num) || !isFinite(num)) return 0;
  const unit = Math.abs(num) % 10;
  if (unit === 0) return num;
  if (num < 0) {
    return Math.round(num / 10) * 10;
  }
  if (unit < 5) return num - unit;
  return num + (10 - unit);
}

/**
 * Tính điểm neo Vàng (Gold Anchor) chuẩn SGK Toán 3 Kết nối tri thức
 * @param {string} operation
 * @param {number|string} op1
 * @param {number|string} op2
 * @returns {number}
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
      if (o1 < 10 && o2 >= 10) {
        return o1 * roundToTen(o2);
      }
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
 * Tập hợp các điểm neo Bạc (Silver Anchors - làm tròn 1 số, giữ nguyên số còn lại)
 * @param {string} operation
 * @param {number|string} op1
 * @param {number|string} op2
 * @returns {number[]}
 */
function calculateSilverAnchors(operation, op1, op2) {
  const o1 = Number(op1);
  const o2 = Number(op2);
  const anchors = new Set();
  if (isNaN(o1) || isNaN(o2)) return [];

  if (operation === '+') {
    // Làm tròn 1 số, giữ nguyên số còn lại
    anchors.add(roundToTen(o1) + o2);
    anchors.add(o1 + roundToTen(o2));
  } else if (operation === '-') {
    anchors.add(roundToTen(o1) - o2);
    anchors.add(o1 - roundToTen(o2));
  } else if (operation === '*' || operation === 'x' || operation === '×') {
    // Làm tròn thừa số đến số chẵn chục hoặc mốc 5
  } else if (operation === ':' || operation === '/' || operation === '÷') {
    // Phép chia
  }

  const gold = calculateGoldAnchor(operation, op1, op2);
  anchors.delete(gold);
  return Array.from(anchors).filter(v => v > 0);
}

/**
 * Tập hợp các điểm neo Cận trên / Cận dưới (Bounding Anchors)
 * (Làm tròn cả 2 số cùng lên / cùng xuống, cận biên floor/ceil)
 * Nhận cùng Huy hiệu ĐỒNG (50% Base điểm) với trường hợp học sinh đặt tính đúng vào ô ước lượng
 * @param {string} operation
 * @param {number|string} op1
 * @param {number|string} op2
 * @returns {number[]}
 */
function calculateBoundingAnchors(operation, op1, op2) {
  const o1 = Number(op1);
  const o2 = Number(op2);
  const anchors = new Set();
  if (isNaN(o1) || isNaN(o2)) return [];

  const floor1 = Math.floor(o1 / 10) * 10;
  const floor2 = Math.floor(o2 / 10) * 10;
  const ceil1 = Math.ceil(o1 / 10) * 10;
  const ceil2 = Math.ceil(o2 / 10) * 10;

  if (operation === '+') {
    anchors.add(floor1 + floor2); // Cận dưới
    anchors.add(ceil1 + ceil2);   // Cận trên
  } else if (operation === '-') {
    anchors.add(floor1 - floor2);
    anchors.add(ceil1 - ceil2);
    anchors.add(floor1 - ceil2);
    anchors.add(ceil1 - floor2);
  } else if (operation === '*' || operation === 'x' || operation === '×') {
    if (o1 >= 10 && o2 < 10) {
      anchors.add(floor1 * o2);
      anchors.add(ceil1 * o2);
    } else if (o1 < 10 && o2 >= 10) {
      anchors.add(o1 * floor2);
      anchors.add(o1 * ceil2);
    } else {
      anchors.add(floor1 * floor2);
      anchors.add(ceil1 * ceil2);
    }
  } else if (operation === ':' || operation === '/' || operation === '÷') {
    if (o2 !== 0) {
      anchors.add(Math.round(floor1 / o2));
      anchors.add(Math.round(ceil1 / o2));
    }
  }

  const gold = calculateGoldAnchor(operation, op1, op2);
  const silvers = new Set(calculateSilverAnchors(operation, op1, op2));
  anchors.delete(gold);
  for (const s of silvers) {
    anchors.delete(s);
  }
  return Array.from(anchors).filter(v => v > 0);
}

/**
 * Tính ngưỡng chênh lệch tuyệt đối Delta_min tối thiểu cho dải dung sai +-15%
 * @param {string} operation
 * @param {number|string} exact
 * @returns {number}
 */
function getDeltaMin(operation, exact) {
  const a = Math.abs(Number(exact) || 0);
  const baseDelta = Math.ceil(0.15 * a);
  if (operation === '+' || operation === '-') {
    return Math.max(3, baseDelta);
  }
  return Math.max(2, baseDelta);
}

/**
 * Phân cấp điểm neo logic cho Pha 1 (Hierarchical Anchor Matching)
 * Hỗ trợ linh hoạt cả rule có sẵn gold_anchor/rounded_anchor/silver_anchors
 * lẫn khi tính toán động từ operand1, operand2, operation.
 * @param {Object} rule
 * @param {number|string} estNum
 * @returns {{ tier: string, baseRatio: number, badge: string, feedback: string }}
 */
function matchEstimateAnchor(rule, estNum) {
  const r = rule || {};
  const operation = r.operation || '+';
  const exact = Number(r.exact);

  // Parse estNum an toàn
  const est = Number(estNum);
  if (estNum == null || estNum === '' || isNaN(est) || !isFinite(est) || est <= 0) {
    return {
      tier: 'OUT_OF_RANGE',
      baseRatio: 0.0,
      badge: 'CẦN CỐ GẮNG',
      feedback: 'Vui lòng nhập số ước lượng hợp lệ. ✏️'
    };
  }

  // Điểm neo Vàng: ưu tiên gold_anchor / rounded_anchor nếu có trong rule
  const goldAnchor = (r.gold_anchor != null ? Number(r.gold_anchor) : (r.rounded_anchor != null ? Number(r.rounded_anchor) : null))
    ?? calculateGoldAnchor(operation, r.operand1, r.operand2);

  // Điểm neo Cận trên / Cận dưới: kết hợp bounding_anchors từ rule và tính toán động
  const dynamicBoundings = calculateBoundingAnchors(operation, r.operand1, r.operand2);
  const ruleBoundings = Array.isArray(r.bounding_anchors)
    ? r.bounding_anchors.map(Number)
    : (Array.isArray(r.boundingAnchors) ? r.boundingAnchors.map(Number) : []);
  const boundingAnchors = Array.from(new Set([...ruleBoundings, ...dynamicBoundings])).filter(v => v !== goldAnchor);

  // Điểm neo Bạc: kết hợp silver_anchors từ rule và tính toán động (loại bỏ goldAnchor và boundingAnchors)
  const dynamicSilvers = calculateSilverAnchors(operation, r.operand1, r.operand2);
  const ruleSilvers = Array.isArray(r.silver_anchors)
    ? r.silver_anchors.map(Number)
    : (Array.isArray(r.silverAnchors) ? r.silverAnchors.map(Number) : []);
  const silverAnchors = Array.from(new Set([...ruleSilvers, ...dynamicSilvers]))
    .filter(v => v !== goldAnchor && !boundingAnchors.includes(v));

  const deltaMin = getDeltaMin(operation, exact);

  // 1. Điểm neo Vàng: Chuẩn SGK làm tròn cả 2 số đến hàng chục
  if (est === goldAnchor) {
    return {
      tier: 'GOLD_ANCHOR',
      baseRatio: 1.0, // 100% Base Score (55% tổng điểm)
      badge: 'VÀNG',
      feedback: `Xuất sắc! Em ước lượng ${est} chuẩn theo điểm neo SGK (làm tròn số tròn chục). 🥇`
    };
  }

  // 2. Điểm neo Bạc: Làm tròn 1 số, giữ nguyên số còn lại
  if (silverAnchors.includes(est)) {
    return {
      tier: 'SILVER_ANCHOR',
      baseRatio: 0.75, // 75% Base Score (41.25% tổng điểm)
      badge: 'BẠC',
      feedback: `Rất tốt! Em ước lượng ${est} theo chiến lược làm tròn linh hoạt hợp lý. 🥈`
    };
  }

  // 3. Hạng Đồng (50% Base Score = 27.5% tổng điểm): Đặt tính đúng hoặc Ước lượng cận trên/dưới
  // 3a. Học sinh nhập đáp án tính đúng vào ô ước lượng (E_given == A_exact với A_exact lẻ)
  if (est === exact) {
    return {
      tier: 'EXACT_MATCH_IN_ESTIMATE',
      baseRatio: 0.50, // 50% Base Score (27.5% tổng điểm)
      badge: 'ĐỒNG',
      feedback: `Em tính nhẩm ra đúng kết quả ${est}! Tuy nhiên, ở bước ước lượng, em nên làm tròn thành số tròn chục (ví dụ ${goldAnchor}) để kiểm tra nhanh nhé! 🥉`
    };
  }

  // 3b. Ước lượng cận trên / cận dưới (cùng làm tròn xuống hoặc cùng làm tròn lên)
  if (boundingAnchors.includes(est)) {
    return {
      tier: 'BOUNDING_ANCHOR',
      baseRatio: 0.50, // 50% Base Score (27.5% tổng điểm - Bằng điểm với đặt tính đúng)
      badge: 'ĐỒNG',
      feedback: `Số ${est} là ước lượng cận trên/dưới. Em nên làm tròn theo quy tắc SGK để nhẩm được ${goldAnchor} nhé! 🥉`
    };
  }

  // 4. Nằm trong dải dung sai +-15% nhưng KHÔNG theo điểm neo logic (Đoán mò / gõ số lẻ)
  const minBound = r.estimate_min != null ? Number(r.estimate_min) : exact - deltaMin;
  const maxBound = r.estimate_max != null ? Number(r.estimate_max) : exact + deltaMin;
  const inTolerance = (est >= minBound && est <= maxBound);

  if (inTolerance) {
    return {
      tier: 'TOLERANCE_ONLY',
      baseRatio: 0.35, // 35% Base Score (19.25% tổng điểm - Điểm khuyến khích)
      badge: 'KHUYẾN KHÍCH',
      feedback: `Ước lượng ${est} nằm trong khoảng gần đúng. Gợi ý: Em hãy làm tròn về số tròn chục (${goldAnchor}) để nhẩm nhanh và chính xác hơn nhé! 🌱`
    };
  }

  // 5. Nằm ngoài dải dung sai
  return {
    tier: 'OUT_OF_RANGE',
    baseRatio: 0.0, // 0%
    badge: 'CẦN CỐ GẮNG',
    feedback: `Ước lượng ${est} chưa thật sát. ${r.explanation || `Em hãy làm tròn các số về hàng chục gần nhất để được ${goldAnchor} nhé!`} ✏️`
  };
}

/**
 * Chuẩn hóa thời gian về [0, 60] an toàn
 * Fallback về 60s cho input không hợp lệ (NaN, null, non-numeric)
 */
function normalizeTime(t) {
  if (t === null || t === undefined || t === '') return 60;
  const num = Number(t);
  if (isNaN(num) || !isFinite(num)) return 60;
  if (num < 0) return 0;
  if (num > 60) return 60;
  return num;
}

/**
 * Đánh giá Time-Bonus Tiers theo thời gian thao tác từng pha
 * @param {number} t1 Thời gian ước lượng (giây)
 * @param {number} t2 Thời gian tính đúng (giây)
 * @returns {Object}
 */
function evaluateTimeBonus(t1, t2) {
  const timeEst = normalizeTime(t1);
  const timeExact = normalizeTime(t2);

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
 * Làm tròn điểm số về 2 chữ số thập phân (khắc phục lỗi sai số dấu phẩy động IEEE 754)
 */
function roundScore(val) {
  if (!val || val <= 0) return 0;
  return Math.round((Number(val) + 1e-6) * 100) / 100;
}

/**
 * Thuật toán đánh giá câu hỏi ước lượng theo mô hình 70/30 và Time-Bonus Tiers
 * @param {Object} rule Quy tắc chấm từ correct_answer
 * @param {Object} studentAnswer { estimate, exact, estimate_time_seconds, exact_time_seconds }
 * @returns {Object} Kết quả đánh giá chi tiết
 */
function evaluateEstimateQuestion(rule, studentAnswer) {
  const r = rule || {};
  const operation = r.operation || '+';
  const exactExpected = Number(r.exact);
  const totalPoints = Number(r.points) || 10;

  // Trọng số chuyển dịch: Ước lượng 70% (55% Base + 15% Speed), Tính đúng 30% (25% Base + 5% Speed)
  const WEIGHTS = {
    estBase: 0.55,
    estSpeed: 0.15,
    exactBase: 0.25,
    exactSpeed: 0.05
  };

  // 1. Chuẩn hóa & kiểm tra hợp lệ dữ liệu nhập (Regex bảo vệ /^\d{1,6}$/)
  const rawEst = studentAnswer && studentAnswer.estimate != null ? String(studentAnswer.estimate).trim() : '';
  const rawExact = studentAnswer && studentAnswer.exact != null ? String(studentAnswer.exact).trim() : '';
  const estTimeSec = studentAnswer ? studentAnswer.estimate_time_seconds : 60;
  const exactTimeSec = studentAnswer ? studentAnswer.exact_time_seconds : 60;

  const numRegex = /^\d{1,6}$/;
  const isEstFormatValid = numRegex.test(rawEst);
  const isExactFormatValid = numRegex.test(rawExact);

  const estNum = isEstFormatValid ? Number(rawEst) : NaN;
  const exactNum = isExactFormatValid ? Number(rawExact) : NaN;

  // 2. Đánh giá Pha 1: Ước lượng nhẩm phân cấp điểm neo (Hierarchical Anchor Matching)
  let anchorResult = {
    tier: 'OUT_OF_RANGE',
    baseRatio: 0.0,
    badge: 'CẦN CỐ GẮNG',
    feedback: 'Vui lòng nhập số ước lượng hợp lệ.'
  };

  if (isEstFormatValid && !isNaN(estNum) && isFinite(estNum) && estNum > 0) {
    anchorResult = matchEstimateAnchor(r, estNum);
  }

  const isEstimateOk = anchorResult.baseRatio > 0;
  const pointsEstBase = roundScore(totalPoints * WEIGHTS.estBase * anchorResult.baseRatio);

  // 3. Đánh giá Pha 2: Tính đúng kết quả
  const isExactOk = isExactFormatValid && exactNum === exactExpected;
  const pointsExactBase = isExactOk ? roundScore(totalPoints * WEIGHTS.exactBase) : 0;

  // 4. Đánh giá Tốc độ & Time-Bonus Tiers (Chỉ thưởng khi học sinh có tư duy đúng)
  const timeEval = evaluateTimeBonus(estTimeSec, exactTimeSec);

  // Time bonus Pha 1 chỉ cộng khi học sinh đạt Base ước lượng > 0
  const pointsEstTime = isEstimateOk
    ? roundScore(totalPoints * WEIGHTS.estSpeed * timeEval.estTimeRatio)
    : 0;

  // Time bonus Pha 2 chỉ cộng khi kết quả tính đúng
  const pointsExactTime = isExactOk
    ? roundScore(totalPoints * WEIGHTS.exactSpeed * timeEval.exactTimeRatio)
    : 0;

  // 5. Tổng hợp điểm số & trạng thái hoàn thành
  const earnedEstPoints = roundScore(pointsEstBase + pointsEstTime);
  const earnedExactPoints = roundScore(pointsExactBase + pointsExactTime);
  const earnedPoints = roundScore(earnedEstPoints + earnedExactPoints);
  const isFullyCorrect = isEstimateOk && isExactOk;

  // Phản hồi Pha 2 & Lời giải thích
  const opSymbol = operation === '*' ? '×' : operation === '/' ? ':' : operation;
  const expression = r.operand1 != null && r.operand2 != null
    ? `${r.operand1} ${opSymbol} ${r.operand2} = ${r.exact}`
    : `kết quả đúng là ${r.exact}`;

  let feedbackExact = '';
  if (isExactOk) {
    const speedNote = timeEval.exactSpeedTier === 'GOLD_SPEED' ? ' Em áp dụng mẹo bù trừ tính nhẩm siêu tốc! ⚡' : '';
    feedbackExact = `Chính xác! Phép tính ${expression}.${speedNote} Em làm bài rất cẩn thận! 👏`;
  } else {
    feedbackExact = `Chưa chính xác rồi. Phép tính đúng là: ${expression}. Em hãy kiểm tra lại nhé! ✏️`;
  }

  const goldAnchor = (r.gold_anchor != null ? Number(r.gold_anchor) : (r.rounded_anchor != null ? Number(r.rounded_anchor) : null))
    ?? calculateGoldAnchor(operation, r.operand1, r.operand2);

  const dynamicBoundings = calculateBoundingAnchors(operation, r.operand1, r.operand2);
  const ruleBoundings = Array.isArray(r.bounding_anchors)
    ? r.bounding_anchors.map(Number)
    : (Array.isArray(r.boundingAnchors) ? r.boundingAnchors.map(Number) : []);
  const boundingAnchors = Array.from(new Set([...ruleBoundings, ...dynamicBoundings])).filter(v => v !== goldAnchor);

  const dynamicSilvers = calculateSilverAnchors(operation, r.operand1, r.operand2);
  const ruleSilvers = Array.isArray(r.silver_anchors)
    ? r.silver_anchors.map(Number)
    : (Array.isArray(r.silverAnchors) ? r.silverAnchors.map(Number) : []);
  const silverAnchors = Array.from(new Set([...ruleSilvers, ...dynamicSilvers]))
    .filter(v => v !== goldAnchor && !boundingAnchors.includes(v));

  const deltaMin = getDeltaMin(operation, exactExpected);
  const estMin = r.estimate_min != null ? Number(r.estimate_min) : exactExpected - deltaMin;
  const estMax = r.estimate_max != null ? Number(r.estimate_max) : exactExpected + deltaMin;

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
      goldAnchor,
      silverAnchors,
      boundingAnchors,
      estimateRange: [estMin, estMax]
    },
    feedbackEstimate: anchorResult.feedback,
    feedbackExact,
    explanation: r.explanation || `Điểm neo làm tròn SGK là ${goldAnchor}. ${expression}.`
  };
}

module.exports = {
  roundToTen,
  calculateGoldAnchor,
  calculateSilverAnchors,
  calculateBoundingAnchors,
  getDeltaMin,
  matchEstimateAnchor,
  evaluateTimeBonus,
  evaluateEstimateQuestion
};
