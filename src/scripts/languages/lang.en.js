const english = {
    // Landing page text
    landingPageGreeting:
        "a free browser tool for learning<br>" +
        "how to simplify electrical circuits",
    selectorWaitingNote:
        "This may take a minute",

    keyFeature1heading:
        "Understanding",
    keyFeature1:
        "Get an intuitive understanding for how electrical circuits are simplified",
    keyFeature2heading:
        "Browser based",
    keyFeature2:
        "No need for an additional app on your phone, this tool works completely inside your browser",
    keyFeature3heading:
        "Variety",
    keyFeature3:
        "Not only can you simplify resistors, but capacitors, inductors and even mixed circuits",
    landingPageExplanation1:
        "There are pre-made circuits that you can use. You can try different electrical " +
        "components (resistors, capacitors and inductors). More advanced circuits combine " +
        "these elements and can also provide you with voltages and currents, even " +
        "for alternating currents!",
    landingPageExplanation2:
        "If you step through the circuits, you can see how to calculate the different " +
        "impedance values, but you can also see how to calculate each of the voltages " +
        "and currents for the elements.",
    landingPageExplanation3:
        "On the homepage, the cheat sheet and the selector page, you can set your preferred language and set either " +
        "light or dark mode. While simplifying circuits, these settings cannot be changed.",

    // Selector page text
    selectorHeadings:
        {
            "quick": "QUICKSTART",
            "res":  "RESISTORS",
            "cap": "CAPACITORS",
            "ind": "INDUCTORS",
            "mixed": "MIXED CIRCUITS",
            "sym": "SYMBOLIC CALCULATION",
        },
    overviewModalBtn:
        "Overview",

    // Loading messages
    messages:
        [
            "Loading circuits",
            "Loading resistors",
            "Loading capacitors",
            "Loading inductors",
            "I know that there were some resistors here...",
            "Looking for a calculator",
            "A resistor walks into a bar...",
        ],

    // Simplifier page text
    // info gif
    closeBtn:
        "Close",
    infoGifHeading:
        "How to use",
    infoGifText:
        "Click the elements you want to simplify and check your selection with the 'check' button. " +
        "If the elements can be simplified, you will see the next step and can choose the next elements there.",
    // next elements container and interactions
    nextElementsHeading:
        "Next elements",
    showCalculationBtn:
        "Calculation",
    hideCalculationBtn:
        "Hide",
    showVoltageBtn:
        "Voltage/Current",
    hideVoltageBtn:
        "Hide",
    firstVCStepBtn:
        "Total current",
    solutionsBtn:
        "All values",
    msgVoltAndCurrentAvailable:
        "You can now go back and check how to calculate the voltages and currents",
    msgShowVoltage:
        "See if you can calculate the voltages and currents yourself, assuming that",
    msgCongratsFinishedCircuit:
        "Well done, you finished the circuit!",
    alertCanNotSimplify:
        "Can not simplify those elements",
    alertChooseAtLeastOneElement:
        "Choose at least two elements",
    alertNotToggleable:
        "Complex elements can not be toggled here, see calculations",

    // Calculation text
    relationTextParallel:
        "The elements are in parallel",
    relationTextSeries:
        "The elements are in series",
    relationTextNoRelation:
        "No relation between those elements",

    // Impedance
    voltageSymbol:
        "V",
    totalSuffix:
        "tot",
    effectiveSuffix:
        "eff",
    theElements:
        "The elements",
    areSimplifiedTo:
        "are simplified to",
    calculationHeading:
        "Calculation",
    complexImpedanceHeading:
        "Complex Impedance for",

    // Voltage Current text
    currentCalcHeading:
        "Calculate current for",
    currentStaysTheSame:
        "The current stays the same",
    voltageSplits:
        "The voltage splits up",
    voltageStaysTheSame:
        "The voltage stays the same",
    currentSplits:
        "The current splits up",
    backBtn:
        "back",
    onlyImaginaryPart:
        "Only imaginary part, back to ",

    // Cheat sheet
    resistanceColHeading:
        "Resistance R",
    reactanceColHeading:
        "Reactance X",
    resistorRowHeading:
        "Resistor R",
    capacitorRowHeading:
        "Capacitor C",
    inductorRowHeading:
        "Inductor L",
    subTableSeriesHeading:
        "Series",
    subTableParallelHeading:
        "Parallel",
    subTableHeading:
        "SUBSTITUTION FORMULAS",
    resReaTableHeading:
        "COMPLEX IMPEDANCE",

    /* Data Privacy Page */
    dataPrivacyBackBtn:
        "Back to Homepage",
    dataPrivacyHeading:
        "Data Privacy",
    dataPrivacyText:
        "",
    legalNoticeHeading:
        "Legal Notice",

    /* About Page */
    aboutText:
        "This tool is hosted by Pforzheim University, Germany.<br>" +
        "The software is developed under the supervision of Prof.Dr. Stefan Kray and is funded by the Foundation for Innovation in University Teaching.<br>" +
        "The tool is intended to help students and pupils learn about electrical engineering topics.<br><br>" +
        "The project is open-source and can be viewed on GitHub at the following link: <a href='https://github.com/prof-sky/simplipfy'>Github-Repo</a><br><br>" +
        "<h3>Used Libraries</h3>" +
        "<ul>" +
        "<li><a href='https://github.com/prof-sky/lcapy/tree/lcapy-inskale'>Lcapy (adapted)</a> [LGPL-2.1 license]</li>" +
        "<li><a href='https://github.com/prof-sky/simplipfy/tree/main/Schemdraw'>SchemDraw (adapted)</a> [MIT license]</li>" +
        "<li><a href='https://github.com/pyodide/pyodide'>Pyodide</a> [MPL-2.0 license]</li>" +
        "</ul>"

}
