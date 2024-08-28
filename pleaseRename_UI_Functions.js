function sanitizeSelector(selector) {
    return selector.replace(/[^\w-]/g, '_');
}

function populateCircuitSelector() {
    const circuitSelector = document.getElementById('circuit-selector');
    circuitSelector.innerHTML = '<option value="" disabled selected>Select Circuit</option>';

    circuitFiles.forEach(file => {
        const option = document.createElement('option');
        option.value = file;
        option.text = file.replace('.txt', '');
        circuitSelector.appendChild(option);
    });
}

function resetClickedElements(svgDiv, clickedElementsContainer) {
    const boundingBoxes = svgDiv.querySelectorAll('.bounding-box');
    if (boundingBoxes.length > 0) {
        boundingBoxes.forEach(box => box.remove());
    }

    const clickedElementsList = clickedElementsContainer.querySelector('ul');
    if (clickedElementsList) {
        clickedElementsList.innerHTML = '';
    } else {
        console.warn('clickedElementsContainer ul-Liste nicht gefunden');
    }
    selectedElements = [];
}
function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

function paragraph_Z(data, jsonFilePath,descriptionContainer) {


    let relationText = "";
    if (!data.isNull()) {
        if (data.noFormat().relation === "parallel") {
            relationText = "Die Elemente sind parallel zueinander";
        } else if (data.noFormat().relation === "series") {
            relationText = "Die Elemente sind in Reihe zueinander";
        } else if (data.noFormat().relation === null) {
            relationText = "Keine Beziehung zwischen den Elementen";
        } else {
            throw Error("Unknown relation type");
        }
    }

    // Only append the paragraph if it's not a step0.json file
    if (!jsonFilePath.toLowerCase().includes('step0.json')) {
        const paragraph_Z = document.createElement('p');
        paragraph_Z.innerHTML = `Die Elemente ${data.inline().name1} und ${data.inline().name2}<br>
              wurden zu ${data.inline().newName} zusammengefasst<br>
              ${data.inline().name1}&nbsp= ${data.inline().value1}<br>
              ${data.inline().name2}&nbsp= ${data.inline().value2}<br>
              ${data.inline().newName}&nbsp= ${data.inline().result}<br>
              ${relationText}<br>
              Rechnung:<br>
              ${data.inline().latexEquation}`;
        descriptionContainer.appendChild(paragraph_Z);
    }
}

function paragraph_UI(data, jsonFilePath, descriptionContainer) {
    let relationText = "";

    const inlineData = data.inline();
    const noFormatData = data.noFormat();

    if (!inlineData || !noFormatData) {
        console.error("Missing or incorrect data structure.");
        throw new Error("Data structure does not match expected format.");
    }

    const oldValueExists = Array.isArray(inlineData.oldValue) && inlineData.oldValue.length > 2;
    if (noFormatData.relation === "parallel" && oldValueExists) {
        relationText = `Die Elemente sind parallel zueinander. Die Spannung (${inlineData.oldValue[1]}) bleibt gleich. <br>
                        Die Stromstärke (${inlineData.oldValue[2]}) teilt sich auf.`;
    } else if (noFormatData.relation === "series" && oldValueExists) {
        relationText = `Die Elemente sind in Reihe zueinander. Die Stromstärke (${inlineData.oldValue[2]}) bleibt gleich. <br>
                        Die Spannung (${inlineData.oldValue[1]}) teilt sich auf.`;
    } else if (noFormatData.relation === null) {
        relationText = "Keine Beziehung zwischen den Elementen";
    } else {
        console.error("Unknown relation type or oldValue data is insufficient.");
        throw new Error("Unknown relation type or oldValue data is insufficient.");
    }

    const name1Exists = Array.isArray(inlineData.name1) && inlineData.name1.length > 0;
    const name2Exists = Array.isArray(inlineData.name2) && inlineData.name2.length > 0;
    const value1Exists = Array.isArray(inlineData.value1) && inlineData.value1.length > 0;
    const value2Exists = Array.isArray(inlineData.value2) && inlineData.value2.length > 0;
    const equationExists = Array.isArray(inlineData.equation) && inlineData.equation.length > 1;

    if (!name1Exists || !name2Exists || !value1Exists || !value2Exists || !equationExists) {
        console.error("Required array properties are missing or insufficient.");
        throw new Error("Required array properties are missing or insufficient.");
    }

    const paragraph_UI = document.createElement('p');
    paragraph_UI.innerHTML = `
        Das Element ${inlineData.oldName[0]} setzt sich aus den Elementen ${inlineData.name1[0]} und ${inlineData.name2[0]} zusammen.<br>
        ${inlineData.oldName[0]}&nbsp= (${inlineData.oldValue[0]}, ${inlineData.oldValue[1]}, ${inlineData.oldValue[2]})<br>
        ${inlineData.name1[0]}&nbsp= ${inlineData.value1[0]}<br>
        ${inlineData.name2[0]}&nbsp= ${inlineData.value2[0]}<br>
        ${relationText}<br>
        Rechnung:<br>
        ${inlineData.name1[0]}&nbsp: ${inlineData.equation[0]}<br>
        ${inlineData.name2[0]}&nbsp: ${inlineData.equation[1]}<br>`;
    descriptionContainer.appendChild(paragraph_UI);
}

function resetCongratsDisplayed() {
    congratsDisplayed = false;
}
