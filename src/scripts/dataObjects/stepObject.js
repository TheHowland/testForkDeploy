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
    components = []
    componentTypes = ""
    svgData = ""
}

class Source {
    type = ""
    omega_0 = ""
    val = ""
}