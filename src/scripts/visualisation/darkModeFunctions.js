function setupDarkModeSwitch() {
    const darkModeSwitch = document.getElementById("darkmode-switch");
    darkModeSwitch.checked = true;
    darkModeSwitch.addEventListener("change", () => {
        if (darkModeSwitch.checked) {
            changeToDarkMode();
            pushDarkModeEventMatomo(configDarkModeValues.Dark)
        } else {
            changeToLightMode();
            pushDarkModeEventMatomo(configDarkModeValues.Light)
        }
        closeNavbar();
    });
}

function changeToDarkMode() {
    colors.setDarkModeColors()
    updateAvailableBsClassesTo(colors.bsColorSchemeDark);
    updateNavigationColorsTo(colors.bootstrapDark, colors.languagesDarkBg);
    updateCheatSheetPageColorsTo(colors.bsColorSchemeDark);
    updateSimplifierPageColors();
    updateSelectorPageColors();
    updateAboutPageColors();
    if (circuitMapper !== null) {
        updateSelectorPageSvgStrokeColor(colors.lightModeSvgStrokeColor, colors.darkModeSvgStrokeColor);
    }
}

function changeToLightMode() {
    colors.setLightModeColors()
    updateAvailableBsClassesTo(colors.bsColorSchemeLight);
    updateNavigationColorsTo(colors.bootstrapWhite, colors.languagesLightBg);
    updateCheatSheetPageColorsTo(colors.bsColorSchemeLight);
    updateSimplifierPageColors();
    updateSelectorPageColors();
    updateAboutPageColors();
    if (circuitMapper !== null) {
        updateSelectorPageSvgStrokeColor(colors.darkModeSvgStrokeColor, colors.lightModeSvgStrokeColor);
    }
}

function updateSelectorPageColors() {
    updateSelectorPageNote();

    if (circuitMapper !== null) {
        for (let circuitSet of circuitMapper.circuitSets) {
            if (circuitSet.identifier === circuitMapper.selectorIds.quick) {
                const quickHeading = document.getElementById(`${circuitMapper.selectorIds.quick}-heading`);
                quickHeading.style.color = colors.currentHeadingsForeground
                continue;
            }
            const titleBtn = document.getElementById(`${circuitSet.identifier}-acc-btn`);
            titleBtn.style.color = colors.currentHeadingsForeground
        }
    }
    const accordionButtons = document.getElementsByClassName("accordion-button");
    for (const accordionButton of accordionButtons) {
        accordionButton.style.backgroundColor = colors.currentBsBackground;
    }
    const accordionBodies = document.getElementsByClassName("accordion-body");
    for (const accordionBody of accordionBodies) {
        accordionBody.style.backgroundColor = colors.currentBsBackground;
    }
    const checkBoxes = document.getElementsByClassName("vcCheckBox");
    for (const checkBox of checkBoxes) {
        checkBox.style.color = colors.currentForeground;
    }
    const overviewModalBtns = document.getElementsByClassName("modalOverviewBtn");
    for (const overviewModalBtn of overviewModalBtns) {
        overviewModalBtn.style.color = colors.currentHeadingsForeground;
        overviewModalBtn.style.borderColor = colors.currentHeadingsForeground;
    }

    updateOverviewModals();
}

function updateOverviewModals() {
    if (circuitMapper !== null) {
        for (let circuitSet of circuitMapper.circuitSets) {
            const modal = document.getElementById(`${circuitSet.identifier}-overviewModal`);
            if (modal !== null) {
                const modalHeader = modal.querySelector(".modal-header");
                modalHeader.style.color = colors.currentForeground;
                modalHeader.style.backgroundColor = colors.currentBsBackground;
                const modalBody = modal.querySelector(".modal-body");
                modalBody.style.color = colors.currentForeground;
                modalBody.style.backgroundColor = colors.currentBsBackground;
                const modalFooter = modal.querySelector(".modal-footer");
                modalFooter.style.color = colors.currentForeground;
                modalFooter.style.backgroundColor = colors.currentBsBackground;
            }
        }
    }
}

function updateSimplifierPageColors() {
    const infoGifHeader = document.getElementById("info-gif-header");
    infoGifHeader.style.color = colors.currentForeground;
    infoGifHeader.style.backgroundColor = colors.currentBsBackground;
    const infoGifBody = document.getElementById("info-gif-body");
    infoGifBody.style.color = colors.currentForeground;
    infoGifBody.style.backgroundColor = colors.currentBsBackground;
    const infoGifFooter = document.getElementById("info-gif-footer");
    infoGifFooter.style.color = colors.currentForeground;
    infoGifFooter.style.backgroundColor = colors.currentBsBackground;

    const toggleViewButtons = document.getElementsByClassName("toggle-view");
    for (const toggleViewButton of toggleViewButtons) {
        toggleViewButton.style.color = colors.currentForeground;
    }
}

function updateAboutPageColors() {
    const aboutText = document.getElementById("about-text");
    aboutText.style.color = colors.currentForeground;
}

function updateSelectorPageNote() {
    const note = document.getElementById("progress-bar-note");
    note.style.color = colors.currentForeground;
}

function updateNavigationColorsTo(navigationToggleBgColor, languagesBgColor) {
    document.getElementById("navbarSupportedContent").style.backgroundColor = navigationToggleBgColor;
    updateNavLinkColorTo(colors.currentForeground);
    updateNavSelectColorTo(colors.keyYellow);
    updateLanguageSelectorColor(languagesBgColor);
}

function updateNavSelectColorTo(color) {
    let navSelect = document.getElementById("nav-select");
    navSelect.style.color = color;
}

function updateAvailableBsClassesTo(colorScheme) {
    updateBsClassesTo(colorScheme, "bg", document.getElementById("bootstrap-overrides"));  // body
    updateBsClassesTo(colorScheme, "bg", document.getElementById("navbar"));
    updateBsClassesTo(colorScheme, "navbar", document.getElementById("navbar"));
    updateBsClassesTo(colorScheme, "bg", document.getElementById("cheat-sheet-container"));
    updateBsClassesTo(colorScheme, "bg", document.getElementById("simplifier-page-container"));
    updateBsClassesTo(colorScheme, "bg", document.getElementById("select-page-container"));
    updateBsClassesTo(colorScheme, "bg", document.getElementById("about-page-container"));
}


function updateBsClassesTo(colorScheme, className, element) {
    if (colorScheme === colors.bsColorSchemeLight) {
        switchBsClassToLight(className, element);
    } else if (colorScheme === colors.bsColorSchemeDark) {
        switchBsClassToDark(className, element);
    } else {
        throw Error("Only light or dark colorScheme");
    }
}

function updateNavLinkColorTo(color) {
    const navLinks = document.getElementsByClassName("nav-link");
    for (const navLink of navLinks) {
        navLink.style.color = color;
    }
}

function updateCheatSheetPageColorsTo(bsColorScheme) {
    const tables = document.getElementsByClassName("table");
    for (const table of tables) {
        updateBsClassesTo(bsColorScheme, "table", table);
    }
    const formula = document.getElementById("pRX");
    formula.style.color = colors.currentForeground;
}
function updateSelectorPageSvgStrokeColor(fromSvgColor, toSvgColor) {
    // Change border color of selectors
    const svgSelectors = document.getElementsByClassName("svg-selector");
    for (const svgSelector of svgSelectors) {
        svgSelector.style.borderColor = colors.currentForeground;
    }
    // Change svg color
    for (const circuitSet of circuitMapper.circuitSets) {
        for (const circuit of circuitSet.set) {
            // Carousels
            let svgData = document.getElementById(circuit.circuitDivID).innerHTML;
            svgData = svgData.replaceAll(fromSvgColor, toSvgColor);
            document.getElementById(circuit.circuitDivID).innerHTML = svgData;
            // Overview modal, can be null for quickstart for example
            let modal = document.getElementById(`${circuit.circuitDivID}-overviewModal`);
            if (modal !== null) {
                let svgDataModal = modal.innerHTML;
                svgDataModal = svgDataModal.replaceAll(fromSvgColor, toSvgColor);
                document.getElementById(`${circuit.circuitDivID}-overviewModal`).innerHTML = svgDataModal; // overview
            }
        }
    }
}

function updateLanguageSelectorColor(languagesBackground) {
    document.getElementById("darkmode-label").style.color = colors.currentForeground;
    document.getElementById("Dropdown").style.color = colors.currentForeground;
    document.getElementById("languagesDropdown").style.color = colors.currentForeground;
    document.getElementById("select-english").style.color = colors.currentForeground;
    document.getElementById("select-german").style.color = colors.currentForeground;
    document.getElementById("languagesDropdown").style.backgroundColor = languagesBackground;
}

function switchBsClassToLight(field, container) {
    container.classList.remove(`${field}-dark`);
    container.classList.add(`${field}-light`);
}

function switchBsClassToDark(field, container) {
    container.classList.remove(`${field}-light`);
    container.classList.add(`${field}-dark`);
}
