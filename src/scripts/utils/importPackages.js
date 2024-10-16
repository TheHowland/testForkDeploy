function enableStartButtonsOnCircuitSelectors() {
    document.getElementById(Resistor1.btn).disabled = false;
    document.getElementById(Resistor2.btn).disabled = false;
    document.getElementById(Resistor3.btn).disabled = false;
}

async function import_packages(pyodide) {
    let packages = ["matplotlib", "numpy", "sympy", "networkx", "IPython", "schemdraw", "ordered_set", "lcapy"];
    progressBar = document.getElementById("pgr-bar");
    progressBarContainer = document.getElementById("pgr-bar-container");
    // set the bar to 40% because we already did some stuff
    // this will enable us to start the new calculation from a fixed point
    progressBar.style.width = "40%";

    let progress = 0;
    for(const packageName of packages){
        await pyodide.runPythonAsync("import " + packageName)
        progress += 1;
        console.log("finished:" + packageName)
        let percent = 40 + Math.floor((progress / packages.length) * (100 - 40));
        progressBar.style.width = String(percent)+"%";
    }

    console.log("Imported: " + packages);

    progressBarContainer.style.display = "none";
    pyodideReady = true;
    //enableStartButtonsOnCircuitSelectors();
}