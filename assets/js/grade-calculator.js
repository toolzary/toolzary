/**
 * Grade Calculator - Fixed Complete Implementation
 * Compatible with existing HTML/CSS
 */

// ============================================================
// CORE VARIABLES
// ============================================================

let currentTab = 'simple';
let elementCache = {};
let messageTimer = null;

// Data stores
const stores = {
  simple: [],
  weighted: [],
  gpa: []
};


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getCachedElement(id) {
  if (!elementCache[id]) {
    elementCache[id] = document.getElementById(id);
  }

  return elementCache[id];
}


function showMessage(message, type = 'error', duration = 4000) {

  const box = getCachedElement('toolLocalError');

  if (!box) return;


  if (messageTimer) {
    clearTimeout(messageTimer);
  }


  box.textContent = message;
  box.className =
    type === 'success'
      ? 'local-error-alert success'
      : 'local-error-alert';

  box.classList.remove('hidden');


  messageTimer = setTimeout(() => {
    box.classList.add('hidden');
  }, duration);
}


function showError(message) {
  showMessage(message, 'error', 4000);
}


function showSuccess(message) {
  showMessage(message, 'success', 3000);
}

function escapeHTML(value){

  return String(value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');

}

// ============================================================
// GRADE FUNCTIONS
// ============================================================

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



// ============================================================
// GPA CONVERSION
// ============================================================

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

  return 0;
}



function percentageToFiveGPA(pct) {

  if (pct >= 93) return 5.0;
  if (pct >= 90) return 4.7;
  if (pct >= 87) return 4.3;

  if (pct >= 83) return 4.0;
  if (pct >= 80) return 3.7;
  if (pct >= 77) return 3.3;

  if (pct >= 73) return 3.0;
  if (pct >= 70) return 2.7;
  if (pct >= 67) return 2.3;

  if (pct >= 65) return 2.0;

  return 0;
}



function getGPAPoints(grade, scale) {

  const fourScale = {

    'A+':4.0,
    'A':4.0,
    'A-':3.7,

    'B+':3.3,
    'B':3.0,
    'B-':2.7,

    'C+':2.3,
    'C':2.0,
    'C-':1.7,

    'D+':1.3,
    'D':1.0,
    'D-':0.7,

    'F':0
  };


  const fiveScale = {

    'A+':5.0,
    'A':5.0,
    'A-':4.7,

    'B+':4.3,
    'B':4.0,
    'B-':3.7,

    'C+':3.3,
    'C':3.0,
    'C-':2.7,

    'D+':2.3,
    'D':2.0,
    'D-':1.7,

    'F':0
  };


  if (scale === '5.0') {
    return fiveScale[grade] ?? 0;
  }


  return fourScale[grade] ?? 0;
}




function parseGradeInput(input) {

  const value = input.trim().toUpperCase();


  const letters =
    /^(A\+|A|A-|B\+|B|B-|C\+|C|C-|D\+|D|D-|F)$/;


  if (letters.test(value)) {

    return {
      type:'letter',
      value:value
    };

  }



  const number = Number(value);


  if (!isNaN(number) && number >= 0 && number <= 100) {

    return {
      type:'percent',
      value:number
    };

  }


  return null;
}




// ============================================================
// TAB MANAGEMENT
// ============================================================

function switchTab(tabId) {

  currentTab = tabId;


  document
    .querySelectorAll('.grade-tab')
    .forEach(btn => {

      btn.classList.toggle(
        'active',
        btn.dataset.tab === tabId
      );

    });



  document
    .querySelectorAll('.grade-tab-content')
    .forEach(content => {

      content.classList.toggle(
        'active',
        content.id === 'tab-' + tabId
      );

    });



  const result =
    getCachedElement('gradeResultBox');


  if (result) {
    result.classList.add('hidden');
  }

}



// ============================================================
// SIMPLE GRADE CALCULATOR
// ============================================================


function addSimpleScore() {

  const scoreInput =
    getCachedElement('simpleScore');

  const totalInput =
    getCachedElement('simpleTotal');


  const score =
    Number(scoreInput.value);


  const total =
    Number(totalInput.value);



  if (!Number.isFinite(score) || score < 0) {
    showError('Please enter a valid score.');
    return;
  }



  if (!Number.isFinite(total) || total <= 0) {
    showError('Please enter a valid total possible.');
    return;
  }



  if (score > total) {
    showError('Score cannot exceed total possible.');
    return;
  }



  stores.simple.push({
    score,
    total
  });


  renderSimpleTags();


  scoreInput.value='';
  totalInput.value='';


  scoreInput.focus();


  showSuccess('✅ Score added!');
}



function removeSimpleScore(index){

  stores.simple.splice(index,1);

  renderSimpleTags();

}



function renderSimpleTags(){

  const list =
    getCachedElement('simpleScoreList');


  if (!list) return;



  if (!stores.simple.length){

    list.innerHTML =
      '<span class="empty-tags-message">No scores added yet</span>';

    return;
  }



  list.innerHTML =
    stores.simple.map((item,index)=>`

      <span class="tag-item">

      ${item.score}/${item.total}
      (${((item.score/item.total)*100).toFixed(1)}%)

      <button
      class="remove-tag"
      data-index="${index}"
      data-type="simple">
      ✕
      </button>

      </span>

    `).join('');

}



function calculateSimple(){

  if (!stores.simple.length){

    showError('Please add at least one score.');

    return;
  }



  let score=0;
  let total=0;


  stores.simple.forEach(item=>{

    score += item.score;
    total += item.total;

  });



  const percentage =
    (score / total) * 100;



  showResult({

    type:'Simple Grade',

    percentage,

    letter:getLetterGrade(percentage),

    details:[

      {
        label:'Total Score',
        value:score.toFixed(1)
      },

      {
        label:'Total Possible',
        value:total.toFixed(1)
      },

      {
        label:'Average',
        value:percentage.toFixed(1)+'%'
      },

      {
        label:'Letter Grade',
        value:getLetterGrade(percentage)
      }

    ]

  });

}// ============================================================
// WEIGHTED GRADE CALCULATOR
// ============================================================


function addWeightedAssignment(){

  const nameInput =
    getCachedElement('weightedName');

  const scoreInput =
    getCachedElement('weightedScore');

  const weightInput =
    getCachedElement('weightedWeight');



  const name =
    nameInput.value.trim() || 'Assignment';


  const score =
    Number(scoreInput.value);


  const weight =
    Number(weightInput.value);



  if (!Number.isFinite(score) || score < 0 || score > 100){

    showError('Please enter a valid score (0-100).');

    return;
  }



  if (!Number.isFinite(weight) || weight <= 0 || weight > 100){

    showError('Please enter a valid weight (1-100).');

    return;
  }



  const currentWeight =
    stores.weighted.reduce(
      (sum,item)=>sum + item.weight,
      0
    );

  
  stores.weighted.push({

    name,
    score,
    weight

  });



  renderWeightedTags();



  nameInput.value='';
  scoreInput.value='';
  weightInput.value='';



  nameInput.focus();



  showSuccess('✅ Assignment added!');

}




function removeWeightedAssignment(index){

  stores.weighted.splice(index,1);

  renderWeightedTags();

}





function renderWeightedTags(){

  const list =
    getCachedElement('weightedList');


  if (!list) return;



  if (!stores.weighted.length){

    list.innerHTML =
      '<span class="empty-tags-message">No assignments added</span>';

    return;
  }




  list.innerHTML =
    stores.weighted.map((item,index)=>`

      <span class="tag-item">

      ${escapeHTML(item.name)}:
      ${item.score}%
      (weight ${item.weight}%)

      <button
      class="remove-tag"
      data-index="${index}"
      data-type="weighted">

      ✕

      </button>

      </span>

    `).join('');

}





function calculateWeighted(){

  if (!stores.weighted.length){

    showError('Please add at least one assignment.');

    return;
  }



  const totalWeight =
    stores.weighted.reduce(
      (sum,item)=>sum + item.weight,
      0
    );



  if (totalWeight <= 0){

    showError('Total weight must be greater than zero.');

    return;
  }



  let result = 0;



  stores.weighted.forEach(item=>{

    result +=
      item.score *
      (item.weight / totalWeight);

  });



  showResult({

    type:'Weighted Grade',

    percentage:result,

    letter:getLetterGrade(result),

    details:[

      {
        label:'Weighted Average',
        value:result.toFixed(1)+'%'
      },

      {
        label:'Letter Grade',
        value:getLetterGrade(result)
      },

      {
        label:'Total Weight',
        value:totalWeight.toFixed(1)+'%'
      },

      {
        label:'Assignments',
        value:String(stores.weighted.length)
      }

    ]

  });

}




// ============================================================
// GPA CALCULATOR
// ============================================================


function addGPACourse(){

  const nameInput =
    getCachedElement('gpaCourseName');

  const gradeInput =
    getCachedElement('gpaGrade');

  const creditsInput =
    getCachedElement('gpaCredits');



  const name =
    nameInput.value.trim() || 'Course';



  const grade =
    gradeInput.value.trim();



  const credits =
    Number(creditsInput.value);



  if (!grade){

    showError('Please enter a grade.');

    return;
  }



  if (!Number.isFinite(credits) ||
      credits < 0.5 ||
      credits > 20){

    showError(
      'Please enter valid credits (0.5-20).'
    );

    return;
  }




  const parsed =
    parseGradeInput(grade);



  if (!parsed){

    showError(
      'Invalid grade. Use A, B+, or percentage.'
    );

    return;
  }




  stores.gpa.push({

    name,

    grade,

    credits,

    parsed

  });



  renderGPATags();



  nameInput.value='';
  gradeInput.value='';
  creditsInput.value='';



  nameInput.focus();



  showSuccess('✅ Course added!');

}





function removeGPACourse(index){

  stores.gpa.splice(index,1);

  renderGPATags();

}





function renderGPATags(){

  const list =
    getCachedElement('gpaList');


  if (!list) return;



  if (!stores.gpa.length){

    list.innerHTML =
      '<span class="empty-tags-message">No courses added</span>';

    return;
  }




  list.innerHTML =
    stores.gpa.map((item,index)=>`

      <span class="tag-item">

      ${escapeHTML(item.name)}:
      ${escapeHTML(item.grade)}
      (${item.credits} credits)


      <button
      class="remove-tag"
      data-index="${index}"
      data-type="gpa">

      ✕

      </button>


      </span>

    `).join('');

}





function calculateGPA(){

  if (!stores.gpa.length){

    showError('Please add at least one course.');

    return;
  }



  const scaleSelect =
    getCachedElement('gpaScale');


  const scale =
    scaleSelect.value;



  let totalPoints = 0;

  let totalCredits = 0;



  const details = [];




  stores.gpa.forEach(course=>{


    let points = 0;

    let display = course.grade;



    if (course.parsed.type === 'letter'){


      points =
        getGPAPoints(
          course.parsed.value,
          scale
        );

      display =
        course.parsed.value;

    }


    else {


      const percent =
        course.parsed.value;



      if (scale === '100'){

        points = percent;

        display =
          percent + '%';

      }


      else if (scale === '4.0'){

        points =
          percentageToGPA(percent);

        display =
          percent + '%';

      }


      else if (scale === '5.0'){


        points =
          percentageToFiveGPA(percent);


        display =
          percent + '%';

      }


      else if (scale === 'uk'){


        if (percent >= 70)
          points = 4;

        else if (percent >= 60)
          points = 3;

        else if (percent >= 50)
          points = 2;

        else if (percent >= 40)
          points = 1;

        else
          points = 0;



        display =
          percent + '%';

      }


    }



    totalPoints +=
      points * course.credits;


    totalCredits +=
      course.credits;



    details.push(
      `${course.name}: ${display} (${points.toFixed(2)} pts)`
    );


  });




  if (totalCredits <= 0){

    showError(
      'Total credits must be greater than zero.'
    );

    return;
  }



  const gpa =
    totalPoints / totalCredits;



  let label='';

  let output='';



  if (scale === '100'){

    label='100 Point Scale';

    output =
      gpa.toFixed(1)+'%';

  }


  else if(scale === 'uk'){


    label='UK Classification';


    let classification='Fail';



    if(gpa >= 3.7)
      classification='First Class (1st)';

    else if(gpa >= 3.3)
      classification='Upper Second (2:1)';

    else if(gpa >= 3.0)
      classification='Lower Second (2:2)';

    else if(gpa >= 2.0)
      classification='Third (3rd)';



    output =
      `${gpa.toFixed(3)} - ${classification}`;

  }


  else {


    label =
      `${scale} Scale`;


    output =
      gpa.toFixed(3);

  }




  showResult({

    type:'GPA Calculator',

    percentage:null,

    letter:null,

    extra:output,


    details:[

      {
        label:'GPA',
        value:output
      },

      {
        label:'Scale',
        value:label
      },

      {
        label:'Total Credits',
        value:totalCredits.toFixed(1)
      },

      {
        label:'Courses',
        value:String(stores.gpa.length)
      }

    ]

  });


}// ============================================================
// FINAL EXAM CALCULATOR
// ============================================================


function calculateFinal(){

  const currentInput =
    getCachedElement('finalCurrent');

  const desiredInput =
    getCachedElement('finalDesired');

  const weightInput =
    getCachedElement('finalWeight');



  if (
    !currentInput.value.trim() ||
    !desiredInput.value.trim() ||
    !weightInput.value.trim()
  ){

    showError('Please fill all fields.');

    return;
  }




  const current =
    Number(currentInput.value);


  const desired =
    Number(desiredInput.value);


  const weight =
    Number(weightInput.value);





  if (
    !Number.isFinite(current) ||
    current < 0 ||
    current > 100
  ){

    showError(
      'Please enter a valid current grade (0-100).'
    );

    return;
  }




  if (
    !Number.isFinite(desired) ||
    desired < 0 ||
    desired > 100
  ){

    showError(
      'Please enter a valid desired grade (0-100).'
    );

    return;
  }




  if (
    !Number.isFinite(weight) ||
    weight <= 0 ||
    weight > 100
  ){

    showError(
      'Please enter a valid exam weight (1-100).'
    );

    return;
  }




  const examWeight =
    weight / 100;



  let required;



  // If final exam is 100%,
  // the exam score equals the desired grade

  if (examWeight === 1){

    required = desired;

  }

  else {

    required =
      (
        desired -
        current * (1 - examWeight)
      )
      /
      examWeight;

  }





  let resultText;

  let status;

  let impossible = false;




  if (required > 100){

    resultText =
      'Impossible';


    status =
      '❌ Even 100% on the final will not reach your goal.';


    impossible = true;

  }


  else if(required <= 0){


    resultText =
      'Already Achieved';


    status =
      '✅ You have already reached your goal.';


  }


  else {


    const safe =
      Math.max(
        0,
        Math.min(
          100,
          required
        )
      );


    resultText =
      safe.toFixed(1)+'%';



    if(safe <= 60){

      status =
        '✅ Very achievable!';

    }

    else if(safe <= 80){

      status =
        '📚 Achievable with effort.';

    }

    else {

      status =
        '⚠️ Challenging — study hard!';

    }


  }




  showResult({

    type:'Final Exam',

    percentage:
      impossible
        ? -1
        : Math.max(0,required),


    letter:
      resultText,


    extra:
      status,


    isImpossible:
      impossible,



    details:[

      {
        label:'Current Grade',
        value:
          current.toFixed(1)+'%'
      },


      {
        label:'Desired Grade',
        value:
          desired.toFixed(1)+'%'
      },


      {
        label:'Exam Weight',
        value:
          weight+'%'
      },


      {
        label:'Required Score',
        value:
          resultText
      }

    ]

  });


}







// ============================================================
// RESULTS DISPLAY
// ============================================================


function showResult(data){

  const resultBox =
    getCachedElement('gradeResultBox');


  const content =
    getCachedElement('gradeResultContent');



  if(!resultBox || !content){

    return;

  }




  resultBox.classList.remove('hidden');




  let color =
    '#4f46e5';



  let className =
    '';




  if(data.isImpossible){


    color =
      '#ef4444';


    className =
      'result-impossible';


  }


  else if(
    typeof data.percentage === 'number'
  ){


    if(data.percentage >= 90){

      color =
        '#22c55e';

    }

    else if(data.percentage >= 70){

      color =
        '#eab308';

    }

    else if(data.percentage >= 50){

      color =
        '#f97316';

    }

    else {

      color =
        '#ef4444';

    }

  }




  const detailsHtml =
    data.details
      .map(item=>`

        <div class="detail-item">

          <div class="label">
            ${escapeHTML(item.label)}
          </div>

          <div class="value">
            ${escapeHTML(item.value)}
          </div>

        </div>

      `)
      .join('');





  let display = '—';



  if(
    data.letter !== null &&
    data.letter !== undefined
  ){

    display =
      data.letter;

  }


  else if(
    typeof data.percentage === 'number'
  ){

    display =
      data.percentage.toFixed(1)+'%';

  }




  content.innerHTML = `

    ${
  data.letter !== null && data.letter !== undefined
  ?
  `
  <div 
  class="result-grade ${className}"
  style="color:${color};">

  ${display}

  </div>
  `
  :
  ''
}


    <div class="result-letter">
      ${data.type}
    </div>



    ${
      data.extra
      ?
      `
      <div 
      class="result-extra"
      style="
      font-size:1.2rem;
      font-weight:600;
      color:var(--primary);
      margin:.5rem 0;
      ">

      ${data.extra}

      </div>
      `
      :
      ''
    }



    <div class="result-details">

      ${detailsHtml}

    </div>

  `;




  setTimeout(()=>{

    resultBox.scrollIntoView({

      behavior:'smooth',

      block:'start'

    });


  },100);


}// ============================================================
// EVENT DELEGATION FOR REMOVE BUTTONS
// ============================================================


function setupRemoveButtons(){


  document.addEventListener('click', function(e){


    const button =
      e.target.closest('.remove-tag');



    if(!button){

      return;

    }




    const index =
      Number(button.dataset.index);



    const type =
      button.dataset.type;




    if(
      !Number.isInteger(index)
    ){

      return;

    }




    if(type === 'simple'){

      removeSimpleScore(index);

    }



    else if(type === 'weighted'){

      removeWeightedAssignment(index);

    }



    else if(type === 'gpa'){

      removeGPACourse(index);

    }


  });


}







// ============================================================
// ENTER KEY SUPPORT
// ============================================================


function setupEnterKeySupport(){


  document
  .querySelectorAll('.data-input-field')
  .forEach(input=>{


    input.addEventListener(
      'keypress',
      function(e){


        if(e.key !== 'Enter'){

          return;

        }



        const parent =
          input.closest(
            '.grade-tab-content'
          );



        if(!parent){

          return;

        }



        let button = null;



        switch(parent.id){


          case 'tab-simple':

            button =
              getCachedElement(
                'simpleCalculateBtn'
              );

            break;



          case 'tab-weighted':

            button =
              getCachedElement(
                'weightedCalculateBtn'
              );

            break;



          case 'tab-gpa':

            button =
              getCachedElement(
                'gpaCalculateBtn'
              );

            break;



          case 'tab-final':

            button =
              getCachedElement(
                'finalCalculateBtn'
              );

            break;


        }




        if(button){

          button.click();

        }



      }

    );


  });


}







// ============================================================
// MAIN INITIALIZATION
// ============================================================


function initLocalToolLogic(){



  // Tabs

  document
  .querySelectorAll('.grade-tab')
  .forEach(button=>{


    button.addEventListener(
      'click',
      function(){

        switchTab(
          this.dataset.tab
        );

      }

    );


  });





  // Simple Calculator


  const simpleAdd =
    getCachedElement(
      'simpleAddBtn'
    );


  const simpleCalculate =
    getCachedElement(
      'simpleCalculateBtn'
    );



  if(simpleAdd){

    simpleAdd.addEventListener(
      'click',
      addSimpleScore
    );

  }



  if(simpleCalculate){

    simpleCalculate.addEventListener(
      'click',
      calculateSimple
    );

  }







  // Weighted Calculator


  const weightedAdd =
    getCachedElement(
      'weightedAddBtn'
    );


  const weightedCalculate =
    getCachedElement(
      'weightedCalculateBtn'
    );



  if(weightedAdd){

    weightedAdd.addEventListener(
      'click',
      addWeightedAssignment
    );

  }




  if(weightedCalculate){

    weightedCalculate.addEventListener(
      'click',
      calculateWeighted
    );

  }







  // GPA Calculator


  const gpaAdd =
    getCachedElement(
      'gpaAddBtn'
    );


  const gpaCalculate =
    getCachedElement(
      'gpaCalculateBtn'
    );




  if(gpaAdd){

    gpaAdd.addEventListener(
      'click',
      addGPACourse
    );

  }





  if(gpaCalculate){

    gpaCalculate.addEventListener(
      'click',
      calculateGPA
    );

  }







  // Final Exam Calculator


  const finalCalculate =
    getCachedElement(
      'finalCalculateBtn'
    );



  if(finalCalculate){

    finalCalculate.addEventListener(
      'click',
      calculateFinal
    );

  }







  // Setup improved handlers


  setupRemoveButtons();


  setupEnterKeySupport();






  // Initial rendering


  renderSimpleTags();

  renderWeightedTags();

  renderGPATags();




  console.log(
    '[Grade Calculator] ✅ Initialized successfully!'
  );

}







// ============================================================
// DOM READY
// ============================================================


document.addEventListener(
  'DOMContentLoaded',
  function(){


    initLocalToolLogic();


  }
);