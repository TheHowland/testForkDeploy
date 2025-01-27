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

function hideQuickstart() {
    document.getElementById("quick-carousel").hidden = true;
    document.getElementById("quick-heading").hidden = true;
}

function hideAccordion() {
    document.getElementById("selector-accordion").hidden = true;
}

function showQuickstart() {
    document.getElementById("quick-carousel").hidden = false;
    document.getElementById("quick-heading").hidden = false;
}

function showAccordion() {
    document.getElementById("selector-accordion").hidden = false;
}

function showAllSelectors() {
    for (const circuitSet of circuitMapper.circuitSets) {
        const carousel = document.getElementById(`${circuitSet.identifier}-carousel`);
        const heading = document.getElementById(`${circuitSet.identifier}-heading`);
        carousel.hidden = false;
        heading.hidden = false;
    }
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
function showMessage(container, message, prio = "warning", fixedBottom = true) {
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
    msg.classList.add("alert", `alert-${bootstrapAlert}`);
    if (fixedBottom) {
        msg.classList.add("fixed-bottom");
        msg.style.bottom = "170px";
    }
    msg.classList.add("mx-auto");  // centers it when max-width is set
    msg.style.maxWidth = "400px";

    let emojiSpan = document.createElement('span');
    emojiSpan.style.fontSize = '1.66em';
    emojiSpan.innerHTML = emoji;

    let msgSpan = document.createElement('span');
    msgSpan.innerHTML = message;

    msg.appendChild(emojiSpan);
    msg.appendChild(document.createElement('br'));
    msg.appendChild(msgSpan);

    container.appendChild(msg);

    // Remove the message when the user clicks anywhere
    document.addEventListener("click", () => {
        if (container.contains(msg)) {
            container.removeChild(msg);
        }
    });
    // Remove the message after 3 seconds if not clicked already
    setTimeout(() => {
        if (container.contains(msg)) {
            container.removeChild(msg);
        }
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

    stepSolve = state.solve.SolveInUserOrder(state.currentCircuitMap.circuitFile, `${conf.pyodideCircuitPath}/${state.currentCircuitMap.sourceDir}`, `${conf.pyodideSolutionsPath}/`, paramMap);
}

function enableCheckBtn() {
    document.getElementById("check-btn").disabled = false;
}

function resetSimplifierPage(calledFromResetBtn = false) {
    if (state.currentCircuitMap !== null) {
        // If the check btn is disabled, the user has finished the simplification
        // That means if the page is reset, the user aborted the simplification
        // If calledFromResetBtn, then don't push the event because it's reset, and not aborted
        // Also don't push the event if the user is on the first picture, maybe it was just a missclick
        let checkBtnDisabled = document.getElementById("check-btn").classList.contains("disabled");
        if (!checkBtnDisabled && !calledFromResetBtn && state.pictureCounter > 1) {
            pushCircuitEventMatomo(circuitActions.Aborted, state.pictureCounter);
        }
    }
    clearSimplifierPageContent();
    resetSolverObject();
    state.selectedElements = [];
    state.pictureCounter = 0;
    state.allValuesMap = new Map();
    if (state.pyodideReady) {
        startSolving();  // Draw the first picture again
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

function scrollNextElementsContainerIntoView() {
    setTimeout(() => {
        const nextElementsText = document.getElementById("nextElementsContainer");
        if (nextElementsText != null) {nextElementsText.scrollIntoView()}
    }, 100);
}

function scrollBodyToTop() {
    window.scrollTo(0,0);
}

async function getCircuitInfo() {
    let circuitInfoPath = await stepSolve.createCircuitInfo();
    let circuitInfoFile = await state.pyodide.FS.readFile(circuitInfoPath, {encoding: "utf8"});
    return JSON.parse(circuitInfoFile);

}

async function getJsonAndSvgStepFiles() {
    const files = await state.pyodide.FS.readdir(`${conf.pyodideSolutionsPath}`);
    state.jsonFiles_Z = files.filter(file => !file.endsWith("VC.json") && file.endsWith(".json"));
    state.jsonFiles_VC = files.filter(file => file.endsWith("VC.json"));
    if (state.jsonFiles_VC === []) {
        state.jsonFiles_VC = null;
    }
    state.svgFiles = files.filter(file => file.endsWith(".svg"));
    state.currentStep = 0;
}

async function clearSolutionsDir() {
    try {
        //An array of file names representing the solution files in the Solutions directory.
        let solutionFiles = await state.pyodide.FS.readdir(`${conf.pyodideSolutionsPath}`);
        solutionFiles.forEach(file => {
            if (file !== "." && file !== "..") {
                state.pyodide.FS.unlink(`${conf.pyodideSolutionsPath}/${file}`);
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

function moreThanOneCircuitInSet(circuitSet) {
    return circuitSet.set.length > 1;
}

function simplifierPageCurrentlyVisible() {
    return document.getElementById("simplifier-page-container").style.display === "block";
}

function checkIfSimplifierPageNeedsReset() {
    if (simplifierPageCurrentlyVisible()) {
        resetSimplifierPage();
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
    // Show arrows and symbol labels
    let arrows = contentCol.querySelectorAll(".arrow");
    for (let arrow of arrows) {
        arrow.style.display = "block";
        arrow.style.opacity = "0.5";
    }
    if (state.valuesShown) {
        // Hide labels
        let arrows = contentCol.querySelectorAll("text.arrow");
        for (let arrow of arrows) {
            arrow.style.display = "none";
        }
        // Show mathjax formulas
        let mathjax = contentCol.querySelectorAll(".mathjax-value-label");
        for (let mj of mathjax) {
            mj.style.display = "block";
        }

    }
}

function whenAvailable(name, callback) {
    var interval = 10; // ms
    window.setTimeout(function() {
        if (window[name]) {
            callback(window[name]);
        } else {
            whenAvailable(name, callback);
        }
    }, interval);
}

async function createAndShowStep0(circuitMap) {
    await clearSolutionsDir();

    let paramMap = new Map();
    paramMap.set("volt", languageManager.currentLang.voltageSymbol);
    paramMap.set("total", languageManager.currentLang.totalSuffix);

    stepSolve = state.solve.SolveInUserOrder(
        circuitMap.circuitFile,
        `${conf.pyodideCircuitPath}/${circuitMap.sourceDir}`,
        paramMap);

    let obj = await stepSolve.createStep0().toJs({dict_converter: Object.fromEntries});
    obj.__proto__ = Step0Object.prototype;
    state.step0Data = obj;
    state.currentStep = 0;
    state.allValuesMap.set(`${languageManager.currentLang.voltageSymbol}${languageManager.currentLang.totalSuffix}`, getSourceVoltage());
    state.currentCircuitShowVC = getCheckBoxValueOrQuickStartDef(circuitMap);
    display_step(state.step0Data);
}

function startSolving() {
    createAndShowStep0(state.currentCircuitMap);
    //The div element that contains the SVG representation of the circuit diagram.
    const svgDiv = document.querySelector('.svg-container');
    //The div element that contains the list of elements that have been clicked or selected in the circuit diagram.
    const nextElementsContainer = document.querySelector('.next-elements-container');
    if (svgDiv && nextElementsContainer) {
        resetNextElements(svgDiv, nextElementsContainer);
    }
}

function getCheckBoxValueOrQuickStartDef(circuitMap) {
    if (circuitMap.selectorGroup === circuitMapper.selectorIds.quick) {
        return showVCinQuickStart; // Definition of what the quickstart does show, make false if no VC wished here
    } else {
        return showVCDefault;
    }
}

function setLanguageAndScheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.getElementById("darkmode-switch").checked = prefersDark;
    if (!prefersDark) {
        changeToLightMode();
    }

    var userLang = navigator.language;
    if (userLang === "de-DE" || userLang === "de-AT" || userLang === "de-CH" || userLang === "de") {
        languageManager.currentLang = german;
    } else {
        languageManager.currentLang = english;
    }
}

function modalConfig() {
    // This is to prevent the focus from staying on the modal when it is closed
    document.addEventListener('hide.bs.modal', function (event) {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });
}

function hideSourceLabel(svgDiv) {
    let sourceLabel = svgDiv.querySelector(".element-label.V1");
    sourceLabel.style.display = "none";
}


