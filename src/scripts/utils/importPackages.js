async function import_packages(pyodide) {
    let packages = ["matplotlib", "numpy", "sympy", "networkx", "IPython", "schemdraw", "ordered_set", "lcapy"];
    progressBar = document.getElementById("pgr-bar");
    progressBarContainer = document.getElementById("pgr-bar-container");
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
    document.getElementById('start-button').disabled = false;
}