function setupDataPrivacyPage() {
    const selectEnglish = document.getElementById("select-english");
    const selectGerman = document.getElementById("select-german");
    let backBtn = document.getElementById("back-btn-data-privacy");
    let navLogo = document.getElementById("nav-logo");
    let navHome = document.getElementById("nav-home");
    let languageManager = new LanguageManager();

    document.getElementById("data-privacy-darkmode-switch").disabled = true;
    languageManager.updateDataPrivacyPage();

    backBtn.addEventListener("click", () => {
        window.location.pathname = window.location.pathname.substring(0, window.location.pathname.indexOf('datenschutz.html'))
    });
    navLogo.addEventListener("click", () => {
        window.location.pathname = window.location.pathname.substring(0, window.location.pathname.indexOf('datenschutz.html'))
    });
    navHome.addEventListener("click", () => {
        window.location.pathname = window.location.pathname.substring(0, window.location.pathname.indexOf('datenschutz.html'))
    });

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