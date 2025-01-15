class StepObject {
    step = ""
    canBeSimplified = false
    simplifiedTo = {}
    componentsRelation = ""
    components = []  // Class component
    svgData = ""
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