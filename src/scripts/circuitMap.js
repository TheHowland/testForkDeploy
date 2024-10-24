// ###################################################################
// If you add a new circuit, remember to add it to the set list below
// The ids for div, btn and overlay are practically arbitrary
// Just make sure the circuitFile is correct and the svgFile is
// Solutions/{circuitFile without.txt}_step0.svg
// ###################################################################

let substituteSelectorIdentifier = "sub";
let acdcSelectorIdentifier = "acdc";
let mixedSelectorIdentifier = "mixed";

// ###################################################################
// Substitute Circuits
// ###################################################################

// Resistors

const SubResistor1 = {
    circuitDivID: "sub-res1",
    btn: "sub-res1-btn",
    btnOverlay: "sub-res1-overlay",
    circuitFile: "Circuit_resistors.txt",
    svgFile: "Solutions/Circuit_resistors_step0.svg",
    selectorGroup: substituteSelectorIdentifier
};

const SubResistor2 = {
    circuitDivID: "sub-res2",
    btn: "sub-res2-btn",
    btnOverlay: "sub-res2-overlay",
    circuitFile: "Circuit_resistor_task1.txt",
    svgFile: "Solutions/Circuit_resistor_task1_step0.svg",
    selectorGroup: substituteSelectorIdentifier
};

const SubResistor3 = {
    circuitDivID: "sub-res3",
    btn: "sub-res3-btn",
    btnOverlay: "sub-res3-overlay",
    circuitFile: "Circuit_resistor_task2.txt",
    svgFile: "Solutions/Circuit_resistor_task2_step0.svg",
    selectorGroup: substituteSelectorIdentifier
};

// Capacitors

const SubCapacitor1 = {
    circuitDivID: "sub-cap1",
    btn: "sub-cap1-btn",
    btnOverlay: "sub-cap1-overlay",
    circuitFile: "Circuit_capacitors.txt",
    svgFile: "Solutions/Circuit_capacitors_step0.svg",
    selectorGroup: substituteSelectorIdentifier
};

// Inductors

const SubInductor1 = {
    circuitDivID: "sub-ind1",
    btn: "sub-ind1-btn",
    btnOverlay: "sub-ind1-overlay",
    circuitFile: "Circuit_inductors.txt",
    svgFile: "Solutions/Circuit_inductors_step0.svg",
    selectorGroup: substituteSelectorIdentifier
};
// ###################################################################
// ACDC Circuits
// ###################################################################

// Resistors

const AcdcResistor1 = {
    circuitDivID: "acdc-res1",
    btn: "acdc-res1-btn",
    btnOverlay: "acdc-res1-overlay",
    circuitFile: "Circuit_resistors.txt",
    svgFile: "Solutions/Circuit_resistors_step0.svg",
    selectorGroup: acdcSelectorIdentifier
};

const AcdcResistor2 = {
    circuitDivID: "acdc-res2",
    btn: "acdc-res2-btn",
    btnOverlay: "acdc-res2-overlay",
    circuitFile: "Circuit_resistor_task1.txt",
    svgFile: "Solutions/Circuit_resistor_task1_step0.svg",
    selectorGroup: acdcSelectorIdentifier
};

const AcdcResistor3 = {
    circuitDivID: "acdc-res3",
    btn: "acdc-res3-btn",
    btnOverlay: "acdc-res3-overlay",
    circuitFile: "Circuit_resistor_task2.txt",
    svgFile: "Solutions/Circuit_resistor_task2_step0.svg",
    selectorGroup: acdcSelectorIdentifier
};

// Capacitors

const AcdcCapacitor1 = {
    circuitDivID: "acdc-cap1",
    btn: "acdc-cap1-btn",
    btnOverlay: "acdc-cap1-overlay",
    circuitFile: "Circuit_capacitors.txt",
    svgFile: "Solutions/Circuit_capacitors_step0.svg",
    selectorGroup: acdcSelectorIdentifier
};

// Inductors

const AcdcInductor1 = {
    circuitDivID: "acdc-ind1",
    btn: "acdc-ind1-btn",
    btnOverlay: "acdc-ind1-overlay",
    circuitFile: "Circuit_inductors.txt",
    svgFile: "Solutions/Circuit_inductors_step0.svg",
    selectorGroup: acdcSelectorIdentifier
};

// ###################################################################
// Mixed Circuits
// ###################################################################

const Mixed1 = {
    circuitDivID: "mix1",
    btn: "mix1-btn",
    btnOverlay: "mix1-overlay",
    circuitFile: "Circuit_mixed_30.txt",
    svgFile: "Solutions/Circuit_mixed_30_step0.svg",
    selectorGroup: mixedSelectorIdentifier
};

const Mixed2 = {
    circuitDivID: "mix2",
    btn: "mix2-btn",
    btnOverlay: "mix2-overlay",
    circuitFile: "Circuit_mixed_2pi30.txt",
    svgFile: "Solutions/Circuit_mixed_2pi30_step0.svg",
    selectorGroup: mixedSelectorIdentifier
};

const Mixed3 = {
    circuitDivID: "mix3",
    btn: "mix3-btn",
    btnOverlay: "mix3-overlay",
    circuitFile: "Circuit_mixed_omega0.txt",
    svgFile: "Solutions/Circuit_mixed_omega0_step0.svg",
    selectorGroup: mixedSelectorIdentifier
};

// ###################################################################
// Sets
// ###################################################################

const Substitute = {
    identifier: substituteSelectorIdentifier,
    set: [SubResistor1, SubResistor2, SubResistor3, SubCapacitor1, SubInductor1]
}
const ACDC = {
    identifier: acdcSelectorIdentifier,
    set: [AcdcResistor1, AcdcResistor2, AcdcResistor3, AcdcCapacitor1, AcdcInductor1]
}
const Mixed = {
    identifier: mixedSelectorIdentifier,
    set: [Mixed1, Mixed2, Mixed3]
};

const CircuitSets = [Substitute, ACDC, Mixed];