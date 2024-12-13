class CircuitMapper {

    constructor() {
        this.files = {}
    }

    // #################################################################################################################

    async mapCircuits () {
        await this.fillFilesObject();

        for (let dir of this.circuitDirs) {
            if (dir === "quickstart") {
                this.addCircuitMaps(dir, this._quickstart, this.selectorIds.quick);
            } else if (dir === "resistor") {
                this.addCircuitMaps(dir, this._resistor, this.selectorIds.res);
            } else if (dir === "capacitor") {
                this.addCircuitMaps(dir, this._capacitor, this.selectorIds.cap);
            } else if (dir === "inductor") {
                this.addCircuitMaps(dir, this._inductor, this.selectorIds.ind);
            } else if (dir === "mixed") {
                this.addCircuitMaps(dir, this._mixed, this.selectorIds.mixedId);
            } else {
                console.error("Unknown directory: " + dir);
            }
        }
        this.updateCircuitSets();
    }


    // #################################################################################################################

    _circuitsPath = "Circuits"
    _svgsPath = "Solutions"

    selectorIds = {
        quick: "quick",
        res: "res",
        cap: "cap",
        ind: "ind",
        mixedId: "mixed"
    }

    _quickstart = {
        identifier: this.selectorIds.quick,
        set: []
    }
    _mixed = {
        identifier: this.selectorIds.mixedId,
        set: []
    }
    _resistor = {
        identifier: this.selectorIds.res,
        set: []
    }
    _capacitor = {
        identifier: this.selectorIds.cap,
        set: []
    }
    _inductor = {
        identifier: this.selectorIds.ind,
        set: []
    }

    circuitSets = [];

    updateCircuitSets() {
        // This is the order in which the circuits are displayed on the selector page
        if (this._quickstart.set.length !== 0) {
            this.circuitSets.push(this._quickstart);
        }
        if (this._resistor.set.length !== 0) {
            this.circuitSets.push(this._resistor);
        }
        if (this._capacitor.set.length !== 0) {
            this.circuitSets.push(this._capacitor);
        }
        if (this._inductor.set.length !== 0) {
            this.circuitSets.push(this._inductor);
        }
        if (this._mixed.set.length !== 0) {
            this.circuitSets.push(this._mixed);
        }
    }

    addCircuitMaps(dir, set, identifier) {
        for (let circuitFileName of this.files[dir]) {
            let circuit = this.createCircuitMap(circuitFileName, dir, identifier)
            set.set.push(circuit);
        }
        set.set.sort(this._compareByCircuitDivIds);
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
            selectorGroup: id,
            overViewSvgFile: `${this._circuitsPath}/${dir}/${circuitId}_step0.svg`
        }
    }

    async fillFilesObject() {
        let cirArrBuff = await (await fetch(conf.sourceCircuitPath)).arrayBuffer();
        await state.pyodide.unpackArchive(cirArrBuff, ".zip");

        this.circuitDirs = state.pyodide.FS.readdir(this._circuitsPath);
        this.circuitDirs = this.circuitDirs.filter((file) => file !== "." && file !== "..");
        this.files = {};
        for (let dir of this.circuitDirs) {
            let circuits = state.pyodide.FS.readdir(this._circuitsPath + "/" + dir);
            circuits = circuits.filter((file) => file !== "." && file !== ".." && !file.endsWith(".svg"));
            this.files[dir] = circuits
        }
    }
}