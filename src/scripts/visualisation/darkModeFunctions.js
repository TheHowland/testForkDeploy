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
    updateSelectorPageNote();
    updateSelectorPageAccordion();
    if (circuitMapper !== null) {
        updateSelectorPageSvgStrokeColor(colors.lightModeSvgStrokeColor, colors.darkModeSvgStrokeColor);
    }
}

function changeToLightMode() {
    colors.setLightModeColors()
    updateAvailableBsClassesTo(colors.bsColorSchemeLight);
    updateNavigationColorsTo(colors.bootstrapWhite, colors.languagesLightBg);
    updateCheatSheetPageColorsTo(colors.bsColorSchemeLight);
    updateSelectorPageNote();
    updateSelectorPageAccordion();
    if (circuitMapper !== null) {
        updateSelectorPageSvgStrokeColor(colors.darkModeSvgStrokeColor, colors.lightModeSvgStrokeColor);
    }
}

function updateSelectorPageAccordion() {
    const accordionButtons = document.getElementsByClassName("accordion-button");
    for (const accordionButton of accordionButtons) {
        accordionButton.style.backgroundColor = colors.currentBsBackground;
    }
    const accordionBodies = document.getElementsByClassName("accordion-body");
    for (const accordionBody of accordionBodies) {
        accordionBody.style.backgroundColor = colors.currentBsBackground;
    }
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
            let svgData = document.getElementById(circuit.circuitDivID).innerHTML;
            svgData = svgData.replaceAll(fromSvgColor, toSvgColor);
            document.getElementById(circuit.circuitDivID).innerHTML = svgData;
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
