/**
 * About Page Scripts
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // SET CURRENT YEAR
    // ============================================
    
    function setYear() {
        const yearEl = document.getElementById('currentYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }
    setYear();

    // ============================================
    // LOAD CATEGORIES FROM TOOLS DATA
    // ============================================
    
    function loadCategories() {
        const grid = document.getElementById('aboutCategoriesGrid');
        if (!grid) return;
        
        // Check if TOOLS is already loaded
        if (window.TOOLS && window.TOOLS.length > 0) {
            renderCategories(grid);
            return;
        }
        
        // Retry if TOOLS not loaded yet
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        const checkInterval = setInterval(function() {
            attempts++;
            if (window.TOOLS && window.TOOLS.length > 0) {
                clearInterval(checkInterval);
                renderCategories(grid);
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                grid.innerHTML = '<p style="color: var(--text-secondary, #64748b);">Loading categories...</p>';
            }
        }, 100);
    }

    function renderCategories(grid) {
        const tools = window.TOOLS || [];
        const categories = {};
        
        // Group tools by category
        tools.forEach(function(tool) {
            if (!categories[tool.cat]) {
                categories[tool.cat] = [];
            }
            categories[tool.cat].push(tool);
        });

        // Category metadata
        const categoryMeta = {
            'basic': { name: 'Basic Calculators', icon: 'calculator' },
            'health': { name: 'Health & Fitness', icon: 'heart' },
            'student': { name: 'Student Tools', icon: 'graduation-cap' },
            'finance': { name: 'Finance Tools', icon: 'dollar-sign' },
            'dev': { name: 'Developer Tools', icon: 'code' },
            'media': { name: 'Media Tools', icon: 'image' }
        };

        // SVG icons for each category
        const categoryIcons = {
            'calculator': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="8" y1="14" x2="8" y2="18"/></svg>`,
            'heart': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
            'graduation-cap': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
            'dollar-sign': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
            'code': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
            'image': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
        };

        grid.innerHTML = Object.keys(categories).map(function(cat) {
            const count = categories[cat].length;
            const meta = categoryMeta[cat] || { name: cat.charAt(0).toUpperCase() + cat.slice(1), icon: 'package' };
            const iconSvg = categoryIcons[meta.icon] || categoryIcons['calculator'];
            
            return `
                <a href="/tools/?cat=${cat}" class="about-category-card" data-category="${cat}">
                    <div class="about-category-icon">${iconSvg}</div>
                    <h3>${meta.name}</h3>
                    <p>${count} tools available</p>
                    <span class="about-category-link">Browse →</span>
                </a>
            `;
        }).join('');
    }
    // ============================================
    // INITIALIZE
    // ============================================
    
    // Wait for TOOLS to load from global script
    function init() {
        loadCategories();
    }

    // Check if TOOLS is already loaded
    if (window.TOOLS && window.TOOLS.length > 0) {
        init();
    } else {
        // Wait for TOOLS to load
        let attempts = 0;
        const maxAttempts = 50;
        const checkInterval = setInterval(function() {
            attempts++;
            if (window.TOOLS && window.TOOLS.length > 0) {
                clearInterval(checkInterval);
                init();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                // Fallback: try to load anyway
                init();
            }
        }, 100);
    }
});



















