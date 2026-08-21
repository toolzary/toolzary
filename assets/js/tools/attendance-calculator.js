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

    <!-- TOTAL CLASSES -->
    <div class="form-group-centered">

        <label for="totalClasses" class="input-label">
            Total Classes Held
        </label>

        <input
            type="number"
            id="totalClasses"
            class="data-input-field"
            placeholder="Enter total classes"
            min="1"
            step="1"
        >

    </div>

    <!-- ATTENDED CLASSES -->
    <div class="form-group-centered">

        <label for="attendedClasses" class="input-label">
            Classes Attended
        </label>

        <input
            type="number"
            id="attendedClasses"
            class="data-input-field"
            placeholder="Enter classes attended"
            min="0"
            step="1"
        >

    </div>

    <!-- TARGET PERCENTAGE -->
    <div class="form-group-centered">

        <label for="targetPercentage" class="input-label">
            Target Percentage (Optional)
        </label>

        <input
            type="number"
            id="targetPercentage"
            class="data-input-field"
            placeholder="Default: 75%"
            min="0"
            max="100"
            step="1"
            value="75"
        >

    </div>

    <!-- BUTTON -->
    <button
        id="calculateBtn"
        class="third-btn"
    >
        Calculate Attendance
    </button>

    <!-- RESULT -->
    <div
        id="attendanceResultBox"
        class="result-box-card hidden"
    >

        <h3 class="result-box-title">
            Attendance Report
        </h3>

        <div class="attendance-metrics-grid">

            <div class="metric-output-block">

                <span
                    id="attendancePercentage"
                    class="metric-display-val"
                >
                    0%
                </span>

                <small class="metric-display-lbl">
                    Attendance
                </small>

            </div>

            <div class="metric-output-block">

                <span
                    id="attendanceStatus"
                    class="metric-display-val"
                >
                    -
                </span>

                <small class="metric-display-lbl">
                    Status
                </small>

            </div>

            <div class="metric-output-block">

                <span
                    id="classesNeeded"
                    class="metric-display-val"
                >
                    0
                </span>

                <small class="metric-display-lbl">
                    Classes Needed
                </small>

            </div>

            <div class="metric-output-block">

                <span
                    id="maxAbsences"
                    class="metric-display-val"
                >
                    0
                </span>

                <small class="metric-display-lbl">
                    Absences Left
                </small>

            </div>

        </div>

        <div
            id="attendanceMessage"
            class="attendance-message"
        ></div>

        <div class="attendance-progress-container">

            <div
                id="attendanceProgressBar"
                class="attendance-progress-bar"
            ></div>

        </div>

    </div>

    <!-- ERROR -->
    <div
        id="toolLocalError"
        class="local-error-alert hidden"
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







/*
============================================
GET ATTENDANCE STATUS
============================================
*/

function getAttendanceStatus(
    percentage,
    target
) {


    if (percentage >= target + 10) {

        return {

            status: "Excellent",

            colorClass: "status-excellent",

            progressClass: "excellent"

        };

    }


    else if (percentage >= target) {

        return {

            status: "Good",

            colorClass: "status-good",

            progressClass: "good"

        };

    }


    else if (percentage >= target - 15) {

        return {

            status: "Average",

            colorClass: "status-average",

            progressClass: "average"

        };

    }


    else {

        return {

            status: "Low",

            colorClass: "status-low",

            progressClass: "low"

        };

    }


}







/*
============================================
CALCULATE CLASSES REQUIRED
============================================
*/

function calculateRequiredClasses(
    attended,
    total,
    target
) {


    let required = 0;


    let currentAttended = attended;

    let currentTotal = total;



    while (
        (currentAttended / currentTotal) * 100 < target
    ) {

        required++;

        currentAttended++;

        currentTotal++;

    }



    return required;


}







/*
============================================
CALCULATE MAX ABSENCES
============================================
*/

function calculateAllowedAbsences(
    total,
    attended,
    target
) {

    let absences = 0;

    while (
        (attended / (total + absences + 1)) * 100 >= target
    ) {

        absences++;

    }

    return absences;

}








function initLocalToolLogic() {


    const calculateBtn =
        document.getElementById("calculateBtn");


    const totalClassesInput =
        document.getElementById("totalClasses");


    const attendedClassesInput =
        document.getElementById("attendedClasses");


    const targetPercentageInput =
        document.getElementById("targetPercentage");



    const resultBox =
        document.getElementById("attendanceResultBox");


    const errorBox =
        document.getElementById("toolLocalError");



    const attendancePercentage =
        document.getElementById("attendancePercentage");


    const attendanceStatus =
        document.getElementById("attendanceStatus");


    const classesNeeded =
        document.getElementById("classesNeeded");


    const maxAbsences =
        document.getElementById("maxAbsences");


    const attendanceMessage =
        document.getElementById("attendanceMessage");


    const progressBar =
        document.getElementById("attendanceProgressBar");



    if (!calculateBtn) {

        return;

    }






    function showError(message) {


        if (errorBox) {

            errorBox.textContent = message;

            errorBox.classList.remove("hidden");

        }


        if (resultBox) {

            resultBox.classList.add("hidden");

        }


    }






    function hideError() {


        if (errorBox) {

            errorBox.classList.add("hidden");

        }


    }








    function calculateAttendance() {


        const total =
            parseInt(
                totalClassesInput.value,
                10
            );


        const attended =
            parseInt(
                attendedClassesInput.value,
                10
            );


        const target =
            parseInt(
                targetPercentageInput.value,
                10
            ) || 75;





        if (
            !total ||
            total <= 0
        ) {

            showError(
                "Please enter a valid total number of classes."
            );

            return;

        }





        if (
            isNaN(attended) ||
            attended < 0
        ) {

            showError(
                "Please enter valid attended classes."
            );

            return;

        }






        if (
            attended > total
        ) {

            showError(
                "Classes attended cannot exceed total classes."
            );

            return;

        }






        if (
            target < 0 ||
            target > 100
        ) {

            showError(
                "Target percentage must be between 0 and 100."
            );

            return;

        }






        hideError();





        const percentage =
            (attended / total) * 100;



        const displayPercentage =
            percentage.toFixed(1);





        const statusData =
            getAttendanceStatus(
                percentage,
                target
            );





        const needed =
            percentage >= target
                ? 0
                : calculateRequiredClasses(
                    attended,
                    total,
                    target
                );





        const absencesLeft =
            calculateAllowedAbsences(
                total,
                attended,
                target
            );







        attendancePercentage.textContent =
            displayPercentage + "%";


        attendancePercentage.className =
            `metric-display-val ${statusData.colorClass}`;






        attendanceStatus.textContent =
            statusData.status;


        attendanceStatus.className =
            `metric-display-val ${statusData.colorClass}`;







        classesNeeded.textContent =
            percentage >= target
                ? "✅ Achieved"
                : needed;



        maxAbsences.textContent =
            absencesLeft;



        attendanceMessage.className =
            "attendance-message";




       if (statusData.status === "Excellent") {

    attendanceMessage.textContent =
    `🌟 Excellent! Your attendance is ${displayPercentage}%. Keep up the great work!`;

    attendanceMessage.classList.add("success");

}

else if (statusData.status === "Good") {

    attendanceMessage.textContent =
    `✅ Good job! Your attendance is ${displayPercentage}%. You are meeting your target.`;

    attendanceMessage.classList.add("success");

}

else if (statusData.status === "Average") {

    attendanceMessage.textContent =
    `⚠️ Your attendance is ${displayPercentage}%. Attend ${needed} more class${needed > 1 ? "es" : ""} to reach ${target}%.`;

    attendanceMessage.classList.add("warning");

}

else {

    attendanceMessage.textContent =
    `🔴 Your attendance is ${displayPercentage}%. Attend ${needed} more class${needed > 1 ? "es" : ""} to reach ${target}%.`;

    attendanceMessage.classList.add("danger");

}
    





        if (progressBar) {


            progressBar.style.width =
                Math.min(
                    percentage,
                    100
                ) + "%";



            progressBar.className =
                `attendance-progress-bar ${statusData.progressClass}`;


        }






        resultBox.classList.remove(
            "hidden"
        );



    }







    calculateBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            calculateAttendance();

        }
    );







    [
        totalClassesInput,
        attendedClassesInput,
        targetPercentageInput

    ].forEach(
        function(input) {


            if (!input) {

                return;

            }



            input.addEventListener(
                "keypress",
                function(event) {


                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        calculateBtn.click();

                    }


                }
            );


        }
    );



}
