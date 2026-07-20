// ============================================
// JSON FORMATTER - FIXED VERSION
// Keeps existing UI, IDs, and behavior
// Fixes: highlighting, copy, download, stats,
// validation, edge cases
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  initJSONLogic();
});


/**
 * Improved JSON Syntax Highlighting
 * Handles:
 * - escaped quotes
 * - arrays
 * - negative numbers
 * - decimals
 * - booleans
 * - null
 */
function highlightJSON(json) {
  const jsonString = JSON.stringify(json, null, 2);

  const escaped = jsonString
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');


  return escaped.replace(
    /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")(\s*:)|("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false)\b|\bnull\b/g,
    function(match, key, keyContent, keyValue, stringValue, stringContent, number, bool) {


      // JSON keys
      if (key) {
        return `<span class="json-key">${key}</span>:`;
      }


      // JSON strings
      if (stringValue) {
        return `<span class="json-string">${stringValue}</span>`;
      }


      // Numbers
      if (number) {
        return `<span class="json-number">${number}</span>`;
      }


      // Boolean
      if (bool) {
        return `<span class="json-boolean">${bool}</span>`;
      }


      // Null
      if (match === 'null') {
        return `<span class="json-null">null</span>`;
      }


      return match;
    }
  );
}


/**
 * Main JSON Formatter Logic
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
  const resultTitle = document.querySelector('.result-box-title');


  if (!jsonInput) {
    console.error('JSON Input not found');
    return;
  }


  let lastOutputMode = 'formatted';
  let scrollTimer = null;


  // =========================
  // Helpers
  // =========================


  function updateStats(text) {

    if (!jsonStats) return;

    const chars = text.length;

    const lines = text
      ? text.split('\n').filter(line => line.trim()).length
      : 0;

    jsonStats.textContent =
      `Characters: ${chars} | Lines: ${lines}`;
  }

  function updateResultTitle(title) {
  if (resultTitle) {
    resultTitle.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" 
      fill="none" stroke="var(--primary)" stroke-width="2"
      style="display:inline-block;margin-right:8px;vertical-align:middle;">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
      ${title}
    `;
  }
}

  function showError(message) {

    if (!errorBox) return;

    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
  }


  function hideError() {

    if (!errorBox) return;

    errorBox.classList.add('hidden');
  }


  function clearValidation() {

    if (!validationStatus) return;

    validationStatus.textContent = '';
    validationStatus.className = 'validation-status';
  }


  function showValidation(valid, message) {

    if (!validationStatus) return;

    validationStatus.textContent = message;

    validationStatus.className =
      `validation-status ${valid ? 'valid' : 'invalid'}`;
  }

  function autoResizeTextarea() {
  jsonInput.style.height = 'auto';
  jsonInput.style.height = jsonInput.scrollHeight + 'px';
  }

  function scrollToResult(enable = false) {

    if (!enable || !resultBox) return;

    clearTimeout(scrollTimer);

    scrollTimer = setTimeout(() => {

      const position =
        resultBox.getBoundingClientRect().top +
        window.pageYOffset -
        120;

      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });

    }, 150);
  }
    // =========================
  // Core Functions
  // =========================


  function displayJSON(json, isMinified = false, shouldScroll = false) {

    try {

      const parsed =
        typeof json === 'string'
          ? JSON.parse(json)
          : json;


      const jsonString =
        isMinified
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, 2);


      lastOutputMode =
        isMinified ? 'minified' : 'formatted';
        updateResultTitle(
  isMinified 
    ? 'Minified JSON'
    : 'Formatted JSON'
);


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


      scrollToResult(shouldScroll);


      return parsed;


    } catch (error) {


      showValidation(
        false,
        `❌ Invalid JSON: ${error.message}`
      );


      showError(
        `❌ Invalid JSON: ${error.message}`
      );


      return null;
    }
  }



  function formatJSON() {

    const input =
      jsonInput.value.trim();


    if (!input) {

      showError(
        'Please enter some JSON to format.'
      );

      return;
    }


    displayJSON(
      input,
      false,
      true
    );
  }



  function minifyJSON() {

    const input =
      jsonInput.value.trim();


    if (!input) {

      showError(
        'Please enter some JSON to minify.'
      );

      return;
    }


    displayJSON(
      input,
      true,
      true
    );
  }



  function validateJSON() {

  const input = jsonInput.value.trim();


  if (!input) {

    showError(
      'Please enter some JSON to validate.'
    );

    return;
  }


  try {

    JSON.parse(input);


    showValidation(
      true,
      '✅ Valid JSON! Your JSON syntax is correct.'
    );


    hideError();


    updateResultTitle(
      'JSON Validation'
    );


    if (resultBox) {
      resultBox.classList.remove('hidden');
    }


    scrollToResult(true);


  } catch(error) {


    showValidation(
      false,
      `❌ Invalid JSON: ${error.message}`
    );


    showError(
      `Invalid JSON: ${error.message}`
    );

  }

}



  function clearAll() {

    jsonInput.value = '';


    if (jsonOutput) {

      jsonOutput.innerHTML = '';

      jsonOutput.style.display =
        'none';
    }


    if (resultBox) {

      resultBox.classList.add(
        'hidden'
      );
    }


    clearValidation();


    hideError();


    updateStats('');


    lastOutputMode =
      'formatted';


    if (copyBtn) {

      copyBtn.classList.remove(
        'copied'
      );
    }


    if (copyText) {

      copyText.textContent =
        'Copy Results';
    }


    jsonInput.focus();
  }
    // =========================
  // Copy Functions
  // =========================


  function copyJSON() {

    if (!jsonOutput) return;


    const outputText =
      jsonOutput.textContent.trim();


    if (!outputText) {

      showError(
        'Nothing to copy. Format or validate JSON first.'
      );

      return;
    }


    if (
      navigator.clipboard &&
      navigator.clipboard.writeText
    ) {

      navigator.clipboard
        .writeText(outputText)
        .then(() => {

          showCopied();

        })
        .catch(() => {

          fallbackCopy(outputText);

        });

    } else {

      fallbackCopy(outputText);

    }
  }



  function showCopied() {

    if (!copyBtn) return;


    copyBtn.classList.add(
      'copied'
    );


    if (copyText) {

      copyText.textContent =
        'Copied!';
    }


    setTimeout(() => {

      copyBtn.classList.remove(
        'copied'
      );


      if (copyText) {

        copyText.textContent =
          'Copy Results';
      }


    }, 2000);
  }



  function fallbackCopy(text) {

    const textarea =
      document.createElement('textarea');


    textarea.value =
      text;


    textarea.style.position =
      'fixed';

    textarea.style.opacity =
      '0';


    document.body.appendChild(
      textarea
    );


    textarea.select();


    try {

      document.execCommand(
        'copy'
      );


      showCopied();


    } catch (error) {


      showError(
        'Failed to copy. Please copy manually.'
      );

    }


    document.body.removeChild(
      textarea
    );
  }



  // =========================
  // Download Function
  // =========================


  function downloadJSON() {

    if (!jsonOutput) return;


    const outputText =
      jsonOutput.textContent.trim();


    if (!outputText) {

      showError(
        'Nothing to download. Format or validate JSON first.'
      );

      return;
    }


    const filename =
      lastOutputMode === 'minified'
        ? 'minified.json'
        : 'formatted.json';



    const blob =
      new Blob(
        [outputText],
        {
          type: 'application/json'
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement('a');


    link.href =
      url;


    link.download =
      filename;


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      url
    );
  }



  // =========================
  // Event Listeners
  // =========================


  if (formatBtn) {

    formatBtn.addEventListener(
      'click',
      formatJSON
    );
  }


  if (minifyBtn) {

    minifyBtn.addEventListener(
      'click',
      minifyJSON
    );
  }


  if (validateBtn) {

    validateBtn.addEventListener(
      'click',
      validateJSON
    );
  }


  if (clearBtn) {

    clearBtn.addEventListener(
      'click',
      clearAll
    );
  }


  if (copyBtn) {

    copyBtn.addEventListener(
      'click',
      copyJSON
    );
  }


  if (downloadBtn) {

    downloadBtn.addEventListener(
      'click',
      downloadJSON
    );
  }
  // =========================
  // Input Events
  // =========================


  // Validate after paste only
  // No auto-format and no scrolling

  jsonInput.addEventListener(
    'paste',
    () => {

      setTimeout(() => {

        const input =
          jsonInput.value.trim();


        if (!input) return;


        try {

          JSON.parse(input);


          showValidation(
            true,
            '✅ Valid JSON'
          );


          hideError();


        } catch (error) {


          showValidation(
            false,
            `❌ Invalid JSON: ${error.message}`
          );

        }


        updateStats(
          jsonInput.value
        );


      }, 100);

    }
  );



  // Update character and line count while typing

  jsonInput.addEventListener('input', () => {

  const input = jsonInput.value.trim();

  updateStats(jsonInput.value);

  autoResizeTextarea();

  if (input === '') {
    clearValidation();
    hideError();
  }

});



  // =========================
  // Keyboard Shortcuts
  // =========================

  jsonInput.addEventListener(
    'keydown',
    (event) => {


      // Ctrl + Enter = Format

      if (
        event.ctrlKey &&
        event.key === 'Enter'
      ) {

        event.preventDefault();

        formatJSON();

      }



      // Shift + Enter = Minify

      if (
        event.shiftKey &&
        event.key === 'Enter'
      ) {

        event.preventDefault();

        minifyJSON();

      }



      // Escape = Clear

      if (
        event.key === 'Escape'
      ) {

        clearAll();

      }

    }
  );



  // =========================
  // Initial State
  // =========================


  updateStats('');
  autoResizeTextarea();


  console.log(
    '🚀 JSON Formatter loaded successfully!'
  );


  console.log(
    '📌 Shortcuts: Ctrl+Enter=Format, Shift+Enter=Minify, Escape=Clear'
  );

}