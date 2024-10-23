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

    // TODO R C L separation

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
         $$\\frac{1}{${data.noFormat().newName}} = \\frac{1}{${data.noFormat().result}}$$
         <br>
         $$${data.noFormat().newName} = ${data.noFormat().result}$$
        `;
    }
    return text;
}

function generateTextForVoltageCurrent(data) {
    let relation = data.noFormat().relation[0]
    const text = document.createElement('p');

    if (relation === "series") {
        text.innerHTML = `
            ${currentLang.currentCalcHeading} ${data.inline().oldNames[0]}<br>
            <br>
            $$${data.noFormat().oldNames[2]} = \\frac{${data.noFormat().oldNames[1]}}{${data.noFormat().oldNames[0]}}$$<br>
            $$= \\frac{${data.noFormat().oldValues[1]}}{${data.noFormat().oldValues[0]}}$$<br>
            $$= ${data.noFormat().oldValues[2]}$$<br>
            <br>
            ${currentLang.relationTextSeries}.<br>
            ${currentLang.currentStaysTheSame}.<br>
            $$${data.noFormat().oldNames[2]} = ${data.noFormat().names1[2]} = ${data.noFormat().names2[2]} = ${data.noFormat().oldValues[2]}$$<br>
            <br>
            ${currentLang.voltageSplits}.<br>
            $$${data.noFormat().names1[1]} = ?
            ${data.noFormat().names2[1]} = ?$$<br>
            <br>
            $$${data.noFormat().names1[1]} = ${data.noFormat().names1[0]} \\cdot  ${data.noFormat().names1[2]}$$<br>
            $$= ${data.noFormat().values1[0]} \\cdot ${data.noFormat().values1[2]}$$<br>
            $$= ${data.noFormat().values1[1]}$$<br>
            <br>
            $$${data.noFormat().names2[1]} = ${data.noFormat().names2[0]} \\cdot  ${data.noFormat().names2[2]}$$<br>
            $$= ${data.noFormat().values2[0]} \\cdot ${data.noFormat().values2[2]}$$<br>
            $$= ${data.noFormat().values2[1]}$$<br>
            <br>
        `;
    } else if (relation === "parallel") {
        text.innerHTML = `
            ${currentLang.currentCalcHeading} ${data.inline().oldNames[0]}<br>
            <br>
            $$${data.noFormat().oldNames[2]} = \\frac{${data.noFormat().oldNames[1]}}{${data.noFormat().oldNames[0]}}$$<br>
            $$= \\frac{${data.noFormat().oldValues[1]}}{${data.noFormat().oldValues[0]}}$$<br>
            $$= ${data.noFormat().oldValues[2]}$$<br>
            <br>
            ${currentLang.relationTextParallel}.<br>
            ${currentLang.voltageStaysTheSame}.<br>
            $$${data.noFormat().oldNames[1]} = ${data.noFormat().names1[1]} = ${data.noFormat().names2[1]} = ${data.noFormat().oldValues[1]}$$<br>
            <br>
            ${currentLang.currentSplits}.<br>
            $$${data.noFormat().names1[2]} = ?$$<br>
            $$${data.noFormat().names2[2]} = ?$$<br>
            <br>
            $$${data.noFormat().names1[2]} = \\frac{${data.noFormat().names1[1]}{${data.noFormat().names1[0]}}$$<br>
            $$= \\frac{${data.noFormat().values1[1]}{${data.noFormat().values1[0]}}$$<br>
            $$= ${data.noFormat().values1[2]}$$<br>
            <br>
            $$${data.noFormat().names2[2]} = \\frac{${data.noFormat().names2[1]}{${data.noFormat().names2[0]}}$$<br>
            $$= \\frac{${data.noFormat().values2[1]}{${data.noFormat().values2[0]}}$$<br>
            $$= ${data.noFormat().values2[2]}$$<br>
            <br>
        `;
    } else {
        text.innerHTML = currentLang.relationTextNoRelation;
    }
    MathJax.typeset();
    return text;
}