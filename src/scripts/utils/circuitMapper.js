class CircuitMapper {

    constructor(pyodide) {
        this.pyodide = pyodide
        this.files = {}
    }

    // #################################################################################################################

    async mapCircuits () {
        await this.fillFilesObject();

        for (let dir of this.circuitDirs) {
            if (dir === "quickstart") {
                this.addQuickstartCircuitMaps(dir);
            } else if (dir === "mixed") {
                this.addMixedCircuitMaps(dir);
            } else if (dir === "resistor") {
                this.addResistorCircuitMaps(dir);
            } else if (dir === "capacitor") {
                this.addCapacitorCircuitMaps(dir);
            } else if (dir === "inductor") {
                this.addInductorCircuitMaps(dir);
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

    addQuickstartCircuitMaps(dir) {
        for (let circuitFileName of this.files[dir]) {
            let quickStartCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.quick)
            this._quickstart.set.push(quickStartCircuit);
        }
        this._quickstart.set.sort(this._compareByCircuitDivIds);
    }

    addMixedCircuitMaps(dir) {
        for (let circuitFileName of this.files[dir]) {
            let mixedCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.mixedId)
            this._mixed.set.push(mixedCircuit);
        }
        this._mixed.set.sort(this._compareByCircuitDivIds);
    }

    addResistorCircuitMaps(dir) {
        for (let circuitFileName of this.files[dir]) {
            let resistorCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.res)
            this._resistor.set.push(resistorCircuit);
        }
        this._resistor.set.sort(this._compareByCircuitDivIds);
    }

    addCapacitorCircuitMaps(dir) {
        for (let circuitFileName of this.files[dir]) {
            let capacitorCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.cap)
            this._capacitor.set.push(capacitorCircuit);
        }
        this._capacitor.set.sort(this._compareByCircuitDivIds);
    }

    addInductorCircuitMaps(dir) {
        for (let circuitFileName of this.files[dir]) {
            let inductorCircuit = this.createCircuitMap(circuitFileName, dir, this.selectorIds.ind)
            this._inductor.set.push(inductorCircuit);
        }
        this._inductor.set.sort(this._compareByCircuitDivIds);
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
        await this.pyodide.unpackArchive(cirArrBuff, ".zip");

        this.circuitDirs = this.pyodide.FS.readdir(this._circuitsPath);
        this.circuitDirs = this.circuitDirs.filter((file) => file !== "." && file !== "..");
        this.files = {};
        for (let dir of this.circuitDirs) {
            let circuits = this.pyodide.FS.readdir(this._circuitsPath + "/" + dir);
            circuits = circuits.filter((file) => file !== "." && file !== ".." && !file.endsWith(".svg"));
            this.files[dir] = circuits
        }
    }
}