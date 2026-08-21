document.addEventListener("DOMContentLoaded", function () {

    const app = document.getElementById("tool-app");

    if (!app) {
        return;
    }


    /*
    ============================================
    CREATE TOOL INTERFACE
    ============================================
    */

    app.innerHTML = `

        <div class="tool-custom-interface">

          <!-- Exam Name -->
          <div class="form-group">
            <label for="examName" class="input-label">Exam Name</label>
            <input type="text" id="examName" class="data-input-field" placeholder="e.g., Final Exam, Math Test, SAT" value="Final Exam">
          </div>

          <!-- Exam Date -->
          <div class="form-group">
            <label for="examDate" class="input-label">Exam Date & Time</label>
            <input type="datetime-local" id="examDate" class="data-input-field">
          </div>

          <!-- Exam Color -->
          <div class="form-group">
            <label class="input-label">Countdown Color</label>
            <div class="color-options">
              <button class="color-btn active" data-color="#4f46e5" style="background:#4f46e5;"></button>
              <button class="color-btn" data-color="#ef4444" style="background:#ef4444;"></button>
              <button class="color-btn" data-color="#22c55e" style="background:#22c55e;"></button>
              <button class="color-btn" data-color="#f59e0b" style="background:#f59e0b;"></button>
              <button class="color-btn" data-color="#8b5cf6" style="background:#8b5cf6;"></button>
              <button class="color-btn" data-color="#ec4899" style="background:#ec4899;"></button>
              <button class="color-btn" data-color="#14b8a6" style="background:#14b8a6;"></button>
              <button class="color-btn" data-color="#f97316" style="background:#f97316;"></button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-button-group">
            <button id="startBtn" class="third-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-right:6px;vertical-align:middle;">
                <polyline points="5 3 19 12 5 21 5 3"/>
              </svg>
              Start Countdown
            </button>
            <button id="stopBtn" class="first-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-right:6px;vertical-align:middle;">
                <rect x="6" y="6" width="12" height="12"/>
              </svg>
              Stop
            </button>
            <button id="clearBtn" class="first-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;margin-right:6px;vertical-align:middle;">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear
            </button>
            </div>

          <!-- Countdown Display -->
          <div id="countdownDisplay" class="countdown-box hidden">
            <div class="countdown-header">
              <h3 id="displayExamName" class="countdown-exam-name">Final Exam</h3>
              <span id="displayExamDate" class="countdown-exam-date">December 15, 2024</span>
            </div>
            <div class="countdown-grid" id="countdownGrid">
              <div class="countdown-block">
                <div class="countdown-number" id="countdownDays">0</div>
                <div class="countdown-label">Days</div>
              </div>
              <div class="countdown-block">
                <div class="countdown-number" id="countdownHours">0</div>
                <div class="countdown-label">Hours</div>
              </div>
              <div class="countdown-block">
                <div class="countdown-number" id="countdownMinutes">0</div>
                <div class="countdown-label">Minutes</div>
              </div>
              <div class="countdown-block">
                <div class="countdown-number" id="countdownSeconds">0</div>
                <div class="countdown-label">Seconds</div>
              </div>
            </div>
            <div class="countdown-status" id="countdownStatus">â³ Time Remaining</div>
          </div>

          <!-- Error Box -->
          <div id="toolLocalError" class="local-error-alert hidden"></div>
        </div>


    `;



    /*
    ============================================
    TOOL LOGIC
    ============================================
    */


    initTool();
    runSelfTest();



});

// ============================================================
// EXAM COUNTDOWN TOOL
// WITHOUT HISTORY SYSTEM
// ============================================================


// ============================================================
// 1. CORE VARIABLES
// ============================================================

let countdownInterval = null;
let currentColor = '#4f46e5';
let isRunning = false;
let elementCache = {};


// ============================================================
// 2. ELEMENT CACHE
// ============================================================

function getCachedElement(id) {

  if (!elementCache[id]) {
    elementCache[id] = document.getElementById(id);
  }

  return elementCache[id];
}


// ============================================================
// 3. ALERT FUNCTIONS
// ============================================================

function showError(message) {

  const errorBox = getCachedElement('toolLocalError');

  if (!errorBox) return;

  errorBox.textContent = message;
  errorBox.classList.remove('hidden');

  errorBox.style.background = '';
  errorBox.style.color = '';
  errorBox.style.borderColor = '';

  setTimeout(() => {
    errorBox.classList.add('hidden');
  }, 4000);
}



function showSuccess(message) {

  const errorBox = getCachedElement('toolLocalError');

  if (!errorBox) return;


  errorBox.textContent = message;

  errorBox.classList.remove('hidden');

  errorBox.style.background = 'rgba(34,197,94,.1)';
  errorBox.style.color = '#22c55e';
  errorBox.style.borderColor = 'rgba(34,197,94,.2)';


  setTimeout(() => {

    errorBox.classList.add('hidden');

    errorBox.style.background = '';
    errorBox.style.color = '';
    errorBox.style.borderColor = '';

  },2000);

}



// ============================================================
// 4. DATE FORMAT
// ============================================================

function formatDate(date){

  return date.toLocaleDateString('en-US',{
    weekday:'long',
    year:'numeric',
    month:'long',
    day:'numeric',
    hour:'2-digit',
    minute:'2-digit'
  });

}



// ============================================================
// 5. START COUNTDOWN
// ============================================================

function startCountdown(){


  const examNameInput = getCachedElement('examName');
  const examDateInput = getCachedElement('examDate');


  const examName =
  examNameInput.value.trim() || 'Exam';


  if(!examDateInput.value){

    showError('Please select an exam date and time.');
    return;

  }



  const examDate = new Date(examDateInput.value);



  if(isNaN(examDate.getTime())){

    showError('Please enter a valid date.');
    return;

  }



  const now = new Date();


  if(examDate < now){

    showError(
      'Exam date cannot be in the past.'
    );

    return;

  }



  stopCountdown(false);



  const countdownBox =
  getCachedElement('countdownDisplay');


  if(countdownBox){

    countdownBox.classList.remove('hidden');

  }



  const displayName =
  getCachedElement('displayExamName');


  const displayDate =
  getCachedElement('displayExamDate');



  if(displayName){

    displayName.textContent = examName;

  }



  if(displayDate){

    displayDate.textContent =
    formatDate(examDate);

  }



  applyColor(currentColor);



  isRunning = true;


  updateCountdown(
    examName,
    examDate
  );



  setTimeout(()=>{

    countdownBox?.scrollIntoView({

      behavior:'smooth',
      block:'start'

    });


  },150);



  showSuccess(
    `⏳ Countdown started for "${examName}"`
  );


}



// ============================================================
// 6. UPDATE COUNTDOWN
// ============================================================


function updateCountdown(name,targetDate){


  if(countdownInterval){

    clearInterval(countdownInterval);

  }



  function tick(){


    const now = new Date();


    const diff =
    targetDate.getTime() -
    now.getTime();



    const daysEl =
    getCachedElement('countdownDays');


    const hoursEl =
    getCachedElement('countdownHours');


    const minutesEl =
    getCachedElement('countdownMinutes');


    const secondsEl =
    getCachedElement('countdownSeconds');


    const statusEl =
    getCachedElement('countdownStatus');




    if(diff <= 0){


      daysEl.textContent='0';
      hoursEl.textContent='0';
      minutesEl.textContent='0';
      secondsEl.textContent='0';



      if(statusEl){

        statusEl.textContent =
        '🎉 Exam Day! Good luck!';


        statusEl.className =
        'countdown-status done';

      }



      clearInterval(countdownInterval);

      countdownInterval=null;

      isRunning=false;


      return;

    }




    const days =
    Math.floor(
      diff/(1000*60*60*24)
    );


    const hours =
    Math.floor(
      (diff%(1000*60*60*24))/
      (1000*60*60)
    );


    const minutes =
    Math.floor(
      (diff%(1000*60*60))/
      (1000*60)
    );


    const seconds =
    Math.floor(
      (diff%(1000*60))/
      1000
    );



    daysEl.textContent=days;
    hoursEl.textContent=hours;
    minutesEl.textContent=minutes;
    secondsEl.textContent=seconds;



    if(statusEl){


      if(days < 3){

        statusEl.textContent =
        '⚠️ Exam is approaching! Stay focused!';


        statusEl.className =
        'countdown-status urgent';


      }

      else if(days < 7){


        statusEl.textContent =
        '📚 One week to go! Keep studying!';


        statusEl.className =
        'countdown-status';


      }

      else{


        statusEl.textContent =
        '⏳ Time Remaining';


        statusEl.className =
        'countdown-status';

      }


    }




    [
      daysEl,
      hoursEl,
      minutesEl,
      secondsEl

    ].forEach(el=>{


      if(days < 3){

        el.classList.add('danger');

      }

      else{

        el.classList.remove('danger');

      }


    });



  }



  tick();


  countdownInterval =
  setInterval(tick,1000);


}

// ============================================================
// 7. STOP COUNTDOWN
// ============================================================

function stopCountdown(showMessage = true){


  if(countdownInterval){

    clearInterval(countdownInterval);

    countdownInterval = null;

  }


  isRunning = false;


  if(showMessage){

    showSuccess('⏹️ Countdown stopped.');

  }


}



// ============================================================
// 8. CLEAR COUNTDOWN
// ============================================================

function clearCountdown(){


  stopCountdown(false);



  const countdownBox =
  getCachedElement('countdownDisplay');


  if(countdownBox){

    countdownBox.classList.add('hidden');

  }



  const values = [

    'countdownDays',
    'countdownHours',
    'countdownMinutes',
    'countdownSeconds'

  ];



  values.forEach(id=>{

    const el =
    getCachedElement(id);

    if(el){

      el.textContent='0';

    }

  });



  const status =
  getCachedElement('countdownStatus');



  if(status){

    status.textContent =
    '⏳ Time Remaining';


    status.className =
    'countdown-status';

  }



  showSuccess('🧹 Countdown cleared.');

}



// ============================================================
// 9. APPLY COUNTDOWN COLOR
// ============================================================

function applyColor(color){


  currentColor=color;


  document
  .querySelectorAll('.countdown-number')
  .forEach(el=>{

    el.style.color=color;

  });



  const title =
  getCachedElement('displayExamName');


  if(title){

    title.style.color=color;

  }


}



// ============================================================
// 10. TOOL INITIALIZATION
// ============================================================

function initTool(){



  const startBtn =
  getCachedElement('startBtn');


  const stopBtn =
  getCachedElement('stopBtn');


  const clearBtn =
  getCachedElement('clearBtn');


  const colorBtns =
  document.querySelectorAll('.color-btn');


  const examDateInput =
  getCachedElement('examDate');




  // Default date = 7 days later

  if(examDateInput){


    const defaultDate =
    new Date();


    defaultDate.setDate(
      defaultDate.getDate()+7
    );


    examDateInput.value =
    defaultDate
    .toISOString()
    .slice(0,16);



    const now =
    new Date()
    .toISOString()
    .slice(0,16);



    examDateInput.setAttribute(
      'min',
      now
    );

  }





  // Color selection

  colorBtns.forEach(btn=>{


    btn.addEventListener(
      'click',
      ()=>{


        colorBtns.forEach(b=>{

          b.classList.remove('active');

        });



        btn.classList.add('active');



        currentColor =
        btn.dataset.color;



        if(isRunning){

          applyColor(currentColor);

        }


      }

    );


  });





  // Start

  if(startBtn){

    startBtn.addEventListener(
      'click',
      startCountdown
    );

  }





  // Stop

  if(stopBtn){

    stopBtn.addEventListener(
      'click',
      ()=>stopCountdown(true)
    );

  }





  // Clear

  if(clearBtn){

    clearBtn.addEventListener(
      'click',
      clearCountdown
    );

  }





  // Enter key support

  document
  .querySelectorAll('.data-input-field')
  .forEach(input=>{


    input.addEventListener(
      'keypress',
      e=>{


        if(e.key==='Enter'){

          e.preventDefault();

          startCountdown();

        }


      }

    );


  });




  console.log(
    '[Exam Countdown] ✅ Initialized successfully'
  );


}



// ============================================================
// 11. SELF TEST
// ============================================================

function runSelfTest(){


  let passed=true;



  const testDate =
  new Date(2024,11,25);



  const formatted =
  formatDate(testDate);



  if(!formatted.includes('December')){


    console.error(
      '[Self-Test] Date formatting failed'
    );


    passed=false;

  }




  if(passed){


    console.log(
      '[Exam Countdown] ✅ Self-test passed'
    );


  }
  else{


    console.warn(
      '[Exam Countdown] ⚠️ Self-test failed'
    );


  }



  return passed;


}