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

          <div class="tool-custom-interface">
          
          <!-- Input Section with Inline Number Bar -->
          <div class="average-input-section">
            <div class="form-group-centered">
              <label for="numberInput" class="input-label">Enter a Number</label>
              <div class="input-with-button">
                <input type="number" id="numberInput" class="blue-select data-input-field" placeholder="Enter number" step="any">
                <button id="addBtn" class="first-btn">+ Add</button>
              </div>
            </div>

            <!-- Clear All Button -->
            <div class="clear-section">
              <button id="clearAllBtn" class="first-btn">Clear All</button>
            </div>
          </div>

          <!-- Number Tags -->
          <div id="numberTags" class="number-tags-container">
            <!-- Numbers will appear here as tags -->
          </div>

          <button id="calculateBtn" class="third-btn">Calculate Average</button>
          
          <div id="averageResultBox" class="result-box-card hidden">
            <h3 class="result-box-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" style="display:inline-block;margin-right:8px;vertical-align:middle;">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              Results
            </h3>
            <div class="average-metrics-grid">
              <div class="metric-output-block">
                <div class="metric-display-val" id="avgAverage">0</div>
                <div class="metric-display-lbl">Average</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="avgSum">0</div>
                <div class="metric-display-lbl">Sum</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="avgCount">0</div>
                <div class="metric-display-lbl">Count</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="avgMin">0</div>
                <div class="metric-display-lbl">Minimum</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="avgMax">0</div>
                <div class="metric-display-lbl">Maximum</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="avgMedian">0</div>
                <div class="metric-display-lbl">Median</div>
              </div>
            </div>
          </div>

          <div id="toolLocalError" class="local-error-alert hidden"></div>
        </div>

    `;



    /*
    ============================================
    TOOL LOGIC
    ============================================
    */


    initAverageLogic();



});


/**
 * Main Average Tool Logic
 */
function initAverageLogic() {
  const numberInput = document.getElementById('numberInput');
  const addBtn = document.getElementById('addBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const calculateBtn = document.getElementById('calculateBtn');
  const numberTags = document.getElementById('numberTags');
  const resultBox = document.getElementById('averageResultBox');
  const errorBox = document.getElementById('toolLocalError');

  const avgAverage = document.getElementById('avgAverage');
  const avgSum = document.getElementById('avgSum');
  const avgCount = document.getElementById('avgCount');
  const avgMin = document.getElementById('avgMin');
  const avgMax = document.getElementById('avgMax');
  const avgMedian = document.getElementById('avgMedian');

  if (
    !numberInput ||
    !addBtn ||
    !clearAllBtn ||
    !calculateBtn ||
    !numberTags
  ) {
    return;
  }

  const numbers = [];

  // ============================================
  // Helper Functions
  // ============================================

  function showError(message) {
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.remove('hidden');
    }

    if (resultBox) {
      resultBox.classList.add('hidden');
    }
  }

  function hideError() {
    if (errorBox) {
      errorBox.classList.add('hidden');
    }
  }

  function updateTags() {
    if (!numberTags) return;

    if (numbers.length === 0) {
      numberTags.innerHTML =
        '<span class="empty-tags-message">No numbers added yet. Add some numbers above.</span>';
      return;
    }

    numberTags.innerHTML = numbers
      .map(
        (num, index) => `
        <span class="number-tag">
          ${num}
          <button
            type="button"
            class="remove-tag"
            data-index="${index}"
            aria-label="Remove ${num}"
          >
            ✕
          </button>
        </span>
      `
      )
      .join('');
  }

  function removeNumber(index) {
    if (index < 0 || index >= numbers.length) return;

    numbers.splice(index, 1);
    updateTags();
    hideError();

    if (numbers.length === 0 && resultBox) {
      resultBox.classList.add('hidden');
    }
  }

  function clearAll() {
    numbers.length = 0;

    updateTags();
    hideError();

    if (resultBox) {
      resultBox.classList.add('hidden');
    }

    numberInput.value = '';
    numberInput.focus();
  }

  function addNumber() {
    const value = numberInput.value.trim();

    if (value === '') {
      showError('Please enter a number.');
      return;
    }

    const num = Number(value);

    if (!Number.isFinite(num)) {
      showError('Please enter a valid number.');
      return;
    }

    numbers.push(num);

    updateTags();
    hideError();

    numberInput.value = '';
    numberInput.focus();
  }

  function calculateAverage() {
    if (numbers.length === 0) {
      showError('Please add at least one number to calculate.');
      return;
    }

    hideError();

    const sorted = [...numbers].sort((a, b) => a - b);

    const sum = numbers.reduce((total, num) => total + num, 0);
    const count = numbers.length;
    const average = sum / count;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    let median;

    if (count % 2 === 0) {
      median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
    } else {
      median = sorted[Math.floor(count / 2)];
    }

    if (avgAverage) avgAverage.textContent = average.toFixed(2);
    if (avgSum) avgSum.textContent = sum.toFixed(2);
    if (avgCount) avgCount.textContent = count;
    if (avgMin) avgMin.textContent = min.toFixed(2);
    if (avgMax) avgMax.textContent = max.toFixed(2);
    if (avgMedian) avgMedian.textContent = median.toFixed(2);

    if (resultBox) {
      resultBox.classList.remove('hidden');

      setTimeout(() => {
        const targetOffset =
          resultBox.getBoundingClientRect().top +
          window.pageYOffset -
          120;

        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });
      }, 150);
    }
  }

  // ============================================
  // Event Listeners
  // ============================================

  addBtn.addEventListener('click', addNumber);

  numberInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNumber();
    }
  });

  clearAllBtn.addEventListener('click', clearAll);

  calculateBtn.addEventListener('click', function (e) {
    e.preventDefault();
    calculateAverage();
  });

  // Event Delegation for Remove Buttons
  numberTags.addEventListener('click', function (e) {
    const btn = e.target.closest('.remove-tag');

    if (!btn) return;

    const index = Number(btn.dataset.index);

    removeNumber(index);
  });

  // ============================================
  // Initial State
  // ============================================

  updateTags();
}