// ============================================
// JSON FORMATTER - COMPLETE FIXED VERSION
// FIXES: No auto-scroll on typing, only on Enter
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // The root app.js automatically handles:
  // - Tool icon & category setup
  // - Related tools rendering (using JSON data)
  // - Search hijacking
  // - Year in footer
  
  // We just need to initialize our tool's specific logic
  initJSONLogic();
});

/**
 * Syntax Highlight JSON
 * FIXED: Better regex to avoid double-highlighting
 */
function highlightJSON(json) {
  const jsonString = JSON.stringify(json, null, 2);
  
  // Escape HTML entities
  let highlighted = jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Highlight keys (with quotes, followed by colon)
  highlighted = highlighted.replace(
    /"([^"]+)"(?=\s*:)/g,
    '<span class="json-key">"$1"</span>'
  );
  
  // Highlight string values (but not keys)
  highlighted = highlighted.replace(
    /: "([^"]*)"/g,
    ': <span class="json-string">"$1"</span>'
  );
  
  // Highlight numbers (including decimals)
  highlighted = highlighted.replace(
    /: (\d+\.?\d*)/g,
    ': <span class="json-number">$1</span>'
  );
  
  // Highlight booleans
  highlighted = highlighted.replace(
    /\b(true|false)\b/g,
    '<span class="json-boolean">$1</span>'
  );
  
  // Highlight null
  highlighted = highlighted.replace(
    /\bnull\b/g,
    '<span class="json-null">null</span>'
  );
  
  return highlighted;
}

/**
 * Main JSON Tool Logic - FIXED VERSION
 */
function initJSONLogic() {
  const jsonInput = document.getElementById('jsonInput');
  const jsonOutput = document.getElementById('jsonOutput');
  const validationStatus = document.getElementById('validationStatus');
  const jsonStats = document.getElementById('jsonStats');
  const resultBox = document.getElementById('jsonResultBox');
  const errorBox = document.getElementById('toolLocalError');
  
  const formatBtn = document.getElementById('formatBtn');
  const minifyBtn = document.getElementById('minifyBtn');
  const validateBtn = document.getElementById('validateBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const copyText = document.getElementById('copyText');
  const downloadBtn = document.getElementById('downloadBtn');

  if (!jsonInput) {
    console.error('JSON Input not found');
    return;
  }

  // Track if user explicitly requested action
  let userRequestedAction = false;

  // ===== Helper Functions =====

  function updateStats(text) {
    if (jsonStats) {
      const chars = text.length;
      // Count non-empty lines
      const lines = text ? text.split('\n').filter(line => line.trim() !== '').length : 0;
      jsonStats.textContent = `Characters: ${chars} | Lines: ${lines}`;
    }
  }

  function showError(message) {
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.remove('hidden');
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

  function showValidation(isValid, message) {
    if (validationStatus) {
      validationStatus.textContent = message;
      validationStatus.className = `validation-status ${isValid ? 'valid' : 'invalid'}`;
    }
  }

  /**
   * FIXED: Scroll to result ONLY when user explicitly requests
   * (Format button, Validate button, or Enter key)
   */
  function scrollToResult(shouldScroll = false) {
    if (!shouldScroll) return;
    
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

  // ===== Core Functions =====

  function displayJSON(json, isMinified = false, shouldScroll = false) {
    try {
      const parsed = typeof json === 'string' ? JSON.parse(json) : json;
      const jsonString = isMinified ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2);
      
      if (jsonOutput) {
        if (isMinified) {
          jsonOutput.textContent = jsonString;
        } else {
          jsonOutput.innerHTML = highlightJSON(parsed);
        }
        jsonOutput.style.display = 'block';
      }
      
      if (resultBox) {
        resultBox.classList.remove('hidden');
      }
      
      showValidation(true, '✅ Valid JSON');
      hideError();
      updateStats(jsonString);
      
      // ✅ ONLY scroll if user requested it
      scrollToResult(shouldScroll);
      
      return parsed;
    } catch (e) {
      showError(`❌ Invalid JSON: ${e.message}`);
      showValidation(false, `❌ Invalid JSON: ${e.message}`);
      return null;
    }
  }

  function formatJSON() {
    const input = jsonInput.value.trim();
    if (!input) {
      showError('Please enter some JSON to format.');
      return;
    }
    // ✅ Scroll on format button click
    displayJSON(input, false, true);
  }

  function minifyJSON() {
    const input = jsonInput.value.trim();
    if (!input) {
      showError('Please enter some JSON to minify.');
      return;
    }
    // ✅ Scroll on minify button click
    displayJSON(input, true, true);
  }

  function validateJSON() {
    const input = jsonInput.value.trim();
    if (!input) {
      showError('Please enter some JSON to validate.');
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      showValidation(true, '✅ Valid JSON! Your JSON syntax is correct.');
      hideError();
      
      // Show preview in output
      if (jsonOutput) {
        jsonOutput.innerHTML = highlightJSON(parsed);
        jsonOutput.style.display = 'block';
      }
      if (resultBox) {
        resultBox.classList.remove('hidden');
      }
      
      // ✅ Scroll on validate button click
      scrollToResult(true);
    } catch (e) {
      showValidation(false, `❌ Invalid JSON: ${e.message}`);
      showError(`Invalid JSON: ${e.message}`);
    }
  }

  function clearAll() {
    jsonInput.value = '';
    if (jsonOutput) {
      jsonOutput.innerHTML = '';
      jsonOutput.style.display = 'none';
    }
    if (resultBox) {
      resultBox.classList.add('hidden');
    }
    if (validationStatus) {
      validationStatus.textContent = '';
      validationStatus.className = 'validation-status';
    }
    hideError();
    updateStats('');
    
    // Reset copy button
    if (copyBtn) {
      copyBtn.classList.remove('copied');
      if (copyText) copyText.textContent = 'Copy';
    }
  }

  function copyJSON() {
    // Get output text from either textContent or innerHTML
    let outputText = '';
    if (jsonOutput) {
      // If it has highlighted HTML, get the text content
      outputText = jsonOutput.textContent || '';
    }
    
    if (!outputText) {
      showError('Nothing to copy. Format or validate JSON first.');
      return;
    }
    
    // Try clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(outputText).then(() => {
        copyBtn.classList.add('copied');
        if (copyText) copyText.textContent = 'Copied!';
        
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyText) copyText.textContent = 'Copy';
        }, 2000);
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
    } catch (err) {
      showError('Failed to copy. Please copy manually.');
    }
    
    document.body.removeChild(textArea);
  }

  function downloadJSON() {
    let outputText = '';
    let filename = 'formatted.json';
    
    if (jsonOutput) {
      outputText = jsonOutput.textContent || '';
    }
    
    if (!outputText) {
      showError('Nothing to download. Format or validate JSON first.');
      return;
    }
    
    // Check if the output is minified (single line with no indentation)
    const isMinified = !outputText.includes('\n') && outputText.includes('{');
    
    // Set filename based on content
    if (isMinified) {
      filename = 'minified.json';
    } else {
      filename = 'formatted.json';
    }
    
    const blob = new Blob([outputText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ===== Event Listeners =====

  // Button clicks
  if (formatBtn) formatBtn.addEventListener('click', formatJSON);
  if (minifyBtn) minifyBtn.addEventListener('click', minifyJSON);
  if (validateBtn) validateBtn.addEventListener('click', validateJSON);
  if (clearBtn) clearBtn.addEventListener('click', clearAll);
  if (copyBtn) copyBtn.addEventListener('click', copyJSON);
  if (downloadBtn) downloadBtn.addEventListener('click', downloadJSON);

  /**
   * ✅ FIXED: Only validate on paste, NO scrolling
   * Don't auto-format or scroll, just show validation status
   */
  jsonInput.addEventListener('paste', () => {
    setTimeout(() => {
      const input = jsonInput.value.trim();
      if (input) {
        try {
          JSON.parse(input);
          showValidation(true, '✅ Valid JSON');
          hideError();
          updateStats(input);
        } catch (e) {
          showValidation(false, `❌ Invalid JSON: ${e.message}`);
        }
      }
    }, 100);
  });

  /**
   * ✅ FIXED: Update stats on input, NO scrolling
   */
  jsonInput.addEventListener('input', () => {
    const input = jsonInput.value.trim();
    updateStats(jsonInput.value);
    
    // Don't clear on empty - let user decide
    if (input === '') {
      clearValidation();
      hideError();
    }
  });

  /**
   * ✅ FIXED: Keyboard shortcuts
   * - Ctrl+Enter: Format (WITH scroll)
   * - Escape: Clear (NO scroll)
   */
  jsonInput.addEventListener('keydown', (e) => {
    // Ctrl+Enter to format - ✅ WITH scroll
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      formatJSON(); // formatJSON includes scroll
    }
    
    // Shift+Enter to minify - ✅ WITH scroll
    if (e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      minifyJSON(); // minifyJSON includes scroll
    }
    
    // Escape to clear - ✅ NO scroll
    if (e.key === 'Escape') {
      clearAll();
    }
  });

  // Initialize stats
  updateStats('');
  
  console.log('🚀 JSON Formatter loaded successfully!');
  console.log('📌 Shortcuts: Ctrl+Enter=Format, Shift+Enter=Minify, Escape=Clear');
}



















