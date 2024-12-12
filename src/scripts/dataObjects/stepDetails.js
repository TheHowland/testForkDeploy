class StepDetails {
    constructor(showVC, jsonZPath, jsonVCPath, svgPath, circuitInfo) {
        this.showVCData = showVC;
        this.jsonZPath = jsonZPath;
        this.jsonVCPath = jsonVCPath;
        this.svgPath = svgPath;
        this.circuitInfo = circuitInfo;
    }

    getComponentTypes() {
        // TODO Add check
        return this.circuitInfo["componentTypes"];
    }
    getOmegaVal() {
        return this.circuitInfo["omega_0"];
    }
    getElementNamesAndValues() {
        // Return source and all elements
        let obj = structuredClone(this.circuitInfo);
        delete obj["omega_0"];
        delete obj["componentTypes"];
        return obj;

    }
}