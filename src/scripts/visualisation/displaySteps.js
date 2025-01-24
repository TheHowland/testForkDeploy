// ####################################################################################################################
// #################################### Key function for displaying new svgs ##########################################
// ####################################################################################################################
function display_step(stepObject) {
    // Load data

    let showVCData = state.currentCircuitShowVC;
    console.log(stepObject);
    state.pictureCounter++;  // increment before usage in the below functions

    // Create the new elements for the current step
    const {circuitContainer, svgContainer} = setupCircuitContainer(stepObject);

    const {newCalcBtn, newVCBtn} = setupExplanationButtons(showVCData);
    const electricalElements = getElementsFromSvgContainer(svgContainer);
    const nextElementsContainer = setupNextElementsContainer(electricalElements, showVCData);
    const contentCol = document.getElementById("content-col");
    contentCol.append(circuitContainer);

    // Create the texts and buttons for the detailed calculation explanation
    let {stepCalculationText, stepVoltageCurrentText} = generateTexts(stepObject);
    checkAndAddExplanationButtons(showVCData, stepCalculationText, contentCol, stepVoltageCurrentText);

    // The order of function-calls is important
    checkIfStillNotFinishedAndMakeClickable(electricalElements, nextElementsContainer);
    prepareNextElementsContainer(contentCol, nextElementsContainer);
    const div = createExplanationBtnContainer(newCalcBtn);
    if (showVCData) div.appendChild(newVCBtn);

    setupStepButtonsFunctionality(div);
    appendToAllValuesMap(showVCData, stepObject, electricalElements);
    congratsAndVCDisplayIfFinished(electricalElements, contentCol, showVCData, stepObject);
    MathJax.typeset();
    // ##############################
}

// ####################################################################################################################
// ############################################# Helper functions #####################################################
// ####################################################################################################################

function getSourceVoltage() {
    return state.step0Data.source.sources.U.val;
}

function getSourceCurrent() {
    // only to display the value as mathjax, not for calculations (consider the sign "-")
    return (state.step0Data.source.sources.I.val).replace("-", "");
}


function getAllLabelsMap(stepObject) {
    stepObject.__proto__ = StepObject.prototype;
    let elementNameValueMap = new Map();
    if (stepObject.allComponents === null || stepObject.allComponents === undefined) {
        console.error("No components found in stepObject");
        return elementNameValueMap;
    }
    for (let component of stepObject.allComponents) {
        if (component.Z.name !== null && component.Z.name !== undefined) {
            elementNameValueMap.set(component.Z.name, stepObject.getZVal(component));
            elementNameValueMap.set(component.U.name, component.U.val);
            elementNameValueMap.set(component.I.name, component.I.val);
        }
    }
    elementNameValueMap.set(`${languageManager.currentLang.voltageSymbol}${languageManager.currentLang.totalSuffix}`, getSourceVoltage());
    elementNameValueMap.set(`I${languageManager.currentLang.totalSuffix}`, getSourceCurrent());

    return elementNameValueMap;
}

function addComponentValues(component) {
    if (component.Z.name !== null && component.Z.name !== undefined) {
        if (component.hasConversion) {
            state.allValuesMap.set(component.Z.name, component.Z.val);
        } else {
            state.allValuesMap.set(component.Z.name, component.Z.complexVal);
        }
        state.allValuesMap.set(component.U.name, component.U.val);
        state.allValuesMap.set(component.I.name, component.I.val);
    }
}

function addTotalValues(stepObject) {
    if (stepObject.simplifiedTo.hasConversion) {
        state.allValuesMap.set(stepObject.simplifiedTo.Z.name, stepObject.simplifiedTo.Z.val);
        // Rges Lges Cges
        state.allValuesMap.set(`${stepObject.simplifiedTo.Z.name[0]}${languageManager.currentLang.totalSuffix}`, stepObject.simplifiedTo.Z.val);
    } else {
        state.allValuesMap.set(stepObject.simplifiedTo.Z.name, stepObject.simplifiedTo.Z.complexVal);
        // Zges
        state.allValuesMap.set(`Z${languageManager.currentLang.totalSuffix}`, stepObject.simplifiedTo.Z.complexVal);
    }
    state.allValuesMap.set(stepObject.simplifiedTo.U.name, stepObject.simplifiedTo.U.val);
    state.allValuesMap.set(stepObject.simplifiedTo.I.name, stepObject.simplifiedTo.I.val);
    // Add total current
    state.allValuesMap.set(`I${languageManager.currentLang.totalSuffix}`, stepObject.simplifiedTo.I.val);
}

function appendToAllValuesMap(showVCData, stepObject, electricalElements) {
    if (stepObject.step !== "step0") {
        for (let component of stepObject.components) {
            addComponentValues(component);
        }
    }
    if (onlyOneElementLeft(electricalElements)) {
        addTotalValues(stepObject);
    }
}

function createExplanationBtnContainer(element) {
    const div = document.createElement("div");
    div.id = `explBtnContainer${state.pictureCounter}`
    div.classList.add("container", "justify-content-center");
    div.appendChild(element);
    return div;
}

function getFinishMsg(showVCData) {
    let msg;
    if (showVCData) {
        // Give a note what voltage is used and that voltage/current is available
        msg = `
        <p>${languageManager.currentLang.msgVoltAndCurrentAvailable}.<br></p>
        <p>${languageManager.currentLang.msgShowVoltage}<br>$$ ${languageManager.currentLang.voltageSymbol}_{${languageManager.currentLang.totalSuffix}}=${getSourceVoltage()}$$</p>
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

function setupNextElementsContainer(filteredPaths, showVCData) {
    const nextElementsContainer = document.createElement('div');
    nextElementsContainer.className = 'next-elements-container';
    nextElementsContainer.id = "nextElementsContainer";
    nextElementsContainer.classList.add("text-center", "py-1", "mb-3");
    nextElementsContainer.style.color = colors.currentForeground;
    if (onlyOneElementLeft(filteredPaths)) {
        nextElementsContainer.innerHTML = getFinishMsg(showVCData);
    } else {
        nextElementsContainer.innerHTML = `
        <h3>${languageManager.currentLang.nextElementsHeading}</h3>
        <ul class="px-0" id="next-elements-list"></ul>
        <button class="btn btn-secondary mx-1 ${state.pictureCounter === 1 ? "disabled" : ""}" id="reset-btn">reset</button>
        <button class="btn btn-primary mx-1" id="check-btn">check</button>
    `;
    }
    return nextElementsContainer;
}

function setupCircuitContainer(stepObject) {
    const circuitContainer = document.createElement('div');
    circuitContainer.classList.add("circuit-container", "row", "justify-content-center", "my-2");
    const svgContainer = setupSvgDivContainerAndData(stepObject);
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

function setupSvgDivContainerAndData(stepObject) {
    let svgData = stepObject.svgData;
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
    svgDiv.innerHTML = svgData;

    let allLabelsMap = getAllLabelsMap(stepObject);
    hideSourceLabel(svgDiv);
    hideSvgArrows(svgDiv);
    createMathJaxLabels(svgDiv, allLabelsMap);

    // SVG Data written, now add eventListeners, only afterward because they would be removed on rewrite of svgData
    if (state.pictureCounter === 1) addInfoHelpButton(svgDiv);
    if (state.currentCircuitMap.selectorGroup !== circuitMapper.selectorIds.symbolic) {
        // Add name value toggle only for non-symbolic circuits (no need to toggle between R1 and R1...:) )
        addNameValueToggleBtn(svgDiv, allLabelsMap);
        setTogglesDependingOnState(svgDiv);  // only after toggler was added
    }
    return svgDiv;
}

function toggleLabelsFromTo(svgDiv, from, to) {
    let mathjaxValueLabels = svgDiv.querySelectorAll(".mathjax-value-label");
    for (let mathjaxValueLabel of mathjaxValueLabels) {
        if (mathjaxValueLabel.classList.contains("V1")) continue;  // Source label stays hidden
        // if arrow hidden, don't toggle voltage and current labels
        if (!arrowsShown(svgDiv)) {
            if (mathjaxValueLabel.classList.contains("current") || mathjaxValueLabel.classList.contains("voltage"))
                continue;
        }
        mathjaxValueLabel.style.setProperty("display", from);
    }
    // Toggle all element labels
    let elementLabels = svgDiv.querySelectorAll(".element-label");
    for (let elementLabel of elementLabels) {
        if (elementLabel.classList.contains("V1")) continue;  // Source label stays hidden
        elementLabel.style.setProperty("display", to);
    }
}

function setTogglesDependingOnState(svgDiv) {
    if (!state.valuesShown) {
        toggleLabelsFromTo(svgDiv, "none", "block");
        // Toggle button text already correct
    } else {
        toggleLabelsFromTo(svgDiv, "block", "none");
        // Toggle toggle-button
        let toggler = svgDiv.querySelector(".toggle-view");
        toggler.innerText = toggleSymbolDefinition.valuesShown;
    }
}

function createForeignObject(symbol, value, svgDiv, labelproperties) {
    var svgNS = "http://www.w3.org/2000/svg";
    let foreignObject = document.createElementNS(svgNS, "foreignObject");
    foreignObject.id = `${symbol}-foreignObject`;
    if (labelproperties.labelclass === "") {
        foreignObject.classList.add("mathjax-value-label");
    } else {
        foreignObject.classList.add("mathjax-value-label", labelproperties.labelclass);
    }
    foreignObject.style.textAlign = "right";
    let disp;
    if (state.valuesShown && arrowsShown(svgDiv)) {
        disp = "block";
    } else {
        disp = "none";
    }
    foreignObject.style.display = disp;
    // Make object as small as needed and just show the overflow -> Doesn't block bounding boxes
    foreignObject.style.direction = labelproperties.direction;
    foreignObject.style.color = labelproperties.color;
    foreignObject.style.fontSize = labelproperties.fontSize;
    foreignObject.style.opacity = labelproperties.opacity;
    foreignObject.style.overflow = "visible";
    foreignObject.setAttribute("width", "1");
    foreignObject.setAttribute("height", "1");
    foreignObject.setAttribute("x", labelproperties.x);
    foreignObject.setAttribute("y", labelproperties.y);
    foreignObject.innerHTML = `<span style="display: inline-block;">$$${value}$$</span>`;
    return foreignObject;
}

function getVLabelInfo(label) {
    let labelclass = "voltage";
    let x = parseFloat(label.getAttribute("x"));
    let y = parseFloat(label.getAttribute("y")) - 2;
    let direction = "ltr";
    let color = "#9898ff";
    let fontSize = "90%";
    let opacity = "0.8";
    return {labelclass, x, y, direction, color, fontSize, opacity};
}

function getILabelInfo(label) {
    let labelclass = "current";
    let x = parseFloat(label.getAttribute("x"));
    let y = parseFloat(label.getAttribute("y")) - 7 ;
    let direction = "rtl";
    let color = "red";
    let fontSize = "90%";
    let opacity = "0.8";
    return {labelclass, x, y, direction, color, fontSize, opacity};
}

function getElementLabelInfo(label) {
    let labelclass = "";
    let x = parseFloat(label.getAttribute("x")) - 3;
    let y = parseFloat(label.getAttribute("y")) - 5;
    let direction = "rtl";
    let color = colors.currentForeground;
    let fontSize = "95%";
    let opacity = "0.8";
    return {labelclass, x, y, direction, color, fontSize, opacity};
}

function createMathJaxLabels(svgDiv, allLabelsMap) {
    for (let [symbol, value] of allLabelsMap) {
        let label;
        let labelProperties;
        if (symbol.includes("V") || symbol.includes("U")) {
            label = svgDiv.querySelector(`text.voltage-label.${symbol}`);
            if (label === null) continue;
            labelProperties = getVLabelInfo(label);
        } else if (symbol.includes("I")) {
            label = svgDiv.querySelector(`text.current-label.${symbol}`);
            if (label === null) continue;
            labelProperties = getILabelInfo(label);
        } else {
            label = svgDiv.querySelector(`.${symbol}`);
            if (label === null) continue;
            labelProperties = getElementLabelInfo(label);
        }
        const foreignObject = createForeignObject(symbol, value, svgDiv, labelProperties);
        // Serialize it this way to ensure that the foreignObject is correctly written as foreignObject and not foreignobject
        // because if we don't use the XMLSerializer it gets parsed by HTML Parser and the foreignobject is not recognized
        var serializer = new XMLSerializer();
        var svgString = serializer.serializeToString(foreignObject);
        svgDiv.querySelector("svg").innerHTML += svgString;
    }
    MathJax.typeset();
}

function hideSourceLabel(svgDiv) {
    let sourceLabel = svgDiv.querySelector(".element-label.V1");
    sourceLabel.style.display = "none";
}

function addNameValueToggleBtn(svgDiv, elementNameValueMap) {
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
    nameValueToggleBtn.onclick = () => {toggleNameValue()};
    svgDiv.insertAdjacentElement("afterbegin", nameValueToggleBtn);
}

function toggleMathJaxFormulas(svgDiv) {
    let mathjaxValueLabels = svgDiv.querySelectorAll(".mathjax-value-label");
    for (let mathjaxValueLabel of mathjaxValueLabels) {
        if (mathjaxValueLabel.classList.contains("V1")) continue;  // Source label stays hidden
        // If arrows are not shown, skip voltage and current labels
        if (!arrowsShown(svgDiv)) {
            if (mathjaxValueLabel.classList.contains("current") || mathjaxValueLabel.classList.contains("voltage"))
                continue;
        }
        // Toggle
        if (state.valuesShown) {
            mathjaxValueLabel.style.setProperty("display", "none");
        } else {
            mathjaxValueLabel.style.setProperty("display", "block");
        }
    }
}

function toggleElementLabels(svgDiv) {
    let elementLabels = svgDiv.querySelectorAll(".element-label");
    for (let elementLabel of elementLabels) {
        if (elementLabel.classList.contains("V1")) continue;  // Source label stays hidden
        // Toggle
        if (state.valuesShown) {
            elementLabel.style.setProperty("display", "block");
        } else {
            elementLabel.style.setProperty("display", "none");
        }
    }
}

function toggleVandISymbolLabels(svgDiv) {
    if (arrowsShown(svgDiv)) {
        // only text elements with class voltage-label or current-label (not path elements (arrows))
        let VIelementLabels = svgDiv.querySelectorAll("text.voltage-label, text.current-label");
        for (let elementLabel of VIelementLabels) {
            if (elementLabel.classList.contains("V1")) continue;  // Source label stays hidden
            // Toggle
            if (state.valuesShown) {
                elementLabel.style.setProperty("display", "block");
            } else {
                elementLabel.style.setProperty("display", "none");
            }
        }
    }
}

function toggleElements() {
    let svgDiv = document.getElementById("content-col");
    toggleMathJaxFormulas(svgDiv);    // toggles values, 10V, 1A, ...
    toggleVandISymbolLabels(svgDiv);  // toggles symbols, U1, I1, ...
    toggleElementLabels(svgDiv);      // toggles Elements, R1, C1, ...
}

function arrowsShown(svgDiv) {
    let arrows = svgDiv.getElementsByClassName("arrow");
    if (arrows.length === 0) return false;
    return arrows[0].style.display !== "none";
}

function toggleNameValue() {
    toggleElements();
    // Toggle button icons
    let togglers = document.querySelectorAll(".toggle-view");
    for (let toggler of togglers) {
        if (state.valuesShown) {
            toggler.innerText = toggleSymbolDefinition.namesShown;
        } else {
            toggler.innerText = toggleSymbolDefinition.valuesShown;
        }
    }
    state.valuesShown = !state.valuesShown;
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

    const bboxId = `bbox-${pathElement.getAttribute('id')}`;
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

async function checkAndSimplifyNext(div){
    const contentCol = document.getElementById("content-col");
    const nextElementsContainer = document.getElementById("nextElementsContainer");
    const svgDiv = document.getElementById(`svgDiv${state.pictureCounter}`);

    if (state.selectedElements.length <= 1) {
        showMessage(contentCol, languageManager.currentLang.alertChooseAtLeastOneElement);
    } else {
        let obj = await stepSolve.simplifyNCpts(state.selectedElements).toJs({dict_converter: Object.fromEntries});
        obj.__proto__ = StepObject.prototype;
        checkAndSimplify(obj, contentCol, div);
    }

    resetNextElements(svgDiv, nextElementsContainer);
    MathJax.typeset();
}

function checkAndSimplify(stepObject, contentCol, div) {
    if (stepObject.canBeSimplified) {
        if (notLastPicture()) {
            contentCol.append(div);
            enableLastCalcButton();
            scrollNextElementsContainerIntoView();
        }
        // Remove event listeners from old picture elements
        removeOldEventListeners();
        display_step(stepObject);
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

function onlyOneElementLeft(electricalElements) {
    return electricalElements.length === 1;
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

function generateTexts(stepObject) {
    if (stepObject.step === "step0") return {stepCalculationText: "", stepVoltageCurrentText: ""};
    let stepCalculationText = generateTextForZ(stepObject);
    stepCalculationText.style.color = colors.currentForeground;

    let stepVoltageCurrentText = generateTextForVoltageCurrent(stepObject);
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

function setupStepButtonsFunctionality(div) {
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
                checkAndSimplifyNext(div);
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

function getAllElementsAndMakeClickable(nextElementsContainer, electricalElements) {
    const nextElementsList = nextElementsContainer.querySelector(`#next-elements-list`);
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

function checkIfStillNotFinishedAndMakeClickable(electricalElements, nextElementsContainer) {
    if (elementsLeftToBeSimplified(electricalElements)) {
        getAllElementsAndMakeClickable(nextElementsContainer, electricalElements);
    }
}

function congratsAndVCDisplayIfFinished(electricalElements, contentCol, showVCData, stepObject) {
    if (onlyOneElementLeft(electricalElements)) {
        addFirstVCExplanation(showVCData, stepObject);
        addSolutionsButton(showVCData, stepObject);
        finishCircuit(contentCol, showVCData);
    }
}

function prepareAllValuesMap(stepObject, showVCData) {
   // TODO das brauche ich glaub nicht mehr
    /*let zWithTotal = "TODO Something total old"; //vcData.noFormat().oldNames[0][0] + "_{" + languageManager.currentLang.totalSuffix + "}";  // Only first letter Z/R/L/C
    if (showVCData) {
        let uWithTotal = "";//vcData.noFormat().oldNames[1][0] + "_{" + languageManager.currentLang.totalSuffix + "}";  // Only first letter U/V
        let iWithTotal = "";//vcData.noFormat().oldNames[2][0] + "_{" + languageManager.currentLang.totalSuffix + "}";  // Only first letter I
        state.allValuesMap.set(zWithTotal, "TODO");//vcData.noFormat().convOldValue[0]);  // total R/L/C (not complex), but maybe sometime
        state.allValuesMap.set(uWithTotal, "TODO");//vcData.noFormat().oldValues[1]);  // total U
        state.allValuesMap.set(iWithTotal, "TODO");//vcData.noFormat().oldValues[2]);  // total I
    } else {
        state.allValuesMap.set(zWithTotal, "TODO");//vcData.noFormat().convOldValue[0]);  // total R/L/C (not complex)
    }*/
    // Remove null values
    for (let k of state.allValuesMap.keys()) {
        if (k === null || k === undefined || k === "")
            state.allValuesMap.delete(k);
    }
    // Sort by key names
    state.allValuesMap = new Map([...state.allValuesMap.entries()].sort());
}

function cloneAndAdaptStep0Svg() {
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
    let bboxes = clonedSvgData.getElementsByClassName("bounding-box");
    for (let bbox of bboxes) {
        bbox.style.display = "none";
    }
    clonedSvgData.style.width = "";  // let the table adjust itself to the screensize
    return clonedSvgData;
}

function addSolutionsButton(showVCData, stepObject) {
    const solBtnContainer = createSolutionsBtnContainer();
    const solBtn = createSolutionsBtn();
    addBtnToContainer(solBtnContainer, solBtn);
    prepareAllValuesMap(stepObject, showVCData);
    let table = generateSolutionsTable();
    let clonedSvgData = cloneAndAdaptStep0Svg();
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

function addFirstVCExplanation(showVCData, stepObject) {
    if (showVCData) {
        const totalCurrentContainer = createTotalCurrentContainer();
        const totalCurrentBtn = createTotalCurrentBtn();
        addBtnToContainer(totalCurrentContainer, totalCurrentBtn);
        let text = generateTextElement(stepObject);

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

function generateTextElement(stepObject) {
    let text = document.createElement("p");
    text.innerHTML = generateTextForTotalCurrent(stepObject);
    return text;
}

function generateZIUArrays() {
    let iMap = new Map();
    let uMap = new Map();
    let zMap = new Map();
    for (let [key, value] of state.allValuesMap.entries()) {
        if (key === null) continue;
        if (key === undefined) continue;
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

function generateSolutionsTable() {
    let table = document.createElement("div");
    table.classList.add("table-responsive");
    let isDarkMode = document.getElementById("darkmode-switch").checked;
    let tableData, color;
    if (isDarkMode) {
        tableData = `<table id="solutionsTable" class="table table-dark"><tbody>`;
    } else {
        tableData = `<table id="solutionsTable" class="table table-light"><tbody>`;
    }

    let {iArray, uArray, zArray} = generateZIUArrays();
    let regex = /[A-Z]s\d*/;  // To differentiate between X1 and Xs1 (helper values)
    for (let i = 0; i < zArray.length; i++) {
        if (regex.test(zArray[i][0])) {
            continue; // Remove if you want to show helper values in this table
            //color = colors.keyGreyedOut;
        } else {
            color = ((isDarkMode) ? colors.keyLight : colors.keyDark);
        }
        tableData += `<tr>
            <td style="color: ${color}">$$${zArray[i][0]} = ${zArray[i][1]}$$</td>
            <td style="color: ${color}">$$${uArray[i][0]} = ${uArray[i][1]}$$</td>
            <td style="color: ${color}">$$${iArray[i][0]} = ${iArray[i][1]}$$</td>
        </tr>`;
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
