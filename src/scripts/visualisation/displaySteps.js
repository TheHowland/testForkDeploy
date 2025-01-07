// ####################################################################################################################
// #################################### Key function for displaying new svgs ##########################################
// ####################################################################################################################
function display_step(stepDetails) {
    // Load data

    let showVCData = state.currentCircuitShowVC;

    let {data,vcData,svgData,sanitizedSvgFilePath} = loadData(stepDetails);
    state.pictureCounter++;  // increment before usage in the below functions

    // Create the new elements for the current step
    const {circuitContainer, svgContainer} = setupCircuitContainer(svgData, stepDetails);
    const {newCalcBtn, newVCBtn} = setupExplanationButtons(showVCData);
    const electricalElements = getElementsFromSvgContainer(svgContainer);
    const nextElementsContainer = setupNextElementsContainer(sanitizedSvgFilePath, electricalElements, vcData, showVCData);
    const contentCol = document.getElementById("content-col");
    contentCol.append(circuitContainer);

    // Create the texts and buttons for the detailed calculation explanation
    let {stepCalculationText, stepVoltageCurrentText} = generateTexts(data, vcData, stepDetails.getComponentTypes());
    checkAndAddExplanationButtons(showVCData, stepCalculationText, contentCol, stepVoltageCurrentText);

    // The order of function-calls is important
    checkIfStillNotFinishedAndMakeClickable(electricalElements, nextElementsContainer, sanitizedSvgFilePath);
    prepareNextElementsContainer(contentCol, nextElementsContainer);
    const div = createExplanationBtnContainer(newCalcBtn);
    if (showVCData) div.appendChild(newVCBtn);

    setupStepButtonsFunctionality(div, stepDetails);
    appendToAllValuesMap(showVCData, vcData, data);
    congratsAndVCDisplayIfFinished(electricalElements, contentCol, showVCData, vcData);
    MathJax.typeset();
}

// ####################################################################################################################
// ############################################# Helper functions #####################################################
// ####################################################################################################################

function appendToAllValuesMap(showVCData, vcData, data) {
    if (showVCData) {
        // If voltage/current is shown, add all Z/R/C/L U and I values to the map from the two elements
        // TODO this needs to be adapted according to the new data structure
        state.allValuesMap.set(vcData.noFormat().names1[0], vcData.noFormat().values1[0]);  // Z
        state.allValuesMap.set(vcData.noFormat().names1[1], vcData.noFormat().values1[1]);  // U
        state.allValuesMap.set(vcData.noFormat().names1[2], vcData.noFormat().values1[2]);  // I
        state.allValuesMap.set(vcData.noFormat().names2[0], vcData.noFormat().values2[0]);  // Z
        state.allValuesMap.set(vcData.noFormat().names2[1], vcData.noFormat().values2[1]);  // U
        state.allValuesMap.set(vcData.noFormat().names2[2], vcData.noFormat().values2[2]);  // I
    } else {
        // If voltage/current is not shown, add only the Z values to the map
        // Only add the key if it is not already in the map (example Rs1 will be added with nemName and when used again as name1), we don't want to overwrite it
        if (!state.allValuesMap.has(data.noFormat().name1)) state.allValuesMap.set(data.noFormat().name1, data.noFormat().value1);
        if (!state.allValuesMap.has(data.noFormat().name2)) state.allValuesMap.set(data.noFormat().name2, data.noFormat().value2);
        // Also explain the simplified component (now only in sub circuits because it needs too much space)
        let explanation = data.noFormat().result;
        if (data.noFormat().relation === "parallel") {
             explanation += "\\ (" + data.noFormat().name1 + "\\ || \\ " + data.noFormat().name2 + ")";
        } else {
            explanation += "\\ (" + data.noFormat().name1 + "+" + data.noFormat().name2 + ")";
        }
        state.allValuesMap.set(data.noFormat().newName, explanation);
    }
}

function createExplanationBtnContainer(element) {
    const div = document.createElement("div");
    div.id = `explBtnContainer${state.pictureCounter}`
    div.classList.add("container", "justify-content-center");
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
        <button class="btn btn-secondary mx-1" id="reset-btn">reset</button>
        <button class="btn btn-primary mx-1 disabled" id="check-btn">check</button>
    `;
    } else {
        // No msg, just the two buttons
        msg = `
        <button class="btn btn-secondary mx-1" id="reset-btn">reset</button>
        <button class="btn btn-primary mx-1 disabled" id="check-btn">check</button>
    `;
    }
    return msg;
}

function setupNextElementsContainer(sanitizedSvgFilePath, filteredPaths, vcData, showVCData) {
    const nextElementsContainer = document.createElement('div');
    nextElementsContainer.className = 'next-elements-container';
    nextElementsContainer.id = "nextElementsContainer";
    nextElementsContainer.classList.add("text-center", "py-1", "mb-3");
    nextElementsContainer.style.color = colors.currentForeground;
    if (onlyOneElementLeft(filteredPaths)) {
        nextElementsContainer.innerHTML = getFinishMsg(vcData, showVCData);
    } else {
        // SanitizedSvgFilePath could be unnecessary here
        nextElementsContainer.innerHTML = `
        <h3>${languageManager.currentLang.nextElementsHeading}</h3>
        <ul class="px-0" id="next-elements-list-${sanitizedSvgFilePath}"></ul>
        <button class="btn btn-secondary mx-1 ${state.pictureCounter === 1 ? "disabled" : ""}" id="reset-btn">reset</button>
        <button class="btn btn-primary mx-1" id="check-btn">check</button>
    `;
    }
    return nextElementsContainer;
}

function setupCircuitContainer(svgData, stepDetails) {
    const circuitContainer = document.createElement('div');
    circuitContainer.classList.add("circuit-container", "row", "justify-content-center", "my-2");
    const svgContainer = setupSvgDivContainerAndData(svgData, stepDetails);
    circuitContainer.appendChild(svgContainer)
    return {circuitContainer, svgContainer};
}

function hideSvgArrows(svgDiv) {
    let arrows = svgDiv.getElementsByClassName("arrow");
    for (let arrow of arrows) arrow.style.display = "none";
}

function addInfoHelpButton(svgDiv) {
    let infoBtn = document.createElement("button");
    infoBtn.type = "button";
    infoBtn.id = "open-info-gif-btn";
    infoBtn.classList.add("btn", "btn-primary");
    infoBtn.style.position = "absolute";
    infoBtn.style.top = "5px";
    infoBtn.style.left = "5px";
    infoBtn.style.float = "left";
    infoBtn.style.color = colors.keyYellow;
    infoBtn.style.border = `1px solid ${colors.keyYellow}`;
    infoBtn.style.background = "none";
    infoBtn.style.fontWeight = "bold";
    infoBtn.innerText = "?";
    infoBtn.setAttribute("data-bs-toggle", "modal");
    infoBtn.setAttribute("data-bs-target", "#infoGif");
    infoBtn.onclick = () => {infoBtn.blur()};  // make sure focus is removed when opening modal
    svgDiv.insertAdjacentElement("afterbegin", infoBtn);
}

function setupSvgDivContainerAndData(svgData, stepDetails) {
    const svgDiv = document.createElement('div');
    svgDiv.id = `svgDiv${state.pictureCounter}`;
    svgDiv.classList.add("svg-container", "p-2");
    svgData = setSvgWidthTo(svgData, "100%");
    svgDiv.style.border = `1px solid ${colors.currentForeground}`;
    svgDiv.style.borderRadius = "6px";
    svgDiv.style.width = "350px";
    svgDiv.style.maxWidth = "350px;";
    svgDiv.style.position = "relative";
    // Svg manipulation - set width and color for dark mode
    svgData = setSvgColorMode(svgData);
    // TODO REMOVE
    svgData = addClasses(svgData);

    svgDiv.innerHTML = svgData;
    hideSvgArrows(svgDiv);
    if (state.pictureCounter === 1) {
        addInfoHelpButton(svgDiv);
    }
    addNameValueToggleBtn(svgDiv, stepDetails);
    return svgDiv;
}

//TODO REMOVE
function addClasses(svgData) {
    svgData = svgData.replace(">R1</tspan>", " class='R1'>R1</tspan>");
    svgData = svgData.replace(">R2</tspan>", " class='R2'>R2</tspan>");
    svgData = svgData.replace(">R3</tspan>", " class='R3'>R3</tspan>");
    svgData = svgData.replace(">R4</tspan>", " class='R4'>R4</tspan>");
    return svgData;
}

function addNameValueToggleBtn(svgDiv, stepDetails) {
    const nameValueToggleBtn = document.createElement("button");
    nameValueToggleBtn.type = "button";
    nameValueToggleBtn.id = `toggle-view-${state.pictureCounter}`;
    nameValueToggleBtn.classList.add("btn", "btn-secondary", "toggle-view");
    nameValueToggleBtn.style.position = "absolute";
    nameValueToggleBtn.style.top = "5px";
    nameValueToggleBtn.style.right = "5px";
    nameValueToggleBtn.style.color = colors.currentForeground;
    nameValueToggleBtn.style.border = `1px solid ${colors.currentForeground}`;
    nameValueToggleBtn.style.background = "none";
    nameValueToggleBtn.innerText = toggleSymbolDefinition.namesShown;
    nameValueToggleBtn.onclick = () => {toggleNameValue(nameValueToggleBtn, svgDiv, stepDetails)};
    svgDiv.insertAdjacentElement("afterbegin", nameValueToggleBtn);
}

function toggleNameValue(nameValueToggleBtn, svgDiv, stepDetails) {
    console.log("Toggle name value");
    let nameValueMap = stepDetails.getElementNamesAndValues();

    // TODO Add all help values like Rs1, Rs2, Cs1, Cs2, Ls1, Ls2

    for (let [key, value] of Object.entries(nameValueMap)) {
        let tspan = svgDiv.querySelector(`.${key}`);
        if (tspan === null) continue;
        if (value.includes("\\Omega")) {
            value = value.replace("\\Omega", "Ω");
        }
        if (value.includes("\\text{")) {
            value = value.replace("\\text{", "");
            value = value.replace("} ", "");
        }
        if (nameValueToggleBtn.innerText === toggleSymbolDefinition.namesShown) {
            tspan.innerHTML = tspan.innerHTML.replace(key, `${value}`);
        } else {
            tspan.innerHTML = tspan.innerHTML.replace(`${value}`, key);
        }
    }
    // Toggle button icon
    if (nameValueToggleBtn.innerText === toggleSymbolDefinition.namesShown) {
        nameValueToggleBtn.innerText = toggleSymbolDefinition.valuesShown;
    } else {
        nameValueToggleBtn.innerText = toggleSymbolDefinition.namesShown;
    }
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
    vcBtn.classList.add("btn", "explBtn", "my-3", "mx-2");
    vcBtn.style.color = colors.currentForeground;
    vcBtn.style.borderColor = colors.currentForeground;
    vcBtn.textContent = languageManager.currentLang.showVoltageBtn;
    vcBtn.disabled = true;
    return vcBtn;
}

function setupCalculationBtn() {
    const calcBtn = document.createElement("button");
    calcBtn.id = `calcBtn${state.pictureCounter}`
    calcBtn.classList.add("btn", "explBtn", "my-3", "mx-2");
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

function getImpedanceData(jsonFilePath_Z) {
    let jsonDataString = state.pyodide.FS.readFile(jsonFilePath_Z, {encoding: "utf8"});
    const jsonData = JSON.parse(jsonDataString);

    let data = new SolutionObject(
        jsonData.name1, jsonData.name2, jsonData.newName,
        jsonData.value1, jsonData.value2, jsonData.result,
        jsonData.relation, jsonData.latexEquation
    );
    return data;
}

function getVoltageCurrentData(jsonFilePath_VC) {
    let vcData;
    if (jsonFilePath_VC != null) {
        let jsonDataString_VC = state.pyodide.FS.readFile(jsonFilePath_VC, {encoding: "utf8"});
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

async function checkAndSimplifyNext(div, stepDetails){
    const contentCol = document.getElementById("content-col");
    const nextElementsContainer = document.getElementById("nextElementsContainer");
    const svgDiv = document.getElementById(`svgDiv${state.pictureCounter}`);

    if (twoElementsChosen()) {
        const simplifyObject = await stepSolve.simplifyTwoCpts(state.selectedElements).toJs();
        checkAndSimplify(simplifyObject, contentCol, div, stepDetails);
    } else {
        showMessage(contentCol, languageManager.currentLang.alertChooseTwoElements, "only2");
        pushCircuitEventMatomo(circuitActions.ErrOnly2, state.selectedElements.length)
    }
    resetNextElements(svgDiv, nextElementsContainer);
    MathJax.typeset();
}

function checkAndSimplify(simplifyObject, contentCol, div, stepDetails) {
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
        // Remove event listeners from old picture elements
        removeOldEventListeners();
        display_step(stepDetails);
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
    showMessage(contentCol, languageManager.currentLang.msgCongratsFinishedCircuit, "success");
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

function setupStepButtonsFunctionality(div, stepDetails) {
    document.getElementById("reset-btn").addEventListener('click', () => {
        // Can only be after step 1 because the first step can't be reset, so no need to check
        pushCircuitEventMatomo(circuitActions.Reset, state.pictureCounter);
        resetSimplifierPage(true);
    });
    // Check btn clicked, set spinner inside and simplify next step
    document.getElementById("check-btn").addEventListener('click', async () => {
        document.getElementById("check-btn").innerHTML = "<span class='spinner-border spinner-border-sm'></span>";
        requestAnimationFrame(() => {
            setTimeout(() => {
                checkAndSimplifyNext(div, stepDetails);
                document.getElementById("check-btn").innerHTML = "check";
            }, 0);
        });
    });
}

function removeOldEventListeners() {
    const svgDiv = document.getElementById(`svgDiv${state.pictureCounter}`);
    const pathElements = svgDiv.querySelectorAll('path');
    let electricElements = Array.from(pathElements).filter(path => (path.getAttribute('class') !== 'na')
        && (!path.getAttribute('class').includes("arrow")));
    for (let element of electricElements) {
        // Clone the node and replace its original with the clone, this removes all event listeners
        let clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
    }
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

function loadData(stepDetails) {
    let data = getImpedanceData(stepDetails.jsonZPath);
    let vcData = getVoltageCurrentData(stepDetails.jsonVCPath);
    let svgData = state.pyodide.FS.readFile(stepDetails.svgPath, {encoding: "utf8"});
    const sanitizedSvgFilePath = sanitizeSelector(stepDetails.svgPath);
    return {data, vcData, svgData, sanitizedSvgFilePath};
}

function checkIfStillNotFinishedAndMakeClickable(electricalElements, nextElementsContainer, sanitizedSvgFilePath) {
    if (elementsLeftToBeSimplified(electricalElements)) {
        getAllElementsAndMakeClickable(nextElementsContainer, sanitizedSvgFilePath, electricalElements);
    }
}

function congratsAndVCDisplayIfFinished(filteredPaths, contentCol, showVCData, vcData) {
    if (onlyOneElementLeft(filteredPaths)) {
        addFirstVCExplanation(showVCData, vcData);
        addSolutionsButton(showVCData, vcData);
        finishCircuit(contentCol, showVCData);
    }
}

function prepareAllValuesMap(vcData, showVCData) {
    let zWithTotal = vcData.noFormat().oldNames[0][0] + "_{" + languageManager.currentLang.totalSuffix + "}";  // Only first letter Z/R/L/C
    if (showVCData) {
        let uWithTotal = vcData.noFormat().oldNames[1][0] + "_{" + languageManager.currentLang.totalSuffix + "}";  // Only first letter U/V
        let iWithTotal = vcData.noFormat().oldNames[2][0] + "_{" + languageManager.currentLang.totalSuffix + "}";  // Only first letter I
        state.allValuesMap.set(zWithTotal, vcData.noFormat().convOldValue[0]);  // total R/L/C (not complex), but maybe sometime
        state.allValuesMap.set(uWithTotal, vcData.noFormat().oldValues[1]);  // total U
        state.allValuesMap.set(iWithTotal, vcData.noFormat().oldValues[2]);  // total I
    } else {
        state.allValuesMap.set(zWithTotal, vcData.noFormat().convOldValue[0]);  // total R/L/C (not complex)
    }
    // Remove null values
    for (let k of state.allValuesMap.keys()) {
        if (k === null)
            state.allValuesMap.delete(k);
    }
    // Sort by key names
    state.allValuesMap = new Map([...state.allValuesMap.entries()].sort());
}

function addSolutionsButton(showVCData, vcData) {
    const solBtnContainer = createSolutionsBtnContainer();
    const solBtn = createSolutionsBtn();
    addBtnToContainer(solBtnContainer, solBtn);
    prepareAllValuesMap(vcData, showVCData);
    let table = generateSolutionsTable(showVCData);

    let originalStep0Svg = document.getElementById("svgDiv1");
    // check if in the original step the names are shown or the values
    let clonedSvgData;
    let valuesShown = originalStep0Svg.querySelector("#toggle-view-1").innerHTML === toggleSymbolDefinition.valuesShown;
    if (valuesShown) {
        // copy the svg with names shown
        originalStep0Svg.querySelector("#toggle-view-1").click();
        clonedSvgData = originalStep0Svg.cloneNode(true);
        originalStep0Svg.querySelector("#toggle-view-1").click();
    } else {
        clonedSvgData = originalStep0Svg.cloneNode(true);
    }
    clonedSvgData.id = "clonedOverviewSvg";
    // Adapt svg data
    clonedSvgData.removeChild(clonedSvgData.querySelector("#open-info-gif-btn"));
    clonedSvgData.removeChild(clonedSvgData.querySelector("#toggle-view-1"));
    clonedSvgData.style.width = "";  // let the table adjust itself to the screensize

    clonedSvgData.appendChild(table);

    if (showVCData) {
        let arrows = clonedSvgData.getElementsByClassName("arrow");
        for (let arrow of arrows) {
            arrow.style.display = "block";
            arrow.style.opacity = "0.5";
        }
    }
    let div = document.createElement("div");
    div.classList.add("circuit-container", "row", "justify-content-center");
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
    table.classList.add("table-responsive");
    let isDarkMode = document.getElementById("darkmode-switch").checked;
    let tableData, color;
    let regex = /[A-Z]s\d*/;  // To differentiate between X1 and Xs1
    if (isDarkMode) {
        tableData = `<table id="solutionsTable" class="table table-dark"><tbody>`;
    } else {
        tableData = `<table id="solutionsTable" class="table table-light"><tbody>`;
    }

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
    firstStepContainer.classList.add("container", "justify-content-center");
    return firstStepContainer;
}

function createSolutionsBtnContainer() {
    const solutionsContainer = document.createElement("div");
    solutionsContainer.id = "solutionsBtnContainer";
    solutionsContainer.classList.add("container", "mb-5", "justify-content-center");
    return solutionsContainer;
}

function createTotalCurrentBtn() {
    const totalCurrentBtn = setupVoltageCurrentBtn();
    totalCurrentBtn.textContent = languageManager.currentLang.firstVCStepBtn;
    totalCurrentBtn.disabled = false;
    return totalCurrentBtn;
}

function createSolutionsBtn() {
    const totalCurrentBtn = setupVoltageCurrentBtn();
    totalCurrentBtn.textContent = languageManager.currentLang.solutionsBtn;
    totalCurrentBtn.disabled = false;
    return totalCurrentBtn;
}

function setStyleAndEvent(element, nextElementsList) {
    element.style.pointerEvents = "bounding-box";
    element.style.cursor = 'pointer';
    element.addEventListener('click', () =>
        chooseElement(element, nextElementsList)
    );
}
