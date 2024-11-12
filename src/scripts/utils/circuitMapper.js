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
        this._mixed.set.sort(this._compareByCircuitDivIds);
    }

    addSubAcdcCircuitMaps(dir) {
        for (let circuitFileName of this.files[dir]) {
            let subCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.subId)
            this._substitute.set.push(subCircuit);

            // RELEASE V1.0 EXCEPTION
            // For the current release, we don't want to show complex current and voltage
            // calculation, therefore we remove all C and L Circuits from the acdc selector

            if (circuitFileName.includes("capacitor") || circuitFileName.includes("inductor")) {
            } else {
                let acdcCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.acdcId)
                this._acdc.set.push(acdcCircuit);
            }
        }
        this._substitute.set.sort(this._compareByCircuitDivIds);
        this._acdc.set.sort(this._compareByCircuitDivIds);
    }

    _compareByCircuitDivIds(a,b) {
        // circuitDivId = {circuitFileName without Extension}-{id}-div
        // Deciding comparison is done with the filename (00_res... < 01_res... < 02_res... < 10_cap...)
        if (a.circuitDivID < b.circuitDivID) {
            return -1;
        }
        if (a.circuitDivID > b.circuitDivID) {
            return 1;
        }
        return 0;
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
        if (this._acdc.set.length !== 0) {
            this.circuitSets.push(this._substitute);
            this.circuitSets.push(this._acdc);
        }
        if (this._mixed.set.length !== 0) {
            this.circuitSets.push(this._mixed);
        }
    }

    async fillFilesObject() {
        let cirArrBuff = await (await fetch(conf.sourceCircuitPath)).arrayBuffer();
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