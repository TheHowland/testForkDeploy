const circuitActions = {
    Finished: "Fertig",
    Aborted: "Abgebrochen",
    Reset: "Reset",
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

function mapCategory(category) {
  if (["sub"].includes(category)) return "Ersatzschaltungen";
  if (["acdc"].includes(category)) return "Gleich-/Wechselstromkreise";
  if (["mixed"].includes(category)) return "Gemischte Schaltungen";
  return null;
}

function pushCircuitEventMatomo(action, value=-1) {
  let category = state.currentCircuitMap.selectorGroup
  let circuitName = state.currentCircuitMap.circuitFile

  // Map the categories in order to be flexible in the future with the input
  // so we can also send the same kind of category (because they don't change in matomo)
  let mappedCategory = mapCategory(category)
  if (mappedCategory === null) {
    console.log("Category not possible, check: " + category);
    return;
  }
  let possibleActions = Object.values(circuitActions);
  if (!(possibleActions.includes(action))) {
    console.log("Action not in " + possibleActions);
    console.log("Action: " + action);
    console.log("Either change the action or adapt the possible actions");
    return;
  }
  if (value === -1) {
    _paq.push(["trackEvent", mappedCategory, action, circuitName]);
  } else {
    _paq.push(["trackEvent", mappedCategory, action, circuitName, value]);
  }
}

function pushConfigurationEventMatomo(action, configuration, value=-1) {
    let possibleActions = Object.values(configActions);
    if (!(possibleActions.includes(action))) {
        console.log("Action not in " + possibleActions);
        console.log("Action: " + action);
        console.log("Either change the action or adapt the possible actions");
        return;
    }
    if (value === -1) {
      _paq.push(["trackEvent", "Konfigurationen", action, configuration]);
    } else {
      _paq.push(["trackEvent", "Konfigurationen", action, configuration, value]);
    }
}

function pushLanguageEventMatomo(language) {
  pushConfigurationEventMatomo(configActions.SetLanguage, language);
}

function pushDarkModeEventMatomo(mode) {
  pushConfigurationEventMatomo(configActions.SetDarkMode, mode);
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