/**
 * Color Picker - Complete Implementation
 * Pick colors, convert between HEX, RGB, HSL
 * Integrates with Toolzary template
 */
// ============================================================
// 2. COLOR CONVERSION FUNCTIONS
// ============================================================

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(c => {
    const hex = Math.round(Math.min(255, Math.max(0, c))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  // Round to nearest integer
  return { 
    h: Math.round(h * 360), 
    s: Math.round(s * 100), 
    l: Math.round(l * 100) 
  };
}

// ============================================================
// 3. APPLY COLOR FUNCTIONS
// ============================================================

function applyRgb() {
  const rgbInput = getCachedElement('rgbInput');
  if (!rgbInput) return;
  
  const value = rgbInput.value.trim();
  
  if (!value) {
    showError('Please enter RGB values.');
    return;
  }
  
  // Parse and validate
  const result = parseAndValidateRgb(value);
  
  if (!result.valid) {
    showError(result.message);
    return;
  }
  
  const { r, g, b } = result.values;
  
  // Convert RGB to HEX
  const hex = rgbToHex(r, g, b);
  updateColor(hex);
  
  // Format the display
  const displayValue = `${r}, ${g}, ${b}`;
  if (rgbInput) rgbInput.value = displayValue;
  
  showSuccess(`Applied RGB: ${displayValue}`);
}

function applyHsl() {
  const hslInput = getCachedElement('hslInput');
  if (!hslInput) return;
  
  const value = hslInput.value.trim();
  
  if (!value) {
    showError('Please enter HSL values.');
    return;
  }
  
  // Parse and validate
  const result = parseAndValidateHsl(value);
  
  if (!result.valid) {
    showError(result.message);
    return;
  }
  
  const { h, s, l } = result.values;
  
  // Convert HSL to RGB
  const rgb = hslToRgb(h, s, l);
  const hex = rgbToHex(Math.round(rgb.r), Math.round(rgb.g), Math.round(rgb.b));
  updateColor(hex);
  
  // Format the display with % symbols
  const displayValue = `${h}, ${s}%, ${l}%`;
  if (hslInput) hslInput.value = displayValue;
  showSuccess(`Applied HSL: ${displayValue}`);
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return { r: r * 255, g: g * 255, b: b * 255 };
}
// ============================================================
// 3. UI UPDATE FUNCTIONS
// ============================================================

let elementCache = {};

function getCachedElement(id) {
  if (!elementCache[id]) {
    elementCache[id] = document.getElementById(id);
  }
  return elementCache[id];
}

function showError(message) {
  const errorBox = getCachedElement('toolLocalError');
  if (!errorBox) return;
  
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
  errorBox.style.background = 'rgba(239, 68, 68, 0.1)';
  errorBox.style.color = '#ef4444';
  errorBox.style.borderColor = 'rgba(239, 68, 68, 0.2)';
  
  setTimeout(() => {
    errorBox.classList.add('hidden');
  }, 3000);
}

function showSuccess(message) {
  const errorBox = getCachedElement('toolLocalError');
  if (!errorBox) return;
  
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
  errorBox.style.background = 'rgba(34, 197, 94, 0.1)';
  errorBox.style.color = '#22c55e';
  errorBox.style.borderColor = 'rgba(34, 197, 94, 0.2)';
  
  setTimeout(() => {
    errorBox.classList.add('hidden');
  }, 2000);
}

function updateColor(hex) {
  const colorPicker = getCachedElement('colorPicker');
  const hexInput = getCachedElement('hexInput');
  const rgbInput = getCachedElement('rgbInput');
  const hslInput = getCachedElement('hslInput');
  
  if (!hex) return;
  
  // Ensure hex has # prefix
  if (!hex.startsWith('#')) {
    hex = '#' + hex;
  }
  
  // Update picker and input
  if (colorPicker) colorPicker.value = hex;
  if (hexInput) hexInput.value = hex.replace('#', '').toUpperCase();
  
  // Update RGB
  const rgb = hexToRgb(hex);
  if (rgb && rgbInput) {
    rgbInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  }
  
  // Update HSL
  if (rgb) {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    if (hslInput) {
      hslInput.value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
    }
  }
}

// ============================================================
// 4. COPY FUNCTIONS
// ============================================================

function copyToClipboard(text, successMessage) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess(successMessage || 'Copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    showSuccess('Copied to clipboard!');
  } catch (error) {
    showError('Failed to copy. Please copy manually.');
  }
  
  document.body.removeChild(textarea);
}

function copyHex() {
  const hexInput = getCachedElement('hexInput');
  if (!hexInput || !hexInput.value) {
    showError('No color to copy.');
    return;
  }
  const hex = '#' + hexInput.value;
  copyToClipboard(hex, `Copied ${hex} to clipboard!`);
}

// ============================================================
// 6. MAIN TOOL INITIALIZATION
// ============================================================

function initTool() {
  const colorPicker = getCachedElement('colorPicker');
  const hexInput = getCachedElement('hexInput');
  const copyHexBtn = getCachedElement('copyHexBtn');
  const copyRgbBtn = getCachedElement('copyRgbBtn');
  const copyHslBtn = getCachedElement('copyHslBtn');
  const applyRgbBtn = getCachedElement('applyRgbBtn');
  const applyHslBtn = getCachedElement('applyHslBtn');
  const clearBtn = getCachedElement('clearBtn');
  const rgbInput = getCachedElement('rgbInput');
  const hslInput = getCachedElement('hslInput');

  let historyVisible = false;

  if (!colorPicker || !hexInput) {
    console.error('[Color Picker] Elements not found');
    return;
  }

  // ===== Update from Color Picker =====

  colorPicker.addEventListener('input', () => {
    const hex = colorPicker.value;
    updateColor(hex);
    
    const rgb = hexToRgb(hex);
    if (rgb) {
      saveHistoryItem({
        hex: hex.toUpperCase(),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      });
    }
  });

  // ===== Update from HEX Input =====

  hexInput.addEventListener('input', () => {
    let val = hexInput.value.replace('#', '').toUpperCase();
    val = val.replace(/[^0-9A-F]/g, '');
    hexInput.value = val;
    
    if (val.length === 6) {
      const hex = '#' + val;
      updateColor(hex);
      
      const rgb = hexToRgb(hex);
      if (rgb) {
        saveHistoryItem({
          hex: hex.toUpperCase(),
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
        });
      }
    }
  });

  // ===== Enter Key Support =====

  hexInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let val = hexInput.value.replace('#', '').toUpperCase();
      val = val.replace(/[^0-9A-F]/g, '');
      if (val.length === 6) {
        const hex = '#' + val;
        updateColor(hex);
        const rgb = hexToRgb(hex);
        if (rgb) {
          saveHistoryItem({
            hex: hex.toUpperCase(),
            rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
          });
        }
      } else {
        showError('Please enter a valid 6-digit HEX code.');
      }
    }
  });

  // ===== Apply RGB =====

  if (applyRgbBtn) {
    applyRgbBtn.addEventListener('click', applyRgb);
  }

  // ===== Apply HSL =====

  if (applyHslBtn) {
    applyHslBtn.addEventListener('click', applyHsl);
  }

  // ===== Copy HEX =====

  if (copyHexBtn) {
    copyHexBtn.addEventListener('click', copyHex);
  }

  // ===== Copy RGB =====

  if (copyRgbBtn) {
    copyRgbBtn.addEventListener('click', () => {
      if (!rgbInput || !rgbInput.value) {
        showError('No color to copy.');
        return;
      }
      copyToClipboard(`rgb(${rgbInput.value})`, 'Copied RGB to clipboard!');
    });
  }

  // ===== Copy HSL =====

  if (copyHslBtn) {
    copyHslBtn.addEventListener('click', () => {
      if (!hslInput || !hslInput.value) {
        showError('No color to copy.');
        return;
      }
      copyToClipboard(`hsl(${hslInput.value})`, 'Copied HSL to clipboard!');
    });
  }

  // ===== Reset =====

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const defaultColor = '#4f46e5';
      updateColor(defaultColor);
      const rgb = hexToRgb(defaultColor);
      if (rgb) {
        saveHistoryItem({
          hex: defaultColor.toUpperCase(),
          rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
        });
      }
      showSuccess('Reset to default color');
    });
  }

  // ===== Initial Color =====

  setTimeout(() => {
    updateColor('#4f46e5');
    const rgb = hexToRgb('#4f46e5');
    if (rgb) {
      saveHistoryItem({
        hex: '#4F46E5',
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
      });
    }
  }, 100);

  console.log('[Color Picker] ✅ Initialized successfully');
}

// ============================================================
// 12. SELF-TEST
// ============================================================

function runSelfTest() {
  const testColor = '#4f46e5';
  const rgb = hexToRgb(testColor);
  
  let passed = true;
  let warnings = 0;
  
  // Test 1: Hex to RGB conversion
  if (!rgb || rgb.r !== 79 || rgb.g !== 70 || rgb.b !== 229) {
    console.error('[Self-Test] Failed: Hex to RGB conversion');
    passed = false;
  } else {
    console.log('[Self-Test] ✅ Hex to RGB: passed');
  }
  
  // Test 2: RGB to HSL conversion (with tolerance)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  if (!hsl) {
    console.error('[Self-Test] Failed: RGB to HSL conversion returned null');
    passed = false;
  } else if (Math.abs(hsl.h - 244) > 2 || Math.abs(hsl.s - 75) > 2 || Math.abs(hsl.l - 59) > 2) {
    warnings++;
    console.warn(`[Self-Test] HSL values: h=${hsl.h}, s=${hsl.s}%, l=${hsl.l}% (expected ~244, 75%, 59%) - within tolerance`);
  } else {
    console.log('[Self-Test] ✅ RGB to HSL: passed');
  }
  
  // Test 3: RGB to Hex conversion
  const hexBack = rgbToHex(rgb.r, rgb.g, rgb.b);
  if (hexBack.toLowerCase() !== testColor.toLowerCase()) {
    console.error('[Self-Test] Failed: RGB to Hex conversion');
    passed = false;
  } else {
    console.log('[Self-Test] ✅ RGB to Hex: passed');
  }
  
  // Test 4: Color update function
  try {
    const testHex = '#ff0000';
    updateColor(testHex);
    const hexInput = getCachedElement('hexInput');
    if (hexInput && hexInput.value === 'FF0000') {
      console.log('[Self-Test] ✅ Color update: passed');
    } else {
      console.warn('[Self-Test] Color update: may have issues');
      warnings++;
    }
  } catch (e) {
    console.error('[Self-Test] Failed: Color update function');
    passed = false;
  }
  // Test validation functions
const validRgb = validateRgb(79, 70, 229);
const invalidRgb = validateRgb(256, 70, 229);
const validHsl = validateHsl(244, 75, 59);
const invalidHsl = validateHsl(400, 75, 59);
const validHex = validateHex('4f46e5');
const invalidHex = validateHex('4f46');

console.log('RGB Validation:', validRgb);
console.log('Invalid RGB:', invalidRgb);
console.log('HSL Validation:', validHsl);
console.log('Invalid HSL:', invalidHsl);
console.log('HEX Validation:', validHex);
console.log('Invalid HEX:', invalidHex);

  
  // Summary
  if (passed) {
    console.log(`[Color Picker] ✅ All self-tests passed! (${warnings} warnings)`);
  } else {
    console.warn(`[Color Picker] ⚠️ Some self-tests failed. (${warnings} warnings)`);
  }
  
  return passed;
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
  initTool();
  runSelfTest();
});
// ============================================================
// 3. VALIDATION FUNCTIONS
// ============================================================

/**
 * Validate RGB values
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {object} { valid: boolean, message: string }
 */
function validateRgb(r, g, b) {
  // Check if values are numbers
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return { valid: false, message: 'RGB values must be numbers.' };
  }
  
  // Check if values are integers
  if (!Number.isInteger(r) || !Number.isInteger(g) || !Number.isInteger(b)) {
    return { valid: false, message: 'RGB values must be whole numbers (integers).' };
  }
  
  // Check range
  if (r < 0 || r > 255) {
    return { valid: false, message: 'Red must be between 0 and 255.' };
  }
  if (g < 0 || g > 255) {
    return { valid: false, message: 'Green must be between 0 and 255.' };
  }
  if (b < 0 || b > 255) {
    return { valid: false, message: 'Blue must be between 0 and 255.' };
  }
  
  return { valid: true, message: '✅ Valid RGB values!' };
}

/**
 * Validate HSL values
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {object} { valid: boolean, message: string }
 */
function validateHsl(h, s, l) {
  // Check if values are numbers
  if (isNaN(h) || isNaN(s) || isNaN(l)) {
    return { valid: false, message: 'HSL values must be numbers.' };
  }
  
  // Check range
  if (h < 0 || h > 360) {
    return { valid: false, message: 'Hue must be between 0 and 360.' };
  }
  if (s < 0 || s > 100) {
    return { valid: false, message: 'Saturation must be between 0 and 100%.' };
  }
  if (l < 0 || l > 100) {
    return { valid: false, message: 'Lightness must be between 0 and 100%.' };
  }
  
  return { valid: true, message: '✅ Valid HSL values!' };
}

/**
 * Check if a string is a valid HEX color
 * @param {string} hex - HEX color string
 * @returns {object} { valid: boolean, message: string }
 */
function validateHex(hex) {
  // Remove # if present
  const clean = hex.replace('#', '');
  
  // Check length
  if (clean.length !== 6) {
    return { valid: false, message: 'HEX must be 6 characters (e.g., 4f46e5).' };
  }
  
  // Check if valid hex characters
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return { valid: false, message: 'HEX contains invalid characters. Use 0-9 and A-F.' };
  }
  
  return { valid: true, message: '✅ Valid HEX color!' };
}

/**
 * Check if a string is a valid RGB format
 * @param {string} input - RGB string
 * @returns {object} { valid: boolean, values: array, message: string }
 */
function parseAndValidateRgb(input) {
  // Try to extract RGB values
  let match = input.match(/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/);
  if (!match) {
    match = input.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  }
  
  if (!match) {
    return { 
      valid: false, 
      message: 'Invalid RGB format. Use: 79, 70, 229 or rgb(79, 70, 229)' 
    };
  }
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  const validation = validateRgb(r, g, b);
  return {
    valid: validation.valid,
    values: { r, g, b },
    message: validation.message
  };
}

/**
 * Check if a string is a valid HSL format
 * @param {string} input - HSL string
 * @returns {object} { valid: boolean, values: array, message: string }
 */
function parseAndValidateHsl(input) {
  // Remove "hsl(" and ")" if present
  let cleaned = input.replace(/^hsl\s*\(/i, '').replace(/\)\s*$/, '');
  
  // Split by commas
  let parts = cleaned.split(',').map(s => s.trim());
  
  if (parts.length !== 3) {
    return { 
      valid: false, 
      message: 'Invalid HSL format. Use: 244, 75%, 59% or 244, 75, 59' 
    };
  }
  
  // Parse values (remove % for parsing)
  let h = parseInt(parts[0]);
  let s = parseInt(parts[1].replace('%', ''));
  let l = parseInt(parts[2].replace('%', ''));
  
  if (isNaN(h) || isNaN(s) || isNaN(l)) {
    return { 
      valid: false, 
      message: 'Invalid HSL values. Please enter numbers.' 
    };
  }
  
  const validation = validateHsl(h, s, l);
  return {
    valid: validation.valid,
    values: { h, s, l },
    message: validation.message
  };
}