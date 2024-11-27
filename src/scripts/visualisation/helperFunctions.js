/*
Replaces non-alphanumeric characters in a selector string with underscores to ensure it is a valid CSS selector.
 */
function enableStartBtnAndSimplifierLink() {
    document.getElementById("nav-select").classList.remove("disabled");
    document.getElementById("start-button").classList.remove("disabled");
    document.getElementById("start-button").style.animation = "pulse 2s infinite";
}

function disableStartBtnAndSimplifierLink() {
    document.getElementById("nav-select").classList.add("disabled");
    document.getElementById("start-button").classList.add("disabled");
    document.getElementById("start-button").style.animation = "";
}

function sanitizeSelector(selector) {
    return selector.replace(/[^\w-]/g, '_');
}

function showWaitingNote() {
    const note = document.getElementById("progress-bar-note");
    note.style.color = colors.currentForeground;
    note.innerHTML = languageManager.currentLang.selectorWaitingNote;
    return note;
}

function hideAllSelectors() {
    for (const circuitSet of circuitMapper.circuitSets) {
        const carousel = document.getElementById(`${circuitSet.identifier}-carousel`);
        const heading = document.getElementById(`${circuitSet.identifier}-heading`);
        carousel.hidden = true;
        heading.hidden = true;
    }
}

function showAllSelectors() {
    for (const circuitSet of circuitMapper.circuitSets) {
        const carousel = document.getElementById(`${circuitSet.identifier}-carousel`);
        const heading = document.getElementById(`${circuitSet.identifier}-heading`);
        carousel.hidden = false;
        heading.hidden = false;
    }
}

function circuitIsNotSubstituteCircuit(circuitMap) {
    let showVoltageButton = true;
    if (circuitMap.selectorGroup === circuitMapper.selectorIds.subId) {
        showVoltageButton = false;
    }
    return showVoltageButton;
}

function notLastPicture() {
    // Because on the last picture, this element won't exist
    return document.getElementById("nextElementsContainer") != null;
}

function setSvgColorMode(svgData) {
    if (colors.currentForeground === colors.keyLight) {
        return svgData.replaceAll(colors.lightModeSvgStrokeColor, colors.darkModeSvgStrokeColor);
    } else {
        return svgData.replaceAll(colors.darkModeSvgStrokeColor, colors.lightModeSvgStrokeColor);
    }
}

function twoElementsChosen() {
    return state.selectedElements.length === 2;
}


function setSvgWidthTo(svgData, width) {
    // Search the string: width="dd.ddddpt"
    let match = svgData.match(/width="(\d*.\d*pt)"/);
    let foundWidth = match[1];   // dd.dddd
    return svgData.replace(foundWidth, width);   // replace dd.ddd with width
}

// Displays a temporary message to the user in a message box.
function showMessage(container, message, prio = "warning") {
    let bootstrapAlert;
    let emoji;
    if (prio === "only2") {
        emoji = onlyChoose2Emojis[Math.floor(Math.random() * onlyChoose2Emojis.length)];
        bootstrapAlert = "warning";
    } else if (prio === "warning") {
        emoji = badEmojis[Math.floor(Math.random() * badEmojis.length)];
        bootstrapAlert = "warning";
    } else if (prio === "success") {
        emoji = goodEmojis[Math.floor(Math.random() * goodEmojis.length)];
        bootstrapAlert = "success";
    }
    const msg = document.createElement('div');
    msg.classList.add("alert");
    msg.classList.add(`alert-${bootstrapAlert}`);
    msg.classList.add("fixed-bottom");
    msg.style.bottom = "170px";
    msg.classList.add("m-5");

    let emojiSpan = document.createElement('span');
    emojiSpan.style.fontSize = '1.66em';
    emojiSpan.innerHTML = emoji;

    let msgSpan = document.createElement('span');
    msgSpan.innerHTML = message;

    msg.appendChild(emojiSpan);
    msg.appendChild(document.createElement('br'));
    msg.appendChild(msgSpan);

    container.appendChild(msg);
    setTimeout(() => {
        container.removeChild(msg);
    }, 3000);
}

function setPgrBarTo(percent) {
    let progressBar = document.getElementById("pgr-bar");
    progressBar.style.width = `${percent}%`;
}

function clearSimplifierPageContent() {
    const contentCol = document.getElementById("content-col");
    contentCol.innerHTML = '';

    const simplifierPage = document.getElementById("simplifier-page-container");
    const selectorPage = document.getElementById("select-page-container");
    simplifierPage.classList.remove("slide-in-right");
    selectorPage.classList.remove("slide-out-left");
    selectorPage.style.opacity = "1";
}

function resetSolverObject() {
    let paramMap = new Map();
    paramMap.set("volt", languageManager.currentLang.voltageSymbol);
    paramMap.set("total", languageManager.currentLang.totalSuffix);

    stepSolve = state.solve.SolveInUserOrder(state.currentCircuit, `${conf.pyodideCircuitPath}/${state.currentCircuitMap.sourceDir}`, `${conf.pyodideSolutionsPath}/`, paramMap);
}

function enableCheckBtn() {
    document.getElementById("check-btn").disabled = false;
}

function resetSimplifierPage(pyodide) {
    clearSimplifierPageContent();
    resetSolverObject();
    state.selectedElements = [];
    state.pictureCounter = 0;
    if (state.pyodideReady) {
        startSolving(pyodide);  // Draw the first picture again
    }
    scrollBodyToTop();
}

function enableLastCalcButton() {
    setTimeout(() => {
        let lastPicture = state.pictureCounter - 1;
        const lastCalcBtn = document.getElementById(`calcBtn${lastPicture}`);
        lastCalcBtn.disabled = false;
    }, 100);
}

function scrollToBottom() {
    setTimeout(() => {
        const nextElementsText = document.getElementById("nextElementsContainer");
        if (nextElementsText != null) {nextElementsText.scrollIntoView()}
    }, 100);
}

function scrollBodyToTop() {
    window.scrollTo(0,0);
}

async function getCircuitComponentTypes(pyodide) {
    let circuitInfoPath = await stepSolve.createCircuitInfo();
    let circuitInfoFile = await pyodide.FS.readFile(circuitInfoPath, {encoding: "utf8"});
    const circuitInfo = JSON.parse(circuitInfoFile);
    return circuitInfo["componentTypes"];
}

async function getJsonAndSvgStepFiles(pyodide) {
    const files = await pyodide.FS.readdir(`${conf.pyodideSolutionsPath}`);
    state.jsonFiles_Z = files.filter(file => !file.endsWith("VC.json") && file.endsWith(".json"));
    state.jsonFiles_VC = files.filter(file => file.endsWith("VC.json"));
    if (state.jsonFiles_VC === []) {
        state.jsonFiles_VC = null;
    }
    state.svgFiles = files.filter(file => file.endsWith(".svg"));
    state.currentStep = 0;
}

async function clearSolutionsDir(pyodide) {
    try {
        //An array of file names representing the solution files in the Solutions directory.
        let solutionFiles = await pyodide.FS.readdir(`${conf.pyodideSolutionsPath}`);
        solutionFiles.forEach(file => {
            if (file !== "." && file !== "..") {
                pyodide.FS.unlink(`${conf.pyodideSolutionsPath}/${file}`);
            }
        });
    } catch (error) {
        console.warn("Solutions directory not found or already cleared.");
    }
}

function resetNextElementsTextAndList(nextElementsContainer) {
    const nextElementList = nextElementsContainer.querySelector('ul');
    if (nextElementList) {
        nextElementList.innerHTML = '';
    } else {
        console.warn('nextElementsContainer ul-list not found');
    }
    state.selectedElements = [];
}

function resetHighlightedBoundingBoxes(svgDiv) {
    const boundingBoxes = svgDiv.querySelectorAll('.bounding-box');
    if (boundingBoxes.length > 0) {
        boundingBoxes.forEach(box => box.remove());
    }
}

async function createSvgsForSelectors(pyodide) {
    await clearSolutionsDir(pyodide);
    // For all circuit sets (e.g. Resistors, Capacitors, ..)
    let paramMap = new Map();
    paramMap.set("volt", languageManager.currentLang.voltageSymbol);
    paramMap.set("total", languageManager.currentLang.totalSuffix);


    for (const circuitSet of circuitMapper.circuitSets) {
        // For all circuits in this set (e.g., Resistor1, Resistor2, ...)
        for (const circuit of circuitSet.set) {
            stepSolve = state.solve.SolveInUserOrder(circuit.circuitFile, `${conf.pyodideCircuitPath}/${circuit.sourceDir}`, `${conf.pyodideSolutionsPath}/`, paramMap);
            await stepSolve.createStep0().toJs();
        }
    }
}

function moreThanOneCircuitInSet(circuitSet) {
    return circuitSet.set.length > 1;
}

function simplifierPageCurrentlyVisible() {
    return document.getElementById("simplifier-page-container").style.display === "block";
}

function checkIfSimplifierPageNeedsReset(pyodide) {
    if (simplifierPageCurrentlyVisible()) {
        resetSimplifierPage(pyodide);
    }
}

function closeNavbar() {
    const navbarToggler = document.getElementById("nav-toggler");
    navbarToggler.classList.add("collapsed");
    const navDropdown = document.getElementById("navbarSupportedContent");
    navDropdown.classList.remove("show");

    pageManager.updatePagesOpacity();
}

function resetNextElements(svgDiv, nextElementsContainer) {
    resetHighlightedBoundingBoxes(svgDiv);
    resetNextElementsTextAndList(nextElementsContainer);
}


function showArrows(contentCol) {
    let arrows = contentCol.getElementsByClassName("arrow");
    for (let arrow of arrows) {
        arrow.style.display = "block";
        arrow.style.opacity = "0.5";
    }
}






