'use strict';
/**
 * Bộ kiểm thử tích hợp REST API (Integration Tests) cho Dạng bài Ước lượng Toán 3
 * Theo đặc tả ADR-01, ADR-03, ADR-04 (artifacts/DECISIONS.md & artifacts/TEST_PLAN.md)
 */
const request = require('supertest');
const app = require('../../server/index');
const db = require('../../server/db');

describe('Integration Tests: Estimate Question Set API & Scoring', () => {
  let authCookie = null;
  let authToken = null;

  beforeAll(async () => {
    // Đăng nhập tài khoản học sinh mẫu
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'hocsinh01', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.username).toBe('hocsinh01');

    // Lấy cookie xác thực
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    authCookie = cookies[0];
  });

  describe('1. GET /api/question-sets/:setId/questions (Bảo mật Anti-cheat)', () => {
    test('IT-API-01: Yêu cầu đăng nhập, từ chối truy cập 401 khi chưa xác thực', async () => {
      const res = await request(app).get('/api/question-sets/uoc-luong-toan-lop-3/questions');
      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    test('IT-API-02: Trả về đầy đủ 16 câu hỏi mẫu khi đã xác thực', async () => {
      const res = await request(app)
        .get('/api/question-sets/uoc-luong-toan-lop-3/questions')
        .set('Cookie', authCookie);

      expect(res.status).toBe(200);
      expect(res.body.setId).toBe('uoc-luong-toan-lop-3');
      expect(Array.isArray(res.body.questions)).toBe(true);
      expect(res.body.questions.length).toBe(16);
    });

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

        // Kiểm tra các trường hiển thị công khai an toàn
        expect(q.id).toBeDefined();
        expect(q.type).toBe('estimate');
        expect(q.prompt).toBeDefined();
        expect(q.points).toBe(10);
        expect(q.category).toBeDefined();
      }
    });

    test('IT-API-04: Trả về 404 cho bộ câu hỏi không tồn tại', async () => {
      const res = await request(app)
        .get('/api/question-sets/bo-de-khong-ton-tai/questions')
        .set('Cookie', authCookie);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Không tìm thấy bộ câu hỏi.');
    });
  });

  describe('2. POST /api/submissions (Chấm điểm phân cấp 5 bậc & Lưu trữ)', () => {
    test('IT-SUB-01: Yêu cầu xác thực 401 khi nộp bài', async () => {
      const res = await request(app)
        .post('/api/submissions')
        .send({ setId: 'uoc-luong-toan-lop-3', answers: {} });

      expect(res.status).toBe(401);
    });

    test('IT-SUB-02: Điểm neo Vàng + Đặt tính đúng trong thời gian vàng đạt điểm tuyệt đối 10.0', async () => {
      // est-add-01: 38 + 49 = ? (exact: 87, gold: 90)
      const res = await request(app)
        .post('/api/submissions')
        .set('Cookie', authCookie)
        .send({
          setId: 'uoc-luong-toan-lop-3',
          answers: {
            'est-add-01': {
              estimate: 90,
              exact: 87,
              estimate_time_seconds: 12,
              exact_time_seconds: 18
            }
          },
          durationSec: 30
        });

      expect(res.status).toBe(200);
      expect(res.body.totalCount).toBe(16);

      const d1 = res.body.detail.find(d => d.questionId === 'est-add-01');
      expect(d1).toBeDefined();
      expect(d1.isFullyCorrect).toBe(true);
      expect(d1.isEstimateOk).toBe(true);
      expect(d1.isExactOk).toBe(true);
      expect(d1.anchorTier).toBe('GOLD_ANCHOR');
      expect(d1.badge).toBe('VÀNG');
      expect(d1.earnedPoints).toBe(10);
      expect(d1.maxPoints).toBe(10);
      expect(d1.scoringBreakdown.estimateTotal).toBe(7);
      expect(d1.scoringBreakdown.exactTotal).toBe(3);
    });

    test('IT-SUB-03: Điểm neo Bạc nhận 75% Base Score', async () => {
      // est-add-01: ước lượng 88 (làm tròn 1 số: 38 + 50 = 88), thời gian > 30s không có time bonus
      const res = await request(app)
        .post('/api/submissions')
        .set('Cookie', authCookie)
        .send({
          setId: 'uoc-luong-toan-lop-3',
          answers: {
            'est-add-01': {
              estimate: 88,
              exact: 87,
              estimate_time_seconds: 35,
              exact_time_seconds: 45
            }
          }
        });

      expect(res.status).toBe(200);
      const d1 = res.body.detail.find(d => d.questionId === 'est-add-01');
      expect(d1.anchorTier).toBe('SILVER_ANCHOR');
      expect(d1.badge).toBe('BẠC');
      expect(d1.scoringBreakdown.estimateBase).toBe(4.13); // 10 * 0.55 * 0.75 = 4.125 -> 4.13
      expect(d1.scoringBreakdown.estimateTime).toBe(0);
      expect(d1.scoringBreakdown.exactBase).toBe(2.5);
      expect(d1.scoringBreakdown.exactTime).toBe(0);
      expect(d1.earnedPoints).toBe(6.63);
    });

    test('IT-SUB-04: Nhập đáp án tính đúng vào ô ước lượng nhận 50% Base Score & lời khuyên sư phạm', async () => {
      // est-add-01: ước lượng 87 (bằng đúng kết quả chính xác)
      const res = await request(app)
        .post('/api/submissions')
        .set('Cookie', authCookie)
        .send({
          setId: 'uoc-luong-toan-lop-3',
          answers: {
            'est-add-01': {
              estimate: 87,
              exact: 87,
              estimate_time_seconds: 10,
              exact_time_seconds: 15
            }
          }
        });

      expect(res.status).toBe(200);
      const d1 = res.body.detail.find(d => d.questionId === 'est-add-01');
      expect(d1.anchorTier).toBe('EXACT_MATCH_IN_ESTIMATE');
      expect(d1.badge).toBe('ĐỒNG');
      expect(d1.scoringBreakdown.estimateBase).toBe(2.75); // 10 * 0.55 * 0.50
      expect(d1.feedbackEstimate).toContain('Em tính nhẩm ra đúng kết quả');
    });

    test('IT-SUB-05: Ước lượng ngoài dải dung sai nhận 0 điểm ước lượng và không có time bonus', async () => {
      // est-add-01: ước lượng 150 (vượt quá dung sai [74, 100])
      const res = await request(app)
        .post('/api/submissions')
        .set('Cookie', authCookie)
        .send({
          setId: 'uoc-luong-toan-lop-3',
          answers: {
            'est-add-01': {
              estimate: 150,
              exact: 87,
              estimate_time_seconds: 5,
              exact_time_seconds: 15
            }
          }
        });

      expect(res.status).toBe(200);
      const d1 = res.body.detail.find(d => d.questionId === 'est-add-01');
      expect(d1.anchorTier).toBe('OUT_OF_RANGE');
      expect(d1.isEstimateOk).toBe(false);
      expect(d1.scoringBreakdown.estimateBase).toBe(0);
      expect(d1.scoringBreakdown.estimateTime).toBe(0); // Anti-cheat: Không thưởng tốc độ khi sai
      expect(d1.scoringBreakdown.exactTotal).toBe(3); // 2.5 + 0.5
      expect(d1.earnedPoints).toBe(3);
    });

    test('IT-SUB-06: Nộp toàn bộ 16 câu hỏi mẫu đạt lưu trữ SQLite bền vững', async () => {
      // Chuẩn bị payload 16 câu chuẩn Gold Anchor theo đúng SEED_FIXTURES.md
      const allAnswers = {
        'est-add-01': { estimate: 90, exact: 87, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-add-02': { estimate: 80, exact: 81, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-add-03': { estimate: 90, exact: 89, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-add-04': { estimate: 90, exact: 81, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-sub-01': { estimate: 30, exact: 34, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-sub-02': { estimate: 60, exact: 56, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-sub-03': { estimate: 50, exact: 48, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-sub-04': { estimate: 50, exact: 46, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-mul-01': { estimate: 90, exact: 87, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-mul-02': { estimate: 200, exact: 192, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-mul-03': { estimate: 100, exact: 95, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-mul-04': { estimate: 320, exact: 328, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-div-01': { estimate: 20, exact: 21, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-div-02': { estimate: 30, exact: 29, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-div-03': { estimate: 8, exact: 8, estimate_time_seconds: 10, exact_time_seconds: 15 },
        'est-div-04': { estimate: 30, exact: 30, estimate_time_seconds: 10, exact_time_seconds: 15 }
      };

      const res = await request(app)
        .post('/api/submissions')
        .set('Cookie', authCookie)
        .send({
          setId: 'uoc-luong-toan-lop-3',
          answers: allAnswers,
          durationSec: 180
        });

      expect(res.status).toBe(200);
      expect(res.body.scorePercent).toBe(100);
      expect(res.body.correctCount).toBe(16);
      expect(res.body.totalCount).toBe(16);
      expect(res.body.detail.length).toBe(16);

      // Kiểm tra lưu trữ DB SQLite
      const user = db.prepare('SELECT id FROM users WHERE username = ?').get('hocsinh01');
      const progress = db.prepare('SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?').get(user.id, 'bai-16');
      expect(progress).toBeDefined();
      expect(progress.best_score).toBe(100);
      expect(progress.completed).toBe(1);

      const attempt = db.prepare('SELECT * FROM attempts WHERE user_id = ? AND ref_id = ? ORDER BY id DESC LIMIT 1').get(user.id, 'uoc-luong-toan-lop-3');
      expect(attempt).toBeDefined();
      expect(attempt.score_percent).toBe(100);
      expect(attempt.correct_count).toBe(16);
    });
  });

  describe('3. POST /api/questions/:id/check (Chấm điểm tức thì từng câu)', () => {
    test('IT-CHK-01: Yêu cầu xác thực 401 khi chấm câu đơn lẻ chưa đăng nhập', async () => {
      const res = await request(app)
        .post('/api/questions/est-add-01/check')
        .send({ answer: { estimate: 90, exact: 87 } });

      expect(res.status).toBe(401);
    });

    test('IT-CHK-02: Trả về 404 khi mã câu hỏi không tồn tại', async () => {
      const res = await request(app)
        .post('/api/questions/cau-khong-ton-tai/check')
        .set('Cookie', authCookie)
        .send({ answer: { estimate: 90, exact: 87 } });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Không tìm thấy câu hỏi.');
    });

    test('IT-CHK-03: Trả về chi tiết chấm điểm, đáp án đúng & nhận xét tức thì cho câu hỏi', async () => {
      const res = await request(app)
        .post('/api/questions/est-add-01/check')
        .set('Cookie', authCookie)
        .send({
          answer: {
            estimate: 90,
            exact: 87,
            estimate_time_seconds: 12,
            exact_time_seconds: 18
          }
        });

      expect(res.status).toBe(200);
      expect(res.body.detail).toBeDefined();
      const d = res.body.detail;
      expect(d.questionId).toBe('est-add-01');
      expect(d.badge).toBe('VÀNG');
      expect(d.anchorTier).toBe('GOLD_ANCHOR');
      expect(d.isFullyCorrect).toBe(true);
      expect(d.earnedPoints).toBe(10);
      expect(d.expected.exact).toBe(87);
      expect(d.expected.goldAnchor).toBe(90);
      expect(d.feedbackEstimate).toContain('Xuất sắc');
      expect(d.feedbackExact).toContain('Chính xác');
      expect(d.explanation).toBeDefined();
    });
  });
});
