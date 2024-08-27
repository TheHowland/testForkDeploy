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
    if (!data.isNull()) {
        if (data.noFormat().relation === "parallel") {
            relationText = `Die Elemente sind parallel zueinander. Die Spannung (${data.inline().oldValue[1]}) bleibt gleich. <br>
                            Die Stromstärke (${data.inline().oldValue[2]}) teilt sich auf.`;
        } else if (data.noFormat().relation === "series") {
            relationText = `Die Elemente sind in Reihe zueinander. Die Stromstärke (${data.inline().oldValue[2]}) bleibt gleich. <br>
                            Die Spannung (${data.inline().oldValue[1]}) teilt sich auf.`;
        } else if (data.noFormat().relation === null) {
            relationText = "Keine Beziehung zwischen den Elementen";
        } else {
            throw Error("Unknown relation type");
        }
    }

    const paragraph_UI=document.createElement('p');
    paragraph_UI.innerHTML=`Das Element ${data.inline().oldName} setzt sich aus den Elementen ${data.inline().name1} und ${data.inline().name2} zusammen.<br>
    ${data.inline().oldName}&nbsp= (${data.inline().oldValue[0]},${data.inline().oldValue[1]},${data.inline().oldValue[2]})<br>
    ${data.inline().name1}&nbsp= ${data.inline().value1[0]}<br>
    ${data.inline().name2}&nbsp= ${data.inline().value2[0]}<br>
    ${relationText}<br>
    Rechnung:<br>
    ${data.inline().name1}&nbsp:${data.inline().equation[0]}<br>
    ${data.inline().name2}&nbsp:${data.inline().equation[1]}<br>`;
    descriptionContainer.appendChild(paragraph_UI);
}

function resetCongratsDisplayed() {
    congratsDisplayed = false;
}
