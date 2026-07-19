(function() {
        'use strict';

        console.log('🔍 Search results page loaded');

        // ============================================
        // DOM REFERENCES
        // ============================================
        const grid = document.getElementById('searchResultsGrid');
        const header = document.getElementById('searchResultsHeader');
        const termDisplay = document.getElementById('searchTermDisplay');
        const countDisplay = document.getElementById('searchResultCount');
        const timeDisplay = document.getElementById('searchTimeDisplay');
        const searchInput = document.getElementById('globalSearch');
        const categoryFilterDisplay = document.getElementById('categoryFilterDisplay');
        const categoryBadge = document.getElementById('categoryBadge');

        // ============================================
        // HELPER: GET CATEGORY NAME
        // ============================================
        function getCategoryName(catId) {
            if (window.CATEGORY_DATA && window.CATEGORY_DATA[catId]) {
                return window.CATEGORY_DATA[catId].name || catId;
            }
            return catId || 'Uncategorized';
        }

        // ============================================
        // HELPER: ESCAPE HTML
        // ============================================
        function escapeHTML(str) {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        // ============================================
        // GET URL PARAMETERS
        // ============================================
        function getQueryParam(name) {
            const url = new URL(window.location.href);
            return url.searchParams.get(name);
        }

        // ============================================
        // GET CATEGORY FROM URL - Converts "health" → "health"
        // Also handles "Health" → "health" (case insensitive)
        // ============================================
        function getCategoryFromURL() {
            const cat = getQueryParam('cat');
            if (!cat) return 'all';
            
            // Get the category ID from CATEGORY_DATA by matching name (case insensitive)
            const catLower = cat.toLowerCase();
            if (window.CATEGORY_DATA) {
                for (var key in window.CATEGORY_DATA) {
                    if (window.CATEGORY_DATA[key] && window.CATEGORY_DATA[key].name) {
                        if (window.CATEGORY_DATA[key].name.toLowerCase() === catLower) {
                            return key;
                        }
                    }
                }
            }
            return catLower;
        }

        // ============================================
        // PERFORM SEARCH - Uses window.searchTools()
        // ============================================
        function performSearch(query, category) {
            const startTime = performance.now();

            if (!query || !window.TOOLS || !Array.isArray(window.TOOLS)) {
                showError('Tools not loaded. Please refresh the page.');
                return;
            }

            const q = query.trim();
            const cat = category || 'all';

            let results = [];

            // ============================================
            // USE INTELLIGENT SEARCH FROM SCRIPT.JS
            // ============================================
            if (typeof window.searchTools === 'function') {
                results = window.searchTools(cat, q);
            } else {
                console.warn('⚠️ searchTools not found, using fallback');
                let filtered = window.TOOLS;
                if (cat !== 'all') {
                    filtered = window.TOOLS.filter(function(tool) {
                        return tool && tool.cat === cat;
                    });
                }
                const lower = q.toLowerCase();
                results = filtered.filter(function(tool) {
                    if (!tool) return false;
                    const name = (tool.name || '').toLowerCase();
                    const desc = (tool.desc || '').toLowerCase();
                    return name.includes(lower) || desc.includes(lower);
                });
            }

            const endTime = performance.now();
            const total = results.length;
            const time = Math.round(endTime - startTime);

            // ============================================
            // UPDATE HEADER
            // ============================================
            if (header) header.style.display = 'block';
            if (termDisplay) termDisplay.textContent = q;

            const categoryName = getCategoryName(cat);
            if (cat !== 'all') {
                categoryFilterDisplay.style.display = 'inline';
                categoryBadge.textContent = categoryName;
            } else {
                categoryFilterDisplay.style.display = 'none';
            }

            if (countDisplay) {
                let countText = total + ' ' + (total === 1 ? 'tool' : 'tools') + ' found';
                if (cat !== 'all') {
                    countText += ' in ' + categoryName;
                }
                countDisplay.textContent = countText;
            }
            if (timeDisplay) timeDisplay.textContent = time + 'ms';
            if (searchInput) searchInput.value = q;

            let titleText = 'Search results for "' + q + '"';
            if (cat !== 'all') {
                titleText += ' in ' + categoryName;
            }
            document.title = titleText + ' - Toolzary';

            // ============================================
            // NO RESULTS
            // ============================================
            if (total === 0) {
                const currentCat = cat || 'all';
                const catParam = currentCat !== 'all' ? '&cat=' + encodeURIComponent(currentCat) : '';

                grid.innerHTML = `
                    <div class="search-no-results">
                        <div class="no-results-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m21 21-4.34-4.34"/>
                                <circle cx="11" cy="11" r="8"/>
                            </svg>
                        </div>
                        <h3>No tools found for "${escapeHTML(q)}"</h3>
                        <p>Try different keywords or browse categories:</p>
                       <div class="suggestions">
                            <a href="/search/?q=Calculator&cat=basic${catParam}" class="secondary-btn">Basic Calculators</a>
                            <a href="/search/?q=Converter&cat=basic${catParam}" class="secondary-btn">Basic Converters</a>
                            <a href="/search/?q=Generator&cat=basic${catParam}" class="secondary-btn">Basic Generators</a>
                            <a href="/search/?q=Health&cat=health${catParam}" class="secondary-btn">Health Tools</a>
                            <a href="/search/?q=Finance&cat=finance${catParam}" class="secondary-btn">Finance Tools</a>
                            <a href="/search/?q=Developer&cat=dev${catParam}" class="secondary-btn">Developer Tools</a>
                            <a href="/search/?q=Student&cat=student${catParam}" class="secondary-btn">Student Tools</a>
                            <a href="/search/?q=Media&cat=media${catParam}" class="secondary-btn">Media Tools</a>
                        </div>
                    </div>
                `;
                return;
            }

            // ============================================
            // RENDER RESULTS
            // ============================================
            grid.innerHTML = results.map(function(tool) {
                if (!tool) return '';

                const iconPath = tool.icon ? (tool.icon.startsWith('/') ? tool.icon : '/' + tool.icon) : '';
                const linkPath = tool.link ? (tool.link.startsWith('/') ? tool.link : '/' + tool.link) : '#';
                const categoryName = getCategoryName(tool.cat);

                return `
                    <a href="${linkPath}" class="tool-card" data-id="${tool.id || ''}">
                        <span class="tool-icon">
                            ${iconPath ? `<img src="${iconPath}" alt="${escapeHTML(tool.name)}" loading="lazy">` : ''}
                        </span>
                        <div class="tool-name">${escapeHTML(tool.name) || 'Unnamed Tool'}</div>
                        <div class="tool-desc">${escapeHTML(tool.desc) || ''}</div>
                        <span class="tool-badge">${escapeHTML(categoryName)}</span>
                    </a>
                `;
            }).filter(function(html) { return html && html !== ''; }).join('');
        }

        // ============================================
        // SHOW ERROR
        // ============================================
        function showError(message) {
            if (grid) {
                grid.innerHTML = `
                    <div class="search-no-results">
                        <div class="no-results-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="12" y1="8" x2="12" y2="12"/>
                                <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                        </div>
                        <h3>⚠️ Error</h3>
                        <p>${escapeHTML(message)}</p>
                        <a href="/" class="secondary-btn">Return to Home</a>
                    </div>
                `;
            }
        }

        // ============================================
        // GET SEARCH AND CATEGORY FROM URL
        // ============================================
        const query = getQueryParam('q');
        let category = getCategoryFromURL(); // Handles "Health" → "health"

        // If category is a name like "Health", convert it to ID
        // This is already handled by getCategoryFromURL()

        // ============================================
        // UPDATE SEARCH INPUT WITH CATEGORY CONTEXT
        // ============================================
        if (searchInput) {
            const categoryName = getCategoryName(category);
            if (category !== 'all') {
                searchInput.placeholder = 'Search in ' + categoryName + '...';
            } else {
                searchInput.placeholder = 'Search tools...';
            }
        }

        // ============================================
        // WAIT FOR TOOLS TO LOAD
        // ============================================
        if (!query || query.trim() === '') {
            // No search term - show popular categories
            if (header) header.style.display = 'none';
            if (grid) {
                const categoryName = getCategoryName(category);
                const catParam = category !== 'all' ? '&cat=' + encodeURIComponent(category) : '';
                
                let title = 'Search for Tools';
                let subtitle = 'Enter a search term or browse popular categories:';
                
                if (category !== 'all') {
                    title = 'Search in ' + categoryName;
                    subtitle = 'Enter a search term to find tools in ' + categoryName + ':';
                }

                grid.innerHTML = `
                    <div class="search-no-results">
                        <div class="no-results-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m21 21-4.34-4.34"/>
                                <circle cx="11" cy="11" r="8"/>
                            </svg>
                        </div>
                        <h3>${title}</h3>
                        <p>${subtitle}</p>
                        <div class="suggestions">
                            <a href="/search/?q=Calculator&cat=basic${catParam}" class="secondary-btn">Basic Calculators</a>
                            <a href="/search/?q=Converter&cat=basic${catParam}" class="secondary-btn">Basic Converters</a>
                            <a href="/search/?q=Generator&cat=basic${catParam}" class="secondary-btn">Basic Generators</a>
                            <a href="/search/?q=Health&cat=health${catParam}" class="secondary-btn">Health Tools</a>
                            <a href="/search/?q=Finance&cat=finance${catParam}" class="secondary-btn">Finance Tools</a>
                            <a href="/search/?q=Developer&cat=dev${catParam}" class="secondary-btn">Developer Tools</a>
                            <a href="/search/?q=Student&cat=student${catParam}" class="secondary-btn">Student Tools</a>
                            <a href="/search/?q=Media&cat=media${catParam}" class="secondary-btn">Media Tools</a>
                        </div>
                    </div>
                `;
            }
        } else {
            // Wait for tools to load
            let attempts = 0;
            const maxAttempts = 50;

            const checkInterval = setInterval(function() {
                attempts++;

                if (window.TOOLS && window.TOOLS.length > 0) {
                    clearInterval(checkInterval);
                    console.log('✅ Tools loaded, performing search for: ' + query + ' in category: ' + category);
                    performSearch(query, category);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.error('❌ Failed to load tools after 5 seconds');
                    showError('Failed to load tools. Please refresh the page.');
                }
            }, 100);
        }

        // ============================================
        // ENTER KEY HANDLER WITH DEBOUNCE
        // ============================================
        if (searchInput) {
            let debounceTimer;

            searchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const q = this.value.trim();
                    if (q) {
                        const catParam = category !== 'all' ? '&cat=' + encodeURIComponent(category) : '';
                        window.location.href = '/search/?q=' + encodeURIComponent(q) + catParam;
                    }
                }
            });

            // ============================================
            // LIVE SEARCH WITH DEBOUNCE (300ms)
            // ============================================
            searchInput.addEventListener('input', function() {
                clearTimeout(debounceTimer);
                const q = this.value.trim();

                debounceTimer = setTimeout(function() {
                    if (q && q.length >= 2) {
                        // Update URL without reload
                        const url = new URL(window.location);
                        url.searchParams.set('q', q);
                        if (category !== 'all') {
                            url.searchParams.set('cat', category);
                        }
                        window.history.pushState({}, '', url);

                        // Perform search instantly if tools are loaded
                        if (window.TOOLS && window.TOOLS.length > 0) {
                            performSearch(q, category);
                        }
                    } else if (q === '') {
                        // Clear search but keep category
                        const url = new URL(window.location);
                        url.searchParams.delete('q');
                        if (category !== 'all') {
                            url.searchParams.set('cat', category);
                        }
                        window.history.pushState({}, '', url);
                        // Show default view
                        window.location.reload();
                    }
                }, 300);
            });
        }

        // ============================================
        // HANDLE BACK/FORWARD BUTTONS
        // ============================================
        window.addEventListener('popstate', function() {
            const q = getQueryParam('q');
            const cat = getCategoryFromURL();
            if (q && window.TOOLS && window.TOOLS.length > 0) {
                performSearch(q, cat);
                if (searchInput) searchInput.value = q;
            } else if (!q) {
                window.location.reload();
            }
        });

    })();



















