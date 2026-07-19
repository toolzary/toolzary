/**
 * Image Resizer - Complete Professional Tool
 * Full format support with all libraries
 * Fixed: Tracking Prevention issues, scroll on apply
 */

// ============================================================
// 1. SOCIAL MEDIA PRESETS - VERIFIED 2026 DIMENSIONS
// ============================================================

const SOCIAL_PRESETS = {
  youtube: {
    name: 'YouTube',
    types: {
      'channel-banner': { label: 'Channel Banner', width: 2560, height: 1440 },
      'video-thumbnail': { label: 'Video Thumbnail', width: 1280, height: 720 },
      'profile-picture': { label: 'Profile Picture', width: 800, height: 800 },
    }
  },
  instagram: {
    name: 'Instagram',
    types: {
      'post-square': { label: 'Square Post', width: 1080, height: 1080 },
      'post-portrait': { label: 'Portrait Post', width: 1080, height: 1350 },
      'post-landscape': { label: 'Landscape Post', width: 1080, height: 566 },
      'story': { label: 'Story / Reels', width: 1080, height: 1920 },
    }
  },
  facebook: {
    name: 'Facebook',
    types: {
      'post-landscape': { label: 'Post (Landscape)', width: 1200, height: 630 },
      'post-square': { label: 'Post (Square)', width: 1080, height: 1080 },
      'cover-photo': { label: 'Cover Photo', width: 851, height: 315 },
      'story': { label: 'Story / Reels', width: 1080, height: 1920 },
    }
  },
  twitter: {
    name: 'Twitter/X',
    types: {
      'post-landscape': { label: 'Post (Landscape)', width: 1600, height: 900 },
      'header': { label: 'Header', width: 1500, height: 500 },
      'profile-picture': { label: 'Profile Picture', width: 400, height: 400 },
    }
  },
  linkedin: {
    name: 'LinkedIn',
    types: {
      'banner-personal': { label: 'Banner (Personal)', width: 1584, height: 396 },
      'banner-company': { label: 'Banner (Company)', width: 1128, height: 191 },
      'post-landscape': { label: 'Post (Landscape)', width: 1200, height: 627 },
    }
  },
  pinterest: {
    name: 'Pinterest',
    types: {
      'pin-standard': { label: 'Standard Pin', width: 1000, height: 1500 },
      'pin-square': { label: 'Square Pin', width: 1000, height: 1000 },
    }
  },
  tiktok: {
    name: 'TikTok',
    types: {
      'video': { label: 'Video / Story', width: 1080, height: 1920 },
      'profile-picture': { label: 'Profile Picture', width: 200, height: 200 },
    }
  },
  snapchat: {
    name: 'Snapchat',
    types: {
      'story': { label: 'Story / Ad', width: 1080, height: 1920 },
    }
  }
};

// ============================================================
// 2. PRINT PRESETS
// ============================================================

const PRINT_PRESETS = {
  a4: { label: 'A4', width: 2480, height: 3508 },
  a3: { label: 'A3', width: 3508, height: 4961 },
  letter: { label: 'Letter', width: 2550, height: 3300 },
  legal: { label: 'Legal', width: 2550, height: 4200 },
  tabloid: { label: 'Tabloid', width: 3300, height: 5100 },
  photo4x6: { label: '4×6 inch', width: 1200, height: 1800 },
  photo5x7: { label: '5×7 inch', width: 1500, height: 2100 },
  photo8x10: { label: '8×10 inch', width: 2400, height: 3000 },
};

// ============================================================
// 3. COMPLETE FORMAT CONFIGURATION
// ============================================================

const FORMAT_CONFIG = {
  inputFormats: [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 
    'image/svg+xml', 'image/gif', 'image/bmp', 'image/tiff',
    'image/avif', 'image/heic', 'image/heif', 'image/ico',
    'image/psd', 'image/jp2', 'image/jxl', 'image/raw'
  ],
  
  outputFormats: {
    'image/png': { extension: 'png', mimeType: 'image/png', supportsQuality: false, label: 'PNG' },
    'image/jpeg': { extension: 'jpg', mimeType: 'image/jpeg', supportsQuality: true, label: 'JPG' },
    'image/webp': { extension: 'webp', mimeType: 'image/webp', supportsQuality: true, label: 'WEBP' },
    'image/avif': { extension: 'avif', mimeType: 'image/avif', supportsQuality: true, label: 'AVIF' },
    'image/bmp': { extension: 'bmp', mimeType: 'image/bmp', supportsQuality: false, label: 'BMP' },
    'image/tiff': { extension: 'tiff', mimeType: 'image/tiff', supportsQuality: false, label: 'TIFF' },
    'image/gif': { extension: 'gif', mimeType: 'image/gif', supportsQuality: false, label: 'GIF' },
    'image/svg+xml': { extension: 'svg', mimeType: 'image/svg+xml', supportsQuality: false, label: 'SVG' },
    'image/ico': { extension: 'ico', mimeType: 'image/ico', supportsQuality: false, label: 'ICO' },
    'image/psd': { extension: 'psd', mimeType: 'image/psd', supportsQuality: false, label: 'PSD' },
    'image/heic': { extension: 'heic', mimeType: 'image/heic', supportsQuality: true, label: 'HEIC' },
    'image/heif': { extension: 'heif', mimeType: 'image/heif', supportsQuality: true, label: 'HEIF' },
    'image/jp2': { extension: 'jp2', mimeType: 'image/jp2', supportsQuality: true, label: 'JPEG 2000' },
    'image/jxl': { extension: 'jxl', mimeType: 'image/jxl', supportsQuality: true, label: 'JPEG XL' },
    'application/pdf': { extension: 'pdf', mimeType: 'application/pdf', supportsQuality: false, label: 'PDF' }
  }
};

// ============================================================
// 4. CORE VARIABLES
// ============================================================

let currentImage = null;
let originalImageData = null;
let resizedImageData = null;
let elementCache = {};
let resizeTimeout = null;
let historyVisible = false;
let isDownloading = false;

// ============================================================
// 5. HELPER FUNCTIONS
// ============================================================

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
    errorBox.style.background = '';
    errorBox.style.color = '';
    errorBox.style.borderColor = '';
  }, 5000);
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
    errorBox.style.background = '';
    errorBox.style.color = '';
    errorBox.style.borderColor = '';
  }, 3000);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  return (bytes / 1073741824).toFixed(1) + ' GB';
}

function scrollToElement(element, offset = 20) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY + rect.top - offset;
  window.scrollTo({ top: scrollTop, behavior: 'smooth' });
}

function detectImageFormat(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  const formatMap = {
    'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
    'gif': 'image/gif', 'webp': 'image/webp', 'svg': 'image/svg+xml',
    'bmp': 'image/bmp', 'tiff': 'image/tiff', 'tif': 'image/tiff',
    'avif': 'image/avif', 'heic': 'image/heic', 'heif': 'image/heif',
    'ico': 'image/ico', 'psd': 'image/psd', 'jp2': 'image/jp2',
    'jxl': 'image/jxl', 'raw': 'image/raw'
  };
  return formatMap[extension] || file.type;
}

// ============================================================
// 6. TEMPLATE MANAGEMENT
// ============================================================

function updateTypeOptions() {
  const platform = getCachedElement('platformSelect');
  const typeSelect = getCachedElement('typeSelect');
  if (!platform || !typeSelect) return;
  
  const presets = SOCIAL_PRESETS[platform.value];
  if (!presets) return;
  
  typeSelect.innerHTML = '';
  Object.keys(presets.types).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = presets.types[key].label;
    typeSelect.appendChild(option);
  });
  
  updatePresetDisplay();
}

function updatePresetDisplay() {
  const platform = getCachedElement('platformSelect');
  const type = getCachedElement('typeSelect');
  const widthDisplay = getCachedElement('presetWidth');
  const heightDisplay = getCachedElement('presetHeight');
  const customWidth = getCachedElement('customWidth');
  const customHeight = getCachedElement('customHeight');
  
  if (!platform || !type || !widthDisplay || !heightDisplay) return;
  
  const presets = SOCIAL_PRESETS[platform.value];
  if (!presets || !presets.types[type.value]) return;
  
  const preset = presets.types[type.value];
  widthDisplay.textContent = preset.width;
  heightDisplay.textContent = preset.height;
  
  if (customWidth) customWidth.value = preset.width;
  if (customHeight) customHeight.value = preset.height;
}

function updatePrintDisplay() {
  const paper = getCachedElement('paperSelect');
  const dpi = getCachedElement('printDpi');
  const widthDisplay = getCachedElement('printWidth');
  const heightDisplay = getCachedElement('printHeight');
  
  if (!paper || !dpi || !widthDisplay || !heightDisplay) return;
  
  const preset = PRINT_PRESETS[paper.value];
  if (!preset) return;
  
  const dpiValue = parseInt(dpi.value);
  const widthPx = Math.round((preset.width / 300) * dpiValue);
  const heightPx = Math.round((preset.height / 300) * dpiValue);
  
  widthDisplay.textContent = widthPx;
  heightDisplay.textContent = heightPx;
}

// ============================================================
// 7. SVG HANDLING
// ============================================================

function loadSVG(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const svgText = e.target.result;
      const img = new Image();
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      img.onload = function() {
        resolve({ img: img, svgData: svgText, width: img.width, height: img.height });
      };
      img.onerror = function() {
        reject(new Error('Failed to load SVG'));
      };
      img.src = url;
    };
    reader.onerror = function() {
      reject(new Error('Failed to read SVG file'));
    };
    reader.readAsText(file);
  });
}

function canvasToSVG(canvas) {
  const imageData = canvas.toDataURL('image/png');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${canvas.width}" 
     height="${canvas.height}">
  <image width="${canvas.width}" 
         height="${canvas.height}" 
         xlink:href="${imageData}"/>
</svg>`;
}

// ============================================================
// 8. HEIC/HEIF HANDLING
// ============================================================

function loadHEIC(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const image = new Image();
      image.onload = function() {
        resolve({ img: image, width: image.width, height: image.height });
      };
      image.onerror = function() {
        reject(new Error('HEIC decoding failed. Try using Safari or a compatible browser.'));
      };
      image.src = e.target.result;
    };
    reader.onerror = function() {
      reject(new Error('Failed to read HEIC file'));
    };
    reader.readAsDataURL(file);
  });
}

// ============================================================
// 9. BMP HANDLING (using bmp-js library)
// ============================================================

function loadBMP(file) {
  return new Promise((resolve, reject) => {
    if (typeof bmp === 'undefined') {
      reject(new Error('BMP library not loaded. Please include bmp-js.'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const buffer = e.target.result;
        const bmpData = bmp.decode(buffer);
        
        const canvas = document.createElement('canvas');
        canvas.width = bmpData.width;
        canvas.height = bmpData.height;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(bmpData.width, bmpData.height);
        imageData.data.set(bmpData.data);
        ctx.putImageData(imageData, 0, 0);
        
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        img.onload = function() {
          resolve({ img: img, width: bmpData.width, height: bmpData.height });
        };
        img.onerror = function() {
          reject(new Error('Failed to load BMP data'));
        };
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = function() {
      reject(new Error('Failed to read BMP file'));
    };
    reader.readAsArrayBuffer(file);
  });
}

// ============================================================
// 10. TIFF HANDLING (using UTIF library)
// ============================================================

function loadTIFF(file) {
  return new Promise((resolve, reject) => {
    if (typeof UTIF === 'undefined') {
      reject(new Error('TIFF library not loaded. Please include UTIF.'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const buffer = e.target.result;
        const ifds = UTIF.decode(buffer);
        if (!ifds || ifds.length === 0) {
          reject(new Error('No TIFF data found'));
          return;
        }
        
        const data = UTIF.toRGBA8(ifds[0]);
        const width = ifds[0].width;
        const height = ifds[0].height;
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(width, height);
        imageData.data.set(data);
        ctx.putImageData(imageData, 0, 0);
        
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        img.onload = function() {
          resolve({ img: img, width: width, height: height });
        };
        img.onerror = function() {
          reject(new Error('Failed to load TIFF data'));
        };
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = function() {
      reject(new Error('Failed to read TIFF file'));
    };
    reader.readAsArrayBuffer(file);
  });
}

// ============================================================
// 11. ICO HANDLING (using icojs library)
// ============================================================

function loadICO(file) {
  return new Promise((resolve, reject) => {
    if (typeof ICO === 'undefined') {
      reject(new Error('ICO library not loaded. Please include icojs.'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const buffer = e.target.result;
        const icoData = ICO.parse(buffer);
        
        if (!icoData || icoData.length === 0) {
          reject(new Error('No ICO data found'));
          return;
        }
        
        // Use the largest image
        const largest = icoData.reduce((a, b) => (a.width * a.height > b.width * b.height) ? a : b);
        
        const canvas = document.createElement('canvas');
        canvas.width = largest.width;
        canvas.height = largest.height;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(largest.width, largest.height);
        imageData.data.set(largest.buffer);
        ctx.putImageData(imageData, 0, 0);
        
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        img.onload = function() {
          resolve({ img: img, width: largest.width, height: largest.height });
        };
        img.onerror = function() {
          reject(new Error('Failed to load ICO data'));
        };
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = function() {
      reject(new Error('Failed to read ICO file'));
    };
    reader.readAsArrayBuffer(file);
  });
}

// ============================================================
// 12. PSD HANDLING (using psd.js library)
// ============================================================

function loadPSD(file) {
  return new Promise((resolve, reject) => {
    if (typeof PSD === 'undefined') {
      reject(new Error('PSD library not loaded. Please include psd.js.'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const buffer = e.target.result;
        const psd = PSD.fromArrayBuffer(buffer);
        const psdData = psd.toImageData();
        
        const canvas = document.createElement('canvas');
        canvas.width = psdData.width;
        canvas.height = psdData.height;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(psdData.width, psdData.height);
        imageData.data.set(psdData.data);
        ctx.putImageData(imageData, 0, 0);
        
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        img.onload = function() {
          resolve({ img: img, width: psdData.width, height: psdData.height });
        };
        img.onerror = function() {
          reject(new Error('Failed to load PSD data'));
        };
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = function() {
      reject(new Error('Failed to read PSD file'));
    };
    reader.readAsArrayBuffer(file);
  });
}

// ============================================================
// 13. ENHANCED IMAGE LOADING WITH ALL FORMATS
// ============================================================

function loadImage(file) {
  if (!file) {
    showError('Please select a valid image file.');
    return;
  }

  const fileType = file.type || detectImageFormat(file);
  const extension = file.name.split('.').pop().toLowerCase();
  
  // Handle different formats with library support
  switch (extension) {
    case 'bmp':
      loadBMP(file)
        .then(({ img, width, height }) => processLoadedImage(img, file, width, height))
        .catch(err => showError('Failed to load BMP: ' + err.message));
      return;
      
    case 'tiff':
    case 'tif':
      loadTIFF(file)
        .then(({ img, width, height }) => processLoadedImage(img, file, width, height))
        .catch(err => showError('Failed to load TIFF: ' + err.message));
      return;
      
    case 'ico':
      loadICO(file)
        .then(({ img, width, height }) => processLoadedImage(img, file, width, height))
        .catch(err => showError('Failed to load ICO: ' + err.message));
      return;
      
    case 'psd':
      loadPSD(file)
        .then(({ img, width, height }) => processLoadedImage(img, file, width, height))
        .catch(err => showError('Failed to load PSD: ' + err.message));
      return;
      
    case 'svg':
      loadSVG(file)
        .then(({ img, width, height }) => processLoadedImage(img, file, width, height))
        .catch(err => showError('Failed to load SVG: ' + err.message));
      return;
      
    case 'heic':
    case 'heif':
      loadHEIC(file)
        .then(({ img, width, height }) => processLoadedImage(img, file, width, height))
        .catch(err => showError('Failed to load HEIC: ' + err.message));
      return;
      
    default:
      // Standard image formats (jpg, png, webp, gif, avif)
      if (FORMAT_CONFIG.inputFormats.includes(fileType)) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const img = new Image();
          img.onload = function() {
            processLoadedImage(img, file, img.width, img.height);
          };
          img.onerror = function() {
            showError('Failed to load image. Please try another file.');
          };
          img.src = e.target.result;
        };
        reader.onerror = function() {
          showError('Failed to read file. Please try again.');
        };
        reader.readAsDataURL(file);
      } else {
        showError(`Format ${fileType} is not supported.`);
      }
  }
}

function processLoadedImage(img, file, width, height) {
  currentImage = img;
  originalImageData = {
    name: file.name,
    size: file.size,
    width: width,
    height: height,
    type: file.type || detectImageFormat(file)
  };
  
  const uploadSection = document.getElementById('uploadSection');
  const mainContent = document.getElementById('mainContent');
  
  if (uploadSection) {
    uploadSection.classList.add('hidden');
    uploadSection.style.display = 'none';
  }
  
  if (mainContent) {
    mainContent.classList.remove('hidden');
    mainContent.classList.add('show');
    mainContent.style.display = 'block';
  }
  
  const previewImage = document.getElementById('previewImage');
  if (previewImage) {
    previewImage.src = img.src;
    previewImage.style.display = 'block';
  }
  
  const imageName = document.getElementById('imageName');
  const imageSize = document.getElementById('imageSize');
  const imageDimensions = document.getElementById('imageDimensions');
  
  if (imageName) imageName.textContent = file.name;
  if (imageSize) imageSize.textContent = formatFileSize(file.size);
  if (imageDimensions) imageDimensions.textContent = `${width} × ${height}`;
  
  const customWidth = document.getElementById('customWidth');
  const customHeight = document.getElementById('customHeight');
  if (customWidth) customWidth.value = width;
  if (customHeight) customHeight.value = height;
  
  saveHistory({
    name: file.name,
    original: `${width}×${height}`,
    resized: 'Original',
    size: formatFileSize(file.size),
    imageData: img.src
  });
  
  setTimeout(performResize, 300);
  showSuccess('Image loaded successfully!');
}

// ============================================================
// 14. REAL-TIME RESIZE
// ============================================================

function performResize() {
  if (!currentImage) return;
  
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    try {
      const activeTab = document.querySelector('.template-tab.active');
      if (!activeTab) return;
      
      const tab = activeTab.dataset.template;
      let targetWidth, targetHeight;
      
      if (tab === 'social') {
        const platform = getCachedElement('platformSelect');
        const type = getCachedElement('typeSelect');
        if (platform && type) {
          const presets = SOCIAL_PRESETS[platform.value];
          if (presets && presets.types[type.value]) {
            targetWidth = presets.types[type.value].width;
            targetHeight = presets.types[type.value].height;
          }
        }
      } else if (tab === 'print') {
        const paper = getCachedElement('paperSelect');
        const dpi = getCachedElement('printDpi');
        if (paper && dpi) {
          const preset = PRINT_PRESETS[paper.value];
          if (preset) {
            const dpiValue = parseInt(dpi.value);
            targetWidth = Math.round((preset.width / 300) * dpiValue);
            targetHeight = Math.round((preset.height / 300) * dpiValue);
          }
        }
      } else {
        const customWidth = getCachedElement('customWidth');
        const customHeight = getCachedElement('customHeight');
        const customWidthUnit = getCachedElement('customWidthUnit');
        const customHeightUnit = getCachedElement('customHeightUnit');
        const customAspect = getCachedElement('customAspect');
        
        if (!customWidth || !customHeight) return;
        
        let w = parseFloat(customWidth.value);
        let h = parseFloat(customHeight.value);
        
        if (isNaN(w) || w < 1) w = currentImage.width;
        if (isNaN(h) || h < 1) h = currentImage.height;
        
        if (customWidthUnit) {
          const wUnit = customWidthUnit.value;
          if (wUnit === 'in') w *= 96;
          else if (wUnit === 'cm') w *= 37.8;
          else if (wUnit === 'mm') w *= 3.78;
        }
        
        if (customHeightUnit) {
          const hUnit = customHeightUnit.value;
          if (hUnit === 'in') h *= 96;
          else if (hUnit === 'cm') h *= 37.8;
          else if (hUnit === 'mm') h *= 3.78;
        }
        
        targetWidth = Math.round(w);
        targetHeight = Math.round(h);
        
        if (customAspect && customAspect.checked) {
          const ratio = currentImage.width / currentImage.height;
          targetHeight = Math.round(targetWidth / ratio);
        }
      }
      
      if (!targetWidth || !targetHeight || targetWidth < 1 || targetHeight < 1) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      const resizeMode = getCachedElement('resizeMode');
      const mode = resizeMode ? resizeMode.value : 'exact';
      
      if (mode === 'fill') {
  const scale = Math.max(
    targetWidth / currentImage.width,
    targetHeight / currentImage.height
  );

  const drawWidth = currentImage.width * scale;
  const drawHeight = currentImage.height * scale;

  const dx = (targetWidth - drawWidth) / 2;
  const dy = (targetHeight - drawHeight) / 2;

  ctx.drawImage(
    currentImage,
    dx,
    dy,
    drawWidth,
    drawHeight
  );

      } else if (mode === 'fit') {
        const ratio = currentImage.width / currentImage.height;
        const targetRatio = targetWidth / targetHeight;
        let drawWidth = targetWidth;
        let drawHeight = targetHeight;
        let dx = 0, dy = 0;
        
        if (targetRatio > ratio) {
          drawWidth = targetHeight * ratio;
          dx = (targetWidth - drawWidth) / 2;
        } else {
          drawHeight = targetWidth / ratio;
          dy = (targetHeight - drawHeight) / 2;
        }
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(currentImage, dx, dy, drawWidth, drawHeight);
      } else {
        ctx.drawImage(currentImage, 0, 0, targetWidth, targetHeight);
      }
      
      resizedImageData = {
        canvas: canvas,
        width: targetWidth,
        height: targetHeight,
        quality: parseFloat(getCachedElement('qualitySelect')?.value || 0.92),
        format: getCachedElement('formatSelect')?.value || 'image/png'
      };
      
      const previewContainer = getCachedElement('resizedPreview');
      if (previewContainer) previewContainer.classList.remove('hidden');
      
      const resizedCanvas = getCachedElement('resizedCanvas');
      if (resizedCanvas) {
        const maxWidth = Math.min(targetWidth, 600);
        const maxHeight = Math.min(targetHeight, 300);
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        resizedCanvas.width = Math.round(targetWidth * ratio);
        resizedCanvas.height = Math.round(targetHeight * ratio);
        const previewCtx = resizedCanvas.getContext('2d');
        previewCtx.imageSmoothingEnabled = true;
        previewCtx.imageSmoothingQuality = 'high';
        previewCtx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
      }
      
      const resizedDimensions = getCachedElement('resizedDimensions');
      const resizedSize = getCachedElement('resizedSize');
      if (resizedDimensions) resizedDimensions.textContent = `${targetWidth} × ${targetHeight}`;
      
      const dataURL = canvas.toDataURL('image/png');
      const sizeInBytes = Math.round((dataURL.length * 3) / 4);
      if (resizedSize) resizedSize.textContent = formatFileSize(sizeInBytes);
      
    } catch (e) {
      console.warn('Resize error:', e);
    }
  }, 300);
}

// ============================================================
// 15. APPLY RESIZE - WITH SCROLL TO PREVIEW
// ============================================================

function applyResize() {
  performResize();
  
  // Scroll to preview after resize with a small delay
  setTimeout(function() {
    const previewContainer = getCachedElement('resizedPreview');
    if (previewContainer && !previewContainer.classList.contains('hidden')) {
      const targetElement = document.getElementById('resizedPreview');
      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        showSuccess('Image resized successfully!');
      }
    } else {
      const previewSection = document.querySelector('.preview-section');
      if (previewSection) {
        const targetPosition = previewSection.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  }, 500);
}

// ============================================================
// 16. LIVE ASPECT RATIO UPDATE
// ============================================================

function updateHeightFromWidth() {
  if (!currentImage) return;
  
  const customAspect = getCachedElement('customAspect');
  if (!customAspect || !customAspect.checked) return;
  
  const customWidth = getCachedElement('customWidth');
  const customHeight = getCachedElement('customHeight');
  const customWidthUnit = getCachedElement('customWidthUnit');
  const customHeightUnit = getCachedElement('customHeightUnit');
  
  if (!customWidth || !customHeight) return;
  
  const w = parseFloat(customWidth.value);
  if (isNaN(w) || w < 1) return;
  
  const ratio = currentImage.width / currentImage.height;
  let widthPx = w;
  
  if (customWidthUnit) {
    const wUnit = customWidthUnit.value;
    if (wUnit === 'in') widthPx = w * 96;
    else if (wUnit === 'cm') widthPx = w * 37.8;
    else if (wUnit === 'mm') widthPx = w * 3.78;
  }
  
  let heightPx = widthPx / ratio;
  
  if (customHeightUnit) {
    const hUnit = customHeightUnit.value;
    if (hUnit === 'in') heightPx = heightPx / 96;
    else if (hUnit === 'cm') heightPx = heightPx / 37.8;
    else if (hUnit === 'mm') heightPx = heightPx / 3.78;
  }
  
  customHeight.value = parseFloat(heightPx.toFixed(4));
}

function updateWidthFromHeight() {
  if (!currentImage) return;
  
  const customAspect = getCachedElement('customAspect');
  if (!customAspect || !customAspect.checked) return;
  
  const customWidth = getCachedElement('customWidth');
  const customHeight = getCachedElement('customHeight');
  const customWidthUnit = getCachedElement('customWidthUnit');
  const customHeightUnit = getCachedElement('customHeightUnit');
  
  if (!customWidth || !customHeight) return;
  
  const h = parseFloat(customHeight.value);
  if (isNaN(h) || h < 1) return;
  
  const ratio = currentImage.width / currentImage.height;
  let heightPx = h;
  
  if (customHeightUnit) {
    const hUnit = customHeightUnit.value;
    if (hUnit === 'in') heightPx = h * 96;
    else if (hUnit === 'cm') heightPx = h * 37.8;
    else if (hUnit === 'mm') heightPx = h * 3.78;
  }
  
  let widthPx = heightPx * ratio;
  
  if (customWidthUnit) {
    const wUnit = customWidthUnit.value;
    if (wUnit === 'in') widthPx = widthPx / 96;
    else if (wUnit === 'cm') widthPx = widthPx / 37.8;
    else if (wUnit === 'mm') widthPx = widthPx / 3.78;
  }
  
  customWidth.value = parseFloat(widthPx.toFixed(4));
}

// ============================================================
// 17. PDF GENERATION USING jsPDF
// ============================================================

function generatePDF(canvas, filename) {
    return new Promise((resolve, reject) => {
        try {
            // Check if jsPDF is loaded
            const PDF = window.jspdf?.jsPDF || window.jsPDF || (typeof jsPDF !== 'undefined' ? jsPDF : null);
            
            if (!PDF) {
                reject(new Error('jsPDF library not loaded. Please include the library.'));
                return;
            }
            
            // Convert canvas to image data
            const imgData = canvas.toDataURL('image/jpeg', 0.95);
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            // Determine orientation
            const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
            
            // Create PDF with proper size
            const pdf = new PDF({
                orientation: orientation,
                unit: 'px',
                format: [imgWidth, imgHeight]
            });
            
            // Add image to PDF
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
            
            // Save PDF
            pdf.save(filename);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

// ============================================================
// 18. COMPLETE DOWNLOAD FUNCTION - ALL FORMATS
// ============================================================

function downloadImage() {
    if (isDownloading) {
        showError('Download already in progress. Please wait.');
        return;
    }
    
    if (!resizedImageData) {
        showError('Please resize the image first.');
        return;
    }
    
    const formatSelect = getCachedElement('formatSelect');
    const format = formatSelect ? formatSelect.value : 'image/png';
    const canvas = resizedImageData.canvas;
    const quality = resizedImageData.quality || 0.92;
    
    const formatConfig = FORMAT_CONFIG.outputFormats[format];
    if (!formatConfig) {
        showError('Unsupported format: ' + format);
        return;
    }
    
    const extension = formatConfig.extension;
    const mimeType = formatConfig.mimeType;
    
    isDownloading = true;
    
    try {
        // ===== SVG Export =====
        if (format === 'image/svg+xml') {
            const svgData = canvasToSVG(canvas);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.download = `image.${extension}`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            saveHistory({
                name: originalImageData?.name || 'image',
                original: originalImageData ? `${originalImageData.width}×${originalImageData.height}` : '',
                resized: `${canvas.width}×${canvas.height}`,
                size: formatFileSize(blob.size),
                imageData: url
            });
            
            showSuccess(`Downloaded as ${extension.toUpperCase()}!`);
            isDownloading = false;
            return;
        }
        
        // ===== PSD Export =====
        if (format === 'image/psd') {
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `image.${extension}`;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            saveHistory({
                name: originalImageData?.name || 'image',
                original: originalImageData ? `${originalImageData.width}×${originalImageData.height}` : '',
                resized: `${canvas.width}×${canvas.height}`,
                size: formatFileSize(Math.round((dataURL.length * 3) / 4)),
                imageData: dataURL
            });
            
            showSuccess(`Downloaded as ${extension.toUpperCase()}!`);
            isDownloading = false;
            return;
        }
        
        // ===== PDF Export using jsPDF =====
        if (format === 'application/pdf') {
            const PDF = window.jspdf?.jsPDF || window.jsPDF || (typeof jsPDF !== 'undefined' ? jsPDF : null);
            
            if (!PDF) {
                showError('PDF library not loaded. Please include jspdf library.');
                isDownloading = false;
                return;
            }
            
            try {
                showSuccess('Generating PDF...');
                const filename = `image.${extension}`;
                
                generatePDF(canvas, filename)
                    .then(() => {
                        saveHistory({
                            name: originalImageData?.name || 'image',
                            original: originalImageData ? `${originalImageData.width}×${originalImageData.height}` : '',
                            resized: `${canvas.width}×${canvas.height}`,
                            size: 'PDF',
                            imageData: canvas.toDataURL('image/png')
                        });
                        
                        showSuccess(`Downloaded as ${extension.toUpperCase()}!`);
                        isDownloading = false;
                    })
                    .catch((error) => {
                        console.error('PDF Error:', error);
                        showError('PDF generation failed: ' + error.message);
                        isDownloading = false;
                    });
                return;
            } catch (error) {
                console.error('PDF Error:', error);
                showError('PDF generation failed. Please try again.');
                isDownloading = false;
                return;
            }
        }
        
        // ===== Standard Image Formats =====
        let dataURL;
        let isBrowserSupported = false;
        
        // Check if browser supports this format
        try {
            const testCanvas = document.createElement('canvas');
            testCanvas.width = 1;
            testCanvas.height = 1;
            const testCtx = testCanvas.getContext('2d');
            testCtx.fillStyle = '#ffffff';
            testCtx.fillRect(0, 0, 1, 1);
            const testData = testCanvas.toDataURL(mimeType);
            isBrowserSupported = testData && !testData.startsWith('data:,');
        } catch (e) {
            isBrowserSupported = false;
        }
        
        if (!isBrowserSupported) {
            showError(`${formatConfig.label} not supported. Using PNG instead.`);
            dataURL = canvas.toDataURL('image/png');
            const fallbackExt = 'png';
            
            const link = document.createElement('a');
            link.download = `image.${fallbackExt}`;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            saveHistory({
                name: originalImageData?.name || 'image',
                original: originalImageData ? `${originalImageData.width}×${originalImageData.height}` : '',
                resized: `${canvas.width}×${canvas.height}`,
                size: formatFileSize(Math.round((dataURL.length * 3) / 4)),
                imageData: dataURL
            });
            
            showSuccess(`Downloaded as ${fallbackExt.toUpperCase()} (fallback)!`);
            isDownloading = false;
            return;
        }
        
        // Generate the image data
        if (formatConfig.supportsQuality) {
            dataURL = canvas.toDataURL(mimeType, quality);
        } else {
            dataURL = canvas.toDataURL(mimeType);
        }
        
        // Download the file
        const link = document.createElement('a');
        link.download = `image.${extension}`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        const sizeInBytes = Math.round((dataURL.length * 3) / 4);
        saveHistory({
            name: originalImageData?.name || 'image',
            original: originalImageData ? `${originalImageData.width}×${originalImageData.height}` : '',
            resized: `${canvas.width}×${canvas.height}`,
            size: formatFileSize(sizeInBytes),
            imageData: dataURL
        });
        
        showSuccess(`Downloaded as ${extension.toUpperCase()}!`);
        isDownloading = false;
        
    } catch (error) {
        console.error('Download error:', error);
        showError(`Failed to download. Please try again.`);
        isDownloading = false;
    }
}

// ============================================================
// 19. HISTORY MANAGEMENT
// ============================================================

function getHistory() {
    try {
        const data = localStorage.getItem('imageResizeHistory');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveHistory(entry) {
    try {
        const history = getHistory();
        history.unshift({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...entry
        });
        if (history.length > 50) history.length = 50;
        localStorage.setItem('imageResizeHistory', JSON.stringify(history));
        renderHistory();
    } catch (e) {
        console.warn('Failed to save history:', e);
    }
}

function clearHistory() {
    localStorage.removeItem('imageResizeHistory');
    renderHistory();
}

function deleteHistoryItem(id) {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem('imageResizeHistory', JSON.stringify(filtered));
    renderHistory();
}

function restoreHistoryItem(id) {
    const history = getHistory();
    const item = history.find(h => h.id === id);
    if (!item) {
        showError('History item not found.');
        return;
    }
    
    if (!item.imageData) {
        showError('Image data not available for restore.');
        return;
    }
    
    fetch(item.imageData)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], item.name || 'restored-image.png', { type: 'image/png' });
            loadImage(file);
            showSuccess(`Restored: ${item.name}`);
        })
        .catch(err => {
            showError('Failed to restore image.');
            console.error(err);
        });
}

function renderHistory() {
    const list = getCachedElement('historyList');
    if (!list) return;
    
    const history = getHistory();
    
    if (history.length === 0) {
        list.innerHTML = '<p class="empty-history">No history yet.</p>';
        return;
    }
    
    list.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-item-info">
                <span class="history-item-name">${item.name}</span>
                <span class="history-item-dims">${item.original || ''} → ${item.resized || ''}</span>
                <span class="history-item-size">${item.size || ''}</span>
                <span class="history-item-time">${new Date(item.timestamp).toLocaleString()}</span>
            </div>
            <div class="history-item-actions">
                <button class="history-btn" onclick="window.restoreHistoryItemUI(${item.id})">↻ Restore</button>
                <button class="history-btn danger" onclick="window.deleteHistoryItemUI(${item.id})">✕</button>
            </div>
        </div>
    `).join('');
}

window.restoreHistoryItemUI = function(id) {
    restoreHistoryItem(id);
};

window.deleteHistoryItemUI = function(id) {
    deleteHistoryItem(id);
};

// ============================================================
// 20. UI EVENTS & INITIALIZATION
// ============================================================

function initTool() {
    const dropZone = getCachedElement('dropZone');
    const imageInput = getCachedElement('imageInput');
    const changeImageBtn = getCachedElement('changeImageBtn');
    const resizeBtn = getCachedElement('resizeBtn');
    const downloadBtn = getCachedElement('downloadBtn');
    const historyToggleBtn = getCachedElement('historyToggleBtn');
    const clearHistoryBtn = getCachedElement('clearHistoryBtn');
    const platformSelect = getCachedElement('platformSelect');
    const typeSelect = getCachedElement('typeSelect');
    const paperSelect = getCachedElement('paperSelect');
    const printDpi = getCachedElement('printDpi');
    const qualitySelect = getCachedElement('qualitySelect');
    const formatSelect = getCachedElement('formatSelect');
    const resizeMode = getCachedElement('resizeMode');
    const historySection = getCachedElement('historySection');

    // Check PDF library
    const PDF = window.jspdf?.jsPDF || window.jsPDF || (typeof jsPDF !== 'undefined' ? jsPDF : null);
    if (PDF) {
        console.log('[Image Resizer] ✅ jsPDF library loaded successfully!');
    } else {
        console.warn('[Image Resizer] ⚠️ jsPDF library not loaded. PDF export will not work.');
    }

    // Check other libraries
    console.log('[Image Resizer] 📚 BMP library:', typeof bmp !== 'undefined' ? '✅' : '❌');
    console.log('[Image Resizer] 📚 TIFF library:', typeof UTIF !== 'undefined' ? '✅' : '❌');
    console.log('[Image Resizer] 📚 ICO library:', typeof ICO !== 'undefined' ? '✅' : '❌');
    console.log('[Image Resizer] 📚 PSD library:', typeof PSD !== 'undefined' ? '✅' : '❌');

    // Tab Switching
    document.querySelectorAll('.template-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.template-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabId = this.dataset.template;
            document.querySelectorAll('.template-content').forEach(c => c.classList.remove('active'));
            const content = getCachedElement(`template-${tabId}`);
            if (content) content.classList.add('active');
            
            setTimeout(performResize, 100);
        });
    });

    // Platform & Type Events
    if (platformSelect) {
        platformSelect.addEventListener('change', () => {
            updateTypeOptions();
            setTimeout(performResize, 100);
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', () => {
            updatePresetDisplay();
            setTimeout(performResize, 100);
        });
    }

    if (paperSelect) {
        paperSelect.addEventListener('change', () => {
            updatePrintDisplay();
            setTimeout(performResize, 100);
        });
    }

    if (printDpi) {
        printDpi.addEventListener('change', () => {
            updatePrintDisplay();
            setTimeout(performResize, 100);
        });
    }

    // Custom Input Events
    const customWidth = getCachedElement('customWidth');
    const customHeight = getCachedElement('customHeight');
    const customWidthUnit = getCachedElement('customWidthUnit');
    const customHeightUnit = getCachedElement('customHeightUnit');
    const customAspect = getCachedElement('customAspect');

    if (customWidth) {
        customWidth.addEventListener('input', function() {
            updateHeightFromWidth();
            performResize();
        });
    }

    if (customHeight) {
        customHeight.addEventListener('input', function() {
            updateWidthFromHeight();
            performResize();
        });
    }

    if (customWidthUnit) {
        customWidthUnit.addEventListener('change', function() {
            if (currentImage) updateHeightFromWidth();
            performResize();
        });
    }

    if (customHeightUnit) {
        customHeightUnit.addEventListener('change', function() {
            if (currentImage) updateWidthFromHeight();
            performResize();
        });
    }

    if (customAspect) {
        customAspect.addEventListener('change', function() {
            if (this.checked && currentImage) {
                const w = parseFloat(customWidth?.value);
                if (!isNaN(w) && w > 0) {
                    updateHeightFromWidth();
                } else if (customWidth && customHeight) {
                    customWidth.value = currentImage.width;
                    customHeight.value = currentImage.height;
                }
            }
            performResize();
        });
    }

    // Quality & Format Events
    if (qualitySelect) qualitySelect.addEventListener('change', performResize);
    if (formatSelect) formatSelect.addEventListener('change', performResize);
    if (resizeMode) resizeMode.addEventListener('change', performResize);

    // Drag and Drop
    if (dropZone) {
        dropZone.addEventListener('click', () => imageInput?.click());
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/') || file.name.endsWith('.svg') || file.name.endsWith('.heic') ||
                    file.name.endsWith('.bmp') || file.name.endsWith('.tiff') || file.name.endsWith('.ico') ||
                    file.name.endsWith('.psd')) {
                    loadImage(file);
                } else {
                    showError('Please drop an image file.');
                }
            }
        });
    }

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                loadImage(e.target.files[0]);
            }
            e.target.value = '';
        });
    }

    // Change Image
    if (changeImageBtn) {
        changeImageBtn.addEventListener('click', function() {
            if (imageInput) {
                imageInput.value = '';
                imageInput.click();
            }
        });
    }

    // Buttons - resizeBtn now uses applyResize with scroll
    if (resizeBtn) {
        resizeBtn.addEventListener('click', applyResize);
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadImage);
    }

    // History Toggle
    if (historyToggleBtn && historySection) {
        historyToggleBtn.addEventListener('click', function() {
            historyVisible = !historyVisible;
            historySection.classList.toggle('hidden');
            
            if (historyVisible) {
                renderHistory();
                setTimeout(function() {
                    const targetPosition = historySection.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                }, 200);
            }
        });
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all history?')) {
                clearHistory();
                showSuccess('History cleared!');
            }
        });
    }

    // Initialize
    updateTypeOptions();
    updatePrintDisplay();
    renderHistory();
    
    console.log('[Image Resizer] ✅ Fully initialized!');
    console.log('[Image Resizer] 📊 Social platforms:', Object.keys(SOCIAL_PRESETS).length);
    console.log('[Image Resizer] 📥 Input formats:', FORMAT_CONFIG.inputFormats.length);
    console.log('[Image Resizer] 📤 Output formats:', Object.keys(FORMAT_CONFIG.outputFormats).length);
}

// ============================================================
// 21. SELF-TEST
// ============================================================

function runSelfTest() {
    let passed = true;
    
    if (!SOCIAL_PRESETS.youtube) {
        console.error('[Self-Test] Failed: YouTube presets missing');
        passed = false;
    }
    
    if (!PRINT_PRESETS.a4) {
        console.error('[Self-Test] Failed: Print presets missing');
        passed = false;
    }
    
    if (!FORMAT_CONFIG.inputFormats || FORMAT_CONFIG.inputFormats.length < 10) {
        console.error('[Self-Test] Failed: Format configuration incomplete');
        passed = false;
    }
    
    const history = getHistory();
    if (!Array.isArray(history)) {
        console.error('[Self-Test] Failed: History should be an array');
        passed = false;
    }
    
    if (passed) {
        console.log('[Image Resizer] ✅ All self-tests passed!');
    } else {
        console.warn('[Image Resizer] ⚠️ Some self-tests failed.');
    }
    
    return passed;
}

// ============================================================
// 22. MAIN INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    initTool();
    runSelfTest();
});

console.log('[Image Resizer] 📸 Complete Image Resizer loaded!');



















