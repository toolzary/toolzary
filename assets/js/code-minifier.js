/**
 * Code Minifier - Complete Implementation
 * Properly removes ALL comments including HTML comments
 */
// ============================================================
// 2. DETECTION FUNCTIONS
// ============================================================

function detectLanguage(code) {
  if (!code || code.trim().length === 0) return 'text';
  
  const trimmed = code.trim();
  
  if (/^<!DOCTYPE\s+html/i.test(trimmed) || /<html[^>]*>/i.test(trimmed) || /<head[^>]*>/i.test(trimmed) || /<body[^>]*>/i.test(trimmed)) {
    return 'html';
  }
  
  if (/^@(import|media|keyframes|font-face|supports|charset|namespace)/i.test(trimmed) || 
      /^[.#][a-zA-Z_-][\w-]*\s*\{/.test(trimmed) ||
      /^[a-zA-Z_-][\w-]*\s*\{/.test(trimmed) ||
      /[a-zA-Z_-][\w-]*\s*:\s*[^;]+;/.test(trimmed)) {
    return 'css';
  }
  
  if (/^\{[\s\S]*\}$/.test(trimmed) || /^\[[\s\S]*\]$/.test(trimmed)) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch (e) {}
  }
  
  if (/^<\?xml/.test(trimmed) || /^<[a-zA-Z_-][\w-]*[^>]*>/.test(trimmed) && !/<html/i.test(trimmed)) {
    return 'xml';
  }
  
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TRUNCATE|MERGE|REPLACE)\s+/i.test(trimmed)) {
    return 'sql';
  }
  
  if (/^[a-zA-Z_$][\w$]*\s*[=:]\s*/.test(trimmed) ||
      /^function\s*[a-zA-Z_$][\w$]*\s*\(/.test(trimmed) ||
      /^const\s+[a-zA-Z_$][\w$]*\s*=/.test(trimmed) ||
      /^let\s+[a-zA-Z_$][\w$]*\s*=/.test(trimmed) ||
      /^var\s+[a-zA-Z_$][\w$]*\s*=/.test(trimmed) ||
      /^class\s+[a-zA-Z_$][\w$]*/.test(trimmed) ||
      /^import\s+/.test(trimmed) ||
      /^export\s+/.test(trimmed) ||
      /^\/\//.test(trimmed) ||
      /^\/\*/.test(trimmed) ||
      /console\.log/.test(trimmed) ||
      /=>/.test(trimmed)) {
    return 'javascript';
  }
  
  return 'text';
}

function getFileExtension(lang) {
  const map = {
    'html': 'html',
    'css': 'css',
    'javascript': 'js',
    'json': 'json',
    'xml': 'xml',
    'sql': 'sql',
    'text': 'txt'
  };
  return map[lang] || 'txt';
}

function getLanguageDisplay(lang) {
  const map = {
    'html': 'HTML',
    'css': 'CSS',
    'javascript': 'JavaScript',
    'json': 'JSON',
    'xml': 'XML',
    'sql': 'SQL',
    'text': 'Text'
  };
  return map[lang] || lang;
}

// ============================================================
// 3. MINIFICATION FUNCTIONS (FIXED - Removes ALL comments)
// ============================================================

function minifyHTML(code) {
  let result = code;
  
  // Step 1: Remove ALL HTML comments (including multi-line and conditional)
  // This removes <!-- comment --> anywhere in the HTML
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  
  // Step 2: Extract and process <style> tags separately
  // First, find all style tags and process their content
  result = result.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, function(match, styleContent) {
    // Remove CSS comments from inside style tags
    let cleanedStyle = styleContent.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove whitespace from CSS
    cleanedStyle = cleanedStyle.replace(/\s*\{\s*/g, '{');
    cleanedStyle = cleanedStyle.replace(/\s*\}\s*/g, '}');
    cleanedStyle = cleanedStyle.replace(/\s*:\s*/g, ':');
    cleanedStyle = cleanedStyle.replace(/\s*;\s*/g, ';');
    cleanedStyle = cleanedStyle.replace(/\s*,\s*/g, ',');
    cleanedStyle = cleanedStyle.replace(/\r?\n/g, '');
    cleanedStyle = cleanedStyle.replace(/\t/g, '');
    cleanedStyle = cleanedStyle.replace(/ /g, '');
    cleanedStyle = cleanedStyle.replace(/;}/g, '}');
    cleanedStyle = cleanedStyle.replace(/[^{]*\{\s*\}/g, '');
    cleanedStyle = cleanedStyle.trim();
    return `<style>${cleanedStyle}</style>`;
  });
  
  // Step 3: Extract and process <script> tags separately
  result = result.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function(match, scriptContent) {
    // Protect string literals
    let strings = [];
    let cleanedScript = scriptContent.replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, function(strMatch) {
      strings.push(strMatch);
      return `__STRING_${strings.length - 1}__`;
    });
    // Remove JS comments
    cleanedScript = cleanedScript.replace(/\/\/.*$/gm, '');
    cleanedScript = cleanedScript.replace(/\/\*[\s\S]*?\*\//g, '');
    // Restore strings
    cleanedScript = cleanedScript.replace(/__STRING_(\d+)__/g, function(strMatch, index) {
      return strings[parseInt(index)];
    });
    // Remove whitespace
    cleanedScript = cleanedScript.replace(/\r?\n/g, '');
    cleanedScript = cleanedScript.replace(/\t/g, '');
    cleanedScript = cleanedScript.replace(/\s*=\s*/g, '=');
    cleanedScript = cleanedScript.replace(/\s*\+\s*/g, '+');
    cleanedScript = cleanedScript.replace(/\s*-\s*/g, '-');
    cleanedScript = cleanedScript.replace(/\s*\*\s*/g, '*');
    cleanedScript = cleanedScript.replace(/\s*\/\s*/g, '/');
    cleanedScript = cleanedScript.replace(/\s*,\s*/g, ',');
    cleanedScript = cleanedScript.replace(/\s*;\s*/g, ';');
    cleanedScript = cleanedScript.replace(/\s*\{\s*/g, '{');
    cleanedScript = cleanedScript.replace(/\s*\}\s*/g, '}');
    cleanedScript = cleanedScript.replace(/\s*\(\s*/g, '(');
    cleanedScript = cleanedScript.replace(/\s*\)\s*/g, ')');
    cleanedScript = cleanedScript.replace(/ /g, '');
    cleanedScript = cleanedScript.replace(/;}/g, '}');
    cleanedScript = cleanedScript.trim();
    return `<script>${cleanedScript}</script>`;
  });
  
  // Step 4: Remove ALL whitespace between tags
  result = result.replace(/>\s+</g, '><');
  
  // Step 5: Remove ALL newlines and carriage returns
  result = result.replace(/\r?\n/g, '');
  
  // Step 6: Remove ALL tabs
  result = result.replace(/\t/g, '');
  
  // Step 7: Remove ALL multiple spaces
  result = result.replace(/ +/g, ' ');
  
  // Step 8: Remove spaces around attributes
  result = result.replace(/\s+([a-zA-Z_-][\w-]*)\s*=\s*"/g, ' $1="');
  
  // Step 9: Remove trailing spaces before >
  result = result.replace(/\s+>/g, '>');
  
  // Step 10: Remove ALL spaces inside text nodes
  result = result.replace(/>\s+/g, '>');
  result = result.replace(/\s+</g, '<');
  
  // Step 11: Remove spaces at start and end
  result = result.trim();
  
  return result;
}

function minifyCSS(code) {
  let result = code;
  
  // Remove ALL CSS comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove ALL newlines and carriage returns
  result = result.replace(/\r?\n/g, '');
  
  // Remove ALL tabs
  result = result.replace(/\t/g, '');
  
  // Remove ALL spaces around { } : ; ,
  result = result.replace(/\s*\{\s*/g, '{');
  result = result.replace(/\s*\}\s*/g, '}');
  result = result.replace(/\s*:\s*/g, ':');
  result = result.replace(/\s*;\s*/g, ';');
  result = result.replace(/\s*,\s*/g, ',');
  
  // Remove ALL spaces
  result = result.replace(/ /g, '');
  
  // Remove trailing semicolon before }
  result = result.replace(/;}/g, '}');
  
  // Remove empty rules
  result = result.replace(/[^{]*\{\s*\}/g, '');
  
  // Remove whitespace at start and end
  result = result.trim();
  
  return result;
}

function minifyJS(code) {
  let result = code;
  
  // Protect string literals
  let strings = [];
  result = result.replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, function(match) {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });
  
  // Remove ALL single-line comments
  result = result.replace(/\/\/.*$/gm, '');
  
  // Remove ALL multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Restore strings
  result = result.replace(/__STRING_(\d+)__/g, function(match, index) {
    return strings[parseInt(index)];
  });
  
  // Remove ALL newlines and carriage returns
  result = result.replace(/\r?\n/g, '');
  
  // Remove ALL tabs
  result = result.replace(/\t/g, '');
  
  // Remove ALL spaces around operators
  result = result.replace(/\s*=\s*/g, '=');
  result = result.replace(/\s*\+\s*/g, '+');
  result = result.replace(/\s*-\s*/g, '-');
  result = result.replace(/\s*\*\s*/g, '*');
  result = result.replace(/\s*\/\s*/g, '/');
  result = result.replace(/\s*,\s*/g, ',');
  result = result.replace(/\s*;\s*/g, ';');
  result = result.replace(/\s*>\s*/g, '>');
  result = result.replace(/\s*<\s*/g, '<');
  result = result.replace(/\s*===\s*/g, '===');
  result = result.replace(/\s*!==\s*/g, '!==');
  result = result.replace(/\s*&&\s*/g, '&&');
  result = result.replace(/\s*\|\|\s*/g, '||');
  result = result.replace(/\s*\+\+\s*/g, '++');
  result = result.replace(/\s*--\s*/g, '--');
  
  // Remove ALL spaces around brackets
  result = result.replace(/\s*\{\s*/g, '{');
  result = result.replace(/\s*\}\s*/g, '}');
  result = result.replace(/\s*\(\s*/g, '(');
  result = result.replace(/\s*\)\s*/g, ')');
  result = result.replace(/\s*\[\s*/g, '[');
  result = result.replace(/\s*\]\s*/g, ']');
  
  // Remove ALL spaces
  result = result.replace(/ /g, '');
  
  // Remove spaces after keywords
  result = result.replace(/return\s+/g, 'return');
  result = result.replace(/if\s*\(/g, 'if(');
  result = result.replace(/for\s*\(/g, 'for(');
  result = result.replace(/while\s*\(/g, 'while(');
  result = result.replace(/switch\s*\(/g, 'switch(');
  result = result.replace(/catch\s*\(/g, 'catch(');
  result = result.replace(/else\s*\{/g, 'else{');
  result = result.replace(/else\s+if/g, 'elseif');
  result = result.replace(/new\s+/g, 'new');
  
  // Remove semicolon before }
  result = result.replace(/;}/g, '}');
  
  // Remove whitespace at start and end
  result = result.trim();
  
  return result;
}

function minifyJSON(code) {
  try {
    const parsed = JSON.parse(code);
    return JSON.stringify(parsed);
  } catch (e) {
    let result = code;
    result = result.replace(/\r?\n/g, '');
    result = result.replace(/\t/g, '');
    result = result.replace(/ /g, '');
    result = result.trim();
    return result;
  }
}

function minifyXML(code) {
  let result = code;
  
  // Remove XML comments
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove ALL whitespace between tags
  result = result.replace(/>\s+</g, '><');
  
  // Remove ALL newlines and carriage returns
  result = result.replace(/\r?\n/g, '');
  
  // Remove ALL tabs
  result = result.replace(/\t/g, '');
  
  // Remove ALL spaces
  result = result.replace(/ /g, '');
  
  // Remove whitespace at start and end
  result = result.trim();
  
  return result;
}

function minifySQL(code) {
  let result = code;
  
  // Remove SQL comments (single line)
  result = result.replace(/--.*$/gm, '');
  
  // Remove SQL comments (multi-line)
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Remove ALL newlines and carriage returns
  result = result.replace(/\r?\n/g, '');
  
  // Remove ALL tabs
  result = result.replace(/\t/g, '');
  
  // Remove ALL spaces
  result = result.replace(/ /g, '');
  
  // Remove whitespace around operators
  result = result.replace(/\s*=\s*/g, '=');
  result = result.replace(/\s*,\s*/g, ',');
  result = result.replace(/\s*\(\s*/g, '(');
  result = result.replace(/\s*\)\s*/g, ')');
  result = result.replace(/\s*>\s*/g, '>');
  result = result.replace(/\s*<\s*/g, '<');
  
  // Remove whitespace at start and end
  result = result.trim();
  
  return result;
}

function minifyCode(code, lang) {
  if (!code || code.trim().length === 0) {
    return { minified: '', error: 'No code to minify' };
  }
  
  const detectedLang = lang || detectLanguage(code);
  let minified = '';
  
  switch (detectedLang) {
    case 'html':
      minified = minifyHTML(code);
      break;
    case 'css':
      minified = minifyCSS(code);
      break;
    case 'javascript':
      minified = minifyJS(code);
      break;
    case 'json':
      minified = minifyJSON(code);
      break;
    case 'xml':
      minified = minifyXML(code);
      break;
    case 'sql':
      minified = minifySQL(code);
      break;
    default:
      minified = code.replace(/\r?\n/g, '').replace(/\t/g, '').replace(/ /g, '').trim();
  }
  
  const originalLines = code.split('\n').length;
  const minifiedLines = minified.split('\n').length;
  
  return {
    minified: minified,
    lang: detectedLang,
    originalSize: code.length,
    minifiedSize: minified.length,
    saved: code.length - minified.length,
    savedPercent: code.length > 0 ? ((code.length - minified.length) / code.length * 100) : 0,
    originalLines: originalLines,
    minifiedLines: minifiedLines,
    linesSaved: originalLines - minifiedLines
  };
}

// ============================================================
// 4. HISTORY MANAGEMENT
// ============================================================

function getHistory() {
  try {
    const data = localStorage.getItem('minifierHistory');
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
  localStorage.setItem('minifierHistory', JSON.stringify(history));
  return history;
}

function clearHistory() {
  localStorage.removeItem('minifierHistory');
}

function deleteHistoryItem(id) {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem('minifierHistory', JSON.stringify(filtered));
  return filtered;
}

// ============================================================
// 5. MAIN TOOL LOGIC
// ============================================================

function initMinifier() {
  const codeInput = document.getElementById('codeInput');
  const minifyBtn = document.getElementById('minifyBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const copyText = document.getElementById('copyText');
  const downloadBtn = document.getElementById('downloadBtn');
  const historyToggleBtn = document.getElementById('historyToggleBtn');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  
  const resultBox = document.getElementById('minifyResultBox');
  const minifiedOutput = document.getElementById('minifiedOutput');
  const validationStatus = document.getElementById('validationStatus');
  const errorBox = document.getElementById('toolLocalError');
  const detectedLang = document.getElementById('detectedLang');
  const codeStats = document.getElementById('codeStats');
  const historyList = document.getElementById('historyList');
  const historySection = document.getElementById('historySection');
  
  const originalSize = document.getElementById('originalSize');
  const minifiedSize = document.getElementById('minifiedSize');
  const savedPercent = document.getElementById('savedPercent');
  const lineCount = document.getElementById('lineCount');

  let currentResult = null;
  let historyVisible = false;

  if (!codeInput || !minifyBtn) return;

  // ===== Helper Functions =====

  function updateStats(text) {
    if (codeStats) {
      const chars = text.length;
      const lines = text.split('\n').length;
      const lang = detectLanguage(text);
      codeStats.textContent = `Characters: ${chars} | Lines: ${lines} | ${getLanguageDisplay(lang)}`;
    }
    if (detectedLang) {
      const lang = detectLanguage(text);
      detectedLang.textContent = `🔍 ${getLanguageDisplay(lang)}`;
    }
  }

  function showError(message) {
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.remove('hidden');
      errorBox.style.background = 'rgba(239, 68, 68, 0.1)';
      errorBox.style.color = '#ef4444';
      errorBox.style.borderColor = 'rgba(239, 68, 68, 0.2)';
    }
  }

  function showSuccess(message) {
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.remove('hidden');
      errorBox.style.background = 'rgba(16, 185, 129, 0.1)';
      errorBox.style.color = '#10b981';
      errorBox.style.borderColor = 'rgba(16, 185, 129, 0.2)';
      setTimeout(() => {
        errorBox.classList.add('hidden');
      }, 3000);
    }
  }

  function hideError() {
    if (errorBox) {
      errorBox.classList.add('hidden');
    }
  }

  function clearValidation() {
    if (validationStatus) {
      validationStatus.textContent = '';
      validationStatus.className = 'validation-status';
    }
  }

  function showValidation(isValid, message, type = 'valid') {
    if (validationStatus) {
      validationStatus.textContent = message;
      validationStatus.className = `validation-status ${type}`;
    }
  }

  function scrollToResult() {
    if (resultBox) {
      setTimeout(() => {
        const targetOffset = resultBox.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });
      }, 150);
    }
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  // ===== Auto-Expand Function =====
  function autoExpand() {
    if (codeInput) {
      codeInput.style.height = 'auto';
      codeInput.style.height = Math.min(codeInput.scrollHeight, 600) + 'px';
    }
  }

  // ===== Core Functions =====

  function performMinify() {
    const input = codeInput.value;
    if (!input || input.trim().length === 0) {
      showError('Please paste some code to minify.');
      if (resultBox) resultBox.classList.add('hidden');
      return;
    }
    
    hideError();
    clearValidation();
    
    const lang = detectLanguage(input);
    const result = minifyCode(input, lang);
    currentResult = result;
    
    if (result.error) {
      showError(result.error);
      return;
    }
    
    // Update output
    if (minifiedOutput) {
      minifiedOutput.textContent = result.minified;
    }
    
    // Update stats with accurate byte sizes
    const originalBytes = new Blob([input]).size;
    const minifiedBytes = new Blob([result.minified]).size;
    
    if (originalSize) originalSize.textContent = formatBytes(originalBytes);
    if (minifiedSize) minifiedSize.textContent = formatBytes(minifiedBytes);
    if (savedPercent) {
      const saved = originalBytes - minifiedBytes;
      const savedPercentValue = originalBytes > 0 ? (saved / originalBytes * 100) : 0;
      savedPercent.textContent = savedPercentValue > 0 ? `${savedPercentValue.toFixed(1)}%` : '0%';
      savedPercent.style.color = savedPercentValue > 10 ? '#22c55e' : 'var(--primary)';
    }
    if (lineCount) {
      const saved = result.linesSaved;
      lineCount.textContent = saved > 0 ? `-${saved}` : '0';
      lineCount.style.color = saved > 0 ? '#22c55e' : 'var(--text-secondary)';
    }
    
    // Show result box and auto-scroll
    if (resultBox) {
      resultBox.classList.remove('hidden');
      scrollToResult();
    }
    
    // Update detection
    if (detectedLang) {
      detectedLang.textContent = `🔍 ${getLanguageDisplay(result.lang)}`;
    }
    
    // Show validation
    const savedPercentValue = result.originalSize > 0 ? (result.saved / result.originalSize * 100) : 0;
    showValidation(true, `✅ Minified ${getLanguageDisplay(result.lang)} successfully! Saved ${savedPercentValue.toFixed(1)}%`, 'valid');
    
    // Save to history
    saveHistoryItem({
      lang: result.lang,
      originalCode: input,
      minifiedCode: result.minified,
      originalSize: originalBytes,
      minifiedSize: minifiedBytes,
      savedPercent: savedPercentValue
    });
    
    // Update history display
    renderHistory();
    
    showSuccess(`✅ Minified! Saved ${savedPercentValue.toFixed(1)}%`);
  }

  function clearAll() {
    codeInput.value = '';
    if (minifiedOutput) minifiedOutput.textContent = '';
    if (resultBox) resultBox.classList.add('hidden');
    clearValidation();
    hideError();
    updateStats('');
    currentResult = null;
    
    if (copyBtn) {
      copyBtn.classList.remove('copied');
      if (copyText) copyText.textContent = 'Copy';
    }
    
    codeInput.focus();
    autoExpand();
  }

  function copyMinified() {
    let outputText = '';
    if (minifiedOutput) {
      outputText = minifiedOutput.textContent || '';
    }
    
    if (!outputText) {
      showError('Nothing to copy. Minify some code first.');
      return;
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(outputText).then(() => {
        copyBtn.classList.add('copied');
        if (copyText) copyText.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyText) copyText.textContent = 'Copy';
        }, 2000);
        showSuccess('✅ Copied to clipboard!');
      }).catch(() => {
        fallbackCopy(outputText);
      });
    } else {
      fallbackCopy(outputText);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      copyBtn.classList.add('copied');
      if (copyText) copyText.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        if (copyText) copyText.textContent = 'Copy';
      }, 2000);
      showSuccess('✅ Copied to clipboard!');
    } catch (err) {
      showError('Failed to copy. Please copy manually.');
    }
    
    document.body.removeChild(textArea);
  }

  function downloadMinified() {
    let outputText = '';
    let extension = 'txt';
    let filename = 'minified';
    
    if (minifiedOutput) {
      outputText = minifiedOutput.textContent || '';
    }
    
    if (!outputText) {
      showError('Nothing to download. Minify some code first.');
      return;
    }
    
    const lang = currentResult ? currentResult.lang : detectLanguage(codeInput.value);
    extension = getFileExtension(lang);
    
    // Check if it's minified or formatted (single line = minified, multiple lines = formatted)
    const hasNewlines = outputText.includes('\n');
    const hasIndentation = outputText.includes('  ') || outputText.includes('\t');
    
    if (hasNewlines && hasIndentation) {
      filename = `formatted.${extension}`;
    } else {
      filename = `minified.${extension}`;
    }
    
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess(`✅ Downloaded as ${filename}`);
  }

  function toggleHistory() {
    historyVisible = !historyVisible;
    if (historySection) {
      historySection.classList.toggle('hidden');
    }
    if (historyVisible) {
      renderHistory();
    }
  }

  function renderHistory() {
    if (!historyList) return;
    
    const history = getHistory();
    
    if (history.length === 0) {
      historyList.innerHTML = '<p class="empty-history">No minification history yet.</p>';
      return;
    }
    
    historyList.innerHTML = history.map(item => `
      <div class="history-item">
        <div class="history-item-info">
          <span class="history-item-lang">${getLanguageDisplay(item.lang)}</span>
          <span class="history-item-size">${formatBytes(item.originalSize)} → ${formatBytes(item.minifiedSize)} (${item.savedPercent.toFixed(1)}% saved)</span>
          <span class="history-item-time">${new Date(item.timestamp).toLocaleString()}</span>
        </div>
        <div class="history-item-actions">
          <button class="history-btn" onclick="restoreHistoryItem(${item.id})">↻ Restore</button>
          <button class="history-btn danger" onclick="deleteHistoryItemUI(${item.id})">✕</button>
        </div>
      </div>
    `).join('');
  }

  // Global functions for history buttons
  window.restoreHistoryItem = function(id) {
    const history = getHistory();
    const item = history.find(h => h.id === id);
    if (item) {
      codeInput.value = item.originalCode;
      updateStats(item.originalCode);
      performMinify();
      if (historySection) historySection.classList.add('hidden');
      historyVisible = false;
    }
  };

  window.deleteHistoryItemUI = function(id) {
    deleteHistoryItem(id);
    renderHistory();
  };

  // ===== Event Listeners =====

  if (minifyBtn) minifyBtn.addEventListener('click', performMinify);
  if (clearBtn) clearBtn.addEventListener('click', clearAll);
  if (copyBtn) copyBtn.addEventListener('click', copyMinified);
  if (downloadBtn) downloadBtn.addEventListener('click', downloadMinified);
  if (historyToggleBtn) historyToggleBtn.addEventListener('click', toggleHistory);
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all history?')) {
        clearHistory();
        renderHistory();
        showSuccess('✅ History cleared!');
      }
    });
  }

  // Auto-detect on input with auto-expand
  let minifyTimeout;
  codeInput.addEventListener('input', () => {
    clearTimeout(minifyTimeout);
    const text = codeInput.value;
    updateStats(text);
    autoExpand();
    
    if (text.trim() === '') {
      clearAll();
      return;
    }
    
    // Auto-minify after typing stops (500ms delay)
    minifyTimeout = setTimeout(() => {
      performMinify();
    }, 500);
  });

  // Keyboard shortcuts
  codeInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      performMinify();
    }
    if (e.key === 'Escape') {
      clearAll();
    }
  });

  // Auto-minify on paste
  codeInput.addEventListener('paste', () => {
    setTimeout(() => {
      if (codeInput.value.trim()) {
        updateStats(codeInput.value);
        autoExpand();
      }
    }, 100);
  });

  // Initialize
  updateStats('');
  renderHistory();
  setTimeout(autoExpand, 100);

  const history = getHistory();
  if (history.length > 0 && historySection) {
    historySection.classList.add('hidden');
    historyVisible = false;
  }
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
  initMinifier();
});



















