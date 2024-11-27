function setupLegalNoticePage() {
    const selectEnglish = document.getElementById("select-english");
    const selectGerman = document.getElementById("select-german");
    let languageManager = new LanguageManager();

    document.getElementById("legal-notice-darkmode-switch").disabled = true;
    languageManager.updateLegalNoticePage();

    selectEnglish.addEventListener("click", () => {
        languageManager.currentLang = english;
        const activeFlagIcon = document.getElementById("activeLanguageFlag");
        activeFlagIcon.setAttribute("src", "src/resources/navigation/uk.png");
        languageManager.updateLegalNoticePage();
    })
    selectGerman.addEventListener("click", () => {
        languageManager.currentLang = german;
        const activeFlagIcon = document.getElementById("activeLanguageFlag");
        activeFlagIcon.setAttribute("src", "src/resources/navigation/germany.png");
        languageManager.updateLegalNoticePage();
    })

    const activeFlagIcon = document.getElementById("activeLanguageFlag");
    if (languageManager.currentLang === german) {
        activeFlagIcon.setAttribute("src", "src/resources/navigation/germany.png");
    }
    else if (languageManager.currentLang === english) {
        activeFlagIcon.setAttribute("src", "src/resources/navigation/uk.png");
    }
}