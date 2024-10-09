async function import_packages(pyodide) {
    let packages = ["matplotlib", "numpy", "sympy", "networkx", "IPython", "schemdraw", "ordered_set", "lcapy"];
    createProgressBar("Importing packages into python Interpreter...");
    updateProgressBar(0);

    let progress = 0;
    for(const packageName of packages){
        await pyodide.runPythonAsync("import " + packageName)
        progress += 1;
        console.log("finished:" + packageName)
        updateProgressBar(Math.floor((progress / packages.length) * 100))
    }

    console.log("Imported: " + packages);
    await removeProgressBar();
    pyodideReady = true;
    document.getElementById('start-button').disabled = false;
}