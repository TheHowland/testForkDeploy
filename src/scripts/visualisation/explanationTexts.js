// Generates and appends a paragraph describing the resistance simplification step
function generateTextForZ(data, componentTypes) {
    let relation = data.noFormat().relation;
    const paragraphElement = document.createElement('p');
    paragraphElement.classList.add("explText");
    const firstPart = getElementsAndRelationDescription(data);

    // Calculation descriptions are swapped for R/L and C
    if (componentTypes === "R" || componentTypes === "L") {
        if (relation === "series") {
            paragraphElement.innerHTML = firstPart + getAdditionCalculation(data)
        } else if (relation === "parallel") {
            paragraphElement.innerHTML = firstPart + getReciprocialCalculation(data)
        }
    } else if (componentTypes === "C") {
        if (relation === "parallel") {
            paragraphElement.innerHTML = firstPart + getAdditionCalculation(data);
        } else if (relation === "series") {
            paragraphElement.innerHTML = firstPart + getReciprocialCalculation(data);
        }
    }
    return paragraphElement;
}

function generateTextForVoltageCurrent(data) {
    let relation = data.noFormat().relation[0]
    const text = document.createElement('p');
    text.classList.add("explText");

    if (relation === "series") {
        text.innerHTML = getSeriesVCDescription(data);
    } else if (relation === "parallel") {
        text.innerHTML = getParallelVCDescription(data);
    } else {
        text.innerHTML = languageManager.currentLang.relationTextNoRelation;
    }
    MathJax.typeset();
    return text;
}

function getRelationText(data) {
    let relationText = "";
    if (!data.isNull()) {
        if (data.noFormat().relation === "parallel") {
            relationText = languageManager.currentLang.relationTextParallel;
        } else if (data.noFormat().relation === "series") {
            relationText = languageManager.currentLang.relationTextSeries;
        } else if (data.noFormat().relation === null) {
            relationText = languageManager.currentLang.relationTextNoRelation;
        } else {
            throw Error("Unknown relation type");
        }
    }
    return relationText;
}

function getElementsAndRelationDescription(data) {
    let relationText = getRelationText(data);
    return `
            ${languageManager.currentLang.calcBeforeFirstElement} ${data.inline().name1} ${languageManager.currentLang.calcBetweenElements} ${data.inline().name2}<br>
            ${languageManager.currentLang.calcAfterSecondElement} ${data.inline().newName} ${languageManager.currentLang.calcAfterSimplifiedElement}<br>
            <br>
            ${data.inline().name1}&nbsp= ${data.inline().value1}<br>
            ${data.inline().name2}&nbsp= ${data.inline().value2}<br>
            <br>
            ${relationText}<br>
            <br>`;
}

function getReciprocialCalculation(data) {
    // creates 1/X = 1/X1 + 1/X2
    return `$$\\frac{1}{${data.noFormat().newName}} = \\frac{1}{${data.noFormat().name1}} + \\frac{1}{${data.noFormat().name2}}$$
             $$\\frac{1}{${data.noFormat().newName}} = \\frac{1}{${data.noFormat().value1}} + \\frac{1}{${data.noFormat().value2}}$$
             $$\\frac{1}{${data.noFormat().newName}} = \\frac{1}{${data.noFormat().result}}$$
             <br>
             $$${data.noFormat().newName} = ${data.noFormat().result}$$
            `;
}

function getAdditionCalculation(data) {
    // creates X = X1 + X2
    return `$$${data.noFormat().newName} = ${data.noFormat().name1} + ${data.noFormat().name2}$$
             $$${data.noFormat().newName} = ${data.noFormat().value1} + ${data.noFormat().value2}$$
             $$${data.noFormat().newName} = ${data.noFormat().result}$$
            `;
}

function getSeriesVCDescription(data) {
    return `${languageManager.currentLang.currentCalcHeading} ${data.inline().oldNames[0]}<br>
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
        `;
}

function getParallelVCDescription(data) {
    return `
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
        `;
}
