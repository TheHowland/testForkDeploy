// ###################################################################
// If you add a new circuit, remember to add it to the set list below
// ###################################################################

// Resistors

const Resistor1 = {
    circuitDivID: "res1",
    btn: "res1-btn",
    btnOverlay: "res1-overlay",
    circuitFile: "Circuit_resistors.txt",
    svgFile: "Solutions/Circuit_resistors_step0.svg",
    selectorGroup: "substitute"
};

const Resistor2 = {
    circuitDivID: "res2",
    btn: "res2-btn",
    btnOverlay: "res2-overlay",
    circuitFile: "Circuit_resistor_task1.txt",
    svgFile: "Solutions/Circuit_resistor_task1_step0.svg",
    selectorGroup: "substitute"
};

const Resistor3 = {
    circuitDivID: "res3",
    btn: "res3-btn",
    btnOverlay: "res3-overlay",
    circuitFile: "Circuit_resistor_task2.txt",
    svgFile: "Solutions/Circuit_resistor_task2_step0.svg",
    selectorGroup: "substitute"
};

// Capacitors

const Capacitor1 = {
    circuitDivID: "cap1",
    btn: "cap1-btn",
    btnOverlay: "cap1-overlay",
    circuitFile: "Circuit_capacitors.txt",
    svgFile: "Solutions/Circuit_capacitors_step0.svg",
    selectorGroup: "substitute"
};

// Inductors

const Inductor1 = {
    circuitDivID: "ind1",
    btn: "ind1-btn",
    btnOverlay: "ind1-overlay",
    circuitFile: "Circuit_inductors.txt",
    svgFile: "Solutions/Circuit_inductors_step0.svg",
    selectorGroup: "substitute"
};

// Mixed

const Mixed1 = {
    circuitDivID: "mix1",
    btn: "mix1-btn",
    btnOverlay: "mix1-overlay",
    circuitFile: "Circuit_mixed_30.txt",
    svgFile: "Solutions/Circuit_mixed_30_step0.svg",
    selectorGroup: "mixed"
};

const Mixed2 = {
    circuitDivID: "mix2",
    btn: "mix2-btn",
    btnOverlay: "mix2-overlay",
    circuitFile: "Circuit_mixed_2pi30.txt",
    svgFile: "Solutions/Circuit_mixed_2pi30_step0.svg",
    selectorGroup: "mixed"
};

const Mixed3 = {
    circuitDivID: "mix3",
    btn: "mix3-btn",
    btnOverlay: "mix3-overlay",
    circuitFile: "Circuit_mixed_omega0.txt",
    svgFile: "Solutions/Circuit_mixed_omega0_step0.svg",
    selectorGroup: "mixed"
};

// ###################################################################
// Sets
// ###################################################################
/*
const Resistors = {
    identifier: "res",
    set: [Resistor1, Resistor2, Resistor3]
};
const Capacitors = {
    identifier: "cap",
    set: [Capacitor1]
};
const Inductors = {
    identifier: "ind",
    set: [Inductor1]
};*/
const Mixed = {
    identifier: "mix",
    set: [Mixed1, Mixed2, Mixed3]
};
const Substitute = {
    identifier: "substitute",
    set: [Resistor1, Resistor2, Resistor3, Capacitor1, Inductor1]
}


const CircuitSets = [Substitute, Mixed];