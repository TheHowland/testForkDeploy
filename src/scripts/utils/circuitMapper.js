class CircuitMapper {

    constructor(pyodide) {
        this.pyodide = pyodide
        this.files = {}
    }

    // #################################################################################################################

    async mapCircuits () {
        await this.fillFilesObject();

        for (let dir of this.circuitDirs) {
            if (dir === "acdc") {
                this.addSubAcdcCircuitMaps(dir);
            } else if (dir === "mixed") {
                this.addMixedCircuitMaps(dir);
            }
        }
        this.updateCircuitSets();
    }


    // #################################################################################################################

    _circuitsPath = "Circuits"
    _svgsPath = "Solutions"

    selectorIds = {
        subId: "sub",
        acdcId: "acdc",
        mixedId: "mixed"
    }

    _substitute = {
        identifier: this.selectorIds.subId,
        set: []
    }
    _acdc = {
        identifier: this.selectorIds.acdcId,
        set: []
    }
    _mixed = {
        identifier: this.selectorIds.mixedId,
        set: []
    }

    circuitSets = [];

    addMixedCircuitMaps(dir) {
        for (let circuitFileName of this.files[dir]) {
            let mixedCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.mixedId)
            this._mixed.set.push(mixedCircuit);
        }
    }

    addSubAcdcCircuitMaps(dir) {
        for (let circuitFileName of this.files[dir]) {
            let subCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.subId)
            let acdcCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.acdcId)
            this._substitute.set.push(subCircuit);
            this._acdc.set.push(acdcCircuit);
        }
    }

    createCircuitMap(circuitFileName, dir, id) {
        let circuitId = circuitFileName.split(".")[0]
        return {
            circuitDivID: `${circuitId}-${id}-div`,
            btn: `${circuitId}-${id}-btn`,
            btnOverlay: `${circuitId}-${id}-overlay`,
            circuitFile: circuitFileName,
            sourceDir: dir,
            svgFile: `${this._svgsPath}/${circuitId}_step0.svg`,
            selectorGroup: id
        }
    }

    updateCircuitSets() {
        this.circuitSets.push(this._substitute);
        this.circuitSets.push(this._acdc);
        this.circuitSets.push(this._mixed);
    }

    async fillFilesObject() {
        let cirArrBuff = await (await fetch(circuitPath)).arrayBuffer();
        await this.pyodide.unpackArchive(cirArrBuff, ".zip");

        this.circuitDirs = this.pyodide.FS.readdir(this._circuitsPath);
        this.circuitDirs = this.circuitDirs.filter((file) => file !== "." && file !== "..");
        this.files = {};
        for (let dir of this.circuitDirs) {
            let circuits = this.pyodide.FS.readdir(this._circuitsPath + "/" + dir);
            circuits = circuits.filter((file) => file !== "." && file !== "..");
            this.files[dir] = circuits
        }
    }
}