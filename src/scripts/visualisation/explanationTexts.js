// Generates a paragraph describing the resistance simplification step
function generateTextForZ(stepObject) {
    let relation = stepObject.componentsRelation;
    const paragraphElement = document.createElement('p');
    paragraphElement.classList.add("explText");
    const firstPart = getElementsAndRelationDescription(stepObject);

    // Calculation descriptions are swapped for R/L and C
    if (state.step0Data.componentTypes === "R" || state.step0Data.componentTypes === "L") {
        if (relation === "series") {
            paragraphElement.innerHTML = firstPart + getAdditionCalculation(stepObject)
        } else if (relation === "parallel") {
            paragraphElement.innerHTML = firstPart + getReciprocalCalculation(stepObject)
        }
    } else if (state.step0Data.componentTypes === "C") {
        if (relation === "parallel") {
            paragraphElement.innerHTML = firstPart + getAdditionCalculation(stepObject);
        } else if (relation === "series") {
            paragraphElement.innerHTML = firstPart + getReciprocalCalculation(stepObject);
        }
    } else if (state.step0Data.componentTypes === "RLC") {
        // This can still be R, L, C, RC, RL, LC, RLC, needs to be checked
        if (relation === "series") {
            paragraphElement.innerHTML = firstPart + getComplexSeriesCalculation(stepObject)
        } else if (relation === "parallel") {
            paragraphElement.innerHTML = firstPart + getComplexParallelCalculation(stepObject)
        }
    } else {
        console.log("No component type found: ", state.step0Data.componentTypes);
    }
    return paragraphElement;
}

function getComplexSeriesCalculation(stepObject) {
    let cptTypes = stepObject.getComponentTypes();
    if (["R", "L"].includes(cptTypes)) return getAdditionCalculation(stepObject);
    if (["C"].includes(cptTypes)) return getReciprocalCalculation(stepObject);
    if (["Z", "RC", "RL", "LC", "RLC"].includes(cptTypes)) return getComplexAdditionCalculation(stepObject);
    return "It seems like we don't have an explanation for this step yet, sorry :(";
}

function getComplexParallelCalculation(stepObject) {
    let cptTypes = stepObject.getComponentTypes();
    if (["R", "L"].includes(cptTypes)) return getReciprocalCalculation(stepObject);
    if (["C"].includes(cptTypes)) return getAdditionCalculation(stepObject);
    if (["Z", "RC", "RL", "LC", "RLC"].includes(cptTypes)) return getComplexReciprocalCalculation(stepObject);
    return "It seems like we don't have an explanation for this step yet, sorry :(";
}

function getLorCtoZExplanations(stepObject) {
    let str = "";
    for (let component of stepObject.components) {
        if (component.Z.name.includes("C")) {
            str += `${languageManager.currentLang.complexImpedanceHeading} \\(\\mathbf{Z_{${component.Z.name}}}\\)<br>`;
            str += `$$\\mathbf{Z_{${component.Z.name}}} = \\frac{-j}{2\\pi f ${component.Z.name}}$$`;
            str += `$$\\mathbf{Z_{${component.Z.name}}} = ${component.Z.cpxVal}$$<br>`;
        }
        if (component.Z.name.includes("L")) {
            str += `${languageManager.currentLang.complexImpedanceHeading} \\(\\mathbf{Z_{${component.Z.name}}}\\)<br>`;
            str += `$$\\mathbf{Z_{${component.Z.name}}} = j \\cdot 2\\pi f ${component.Z.name}$$`;
            str += `$$\\mathbf{Z_{${component.Z.name}}} = ${component.Z.cpxVal}$$<br>`;
        }
    }
    return str;
}

function getComplexAdditionCalculation(stepObject) {
    let str = "";
    str += "<br><br>";

    // Generate Zl or Zc explanations
    str += getLorCtoZExplanations(stepObject);

    // Add all Z
    str += `${languageManager.currentLang.complexImpedanceHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    str += `$$\\mathbf{${stepObject.simplifiedTo.Z.name}} = `;
    for (let component of stepObject.components) {
        if (component.Z.name.includes("Z")) {
            str += `\\mathbf{${component.Z.name}} + `;
        } else {
            str += `\\mathbf{Z_{${component.Z.name}}} + `;
        }
    }
    str = str.slice(0, -3);  // remove last +
    str += `$$`;

    str += `$$\\mathbf{${stepObject.simplifiedTo.Z.name}} = `;
    for (let component of stepObject.components) {
        str += `${component.Z.cpxVal} + `;
    }
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    // Carthesian
    str += `$$\\mathbf{${stepObject.simplifiedTo.Z.name}} = ${stepObject.simplifiedTo.Z.cpxVal}$$`;
    // Absolute value
    str += `$$|\\mathbf{${stepObject.simplifiedTo.Z.name}}| = \\sqrt{(${stepObject.simplifiedTo.Z.re}\\Omega)^2 + (${stepObject.simplifiedTo.Z.im}\\Omega)^2} $$`;
    str += `$$|\\mathbf{${stepObject.simplifiedTo.Z.name}}| = ${stepObject.simplifiedTo.Z.impedance}$$`;
    // Phase
    str += `$$\\varphi = \\arctan(\\frac{${stepObject.simplifiedTo.Z.im}}{${stepObject.simplifiedTo.Z.re}}) = ${stepObject.simplifiedTo.Z.phase}$$`;
    // Polar
    str += `$$\\mathbf{${stepObject.simplifiedTo.Z.name}} = ${toPolar(stepObject.simplifiedTo.Z.impedance, stepObject.simplifiedTo.Z.phase)}$$`;

    // At this point we know we simplify to a complex impedance, if however we find that simplifiedTo.Z.name
    // contains either L or C, we know that we can calculate the complex value back to L or C
    if (stepObject.simplifiedTo.Z.name.includes("L")) {
        str += `$$(${stepObject.simplifiedTo.Z.name} = \\frac{\\mathbf{${stepObject.simplifiedTo.Z.name}}}{j2\\pi f} = ${stepObject.simplifiedTo.Z.val})$$<br>`;
    }
    if (stepObject.simplifiedTo.Z.name.includes("C")) {
        str += `$$(${stepObject.simplifiedTo.Z.name} = \\frac{-j}{2\\pi f \\mathbf{${stepObject.simplifiedTo.Z.name}}} = ${stepObject.simplifiedTo.Z.val})$$<br>`;
    }

    return str;
}

function getComplexReciprocalCalculation(stepObject) {
    let str = "";
    str += "<br><br>";

    // Generate Zl or Zc explanations
    str += getLorCtoZExplanations(stepObject);

    // Add all Z
    str += `${languageManager.currentLang.complexImpedanceHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    str += `$$\\frac{1}{${stepObject.simplifiedTo.Z.name}} = `;
    for (let component of stepObject.components) {
        if (component.Z.name.includes("Z")) {
            str += `\\frac{1}{${component.Z.name}} + `;
        } else {
            str += `\\frac{1}{Z_{${component.Z.name}}} + `;
        }
    }
    str = str.slice(0, -3);  // remove last +
    str += `$$`;

    str += `$$\\frac{1}{${stepObject.simplifiedTo.Z.name}} = `;
    for (let component of stepObject.components) {
        str += `\\frac{1}{${component.Z.cpxVal}} + `;
    }
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    // Carthesian
    str += `$$\\mathbf{${stepObject.simplifiedTo.Z.name}} = ${stepObject.simplifiedTo.Z.cpxVal}$$`;
    // Absolute value
    str += `$$|\\mathbf{${stepObject.simplifiedTo.Z.name}}| = \\sqrt{(${stepObject.simplifiedTo.Z.re}\\Omega)^2 + (${stepObject.simplifiedTo.Z.im}\\Omega)^2} $$`;
    str += `$$|\\mathbf{${stepObject.simplifiedTo.Z.name}}| = ${stepObject.simplifiedTo.Z.impedance}$$`;
    // Phase
    str += `$$\\varphi = \\arctan(\\frac{${stepObject.simplifiedTo.Z.im}}{${stepObject.simplifiedTo.Z.re}}) = ${stepObject.simplifiedTo.Z.phase}$$`;
    // Polar
    str += `$$\\mathbf{${stepObject.simplifiedTo.Z.name}} = ${toPolar(stepObject.simplifiedTo.Z.impedance, stepObject.simplifiedTo.Z.phase)}$$`;

    // At this point we know we simplify to a complex impedance, if however we find that simplifiedTo.Z.name
    // contains either L or C, we know that we can calculate the complex value back to L or C
    if (stepObject.simplifiedTo.Z.name.includes("L")) {
        str += `$$(${stepObject.simplifiedTo.Z.name} = \\frac{\\mathbf{${stepObject.simplifiedTo.Z.name}}}{j2\\pi f} = ${stepObject.simplifiedTo.Z.val})$$<br>`;
    }
    if (stepObject.simplifiedTo.Z.name.includes("C")) {
        str += `$$(${stepObject.simplifiedTo.Z.name} = \\frac{-j}{2\\pi f \\mathbf{${stepObject.simplifiedTo.Z.name}}} = ${stepObject.simplifiedTo.Z.val})$$<br>`;
    }

    return str;
}

function generateTextForVoltageCurrent(stepObject) {
    let relation = stepObject.componentsRelation;
    const text = document.createElement('p');
    text.classList.add("explText");

    if (relation === "series") {
        text.innerHTML = getSeriesVCDescription(stepObject);
    } else if (relation === "parallel") {
        text.innerHTML = getParallelVCDescription(stepObject);
    } else {
        text.innerHTML = languageManager.currentLang.relationTextNoRelation;
    }
    return text;
}

function getTotalCurrent(stepObject) {
    let str = "";
    let sfx = languageManager.currentLang.totalSuffix;
    if ([circuitMapper.selectorIds.cap, circuitMapper.selectorIds.ind, circuitMapper.selectorIds.mixed].includes(state.currentCircuitMap.selectorGroup)) {
        sfx += "," + languageManager.currentLang.effectiveSuffix;
    }

    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$I_{${sfx}} = \\frac{${languageManager.currentLang.voltageSymbol}_{${sfx}}}{${stepObject.simplifiedTo.Z.name}}$$`
    } else {
        str += `$$I_{${sfx}} = \\frac{${languageManager.currentLang.voltageSymbol}_{${sfx}}}{Z_{${stepObject.simplifiedTo.Z.name}}}$$`
    }

    str += `$$I_{${sfx}} = \\frac{${stepObject.simplifiedTo.U.val}}{${stepObject.simplifiedTo.Z.impedance}}$$`;
    str += `$$I_{${sfx}} = ${stepObject.simplifiedTo.I.val}$$`;
    return str;
}

function getComplexTotalCurrent(stepObject) {
    let str = "";
    let sfx = languageManager.currentLang.totalSuffix;
    if ([circuitMapper.selectorIds.cap, circuitMapper.selectorIds.ind, circuitMapper.selectorIds.mixed].includes(state.currentCircuitMap.selectorGroup)) {
        sfx += "," + languageManager.currentLang.effectiveSuffix;
    }

    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$\\mathbf{I_{${sfx}}} = \\frac{\\mathbf{${languageManager.currentLang.voltageSymbol}_{${sfx}}}}{\\mathbf{${stepObject.simplifiedTo.Z.name}}}$$`
    } else {
        str += `$$\\mathbf{I_{${sfx}}} = \\frac{\\mathbf{${languageManager.currentLang.voltageSymbol}_{${sfx}}}}{\\mathbf{Z_{${stepObject.simplifiedTo.Z.name}}}}$$`
    }

    str += `$$\\mathbf{I_{${sfx}}} = \\frac{${stepObject.simplifiedTo.U.val}}{${toPolar(stepObject.simplifiedTo.Z.impedance, stepObject.simplifiedTo.Z.phase)}}$$`;
    str += `$$\\mathbf{I_{${sfx}}} = ${toPolar(stepObject.simplifiedTo.I.val, stepObject.simplifiedTo.I.phase)}$$`;
    return str;
}


function generateTextForTotalCurrent(stepObject) {
    if (state.step0Data.componentTypes === "RLC") {
        return getComplexTotalCurrent(stepObject);
    } else {
        return getTotalCurrent(stepObject);
    }
}

function getRelationText(stepObject) {
    let relationText = "";
    if (stepObject.componentsRelation === "parallel") {
        relationText = languageManager.currentLang.relationTextParallel;
    } else if (stepObject.componentsRelation === "series") {
        relationText = languageManager.currentLang.relationTextSeries;
    } else if (stepObject.componentsRelation === null) {
        relationText = languageManager.currentLang.relationTextNoRelation;
    } else {
        console.log("No components relation found: ", stepObject.componentsRelation);
    }
    return relationText;
}

function getElementsAndRelationDescription(stepObject) {
    let relationText = getRelationText(stepObject);
    let str = `${languageManager.currentLang.theElements}<br>`;
    stepObject.components.forEach((component) => {str+= `\\(${component.Z.name}\\) `;});
    str += `<br>${languageManager.currentLang.areSimplifiedTo} \\(${stepObject.simplifiedTo.Z.name}\\)<br><br>`;
    stepObject.components.forEach((component) => {str+= `\\(${component.Z.name}\\)&nbsp= \\(${stepObject.getZVal(component)}\\)<br>`;});
    str += `<br>${relationText}<br>`;
    return str;
}

function getReciprocalCalculation(stepObject) {
    // creates 1/X = 1/X1 + 1/X2
    // Use block MJ ('$$') to make sure formulas are horizontally scrollable if too long

    if (currentCircuitIsSymbolic()) {
        return `$$${stepObject.simplifiedTo.Z.name} = ${stepObject.getZVal(stepObject.simplifiedTo)}$$`;
    }
    
    let str = "";
    str += `$$\\frac{1}{${stepObject.simplifiedTo.Z.name}} = `;
    stepObject.components.forEach((component) => {str+= `\\frac{1}{${component.Z.name}} + `});
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    str += `$$\\frac{1}{${stepObject.simplifiedTo.Z.name}} = `;
    stepObject.components.forEach((component) => {str+= `\\frac{1}{${stepObject.getZVal(component)}} + `});
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    str += `$$\\frac{1}{${stepObject.simplifiedTo.Z.name}} = \\frac{1}{${stepObject.getZVal(stepObject.simplifiedTo)}}$$ <br>`;
    // No need for '$$', inline is ok
    str += `\\(${stepObject.simplifiedTo.Z.name} = ${stepObject.getZVal(stepObject.simplifiedTo)}\\) <br>`;
    return str;
}

function getAdditionCalculation(stepObject) {
    // creates X = X1 + X2
    // Use block MJ ('$$') to make sure formulas are horizontally scrollable if too long

    if (currentCircuitIsSymbolic()) {
        return `$$${stepObject.simplifiedTo.Z.name} = ${stepObject.getZVal(stepObject.simplifiedTo)}$$`;
    }

    let str = "";
    str += `$$${stepObject.simplifiedTo.Z.name} = `;
    stepObject.components.forEach((component) => {str+= `${component.Z.name} + `});
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    str += `$$${stepObject.simplifiedTo.Z.name} = `;
    stepObject.components.forEach((component) => {str+= `${stepObject.getZVal(component)} + `});
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    // No need for '$$', inline is ok
    str += `\\(${stepObject.simplifiedTo.Z.name} = ${stepObject.getZVal(stepObject.simplifiedTo)}\\) <br>`;
    return str;
}

function getSymbolicSeriesVCDescription(stepObject) {
    let str = "";
    // Calculate current
    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.name}}{${stepObject.simplifiedTo.Z.name}}$$`;
    } else {
        str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.name}}{Z_{${stepObject.simplifiedTo.Z.name}}}$$`;
    }
    str += `$$${stepObject.simplifiedTo.I.name} = ${stepObject.simplifiedTo.I.val}$$<br>`;
    // Text
    str += `${languageManager.currentLang.relationTextSeries}.<br>`;
    str += `${languageManager.currentLang.currentStaysTheSame}.<br>`;
    str += `$$${stepObject.simplifiedTo.I.name} = `;
    stepObject.components.forEach((component) => {
        str += `${component.I.name} = `
    });
    str = str.slice(0, -3);  // remove last =
    str += `$$`;
    str += `$$= ${stepObject.simplifiedTo.I.val}$$`;
    // Voltage split
    str += `<br>${languageManager.currentLang.voltageSplits}.<br>`;
    stepObject.components.forEach((component) => {
        str += `$$${component.U.name} = ?$$`;
    });
    str += `<br>`;
    // Voltage calculation
    stepObject.components.forEach((component) => {
        if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
            str += `$$${component.U.name} = ${component.Z.name} \\cdot  ${component.I.name}$$`;
        } else {
            str += `$$${component.U.name} = X_{${component.Z.name}} \\cdot  ${component.I.name}$$`;
        }
        str += `$$= ${component.Z.impedance} \\cdot ${stepObject.simplifiedTo.I.val}$$`;  // use simplifiedTo val to make it more explanatory in symbolic circuits
        str += `$$= ${component.U.val}$$<br>`;
    });
    return str;
}

function getSymbolicParallelVCDescription(stepObject) {
    let str = "";
    // Calculate current
    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.name}}{${stepObject.simplifiedTo.Z.name}}$$`;
    } else {
        str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.name}}{Z_{${stepObject.simplifiedTo.Z.name}}}$$`;
    }
    str += `$$${stepObject.simplifiedTo.I.name} = ${stepObject.simplifiedTo.I.val}$$<br>`;
    // Text
    str += `${languageManager.currentLang.relationTextParallel}.<br>`;
    str += `${languageManager.currentLang.voltageStaysTheSame}.<br>`;
    str += `$$${stepObject.simplifiedTo.U.name} = `;
    stepObject.components.forEach((component) => {str+= `${component.U.name} = `});
    str = str.slice(0, -3);  // remove last =
    str += `$$`;
    str += `$$= ${stepObject.simplifiedTo.U.val}$$`;
    // Current split
    str += `<br>${languageManager.currentLang.currentSplits}.<br>`;
    stepObject.components.forEach((component) => {
        str += `$$${component.I.name} = ?$$`;
    });
    str += `<br>`;
    // Current calculation
    stepObject.components.forEach((component) => {
        if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
            str += `$$${component.I.name} = \\frac{${component.U.name}}{${component.Z.name}}$$`;
        } else {
            str += `$$${component.I.name} = \\frac{${component.U.name}}{X_{${component.Z.name}}}$$`;
        }
        str += `$$= \\frac{${component.U.val}}{${component.Z.impedance}}$$`;
        str += `$$= ${component.I.val}$$<br>`;
    });
    return str;
}

function getNonSymbolicSeriesVCDescription(stepObject) {
    if (state.step0Data.componentTypes === "RLC") {
        return getComplexNonSymbolicSeriesVC(stepObject);
    } else {
        return getNonSymbolicSeriesVC(stepObject);
    }
}

function getNonSymbolicParallelVCDescription(stepObject) {
    if (state.step0Data.componentTypes === "RLC") {
        return getComplexNonSymbolicParallelVC(stepObject);
    } else {
        return getNonSymbolicParallelVC(stepObject);
    }
}

function toPolar(A, P) {
    // TODO maybe refactor so we only input a complex value
    if (P[0] === "-") {
        return `${A} \\cdot e^{j\\cdot(${P})}`;
    } else {
        return `${A} \\cdot e^{j\\cdot${P}}`;
    }
}
function getComplexNonSymbolicParallelVC(stepObject) {
    let str = "";
    let SimplifiedZinPolar = toPolar(stepObject.simplifiedTo.Z.impedance, stepObject.simplifiedTo.Z.phase);
    let SimplifiedIinPolar = toPolar(stepObject.simplifiedTo.I.val, stepObject.simplifiedTo.I.phase);
    let SimplifiedUinPolar = toPolar(stepObject.simplifiedTo.U.val, stepObject.simplifiedTo.U.phase);

    // Calculate current
    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$\\mathbf{${stepObject.simplifiedTo.I.name}} = \\frac{\\bf{${stepObject.simplifiedTo.U.name}}}{\\textbf{${stepObject.simplifiedTo.Z.name}}}$$`;
    } else {
        str += `$$\\boldsymbol{${stepObject.simplifiedTo.I.name}} = \\frac{\\boldsymbol{${stepObject.simplifiedTo.U.name}}}{\\boldsymbol{Z_{${stepObject.simplifiedTo.Z.name}}}}$$`;
    }
    str += `$$\\mathbf{${stepObject.simplifiedTo.I.name}} = \\frac{${stepObject.simplifiedTo.U.val}}{${SimplifiedZinPolar}}$$`;
    str += `$$\\mathbf{${stepObject.simplifiedTo.I.name}} = ${toPolar(stepObject.simplifiedTo.I.val, stepObject.simplifiedTo.I.phase)}$$<br>`;
    // Text
    str += `${languageManager.currentLang.relationTextParallel}.<br>`;
    str += `${languageManager.currentLang.voltageStaysTheSame}.<br>`;
    str += `$$\\mathbf{${stepObject.simplifiedTo.U.name}} = `;
    stepObject.components.forEach((component) => {
        str += `\\mathbf{${component.U.name}} = `
    });
    str = str.slice(0, -3);  // remove last =
    str += `$$`;
    str += `$$= ${SimplifiedUinPolar}$$`;
    // Voltage split
    str += `<br>${languageManager.currentLang.currentSplits}.<br>`;
    stepObject.components.forEach((component) => {
        str += `$$\\mathbf{${component.I.name}} = ?$$`;
    });
    str += `<br>`;
    // Current calculation
    stepObject.components.forEach((cpt) => {
        if (cpt.Z.name.includes("Z")) {
            str += `$$\\mathbf{${cpt.I.name}} = \\frac{\\mathbf{${cpt.U.name}}}{\\mathbf{${cpt.Z.name}}}$$`;
        } else {
            str += `$$\\mathbf{${cpt.I.name}} = \\frac{\\mathbf{${cpt.U.name}}}{\\mathbf{Z_{${cpt.Z.name}}}}$$`;
        }
        str += `$$= \\frac{${SimplifiedUinPolar}}{${toPolar(cpt.Z.impedance, cpt.Z.phase)}}$$`;
        str += `$$= ${toPolar(cpt.I.val, cpt.I.phase)}$$<br>`;
    });
    return str;
}



function getComplexNonSymbolicSeriesVC(stepObject) {
    let str = "";
    let SimplifiedZinPolar = toPolar(stepObject.simplifiedTo.Z.impedance, stepObject.simplifiedTo.Z.phase);
    let SimplifiedIinPolar = toPolar(stepObject.simplifiedTo.I.val, stepObject.simplifiedTo.I.phase);

    // Calculate current
    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$\\mathbf{${stepObject.simplifiedTo.I.name}} = \\frac{\\bf{${stepObject.simplifiedTo.U.name}}}{\\textbf{${stepObject.simplifiedTo.Z.name}}}$$`;
    } else {
        str += `$$\\boldsymbol{${stepObject.simplifiedTo.I.name}} = \\frac{\\boldsymbol{${stepObject.simplifiedTo.U.name}}}{\\boldsymbol{Z_{${stepObject.simplifiedTo.Z.name}}}}$$`;
    }
    str += `$$\\mathbf{${stepObject.simplifiedTo.I.name}} = \\frac{${stepObject.simplifiedTo.U.val}}{${SimplifiedZinPolar}}$$`;
    str += `$$\\mathbf{${stepObject.simplifiedTo.I.name}} = ${toPolar(stepObject.simplifiedTo.I.val, stepObject.simplifiedTo.I.phase)}$$<br>`;
    // Text
    str += `${languageManager.currentLang.relationTextSeries}.<br>`;
    str += `${languageManager.currentLang.currentStaysTheSame}.<br>`;
    str += `$$\\mathbf{${stepObject.simplifiedTo.I.name}} = `;
    stepObject.components.forEach((component) => {
        str += `\\mathbf{${component.I.name}} = `
    });
    str = str.slice(0, -3);  // remove last =
    str += `$$`;
    str += `$$= ${SimplifiedIinPolar}$$`;
    // Voltage split
    str += `<br>${languageManager.currentLang.voltageSplits}.<br>`;
    stepObject.components.forEach((component) => {
        str += `$$\\mathbf{${component.U.name}} = ?$$`;
    });
    str += `<br>`;
    // Voltage calculation
    stepObject.components.forEach((cpt) => {
        if (cpt.Z.name.includes("Z")) {
            str += `$$\\mathbf{${cpt.U.name}} = \\mathbf{${cpt.Z.name}} \\cdot  \\mathbf{${cpt.I.name}}$$`;
        } else {
            str += `$$\\mathbf{${cpt.U.name}} = \\mathbf{Z_{${cpt.Z.name}}} \\cdot  \\mathbf{${cpt.I.name}}$$`;
        }
        str += `$$= ${toPolar(cpt.Z.impedance, cpt.Z.phase)} \\cdot ${toPolar(stepObject.simplifiedTo.I.val, stepObject.simplifiedTo.I.phase)}$$`;  // use simplifiedTo val to make it more explanatory in symbolic circuits
        str += `$$= ${toPolar(cpt.U.val, cpt.U.phase)}$$<br>`;
    });
    return str;
}

function getNonSymbolicSeriesVC(stepObject) {
    let str = "";
    // Calculate current
    // make distinction between RLC and R L C again
    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.name}}{${stepObject.simplifiedTo.Z.name}}$$`;
    } else {
        str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.name}}{Z_{${stepObject.simplifiedTo.Z.name}}}$$`;
    }
    str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.val}}{${stepObject.simplifiedTo.Z.impedance}}$$`;
    str += `$$${stepObject.simplifiedTo.I.name} = ${stepObject.simplifiedTo.I.val}$$<br>`;
    // Text
    str += `${languageManager.currentLang.relationTextSeries}.<br>`;
    str += `${languageManager.currentLang.currentStaysTheSame}.<br>`;
    str += `$$${stepObject.simplifiedTo.I.name} = `;
    stepObject.components.forEach((component) => {
        str += `${component.I.name} = `
    });
    str = str.slice(0, -3);  // remove last =
    str += `$$`;
    str += `$$= ${stepObject.simplifiedTo.I.val}$$`;
    // Voltage split
    str += `<br>${languageManager.currentLang.voltageSplits}.<br>`;
    stepObject.components.forEach((component) => {
        str += `$$${component.U.name} = ?$$`;
    });
    str += `<br>`;
    // Voltage calculation
    stepObject.components.forEach((component) => {
        if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
            str += `$$${component.U.name} = ${component.Z.name} \\cdot  ${component.I.name}$$`;
        } else {
            str += `$$${component.U.name} = Z_{${component.Z.name}} \\cdot  ${component.I.name}$$`;
        }
        str += `$$= ${component.Z.impedance} \\cdot ${stepObject.simplifiedTo.I.val}$$`;  // use simplifiedTo val to make it more explanatory in symbolic circuits
        str += `$$= ${component.U.val}$$<br>`;
    });
    return str;
}

function getNonSymbolicParallelVC(stepObject) {
    let str = "";
    // Calculate current
    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.name}}{${stepObject.simplifiedTo.Z.name}}$$`;
    } else {
        str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.name}}{Z_{${stepObject.simplifiedTo.Z.name}}}$$`;
    }
    str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.val}}{${stepObject.simplifiedTo.Z.impedance}}$$`;
    str += `$$${stepObject.simplifiedTo.I.name} = ${stepObject.simplifiedTo.I.val}$$<br>`;
    // Text
    str += `${languageManager.currentLang.relationTextParallel}.<br>`;
    str += `${languageManager.currentLang.voltageStaysTheSame}.<br>`;
    str += `$$${stepObject.simplifiedTo.U.name} = `;
    stepObject.components.forEach((component) => {str+= `${component.U.name} = `});
    str = str.slice(0, -3);  // remove last =
    str += `$$`;
    str += `$$= ${stepObject.simplifiedTo.U.val}$$`;
    // Current split
    str += `<br>${languageManager.currentLang.currentSplits}.<br>`;
    stepObject.components.forEach((component) => {
        str += `$$${component.I.name} = ?$$`;
    });
    str += `<br>`;
    // Current calculation
    stepObject.components.forEach((component) => {
        if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
            str += `$$${component.I.name} = \\frac{${component.U.name}}{${component.Z.name}}$$`;
        } else {
            str += `$$${component.I.name} = \\frac{${component.U.name}}{Z_{${component.Z.name}}}$$`;
        }
        str += `$$= \\frac{${component.U.val}}{${component.Z.impedance}}$$`;
        str += `$$= ${component.I.val}$$<br>`;
    });
    return str;
}

function getSeriesVCDescription(stepObject) {
    if (currentCircuitIsSymbolic()) {
        return getSymbolicSeriesVCDescription(stepObject);
    } else {
        return getNonSymbolicSeriesVCDescription(stepObject);
    }
}

function getParallelVCDescription(stepObject) {
    if (currentCircuitIsSymbolic()) {
        return getSymbolicParallelVCDescription(stepObject);
    } else {
        return getNonSymbolicParallelVCDescription(stepObject);
    }
}
