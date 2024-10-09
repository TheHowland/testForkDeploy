/*
The SolutionObject_VC class represents a solution object for voltage and current (VC) simplification steps in a circuit.
It includes properties for old and new element names, values, relations, and equations.
The class provides methods to format these properties for inline,
block, or no formatting, and to check if the object is null.
It also includes getter methods to retrieve the formatted properties.
 */
class SolutionObject_VC {
    constructor(oldNames = [null, null, null], names1 = [null, null, null], names2 = [null, null, null],
                oldValues = [null, null, null], values1 = [null, null, null], values2 = [null, null, null],
                convOldValue=[null],convValue1=[null],convValue2=[null],
                relation = "none", equation = [null, null]) {

        this._oldNames = oldNames;
        this._names1 = names1;
        this._names2 = names2;
        this._oldValues = oldValues;
        this._values1 = values1;
        this._values2 = values2;
        this._convOldValue = convOldValue;
        this._convValue1 = convValue1;
        this._convValue2 = convValue2;
        this._relation = relation;
        this._equation = equation;

        this._inlineReturnFunc = (string) => {
            if (Array.isArray(string)){
                return string.map(string => `\\(${string}\\)`);
            }
            return `\\(${string}\\)`;
        };

        this._blockReturnFunc = (string) => {
            if (Array.isArray(string)){
                return string.map(string => `$$${string}$$`);
            }
            return `$$${string}$$`;
        };
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
        return this._format(this._oldNames);
    }

    get names1() {
        return this._format(this._names1);
    }

    get names2() {
        return this._format(this._names2);
    }

    get oldValues() {
        return this._format(this._oldValues);
    }

    get values1() {
        return this._format(this._values1);
    }

    get values2() {
        return this._format(this._values2);
    }
    get convOldValue() {
        return this._format(this._convOldValue);
    }

    get convValue1() {
        return this._format(this._convValue1);
    }

    get convValue2() {
        return this._format(this._convValue2);
    }

    get relation() {
        return this._format(this._relation);
    }

    get equation() {
        return this._format(this._equation);
    }

}