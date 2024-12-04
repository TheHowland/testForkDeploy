class LanguageManager {
    currentLang = german;

    updatesLanguageFields() {
        this.updateLanguageLandingPage();
        this.updateLanguageSelectorPage();
        this.updateLanguageCheatSheetPage();
    }

    updateLanguageLandingPage() {
        document.getElementById("landing-page-greeting").innerHTML = this.currentLang.landingPageGreeting;
        document.getElementById("key-feature1heading").innerHTML = this.currentLang.keyFeature1heading;
        document.getElementById("key-feature1").innerHTML = this.currentLang.keyFeature1;
        document.getElementById("key-feature2").innerHTML = this.currentLang.keyFeature2;
        document.getElementById("key-feature2heading").innerHTML = this.currentLang.keyFeature2heading;
        document.getElementById("key-feature3").innerHTML = this.currentLang.keyFeature3;
        document.getElementById("key-feature3heading").innerHTML = this.currentLang.keyFeature3heading;
        document.getElementById("landing-page-explanation1").innerHTML = this.currentLang.landingPageExplanation1;
        document.getElementById("landing-page-explanation2").innerHTML = this.currentLang.landingPageExplanation2;
        document.getElementById("landing-page-explanation3").innerHTML = this.currentLang.landingPageExplanation3;
    }

    updateLanguageSelectorPage() {
        // circuit mapper is only instantiated in when start button pressed
        if (circuitMapper !== null) {
            for (const circuitSet of circuitMapper.circuitSets) {
                const heading = document.getElementById(`${circuitSet.identifier}-heading`);
                heading.innerHTML = this.currentLang.carouselHeadings[circuitSet.identifier];
            }
        }
    }

    updateLanguageCheatSheetPage() {
        const subHeading = document.getElementById("substitutionTableHeading");
        subHeading.innerHTML = this.currentLang.subTableHeading;
        const series = document.getElementById("seriesHeading");
        series.innerHTML = this.currentLang.subTableSeriesHeading;
        const parallel = document.getElementById("parallelHeading");
        parallel.innerHTML = this.currentLang.subTableParallelHeading;
        const subResCol = document.getElementById("subTableResHeading");
        subResCol.innerHTML = this.currentLang.resistorRowHeading;
        const subCapCol = document.getElementById("subTableCapHeading");
        subCapCol.innerHTML = this.currentLang.capacitorRowHeading;
        const subIndCol = document.getElementById("subTableIndHeading");
        subIndCol.innerHTML = this.currentLang.inductorRowHeading;

        const resReaHeading = document.getElementById("resistanceReactanceTableHeading");
        resReaHeading.innerHTML = this.currentLang.resReaTableHeading;
        const resCol = document.getElementById("resistance");
        resCol.innerHTML = this.currentLang.resistanceColHeading;
        const reaCol = document.getElementById("reactance");
        reaCol.innerHTML = this.currentLang.reactanceColHeading;
        const res = document.getElementById("resistor");
        res.innerHTML = this.currentLang.resistorRowHeading;
        const cap = document.getElementById("capacitor");
        cap.innerHTML = this.currentLang.capacitorRowHeading;
        const ind = document.getElementById("inductor");
        ind.innerHTML = this.currentLang.inductorRowHeading;
    }

    updateDataPrivacyPage() {
        const backBtn = document.getElementById('back-btn');
        backBtn.innerHTML = this.currentLang.dataPrivacyBackBtn;
        const dataPrivacyHeading = document.getElementById('data-privacy-heading');
        dataPrivacyHeading.innerHTML = this.currentLang.dataPrivacyHeading;
        const dataPrivacyText = document.getElementById('data-privacy-text');
        dataPrivacyText.innerHTML = this.currentLang.dataPrivacyText;
    }

    updateLegalNoticePage() {
        const backBtn = document.getElementById('back-btn');
        backBtn.innerHTML = this.currentLang.dataPrivacyBackBtn;
        const legalNoticeHeading = document.getElementById('legal-notice-heading');
        legalNoticeHeading.innerHTML = this.currentLang.legalNoticeHeading;
    }

}