/*
The SolutionObject_VC class represents a solution object for voltage and current (VC) simplification steps in a circuit.
It includes properties for old and new element names, values, relations, and equations.
The class provides methods to format these properties for inline,
block, or no formatting, and to check if the object is null.
It also includes getter methods to retrieve the formatted properties.
 */
class SolutionObject_VC {
    constructor(oldName = ["N/A", "N/A", "N/A"], name1 = ["N/A", "N/A","N/A"], name2 = ["N/A","N/A","N/A"],
                oldValue = ["N/A", "N/A", "N/A"], value1 = ["N/A","N/A","N/A"], value2 = ["N/A","N/A","N/A"],
                convOldValue=["NA"],convValue1=["NA"],convValue2=["NA"],
                relation = "none", equation = ["N/A", "N/A"]) {

        this._oldName = Array.isArray(oldName) && oldName.length ? oldName : ["N/A", "N/A", "N/A"];
        this._name1 = Array.isArray(name1) && name1.length ? name1 : ["N/A","N/A","N/A"];
        this._name2 = Array.isArray(name2) && name2.length ? name2 : ["N/A","N/A","N/A"];
        this._oldValue = Array.isArray(oldValue) && oldValue.length ? oldValue : ["N/A", "N/A", "N/A"];
        this._value1 = Array.isArray(value1) && value1.length ? value1 : ["N/A", "N/A", "N/A"];
        this._value2 = Array.isArray(value2) && value2.length ? value2 : ["N/A", "N/A", "N/A"];
        this._convOldValue = Array.isArray(convOldValue) && convOldValue.length ? convOldValue : ["N/A", "N/A", "N/A"];
        this._convValue1 = Array.isArray(convValue1) && convValue1.length ? convValue1 : ["N/A", "N/A", "N/A"];
        this._convValue2 = Array.isArray(convValue2) && convValue2.length ? convValue2 : ["N/A", "N/A", "N/A"];
        this._relation = relation;
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
            !this._value1 && !this._value2 && !this._relation && !this._equation);
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
    get convOldValue() {
        return this._format(this._convOldValue);
    }

    get convValue1() {
        return this._format(this._convValue1[0]);
    }

    get convValue2() {
        return this._format(this._convValue2[0]);
    }

    get relation() {
        return this._format(this._relation);
    }

    get equation() {
        return this._format(this._equation);
    }

}