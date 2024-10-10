/*
Replaces non-alphanumeric characters in a selector string with underscores to ensure it is a valid CSS selector.
 */
function sanitizeSelector(selector) {
    return selector.replace(/[^\w-]/g, '_');
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
function showMessage(container, message) {
    const msg = document.createElement('div');
    msg.classList.add("alert");
    msg.classList.add("alert-warning");
    msg.classList.add("fixed-bottom");
    msg.classList.add("m-5");
    msg.innerHTML = message;
    container.appendChild(svgDiv);
    setTimeout(() => {
        msg.style.display = 'none';
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
    let relation = data.noFormat().relation[0]
    console.log("Relation: " + data.noFormat().relation[0])

    // Handle relationText generation based on relation type
    if (relation === "parallel") {
        relationText = `Die Elemente sind parallel zueinander. Die Spannung ${data.inline().oldValues[1]} bleibt gleich. <br>
                        Die Stromst&aumlrke ${data.inline().oldValues[2]} teilt sich auf.`;
    } else if (relation === "series") {
        relationText = `Die Elemente sind in Reihe zueinander. Die Stromst&aumlrke ${data.inline().oldValues[2]} bleibt gleich. <br>
                        Die Spannung ${data.inline().oldValues[1]} teilt sich auf.`;
    } else {
        relationText = "Keine Beziehung zwischen den Elementen";
    }

    const paragraph_VC = document.createElement('p');

    paragraph_VC.innerHTML = `
        Das Element ${data.inline().oldNames[0]} setzt sich aus den Elementen ${data.inline().names1[0]} und ${data.inline().names2[0]} zusammen.<br>
        ${data.inline().oldNames[0]}&nbsp= ${data.inline().oldValues[0]}<br>
        ${data.inline().oldNames[1]}&nbsp= ${data.inline().oldValues[1]}<br>
        ${data.inline().oldNames[2]}&nbsp= ${data.inline().oldValues[2]}<br>   
        ${data.inline().names1[0]}&nbsp= ${data.inline().values1[0]}<br>
        ${data.inline().names1[1]}&nbsp= ${data.inline().values1[1]}<br>
        ${data.inline().names1[2]}&nbsp= ${data.inline().values1[2]}<br>
        ${data.inline().names2[0]}&nbsp= ${data.inline().values2[0]}<br>
        ${data.inline().names2[1]}&nbsp= ${data.inline().values2[1]}<br>
        ${data.inline().names2[2]}&nbsp= ${data.inline().values2[2]}<br>
        ${relationText}<br>
        Rechnung:<br>
        ${data.inline().equation[0]}<br>
        ${data.inline().equation[1]}<br>`;
    descriptionContainer.appendChild(paragraph_VC);
}

/*
Sets the global variable congratsDisplayed to false.
This is used to reset a state indicating whether a congratulatory message has been displayed.
 */
function resetCongratsDisplayed() {
    congratsDisplayed = false;
}
