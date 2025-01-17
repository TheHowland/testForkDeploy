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
function getSource() {
    // TODO adapt for current sources or multiple sources
    // TODO get frequenz
    return state.step0Data.source[0].val;
}

function getElementNameValueMap(svgDiv) {
    let elementNameValueMap = new Map();
    let labels = svgDiv.querySelectorAll(".element-label");
    labels = [].slice.call(labels, 1);  // Remove source
    for (let label of labels) {
        let elementId = label.classList[1];
        let element = svgDiv.querySelector(`#${elementId}`);
        let mjString = element.classList.toString();
        elementNameValueMap.set(element.id, `${mjString}`);
    }
    return elementNameValueMap;
}

function appendToAllValuesMap(showVCData, stepObject, electricalElements) {
    if (showVCData) {
        // If voltage/current is shown, add all Z/R/C/L U and I values to the map from the two elements
        for (let component of stepObject.components) {
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
        if (onlyOneElementLeft(electricalElements)) {
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
    } else {
        // TODO could be removed - we don't show substitute circuits alone anymore
        // If voltage/current is not shown, add only the Z values to the map
        // Only add the key if it is not already in the map (example Rs1 will be added with nemName and when used again as name1), we don't want to overwrite it

        for (let component of stepObject.components) {
            if (!state.allValuesMap.has(component.Z.name)) state.allValuesMap.set(component.Z.name, component.Z.val);
        }

        // TODO das fehlt noch
        // Also explain the simplified component (now only in sub circuits because it needs too much space)
        /*let explanation = data.noFormat().result;
        if (data.noFormat().relation === "parallel") {
             explanation += "\\ (" + data.noFormat().name1 + "\\ || \\ " + data.noFormat().name2 + ")";
        } else {
            explanation += "\\ (" + data.noFormat().name1 + "+" + data.noFormat().name2 + ")";
        }
        state.allValuesMap.set(data.noFormat().newName, explanation);
        */
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
        <p>${languageManager.currentLang.msgShowVoltage}<br>$$ ${languageManager.currentLang.voltageSymbol}_{${languageManager.currentLang.totalSuffix}}=${getSource()}$$</p>
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
        // SanitizedSvgFilePath could be unnecessary here
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
    const svgContainer = setupSvgDivContainerAndData(stepObject.svgData);
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

function setupSvgDivContainerAndData(svgData) {
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

    let elementNameValueMap = getElementNameValueMap(svgDiv);
    hideSvgArrows(svgDiv);
    hideSourceLabel(svgDiv);
    createMathJaxLabels(svgDiv, elementNameValueMap);

    // SVG Data written, now add eventListeners, only afterward because they would be removed on rewrite of svgData
    if (state.pictureCounter === 1) addInfoHelpButton(svgDiv);
    addNameValueToggleBtn(svgDiv, elementNameValueMap);
    setTogglesDependingOnState(svgDiv);  // only after toggler was added
    return svgDiv;
}

function setTogglesDependingOnState(svgDiv) {
    if (!state.valuesShown) {
        let mathjaxValueLabels = svgDiv.querySelectorAll(".mathjax-value-label");
        for (let mathjaxValueLabel of mathjaxValueLabels) {
            if (mathjaxValueLabel.classList.contains("V1")) continue;  // Source label stays hidden
            // if arrow hidden
            if (onlyOneElementLeft(getElementsFromSvgContainer(svgDiv))) {
                if (mathjaxValueLabel.classList.contains("current") || mathjaxValueLabel.classList.contains("voltage")) continue;
            }
            mathjaxValueLabel.style.setProperty("display", "none");
        }
        // Toggle all element labels
        let elementLabels = svgDiv.querySelectorAll(".element-label");
        for (let elementLabel of elementLabels) {
            if (elementLabel.classList.contains("V1")) continue;  // Source label stays hidden
                elementLabel.style.setProperty("display", "block");
        }
        let toggler = svgDiv.querySelector(".toggle-view");
        toggler.innerText = toggleSymbolDefinition.namesShown;
    }
}

function createMathJaxLabels(svgDiv, elementNameValueMap) {
    // TODO für alle Werte, nicht nur für element-labels
    // TODO dazu kann ich vielleicht eine ALLVALUESMAP übergeben und das durchgehen

    // TODO bei all values map dann unterschiedung zwischen V und I und R/L/C
    // für spannung und strom adde ich dann class voltage und current


    for (let [symbol, value] of elementNameValueMap) {
        let text = svgDiv.querySelector(`.${symbol}`);
        if (text === null) continue;

        // TODO vielleicht kann ich die elemente zu beginn erstellen, muss ich mit Yannick abklären,
        // TODO dazu brauch ich ganz zu beginn alle werte. Aber nur so macht es Sinn
        var svgNS = "http://www.w3.org/2000/svg";
        let foreignObject = document.createElementNS(svgNS,"foreignObject");
        foreignObject.id = `${symbol}-foreignObject`;
        foreignObject.classList.add("mathjax-value-label");
        foreignObject.style.textAlign = "right";
        foreignObject.style.display = "none";
        // Make object as small as needed and just show the overflow -> Doesn't block bounding boxes
        foreignObject.style.direction = "rtl"; // align right formula border to right side = position by top right corner
        foreignObject.style.overflow = "visible";
        let width = 1;
        let height = 1;

        foreignObject.setAttribute("width", `${width}`);
        foreignObject.setAttribute("height", `${height}`);
        foreignObject.setAttribute("x", `${parseFloat(text.getAttribute("x")) - 1}`);
        foreignObject.setAttribute("y", `${parseFloat(text.getAttribute("y")) - 5}`);
        foreignObject.innerHTML = `<span style="color: white; display: inline-block;">$$${value}$$</span>`;

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
    nameValueToggleBtn.onclick = () => {toggleNameValue(nameValueToggleBtn, svgDiv)};
    svgDiv.insertAdjacentElement("afterbegin", nameValueToggleBtn);
}

function toggleElements() {
    let svgDiv = document.getElementById("content-col");
    // Toggle all mathjax-value-labels, voltages and currents only if circuit is finished
    let mathjaxValueLabels = svgDiv.querySelectorAll(".mathjax-value-label");
    for (let mathjaxValueLabel of mathjaxValueLabels) {
        if (mathjaxValueLabel.classList.contains("V1")) continue;  // Source label stays hidden
        // if arrow hidden
        if (onlyOneElementLeft(getElementsFromSvgContainer(svgDiv))) {
            if (mathjaxValueLabel.classList.contains("current") || mathjaxValueLabel.classList.contains("voltage")) continue;
        }
        // Toggle
        if (state.valuesShown) {
            mathjaxValueLabel.style.setProperty("display", "none");
        } else {
            mathjaxValueLabel.style.setProperty("display", "block");
        }
    }

    // Toggle all element labels
    let elementLabels = svgDiv.querySelectorAll(".element-label");
    for (let elementLabel of elementLabels) {
        if (elementLabel.classList.contains("V1")) continue;  // Source label stays hidden
        if (state.valuesShown) {
            elementLabel.style.setProperty("display", "block");
        } else {
            elementLabel.style.setProperty("display", "none");
        }
    }
}

function toggleVoltages(svgDiv, nameValueToggleBtn) {
    let voltageLabels = svgDiv.querySelectorAll(".voltage-label");
    for (let voltageLabel of voltageLabels) {
        let voltageName = voltageLabel.classList[2];
        let voltageValue = state.allValuesMap.get(voltageName);
        if (voltageValue === null || voltageValue === undefined) continue;
        if (voltageValue.includes("\\text{")) {
            voltageValue = voltageValue.replace("\\text{", "");
            voltageValue = voltageValue.replace("}", "");
        }

        let labelText = `${languageManager.currentLang.voltageSymbol}<tspan baseline-shift="sub" font-size="smaller">${languageManager.currentLang.totalSuffix}</tspan>`;
        if (voltageName === `${languageManager.currentLang.voltageSymbol}${languageManager.currentLang.totalSuffix}`) {
            if (nameValueToggleBtn.innerText === toggleSymbolDefinition.namesShown) {
                voltageLabel.innerHTML = voltageLabel.innerHTML.replace(labelText, `${voltageValue}`);
            } else {
                voltageLabel.innerHTML = voltageLabel.innerHTML.replace(`${voltageValue}`, labelText);
            }
        } else {
            if (nameValueToggleBtn.innerText === toggleSymbolDefinition.namesShown) {
                voltageLabel.innerHTML = voltageLabel.innerHTML.replace(voltageName, `${voltageValue}`);
            } else {
                voltageLabel.innerHTML = voltageLabel.innerHTML.replace(`${voltageValue}`, voltageName);
            }
        }

    }
}

function toggleCurrents(svgDiv, nameValueToggleBtn) {
    let currentLabels = svgDiv.querySelectorAll(".current-label");
    for (let currentLabel of currentLabels) {
        let currentName = currentLabel.classList[2];
        let currentValue = state.allValuesMap.get(currentName);
        if (currentValue === null || currentValue === undefined) continue;
        if (currentValue.includes("\\text{")) {
            currentValue = currentValue.replace("\\text{", "");
            currentValue = currentValue.replace("}", "");
        }

        let labelText = `I<tspan baseline-shift="sub" font-size="smaller">${languageManager.currentLang.totalSuffix}</tspan>`;
        if (currentName === `I${languageManager.currentLang.totalSuffix}`) {
            if (nameValueToggleBtn.innerText === toggleSymbolDefinition.namesShown) {
                currentLabel.innerHTML = currentLabel.innerHTML.replace(labelText, `${currentValue}`);
            } else {
                currentLabel.innerHTML = currentLabel.innerHTML.replace(`${currentValue}`, labelText);
            }
        } else {
            if (nameValueToggleBtn.innerText === toggleSymbolDefinition.namesShown) {
                currentLabel.innerHTML = currentLabel.innerHTML.replace(currentName, `${currentValue}`);
            } else {
                currentLabel.innerHTML = currentLabel.innerHTML.replace(`${currentValue}`, currentName);
            }
        }
    }
}

function toggleNameValue(nameValueToggleBtn, svgDiv) {
    // TODO delete parameter svgDiv
    toggleElements();


    // TODO Remove this
    toggleVoltages(svgDiv, nameValueToggleBtn);
    toggleCurrents(svgDiv, nameValueToggleBtn);


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
    let table = generateSolutionsTable(showVCData);
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

function generateSolutionsTable(showVCData) {
    let table = document.createElement("div");
    table.classList.add("table-responsive");
    let isDarkMode = document.getElementById("darkmode-switch").checked;
    let tableData, color;
    if (isDarkMode) {
        tableData = `<table id="solutionsTable" class="table table-dark"><tbody>`;
    } else {
        tableData = `<table id="solutionsTable" class="table table-light"><tbody>`;
    }

    if (showVCData) {
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
    } else {
        // TODO this could be removed if we always show voltage and current
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
