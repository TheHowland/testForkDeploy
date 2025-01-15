class stepObject {
    constructor() {
        this.step = ""
        this.canBeSimplified = false
        this.simplifiedTo = {}
        this.componentsRelation = ""
        this.components = []
        this.svgData = ""
    }
}

class component {
    constructor() {
        this.Z = {
            name: "",
            complexVal: "",
            val: ""
        }
        this.U = {
            name: "",
            val: "",
        }
        this.I = {
            name: "",
            val: "",
        }
        this.hasConversion = false
    }
}