class SolutionObject_UI {
    constructor(oldName = ["N/A", "N/A", "N/A"], name1 = ["N/A"], name2 = ["N/A"],
                oldValue = ["N/A", "N/A", "N/A"], value1 = ["N/A"], value2 = ["N/A"],
                relation = "none", result = ["N/A"], equation = ["N/A", "N/A"]) {

        this._oldName = Array.isArray(oldName) && oldName.length ? oldName : ["N/A", "N/A", "N/A"];
        this._name1 = Array.isArray(name1) && name1.length ? name1 : ["N/A"];
        this._name2 = Array.isArray(name2) && name2.length ? name2 : ["N/A"];
        this._oldValue = Array.isArray(oldValue) && oldValue.length ? oldValue : ["N/A", "N/A", "N/A"];
        this._value1 = Array.isArray(value1) && value1.length ? value1 : ["N/A"];
        this._value2 = Array.isArray(value2) && value2.length ? value2 : ["N/A"];
        this._relation = relation;
        this._result = Array.isArray(result) && result.length ? result : ["N/A"];
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

// Beispiel JSON-Inhalt (kann durch ein echtes JSON-File ersetzt werden)
const jsonContent= require('C:\\Users\\Lucky\\HiWi_Kray_Arbeit\\inskale\\Pyodide\\Solutions_VC\\Circuit_resistor_task1_step0.json');

// Simulation des Einlesens der JSON-Datei
function testSolutionObjectUI() {
    // Initialisieren des SolutionObject_UI mit den JSON-Daten
    let data_ui = new SolutionObject_UI(
        jsonContent.oldName, jsonContent.name1, jsonContent.name2,
        jsonContent.oldValue, jsonContent.value1, jsonContent.value2,
        jsonContent.relation, jsonContent.result, jsonContent.equation
    );

    // Temporär LaTeX-Formatierung deaktivieren
    data_ui.noFormat();

    // Ausgabe des initialisierten Objekts in der Konsole
    console.log("Initialized SolutionObject_UI (no format): ", data_ui);

    // Überprüfung der Werte
    console.log("Old Name:", data_ui.oldName);
    console.log("Name1:", data_ui.name1);
    console.log("Name2:", data_ui.name2);
    console.log("Old Value:", data_ui.oldValue);
    console.log("Value1:", data_ui.value1);
    console.log("Value2:", data_ui.value2);
    console.log("Relation:", data_ui.relation);
    console.log("Result:", data_ui.result);
    console.log("Equation:", data_ui.equation);
}

// Führen Sie das Testszenario aus
testSolutionObjectUI();
