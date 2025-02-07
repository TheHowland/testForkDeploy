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
            str += `${languageManager.currentLang.complexImpedanceHeading} \\(\\underline{Z_{${component.Z.name}}}\\)<br>`;
            str += `$$\\underline{Z_{${component.Z.name}}} = \\frac{-j}{2\\pi f ${component.Z.name}}$$`;
            str += `$$\\underline{Z_{${component.Z.name}}} = ${component.Z.cpxVal}$$<br>`;
        }
        if (component.Z.name.includes("L")) {
            str += `${languageManager.currentLang.complexImpedanceHeading} \\(\\underline{Z_{${component.Z.name}}}\\)<br>`;
            str += `$$\\underline{Z_{${component.Z.name}}} = j \\cdot 2\\pi f ${component.Z.name}$$`;
            str += `$$\\underline{Z_{${component.Z.name}}} = ${component.Z.cpxVal}$$<br>`;
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
    str += `$$\\underline{${stepObject.simplifiedTo.Z.name}} = `;
    for (let component of stepObject.components) {
        if (component.Z.name.includes("Z")) {
            str += `\\underline{${component.Z.name}} + `;
        } else {
            str += `\\underline{Z_{${component.Z.name}}} + `;
        }
    }
    str = str.slice(0, -3);  // remove last +
    str += `$$`;

    str += `$$\\underline{${stepObject.simplifiedTo.Z.name}} = `;
    for (let component of stepObject.components) {
        str += `${component.Z.cpxVal} + `;
    }
    str = str.slice(0, -3);  // remove last +
    str += `$$`;

    str += `$$\\underline{${stepObject.simplifiedTo.Z.name}} = ${stepObject.simplifiedTo.Z.cpxVal}$$<br>`;
    // TODO Betrag und Phase oder polarform

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
    str += `$$${stepObject.simplifiedTo.Z.name} = ${stepObject.simplifiedTo.Z.cpxVal}$$<br>`;

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

function generateTextForTotalCurrent(stepObject) {
    let str = "";
    let sfx = languageManager.currentLang.totalSuffix;
    if ([circuitMapper.selectorIds.cap, circuitMapper.selectorIds.ind, circuitMapper.selectorIds.mixed].includes(state.currentCircuitMap.selectorGroup)) {
        sfx += "," + languageManager.currentLang.effectiveSuffix;
    }

    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$I_{${sfx}} = \\frac{${languageManager.currentLang.voltageSymbol}_{${sfx}}}{${stepObject.simplifiedTo.Z.name}}$$`
    } else {
        str += `$$I_{${sfx}} = \\frac{${languageManager.currentLang.voltageSymbol}_{${sfx}}}{X_{${stepObject.simplifiedTo.Z.name}}}$$`
    }

    str += `$$I_{${sfx}} = \\frac{${stepObject.simplifiedTo.U.val}}{${stepObject.simplifiedTo.Z.impedance}}$$`;
    str += `$$I_{${sfx}} = ${stepObject.simplifiedTo.I.val}$$`;
    return str;
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
    // TODO adapt with j and impedance....
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
    if (P[0] === "-") {
        return `${A} \\cdot e^{j\\cdot(${P})}`;
    } else {
        return `${A} \\cdot e^{j\\cdot${P}}`;
    }
}
function getComplexNonSymbolicParallelVC(stepObject) {
    // TODO
    return "TODO";
}



function getComplexNonSymbolicSeriesVC(stepObject) {
    let str = "";
    let SimplifiedZinPolar = toPolar(stepObject.simplifiedTo.Z.impedance, stepObject.simplifiedTo.Z.phase);
    let SimplifiedIinPolar = toPolar(stepObject.simplifiedTo.I.val, stepObject.simplifiedTo.I.phase);

    // Calculate current
    // make distinction between RLC and R L C again TODO
    str += `${languageManager.currentLang.currentCalcHeading} \\(${stepObject.simplifiedTo.Z.name}\\)<br>`;
    if (stepObject.simplifiedTo.Z.name.includes("R") || stepObject.simplifiedTo.Z.name.includes("Z")) {
        str += `$$\\underline{${stepObject.simplifiedTo.I.name}} = \\frac{\\underline{${stepObject.simplifiedTo.U.name}}}{\\underline{${stepObject.simplifiedTo.Z.name}}}$$`;
    } else {
        str += `$$\\underline{${stepObject.simplifiedTo.I.name}} = \\frac{\\underline{${stepObject.simplifiedTo.U.name}}}{\\underline{Z_{${stepObject.simplifiedTo.Z.name}}}}$$`;
    }
    str += `$$\\underline{${stepObject.simplifiedTo.I.name}} = \\frac{${stepObject.simplifiedTo.U.val}}{${SimplifiedZinPolar}}$$`;
    str += `$$\\underline{${stepObject.simplifiedTo.I.name}} = ${toPolar(stepObject.simplifiedTo.I.val, stepObject.simplifiedTo.I.phase)}$$<br>`;
    // Text
    str += `${languageManager.currentLang.relationTextSeries}.<br>`;
    str += `${languageManager.currentLang.currentStaysTheSame}.<br>`;
    str += `$$\\underline{${stepObject.simplifiedTo.I.name}} = `;
    stepObject.components.forEach((component) => {
        str += `\\underline{${component.I.name}} = `
    });
    str = str.slice(0, -3);  // remove last =
    str += `$$`;
    str += `$$= ${SimplifiedIinPolar}$$`;
    // Voltage split
    str += `<br>${languageManager.currentLang.voltageSplits}.<br>`;
    stepObject.components.forEach((component) => {
        str += `$$\\underline{${component.U.name}} = ?$$`;
    });
    str += `<br>`;
    // Voltage calculation
    stepObject.components.forEach((cpt) => {
        if (cpt.Z.name.includes("Z")) {
            str += `$$\\underline{${cpt.U.name}} = \\underline{${cpt.Z.name}} \\cdot  \\underline{${cpt.I.name}}$$`;
        } else {
            str += `$$\\underline{${cpt.U.name}} = \\underline{Z_{${cpt.Z.name}}} \\cdot  \\underline{${cpt.I.name}}$$`;
        }
        str += `$$= ${cpt.Z.cpxVal} \\cdot ${toPolar(stepObject.simplifiedTo.I.val, stepObject.simplifiedTo.I.phase)}$$`;  // use simplifiedTo val to make it more explanatory in symbolic circuits
        str += `$$= ${toPolar(cpt.U.val, cpt.U.phase)}$$<br>`;
    });
    return str;
}

function getNonSymbolicSeriesVC(stepObject) {
    let str = "";
    // Calculate current
    // TODO adapt with impedance and j
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
            str += `$$${component.U.name} = X_{${component.Z.name}} \\cdot  ${component.I.name}$$`;
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
        str += `$$${stepObject.simplifiedTo.I.name} = \\frac{${stepObject.simplifiedTo.U.name}}{X_{${stepObject.simplifiedTo.Z.name}}}$$`;
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
            str += `$$${component.I.name} = \\frac{${component.U.name}}{X_{${component.Z.name}}}$$`;
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
