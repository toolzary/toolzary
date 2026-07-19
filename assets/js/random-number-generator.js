/**
 * Random Number Generator
 * Fixed validation with JavaScript limits
 */

document.addEventListener('DOMContentLoaded', function() {
  initRandomLogic();
});

function initRandomLogic() {

  const minInput = document.getElementById('minVal');
  const maxInput = document.getElementById('maxVal');
  const countSelect = document.getElementById('countSelect');
  const customCount = document.getElementById('customCount');
  const customCountGroup = document.getElementById('customCountGroup');

  const decimalSelect = document.getElementById('decimalSelect');
  const customDecimal = document.getElementById('customDecimal');
  const customDecimalGroup = document.getElementById('customDecimalGroup');

  const generateBtn = document.getElementById('generateBtn');
  const regenerateBtn = document.getElementById('regenerateBtn');

  const copyBtn = document.getElementById('copyBtn');
  const copyText = document.getElementById('copyText');

  const resultBox = document.getElementById('resultBox');
  const outputContainer = document.getElementById('outputContainer');
  const errorBox = document.getElementById('toolLocalError');

  let currentNumbers = [];


  function showError(msg) {
    if (errorBox) {
      errorBox.textContent = msg;
      errorBox.classList.remove('hidden');
    }

    if (resultBox) {
      resultBox.classList.add('hidden');
    }
  }


  function hideError() {
    if (errorBox) {
      errorBox.classList.add('hidden');
    }
  }


  function scrollToResult() {
    if (resultBox) {
      setTimeout(function() {

        const targetOffset =
          resultBox.getBoundingClientRect().top +
          window.pageYOffset - 120;

        window.scrollTo({
          top: targetOffset,
          behavior: 'smooth'
        });

      },150);
    }
  }


  countSelect.addEventListener('change', function() {

    if (this.value === 'custom') {
      customCountGroup.style.display = 'flex';
      customCount.focus();
    } else {
      customCountGroup.style.display = 'none';
    }

  });


  decimalSelect.addEventListener('change', function() {

    if (this.value === 'custom') {
      customDecimalGroup.style.display = 'flex';
      customDecimal.focus();
    } else {
      customDecimalGroup.style.display = 'none';
    }

  });



  function getCount() {

    if (countSelect.value === 'custom') {
      return Number(customCount.value);
    }

    return Number(countSelect.value);

  }



 function getDecimals() {

  let value =
    decimalSelect.value === 'custom'
    ? customDecimal.value
    : decimalSelect.value;


  const decimals = Number(value);


  if (!Number.isInteger(decimals)) {
    return NaN;
  }


  return decimals;

}



  function generateRandomNumber(min,max,decimals) {


    if (decimals === 0) {

      const safeMin = Math.ceil(min);
      const safeMax = Math.floor(max);


      return Math.floor(
        Math.random() *
        (safeMax - safeMin + 1)
      ) + safeMin;

    }


    const number =
      Math.random() * (max - min) + min;


    return number.toFixed(decimals);

  }



  function generateNumbers(min,max,count,decimals) {

    const result=[];


    for(let i=0;i<count;i++){

      result.push(
        generateRandomNumber(
          min,
          max,
          decimals
        )
      );

    }


    return result;

  }



  function displayNumbers(numbers) {


    let html='';


    numbers.forEach(function(num){

      html +=
      '<span class="random-number-item">'
      + num +
      '</span>';

    });


    outputContainer.innerHTML = html;

    resultBox.classList.remove('hidden');

    scrollToResult();

  }





  function generateAndDisplay() {


    const min = Number(minInput.value);
    const max = Number(maxInput.value);

    const count = getCount();
    const decimals = getDecimals();



    if (minInput.value === '' || !Number.isFinite(min)) {

      showError(
        "Please enter a valid minimum value."
      );

      return;

    }



    if (maxInput.value === '' || !Number.isFinite(max)) {

      showError(
        "Please enter a valid maximum value."
      );

      return;

    }



    if (min < Number.MIN_SAFE_INTEGER) {

      showError(
        "Minimum value is too small. Maximum supported is " +
        Number.MIN_SAFE_INTEGER
      );

      return;

    }



    if (max > Number.MAX_SAFE_INTEGER) {

      showError(
        "Maximum value is too large. Maximum supported is " +
        Number.MAX_SAFE_INTEGER
      );

      return;

    }



    if (!Number.isInteger(count)) {

      showError(
        "Count must be a whole number."
      );

      return;

    }



    if (count < 1 || count > 100) {

      showError(
        "Count must be between 1 and 100."
      );

      return;

    }



    if (min > max) {

      showError(
        "Minimum value cannot be greater than maximum value."
      );

      return;

    }



    if (!Number.isInteger(decimals)) {

      showError(
        "Decimal places must be a whole number."
      );

      return;

    }



    if (decimals < 0 || decimals > 14) {

      showError(
        "Decimal places must be between 0 and 14."
      );

      return;

    }



    hideError();



    currentNumbers =
      generateNumbers(
        min,
        max,
        count,
        decimals
      );


    displayNumbers(currentNumbers);



    if(copyBtn){

      copyBtn.classList.remove('copied');

      if(copyText){

        copyText.textContent='Copy All';

      }

    }


  }





  function copyNumbers(){


    if(currentNumbers.length===0){

      showError(
        "No numbers to copy."
      );

      return;

    }



    const text =
      currentNumbers.join(', ');



    navigator.clipboard.writeText(text)
    .then(function(){

      copyBtn.classList.add('copied');

      if(copyText){

        copyText.textContent='Copied!';

      }



      setTimeout(function(){

        copyBtn.classList.remove('copied');

        if(copyText){

          copyText.textContent='Copy All';

        }

      },2000);


    });


  }




  generateBtn.addEventListener(
    'click',
    function(e){

      e.preventDefault();

      generateAndDisplay();

    }
  );


  regenerateBtn.addEventListener(
    'click',
    function(e){

      e.preventDefault();

      generateAndDisplay();

    }
  );


  copyBtn.addEventListener(
    'click',
    copyNumbers
  );



  document.querySelectorAll('input')
  .forEach(function(inp){

    inp.addEventListener(
      'keypress',
      function(e){

        if(e.key==='Enter'){

          generateAndDisplay();

        }

      }
    );

  });


}