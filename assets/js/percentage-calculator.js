
// Percentage Calculator - Complete Implementation
// ============================================================
// 2. PERCENTAGE CALCULATOR LOGIC
// ============================================================

function initPercentageLogic() {
  const calcType = document.getElementById('calcType');
  const inputFields = document.getElementById('inputFields');
  const resultDisplay = document.getElementById('resultDisplay');
  const calculateBtn = document.getElementById('calculateBtn');
  const errorBox = document.getElementById('toolLocalError');
  let currentInputs = [];

  // ===== Calculation Type Configurations =====

  const typeConfigs = {
    'find-percent': {
      label: 'What is X% of Y?',
      fields: [
        { id: 'percentX', label: 'X (Percentage)', placeholder: '25', type: 'number' },
        { id: 'percentY', label: 'Y (Number)', placeholder: '200', type: 'number' }
      ],
      calculate: function(values) {
        const x = parseFloat(values.percentX);
        const y = parseFloat(values.percentY);
        if (isNaN(x) || isNaN(y)) return null;
        if (y === 0) return { error: 'Cannot calculate percentage of zero' };
        return (x / 100) * y;
      },
      formatResult: function(value) {
        return value !== null ? value.toFixed(2) : '--';
      },
      getDescription: function(values) {
        return `${values.percentX}% of ${values.percentY}`;
      }
    },
    'find-value': {
      label: 'X is what % of Y?',
      fields: [
        { id: 'valueX', label: 'X (Part)', placeholder: '50', type: 'number' },
        { id: 'valueY', label: 'Y (Whole)', placeholder: '200', type: 'number' }
      ],
      calculate: function(values) {
        const x = parseFloat(values.valueX);
        const y = parseFloat(values.valueY);
        if (isNaN(x) || isNaN(y)) return null;
        if (y === 0) return { error: 'Cannot divide by zero' };
        return (x / y) * 100;
      },
      formatResult: function(value) {
        return value !== null ? value.toFixed(2) + '%' : '--';
      },
      getDescription: function(values) {
        return `${values.valueX} is what % of ${values.valueY}`;
      }
    },
    'change': {
      label: 'Percentage Increase/Decrease',
      fields: [
        { id: 'changeInitial', label: 'Initial Value', placeholder: '100', type: 'number' },
        { id: 'changeFinal', label: 'Final Value', placeholder: '150', type: 'number' }
      ],
      calculate: function(values) {
        const initial = parseFloat(values.changeInitial);
        const final = parseFloat(values.changeFinal);
        if (isNaN(initial) || isNaN(final)) return null;
        if (initial === 0) return { error: 'Initial value cannot be zero' };
        return ((final - initial) / Math.abs(initial)) * 100;
      },
      formatResult: function(value) {
        if (value === null) return '--';
        const sign = value > 0 ? '+' : '';
        return sign + value.toFixed(2) + '%';
      },
      getDescription: function(values) {
        return `Change from ${values.changeInitial} to ${values.changeFinal}`;
      }
    },
    'add-percent': {
  label: 'Add Percentage to Number',
  fields: [
    { id: 'addNumber', label: 'Number', placeholder: '100', type: 'number' },
    { id: 'addPercent', label: 'Percentage to Add', placeholder: '10', type: 'number' }
  ],
  calculate: function(values) {
    const num = parseFloat(values.addNumber);
    const pct = parseFloat(values.addPercent);
    if (isNaN(num) || isNaN(pct)) return null;
    
    // Using Number.EPSILON to eliminate JS float micro-errors
    const intermediate = num * (pct / 100);
    const result = num + intermediate;
    return Math.round((result + Number.EPSILON) * 100000) / 100000; 
  },
  formatResult: function(value) {
    return value !== null ? value.toFixed(2) : '--';
  },
  getDescription: function(values) {
    return `Add ${values.addPercent}% to ${values.addNumber}`;
  }
},
    'subtract-percent': {
      label: 'Subtract Percentage from Number',
      fields: [
        { id: 'subNumber', label: 'Number', placeholder: '100', type: 'number' },
        { id: 'subPercent', label: 'Percentage to Subtract', placeholder: '10', type: 'number' }
      ],
      calculate: function(values) {
        const num = parseFloat(values.subNumber);
        const pct = parseFloat(values.subPercent);
        if (isNaN(num) || isNaN(pct)) return null;
        return num - (num * pct / 100);
      },
      formatResult: function(value) {
        return value !== null ? value.toFixed(2) : '--';
      },
      getDescription: function(values) {
        return `Subtract ${values.subPercent}% from ${values.subNumber}`;
      }
    }
  };

  // ===== Render Input Fields =====

  function renderFields(type) {
    const config = typeConfigs[type];
    if (!config) return;
    
    let html = '';
    config.fields.forEach(field => {
     html += `
  <div class="input-row">
    <label for="${field.id}">${field.label}</label>
    <input type="number" id="${field.id}" class="data-input-field" placeholder="${field.placeholder}" step="any">
  </div>
`;
    });
    
    inputFields.innerHTML = html;
    
   // Add enter key support to new inputs (no automatic calculation on typing)
    document.querySelectorAll('.input-row .data-input-field').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          calculate();
        }
      });
    });
    
    // Focus first input
    const firstInput = document.querySelector('.input-row .data-input-field');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  // ===== Get Current Values =====

  function getValues() {
    const config = typeConfigs[calcType.value];
    if (!config) return {};
    
    const values = {};
    config.fields.forEach(field => {
      const el = document.getElementById(field.id);
      values[field.id] = el ? el.value : '';
    });
    return values;
  }

  // ===== Calculate =====

  function calculate() {
    const type = calcType.value;
    const config = typeConfigs[type];
    if (!config) return;
    
    const values = getValues();
    const result = config.calculate(values);
    
    if (result === null) {
      resultDisplay.textContent = '--';
      resultDisplay.className = 'result-value';
      hideError();
      return;
    }
    
    if (result.error) {
      showError(result.error);
      resultDisplay.textContent = '--';
      resultDisplay.className = 'result-value';
      return;
    }
    
    hideError();
    const formatted = config.formatResult(result);
    resultDisplay.textContent = formatted;
    resultDisplay.className = 'result-value';
    
    // Color for change type
    if (type === 'change' && typeof result === 'number') {
      if (result > 0) {
        resultDisplay.classList.add('positive');
      } else if (result < 0) {
        resultDisplay.classList.add('negative');
      }
    }
  }

  // ===== Error Handling =====

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
  // ===== Event Listeners =====

  // Dropdown change
  calcType.addEventListener('change', () => {
    renderFields(calcType.value);
    hideError();
  });

  // Calculate button
  calculateBtn.addEventListener('click', calculate);

  // ===== Initialize =====

  renderFields(calcType.value);

  // Set initial sample values and calculate
  setTimeout(() => {
    const config = typeConfigs[calcType.value];
    if (config) {
      const sampleValues = {
        'percentX': '25',
        'percentY': '200',
        'valueX': '50',
        'valueY': '200',
        'changeInitial': '100',
        'changeFinal': '150',
        'addNumber': '100',
        'addPercent': '10',
        'subNumber': '100',
        'subPercent': '10'
      };
      
      config.fields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el && sampleValues[field.id]) {
          el.value = sampleValues[field.id];
        }
      });
    }
  }, 200);

  console.log('[Percentage Calculator] ✅ Initialized successfully');
}

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
   initPercentageLogic();
});



















