function getRelationText(data) {
    let relationText = "";
    if (!data.isNull()) {
        if (data.noFormat().relation === "parallel") {
            relationText = currentLang.relationTextParallel;
        } else if (data.noFormat().relation === "series") {
            relationText = currentLang.relationTextSeries;
        } else if (data.noFormat().relation === null) {
            relationText = currentLang.relationTextNoRelation;
        } else {
            throw Error("Unknown relation type");
        }
    }
    return relationText;
}


// Generates and appends a paragraph describing the resistance simplification step
function generateTextForZ(data) {
    let relation = data.noFormat().relation;
    let relationText = getRelationText(data);

    /*
    relation = data.relation;
    componentTypes = data.componentTypes; (R, C, L, RCL)

    // selektor 1 - simple
    if (component == "R" or "L")
    { series, parallel
    }
    else if (C)
    {
    }

    *
    * */

    const text = document.createElement('p');

    const firstPart = `
            ${currentLang.calcBeforeFirstElement} ${data.inline().name1} ${currentLang.calcBetweenElements} ${data.inline().name2}<br>
            ${currentLang.calcAfterSecondElement} ${data.inline().newName} ${currentLang.calcAfterSimplifiedElement}<br>
            <br>
            ${data.inline().name1}&nbsp= ${data.inline().value1}<br>
            ${data.inline().name2}&nbsp= ${data.inline().value2}<br>
            <br>
            ${relationText}<br>
            <br>`;

    if (relation === "series") {
        text.innerHTML = firstPart + `
         $$${data.noFormat().newName} = ${data.noFormat().name1} + ${data.noFormat().name2}$$
         $$${data.noFormat().newName} = ${data.noFormat().value1} + ${data.noFormat().value2}$$
         $$${data.noFormat().newName} = ${data.noFormat().result}$$
        `;
    }
    else if (relation === "parallel") {
        text.innerHTML = firstPart + `
         $$\\frac{1}{${data.noFormat().newName}} = \\frac{1}{${data.noFormat().name1}} + \\frac{1}{${data.noFormat().name2}}$$
         $$\\frac{1}{${data.noFormat().newName}} = \\frac{1}{${data.noFormat().value1}} + \\frac{1}{${data.noFormat().value2}}$$
         <br>
         $$${data.noFormat().newName} = ${data.noFormat().result}$$
        `;
    }
    return text;
}

function generateTextForVoltageCurrent(data) {
    let relation = data.noFormat().relation[0]

    // For a better understanding which fields are what value :)
    let simZName = data.inline().oldNames[0];
    let simZValue = data.inline().oldValues[0];
    let simUName = data.inline().oldNames[1];
    let simUValue = data.inline().oldValues[1];
    let simIName = data.inline().oldNames[2];
    let simIValue = data.inline().oldValues[2];

    let firstZName = data.inline().names1[0];
    let firstZValue = data.inline().values1[0];
    let firstUName = data.inline().names1[1];
    let firstUValue = data.inline().values1[1];
    let firstIName = data.inline().names1[2];
    let firstIValue = data.inline().values1[2];

    let secondZName = data.inline().names2[0];
    let secondZValue = data.inline().values2[0];
    let secondUName = data.inline().names2[1];
    let secondUValue = data.inline().values2[1];
    let secondIName =data.inline().names2[2];
    let secondIValue = data.inline().values2[2];


    const text = document.createElement('p');

    if (relation === "series") {
        text.innerHTML = `
            ${currentLang.currentCalcHeading} ${simZName}<br>
            <br>
            ${simIName} = ${simUName}/${simZName}<br>
            = ${simUValue}/${simZValue}<br>
            = ${simIValue}<br>
            <br>
            ${currentLang.relationTextSeries}.<br>
            ${currentLang.currentStaysTheSame}.<br>
            ${simIName} = ${firstIName} = ${secondIName} = ${simIValue}<br>
            <br>
            ${currentLang.voltageSplits}.<br>
            ${firstUName} = ?<br>
            ${secondUName} = ?<br>
            <br>
            ${firstUName} = ${firstZName} • ${firstIName}<br>
            = ${firstZValue} • ${firstIValue}<br>
            = ${firstUValue}<br>
            <br>
            ${secondUName} = ${secondZName} • ${secondIName}<br>
            = ${secondZValue} • ${secondIValue}<br>
            = ${secondUValue}<br>
            <br>
        `;
    } else if (relation === "parallel") {
        text.innerHTML = `
            ${currentLang.currentCalcHeading} ${simZName}<br>
            <br>
            ${simIName} = ${simUName} / ${simZName}<br>
            = ${simUValue} / ${simZValue}<br>
            = ${simIValue}<br>
            <br>
            ${currentLang.relationTextParallel}.<br>
            ${currentLang.voltageStaysTheSame}.<br>
            ${simUName} = ${firstUName} = ${secondUName} = ${simUValue}<br>
            <br>
            ${currentLang.currentSplits}.<br>
            ${firstIName} = ?<br>
            ${secondIName} = ?<br>
            <br>
            ${firstIName} = ${firstUName} / ${firstZName}<br>
            = ${firstUValue} / ${firstZValue}<br>
            = ${firstIValue}<br>
            <br>
            ${secondIName} = ${secondUName} / ${secondZName}<br>
            = ${secondUValue} / ${secondZValue}<br>
            = ${secondIValue}
            <br>
        `;
    } else {
        text.innerHTML = currentLang.relationTextNoRelation;
    }
    MathJax.typeset();
    return text;
}