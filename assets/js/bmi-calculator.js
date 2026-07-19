// ============================================
// BMI CALCULATOR - COMPLETE FIXED VERSION
// ALL CONVERSIONS VERIFIED & CORRECTED
// ============================================

/**
 * Unit Conversion Functions - ALL VERIFIED
 */
const weightConversions = {
  kg: (val) => val,
  g: (val) => val / 1000,
  lbs: (val) => val * 0.45359237,
  st: (val) => val * 6.35029318,   // 1 stone = 6.35029318 kg
  oz: (val) => val * 0.0283495231  // 1 oz = 0.0283495231 kg
};

const heightConversions = {
  cm: (val) => val / 100,
  m: (val) => val,
  in: (val) => val * 0.0254,
  ft: (val) => val * 0.3048,
  mm: (val) => val / 1000
};

/**
 * Convert weight to kilograms
 */
function convertToKg(value, unit) {
  const converter = weightConversions[unit];
  if (!converter) {
    console.error(`Unknown unit: ${unit}`);
    return value;
  }
  const result = converter(value);
  console.log(`Converting ${value} ${unit} = ${result} kg`); // Debug log
  return result;
}

/**
 * Convert height to meters
 */
function convertToMeters(value, unit) {
  const converter = heightConversions[unit];
  if (!converter) {
    console.error(`Unknown unit: ${unit}`);
    return value;
  }
  const result = converter(value);
  console.log(`Converting ${value} ${unit} = ${result} m`); // Debug log
  return result;
}

/**
 * Calculate BMI
 */
function calculateBMI(weightKg, heightMeters) {
  if (weightKg <= 0 || heightMeters <= 0) return null;
  return weightKg / (heightMeters * heightMeters);
}

/**
 * Get BMI Category and Details
 */
function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      status: 'You are underweight',
      advice: 'Consider consulting a nutritionist for a healthy weight gain plan. Focus on nutrient-rich foods and strength training.',
      color: 'bmi-category-underweight',
      statusColor: 'status-underweight',
      range: '< 18.5',
      emoji: '📉'
    };
  } else if (bmi < 25) {
    return {
      category: 'Normal Weight',
      status: 'You are at a healthy weight',
      advice: 'Great job! Maintain your healthy lifestyle with balanced diet, regular exercise, and adequate sleep.',
      color: 'bmi-category-normal',
      statusColor: 'status-normal',
      range: '18.5 - 24.9',
      emoji: '✅'
    };
  } else if (bmi < 30) {
    return {
      category: 'Overweight',
      status: 'You are overweight',
      advice: 'Consider increasing physical activity and adjusting diet. Even modest weight loss can improve health.',
      color: 'bmi-category-overweight',
      statusColor: 'status-overweight',
      range: '25 - 29.9',
      emoji: '⚠️'
    };
  } else {
    return {
      category: 'Obese',
      status: 'You are in the obese range',
      advice: 'Consult a healthcare provider for personalized guidance on weight management and health improvement.',
      color: 'bmi-category-obese',
      statusColor: 'status-obese',
      range: '≥ 30',
      emoji: '🔴'
    };
  }
}

/**
 * Calculate healthy weight range for given height (returns in kg)
 */
function getHealthyWeightRange(heightMeters) {
  const minHealthy = 18.5 * (heightMeters * heightMeters);
  const maxHealthy = 24.9 * (heightMeters * heightMeters);
  return {
    min: minHealthy,
    max: maxHealthy
  };
}

/**
 * Convert healthy weight range to display unit
 * ALL CONVERSIONS VERIFIED
 */
function getDisplayRange(minKg, maxKg, unit) {
  let min = minKg;
  let max = maxKg;
  let displayUnit = unit;
  let decimals = 1;
  
  // Convert from kg to the selected unit
  switch(unit) {
    case 'kg':
      decimals = 1;
      break;
      
    case 'lbs':
      min = min * 2.20462262185;
      max = max * 2.20462262185;
      decimals = 1;
      break;
      
    case 'st':
      min = min * 0.1574730444;
      max = max * 0.1574730444;
      decimals = 2;
      break;
      
    case 'g':
      min = min * 1000;
      max = max * 1000;
      decimals = 0;
      break;
      
    case 'oz':
      min = min * 35.27396195;
      max = max * 35.27396195;
      decimals = 1;
      break;
      
    default:
      displayUnit = 'kg';
      decimals = 1;
  }
  
  return {
    min: min.toFixed(decimals),
    max: max.toFixed(decimals),
    unit: displayUnit
  };
}

/**
 * Validate height with realistic ranges
 * Shows values in the ORIGINAL unit for better UX
 */
function validateHeight(heightMeters, originalValue, originalUnit) {
  const heightCm = heightMeters * 100;
  
  // Map unit to display label
  const unitLabels = {
    'm': 'm',
    'cm': 'cm',
    'mm': 'mm',
    'in': 'inches',
    'ft': 'feet'
  };
  const unitLabel = unitLabels[originalUnit] || originalUnit;
  
  // Completely unrealistic (less than 30cm or more than 3.5m)
  if (heightMeters < 0.3 || heightMeters > 3.5) {
    return {
      valid: false,
      message: `⚠️ Height seems unrealistic (${originalValue} ${unitLabel}). Please check your input.`
    };
  }
  
  // Very short (under 100cm / 3'3")
  if (heightMeters < 1.0) {
    return {
      valid: true,
      warning: `📏 Height is very short (${originalValue} ${unitLabel} / ${heightCm.toFixed(0)} cm). Please confirm this is correct.`
    };
  }
  
  // Very tall (over 250cm / 8'2")
  if (heightMeters > 2.5) {
    return {
      valid: true,
      warning: `📏 Height is very tall (${originalValue} ${unitLabel} / ${heightCm.toFixed(0)} cm). Please confirm this is correct.`
    };
  }
  
  return { valid: true };
}

/**
 * Validate weight with realistic ranges
 * Shows values in the ORIGINAL unit for better UX
 */
function validateWeight(weightKg, originalValue, originalUnit) {
  // Map unit to display label
  const unitLabels = {
    'kg': 'kg',
    'g': 'g',
    'lbs': 'lbs',
    'st': 'stone',
    'oz': 'oz'
  };
  const unitLabel = unitLabels[originalUnit] || originalUnit;
  
  // Completely unrealistic
  if (weightKg < 1 || weightKg > 500) {
    return {
      valid: false,
      message: `⚠️ Weight seems unrealistic (${originalValue} ${unitLabel}). Please check your input.`
    };
  }
  
  // Very light (under 20kg / 44lbs)
  if (weightKg < 20) {
    return {
      valid: true,
      warning: `⚖️ Weight is very light (${originalValue} ${unitLabel}). Please confirm this is correct.`
    };
  }
  
  // Very heavy (over 200kg / 440lbs)
  if (weightKg > 200) {
    return {
      valid: true,
      warning: `⚖️ Weight is very heavy (${originalValue} ${unitLabel}). Please confirm this is correct.`
    };
  }
  
  return { valid: true };
}

/**
 * Main BMI Tool Logic - COMPLETE FIXED VERSION
 */
function initBMILogic() {
  const calcBtn = document.getElementById('calculateBtn');
  
  const weightValue = document.getElementById('weightValue');
  const weightUnit = document.getElementById('weightUnit');
  const heightValue = document.getElementById('heightValue');
  const heightUnit = document.getElementById('heightUnit');
  
  const resultBox = document.getElementById('bmiResultBox');
  const errorBox = document.getElementById('toolLocalError');
  const warningBox = document.getElementById('toolLocalWarning');
  
  const bmiValue = document.getElementById('bmiValue');
  const bmiCategory = document.getElementById('bmiCategory');
  const healthyRange = document.getElementById('healthyRange');
  const bmiStatus = document.getElementById('bmiStatus');
  const bmiAdvice = document.getElementById('bmiAdvice');

  // If calculate button doesn't exist, exit
  if (!calcBtn) return;

  // Helper to show error
  function showError(message) {
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.remove('hidden');
    }
    if (warningBox) {
      warningBox.classList.add('hidden');
    }
    if (resultBox) {
      resultBox.classList.add('hidden');
    }
  }

  // Helper to show warning
  function showWarning(message) {
    if (warningBox) {
      warningBox.textContent = message;
      warningBox.classList.remove('hidden');
    }
  }

  // Helper to hide all messages
  function hideAllMessages() {
    if (errorBox) errorBox.classList.add('hidden');
    if (warningBox) warningBox.classList.add('hidden');
  }

  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Hide previous results and messages
    if (resultBox) resultBox.classList.add('hidden');
    hideAllMessages();

    // Get values
    const weight = parseFloat(weightValue?.value);
    const height = parseFloat(heightValue?.value);
    const weightUnitValue = weightUnit?.value || 'kg';
    const heightUnitValue = heightUnit?.value || 'cm';
    
    // Validate inputs exist
    if (isNaN(weight) || isNaN(height)) {
      showError("⚠️ Please enter both weight and height values.");
      return;
    }
    
    if (weight <= 0) {
      showError(`⚠️ Weight must be greater than 0. You entered: ${weight}`);
      return;
    }
    
    if (height <= 0) {
      showError(`⚠️ Height must be greater than 0. You entered: ${height}`);
      return;
    }
    
    // Convert to standard units
    const weightKg = convertToKg(weight, weightUnitValue);
    const heightMeters = convertToMeters(height, heightUnitValue);
    
    // Debug logs - check the console!
    console.log(`Weight: ${weight} ${weightUnitValue} = ${weightKg} kg`);
    console.log(`Height: ${height} ${heightUnitValue} = ${heightMeters} m`);
    
    // Validate converted values
    if (weightKg <= 0 || isNaN(weightKg)) {
      showError("⚠️ Invalid weight conversion. Please check your input.");
      return;
    }
    
    if (heightMeters <= 0 || isNaN(heightMeters)) {
      showError("⚠️ Invalid height conversion. Please check your input.");
      return;
    }
    
    // Validate weight with realistic ranges - PASS THE ORIGINAL VALUE
    const weightValidation = validateWeight(weightKg, weight, weightUnitValue);
    if (!weightValidation.valid) {
      showError(weightValidation.message);
      return;
    }
    if (weightValidation.warning) {
      showWarning(weightValidation.warning);
    }
    
    // Validate height with realistic ranges - PASS THE ORIGINAL VALUE
    const heightValidation = validateHeight(heightMeters, height, heightUnitValue);
    if (!heightValidation.valid) {
      showError(heightValidation.message);
      return;
    }
    if (heightValidation.warning) {
      showWarning(heightValidation.warning);
    }
    
    // Calculate BMI
    const bmi = calculateBMI(weightKg, heightMeters);
    
    if (bmi === null || isNaN(bmi) || !isFinite(bmi)) {
      showError("⚠️ Calculation error. Please check your inputs.");
      return;
    }
    
    const bmiRounded = bmi.toFixed(1);
    const categoryData = getBMICategory(bmi);
    const healthyWeightRange = getHealthyWeightRange(heightMeters);
    
    // Display results
    if (bmiValue) {
      bmiValue.textContent = bmiRounded;
      bmiValue.className = `bmi-result-value ${categoryData.color}`;
    }
    
    if (bmiCategory) {
      bmiCategory.textContent = categoryData.category;
      bmiCategory.className = `bmi-result-value ${categoryData.color}`;
    }
    
    // FIXED: Healthy Weight Range with ALL unit conversions
    if (healthyRange) {
      const displayRange = getDisplayRange(
        healthyWeightRange.min,
        healthyWeightRange.max,
        weightUnitValue
      );
      healthyRange.textContent = `${displayRange.min} - ${displayRange.max} ${displayRange.unit}`;
    }
    
    if (bmiStatus) {
      bmiStatus.innerHTML = `${categoryData.emoji} ${categoryData.status} (BMI: ${bmiRounded}) ${categoryData.emoji}`;
      bmiStatus.className = `bmi-status-message ${categoryData.statusColor}`;
    }
    
    if (bmiAdvice) {
      bmiAdvice.innerHTML = categoryData.advice;
    }
    
    // Show results
    if (resultBox) {
      resultBox.classList.remove('hidden');
      
      // Smooth scroll to results
      setTimeout(() => {
        const targetOffset = resultBox.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });
      }, 100);
    }
  });
  
  // Enter key support for both inputs
  [weightValue, heightValue].forEach(input => {
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          calcBtn.click();
        }
      });
    }
  });

  // Real-time unit change - reset results when unit changes
  [weightUnit, heightUnit].forEach(unitSelect => {
    if (unitSelect) {
      unitSelect.addEventListener('change', () => {
        if (resultBox) resultBox.classList.add('hidden');
        hideAllMessages();
      });
    }
  });

  // Real-time input validation - clear errors when user types
  [weightValue, heightValue].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        hideAllMessages();
        if (resultBox) resultBox.classList.add('hidden');
      });
    }
  });
}

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initBMILogic();
});



















