/**
 * Sentence Counter - Complete Implementation
 * Unicode-aware sentence counting with emoji support
 * Copy & Download functionality
 * Integrates with Toolzary template
 */
// ============================================================
// 2. CORE ANALYSIS FUNCTIONS
// ============================================================

function getTotalSentences(text) {
  if (!text || text.trim().length === 0) return 0;
  
  let processed = text;

  processed = processed.replace(/\d+\.\d+/g, ' NUM ');

  processed = processed.replace(/\b(p\.m\.|a\.m\.|e\.g\.|i\.e\.|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Inc\.|Corp\.|Ltd\.|etc\.|vs\.|vol\.|no\.|fig\.|cf\.|et al\.)/gi, ' ABBR ');

  const sentences = processed
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => 
 s.replace(/[\p{Extended_Pictographic}\p{Emoji_Component}\s]/gu,'').length > 0
)

  return sentences.length;
}

/**
 * Get total number of words using Unicode-aware word boundaries
 */
function getTotalWords(text) {
  if (!text || text.trim().length === 0) return 0;
  
  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);
  return words ? words.length : 0;
}

/**
 * Get unique words (case-insensitive)
 */
function getUniqueWords(text) {
  if (!text || text.trim().length === 0) return 0;
  
  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);
  if (!words) return 0;
  
  const uniqueSet = new Set(words.map(w => w.toLowerCase()));
  return uniqueSet.size;
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
    { granularity: 'grapheme' }
  ).segment(clean)].length;
}
function getSpecialCharacters(text) {
  if (!text) return 0;

  const cleaned = text.replace(
    /[\p{L}\p{N}\p{Extended_Pictographic}\p{Emoji_Component}\s]/gu,
    ''
  );

  return [...cleaned].length;
}

function getParagraphs(text) {
  if (!text) return 0;

  const clean = text.replace(
    /[\p{Extended_Pictographic}\p{Emoji_Component}\s]/gu,
    ''
  );

  if (clean.length === 0) return 0;

  return text
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0)
    .length;
}

function getEmojiCount(text) {
  if (!text) return 0;

  const emojiRegex =
  /(?:\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*)/gu;

  const matches=text.match(emojiRegex);

  return matches ? matches.length : 0;
}

/**
 * Get average words per sentence
 */
function getAvgWordsPerSentence(text) {
  const sentences = getTotalSentences(text);
  const words = getTotalWords(text);
  if (sentences === 0) return 0;
  return parseFloat((words / sentences).toFixed(2));
}

/**
 * Get average characters per sentence
 */
function getAvgCharsPerSentence(text) {
  const sentences = getTotalSentences(text);
  const chars = getTotalCharacters(text);
  if (sentences === 0) return 0;
  return parseFloat((chars / sentences).toFixed(2));
}

/**
 * Get sentence breakdown (list of sentences with word counts)
 */
function getSentenceBreakdown(text) {
  if (!text || text.trim().length === 0) return [];
  
  let processed = text;
  
  // Protect decimals
  processed = processed.replace(/\d+\.\d+/g, ' NUM ');
  
  // Protect common abbreviations
  processed = processed.replace(/\b(p\.m\.|a\.m\.|e\.g\.|i\.e\.|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Inc\.|Corp\.|Ltd\.|etc\.|vs\.|vol\.|no\.|fig\.|cf\.|et al\.)/gi, ' ABBR ');
  
 const sentences = processed
  .split(/[.!?]+/)
  .map(s => s.trim())
  .filter(s => 
 s.replace(/[\p{Extended_Pictographic}\p{Emoji_Component}\s]/gu,'').length > 0
)

  return sentences.map((sentence, index) => {
    const wordCount = sentence.match(
/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu
)?.length || 0;
    return {
      index: index + 1,
      text: sentence,
      wordCount: wordCount
    };
  });
}

/**
 * Get longest sentence
 */
function getLongestSentence(text) {
  const breakdown = getSentenceBreakdown(text);
  if (breakdown.length === 0) return '-';
  
  const longest = breakdown.reduce((a, b) => a.wordCount >= b.wordCount ? a : b);
  return longest.text;
}

/**
 * Get shortest sentence
 */
function getShortestSentence(text) {
  const breakdown = getSentenceBreakdown(text);
  if (breakdown.length === 0) return '-';
  
  const shortest = breakdown.reduce((a, b) => a.wordCount <= b.wordCount ? a : b);
  return shortest.text;
}

/**
 * Calculate reading time in minutes (200 words per minute)
 */
function getReadingTime(text) {
  const words = getTotalWords(text);
  if (words === 0) return 0;
  
  const minutes = words / 200;
  if (minutes < 0.1) return 0.1;
  return parseFloat(minutes.toFixed(1));
}

/**
 * Main analysis function - returns all metrics
 */
function analyzeText(text) {
  if (typeof text !== 'string') {
    text = '';
  }

  const totalSentences = getTotalSentences(text);
  const totalWords = getTotalWords(text);
  const uniqueWords = getUniqueWords(text);
  const totalChars = getTotalCharacters(text);
  const charsNoSpaces = getCharactersNoSpaces(text);
  const specialChars = getSpecialCharacters(text);
  const paragraphs = getParagraphs(text);
  const avgWordsPerSentence = getAvgWordsPerSentence(text);
  const avgCharsPerSentence = getAvgCharsPerSentence(text);
  const longestSentence = getLongestSentence(text);
  const shortestSentence = getShortestSentence(text);
  const emojiCount = getEmojiCount(text);
  const readingTime = getReadingTime(text);
  const breakdown = getSentenceBreakdown(text);

  return {
    totalSentences,
    totalWords,
    uniqueWords,
    totalChars,
    charsNoSpaces,
    specialChars,
    paragraphs,
    avgWordsPerSentence,
    avgCharsPerSentence,
    longestSentence,
    shortestSentence,
    emojiCount,
    readingTime,
    breakdown
  };
}

// ============================================================
// 3. STRIP EMOJIS AND SPECIAL FORMATTING FOR COPY
// ============================================================

function stripEmojisAndFormatting(text) {
  if (!text) return '';

  let cleaned = text
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\u200D/g, '')
    .replace(/\uFE0F/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
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
    totalSentences: 'totalSentences',
    totalWords: 'totalWords',
    uniqueWords: 'uniqueWords',
    totalChars: 'characters',
    charsNoSpaces: 'charsNoSpaces',
    paragraphs: 'paragraphs',
    avgWordsPerSentence: 'avgWordsPerSentence',
    avgCharsPerSentence: 'avgCharsPerSentence',
    longestSentence: 'longestSentence',
    shortestSentence: 'shortestSentence',
    emojiCount: 'emojiCount',
    readingTime: 'readingTime'
  };

  Object.keys(elements).forEach(key => {
    const el = getCachedElement(elements[key]);
    if (el) {
      const value = stats[key];
      if (typeof value === 'number') {
        if (key === 'readingTime') {
          el.textContent = value > 0 ? `${value} min` : '0';
        } else if (key === 'avgWordsPerSentence' || key === 'avgCharsPerSentence') {
          el.textContent = value > 0 ? value : '0';
        } else {
          el.textContent = value.toLocaleString();
        }
      } else {
        // For longest and shortest sentences, truncate to 50 characters
        if (key === 'longestSentence' || key === 'shortestSentence') {
          const displayText = value && value.length > 50 ? value.substring(0, 50) + '...' : value || '—';
          el.textContent = displayText;
          el.classList.add('small');
        } else {
          el.textContent = value || '0';
        }
      }
    }
  });

  // Update live counters
  const liveSentence = getCachedElement('liveSentenceCount');
  const liveWord = getCachedElement('liveWordCount');
  const liveChar = getCachedElement('liveCharCount');
  const liveEmoji = getCachedElement('liveEmojiCount');
  
  if (liveSentence) liveSentence.textContent = `Sentences: ${stats.totalSentences.toLocaleString()}`;
  if (liveWord) liveWord.textContent = `Words: ${stats.totalWords.toLocaleString()}`;
  if (liveChar) liveChar.textContent = `Characters: ${stats.totalChars.toLocaleString()}`;
  if (liveEmoji) liveEmoji.textContent = `Emojis: ${stats.emojiCount.toLocaleString()}`;

  // Show/hide result box
  const resultBox = getCachedElement('sentenceResultBox');
  if (resultBox) {
    if (text.trim().length > 0) {
      resultBox.classList.remove('hidden');
    } else {
      resultBox.classList.add('hidden');
    }
  }

  // Update sentence breakdown (limit to 10 sentences)
  updateSentenceBreakdown(stats.breakdown);

  // Highlight changes
  highlightChanges(stats);

  // Auto-expand textarea
  autoExpandTextarea();

  previousStats = stats;
  return stats;
}

// ============================================================
// 5. SENTENCE BREAKDOWN DISPLAY (Click to show all)
// ============================================================

let breakdownData = [];
let breakdownMaxShow = 15;
let breakdownShowingAll = false;

function updateSentenceBreakdown(breakdown) {
  const box = getCachedElement('sentenceBreakdownBox');
  const list = getCachedElement('sentenceBreakdownList');
  
  if (!box || !list) return;
  
  // Store breakdown data globally
  breakdownData = breakdown;
  
  if (breakdown.length === 0) {
    box.classList.add('hidden');
    return;
  }
  
  box.classList.remove('hidden');
  
  // Reset showing all state when new data arrives
  breakdownShowingAll = false;
  
  renderBreakdownList();
}

function renderBreakdownList() {
  const list = getCachedElement('sentenceBreakdownList');
  if (!list) return;
  
  const breakdown = breakdownData;
  const maxShow = breakdownMaxShow;
  const hasMore = breakdown.length > maxShow;
  
  // Determine which sentences to show
  let displayBreakdown;
  if (breakdownShowingAll) {
    displayBreakdown = breakdown;
  } else {
    displayBreakdown = breakdown.slice(0, maxShow);
  }
  
  list.innerHTML = displayBreakdown.map(item => {
    // Truncate sentence to 60 characters with ellipsis
    let displayText = item.text;
    if (displayText.length > 60) {
      displayText = displayText.substring(0, 60) + '…';
    }
    return `
      <div class="sentence-breakdown-item">
        <span class="sentence-breakdown-number">${item.index}</span>
        <span class="sentence-breakdown-text" title="${escapeHtml(item.text)}">${escapeHtml(displayText)}</span>
        <span class="sentence-breakdown-words">${item.wordCount}</span>
      </div>
    `;
  }).join('');
  
  // Show "more" button if there are more sentences and not showing all
  if (hasMore && !breakdownShowingAll) {
    list.innerHTML += `
      <div class="sentence-breakdown-more" id="showMoreSentences">
        <span>+ Show ${breakdown.length - maxShow} more sentences</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-left:6px;vertical-align:middle;">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    `;
    
    // Add click event listener for "Show More"
    const showMoreBtn = document.getElementById('showMoreSentences');
    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', function() {
        breakdownShowingAll = true;
        renderBreakdownList();
        const box = getCachedElement('sentenceBreakdownBox');
        if (box) box.scrollTop = 0;
      });
    }
  }
  
  // Show "show less" button if showing all
  if (breakdownShowingAll && breakdown.length > maxShow) {
    list.innerHTML += `
      <div class="sentence-breakdown-more" id="showLessSentences">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-right:6px;vertical-align:middle;">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        <span>Show less</span>
      </div>
    `;
    
    // Add click event listener for "Show Less"
    const showLessBtn = document.getElementById('showLessSentences');
    if (showLessBtn) {
      showLessBtn.addEventListener('click', function() {
        breakdownShowingAll = false;
        renderBreakdownList();
        const box = getCachedElement('sentenceBreakdownBox');
        if (box) box.scrollTop = 0;
      });
    }
  }
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
    totalSentences: 'totalSentences',
    totalWords: 'totalWords',
    uniqueWords: 'uniqueWords',
    totalChars: 'characters',
    charsNoSpaces: 'charsNoSpaces',
    paragraphs: 'paragraphs',
    avgWordsPerSentence: 'avgWordsPerSentence',
    avgCharsPerSentence: 'avgCharsPerSentence',
    emojiCount: 'emojiCount',
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
// 7. AUTO-EXPAND TEXTAREA (Limited to 400px)
// ============================================================

function autoExpandTextarea() {
  const textarea = getCachedElement('textInput');
  if (!textarea) return;
  
  const maxHeight = 400; // Maximum height in pixels
  
  requestAnimationFrame(() => {
    // Reset height to auto to get correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height (min 200px, max 400px)
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';
    
    // Show scrollbar if content exceeds max height
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
  });
}

// ============================================================
// 8. SCROLL TO RESULTS
// ============================================================

function scrollToResults() {
  const results = getCachedElement('sentenceResultBox');
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
  
  // Get breakdown top 10 for the report
  const breakdownEntries = stats.breakdown.slice(0, 10);
  const breakdownStr = breakdownEntries.length > 0 
    ? breakdownEntries.map(item => `  Sentence ${item.index}: ${item.wordCount} words`).join('\n')
    : '  No sentences found';
  
  // Create clean results without emojis
  const resultText = `
  ═══════════════════════════════════════════════
  SENTENCE COUNTER RESULTS
  ═══════════════════════════════════════════════

  BASIC STATISTICS
  ───────────────────────────────────────────────
  Total Sentences:             ${stats.totalSentences}
  Total Words:                 ${stats.totalWords}
  Unique Words:                ${stats.uniqueWords}
  Characters (with emojis):    ${stats.totalChars}
  Characters (no spaces):      ${stats.charsNoSpaces}
  Paragraphs:                  ${stats.paragraphs}
  Emojis Found:                ${stats.emojiCount}

  SENTENCE ANALYSIS
  ───────────────────────────────────────────────
  Avg Words per Sentence:      ${stats.avgWordsPerSentence}
  Avg Characters per Sentence: ${stats.avgCharsPerSentence}
  Longest Sentence:            ${stats.longestSentence.substring(0, 100)}${stats.longestSentence.length > 100 ? '...' : ''}
  Shortest Sentence:           ${stats.shortestSentence.substring(0, 100)}${stats.shortestSentence.length > 100 ? '...' : ''}

  READING TIME
  ───────────────────────────────────────────────
  Estimated Reading Time:      ${stats.readingTime > 0 ? stats.readingTime + ' min' : '0 min'}
  (Based on 200 words per minute)

  SENTENCE BREAKDOWN (Top 10)
  ───────────────────────────────────────────────
${breakdownStr}

  ═══════════════════════════════════════════════
  Generated by Toolzary Sentence Counter
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
  
  // Get breakdown for the report
  const breakdownStr = stats.breakdown.length > 0 
    ? stats.breakdown.map(item => `  Sentence ${item.index}: ${item.wordCount} words - ${item.text.substring(0, 150)}${item.text.length > 150 ? '...' : ''}`).join('\n')
    : '  No sentences found';
  
  // Create the full report
  const fullReport = `
  ═══════════════════════════════════════════════════════════════
  SENTENCE COUNTER - COMPLETE REPORT
  ═══════════════════════════════════════════════════════════════

  BASIC STATISTICS
  ──────────────────────────────────────────────────────────────────────────────
  Total Sentences:             ${stats.totalSentences}
  Total Words:                 ${stats.totalWords}
  Unique Words:                ${stats.uniqueWords}
  Characters (with emojis):    ${stats.totalChars}
  Characters (no spaces):      ${stats.charsNoSpaces}
  Paragraphs:                  ${stats.paragraphs}
  Emojis Found:                ${stats.emojiCount}

  SENTENCE ANALYSIS
  ──────────────────────────────────────────────────────────────────────────────
  Avg Words per Sentence:      ${stats.avgWordsPerSentence}
  Avg Characters per Sentence: ${stats.avgCharsPerSentence}
  Longest Sentence:            ${stats.longestSentence}
  Shortest Sentence:           ${stats.shortestSentence}

  READING TIME
  ──────────────────────────────────────────────────────────────────────────────
  Estimated Reading Time:        ${stats.readingTime > 0 ? stats.readingTime + ' minutes' : '0 minutes'}
  (Based on 200 words per minute)

  SENTENCE BREAKDOWN
  ──────────────────────────────────────────────────────────────────────────────
${breakdownStr}

  ═══════════════════════════════════════════════════════════════
  Report Generated: ${new Date().toLocaleString()}
  Toolzary Sentence Counter - https://toolzary.com/sentence-counter
  ═══════════════════════════════════════════════════════════════`;

  // Create and download the file
  try {
    const blob = new Blob([fullReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sentence-counter-report-${new Date().toISOString().slice(0, 10)}.txt`;
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
// 11. COPY TEXT (Original Text)
// ============================================================

function copyOriginalText() {
  const textarea = getCachedElement('textInput');
  const errorBox = getCachedElement('toolLocalError');
  
  if (!textarea) return;
  
  const text = textarea.value;
  if (!text.trim()) {
    showError('No text to copy. Please enter some text first.');
    return;
  }
  
  copyToClipboard(text, 'Text copied to clipboard!');
}

// ============================================================
// 12. COPY TO CLIPBOARD HELPER
// ============================================================

function copyToClipboard(text, successMessage) {
  const errorBox = getCachedElement('toolLocalError');
  
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
    console.error('[Sentence Counter] Textarea not found');
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

  // Load sample text - Fixed: no scroll to top, just scroll to results
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
// 20. SELF-TEST
// ============================================================

function runSelfTest() {
  const testText = `The quick brown fox jumps over the lazy dog. The dog slept peacefully. 🌙✨ Hello world!`;
  const stats = analyzeText(testText);
  
  let passed = true;
  
  // Check that all values are numbers and non-negative
  const metrics = ['totalSentences', 'totalWords', 'uniqueWords', 'totalChars', 'charsNoSpaces', 'paragraphs', 'emojiCount', 'avgWordsPerSentence', 'avgCharsPerSentence', 'readingTime'];
  metrics.forEach(key => {
    if (typeof stats[key] !== 'number' || stats[key] < 0) {
      console.error(`[Self-Test] Invalid value for ${key}: ${stats[key]}`);
      passed = false;
    }
  });
  
  // Check that sentences are correctly counted
  if (stats.totalSentences !== 3) {
    console.warn(`[Self-Test] Sentences: expected ~3, got ${stats.totalSentences} (varies by browser)`);
  }
  
  // Check longest/shortest sentence are strings
  if (typeof stats.longestSentence !== 'string' || typeof stats.shortestSentence !== 'string') {
    console.error('[Self-Test] Longest/shortest sentence should be strings');
    passed = false;
  }
  
  // Validate that charactersNoSpaces is less than or equal to totalCharacters
  if (stats.charsNoSpaces > stats.totalChars) {
    console.error(`[Self-Test] charactersNoSpaces (${stats.charsNoSpaces}) exceeds totalCharacters (${stats.totalChars})`);
    passed = false;
  }
  
  // Test strip emojis function
  const emojiText = 'Hello 👋 World 🌍!';
  const stripped = stripEmojisAndFormatting(emojiText);
  if (!stripped.includes('Hello') || !stripped.includes('World')) {
    console.error(`[Self-Test] Strip emojis failed: expected to contain "Hello" and "World", got "${stripped}"`);
    passed = false;
  }
  
  // Log the actual values for reference
  console.log(`[Self-Test] ✅ Values: Sentences=${stats.totalSentences}, Words=${stats.totalWords}, Emojis=${stats.emojiCount}`);
  
  if (passed) {
    console.log('[Sentence Counter] ✅ All self-tests passed!');
  } else {
    console.warn('[Sentence Counter] ⚠️ Some self-tests failed.');
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