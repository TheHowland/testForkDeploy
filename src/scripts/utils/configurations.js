class Configurations {
    constructor() {
        this.serverAddress = "http://localhost:8000"
        this.sourceCircuitPath = this.serverAddress + "/Circuits.zip"
        this.sourceSolvePath = this.serverAddress + "/solve.py"
        this.sourcePackageDir = this.serverAddress + "/Packages/"

        this.pyodideCircuitPath = "Circuits"
        this.pyodideSolutionsPath = "Solutions"
        this.pyodideSolvePath = "/home/pyodide/solve.py"
    }
}

