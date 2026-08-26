/* =========================================================
   TOOLZARY - UNIT CONVERTER
   Accurate browser-based unit conversion
========================================================= */

(() => {
    "use strict";


    /* =====================================================
       UNIT DEFINITIONS
       
       For linear units:
       value -> base unit -> target unit

       Temperature uses custom conversion functions.
    ===================================================== */

    const UNIT_DATA = {

        /* =================================================
           LENGTH
        ================================================= */

        length: {

            name: "Length",

            units: {

                millimeter: {
                    name: "Millimeter",
                    symbol: "mm",
                    factor: 0.001
                },

                centimeter: {
                    name: "Centimeter",
                    symbol: "cm",
                    factor: 0.01
                },

                meter: {
                    name: "Meter",
                    symbol: "m",
                    factor: 1
                },

                kilometer: {
                    name: "Kilometer",
                    symbol: "km",
                    factor: 1000
                },

                inch: {
                    name: "Inch",
                    symbol: "in",
                    factor: 0.0254
                },

                foot: {
                    name: "Foot",
                    symbol: "ft",
                    factor: 0.3048
                },

                yard: {
                    name: "Yard",
                    symbol: "yd",
                    factor: 0.9144
                },

                mile: {
                    name: "Mile",
                    symbol: "mi",
                    factor: 1609.344
                },

                nauticalMile: {
                    name: "Nautical Mile",
                    symbol: "nmi",
                    factor: 1852
                }

            }

        },


        /* =================================================
           WEIGHT / MASS
        ================================================= */

        weight: {

            name: "Weight",

            units: {

                milligram: {
                    name: "Milligram",
                    symbol: "mg",
                    factor: 0.000001
                },

                gram: {
                    name: "Gram",
                    symbol: "g",
                    factor: 0.001
                },

                kilogram: {
                    name: "Kilogram",
                    symbol: "kg",
                    factor: 1
                },

                metricTon: {
                    name: "Metric Ton",
                    symbol: "t",
                    factor: 1000
                },

                ounce: {
                    name: "Ounce",
                    symbol: "oz",
                    factor: 0.028349523125
                },

                pound: {
                    name: "Pound",
                    symbol: "lb",
                    factor: 0.45359237
                },

                stone: {
                    name: "Stone",
                    symbol: "st",
                    factor: 6.35029318
                },

                usTon: {
                    name: "US Ton",
                    symbol: "ton",
                    factor: 907.18474
                }

            }

        },


        /* =================================================
           TEMPERATURE
        ================================================= */

        temperature: {

            name: "Temperature",

            units: {

                celsius: {
                    name: "Celsius",
                    symbol: "°C"
                },

                fahrenheit: {
                    name: "Fahrenheit",
                    symbol: "°F"
                },

                kelvin: {
                    name: "Kelvin",
                    symbol: "K"
                }

            },

            convert(value, from, to) {

                if (from === to) {
                    return value;
                }


                /* Convert source to Celsius */

                let celsius;


                if (from === "celsius") {

                    celsius = value;

                } else if (from === "fahrenheit") {

                    celsius = (value - 32) * 5 / 9;

                } else if (from === "kelvin") {

                    celsius = value - 273.15;

                } else {

                    throw new Error("Unsupported temperature unit.");

                }


                /* Celsius to target */

                if (to === "celsius") {

                    return celsius;

                }

                if (to === "fahrenheit") {

                    return (celsius * 9 / 5) + 32;

                }

                if (to === "kelvin") {

                    return celsius + 273.15;

                }


                throw new Error("Unsupported temperature unit.");

            }

        },


        /* =================================================
           AREA
        ================================================= */

        area: {

            name: "Area",

            units: {

                squareMillimeter: {
                    name: "Square Millimeter",
                    symbol: "mm²",
                    factor: 0.000001
                },

                squareCentimeter: {
                    name: "Square Centimeter",
                    symbol: "cm²",
                    factor: 0.0001
                },

                squareMeter: {
                    name: "Square Meter",
                    symbol: "m²",
                    factor: 1
                },

                squareKilometer: {
                    name: "Square Kilometer",
                    symbol: "km²",
                    factor: 1000000
                },

                squareInch: {
                    name: "Square Inch",
                    symbol: "in²",
                    factor: 0.00064516
                },

                squareFoot: {
                    name: "Square Foot",
                    symbol: "ft²",
                    factor: 0.09290304
                },

                squareYard: {
                    name: "Square Yard",
                    symbol: "yd²",
                    factor: 0.83612736
                },

                acre: {
                    name: "Acre",
                    symbol: "ac",
                    factor: 4046.8564224
                },

                hectare: {
                    name: "Hectare",
                    symbol: "ha",
                    factor: 10000
                }

            }

        },


        /* =================================================
           VOLUME
        ================================================= */

        volume: {

            name: "Volume",

            units: {

                milliliter: {
                    name: "Milliliter",
                    symbol: "mL",
                    factor: 0.001
                },

                liter: {
                    name: "Liter",
                    symbol: "L",
                    factor: 1
                },

                cubicMeter: {
                    name: "Cubic Meter",
                    symbol: "m³",
                    factor: 1000
                },

                cubicCentimeter: {
                    name: "Cubic Centimeter",
                    symbol: "cm³",
                    factor: 0.001
                },

                cubicInch: {
                    name: "Cubic Inch",
                    symbol: "in³",
                    factor: 0.016387064
                },

                cubicFoot: {
                    name: "Cubic Foot",
                    symbol: "ft³",
                    factor: 28.316846592
                },

                gallonUS: {
                    name: "US Gallon",
                    symbol: "gal",
                    factor: 3.785411784
                },

                quartUS: {
                    name: "US Quart",
                    symbol: "qt",
                    factor: 0.946352946
                },

                pintUS: {
                    name: "US Pint",
                    symbol: "pt",
                    factor: 0.473176473
                },

                cupUS: {
                    name: "US Cup",
                    symbol: "cup",
                    factor: 0.2365882365
                },

                fluidOunceUS: {
                    name: "US Fluid Ounce",
                    symbol: "fl oz",
                    factor: 0.0295735295625
                }

            }

        },


        /* =================================================
           SPEED
        ================================================= */

        speed: {

            name: "Speed",

            units: {

                meterPerSecond: {
                    name: "Meter per Second",
                    symbol: "m/s",
                    factor: 1
                },

                kilometerPerHour: {
                    name: "Kilometer per Hour",
                    symbol: "km/h",
                    factor: 1000 / 3600
                },

                milePerHour: {
                    name: "Mile per Hour",
                    symbol: "mph",
                    factor: 1609.344 / 3600
                },

                footPerSecond: {
                    name: "Foot per Second",
                    symbol: "ft/s",
                    factor: 0.3048
                },

                knot: {
                    name: "Knot",
                    symbol: "kn",
                    factor: 1852 / 3600
                }

            }

        },


        /* =================================================
           TIME
        ================================================= */

        time: {

            name: "Time",

            units: {

                millisecond: {
                    name: "Millisecond",
                    symbol: "ms",
                    factor: 0.001
                },

                second: {
                    name: "Second",
                    symbol: "s",
                    factor: 1
                },

                minute: {
                    name: "Minute",
                    symbol: "min",
                    factor: 60
                },

                hour: {
                    name: "Hour",
                    symbol: "h",
                    factor: 3600
                },

                day: {
                    name: "Day",
                    symbol: "day",
                    factor: 86400
                },

                week: {
                    name: "Week",
                    symbol: "week",
                    factor: 604800
                }

            }

        },


        /* =================================================
           DIGITAL DATA
        ================================================= */

        data: {

            name: "Data",

            units: {

                bit: {
                    name: "Bit",
                    symbol: "bit",
                    factor: 1 / 8
                },

                byte: {
                    name: "Byte",
                    symbol: "B",
                    factor: 1
                },

                kilobyte: {
                    name: "Kilobyte",
                    symbol: "KB",
                    factor: 1000
                },

                megabyte: {
                    name: "Megabyte",
                    symbol: "MB",
                    factor: 1000000
                },

                gigabyte: {
                    name: "Gigabyte",
                    symbol: "GB",
                    factor: 1000000000
                },

                terabyte: {
                    name: "Terabyte",
                    symbol: "TB",
                    factor: 1000000000000
                },

                kibibyte: {
                    name: "Kibibyte",
                    symbol: "KiB",
                    factor: 1024
                },

                mebibyte: {
                    name: "Mebibyte",
                    symbol: "MiB",
                    factor: 1024 ** 2
                },

                gibibyte: {
                    name: "Gibibyte",
                    symbol: "GiB",
                    factor: 1024 ** 3
                },

                tebibyte: {
                    name: "Tebibyte",
                    symbol: "TiB",
                    factor: 1024 ** 4
                }

            }

        },


        /* =================================================
           PRESSURE
        ================================================= */

        pressure: {

            name: "Pressure",

            units: {

                pascal: {
                    name: "Pascal",
                    symbol: "Pa",
                    factor: 1
                },

                kilopascal: {
                    name: "Kilopascal",
                    symbol: "kPa",
                    factor: 1000
                },

                megapascal: {
                    name: "Megapascal",
                    symbol: "MPa",
                    factor: 1000000
                },

                bar: {
                    name: "Bar",
                    symbol: "bar",
                    factor: 100000
                },

                atmosphere: {
                    name: "Atmosphere",
                    symbol: "atm",
                    factor: 101325
                },

                psi: {
                    name: "Pounds per Square Inch",
                    symbol: "psi",
                    factor: 6894.757293168
                },

                torr: {
                    name: "Torr",
                    symbol: "Torr",
                    factor: 101325 / 760
                },

                mmHg: {
                    name: "Millimeter of Mercury",
                    symbol: "mmHg",
                    factor: 133.322387415

                }

            }

        },


        /* =================================================
           ENERGY
        ================================================= */

        energy: {

            name: "Energy",

            units: {

                joule: {
                    name: "Joule",
                    symbol: "J",
                    factor: 1
                },

                kilojoule: {
                    name: "Kilojoule",
                    symbol: "kJ",
                    factor: 1000
                },

                calorie: {
                    name: "Calorie",
                    symbol: "cal",
                    factor: 4.184
                },

                kilocalorie: {
                    name: "Kilocalorie",
                    symbol: "kcal",
                    factor: 4184
                },

                wattHour: {
                    name: "Watt-hour",
                    symbol: "Wh",
                    factor: 3600
                },

                kilowattHour: {
                    name: "Kilowatt-hour",
                    symbol: "kWh",
                    factor: 3600000
                },

                electronvolt: {
                    name: "Electronvolt",
                    symbol: "eV",
                    factor: 1.602176634e-19
                },

                britishThermalUnit: {
                    name: "British Thermal Unit",
                    symbol: "BTU",
                    factor: 1055.05585262
                }

            }

        },


        /* =================================================
           FREQUENCY
        ================================================= */

        frequency: {

            name: "Frequency",

            units: {

                hertz: {
                    name: "Hertz",
                    symbol: "Hz",
                    factor: 1
                },

                kilohertz: {
                    name: "Kilohertz",
                    symbol: "kHz",
                    factor: 1000
                },

                megahertz: {
                    name: "Megahertz",
                    symbol: "MHz",
                    factor: 1000000
                },

                gigahertz: {
                    name: "Gigahertz",
                    symbol: "GHz",
                    factor: 1000000000
                }

            }

        }

    };


    /* =====================================================
       DEFAULT UNITS
    ===================================================== */

    const DEFAULT_UNITS = {

        length: {
            from: "meter",
            to: "foot"
        },

        weight: {
            from: "kilogram",
            to: "pound"
        },

        temperature: {
            from: "celsius",
            to: "fahrenheit"
        },

        area: {
            from: "squareMeter",
            to: "squareFoot"
        },

        volume: {
            from: "liter",
            to: "gallonUS"
        },

        speed: {
            from: "kilometerPerHour",
            to: "milePerHour"
        },

        time: {
            from: "hour",
            to: "minute"
        },

        data: {
            from: "megabyte",
            to: "gigabyte"
        },

        pressure: {
            from: "bar",
            to: "psi"
        },

        energy: {
            from: "kilowattHour",
            to: "joule"
        },

        frequency: {
            from: "hertz",
            to: "kilohertz"
        }

    };


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const categorySelect =
        document.getElementById("unitCategory");

    const fromValueInput =
        document.getElementById("fromValue");

    const toValueInput =
        document.getElementById("toValue");

    const fromUnitSelect =
        document.getElementById("fromUnit");

    const toUnitSelect =
        document.getElementById("toUnit");

    const swapButton =
        document.getElementById("swapUnits");

    const resultValue =
        document.getElementById("resultValue");

    const copyButton =
        document.getElementById("copyResult");

    const resetButton =
        document.getElementById("resetConverter");


    /* =====================================================
       VALIDATE REQUIRED ELEMENTS
    ===================================================== */

    if (
        !categorySelect ||
        !fromValueInput ||
        !toValueInput ||
        !fromUnitSelect ||
        !toUnitSelect ||
        !swapButton ||
        !resultValue ||
        !copyButton ||
        !resetButton
    ) {
        console.error(
            "Toolzary Unit Converter: Required HTML elements are missing."
        );

        return;
    }


    /* =====================================================
       FORMAT NUMBER
    ===================================================== */

    function formatNumber(value) {

        if (!Number.isFinite(value)) {
            return "";
        }


        if (Object.is(value, -0)) {
            value = 0;
        }


        const absolute = Math.abs(value);


        /*
         * Avoid unnecessary decimal noise.
         *
         * Up to 12 significant digits is enough for
         * normal user-facing conversions while avoiding
         * floating-point artifacts such as:
         *
         * 0.30000000000000004
         */

        if (
            absolute !== 0 &&
            (absolute >= 1e12 || absolute < 1e-9)
        ) {

            return value.toExponential(10)
                .replace(/\.?0+e/, "e");

        }


        return Number(
            value.toPrecision(12)
        ).toString();

    }


    /* =====================================================
       POPULATE UNIT SELECTS
    ===================================================== */

    function populateUnits(category) {

        const categoryData = UNIT_DATA[category];

        if (!categoryData) {
            return;
        }


        const units = categoryData.units;

        const previousFrom = fromUnitSelect.value;
        const previousTo = toUnitSelect.value;


        fromUnitSelect.innerHTML = "";
        toUnitSelect.innerHTML = "";


        Object.entries(units).forEach(
            ([key, unit]) => {

                const fromOption =
                    document.createElement("option");

                fromOption.value = key;

                fromOption.textContent =
                    `${unit.name} (${unit.symbol})`;


                const toOption =
                    document.createElement("option");

                toOption.value = key;

                toOption.textContent =
                    `${unit.name} (${unit.symbol})`;


                fromUnitSelect.appendChild(fromOption);
                toUnitSelect.appendChild(toOption);

            }
        );


        const defaults =
            DEFAULT_UNITS[category];


        if (
            defaults &&
            units[defaults.from] &&
            units[defaults.to]
        ) {

            fromUnitSelect.value =
                defaults.from;

            toUnitSelect.value =
                defaults.to;

        } else {

            if (
                previousFrom &&
                units[previousFrom]
            ) {
                fromUnitSelect.value =
                    previousFrom;
            }

            if (
                previousTo &&
                units[previousTo]
            ) {
                toUnitSelect.value =
                    previousTo;
            }

        }


        updateConversion();

    }


    /* =====================================================
       CONVERT VALUE
    ===================================================== */

    function convertValue(
        value,
        category,
        fromUnit,
        toUnit
    ) {

        const categoryData =
            UNIT_DATA[category];


        if (!categoryData) {
            throw new Error(
                "Unknown conversion category."
            );
        }


        /* Same unit */

        if (fromUnit === toUnit) {
            return value;
        }


        /* Special conversion */

        if (
            typeof categoryData.convert === "function"
        ) {

            return categoryData.convert(
                value,
                fromUnit,
                toUnit
            );

        }


        const from =
            categoryData.units[fromUnit];

        const to =
            categoryData.units[toUnit];


        if (!from || !to) {
            throw new Error(
                "Unknown conversion unit."
            );
        }


        /*
         * Convert:
         *
         * source -> base unit
         * base unit -> destination
         */

        const baseValue =
            value * from.factor;


        return baseValue / to.factor;

    }


    /* =====================================================
       UPDATE CONVERSION
    ===================================================== */

    function updateConversion() {

        const rawValue =
            fromValueInput.value.trim();


        const category =
            categorySelect.value;

        const fromUnit =
            fromUnitSelect.value;

        const toUnit =
            toUnitSelect.value;


        if (!rawValue) {

            toValueInput.value = "";
            resultValue.textContent =
                "Enter a value to convert.";

            return;

        }


        const value =
            Number(rawValue);


        if (!Number.isFinite(value)) {

            toValueInput.value = "";
            resultValue.textContent =
                "Please enter a valid number.";

            return;

        }


        try {

            const converted =
                convertValue(
                    value,
                    category,
                    fromUnit,
                    toUnit
                );


            const formatted =
                formatNumber(converted);


            const categoryData =
                UNIT_DATA[category];


            const from =
                categoryData.units[fromUnit];

            const to =
                categoryData.units[toUnit];


            toValueInput.value =
                formatted;


            resultValue.textContent =
                `${formatNumber(value)} ${from.symbol} = ${formatted} ${to.symbol}`;

        } catch (error) {

            console.error(
                "Unit conversion error:",
                error
            );


            toValueInput.value = "";

            resultValue.textContent =
                "Unable to perform this conversion.";

        }

    }


    /* =====================================================
       SWAP UNITS
    ===================================================== */

    function swapUnits() {

        const currentFrom =
            fromUnitSelect.value;

        const currentTo =
            toUnitSelect.value;


        fromUnitSelect.value =
            currentTo;

        toUnitSelect.value =
            currentFrom;


        updateConversion();

    }


    /* =====================================================
       COPY RESULT
    ===================================================== */

    async function copyResult() {

        const text =
            resultValue.textContent.trim();


        if (!text) {
            return;
        }


        try {

            await navigator.clipboard.writeText(text);

            showCopySuccess();

        } catch (error) {

            /*
             * Fallback for browsers where
             * Clipboard API isn't available.
             */

            const textarea =
                document.createElement("textarea");

            textarea.value = text;

            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            textarea.style.pointerEvents = "none";

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();


            try {

                document.execCommand("copy");

                showCopySuccess();

            } catch (fallbackError) {

                console.error(
                    "Unable to copy result:",
                    fallbackError
                );

            }


            textarea.remove();

        }

    }


    /* =====================================================
       COPY BUTTON FEEDBACK
    ===================================================== */

    function showCopySuccess() {

        const originalHTML =
            copyButton.innerHTML;


        copyButton.innerHTML = `
            <span>✓</span>
            <span>Copied</span>
        `;


        copyButton.setAttribute(
            "aria-label",
            "Result copied"
        );


        window.setTimeout(() => {

            copyButton.innerHTML =
                originalHTML;

            copyButton.setAttribute(
                "aria-label",
                "Copy conversion result"
            );

        }, 1500);

    }


    /* =====================================================
       RESET
    ===================================================== */

    function resetConverter() {

        const category =
            categorySelect.value;


        fromValueInput.value = "1";


        const defaults =
            DEFAULT_UNITS[category];


        if (defaults) {

            fromUnitSelect.value =
                defaults.from;

            toUnitSelect.value =
                defaults.to;

        }


        updateConversion();

    }


    /* =====================================================
       CATEGORY CHANGE
    ===================================================== */

    categorySelect.addEventListener(
        "change",
        () => {

            populateUnits(
                categorySelect.value
            );

        }
    );


    /* =====================================================
       VALUE INPUT
    ===================================================== */

    fromValueInput.addEventListener(
        "input",
        updateConversion
    );


    /* =====================================================
       UNIT CHANGE
    ===================================================== */

    fromUnitSelect.addEventListener(
        "change",
        updateConversion
    );


    toUnitSelect.addEventListener(
        "change",
        updateConversion
    );


    /* =====================================================
       SWAP
    ===================================================== */

    swapButton.addEventListener(
        "click",
        swapUnits
    );


    /* =====================================================
       COPY
    ===================================================== */

    copyButton.addEventListener(
        "click",
        copyResult
    );


    /* =====================================================
       RESET
    ===================================================== */

    resetButton.addEventListener(
        "click",
        resetConverter
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    populateUnits(
        categorySelect.value
    );


})();
