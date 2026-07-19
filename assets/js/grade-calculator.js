/**
 * Grade Calculator - Complete Implementation
 * All bugs fixed based on ChatGPT analysis
 */

// ============================================================
// 2. CORE VARIABLES
// ============================================================

let currentTab = 'simple';
let elementCache = {};
let historyVisible = false;

// Data stores
const stores = {
  simple: [],
  weighted: [],
  gpa: []
};

// ============================================================
// 3. HELPER FUNCTIONS
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
  errorBox.className = 'local-error-alert';
  setTimeout(() => {
    errorBox.classList.add('hidden');
  }, 4000);
}

function showSuccess(message) {
  const errorBox = getCachedElement('toolLocalError');
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
  errorBox.className = 'local-error-alert success';
  setTimeout(() => {
    errorBox.classList.add('hidden');
  }, 3000);
}

function getLetterGrade(score) {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

// FIX: Unified GPA conversion function
function percentageToGPA(pct) {
  if (pct >= 93) return 4.0;
  if (pct >= 90) return 3.7;
  if (pct >= 87) return 3.3;
  if (pct >= 83) return 3.0;
  if (pct >= 80) return 2.7;
  if (pct >= 77) return 2.3;
  if (pct >= 73) return 2.0;
  if (pct >= 70) return 1.7;
  if (pct >= 67) return 1.3;
  if (pct >= 65) return 1.0;
  return 0.0;
}

function getGPAPoints(grade, scale) {
  const map = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };
  
  if (scale === '5.0') {
    const fiveMap = {
      'A+': 5.0, 'A': 5.0, 'A-': 4.7,
      'B+': 4.3, 'B': 4.0, 'B-': 3.7,
      'C+': 3.3, 'C': 3.0, 'C-': 2.7,
      'D+': 2.3, 'D': 2.0, 'D-': 1.7,
      'F': 0.0
    };
    return fiveMap[grade] || 0;
  }
  return map[grade] || 0;
}

// FIX: Case insensitive letter grade validation
function parseGradeInput(input) {
  input = input.trim().toUpperCase();
  const letterRegex = /^(A\+|A|A-|B\+|B|B-|C\+|C|C-|D\+|D|D-|F)$/i;
  if (letterRegex.test(input)) {
    return { type: 'letter', value: input.toUpperCase() };
  }
  const num = parseFloat(input);
  if (!isNaN(num) && num >= 0 && num <= 100) {
    return { type: 'percent', value: num };
  }
  return null;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
// ============================================================
// 6. TAB MANAGEMENT
// ============================================================

function switchTab(tabId) {
  currentTab = tabId;
  
  document.querySelectorAll('.grade-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  
  document.querySelectorAll('.grade-tab-content').forEach(content => {
    content.classList.toggle('active', content.id === 'tab-' + tabId);
  });
  
  const resultBox = getCachedElement('gradeResultBox');
  if (resultBox) resultBox.classList.add('hidden');
}

// ============================================================
// 7. SIMPLE GRADE CALCULATOR
// ============================================================

function addSimpleScore() {
  const scoreInput = getCachedElement('simpleScore');
  const totalInput = getCachedElement('simpleTotal');
  
  const score = parseFloat(scoreInput.value);
  const total = parseFloat(totalInput.value);
  
  if (isNaN(score) || score < 0) {
    showError('Please enter a valid score.');
    return;
  }
  if (isNaN(total) || total <= 0) {
    showError('Please enter a valid total possible.');
    return;
  }
  if (score > total) {
    showError('Score cannot exceed total possible.');
    return;
  }
  
  stores.simple.push({ score, total });
  renderSimpleTags();
  
  scoreInput.value = '';
  totalInput.value = '';
  scoreInput.focus();
  
  showSuccess('✅ Score added!');
}

function removeSimpleScore(index) {
  stores.simple.splice(index, 1);
  renderSimpleTags();
}

function renderSimpleTags() {
  const list = getCachedElement('simpleScoreList');
  if (!list) return;
  
  if (stores.simple.length === 0) {
    list.innerHTML = '<span class="empty-tags-message">No scores added yet</span>';
    return;
  }
  
  list.innerHTML = stores.simple.map((item, index) => `
    <span class="tag-item">
      ${item.score}/${item.total} (${((item.score/item.total)*100).toFixed(1)}%)
      <button class="remove-tag" data-index="${index}" data-type="simple">✕</button>
    </span>
  `).join('');
  
  list.querySelectorAll('.remove-tag[data-type="simple"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.index);
      removeSimpleScore(idx);
    });
  });
}

function calculateSimple() {
  if (stores.simple.length === 0) {
    showError('Please add at least one score.');
    return;
  }
  
  let totalScore = 0;
  let totalPossible = 0;
  
  stores.simple.forEach(item => {
    totalScore += item.score;
    totalPossible += item.total;
  });
  
  const percentage = (totalScore / totalPossible) * 100;
  const letterGrade = getLetterGrade(percentage);
  
  showResult({
    type: 'Simple Grade',
    percentage: percentage,
    letter: letterGrade,
    details: [
      { label: 'Total Score', value: totalScore.toFixed(1) },
      { label: 'Total Possible', value: totalPossible.toFixed(1) },
      { label: 'Average', value: percentage.toFixed(1) + '%' },
      { label: 'Letter Grade', value: letterGrade }
    ]
  });
  
  saveHistory({
    type: 'Simple Grade',
    result: `${percentage.toFixed(1)}% (${letterGrade})`,
    details: `${stores.simple.length} items`
  });
}

// ============================================================
// 8. WEIGHTED GRADE CALCULATOR (FIXED)
// ============================================================

function addWeightedAssignment() {
  const nameInput = getCachedElement('weightedName');
  const scoreInput = getCachedElement('weightedScore');
  const weightInput = getCachedElement('weightedWeight');
  
  const name = nameInput.value.trim() || 'Assignment';
  const score = parseFloat(scoreInput.value);
  const weight = parseFloat(weightInput.value);
  
  if (isNaN(score) || score < 0 || score > 100) {
    showError('Please enter a valid score (0-100).');
    return;
  }
  if (isNaN(weight) || weight < 0 || weight > 100) {
    showError('Please enter a valid weight (0-100).');
    return;
  }
  
  const totalWeight = stores.weighted.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight + weight > 100) {
    showError(`Total weight would exceed 100% (currently ${totalWeight.toFixed(1)}%).`);
    return;
  }
  
  stores.weighted.push({ name, score, weight });
  renderWeightedTags();
  
  nameInput.value = '';
  scoreInput.value = '';
  weightInput.value = '';
  nameInput.focus();
  
  showSuccess('✅ Assignment added!');
}

function removeWeightedAssignment(index) {
  stores.weighted.splice(index, 1);
  renderWeightedTags();
}

function renderWeightedTags() {
  const list = getCachedElement('weightedList');
  if (!list) return;
  
  if (stores.weighted.length === 0) {
    list.innerHTML = '<span class="empty-tags-message">No assignments added</span>';
    return;
  }
  
  list.innerHTML = stores.weighted.map((item, index) => `
    <span class="tag-item">
      ${item.name}: ${item.score}% (weight ${item.weight}%)
      <button class="remove-tag" data-index="${index}" data-type="weighted">✕</button>
    </span>
  `).join('');
  
  list.querySelectorAll('.remove-tag[data-type="weighted"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.index);
      removeWeightedAssignment(idx);
    });
  });
}

function calculateWeighted() {
  if (stores.weighted.length === 0) {
    showError('Please add at least one assignment.');
    return;
  }
  
  const totalWeight = stores.weighted.reduce((sum, item) => sum + item.weight, 0);
  
  // FIX: Auto-normalization instead of strict 100% requirement
  if (totalWeight <= 0) {
    showError('Total weight cannot be 0%.');
    return;
  }
  
  let weightedSum = 0;
  stores.weighted.forEach(item => {
    const normalizedWeight = item.weight / totalWeight;
    weightedSum += item.score * normalizedWeight;
  });
  
  const percentage = weightedSum;
  const letterGrade = getLetterGrade(percentage);
  
  showResult({
    type: 'Weighted Grade',
    percentage: percentage,
    letter: letterGrade,
    details: [
      { label: 'Weighted Average', value: percentage.toFixed(1) + '%' },
      { label: 'Letter Grade', value: letterGrade },
      { label: 'Total Weight', value: totalWeight.toFixed(1) + '%' },
      { label: 'Assignments', value: stores.weighted.length.toString() }
    ]
  });
  
  saveHistory({
    type: 'Weighted Grade',
    result: `${percentage.toFixed(1)}% (${letterGrade})`,
    details: `${stores.weighted.length} assignments`
  });
}

// ============================================================
// 9. GPA CALCULATOR (FIXED)
// ============================================================

function addGPACourse() {
  const nameInput = getCachedElement('gpaCourseName');
  const gradeInput = getCachedElement('gpaGrade');
  const creditsInput = getCachedElement('gpaCredits');
  
  const name = nameInput.value.trim() || 'Course';
  const gradeStr = gradeInput.value.trim();
  const credits = parseFloat(creditsInput.value);
  
  if (!gradeStr) {
    showError('Please enter a grade (e.g., A, 85).');
    return;
  }
  if (isNaN(credits) || credits < 0.5 || credits > 6) {
    showError('Please enter valid credits (0.5-6).');
    return;
  }
  
  const parsed = parseGradeInput(gradeStr);
  if (!parsed) {
    showError('Invalid grade. Use letter (A, B+) or percentage (85).');
    return;
  }
  
  stores.gpa.push({ name, grade: gradeStr, credits, parsed });
  renderGPATags();
  
  nameInput.value = '';
  gradeInput.value = '';
  creditsInput.value = '';
  nameInput.focus();
  
  showSuccess('✅ Course added!');
}

function removeGPACourse(index) {
  stores.gpa.splice(index, 1);
  renderGPATags();
}

function renderGPATags() {
  const list = getCachedElement('gpaList');
  if (!list) return;
  
  if (stores.gpa.length === 0) {
    list.innerHTML = '<span class="empty-tags-message">No courses added</span>';
    return;
  }
  
  list.innerHTML = stores.gpa.map((item, index) => `
    <span class="tag-item">
      ${item.name}: ${item.grade} (${item.credits} credits)
      <button class="remove-tag" data-index="${index}" data-type="gpa">✕</button>
    </span>
  `).join('');
  
  list.querySelectorAll('.remove-tag[data-type="gpa"]').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.index);
      removeGPACourse(idx);
    });
  });
}

function calculateGPA() {
  if (stores.gpa.length === 0) {
    showError('Please add at least one course.');
    return;
  }
  
  const scaleSelect = getCachedElement('gpaScale');
  const scale = scaleSelect.value;
  
  let totalPoints = 0;
  let totalCredits = 0;
  let gradeDetails = [];
  
  stores.gpa.forEach(item => {
    let points = 0;
    let displayGrade = item.grade;
    
    if (item.parsed.type === 'letter') {
      points = getGPAPoints(item.parsed.value, scale);
      displayGrade = item.parsed.value;
    } else {
      const pct = item.parsed.value;
      if (scale === '100') {
        points = pct;
        displayGrade = pct + '%';
      } else if (scale === '4.0' || scale === '5.0') {
        // FIX: Use unified percentageToGPA function
        const gpaPoints = percentageToGPA(pct);
        points = scale === '5.0' ? gpaPoints * 1.25 : gpaPoints;
        displayGrade = pct + '%';
      } else if (scale === 'uk') {
        if (pct >= 70) points = 4.0;
        else if (pct >= 60) points = 3.0;
        else if (pct >= 50) points = 2.0;
        else if (pct >= 40) points = 1.0;
        else points = 0.0;
        displayGrade = pct + '%';
      }
    }
    
    totalPoints += points * item.credits;
    totalCredits += item.credits;
    gradeDetails.push(`${item.name}: ${displayGrade} (${points.toFixed(2)} pts)`);
  });
  
  const gpa = totalPoints / totalCredits;
  let scaleLabel = '';
  let gpaDisplay = '';
  
  if (scale === '100') {
    scaleLabel = '100-Point Scale';
    gpaDisplay = gpa.toFixed(1) + '%';
  } else if (scale === 'uk') {
    scaleLabel = 'UK Classification';
    let classification = '';
    if (gpa >= 3.7) classification = 'First Class (1st)';
    else if (gpa >= 3.3) classification = 'Upper Second (2:1)';
    else if (gpa >= 3.0) classification = 'Lower Second (2:2)';
    else if (gpa >= 2.0) classification = 'Third (3rd)';
    else classification = 'Fail';
    gpaDisplay = `${gpa.toFixed(3)} - ${classification}`;
  } else {
    scaleLabel = `${scale} Scale`;
    gpaDisplay = gpa.toFixed(3);
  }
  
  // FIX: Use extra field for GPA display instead of letter
  showResult({
    type: 'GPA Calculator',
    percentage: null,
    letter: null,
    extra: gpaDisplay,
    details: [
      { label: 'GPA', value: gpaDisplay },
      { label: 'Scale', value: scaleLabel },
      { label: 'Total Credits', value: totalCredits.toFixed(1) },
      { label: 'Courses', value: stores.gpa.length.toString() }
    ]
  });
  
  saveHistory({
    type: 'GPA',
    result: gpaDisplay,
    details: `${stores.gpa.length} courses on ${scaleLabel}`
  });
}

// ============================================================
// 10. FINAL EXAM CALCULATOR (FIXED)
// ============================================================

function calculateFinal() {
  const currentInput = getCachedElement('finalCurrent');
  const desiredInput = getCachedElement('finalDesired');
  const weightInput = getCachedElement('finalWeight');
  
  // FIX: Clean input validation
  if (!currentInput.value || !desiredInput.value || !weightInput.value) {
    showError('Please fill all fields.');
    return;
  }
  
  const current = parseFloat(currentInput.value);
  const desired = parseFloat(desiredInput.value);
  const weight = parseFloat(weightInput.value);
  
  if (isNaN(current) || current < 0 || current > 100) {
    showError('Please enter a valid current grade (0-100).');
    return;
  }
  if (isNaN(desired) || desired < 0 || desired > 100) {
    showError('Please enter a valid desired grade (0-100).');
    return;
  }
  if (isNaN(weight) || weight <= 0 || weight > 100) {
    showError('Please enter a valid exam weight (1-100).');
    return;
  }
  
  // FIX: Safe mathematical version with edge case handling
  const w = weight / 100;
  
  if (w >= 1) {
    showError('Final exam weight cannot be 100%.');
    return;
  }
  
  const required = (desired - current * (1 - w)) / w;
  
  // FIX: Clamp result for stability
  const safeRequired = Math.max(0, Math.min(100, required));
  
  let resultText = '';
  let status = '';
  let isImpossible = false;
  
  if (required > 100) {
    resultText = 'Impossible';
    status = '❌ Even 100% on the final won\'t reach your goal.';
    isImpossible = true;
  } else if (required < 0) {
    resultText = 'Already Achieved';
    status = '✅ You\'ve already reached your goal!';
  } else {
    resultText = safeRequired.toFixed(1) + '%';
    status = safeRequired <= 60 ? '✅ Very achievable!' : safeRequired <= 80 ? '📚 Achievable with effort.' : '⚠️ Challenging — study hard!';
  }
  
  showResult({
    type: 'Final Exam',
    percentage: isImpossible ? -1 : safeRequired,
    letter: resultText,
    details: [
      { label: 'Current Grade', value: current.toFixed(1) + '%' },
      { label: 'Desired Grade', value: desired.toFixed(1) + '%' },
      { label: 'Exam Weight', value: weight + '%' },
      { label: 'Required Score', value: resultText }
    ],
    extra: status,
    isImpossible: isImpossible
  });
  
  saveHistory({
    type: 'Final Exam',
    result: required > 100 ? 'Impossible' : required < 0 ? 'Already Achieved' : safeRequired.toFixed(1) + '%',
    details: `Need ${resultText} on final`
  });
}

// ============================================================
// 11. RESULTS DISPLAY (UPDATED)
// ============================================================

function showResult(data) {
  const resultBox = getCachedElement('gradeResultBox');
  const content = getCachedElement('gradeResultContent');
  
  if (!resultBox || !content) return;
  
  resultBox.classList.remove('hidden');
  
  let color = '#4f46e5';
  let className = '';
  
  if (data.isImpossible) {
    color = '#ef4444';
    className = 'result-impossible';
  } else if (data.percentage !== null && data.percentage !== undefined) {
    if (data.percentage >= 90) color = '#22c55e';
    else if (data.percentage >= 70) color = '#eab308';
    else if (data.percentage >= 50) color = '#f97316';
    else color = '#ef4444';
  }
  
  let detailsHtml = data.details.map(d => `
    <div class="detail-item">
      <div class="label">${d.label}</div>
      <div class="value">${d.value}</div>
    </div>
  `).join('');
  
  // FIX: Handle GPA display in extra field
  const letterDisplay = data.letter || data.percentage?.toFixed(1) + '%' || '—';
  
  content.innerHTML = `
    ${data.letter !== null ? `<div class="result-grade ${className}" style="color: ${color};">${letterDisplay}</div>` : ''}
    <div class="result-letter">${data.type}</div>
    ${data.extra ? `<div class="result-extra" style="font-size: 1.2rem; font-weight: 600; color: var(--primary); margin: 0.5rem 0;">${data.extra}</div>` : ''}
    <div class="result-details">${detailsHtml}</div>
  `;
  
  setTimeout(() => {
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ============================================================
// 12. HISTORY MANAGEMENT (FIXED)
// ============================================================

function getHistory() {
  try {
    const data = localStorage.getItem('gradeHistory');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveHistory(entry) {
  const history = getHistory();
  history.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...entry
  });
  if (history.length > 50) history.length = 50;
  localStorage.setItem('gradeHistory', JSON.stringify(history));
  renderHistory();
}

function clearHistory() {
  if (!confirm('Are you sure you want to clear all history?')) return;
  localStorage.removeItem('gradeHistory');
  renderHistory();
  showSuccess('History cleared!');
}

function deleteHistoryItem(id) {
  const history = getHistory();
  // FIX: Use loose comparison for safety
  const filtered = history.filter(item => item.id != id);
  localStorage.setItem('gradeHistory', JSON.stringify(filtered));
  renderHistory();
}

function toggleHistory() {
  historyVisible = !historyVisible;
  const section = getCachedElement('historySection');
  const toggleBtn = getCachedElement('historyToggleBtn');
  
  if (!section) return;
  
  if (historyVisible) {
    section.classList.remove('hidden');
    renderHistory();
    if (toggleBtn) toggleBtn.textContent = 'Hide History';
    setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else {
    section.classList.add('hidden');
    if (toggleBtn) toggleBtn.textContent = 'Show History';
  }
}

function renderHistory() {
  const list = getCachedElement('historyList');
  if (!list) return;
  
  const history = getHistory();
  
  if (history.length === 0) {
    list.innerHTML = '<p class="empty-history">No grade history yet.</p>';
    return;
  }
  
  list.innerHTML = history.map(item => `
    <div class="history-item">
      <div class="history-item-info">
        <span class="history-item-type">${item.type}</span>
        <span class="history-item-result">${item.result}</span>
        <span class="history-item-time">${item.details || ''}</span>
        <span class="history-item-time">${formatDate(new Date(item.timestamp))}</span>
      </div>
      <div>
        <button class="history-btn danger" data-id="${item.id}">✕</button>
      </div>
    </div>
  `).join('');
  
  list.querySelectorAll('.history-btn.danger').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.dataset.id);
      deleteHistoryItem(id);
    });
  });
}

// ============================================================
// 14. TOOL INITIALIZATION
// ============================================================

function initLocalToolLogic() {
  // Tab switching
  document.querySelectorAll('.grade-tab').forEach(btn => {
    btn.addEventListener('click', function() {
      switchTab(this.dataset.tab);
    });
  });
  
  // Simple Grade
  const simpleAddBtn = getCachedElement('simpleAddBtn');
  const simpleCalcBtn = getCachedElement('simpleCalculateBtn');
  if (simpleAddBtn) simpleAddBtn.addEventListener('click', addSimpleScore);
  if (simpleCalcBtn) simpleCalcBtn.addEventListener('click', calculateSimple);
  
  // Weighted Grade
  const weightedAddBtn = getCachedElement('weightedAddBtn');
  const weightedCalcBtn = getCachedElement('weightedCalculateBtn');
  if (weightedAddBtn) weightedAddBtn.addEventListener('click', addWeightedAssignment);
  if (weightedCalcBtn) weightedCalcBtn.addEventListener('click', calculateWeighted);
  
  // GPA
  const gpaAddBtn = getCachedElement('gpaAddBtn');
  const gpaCalcBtn = getCachedElement('gpaCalculateBtn');
  if (gpaAddBtn) gpaAddBtn.addEventListener('click', addGPACourse);
  if (gpaCalcBtn) gpaCalcBtn.addEventListener('click', calculateGPA);
  
  // Final Exam
  const finalCalcBtn = getCachedElement('finalCalculateBtn');
  if (finalCalcBtn) finalCalcBtn.addEventListener('click', calculateFinal);
  
  // History Toggle
  const historyToggleBtn = getCachedElement('historyToggleBtn');
  if (historyToggleBtn) historyToggleBtn.addEventListener('click', toggleHistory);
  
  // Clear History
  const clearHistoryBtn = getCachedElement('clearHistoryBtn');
  if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);
  
  // Enter key support
  document.querySelectorAll('.data-input-field').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const parent = input.closest('.grade-tab-content');
        if (!parent) return;
        
        const id = parent.id;
        let btn = null;
        if (id === 'tab-simple') btn = getCachedElement('simpleCalculateBtn');
        else if (id === 'tab-weighted') btn = getCachedElement('weightedCalculateBtn');
        else if (id === 'tab-gpa') btn = getCachedElement('gpaCalculateBtn');
        else if (id === 'tab-final') btn = getCachedElement('finalCalculateBtn');
        
        if (btn) btn.click();
      }
    });
  });
  
  // Initialize
  renderSimpleTags();
  renderWeightedTags();
  renderGPATags();
  
  const historySection = getCachedElement('historySection');
  if (historySection) historySection.classList.add('hidden');
  
  console.log('[Grade Calculator] ✅ Initialized successfully!');
}

/// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // The root app.js automatically handles:
  // - Tool icon & category setup
  // - Related tools rendering (using JSON data)
  // - Search hijacking
  // - Year in footer
  
  // We just need to initialize our tool's specific logic
  initLocalToolLogic();
});



















