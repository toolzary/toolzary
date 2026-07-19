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
  initLocalToolLogic();
});

/**
 * Calculates precise age in years, months, and days from birthdate
 * Works with all years including those below 100
 */
function calculateAge(birthDate) {
  const today = new Date();
  
  // Get years directly (works for any year including <100)
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();
  
  // Adjust days
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  // Adjust months
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
}

/**
 * Main tool logic initialization with birthday countdown
 */
function initLocalToolLogic() {
  const calcBtn = document.getElementById('calculateBtn');
  const birthInput = document.getElementById('birthdateInput');
  
  const resultBox = document.getElementById('ageResultBox');
  const countdownBox = document.getElementById('birthdayCountdownBox');
  const errorBox = document.getElementById('toolLocalError');
  
  const resYears = document.getElementById('resYears');
  const resMonths = document.getElementById('resMonths');
  const resDays = document.getElementById('resDays');
  
  // Countdown elements
  const countdownDays = document.getElementById('countdownDays');
  const countdownHours = document.getElementById('countdownHours');
  const countdownMinutes = document.getElementById('countdownMinutes');
  const countdownSeconds = document.getElementById('countdownSeconds');
  const birthdayMessageText = document.getElementById('birthdayMessageText');

  let countdownInterval = null;

  if (!calcBtn || !birthInput) return;

  // Function to stop existing countdown
  function stopCountdown() {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  }

  // Function to update birthday countdown in real-time
  function updateBirthdayCountdown(birthYear, birthMonth, birthDay) {
    const now = new Date();
    
    // Create next birthday date
    let nextBirthday = new Date(now.getFullYear(), birthMonth, birthDay);
    
    // If birthday already passed this year, use next year
    if (nextBirthday < now) {
      nextBirthday = new Date(now.getFullYear() + 1, birthMonth, birthDay);
    }
    
    // Calculate time difference in milliseconds
    const timeDiff = nextBirthday.getTime() - now.getTime();
    
    // Calculate days, hours, minutes, seconds
    const totalSeconds = Math.floor(timeDiff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // Update display
    if (countdownDays) countdownDays.textContent = days;
    if (countdownHours) countdownHours.textContent = hours;
    if (countdownMinutes) countdownMinutes.textContent = minutes;
    if (countdownSeconds) countdownSeconds.textContent = seconds;
    
    // Calculate age user will turn
    const turningAge = nextBirthday.getFullYear() - birthYear;
    
    // Get weekday names
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdayName = weekdays[nextBirthday.getDay()];
    
    // Format date for message
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDate = `${monthNames[birthMonth]} ${birthDay}`;
    
    // Update message
    if (birthdayMessageText) {
      if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        birthdayMessageText.innerHTML = 'HAPPY BIRTHDAY! Today is your special day!';
      } else {
        birthdayMessageText.innerHTML = `Your next birthday (${formattedDate}) is on ${weekdayName}. You will turn <strong>${turningAge} years old</strong>.`;
      }
    }
  }

  // Function to start countdown timer
  function startBirthdayCountdown(birthYear, birthMonth, birthDay) {
    stopCountdown();
    
    // Update immediately
    updateBirthdayCountdown(birthYear, birthMonth, birthDay);
    
    // Update every second
    countdownInterval = setInterval(() => {
      updateBirthdayCountdown(birthYear, birthMonth, birthDay);
    }, 1000);
  }

  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Stop any existing countdown
    stopCountdown();
    
    // Clear display structures completely before calculation
    if (resultBox) resultBox.classList.add('hidden');
    if (countdownBox) countdownBox.classList.add('hidden');
    if (errorBox) errorBox.classList.add('hidden');

    if (!birthInput.value) {
      if (errorBox) {
        errorBox.textContent = "Please pick a valid calendar birthdate input setting.";
        errorBox.classList.remove('hidden');
      }
      return;
    }

    // Parse the date from input
    const parts = birthInput.value.split('-');
    const birthYear = parseInt(parts[0], 10);
    const birthMonth = parseInt(parts[1], 10) - 1;
    const birthDay = parseInt(parts[2], 10);
    
    // Validate date
    if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) {
      if (errorBox) {
        errorBox.textContent = "Please enter a valid date.";
        errorBox.classList.remove('hidden');
      }
      return;
    }
    
    // Create birth date object
    const birthDate = new Date(0, 0, 0);
    birthDate.setFullYear(birthYear, birthMonth, birthDay);
    birthDate.setHours(12, 0, 0, 0);
    
    // Get current date
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    
    // Check if birthdate is in the future
    if (birthDate > today) {
      if (errorBox) {
        errorBox.textContent = "Birthdate cannot be in the future.";
        errorBox.classList.remove('hidden');
      }
      return;
    }
    
    // Calculate age
    const age = calculateAge(birthDate);
    
    // Display age results
    if (resYears) resYears.textContent = age.years;
    if (resMonths) resMonths.textContent = age.months;
    if (resDays) resDays.textContent = age.days;
    
    // Show age result box
    if (resultBox) {
      resultBox.classList.remove('hidden');
    }
    
    // Start birthday countdown with real-time updates
    startBirthdayCountdown(birthYear, birthMonth, birthDay);
    
    // Show birthday countdown box
    if (countdownBox) {
      countdownBox.classList.remove('hidden');
    }
    
    // Smooth scroll to results
    setTimeout(() => {
      const targetOffset = resultBox.getBoundingClientRect().top + window.pageYOffset - 120;
      window.scrollTo({
        top: targetOffset,
        behavior: 'smooth'
      });
    }, 100);
  });
  
  // Allow Enter key to trigger calculation
  if (birthInput) {
    birthInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        calcBtn.click();
      }
    });
  }
}




















