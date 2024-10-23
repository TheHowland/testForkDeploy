// ####################################################################################################################
// #################################### Key function for displaying new svgs ##########################################
// ####################################################################################################################
function display_step(pyodide, showVoltageButton, jsonFilePath_Z,svgFilePath,jsonFilePath_VC=null) {
    // Load data
    // TODO paths object
    let {data,vcData,svgData,sanitizedSvgFilePath} = loadData(pyodide, jsonFilePath_Z, jsonFilePath_VC, svgFilePath);
    pictureCounter++;  // increment before usage in the below functions

    // Create the new elements for the current step
    const {circuitContainer, svgContainer} = setupCircuitContainer(svgData);
    const {newCalcBtn, newVCBtn} = setupExplanationButtons(showVoltageButton);
    const {pathElements, filteredPaths} = getElementsFromSvgContainer(svgContainer);
    const nextElementsContainer = setupNextElementsContainer(sanitizedSvgFilePath, filteredPaths, vcData, showVoltageButton);
    const contentCol = document.getElementById("content-col");
    contentCol.append(circuitContainer);

    // Create the texts and buttons for the detailed calculation explanation
    let {stepCalculationText, stepVoltageCurrentText} = generateTexts(data, vcData);
    checkAndAddExplanationButtons(showVoltageButton, stepCalculationText, contentCol, stepVoltageCurrentText);

    // The order of function-calls is important
    checkIfStillNotFinishedAndMakeClickable(filteredPaths, nextElementsContainer, sanitizedSvgFilePath, pathElements);
    prepareNextElementsContainer(contentCol, nextElementsContainer);

    const div = document.createElement("div");
    div.id = `explBtnContainer${pictureCounter}`
    div.classList.add("container");
    div.classList.add("justify-content-center");
    div.appendChild(newCalcBtn);
    if (showVoltageButton) div.appendChild(newVCBtn);

    setupStepButtonsFunctionality(pyodide, div, showVoltageButton);
    congratsAndVCDisplayIfFinished(filteredPaths, contentCol, showVoltageButton);
    MathJax.typeset();
}

// ####################################################################################################################
// ############################################# Helper functions #####################################################
// ####################################################################################################################

function getFinishMsg(vcData, showVoltageButton) {
    let msg;
    if (showVoltageButton) {
        msg = `
        <p>${currentLang.msgVoltAndCurrentAvailable}.<br></p>
        <p>${currentLang.msgShowVoltage}<br>V1 = ${vcData.inline().oldValues[1]}</p>
        <button class="btn btn-primary mx-1" id="reset-btn">reset</button>
        <button class="btn btn-primary mx-1" id="check-btn">check</button>
    `;
    } else {
        msg = `
        <button class="btn btn-primary mx-1" id="reset-btn">reset</button>
        <button class="btn btn-primary mx-1" id="check-btn">check</button>
    `;
    }


    return msg;
}

function setupNextElementsContainer(sanitizedSvgFilePath, filteredPaths, vcData, showVoltageButton) {
    const nextElementsContainer = document.createElement('div');
    nextElementsContainer.className = 'next-elements-container';
    nextElementsContainer.id = "nextElementsContainer";
    nextElementsContainer.classList.add("text-light");
    nextElementsContainer.classList.add("text-center");
    nextElementsContainer.classList.add("py-1");
    nextElementsContainer.classList.add("mb-3");
    if (onlyOneElementLeft(filteredPaths)) {
        nextElementsContainer.innerHTML = getFinishMsg(vcData, showVoltageButton);
    } else {
        nextElementsContainer.innerHTML = `
        <h3>${currentLang.nextElementsHeading}</h3>
        <ul class="px-0" id="next-elements-list-${sanitizedSvgFilePath}"></ul>
        <button class="btn btn-primary mx-1" id="reset-btn">reset</button>
        <button class="btn btn-primary mx-1" id="check-btn">check</button>
    `;
    }
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
    // Svg manipulation - set width and color for dark mode
    svgData = setSvgWidthTo(svgData, "100%");
    svgData = setSvgDarkMode(svgData);

    svgDiv.innerHTML = svgData;
    return svgDiv;
}

function getElementsFromSvgContainer(svgContainer) {
    const pathElements = svgContainer.querySelectorAll('path');
    const filteredPaths = Array.from(pathElements).filter(path => path.getAttribute('class') !== 'na');
    return {pathElements, filteredPaths};
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

function setupVoltageCurrentBtn() {
    const vcBtn = document.createElement("button");
    vcBtn.id = `vcBtn${pictureCounter}`
    vcBtn.classList.add("btn");
    vcBtn.classList.add("my-3");
    vcBtn.classList.add("mx-2");
    vcBtn.style.color = "white";
    vcBtn.style.borderColor = "#eeeeee";
    vcBtn.textContent = currentLang.showVoltageBtn;
    vcBtn.disabled = true;
    return vcBtn;
}

function setupCalculationBtn() {
    const calcBtn = document.createElement("button");
    calcBtn.id = `calcBtn${pictureCounter}`
    calcBtn.classList.add("btn");
    calcBtn.classList.add("my-3");
    calcBtn.classList.add("mx-2");
    calcBtn.style.color = "white";
    calcBtn.style.borderColor = "#eeeeee";
    calcBtn.textContent = currentLang.showImpedanceBtn;
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
    console.log(jsonDataString);
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

async function checkAndSimplifyNext(pyodide, div, showVoltageButton){
    const contentCol = document.getElementById("content-col");
    const nextElementsContainer = document.getElementById("nextElementsContainer");
    const svgDiv = document.getElementById(`svgDiv${pictureCounter}`);

    setTimeout(() => {resetNextElements(svgDiv, nextElementsContainer)},100);

    if (twoElementsChosen()) {
        const simplifyObject = await stepSolve.simplifyTwoCpts(selectedElements).toJs();
        checkAndSimplify(simplifyObject, pyodide, contentCol, div, showVoltageButton);
    } else {
        showMessage(contentCol, currentLang.alertChooseTwoElements);
    }
    MathJax.typeset();
}

function checkAndSimplify(simplifyObject, pyodide, contentCol, div, showVoltageButton) {
    let elementsCanBeSimplified = simplifyObject[0];
    let jsonFilePathZ = simplifyObject[1][0];
    let jsonFilePathVC = simplifyObject[1][1];
    let svgFilePath = simplifyObject[2];

    if (elementsCanBeSimplified) {
        if (notLastPicture()) {
            contentCol.append(div);
            enableLastCalcButton();
            scrollToBottom();
        }
        display_step(pyodide, showVoltageButton, jsonFilePathZ, svgFilePath, jsonFilePathVC);
    } else {
        showMessage(contentCol, currentLang.alertCanNotSimplify);
    }
}

function setupVCBtnFunctionality(vcText, contentCol, stepCalculationText) {
    const lastStepCalcBtn = document.getElementById(`calcBtn${pictureCounter - 1}`);
    const lastVCBtn = document.getElementById(`vcBtn${pictureCounter - 1}`);
    const explContainer = document.getElementById(`explBtnContainer${pictureCounter - 1}`);

    lastVCBtn.addEventListener("click", () => {
        if (lastVCBtn.textContent === currentLang.showVoltageBtn) {
            lastVCBtn.textContent = currentLang.hideVoltageBtn;
            explContainer.insertAdjacentElement("afterend", vcText);
            if (lastStepCalcBtn.textContent === currentLang.hideImpedanceBtn) {
                lastStepCalcBtn.textContent = currentLang.showImpedanceBtn;
                contentCol.removeChild(stepCalculationText);
            }
            MathJax.typeset();
        } else {
            lastVCBtn.textContent = currentLang.showVoltageBtn;
            contentCol.removeChild(vcText);
        }
    })
}

function setupCalcBtnFunctionality(showVoltageButton, stepCalculationText, contentCol, vcText) {
    const lastStepCalcBtn = document.getElementById(`calcBtn${pictureCounter - 1}`);
    const explContainer = document.getElementById(`explBtnContainer${pictureCounter - 1}`);
    let lastVCBtn;
    if (showVoltageButton) lastVCBtn = document.getElementById(`vcBtn${pictureCounter - 1}`);

    lastStepCalcBtn.addEventListener("click", () => {
        if (lastStepCalcBtn.textContent === currentLang.showImpedanceBtn) {
            lastStepCalcBtn.textContent = currentLang.hideImpedanceBtn;
            if (showVoltageButton) {
                // Add text after VC button
                explContainer.insertAdjacentElement("afterend", stepCalculationText);
                if (lastVCBtn.textContent === currentLang.hideVoltageBtn) {
                    lastVCBtn.textContent = currentLang.showVoltageBtn;
                    contentCol.removeChild(vcText);
                }
            } else {
                // Add text after calc button
                explContainer.insertAdjacentElement("afterend", stepCalculationText);
            }
            MathJax.typeset();
        } else {
            lastStepCalcBtn.textContent = currentLang.showImpedanceBtn;
            contentCol.removeChild(stepCalculationText);
        }
    })
}

function onlyOneElementLeft(filteredPaths) {
    return filteredPaths.length === 1;
}

function enableVoltageCurrentBtns() {
    for (let i = 1; i < pictureCounter; i++) {
        const vcBtn = document.getElementById(`vcBtn${i}`);
        vcBtn.disabled = false;
    }
}

function elementsLeftToBeSimplified(filteredPaths) {
    return !onlyOneElementLeft(filteredPaths);
}

function prepareNextElementsContainer(contentCol, nextElementsContainer) {
    // Delete the old one if existent
    if (document.getElementById("nextElementsContainer") != null) {
        contentCol.removeChild(document.getElementById("nextElementsContainer"));
    }
    contentCol.appendChild(nextElementsContainer);
    // After appending, enable the button
    enableCheckBtn();
}

function checkAndAddExplanationButtons(showVoltageButton, stepCalculationText, contentCol, stepVoltageCurrentText) {
    if (pictureCounter > 1) {
        setupCalcBtnFunctionality(showVoltageButton, stepCalculationText, contentCol, stepVoltageCurrentText);
        if (showVoltageButton) setupVCBtnFunctionality(stepVoltageCurrentText, contentCol, stepCalculationText);
    }
}

function generateTexts(data, vcData) {
    let stepCalculationText = generateTextForZ(data);
    stepCalculationText.style.color = "white";

    let stepVoltageCurrentText = generateTextForVoltageCurrent(vcData);
    stepVoltageCurrentText.style.color = "white";
    return {stepCalculationText, stepVoltageCurrentText};
}

function finishCircuit(contentCol, showVoltageButton) {
    document.getElementById("check-btn").disabled = true;
    showMessage(contentCol, currentLang.msgCongratsFinishedCircuit, "success");
    if (showVoltageButton) enableVoltageCurrentBtns();
}

function setupStepButtonsFunctionality(pyodide, div, showVoltageButton) {
    document.getElementById("reset-btn").addEventListener('click', () =>
        resetSimplifierPage(pyodide)
    );
    document.getElementById("check-btn").addEventListener('click', async () => {
        checkAndSimplifyNext(pyodide, div, showVoltageButton);
    });
}

function getAllElementsAndMakeClickable(nextElementsContainer, sanitizedSvgFilePath, pathElements) {
    const nextElementsList = nextElementsContainer.querySelector(`#next-elements-list-${sanitizedSvgFilePath}`);
    pathElements.forEach(pathElement => setStyleAndEvent(pathElement, nextElementsList));
}

function setupExplanationButtons(showVoltageButton) {
    const newCalcBtn = setupCalculationBtn();
    if (showVoltageButton) {
        const newVCBtn = setupVoltageCurrentBtn();
        return {newCalcBtn, newVCBtn};
    }
    let empty = null;
    return {newCalcBtn, empty};
}

function loadData(pyodide, jsonFilePath_Z, jsonFilePath_VC, svgFilePath) {
    let data = getImpedanceData(pyodide, jsonFilePath_Z);
    let vcData = getVoltageCurrentData(pyodide, jsonFilePath_VC);
    const svgData = pyodide.FS.readFile(svgFilePath, {encoding: "utf8"});
    const sanitizedSvgFilePath = sanitizeSelector(svgFilePath);
    return {data, vcData, svgData, sanitizedSvgFilePath};
}

function checkIfStillNotFinishedAndMakeClickable(filteredPaths, nextElementsContainer, sanitizedSvgFilePath, pathElements) {
    if (elementsLeftToBeSimplified(filteredPaths)) {
        getAllElementsAndMakeClickable(nextElementsContainer, sanitizedSvgFilePath, pathElements);
    }
}

function congratsAndVCDisplayIfFinished(filteredPaths, contentCol, showVoltageButton) {
    if (onlyOneElementLeft(filteredPaths)) {
        finishCircuit(contentCol, showVoltageButton);
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
