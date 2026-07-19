/**
 * Word Counter - Complete Implementation
 * Unicode-aware word counting with emoji support
 * Copy & Download functionality
 * Integrates with Toolzary template
 */
// ============================================================
// 2. CORE ANALYSIS FUNCTIONS
// ============================================================

function getTotalWords(text) {
  if (!text || text.trim().length === 0) return 0;

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  return words ? words.length : 0;
}

function getUniqueWords(text) {
  if (!text || text.trim().length === 0) return 0;

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  if (!words) return 0;

  return new Set(words.map(w => w.toLowerCase())).size;
}

function getWordFrequency(text) {
  if (!text || text.trim().length === 0) return {};

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  if (!words) return {};

  const frequency = {};

  words.forEach(word => {
    const key = word.toLowerCase();
    frequency[key] = (frequency[key] || 0) + 1;
  });

  return Object.fromEntries(
    Object.entries(frequency).sort((a, b) => b[1] - a[1])
  );
}

function getTotalCharacters(text) {
  if (!text) return 0;

  return [...new Intl.Segmenter(
    undefined,
    { granularity: 'grapheme' }
  ).segment(text)].length;
}

function getCharactersNoSpaces(text) {
  if (!text) return 0;

  const clean = text.replace(/\s/g, '');

  return [...new Intl.Segmenter(
    undefined,
    { granularity: 'grapheme'
  }).segment(clean)].length;
}

function getEmojiCount(text) {
  if (!text) return 0;

  const emojiRegex = /(?:\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/gu;

  const matches = text.match(emojiRegex);

  return matches ? matches.length : 0;
}

function getSpecialCharacters(text) {
  if (!text) return 0;

  const cleaned = text
    .replace(/[\p{L}\p{N}\p{Extended_Pictographic}\p{Emoji_Component}\s]/gu, '');

  return [...cleaned].length;
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

function getAverageWordLength(text) {
  if (!text || text.trim().length === 0) return 0;

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  if (!words || words.length === 0) return 0;

  const totalLength = words.reduce(
    (sum, word) => sum + [...word].length,
    0
  );

  return parseFloat((totalLength / words.length).toFixed(2));
}

function getLongestWord(text) {
  if (!text || text.trim().length === 0) return '-';

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  if (!words) return '-';

  return words.reduce((a, b) =>
    [...a].length >= [...b].length ? a : b
  );
}

function getShortestWord(text) {
  if (!text || text.trim().length === 0) return '-';

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  if (!words) return '-';

  return words.reduce((a, b) =>
    [...a].length <= [...b].length ? a : b
  );
}

function getReadingTime(text) {
  const words = getTotalWords(text);

  if (words === 0) return 0;

  const minutes = words / 200;

  if (minutes < 0.1) return 0.1;

  return parseFloat(minutes.toFixed(1));
}

function getWordsWithoutSpaces(text) {
  if (!text || text.trim().length === 0) return 0;

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  return words ? words.length : 0;
}

function getWordsWithSpaces(text) {
  if (!text || text.trim().length === 0) return 0;

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  return words ? words.length : 0;
}

function getWordsWithoutEmojis(text) {
  if (!text || text.trim().length === 0) return 0;

  // Remove emojis first
  const noEmojis = text.replace(/\p{Extended_Pictographic}/gu, '');

  // Now count only letters/numbers words
  const words = noEmojis.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  return words ? words.length : 0;
}
/**
 * Main analysis function - returns all metrics
 */
function analyzeText(text) {
  if (typeof text !== 'string') {
    text = '';
  }

  const totalWords = getTotalWords(text);
  const uniqueWords = getUniqueWords(text);
  const totalChars = getTotalCharacters(text);
  const charsNoSpaces = getCharactersNoSpaces(text);
  const emojiCount = getEmojiCount(text);
  const specialChars = getSpecialCharacters(text);
  const sentences = getSentences(text);
  const paragraphs = getParagraphs(text);
  const avgWordLength = getAverageWordLength(text);
  const longestWord = getLongestWord(text);
  const shortestWord = getShortestWord(text);
  const readingTime = getReadingTime(text);
  const frequency = getWordFrequency(text);
  const wordsWithSpaces = getWordsWithSpaces(text);
  const wordsWithoutSpaces = getWordsWithoutSpaces(text);

  return {
    totalWords,
    uniqueWords,
    totalChars,
    charsNoSpaces,
    emojiCount,
    specialChars,
    sentences,
    paragraphs,
    avgWordLength,
    longestWord,
    shortestWord,
    readingTime,
    frequency,
    wordsWithSpaces,
    wordsWithoutSpaces
  };
}

// ============================================================
// 3. STRIP EMOJIS AND SPECIAL FORMATTING FOR COPY
// ============================================================

function stripEmojisAndFormatting(text) {
  if (!text) return '';
  
  // Remove emojis using Extended_Pictographic
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

function stripEmojisFromText(text) {
  if (!text) return '';
  return text.replace(/\p{Extended_Pictographic}/gu, '').trim();
}

// ============================================================
// 4. UI UPDATE FUNCTION
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
    totalWords: 'totalWords',
    uniqueWords: 'uniqueWords',
    totalChars: 'characters',
    charsNoSpaces: 'charsNoSpaces',
    emojiCount: 'emojiCount',
    specialChars: 'specialChars',
    sentences: 'sentences',
    paragraphs: 'paragraphs',
    avgWordLength: 'avgWordLength',
    longestWord: 'longestWord',
    shortestWord: 'shortestWord',
    readingTime: 'readingTime'
  };

  Object.keys(elements).forEach(key => {
    const el = getCachedElement(elements[key]);
    if (el) {
      const value = stats[key];
      if (typeof value === 'number') {
        if (key === 'readingTime') {
          el.textContent = value > 0 ? `${value} min` : '0';
        } else if (key === 'avgWordLength') {
          el.textContent = value > 0 ? value : '0';
        } else {
          el.textContent = value.toLocaleString();
        }
      } else {
        el.textContent = value || '0';
        if (key === 'longestWord' || key === 'shortestWord') {
          el.classList.add('small');
        }
      }
    }
  });

  // Update live counters
  const liveWord = getCachedElement('liveWordCount');
  const liveChar = getCachedElement('liveCharCount');
  const liveSentence = getCachedElement('liveSentenceCount');
  const liveEmoji = getCachedElement('liveEmojiCount');
  
  if (liveWord) liveWord.textContent = `Words: ${stats.totalWords.toLocaleString()}`;
  if (liveChar) liveChar.textContent = `Characters: ${stats.totalChars.toLocaleString()}`;
  if (liveSentence) liveSentence.textContent = `Sentences: ${stats.sentences.toLocaleString()}`;
  if (liveEmoji) liveEmoji.textContent = `Emojis: ${stats.emojiCount.toLocaleString()}`;

  // Show/hide result box
  const resultBox = getCachedElement('wordResultBox');
  if (resultBox) {
    if (text.trim().length > 0) {
      resultBox.classList.remove('hidden');
    } else {
      resultBox.classList.add('hidden');
    }
  }

  // Update word frequency
  updateWordFrequency(stats.frequency);

  // Highlight changes
  highlightChanges(stats);

  // Auto-expand textarea
  autoExpandTextarea();

  previousStats = stats;
  return stats;
}

// ============================================================
// 5. WORD FREQUENCY DISPLAY
// ============================================================

function updateWordFrequency(frequency) {
  const box = getCachedElement('frequencyBox');
  const list = getCachedElement('wordFrequencyList');
  
  if (!box || !list) return;
  
  const entries = Object.entries(frequency);
  
  if (entries.length === 0) {
    box.classList.add('hidden');
    return;
  }
  
  box.classList.remove('hidden');
  
  // Show top 50 words
  const topWords = entries.slice(0, 50);
  
  list.innerHTML = topWords.map(([word, count]) => `
    <div class="word-frequency-item">
      <span class="word-frequency-word">${escapeHtml(word)}</span>
      <span class="word-frequency-count">${count}</span>
    </div>
  `).join('');
}

// Simple HTML escaping to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================
// 6. HIGHLIGHT CHANGES
// ============================================================

function highlightChanges(stats) {
  if (!previousStats) return;
  
  const idMap = {
    totalWords: 'totalWords',
    uniqueWords: 'uniqueWords',
    totalChars: 'characters',
    charsNoSpaces: 'charsNoSpaces',
    emojiCount: 'emojiCount',
    specialChars: 'specialChars',
    sentences: 'sentences',
    paragraphs: 'paragraphs',
    avgWordLength: 'avgWordLength',
    readingTime: 'readingTime'
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
// 7. AUTO-EXPAND TEXTAREA
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
// 8. SCROLL TO RESULTS
// ============================================================

function scrollToResults() {
  const results = getCachedElement('wordResultBox');
  if (results && !results.classList.contains('hidden')) {
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ============================================================
// 9. COPY RESULTS (WITHOUT EMOJIS)
// ============================================================

function copyResults() {
  const textarea = getCachedElement('textInput');
  const errorBox = getCachedElement('toolLocalError');
  
  if (!textarea) return; 
  
  const text = textarea.value;
  if (!text.trim()) {
    showError('No text to analyze. Please enter some text first.');
    return;
  }
  
  const stats = analyzeText(text);
  
  // Get frequency top 10 for the report
  const freqEntries = Object.entries(stats.frequency).slice(0, 10);
  const freqStr = freqEntries.length > 0 
    ? freqEntries.map(([word, count]) => `  ${word}: ${count}`).join('\n')
    : '  No words found';
  
  // Create clean results without emojis
  const resultText = `
  ═══════════════════════════════════════════════
  WORD COUNTER RESULTS
  ═══════════════════════════════════════════════

  BASIC STATISTICS
  ───────────────────────────────────────────────
  Total Words:                 ${stats.totalWords}
  Unique Words:                ${stats.uniqueWords}
  Characters (with emojis):    ${stats.totalChars}
  Characters (no spaces):      ${stats.charsNoSpaces}
  Emojis Found:                ${stats.emojiCount}
  Special Characters:          ${stats.specialChars}

  TEXT STRUCTURE
  ───────────────────────────────────────────────
  Sentences:                   ${stats.sentences}
  Paragraphs:                  ${stats.paragraphs}
  Average Word Length:         ${stats.avgWordLength}
  Longest Word:                ${stats.longestWord}
  Shortest Word:               ${stats.shortestWord}

  READING TIME
  ───────────────────────────────────────────────
  Estimated Reading Time:      ${stats.readingTime > 0 ? stats.readingTime + ' min' : '0 min'}
  (Based on 200 words per minute)

  TOP 10 MOST FREQUENT WORDS
  ───────────────────────────────────────────────
  ${freqStr}

  ═══════════════════════════════════════════════
  Generated by Toolzary Word Counter
  ${new Date().toLocaleString()}
  ═══════════════════════════════════════════════`;

  copyToClipboard(resultText, 'Results copied to clipboard!');
}

// ============================================================
// 10. DOWNLOAD AS TXT
// ============================================================

function downloadResults() {
  const textarea = getCachedElement('textInput');
  const errorBox = getCachedElement('toolLocalError');
  
  if (!textarea) return;
  
  const text = textarea.value;
  if (!text.trim()) {
    showError('No text to analyze. Please enter some text first.');
    return;
  }
  
  const stats = analyzeText(text);
  
  // Get frequency for the report
  const freqEntries = Object.entries(stats.frequency);
  const freqStr = freqEntries.length > 0 
    ? freqEntries.map(([word, count]) => `  ${word}: ${count}`).join('\n')
    : '  No words found';

  
  // Create the full report
  const fullReport = `
  ═══════════════════════════════════════════════════════════════
  WORD COUNTER - COMPLETE REPORT
  ═══════════════════════════════════════════════════════════════

  BASIC STATISTICS
  ──────────────────────────────────────────────────────────────────────────────
  Total Words:                   ${stats.totalWords}
  Unique Words:                  ${stats.uniqueWords}
  Characters (with emojis):      ${stats.totalChars}
  Characters (no spaces):        ${stats.charsNoSpaces}
  Emojis Found:                  ${stats.emojiCount}
  Special Characters:            ${stats.specialChars}

  TEXT STRUCTURE
  ──────────────────────────────────────────────────────────────────────────────
  Sentences:                     ${stats.sentences}
  Paragraphs:                    ${stats.paragraphs}
  Average Word Length:           ${stats.avgWordLength}
  Longest Word:                  ${stats.longestWord}
  Shortest Word:                 ${stats.shortestWord}

  READING TIME
  ──────────────────────────────────────────────────────────────────────────────
  Estimated Reading Time:        ${stats.readingTime > 0 ? stats.readingTime + ' minutes' : '0 minutes'}
  (Based on 200 words per minute)

  WORD FREQUENCY DISTRIBUTION
  ──────────────────────────────────────────────────────────────────────────────
  ${freqStr}

  ═══════════════════════════════════════════════════════════════
  Report Generated: ${new Date().toLocaleString()}
  Toolzary Word Counter - https://toolzary.com/word-counter
  ═══════════════════════════════════════════════════════════════`;

  // Create and download the file
  try {
    const blob = new Blob([fullReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `word-counter-report-${new Date().toISOString().slice(0, 10)}.txt`;
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
// 12. COPY TO CLIPBOARD HELPER
// ============================================================

function copyToClipboard(text, successMessage) {
  const errorBox = getCachedElement('toolLocalError');
  
  try {
    // Use the modern clipboard API
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
// 13. ERROR & SUCCESS MESSAGES
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
// 14. TOOL INITIALIZATION
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
    console.error('[Word Counter] Textarea not found');
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
        // Reset styles
        errorBox.style.background = '';
        errorBox.style.color = '';
        errorBox.style.borderColor = '';
      }
      textarea.focus();
      setTimeout(autoExpandTextarea, 10);
    });
  }

  // Load sample text
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const sample = `🌟✨ The Art of Effective Communication ✨🌟

Effective communication is the cornerstone of human interaction. Whether in personal relationships, professional environments, or social settings, the ability to convey ideas clearly and listen actively determines the quality of our connections with others. 🗣️👂

In today's fast-paced world 🌍, where digital communication often replaces face-to-face conversations, mastering the art of communication has become more crucial than ever. From crafting compelling emails 📧 to delivering impactful presentations 📊, every interaction presents an opportunity to build trust and understanding.

Here are some key principles for effective communication:

1️⃣ Active listening is essential. This means giving your full attention to the speaker, asking clarifying questions, and providing thoughtful feedback. When people feel heard, they are more likely to engage in meaningful dialogue. 💬

2️⃣ Clarity and conciseness are vital. Whether writing or speaking, choose words that accurately convey your message without unnecessary complexity. A well-structured message reduces misunderstandings and saves time for everyone involved. ⏰

3️⃣ Empathy and emotional intelligence play a significant role. Understanding the perspective of others, acknowledging their feelings, and responding with compassion can transform difficult conversations into productive exchanges. ❤️

4️⃣ Non-verbal communication matters. Body language, tone of voice, and facial expressions often speak louder than words. Being aware of these subtle cues can help you interpret messages more accurately and respond appropriately. 🤔

5️⃣ Adaptability is key. Different situations and audiences require different communication styles. The ability to adjust your approach based on context demonstrates flexibility and respect for others' needs. 🔄

Remember that effective communication is a skill that can be developed with practice. By consistently applying these principles, you can enhance your personal and professional relationships, resolve conflicts more effectively, and inspire others through your words and actions. 🌟

The journey to becoming a better communicator is ongoing, but every effort you make brings you closer to connecting with others in more meaningful ways. 🚀✨

🎯 Pro Tip: The best communicators are the ones who listen more than they speak! 😊`;
      
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
// 20. SELF-TEST (UPDATED - No warnings)
// ============================================================

function runSelfTest() {
  const testText = `The quick brown fox 🦊 jumps over the lazy dog 🐕. The dog slept peacefully. 🌙✨`;
  const stats = analyzeText(testText);
  
  let passed = true;
  
  // Check that all values are numbers and non-negative
  const metrics = ['totalWords', 'uniqueWords', 'totalChars', 'charsNoSpaces', 'sentences', 'paragraphs', 'emojiCount', 'specialChars', 'avgWordLength', 'readingTime'];
  metrics.forEach(key => {
    if (typeof stats[key] !== 'number' || stats[key] < 0) {
      console.error(`[Self-Test] Invalid value for ${key}: ${stats[key]}`);
      passed = false;
    }
  });
  
  // Check longest/shortest word are strings
  if (typeof stats.longestWord !== 'string' || typeof stats.shortestWord !== 'string') {
    console.error('[Self-Test] Longest/shortest word should be strings');
    passed = false;
  }
  
  // Validate that charactersNoSpaces is less than or equal to totalCharacters
  if (stats.charsNoSpaces > stats.totalChars) {
    console.error(`[Self-Test] charactersNoSpaces (${stats.charactersNoSpaces}) exceeds totalCharacters (${stats.totalChars})`);
    passed = false;
  }
  
  // Validate that specialChars is less than or equal to totalCharacters
  if (stats.specialChars > stats.totalChars) {
    console.error(`[Self-Test] specialChars (${stats.specialChars}) exceeds totalCharacters (${stats.totalChars})`);
    passed = false;
  }
  
  // Test strip emojis function
  const emojiText = 'Hello 👋 World 🌍!';
  const stripped = stripEmojisAndFormatting(emojiText);
  if (!stripped.includes('Hello') || !stripped.includes('World')) {
    console.error(`[Self-Test] Strip emojis failed: expected to contain "Hello" and "World", got "${stripped}"`);
    passed = false;
  }
  
  // Validate total words is reasonable (should be between 12-18)
  if (stats.totalWords < 12 || stats.totalWords > 18) {
    console.warn(`[Self-Test] Total words (${stats.totalWords}) is outside expected range (12-18)`);
    passed = false;
  }
  
  // Validate emoji count is reasonable (should be between 3-6)
  if (stats.emojiCount < 3 || stats.emojiCount > 6) {
    console.warn(`[Self-Test] Emoji count (${stats.emojiCount}) is outside expected range (3-6)`);
    passed = false;
  }
  
  // Validate sentences is reasonable (should be between 2-4)
  if (stats.sentences < 2 || stats.sentences > 4) {
    console.warn(`[Self-Test] Sentences (${stats.sentences}) is outside expected range (2-4)`);
    passed = false;
  }
  
  // Log the actual values for reference
  console.log(`[Self-Test] ✅ Values: Words=${stats.totalWords}, Emojis=${stats.emojiCount}, Sentences=${stats.sentences}, Characters=${stats.totalChars}`);
  
  if (passed) {
    console.log('[Word Counter] ✅ All self-tests passed!');
  } else {
    console.warn('[Word Counter] ⚠️ Some self-tests failed.');
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



















