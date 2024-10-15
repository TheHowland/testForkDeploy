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
//Stores the name of the selected circuit without the file extension.
let selectedCircuit = "";
//Variable to store the step solving object.
let stepSolve;
// Boolean to track if the congratulatory message has been displayed.
let congratsDisplayed = false;
//--------------------------------------------------------------
//Boolean to track if the Pyodide environment is ready.
let pyodideReady = false;
//Stores the server address for fetching resources.
let serverAddress = "http://localhost:8000"
let pictureCounter = 0;

/*
Initializes the Pyodide environment, loads circuit and solution files,
and sets up event listeners for UI elements.
 */
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

/*
 Removes all bounding boxes and clears the list of clicked elements in the SVG and the clicked elements container.
 */
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
    // todo startbtn
}

function resetSelection(circuit, overlay) {
    circuit.style.borderColor = "white";
    circuit.style.opacity = "1";
    overlay.style.display = "none";
}

function startSolving(pyodide) {
    if (currentCircuit && pyodideReady) {
        //resetCongratsDisplayed();
        setTimeout(()=>{
            solveCircuit(currentCircuit, pyodide);
        },300);
        //The div element that contains the SVG representation of the circuit diagram.
        const svgDiv = document.querySelector('.svg-container');
        //The div element that contains the list of elements that have been clicked or selected in the circuit diagram.
        const nextElementsContainer = document.querySelector('.next-elements-container');
        if (svgDiv && nextElementsContainer) {
            resetNextElements(svgDiv, nextElementsContainer);
        }
    }
}


function showLandingPage(landingPage, selectPage, simplifierPage) {
    landingPage.style.display = "block";
    selectPage.style.display = "none";
    simplifierPage.style.display = "none";
}

function showSelectPage(landingPage, selectPage, simplifierPage) {
    landingPage.style.display = "none";
    selectPage.style.display = "block";
    simplifierPage.style.display = "none";

}

function setupResistorSelector(landingPage, selectPage, simplifierPage, pyodide) {
    const res1 = document.getElementById("res1");
    const res1StartBtn = document.getElementById("res1-btn");
    const res1BtnOverlay = document.getElementById("res1-overlay");

    res1StartBtn.disabled = true;

    const res2 = document.getElementById("res2");
    const res2StartBtn = document.getElementById("res2-btn");
    const res2BtnOverlay = document.getElementById("res2-overlay");

    const res3 = document.getElementById("res3");
    const res3StartBtn = document.getElementById("res3-btn");
    const res3BtnOverlay = document.getElementById("res3-overlay");

    const resNext = document.getElementById("res-next-btn");
    const resPrev = document.getElementById("res-prev-btn");

    setupSelectionCircuit(res1, res1StartBtn, res1BtnOverlay);
    setupSelectionCircuit(res2, res2StartBtn, res2BtnOverlay);
    setupSelectionCircuit(res3, res3StartBtn, res3BtnOverlay);

    res1StartBtn.addEventListener("click", () => {
        console.log("start clicked");
        // show simplifier page
        landingPage.style.display = "none";
        selectPage.style.display = "none";
        simplifierPage.style.display = "block";
        currentCircuit = "Circuit_resistors.txt";
        selectedCircuit = currentCircuit.replace(".txt", "");
        console.log(selectedCircuit);
        startSolving(pyodide);
    })

    res2StartBtn.addEventListener("click", () => {
        console.log("start 2 clicked");
    })

    res3StartBtn.addEventListener("click", () => {
        console.log("start 3 clicked");
    })


    resNext.addEventListener("click", () => {
        resetSelection(res1, res1BtnOverlay);
        resetSelection(res2, res2BtnOverlay);
        resetSelection(res3, res3BtnOverlay);
    })
    resPrev.addEventListener("click", () => {
        resetSelection(res1, res1BtnOverlay);
        resetSelection(res2, res2BtnOverlay);
        resetSelection(res3, res3BtnOverlay);
    })
}

function setupLandingPageFunctionality(landingPage, selectPage, simplifierPage) {
    const navHomeLink = document.getElementById("nav-home");
    const navSimplifierLink = document.getElementById("nav-select");
    const navLogo = document.getElementById("nav-logo");
    const landingStartButton = document.getElementById("start-button");

    navHomeLink.addEventListener('click', () => {
        showLandingPage(landingPage, selectPage, simplifierPage);
    })
    navSimplifierLink.addEventListener("click", () => {
        showSelectPage(landingPage, selectPage, simplifierPage);
    })
    landingStartButton.addEventListener("click", () => {
        showSelectPage(landingPage, selectPage, simplifierPage);
    })
    navLogo.addEventListener("click", () => {
        showLandingPage(landingPage, selectPage, simplifierPage);
    })
}

function setupSimplifierPage(pyodide) {
    const resetBtn = document.getElementById("reset-btn");
    const checkBtn = document.getElementById("check-btn");
    const contentCol = document.getElementById("content-col");

    resetBtn.addEventListener('click', () => {
        // resetClickedElements(svgDiv, clickedElementsContainer);
    });

    checkBtn.addEventListener('click', async () => {
        const nextElementsContainer = document.getElementById("nextElementsContainer");
        const svgDiv = document.getElementById(`svgDiv${pictureCounter}`);


        setTimeout(() => {
            resetNextElements(svgDiv, nextElementsContainer);
        }, 100);
        console.log(selectedElements)
        if (selectedElements.length === 2) {
            const canSimplify = await stepSolve.simplifyTwoCpts(selectedElements).toJs();
            if (canSimplify[0]) {
                display_step(pyodide, canSimplify[1][0], canSimplify[2], canSimplify[1][1]);
                contentCol.removeChild(nextElementsContainer);
            } else {
                showMessage(contentCol, "Can not simplify those elements");
            }
        } else {
            showMessage(contentCol, 'Please choose exactly 2 elements');
        }
        MathJax.typeset();

    });
}

async function loadCircuits(pyodide) {
    let loadCircuits = "loading circuits";
    console.time(loadCircuits);

    //An array buffer containing the zipped circuit files fetched from the server.
    let cirArrBuff = await (await fetch(serverAddress + "/Circuits.zip")).arrayBuffer();
    await pyodide.unpackArchive(cirArrBuff, ".zip");

    circuitFiles = pyodide.FS.readdir("Circuits");
    circuitFiles = circuitFiles.filter((file) => file !== "." && file !== "..");
    console.timeEnd(loadCircuits);
}

function setupSelectPage(landingPage, selectPage, simplifierPage, pyodide) {
    setupResistorSelector(landingPage, selectPage, simplifierPage, pyodide);
}

async function importPyodidePackages(pyodide) {
    await load_packages(pyodide, ["sqlite3-1.0.0.zip"]);
    await import_packages(pyodide);
}

async function main() {

    // ############################# Pages (Containers) ############################################
    // The navigation for this website is not via different html files, but by showing and not
    // showing different containers that act as pages
    const landingPage = document.getElementById("landingpage-container");
    const selectPage = document.getElementById("select-page-container");
    const simplifierPage = document.getElementById("simplifier-page-container");

    showLandingPage(landingPage, selectPage, simplifierPage);
    setupLandingPageFunctionality(landingPage, selectPage, simplifierPage);

    //The Pyodide instance used to run Python code in the browser.
    let pyodide = await loadPyodide();

    setupSimplifierPage(pyodide);
    setupSelectPage(landingPage, selectPage, simplifierPage, pyodide);

    //A string used as a label for timing the loading of circuit files.
    await loadCircuits(pyodide);
    pyodide.FS.writeFile("/home/pyodide/solve.py", await (await fetch(serverAddress + "/solve.py")).text());

    await importPyodidePackages(pyodide);
    /*


        document.getElementById('continue-button').addEventListener('click',()=>{
            if(currentStep>0){
                if(jsonFiles_VC===null)
                {
                    currentStep--;
                    display_step(pyodide,`Solutions/${jsonFiles_Z[currentStep]}`,`Solutions/${svgFiles[currentStep]}`);
                }
                        else{
                    currentStep--;
                    display_step(pyodide,`Solutions/${jsonFiles_Z[currentStep]}`,`Solutions/${svgFiles[currentStep]}`,`Solutions/${jsonFiles_VC[currentStep+1]}`);
                }
            }
        });
    */
}

/*
 Imports the Python script for solving circuits,
 clears old solution files, solves the circuit based on the selected mode,
 and displays the initial step.
 */
async function solveCircuit(circuit, pyodide) {
    //A string used as a label for timing the import of the Python script.
    let timeImporting = "Importiere Python Skript";
    console.time(timeImporting);
    //The Python module imported from the Pyodide environment for solving circuits.
    let solve = await pyodide.pyimport("solve");
    console.timeEnd(timeImporting);
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