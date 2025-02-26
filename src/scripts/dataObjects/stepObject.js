class StepObject {
    step = ""
    canBeSimplified = false
    simplifiedTo = {}
    componentsRelation = ""
    components = []  // Class component
    allComponents = []  // Class component
    svgData = ""

    getZVal(component) {
        return component.hasConversion ? component.Z.val : component.Z.impedance;
    }

    getComponentTypes() {
        let r, l, c, z = false
        this.components.forEach((component) => {
            if (component.Z.name.includes("R")) {
                r = true
            } else if (component.Z.name.includes("L")) {
                l = true
            } else if (component.Z.name.includes("C")) {
                c = true
            } else if (component.Z.name.includes("Z")) {
                z = true
            }
        })
        if (z) {
            return "Z"
        } else if (r && l && c) {
            return "RLC"
        } else if (r && l) {
            return "RL"
        } else if (r && c) {
            return "RC"
        } else if (l && c) {
            return "LC"
        } else if (r) {
            return "R"
        } else if (l) {
            return "L"
        } else if (c) {
            return "C"
        }
    }
}

class component {
    Z = {
        name: "",
        impedance: "",
        cpxVal: "",  // with j
        re: "", // Real part
        im: "", // Imaginary part
        phase: "",
        val: ""  // C, R or L
    }
    U = {
        name: "",
        val: "",  // magnitude (amplitude)
        phase: "",
    }
    I = {
        name: "",
        val: "",
        phase: "",
    }
    hasConversion = false
}

class Step0Object {
    step = ""
    source = {}  // Class Source
    allComponents = []  // Class component
    componentTypes = ""
    svgData = ""
}

class Source {
    type = ""
    omega_0 = ""
    sources = {} // Class components
}
