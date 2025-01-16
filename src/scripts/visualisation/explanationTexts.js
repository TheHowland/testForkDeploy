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
            paragraphElement.innerHTML = firstPart + getReciprocialCalculation(stepObject)
        }
    } else if (state.step0Data.componentTypes === "C") {
        if (relation === "parallel") {
            paragraphElement.innerHTML = firstPart + getAdditionCalculation(stepObject);
        } else if (relation === "series") {
            paragraphElement.innerHTML = firstPart + getReciprocialCalculation(stepObject);
        }
    } else {
        console.log("No component type found: ", state.step0Data.componentTypes);
    }
    return paragraphElement;
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
    // Todo, maybe this R needs to be changed to Z sometime
    return `TODO Total Current` /*${languageManager.currentLang.currentCalcHeading} ${data.inline().oldNames[0]}<br>
                        <br>  
                        $$I_{${languageManager.currentLang.totalSuffix}} = \\frac{${languageManager.currentLang.voltageSymbol}_{${languageManager.currentLang.totalSuffix}}}{R_{${languageManager.currentLang.totalSuffix}}}$$
                        $$I_{${languageManager.currentLang.totalSuffix}} = ${data.noFormat().oldNames[2]} = \\frac{${data.noFormat().oldNames[1]}}{${data.noFormat().oldNames[0]}}$$
                        $$= \\frac{${data.noFormat().oldValues[1]}}{${data.noFormat().oldValues[0]}}$$
                        $$= ${data.noFormat().oldValues[2]}$$
                        <br>`;*/
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
    stepObject.components.forEach((component) => {str+= `\\(${component.Z.name}\\)&nbsp= \\(${component.hasConversion ? component.Z.val : component.Z.complexVal}\\)<br>`;});
    str += `<br>${relationText}<br>`;
    return str;
}

function getReciprocialCalculation(stepObject) {
    // creates 1/X = 1/X1 + 1/X2
    let str = "";
    str += `$$\\frac{1}{${stepObject.simplifiedTo.Z.name}} = `;
    stepObject.components.forEach((component) => {str+= `\\frac{1}{${component.Z.name}} + `});
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    str += `$$\\frac{1}{${stepObject.simplifiedTo.Z.name}} = `;
    stepObject.components.forEach((component) => {str+= `\\frac{1}{${component.hasConversion ? component.Z.val : component.Z.complexVal}} + `});
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    str += `$$\\frac{1}{${stepObject.simplifiedTo.Z.name}} = \\frac{1}{${stepObject.simplifiedTo.hasConversion ? stepObject.simplifiedTo.Z.val : stepObject.simplifiedTo.Z.complexVal}}$$ <br>`;
    // No need for '$$', inline is ok
    str += `\\(${stepObject.simplifiedTo.Z.name} = ${stepObject.simplifiedTo.hasConversion ? stepObject.simplifiedTo.Z.val : stepObject.simplifiedTo.Z.complexVal}\\) <br>`;
    return str;
}

function getAdditionCalculation(stepObject) {
    // creates X = X1 + X2
    // Use block MJ ('$$') to make sure formulas are horizontally scrollable if too long
    let str = "";
    str += `$$${stepObject.simplifiedTo.Z.name} = `;
    stepObject.components.forEach((component) => {str+= `${component.Z.name} + `});
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    str += `$$${stepObject.simplifiedTo.Z.name} = `;
    stepObject.components.forEach((component) => {str+= `${component.hasConversion ? component.Z.val : component.Z.complexVal} + `});
    str = str.slice(0, -3);  // remove last +
    str += `$$`;
    // No need for '$$', inline is ok
    str += `\\(${stepObject.simplifiedTo.Z.name} = ${stepObject.simplifiedTo.hasConversion ? stepObject.simplifiedTo.Z.val : stepObject.simplifiedTo.Z.complexVal}\\) <br>`;
    return str;
}

function getSeriesVCDescription(stepObject) {
    return `TODO` /*${languageManager.currentLang.currentCalcHeading} ${data.inline().oldNames[0]}<br>
            <br>
            $$${data.noFormat().oldNames[2]} = \\frac{${data.noFormat().oldNames[1]}}{${data.noFormat().oldNames[0]}}$$
            $$= \\frac{${data.noFormat().oldValues[1]}}{${data.noFormat().oldValues[0]}}$$
            $$= ${data.noFormat().oldValues[2]}$$
            <br>
            ${languageManager.currentLang.relationTextSeries}.<br>
            ${languageManager.currentLang.currentStaysTheSame}.<br>
            $$${data.noFormat().oldNames[2]} = ${data.noFormat().names1[2]} = ${data.noFormat().names2[2]}$$
            $$= ${data.noFormat().oldValues[2]}$$
            <br>
            ${languageManager.currentLang.voltageSplits}.<br>
            $$${data.noFormat().names1[1]} = ?$$
            $$${data.noFormat().names2[1]} = ?$$
            <br>
            $$${data.noFormat().names1[1]} = ${data.noFormat().names1[0]} \\cdot  ${data.noFormat().names1[2]}$$
            $$= ${data.noFormat().values1[0]} \\cdot ${data.noFormat().values1[2]}$$
            $$= ${data.noFormat().values1[1]}$$
            <br>
            $$${data.noFormat().names2[1]} = ${data.noFormat().names2[0]} \\cdot  ${data.noFormat().names2[2]}$$
            $$= ${data.noFormat().values2[0]} \\cdot ${data.noFormat().values2[2]}$$
            $$= ${data.noFormat().values2[1]}$$
            <br>
        `;*/
}

function getParallelVCDescription(stepObject) {
    return `TODO` /*
            ${languageManager.currentLang.currentCalcHeading} ${data.inline().oldNames[0]}<br>
            <br>
            $$${data.noFormat().oldNames[2]} = \\frac{${data.noFormat().oldNames[1]}}{${data.noFormat().oldNames[0]}}$$
            $$= \\frac{${data.noFormat().oldValues[1]}}{${data.noFormat().oldValues[0]}}$$
            $$= ${data.noFormat().oldValues[2]}$$
            <br>
            ${languageManager.currentLang.relationTextParallel}.<br>
            ${languageManager.currentLang.voltageStaysTheSame}.<br>
            $$${data.noFormat().oldNames[1]} = ${data.noFormat().names1[1]} = ${data.noFormat().names2[1]}$$
            $$= ${data.noFormat().oldValues[1]}$$
            <br>
            ${languageManager.currentLang.currentSplits}.<br>
            $$${data.noFormat().names1[2]} = ?$$
            $$${data.noFormat().names2[2]} = ?$$
            <br>
            $$${data.noFormat().names1[2]} = \\frac{${data.noFormat().names1[1]}}{${data.noFormat().names1[0]}}$$
            $$= \\frac{${data.noFormat().values1[1]}}{${data.noFormat().values1[0]}}$$
            $$= ${data.noFormat().values1[2]}$$
            <br>
            $$${data.noFormat().names2[2]} = \\frac{${data.noFormat().names2[1]}}{${data.noFormat().names2[0]}}$$
            $$= \\frac{${data.noFormat().values2[1]}}{${data.noFormat().values2[0]}}$$
            $$= ${data.noFormat().values2[2]}$$
            <br>
        `;*/
}
