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

        <!-- ===== TOOL INTERFACE ===== -->
        <div class="tool-custom-interface">

          <!-- Color Input -->
          <div class="color-input-group">
            <div class="color-picker-wrapper">
              <label class="input-label">Pick a Color</label>
              <input type="color" id="colorPicker" class="color-picker-input" value="#4f46e5">
            </div>
            <div class="color-hex-input">
              <label class="input-label">Or Enter HEX Code</label>
              <div class="hex-input-wrapper">
                <span class="hex-hash">#</span>
                <input type="text" id="hexInput" class="data-input-field hex-input" placeholder="4f46e5" maxlength="6" value="4f46e5">
              </div>
            </div>
          </div>

          <!-- Dropdown Selector for Palette Type -->
          <div class="form-group">
            <label for="paletteType" class="input-label">Select Palette Type</label>
            <select id="paletteType" class="data-input-field select-field">
  <option value="monochromatic">Monochromatic</option>
  <option value="analogous">Analogous</option>
  <option value="complementary">Complementary</option>
  <option value="triadic">Triadic</option>
  <option value="tetradic">Tetradic</option>
</select>
          </div>

          <!-- Generate Button -->
          <button id="generateBtn" class="third-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-right:6px;vertical-align:middle;">
              <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/>
            </svg>
            Generate Palette
          </button>

          <!-- Palette Display -->
          <div id="paletteResultBox" class="result-box-card hidden">
            <h3 class="result-box-title">Generated Palette</h3>
            <div id="paletteDisplay" class="palette-display">
              <!-- Colors rendered by JS -->
            </div>
            <div class="palette-actions">
              <button id="copyPaletteBtn" class="secondary-btn">Copy All</button>
              <button id="downloadPaletteBtn" class="secondary-btn">Download CSS</button>
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


    initTool();
    runSelfTest();



});
/**
 * Color Palette Generator - Complete Implementation
 * With dropdown selector
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
  
  return { h: h * 360, s: s * 100, l: l * 100 };
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
// 3. PALETTE GENERATION FUNCTIONS (FIXED)
// ============================================================

/**
 * Monochromatic - 5 colors (variations of single hue)
 */
function generateMonochromatic(baseColor) {
  const rgb = hexToRgb(baseColor);

if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  // 5 shades from light to dark
  const steps = [70, 55, 40, 25, 10];
  
  steps.forEach(step => {
    const newL = Math.min(95, Math.max(5, step));
    const newRgb = hslToRgb(hsl.h, Math.min(90, hsl.s), newL);
    colors.push(rgbToHex(Math.round(newRgb.r), Math.round(newRgb.g), Math.round(newRgb.b)));
  });
  
  return colors;
}

/**
 * Analogous - 5 colors (adjacent on color wheel)
 */
function generateAnalogous(baseColor) {
  const rgb = hexToRgb(baseColor);

if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  // 5 colors: -40°, -20°, 0°, 20°, 40°
  const offsets = [-40, -20, 0, 20, 40];
  
  offsets.forEach(offset => {
    const newH = (hsl.h + offset + 360) % 360;
    const newRgb = hslToRgb(newH, Math.min(90, hsl.s + 5), Math.min(85, hsl.l + 5));
    colors.push(rgbToHex(Math.round(newRgb.r), Math.round(newRgb.g), Math.round(newRgb.b)));
  });
  
  return colors;
}

/**
 * Complementary - 5 colors (base + opposite + variations)
 */
function generateComplementary(baseColor) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  
  // Color 1: Base
  colors.push(baseColor);
  
  // Color 2: Complementary (180° opposite)
  const compH = (hsl.h + 180) % 360;
  const compRgb = hslToRgb(compH, Math.min(90, hsl.s + 10), Math.min(85, hsl.l + 5));
  colors.push(rgbToHex(Math.round(compRgb.r), Math.round(compRgb.g), Math.round(compRgb.b)));
  
  // Colors 3-5: Variations
  const variants = [-30, 0, 30];
  variants.forEach(v => {
    const h = (hsl.h + 180 + v + 360) % 360;
    const r = hslToRgb(h, Math.min(90, hsl.s + 10), Math.min(80, hsl.l - 5));
    colors.push(rgbToHex(Math.round(r.r), Math.round(r.g), Math.round(r.b)));
  });
  
  return colors;
}

/**
 * Triadic - 3 colors (evenly spaced 120° apart)
 */
function generateTriadic(baseColor) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  
  // 3 colors: 0°, 120°, 240°
  const angles = [0, 120, 240];
  
  angles.forEach(angle => {
    const newH = (hsl.h + angle + 360) % 360;
    const newRgb = hslToRgb(newH, Math.min(90, hsl.s), Math.min(85, hsl.l));
    colors.push(rgbToHex(Math.round(newRgb.r), Math.round(newRgb.g), Math.round(newRgb.b)));
  });
  
  return colors;
}

/**
 * Tetradic - 4 colors (rectangle on color wheel, 90° apart)
 */
function generateTetradic(baseColor) {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  
  // 4 colors: 0°, 90°, 180°, 270°
  const angles = [0, 90, 180, 270];
  
  angles.forEach((angle, index) => {
    const newH = (hsl.h + angle + 360) % 360;
    // Alternate lightness for variety
    const newL = Math.min(85, Math.max(15, hsl.l + (index % 2 === 0 ? 10 : -10)));
    const newRgb = hslToRgb(newH, Math.min(90, hsl.s), newL);
    colors.push(rgbToHex(Math.round(newRgb.r), Math.round(newRgb.g), Math.round(newRgb.b)));
  });
  
  return colors;
}

function generatePalette(baseColor, type) {
  const paletteFunctions = {
    monochromatic: generateMonochromatic,
    analogous: generateAnalogous,
    complementary: generateComplementary,
    triadic: generateTriadic,
    tetradic: generateTetradic
  };
  
  const fn = paletteFunctions[type] || generateMonochromatic;
  return fn(baseColor);
}

// ============================================================
// 4. UI UPDATE FUNCTIONS
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

function displayPalette(colors, type, shouldScroll = false) {
  const paletteDisplay = getCachedElement('paletteDisplay');
  const resultBox = getCachedElement('paletteResultBox');
  
  if (!paletteDisplay) return;
  
  const typeNames = {
    monochromatic: 'Monochromatic',
    analogous: 'Analogous',
    complementary: 'Complementary',
    triadic: 'Triadic',
    tetradic: 'Tetradic'
  };
  
  paletteDisplay.innerHTML = colors.map(color => `
    <div class="palette-color" data-color="${color}">
      <div class="palette-color-swatch" style="background: ${color};" onclick="copyColor('${color}')"></div>
      <span class="palette-color-hex" onclick="copyColor('${color}')">${color.toUpperCase()}</span>
    </div>
  `).join('');
  
  if (resultBox) {
  resultBox.classList.remove('hidden');

  if (shouldScroll) {
    setTimeout(() => {
      resultBox.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 150);
  }
}
  
  // Store colors for copy/download
  window._currentPalette = colors;
  window._currentType = typeNames[type] || type;
}

// ============================================================
// 5. COPY & DOWNLOAD FUNCTIONS
// ============================================================

window.copyColor = function(color) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(color).then(() => {
      showSuccess(`Copied ${color} to clipboard!`);
    }).catch(() => {
      fallbackCopy(color);
    });
  } else {
    fallbackCopy(color);
  }
};

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
    showSuccess(`Copied ${text} to clipboard!`);
  } catch (error) {
    showError('Failed to copy. Please copy manually.');
  }
  
  document.body.removeChild(textarea);
}

function copyAllColors() {
  const colors = window._currentPalette || [];
  if (colors.length === 0) {
    showError('No palette to copy. Generate one first.');
    return;
  }
  
  const text = colors.join('\n');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess('Copied all colors to clipboard!');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function downloadPalette() {
  const colors = window._currentPalette || [];
  const type = window._currentType || 'Palette';
  
  if (colors.length === 0) {
    showError('No palette to download. Generate one first.');
    return;
  }
  
  const cssContent = `/* ${type} Color Palette */
:root {
${colors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}
}

/* Usage Example */
.example {
${colors.map((color, i) => `  --color-${i + 1}: ${color};`).join('\n')}
}
`;
  
  const blob = new Blob([cssContent], { type: 'text/css' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${type.toLowerCase()}-palette.css`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showSuccess('Palette downloaded as CSS!');
}

// ============================================================
// 7. MAIN TOOL INITIALIZATION
// ============================================================

function generatePaletteFromInput(shouldScroll = true) {
  const hexInput = getCachedElement('hexInput');
  const paletteType = getCachedElement('paletteType');
  
  if (!hexInput || !paletteType) return;
  
  let hex = hexInput.value.trim();
  if (!hex) {
    showError('Please enter a valid HEX color.');
    return;
  }
  
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
  showError('Please enter a valid 6-digit HEX code (e.g., 4f46e5).');
  return;
}
  
  const color = '#' + hex;
  const type = paletteType.value;
  const colors = generatePalette(color, type);
  displayPalette(colors, type, shouldScroll);
  
}

function initTool() {
  const colorPicker = getCachedElement('colorPicker');
  const hexInput = getCachedElement('hexInput');
  const generateBtn = getCachedElement('generateBtn');
  const copyPaletteBtn = getCachedElement('copyPaletteBtn');
  const downloadPaletteBtn = getCachedElement('downloadPaletteBtn');
  const paletteType = getCachedElement('paletteType');

  if (!colorPicker || !hexInput || !generateBtn) {
    console.error('[Color Palette] Elements not found');
    return;
  }

  // ===== Update HEX from Color Picker =====

  colorPicker.addEventListener('input', () => {
    const hex = colorPicker.value.replace('#', '');
    hexInput.value = hex;
  });

  // ===== Update Color Picker from HEX =====

  hexInput.addEventListener('input', () => {
    let val = hexInput.value.replace('#', '').toUpperCase();
    val = val.replace(/[^0-9A-F]/g, '');
    hexInput.value = val;
    
    if (val.length === 6) {
      colorPicker.value = '#' + val;
    }
  });

  // ===== Generate Palette =====

  generateBtn.addEventListener('click', generatePaletteFromInput);

  // ===== Enter Key Support =====

  hexInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      generatePaletteFromInput(false);
    }
  });

  // ===== Copy All Colors =====

  if (copyPaletteBtn) {
    copyPaletteBtn.addEventListener('click', copyAllColors);
  }

  // ===== Download CSS =====

  if (downloadPaletteBtn) {
    downloadPaletteBtn.addEventListener('click', downloadPalette);
  }

  // ===== Auto-generate on palette type change =====

  if (paletteType) {
    paletteType.addEventListener('change', () => {
      if (hexInput.value.length === 6) {
       generatePaletteFromInput(false);
      }
    });
  }
  console.log('[Color Palette] ✅ Initialized successfully');
}
// ============================================================
// 13. SELF-TEST
// ============================================================

function runSelfTest() {
  const testColor = '#4f46e5';
  const colors = generatePalette(testColor, 'monochromatic');
  
  let passed = true;
  
  if (!Array.isArray(colors) || colors.length < 3) {
    console.error('[Self-Test] Failed: Invalid palette generated');
    passed = false;
  }
  
  if (!colors.every(c => /^#[0-9A-F]{6}$/i.test(c))) {
    console.error('[Self-Test] Failed: Invalid hex colors generated');
    passed = false;
  }
  
  const rgb = hexToRgb('#4f46e5');
  if (!rgb || rgb.r !== 79 || rgb.g !== 70 || rgb.b !== 229) {
    console.error('[Self-Test] Failed: Hex to RGB conversion');
    passed = false;
  }
  
  if (passed) {
    console.log('[Color Palette] ✅ All self-tests passed!');
  } else {
    console.warn('[Color Palette] ⚠️ Some self-tests failed.');
  }
  
  return passed;
}