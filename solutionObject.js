/*
The SolutionObject class represents a solution object for circuit simplification steps.
It includes properties for element names, values, results, relations, and LaTeX equations.
The class provides methods to format these properties for inline, block, or no formatting, and to check if the object is null.
It also includes getter methods to retrieve the formatted properties.
 */
class SolutionObject {
    constructor(name1, name2, newName, value1, value2, result, relation, latexEquation) {
        this._name1 = name1;
        this._name2 = name2;
        this._newName = newName;
        this._value1 = value1;
        this._value2 = value2;
        this._result = result;
        this._relation = relation;
        this._latexEquation = latexEquation;

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
        return (!this._name1) && (!this._name2) && (!this._newName) &&
            (!this._value1) && (!this._value2) && (!this._result) &&
            (!this._relation) && (!this._latexEquation);
    }

    get name1() {
        return this._format(this._name1);
    }

    get name2() {
        return this._format(this._name2);
    }

    get newName() {
        return this._format(this._newName);
    }

    get value1() {
        return this._format(this._value1);
    }

    get value2() {
        return this._format(this._value2);
    }

    get result() {
        return this._format(this._result);
    }

    get relation() {
        return this._format(this._relation);
    }

    get latexEquation() {
        return this._format(this._latexEquation);
    }

}