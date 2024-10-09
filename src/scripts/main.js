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
// Stores the current mode (user or pre-calculated).
let mode = '';
// Boolean to track if the congratulatory message has been displayed.
let congratsDisplayed = false;
//--------------------------------------------------------------
//Boolean to track if the Pyodide environment is ready.
let pyodideReady = false;
//Stores the server address for fetching resources.
let serverAddress = "http://localhost:8000"

/*
Initializes the Pyodide environment, loads circuit and solution files,
and sets up event listeners for UI elements.
 */
async function main() {


    // ############################# Navigation functions ############################################

    const landingPage = document.getElementById("landingpage-container");
    const selectPage = document.getElementById("select-page-container");
    landingPage.style.display = "none";

    const homeButton = document.getElementById("nav-home");
    const simplifierButton = document.getElementById("nav-select");
    const landingStartButton = document.getElementById("start-button");
    const navLogo = document.getElementById("nav-logo");

    homeButton.addEventListener('click', () => {
        landingPage.style.display = "block";
        selectPage.style.display = "none";
    })
    simplifierButton.addEventListener("click", () => {
        landingPage.style.display = "none";
        selectPage.style.display = "block";
    })
    landingStartButton.addEventListener("click", () => {
        landingPage.style.display = "none";
        selectPage.style.display = "block";
    })
    navLogo.addEventListener("click", () => {
        landingPage.style.display = "block";
        selectPage.style.display = "none";
    })

    // ############################# Select functions ############################################
    const res1 = document.getElementById("res_1");
    const res2 = document.getElementById("res_2");
    const res3 = document.getElementById("res_3");
    const next = document.getElementById("res-next-btn");
    const prev = document.getElementById("res-prev-btn");

    res1.addEventListener("click", () => {
        res1.style.borderColor = "#FFC107";
        res1.style.opacity = "0.5";
    })

    next.addEventListener("click", () => {
        res1.style.borderColor = "white";
        res1.style.opacity = "1";
        res2.style.borderColor = "white";
        res3.style.borderColor = "white";
    })
    prev.addEventListener("click", () => {
        res1.style.borderColor = "white";
        res1.style.opacity = "1";
        res2.style.borderColor = "white";
        res3.style.borderColor = "white";
    })




/*
    //A div element used to display loading messages to the user.
    const infoText = document.createElement('div');
    infoText.id = "infoText";
    infoText.textContent = "";

    document.body.appendChild(infoText);
    infoText.setAttribute('style', 'white-space: pre;');

    infoText.textContent = "Lade Pyodide Umgebung... ";
*/
    //The Pyodide instance used to run Python code in the browser.
    let pyodide = await loadPyodide();
    /*
    infoText.textContent += "fertig\r\n";

    //A string used as a label for timing the loading of circuit files.
    let loadCircuits = "Lade Schaltkreise";
    infoText.textContent += "Lade Schaltkreise vom Server... ";
    console.time(loadCircuits);

    //An array buffer containing the zipped circuit files fetched from the server.
    let cirArrBuff = await (await fetch(serverAddress + "/Circuits.zip")).arrayBuffer();
    await pyodide.unpackArchive(cirArrBuff, ".zip");

    circuitFiles = pyodide.FS.readdir("Circuits");
    circuitFiles = circuitFiles.filter((file) => file !== "." && file !== "..");
    populateCircuitSelector();
    console.timeEnd(loadCircuits);

    pyodide.FS.writeFile("/home/pyodide/solve.py", await (await fetch(serverAddress + "/solve.py")).text());

    document.body.removeChild(infoText);

    document.getElementById('menu-toggle').style.display = 'block';
    document.getElementById('initial-message').style.display = 'block';
    //The div element representing the menu bar in the UI.
    const menuBar = document.getElementById('menu-bar');
    //The div element where the circuit simplification content is displayed.
    const simplificationDiv = document.getElementById('simplification');
    if (menuBar.style.left === '0px') {
        menuBar.style.left = '-250px';
        simplificationDiv.style.width = '90vw';
    } else {
        menuBar.style.left = '0px';
        simplificationDiv.style.width = 'calc(90vw - 250px)';
    }

    document.getElementById('menu-toggle').addEventListener('click', () => {
        // The div element representing the menu bar in the UI.
        const menuBar = document.getElementById('menu-bar');
        //The div element where the circuit simplification content is displayed.
        const simplificationDiv = document.getElementById('simplification');
        if (menuBar.style.left === '0px') {
            menuBar.style.left = '-250px';
            simplificationDiv.style.width = '90vw';
        } else {
            menuBar.style.left = '0px';
            simplificationDiv.style.width = 'calc(90vw - 250px)';
        }
    });

    document.getElementById('mode').addEventListener('change', (event) => {
        mode = event.target.value;
    });

    document.getElementById('circuit-selector').addEventListener('change', (event) => {
        currentCircuit = event.target.value;
        selectedCircuit= currentCircuit.replace(".txt", "");
        console.log(selectedCircuit)
    });

    document.getElementById('prev-button').addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            display_step(pyodide, `Solutions/${jsonFiles_Z[currentStep]}`, `Solutions/${svgFiles[currentStep]}`);
        }
    });

    document.getElementById('next-button').addEventListener('click', () => {
        if (currentStep < jsonFiles_Z.length - 1) {
            currentStep++;
                  display_step(pyodide, `Solutions/${jsonFiles_Z[currentStep]}`, `Solutions/${svgFiles[currentStep]}`);
        }
    });

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

/*
    document.getElementById('start-button').addEventListener('click', () => {
        if (mode && currentCircuit && pyodideReady) {
            document.getElementById('menu-toggle').click();
            document.getElementById('initial-message').style.display = 'none';
            document.getElementById('loading-message').style.display='block';
            document.getElementById('continue-button').style.display='none';
            resetCongratsDisplayed();
            setTimeout(()=>{
                solveCircuit(currentCircuit, pyodide);
            },300);
            //The div element that contains the SVG representation of the circuit diagram.
            const svgDiv = document.querySelector('.svg-container');
            //The div element that contains the list of elements that have been clicked or selected in the circuit diagram.
            const clickedElementsContainer = document.querySelector('.clicked-elements-container');
            if (svgDiv && clickedElementsContainer) {
                resetClickedElements(svgDiv, clickedElementsContainer);
            }
        }
    });
    */

    await load_packages(pyodide, ["sqlite3-1.0.0.zip"]);
    await import_packages(pyodide);
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

    if (mode === 'user') {
        stepSolve = solve.SolveInUserOrder(circuit, "Circuits/", "Solutions/");
        //The initial step object created when solving the circuit in user mode.
        let initialStep = await stepSolve.createStep0().toJs();
        console.log("Initial Step:", initialStep);
    } else {
        await solve.solve_circuit(circuit);
    }

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
    document.getElementById('loading-message').style.display='none';
    currentStep = 0;
    if(jsonFiles_VC===null)
    {
        display_step(pyodide, `Solutions/${jsonFiles_Z[currentStep]}`, `Solutions/${svgFiles[currentStep]}`);
    }
    else{
        display_step(pyodide, `Solutions/${jsonFiles_Z[currentStep]}`, `Solutions/${svgFiles[currentStep]}`,`Solutions/${jsonFiles_VC[currentStep]}`);
    }

    if (mode === 'pre_calculated') {
        document.querySelector('.nav-buttons-container').style.display = 'flex';
    } else {
        document.querySelector('.nav-buttons-container').style.display = 'none';
    }
}