function setupDataPrivacyPage() {
    const selectEnglish = document.getElementById("select-english");
    const selectGerman = document.getElementById("select-german");
    let languageManager = new LanguageManager();

    document.getElementById("data-privacy-darkmode-switch").disabled = true;
    languageManager.updateDataPrivacyPage();

    selectEnglish.addEventListener("click", () => {
        languageManager.currentLang = english;
        const activeFlagIcon = document.getElementById("activeLanguageFlag");
        activeFlagIcon.setAttribute("src", "src/resources/navigation/uk.png");
        languageManager.updateDataPrivacyPage();
    })
    selectGerman.addEventListener("click", () => {
        languageManager.currentLang = german;
        const activeFlagIcon = document.getElementById("activeLanguageFlag");
        activeFlagIcon.setAttribute("src", "src/resources/navigation/germany.png");
        languageManager.updateDataPrivacyPage();
    })

    const activeFlagIcon = document.getElementById("activeLanguageFlag");
    if (languageManager.currentLang === german) {
        activeFlagIcon.setAttribute("src", "src/resources/navigation/germany.png");
    }
    else if (languageManager.currentLang === english) {
        activeFlagIcon.setAttribute("src", "src/resources/navigation/uk.png");
    }
}