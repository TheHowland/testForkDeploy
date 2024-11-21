// Containing all the necessary information for everything to work,
// compact in one object (what otherwise would be global variables)

class StateObject {
    //Tracks the current step in the circuit simplification process.
    currentStep = 0;

    //Array to store JSON file paths for Z simplification steps.
    jsonFiles_Z = [];

    // Array to store JSON file paths for VC simplification steps.
    jsonFiles_VC = [];

    //Array to store SVG file paths for circuit diagrams.
    svgFiles = [];

    //Array to store the names of the circuit files.
    circuitFiles = [];

    //Array to store selected elements in the circuit.
    selectedElements = [];

    //Stores the currently selected circuit map
    currentCircuitMap;

    //The Python module imported from the Pyodide environment for solving circuits.
    solve;

    //Boolean to track if the Pyodide environment is ready.
    pyodideReady = false;
    pyodideLoading = false;

    //To count how many svgs are on the screen right now
    pictureCounter = 0;
}