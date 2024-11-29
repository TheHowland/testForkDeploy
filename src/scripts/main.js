// #####################################################################################################################
// ##################################              GLOBALS            ##################################################
// #####################################################################################################################

let state = new StateObject();
let colors = new ColorDefinitions();
let selectorBuilder = new SelectorBuilder();
let languageManager = new LanguageManager();
let conf = null;
let packageManager = null;
let circuitMapper = null;
let pageManager;

// #####################################################################################################################
// ##################################              MAIN            #####################################################
// #####################################################################################################################
// The navigation for this website is not via different html files, but by showing and not
// showing different containers that act as pages
// #####################################################################################################################

async function main() {
    disableStartBtnAndSimplifierLink();
    conf = new Configurations();
    await conf.initialize();
    packageManager = new PackageManager();
    await packageManager.initialize();

    // Setup landing page first to make sure nothing else is shown at start
    pageManager = new PageManager(document);
    pageManager.setupLandingPage();
    pageManager.showLandingPage();
    pageManager.setupNavigation();
    pageManager.setupCheatSheet();
    // Selector page is set up when start button is clicked

    setupDarkModeSwitch();
    enableStartBtnAndSimplifierLink();
}



// #####################################################################################################################
async function solveCircuit(circuit, circuitMap, pyodide) {
    await clearSolutionsDir(pyodide);

    let paramMap = new Map();
    paramMap.set("volt", languageManager.currentLang.voltageSymbol);
    paramMap.set("total", languageManager.currentLang.totalSuffix);

    stepSolve = state.solve.SolveInUserOrder(
        circuit,
        `${conf.pyodideCircuitPath}/${circuitMap.sourceDir}`,
        `${conf.pyodideSolutionsPath}/`,
        paramMap);
    await stepSolve.createStep0().toJs();

    // Get information which components are used in this circuit
    const componentTypes = await getCircuitComponentTypes(pyodide);

    await getJsonAndSvgStepFiles(pyodide);
    let stepDetails = fillStepDetailsObject(circuitMap, componentTypes);

    display_step(pyodide, stepDetails);
}

function startSolving(pyodide) {
    solveCircuit(state.currentCircuit, state.currentCircuitMap, pyodide);
    //The div element that contains the SVG representation of the circuit diagram.
    const svgDiv = document.querySelector('.svg-container');
    //The div element that contains the list of elements that have been clicked or selected in the circuit diagram.
    const nextElementsContainer = document.querySelector('.next-elements-container');
    if (svgDiv && nextElementsContainer) {
        resetNextElements(svgDiv, nextElementsContainer);
    }
}

function fillStepDetailsObject(circuitMap, componentTypes) {
    let stepDetails = new StepDetails;
    stepDetails.showVCButton = circuitIsNotSubstituteCircuit(circuitMap);
    stepDetails.jsonZPath = `${conf.pyodideSolutionsPath}/${state.jsonFiles_Z[state.currentStep]}`;
    stepDetails.jsonZVCath = (state.jsonFiles_VC === null) ? null : `${conf.pyodideSolutionsPath}/${state.jsonFiles_VC[state.currentStep]}`;
    stepDetails.svgPath = `${conf.pyodideSolutionsPath}/${state.svgFiles[state.currentStep]}`;
    stepDetails.componentTypes = componentTypes;
    return stepDetails;
}

