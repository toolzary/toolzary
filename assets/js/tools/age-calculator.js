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

    <div class="tool-interface">


        <div class="form-group">

            <label for="birthdateInput">
                Select Date of Birth
            </label>

            <input
                type="date"
                id="birthdateInput"
                class="tool-input"
            >

        </div>



        <button
            id="calculateBtn"
            class="third-btn"
        >
            Calculate Exact Age
        </button>



        <!-- AGE RESULT -->

        <div
            id="ageResultBox"
            class="result-card hidden"
        >

            <h3>
                Your Exact Age
            </h3>


            <div class="result-grid">


                <div class="result-item">

                    <span id="resYears">
                        0
                    </span>

                    <small>
                        Years
                    </small>

                </div>



                <div class="result-item">

                    <span id="resMonths">
                        0
                    </span>

                    <small>
                        Months
                    </small>

                </div>



                <div class="result-item">

                    <span id="resDays">
                        0
                    </span>

                    <small>
                        Days
                    </small>

                </div>


            </div>


        </div>





        <!-- BIRTHDAY COUNTDOWN -->


        <div
            id="birthdayCountdownBox"
            class="result-card hidden"
        >

            <h3>
                Birthday Countdown
            </h3>



            <div class="result-grid">


                <div class="result-item">

                    <span id="countdownDays">
                        0
                    </span>

                    <small>
                        Days
                    </small>

                </div>



                <div class="result-item">

                    <span id="countdownHours">
                        0
                    </span>

                    <small>
                        Hours
                    </small>

                </div>



                <div class="result-item">

                    <span id="countdownMinutes">
                        0
                    </span>

                    <small>
                        Minutes
                    </small>

                </div>



                <div class="result-item">

                    <span id="countdownSeconds">
                        0
                    </span>

                    <small>
                        Seconds
                    </small>

                </div>


            </div>



            <p
                id="birthdayMessageText"
                class="birthday-message"
            ></p>


        </div>





        <!-- ERROR -->

        <div
            id="toolLocalError"
            class="error-message hidden"
        ></div>



    </div>

    `;



    /*
    ============================================
    TOOL LOGIC
    ============================================
    */


    initLocalToolLogic();



});






/**
 * Calculates precise age
 */

function calculateAge(birthDate) {

    const today = new Date();


    let years =
        today.getFullYear()
        -
        birthDate.getFullYear();


    let months =
        today.getMonth()
        -
        birthDate.getMonth();


    let days =
        today.getDate()
        -
        birthDate.getDate();



    if (days < 0) {

        months--;

        const lastMonth =
            new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            );


        days += lastMonth.getDate();

    }



    if (months < 0) {

        years--;

        months += 12;

    }



    return {
        years,
        months,
        days
    };

}






function initLocalToolLogic() {


    const calcBtn =
        document.getElementById("calculateBtn");


    const birthInput =
        document.getElementById("birthdateInput");



    const resultBox =
        document.getElementById("ageResultBox");


    const countdownBox =
        document.getElementById("birthdayCountdownBox");


    const errorBox =
        document.getElementById("toolLocalError");



    const resYears =
        document.getElementById("resYears");


    const resMonths =
        document.getElementById("resMonths");


    const resDays =
        document.getElementById("resDays");



    const countdownDays =
        document.getElementById("countdownDays");


    const countdownHours =
        document.getElementById("countdownHours");


    const countdownMinutes =
        document.getElementById("countdownMinutes");


    const countdownSeconds =
        document.getElementById("countdownSeconds");



    const birthdayMessageText =
        document.getElementById("birthdayMessageText");



    let countdownInterval = null;



    if (!calcBtn || !birthInput) {
        return;
    }




    function stopCountdown() {

        if (countdownInterval) {

            clearInterval(countdownInterval);

            countdownInterval = null;

        }

    }





    function updateBirthdayCountdown(
        birthYear,
        birthMonth,
        birthDay
    ) {


        const now = new Date();


        let nextBirthday =
            new Date(
                now.getFullYear(),
                birthMonth,
                birthDay
            );



        if (nextBirthday < now) {

            nextBirthday =
                new Date(
                    now.getFullYear() + 1,
                    birthMonth,
                    birthDay
                );

        }



        const difference =
            nextBirthday.getTime()
            -
            now.getTime();



        const totalSeconds =
            Math.floor(
                difference / 1000
            );



        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) / 3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) / 60
            );


        const seconds =
            totalSeconds % 60;




        countdownDays.textContent = days;

        countdownHours.textContent = hours;

        countdownMinutes.textContent = minutes;

        countdownSeconds.textContent = seconds;



        const turningAge =
            nextBirthday.getFullYear()
            -
            birthYear;



        const weekdays =
        [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];



        const months =
        [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];



        const messageDate =
            `${months[birthMonth]} ${birthDay}`;



        if (
            days === 0 &&
            hours === 0 &&
            minutes === 0 &&
            seconds === 0
        ) {

            birthdayMessageText.innerHTML =
            "🎉 HAPPY BIRTHDAY! Today is your special day!";


        } else {


            birthdayMessageText.innerHTML =
            `
            Your next birthday (${messageDate})
            is on ${weekdays[nextBirthday.getDay()]}.
            You will turn
            <strong>${turningAge} years old</strong>.
            `;

        }


    }






    function startBirthdayCountdown(
        birthYear,
        birthMonth,
        birthDay
    ) {


        stopCountdown();


        updateBirthdayCountdown(
            birthYear,
            birthMonth,
            birthDay
        );


        countdownInterval =
            setInterval(() => {

                updateBirthdayCountdown(
                    birthYear,
                    birthMonth,
                    birthDay
                );

            },1000);


    }







    calcBtn.addEventListener(
        "click",
        function(e){


            e.preventDefault();


            stopCountdown();



            resultBox.classList.add("hidden");
            
            

            countdownBox.classList.add("hidden");

            errorBox.classList.add("hidden");



            if(!birthInput.value){


                errorBox.textContent =
                "Please select your birth date.";


                errorBox.classList.remove("hidden");


                return;

            }





            const parts =
                birthInput.value.split("-");



            const birthYear =
                parseInt(parts[0],10);


            const birthMonth =
                parseInt(parts[1],10)-1;


            const birthDay =
                parseInt(parts[2],10);





            const birthDate = new Date(0, 0, 0);

                birthDate.setFullYear(
                birthYear,
                birthMonth,
                birthDay
                );

                birthDate.setHours(
                12,
                0,
                0,
                0
                );




            const today =
                new Date();



            if(birthDate > today){


                errorBox.textContent =
                "Birthdate cannot be in the future.";


                errorBox.classList.remove("hidden");


                return;


            }





            const age =
                calculateAge(birthDate);



            resYears.textContent =
                age.years;


            resMonths.textContent =
                age.months;


            resDays.textContent =
                age.days;



            resultBox.classList.remove("hidden");



            startBirthdayCountdown(
                birthYear,
                birthMonth,
                birthDay
            );



            countdownBox.classList.remove("hidden");



        }
    );




    birthInput.addEventListener(
        "keypress",
        function(e){

            if(e.key === "Enter"){

                e.preventDefault();

                calcBtn.click();

            }

        }
    );

   

}