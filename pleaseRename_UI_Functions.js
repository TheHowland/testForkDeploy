/*
Replaces non-alphanumeric characters in a selector string with underscores to ensure it is a valid CSS selector.
 */
function sanitizeSelector(selector) {
    return selector.replace(/[^\w-]/g, '_');
}

/*
Populates a dropdown menu with circuit file options, allowing the user to select a circuit.
 */
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

/*
 Removes all bounding boxes and clears the list of clicked elements in the SVG and the clicked elements container.
 */
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

/*
Displays a temporary message to the user in a message box.
 */
function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

/*
Generates and appends a paragraph describing the resistance (Z=general term for complex resistance)  simplification step,
excluding step0.json files.
 */
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

/*
Generates and appends a paragraph describing the voltage and current (VC= voltage and current) simplification step
based on the provided data.
 */
function paragraph_VC(data, descriptionContainer) {
    let relationText = "";

    const inlineData = data.inline();
    const noFormatData = data.noFormat();

    // Handle relationText generation based on relation type
    if (noFormatData.relation === "parallel") {
        relationText = `Die Elemente sind parallel zueinander. Die Spannung (${inlineData.oldValue[1]}) bleibt gleich. <br>
                        Die Stromst&auml;rke (${inlineData.oldValue[2]}) teilt sich auf.`;
    } else if (noFormatData.relation === "series") {
        relationText = `Die Elemente sind in Reihe zueinander. Die Stromst&auml;rke (${inlineData.oldValue[2]}) bleibt gleich. <br>
                        Die Spannung (${inlineData.oldValue[1]}) teilt sich auf.`;
    } else {
        relationText = "Keine Beziehung zwischen den Elementen";
    }

    const paragraph_VC = document.createElement('p');
    paragraph_VC.innerHTML = `
        Das Element ${noFormatData.oldName} setzt sich aus den Elementen ${noFormatData.name1} und ${noFormatData.name2} zusammen.<br>
        ${noFormatData.oldName}&nbsp= (${inlineData.oldValue[0]}, ${inlineData.oldValue[1]}, ${inlineData.oldValue[2]})<br>
        ${noFormatData.name1}&nbsp= ${inlineData.value1}<br>
        ${noFormatData.name2}&nbsp= ${inlineData.value2}<br>
        ${relationText}<br>
        Rechnung:<br>
        ${noFormatData.name1}&nbsp: ${inlineData.equation[0]}<br>
        ${noFormatData.name2}&nbsp: ${inlineData.equation[1]}<br>`;
    descriptionContainer.appendChild(paragraph_VC);
}

/*
Sets the global variable congratsDisplayed to false.
This is used to reset a state indicating whether a congratulatory message has been displayed.
 */
function resetCongratsDisplayed() {
    congratsDisplayed = false;
}
