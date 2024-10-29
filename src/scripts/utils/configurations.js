class Configurations {
    constructor(serverAddress, sourceCircuitPath, sourceSolvePath, sourcePackageDir,
                pyodideCircuitPath, pyodideSolutionsPath, pyodideSolvePath) {
        this.serverAddress = serverAddress
        this.sourceCircuitPath = this.serverAddress + sourceCircuitPath
        this.sourceSolvePath = this.serverAddress + sourceSolvePath
        this.sourcePackageDir = this.serverAddress + sourcePackageDir

        this.pyodideCircuitPath = pyodideCircuitPath
        this.pyodideSolutionsPath = pyodideSolutionsPath
        this.pyodideSolvePath = pyodideSolvePath
    }
}