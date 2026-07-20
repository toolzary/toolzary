/**
 * Case Converter
 * Convert text between different cases
 * Integrates with Toolzary template
 */

// ============================================================
// CASE CONVERSION FUNCTIONS
// ============================================================

function toUpperCase(text) {
  return text.toUpperCase();
}

function toLowerCase(text) {
  return text.toLowerCase();
}

function toTitleCase(text) {
  if (!text) return text;

  return text.replace(/\w\S*/g, function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function toSentenceCase(text) {
  if (!text) return text;

  return text
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, function(match) {
      return match.toUpperCase();
    });
}

function toCapitalize(text) {
  if (!text) return text;

  return text.split(' ').map(word => {
    if (!word) return word;

    return word.charAt(0).toUpperCase() +
           word.slice(1).toLowerCase();

  }).join(' ');
}

function toAlternating(text) {
  if (!text) return text;

  return text.split('').map((char, index) => {

    if (!/[a-zA-Z]/.test(char)) {
      return char;
    }

    return index % 2 === 0
      ? char.toUpperCase()
      : char.toLowerCase();

  }).join('');
}


// ============================================================
// UI HELPERS
// ============================================================

let elementCache = {};

function getCachedElement(id) {

  if (!elementCache[id]) {
    elementCache[id] = document.getElementById(id);
  }

  return elementCache[id];
}


function getTotalWords(text) {
  if (!text || text.trim().length === 0) return 0;

  const words = text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu);

  return words ? words.length : 0;
}


function getTotalCharacters(text) {
  if (!text) return 0;

  return [...new Intl.Segmenter(
    undefined,
    { granularity: 'grapheme' }
  ).segment(text)].length;
}


function updateLiveStats(text) {

  const liveChar = getCachedElement('liveCharCount');
  const liveWord = getCachedElement('liveWordCount');


  const characters = getTotalCharacters(text);
  const words = getTotalWords(text);


  if (liveChar) {
    liveChar.textContent =
      `Characters: ${characters.toLocaleString()}`;
  }


  if (liveWord) {
    liveWord.textContent =
      `Words: ${words.toLocaleString()}`;
  }
}

function showError(message) {

  const errorBox = getCachedElement('toolLocalError');

  if (!errorBox) return;


  errorBox.textContent = message;

  errorBox.classList.remove('hidden');

  errorBox.style.background =
    'rgba(239, 68, 68, 0.1)';

  errorBox.style.color =
    '#ef4444';

  errorBox.style.borderColor =
    'rgba(239, 68, 68, 0.2)';


  setTimeout(() => {

    errorBox.classList.add('hidden');

  },4000);
}



function showSuccess(message) {

  const errorBox = getCachedElement('toolLocalError');

  if (!errorBox) return;


  errorBox.textContent = message;

  errorBox.classList.remove('hidden');

  errorBox.style.background =
    'rgba(34,197,94,0.1)';

  errorBox.style.color =
    '#22c55e';

  errorBox.style.borderColor =
    'rgba(34,197,94,0.2)';


  setTimeout(() => {

    errorBox.classList.add('hidden');

  },2000);
}



function displayResult(text) {

  const output =
    getCachedElement('convertedOutput');

  const resultBox =
    getCachedElement('caseResultBox');


  if (!output) return;


  output.textContent = text;


  if (resultBox) {

    resultBox.classList.remove('hidden');


    setTimeout(() => {

      resultBox.scrollIntoView({
        behavior:'smooth',
        block:'start'
      });

    },150);
  }
}


// ============================================================
// TEXTAREA AUTO RESIZE
// ============================================================

function autoExpandTextarea() {

  const textarea =
    getCachedElement('textInput');


  if (!textarea) return;


  requestAnimationFrame(() => {

    textarea.style.height='auto';

    textarea.style.height =
      Math.min(textarea.scrollHeight,350)+'px';

  });
}
// ============================================================
// MAIN TOOL INITIALIZATION
// ============================================================

function initTool() {

  const textarea =
    getCachedElement('textInput');

  const clearBtn =
    getCachedElement('clearBtn');

  const sampleBtn =
    getCachedElement('sampleBtn');

  const copyBtn =
    getCachedElement('copyBtn');

  const caseBtns =
    document.querySelectorAll('.case-btn');

  const errorBox =
    getCachedElement('toolLocalError');


  if (!textarea) {

    console.error(
      '[Case Converter] Textarea not found'
    );

    return;
  }



  // ==========================================================
  // CONVERSION
  // ==========================================================

  function convertText(caseType, converter) {

    const text = textarea.value;


    if (!text || text.trim().length === 0) {

      showError(
        'Please enter some text to convert.'
      );

      return;
    }


    const result = converter(text);


    displayResult(result);


    showSuccess(
      `Converted to ${caseType}`
    );
  }




  // ==========================================================
  // CASE BUTTONS
  // ==========================================================

  caseBtns.forEach(btn => {


    btn.addEventListener('click', function(){


      const caseType =
        this.dataset.case;



      const convertMap = {


        uppercase: toUpperCase,

        lowercase: toLowerCase,

        titlecase: toTitleCase,

        sentencecase: toSentenceCase,

        capitalize: toCapitalize,

        alternating: toAlternating

      };



      const converter =
        convertMap[caseType];



      if (!converter) return;



      caseBtns.forEach(b => {

        b.classList.remove('primary');

      });


      this.classList.add('primary');



      const displayNames = {


        uppercase:'UPPER CASE',

        lowercase:'lower case',

        titlecase:'Title Case',

        sentencecase:'Sentence case',

        capitalize:'Capitalize',

        alternating:'Alternating'


      };



      convertText(
        displayNames[caseType],
        converter
      );


    });


  });





  // ==========================================================
  // LIVE STATS
  // ==========================================================

  textarea.addEventListener(
    'input',
    ()=>{

      updateLiveStats(
        textarea.value
      );


      autoExpandTextarea();

    }
  );





  // ==========================================================
  // CLEAR BUTTON
  // ==========================================================

  if(clearBtn){

    clearBtn.addEventListener(
      'click',
      ()=>{


        textarea.value='';



        const output =
          getCachedElement(
            'convertedOutput'
          );


        const resultBox =
          getCachedElement(
            'caseResultBox'
          );



        if(output){

          output.textContent='';

        }



        if(resultBox){

          resultBox.classList.add(
            'hidden'
          );

        }



        updateLiveStats('');



        if(errorBox){

          errorBox.classList.add(
            'hidden'
          );


          errorBox.style.background='';

          errorBox.style.color='';

          errorBox.style.borderColor='';

        }



        textarea.focus();


        setTimeout(
          autoExpandTextarea,
          10
        );


      }
    );

  }





  // ==========================================================
  // LOAD SAMPLE
  // ==========================================================

  if(sampleBtn){


    sampleBtn.addEventListener(
      'click',
      ()=>{


        const sample =
        `the quick brown fox jumps over the lazy dog. this sentence contains every letter of the english alphabet at least once. it is a great way to test text conversion tools!`;



        textarea.value = sample;



        updateLiveStats(sample);



        setTimeout(
          autoExpandTextarea,
          10
        );



        const output =
          getCachedElement(
            'convertedOutput'
          );


        const resultBox =
          getCachedElement(
            'caseResultBox'
          );



        if(output){

          output.textContent='';

        }



        if(resultBox){

          resultBox.classList.add(
            'hidden'
          );

        }



        caseBtns.forEach(b=>{

          b.classList.remove(
            'primary'
          );

        });



        const firstBtn =
          document.querySelector(
            '.case-btn'
          );



        if(firstBtn){

          firstBtn.classList.add(
            'primary'
          );

        }


      }
    );

  }





  // ==========================================================
  // COPY RESULT
  // ==========================================================

  if(copyBtn){


    copyBtn.addEventListener(
      'click',
      ()=>{


        const output =
          getCachedElement(
            'convertedOutput'
          );



        if(
          !output ||
          !output.textContent
        ){

          showError(
            'Nothing to copy. Convert some text first.'
          );

          return;

        }



        const text =
          output.textContent;



        if(
          navigator.clipboard &&
          navigator.clipboard.writeText
        ){


          navigator.clipboard
          .writeText(text)
          .then(()=>{


            showSuccess(
              'Copied to clipboard!'
            );


          })
          .catch(()=>{


            fallbackCopy(text);


          });


        }
        else{


          fallbackCopy(text);


        }


      }
    );

  }





  function fallbackCopy(text){


    const temp =
      document.createElement(
        'textarea'
      );


    temp.value=text;


    temp.style.position='fixed';

    temp.style.opacity='0';

    temp.style.left='-9999px';



    document.body.appendChild(temp);



    temp.select();



    try{


      document.execCommand(
        'copy'
      );


      showSuccess(
        'Copied to clipboard!'
      );


    }
    catch(error){


      showError(
        'Failed to copy. Please copy manually.'
      );


    }



    document.body.removeChild(temp);


  }





  // ==========================================================
  // KEYBOARD SHORTCUT
  // ==========================================================

  textarea.addEventListener(
    'keydown',
    (e)=>{


      if(
        e.ctrlKey &&
        e.key==='Enter'
      ){

        e.preventDefault();


        const btn =
          document.querySelector(
            '.case-btn[data-case="uppercase"]'
          );


        if(btn){

          btn.click();

        }

      }


    }
  );





  // ==========================================================
  // INITIAL STATE
  // ==========================================================

  updateLiveStats('');

  setTimeout(
    autoExpandTextarea,
    50
  );


}





// ============================================================
// SELF TEST
// ============================================================

function runSelfTest(){


  const testText =
    'hello world! this is a test.';



  const tests=[


    {
      name:'UPPER CASE',
      result:toUpperCase(testText),
      expected:'HELLO WORLD! THIS IS A TEST.'
    },


    {
      name:'lower case',
      result:toLowerCase(testText),
      expected:'hello world! this is a test.'
    },


    {
      name:'Title Case',
      result:toTitleCase(testText),
      expected:'Hello World! This Is A Test.'
    },


    {
      name:'Sentence Case',
      result:toSentenceCase(testText),
      expected:'Hello world! This is a test.'
    },


    {
      name:'Capitalize',
      result:toCapitalize(testText),
      expected:'Hello World! This Is A Test.'
    }


  ];



  let passed=true;



  tests.forEach(test=>{


    if(test.result!==test.expected){


      console.error(
        `[Self-Test] ${test.name} failed`,
        test.result
      );


      passed=false;


    }


  });



  const alt =
    toAlternating('hello');



  if(alt!=='HeLlO'){


    console.error(
      '[Self-Test] Alternating failed:',
      alt
    );


    passed=false;


  }



  if(passed){

    console.log(
      '[Case Converter] ✅ All tests passed!'
    );

  }
  else{

    console.warn(
      '[Case Converter] ⚠️ Some tests failed'
    );

  }



  return passed;

}





// ============================================================
// START
// ============================================================

document.addEventListener(
  'DOMContentLoaded',
  function(){


    initTool();


    console.log(
      '[Case Converter] ✅ Initialized successfully'
    );


  }
);