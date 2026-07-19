/**
 * FAQ Page Functionality
 * Auto-generates categories and filters from JSON data
 * Handles search, filter pills, accordion, and auto-scroll
 */

(function() {
    'use strict';

    // ============================================
    // DOM ELEMENTS
    // ============================================

    var faqSearch = document.getElementById('faqSearch');
    var faqSearchClear = document.getElementById('faqSearchClear');
    var faqSearchResults = document.getElementById('faqSearchResults');
    var faqSearchResultsText = faqSearchResults ? faqSearchResults.querySelector('.faq-search-results-text') : null;
    var faqNoResults = document.getElementById('faqNoResults');
    var faqQuestionsGrid = document.getElementById('faqQuestionsGrid');
    var filterPillsContainer = document.getElementById('faqFilterPills');
    var faqItems = [];
    var faqCategoryGroups = [];
    var faqData = null;
    var allFaqItems = [];
    var currentFilter = 'all';
    var categoryDisplayNames = {};
    var filterPills = [];

    // ============================================
    // CATEGORY DISPLAY NAMES (Auto-generated)
    // ============================================

    var defaultCategoryNames = {
        'general': 'General',
        'privacy': 'Privacy',
        'account': 'Account',
        'technical': 'Technical',
        'tools': 'Tools'
    };

    // ============================================
    // TOOL CATEGORY NAMES
    // ============================================

    var toolCategoryNames = {
        'basic': 'Basic Calculators',
        'health': 'Health & Fitness',
        'student': 'Student Tools',
        'finance': 'Finance Tools',
        'dev': 'Developer Tools',
        'media': 'Media Tools'
    };

    function getToolCategoryName(cat) {
        return toolCategoryNames[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
    }

    // ============================================
    // LOAD FAQ DATA FROM JSON
    // ============================================

    function loadFaqData() {
        return fetch('/data/faq.json')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to load FAQ data');
                }
                return response.json();
            })
            .then(function(data) {
                faqData = data;
                return data;
            })
            .catch(function(error) {
                console.warn('⚠️ Error loading FAQ data:', error);
                if (window.FAQ_DATA) {
                    faqData = window.FAQ_DATA;
                    return faqData;
                }
                return null;
            });
    }

    // ============================================
    // DYNAMICALLY GENERATE CATEGORIES
    // ============================================

    function generateCategories(data) {
        if (!data) return [];
        
        var categories = Object.keys(data);
        if (!filterPillsContainer) {
            console.warn('⚠️ filterPillsContainer not found');
            return categories;
        }

        var filterPillsHtml = '';

        // Add "All" pill first
        filterPillsHtml += '<button class="faq-filter-pill active" data-filter="all">All</button>';

        // Generate pills for each category
        categories.forEach(function(catId) {
            var displayName = defaultCategoryNames[catId] || catId.charAt(0).toUpperCase() + catId.slice(1);
            // Store for later use
            categoryDisplayNames[catId] = displayName;
            filterPillsHtml += '<button class="faq-filter-pill" data-filter="' + catId + '">' + displayName + '</button>';
        });

        filterPillsContainer.innerHTML = filterPillsHtml;

        // Update filterPills reference
        filterPills = document.querySelectorAll('.faq-filter-pill');

        return categories;
    }

    // ============================================
    // RENDER FAQ FROM DATA
    // ============================================

    function renderFaq(data) {
        if (!data) {
            console.warn('⚠️ No FAQ data to render');
            return;
        }

        if (!faqQuestionsGrid) {
            console.warn('⚠️ faqQuestionsGrid not found');
            return;
        }

        // Clear grid
        faqQuestionsGrid.innerHTML = '';

        faqItems = [];
        faqCategoryGroups = [];
        allFaqItems = [];

        // Generate categories dynamically
        var categories = generateCategories(data);

        // Build FAQ items by category
        categories.forEach(function(catId) {
            var questions = data[catId];
            if (!questions || questions.length === 0) return;

            var group = document.createElement('div');
            group.className = 'faq-category-group';
            group.dataset.category = catId;
            faqCategoryGroups.push(group);

            var displayName = categoryDisplayNames[catId] || catId.charAt(0).toUpperCase() + catId.slice(1);
            var title = document.createElement('h2');
            title.className = 'faq-category-title';
            title.textContent = displayName;
            group.appendChild(title);

            // For tools category, group by tool
            if (catId === 'tools') {
                questions.forEach(function(tool) {
                    if (!tool || !tool.faqs) return;
                    
                    var toolHeader = document.createElement('div');
                    toolHeader.className = 'faq-tool-header';
                    toolHeader.textContent = tool.toolName || 'Tool';
                    group.appendChild(toolHeader);

                    tool.faqs.forEach(function(q) {
                        if (!q) return;
                        var item = createFaqItem(q.question || 'Question', q.answer || 'Answer', tool.toolName, tool.toolId);
                        group.appendChild(item);
                        faqItems.push(item);
                    });
                });
            } else {
                questions.forEach(function(q) {
                    if (!q) return;
                    var item = createFaqItem(q.question || 'Question', q.answer || 'Answer');
                    group.appendChild(item);
                    faqItems.push(item);
                });
            }

            faqQuestionsGrid.appendChild(group);
        });

        allFaqItems = document.querySelectorAll('.faq-item');

        initAccordion();
        initFilterPills();
        updateToolCount();

        // Open first FAQ item
        if (faqItems.length > 0) {
            faqItems[0].classList.add('active');
        }

        // Apply initial filter
        applyFilter('all');

        console.log('✅ FAQ rendered with ' + faqItems.length + ' questions in ' + categories.length + ' categories');
    }

    // ============================================
    // CREATE FAQ ITEM
    // ============================================

    function createFaqItem(question, answer, toolName, toolId) {
        var item = document.createElement('div');
        item.className = 'faq-item';
        if (toolName) {
            item.dataset.toolName = toolName;
        }
        if (toolId) {
            item.dataset.toolId = toolId;
        }

        var button = document.createElement('button');
        button.className = 'faq-question';
        var span = document.createElement('span');
        span.textContent = question;
        button.appendChild(span);

        var icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'faq-icon');
        icon.setAttribute('width', '20');
        icon.setAttribute('height', '20');
        icon.setAttribute('viewBox', '0 0 24 24');
        icon.setAttribute('fill', 'none');
        icon.setAttribute('stroke', 'currentColor');
        icon.setAttribute('stroke-width', '2');
        var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', '6 9 12 15 18 9');
        icon.appendChild(polyline);
        button.appendChild(icon);

        var answerDiv = document.createElement('div');
        answerDiv.className = 'faq-answer';
       var p = document.createElement('p');
       p.innerHTML = answer;
       answerDiv.appendChild(p);

        item.appendChild(button);
        item.appendChild(answerDiv);

        return item;
    }

    // ============================================
    // UPDATE TOOL COUNT
    // ============================================

    function updateToolCount() {
        var countEl = document.getElementById('faqToolCount');
        if (countEl && window.TOOLS) {
            countEl.textContent = window.TOOLS.length;
        }
    }

    // ============================================
    // FAQ ACCORDION
    // ============================================

    function initAccordion() {
        var allItems = document.querySelectorAll('.faq-item');
        
        allItems.forEach(function(item) {
            var question = item.querySelector('.faq-question');
            if (!question) return;

            var newQuestion = question.cloneNode(true);
            question.parentNode.replaceChild(newQuestion, question);
            
            newQuestion.addEventListener('click', function() {
                var isActive = item.classList.contains('active');
                var parentGroup = item.closest('.faq-category-group');
                if (parentGroup) {
                    var siblings = parentGroup.querySelectorAll('.faq-item');
                    siblings.forEach(function(sibling) {
                        if (sibling !== item) {
                            sibling.classList.remove('active');
                        }
                    });
                }
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        });

        faqItems = document.querySelectorAll('.faq-item');
    }

    // ============================================
    // INIT FILTER PILLS
    // ============================================

    function initFilterPills() {
        filterPills = document.querySelectorAll('.faq-filter-pill');
        
        filterPills.forEach(function(pill) {
            // Remove existing listeners by cloning
            var newPill = pill.cloneNode(true);
            pill.parentNode.replaceChild(newPill, pill);
            
            newPill.addEventListener('click', function() {
                var filter = this.dataset.filter;
                applyFilter(filter);
            });
        });

        // Update reference
        filterPills = document.querySelectorAll('.faq-filter-pill');
    }

    // ============================================
    // SMOOTH SCROLL TO SECTION
    // ============================================

    function scrollToQuestions() {
        var section = document.querySelector('.faq-questions-section');
        if (!section) return;

        var header = document.querySelector('header');
        var headerHeight = header ? header.offsetHeight : 80;
        var elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
        var offsetPosition = elementPosition - headerHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // ============================================
    // APPLY FILTER
    // ============================================

    function applyFilter(filter) {
        currentFilter = filter;

        // Update active pill
        filterPills.forEach(function(pill) {
            pill.classList.remove('active');
            if (pill.dataset.filter === filter) {
                pill.classList.add('active');
            }
        });

        // Show/hide category groups
        faqCategoryGroups.forEach(function(group) {
            var groupCategory = group.dataset.category;
            if (filter === 'all' || groupCategory === filter) {
                group.classList.remove('hidden');
            } else {
                group.classList.add('hidden');
            }
        });

        // Reset search if active
        if (faqSearch) {
            faqSearch.value = '';
            if (faqSearchClear) faqSearchClear.classList.add('hidden');
            if (faqSearchResults) faqSearchResults.classList.add('hidden');
            if (faqNoResults) faqNoResults.classList.add('hidden');
        }

        // Close all items
        allFaqItems.forEach(function(item) {
            item.classList.remove('active');
        });

        // Reset display for all items
        allFaqItems.forEach(function(item) {
            item.style.display = '';
        });

        // Re-run search to update visibility
        performSearch('');

        // Open first item if visible
        var visibleItems = document.querySelectorAll('.faq-item:not([style*="display: none"])');
        if (visibleItems.length > 0) {
            visibleItems[0].classList.add('active');
        }

        // Scroll to questions
        scrollToQuestions();
    }

    // ============================================
    // SHOW/HIDE CATEGORY TITLE
    // ============================================

    function updateCategoryVisibility() {
    faqCategoryGroups.forEach(function(group) {

        // Handle each tool header separately
        var toolHeaders = group.querySelectorAll('.faq-tool-header');

        toolHeaders.forEach(function(header) {
            var next = header.nextElementSibling;
            var hasVisibleFaq = false;

            while (next && !next.classList.contains('faq-tool-header')) {
                if (
                    next.classList.contains('faq-item') &&
                    next.style.display !== 'none'
                ) {
                    hasVisibleFaq = true;
                    break;
                }
                next = next.nextElementSibling;
            }

            header.style.display = hasVisibleFaq ? '' : 'none';
        });

        // Hide category if no FAQs are visible
        var visibleItems = group.querySelectorAll('.faq-item:not([style*="display: none"])');

        var title = group.querySelector('.faq-category-title');

        if (visibleItems.length === 0) {
            group.style.display = 'none';
        } else {
            group.style.display = '';
        }

        if (title) {
            title.style.display = visibleItems.length ? '' : 'none';
        }
    });
}
    // ============================================
    // PERFORM SEARCH
    // ============================================

    function performSearch(query) {
        var searchTerm = query.toLowerCase().trim();
        var allItems = document.querySelectorAll('.faq-item');
        var visibleCount = 0;

        // Determine which categories are visible (based on filter)
        var visibleCategories = [];
        faqCategoryGroups.forEach(function(group) {
            if (!group.classList.contains('hidden')) {
                visibleCategories.push(group.dataset.category);
            }
        });

        allItems.forEach(function(item) {
            var questionText = item.querySelector('.faq-question span');
            var answerText = item.querySelector('.faq-answer p');
            var parentGroup = item.closest('.faq-category-group');
            var groupCategory = parentGroup ? parentGroup.dataset.category : '';

            var isCategoryVisible = visibleCategories.length === 0 || visibleCategories.indexOf(groupCategory) !== -1;

            if (!isCategoryVisible) {
                item.style.display = '';
                return;
            }

            if (!searchTerm) {
                item.style.display = '';
                visibleCount++;
                return;
            }

            var questionContent = questionText ? questionText.textContent.toLowerCase() : '';
            var answerContent = answerText ? answerText.textContent.toLowerCase() : '';
            var toolName = item.dataset.toolName ? item.dataset.toolName.toLowerCase() : '';

            var matches = questionContent.indexOf(searchTerm) !== -1 || 
                          answerContent.indexOf(searchTerm) !== -1 ||
                          toolName.indexOf(searchTerm) !== -1;

            if (matches) {
                item.style.display = '';
                visibleCount++;
                item.classList.add('active');
            } else {
                item.style.display = 'none';
                item.classList.remove('active');
            }
        });

        // Update search results count
        if (faqSearchResults && faqSearchResultsText) {
            if (searchTerm && visibleCount > 0) {
                faqSearchResultsText.textContent = 'Found ' + visibleCount + ' result' + (visibleCount > 1 ? 's' : '') + ' for "' + searchTerm + '"';
                faqSearchResults.classList.remove('hidden');
            } else if (searchTerm && visibleCount === 0) {
                faqSearchResultsText.textContent = 'No results found for "' + searchTerm + '"';
                faqSearchResults.classList.remove('hidden');
            } else {
                faqSearchResults.classList.add('hidden');
            }
        }

        if (faqNoResults) {
            if (searchTerm && visibleCount === 0) {
                faqNoResults.classList.remove('hidden');
            } else {
                faqNoResults.classList.add('hidden');
            }
        }

        updateCategoryVisibility();
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================

    function initEventListeners() {
        // Search input
        if (faqSearch) {
            // Remove existing listeners by cloning
            var newSearch = faqSearch.cloneNode(true);
            faqSearch.parentNode.replaceChild(newSearch, faqSearch);
            faqSearch = newSearch;

            faqSearch.addEventListener('input', function() {
                var query = this.value;
                var searchTerm = query.trim();

                if (faqSearchClear) {
                    if (searchTerm.length > 0) {
                        faqSearchClear.classList.remove('hidden');
                    } else {
                        faqSearchClear.classList.add('hidden');
                    }
                }

                // Reset filter to "All" when searching
                if (searchTerm.length > 0 && currentFilter !== 'all') {
                    filterPills.forEach(function(pill) {
                        pill.classList.remove('active');
                        if (pill.dataset.filter === 'all') {
                            pill.classList.add('active');
                        }
                    });
                    faqCategoryGroups.forEach(function(group) {
                        group.classList.remove('hidden');
                    });
                    currentFilter = 'all';
                }

                performSearch(searchTerm);
            });

            faqSearch.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    var searchTerm = this.value.trim();
                    if (searchTerm.length > 0) {
                        scrollToQuestions();
                    }
                }
            });
        }

        // Clear button
        if (faqSearchClear) {
            var newClear = faqSearchClear.cloneNode(true);
            faqSearchClear.parentNode.replaceChild(newClear, faqSearchClear);
            faqSearchClear = newClear;

            faqSearchClear.addEventListener('click', function() {
                if (faqSearch) {
                    faqSearch.value = '';
                    this.classList.add('hidden');
                    if (faqSearchResults) faqSearchResults.classList.add('hidden');
                    if (faqNoResults) faqNoResults.classList.add('hidden');
                    
                    allFaqItems.forEach(function(item) {
                        item.style.display = '';
                    });
                    
                    // Reset filter to "All"
                    filterPills.forEach(function(pill) {
                        pill.classList.remove('active');
                        if (pill.dataset.filter === 'all') {
                            pill.classList.add('active');
                        }
                    });
                    faqCategoryGroups.forEach(function(group) {
                        group.classList.remove('hidden');
                    });
                    currentFilter = 'all';

                    updateCategoryVisibility();

                    allFaqItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    
                    var visibleItems = document.querySelectorAll('.faq-item:not([style*="display: none"])');
                    if (visibleItems.length > 0) {
                        visibleItems[0].classList.add('active');
                    }
                }
            });
        }

        // Keyboard shortcut - Ctrl + K
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (faqSearch) {
                    faqSearch.focus();
                    faqSearch.select();
                }
            }
        });
    }

    // ============================================
    // INITIALIZE
    // ============================================

    function init() {
        // Check if required elements exist
        if (!faqQuestionsGrid) {
            console.error('❌ faqQuestionsGrid element not found!');
            return;
        }

        if (!filterPillsContainer) {
            console.warn('⚠️ filterPillsContainer not found, creating one...');
            // Create container if it doesn't exist
            var container = document.createElement('div');
            container.className = 'faq-filter-pills';
            container.id = 'faqFilterPills';
            var searchSection = document.querySelector('.faq-search-section .container');
            if (searchSection) {
                searchSection.appendChild(container);
                filterPillsContainer = container;
            }
        }

        loadFaqData()
            .then(function(data) {
                if (data) {
                    renderFaq(data);
                    initEventListeners();
                    setTimeout(function() {
                        updateCategoryVisibility();
                    }, 100);
                } else {
                    if (faqQuestionsGrid) {
                        faqQuestionsGrid.innerHTML = `
                            <div class="error-message" style="text-align:center;padding:40px;">
                                <p>⚠️ Failed to load FAQ data. Please refresh the page.</p>
                            </div>
                        `;
                    }
                }
            })
            .catch(function(error) {
                console.error('❌ Error initializing FAQ:', error);
                if (faqQuestionsGrid) {
                    faqQuestionsGrid.innerHTML = `
                        <div class="error-message" style="text-align:center;padding:40px;">
                            <p>⚠️ Error loading FAQ. Please refresh the page.</p>
                        </div>
                    `;
                }
            });
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();



















