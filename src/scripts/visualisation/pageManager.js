class PageManager {
    constructor(document) {
        this.landingPage = document.getElementById("landing-page-container");
        this.selectPage = document.getElementById("select-page-container");
        this.simplifierPage = document.getElementById("simplifier-page-container");
        this.cheatSheet = document.getElementById("cheat-sheet-container");
        this.languageSelect = document.getElementById("Dropdown");
        this.darkModeSwitch = document.getElementById("darkmode-switch");
        this.activeLangFlag = document.getElementById("activeLanguageFlag");
    }

    showLandingPage() {
        this.landingPage.style.display = "block";
        this.selectPage.style.display = "none";
        this.simplifierPage.style.display = "none";
        this.cheatSheet.style.display = "none";
        this.languageSelect.disabled = false;
        this.darkModeSwitch.disabled = false;
        this.activeLangFlag.style.filter = "brightness(1)";
    }

    showSelectPage() {
        this.landingPage.style.display = "none";
        this.selectPage.style.display = "block";
        this.simplifierPage.style.display = "none";
        this.cheatSheet.style.display = "none";
        this.languageSelect.disabled = false;
        this.darkModeSwitch.disabled = false;
        this.activeLangFlag.style.filter = "brightness(1)";
    }

    showSimplifierPage() {
        this.landingPage.style.display = "none";
        this.selectPage.style.display = "none";
        this.simplifierPage.style.display = "block";
        this.cheatSheet.style.display = "none";
        this.languageSelect.disabled = true;
        this.darkModeSwitch.disabled = true;
        this.activeLangFlag.style.filter = "brightness(0.5)";
    }

    showCheatSheet() {
        this.landingPage.style.display = "none";
        this.selectPage.style.display = "none";
        this.simplifierPage.style.display = "none";
        this.cheatSheet.style.display = "block";
        this.languageSelect.disabled = false;
        this.darkModeSwitch.disabled = false;
        this.activeLangFlag.style.filter = "brightness(1)";
    }

}
