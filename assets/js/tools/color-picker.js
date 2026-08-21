document.addEventListener('DOMContentLoaded', function () {

    const app = document.getElementById("tool-app");

    if (!app) {
        return;
    }

    /*
    ===============================
    Create Tool Interface HTML
    ===============================
    */

    app.innerHTML = `
    <div class="tool-custom-interface">

        <!-- Color Input -->
        <div class="color-input-group">

            <div class="color-picker-wrapper">
                <label class="input-label">Pick a Color</label>

                <input 
                    type="color" 
                    id="colorPicker" 
                    class="color-picker-input" 
                    value="#4f46e5"
                >
            </div>


            <div class="color-hex-input">

                <label class="input-label">HEX Code</label>

                <div class="hex-input-wrapper">

                    <span class="hex-hash">#</span>

                    <input 
                        type="text"
                        id="hexInput"
                        class="data-input-field hex-input"
                        placeholder="4f46e5"
                        maxlength="6"
                        value="4f46e5"
                    >

                </div>

            </div>

        </div>


        <!-- RGB + HSL -->

        <div class="color-values-section">


            <!-- RGB -->

            <div class="color-value-row">

                <label class="value-label">
                    RGB
                </label>


                <input 
                    type="text"
                    id="rgbInput"
                    class="data-input-field value-input"
                    value="79, 70, 229"
                >


                <button 
                    id="applyRgbBtn"
                    class="apply-value-btn"
                    title="Apply RGB"
                >
                    ✓
                </button>


                <button 
                    id="copyRgbBtn"
                    class="copy-value-btn"
                    title="Copy RGB"
                >
                    ⧉
                </button>


            </div>



            <!-- HSL -->

            <div class="color-value-row">

                <label class="value-label">
                    HSL
                </label>


                <input 
                    type="text"
                    id="hslInput"
                    class="data-input-field value-input"
                    value="244, 75%, 59%"
                >


                <button 
                    id="applyHslBtn"
                    class="apply-value-btn"
                    title="Apply HSL"
                >
                    ✓
                </button>


                <button 
                    id="copyHslBtn"
                    class="copy-value-btn"
                    title="Copy HSL"
                >
                    ⧉
                </button>


            </div>


        </div>



        <!-- Buttons -->

        <div class="action-button-group">


            <button 
                id="clearBtn"
                class="first-btn"
            >
                Reset
            </button>



            <button 
                id="copyHexBtn"
                class="third-btn"
            >
                Copy HEX
            </button>


        </div>



        <!-- Message -->

        <div 
            id="toolLocalError"
            class="local-error-alert hidden"
        ></div>


    </div>
    `;


    // Start Tool

    initTool();

    runSelfTest();


});
// ============================================================
// COLOR CONVERSION FUNCTIONS
// ============================================================


function hexToRgb(hex) {

    hex = hex.replace("#", "");

    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return null;
    }

    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };

}



function rgbToHex(r, g, b) {

    return "#" + [
        r,
        g,
        b
    ]
    .map(value => {

        value = Math.max(
            0,
            Math.min(
                255,
                Math.round(value)
            )
        );

        return value
            .toString(16)
            .padStart(2, "0");

    })
    .join("")
    .toUpperCase();

}




function rgbToHsl(r, g, b) {


    r /= 255;
    g /= 255;
    b /= 255;


    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);


    let h;
    let s;
    let l = (max + min) / 2;



    if (max === min) {

        h = 0;
        s = 0;

    } else {


        const d = max - min;


        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);



        switch(max) {


            case r:

                h =
                (g - b) / d +
                (g < b ? 6 : 0);

                break;



            case g:

                h =
                (b - r) / d +
                2;

                break;



            case b:

                h =
                (r - g) / d +
                4;

                break;

        }


        h /= 6;


    }



    return {

        h: Math.round(h * 360),

        s: Math.round(s * 100),

        l: Math.round(l * 100)

    };

}





function hslToRgb(h, s, l) {


    h /= 360;
    s /= 100;
    l /= 100;


    let r;
    let g;
    let b;



    if (s === 0) {


        r = g = b = l;


    } else {



        function hue2rgb(p, q, t) {


            if (t < 0) t += 1;

            if (t > 1) t -= 1;


            if (t < 1 / 6)

                return p + (q - p) * 6 * t;


            if (t < 1 / 2)

                return q;


            if (t < 2 / 3)

                return p + (q - p) * (2 / 3 - t) * 6;


            return p;

        }



        const q =
            l < 0.5
            ? l * (1 + s)
            : l + s - l * s;



        const p =
            2 * l - q;



        r = hue2rgb(
            p,
            q,
            h + 1 / 3
        );


        g = hue2rgb(
            p,
            q,
            h
        );


        b = hue2rgb(
            p,
            q,
            h - 1 / 3
        );


    }



    return {

        r: r * 255,

        g: g * 255,

        b: b * 255

    };

}





// ============================================================
// VALIDATION
// ============================================================



function validateRgb(r, g, b) {


    if (
        !Number.isInteger(r) ||
        !Number.isInteger(g) ||
        !Number.isInteger(b)
    ) {

        return {
            valid:false,
            message:"RGB must be whole numbers."
        };

    }



    if (
        r < 0 || r > 255 ||
        g < 0 || g > 255 ||
        b < 0 || b > 255
    ) {

        return {
            valid:false,
            message:"RGB values must be between 0 and 255."
        };

    }



    return {
        valid:true,
        message:""
    };


}




function validateHsl(h, s, l) {


    if (
        h < 0 || h > 360 ||
        s < 0 || s > 100 ||
        l < 0 || l > 100
    ) {


        return {

            valid:false,

            message:"Invalid HSL values."

        };


    }



    return {

        valid:true,

        message:""

    };


}





function validateHex(hex) {


    hex = hex.replace("#","");


    return {

        valid:/^[0-9A-Fa-f]{6}$/.test(hex),

        message:""

    };


}




// ============================================================
// INPUT PARSERS
// ============================================================



function parseAndValidateRgb(input) {


    const match = input.match(
        /(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/
    );


    if (!match) {

        return {

            valid:false,

            message:"Use RGB format: 79,70,229"

        };

    }



    const r = Number(match[1]);

    const g = Number(match[2]);

    const b = Number(match[3]);



    const check = validateRgb(r,g,b);



    return {

        valid:check.valid,

        message:check.message,

        values:{
            r,
            g,
            b
        }

    };


}




function parseAndValidateHsl(input) {


    input = input
        .replace("hsl(","")
        .replace(")","");



    const parts =
        input.split(",");



    if(parts.length !== 3) {

        return {

            valid:false,

            message:"Use HSL format: 244,75%,59%"

        };

    }



    const h =
        parseInt(parts[0]);


    const s =
        parseInt(parts[1]);


    const l =
        parseInt(parts[2]);



    const check =
        validateHsl(h,s,l);



    return {

        valid:check.valid,

        message:check.message,

        values:{
            h,
            s,
            l
        }

    };


}
// ============================================================
// ELEMENT CACHE
// ============================================================

let elementCache = {};

function getCachedElement(id) {

    if (!elementCache[id]) {
        elementCache[id] = document.getElementById(id);
    }

    return elementCache[id];

}


// ============================================================
// MESSAGE FUNCTIONS
// ============================================================

function showError(message) {

    const box = getCachedElement("toolLocalError");

    if (!box) return;


    box.textContent = message;

    box.classList.remove("hidden");

    box.style.background =
        "rgba(239,68,68,0.1)";

    box.style.color =
        "#ef4444";


    setTimeout(() => {

        box.classList.add("hidden");

    }, 3000);

}



function showSuccess(message) {

    const box = getCachedElement("toolLocalError");

    if (!box) return;


    box.textContent = message;

    box.classList.remove("hidden");


    box.style.background =
        "rgba(34,197,94,0.1)";


    box.style.color =
        "#22c55e";


    setTimeout(() => {

        box.classList.add("hidden");

    }, 2000);

}



// ============================================================
// UPDATE COLOR
// ============================================================

function updateColor(hex) {


    const colorPicker =
        getCachedElement("colorPicker");


    const hexInput =
        getCachedElement("hexInput");


    const rgbInput =
        getCachedElement("rgbInput");


    const hslInput =
        getCachedElement("hslInput");



    if (!hex) return;



    if (!hex.startsWith("#")) {

        hex = "#" + hex;

    }



    const rgb =
        hexToRgb(hex);



    if (!rgb) {

        showError("Invalid HEX color.");

        return;

    }



    if (colorPicker) {

        colorPicker.value = hex;

    }



    if (hexInput) {

        hexInput.value =
            hex.replace("#","").toUpperCase();

    }



    if (rgbInput) {

        rgbInput.value =
            `${rgb.r}, ${rgb.g}, ${rgb.b}`;

    }



    const hsl =
        rgbToHsl(
            rgb.r,
            rgb.g,
            rgb.b
        );



    if (hslInput) {

        hslInput.value =
            `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;

    }


}




// ============================================================
// APPLY RGB
// ============================================================

function applyRgb() {


    const input =
        getCachedElement("rgbInput");


    if (!input) return;



    const result =
        parseAndValidateRgb(
            input.value
        );



    if (!result.valid) {

        showError(result.message);

        return;

    }



    const {
        r,
        g,
        b
    } = result.values;



    const hex =
        rgbToHex(r,g,b);



    updateColor(hex);


    showSuccess(
        `Applied RGB: ${r}, ${g}, ${b}`
    );


}





// ============================================================
// APPLY HSL
// ============================================================

function applyHsl() {


    const input =
        getCachedElement("hslInput");



    if (!input) return;



    const result =
        parseAndValidateHsl(
            input.value
        );



    if (!result.valid) {

        showError(result.message);

        return;

    }



    const {
        h,
        s,
        l
    } = result.values;



    const rgb =
        hslToRgb(
            h,
            s,
            l
        );



    const hex =
        rgbToHex(
            rgb.r,
            rgb.g,
            rgb.b
        );



    updateColor(hex);



    showSuccess(
        `Applied HSL: ${h}, ${s}%, ${l}%`
    );


}
// ============================================================
// COPY FUNCTIONS
// ============================================================


function copyToClipboard(text, message) {


    if (
        navigator.clipboard &&
        navigator.clipboard.writeText
    ) {


        navigator.clipboard
            .writeText(text)
            .then(() => {

                showSuccess(
                    message || "Copied!"
                );

            });


    } else {


        const area =
            document.createElement("textarea");


        area.value = text;

        document.body.appendChild(area);

        area.select();


        document.execCommand("copy");


        document.body.removeChild(area);


        showSuccess(
            message || "Copied!"
        );

    }

}




function copyHex() {


    const input =
        getCachedElement("hexInput");


    if (!input || !input.value) {

        showError("No HEX value.");

        return;

    }


    copyToClipboard(
        "#" + input.value,
        "HEX copied!"
    );


}




// ============================================================
// INITIALIZE TOOL
// ============================================================


function initTool() {


    const colorPicker =
        getCachedElement("colorPicker");


    const hexInput =
        getCachedElement("hexInput");


    const rgbInput =
        getCachedElement("rgbInput");


    const hslInput =
        getCachedElement("hslInput");


    const applyRgbBtn =
        getCachedElement("applyRgbBtn");


    const applyHslBtn =
        getCachedElement("applyHslBtn");


    const copyHexBtn =
        getCachedElement("copyHexBtn");


    const copyRgbBtn =
        getCachedElement("copyRgbBtn");


    const copyHslBtn =
        getCachedElement("copyHslBtn");


    const clearBtn =
        getCachedElement("clearBtn");



    if (!colorPicker || !hexInput) {

        console.error(
            "Color picker elements missing"
        );

        return;

    }




    // Color picker

    colorPicker.addEventListener(
        "input",
        () => {

            updateColor(
                colorPicker.value
            );

        }
    );





    // HEX input


    hexInput.addEventListener(
        "input",
        () => {


            let value =
                hexInput.value
                .replace("#","")
                .toUpperCase();



            value =
                value.replace(
                    /[^0-9A-F]/g,
                    ""
                );


            hexInput.value =
                value;



            if(value.length === 6){

                updateColor(
                    "#" + value
                );

            }


        }
    );






    // Apply buttons


    if(applyRgbBtn){

        applyRgbBtn.addEventListener(
            "click",
            applyRgb
        );

    }



    if(applyHslBtn){

        applyHslBtn.addEventListener(
            "click",
            applyHsl
        );

    }





    // Copy HEX


    if(copyHexBtn){

        copyHexBtn.addEventListener(
            "click",
            copyHex
        );

    }





    // Copy RGB


    if(copyRgbBtn){

        copyRgbBtn.addEventListener(
            "click",
            () => {


                copyToClipboard(
                    `rgb(${rgbInput.value})`,
                    "RGB copied!"
                );


            }
        );

    }






    // Copy HSL


    if(copyHslBtn){

        copyHslBtn.addEventListener(
            "click",
            () => {


                copyToClipboard(
                    `hsl(${hslInput.value})`,
                    "HSL copied!"
                );


            }
        );

    }





    // Reset


    if(clearBtn){

        clearBtn.addEventListener(
            "click",
            () => {


                updateColor(
                    "#4f46e5"
                );


                showSuccess(
                    "Reset complete"
                );


            }
        );

    }





    // Default color


    updateColor(
        "#4f46e5"
    );


    console.log(
        "[Color Picker] Initialized"
    );


}





// ============================================================
// SELF TEST
// ============================================================


function runSelfTest(){


    const rgb =
        hexToRgb("#4f46e5");


    if(!rgb){

        console.error(
            "HEX conversion failed"
        );

        return false;

    }



    const hex =
        rgbToHex(
            rgb.r,
            rgb.g,
            rgb.b
        );



    if(
        hex.toLowerCase()
        !== "#4f46e5"
    ){

        console.error(
            "HEX test failed"
        );

        return false;

    }




    const hsl =
        rgbToHsl(
            rgb.r,
            rgb.g,
            rgb.b
        );



    console.log(
        "Self test passed",
        {
            rgb,
            hsl
        }
    );


    return true;


}