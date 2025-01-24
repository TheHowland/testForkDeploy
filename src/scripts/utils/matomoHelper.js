const circuitActions = {
    Finished: "Fertig",
    Aborted: "Abgebrochen",
    Reset: "Reset",
    ErrOnly2: "Nicht 2 gewählt",
    ErrCanNotSimpl: "Kann nicht vereinfacht werden",
    ViewVcExplanation: "VC Rechnung angeschaut",
    ViewZExplanation: "Z Rechnung angeschaut",
    ViewTotalExplanation: "Gesamtrechnung angeschaut",
    ViewSolutions: "Lösungen angeschaut",
}

const eventCategories = {
    Quick: "Schnellstart",
    Resistor: "Widerstände",
    Capacitor: "Kondensatoren",
    Inductor: "Spulen",
    Mixed: "Gemischte Schaltungen",
    Configurations: "Konfigurationen",
    _SubIdx: " - sub",
    _AcDcIdx: " - acdc",

    /* DEPRECATED
    Sub: "Ersatzschaltungen",
    AcDc: "Gleich-/Wechselstromkreise",
    */
}

const configActions = {
    SetDarkMode: "DarkMode",
    SetLanguage: "Sprache",
}

const configDarkModeValues = {
    Dark: "Dunkel",
    Light: "Hell",
}

const configLanguageValues = {
    German: "Deutsch",
    English: "Englisch",
}

function pushPageViewMatomo(title="") {
    if (typeof _paq !== "undefined") {
        _paq.push(["setDocumentTitle", document.title + "/" + title]);
        _paq.push(["trackPageView"]);
    }
}

function pushCircuitEventMatomo(action, value=-1) {
    // Possible categories: see circuitMapper.selectorIds
    let category = state.currentCircuitMap.selectorGroup;
    let showVC;
    if (category === circuitMapper.selectorIds.quick) {
        showVC = showVCinQuickStart
    } else {
        showVC = state.currentCircuitShowVC
    }
    let circuitName = state.currentCircuitMap.circuitFile;

    let mappedCategory = mapCategory(category);
    if (mappedCategory === null) return;
    // Add a suffix to the circuit name in order to be able to see if voltage was shown or not
    if (!showVC) circuitName += eventCategories._SubIdx;
    if (showVC) circuitName += eventCategories._AcDcIdx;

    if (!allowedCircuitAction(action)) return;

    pushEventToMatomo(mappedCategory, action, circuitName, value);
}

function pushLanguageEventMatomo(language) {
    pushConfigurationEventMatomo(configActions.SetLanguage, language);
}

function pushDarkModeEventMatomo(mode) {
    pushConfigurationEventMatomo(configActions.SetDarkMode, mode);
}

function mapCategory(category) {
    // Map the categories in order to be flexible in the future with the input
    // so we can also send the same kind of category (because they don't change in matomo)
    /* DEPRECATED
    if (["sub"].includes(category)) return eventCategories.Sub;
    if (["acdc"].includes(category)) return eventCategories.AcDc;
    */
    if (["quick"].includes(category)) return eventCategories.Quick;
    if (["res"].includes(category)) return eventCategories.Resistor;
    if (["cap"].includes(category)) return eventCategories.Capacitor;
    if (["ind"].includes(category)) return eventCategories.Inductor;
    if (["mixed"].includes(category)) return eventCategories.Mixed;
    console.log("Category not possible, check: " + category);
    return null;
}

function allowedCircuitAction(action) {
    let possibleActions = Object.values(circuitActions);
    if (!(possibleActions.includes(action))) {
        console.log("Action not in " + possibleActions);
        console.log("Action: " + action);
        console.log("Either change the action or adapt the possible actions");
        return false;
    }
    return true;
}

function allowedConfigurationAction(action) {
    let possibleActions = Object.values(configActions);
    if (!(possibleActions.includes(action))) {
        console.log("Action not in " + possibleActions);
        console.log("Action: " + action);
        console.log("Either change the action or adapt the possible actions");
        return false;
    }
    return true;
}

function pushConfigurationEventMatomo(action, configuration, value=-1) {
    if (!allowedConfigurationAction(action)) return;
    pushEventToMatomo(eventCategories.Configurations, action, configuration, value);
}

function pushEventToMatomo(category, action, name, value=-1) {
    if (value === -1) {
        _paq.push(["trackEvent", category, action, name]);
    } else {
        _paq.push(["trackEvent", category, action, name, value]);
    }
}

function loadMatomo() {
    var _paq = window._paq = window._paq || [];
    /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
    _paq.push(["disableCookies"]);
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);
    (function() {
        var u="//matomo.simplipfy.org/";
        _paq.push(["setTrackerUrl", u+"matomo.php"]);
        _paq.push(["setSiteId", "2"]);
        var d=document, g=d.createElement("script"), s=d.getElementsByTagName("script")[0];
        g.async=true; g.src=u+"matomo.js"; s.parentNode.insertBefore(g,s);
    })();
}
















