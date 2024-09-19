/*
The SolutionObject_VC class represents a solution object for voltage and current (VC) simplification steps in a circuit.
It includes properties for old and new element names, values, relations, and equations.
The class provides methods to format these properties for inline,
block, or no formatting, and to check if the object is null.
It also includes getter methods to retrieve the formatted properties.
 */
class SolutionObject_VC {
    constructor(oldNames = ["N/A", "N/A", "N/A"], names1 = ["N/A", "N/A","N/A"], names2 = ["N/A","N/A","N/A"],
                oldValues = ["N/A", "N/A", "N/A"], values1 = ["N/A","N/A","N/A"], values2 = ["N/A","N/A","N/A"],
                convOldValue=["NA"],convValue1=["NA"],convValue2=["NA"],
                relation = "none", equation = ["N/A", "N/A"]) {

        this._oldNames = Array.isArray(oldNames) && oldNames.length ? oldNames : ["N/A", "N/A", "N/A"];
        this._names1 = Array.isArray(names1) && names1.length ? names1 : ["N/A","N/A","N/A"];
        this._names2 = Array.isArray(names2) && names2.length ? names2 : ["N/A","N/A","N/A"];
        this._oldValues = Array.isArray(oldValues) && oldValues.length ? oldValues : ["N/A", "N/A", "N/A"];
        this._values1 = Array.isArray(values1) && values1.length ? values1 : ["N/A", "N/A", "N/A"];
        this._values2 = Array.isArray(values2) && values2.length ? values2 : ["N/A", "N/A", "N/A"];
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
        return (!this._oldNames && !this._names1 && !this._names2 && !this._oldValues &&
                !this._values1 && !this._values2 && !this._convOldValue &&
                !this._convValue1 && !this._convValue2 &&
                !this._relation && !this._equation);
    }

    get oldNames() {
        return this._format(this._oldNames[0]);
    }

    get names1() {
        return this._format(this._names1[0]);
    }

    get names2() {
        return this._format(this._names2[0]);
    }

    get oldValues() {
        return this._format(this._oldValues);
    }

    get values1() {
        return this._format(this._values1[0]);
    }

    get values2() {
        return this._format(this._values2[0]);
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