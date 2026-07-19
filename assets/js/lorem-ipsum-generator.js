/**
 * Lorem Ipsum Generator - Professional Complete Version
 * With custom dropdowns, proper format support, and no auto-scroll
 * Integrates with Toolzary template
 */
// ============================================================
// 2. LANGUAGE DATABASES
// ============================================================

const LOREM_DATABASES = {
  latin: {
    words: [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
      'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
      'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
      'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
      'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
      'est', 'laborum', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus', 'error',
      'voluptatem', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
      'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
      'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo'
    ],
    sentences: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.'
    ]
  },
  'latin-modern': {
    words: [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
      'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
      'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
      'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
      'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
      'est', 'laborum', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus', 'error',
      'voluptatem', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
      'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis'
    ],
    sentences: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
      'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.',
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.',
      'Consectetur, adipisci velit, sed quia non numquam eius modi tempora.',
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.',
      'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.'
    ]
  },
  english: {
    words: [
      'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'hello',
      'world', 'this', 'is', 'a', 'test', 'of', 'the', 'emergency', 'broadcast',
      'system', 'all', 'your', 'base', 'are', 'belong', 'to', 'us', 'never',
      'gonna', 'give', 'you', 'up', 'never', 'gonna', 'let', 'you', 'down',
      'stay', 'hungry', 'stay', 'foolish', 'think', 'different', 'be', 'awesome',
      'create', 'innovate', 'inspire', 'design', 'build', 'grow', 'learn',
      'explore', 'discover', 'achieve', 'succeed', 'dream', 'believe', 'achieve'
    ],
    sentences: [
      'The quick brown fox jumps over the lazy dog.',
      'Hello world, this is a test of the emergency broadcast system.',
      'All your base are belong to us.',
      'Never gonna give you up, never gonna let you down.',
      'Stay hungry, stay foolish.',
      'Think different. Be awesome. Create something amazing.',
      'Design is not just what it looks like, design is how it works.',
      'The best way to predict the future is to invent it.',
      'Innovation distinguishes between a leader and a follower.',
      'Simplicity is the ultimate sophistication.'
    ]
  },
  corporate: {
    words: [
      'synergy', 'leverage', 'innovate', 'disrupt', 'scale', 'optimize',
      'streamline', 'empower', 'transform', 'accelerate', 'growth', 'market',
      'strategy', 'solution', 'platform', 'ecosystem', 'paradigm', 'engagement',
      'analytics', 'insights', 'actionable', 'ROI', 'KPIs', 'benchmark',
      'enterprise', 'solutions', 'digital', 'native', 'cloud', 'agile',
      'productivity', 'efficiency', 'scalable', 'robust', 'seamless', 'integration'
    ],
    sentences: [
      'We leverage our core competencies to deliver scalable enterprise solutions.',
      'Our mission is to innovate and disrupt traditional market paradigms.',
      'Transform your business with our next-generation digital platform.',
      'Drive engagement and accelerate growth with actionable analytics insights.',
      'Our agile methodology ensures optimal ROI and measurable KPIs.',
      'Empower your workforce with seamless cloud-native integrations.',
      'Scale your operations with our robust and secure infrastructure.',
      'We deliver cutting-edge solutions that transform the digital landscape.',
      'Our ecosystem enables frictionless collaboration and innovation.',
      'Optimize your workflow with our intuitive and intelligent tools.'
    ]
  },
  funny: {
    words: [
      'literally', 'unbelievable', 'epic', 'awesome', 'nerf', 'this', 'is',
      'fine', 'dog', 'cat', 'keyboard', 'pizza', 'coffee', 'existential',
      'crisis', 'meme', 'vibe', 'chill', 'bro', 'dude', 'awesome', 'sauce',
      'chocolate', 'rainbow', 'unicorn', 'taco', 'tuesday', 'wicked', 'sick',
      'rad', 'gnarly', 'whoa', 'wow', 'much', 'very', 'such', 'doge', 'wow'
    ],
    sentences: [
      'Literally this is the most epic thing ever, bro.',
      'I\'m having an existential crisis about my keyboard.',
      'Pizza is life, coffee is love, and tacos are everything.',
      'Whoa, dude, that\'s absolutely rad and gnarly!',
      'Much wow, such awesome, very incredible, so great!',
      'Chill vibes only, bro. This is fine. Everything is fine.',
      'The cat is on the keyboard and I can\'t even right now.',
      'I came here to drink coffee and kick butt, and I\'m all out of coffee.',
      'What if the dog is secretly plotting world domination? Just a thought.',
      'I\'m not a regular dad, I\'m a cool dad with awesome sauce.'
    ]
  },
  tech: {
    words: [
      'algorithm', 'api', 'backend', 'frontend', 'fullstack', 'devops', 'cloud',
      'microservices', 'container', 'kubernetes', 'docker', 'serverless', 'lambda',
      'function', 'node', 'react', 'angular', 'vue', 'typescript', 'javascript',
      'python', 'rust', 'golang', 'database', 'sql', 'nosql', 'mongodb', 'postgres',
      'redis', 'cache', 'queue', 'message', 'broker', 'authentication', 'authorization',
      'encryption', 'blockchain', 'machine', 'learning', 'ai', 'neural', 'network'
    ],
    sentences: [
      'Our microservices architecture is deployed on Kubernetes clusters.',
      'We leverage serverless functions for scalable cloud-native applications.',
      'The frontend is built with React and TypeScript for type safety.',
      'Our backend APIs are written in Node.js with Express framework.',
      'Machine learning models are trained on large-scale distributed systems.',
      'Database sharding ensures high availability and performance.',
      'Real-time data streaming is handled by Apache Kafka brokers.',
      'Authentication is managed through JWT and OAuth2 protocols.',
      'Our CI/CD pipeline ensures automated testing and deployment.',
      'The blockchain layer provides immutable audit trails and transparency.'
    ]
  },
  design: {
    words: [
      'typography', 'layout', 'grid', 'spacing', 'contrast', 'balance', 'hierarchy',
      'white', 'space', 'color', 'palette', 'font', 'weight', 'style', 'shadow',
      'opacity', 'gradient', 'blend', 'transition', 'animation', 'responsive',
      'fluid', 'adaptive', 'accessible', 'inclusive', 'minimalist', 'bold',
      'elegant', 'sophisticated', 'modern', 'retro', 'vintage', 'fresh', 'clean'
    ],
    sentences: [
      'Typography is the art of arranging type to make language visible.',
      'The layout grid creates visual hierarchy and balance in the design.',
      'White space is essential for readability and visual breathing room.',
      'Color palettes evoke emotion and establish brand identity.',
      'Responsive design ensures accessibility across all devices.',
      'Minimalist design focuses on essential elements and clean aesthetics.',
      'Gradients and shadows add depth and dimension to flat designs.',
      'Animation brings life and interactivity to digital experiences.',
      'Accessible design includes all users regardless of ability.',
      'Bold typography makes a powerful statement in modern design.'
    ]
  }
};

// ============================================================
// 3. GENERATION FUNCTIONS
// ============================================================

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomWords(database, count) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(getRandomItem(database.words));
  }
  return words;
}

function generateSentence(database, wordCount) {
  // Get exactly the number of words requested
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(getRandomItem(database.words));
  }
  // Capitalize first letter
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  // Join with spaces and add single period
  return words.join(' ') + '.';
}

function generateParagraph(database, sentenceCount, wordsPerSentence) {
  const sentences = [];
  for (let i = 0; i < sentenceCount; i++) {
    // Use EXACTLY the wordsPerSentence value, no random variation
    sentences.push(generateSentence(database, wordsPerSentence));
  }
  return sentences.join(' ');
}

function generateLoremIpsum(options) {
  const {
    paragraphs = 3,
    sentencesPerParagraph = 5,
    wordsPerSentence = 8,
    language = 'latin',
    format = 'plain',
    startWith = 'classic',
    customStart = ''
  } = options;

  const database = LOREM_DATABASES[language] || LOREM_DATABASES.latin;
  const paragraphTexts = [];

  for (let i = 0; i < paragraphs; i++) {
    const text = generateParagraph(database, sentencesPerParagraph, wordsPerSentence);
    paragraphTexts.push(text);
  }

if (
  startWith === 'classic' &&
  (language === 'latin' || language === 'latin-modern')
) {
  if (paragraphTexts.length > 0) {

    const classicWords = [
      'Lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit'
    ];

    const firstSentenceWords = [...classicWords];

    while (firstSentenceWords.length < wordsPerSentence) {
      firstSentenceWords.push(getRandomItem(database.words));
    }

    const sentences = paragraphTexts[0]
      .split('. ')
      .filter(Boolean);

    sentences[0] = firstSentenceWords
      .slice(0, wordsPerSentence)
      .join(' ');

    paragraphTexts[0] = sentences.join('. ');
  }
}

else if (startWith === 'custom' && customStart) {
  if (paragraphTexts.length > 0) {

    const cleanStart = customStart
      .replace(/\.$/, '')
      .trim()
      .split(' ')
      .slice(0, wordsPerSentence)
      .join(' ');

    const sentences = paragraphTexts[0]
      .split('. ')
      .filter(Boolean);

    sentences[0] = cleanStart;

    paragraphTexts[0] = sentences.join('. ');
  }
}

  const fullText = paragraphTexts.join(' ');
  const plainText = paragraphTexts.join('\n\n');
  
  // ✅ FIXED: Generate proper format output
  let formattedResult;
  
  switch (format) {
    case 'html':
      // ✅ Complete HTML template with proper structure
      formattedResult = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lorem Ipsum</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.8; color: #333; }
    h1 { color: #4f46e5; font-size: 1.8rem; border-bottom: 2px solid #4f46e5; padding-bottom: 0.5rem; }
    p { margin-bottom: 1.2rem; }
    .container { background: #f9fafb; padding: 2rem; border-radius: 8px; }
    .footer { margin-top: 2rem; font-size: 0.85rem; color: #6b7280; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Lorem Ipsum</h1>
${paragraphTexts.map(p => `    <p>${p}</p>`).join('\n')}
    <div class="footer">
      <p>Generated with Toolzary Lorem Ipsum Generator</p>
    </div>
  </div>
</body>
</html>`;
      break;
      
    case 'markdown':
      // ✅ Complete Markdown template
      formattedResult = `# Lorem Ipsum

${paragraphTexts.map(p => p).join('\n\n')}

---
*Generated with Toolzary Lorem Ipsum Generator*
`;
      break;
      
    case 'plain':
    default:
      formattedResult = plainText;
  }

  const stats = {
  characters: fullText.length,
  words: fullText.trim().split(/\s+/).length,
  sentences: paragraphTexts.reduce((acc, p) => {
    return acc + p.split('.').filter(s => s.trim().length > 0).length;
  }, 0),
  paragraphs: paragraphTexts.length
};

  return {
    text: formattedResult,
    plainText: plainText,
    stats: stats,
    paragraphs: paragraphTexts,
    format: format
  };
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
  setTimeout(() => errorBox.classList.add('hidden'), 3000);
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
  }, 2000);
}

function displayResult(result, options) {
  const output = getCachedElement('loremOutput');
  const resultBox = getCachedElement('loremResultBox');
  const charDisplay = getCachedElement('charCount');
  const wordDisplay = getCachedElement('wordCountDisplay');
  const sentenceDisplay = getCachedElement('sentenceCountDisplay');
  const paraDisplay = getCachedElement('paraCountDisplay');
  const formatBadge = getCachedElement('formatBadge');

  if (!output) return;

  // Update format badge
  if (formatBadge) {
    const formatNames = {
      'plain': 'Plain Text',
      'html': 'HTML',
      'markdown': 'Markdown'
    };
    formatBadge.textContent = formatNames[options.format] || 'Plain Text';
  }

  // ✅ Display based on format with proper code display
  if (options.format === 'html') {
    const escapedHtml = result.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    output.innerHTML = `
      <div class="html-preview">
        <div class="code-header">
          <span class="code-language">HTML</span>
          <button class="copy-code-btn" onclick="copyCode()">Copy Code</button>
        </div>
        <pre><code class="language-html">${escapedHtml}</code></pre>
      </div>
    `;
  } else if (options.format === 'markdown') {
    const escapedMd = result.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    output.innerHTML = `
      <div class="markdown-preview">
        <div class="code-header">
          <span class="code-language">Markdown</span>
          <button class="copy-code-btn" onclick="copyCode()">Copy Code</button>
        </div>
        <pre><code class="language-markdown">${escapedMd}</code></pre>
      </div>
    `;
  } else {
    output.textContent = result.text;
  }

  if (charDisplay) charDisplay.textContent = `Characters: ${result.stats.characters.toLocaleString()}`;
  if (wordDisplay) wordDisplay.textContent = `Words: ${result.stats.words.toLocaleString()}`;
  if (sentenceDisplay) sentenceDisplay.textContent = `Sentences: ${result.stats.sentences.toLocaleString()}`;
  if (paraDisplay) paraDisplay.textContent = `Paragraphs: ${result.stats.paragraphs.toLocaleString()}`;

  if (resultBox) {
    resultBox.classList.remove('hidden');
  }

  window._lastResult = result;
  window._lastOptions = options;
}

// ============================================================
// 5. COPY & DOWNLOAD FUNCTIONS
// ============================================================

function copyResult() {
  const result = window._lastResult;
  if (!result) {
    showError('Nothing to copy. Generate some text first.');
    return;
  }

  const text = result.text;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess('Copied to clipboard!');
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

function downloadResult() {
  const result = window._lastResult;
  const options = window._lastOptions;
  
  if (!result) {
    showError('Nothing to download. Generate some text first.');
    return;
  }

  const format = options ? options.format : 'plain';
  let content = result.text;
  let extension = 'txt';
  let mimeType = 'text/plain';

  switch (format) {
    case 'html':
      content = result.text;
      extension = 'html';
      mimeType = 'text/html';
      break;
    case 'markdown':
      content = result.text;
      extension = 'md';
      mimeType = 'text/markdown';
      break;
    default:
      content = result.text;
      extension = 'txt';
      mimeType = 'text/plain';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lorem-ipsum.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showSuccess(`Downloaded as ${extension.toUpperCase()}!`);
}

function clearResult() {
  const output = getCachedElement('loremOutput');
  const resultBox = getCachedElement('loremResultBox');
  if (output) {
    output.textContent = '';
    output.innerHTML = '';
  }
  if (resultBox) resultBox.classList.add('hidden');
  window._lastResult = null;
  window._lastOptions = null;
}

// ============================================================
// 6. COPY CODE FUNCTION
// ============================================================

function copyCode() {
  const codeElement = document.querySelector('.html-preview code, .markdown-preview code');
  if (!codeElement) {
    showError('No code to copy.');
    return;
  }
  
  const text = codeElement.textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess('Code copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

// Make it globally accessible for the onclick in HTML
window.copyCode = copyCode;

// ============================================================
// 7. HISTORY MANAGEMENT
// ============================================================

function getHistory() {
  try {
    const data = localStorage.getItem('loremHistory');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveHistoryItem(entry) {
  const history = getHistory();
  history.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...entry
  });
  if (history.length > 50) history.length = 50;
  localStorage.setItem('loremHistory', JSON.stringify(history));
  renderHistory();
}

function clearHistory() {
  localStorage.removeItem('loremHistory');
  renderHistory();
}

function deleteHistoryItem(id) {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem('loremHistory', JSON.stringify(filtered));
  renderHistory();
}

function renderHistory() {
  const list = getCachedElement('historyList');
  if (!list) return;

  const history = getHistory();

  if (history.length === 0) {
    list.innerHTML = '<p class="empty-history">No generation history yet.</p>';
    return;
  }

  list.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="history-item-info">
        <span class="history-item-preview">${escapeHtml(item.preview || 'Lorem Ipsum...')}</span>
        <span class="history-item-stats">${item.words} words · ${item.sentences} sentences</span>
        <span class="history-item-time">${new Date(item.timestamp).toLocaleString()}</span>
      </div>
      <div>
        <button class="history-btn" onclick="restoreHistoryItem(${item.id})">↻ Restore</button>
        <button class="history-btn danger" onclick="deleteHistoryItemUI(${item.id})">✕</button>
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.restoreHistoryItem = function(id) {
  const history = getHistory();
  const item = history.find(h => h.id === id);
  if (item) {
    const paraCount = getCachedElement('paraCount');
    const sentenceCount = getCachedElement('sentenceCount');
    const wordCount = getCachedElement('wordCount');
    const languageSelect = getCachedElement('languageSelect');
    const formatSelect = getCachedElement('formatSelect');
    const startWith = getCachedElement('startWith');

    if (paraCount) paraCount.value = item.paragraphs || 3;
    if (sentenceCount) sentenceCount.value = item.sentencesPerParagraph || 5;
    if (wordCount) wordCount.value = item.wordsPerSentence || 8;
    if (languageSelect) languageSelect.value = item.language || 'latin';
    if (formatSelect) formatSelect.value = item.format || 'plain';
    if (startWith) startWith.value = item.startWith || 'classic';

    generateText();
    showSuccess('Restored from history!');
  }
};

window.deleteHistoryItemUI = function(id) {
  deleteHistoryItem(id);
};

// ============================================================
// 8. CUSTOM DROPDOWN HANDLING
// ============================================================

function setupCustomDropdown(selectId, inputId) {
  const select = getCachedElement(selectId);
  const input = getCachedElement(inputId);
  
  if (!select || !input) return;

  select.addEventListener('change', function() {
    if (this.value === 'custom') {
      input.classList.remove('hidden');
      input.focus();
      input.value = '';
    } else {
      input.classList.add('hidden');
    }
  });

  input.addEventListener('change', function() {
    if (this.value) {
      const val = parseInt(this.value);
      if (!isNaN(val) && val > 0) {
        let exists = false;
        for (let i = 0; i < select.options.length; i++) {
          if (parseInt(select.options[i].value) === val) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          const option = document.createElement('option');
          option.value = val;
          option.textContent = val + ' (custom)';
          select.appendChild(option);
        }
        select.value = val;
        this.classList.add('hidden');
        
        const output = getCachedElement('loremOutput');
        if (output && (output.textContent || output.innerHTML)) {
          window._shouldScroll = false;
          generateText();
        }
      } else {
        showError('Please enter a valid number.');
      }
    }
  });

  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.dispatchEvent(new Event('change'));
    }
  });
}

// ============================================================
// 9. GET VALUE FROM SELECT WITH CUSTOM
// ============================================================

function getValueFromSelect(selectId, inputId, defaultVal) {
  const select = getCachedElement(selectId);
  const input = getCachedElement(inputId);
  
  if (!select) return defaultVal;
  
  if (select.value === 'custom') {
    if (input && input.value) {
      const val = parseInt(input.value);
      if (!isNaN(val) && val > 0) {
        return val;
      }
    }
    return defaultVal;
  }
  
  const val = parseInt(select.value);
  return (isNaN(val) || val < 1) ? defaultVal : val;
}

// ============================================================
// 10. MAIN GENERATION FUNCTION
// ============================================================

function generateText() {
  let paraCount = getValueFromSelect('paraCount', 'paraCustom', 3);
  let sentenceCount = getValueFromSelect('sentenceCount', 'sentenceCustom', 5);
  let wordCount = getValueFromSelect('wordCount', 'wordCustom', 8);
  
  if (paraCount < 1 || paraCount > 100) {
    showError('Paragraphs must be between 1 and 100.');
    return;
  }
  if (sentenceCount < 1 || sentenceCount > 200) {
    showError('Sentences must be between 1 and 50.');
    return;
  }
  if (wordCount < 1 || wordCount > 100) {
    showError('Words must be between 3 and 30.');
    return;
  }

  const languageSelect = getCachedElement('languageSelect');
  const formatSelect = getCachedElement('formatSelect');
  const startWithSelect = getCachedElement('startWith');
  const customStartInput = getCachedElement('customStartInput');

  const language = languageSelect ? languageSelect.value : 'latin';
  const format = formatSelect ? formatSelect.value : 'plain';
  const startWith = startWithSelect ? startWithSelect.value : 'classic';
  const customStart = customStartInput ? customStartInput.value : '';

  const options = {
    paragraphs: paraCount,
    sentencesPerParagraph: sentenceCount,
    wordsPerSentence: wordCount,
    language: language,
    format: format,
    startWith: startWith,
    customStart: customStart
  };

  const result = generateLoremIpsum(options);
  
  const output = getCachedElement('loremOutput');
  const resultBox = getCachedElement('loremResultBox');
  const charDisplay = getCachedElement('charCount');
  const wordDisplay = getCachedElement('wordCountDisplay');
  const sentenceDisplay = getCachedElement('sentenceCountDisplay');
  const paraDisplay = getCachedElement('paraCountDisplay');
  const formatBadge = getCachedElement('formatBadge');

  if (output) {
    if (format === 'html') {
      const escapedHtml = result.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      output.innerHTML = `
        <div class="html-preview">
          <div class="code-header">
            <span class="code-language">HTML</span>
            <button class="copy-code-btn" onclick="copyCode()">Copy Code</button>
          </div>
          <pre><code class="language-html">${escapedHtml}</code></pre>
        </div>
      `;
    } else if (format === 'markdown') {
      const escapedMd = result.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      output.innerHTML = `
        <div class="markdown-preview">
          <div class="code-header">
            <span class="code-language">Markdown</span>
            <button class="copy-code-btn" onclick="copyCode()">Copy Code</button>
          </div>
          <pre><code class="language-markdown">${escapedMd}</code></pre>
        </div>
      `;
    } else {
      output.textContent = result.text;
    }
  }

  if (formatBadge) {
    const formatNames = {
      'plain': 'Plain Text',
      'html': 'HTML',
      'markdown': 'Markdown'
    };
    formatBadge.textContent = formatNames[format] || 'Plain Text';
  }

  if (charDisplay) charDisplay.textContent = `Characters: ${result.stats.characters.toLocaleString()}`;
  if (wordDisplay) wordDisplay.textContent = `Words: ${result.stats.words.toLocaleString()}`;
  if (sentenceDisplay) sentenceDisplay.textContent = `Sentences: ${result.stats.sentences.toLocaleString()}`;
  if (paraDisplay) paraDisplay.textContent = `Paragraphs: ${result.stats.paragraphs.toLocaleString()}`;

  if (resultBox) {
    resultBox.classList.remove('hidden');
  }

  window._lastResult = result;
  window._lastOptions = options;

  saveHistoryItem({
    preview: result.plainText.substring(0, 100) + (result.plainText.length > 100 ? '...' : ''),
    words: result.stats.words,
    sentences: result.stats.sentences,
    paragraphs: result.stats.paragraphs,
    language: language,
    format: format,
    startWith: startWith,
    paragraphs: paraCount,
    sentencesPerParagraph: sentenceCount,
    wordsPerSentence: wordCount
  });

  if (window._shouldScroll) {
    setTimeout(function() {
      if (resultBox) {
        resultBox.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 150);
    window._shouldScroll = false;
  }
}

// ============================================================
// 11. TOOL INITIALIZATION
// ============================================================

function initTool() {
  const copyBtn = getCachedElement('copyResultBtn');
  const downloadBtn = getCachedElement('downloadResultBtn');
  const clearBtn = getCachedElement('clearResultBtn');
  const historyToggleBtn = getCachedElement('historyToggleBtn');
  const clearHistoryBtn = getCachedElement('clearHistoryBtn');
  const historySection = getCachedElement('historySection');
  const startWithSelect = getCachedElement('startWith');
  const customStartGroup = getCachedElement('customStartGroup');

  let historyVisible = false;

  setupCustomDropdown('paraCount', 'paraCustom');
  setupCustomDropdown('sentenceCount', 'sentenceCustom');
  setupCustomDropdown('wordCount', 'wordCustom');

  if (startWithSelect) {
    startWithSelect.addEventListener('change', function() {
      if (this.value === 'custom') {
        if (customStartGroup) customStartGroup.classList.remove('hidden');
      } else {
        if (customStartGroup) customStartGroup.classList.add('hidden');
      }
    });
  }

  const generateBtn = getCachedElement('generateBtn');
  if (generateBtn) {
    const newBtn = generateBtn.cloneNode(true);
    generateBtn.parentNode.replaceChild(newBtn, generateBtn);
    
    newBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window._shouldScroll = true;
      generateText();
    });
  }

  document.querySelectorAll('.data-input-field, .custom-input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        generateText();
      }
    });
  });

  const formatSelect = getCachedElement('formatSelect');
  if (formatSelect) {
    formatSelect.addEventListener('change', function() {
      const output = getCachedElement('loremOutput');
      if (output && (output.textContent || output.innerHTML)) {
        window._shouldScroll = false;
        generateText();
      }
    });
  }

  const languageSelect = getCachedElement('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      const output = getCachedElement('loremOutput');
      if (output && (output.textContent || output.innerHTML)) {
        window._shouldScroll = false;
        generateText();
      }
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', copyResult);
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadResult);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearResult);
  }

  if (historyToggleBtn) {
    historyToggleBtn.addEventListener('click', () => {
      historyVisible = !historyVisible;
      if (historySection) {
        historySection.classList.toggle('hidden');
      }
      if (historyVisible) {
        renderHistory();
        setTimeout(() => {
          historySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
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

  renderHistory();
  
  setTimeout(function() {
    generateText();
  }, 300);

  console.log('[Lorem Ipsum] ✅ Professional version initialized!');
}
// ============================================================
// 17. SELF-TEST
// ============================================================

function runSelfTest() {
  let passed = true;

  const result = generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 2, wordsPerSentence: 4 });
  if (!result.text || result.stats.words < 1) {
    console.error('[Self-Test] Failed: Generation failed');
    passed = false;
  }

  const htmlResult = generateLoremIpsum({ paragraphs: 1, sentencesPerParagraph: 1, wordsPerSentence: 3, format: 'html' });
  if (!htmlResult.text.includes('<!DOCTYPE html>')) {
    console.error('[Self-Test] Failed: HTML template missing DOCTYPE');
    passed = false;
  }

  const history = getHistory();
  if (!Array.isArray(history)) {
    console.error('[Self-Test] Failed: History should be an array');
    passed = false;
  }

  const testValue = getValueFromSelect('paraCount', 'paraCustom', 3);
  if (typeof testValue !== 'number' || testValue < 1) {
    console.error('[Self-Test] Failed: getValueFromSelect');
    passed = false;
  }

  if (passed) {
    console.log('[Lorem Ipsum] ✅ All self-tests passed!');
  } else {
    console.warn('[Lorem Ipsum] ⚠️ Some self-tests failed.');
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



















