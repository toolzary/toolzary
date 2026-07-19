/**
 * Discount Calculator - Complete Implementation
 * Two modes: Percentage Off and Amount Off
 * Fixed: NO auto-calculating while typing, SCROLLS ONLY on button click
 */
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

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initDiscountLogic();
});