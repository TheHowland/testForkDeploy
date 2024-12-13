class StepDetails {
    constructor(showVC, jsonZPath, jsonVCPath, svgPath, circuitInfo) {
        this.showVCData = showVC;
        this.jsonZPath = jsonZPath;
        this.jsonVCPath = jsonVCPath;
        this.svgPath = svgPath;
        this.circuitInfo = circuitInfo;
    }

    getComponentTypes() {
        let componentTypes = this.circuitInfo["componentTypes"];
        if (componentTypes === undefined || componentTypes === null) {
            console.error("Component types not found in circuit info");
        }
        if (componentTypes === "R" || componentTypes === "C" || componentTypes === "L" || componentTypes === "RLC") {
            return componentTypes;
        }
        console.error("Invalid component types found in circuit info: " + componentTypes);
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