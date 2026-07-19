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

  let numbers = [];

  if (!numberInput || !addBtn) return;

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

  function updateTags() {
    if (numberTags) {
      if (numbers.length === 0) {
        numberTags.innerHTML = '<span class="empty-tags-message">No numbers added yet. Add some numbers above.</span>';
        return;
      }
      
      numberTags.innerHTML = numbers.map((num, index) => `
        <span class="number-tag">
          ${num}
          <button class="remove-tag" data-index="${index}">✕</button>
        </span>
      `).join('');
      
      // Add remove event listeners
      document.querySelectorAll('.remove-tag').forEach(btn => {
        btn.addEventListener('click', () => {
          const index = parseInt(btn.dataset.index);
          removeNumber(index);
        });
      });
    }
  }

  function removeNumber(index) {
    numbers.splice(index, 1);
    updateTags();
    if (numbers.length === 0 && resultBox) {
      resultBox.classList.add('hidden');
    }
    hideError();
  }

  function clearAll() {
    numbers = [];
    updateTags();
    if (resultBox) {
      resultBox.classList.add('hidden');
    }
    hideError();
    if (numberInput) {
      numberInput.value = '';
      numberInput.focus();
    }
  }

  function addNumber(value) {
    const num = parseFloat(value);
    if (isNaN(num)) {
      showError('Please enter a valid number.');
      return false;
    }
    
    numbers.push(num);
    updateTags();
    hideError();
    if (numberInput) {
      numberInput.value = '';
      numberInput.focus();
    }
    return true;
  }

  function calculateAverage() {
    if (numbers.length === 0) {
      showError('Please add at least one number to calculate.');
      return;
    }

    hideError();

    const sorted = [...numbers].sort((a, b) => a - b);
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const count = numbers.length;
    const average = sum / count;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    // Calculate median
    let median;
    const mid = Math.floor(count / 2);
    if (count % 2 === 0) {
      median = (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      median = sorted[mid];
    }

    // Display results
    if (avgAverage) {
      avgAverage.textContent = average.toFixed(2);
    }
    if (avgSum) {
      avgSum.textContent = sum.toFixed(2);
    }
    if (avgCount) {
      avgCount.textContent = count;
    }
    if (avgMin) {
      avgMin.textContent = min.toFixed(2);
    }
    if (avgMax) {
      avgMax.textContent = max.toFixed(2);
    }
    if (avgMedian) {
      avgMedian.textContent = median.toFixed(2);
    }

    if (resultBox) {
      resultBox.classList.remove('hidden');
      
      // Smooth scroll
      setTimeout(() => {
        const targetOffset = resultBox.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });
      }, 150);
    }
  }

  // ===== Event Listeners =====

  // Add button
  addBtn.addEventListener('click', () => {
    const value = numberInput.value.trim();
    if (value) {
      addNumber(value);
    } else {
      showError('Please enter a number.');
    }
  });

  // Enter key on input
  numberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = numberInput.value.trim();
      if (value) {
        addNumber(value);
      } else {
        showError('Please enter a number.');
      }
    }
  });

  // Calculate button
  calculateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    calculateAverage();
  });

  // Clear all button
  clearAllBtn.addEventListener('click', clearAll);

  // Initialize empty state
  updateTags();
}



















