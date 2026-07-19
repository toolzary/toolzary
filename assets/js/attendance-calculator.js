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
  initAttendanceLogic();
});

/**
 * Main Attendance Tool Logic
 */
function initAttendanceLogic() {
  const calcBtn = document.getElementById('calculateBtn');
  
  const totalClasses = document.getElementById('totalClasses');
  const attendedClasses = document.getElementById('attendedClasses');
  const targetPercentage = document.getElementById('targetPercentage');
  
  const resultBox = document.getElementById('attendanceResultBox');
  const errorBox = document.getElementById('toolLocalError');
  
  const attendancePercentage = document.getElementById('attendancePercentage');
  const attendanceStatus = document.getElementById('attendanceStatus');
  const classesNeeded = document.getElementById('classesNeeded');
  const maxAbsences = document.getElementById('maxAbsences');
  const attendanceMessage = document.getElementById('attendanceMessage');
  const progressBar = document.getElementById('attendanceProgressBar');

  if (!calcBtn) return;

  /**
   * Calculate Attendance
   */
  function calculateAttendance() {
    const total = parseInt(totalClasses.value);
    const attended = parseInt(attendedClasses.value);
    const target = parseInt(targetPercentage.value) || 75;

    // Validate inputs
    if (!total || total <= 0) {
      showError('Please enter a valid total number of classes (greater than 0).');
      return;
    }

    if (isNaN(attended) || attended < 0) {
      showError('Please enter a valid number of classes attended (0 or more).');
      return;
    }

    if (attended > total) {
      showError('Classes attended cannot be more than total classes held.');
      return;
    }

    if (target < 0 || target > 100) {
      showError('Target percentage must be between 0 and 100.');
      return;
    }

    hideError();

    // Calculate percentage
    const percentage = (attended / total) * 100;
    const roundedPercentage = Math.round(percentage * 10) / 10;
    const displayPercentage = percentage.toFixed(1);

    // Calculate classes needed to reach target
    let neededClasses = 0;
    let maxAllowedAbsences = 0;

    if (percentage < target) {
      // How many more classes to attend consecutively
      neededClasses = Math.ceil((target * (total + neededClasses) / 100) - attended);
      // Recalculate with the new total
      let tempNeeded = 0;
      let tempAttended = attended;
      let tempTotal = total;
      
      while ((tempAttended / tempTotal) * 100 < target) {
        tempNeeded++;
        tempAttended = attended + tempNeeded;
        tempTotal = total + tempNeeded;
      }
      neededClasses = tempNeeded;
    }

    // Calculate max absences allowed
    maxAllowedAbsences = Math.floor(total - (target * total / 100));

    // Get status and message
    const statusData = getStatus(percentage, target);

    // Display results
    if (attendancePercentage) {
      attendancePercentage.textContent = displayPercentage + '%';
      attendancePercentage.className = `metric-display-val ${statusData.colorClass}`;
    }

    if (attendanceStatus) {
      attendanceStatus.textContent = statusData.status;
      attendanceStatus.className = `metric-display-val ${statusData.colorClass}`;
    }

    if (classesNeeded) {
      if (percentage >= target) {
        classesNeeded.textContent = '✅ Achieved';
        classesNeeded.className = 'metric-display-val status-excellent';
      } else {
        classesNeeded.textContent = neededClasses;
        classesNeeded.className = `metric-display-val ${statusData.colorClass}`;
      }
    }

    if (maxAbsences) {
      const absencesTaken = total - attended;
      const absencesLeft = maxAllowedAbsences - absencesTaken;
      maxAbsences.textContent = maxAllowedAbsences > 0 ? maxAllowedAbsences : '0';
      maxAbsences.className = `metric-display-val ${statusData.colorClass}`;
    }

    // Update progress bar
    if (progressBar) {
      const progressWidth = Math.min(percentage, 100);
      progressBar.style.width = progressWidth + '%';
      progressBar.className = `attendance-progress-bar ${statusData.progressClass}`;
    }

    // Show message
    if (attendanceMessage) {
      let messageText = '';
      if (percentage >= 90) {
        messageText = `🌟 Excellent! Your attendance is ${displayPercentage}%! Keep up the great work!`;
        attendanceMessage.className = 'attendance-message success';
      } else if (percentage >= 75) {
        messageText = `✅ Good job! Your attendance is ${displayPercentage}%. You're meeting the target!`;
        attendanceMessage.className = 'attendance-message success';
      } else if (percentage >= 60) {
        messageText = `⚠️ Your attendance is ${displayPercentage}%. You need to attend ${neededClasses} more class${neededClasses > 1 ? 'es' : ''} to reach ${target}%.`;
        attendanceMessage.className = 'attendance-message warning';
      } else {
        messageText = `🔴 Your attendance is ${displayPercentage}%. Please attend ${neededClasses} more class${neededClasses > 1 ? 'es' : ''} to reach ${target}%.`;
        attendanceMessage.className = 'attendance-message danger';
      }
      
      if (percentage >= target) {
        attendanceMessage.className = 'attendance-message info';
        const absencesTaken = total - attended;
        const absencesLeft = maxAllowedAbsences - absencesTaken;
        if (absencesLeft > 0) {
          messageText += ` You can still miss ${absencesLeft} more class${absencesLeft > 1 ? 'es' : ''} while maintaining your target.`;
        }
      }
      
      attendanceMessage.textContent = messageText;
    }

    // Show result box
    if (resultBox) {
      resultBox.classList.remove('hidden');
      
      // Smooth scroll
      setTimeout(() => {
        const targetOffset = resultBox.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });
      }, 150);
    }
  }

  /**
   * Get Status Based on Percentage
   */
  function getStatus(percentage, target) {
    if (percentage >= 90) {
      return {
        status: 'Excellent',
        colorClass: 'status-excellent',
        progressClass: 'excellent'
      };
    } else if (percentage >= 75) {
      return {
        status: 'Good',
        colorClass: 'status-good',
        progressClass: 'good'
      };
    } else if (percentage >= 60) {
      return {
        status: 'Average',
        colorClass: 'status-average',
        progressClass: 'average'
      };
    } else {
      return {
        status: 'Low',
        colorClass: 'status-low',
        progressClass: 'low'
      };
    }
  }

  /**
   * Show Error
   */
  function showError(message) {
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.classList.remove('hidden');
    }
    if (resultBox) {
      resultBox.classList.add('hidden');
    }
  }

  /**
   * Hide Error
   */
  function hideError() {
    if (errorBox) {
      errorBox.classList.add('hidden');
    }
  }

  // Event Listeners
  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();
    calculateAttendance();
  });

  // Enter key support
  [totalClasses, attendedClasses, targetPercentage].forEach(input => {
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          calcBtn.click();
        }
      });
    }
  });
}




















