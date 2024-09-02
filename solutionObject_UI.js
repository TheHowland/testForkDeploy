class SolutionObject_UI {
    constructor(oldName = ["N/A", "N/A", "N/A"], name1 = ["N/A", "N/A","N/A"], name2 = ["N/A","N/A","N/A"],
                oldValue = ["N/A", "N/A", "N/A"], value1 = ["N/A","N/A","N/A"], value2 = ["N/A","N/A","N/A"],
                relation = "none", result = ["N/A","N/A"], equation = ["N/A", "N/A"]) {

        this._oldName = Array.isArray(oldName) && oldName.length ? oldName : ["N/A", "N/A", "N/A"];
        this._name1 = Array.isArray(name1) && name1.length ? name1 : ["N/A","N/A","N/A"];
        this._name2 = Array.isArray(name2) && name2.length ? name2 : ["N/A","N/A","N/A"];
        this._oldValue = Array.isArray(oldValue) && oldValue.length ? oldValue : ["N/A", "N/A", "N/A"];
        this._value1 = Array.isArray(value1) && value1.length ? value1 : ["N/A", "N/A", "N/A"];
        this._value2 = Array.isArray(value2) && value2.length ? value2 : ["N/A", "N/A", "N/A"];
        this._relation = relation;
        this._result = Array.isArray(result) && result.length ? result : ["N/A", "N/A"];
        this._equation = Array.isArray(equation) && equation.length ? equation : ["N/A", "N/A"];

        this._inlineReturnFunc = (string) => `\\(${string}\\)`;
        this._blockReturnFunc = (string) => `$$${string}$$`;

        this._returnFunction = this._inlineReturnFunc;
    }

    set returnFunction(func) {
        this._returnFunction = func;
    }

    inline() {
        this._returnFunction = this._inlineReturnFunc;
        return this;
    }

    block() {
        this._returnFunction = this._blockReturnFunc;
        return this;
    }

    noFormat() {
        this._returnFunction = (string) => string;
        return this;
    }

    _format(string) {
        return this._returnFunction(string);
    }

    isNull() {
        return (!this._oldName && !this._name1 && !this._name2 && !this._oldValue &&
            !this._value1 && !this._value2 && !this._result &&
            !this._relation && !this._equation);
    }

    get oldName() {
        return this._format(this._oldName[0]);
    }

    get name1() {
        return this._format(this._name1[0]);
    }

    get name2() {
        return this._format(this._name2[0]);
    }

    get oldValue() {
        return this._format(this._oldValue);
    }

    get value1() {
        return this._format(this._value1[0]);
    }

    get value2() {
        return this._format(this._value2[0]);
    }

    get result() {
        return this._format(this._result[0]);
    }

    get relation() {
        return this._format(this._relation);
    }

    get equation() {
        return this._format(this._equation);
    }

}