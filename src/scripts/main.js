//ToDo this could be an Object better than global variables
//--------------------------------------------------------------
let currentLang;
//Tracks the current step in the circuit simplification process.
let currentStep = 0;
//Array to store JSON file paths for Z simplification steps.
let jsonFiles_Z = [];
// Array to store JSON file paths for VC simplification steps.
let jsonFiles_VC = [];
//Array to store SVG file paths for circuit diagrams.
let svgFiles = [];
//Array to store the names of the circuit files.
let circuitFiles = [];
//Array to store selected elements in the circuit.
let selectedElements = [];
//Stores the currently selected circuit file name.
let currentCircuit = "";
let currentCircuitMap;
//The Python module imported from the Pyodide environment for solving circuits.
let solve;
//Variable to store the step solving object.
let stepSolve;
// Boolean to track if the congratulatory message has been displayed.
let congratsDisplayed = false;
//--------------------------------------------------------------
//Boolean to track if the Pyodide environment is ready.
let pyodideReady = false;
//To count how many svgs are on the screen right now
let pictureCounter = 0;

//Stores the server address for fetching resources.
let serverAddress = "http://localhost:8000"
let circuitPath = serverAddress + "/Circuits.zip";
let solveFilePath = serverAddress + "/solve.py";

let foregroundColor = "white";
let backgroundColor = "black";
let bsColorSchemeLight = "light";
let bsColorSchemeDark = "dark";



// ####################################################################################################################
// ########################################################## MAIN ####################################################


function updateNavigationColorsTo(navigationToggleBgColor, navLinkColor, languagesBgColor) {
    document.getElementById("navbarSupportedContent").style.backgroundColor = navigationToggleBgColor;
    updateNavLinkColorTo(navLinkColor);
    updateLanguageSelectorColor(languagesBgColor);
}

// ####################################################################################################################
async function main() {

    // ############################################################################################
    // The navigation for this website is not via different html files, but by showing and not
    // showing different containers that act as pages
    // In the functions below all callbacks to buttons and links are set.
    // The functionality of the simplifier is then called via these functions
    // ############################################################################################

    currentLang = english;

    // First statement to make sure nothing else is shown at start
    let pageManager = new PageManager(document);
    setupLandingPage(pageManager);
    pageManager.showLandingPage();
    let selectorBuilder = new SelectorBuilder();
    selectorBuilder.buildSelectorsForAllCircuitSets();

    // Get the pyodide instance and setup pages with functionality
    let pyodide = await loadPyodide();
    // Setup up first page
    setupNavigation(pageManager, pyodide);

    setupCheatSheet();

    const darkModeSwitch = document.getElementById("darkmode-switch");
    darkModeSwitch.checked = true;

    darkModeSwitch.addEventListener("change", () => {

        const bootstrapWhite = "#f8f9fa";
        const bootstrapDark = "#212529";
        const languagesDarkBg = "#33393f";
        const languagesLightBg = "#efefef";

        let changeToDark = darkModeSwitch.checked;

        if (changeToDark) {
            foregroundColor = "white";
            backgroundColor = "black";
            updateAvailableBsClassesTo(bsColorSchemeDark);
            updateNavigationColorsTo(bootstrapDark, foregroundColor, languagesDarkBg);
            updateCheatSheetPageColorsTo(bsColorSchemeDark);
            updateSelectorPageColor("black", "white");
        } else {
            foregroundColor = "black";
            backgroundColor = "white";

            updateAvailableBsClassesTo(bsColorSchemeLight);
            updateNavigationColorsTo(bootstrapWhite, foregroundColor, languagesLightBg);
            updateCheatSheetPageColorsTo(bsColorSchemeLight);
            updateSelectorPageColor("white", "black");
        }

    });



    hideSelectorsWhileLoading();
    const note = showWaitingNote();

    await doLoadsAndImports(pyodide);
    await importSolverModule(pyodide);
    await createSvgsForSelectors(pyodide);

    showSelectorsAfterLoading();
    note.remove();
    setupSelectPage(pageManager, pyodide);


}



// ####################################################################################################################
// ############################################# Helper functions #####################################################
// ####################################################################################################################


function updateAvailableBsClassesTo(colorScheme) {
    updateBsClassesTo(colorScheme, "bg", document.getElementById("bootstrap-overrides"));  // body
    updateBsClassesTo(colorScheme, "bg", document.getElementById("navbar"));
    updateBsClassesTo(colorScheme, "navbar", document.getElementById("navbar"));
    updateBsClassesTo(colorScheme, "bg", document.getElementById("cheat-sheet-container"));
    updateBsClassesTo(colorScheme, "bg", document.getElementById("simplifier-page-container"));
    updateBsClassesTo(colorScheme, "bg", document.getElementById("select-page-container"));
}


function updateBsClassesTo(colorScheme, className, element) {
    if (colorScheme === bsColorSchemeLight) {
        switchBsClassToLight(className, element);
    } else if (colorScheme === bsColorSchemeDark) {
        switchBsClassToDark(className, element);
    } else {
        throw Error("Only light or dark colorScheme");
    }
}

function updateNavLinkColorTo(color) {
    const navLinks = document.getElementsByClassName("nav-link");
    for (const navLink of navLinks) {
        navLink.style.color = color;
    }
}

function updateCheatSheetPageColorsTo(bsColorScheme) {
    const tables = document.getElementsByClassName("table");
    for (const table of tables) {
        updateBsClassesTo(bsColorScheme, "table", table);
    }
}
function updateSelectorPageColor(fromSvgColor, toSvgColor) {
    // Change border color of selectors
    const svgSelectors = document.getElementsByClassName("svg-selector");
    for (const svgSelector of svgSelectors) {
        svgSelector.style.borderColor = foregroundColor;
    }
    // Change svg color
    for (const circuitSet of CircuitSets) {
        for (const circuit of circuitSet.set) {
            let svgData = document.getElementById(circuit.circuitDivID).innerHTML;
            svgData = svgData.replaceAll(fromSvgColor, toSvgColor);
            document.getElementById(circuit.circuitDivID).innerHTML = svgData;
        }
    }
}

function updateLanguageSelectorColor(languagesBackground) {
    document.getElementById("darkmode-label").style.color = foregroundColor;
    document.getElementById("Dropdown").style.color = foregroundColor;
    document.getElementById("languagesDropdown").style.color = foregroundColor;
    document.getElementById("select-english").style.color = foregroundColor;
    document.getElementById("select-german").style.color = foregroundColor;
    document.getElementById("languagesDropdown").style.backgroundColor = languagesBackground;
}

function switchBsClassToLight(field, container) {
    container.classList.remove(`${field}-dark`);
    container.classList.add(`${field}-light`);
}

function switchBsClassToDark(field, container) {
    container.classList.remove(`${field}-light`);
    container.classList.add(`${field}-dark`);
}

function showWaitingNote() {
    const note = document.getElementById("progress-bar-note");
    note.style.color = foregroundColor;
    note.innerHTML = currentLang.selectorWaitingNote;
    return note;
}

function hideSelectorsWhileLoading() {
    for (const circuitSet of CircuitSets) {
        const carousel = document.getElementById(`${circuitSet.identifier}-carousel`);
        const heading = document.getElementById(`${circuitSet.identifier}-heading`);
        carousel.hidden = true;
        heading.hidden = true;
    }
}

function showSelectorsAfterLoading() {
    for (const circuitSet of CircuitSets) {
        const carousel = document.getElementById(`${circuitSet.identifier}-carousel`);
        const heading = document.getElementById(`${circuitSet.identifier}-heading`);
        carousel.hidden = false;
        heading.hidden = false;
    }
}

async function createSvgsForSelectors(pyodide) {
    await clearSolutionsDir(pyodide);
    // For all circuit sets (e.g. Resistors, Capacitors, ..)
    for (const circuitSet of CircuitSets) {
        // For all circuits in this set (e.g., Resistor1, Resistor2, ...)
        for (const circuit of circuitSet.set) {
            stepSolve = solve.SolveInUserOrder(circuit.circuitFile, "Circuits/", "Solutions/");
            await stepSolve.createStep0().toJs();
        }
    }
}

async function importSolverModule(pyodide) {
    pyodide.FS.writeFile("/home/pyodide/solve.py", await (await fetch(solveFilePath)).text());
    solve = await pyodide.pyimport("solve");
}

async function doLoadsAndImports(pyodide) {
    await loadCircuits(pyodide);
    await importPyodidePackages(pyodide);
}

function resetHighlightedBoundingBoxes(svgDiv) {
    const boundingBoxes = svgDiv.querySelectorAll('.bounding-box');
    if (boundingBoxes.length > 0) {
        boundingBoxes.forEach(box => box.remove());
    }
}

function resetNextElementsTextAndList(nextElementsContainer) {
    const nextElementList = nextElementsContainer.querySelector('ul');
    if (nextElementList) {
        nextElementList.innerHTML = '';
    } else {
        console.warn('nextElementsContainer ul-list not found');
    }
    selectedElements = [];
}

function resetNextElements(svgDiv, nextElementsContainer) {
    resetHighlightedBoundingBoxes(svgDiv);
    resetNextElementsTextAndList(nextElementsContainer);
}

function showCircuitAsSelected(circuit, btnOverlay) {
    circuit.style.borderColor = "#FFC107";
    circuit.style.opacity = "0.5";
    btnOverlay.style.display = "block"
}
function showCircuitAsUnselected(circuit, btnOverlay) {
    circuit.style.borderColor = foregroundColor;
    circuit.style.opacity = "1";
    btnOverlay.style.display = "none"
}

function setupSelectionCircuit(circuit, startBtn, startBtnOverlay) {
    circuit.addEventListener("click", () => {showCircuitAsSelected(circuit, startBtnOverlay)})
    startBtnOverlay.addEventListener("click", () => {showCircuitAsUnselected(circuit, startBtnOverlay)})
}

function resetSelection(circuitMap) {
    const circuit = document.getElementById(circuitMap.circuitDivID);
    const overlay = document.getElementById(circuitMap.btnOverlay);
    circuit.style.borderColor = foregroundColor;
    circuit.style.opacity = "1";
    overlay.style.display = "none";
}

function startSolving(pyodide) {
    //resetCongratsDisplayed();
    setTimeout(()=>{solveCircuit(currentCircuit, currentCircuitMap, pyodide)},300);
    //The div element that contains the SVG representation of the circuit diagram.
    const svgDiv = document.querySelector('.svg-container');
    //The div element that contains the list of elements that have been clicked or selected in the circuit diagram.
    const nextElementsContainer = document.querySelector('.next-elements-container');
    if (svgDiv && nextElementsContainer) {
        resetNextElements(svgDiv, nextElementsContainer);
    }
}

function setupSpecificCircuitSelector(circuitMap, pageManager, pyodide) {
    const circuitDiv = document.getElementById(circuitMap.circuitDivID);
    const startBtn = document.getElementById(circuitMap.btn);
    const btnOverlay = document.getElementById(circuitMap.btnOverlay);
    //startBtn.disabled = true; currently not necessary because it's only shown when all is ready


    // Fill div with svg
    let svgData = pyodide.FS.readFile(circuitMap.svgFile, {encoding: "utf8"});
    svgData = setSvgWidthTo(svgData, "100%");
    svgData = setSvgColorMode(svgData);
    circuitDiv.innerHTML = svgData;

    setupSelectionCircuit(circuitDiv, startBtn, btnOverlay);
    startBtn.addEventListener("click", () =>
        circuitSelectorStartButtonPressed(circuitMap.circuitFile, circuitMap, pageManager, pyodide))
}

function resetSelectorSelections(circuitSet) {
    for (const circuit of circuitSet) {
        resetSelection(circuit);
    }
}

function setupNextAndPrevButtons(circuitSet) {
    const next = document.getElementById(`${circuitSet.identifier}-next-btn`);
    const prev = document.getElementById(`${circuitSet.identifier}-prev-btn`);

    next.addEventListener("click", () => {
        resetSelectorSelections(circuitSet.set);
    })
    prev.addEventListener("click", () => {
        resetSelectorSelections(circuitSet.set);
    })
}

function setupSelector(circuitSet, pageManager, pyodide) {
    for (const circuit of circuitSet.set) {
        setupSpecificCircuitSelector(circuit, pageManager, pyodide);
    }
    if (moreThanOneCircuitInSet(circuitSet)) {
        setupNextAndPrevButtons(circuitSet);
    } else {
        hideNextAndPrevButtons(circuitSet);
    }
}

function moreThanOneCircuitInSet(circuitSet) {
    return circuitSet.set.length > 1;
}

function hideNextAndPrevButtons(circuitSet) {
    const next = document.getElementById(`${circuitSet.identifier}-next-btn`);
    const prev = document.getElementById(`${circuitSet.identifier}-prev-btn`);
    next.hidden = true;
    prev.hidden = true;
}

function circuitSelectorStartButtonPressed(circuitName, circuitMap, pageManager, pyodide){
    clearSimplifierPageContent();
    pageManager.showSimplifierPage();
    currentCircuit = circuitName;
    currentCircuitMap = circuitMap;
    pictureCounter = 0;
    if (pyodideReady) {
        startSolving(pyodide);
    }
}

function simplifierPageCurrentlyVisible() {
    return document.getElementById("simplifier-page-container").style.display === "block";
}

function checkIfSimplifierPageNeedsReset(pyodide) {
    if (simplifierPageCurrentlyVisible()) {
        resetSimplifierPage(pyodide);
    }
}

function updateLanguageLandingPage() {
    const greeting = document.getElementById("landing-page-greeting");
    greeting.innerHTML = currentLang.landingPageGreeting;
    const keyFeature1heading = document.getElementById("key-feature1heading");
    keyFeature1heading.innerHTML = currentLang.keyFeature1heading;
    const keyFeature1 = document.getElementById("key-feature1");
    keyFeature1.innerHTML = currentLang.keyFeature1;
    const keyFeature2 = document.getElementById("key-feature2");
    keyFeature2.innerHTML = currentLang.keyFeature2;
    const keyFeature2heading = document.getElementById("key-feature2heading");
    keyFeature2heading.innerHTML = currentLang.keyFeature2heading;
    const keyFeature3 = document.getElementById("key-feature3");
    keyFeature3.innerHTML = currentLang.keyFeature3;
    const keyFeature3heading = document.getElementById("key-feature3heading");
    keyFeature3heading.innerHTML = currentLang.keyFeature3heading;
    const expl1 = document.getElementById("landing-page-explanation1");
    expl1.innerHTML = currentLang.landingPageExplanation1;
    const expl2 = document.getElementById("landing-page-explanation2");
    expl2.innerHTML = currentLang.landingPageExplanation2;
    const expl3 = document.getElementById("landing-page-explanation3");
    expl3.innerHTML = currentLang.landingPageExplanation3;
}

function updateLanguageSelectorPage() {
    for (const circuitSet of CircuitSets) {
        const heading = document.getElementById(`${circuitSet.identifier}-heading`);
        heading.innerHTML = currentLang.carouselHeadings[circuitSet.identifier];
    }
}

function updateLanguageCheatSheetPage() {

    const subHeading = document.getElementById("substitutionTableHeading");
    subHeading.innerHTML = currentLang.subTableHeading;
    const series = document.getElementById("seriesHeading");
    series.innerHTML = currentLang.subTableSeriesHeading;
    const parallel = document.getElementById("parallelHeading");
    parallel.innerHTML = currentLang.subTableParallelHeading;
    const subResCol = document.getElementById("subTableResHeading");
    subResCol.innerHTML = currentLang.resistorRowHeading;
    const subCapCol = document.getElementById("subTableCapHeading");
    subCapCol.innerHTML = currentLang.capacitorRowHeading;
    const subIndCol = document.getElementById("subTableIndHeading");
    subIndCol.innerHTML = currentLang.inductorRowHeading;

    const resReaHeading = document.getElementById("resistanceReactanceTableHeading");
    resReaHeading.innerHTML = currentLang.resReaTableHeading;
    const resCol = document.getElementById("resistance");
    resCol.innerHTML = currentLang.resistanceColHeading;
    const reaCol = document.getElementById("reactance");
    reaCol.innerHTML = currentLang.reactanceColHeading;
    const res = document.getElementById("resistor");
    res.innerHTML = currentLang.resistorRowHeading;
    const cap = document.getElementById("capacitor");
    cap.innerHTML = currentLang.capacitorRowHeading;
    const ind = document.getElementById("inductor");
    ind.innerHTML = currentLang.inductorRowHeading;

}

function closeNavbar() {
    const navbarToggler = document.getElementById("nav-toggler");
    navbarToggler.classList.remove("collapsed");
    const navDropdown = document.getElementById("navbarSupportedContent");
    navDropdown.classList.remove("show");
}

function setupNavigation(pageManager, pyodide) {
    const navHomeLink = document.getElementById("nav-home");
    const navSimplifierLink = document.getElementById("nav-select");
    const navCheatLink = document.getElementById("nav-cheat");
    const navLogo = document.getElementById("nav-logo");
    const selectEnglish = document.getElementById("select-english");
    const selectGerman = document.getElementById("select-german");

    navHomeLink.addEventListener("click", () => {
        checkIfSimplifierPageNeedsReset(pyodide);  // must be in front of page change
        closeNavbar();
        pageManager.showLandingPage();
    })
    navSimplifierLink.addEventListener("click", () => {
        checkIfSimplifierPageNeedsReset(pyodide);  // must be in front of page change
        closeNavbar();
        pageManager.showSelectPage();
    })
    navCheatLink.addEventListener("click", () => {
        checkIfSimplifierPageNeedsReset();
        closeNavbar();
        pageManager.showCheatSheet();
    })
    navLogo.addEventListener("click", () => {
        checkIfSimplifierPageNeedsReset(pyodide);  // must be in front of page change
        closeNavbar();
        pageManager.showLandingPage();
    })
    selectEnglish.addEventListener("click", () => {
        currentLang = english;
        const activeFlagIcon = document.getElementById("activeLanguageFlag");
        activeFlagIcon.setAttribute("src", "src/resources/navigation/uk.png");
        closeNavbar();
        updateLanguageLandingPage();
        updateLanguageSelectorPage();
        updateLanguageCheatSheetPage();
    })
    selectGerman.addEventListener("click", () => {
        currentLang = german;
        const activeFlagIcon = document.getElementById("activeLanguageFlag");
        activeFlagIcon.setAttribute("src", "src/resources/navigation/germany.png");
        closeNavbar();
        updateLanguageLandingPage();
        updateLanguageSelectorPage();
        updateLanguageCheatSheetPage();
    })

}

function setupLandingPage(pageManager) {
    const landingStartButton = document.getElementById("start-button");
    landingStartButton.addEventListener("click", () => {
        pageManager.showSelectPage();
    })
    updateLanguageLandingPage();
}

function twoElementsChosen() {
    return selectedElements.length === 2;
}

function resetSolverObject() {
    stepSolve = solve.SolveInUserOrder(currentCircuit, "Circuits/", "Solutions/");
}

function enableCheckBtn() {
    document.getElementById("check-btn").disabled = false;
}

function clearSimplifierPageContent() {
    const contentCol = document.getElementById("content-col");
    contentCol.innerHTML = '';
}

function resetSimplifierPage(pyodide) {
    clearSimplifierPageContent();
    resetSolverObject();
    selectedElements = [];
    pictureCounter = 0;
    if (pyodideReady) {
        startSolving(pyodide);  // Draw the first picture again
    }
}

function scrollToBottom() {
    setTimeout(() => {
        const nextElementsText = document.getElementById("nextElementsContainer");
        if (nextElementsText != null) {nextElementsText.scrollIntoView()}
    }, 100);
}

function enableLastCalcButton() {
    setTimeout(() => {
        let lastPicture = pictureCounter - 1;
        console.log(lastPicture);
        const lastCalcBtn = document.getElementById(`calcBtn${lastPicture}`);
        lastCalcBtn.disabled = false;
    }, 100);
}

function notLastPicture() {
    // Because on the last picture, this element won't exist
    return document.getElementById("nextElementsContainer") != null;
}

async function loadCircuits(pyodide) {
    let loadCircuits = "loading circuits";
    console.time(loadCircuits);

    //An array buffer containing the zipped circuit files fetched from the server.
    let cirArrBuff = await (await fetch(circuitPath)).arrayBuffer();
    await pyodide.unpackArchive(cirArrBuff, ".zip");

    circuitFiles = pyodide.FS.readdir("Circuits");
    circuitFiles = circuitFiles.filter((file) => file !== "." && file !== "..");
    console.timeEnd(loadCircuits);
}

function updateSelectorHeadings(circuitSetId) {
    const heading = document.getElementById(`${circuitSetId}-heading`);
    heading.innerHTML = currentLang.carouselHeadings[circuitSetId];
}

function setupSelectPage(pageManager, pyodide) {
    for (const circuitSet of CircuitSets) {
        updateSelectorHeadings(circuitSet.identifier);
        setupSelector(circuitSet, pageManager, pyodide);
    }
}

function setupCheatSheet() {
    updateLanguageCheatSheetPage();

    // Substitution table
    const resSer = document.getElementById("resistorSeries");
    const resPar = document.getElementById("resistorParallel");
    const capSer = document.getElementById("capacitorSeries");
    const capPar = document.getElementById("capacitorParallel");
    const indSer = document.getElementById("inductorSeries");
    const indPar = document.getElementById("inductorParallel");

    resSer.innerHTML = "$$R = R1 + R2 + ...$$";
    resPar.innerHTML = "$$\\frac{1}{R} = \\frac{1}{R1} + \\frac{1}{R2} + ...$$";

    capSer.innerHTML = "$$\\frac{1}{C} = \\frac{1}{C1} + \\frac{1}{C2} + ...$$";
    capPar.innerHTML = "$$C = C1 + C2 + ...$$";

    indSer.innerHTML = "$$L = L1 + L2 + ...$$";
    indPar.innerHTML = "$$\\frac{1}{L} = \\frac{1}{L1} + \\frac{1}{L2} + ...$$";

    const pSub = document.getElementById("pSub");
    pSub.innerHTML = "<br><br><br>"


    // Complex R X table
    const resRes = document.getElementById("resistorResistance");
    resRes.innerHTML = "$$R$$";
    const resRea = document.getElementById("resistorReactance");
    resRea.innerHTML = "$$0$$";

    const capRes = document.getElementById("capacitorResistance");
    capRes.innerHTML = "$$0$$";
    const capRea = document.getElementById("capacitorReactance");
    capRea.innerHTML = "$$-\\frac{1}{ \\omega \\cdot C}$$";

    const indRes = document.getElementById("inductorResistance");
    indRes.innerHTML = "$$0$$";
    const indRea = document.getElementById("inductorReactance");
    indRea.innerHTML = "$$ \\omega \\cdot L$$";

    const pRX = document.getElementById("pRX");
    pRX.innerHTML = "$$\\underline{Z} = R + j \\cdot X$$"
    pRX.style.color = "white";

    MathJax.typeset();
}

async function importPyodidePackages(pyodide) {
    await load_packages(pyodide, ["sqlite3-1.0.0.zip"]);
    await import_packages(pyodide);
}


function circuitIsNotSubstituteCircuit(circuitMap) {
    let showVoltageButton = true;
    if (circuitMap.selectorGroup === substituteSelectorIdentifier) {
        showVoltageButton = false;
    }
    return showVoltageButton;
}

async function getCircuitComponentTypes(pyodide) {
    let circuitInfoPath = await stepSolve.createCircuitInfo();
    let circuitInfoFile = await pyodide.FS.readFile(circuitInfoPath, {encoding: "utf8"});
    const circuitInfo = JSON.parse(circuitInfoFile);
    return circuitInfo["componentTypes"];
}

async function getJsonAndSvgStepFiles(pyodide) {
    const files = await pyodide.FS.readdir("Solutions");
    jsonFiles_Z = files.filter(file => !file.endsWith("VC.json") && file.endsWith(".json"));
    jsonFiles_VC = files.filter(file => file.endsWith("VC.json"));
    if (jsonFiles_VC === []) {
        jsonFiles_VC = null;
    }
    svgFiles = files.filter(file => file.endsWith(".svg"));
    currentStep = 0;
}

async function clearSolutionsDir(pyodide) {
    try {
        //An array of file names representing the solution files in the Solutions directory.
        let solutionFiles = await pyodide.FS.readdir("Solutions");
        solutionFiles.forEach(file => {
            if (file !== "." && file !== "..") {
                pyodide.FS.unlink(`Solutions/${file}`);
            }
        });
    } catch (error) {
        console.warn("Solutions directory not found or already cleared.");
    }
}

function fillStepDetailsObject(circuitMap, componentTypes) {
    let stepDetails = new StepDetails;
    stepDetails.showVCButton = circuitIsNotSubstituteCircuit(circuitMap);
    stepDetails.jsonZPath = `Solutions/${jsonFiles_Z[currentStep]}`;
    stepDetails.jsonZVCath = (jsonFiles_VC === null) ? null : `Solutions/${jsonFiles_VC[currentStep]}`;
    stepDetails.svgPath = `Solutions/${svgFiles[currentStep]}`;
    stepDetails.componentTypes = componentTypes;
    return stepDetails;
}

async function solveCircuit(circuit, circuitMap, pyodide) {
    await clearSolutionsDir(pyodide);

    stepSolve = solve.SolveInUserOrder(circuit, "Circuits/", "Solutions/");
    await stepSolve.createStep0().toJs();

    // Get information which components are used in this circuit
    const componentTypes = await getCircuitComponentTypes(pyodide);

    await getJsonAndSvgStepFiles(pyodide);
    let stepDetails = fillStepDetailsObject(circuitMap, componentTypes);

    display_step(pyodide, stepDetails);
}