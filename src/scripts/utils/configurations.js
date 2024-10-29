class Configurations {
    constructor(srvAdr, circPath, solveFilePath, pckDir) {
        this.serverAddress = srvAdr
        this.circuitPath = this.serverAddress + circPath
        this.solveFilePath = this.serverAddress + solveFilePath
        this.packageDir = this.serverAddress + pckDir
    }
}