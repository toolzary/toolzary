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

const FORMAT_CONFIG={
inputFormats:[
"image/jpeg",
"image/jpg",
"image/png",
"image/webp",
"image/gif",
"image/bmp",
"image/svg+xml",
"image/avif"
],
outputFormats:{
"image/png":{
extension:"png",
mimeType:"image/png",
supportsQuality:false,
label:"PNG"
},
"image/jpeg":{
extension:"jpg",
mimeType:"image/jpeg",
supportsQuality:true,
label:"JPG"
},
"image/webp":{
extension:"webp",
mimeType:"image/webp",
supportsQuality:true,
label:"WEBP"
},
"image/avif":{
extension:"avif",
mimeType:"image/avif",
supportsQuality:true,
label:"AVIF"
},
"image/svg+xml":{
extension:"svg",
mimeType:"image/svg+xml",
supportsQuality:false,
label:"SVG"
},
"application/pdf":{
extension:"pdf",
mimeType:"application/pdf",
supportsQuality:false,
label:"PDF"
}
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

function detectImageFormat(e){
const ext=e.name.split(".").pop().toLowerCase();

return {
jpg:"image/jpeg",
jpeg:"image/jpeg",
png:"image/png",
webp:"image/webp",
gif:"image/gif",
bmp:"image/bmp",
svg:"image/svg+xml",
avif:"image/avif"
}[ext] || e.type;
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
// 13. IMAGE LOADING (SUPPORTED FORMATS ONLY)
// ============================================================

function loadImage(file) {

    if (!file) {
        showError('Please select a valid image file.');
        return;
    }

    const fileType = file.type || detectImageFormat(file);
    const extension = file.name.split('.').pop().toLowerCase();


    // SVG requires special handling
    if (extension === 'svg' || fileType === 'image/svg+xml') {

        loadSVG(file)
        .then(({img, width, height}) => {

            processLoadedImage(
                img,
                file,
                width,
                height
            );

        })
        .catch(err => {

            showError(
                'Failed to load SVG: ' + err.message
            );

        });

        return;
    }


    // Supported browser formats
    if (!FORMAT_CONFIG.inputFormats.includes(fileType)) {

        showError(
            `Format ${fileType} is not supported.`
        );

        return;
    }


    const reader = new FileReader();


    reader.onload = function(e) {

        const img = new Image();


        img.onload = function() {

            if (!img.width || !img.height) {

                showError(
                    'Invalid image dimensions.'
                );

                return;
            }


            processLoadedImage(
                img,
                file,
                img.width,
                img.height
            );

        };


        img.onerror = function() {

            showError(
                'Browser cannot decode this image.'
            );

        };


        img.src = e.target.result;

    };


    reader.onerror = function() {

        showError(
            'Failed to read image file.'
        );

    };


    reader.readAsDataURL(file);
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
  
  setTimeout(performResize, 300);
  showSuccess('Image loaded successfully!');
}
function isValidImage(img){
return img &&
img.width>0 &&
img.height>0;
}
// ============================================================
// PIXEL SIZE VALIDATION
// ============================================================

function validateResizeDimensions(width, height) {
    const MAX_WIDTH = 10000;
    const MAX_HEIGHT = 10000;
    const MAX_PIXELS = 40000000; // 40 megapixels

    if (!Number.isFinite(width) || !Number.isFinite(height)) {
        showError("Invalid dimensions.");
        return false;
    }

    if (width < 1 || height < 1) {
        showError("Width and height must be greater than zero.");
        return false;
    }

    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        showError(
            `Image size too large. Maximum allowed size is ${MAX_WIDTH} × ${MAX_HEIGHT}px.`
        );
        return false;
    }

    if ((width * height) > MAX_PIXELS) {
        showError(
            `Image resolution too large (${Math.round(width * height / 1000000)}MP). Please use a smaller size.`
        );
        return false;
    }

    return true;
}
// ============================================================
// 14. REAL-TIME RESIZE
// ============================================================

function performResize() {
  if(!isValidImage(currentImage)) return;
  
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
     if (resizedSize) {
    resizedSize.textContent = 'Ready';
}
      
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
  }, 350);
}

// ============================================================
// 16. LIVE ASPECT RATIO UPDATE
// ============================================================

function updateHeightFromWidth() {
  if(!isValidImage(currentImage)) return;
  
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
  if(!isValidImage(currentImage)) return;
  
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
        
        showSuccess(`Downloaded as ${extension.toUpperCase()}!`);
        isDownloading = false;
        
    } catch (error) {
        console.error('Download error:', error);
        showError(`Failed to download. Please try again.`);
        isDownloading = false;
    }
}

// ============================================================
// 20. UI EVENTS & INITIALIZATION
// ============================================================

function initTool() {
    const dropZone = getCachedElement('dropZone');
    const imageInput = getCachedElement('imageInput');
    const changeImageBtn = getCachedElement('changeImageBtn');
    const resizeBtn = getCachedElement('resizeBtn');
    const downloadBtn = getCachedElement('downloadBtn');
    const platformSelect = getCachedElement('platformSelect');
    const typeSelect = getCachedElement('typeSelect');
    const paperSelect = getCachedElement('paperSelect');
    const printDpi = getCachedElement('printDpi');
    const qualitySelect = getCachedElement('qualitySelect');
    const formatSelect = getCachedElement('formatSelect');
    const resizeMode = getCachedElement('resizeMode');

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
    // Initialize
    updateTypeOptions();
    updatePrintDisplay();
    
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
    
   const requiredFormats = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

requiredFormats.forEach(format => {

    if (!FORMAT_CONFIG.inputFormats.includes(format)) {
        console.error(
            `[Self-Test] Missing format: ${format}`
        );
        passed = false;
    }

});
    
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
