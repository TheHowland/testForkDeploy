class SolutionObject_UI {
    constructor(oldName, name1, name2, oldValue, value1, value2, relation, result, equation) {
        this._oldName = Array.isArray(oldName) ? oldName : [oldName || 'N/A'];
        this._name1 = Array.isArray(name1) ? name1 : [name1 || 'N/A'];
        this._name2 = Array.isArray(name2) ? name2 : [name2 || 'N/A'];
        this._oldValue = Array.isArray(oldValue) ? oldValue : ['N/A', 'N/A', 'N/A'];
        this._value1 = Array.isArray(value1) ? value1 : [value1 || 'N/A'];
        this._value2 = Array.isArray(value2) ? value2 : [value2 || 'N/A'];
        this._relation = relation || 'N/A';
        this._result = result || 'N/A';
        this._equation = Array.isArray(equation) ? equation : ['N/A', 'N/A'];

        // Debugging: Log the initialization
        console.log("Initialized SolutionObject_UI:", this);

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
        return (!this._oldName)&&(!this._name1) && (!this._name2) && (!this._oldValue) &&
            (!this._value1) && (!this._value2) && (!this._result) &&
            (!this._relation) && (!this._equation);
    }
    get oldName(){
        return this._format(this._oldName);
    }

    get name1() {
        return this._format(this._name1);
    }

    get name2() {
        return this._format(this._name2);
    }

    get oldValue() {
        return this._format(this._oldValue);
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

    get equation() {
        return this._format(this._equation);
    }

}