function getRelationText(data) {
    let relationText = "";
    if (!data.isNull()) {
        if (data.noFormat().relation === "parallel") {
            relationText = currentLang.calcRelationTextParallel;
        } else if (data.noFormat().relation === "series") {
            relationText = currentLang.calcRelationTextSeries;
        } else if (data.noFormat().relation === null) {
            relationText = currentLang.calcRelationTextNoRelation;
        } else {
            throw Error("Unknown relation type");
        }
    }
    return relationText;
}


// Generates and appends a paragraph describing the resistance simplification step
function generateTextForZ(data) {
    let relationText = getRelationText(data);
    const text = document.createElement('p');
    text.innerHTML = `
        ${currentLang.calcBeforeFirstElement} ${data.inline().name1} ${currentLang.calcBetweenElements} ${data.inline().name2}<br>
        ${currentLang.calcAfterSecondElement} ${data.inline().newName} ${currentLang.calcAfterSimplifiedElement}<br>
        <br>
        ${data.inline().name1}&nbsp= ${data.inline().value1}<br>
        ${data.inline().name2}&nbsp= ${data.inline().value2}<br>
        ${data.inline().newName}&nbsp= ${data.inline().result}<br>
        <br>
        ${relationText}<br>
        <br>
        ${currentLang.calculationHeading}:<br>
        ${data.inline().latexEquation}
    `;
    return text;
}

function generateTextForVoltageCurrent(data) {
    let relationText = "";
    let relation = data.noFormat().relation[0]
    console.log("Relation: " + data.noFormat().relation[0])

    // Handle relationText generation based on relation type
    if (relation === "parallel") {
        relationText = `${currentLang.calcRelationTextParallel}. ${currentLang.vcBeforeParallelVoltage} ${data.inline().oldValues[1]} ${currentLang.vcAfterParallelVoltage} <br>
                        ${currentLang.vcBeforeParallelCurrent} ${data.inline().oldValues[2]} ${currentLang.vcAfterParallelCurrent}`;
    } else if (relation === "series") {
        relationText = `${currentLang.calcRelationTextSeries}. ${currentLang.vcBeforeSeriesCurrent} ${data.inline().oldValues[2]} ${currentLang.vcAfterSeriesCurrent}. <br>
                        ${currentLang.vcBeforeSeriesVoltage} ${data.inline().oldValues[1]} ${currentLang.vcAfterSeriesVoltage}.`;
    } else {
        relationText = currentLang.calcRelationTextNoRelation;
    }

    const text = document.createElement('p');

    text.innerHTML = `
        ${currentLang.vcBeforeSimplifiedElement} ${data.inline().oldNames[0]} ${currentLang.vcAfterSimplifiedElement} 
        ${data.inline().names1[0]} ${currentLang.vcBetweenElements} ${data.inline().names2[0]} ${currentLang.vcAfterSecondElement}.<br>
        <br>
        ${data.inline().oldNames[0]}&nbsp= ${data.inline().oldValues[0]}<br>
        ${data.inline().oldNames[1]}&nbsp= ${data.inline().oldValues[1]}<br>
        ${data.inline().oldNames[2]}&nbsp= ${data.inline().oldValues[2]}<br>   
        ${data.inline().names1[0]}&nbsp= ${data.inline().values1[0]}<br>
        ${data.inline().names1[1]}&nbsp= ${data.inline().values1[1]}<br>
        ${data.inline().names1[2]}&nbsp= ${data.inline().values1[2]}<br>
        ${data.inline().names2[0]}&nbsp= ${data.inline().values2[0]}<br>
        ${data.inline().names2[1]}&nbsp= ${data.inline().values2[1]}<br>
        ${data.inline().names2[2]}&nbsp= ${data.inline().values2[2]}<br>
        <br>
        ${relationText}<br>
        <br>
        ${currentLang.calculationHeading}:<br>
        ${data.inline().equation[0]}<br>
        ${data.inline().equation[1]}<br>`;

    return text;
}