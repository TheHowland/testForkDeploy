class StepObject {
    step = ""
    canBeSimplified = false
    simplifiedTo = {}
    componentsRelation = ""
    components = []  // Class component
    allComponents = []  // Class component
    svgData = ""

    getZVal(component) {
        return component.hasConversion ? component.Z.val : component.Z.complexVal
    }

    getComponentTypes() {
        let r, l, c = false
        this.components.forEach((component) => {
            if (component.Z.name.includes("R")) {
                r = true
            } else if (component.Z.name.includes("L")) {
                l = true
            } else if (component.Z.name.includes("C")) {
                c = true
            }
        })
        if (r && l && c) {
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
        complexVal: "",
        val: ""
    }
    U = {
        name: "",
        val: "",
    }
    I = {
        name: "",
        val: "",
    }
    hasConversion = false
}

class Step0Object {
    step = ""
    source = []  // Class Source
    components = []  // TODO allComponents
    componentTypes = ""
    svgData = ""
}

class Source {
    type = ""
    omega_0 = ""
    val = ""
}