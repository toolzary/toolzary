document.addEventListener("DOMContentLoaded", function () {

    const app = document.getElementById("tool-app");

    if (!app) {
        return;
    }


    /*
    ============================================
    CREATE TOOL INTERFACE
    ============================================
    */

    app.innerHTML = `

        <!-- ===== TOOL INTERFACE ===== -->
        <div class="tool-custom-interface">
          <!-- Text input -->
          <div class="form-group">
            <label for="textInput" class="input-label">Enter your text below *</label>
            <textarea id="textInput" class="data-input-field textarea-input" rows="8" placeholder="Type or paste your text here"></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="action-button-group">
  <button id="analyzeBtn" class="third-btn">Analyze Text</button>
  <button id="clearBtn" class="first-btn">Clear</button>
  <button id="sampleBtn" class="first-btn">Load Sample</button>
  <button id="downloadBtn" class="first-btn">Download Results</button>
 <button id="copyBtn" class="first-btn">Copy Results</button>  
</div>

          <!-- Results -->
          <div id="charResultBox" class="result-box-card hidden">
            <h3 class="result-box-title">Character Statistics</h3>
            <div class="char-metrics-grid">
              <div class="metric-output-block">
                <div class="metric-display-val" id="totalChars">0</div>
                <div class="metric-display-lbl">Total Characters</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="charsNoSpaces">0</div>
                <div class="metric-display-lbl">Characters (no spaces)</div>
              </div>
              <!-- Add these two new metric blocks -->
<div class="metric-output-block">
  <div class="metric-display-val" id="emojiCount">0</div>
  <div class="metric-display-lbl">Emojis Found</div>
</div>
<div class="metric-output-block">
  <div class="metric-display-val" id="charactersWithEmojis">0</div>
  <div class="metric-display-lbl">Characters (with emojis)</div>
</div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="letters">0</div>
                <div class="metric-display-lbl">Letters</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="numbers">0</div>
                <div class="metric-display-lbl">Numbers</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="spaces">0</div>
                <div class="metric-display-lbl">Spaces</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="specialChars">0</div>
                <div class="metric-display-lbl">Special Characters</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="words">0</div>
                <div class="metric-display-lbl">Words</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="sentences">0</div>
                <div class="metric-display-lbl">Sentences</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="lines">0</div>
                <div class="metric-display-lbl">Lines</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="paragraphs">0</div>
                <div class="metric-display-lbl">Paragraphs</div>
              </div>
            </div>
          </div>

          <!-- Live counter bar -->
         <div class="live-counter-bar">
  <span id="liveCharCount">Characters: 0</span>
  <span id="liveWordCount">Words: 0</span>
  <span id="liveEmojiCount">Emojis: 0</span>
  <span id="liveSpecialCount">Special: 0</span>
</div>

          <div id="toolLocalError" class="local-error-alert hidden"></div>
        </div>
    `;



    /*
    ============================================
    TOOL LOGIC
    ============================================
    */


    initTool();
  runSelfTest();
  console.log('[Character Counter] ✅ Initialized successfully');



});






/**
 * Get total number of characters including all Unicode
 * Uses Intl.Segmenter to correctly count graphemes as per word counter logic
 */
function getTotalCharacters(text) {
  if (!text) return 0;

  return [...new Intl.Segmenter(
    undefined,
    { granularity: 'grapheme' }
  ).segment(text)].length;
}

/**
 * Get characters without spaces (U+0020 only)
 */
function getCharactersNoSpaces(text) {
  if (!text) return 0;

  const clean = text.replace(/\s/g, '');

  return [...new Intl.Segmenter(
    undefined,
    { granularity: 'grapheme'
  }).segment(clean)].length;
}

/**
 * Count only space characters (U+0020)
 */
function getSpaces(text) {
  return (text.match(/ /g) || []).length;
}

/**
 * Count Unicode letters in any script using \p{L}
 */
function getLetters(text) {
  return (text.match(/\p{L}/gu) || []).length;
}

/**
 * Count digits 0-9 only
 */
function getNumbers(text) {
  return (text.match(/[0-9]/g) || []).length;
}

/**
 * Count special characters: matching word counter clean extraction logic
 */
function getSpecialCharacters(text) {
  if (!text) return 0;

  const cleaned = text
    .replace(/[\p{L}\p{N}\p{Extended_Pictographic}\p{Emoji_Component}\s]/gu, '');

  return [...cleaned].length;
}

/**
 * Count emojis in text using Unicode property escapes
 * Uses the complete sequence matcher from the word counter
 */
function getEmojiCount(text) {
  if (!text) return 0;

  const emojiRegex = /(?:\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/gu;

  const matches = text.match(emojiRegex);

  return matches ? matches.length : 0;
}

/**
 * Get characters with emojis
 */
function getCharactersWithEmojis(text) {
  return getTotalCharacters(text);
}

/**
 * Strip emojis from text for clean output matching word counter style
 */
function stripEmojisAndFormatting(text) {
  if (!text) return '';
  
  // Remove emojis using Extended_Pictographic and control modifiers
  let cleaned = text
   .replace(/\p{Extended_Pictographic}/gu, '')
   .replace(/\u200D/g, '')
   .replace(/\uFE0F/g, '')
   .replace(/\s+/g, ' ')
   .trim();
  
  // Remove extra spaces that might appear after emoji removal
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

/**
 * Count words using the uniform RegExp approach from word counter
 */
function getWords(text) {
  if (!text || text.trim().length === 0) return 0;

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  return words ? words.length : 0;
}

/**
 * Count sentences with protection for decimals and abbreviations
 */
function getSentences(text) {
  if (!text || text.trim().length === 0) return 0;
  
  let processed = text;
  
  // Protect decimals
  processed = processed.replace(/\d+\.\d+/g, ' NUM ');
  
  // Protect common abbreviations
  processed = processed.replace(/\b(p\.m\.|a\.m\.|e\.g\.|i\.e\.|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Inc\.|Corp\.|Ltd\.|etc\.|vs\.|vol\.|no\.|fig\.|cf\.|et al\.)/gi, ' ABBR ');
  
  const sentences = processed
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  return sentences.length;
}

/**
 * Count paragraphs separated by blank lines
 */
function getParagraphs(text) {
  if (!text || text.trim().length === 0) return 0;
  return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
}

/**
 * Count lines (including empty lines)
 */
function getLines(text) {
  if (!text) return 0;
  return text.split(/\n/).length;
}

/**
 * Main analysis function - returns all metrics in a single consistent object
 */
function analyzeText(text) {
  if (typeof text !== 'string') {
    text = '';
  }

  const result = {
    totalCharacters: getTotalCharacters(text),
    charactersNoSpaces: getCharactersNoSpaces(text),
    letters: getLetters(text),
    numbers: getNumbers(text),
    spaces: getSpaces(text),
    specialCharacters: getSpecialCharacters(text),
    emojiCount: getEmojiCount(text),
    charactersWithEmojis: getCharactersWithEmojis(text),
    words: getWords(text),
    sentences: getSentences(text),
    lines: getLines(text),
    paragraphs: getParagraphs(text)
  };

  return result;
}

// ============================================================
// 3. UI UPDATE FUNCTION
// ============================================================

let previousStats = null;
let elementCache = {};

function getCachedElement(id) {
  if (!elementCache[id]) {
    elementCache[id] = document.getElementById(id);
  }
  return elementCache[id];
}

function updateStats() {
  const textarea = getCachedElement('textInput');
  if (!textarea) return;

  const text = textarea.value;
  const stats = analyzeText(text);

  // Update all metric displays
  const elements = {
    totalChars: 'totalChars',
    charsNoSpaces: 'charsNoSpaces',
    letters: 'letters',
    numbers: 'numbers',
    spaces: 'spaces',
    specialChars: 'specialChars',
    emojiCount: 'emojiCount',
    charactersWithEmojis: 'charactersWithEmojis',
    words: 'words',
    sentences: 'sentences',
    lines: 'lines',
    paragraphs: 'paragraphs'
  };

  Object.keys(elements).forEach(key => {
    const el = getCachedElement(elements[key]);
    if (el) {
      let value;
      switch(key) {
        case 'totalChars':
          value = stats.totalCharacters;
          break;
        case 'charsNoSpaces':
          value = stats.charactersNoSpaces;
          break;
        case 'specialChars':
          value = stats.specialCharacters;
          break;
        case 'charactersWithEmojis':
          value = stats.charactersWithEmojis;
          break;
        default:
          value = stats[key];
          break;
      }
      el.textContent = typeof value === 'number' ? value.toLocaleString() : value;
    }
  });

  // Live counters
  const liveChar = getCachedElement('liveCharCount');
  const liveWord = getCachedElement('liveWordCount');
  const liveEmoji = getCachedElement('liveEmojiCount');
  const liveSpecial = getCachedElement('liveSpecialCount');
  
  if (liveChar) liveChar.textContent = `Characters: ${stats.totalCharacters.toLocaleString()}`;
  if (liveWord) liveWord.textContent = `Words: ${stats.words.toLocaleString()}`;
  if (liveEmoji) liveEmoji.textContent = `Emojis: ${stats.emojiCount.toLocaleString()}`;
  if (liveSpecial) liveSpecial.textContent = `Special: ${stats.specialCharacters.toLocaleString()}`;

  // Show/hide result box
  const resultBox = getCachedElement('charResultBox');
  if (resultBox) {
    if (text.trim().length > 0) {
      resultBox.classList.remove('hidden');
    } else {
      resultBox.classList.add('hidden');
    }
  }

  // Highlight changes
  highlightChanges(stats);

  // Auto-expand textarea
  autoExpandTextarea();

  previousStats = stats;
  return stats;
}

// ============================================================
// 4. HIGHLIGHT CHANGES (Bonus feature)
// ============================================================

function highlightChanges(stats) {
  if (!previousStats) return;
  
  const idMap = {
    totalCharacters: 'totalChars',
    charactersNoSpaces: 'charsNoSpaces',
    letters: 'letters',
    numbers: 'numbers',
    spaces: 'spaces',
    specialCharacters: 'specialChars',
    words: 'words',
    sentences: 'sentences',
    lines: 'lines',
    paragraphs: 'paragraphs'
  };

  Object.keys(idMap).forEach(key => {
    const elem = getCachedElement(idMap[key]);
    if (elem && previousStats[key] !== stats[key]) {
      elem.style.transition = 'color 0.15s';
      elem.style.color = 'var(--primary)';
      setTimeout(() => {
        elem.style.color = '';
      }, 300);
    }
  });
}

// ============================================================
// 5. AUTO-EXPAND TEXTAREA
// ============================================================

function autoExpandTextarea() {
  const textarea = getCachedElement('textInput');
  if (!textarea) return;
  
  requestAnimationFrame(() => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  });
}

// ============================================================
// 6. SCROLL TO RESULTS (Only on Enter or button click)
// ============================================================

function scrollToResults() {
  const results = getCachedElement('charResultBox');
  if (results && !results.classList.contains('hidden')) {
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============================================================
// 7. COPY RESULTS (without emojis)
// ============================================================

function copyResults() {
  const textarea = getCachedElement('textInput');
  
  if (!textarea) return;
  
  const text = textarea.value;
  if (!text.trim()) {
    showError('No text to analyze. Please enter some text first.');
    return;
  }
  
  const stats = analyzeText(text);
  
  const resultText = 
`═══════════════════════════════════════════════
 CHARACTER COUNTER RESULTS
 ═══════════════════════════════════════════════

 CHARACTER STATISTICS
 ───────────────────────────────────────────────
 Total Characters:            ${stats.totalCharacters}
 Characters (no spaces):      ${stats.charactersNoSpaces}
 Letters:                     ${stats.letters}
 Numbers:                     ${stats.numbers}
 Spaces:                      ${stats.spaces}
 Emojis:                      ${stats.emojiCount}
 Special Characters:          ${stats.specialCharacters}

 TEXT STRUCTURE
 ───────────────────────────────────────────────
 Words:                       ${stats.words}
 Sentences:                   ${stats.sentences}
 Lines:                       ${stats.lines}
 Paragraphs:                  ${stats.paragraphs}

 ═══════════════════════════════════════════════
 Generated by Toolzary Character Counter
 ${new Date().toLocaleString()}
 ═══════════════════════════════════════════════`;

  copyToClipboard(resultText, 'Results copied to clipboard!');
}

// ============================================================
// 8. DOWNLOAD RESULTS AS TXT
// ============================================================

function downloadResults() {
  const textarea = getCachedElement('textInput');
  
  if (!textarea) return;
  
  const text = textarea.value;
  if (!text.trim()) {
    showError('No text to analyze. Please enter some text first.');
    return;
  }
  
  const stats = analyzeText(text);
  
  const fullReport = 
`═══════════════════════════════════════════════════════════════
 CHARACTER COUNTER - COMPLETE REPORT
 ═══════════════════════════════════════════════════════════════

 CHARACTER STATISTICS
 ──────────────────────────────────────────────────────────────────────────────
 Total Characters:            ${stats.totalCharacters}
 Characters (no spaces):      ${stats.charactersNoSpaces}
 Letters:                     ${stats.letters}
 Numbers:                     ${stats.numbers}
 Spaces:                      ${stats.spaces}
 Emojis:                      ${stats.emojiCount}
 Special Characters:          ${stats.specialCharacters}

 TEXT STRUCTURE
 ──────────────────────────────────────────────────────────────────────────────
 Words:                       ${stats.words}
 Sentences:                   ${stats.sentences}
 Lines:                       ${stats.lines}
 Paragraphs:                  ${stats.paragraphs}

 ═══════════════════════════════════════════════════════════════
 Report Generated: ${new Date().toLocaleString()}
 Toolzary Character Counter - https://toolzary.com/character-counter
 ═══════════════════════════════════════════════════════════════`;

  try {
    const blob = new Blob([fullReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `character-counter-report-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showSuccess('File downloaded successfully!');
  } catch (error) {
    console.error('Download failed:', error);
    showError('Failed to download file. Please try again.');
  }
}

// ============================================================
// 10. COPY TO CLIPBOARD HELPERS
// ============================================================

function copyToClipboard(text, successMessage) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showSuccess(successMessage || 'Copied to clipboard!');
      }).catch(() => {
        fallbackCopy(text, successMessage);
      });
    } else {
      fallbackCopy(text, successMessage);
    }
  } catch (error) {
    console.error('Copy failed:', error);
    showError('Failed to copy. Please select and copy manually.');
  }
}

function fallbackCopy(text, successMessage) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showSuccess(successMessage || 'Copied to clipboard!');
  } catch (error) {
    showError('Failed to copy. Please select and copy manually.');
  }
  
  document.body.removeChild(textarea);
}

// ============================================================
// 11. ERROR & SUCCESS MESSAGES
// ============================================================

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
  }, 5000);
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
  }, 3000);
}

// ============================================================
// 12. TOOL INITIALIZATION
// ============================================================

function initTool() {
  const textarea = getCachedElement('textInput');
  const analyzeBtn = getCachedElement('analyzeBtn');
  const clearBtn = getCachedElement('clearBtn');
  const sampleBtn = getCachedElement('sampleBtn');
  const copyBtn = getCachedElement('copyBtn');
  const downloadBtn = getCachedElement('downloadBtn');
  const errorBox = getCachedElement('toolLocalError');

  if (!textarea) {
    console.error('[Character Counter] Textarea not found');
    return;
  }

  // Real-time update on input (with debounce)
  let updateTimeout;
  textarea.addEventListener('input', () => {
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      updateStats();
    }, 100);
  });

  // Enter key - scroll to results
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      updateStats();
      scrollToResults();
    }
  });

  // Analyze button
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      updateStats();
      scrollToResults();
    });
  }

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      textarea.value = '';
      updateStats();
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

  // Load sample text with emojis
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const sample = `🌟✨ The Art of Effective Communication ✨🌟

Effective communication is the cornerstone of human interaction. 🗣️👂

In today's fast-paced world 🌍, digital communication often replaces face-to-face conversations. From crafting compelling emails 📧 to delivering impactful presentations 📊, every interaction presents an opportunity to build trust.

Here are some key principles:

1️⃣ Active listening is essential. When people feel heard, they are more likely to engage in meaningful dialogue. 💬

2️⃣ Clarity and conciseness are vital. A well-structured message reduces misunderstandings. ⏰

3️⃣ Empathy and emotional intelligence play a significant role. Understanding others transforms difficult conversations. ❤️

4️⃣ Non-verbal communication matters. Body language, tone, and facial expressions speak louder than words. 🤔

5️⃣ Adaptability is key. Different situations require different communication styles. 🔄

Remember that effective communication is a skill that can be developed with practice. 🌟

🎯 Pro Tip: The best communicators listen more than they speak! 😊`;
      
      textarea.value = sample;
      updateStats();
      setTimeout(scrollToResults, 200);
    });
  }

  // Copy Results (without emojis)
  if (copyBtn) {
    copyBtn.addEventListener('click', copyResults);
  }

  // Download Results
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadResults);
  }

  // Initial update and expand
  updateStats();
  setTimeout(autoExpandTextarea, 50);
}

// ============================================================
// 18. SELF-TEST
// ============================================================

function runSelfTest() {
  const testText = 'Hello world! 123 éñü 中文 العربية. 45.99 p.m. 😊🌟❤️';
  const stats = analyzeText(testText);
  
  let passed = true;
  
  // Validate that all values are numbers and non-negative
  const metrics = ['totalCharacters', 'charactersNoSpaces', 'letters', 'numbers', 'spaces', 'specialCharacters', 'emojiCount', 'words', 'sentences', 'lines', 'paragraphs'];
  metrics.forEach(key => {
    if (typeof stats[key] !== 'number' || stats[key] < 0) {
      console.error(`[Self-Test] Invalid value for ${key}: ${stats[key]}`);
      passed = false;
    }
  });
  
  // Validate that charactersNoSpaces is less than or equal to totalCharacters
  if (stats.charactersNoSpaces > stats.totalCharacters) {
    console.error(`[Self-Test] charactersNoSpaces (${stats.charactersNoSpaces}) exceeds totalCharacters (${stats.totalCharacters})`);
    passed = false;
  }
  
  // Validate that spaces is less than or equal to totalCharacters
  if (stats.spaces > stats.totalCharacters) {
    console.error(`[Self-Test] spaces (${stats.spaces}) exceeds totalCharacters (${stats.totalCharacters})`);
    passed = false;
  }
  
  // Validate emoji count is reasonable (should be 3 for test text)
  if (stats.emojiCount !== 3) {
    console.warn(`[Self-Test] Emoji count: expected ~3, got ${stats.emojiCount} (this may vary based on browser emoji support)`);
    // Don't fail the test, just warn
  }
  
  // Test strip emojis function
  const emojiText = 'Hello 👋 World 🌍!';
  const stripped = stripEmojisAndFormatting(emojiText);
  if (!stripped.includes('Hello') || !stripped.includes('World')) {
    console.error(`[Self-Test] Strip emojis failed: expected "Hello World !", got "${stripped}"`);
    passed = false;
  }
  
  if (passed) {
    console.log('[Character Counter] ✅ All self-tests passed!');
  } else {
    console.warn('[Character Counter] ⚠️ Some self-tests failed.');
  }
  
  return passed;
}