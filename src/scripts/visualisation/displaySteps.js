// ####################################################################################################################
// #################################### Key function for displaying new svgs ##########################################
// ####################################################################################################################
function display_step(pyodide,stepDetails) {
    // Load data
    let showVCData = stepDetails.showVCData;

    let {data,vcData,svgData,sanitizedSvgFilePath} = loadData(pyodide, stepDetails);
    state.pictureCounter++;  // increment before usage in the below functions

    // Create the new elements for the current step
    const {circuitContainer, svgContainer} = setupCircuitContainer(svgData);
    const {newCalcBtn, newVCBtn} = setupExplanationButtons(showVCData);
    const electricalElements = getElementsFromSvgContainer(svgContainer);
    const nextElementsContainer = setupNextElementsContainer(sanitizedSvgFilePath, electricalElements, vcData, showVCData);
    const contentCol = document.getElementById("content-col");
    contentCol.append(circuitContainer);

    // Create the texts and buttons for the detailed calculation explanation
    let {stepCalculationText, stepVoltageCurrentText} = generateTexts(data, vcData, stepDetails.componentTypes);
    checkAndAddExplanationButtons(showVCData, stepCalculationText, contentCol, stepVoltageCurrentText);

    // The order of function-calls is important
    checkIfStillNotFinishedAndMakeClickable(electricalElements, nextElementsContainer, sanitizedSvgFilePath);
    prepareNextElementsContainer(contentCol, nextElementsContainer);
    const div = createExplanationBtnContainer(newCalcBtn);
    if (showVCData) div.appendChild(newVCBtn);

    setupStepButtonsFunctionality(pyodide, div, stepDetails);
    appendToAllValuesMap(showVCData, vcData, data);
    congratsAndVCDisplayIfFinished(electricalElements, contentCol, showVCData, vcData, pyodide);
    MathJax.typeset();
}

// ####################################################################################################################
// ############################################# Helper functions #####################################################
// ####################################################################################################################

function appendToAllValuesMap(showVCData, vcData, data) {
    if (showVCData) {
        // If voltage/current is shown, add all Z U and I values to the map
        state.allValuesMap.set(vcData.noFormat().names1[0], vcData.noFormat().values1[0]);  // Z
        state.allValuesMap.set(vcData.noFormat().names1[1], vcData.noFormat().values1[1]);  // U
        state.allValuesMap.set(vcData.noFormat().names1[2], vcData.noFormat().values1[2]);  // I
        state.allValuesMap.set(vcData.noFormat().names2[0], vcData.noFormat().values2[0]);  // Z
        state.allValuesMap.set(vcData.noFormat().names2[1], vcData.noFormat().values2[1]);  // U
        state.allValuesMap.set(vcData.noFormat().names2[2], vcData.noFormat().values2[2]);  // I
    } else {
        // If voltage/current is not shown, add only the Z values to the map
        state.allValuesMap.set(data.noFormat().name1, data.noFormat().value1);
        state.allValuesMap.set(data.noFormat().name2, data.noFormat().value2);
    }
}

function createExplanationBtnContainer(element) {
    const div = document.createElement("div");
    div.id = `explBtnContainer${state.pictureCounter}`
    div.classList.add("container");
    div.classList.add("justify-content-center");
    div.appendChild(element);
    return div;
}

function getFinishMsg(vcData, showVCData) {
    let msg;
    if (showVCData) {
        // Give a note what voltage is used and that voltage/current is available
        msg = `
        <p>${languageManager.currentLang.msgVoltAndCurrentAvailable}.<br></p>
        <p>${languageManager.currentLang.msgShowVoltage}<br>$$ ${languageManager.currentLang.voltageSymbol}_{${languageManager.currentLang.totalSuffix}}=${vcData.noFormat().oldValues[1]}$$</p>
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

function setupNextElementsContainer(sanitizedSvgFilePath, filteredPaths, vcData, showVCData) {
    const nextElementsContainer = document.createElement('div');
    nextElementsContainer.className = 'next-elements-container';
    nextElementsContainer.id = "nextElementsContainer";
    nextElementsContainer.classList.add("text-center");
    nextElementsContainer.classList.add("py-1");
    nextElementsContainer.classList.add("mb-3");
    nextElementsContainer.style.color = colors.currentForeground;
    if (onlyOneElementLeft(filteredPaths)) {
        nextElementsContainer.innerHTML = getFinishMsg(vcData, showVCData);
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
    return Array.from(pathElements).filter(path => (path.getAttribute('class') !== 'na')
        && (!path.getAttribute('class').includes("arrow")))
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
    listItem.innerHTML = `\\(${pathElement.getAttribute('id') || 'no id'} = ${value}\\)`;
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
        showMessage(contentCol, languageManager.currentLang.alertChooseTwoElements, "only2");
        pushCircuitEventMatomo(circuitActions.ErrOnly2, state.selectedElements.length)
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
            scrollNextElementsContainerIntoView();
        }
        display_step(pyodide, stepDetails);
    } else {
        showMessage(contentCol, languageManager.currentLang.alertCanNotSimplify, "warning");
        pushCircuitEventMatomo(circuitActions.ErrCanNotSimpl);
    }
}

function setupVCBtnFunctionality(vcText, contentCol, stepCalculationText) {
    const lastStepCalcBtn = document.getElementById(`calcBtn${state.pictureCounter - 1}`);
    const lastVCBtn = document.getElementById(`vcBtn${state.pictureCounter - 1}`);
    const explContainer = document.getElementById(`explBtnContainer${state.pictureCounter - 1}`);

    lastVCBtn.addEventListener("click", () => {
        if (lastVCBtn.textContent === languageManager.currentLang.showVoltageBtn) {
            // Open voltage/current explanation
            lastVCBtn.textContent = languageManager.currentLang.hideVoltageBtn;
            explContainer.insertAdjacentElement("afterend", vcText);
            if (lastStepCalcBtn.textContent === languageManager.currentLang.hideCalculationBtn) {
                lastStepCalcBtn.textContent = languageManager.currentLang.showCalculationBtn;
                contentCol.removeChild(stepCalculationText);
            }
            MathJax.typeset();
            pushCircuitEventMatomo(circuitActions.ViewVcExplanation)
        } else {
            // Close voltage/current explanation
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
            // Open calculation explanation
            lastStepCalcBtn.textContent = languageManager.currentLang.hideCalculationBtn;
            if (showVoltageButton) {
                if (lastVCBtn.textContent === languageManager.currentLang.hideVoltageBtn) {
                    // If voltage/current explanation is open, close it
                    lastVCBtn.textContent = languageManager.currentLang.showVoltageBtn;
                    contentCol.removeChild(vcText);
                }
            }
            // Add explanation text after container
            explContainer.insertAdjacentElement("afterend", stepCalculationText);
            MathJax.typeset();
            pushCircuitEventMatomo(circuitActions.ViewZExplanation);
        } else {
            // Close calculation explanation
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

function finishCircuit(contentCol, showVCData) {
    document.getElementById("check-btn").disabled = true;
    showMessage(contentCol, languageManager.currentLang.msgCongratsFinishedCircuit, "success", false);
    confetti({
        particleCount: 150,
        angle: 90,
        spread: 60,
        scalar: 0.8,
        origin: { x: 0.5, y: 1}
    });
    if (showVCData) {
        enableVoltageCurrentBtns();
        showArrows(contentCol);
    }
    pushCircuitEventMatomo(circuitActions.Finished);
}

function setupStepButtonsFunctionality(pyodide, div, stepDetails) {
    document.getElementById("reset-btn").addEventListener('click', () => {
        pushCircuitEventMatomo(circuitActions.Reset, state.pictureCounter);
        resetSimplifierPage(pyodide, true);
    });
    document.getElementById("check-btn").addEventListener('click', async () => {
        checkAndSimplifyNext(pyodide, div, stepDetails);
    });
}

function getAllElementsAndMakeClickable(nextElementsContainer, sanitizedSvgFilePath, electricalElements) {
    const nextElementsList = nextElementsContainer.querySelector(`#next-elements-list-${sanitizedSvgFilePath}`);
    electricalElements.forEach(element => setStyleAndEvent(element, nextElementsList));
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

function checkIfStillNotFinishedAndMakeClickable(electricalElements, nextElementsContainer, sanitizedSvgFilePath) {
    if (elementsLeftToBeSimplified(electricalElements)) {
        getAllElementsAndMakeClickable(nextElementsContainer, sanitizedSvgFilePath, electricalElements);
    }
}

function congratsAndVCDisplayIfFinished(filteredPaths, contentCol, showVCData, vcData, pyodide) {
    if (onlyOneElementLeft(filteredPaths)) {
        addFirstVCExplanation(showVCData, vcData);
        addSolutionsButton(pyodide, showVCData, vcData);
        addBackButton(pyodide, contentCol);
        finishCircuit(contentCol, showVCData);
    }
}

function prepareAllValuesMap(vcData, showVCData) {
    // Add total values
    state.allValuesMap.set(vcData.noFormat().oldNames[0], vcData.noFormat().oldValues[0]);  // total Z
    if (showVCData) {
        state.allValuesMap.set(vcData.noFormat().oldNames[1], vcData.noFormat().oldValues[1]);  // total U
        state.allValuesMap.set(vcData.noFormat().oldNames[2], vcData.noFormat().oldValues[2]);  // total I
    }
    // Remove null values
    for (let k of state.allValuesMap.keys()) {
        if (k === null)
            state.allValuesMap.delete(k);
    }
    // Sort by key names
    state.allValuesMap = new Map([...state.allValuesMap.entries()].sort());
}

function addSolutionsButton(pyodide, showVCData, vcData) {
    const solBtnContainer = createSolutionsBtnContainer();
    const solBtn = createSolutionsBtn();
    addBtnToContainer(solBtnContainer, solBtn);
    prepareAllValuesMap(vcData, showVCData);
    let table = generateSolutionsTable(showVCData);

    let originalStep0Svg = document.getElementById("svgDiv1");
    let clonedSvgData = originalStep0Svg.cloneNode(true);
    clonedSvgData.id = "clonedOverviewSvg";
    clonedSvgData.appendChild(table);
    if (showVCData) {
        let arrows = clonedSvgData.getElementsByClassName("arrow");
        for (let arrow of arrows) {
            arrow.style.display = "block";
            arrow.style.opacity = "0.5";
        }
    }
    let div = document.createElement("div");
    div.classList.add("circuit-container");
    div.classList.add("justify-content-center");
    div.classList.add("row");
    div.appendChild(clonedSvgData);

    solBtn.addEventListener("click", () => {
        if (solBtn.textContent === languageManager.currentLang.solutionsBtn) {
            // Open explanation
            solBtn.textContent = languageManager.currentLang.hideVoltageBtn;
            solBtnContainer.appendChild(div);
            MathJax.typeset();
            pushCircuitEventMatomo(circuitActions.ViewSolutions);
        } else {
            // Close explanation
            solBtn.textContent = languageManager.currentLang.solutionsBtn;
            solBtnContainer.removeChild(div);
        }
    })
}

function addBackButton(pyodide, contentCol) {
    let backButton = document.createElement("button");
    backButton.classList.add("btn");
    backButton.classList.add("btn-primary");
    backButton.id = "back-btn";
    backButton.innerHTML = languageManager.currentLang.backBtn;
    contentCol.appendChild(backButton);
    backButton.addEventListener("click", () => {
        resetSimplifierPage(pyodide);
        pageManager.showSelectPage();
    });
}

function addFirstVCExplanation(showVCData, vcData) {
    if (showVCData) {
        const totalCurrentContainer = createTotalCurrentContainer();
        const totalCurrentBtn = createTotalCurrentBtn();
        addBtnToContainer(totalCurrentContainer, totalCurrentBtn);
        let text = generateTextElement(vcData);

        totalCurrentBtn.addEventListener("click", () => {
            if (totalCurrentBtn.textContent === languageManager.currentLang.firstVCStepBtn) {
                // Open explanation
                totalCurrentBtn.textContent = languageManager.currentLang.hideVoltageBtn;
                totalCurrentContainer.appendChild(text);
                MathJax.typeset();
                pushCircuitEventMatomo(circuitActions.ViewTotalExplanation);
            } else {
                // Close explanation
                totalCurrentBtn.textContent = languageManager.currentLang.firstVCStepBtn;
                totalCurrentContainer.removeChild(text);
            }
        })
    }
}

function addBtnToContainer(container, element) {
    document.getElementById("reset-btn").insertAdjacentElement("beforebegin", container);
    container.appendChild(element);
}

function generateTextElement(vcData) {
    let text = document.createElement("p");
    text.innerHTML = generateTextForTotalCurrent(vcData);
    return text;
}

function generateZIUArrays() {
    let iMap = new Map();
    let uMap = new Map();
    let zMap = new Map();
    for (let [key, value] of state.allValuesMap.entries()) {
        if (key.startsWith('U') || key.startsWith('V')) {
            uMap.set(key, value);
        } else if (key.startsWith('I')) {
            iMap.set(key, value);
        } else {
            zMap.set(key, value);
        }
    }
    let iArray = Array.from(iMap);
    let uArray = Array.from(uMap);
    let zArray = Array.from(zMap);
    return {iArray, uArray, zArray};
}

function generateSolutionsTable(showVCData) {
    let table = document.createElement("div");
    let isDarkMode = document.getElementById("darkmode-switch").checked;
    let tableData, color;
    let regex = /[A-Z]s\d*/;  // To differentiate between X1 and Xs1
    if (isDarkMode) {
        tableData = `<table id="solutionsTable" class="table table-dark"><tbody>`;
    } else {
        tableData = `<table id="solutionsTable" class="table table-light"><tbody>`;
    }

    table.style.display = "flex";
    table.style.justifyContent = "center";
    table.style.alignItems = "center";
    if (showVCData) {
        let {iArray, uArray, zArray} = generateZIUArrays();
        for (let i = 0; i < zArray.length; i++) {
            if (regex.test(zArray[i][0])) {
                color = colors.keyGreyedOut;
            } else {
                color = ((isDarkMode) ? colors.keyLight : colors.keyDark);
            }
            tableData += `<tr>
                <td style="color: ${color}">$$${zArray[i][0]} = ${zArray[i][1]}$$</td>
                <td style="color: ${color}">$$${uArray[i][0]} = ${uArray[i][1]}$$</td>
                <td style="color: ${color}">$$${iArray[i][0]} = ${iArray[i][1]}$$</td>
            </tr>`;
        }
    } else {
        for (let [key, value] of state.allValuesMap.entries()) {
            if (regex.test(key)) {
                color = colors.keyGreyedOut;
            } else {
                color = ((isDarkMode) ? colors.keyLight : colors.keyDark);
            }
            tableData += `<tr><td style="color: ${color}">$$${key} = ${value}$$</td></tr>`;
        }
    }
    tableData += `</tbody></table></div>`;
    table.innerHTML = tableData;
    return table;
}

function createTotalCurrentContainer() {
    const firstStepContainer = document.createElement("div");
    firstStepContainer.id = "firstVCStepContainer";
    firstStepContainer.classList.add("container");
    firstStepContainer.classList.add("justify-content-center");
    return firstStepContainer;
}

function createSolutionsBtnContainer() {
    const solutionsContainer = document.createElement("div");
    solutionsContainer.id = "solutionsBtnContainer";
    solutionsContainer.classList.add("container");
    solutionsContainer.classList.add("mb-5");
    solutionsContainer.classList.add("justify-content-center");
    return solutionsContainer;
}

function createTotalCurrentBtn() {
    const totalCurrentBtn = setupVoltageCurrentBtn();
    totalCurrentBtn.textContent = languageManager.currentLang.firstVCStepBtn;
    totalCurrentBtn.disabled = false;
    // Adjust margins from normal VC Btn because reset button is right below, give more space
    totalCurrentBtn.classList.remove("my-3");
    totalCurrentBtn.classList.add("mt-3");
    totalCurrentBtn.classList.add("mb-3");
    return totalCurrentBtn;
}

function createSolutionsBtn() {
    const totalCurrentBtn = setupVoltageCurrentBtn();
    totalCurrentBtn.textContent = languageManager.currentLang.solutionsBtn;
    totalCurrentBtn.disabled = false;
    // Adjust margins from normal VC Btn because reset button is right below, give more space
    totalCurrentBtn.classList.remove("my-3");
    totalCurrentBtn.classList.add("mt-3");
    totalCurrentBtn.classList.add("mb-3");
    return totalCurrentBtn;
}

function setStyleAndEvent(element, nextElementsList) {
    element.style.pointerEvents = "bounding-box";
    element.style.cursor = 'pointer';
    element.addEventListener('click', () =>
    chooseElement(element, nextElementsList)
    );
}
