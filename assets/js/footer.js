/**
 * Dynamic Footer Loader with JSON Data
 * Injects footer from JSON data into any page
 */

(function() {
    // ============================================
    // LOAD FOOTER DATA FROM JSON
    // ============================================

    function loadFooter() {
        // Check if footer already exists
        if (document.querySelector('footer')) {
            return;
        }

        // Fetch footer data from JSON
        fetch('/data/footer.json')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to load footer data');
                }
                return response.json();
            })
            .then(function(data) {
                renderFooter(data);
            })
            .catch(function(error) {
                console.warn('⚠️ Error loading footer data:', error);
                // Fallback: try loading from window if available
                if (window.FOOTER_DATA) {
                    renderFooter(window.FOOTER_DATA);
                } else {
                    // Fallback: try loading from local storage
                    try {
                        var cached = localStorage.getItem('footerData');
                        if (cached) {
                            renderFooter(JSON.parse(cached));
                        }
                    } catch (e) {
                        // Silently fail
                    }
                }
            });
    }

    // ============================================
    // RENDER FOOTER FROM DATA
    // ============================================

    function renderFooter(data) {
        if (!data) return;

        var currentYear = new Date().getFullYear();

        var footerHTML = `
            <footer>
                <div class="footer-grid">
                    <!-- Brand Section -->
                    <div class="footer-section">
                        <h3>${data.brand.name}</h3>
                        <p>${data.brand.tagline}</p>
                        <div class="footer-social">
                            ${data.social.github ? `<a href="${data.social.github}" aria-label="GitHub" target="_blank" rel="noopener">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                            </a>` : ''}
                            ${data.social.twitter ? `<a href="${data.social.twitter}" aria-label="Twitter" target="_blank" rel="noopener">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            </a>` : ''}
                            ${data.social.youtube ? `<a href="${data.social.youtube}" aria-label="YouTube" target="_blank" rel="noopener">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                            </a>` : ''}
                        </div>
                    </div>

                    <!-- Quick Links -->
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        ${data.quickLinks.map(function(link) {
                            return `<a href="${link.url}">${link.name}</a>`;
                        }).join('')}
                    </div>

                    <!-- Categories -->
                    <div class="footer-section">
                        <h4>Categories</h4>
                        ${data.categories.map(function(cat) {
                            return `<a href="${cat.url}">${cat.name}</a>`;
                        }).join('')}
                    </div>

                    <!-- Popular Tools -->
                    <div class="footer-section">
                        <h4>Popular Tools</h4>
                        ${data.popularTools.map(function(tool) {
                            return `<a href="${tool.url}">${tool.name}</a>`;
                        }).join('')}
                    </div>
                </div>

                <!-- Footer Bottom -->
                <div class="footer-bottom">
                    <p>© <span id="currentYear">${currentYear}</span> ${data.brand.name} — ${data.footerBottom} </p>
                </div>
            </footer>
        `;

        // Insert footer
        var body = document.body;
        if (body) {
            var existingFooter = body.querySelector('footer');
            if (!existingFooter) {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = footerHTML;
                while (tempDiv.firstChild) {
                    body.appendChild(tempDiv.firstChild);
                }
            }
        }
    }

    // ============================================
    // CACHE FOOTER DATA FOR FALLBACK
    // ============================================

    function cacheFooterData() {
        fetch('/data/footer.json')
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to fetch');
            })
            .then(function(data) {
                try {
                    localStorage.setItem('footerData', JSON.stringify(data));
                } catch (e) {
                    // Silently fail
                }
            })
            .catch(function() {
                // Silently fail
            });
    }

    // ============================================
    // INITIALIZE
    // ============================================

    function init() {
        // Check if footer already exists
        if (document.querySelector('footer')) {
            return;
        }

        // Load footer
        loadFooter();

        // Cache data for fallback (async)
        if (document.readyState === 'complete') {
            cacheFooterData();
        } else {
            window.addEventListener('load', cacheFooterData);
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();



















