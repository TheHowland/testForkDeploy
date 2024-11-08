// ####################################################################################################################
// #################################### Key function for displaying new svgs ##########################################
// ####################################################################################################################
function display_step(pyodide,stepDetails) {
    // Load data
    let showVoltageButton = stepDetails.showVCButton;

    let {data,vcData,svgData,sanitizedSvgFilePath} = loadData(pyodide, stepDetails);
    state.pictureCounter++;  // increment before usage in the below functions

    // Create the new elements for the current step
    const {circuitContainer, svgContainer} = setupCircuitContainer(svgData);
    const {newCalcBtn, newVCBtn} = setupExplanationButtons(showVoltageButton);
    const {pathElements, filteredPaths} = getElementsFromSvgContainer(svgContainer);
    const nextElementsContainer = setupNextElementsContainer(sanitizedSvgFilePath, filteredPaths, vcData, showVoltageButton);
    const contentCol = document.getElementById("content-col");
    contentCol.append(circuitContainer);

    // Create the texts and buttons for the detailed calculation explanation
    let {stepCalculationText, stepVoltageCurrentText} = generateTexts(data, vcData, stepDetails.componentTypes);
    checkAndAddExplanationButtons(showVoltageButton, stepCalculationText, contentCol, stepVoltageCurrentText);

    // The order of function-calls is important
    checkIfStillNotFinishedAndMakeClickable(filteredPaths, nextElementsContainer, sanitizedSvgFilePath, pathElements);
    prepareNextElementsContainer(contentCol, nextElementsContainer);
    const div = createExplanationBtnContainer(newCalcBtn);
    if (showVoltageButton) div.appendChild(newVCBtn);

    setupStepButtonsFunctionality(pyodide, div, stepDetails);
    congratsAndVCDisplayIfFinished(filteredPaths, contentCol, showVoltageButton, vcData);
    MathJax.typeset();
}

// ####################################################################################################################
// ############################################# Helper functions #####################################################
// ####################################################################################################################

function createExplanationBtnContainer(element) {
    const div = document.createElement("div");
    div.id = `explBtnContainer${state.pictureCounter}`
    div.classList.add("container");
    div.classList.add("justify-content-center");
    div.appendChild(element);
    return div;
}

function getFinishMsg(vcData, showVoltageButton) {
    let msg;
    if (showVoltageButton) {
        // Give a note what voltage is used and that voltage/current is available
        msg = `
        <p>${languageManager.currentLang.msgVoltAndCurrentAvailable}.<br></p>
        <p>${languageManager.currentLang.msgShowVoltage}<br>V1 = ${vcData.inline().oldValues[1]}</p>
        <button class="btn btn-primary mx-1" id="reset-btn">reset</button>
        <button class="btn btn-primary mx-1" id="check-btn">check</button>
    `;
    } else {
        // No msg, just the two buttons
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
    nextElementsContainer.classList.add("text-center");
    nextElementsContainer.classList.add("py-1");
    nextElementsContainer.classList.add("mb-3");
    nextElementsContainer.style.color = colors.currentForeground;
    if (onlyOneElementLeft(filteredPaths)) {
        nextElementsContainer.innerHTML = getFinishMsg(vcData, showVoltageButton);
    } else {
        // SanitizedSvgFilePath could be unnecessary here
        nextElementsContainer.innerHTML = `
        <h3>${languageManager.currentLang.nextElementsHeading}</h3>
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
    const svgContainer = setupSvgDivContainerAndData(svgData);
    circuitContainer.appendChild(svgContainer)
    return {circuitContainer, svgContainer};
}

function hideSvgArrows(svgDiv) {
    let arrows = svgDiv.getElementsByClassName("arrow");
    for (let arrow of arrows) arrow.style.display = "none";
}

function setupSvgDivContainerAndData(svgData) {
    const svgDiv = document.createElement('div');
    svgDiv.id = `svgDiv${state.pictureCounter}`;
    svgDiv.classList.add("svg-container");
    svgDiv.classList.add("p-2");
    svgData = setSvgWidthTo(svgData, "100%");
    svgDiv.style.border = `1px solid ${colors.currentForeground}`;
    svgDiv.style.borderRadius = "6px";
    svgDiv.style.width = "350px";
    svgDiv.style.maxWidth = "350px;";
    // Svg manipulation - set width and color for dark mode
    svgData = setSvgColorMode(svgData);
    svgDiv.innerHTML = svgData;
    hideSvgArrows(svgDiv);
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
    rect.style.fill = colors.keyYellow;
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
        state.selectedElements = state.selectedElements.filter(e => e !== pathElement.getAttribute('id'));
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
    state.selectedElements.push(pathElement.getAttribute('id') || 'no id');
}

function setupVoltageCurrentBtn() {
    const vcBtn = document.createElement("button");
    vcBtn.id = `vcBtn${state.pictureCounter}`
    vcBtn.classList.add("btn");
    vcBtn.classList.add("explBtn");
    vcBtn.classList.add("my-3");
    vcBtn.classList.add("mx-2");
    vcBtn.style.color = colors.currentForeground;
    vcBtn.style.borderColor = colors.currentForeground;
    vcBtn.textContent = languageManager.currentLang.showVoltageBtn;
    vcBtn.disabled = true;
    return vcBtn;
}

function setupCalculationBtn() {
    const calcBtn = document.createElement("button");
    calcBtn.id = `calcBtn${state.pictureCounter}`
    calcBtn.classList.add("btn");
    calcBtn.classList.add("explBtn");
    calcBtn.classList.add("my-3");
    calcBtn.classList.add("mx-2");
    calcBtn.style.color = colors.currentForeground;
    calcBtn.style.borderColor = colors.currentForeground;
    calcBtn.textContent = languageManager.currentLang.showCalculationBtn;
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

async function checkAndSimplifyNext(pyodide, div, stepDetails){
    const contentCol = document.getElementById("content-col");
    const nextElementsContainer = document.getElementById("nextElementsContainer");
    const svgDiv = document.getElementById(`svgDiv${state.pictureCounter}`);

    setTimeout(() => {resetNextElements(svgDiv, nextElementsContainer)},100);

    if (twoElementsChosen()) {
        const simplifyObject = await stepSolve.simplifyTwoCpts(state.selectedElements).toJs();
        checkAndSimplify(simplifyObject, pyodide, contentCol, div, stepDetails);
    } else {
        showMessage(contentCol, languageManager.currentLang.alertChooseTwoElements);
    }
    MathJax.typeset();
}

function checkAndSimplify(simplifyObject, pyodide, contentCol, div, stepDetails) {
    let elementsCanBeSimplified = simplifyObject[0];
    // Update paths, showVC and componentType are still the same
    stepDetails.jsonZPath = simplifyObject[1][0];
    stepDetails.jsonVCPath = simplifyObject[1][1];
    stepDetails.svgPath = simplifyObject[2];

    if (elementsCanBeSimplified) {
        if (notLastPicture()) {
            contentCol.append(div);
            enableLastCalcButton();
            scrollToBottom();
        }
        display_step(pyodide, stepDetails);
    } else {
        showMessage(contentCol, languageManager.currentLang.alertCanNotSimplify);
    }
}

function setupVCBtnFunctionality(vcText, contentCol, stepCalculationText) {
    const lastStepCalcBtn = document.getElementById(`calcBtn${state.pictureCounter - 1}`);
    const lastVCBtn = document.getElementById(`vcBtn${state.pictureCounter - 1}`);
    const explContainer = document.getElementById(`explBtnContainer${state.pictureCounter - 1}`);

    lastVCBtn.addEventListener("click", () => {
        if (lastVCBtn.textContent === languageManager.currentLang.showVoltageBtn) {
            lastVCBtn.textContent = languageManager.currentLang.hideVoltageBtn;
            // Add text after container
            explContainer.insertAdjacentElement("afterend", vcText);
            if (lastStepCalcBtn.textContent === languageManager.currentLang.hideCalculationBtn) {
                lastStepCalcBtn.textContent = languageManager.currentLang.showCalculationBtn;
                contentCol.removeChild(stepCalculationText);
            }
            MathJax.typeset();
        } else {
            lastVCBtn.textContent = languageManager.currentLang.showVoltageBtn;
            contentCol.removeChild(vcText);
        }
    })
}

function setupCalcBtnFunctionality(showVoltageButton, stepCalculationText, contentCol, vcText) {
    const lastStepCalcBtn = document.getElementById(`calcBtn${state.pictureCounter - 1}`);
    const explContainer = document.getElementById(`explBtnContainer${state.pictureCounter - 1}`);
    let lastVCBtn;
    if (showVoltageButton) lastVCBtn = document.getElementById(`vcBtn${state.pictureCounter - 1}`);

    lastStepCalcBtn.addEventListener("click", () => {
        if (lastStepCalcBtn.textContent === languageManager.currentLang.showCalculationBtn) {
            lastStepCalcBtn.textContent = languageManager.currentLang.hideCalculationBtn;
            if (showVoltageButton) {
                if (lastVCBtn.textContent === languageManager.currentLang.hideVoltageBtn) {
                    lastVCBtn.textContent = languageManager.currentLang.showVoltageBtn;
                    contentCol.removeChild(vcText);
                }
            }
            // Add explanation text after container
            explContainer.insertAdjacentElement("afterend", stepCalculationText);
            MathJax.typeset();
        } else {
            lastStepCalcBtn.textContent = languageManager.currentLang.showCalculationBtn;
            contentCol.removeChild(stepCalculationText);
        }
    })
}

function onlyOneElementLeft(filteredPaths) {
    return filteredPaths.length === 1;
}

function enableVoltageCurrentBtns() {
    for (let i = 1; i < state.pictureCounter; i++) {
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
    if (state.pictureCounter > 1) {
        setupCalcBtnFunctionality(showVoltageButton, stepCalculationText, contentCol, stepVoltageCurrentText);
        if (showVoltageButton) setupVCBtnFunctionality(stepVoltageCurrentText, contentCol, stepCalculationText);
    }
}

function generateTexts(data, vcData, componentTypes) {
    let stepCalculationText = generateTextForZ(data, componentTypes);
    stepCalculationText.style.color = colors.currentForeground;

    let stepVoltageCurrentText = generateTextForVoltageCurrent(vcData);
    stepVoltageCurrentText.style.color = colors.currentForeground;
    return {stepCalculationText, stepVoltageCurrentText};
}

function finishCircuit(contentCol, showVoltageButton) {
    document.getElementById("check-btn").disabled = true;
    showMessage(contentCol, languageManager.currentLang.msgCongratsFinishedCircuit, "success");
    confetti({
        particleCount: 150,
        angle: 90,
        spread: 60,
        scalar: 0.8,
        origin: { x: 0.5, y: 1}
    });
    if (showVoltageButton) {
        enableVoltageCurrentBtns();
        showArrows(contentCol);
    }
}

function setupStepButtonsFunctionality(pyodide, div, stepDetails) {
    document.getElementById("reset-btn").addEventListener('click', () =>
        resetSimplifierPage(pyodide)
    );
    document.getElementById("check-btn").addEventListener('click', async () => {
        checkAndSimplifyNext(pyodide, div, stepDetails);
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

function loadData(pyodide, stepDetails) {
    let data = getImpedanceData(pyodide, stepDetails.jsonZPath);
    let vcData = getVoltageCurrentData(pyodide, stepDetails.jsonVCPath);
    let svgData = pyodide.FS.readFile(stepDetails.svgPath, {encoding: "utf8"});
    const sanitizedSvgFilePath = sanitizeSelector(stepDetails.svgPath);
    return {data, vcData, svgData, sanitizedSvgFilePath};
}

function checkIfStillNotFinishedAndMakeClickable(filteredPaths, nextElementsContainer, sanitizedSvgFilePath, pathElements) {
    if (elementsLeftToBeSimplified(filteredPaths)) {
        getAllElementsAndMakeClickable(nextElementsContainer, sanitizedSvgFilePath, pathElements);
    }
}

function congratsAndVCDisplayIfFinished(filteredPaths, contentCol, showVoltageButton, vcData) {
    if (onlyOneElementLeft(filteredPaths)) {
        finishCircuit(contentCol, showVoltageButton);
        addFirstVCExplanation(contentCol, showVoltageButton, vcData);
    }
}

function addFirstVCExplanation(contentCol, showVoltageButton, vcData) {
    if (showVoltageButton) {
        const totalCurrentContainer = createTotalCurrentContainer();
        const totalCurrentBtn = createTotalCurrentBtn();
        addBtnToContainer(totalCurrentContainer, totalCurrentBtn);
        let text = generateTextElement(vcData);

        totalCurrentBtn.addEventListener("click", () => {
            if (totalCurrentBtn.textContent === languageManager.currentLang.firstVCStepBtn) {
                totalCurrentBtn.textContent = languageManager.currentLang.hideVoltageBtn;
                totalCurrentContainer.appendChild(text);
                MathJax.typeset();
            } else {
                totalCurrentBtn.textContent = languageManager.currentLang.firstVCStepBtn;
                totalCurrentContainer.removeChild(text);
            }
        })
    }
}

function addBtnToContainer(totalCurrentContainer, totalCurrentBtn) {
    document.getElementById("reset-btn").insertAdjacentElement("beforebegin", totalCurrentContainer);
    totalCurrentContainer.appendChild(totalCurrentBtn);
}

function generateTextElement(vcData) {
    let text = document.createElement("p");
    text.innerHTML = generateTextForTotalCurrent(vcData);
    return text;
}

function createTotalCurrentContainer() {
    const firstStepContainer = document.createElement("div");
    firstStepContainer.id = "firstVCStepContainer";
    firstStepContainer.classList.add("container");
    firstStepContainer.classList.add("justify-content-center");
    return firstStepContainer;
}

function createTotalCurrentBtn() {
    const totalCurrentBtn = setupVoltageCurrentBtn();
    totalCurrentBtn.textContent = languageManager.currentLang.firstVCStepBtn;
    totalCurrentBtn.disabled = false;
    // Adjust margins from normal VC Btn because reset button is right below, give more space
    totalCurrentBtn.classList.remove("my-3");
    totalCurrentBtn.classList.add("mt-3");
    totalCurrentBtn.classList.add("mb-5");
    return totalCurrentBtn;
}

function setStyleAndEvent(pathElement, nextElementsList) {
    pathElement.style.pointerEvents = 'bounding-box';
    pathElement.style.cursor = 'pointer';
    // Make elements clickable
    pathElement.addEventListener('click', () =>
        chooseElement(pathElement, nextElementsList)
    );
}
