/**
 * Case Converter - Complete Implementation
 * Convert text between different cases with history
 * Integrates with Toolzary template
 */
// ============================================================
// 2. CASE CONVERSION FUNCTIONS
// ============================================================

function toUpperCase(text) {
  return text.toUpperCase();
}

function toLowerCase(text) {
  return text.toLowerCase();
}

function toTitleCase(text) {
  if (!text) return text;
  return text.replace(/\w\S*/g, function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function toSentenceCase(text) {
  if (!text) return text;
  return text.replace(/(^\s*\w|[.!?]\s*\w)/g, function(match) {
    return match.toUpperCase();
  });
}

function toCapitalize(text) {
  if (!text) return text;
  return text.split(' ').map(word => {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function toAlternating(text) {
  if (!text) return text;
  let result = '';
  let count = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-zA-Z]/)) {
      result += count % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
      count++;
    } else {
      result += char;
    }
  }
  return result;
}

// ============================================================
// 3. UI UPDATE FUNCTIONS
// ============================================================

let elementCache = {};

function getCachedElement(id) {
  if (!elementCache[id]) {
    elementCache[id] = document.getElementById(id);
  }
  return elementCache[id];
}

function updateLiveStats(text) {
  const liveChar = getCachedElement('liveCharCount');
  const liveWord = getCachedElement('liveWordCount');
  
  if (liveChar) liveChar.textContent = `Characters: ${text.length.toLocaleString()}`;
  if (liveWord) {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    liveWord.textContent = `Words: ${words.toLocaleString()}`;
  }
}

function showError(message) {
  const errorBox = getCachedElement('toolLocalError');
  if (!errorBox) return;
  
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
  errorBox.style.background = 'rgba(239, 68, 68, 0.1)';
  errorBox.style.color = '#ef4444';
  errorBox.style.borderColor = 'rgba(239, 68, 68, 0.2)';
  
  setTimeout(() => {
    errorBox.classList.add('hidden');
  }, 4000);
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
  }, 2000);
}

function displayResult(text) {
  const output = getCachedElement('convertedOutput');
  const resultBox = getCachedElement('caseResultBox');
  
  if (!output) return;
  
  output.textContent = text;
  if (resultBox) {
    resultBox.classList.remove('hidden');
    // Scroll to results
    setTimeout(() => {
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }
}

// ============================================================
// 4. HISTORY MANAGEMENT
// ============================================================

function getHistory() {
  try {
    const data = localStorage.getItem('caseHistory');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveHistoryItem(entry) {
  const history = getHistory();
  history.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...entry
  });
  if (history.length > 50) history.length = 50;
  localStorage.setItem('caseHistory', JSON.stringify(history));
  renderHistory();
}

function clearHistory() {
  localStorage.removeItem('caseHistory');
  renderHistory();
}

function deleteHistoryItem(id) {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem('caseHistory', JSON.stringify(filtered));
  renderHistory();
}

function renderHistory() {
  const list = getCachedElement('historyList');
  if (!list) return;
  
  const history = getHistory();
  
  if (history.length === 0) {
    list.innerHTML = '<p class="empty-history">No conversion history yet.</p>';
    return;
  }
  
  list.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="history-item-info">
        <span class="history-item-type">${item.caseType}</span>
        <span class="history-item-preview">${escapeHtml(item.preview)}</span>
        <span class="history-item-time">${new Date(item.timestamp).toLocaleString()}</span>
      </div>
      <div>
        <button class="history-btn" onclick="restoreHistoryItem(${item.id})">↻ Restore</button>
        <button class="history-btn danger" onclick="deleteHistoryItemUI(${item.id})">✕</button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Global functions for history buttons
window.restoreHistoryItem = function(id) {
  const history = getHistory();
  const item = history.find(h => h.id === id);
  if (item) {
    const textarea = getCachedElement('textInput');
    if (textarea) {
      textarea.value = item.originalText;
      updateLiveStats(item.originalText);
      // Convert and display
      const caseType = item.caseType;
      const convertMap = {
        'UPPER CASE': toUpperCase,
        'lower case': toLowerCase,
        'Title Case': toTitleCase,
        'Sentence case': toSentenceCase,
        'Capitalize': toCapitalize,
        'Alternating': toAlternating
      };
      const converter = convertMap[caseType] || toUpperCase;
      const result = converter(item.originalText);
      displayResult(result);
      showSuccess(`Restored ${caseType} conversion`);
    }
  }
};

window.deleteHistoryItemUI = function(id) {
  deleteHistoryItem(id);
};

// ============================================================
// 5. AUTO-EXPAND TEXTAREA
// ============================================================

function autoExpandTextarea() {
  const textarea = getCachedElement('textInput');
  if (!textarea) return;
  
  requestAnimationFrame(() => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 350) + 'px';
  });
}

// ============================================================
// 6. MAIN TOOL INITIALIZATION
// ============================================================

function initTool() {
  const textarea = getCachedElement('textInput');
  const clearBtn = getCachedElement('clearBtn');
  const sampleBtn = getCachedElement('sampleBtn');
  const copyBtn = getCachedElement('copyBtn');
  const historyToggleBtn = getCachedElement('historyToggleBtn');
  const clearHistoryBtn = getCachedElement('clearHistoryBtn');
  const caseBtns = document.querySelectorAll('.case-btn');
  const errorBox = getCachedElement('toolLocalError');
  const historySection = getCachedElement('historySection');

  if (!textarea) {
    console.error('[Case Converter] Textarea not found');
    return;
  }

  let historyVisible = false;

  // ===== Case Conversion =====

  function convertText(caseType, converter) {
    const text = textarea.value;
    if (!text || text.trim().length === 0) {
      showError('Please enter some text to convert.');
      return;
    }
    
    const result = converter(text);
    displayResult(result);
    
    // Save to history
    const preview = text.length > 50 ? text.substring(0, 50) + '...' : text;
    saveHistoryItem({
      caseType: caseType,
      originalText: text,
      preview: preview
    });
    
    showSuccess(`Converted to ${caseType}`);
  }

  // Case button click handlers
  caseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const caseType = this.dataset.case;
      const convertMap = {
        'uppercase': toUpperCase,
        'lowercase': toLowerCase,
        'titlecase': toTitleCase,
        'sentencecase': toSentenceCase,
        'capitalize': toCapitalize,
        'alternating': toAlternating
      };
      
      const converter = convertMap[caseType];
      if (!converter) return;
      
      // Highlight active button
      caseBtns.forEach(b => b.classList.remove('primary'));
      this.classList.add('primary');
      
      const displayNames = {
        'uppercase': 'UPPER CASE',
        'lowercase': 'lower case',
        'titlecase': 'Title Case',
        'sentencecase': 'Sentence case',
        'capitalize': 'Capitalize',
        'alternating': 'Alternating'
      };
      
      convertText(displayNames[caseType], converter);
    });
  });

  // ===== Real-time Stats =====

  textarea.addEventListener('input', () => {
    updateLiveStats(textarea.value);
    autoExpandTextarea();
  });

  // ===== Clear Button =====

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      textarea.value = '';
      const output = getCachedElement('convertedOutput');
      const resultBox = getCachedElement('caseResultBox');
      if (output) output.textContent = '';
      if (resultBox) resultBox.classList.add('hidden');
      updateLiveStats('');
      if (errorBox) {
        errorBox.classList.add('hidden');
        errorBox.style.background = '';
        errorBox.style.color = '';
        errorBox.style.borderColor = '';
      }
      textarea.focus();
      setTimeout(autoExpandTextarea, 10);
    });
  }

  // ===== Load Sample =====

  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const sample = `the quick brown fox jumps over the lazy dog. this sentence contains every letter of the english alphabet at least once. it is a great way to test text conversion tools!`;
      textarea.value = sample;
      updateLiveStats(sample);
      setTimeout(autoExpandTextarea, 10);
      
      // Clear previous result
      const output = getCachedElement('convertedOutput');
      const resultBox = getCachedElement('caseResultBox');
      if (output) output.textContent = '';
      if (resultBox) resultBox.classList.add('hidden');
      
      // Highlight first button
      caseBtns.forEach(b => b.classList.remove('primary'));
      const firstBtn = document.querySelector('.case-btn');
      if (firstBtn) firstBtn.classList.add('primary');
    });
  }

  // ===== Copy Result =====

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const output = getCachedElement('convertedOutput');
      if (!output || !output.textContent) {
        showError('Nothing to copy. Convert some text first.');
        return;
      }
      
      const text = output.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showSuccess('Copied to clipboard!');
        }).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    });
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      showSuccess('Copied to clipboard!');
    } catch (error) {
      showError('Failed to copy. Please copy manually.');
    }
    
    document.body.removeChild(textarea);
  }

  // ===== History Toggle =====

  if (historyToggleBtn) {
    historyToggleBtn.addEventListener('click', () => {
      historyVisible = !historyVisible;
      if (historySection) {
        historySection.classList.toggle('hidden');
      }
      if (historyVisible) {
        renderHistory();
      }
    });
  }

  // ===== Clear History =====

  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all history?')) {
        clearHistory();
        showSuccess('History cleared!');
      }
    });
  }

  // ===== Keyboard Shortcuts =====

  textarea.addEventListener('keydown', (e) => {
    // Ctrl+Enter to convert to UPPER CASE
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      const btn = document.querySelector('.case-btn[data-case="uppercase"]');
      if (btn) btn.click();
    }
  });

  // ===== Initial State =====

  updateLiveStats('');
  renderHistory();
  setTimeout(autoExpandTextarea, 50);
}
// ============================================================
// 12. SELF-TEST
// ============================================================

function runSelfTest() {
  const testText = 'hello world! this is a test.';
  
  const tests = [
    { name: 'UPPER CASE', result: toUpperCase(testText), expected: 'HELLO WORLD! THIS IS A TEST.' },
    { name: 'lower case', result: toLowerCase(testText), expected: 'hello world! this is a test.' },
    { name: 'Title Case', result: toTitleCase(testText), expected: 'Hello World! This Is A Test.' },
    { name: 'Capitalize', result: toCapitalize(testText), expected: 'Hello World! This Is A Test.' }
  ];
  
  let passed = true;
  tests.forEach(test => {
    if (test.result !== test.expected) {
      console.error(`[Self-Test] ${test.name} failed: expected "${test.expected}", got "${test.result}"`);
      passed = false;
    }
  });
  
  // Test alternating case
  const altResult = toAlternating('hello');
  if (altResult !== 'HeLlO') {
    console.error(`[Self-Test] Alternating failed: expected "HeLlO", got "${altResult}"`);
    passed = false;
  }
  
  if (passed) {
    console.log('[Case Converter] ✅ All self-tests passed!');
  } else {
    console.warn('[Case Converter] ⚠️ Some self-tests failed.');
  }
  
  return passed;
}

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // The root app.js automatically handles:
  // - Tool icon & category setup (using data-active-tool-id)
  // - Related tools rendering (using JSON data)
  // - Search hijacking
  // - Year in footer
  
  // We just need to initialize our tool's specific logic
  initTool();
  console.log('Case Converter] ✅ Initialized successfully');
});



















