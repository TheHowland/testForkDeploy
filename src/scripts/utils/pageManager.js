class PageManager {
    constructor(document) {
        this.landingPage = document.getElementById("landing-page-container");
        this.selectPage = document.getElementById("select-page-container");
        this.simplifierPage = document.getElementById("simplifier-page-container");
        this.cheatSheet = document.getElementById("cheat-sheet-container");
        this.languageSelect = document.getElementById("lang-dropdown");
        this.darkModeSwitch = document.getElementById("darkmode-div");
    }

    showLandingPage() {
        this.landingPage.style.display = "block";
        this.selectPage.style.display = "none";
        this.simplifierPage.style.display = "none";
        this.cheatSheet.style.display = "none";
        this.languageSelect.hidden = false;
        this.darkModeSwitch.hidden = false;
    }

    showSelectPage() {
        this.landingPage.style.display = "none";
        this.selectPage.style.display = "block";
        this.simplifierPage.style.display = "none";
        this.cheatSheet.style.display = "none";
        this.languageSelect.hidden = false;
        this.darkModeSwitch.hidden = false;
    }

    showSimplifierPage() {
        this.landingPage.style.display = "none";
        this.selectPage.style.display = "none";
        this.simplifierPage.style.display = "block";
        this.cheatSheet.style.display = "none";
        this.languageSelect.hidden = true;
        this.darkModeSwitch.hidden = true;
    }

    showCheatSheet() {
        this.landingPage.style.display = "none";
        this.selectPage.style.display = "none";
        this.simplifierPage.style.display = "none";
        this.cheatSheet.style.display = "block";
        this.languageSelect.hidden = false;
        this.darkModeSwitch.hidden = false;
    }

}
