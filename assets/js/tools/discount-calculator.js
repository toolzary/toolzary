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
          
          <!-- Discount Type Tabs -->
          <div class="discount-tabs">
            <button class="discount-tab active" data-tab="percent-off">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-right:6px;vertical-align:middle;">
                <polyline points="4 7 4 4 20 4 20 7"/>
                <line x1="9" y1="20" x2="15" y2="20"/>
                <line x1="12" y1="4" x2="12" y2="20"/>
              </svg>
              % Off
            </button>
            <button class="discount-tab" data-tab="amount-off">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-right:6px;vertical-align:middle;">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <line x1="16" y1="21" x2="16" y2="7"/>
              </svg>
              Amount Off
            </button>
          </div>

          <!-- Tab 1: Percent Off -->
          <div class="discount-tab-content active" id="tab-percent-off">
            <div class="form-group">
              <label class="input-label">Calculate Discount</label>
              <div class="discount-input-group">
                <div class="discount-input-row">
                  <label>Original Price</label>
                  <input type="number" id="percentOriginalPrice" class="data-input-field" placeholder="100" min="0" step="0.01">
                </div>
                <div class="discount-input-row">
                  <label>Discount (%)</label>
                  <input type="number" id="percentDiscount" class="data-input-field" placeholder="25" min="0" max="100" step="0.01">
                </div>
              </div>
            </div>
          </div>

          <!-- Tab 2: Amount Off -->
          <div class="discount-tab-content" id="tab-amount-off">
            <div class="form-group">
              <label class="input-label">Calculate Discount</label>
              <div class="discount-input-group">
                <div class="discount-input-row">
                  <label>Original Price</label>
                  <input type="number" id="amountOriginalPrice" class="data-input-field" placeholder="100" min="0" step="0.01">
                </div>
                <div class="discount-input-row">
                  <label>Discount Amount</label>
                  <input type="number" id="amountDiscount" class="data-input-field" placeholder="20" min="0" step="0.01">
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-button-group">
            <button id="calculateBtn" class="third-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-right:6px;vertical-align:middle;">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Calculate
            </button>
          </div>

          <!-- Results -->
          <div id="discountResultBox" class="result-box-card hidden">
  <h3 class="result-box-title">
    <object data="assets/icons/discount-calculator.svg" type="image/svg+xml" style="width:20px;height:20px;display:inline-block;margin-right:8px;vertical-align:middle;"></object>
    Discount Results
  </h3>
  <!-- rest of result box -->
            <div class="discount-metrics-grid">
              <div class="metric-output-block">
                <div class="metric-display-val" id="finalPrice">0.00</div>
                <div class="metric-display-lbl">Final Price</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="savings">0.00</div>
                <div class="metric-display-lbl">You Save</div>
              </div>
              <div class="metric-output-block">
                <div class="metric-display-val" id="discountPercent">0%</div>
                <div class="metric-display-lbl">Discount %</div>
              </div>
            </div>
          </div>

          <!-- Error Box -->
          <div id="toolLocalError" class="local-error-alert hidden"></div>
        </div>


    `;



    /*
    ============================================
    TOOL LOGIC
    ============================================
    */


    initDiscountLogic();



});
// ============================================================
// 2. DISCOUNT CALCULATOR LOGIC
// ============================================================

function initDiscountLogic() {
  // Tab elements
  const tabs = document.querySelectorAll('.discount-tab');
  const tabContents = document.querySelectorAll('.discount-tab-content');
  
  // Percent Off inputs
  const percentOriginalPrice = document.getElementById('percentOriginalPrice');
  const percentDiscount = document.getElementById('percentDiscount');
  
  // Amount Off inputs
  const amountOriginalPrice = document.getElementById('amountOriginalPrice');
  const amountDiscount = document.getElementById('amountDiscount');
  
  // Result displays
  const finalPrice = document.getElementById('finalPrice');
  const savings = document.getElementById('savings');
  const discountPercent = document.getElementById('discountPercent');
  
  // Buttons & Layout
  const calculateBtn = document.getElementById('calculateBtn');
  const errorBox = document.getElementById('toolLocalError');
  const resultBox = document.getElementById('discountResultBox');

  let activeTab = 'percent-off';

  // ===== Helper Functions =====

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

  function formatNumber(value) {
    return value.toFixed(2);
  }

  function setResult(final, saved, discountPct) {
    if (finalPrice) {
      finalPrice.textContent = formatNumber(final);
      finalPrice.style.color = '#22c55e';
    }
    if (savings) {
      savings.textContent = formatNumber(saved);
      savings.className = 'metric-display-val savings';
    }
    if (discountPercent) {
      discountPercent.textContent = discountPct.toFixed(1) + '%';
      discountPercent.className = 'metric-display-val discount';
    }
    
    if (resultBox) {
      resultBox.classList.remove('hidden');
      
      // Smoothly scroll down to the results box only when a calculation completes
      setTimeout(() => {
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  function clearResults() {
    if (finalPrice) finalPrice.textContent = '0.00';
    if (savings) savings.textContent = '0.00';
    if (discountPercent) discountPercent.textContent = '0%';
    if (resultBox) resultBox.classList.add('hidden');
    hideError();
  }

  // ===== Tab Switching =====

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `tab-${tabId}`) {
          content.classList.add('active');
        }
      });
      
      activeTab = tabId;
      clearResults();
    });
  });

  // ===== Calculation Functions =====

  function calculatePercentOff() {
    const price = parseFloat(percentOriginalPrice.value);
    const discountPct = parseFloat(percentDiscount.value);
    
    if (isNaN(price) || price < 0) {
      showError('Please enter a valid original price.');
      return false;
    }
    
    if (isNaN(discountPct) || discountPct < 0) {
      showError('Please enter a valid discount percentage.');
      return false;
    }
    
    if (discountPct > 100) {
      showError('Discount percentage cannot exceed 100%.');
      return false;
    }
    
    const savingsAmount = price * (discountPct / 100);
    const final = price - savingsAmount;
    
    setResult(final, savingsAmount, discountPct);
    hideError();
    return true;
  }

  function calculateAmountOff() {
    const price = parseFloat(amountOriginalPrice.value);
    const discountAmount = parseFloat(amountDiscount.value);
    
    if (isNaN(price) || price < 0) {
      showError('Please enter a valid original price.');
      return false;
    }
    
    if (isNaN(discountAmount) || discountAmount < 0) {
      showError('Please enter a valid discount amount.');
      return false;
    }
    
    if (discountAmount > price) {
      showError('Discount amount cannot exceed original price.');
      return false;
    }
    
    const final = price - discountAmount;
    const discountPct = (discountAmount / price) * 100;
    
    setResult(final, discountAmount, discountPct);
    hideError();
    return true;
  }

  function calculate() {
    hideError();
    
    switch (activeTab) {
      case 'percent-off':
        calculatePercentOff();
        break;
      case 'amount-off':
        calculateAmountOff();
        break;
      default:
        showError('Please select a calculation mode.');
    }
  }

  // ===== Enter Key Support =====

  function handleEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculate();
    }
  }

  // ===== Event Listeners =====

  if (calculateBtn) {
    calculateBtn.addEventListener('click', calculate);
  }

  // Add Enter key support
  const allInputs = document.querySelectorAll('.data-input-field');
  allInputs.forEach(input => {
    input.addEventListener('keypress', handleEnter);
  });

  // Only clear the output display if a user completely clears their input fields.
  // No automatic calculating will happen while they type.
  allInputs.forEach(input => {
    input.addEventListener('input', () => {
      const hasValues = checkAllFieldsFilled();
      if (!hasValues) {
        clearResults();
      }
    });
  });

  function checkAllFieldsFilled() {
    switch (activeTab) {
      case 'percent-off':
        return percentOriginalPrice.value.trim() !== '' && percentDiscount.value.trim() !== '';
      case 'amount-off':
        return amountOriginalPrice.value.trim() !== '' && amountDiscount.value.trim() !== '';
      default:
        return false;
    }
  }

  console.log('[Discount Calculator] ✅ Updated: Manual clicks only with smooth scrolling');
}