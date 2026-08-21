document.addEventListener("DOMContentLoaded", function () {

    const app = document.getElementById("tool-app");

    if (!app) {
        return;
    }

    /*
    ============================================
    CREATE TOOL INTERFACE (HTML LAYOUT)
    ============================================
    */

    app.innerHTML = `
    <div class="tool-interface">
        <div class="unified-tool-container">
            <div class="tool-custom-interface">
                
                <!-- Weight Section -->
                <div class="form-group-centered">
                    <label class="input-label" for="weightValue">Weight</label>
                    <input type="number" id="weightValue" class="blue-select data-input-field" placeholder="Enter weight" step="any">
                    <select id="weightUnit" class="unit-select">
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="lbs">Pounds (lbs)</option>
                        <option value="st">Stones (st)</option>
                        <option value="oz">Ounces (oz)</option>
                    </select>
                </div>

                <!-- Height Section -->
                <div class="form-group-centered">
                    <label class="input-label" for="heightValue">Height</label>
                    <input type="number" id="heightValue" class="blue-select data-input-field" placeholder="Enter height" step="any">
                    <select id="heightUnit" class="unit-select">
                        <option value="cm">Centimeters (cm)</option>
                        <option value="m">Meters (m)</option>
                        <option value="in">Inches (in)</option>
                        <option value="ft">Feet (ft)</option>
                        <option value="mm">Millimeters (mm)</option>
                    </select>
                </div>
                
                <button id="calculateBtn" class="third-btn">Calculate BMI</button>
                
                <div id="bmiResultBox" class="result-box-card hidden">
                    <h3 class="result-box-title">Your BMI Result</h3>
                    <div class="bmi-result-grid">
                        <div class="bmi-result-block">
                            <div class="bmi-result-value" id="bmiValue">0</div>
                            <div class="bmi-result-label">BMI Score</div>
                        </div>
                        <div class="bmi-result-block">
                            <div class="bmi-result-value" id="bmiCategory">-</div>
                            <div class="bmi-result-label">Category</div>
                        </div>
                        <div class="bmi-result-block">
                            <div class="bmi-result-value" id="healthyRange">-</div>
                            <div class="bmi-result-label">Healthy Weight Range</div>
                        </div>
                    </div>
                    <div id="bmiStatus" class="bmi-status-message"></div>
                    <div id="bmiAdvice" class="bmi-advice-message"></div>
                </div>

                <div id="toolLocalError" class="local-error-alert hidden"></div>
                <div id="toolLocalWarning" class="local-warning-alert hidden"></div>
            </div>
        </div>
    </div>
    `;

    /*
    ============================================
    LOGIC & CONVERSION FUNCTIONS
    ============================================
    */

    const weightConversions = {
        kg: (val) => val,
        g: (val) => val / 1000,
        lbs: (val) => val * 0.45359237,
        st: (val) => val * 6.35029318,
        oz: (val) => val * 0.0283495231
    };

    const heightConversions = {
        cm: (val) => val / 100,
        m: (val) => val,
        in: (val) => val * 0.0254,
        ft: (val) => val * 0.3048,
        mm: (val) => val / 1000
    };

    function convertToKg(value, unit) {
        const converter = weightConversions[unit];
        if (!converter) return value;
        return converter(value);
    }

    function convertToMeters(value, unit) {
        const converter = heightConversions[unit];
        if (!converter) return value;
        return converter(value);
    }

    function calculateBMI(weightKg, heightMeters) {
        if (weightKg <= 0 || heightMeters <= 0) return null;
        return weightKg / (heightMeters * heightMeters);
    }

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

    function getHealthyWeightRange(heightMeters) {
        const minHealthy = 18.5 * (heightMeters * heightMeters);
        const maxHealthy = 24.9 * (heightMeters * heightMeters);
        return {
            min: minHealthy,
            max: maxHealthy
        };
    }

    function getDisplayRange(minKg, maxKg, unit) {
        let min = minKg;
        let max = maxKg;
        let displayUnit = unit;
        let decimals = 1;
        
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

    function validateHeight(heightMeters, originalValue, originalUnit) {
        const heightCm = heightMeters * 100;
        const unitLabels = { 'm': 'm', 'cm': 'cm', 'mm': 'mm', 'in': 'inches', 'ft': 'feet' };
        const unitLabel = unitLabels[originalUnit] || originalUnit;
        
        if (heightMeters < 0.3 || heightMeters > 3.5) {
            return {
                valid: false,
                message: `⚠️ Height seems unrealistic (${originalValue} ${unitLabel}). Please check your input.`
            };
        }
        
        if (heightMeters < 1.0) {
            return {
                valid: true,
                warning: `📏 Height is very short (${originalValue} ${unitLabel} / ${heightCm.toFixed(0)} cm). Please confirm this is correct.`
            };
        }
        
        if (heightMeters > 2.5) {
            return {
                valid: true,
                warning: `📏 Height is very tall (${originalValue} ${unitLabel} / ${heightCm.toFixed(0)} cm). Please confirm this is correct.`
            };
        }
        
        return { valid: true };
    }

    function validateWeight(weightKg, originalValue, originalUnit) {
        const unitLabels = { 'kg': 'kg', 'g': 'g', 'lbs': 'lbs', 'st': 'stone', 'oz': 'oz' };
        const unitLabel = unitLabels[originalUnit] || originalUnit;
        
        if (weightKg < 1 || weightKg > 500) {
            return {
                valid: false,
                message: `⚠️ Weight seems unrealistic (${originalValue} ${unitLabel}). Please check your input.`
            };
        }
        
        if (weightKg < 20) {
            return {
                valid: true,
                warning: `⚖️ Weight is very light (${originalValue} ${unitLabel}). Please confirm this is correct.`
            };
        }
        
        if (weightKg > 200) {
            return {
                valid: true,
                warning: `⚖️ Weight is very heavy (${originalValue} ${unitLabel}). Please confirm this is correct.`
            };
        }
        
        return { valid: true };
    }

    /*
    ============================================
    EVENT BINDINGS & APP LOGIC
    ============================================
    */

    const calcBtn = app.querySelector('#calculateBtn');
    const weightValue = app.querySelector('#weightValue');
    const weightUnit = app.querySelector('#weightUnit');
    const heightValue = app.querySelector('#heightValue');
    const heightUnit = app.querySelector('#heightUnit');
    
    const resultBox = app.querySelector('#bmiResultBox');
    const errorBox = app.querySelector('#toolLocalError');
    const warningBox = app.querySelector('#toolLocalWarning');
    
    const bmiValue = app.querySelector('#bmiValue');
    const bmiCategory = app.querySelector('#bmiCategory');
    const healthyRange = app.querySelector('#healthyRange');
    const bmiStatus = app.querySelector('#bmiStatus');
    const bmiAdvice = app.querySelector('#bmiAdvice');

    if (!calcBtn) return;

    function showError(message) {
        if (errorBox) {
            errorBox.textContent = message;
            errorBox.classList.remove('hidden');
        }
        if (warningBox) warningBox.classList.add('hidden');
        if (resultBox) resultBox.classList.add('hidden');
    }

    function showWarning(message) {
        if (warningBox) {
            warningBox.textContent = message;
            warningBox.classList.remove('hidden');
        }
    }

    function hideAllMessages() {
        if (errorBox) errorBox.classList.add('hidden');
        if (warningBox) warningBox.classList.add('hidden');
    }

    calcBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (resultBox) resultBox.classList.add('hidden');
        hideAllMessages();

        const weight = parseFloat(weightValue?.value);
        const height = parseFloat(heightValue?.value);
        const weightUnitValue = weightUnit?.value || 'kg';
        const heightUnitValue = heightUnit?.value || 'cm';
        
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
        
        const weightKg = convertToKg(weight, weightUnitValue);
        const heightMeters = convertToMeters(height, heightUnitValue);
        
        if (weightKg <= 0 || isNaN(weightKg)) {
            showError("⚠️ Invalid weight conversion. Please check your input.");
            return;
        }
        
        if (heightMeters <= 0 || isNaN(heightMeters)) {
            showError("⚠️ Invalid height conversion. Please check your input.");
            return;
        }
        
        const weightValidation = validateWeight(weightKg, weight, weightUnitValue);
        if (!weightValidation.valid) {
            showError(weightValidation.message);
            return;
        }
        if (weightValidation.warning) {
            showWarning(weightValidation.warning);
        }
        
        const heightValidation = validateHeight(heightMeters, height, heightUnitValue);
        if (!heightValidation.valid) {
            showError(heightValidation.message);
            return;
        }
        if (heightValidation.warning) {
            showWarning(heightValidation.warning);
        }
        
        const bmi = calculateBMI(weightKg, heightMeters);
        
        if (bmi === null || isNaN(bmi) || !isFinite(bmi)) {
            showError("⚠️ Calculation error. Please check your inputs.");
            return;
        }
        
        const bmiRounded = bmi.toFixed(1);
        const categoryData = getBMICategory(bmi);
        const healthyWeightRange = getHealthyWeightRange(heightMeters);
        
        if (bmiValue) {
            bmiValue.textContent = bmiRounded;
            bmiValue.className = `bmi-result-value ${categoryData.color}`;
        }
        
        if (bmiCategory) {
            bmiCategory.textContent = categoryData.category;
            bmiCategory.className = `bmi-result-value ${categoryData.color}`;
        }
        
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
        
        if (resultBox) {
            resultBox.classList.remove('hidden');
            
            setTimeout(() => {
                const targetOffset = resultBox.getBoundingClientRect().top + window.pageYOffset - 120;
                window.scrollTo({
                    top: targetOffset,
                    behavior: 'smooth'
                });
            }, 100);
        }
    });

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

    [weightUnit, heightUnit].forEach(unitSelect => {
        if (unitSelect) {
            unitSelect.addEventListener('change', () => {
                if (resultBox) resultBox.classList.add('hidden');
                hideAllMessages();
            });
        }
    });

    [weightValue, heightValue].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                hideAllMessages();
                if (resultBox) resultBox.classList.add('hidden');
            });
        }
    });
});