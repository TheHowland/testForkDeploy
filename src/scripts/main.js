//ToDo this could be an Object better than global variables
//--------------------------------------------------------------
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

// ####################################################################################################################
// ########################################################## MAIN ####################################################
async function createSvgsForSelectors(pyodide) {
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

    stepSolve = solve.SolveInUserOrder(Resistor1.circuitFile, "Circuits/", "Solutions/");
    await stepSolve.createStep0().toJs();
    stepSolve = solve.SolveInUserOrder(Resistor2.circuitFile, "Circuits/", "Solutions/");
    await stepSolve.createStep0().toJs();
    stepSolve = solve.SolveInUserOrder(Resistor3.circuitFile, "Circuits/", "Solutions/");
    await stepSolve.createStep0().toJs();
}

// ####################################################################################################################
async function main() {

    // ############################################################################################
    // The navigation for this website is not via different html files, but by showing and not
    // showing different containers that act as pages
    // In the functions below all callbacks to buttons and links are set.
    // The functionality of the simplifier is then called via these functions
    // ############################################################################################

    // First statement to make sure nothing else is shown at start
    let pageManager = new PageManager(document);
    pageManager.showLandingPage();

    // Get the pyodide instance and setup pages with functionality
    let pyodide = await loadPyodide();
    // Setup up first page
    setupNavigation(pageManager, pyodide);
    setupLandingPage(pageManager);

    await doLoadsAndImports(pyodide);
    await importSolverModule(pyodide);

    await createSvgsForSelectors(pyodide);
    setupSelectPage(pageManager, pyodide);
}

// ####################################################################################################################
// ############################################# Helper functions #####################################################
// ####################################################################################################################

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
    circuit.style.borderColor = "white";
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
    circuit.style.borderColor = "white";
    circuit.style.opacity = "1";
    overlay.style.display = "none";
}

function startSolving(pyodide) {
    //resetCongratsDisplayed();
    setTimeout(()=>{solveCircuit(currentCircuit, pyodide)},300);
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
    //startBtn.disabled = true;


    // Fill div with svg
    let svgData = pyodide.FS.readFile(circuitMap.svgFile, {encoding: "utf8"});
    svgData = svgData.replaceAll("black", "white");
    circuitDiv.innerHTML = svgData;


    setupSelectionCircuit(circuitDiv, startBtn, btnOverlay);
    startBtn.addEventListener("click", () =>
        circuitSelectorStartButtonPressed(circuitMap.circuitFile, pageManager, pyodide))
}


function resetSelectorResistorSelections() {
    resetSelection(Resistor1);
    resetSelection(Resistor2);
    resetSelection(Resistor3);
}

function setupResNextAndPrevButtons() {
    const resNext = document.getElementById("res-next-btn");
    const resPrev = document.getElementById("res-prev-btn");

    resNext.addEventListener("click", () => {
        resetSelectorResistorSelections();
    })
    resPrev.addEventListener("click", () => {
        resetSelectorResistorSelections();
    })
}

function setupResistorSelector(pageManager, pyodide) {
    setupSpecificCircuitSelector(Resistor1, pageManager, pyodide);
    setupSpecificCircuitSelector(Resistor2, pageManager, pyodide);
    setupSpecificCircuitSelector(Resistor3, pageManager, pyodide);

    setupResNextAndPrevButtons();
}


function circuitSelectorStartButtonPressed(circuitName, pageManager, pyodide){
    clearSimplifierPageContent();
    pageManager.showSimplifierPage();
    currentCircuit = circuitName;
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

function setupNavigation(pageManager, pyodide) {
    const navHomeLink = document.getElementById("nav-home");
    const navSimplifierLink = document.getElementById("nav-select");
    const navLogo = document.getElementById("nav-logo");

    navHomeLink.addEventListener('click', () => {
        checkIfSimplifierPageNeedsReset(pyodide);  // must be in front of page change
        pageManager.showLandingPage();
    })
    navSimplifierLink.addEventListener("click", () => {
        checkIfSimplifierPageNeedsReset(pyodide);  // must be in front of page change
        pageManager.showSelectPage();
    })
    navLogo.addEventListener("click", () => {
        checkIfSimplifierPageNeedsReset(pyodide);  // must be in front of page change
        pageManager.showLandingPage();
    })
}

function setupLandingPage(pageManager) {
    const landingStartButton = document.getElementById("start-button");
    landingStartButton.addEventListener("click", () => {
        pageManager.showSelectPage();
    })
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

function setupSelectPage(pageManager, pyodide) {
    setupResistorSelector(pageManager, pyodide);
}

async function importPyodidePackages(pyodide) {
    await load_packages(pyodide, ["sqlite3-1.0.0.zip"]);
    await import_packages(pyodide);
}



/*
 Imports the Python script for solving circuits,
 clears old solution files, solves the circuit based on the selected mode,
 and displays the initial step.
 */
async function solveCircuit(circuit, pyodide) {
    //A string used as a label for timing the circuit solving process.
    let timeSolve = "Solve circuit";
    console.time(timeSolve);

    // Clear old solution files
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

    stepSolve = solve.SolveInUserOrder(circuit, "Circuits/", "Solutions/");
    //The initial step object created when solving the circuit in user mode.
    let initialStep = await stepSolve.createStep0().toJs();
    console.log("Initial Step:", initialStep);

    console.timeEnd(timeSolve);
    //An array of file names representing the JSON and SVG files in the Solutions directory.
    const files = await pyodide.FS.readdir("Solutions");
    jsonFiles_Z = files.filter(file => !file.endsWith("VC.json")&& file.endsWith(".json"));
    console.log(jsonFiles_Z);
    jsonFiles_VC = files.filter(file => file.endsWith("VC.json"));
    if(jsonFiles_VC===[]){
        jsonFiles_VC = null;
    }
    console.log(jsonFiles_VC);
    svgFiles = files.filter(file => file.endsWith(".svg"));
    console.log(svgFiles);
    currentStep = 0;
    if(jsonFiles_VC===null)
    {
        display_step(pyodide, `Solutions/${jsonFiles_Z[currentStep]}`, `Solutions/${svgFiles[currentStep]}`);
    }
    else{
        display_step(pyodide, `Solutions/${jsonFiles_Z[currentStep]}`, `Solutions/${svgFiles[currentStep]}`,`Solutions/${jsonFiles_VC[currentStep]}`);
    }
}