function setupNextElementsContainer(sanitizedSvgFilePath) {
    const nextElementsContainer = document.createElement('div');
    nextElementsContainer.className = 'next-elements-container';
    nextElementsContainer.id = "nextElementsContainer";
    nextElementsContainer.classList.add("text-light");
    nextElementsContainer.classList.add("text-center");
    nextElementsContainer.classList.add("py-1");
    nextElementsContainer.classList.add("mb-3");
    nextElementsContainer.innerHTML = `
        <h3>Next elements</h3>
        <ul class="px-0" id="next-elements-list-${sanitizedSvgFilePath}"></ul>
    `;
    return nextElementsContainer;
}

function setupCircuitContainer(svgData) {
    const circuitContainer = document.createElement('div');
    circuitContainer.classList.add('circuit-container');
    circuitContainer.classList.add("row"); // use flexbox property for scaling display sizes
    circuitContainer.classList.add("justify-content-center"); // centers the content
    circuitContainer.classList.add("my-2"); // centers the content
    const svgContainer = setupSvgDivContainer(svgData);
    circuitContainer.appendChild(svgContainer)
    return {circuitContainer, svgContainer};
}

function setupSvgDivContainer(svgData) {
    const svgDiv = document.createElement('div');
    svgDiv.id = `svgDiv${pictureCounter}`;
    svgDiv.classList.add("svg-container");
    svgDiv.classList.add("p-2");
    svgDiv.style.width = "350px";
    svgDiv.style.maxWidth = "350px";  // To make the border limit for tablets and bigger screens
    let whiteSvgData = svgData.replaceAll("black", "white");
    svgDiv.innerHTML = whiteSvgData;
    return svgDiv;
}

function getElementsFromSvgContainer(svgContainer) {
    const pathElements = svgContainer.querySelectorAll('path');
    const filteredPaths = Array.from(pathElements).filter(path => path.getAttribute('class') !== 'na');
    return {pathElements, filteredPaths};
}

function showCongratsMessage(nextElementsContainer) {
    const congratsMessage = document.createElement('p');
    congratsMessage.id = "congrats-msg";
    congratsMessage.innerHTML = 'Well done, you finished the circuit!';
    nextElementsContainer.appendChild(congratsMessage);
}

function setupBboxRect(bbox, bboxId) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', bbox.x);
    rect.setAttribute('y', bbox.y);
    rect.setAttribute('width', bbox.width);
    rect.setAttribute('height', bbox.height);
    rect.setAttribute('id', bboxId);
    rect.classList.add('bounding-box');
    rect.style.pointerEvents = "none";  // to make selecting the element behind it possible
    rect.style.fill = "#FFC107";
    rect.style.fillOpacity = "0.3";
    return rect;
}

function createNewHighlightedBoundingBox(pathElement, bboxId) {
    const bbox = pathElement.getBBox();
    const rect = setupBboxRect(bbox, bboxId);
    pathElement.parentNode.insertBefore(rect, pathElement.nextSibling);
}

function removeElementFromList(bboxId, pathElement) {
    const listItem = document.querySelector(`li[data-bbox-id="${bboxId}"]`);
    if (listItem) {
        listItem.remove();
        selectedElements = selectedElements.filter(e => e !== pathElement.getAttribute('id'));
    }
}

function removeExistingBoxAndText(existingBox, bboxId, pathElement) {
    existingBox.remove();
    removeElementFromList(bboxId, pathElement);
}

function addElementValueToTextBox(pathElement, bboxId, nextElementsList) {
    const value = pathElement.getAttribute('class') || 'na';
    const listItem = document.createElement('li');
    listItem.innerHTML = `${pathElement.getAttribute('id') || 'no id'} = \\(${value}\\)`;
    listItem.setAttribute('data-bbox-id', bboxId);
    nextElementsList.appendChild(listItem);
    selectedElements.push(pathElement.getAttribute('id') || 'no id');
}

function setupCalculationBtn() {
    const calcBtn = document.createElement("button");
    calcBtn.id = `calcBtn${pictureCounter}`
    calcBtn.classList.add("btn");
    calcBtn.classList.add("my-3");
    calcBtn.style.color = "white";
    calcBtn.style.borderColor = "#eeeeee";
    calcBtn.textContent = "show calculation";
    calcBtn.disabled = true;
    return calcBtn;
}

function chooseElement(pathElement, nextElementsList) {

    const bboxId = `bbox-${pathElement.getAttribute('id') || Math.random().toString(36).substr(2, 9)}`;
    const existingBox = document.getElementById(bboxId);

    if (existingBox) {
        removeExistingBoxAndText(existingBox, bboxId, pathElement);
    }
    else {
        createNewHighlightedBoundingBox(pathElement, bboxId);
        addElementValueToTextBox(pathElement, bboxId, nextElementsList);
    }
    MathJax.typeset();
}

function getImpedanceData(pyodide, jsonFilePath_Z) {
    let jsonDataString = pyodide.FS.readFile(jsonFilePath_Z, {encoding: "utf8"});
    const jsonData = JSON.parse(jsonDataString);
    let data = new SolutionObject(
        jsonData.name1, jsonData.name2, jsonData.newName,
        jsonData.value1, jsonData.value2, jsonData.result,
        jsonData.relation, jsonData.latexEquation
    );
    return data;
}

function getVoltageCurrentData(pyodide, jsonFilePath_VC) {
    let vcData;
    if (jsonFilePath_VC != null) {
        let jsonDataString_VC = pyodide.FS.readFile(jsonFilePath_VC, {encoding: "utf8"});
        let jsonData_VC = JSON.parse(jsonDataString_VC);
        vcData = new SolutionObject_VC(
            jsonData_VC.oldNames, jsonData_VC.names1, jsonData_VC.names2,
            jsonData_VC.oldValues, jsonData_VC.values1, jsonData_VC.values2,
            jsonData_VC.convOldValue, jsonData_VC.convValue1, jsonData_VC.convValue2,
            jsonData_VC.relation, jsonData_VC.equation
        );
    } else {
        vcData = new SolutionObject_VC();
    }
    return vcData;
}

function addCalculationButtonBetweenPictures(stepCalculationText, contentCol) {
    const lastStepCalcBtn = document.getElementById(`calcBtn${pictureCounter - 1}`);

    lastStepCalcBtn.addEventListener("click", () => {
        if (lastStepCalcBtn.textContent === "show calculation") {
            lastStepCalcBtn.textContent = "hide calculation";
            lastStepCalcBtn.insertAdjacentElement("afterend", stepCalculationText);
            MathJax.typeset();
        } else {
            lastStepCalcBtn.textContent = "show calculation";
            contentCol.removeChild(stepCalculationText);
        }
    })
}

function onlyOneElementLeft(filteredPaths) {
    return filteredPaths.length === 1;
}

/*
Displays the current step of the circuit simplification process using the provided JSON and SVG files.
 */
function display_step(pyodide, jsonFilePath_Z,svgFilePath,jsonFilePath_VC=null) {
    // The wrapper for the content for the whole page, every svg and calculation goes inside here
    const contentCol = document.getElementById("content-col");

    try {
        // Read json data
        let data = getImpedanceData(pyodide, jsonFilePath_Z);
        let vcData = getVoltageCurrentData(pyodide, jsonFilePath_VC);

        // Load svg file
        const svgData = pyodide.FS.readFile(svgFilePath, { encoding: "utf8" });
        const sanitizedSvgFilePath = sanitizeSelector(svgFilePath);

        pictureCounter++;

        // Wrapper around svg div
        const {circuitContainer, svgContainer} = setupCircuitContainer(svgData);
        // Show disabled calculation button
        const newCalcBtn = setupCalculationBtn();
        // Box to show text for which elements are chosen
        const nextElementsContainer = setupNextElementsContainer(sanitizedSvgFilePath);

        // Add the circuit graphic to the main container
        contentCol.append(circuitContainer);

        let stepCalculationText = generateTextForZ(data);
        stepCalculationText.style.color = "white";

        if (pictureCounter > 1) {
            addCalculationButtonBetweenPictures(stepCalculationText, contentCol);
        }

        const {pathElements, filteredPaths} = getElementsFromSvgContainer(svgContainer);

        if (onlyOneElementLeft(filteredPaths)) {
            document.getElementById("check-btn").disabled = true;
            showMessage(contentCol, "Well done, you finished the circuit!", "success");
        } else {
            // If it's not the last step, add the calcBtn and text field
            contentCol.append(newCalcBtn);
            contentCol.appendChild(nextElementsContainer);
            const nextElementsList = nextElementsContainer.querySelector(`#next-elements-list-${sanitizedSvgFilePath}`);
            pathElements.forEach(pathElement => setStyleAndEvent(pathElement, nextElementsList));
        }

        MathJax.typeset();


    } catch (error) {
        console.error('Error fetching data:', error);
        contentCol.textContent = 'Error loading content';
    }
}

function setStyleAndEvent(pathElement, nextElementsList) {
    pathElement.style.pointerEvents = 'bounding-box';
    pathElement.style.cursor = 'pointer';
    // Make elements clickable
    pathElement.addEventListener('click', () =>
        chooseElement(pathElement, nextElementsList)
    );
}
