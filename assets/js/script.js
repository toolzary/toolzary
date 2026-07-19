(function() {
    // ============================================
    // SECTION 1: CONFIGURATION & CONSTANTS
    // ============================================

    const SYNONYM_MAP = {
        'calculate': ['compute', 'figure', 'determine', 'find'],
        'convert': ['change', 'transform', 'translate'],
        'generate': ['create', 'make', 'produce'],
        'calculator': ['calc', 'counter', 'computer'],
        'converter': ['convertor', 'translator'],
        'creator': ['maker', 'generator', 'builder'],
        'checker': ['validator', 'verifier', 'tester'],
        'formatter': ['styler', 'arranger', 'organizer']
    };

    // Keyboard layout for typo detection
    const KEYBOARD_LAYOUT = {
        'q': ['w', 'a', 's'],
        'w': ['q', 'e', 'a', 's', 'd'],
        'e': ['w', 'r', 's', 'd', 'f'],
        'r': ['e', 't', 'd', 'f', 'g'],
        't': ['r', 'y', 'f', 'g', 'h'],
        'y': ['t', 'u', 'g', 'h', 'j'],
        'u': ['y', 'i', 'h', 'j', 'k'],
        'i': ['u', 'o', 'j', 'k', 'l'],
        'o': ['i', 'p', 'k', 'l'],
        'p': ['o', 'l'],
        'a': ['q', 'w', 's', 'z', 'x'],
        's': ['a', 'd', 'w', 'e', 'x', 'z'],
        'd': ['s', 'f', 'e', 'r', 'c', 'x'],
        'f': ['d', 'g', 'r', 't', 'v', 'c'],
        'g': ['f', 'h', 't', 'y', 'b', 'v'],
        'h': ['g', 'j', 'y', 'u', 'n', 'b'],
        'j': ['h', 'k', 'u', 'i', 'm', 'n'],
        'k': ['j', 'l', 'i', 'o', 'm'],
        'l': ['k', 'o', 'p'],
        'z': ['a', 's', 'x'],
        'x': ['z', 's', 'd', 'c'],
        'c': ['x', 'd', 'f', 'v'],
        'v': ['c', 'f', 'g', 'b'],
        'b': ['v', 'g', 'h', 'n'],
        'n': ['b', 'h', 'j', 'm'],
        'm': ['n', 'j', 'k']
    };

    // ============================================
    // SECTION 2: STATE VARIABLES
    // ============================================

    let TOOLS = [];
    let CATEGORY_DATA = {};
    let categories = ['all'];
    let darkMode = false;
    let isInitialLoad = true;
    let toolsLoaded = false;

    // DOM elements with null checks
    const toolsGrid = document.getElementById('toolsGrid');
    const categoryFilters = document.getElementById('categoryFilters');
    const globalSearch = document.getElementById('globalSearch');
    const darkToggle = document.getElementById('darkToggle');
    const noResults = document.getElementById('noResults');

    // ============================================
    // SECTION 3: SEARCH LOGIC FUNCTIONS
    // ============================================

    // 3.1: Get singular/plural variations
    function getWordVariations(word) {
        if (!word) return [];
        
        const variations = [];
        const lower = word.toLowerCase();
        
        if (lower.length < 3) return [word];
        
        try {
            if (lower.endsWith('s') && !lower.endsWith('ss') && !lower.endsWith('us') && lower.length > 3) {
                const v = lower.slice(0, -1);
                if (v.length >= 3) variations.push(v);
            }
            
            if (!lower.endsWith('s') && lower.length > 2) {
                const v = lower + 's';
                if (v.length >= 3) variations.push(v);
            }
            
            if (lower.endsWith('ies') && lower.length > 3) {
                const v = lower.slice(0, -3) + 'y';
                if (v.length >= 3) variations.push(v);
            }
            
            if (lower.endsWith('es') && lower.length > 3) {
                const v = lower.slice(0, -2);
                if (v.length >= 3) variations.push(v);
            }
            
            if (lower.endsWith('ing') && lower.length > 4) {
                const v = lower.slice(0, -3);
                if (v.length >= 3) variations.push(v);
            }
            
            if (lower.endsWith('ed') && lower.length > 4) {
                const v = lower.slice(0, -2);
                if (v.length >= 3) variations.push(v);
            }
        } catch (error) {
            // Silently fail
        }
        
        if (word.length >= 3 && !variations.includes(word)) {
            variations.unshift(word);
        }
        
        return [...new Set(variations)];
    }

    // 3.2: Levenshtein distance helper
    function levenshteinDistance(a, b) {
        if (!a || !b) return Math.max((a || '').length, (b || '').length);
        
        try {
            const matrix = [];
            for (let i = 0; i <= b.length; i++) {
                matrix[i] = [i];
            }
            for (let j = 0; j <= a.length; j++) {
                matrix[0][j] = j;
            }
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b[i-1] === a[j-1]) {
                        matrix[i][j] = matrix[i-1][j-1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i-1][j-1] + 1,
                            matrix[i][j-1] + 1,
                            matrix[i-1][j] + 1
                        );
                    }
                }
            }
            return matrix[b.length][a.length];
        } catch (error) {
            return Math.max(a.length, b.length);
        }
    }

    // 3.3: Dynamic typo correction
    function getTypoVariations(word) {
        if (!word || !window.TOOLS || !Array.isArray(window.TOOLS)) {
            return [];
        }

        const lower = word.toLowerCase().trim();
        if (lower.length < 4) {
            return [];
        }

        const dictionary = new Set();
        const variations = [];

        try {
            window.TOOLS.forEach(function(tool) {
                if (!tool) return;

                const fields = [
                    tool.name,
                    tool.desc,
                    tool.cat,
                    ...(tool.keywords || [])
                ];

                fields.forEach(function(field) {
                    if (!field) return;
                    field
                        .toLowerCase()
                        .split(/[\s\-_,]+/)
                        .forEach(function(w) {
                            if (w && w.length >= 4) {
                                dictionary.add(w);
                                if (w.length > 5) {
                                    if (w.endsWith('er')) dictionary.add(w.slice(0, -2));
                                    if (w.endsWith('or')) dictionary.add(w.slice(0, -2));
                                    if (w.endsWith('ing')) dictionary.add(w.slice(0, -3));
                                    if (w.endsWith('ed')) dictionary.add(w.slice(0, -2));
                                    if (w.endsWith('tion')) dictionary.add(w.slice(0, -4));
                                    if (w.endsWith('s')) dictionary.add(w.slice(0, -1));
                                    if (w.endsWith('es')) dictionary.add(w.slice(0, -2));
                                }
                            }
                        });
                });
            });

            dictionary.forEach(function(correctWord) {
                if (!correctWord || correctWord.length < 4) return;
                
                const diff = levenshteinDistance(lower, correctWord);
                const lenDiff = Math.abs(lower.length - correctWord.length);
                
                let allowed = 1;
                if (lower.length >= 6) allowed = 2;
                if (lower.length >= 9) allowed = 3;
                
                if (diff <= allowed && correctWord !== lower) {
                    if (correctWord.length >= 4) {
                        variations.push(correctWord);
                    }
                } else if (lenDiff <= 2 && diff <= 4) {
                    if (correctWord.length >= 4) {
                        variations.push(correctWord);
                    }
                }
            });

            if (variations.length === 0) {
                const compressed = lower.replace(/(.)\1+/g, '$1');
                if (compressed && compressed !== lower && compressed.length >= 4) {
                    dictionary.forEach(function(correctWord) {
                        if (!correctWord || correctWord.length < 4) return;
                        if (correctWord === compressed || levenshteinDistance(compressed, correctWord) <= 2) {
                            variations.push(correctWord);
                        }
                    });
                }
            }
        } catch (error) {
            // Silently fail
        }

        return [...new Set(variations)];
    }

    // 3.4: Keyboard adjacency typo correction
    function getKeyboardTypoVariations(word) {
        if (!word || !window.TOOLS || !Array.isArray(window.TOOLS)) {
            return [];
        }
        
        const lower = word.toLowerCase().trim();
        if (lower.length < 4) return [];
        
        const variations = [];
        const dictionary = new Set();
        
        try {
            window.TOOLS.forEach(function(tool) {
                if (!tool) return;
                
                const fields = [
                    tool.name,
                    tool.desc,
                    tool.cat,
                    ...(tool.keywords || [])
                ];
                
                fields.forEach(function(field) {
                    if (!field) return;
                    field
                        .toLowerCase()
                        .split(/[\s\-_,]+/)
                        .forEach(function(w) {
                            if (w && w.length >= 4) {
                                dictionary.add(w);
                            }
                        });
                });
            });
            
            const chars = lower.split('');
            const possibleWords = [];
            
            chars.forEach(function(ch, index) {
                const adjacent = KEYBOARD_LAYOUT[ch] || [];
                
                adjacent.forEach(function(adj) {
                    const newWord = chars.map(function(c, i) {
                        return i === index ? adj : c;
                    }).join('');
                    
                    if (newWord && newWord !== lower && newWord.length >= 4) {
                        possibleWords.push(newWord);
                    }
                });
            });
            
            for (let i = 0; i < chars.length - 1; i++) {
                const swapped = [...chars];
                [swapped[i], swapped[i + 1]] = [swapped[i + 1], swapped[i]];
                const newWord = swapped.join('');
                if (newWord && newWord !== lower && newWord.length >= 4) {
                    possibleWords.push(newWord);
                }
            }
            
            possibleWords.forEach(function(pw) {
                dictionary.forEach(function(dictWord) {
                    if (!dictWord || dictWord.length < 4) return;
                    
                    if (dictWord === pw || dictWord.includes(pw) || pw.includes(dictWord)) {
                        if (dictWord.length >= 4) {
                            variations.push(dictWord);
                        }
                    } else if (Math.abs(pw.length - dictWord.length) <= 1) {
                        const diff = levenshteinDistance(pw, dictWord);
                        if (diff <= 2 && dictWord.length >= 4) {
                            variations.push(dictWord);
                        }
                    }
                });
            });
            
        } catch (error) {
            // Silently fail
        }
        
        return [...new Set(variations)];
    }

    // 3.5: Get popular tools
    function getPopularTools(tools, count) {
        count = count || 5;
        
        if (!tools || !Array.isArray(tools) || tools.length === 0) {
            return [];
        }
        
        try {
            const sorted = [...tools].sort(function(a, b) {
                const aPop = (a && (a.popularity || a.views || a.usage)) || 0;
                const bPop = (b && (b.popularity || b.views || b.usage)) || 0;
                return bPop - aPop;
            });
            
            if (sorted.every(function(t) { 
                return !t || (!t.popularity && !t.views && !t.usage); 
            })) {
                const shuffled = [...tools].sort(function() { return Math.random() - 0.5; });
                return shuffled.slice(0, count);
            }
            
            return sorted.slice(0, count);
        } catch (error) {
            return tools.slice(0, count);
        }
    }

    // ============================================
    // 3.6: SEARCH TOOLS
    // ============================================

    function searchTools(cat, search) {
        cat = cat || 'all';
        search = search || '';

        if (!TOOLS || !Array.isArray(TOOLS)) {
            return [];
        }

        let filtered = (cat === 'all')
            ? [...TOOLS]
            : TOOLS.filter(function(t) {
                return t && t.cat === cat;
            });

        if (!search || !search.trim()) {
            return filtered;
        }

        const query = search.toLowerCase().trim();
        const searchWords = query.split(/\s+/);

        const allSearchTerms = [];

        searchWords.forEach(function(word) {
            if (!word) return;

            if (word.length >= 2) {
                allSearchTerms.push(word);
            }

            if (word.length >= 3) {
                const variations = getWordVariations(word);
                if (variations && variations.length > 0) {
                    variations.forEach(function(v) { 
                        if (v && v.length >= 3 && !allSearchTerms.includes(v)) {
                            allSearchTerms.push(v); 
                        }
                    });
                }
            }

            if (word.length >= 4) {
                const typos = getTypoVariations(word);
                if (typos && typos.length > 0) {
                    typos.forEach(function(v) { 
                        if (v && v.length >= 3 && !allSearchTerms.includes(v)) {
                            allSearchTerms.push(v); 
                        }
                    });
                }

                const keyboardTypos = getKeyboardTypoVariations(word);
                if (keyboardTypos && keyboardTypos.length > 0) {
                    keyboardTypos.forEach(function(v) { 
                        if (v && v.length >= 3 && !allSearchTerms.includes(v)) {
                            allSearchTerms.push(v); 
                        }
                    });
                }
            }
        });

        const uniqueSearchTerms = [...new Set(allSearchTerms)].filter(function(term) {
            return term && term.length >= 2;
        });

        filtered = filtered.filter(function(tool) {
            if (!tool) return false;

            const name = (tool.name || '').toLowerCase();
            const catName = (tool.cat || '').toLowerCase();
            const desc = (tool.desc || '').toLowerCase();
            const keywords = (tool.keywords || []).map(function(k) {
                return (k || '').toLowerCase();
            });

            return uniqueSearchTerms.some(function(term) {
                if (!term) return false;

                if (name.includes(term)) return true;
                if (catName.includes(term)) return true;
                if (keywords.some(function(k) { return k && k.includes(term); })) return true;
                
                if (term.length >= 3 && desc.includes(term)) {
                    return true;
                }

                return false;
            });
        });

        filtered.sort(function(a, b) {
            if (!a || !b) return 0;

            function getScore(tool) {
                if (!tool) return 0;

                const name = (tool.name || '').toLowerCase();
                const desc = (tool.desc || '').toLowerCase();
                const catName = (tool.cat || '').toLowerCase();
                const keywords = (tool.keywords || []).map(function(k) {
                    return (k || '').toLowerCase();
                });

                let score = 0;

                searchWords.forEach(function(word) {
                    if (!word || word.length < 2) return;

                    if (name === word) score += 10000;
                    else if (name.startsWith(word)) score += 5000;
                    else if (name.split(' ').includes(word)) score += 3000;
                    else if (name.includes(word)) score += 1000;
                });

                uniqueSearchTerms.forEach(function(term) {
                    if (!term || term.length < 2) return;
                    if (name === term) score += 8000;
                    else if (name.includes(term) && term.length > 2) {
                        if (!searchWords.includes(term)) {
                            score += 500;
                        }
                    }
                });

                if (name.includes(query)) score += 2000;

                searchWords.forEach(function(word) {
                    if (!word || word.length < 2) return;
                    if (catName === word) score += 2000;
                    else if (catName.includes(word)) score += 1000;
                });

                searchWords.forEach(function(word) {
                    if (!word || word.length < 3) return;
                    if (desc.includes(word)) {
                        if (desc.split(' ').includes(word)) {
                            score += 500;
                        } else {
                            score += 200;
                        }
                    }
                });

                if (query.length >= 3 && desc.includes(query)) {
                    score += 300;
                }

                searchWords.forEach(function(word) {
                    if (!word || word.length < 2) return;
                    keywords.forEach(function(k) {
                        if (!k) return;
                        if (k === word) score += 300;
                        else if (k.includes(word)) score += 100;
                    });
                });

                return score;
            }

            const scoreA = getScore(a);
            const scoreB = getScore(b);

            if (scoreA !== scoreB) return scoreB - scoreA;

            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        return filtered;
    }

    // 3.7: Get search results count
    function getSearchResultsCount(query) {
        if (!TOOLS || !query) return 0;

        const q = query.toLowerCase().trim();
        if (!q) return 0;
        
        const searchWords = q.split(/\s+/);
        const allSearchTerms = [];

        try {
            searchWords.forEach(function(word) {
                if (!word) return;

                if (word.length >= 2) {
                    allSearchTerms.push(word);
                }

                if (word.length >= 3) {
                    const variations = getWordVariations(word);
                    if (variations && variations.length > 0) {
                        variations.forEach(function(v) { 
                            if (v && v.length >= 3) allSearchTerms.push(v); 
                        });
                    }
                }

                if (word.length >= 4) {
                    const typos = getTypoVariations(word);
                    if (typos && typos.length > 0) {
                        typos.forEach(function(v) { 
                            if (v && v.length >= 3) allSearchTerms.push(v); 
                        });
                    }

                    const keyboardTypos = getKeyboardTypoVariations(word);
                    if (keyboardTypos && keyboardTypos.length > 0) {
                        keyboardTypos.forEach(function(v) { 
                            if (v && v.length >= 3) allSearchTerms.push(v); 
                        });
                    }
                }
            });

            const uniqueTerms = [...new Set(allSearchTerms)].filter(function(term) {
                return term && term.length >= 2;
            });

            return TOOLS.filter(function(t) {
                if (!t) return false;

                const name = (t.name || '').toLowerCase();
                const desc = (t.desc || '').toLowerCase();
                const cat = (t.cat || '').toLowerCase();
                const keywords = (t.keywords || []).map(function(k) { 
                    return (k || '').toLowerCase(); 
                });

                return uniqueTerms.some(function(term) {
                    if (!term) return false;
                    if (name.includes(term)) return true;
                    if (desc.includes(term) && term.length >= 3) return true;
                    if (cat.includes(term)) return true;
                    if (keywords.some(function(k) { 
                        return k && (k.includes(term) || term.includes(k)); 
                    })) return true;
                    return false;
                });
            }).length;
        } catch (error) {
            return 0;
        }
    }

    // ============================================
    // SECTION 4: HELPER FUNCTIONS
    // ============================================

    function escapeHTML(str) {
        if (!str) return '';
        
        try {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        } catch (error) {
            return str;
        }
    }

    function smoothScrollToElement(element, offset) {
        offset = offset || 20;
        
        if (!element) {
            if (console && console.warn) console.warn('⚠️ Element not found for scrolling');
            return;
        }
        
        if (typeof window === 'undefined' || !window.scrollTo) {
            if (console && console.warn) console.warn('⚠️ window.scrollTo not available');
            return;
        }
        
        try {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 80;
            
            const rect = element.getBoundingClientRect();
            if (!rect) {
                if (console && console.warn) console.warn('⚠️ Could not get element position');
                return;
            }
            
            const elementPosition = rect.top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - offset;
            
            if (isNaN(offsetPosition) || offsetPosition < 0) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
        } catch (error) {
            if (console && console.warn) console.warn('⚠️ Error scrolling to element:', error);
        }
    }

    // ============================================
    // SECTION 5: UI RENDER FUNCTIONS
    // ============================================

    function updateSearchHeading(query) {
        if (!query) return;
        
        let heading = document.querySelector('.search-results-heading');
        
        if (!heading) {
            const grid = document.getElementById('toolsGrid');
            if (!grid) return;
            
            const container = grid.parentNode;
            if (!container) return;
            
            heading = document.createElement('div');
            heading.className = 'search-results-heading';
            heading.style.cssText = `
                margin-bottom: 24px;
                padding: 16px 20px;
                background: var(--bg-secondary, #f8f9fa);
                border-radius: 12px;
                border-left: 4px solid #4f46e5;
            `;
            container.insertBefore(heading, grid);
        }
        
        const count = getSearchResultsCount(query);
        const safeQuery = escapeHTML(query);
        
        if (heading) {
            heading.innerHTML = `
                <h2 style="margin: 0; font-size: 1.5rem; color: var(--text-primary, #1a1a2e); display: flex; align-items: center; gap: 12px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                        <path d="m21 21-4.34-4.34"/>
                        <circle cx="11" cy="11" r="8"/>
                    </svg>
                    Results for "<span style="color: #4f46e5;">${safeQuery}</span>"
                </h2>
                <p style="margin: 4px 0 0; color: var(--text-secondary, #64748b); font-size: 0.95rem;">
                    ${count} ${count === 1 ? 'tool' : 'tools'} found matching your search
                </p>
            `;
        }
    }

    function updateSearchHeadingWithCategory(query, category) {
        if (!query) return;
        
        let heading = document.querySelector('.search-results-heading');
        
        if (!heading) {
            const grid = document.getElementById('toolsGrid');
            if (!grid) return;
            
            const container = grid.parentNode;
            if (!container) return;
            
            heading = document.createElement('div');
            heading.className = 'search-results-heading';
            heading.style.cssText = `
                margin-bottom: 24px;
                padding: 16px 20px;
                background: var(--bg-secondary, #f8f9fa);
                border-radius: 12px;
                border-left: 4px solid #4f46e5;
            `;
            container.insertBefore(heading, grid);
        }
        
        let count = 0;
        
        if (category && category !== 'all') {
            const categoryTools = TOOLS.filter(function(t) {
                return t && t.cat === category;
            });
            
            const q = query.toLowerCase().trim();
            const searchWords = q.split(/\s+/);
            const allSearchTerms = [];
            
            searchWords.forEach(function(word) {
                if (!word) return;
                if (word.length >= 2) allSearchTerms.push(word);
                if (word.length >= 3) {
                    const variations = getWordVariations(word);
                    if (variations && variations.length > 0) {
                        variations.forEach(function(v) { 
                            if (v && v.length >= 3 && !allSearchTerms.includes(v)) {
                                allSearchTerms.push(v); 
                            }
                        });
                    }
                }
                if (word.length >= 4) {
                    const typos = getTypoVariations(word);
                    if (typos && typos.length > 0) {
                        typos.forEach(function(v) { 
                            if (v && v.length >= 3 && !allSearchTerms.includes(v)) {
                                allSearchTerms.push(v); 
                            }
                        });
                    }
                    const keyboardTypos = getKeyboardTypoVariations(word);
                    if (keyboardTypos && keyboardTypos.length > 0) {
                        keyboardTypos.forEach(function(v) { 
                            if (v && v.length >= 3 && !allSearchTerms.includes(v)) {
                                allSearchTerms.push(v); 
                            }
                        });
                    }
                }
            });
            
            const uniqueTerms = [...new Set(allSearchTerms)].filter(function(term) {
                return term && term.length >= 2;
            });
            
            count = categoryTools.filter(function(t) {
                if (!t) return false;
                const name = (t.name || '').toLowerCase();
                const desc = (t.desc || '').toLowerCase();
                const catName = (t.cat || '').toLowerCase();
                const keywords = (t.keywords || []).map(function(k) { 
                    return (k || '').toLowerCase(); 
                });
                
                return uniqueTerms.some(function(term) {
                    if (!term) return false;
                    if (name.includes(term)) return true;
                    if (desc.includes(term) && term.length >= 3) return true;
                    if (catName.includes(term)) return true;
                    if (keywords.some(function(k) { 
                        return k && (k.includes(term) || term.includes(k)); 
                    })) return true;
                    return false;
                });
            }).length;
        } else {
            count = getSearchResultsCount(query);
        }
        
        const safeQuery = escapeHTML(query);
        const categoryName = (CATEGORY_DATA && CATEGORY_DATA[category]) ? CATEGORY_DATA[category].name : '';
        
        if (heading) {
            if (category && category !== 'all') {
                heading.innerHTML = `
                    <h2 style="margin: 0; font-size: 1.5rem; color: var(--text-primary, #1a1a2e); display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                            <path d="m21 21-4.34-4.34"/>
                            <circle cx="11" cy="11" r="8"/>
                        </svg>
                        Results for "<span style="color: #4f46e5;">${safeQuery}</span>"
                    </h2>
                    <p style="margin: 4px 0 0; color: var(--text-secondary, #64748b); font-size: 0.95rem; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                        <span>${count} ${count === 1 ? 'tool' : 'tools'} found in</span>
                        <span style="display: inline-block; padding: 2px 12px; background: #4f46e5; color: white; border-radius: 20px; font-size: 0.8rem; font-weight: 500;">${categoryName}</span>
                    </p>
                `;
            } else {
                heading.innerHTML = `
                    <h2 style="margin: 0; font-size: 1.5rem; color: var(--text-primary, #1a1a2e); display: flex; align-items: center; gap: 12px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
                            <path d="m21 21-4.34-4.34"/>
                            <circle cx="11" cy"11" r="8"/>
                        </svg>
                        Results for "<span style="color: #4f46e5;">${safeQuery}</span>"
                    </h2>
                    <p style="margin: 4px 0 0; color: var(--text-secondary, #64748b); font-size: 0.95rem;">
                        ${count} ${count === 1 ? 'tool' : 'tools'} found matching your search
                    </p>
                `;
            }
        }
    }

    function showNoResults(show) {
        if (!noResults) return;
        
        try {
            if (show === true) {
                noResults.classList.remove('hidden');
                if (toolsGrid) toolsGrid.style.display = 'none';
            } else {
                noResults.classList.add('hidden');
                if (toolsGrid) toolsGrid.style.display = 'grid';
            }
        } catch (error) {
            // Silently fail
        }
    }

    function renderCategories() {
        if (!categoryFilters) {
            return;
        }
        
        try {
            if (!categories || categories.length === 0) {
                if (console && console.warn) console.warn('⚠️ No categories to render');
                return;
            }
            
            categoryFilters.innerHTML = categories.map(function(cat) {
                if (!cat) return '';
                const categoryName = (CATEGORY_DATA && CATEGORY_DATA[cat]) ? CATEGORY_DATA[cat].name : cat;
                return '<button class="category-btn ' + (cat === 'all' ? 'active' : '') + '" data-cat="' + cat + '">' +
                    (categoryName || cat) +
                '</button>';
            }).join('');
            
            const categoryBtns = document.querySelectorAll('.category-btn');
            if (categoryBtns && categoryBtns.length > 0) {
                categoryBtns.forEach(function(btn) {
                    if (btn) {
                        btn.addEventListener('click', function(e) {
                            if (!e || !e.currentTarget) return;
                            
                            const allBtns = document.querySelectorAll('.category-btn');
                            if (allBtns && allBtns.length > 0) {
                                allBtns.forEach(function(b) {
                                    if (b) b.classList.remove('active');
                                });
                            }
                            
                            e.currentTarget.classList.add('active');
                            
                            const selectedCat = e.currentTarget.dataset.cat;
                            const searchTerm = (globalSearch && globalSearch.value) ? globalSearch.value : '';
                            
                            // Update URL with category only
                            const newUrl = window.location.pathname + '?cat=' + encodeURIComponent(selectedCat);
                            window.history.pushState({}, '', newUrl);
                            
                            filterTools(selectedCat, searchTerm);
                            
                            setTimeout(function() {
                                const allToolsHeading = document.getElementById('allToolsHeading');
                                if (allToolsHeading) {
                                    smoothScrollToElement(allToolsHeading, 20);
                                }
                            }, 150);
                        });
                    }
                });
            }
            
        } catch (error) {
            if (console && console.error) console.error('❌ Error rendering categories:', error);
        }
    }

    function updateStats() {
        try {
            const totalTools = (TOOLS && TOOLS.length) || 0;
            const totalCategories = new Set(
                (TOOLS || []).map(function(t) { return t && t.cat; }).filter(Boolean)
            ).size;

            document.querySelectorAll('.heroToolCount').forEach(function(el) {
                if (el) el.textContent = totalTools + '+';
            });

            document.querySelectorAll('.heroCatCount').forEach(function(el) {
                if (el) el.textContent = totalCategories;
            });

        } catch (error) {
            if (console && console.warn) {
                console.warn('⚠️ Error updating stats:', error);
            }
        }
    }

    function updateAboutStats() {
        try {
            const totalTools = (TOOLS && TOOLS.length) || 0;
            const totalCategories = new Set(
                (TOOLS || []).map(function(t) { return t && t.cat; }).filter(Boolean)
            ).size;
            
            const aboutTool = document.getElementById('aboutToolCount');
            const aboutCat = document.getElementById('aboutCatCount');
            
            if (aboutTool) {
                aboutTool.textContent = totalTools;
            }
            if (aboutCat) {
                aboutCat.textContent = totalCategories;
            }
        } catch (error) {
            if (console && console.warn) console.warn('⚠️ Error updating about stats:', error);
        }
    }

    function filterTools(cat, search) {
        cat = cat || 'all';
        search = search || '';
        
        if (!toolsGrid) {
            return;
        }
        
        try {
            if (!TOOLS || !Array.isArray(TOOLS) || TOOLS.length === 0) {
                if (isInitialLoad) {
                    toolsGrid.innerHTML = `
                        <div class="loading-tools" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                            <div style="display: inline-block; width: 40px; height: 40px; border: 3px solid var(--border-color, #e5e7eb); border-top-color: #4f46e5; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
                            <p style="color: var(--text-secondary, #64748b); margin-top: 16px;">Loading tools...</p>
                        </div>
                    `;
                    showNoResults(false);
                }
                return;
            }
            
            isInitialLoad = false;
            toolsLoaded = true;
            
            let filtered = searchTools(cat, search);
            
            if (!filtered || filtered.length === 0) {
    if (toolsGrid) {
        toolsGrid.innerHTML = '';
        toolsGrid.style.display = 'none';
    }

    if (noResults) {
        noResults.classList.remove('hidden');
        const safeSearch = escapeHTML(search);
        const categoryName = (CATEGORY_DATA && CATEGORY_DATA[cat]) ? CATEGORY_DATA[cat].name : cat;
        
        // Get current category for preserving in links
        const currentCat = cat || 'all';
        const catParam = currentCat !== 'all' ? '&cat=' + encodeURIComponent(currentCat) : '';

        noResults.innerHTML = `
            <div class="search-no-results">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m21 21-4.34-4.34"/>
                    <circle cx="11" cy="11" r="8"/>
                </svg>
                ${search ? `<h3>No tools found for "${safeSearch}"</h3>` : `<h3>No tools found in ${categoryName}</h3>`}
                <p>Try different keywords or browse categories:</p>
                <div class="suggestions">
                    <button class="secondary-btn" onclick="window.location.href='/search/?q=Calculator&cat=basic${catParam}'">Basic Calculators</button>
                    <button class="secondary-btn" onclick="window.location.href='/search/?q=Converter&cat=basic${catParam}'">Basic Converters</button>
                    <button class="secondary-btn" onclick="window.location.href='/search/?q=Generator&cat=basic${catParam}'">Basic Generators</button>
                    <button class="secondary-btn" onclick="window.location.href='/search/?q=Health&cat=health${catParam}'">Health Tools</button>
                    <button class="secondary-btn" onclick="window.location.href='/search/?q=Finance&cat=finance${catParam}'">Finance Tools</button>
                    <button class="secondary-btn" onclick="window.location.href='/search/?q=Developer&cat=dev${catParam}'">Developer Tools</button>
                    <button class="secondary-btn" onclick="window.location.href='/search/?q=Student&cat=student${catParam}'">Student Tools</button>
                    <button class="secondary-btn" onclick="window.location.href='/search/?q=Media&cat=media${catParam}'">Media Tools</button>
                </div>
            </div>
        `;
    }

            } else {
                if (noResults) noResults.classList.add('hidden');
                if (toolsGrid) toolsGrid.style.display = 'grid';
                
                toolsGrid.innerHTML = filtered.map(function(t) {
                    if (!t) return '';
                    
                    const iconPath = t.icon ? (t.icon.startsWith('/') ? t.icon : '/' + t.icon) : '';
                    const linkPath = t.link ? (t.link.startsWith('/') ? t.link : '/' + t.link) : '#';
                    const categoryName = (CATEGORY_DATA && CATEGORY_DATA[t.cat]) ? CATEGORY_DATA[t.cat].name : (t.cat || 'Uncategorized');
                    
                    return `
                        <a href="${linkPath}" class="tool-card" data-id="${t.id || ''}">
                            <span class="tool-icon">
                                ${iconPath ? '<img src="' + iconPath + '" alt="' + (t.name || 'Tool') + '">' : ''}
                            </span>
                            <div class="tool-name">${t.name || 'Unnamed Tool'}</div>
                            <div class="tool-desc">${t.desc || ''}</div>
                            <span class="tool-badge">${categoryName}</span>
                        </a>
                    `;
                }).filter(function(html) { return html && html !== ''; }).join('');
            }
        } catch (error) {
            if (console && console.error) console.error('❌ Error filtering tools:', error);
            showNoResults(false);
        }
    }

    // ============================================
    // SECTION 6: DATA LOADING
    // ============================================

    async function loadToolsData() {
        try {
            const response = await fetch('/data/tools.json');
            
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status);
            }
            
            const data = await response.json();
            
            TOOLS = data.tools || [];
            CATEGORY_DATA = data.categories || {};
            
            if (TOOLS && TOOLS.length > 0) {
                categories = ['all', ...new Set(TOOLS.map(function(tool) { 
                    return tool && tool.cat; 
                }).filter(Boolean))];
            }
            
            window.TOOLS = TOOLS;
            window.CATEGORY_DATA = CATEGORY_DATA;
            
            toolsLoaded = true;
            renderCategories();

            // ============================================
            // ONLY GET CATEGORY FROM URL (NOT SEARCH)
            // ============================================
            const urlParams = new URLSearchParams(window.location.search);
            const urlCategory = urlParams.get('cat') || 'all';

            const allBtns = document.querySelectorAll('.category-btn');
            allBtns.forEach(function(btn) {
                if (!btn) return;
                btn.classList.remove('active');
                if (btn.dataset.cat === urlCategory) {
                    btn.classList.add('active');
                }
            });

            // Remove any existing search heading
            const heading = document.querySelector('.search-results-heading');
            if (heading) {
                heading.remove();
            }

            // Clear search input if it exists
            if (globalSearch) {
                globalSearch.value = '';
            }

            // Only filter by category, no search term
            filterTools(urlCategory, '');
            
            if (console && console.log) {
                console.log('✅ Loaded ' + TOOLS.length + ' tools successfully!');
            }
            return data;
            
        } catch (error) {
            if (console && console.error) {
                console.error('❌ Error loading tools data:', error);
            }
            if (toolsGrid) {
                toolsGrid.innerHTML = `
                    <div class="error-message" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                        <p>⚠️ Failed to load tools data. Please refresh the page.</p>
                        <p style="font-size: 14px; color: #666;">${error.message || 'Unknown error'}</p>
                    </div>
                `;
            }
            return null;
        }
    }

    // ============================================
    // SECTION 7: RELATED TOOLS FUNCTIONS
    // ============================================

    window.getRelatedTools = function(toolId, limit) {
        if (!toolId) {
            if (console && console.warn) console.warn('⚠️ No toolId provided to getRelatedTools');
            return [];
        }
        
        if (!TOOLS || !Array.isArray(TOOLS) || TOOLS.length === 0) {
            if (console && console.warn) console.warn('⚠️ TOOLS not loaded yet');
            return [];
        }
        
        try {
            const tool = TOOLS.find(function(t) { return t && t.id === toolId; });
            if (!tool) {
                if (console && console.warn) console.warn('⚠️ Tool "' + toolId + '" not found');
                return [];
            }
            
            let relatedTools = [];
            
            if (tool.related && Array.isArray(tool.related) && tool.related.length > 0) {
                relatedTools = tool.related
                    .map(function(id) { return TOOLS.find(function(t) { return t && t.id === id; }); })
                    .filter(function(t) { return t !== undefined && t !== null && t.id !== toolId; });
            }
            
            if (relatedTools.length === 0 && tool.cat) {
                relatedTools = TOOLS.filter(function(t) {
                    return t && t.id && t.id !== toolId && t.cat === tool.cat;
                });
            }
            
            if (relatedTools.length === 0) {
                relatedTools = TOOLS.filter(function(t) {
                    return t && t.id && t.id !== toolId;
                });
            }
            
            if (limit && limit > 0 && relatedTools.length > limit) {
                return relatedTools.slice(0, limit);
            }
            
            return relatedTools;
            
        } catch (error) {
            if (console && console.error) console.error('❌ Error getting related tools:', error);
            return [];
        }
    };

    window.renderRelatedTools = function(toolId, containerId) {
        if (!toolId) {
            if (console && console.warn) console.warn('⚠️ No toolId provided to renderRelatedTools');
            return;
        }
        
        const container = document.getElementById(containerId || 'relatedToolsGrid');
        if (!container) {
            if (console && console.warn) console.warn('⚠️ Container "' + (containerId || 'relatedToolsGrid') + '" not found');
            return;
        }
        
        if (!TOOLS || !Array.isArray(TOOLS) || TOOLS.length === 0) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: var(--text-secondary, #666); font-size: 0.85rem;">
                    Loading related tools...
                </div>
            `;
            return;
        }
        
        try {
            const related = window.getRelatedTools(toolId);
            
            if (!related || related.length === 0) {
                container.innerHTML = `
                    <p style="color: var(--text-secondary, #666); font-size: 0.85rem; text-align: center; padding: 1rem;">
                        No related tools found
                    </p>
                `;
                return;
            }
            
            container.innerHTML = related.map(function(t) {
                if (!t) return '';
                
                const iconPath = t.icon ? (t.icon.startsWith('/') ? t.icon : '/' + t.icon) : '';
                const toolLink = t.link ? (t.link.startsWith('/') ? t.link : '/' + t.link) : '#';
                const toolName = t.name || 'Tool';
                const toolDesc = t.desc || toolName;
                
                return `
                    <a href="${toolLink}" class="sidebar-tool-card" title="${toolDesc}">
                        <div class="sidebar-tool-icon">
                            ${iconPath ? '<img src="' + iconPath + '" alt="' + toolName + ' icon" loading="lazy" onerror="this.style.display=\'none\'">' : ''}
                        </div>
                        <div class="sidebar-tool-name">${toolName}</div>
                    </a>
                `;
            }).filter(function(html) { return html && html !== ''; }).join('');
            
            if (console && console.log) {
                console.log('✅ Showing ' + related.length + ' related tools for "' + toolId + '"');
            }
            
        } catch (error) {
            if (console && console.error) console.error('❌ Error rendering related tools:', error);
            container.innerHTML = `
                <p style="color: #ef4444; font-size: 0.85rem; text-align: center; padding: 1rem;">
                    ⚠️ Error loading related tools
                </p>
            `;
        }
    };

    window.areRelated = function(toolId1, toolId2) {
        if (!toolId1 || !toolId2) return false;
        if (!TOOLS || !Array.isArray(TOOLS)) return false;
        
        try {
            const tool1 = TOOLS.find(function(t) { return t && t.id === toolId1; });
            if (tool1 && tool1.related && Array.isArray(tool1.related)) {
                return tool1.related.indexOf(toolId2) !== -1;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    window.getRelatedCount = function(toolId) {
        if (!toolId) return 0;
        if (!TOOLS || !Array.isArray(TOOLS)) return 0;
        
        try {
            const tool = TOOLS.find(function(t) { return t && t.id === toolId; });
            return (tool && tool.related && Array.isArray(tool.related)) ? tool.related.length : 0;
        } catch (error) {
            return 0;
        }
    };

    window.initRelatedTools = function(toolId, prefix) {
        if (!toolId) {
            if (console && console.warn) console.warn('⚠️ No toolId provided');
            return;
        }
        
        if (TOOLS && Array.isArray(TOOLS) && TOOLS.length > 0) {
            window.renderRelatedTools(toolId, 'relatedToolsGrid');
            return;
        }
        
        let attempts = 0;
        const maxAttempts = 50;
        const checkInterval = 100;
        
        const checkTools = setInterval(function() {
            attempts++;
            
            if (TOOLS && Array.isArray(TOOLS) && TOOLS.length > 0) {
                clearInterval(checkTools);
                window.renderRelatedTools(toolId, 'relatedToolsGrid');
                return;
            }
            
            if (attempts >= maxAttempts) {
                clearInterval(checkTools);
                const grid = document.getElementById('relatedToolsGrid');
                if (grid) {
                    grid.innerHTML = `
                        <p style="color: var(--text-secondary, #666); font-size: 0.85rem; text-align: center; padding: 1rem;">
                            ⚠️ Failed to load related tools
                        </p>
                    `;
                }
                if (console && console.warn) {
                    console.warn('⚠️ Failed to load TOOLS data after 5 seconds');
                }
            }
        }, checkInterval);
    };

    // ============================================
    // SECTION 8: TOOL METADATA FUNCTIONS
    // ============================================

    function setToolMetadata(activeToolId, prefix) {
        if (!activeToolId) {
            if (console && console.warn) console.warn('⚠️ No activeToolId provided to setToolMetadata');
            return;
        }
        
        if (!TOOLS || !Array.isArray(TOOLS) || TOOLS.length === 0) {
            if (console && console.warn) console.warn('⚠️ TOOLS not loaded yet');
            return;
        }
        
        try {
            const currentTool = TOOLS.find(function(t) { return t && t.id === activeToolId; });
            if (!currentTool) {
                if (console && console.warn) console.warn('⚠️ Tool "' + activeToolId + '" not found in TOOLS');
                return;
            }
            
            const iconBox = document.getElementById('toolMainIcon');
            if (iconBox && currentTool.icon) {
                const iconPath = currentTool.icon.startsWith('/') ? currentTool.icon : '/' + currentTool.icon;
                iconBox.innerHTML = '<img src="' + iconPath + '" alt="' + (currentTool.name || activeToolId) + '" style="width:100%; height:100%;" onerror="this.style.display=\'none\'">';
                if (console && console.log) {
                    console.log('✅ Icon set for "' + activeToolId + '": ' + iconPath);
                }
            }
            
            const categoryBox = document.getElementById('toolCategoryBadge');
            if (categoryBox && currentTool.cat) {
                categoryBox.textContent = currentTool.cat;
                if (console && console.log) {
                    console.log('✅ Category set for "' + activeToolId + '": ' + currentTool.cat);
                }
            }
        } catch (error) {
            if (console && console.warn) console.warn('⚠️ Failed to set tool metadata:', error);
        }
    }

    window.initToolMetadata = function(activeToolId, prefix) {
        if (!activeToolId) {
            if (console && console.warn) console.warn('⚠️ No activeToolId provided');
            return;
        }
        
        if (TOOLS && Array.isArray(TOOLS) && TOOLS.length > 0) {
            setToolMetadata(activeToolId, prefix);
            return;
        }
        
        let attempts = 0;
        const maxAttempts = 50;
        const checkInterval = 100;
        
        const checkTools = setInterval(function() {
            attempts++;
            
            if (TOOLS && Array.isArray(TOOLS) && TOOLS.length > 0) {
                clearInterval(checkTools);
                setToolMetadata(activeToolId, prefix);
                return;
            }
            
            if (attempts >= maxAttempts) {
                clearInterval(checkTools);
                if (console && console.warn) {
                    console.warn('⚠️ Failed to load TOOLS data for metadata after 5 seconds');
                }
            }
        }, checkInterval);
    };

    // ============================================
    // SECTION 9: GLOBAL SEARCH HIJACK
    // ============================================

    function setupSearchHijack() {
        console.log('🔍 Setting up global search hijack');
        
        const searchInput = document.getElementById('globalSearch');
        
        if (!searchInput) {
            console.warn('⚠️ Search input not found on this page');
            return;
        }
        
        function performSearch(query) {
            if (query && query.trim() !== '') {
                const redirectUrl = '/search/?q=' + encodeURIComponent(query.trim());
                console.log('🔍 Redirecting to:', redirectUrl);
                window.location.href = redirectUrl;
            }
        }
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
        
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                performSearch(searchInput.value);
            });
        }
        
        console.log('✅ Global search hijack set up successfully');
    }

    // ============================================
// SECTION 10: INITIALIZATION & SETUP
// ============================================

function handleCategoryFromURL() {
    try {
        const category = new URLSearchParams(window.location.search).get('cat') || 'all';
        const btn = document.querySelector('.category-btn[data-cat="' + category + '"]');
        if (btn) btn.click();
        else {
            const allBtn = document.querySelector('.category-btn[data-cat="all"]');
            if (allBtn) allBtn.click();
        }
    } catch (e) {
        if (console && console.warn) console.warn('Category URL error:', e);
    }
}

function setYear() {
    try {
        const el = document.getElementById('currentYear');
        if (el) {
            el.textContent = new Date().getFullYear();
        }
    } catch (error) {
        // Silently fail
    }
}

// Dark mode toggle
if (darkToggle) {
    darkToggle.addEventListener('click', function() {
        darkMode = !darkMode;
        if (document.body) {
            document.body.classList.toggle('dark', darkMode);
        }
        try {
            localStorage.setItem('toolzaryDark', darkMode);
        } catch (e) {
            // Silently fail
        }
        if (darkToggle) {
            darkToggle.textContent = darkMode ? 'Light Mode' : 'Dark Mode';
        }
    });
}

// ============================================
// SEARCH WITH DEBOUNCE (Works without URL update)
// ============================================
if (globalSearch && document.getElementById('toolsGrid')) {
    let searchTimeout;
    globalSearch.addEventListener('input', function() {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(function() {
            const searchTerm = globalSearch.value.trim();
            
            // Get current category from URL
            const urlParams = new URLSearchParams(window.location.search);
            const currentCategory = urlParams.get('cat') || 'all';
            
            // Perform search without updating URL
            filterTools(currentCategory, searchTerm);
            
            // Smooth scroll to results
            if (searchTerm) {
                const allToolsHeading = document.getElementById('allToolsHeading');
                if (allToolsHeading) {
                    smoothScrollToElement(allToolsHeading, 20);
                }
            }
        }, 300);
    });
}

// URL parameters - Only handle category, not search
try {
    if (window.location && window.location.search) {
        const urlParams = new URLSearchParams(window.location.search);
        const sharedSearchQuery = urlParams.get('q');
        // Ignore search query - only use category
    }
} catch (error) {
    if (console && console.warn) console.warn('⚠️ Error parsing URL params:', error);
}

// Dark mode from localStorage
try {
    if (localStorage.getItem('toolzaryDark') === 'true') {
        darkMode = true;
        if (document.body) {
            document.body.classList.add('dark');
        }
        if (darkToggle) {
            darkToggle.textContent = 'Light Mode';
        }
    }
} catch (error) {
    if (console && console.warn) console.warn('⚠️ Error loading dark mode preference:', error);
}

// Load data and initialize
loadToolsData().then(function() {
    console.log('🔧 Data loaded, initializing on:', window.location.pathname);
    
    renderCategories();
    updateStats();
    updateAboutStats();
    handleCategoryFromURL();
    setYear();
    
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = urlParams.get('cat') || 'all';
    // Ignore search term from URL
    
    isInitialLoad = false;
    setupSearchHijack();

}).catch(function(error) {
    if (console && console.error) console.error('❌ Error during initialization:', error);
});
    // Auto-initialize for tool pages
    (function autoInitToolPage() {
        const init = function() {
            try {
                const titleWrap = document.querySelector('.tool-title-wrap');
                if (!titleWrap) {
                    return;
                }
                
                const activeToolId = titleWrap.dataset.activeToolId;
                if (!activeToolId) {
                    if (console && console.warn) console.warn('⚠️ No activeToolId found on .tool-title-wrap');
                    return;
                }
                
                const assetPrefix = '/';
                
                if (console && console.log) {
                    console.log('🔧 Initializing tool page: ' + activeToolId + ' (prefix: ' + assetPrefix + ')');
                }
                
                window.initToolMetadata(activeToolId, assetPrefix);
                window.initRelatedTools(activeToolId, assetPrefix);
                
                if (console && console.log) {
                    console.log('✅ Tool page initialized: ' + activeToolId);
                }
                
            } catch (error) {
                if (console && console.error) console.error('❌ Error initializing tool page:', error);
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();

    // CSS animation for loading spinner
    (function addSpinAnimation() {
        if (!document.getElementById('spin-animation-style')) {
            var style = document.createElement('style');
            style.id = 'spin-animation-style';
            style.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    })();

    // Expose functions to window
    window.searchTools = searchTools;
    window.filterTools = filterTools;
    window.getPopularTools = getPopularTools;

})();

// ============================================
// SECTION 11: FAQ FUNCTIONALITY
// ============================================

function initFaq() {
    try {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems || faqItems.length === 0) {
            return;
        }
        
        faqItems.forEach(function(item) {
            const questionBtn = item.querySelector('.faq-question');
            if (!questionBtn) {
                return;
            }
            
            questionBtn.addEventListener('click', function() {
                try {
                    faqItems.forEach(function(otherItem) {
                        if (otherItem !== item && otherItem.classList && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    if (item.classList) {
                        item.classList.toggle('active');
                    }
                } catch (err) {
                    // Silently fail
                }
            });
        });
    } catch (error) {
        // Silently fail
    }
}

function safeInit() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaq);
    } else {
        initFaq();
    }
}

safeInit();



















