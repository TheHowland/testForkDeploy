class CircuitMapper {

    constructor() {
        this.files = {}
    }

    // #################################################################################################################

    async mapCircuits () {
        await this.fillFilesObject();

        for (let dir of this.circuitDirs) {
            if (dir === allowedDirNames.quickstart) {
                this.addCircuitMaps(dir, this._quickstart, this.selectorIds.quick);
            } else if (dir === allowedDirNames.resistor) {
                this.addCircuitMaps(dir, this._resistor, this.selectorIds.res);
            } else if (dir === allowedDirNames.capacitor) {
                this.addCircuitMaps(dir, this._capacitor, this.selectorIds.cap);
            } else if (dir === allowedDirNames.inductor) {
                this.addCircuitMaps(dir, this._inductor, this.selectorIds.ind);
            } else if (dir === allowedDirNames.mixed) {
                this.addCircuitMaps(dir, this._mixed, this.selectorIds.mixedId);
            } else if (dir === allowedDirNames.symbolic) {
                this.addCircuitMaps(dir, this._symbolic, this.selectorIds.symbolic);
            } else {
                console.error("Unknown directory: " + dir);
                console.error("Allowed Names: " + Object.values(allowedDirNames));
                console.info("See allowedDirNames.js for more information");
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
        mixedId: "mixed",
        symbolic: "sym",
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
    _symbolic = {
        identifier: this.selectorIds.symbolic,
        set: []
    }

    circuitSets = [];

    updateCircuitSets() {
        // This is the order in which the circuits are displayed on the selector page
        if (this._quickstart.set.length !== 0) {
            this.circuitSets.push(this._quickstart);
        }
        if (this._symbolic.set.length !== 0) {
            this.circuitSets.push(this._symbolic);
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
        if (!Object.values(this.selectorIds).includes(identifier)) {
            console.error("Unknown identifier: " + identifier);
            console.error("Allowed Identifiers: " + Object.values(this.selectorIds));
        }

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
        let result = this.readVoltageAndFreq(`${this._circuitsPath}/${dir}/${circuitId}.txt`);
        if (result === null) {
            console.error("No voltage or frequency found in file: " + circuitFileName);
        }
        return {
            circuitDivID: `${circuitId}-${id}-div`,
            btn: `${circuitId}-${id}-btn`,
            btnOverlay: `${circuitId}-${id}-overlay`,
            circuitFile: circuitFileName,
            sourceDir: dir,
            svgFile: `${this._svgsPath}/${circuitId}_step0.svg`,
            selectorGroup: id,
            overViewSvgFile: `${this._circuitsPath}/${dir}/${circuitId}_step0.svg`,
            voltage: result.voltage,
            frequency: result.frequency
        }
    }

    readVoltageAndFreq(path) {
        let file = state.pyodide.FS.readFile(path, {encoding: "utf8"});
        const lines = file.split('\n');

        for (let line of lines) {
            const matchDC = line.match(/^V\d+ \d+ \d+ dc \{(.*?)\}/);
            const matchAC = line.match(/^V\d+ \d+ \d+ ac \{(.*?)\} \{.*?\} \{(.*?)\}/);

            if (matchDC) {
                return { voltage: matchDC[1] + "V", frequency: null };
            } else if (matchAC) {
                let omegaStr = matchAC[2].trim();
                let frequency;
                if (omegaStr.includes("2*pi")) {
                    omegaStr = omegaStr.replace(/pi/g, "Math.PI");
                }
                frequency = eval(omegaStr.replace(/pi/g, "Math.PI")) / (2 * Math.PI);
                return { voltage: matchAC[1] + "V", frequency: this.formatFrequency(Math.round(frequency))};
            }
        }

        return null;
    }

    formatFrequency(frequency) {
        if (frequency >= 1e9) {
            return (frequency / 1e9).toFixed(1) + 'GHz';
        } else if (frequency >= 1e6) {
            return (frequency / 1e6).toFixed(1) + 'MHz';
        } else if (frequency >= 1e3) {
            return (frequency / 1e3).toFixed(1) + 'kHz';
        } else {
            return frequency + 'Hz';
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