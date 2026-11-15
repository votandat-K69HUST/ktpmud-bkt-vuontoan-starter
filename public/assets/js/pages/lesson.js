/* Trang làm bài chung: Hỗ trợ các dạng câu hỏi cơ bản và dạng câu hỏi mở rộng
 * "Ước lượng trước khi tính đúng" (estimate) với giao diện 2 pha trực quan,
 * bộ đếm ngược 60s độc lập từng câu, gợi ý sau 30s,
 * CHẤM ĐIỂM & TRẢ VỀ ĐÁP ÁN, NHẬN XÉT TỨC THÌ NGAY KHI XONG TỪNG CÂU,
 * phản hồi chi tiết 2 tầng và chuẩn A11y.
 */
(function lessonPlayer() {
  const params = new URLSearchParams(location.search);
  let lessonId = params.get('lesson') || params.get('id');
  let setId = params.get('set');
  if (!setId && (!lessonId || lessonId === 'bai-16')) {
    setId = 'uoc-luong-toan-lop-3';
    lessonId = lessonId || 'bai-16';
  }
  const startedAt = Date.now();
  const answers = {};
  let questions = [];
  let currentActiveIdx = 0;

  const container = document.getElementById('questions-container');
  const progressBar = document.getElementById('lesson-progress');
  const progressText = document.getElementById('lesson-progress-text');

  // Quản lý trạng thái độc lập cho từng câu hỏi dạng estimate
  const estimateStates = {};

  // Hàm làm tròn SGK Lớp 3
  function roundToTen(n) {
    const num = Math.round(Number(n));
    if (isNaN(num) || !isFinite(num)) return 0;
    const u = Math.abs(num) % 10;
    if (u === 0) return num;
    if (u < 5) return num - u;
    return num + (10 - u);
  }

  // Bộ suy luận gợi ý sư phạm tự động dựa trên prompt bài toán
  function getScaffoldingHint(prompt) {
    const m = String(prompt).match(/(\d+)\s*([\+\-\*×x\:\/÷])\s*(\d+)/);
    if (!m) return "Làm tròn các số về tròn chục gần nhất rồi tính nhé! 🐝";

    const n1 = parseInt(m[1], 10);
    const op = m[2];
    const n2 = parseInt(m[3], 10);

    if (op === '+') {
      const r1 = roundToTen(n1);
      const r2 = roundToTen(n2);
      const dir1 = r1 > n1 ? 'lên' : (r1 < n1 ? 'xuống' : 'thành');
      const dir2 = r2 > n2 ? 'lên' : (r2 < n2 ? 'xuống' : 'thành');
      return `Làm tròn ${n1} ${dir1} ${r1}, ${n2} ${dir2} ${r2}. Nhẩm tính: ${r1} + ${r2} = ?`;
    }

    if (op === '-') {
      const r1 = roundToTen(n1);
      const r2 = roundToTen(n2);
      const dir1 = r1 > n1 ? 'lên' : (r1 < n1 ? 'xuống' : 'thành');
      const dir2 = r2 > n2 ? 'lên' : (r2 < n2 ? 'xuống' : 'thành');
      return `Làm tròn ${n1} ${dir1} ${r1}, ${n2} ${dir2} ${r2}. Nhẩm tính: ${r1} - ${r2} = ?`;
    }

    if (op === '*' || op === '×' || op === 'x') {
      const r1 = roundToTen(n1);
      const dir1 = r1 > n1 ? 'lên' : (r1 < n1 ? 'xuống' : 'thành');
      return `Làm tròn ${n1} ${dir1} ${r1}. Nhẩm tính: ${r1} × ${n2} = ?`;
    }

    if (op === ':' || op === '/' || op === '÷') {
      if (n1 % n2 === 0 && n1 <= 81) {
        return `${n1} : ${n2} thuộc bảng chia ${n2}. Em hãy nhẩm kết quả nhé!`;
      }
      let bestRound = Math.round(n1 / (n2 * 10)) * (n2 * 10);
      if (bestRound === 0 || Math.abs(bestRound - n1) > 25) {
        bestRound = roundToTen(n1);
      }
      const dir1 = bestRound > n1 ? 'lên' : (bestRound < n1 ? 'xuống' : 'thành');
      return `Làm tròn ${n1} ${dir1} ${bestRound}. Nhẩm tính: ${bestRound} : ${n2} = ?`;
    }

    return "Làm tròn các số về tròn chục gần nhất rồi tính nhé! 🐝";
  }

  function isQuestionAnswered(q) {
    const a = answers[q.id];
    if (a == null) return false;
    if (q.type === 'estimate') {
      return typeof a === 'object' && (a.estimate != null || a.exact != null || (estimateStates[q.id] && estimateStates[q.id].phase >= 2));
    }
    return String(a).trim() !== '';
  }

  function updateProgress() {
    const done = questions.filter(isQuestionAnswered).length;
    if (progressBar) progressBar.style.width = questions.length ? `${Math.round((done / questions.length) * 100)}%` : '0%';
    if (progressText) progressText.textContent = `Đã hoàn thành ${done}/${questions.length} câu`;
  }

  function syncEstimateAnswer(qId) {
    const state = estimateStates[qId];
    if (!state) return;
    const estVal = state.estimateValue !== null && !isNaN(Number(state.estimateValue)) ? Number(state.estimateValue) : null;
    const exactVal = state.exactValue !== null && !isNaN(Number(state.exactValue)) ? Number(state.exactValue) : null;
    const t1 = Math.max(1, Math.min(60, Number(state.estimateTimeSeconds) || (state.phase === 1 ? (60 - state.timeLeft) : 60)));
    const t2 = Math.max(1, Math.min(60, Number(state.exactTimeSeconds) || (state.phase === 2 ? (60 - state.timeLeft) : 60)));

    answers[qId] = {
      estimate: estVal,
      exact: exactVal,
      estimate_time_seconds: t1,
      exact_time_seconds: t2
    };
  }

  function updateTimerUI(qId) {
    const state = estimateStates[qId];
    if (!state) return;
    const timerBox = document.getElementById(`timer-box-${qId}`);
    if (!timerBox) return;

    const t = Math.max(0, state.timeLeft);
    const phaseLabel = state.phase === 1 ? 'Pha 1 (Nhẩm)' : 'Pha 2 (Tính đúng)';
    const pct = Math.round((t / 60) * 100);

    let colorHex = '#10B981'; // Xanh lá tươi khi còn 31-60s
    let textColorClass = 'text-emerald-700 font-extrabold';

    if (t < 15) {
      colorHex = '#EF4444'; // Đỏ cảnh báo khi dưới 15s
      textColorClass = 'text-rose-600 font-black';
    } else if (t <= 30) {
      colorHex = '#F59E0B'; // Vàng hổ phách khi còn 15-30s
      textColorClass = 'text-amber-700 font-extrabold';
    }

    const secEl = timerBox.querySelector('.timer-sec');
    if (secEl) secEl.textContent = t;

    const labelEl = timerBox.querySelector('.timer-label');
    if (labelEl) {
      labelEl.className = `timer-label text-xs sm:text-base flex items-center gap-1 ${textColorClass}`;
      labelEl.innerHTML = `<span>${phaseLabel}:</span> <span class="timer-sec text-base sm:text-lg font-black">${t}</span>s`;
    }

    const barEl = timerBox.querySelector('.timer-bar');
    if (barEl) {
      barEl.style.width = `${pct}%`;
      barEl.style.backgroundColor = colorHex;
    }

    const iconEl = timerBox.querySelector('.timer-icon');
    if (iconEl) {
      iconEl.style.color = colorHex;
    }

    // Hiệu ứng nhấp nháy đỏ khi dưới 15s
    if (t < 15 && t > 0) {
      timerBox.classList.add('border-rose-400', 'bg-rose-50/90');
      if (!timerBox.classList.contains('animate-pulse')) timerBox.classList.add('animate-pulse');
    } else {
      timerBox.classList.remove('animate-pulse', 'border-rose-400', 'bg-rose-50/90');
    }

    // A11y aria-label
    timerBox.setAttribute('aria-label', `Thời gian còn lại cho ${phaseLabel}: ${t} giây`);

    // GỢI Ý SƯ PHẠM SAU 30S Ở PHA 1 (Nếu học sinh chưa hoàn thành Pha 1 và thời gian còn <= 30s)
    if (state.phase === 1 && t <= 30) {
      const hintBox = document.getElementById(`hint-box-${qId}`);
      if (hintBox && hintBox.classList.contains('hidden')) {
        hintBox.classList.remove('hidden');
        hintBox.classList.add('animate-fade-in');
        const srAnnouncer = document.getElementById(`sr-timer-${qId}`);
        if (srAnnouncer) {
          srAnnouncer.textContent = `Hệ thống vừa mở gợi ý cách làm cho câu hỏi này.`;
        }
      }
    }

    // Thông báo cho screen reader ở các mốc quan trọng (30s, 15s, 5s)
    if (t === 30 || t === 15 || t === 5) {
      const srAnnouncer = document.getElementById(`sr-timer-${qId}`);
      if (srAnnouncer) {
        srAnnouncer.textContent = `Bộ đếm thời gian: ${phaseLabel} còn lại ${t} giây.`;
      }
    }
  }

  function startTimer(qId) {
    const state = estimateStates[qId];
    if (!state || state.timerId || state.phase >= 3) return;
    state.hasStarted = true;
    updateTimerUI(qId);

    state.timerId = setInterval(() => {
      state.timeLeft--;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        clearInterval(state.timerId);
        state.timerId = null;
        updateTimerUI(qId);
        onTimerExpired(qId);
      } else {
        updateTimerUI(qId);
      }
    }, 1000);
  }

  function stopTimer(qId) {
    const state = estimateStates[qId];
    if (state && state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function onTimerExpired(qId) {
    const state = estimateStates[qId];
    if (!state) return;

    if (state.phase === 1) {
      const estInput = container.querySelector(`input[data-q="${qId}"][data-phase="estimate"]`);
      state.estimateValue = estInput && estInput.value.trim() !== '' ? Number(estInput.value) : null;
      state.estimateTimeSeconds = 60;
      transitionToPhase2(qId, true);
    } else if (state.phase === 2) {
      const exactInput = container.querySelector(`input[data-q="${qId}"][data-phase="exact"]`);
      state.exactValue = exactInput && exactInput.value.trim() !== '' ? Number(exactInput.value) : null;
      state.exactTimeSeconds = 60;
      completeEstimateQuestion(qId, true);
    }
  }

  function transitionToPhase2(qId, fromTimeout = false) {
    const state = estimateStates[qId];
    if (!state || state.phase !== 1) return;

    stopTimer(qId);
    if (!fromTimeout) {
      state.estimateTimeSeconds = Math.max(1, 60 - state.timeLeft);
    }

    const estInput = container.querySelector(`input[data-q="${qId}"][data-phase="estimate"]`);
    if (estInput && estInput.value.trim() !== '') {
      state.estimateValue = Number(estInput.value);
    }

    // Khóa ô nhập Pha 1
    if (estInput) {
      estInput.readOnly = true;
      estInput.classList.add('bg-surface-container-high', 'text-on-surface-variant', 'cursor-not-allowed', 'opacity-80');
    }

    const estBtn = container.querySelector(`.btn-confirm-estimate[data-q="${qId}"]`);
    if (estBtn) {
      estBtn.disabled = true;
      estBtn.classList.add('opacity-60', 'cursor-not-allowed');
      estBtn.innerHTML = '<span>Đã xác nhận</span> <span class="material-symbols-outlined text-[20px]">check</span>';
    }

    const phase1Badge = container.querySelector(`#phase-1-badge-${qId}`);
    if (phase1Badge) {
      phase1Badge.textContent = 'Hoàn thành ✓';
      phase1Badge.className = 'text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800';
    }

    // Cập nhật giá trị hiển thị đối chiếu ở Pha 2
    const estDisplay = document.getElementById(`est-display-${qId}`);
    if (estDisplay) {
      estDisplay.textContent = state.estimateValue !== null ? `${state.estimateValue}` : '(Chưa điền)';
      estDisplay.className = state.estimateValue !== null
        ? 'text-primary font-headline-md text-lg sm:text-2xl font-extrabold'
        : 'text-amber-800 font-headline-md text-base italic';
    }

    // Mở khóa khối Pha 2
    const phase2Box = document.getElementById(`phase-2-box-${qId}`);
    if (phase2Box) {
      phase2Box.classList.remove('opacity-40', 'pointer-events-none');
      phase2Box.classList.add('border-secondary/40', 'shadow-sm', 'bg-white');
    }

    const phase2Badge = container.querySelector(`#phase-2-badge-${qId}`);
    if (phase2Badge) {
      phase2Badge.textContent = 'Đang thực hiện';
      phase2Badge.className = 'text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-secondary/15 text-secondary';
    }

    const exactInput = container.querySelector(`input[data-q="${qId}"][data-phase="exact"]`);
    if (exactInput) {
      exactInput.disabled = false;
      exactInput.removeAttribute('disabled');
      // A11y: Tự động focus vào ô tính đúng ở Pha 2
      setTimeout(() => exactInput.focus(), 60);
    }

    const exactBtn = container.querySelector(`.btn-confirm-exact[data-q="${qId}"]`);
    if (exactBtn) {
      exactBtn.disabled = false;
      exactBtn.removeAttribute('disabled');
    }

    // Reset bộ đếm ngược 60s cho Pha 2 của câu này
    state.phase = 2;
    state.timeLeft = 60;
    startTimer(qId);

    syncEstimateAnswer(qId);
    updateProgress();
  }

  async function completeEstimateQuestion(qId, fromTimeout = false) {
    const state = estimateStates[qId];
    if (!state || state.phase !== 2) return;

    stopTimer(qId);
    if (!fromTimeout) {
      state.exactTimeSeconds = Math.max(1, 60 - state.timeLeft);
    }

    const exactInput = container.querySelector(`input[data-q="${qId}"][data-phase="exact"]`);
    if (exactInput && exactInput.value.trim() !== '') {
      state.exactValue = Number(exactInput.value);
    }

    // Khóa ô nhập Pha 2
    if (exactInput) {
      exactInput.readOnly = true;
      exactInput.classList.add('bg-surface-container-high', 'text-on-surface-variant', 'cursor-not-allowed', 'opacity-80');
    }

    const exactBtn = container.querySelector(`.btn-confirm-exact[data-q="${qId}"]`);
    if (exactBtn) {
      exactBtn.disabled = true;
      exactBtn.classList.add('opacity-60', 'cursor-not-allowed');
      exactBtn.innerHTML = '<span>Đã xác nhận</span> <span class="material-symbols-outlined text-[20px]">done_all</span>';
    }

    const phase2Badge = container.querySelector(`#phase-2-badge-${qId}`);
    if (phase2Badge) {
      phase2Badge.textContent = 'Hoàn thành ✓';
      phase2Badge.className = 'text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800';
    }

    // Cập nhật trạng thái hoàn thành câu
    state.phase = 3;

    // Cập nhật Timer Box thành trạng thái hoàn tất
    const timerBox = document.getElementById(`timer-box-${qId}`);
    if (timerBox) {
      timerBox.className = 'flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border-2 border-emerald-300 text-xs sm:text-sm font-extrabold text-emerald-800 shadow-xs';
      timerBox.innerHTML = '<span class="material-symbols-outlined text-[20px] text-emerald-600">task_alt</span> <span>Đã hoàn thành 2 pha</span>';
    }

    // Cập nhật trạng thái câu ở header
    const statusBadge = document.getElementById(`status-badge-${qId}`);
    if (statusBadge) {
      statusBadge.className = 'status-badge text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1';
      statusBadge.innerHTML = '<span class="material-symbols-outlined text-[16px]">check_circle</span> Hoàn thành';
    }

    syncEstimateAnswer(qId);
    updateProgress();

    // CHẤM ĐIỂM & TRẢ VỀ ĐÁP ÁN, NHẬN XÉT TỨC THÌ CHO CÂU NÀY
    await checkAndShowQuestionFeedback(qId);
  }

  function renderQuestionFeedbackCard(qId, d) {
    const feedbackBox = document.getElementById(`feedback-box-${qId}`);
    if (!feedbackBox) return;

    if (d.type === 'estimate') {
      let badgeIcon = '🌱';
      let badgeName = d.badge || 'KHUYẾN KHÍCH';
      let badgeBg = 'bg-emerald-50/90 border-emerald-300 text-emerald-950';

      if (d.anchorTier === 'GOLD_ANCHOR' || d.badge === 'VÀNG') {
        badgeIcon = '🥇';
        badgeName = 'Huy hiệu Vàng';
        badgeBg = 'bg-amber-50/95 border-2 border-amber-300 text-amber-950';
      } else if (d.anchorTier === 'SILVER_ANCHOR' || d.badge === 'BẠC') {
        badgeIcon = '🥈';
        badgeName = 'Huy hiệu Bạc';
        badgeBg = 'bg-slate-100 border-2 border-slate-300 text-slate-900';
      } else if (d.anchorTier === 'EXACT_MATCH_IN_ESTIMATE' || d.anchorTier === 'BOUNDING_ANCHOR' || d.badge === 'ĐỒNG') {
        badgeIcon = '🥉';
        badgeName = 'Huy hiệu Đồng';
        badgeBg = 'bg-orange-50/90 border-2 border-orange-300 text-orange-950';
      } else if (d.anchorTier === 'TOLERANCE_ONLY' || d.badge === 'KHUYẾN KHÍCH') {
        badgeIcon = '🌱';
        badgeName = 'Huy hiệu Khuyến khích';
        badgeBg = 'bg-emerald-50/90 border-2 border-emerald-300 text-emerald-950';
      } else {
        badgeIcon = '✏️';
        badgeName = 'Cần cố gắng';
        badgeBg = 'bg-rose-50 border-2 border-rose-200 text-rose-900';
      }

      const bd = d.scoringBreakdown || {};
      const estBase = bd.estimateBase != null ? bd.estimateBase : 0;
      const estTime = bd.estimateTime != null ? bd.estimateTime : 0;
      const estTot = bd.estimateTotal != null ? bd.estimateTotal : 0;
      const exactBase = bd.exactBase != null ? bd.exactBase : 0;
      const exactTime = bd.exactTime != null ? bd.exactTime : 0;
      const exactTot = bd.exactTotal != null ? bd.exactTotal : 0;
      const earned = d.earnedPoints != null ? d.earnedPoints : (d.correct ? d.maxPoints : 0);

      feedbackBox.classList.remove('hidden');
      feedbackBox.innerHTML = `
        <div class="rounded-3xl p-5 sm:p-6 ${badgeBg} shadow-sm transition-all duration-300 animate-fade-in">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-current/15 pb-4">
            <div class="flex items-center gap-3">
              <span class="text-4xl select-none" aria-hidden="true">${badgeIcon}</span>
              <div>
                <span class="font-headline-sm text-xs sm:text-sm uppercase tracking-wider font-black px-3.5 py-1 rounded-full bg-white/90 border border-current/10 shadow-xs inline-block">${badgeName}</span>
                <p class="font-headline-md text-lg sm:text-2xl mt-1 font-black">Điểm đạt: <strong class="text-primary">${earned}</strong> / ${d.maxPoints || 10} điểm</p>
              </div>
            </div>
            <div class="text-right text-xs sm:text-base font-bold opacity-90 space-y-0.5">
              <div>Pha 1 (Ước lượng): <strong class="text-primary">${estTot}đ</strong> (Đúng: ${estBase}đ + Tốc độ: ${estTime}đ)</div>
              <div>Pha 2 (Tính đúng): <strong class="text-secondary">${exactTot}đ</strong> (Đúng: ${exactBase}đ + Tốc độ: ${exactTime}đ)</div>
            </div>
          </div>

          <!-- ĐỐI CHIẾU ĐÁP ÁN CHÍNH XÁC & ĐIỂM NEO SGK -->
          <div class="mt-4 p-4 rounded-2xl bg-white/95 border border-current/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xl select-none" aria-hidden="true">🎯</span>
              <span class="text-sm sm:text-base text-on-surface font-medium">Kết quả chính xác: <strong class="text-secondary font-black text-base sm:text-lg">${d.expected ? d.expected.exact : ''}</strong></span>
            </div>
            ${d.expected && d.expected.goldAnchor ? `
            <div class="flex items-center gap-2">
              <span class="text-xl select-none" aria-hidden="true">📐</span>
              <span class="text-sm sm:text-base text-on-surface font-medium">Ước lượng chuẩn SGK: <strong class="text-primary font-black text-base sm:text-lg">${d.expected.goldAnchor}</strong></span>
            </div>` : ''}
          </div>

          <div class="mt-3.5 space-y-3 text-sm sm:text-base">
            <div class="p-4 rounded-2xl bg-white/90 border border-current/10 shadow-xs">
              <p class="font-bold flex items-center gap-2 text-primary text-base"><span class="material-symbols-outlined text-[20px]">psychology</span> Nhận xét Pha 1 (Ước lượng):</p>
              <p class="mt-1.5 font-body-md text-on-surface font-medium leading-relaxed">${d.feedbackEstimate || (d.isEstimateOk ? 'Em ước lượng rất tốt!' : 'Em cần rèn luyện thêm kỹ năng làm tròn nhé.')}</p>
            </div>
            <div class="p-4 rounded-2xl bg-white/90 border border-current/10 shadow-xs">
              <p class="font-bold flex items-center gap-2 text-secondary text-base"><span class="material-symbols-outlined text-[20px]">calculate</span> Nhận xét Pha 2 (Tính đúng):</p>
              <p class="mt-1.5 font-body-md text-on-surface font-medium leading-relaxed">${d.feedbackExact || (d.isExactOk ? 'Đáp án chính xác hoàn toàn!' : 'Chưa đúng, em hãy đặt tính cẩn thận ra nháp nhé.')}</p>
            </div>
            ${d.explanation ? `
            <div class="p-4 rounded-2xl bg-amber-50/95 border border-amber-200 text-amber-950 shadow-xs">
              <p class="font-bold flex items-center gap-2 text-amber-900 text-base"><span class="material-symbols-outlined text-[20px]">lightbulb</span> Lời giải &amp; mẹo làm tròn:</p>
              <p class="mt-1.5 font-body-md text-amber-900 font-medium leading-relaxed">${d.explanation}</p>
            </div>` : ''}
          </div>
        </div>
      `;
    } else {
      const isOk = d.correct;
      feedbackBox.classList.remove('hidden');
      feedbackBox.innerHTML = `
        <div class="mt-4 p-4 rounded-2xl border text-base ${isOk ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}">
          <div class="flex items-center gap-2.5 font-bold">
            <span class="material-symbols-outlined text-2xl">${isOk ? 'check_circle' : 'cancel'}</span>
            <span>${isOk ? `Chính xác! Đạt ${d.earnedPoints || d.maxPoints || 10} điểm.` : `Chưa chính xác. Đáp án đúng là: ${d.correctAnswer || ''}`}</span>
          </div>
        </div>
      `;
    }

    feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function checkAndShowQuestionFeedback(qId) {
    const feedbackBox = document.getElementById(`feedback-box-${qId}`);
    if (feedbackBox) {
      feedbackBox.classList.remove('hidden');
      feedbackBox.innerHTML = `
        <div class="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center text-sm font-bold text-on-surface-variant flex items-center justify-center gap-2">
          <span class="material-symbols-outlined animate-spin text-[20px]">sync</span>
          <span>Đang kiểm tra kết quả...</span>
        </div>
      `;
    }

    try {
      const res = await window.MathAPI.post(`/api/questions/${encodeURIComponent(qId)}/check`, {
        answer: answers[qId]
      });

      if (res && res.detail) {
        renderQuestionFeedbackCard(qId, res.detail);
      }
    } catch (err) {
      console.warn('[Check Question Warning]:', err);
      if (feedbackBox) {
        feedbackBox.innerHTML = '';
        feedbackBox.classList.add('hidden');
      }
    } finally {
      // Hiển thị nút điều hướng sang câu tiếp theo
      revealNextTransition(qId);
    }
  }

  function revealNextTransition(qId) {
    const currIdx = questions.findIndex(item => item.id === qId);
    if (currIdx < 0) return;

    if (currIdx < questions.length - 1) {
      const nextBox = document.getElementById(`next-action-${qId}`);
      if (nextBox) {
        nextBox.classList.remove('hidden');
        nextBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } else {
      // Câu cuối cùng -> Hiện hộp hoàn thành & nút dẫn đến Nộp bài
      const finishBox = document.getElementById(`finish-action-${qId}`);
      if (finishBox) {
        finishBox.classList.remove('hidden');
        finishBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  // Mở khóa và kích hoạt câu hỏi tiếp theo KHI HỌC SINH CHỦ ĐỘNG BẤM NÚT
  function activateQuestion(targetIdx) {
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    currentActiveIdx = targetIdx;
    const targetQ = questions[targetIdx];
    const targetCard = container.querySelector(`article[data-q-idx="${targetIdx}"]`);

    if (targetCard) {
      // Mở khóa giao diện card
      targetCard.classList.remove('opacity-40', 'pointer-events-none', 'select-none', 'border-dashed', 'border-2', 'border-slate-300', 'bg-slate-50/60');
      targetCard.classList.add('bg-surface-container-lowest', 'border', 'border-primary/20', 'shadow-[0_8px_24px_rgba(0,97,39,0.08)]');

      const statusBadge = document.getElementById(`status-badge-${targetQ.id}`);
      if (statusBadge) {
        statusBadge.className = 'status-badge text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1';
        statusBadge.innerHTML = '<span class="material-symbols-outlined text-[16px]">play_circle</span> Đang làm';
      }

      // Cuộn mượt đến câu vừa mở
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Bắt đầu tính giờ cho câu này
      if (targetQ.type === 'estimate') {
        const nextState = estimateStates[targetQ.id];
        if (nextState && !nextState.hasStarted) {
          startTimer(targetQ.id);
        }
        const nextInput = container.querySelector(`input[data-q="${targetQ.id}"][data-phase="estimate"]`);
        if (nextInput && !nextInput.readOnly && !nextInput.disabled) {
          setTimeout(() => nextInput.focus(), 150);
        }
      } else {
        const nextInput = container.querySelector(`input[data-q="${targetQ.id}"]`);
        if (nextInput) {
          setTimeout(() => nextInput.focus(), 150);
        }
      }
    }
  }

  function render() {
    container.innerHTML = questions.map((q, idx) => {
      const isFirst = idx === 0;
      const initialLockedClass = isFirst
        ? 'bg-surface-container-lowest border border-primary/20 shadow-[0_8px_24px_rgba(0,97,39,0.08)]'
        : 'opacity-40 pointer-events-none select-none border-dashed border-2 border-slate-300 bg-slate-50/60';

      const initialStatusBadge = isFirst
        ? `<span id="status-badge-${q.id}" class="status-badge text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">play_circle</span> Đang làm
           </span>`
        : `<span id="status-badge-${q.id}" class="status-badge text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-600 flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">lock</span> Chưa mở
           </span>`;

      let body = '';
      if (q.type === 'estimate') {
        const hintText = getScaffoldingHint(q.prompt);

        body = `
          <!-- Thanh trạng thái bộ đếm 60s riêng biệt cho từng câu -->
          <div class="mt-4 flex items-center justify-between flex-wrap gap-2">
            <div id="timer-box-${q.id}" class="flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container border-2 border-outline-variant/40 text-sm sm:text-base shadow-xs transition-all duration-300" role="timer" aria-live="polite" aria-atomic="true" aria-label="Thời gian còn lại cho Pha 1: 60 giây">
              <span class="material-symbols-outlined text-[24px] timer-icon text-emerald-600 transition-colors">timer</span>
              <span class="timer-label text-xs sm:text-base font-extrabold text-emerald-700 flex items-center gap-1">
                <span>Pha 1 (Nhẩm):</span> <span class="timer-sec text-base sm:text-lg font-black">60</span>s
              </span>
              <div class="w-20 sm:w-28 h-2.5 bg-slate-200 rounded-full overflow-hidden ml-1">
                <div class="timer-bar h-full rounded-full transition-all duration-1000" style="width: 100%; background-color: #10B981;"></div>
              </div>
            </div>
            <span id="sr-timer-${q.id}" class="sr-only" aria-live="polite"></span>
          </div>

          <!-- GỢI Ý CÁCH LÀM (Tự động mở khi còn <= 30s) -->
          <div id="hint-box-${q.id}" class="hidden mt-4 p-4 sm:p-5 rounded-2xl bg-amber-50/95 border-2 border-amber-300 text-amber-950 flex items-start gap-3.5 shadow-sm transition-all duration-300" role="region" aria-live="polite">
            <div class="text-3xl select-none" aria-hidden="true">💡</div>
            <div class="flex-1">
              <h4 class="font-headline-sm text-sm sm:text-base font-extrabold text-amber-900">Gợi ý cách làm:</h4>
              <p class="font-body-md text-sm sm:text-base text-amber-900 mt-1 font-semibold leading-relaxed">${hintText}</p>
            </div>
          </div>

          <div class="mt-5 space-y-4">
            <!-- PHA 1: ƯỚC LƯỢNG NHẨM -->
            <div id="phase-1-box-${q.id}" class="phase-1-card rounded-3xl p-5 sm:p-6 bg-surface-container-low border-2 border-primary/25 transition-all duration-300">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="font-headline-sm text-base sm:text-lg font-extrabold text-primary flex items-center gap-2.5">
                  <span class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-sm font-black shadow-xs">1</span>
                  Pha 1: Ước lượng nhẩm (Tối đa 60s • 70% điểm)
                </span>
                <span id="phase-1-badge-${q.id}" class="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">Đang thực hiện</span>
              </div>
              <p class="mt-2 text-xs sm:text-sm font-medium text-on-surface-variant">Làm tròn số về hàng chục (80, 90, 100...) rồi nhẩm kết quả.</p>
              
              <div class="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div class="relative flex-1">
                  <input data-q="${q.id}" data-phase="estimate" type="number" inputmode="numeric" placeholder="Điền số ước lượng..."
                    class="w-full h-16 sm:h-20 px-6 rounded-2xl bg-surface-container-lowest text-primary font-extrabold text-2xl sm:text-3xl text-center tracking-widest border-2 border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary-fixed shadow-inner transition-all placeholder:text-sm sm:placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-on-surface-variant/40" />
                </div>
                <button type="button" data-q="${q.id}" class="btn-confirm-estimate h-16 px-6 sm:px-8 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-extrabold text-base sm:text-lg shadow-[0_4px_0_0_#005320] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer">
                  <span>Xác nhận ước lượng</span>
                  <span class="material-symbols-outlined text-[22px]">arrow_forward</span>
                </button>
              </div>
            </div>

            <!-- PHA 2: ĐẶT TÍNH TÍNH ĐÚNG -->
            <div id="phase-2-box-${q.id}" class="phase-2-card rounded-3xl p-5 sm:p-6 bg-surface-container-low border-2 border-outline-variant/30 opacity-40 pointer-events-none transition-all duration-300">
              <div class="flex items-center justify-between flex-wrap gap-2">
                <span class="font-headline-sm text-base sm:text-lg font-extrabold text-secondary flex items-center gap-2.5">
                  <span class="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center text-sm font-black shadow-xs">2</span>
                  Pha 2: Đặt tính tính đúng (Tối đa 60s • 30% điểm)
                </span>
                <span id="phase-2-badge-${q.id}" class="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant">Chờ pha 1</span>
              </div>
              
              <div class="mt-3 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 text-sm sm:text-base text-on-surface-variant flex items-center gap-3">
                <span class="font-bold">🎯 Ước lượng của em:</span>
                <strong id="est-display-${q.id}" class="text-primary font-headline-md text-lg sm:text-2xl font-black">Chưa nhập</strong>
              </div>
              <p class="mt-2 text-xs sm:text-sm font-medium text-on-surface-variant">Đặt tính ra nháp hoặc tính nhẩm để tìm kết quả chính xác.</p>
              
              <div class="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div class="relative flex-1">
                  <input data-q="${q.id}" data-phase="exact" type="number" inputmode="numeric" placeholder="Điền kết quả chính xác..." disabled
                    class="w-full h-16 sm:h-20 px-6 rounded-2xl bg-surface-container-lowest text-secondary font-extrabold text-2xl sm:text-3xl text-center tracking-widest border-2 border-secondary/40 focus:border-secondary focus:ring-4 focus:ring-secondary-fixed shadow-inner transition-all placeholder:text-sm sm:placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-on-surface-variant/40" />
                </div>
                <button type="button" data-q="${q.id}" class="btn-confirm-exact h-16 px-6 sm:px-8 rounded-2xl bg-secondary hover:bg-secondary-container text-on-secondary font-extrabold text-base sm:text-lg shadow-[0_4px_0_0_#384f72] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer" disabled>
                  <span>Xác nhận kết quả</span>
                  <span class="material-symbols-outlined text-[22px]">check_circle</span>
                </button>
              </div>
            </div>
          </div>

          <!-- HỘP ĐÁP ÁN & NHẬN XÉT TỨC THÌ (HIỂN THỊ NGAY KHI XONG CÂU NÀY) -->
          <div id="feedback-box-${q.id}" class="hidden mt-6 transition-all duration-300"></div>

          <!-- NÚT CHUYỂN CÂU TIẾP THEO -->
          <div id="next-action-${q.id}" class="hidden mt-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none" aria-hidden="true">✅</span>
              <div>
                <h4 class="font-headline-sm text-base sm:text-lg font-extrabold text-emerald-950">Đã hoàn thành Câu ${idx + 1}</h4>
                <p class="font-body-md text-xs sm:text-sm text-emerald-800 mt-0.5 font-medium">Bấm để làm tiếp Câu ${idx + 2}</p>
              </div>
            </div>
            <button type="button" class="btn-start-next-question w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base sm:text-lg shadow-[0_4px_0_0_#065f46] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer" data-next-idx="${idx + 1}">
              <span>Làm Câu ${idx + 2}</span>
              <span class="material-symbols-outlined text-2xl">arrow_forward</span>
            </button>
          </div>

          <!-- HỘP THÔNG BÁO HOÀN THÀNH TOÀN BỘ CÂU (CHỈ HIỆN Ở CÂU CUỐI CÙNG) -->
          <div id="finish-action-${q.id}" class="hidden mt-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none" aria-hidden="true">🎉</span>
              <div>
                <h4 class="font-headline-sm text-base sm:text-lg font-extrabold text-amber-950">Đã hoàn thành tất cả ${questions.length} câu</h4>
                <p class="font-body-md text-xs sm:text-sm text-amber-800 mt-0.5 font-medium">Bấm nút bên cạnh để nộp bài và xem kết quả</p>
              </div>
            </div>
            <button type="button" class="btn-jump-submit w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-extrabold text-base sm:text-lg shadow-[0_4px_0_0_#005320] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer">
              <span>Đến Nộp Bài</span>
              <span class="material-symbols-outlined text-2xl">arrow_downward</span>
            </button>
          </div>
        `;
      } else if (q.type === 'multiple-choice' && q.options) {
        body = `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">${q.options.map((op, i) => `
            <button type="button" data-q="${q.id}" data-val="${['A', 'B', 'C', 'D'][i]}" class="opt-btn text-left px-5 py-4 rounded-2xl bg-surface-container-low hover:bg-secondary-container/60 font-body-md text-base sm:text-lg transition-all focus:outline-none focus:ring-4 focus:ring-primary-fixed">
              <strong class="text-primary text-lg">${['A', 'B', 'C', 'D'][i]}.</strong> ${op}</button>`).join('')}</div>
          <div id="feedback-box-${q.id}" class="hidden mt-6 transition-all duration-300"></div>
          <div id="next-action-${q.id}" class="hidden mt-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none" aria-hidden="true">✅</span>
              <div>
                <h4 class="font-headline-sm text-base sm:text-lg font-extrabold text-emerald-950">Đã hoàn thành Câu ${idx + 1}</h4>
                <p class="font-body-md text-xs sm:text-sm text-emerald-800 mt-0.5 font-medium">Bấm để làm tiếp Câu ${idx + 2}</p>
              </div>
            </div>
            <button type="button" class="btn-start-next-question w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base sm:text-lg shadow-[0_4px_0_0_#065f46] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer" data-next-idx="${idx + 1}">
              <span>Làm Câu ${idx + 2}</span>
              <span class="material-symbols-outlined text-2xl">arrow_forward</span>
            </button>
          </div>
        `;
      } else if (q.type === 'paint') {
        body = `
          <div class="flex gap-3 mt-4">
            <button type="button" data-q="${q.id}" data-val="green" class="opt-btn px-6 py-4 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-headline-sm text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-primary-fixed">Tô Xanh lá</button>
            <button type="button" data-q="${q.id}" data-val="yellow" class="opt-btn px-6 py-4 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed font-headline-sm text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-primary-fixed">Tô Vàng</button>
          </div>
          <p class="mt-2 text-xs sm:text-sm text-on-surface-variant font-medium">Chọn màu đúng theo kết quả của phép tính.</p>
          <div id="feedback-box-${q.id}" class="hidden mt-6 transition-all duration-300"></div>
          <div id="next-action-${q.id}" class="hidden mt-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none" aria-hidden="true">✅</span>
              <div>
                <h4 class="font-headline-sm text-base sm:text-lg font-extrabold text-emerald-950">Đã hoàn thành Câu ${idx + 1}</h4>
                <p class="font-body-md text-xs sm:text-sm text-emerald-800 mt-0.5 font-medium">Bấm để làm tiếp Câu ${idx + 2}</p>
              </div>
            </div>
            <button type="button" class="btn-start-next-question w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base sm:text-lg shadow-[0_4px_0_0_#065f46] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer" data-next-idx="${idx + 1}">
              <span>Làm Câu ${idx + 2}</span>
              <span class="material-symbols-outlined text-2xl">arrow_forward</span>
            </button>
          </div>
        `;
      } else if (q.type === 'compare') {
        body = `
          <div class="flex gap-3 mt-4">${['>', '<', '='].map(s => `
            <button type="button" data-q="${q.id}" data-val="${s}" class="opt-btn w-16 h-16 rounded-2xl bg-surface-container-low font-headline-lg text-2xl font-black text-primary focus:outline-none focus:ring-4 focus:ring-primary-fixed">${s}</button>`).join('')}</div>
          <div id="feedback-box-${q.id}" class="hidden mt-6 transition-all duration-300"></div>
          <div id="next-action-${q.id}" class="hidden mt-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none" aria-hidden="true">✅</span>
              <div>
                <h4 class="font-headline-sm text-base sm:text-lg font-extrabold text-emerald-950">Đã hoàn thành Câu ${idx + 1}</h4>
                <p class="font-body-md text-xs sm:text-sm text-emerald-800 mt-0.5 font-medium">Bấm để làm tiếp Câu ${idx + 2}</p>
              </div>
            </div>
            <button type="button" class="btn-start-next-question w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base sm:text-lg shadow-[0_4px_0_0_#065f46] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer" data-next-idx="${idx + 1}">
              <span>Làm Câu ${idx + 2}</span>
              <span class="material-symbols-outlined text-2xl">arrow_forward</span>
            </button>
          </div>
        `;
      } else {
        body = `
          <input data-q="${q.id}" type="text" inputmode="numeric" placeholder="Điền đáp số..." class="mt-4 w-64 h-16 text-center rounded-2xl bg-surface-container-low text-primary font-headline-lg text-2xl font-black focus:outline-none focus:ring-4 focus:ring-primary-fixed border-2 border-outline-variant/40"/>
          <div id="feedback-box-${q.id}" class="hidden mt-6 transition-all duration-300"></div>
          <div id="next-action-${q.id}" class="hidden mt-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div class="flex items-center gap-3">
              <span class="text-3xl select-none" aria-hidden="true">✅</span>
              <div>
                <h4 class="font-headline-sm text-base sm:text-lg font-extrabold text-emerald-950">Đã hoàn thành Câu ${idx + 1}</h4>
                <p class="font-body-md text-xs sm:text-sm text-emerald-800 mt-0.5 font-medium">Bấm để làm tiếp Câu ${idx + 2}</p>
              </div>
            </div>
            <button type="button" class="btn-start-next-question w-full sm:w-auto h-14 sm:h-16 px-6 sm:px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base sm:text-lg shadow-[0_4px_0_0_#065f46] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer" data-next-idx="${idx + 1}">
              <span>Làm Câu ${idx + 2}</span>
              <span class="material-symbols-outlined text-2xl">arrow_forward</span>
            </button>
          </div>
        `;
      }

      return `<article class="rounded-3xl p-6 sm:p-8 transition-all duration-300 ${initialLockedClass}" data-q-idx="${idx}" data-q-id="${q.id}">
        <div class="flex items-center justify-between flex-wrap gap-2">
          <p class="font-label-sm text-xs sm:text-sm text-tertiary font-extrabold uppercase tracking-wide">Câu ${idx + 1} / ${questions.length} • ${q.points} điểm${q.category ? ' • ' + q.category : ''}</p>
          ${initialStatusBadge}
        </div>
        
        <!-- Khung phép tính nổi bật, chữ cực to, rõ ràng cho học sinh lớp 3 -->
        <div class="my-3 p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 flex items-center justify-between">
          <div>
            <span class="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider">Phép tính:</span>
            <h3 class="text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-wide mt-1">${q.prompt}</h3>
          </div>
          <div class="hidden sm:block text-4xl select-none" aria-hidden="true">📐</div>
        </div>

        ${body}
      </article>`;
    }).join('');

    // Khởi tạo state độc lập cho từng câu hỏi estimate
    questions.forEach(q => {
      if (q.type === 'estimate') {
        estimateStates[q.id] = {
          phase: 1,
          timeLeft: 60,
          timerId: null,
          estimateValue: null,
          exactValue: null,
          estimateTimeSeconds: 60,
          exactTimeSeconds: 60,
          hasStarted: false
        };
        syncEstimateAnswer(q.id);
      }
    });

    // CHỈ TỰ ĐỘNG KÍCH HOẠT DUY NHẤT CÂU ĐẦU TIÊN (Câu 0)
    if (questions.length > 0 && questions[0].type === 'estimate') {
      setTimeout(() => {
        startTimer(questions[0].id);
        const firstInp = container.querySelector(`input[data-q="${questions[0].id}"][data-phase="estimate"]`);
        if (firstInp) firstInp.focus();
      }, 350);
    }

    // Gắn sự kiện cho nút "Làm Câu tiếp theo"
    container.querySelectorAll('.btn-start-next-question').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nextIdx = parseInt(btn.dataset.nextIdx, 10);
        btn.disabled = true;
        btn.classList.add('opacity-60', 'cursor-not-allowed');
        activateQuestion(nextIdx);
      });
    });

    // Gắn sự kiện cho nút nhảy xuống Nộp bài
    container.querySelectorAll('.btn-jump-submit').forEach(btn => {
      btn.addEventListener('click', () => {
        const submitBtn = document.getElementById('btn-submit-lesson');
        if (submitBtn) {
          submitBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          submitBtn.focus();
          submitBtn.classList.add('ring-4', 'ring-amber-400');
          setTimeout(() => submitBtn.classList.remove('ring-4', 'ring-amber-400'), 2000);
        }
      });
    });

    // Gắn sự kiện cho các câu hỏi truyền thống: opt-btn
    container.querySelectorAll('.opt-btn').forEach(btn => btn.addEventListener('click', async () => {
      const qId = btn.dataset.q;
      answers[qId] = btn.dataset.val;
      container.querySelectorAll(`.opt-btn[data-q="${qId}"]`).forEach(b =>
        b.classList.toggle('ring-4', b === btn));
      if (btn.dataset.val) container.querySelectorAll(`.opt-btn[data-q="${qId}"]`).forEach(b =>
        b.classList.toggle('ring-primary-fixed-dim', b === btn));
      updateProgress();

      // Chấm ngay câu hỏi truyền thống
      await checkAndShowQuestionFeedback(qId);
    }));

    // Gắn sự kiện cho các ô input thường (không thuộc câu estimate)
    container.querySelectorAll('input[data-q]:not([data-phase])').forEach(inp => {
      inp.addEventListener('input', () => {
        answers[inp.dataset.q] = inp.value.trim();
        updateProgress();
      });
      inp.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const qId = inp.dataset.q;
          inp.readOnly = true;
          await checkAndShowQuestionFeedback(qId);
        }
      });
    });

    // Gắn sự kiện cho các câu hỏi estimate
    questions.filter(q => q.type === 'estimate').forEach(q => {
      const qId = q.id;

      // Xử lý Pha 1
      const estInput = container.querySelector(`input[data-q="${qId}"][data-phase="estimate"]`);
      const estBtn = container.querySelector(`.btn-confirm-estimate[data-q="${qId}"]`);

      if (estInput) {
        estInput.addEventListener('input', () => {
          const st = estimateStates[qId];
          if (st) {
            st.estimateValue = estInput.value.trim() !== '' ? Number(estInput.value) : null;
            syncEstimateAnswer(qId);
            updateProgress();
          }
        });

        // A11y: Bấm Enter ở Pha 1 chuyển ngay sang Pha 2 và tự động focus vào ô tính đúng
        estInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            transitionToPhase2(qId);
          }
        });
      }

      if (estBtn) {
        estBtn.addEventListener('click', () => {
          transitionToPhase2(qId);
        });
      }

      // Xử lý Pha 2
      const exactInput = container.querySelector(`input[data-q="${qId}"][data-phase="exact"]`);
      const exactBtn = container.querySelector(`.btn-confirm-exact[data-q="${qId}"]`);

      if (exactInput) {
        exactInput.addEventListener('input', () => {
          const st = estimateStates[qId];
          if (st) {
            st.exactValue = exactInput.value.trim() !== '' ? Number(exactInput.value) : null;
            syncEstimateAnswer(qId);
            updateProgress();
          }
        });

        // A11y: Bấm Enter ở Pha 2 xác nhận và hiện đáp án & nhận xét tức thì
        exactInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            completeEstimateQuestion(qId);
          }
        });
      }

      if (exactBtn) {
        exactBtn.addEventListener('click', () => {
          completeEstimateQuestion(qId);
        });
      }
    });

    updateProgress();
  }

  function renderDetailedFeedback(detailList) {
    if (!Array.isArray(detailList)) return;
    const detailMap = {};
    detailList.forEach(d => {
      detailMap[d.questionId] = d;
    });

    questions.forEach((q, idx) => {
      const article = container.querySelector(`article[data-q-idx="${idx}"]`);
      if (!article) return;
      const d = detailMap[q.id];
      if (!d) return;

      // Đảm bảo mở khóa card để xem lại kết quả
      article.classList.remove('opacity-40', 'pointer-events-none', 'select-none', 'border-dashed');

      // Render vào feedback box tương ứng nếu chưa có
      renderQuestionFeedbackCard(q.id, d);
    });

    // Khóa toàn bộ input và nút làm bài sau khi nộp
    container.querySelectorAll('input').forEach(inp => { inp.disabled = true; });
    container.querySelectorAll('button:not([data-nav])').forEach(btn => { btn.disabled = true; });
  }

  async function init() {
    try {
      if (lessonId) {
        const { lessons } = await window.MathAPI.get('/api/lessons');
        const lesson = (lessons || []).find(l => l.id === lessonId);
        if (lesson) {
          document.getElementById('lesson-title').textContent = `Bài ${lesson.number}: ${lesson.title}`;
          document.getElementById('lesson-desc').textContent = lesson.description || '';
          if (!setId && lesson.questionSets && lesson.questionSets.length) {
            const estSet = lesson.questionSets.find(s => s.id === 'uoc-luong-toan-lop-3') || lesson.questionSets[0];
            setId = estSet.id;
          }
        }
      }
      if (!setId) {
        setId = 'uoc-luong-toan-lop-3';
      }
      const data = await window.MathAPI.get(`/api/question-sets/${encodeURIComponent(setId)}/questions`);
      questions = data.questions;
      document.getElementById('set-kind').textContent = `Bộ bài: ${setId} • ${questions.length} câu`;
      render();
    } catch (err) {
      container.innerHTML = `<p class="font-body-md text-rose-600 font-bold p-4">Chưa tải được bài: ${err.message}</p>`;
    }
  }

  document.getElementById('btn-submit-lesson').addEventListener('click', async () => {
    // Trước khi submit: Dừng mọi timer và đồng bộ câu hỏi estimate
    questions.forEach(q => {
      if (q.type === 'estimate') {
        stopTimer(q.id);
        const state = estimateStates[q.id];
        if (state) {
          const estInput = container.querySelector(`input[data-q="${q.id}"][data-phase="estimate"]`);
          const exactInput = container.querySelector(`input[data-q="${q.id}"][data-phase="exact"]`);
          if (estInput && estInput.value.trim() !== '') state.estimateValue = Number(estInput.value);
          if (exactInput && exactInput.value.trim() !== '') state.exactValue = Number(exactInput.value);
          if (state.phase === 1) state.estimateTimeSeconds = Math.max(1, 60 - state.timeLeft);
          if (state.phase === 2) state.exactTimeSeconds = Math.max(1, 60 - state.timeLeft);
          syncEstimateAnswer(q.id);
        }
      }
    });

    const missing = questions.filter(q => !isQuestionAnswered(q)).length;
    if (missing > 0 && !confirm(`Em còn ${missing} câu chưa hoàn thành. Vẫn nộp bài nhé?`)) return;

    const submitBtn = document.getElementById('btn-submit-lesson');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[24px]">sync</span> Đang chấm điểm...';

    try {
      const r = await window.MathAPI.post('/api/submissions', {
        setId,
        answers,
        durationSec: Math.round((Date.now() - startedAt) / 1000)
      });

      const box = document.getElementById('lesson-result');
      box.classList.remove('hidden');
      box.innerHTML = `
        <div class="text-5xl mb-2">${r.scorePercent >= 80 ? '🎉' : r.scorePercent >= 50 ? '💪' : '🌱'}</div>
        <h3 class="font-headline-md text-2xl sm:text-3xl font-black">Em đạt ${r.scorePercent}% — đúng ${r.correctCount}/${r.totalCount} câu!</h3>
        <p class="font-body-md text-base sm:text-lg mt-2">${r.starsEarned ? `Nhận thêm ⭐ +${r.starsEarned} Sao vàng.` : 'Điểm chưa vượt lần tốt nhất nên chưa cộng thêm sao.'} Kết quả đã được lưu vào hồ sơ.</p>
      `;

      submitBtn.innerHTML = '<span class="material-symbols-outlined text-2xl">verified</span> Đã hoàn thành bài thi';

      // Render Detailed Feedback Card cho từng câu hỏi
      if (r.detail) {
        renderDetailedFeedback(r.detail);
      }

      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="material-symbols-outlined text-2xl">verified</span> Nộp Bài &amp; Chấm Điểm';
      alert(`Chưa nộp được bài: ${err.message}`);
    }
  });

  document.addEventListener('mathapp:user-ready', init);
})();
