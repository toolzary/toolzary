/**
 * Exam Countdown - Complete Implementation
 * Real-time countdown with history, colors, and restore
 * Integrates with Toolzary template
 */
// ============================================================
// 2. CORE VARIABLES
// ============================================================

let countdownInterval = null;
let currentColor = '#4f46e5';
let isRunning = false;
let elementCache = {};

// ============================================================
// 3. HELPER FUNCTIONS
// ============================================================

function getCachedElement(id) {
  if (!elementCache[id]) {
    elementCache[id] = document.getElementById(id);
  }
  return elementCache[id];
}

function showError(message) {
  const errorBox = getCachedElement('toolLocalError');
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
  setTimeout(() => errorBox.classList.add('hidden'), 4000);
}

function showSuccess(message) {
  const errorBox = getCachedElement('toolLocalError');
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
  errorBox.style.background = 'rgba(34, 197, 94, 0.1)';
  errorBox.style.color = '#22c55e';
  errorBox.style.borderColor = 'rgba(34, 197, 94, 0.2)';
  setTimeout(() => {
    errorBox.classList.add('hidden');
    errorBox.style.background = '';
    errorBox.style.color = '';
    errorBox.style.borderColor = '';
  }, 2000);
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ============================================================
// 4. COUNTDOWN FUNCTIONS
// ============================================================

function startCountdown() {
  const examNameInput = getCachedElement('examName');
  const examDateInput = getCachedElement('examDate');
  
  const examName = examNameInput.value.trim() || 'Exam';
  const examDate = new Date(examDateInput.value);

  if (!examDateInput.value) {
    showError('Please select an exam date and time.');
    return;
  }

  if (isNaN(examDate.getTime())) {
    showError('Please enter a valid date.');
    return;
  }

  // ✅ CHECK: Exam date cannot be in the past
  const now = new Date();
  if (examDate < now) {
    showError('❌ Exam date cannot be in the past. Please select a future date.');
    return;
  }

  // Stop any existing countdown
  stopCountdown();

  // Show countdown box
  const countdownBox = getCachedElement('countdownDisplay');
  if (countdownBox) countdownBox.classList.remove('hidden');

  // Update header
  const displayName = getCachedElement('displayExamName');
  const displayDate = getCachedElement('displayExamDate');
  if (displayName) displayName.textContent = examName;
  if (displayDate) displayDate.textContent = formatDate(examDate);

  // Apply color
  applyColor(currentColor);

  // Start the countdown
  isRunning = true;
  updateCountdown(examName, examDate);

  // Save to history
  saveHistory({
    name: examName,
    date: examDate.toISOString(),
    color: currentColor,
    timestamp: new Date().toISOString()
  });

  // ✅ SCROLL TO COUNTDOWN
  setTimeout(function() {
    const countdownBox = getCachedElement('countdownDisplay');
    if (countdownBox) {
      countdownBox.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, 150);

  showSuccess(`⏳ Countdown started for "${examName}"!`);
}

function updateCountdown(name, targetDate) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  function tick() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      // Countdown finished
      const daysEl = getCachedElement('countdownDays');
      const hoursEl = getCachedElement('countdownHours');
      const minutesEl = getCachedElement('countdownMinutes');
      const secondsEl = getCachedElement('countdownSeconds');
      const statusEl = getCachedElement('countdownStatus');

      if (daysEl) daysEl.textContent = '0';
      if (hoursEl) hoursEl.textContent = '0';
      if (minutesEl) minutesEl.textContent = '0';
      if (secondsEl) secondsEl.textContent = '0';

      if (statusEl) {
        statusEl.textContent = '🎉 Exam Day! Good luck! 🎉';
        statusEl.className = 'countdown-status done';
      }

      clearInterval(countdownInterval);
      countdownInterval = null;
      isRunning = false;
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = getCachedElement('countdownDays');
    const hoursEl = getCachedElement('countdownHours');
    const minutesEl = getCachedElement('countdownMinutes');
    const secondsEl = getCachedElement('countdownSeconds');
    const statusEl = getCachedElement('countdownStatus');

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;

    // Update status
    if (statusEl) {
      if (days < 3) {
        statusEl.textContent = '⚠️ Exam is approaching! Stay focused!';
        statusEl.className = 'countdown-status urgent';
      } else if (days < 7) {
        statusEl.textContent = '📚 One week to go! Keep studying!';
        statusEl.className = 'countdown-status';
      } else if (days < 30) {
        statusEl.textContent = '📖 You have time, but don\'t procrastinate!';
        statusEl.className = 'countdown-status';
      } else {
        statusEl.textContent = '⏳ Time Remaining';
        statusEl.className = 'countdown-status';
      }
    }

    // Add danger class to numbers when close
    if (days < 3) {
      if (daysEl) daysEl.classList.add('danger');
      if (hoursEl) hoursEl.classList.add('danger');
      if (minutesEl) minutesEl.classList.add('danger');
      if (secondsEl) secondsEl.classList.add('danger');
    } else {
      if (daysEl) daysEl.classList.remove('danger');
      if (hoursEl) hoursEl.classList.remove('danger');
      if (minutesEl) minutesEl.classList.remove('danger');
      if (secondsEl) secondsEl.classList.remove('danger');
    }
  }

  tick();
  countdownInterval = setInterval(tick, 1000);
}

function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  isRunning = false;
  showSuccess('⏹️ Countdown stopped.');
}

function clearCountdown() {
  stopCountdown();
  const countdownBox = getCachedElement('countdownDisplay');
  if (countdownBox) countdownBox.classList.add('hidden');

  const daysEl = getCachedElement('countdownDays');
  const hoursEl = getCachedElement('countdownHours');
  const minutesEl = getCachedElement('countdownMinutes');
  const secondsEl = getCachedElement('countdownSeconds');

  if (daysEl) daysEl.textContent = '0';
  if (hoursEl) hoursEl.textContent = '0';
  if (minutesEl) minutesEl.textContent = '0';
  if (secondsEl) secondsEl.textContent = '0';

  const statusEl = getCachedElement('countdownStatus');
  if (statusEl) {
    statusEl.textContent = '⏳ Time Remaining';
    statusEl.className = 'countdown-status';
  }

  showSuccess('🧹 Countdown cleared.');
}

function applyColor(color) {
  currentColor = color;
  const numbers = document.querySelectorAll('.countdown-number');
  const examName = getCachedElement('displayExamName');
  
  numbers.forEach(el => {
    el.style.color = color;
  });
  
  if (examName) {
    examName.style.color = color;
  }
}

// ============================================================
// 5. HISTORY MANAGEMENT
// ============================================================

function getHistory() {
  try {
    const data = localStorage.getItem('examHistory');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveHistory(entry) {
  const history = getHistory();
  history.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...entry
  });
  if (history.length > 50) history.length = 50;
  localStorage.setItem('examHistory', JSON.stringify(history));
  renderHistory();
}

function clearHistory() {
  localStorage.removeItem('examHistory');
  renderHistory();
}

function deleteHistoryItem(id) {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem('examHistory', JSON.stringify(filtered));
  renderHistory();
}

function restoreHistoryItem(id) {
  const history = getHistory();
  const item = history.find(h => h.id === id);
  if (item) {
    const examNameInput = getCachedElement('examName');
    const examDateInput = getCachedElement('examDate');
    
    if (examNameInput) examNameInput.value = item.name;
    if (examDateInput) {
      const date = new Date(item.date);
      examDateInput.value = date.toISOString().slice(0, 16);
    }
    
    // Set color
    if (item.color) {
      currentColor = item.color;
      document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === item.color) {
          btn.classList.add('active');
        }
      });
    }
    
    startCountdown();
    showSuccess(`Restored "${item.name}" countdown!`);
  }
}

function renderHistory() {
  const list = getCachedElement('historyList');
  if (!list) return;

  const history = getHistory();

  if (history.length === 0) {
    list.innerHTML = '<p class="empty-history">No countdown history yet.</p>';
    return;
  }

  list.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="history-item-info">
        <span class="history-item-name" style="color: ${item.color || '#4f46e5'};">${item.name}</span>
        <span class="history-item-date">${new Date(item.date).toLocaleDateString()}</span>
        <span class="history-item-time">${new Date(item.timestamp).toLocaleString()}</span>
      </div>
      <div>
        <button class="history-btn" onclick="restoreHistoryItemUI(${item.id})">↻ Restore</button>
        <button class="history-btn danger" onclick="deleteHistoryItemUI(${item.id})">✕</button>
      </div>
    </div>
  `).join('');
}

window.restoreHistoryItemUI = function(id) {
  restoreHistoryItem(id);
};

window.deleteHistoryItemUI = function(id) {
  deleteHistoryItem(id);
};

// ============================================================
// 6. TOOL INITIALIZATION
// ============================================================

function initTool() {
  const startBtn = getCachedElement('startBtn');
  const stopBtn = getCachedElement('stopBtn');
  const clearBtn = getCachedElement('clearBtn');
  const historyToggleBtn = getCachedElement('historyToggleBtn');
  const clearHistoryBtn = getCachedElement('clearHistoryBtn');
  const historySection = getCachedElement('historySection');
  const colorBtns = document.querySelectorAll('.color-btn');
  const examDateInput = getCachedElement('examDate');

  let historyVisible = false;

  // ===== Set default date to 7 days from now =====
  if (examDateInput) {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    examDateInput.value = defaultDate.toISOString().slice(0, 16);
    
    // ✅ Prevent past dates
    const now = new Date();
    const localDateTime = now.toISOString().slice(0, 16);
    examDateInput.setAttribute('min', localDateTime);
  }

  // ===== Color Selection =====

  colorBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      colorBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentColor = this.dataset.color;
      
      if (isRunning) {
        applyColor(currentColor);
      }
    });
  });

  // ===== Start Button =====

  if (startBtn) {
    startBtn.addEventListener('click', startCountdown);
  }

  // ===== Stop Button =====

  if (stopBtn) {
    stopBtn.addEventListener('click', stopCountdown);
  }

  // ===== Clear Button =====

  if (clearBtn) {
    clearBtn.addEventListener('click', clearCountdown);
  }

  // ===== Enter Key Support =====

  document.querySelectorAll('.data-input-field').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        startCountdown();
      }
    });
  });

  // ===== History =====

  if (historyToggleBtn) {
    historyToggleBtn.addEventListener('click', () => {
      historyVisible = !historyVisible;
      if (historySection) {
        historySection.classList.toggle('hidden');
      }
      if (historyVisible) {
        renderHistory();
        setTimeout(() => {
          historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  }

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all history?')) {
        clearHistory();
        showSuccess('History cleared!');
      }
    });
  }

  // ===== Initialize =====

  renderHistory();

  console.log('[Exam Countdown] ✅ Initialized successfully!');
}
// ============================================================
// 12. SELF-TEST
// ============================================================

function runSelfTest() {
  let passed = true;

  // Test history functions
  const history = getHistory();
  if (!Array.isArray(history)) {
    console.error('[Self-Test] Failed: History should be an array');
    passed = false;
  }

  // Test date formatting
  const testDate = new Date(2024, 11, 25);
  const formatted = formatDate(testDate);
  if (!formatted.includes('December')) {
    console.error('[Self-Test] Failed: Date formatting');
    passed = false;
  }

  if (passed) {
    console.log('[Exam Countdown] ✅ All self-tests passed!');
  } else {
    console.warn('[Exam Countdown] ⚠️ Some self-tests failed.');
  }

  return passed;
}

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // The root app.js automatically handles:
  // - Tool icon & category setup
  // - Related tools rendering (using JSON data)
  // - Search hijacking
  // - Year in footer
  
  // We just need to initialize our tool's specific logic
  initTool();
  runSelfTest();
});



















