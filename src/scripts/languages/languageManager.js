class LanguageManager {
    currentLang = german;

    updatesLanguageFields() {
        this.updateLanguageLandingPage();
        this.updateLanguageSelectorPage();
        this.updateLanguageCheatSheetPage();
    }

    updateLanguageLandingPage() {
        const greeting = document.getElementById("landing-page-greeting");
        greeting.innerHTML = this.currentLang.landingPageGreeting;
        const keyFeature1heading = document.getElementById("key-feature1heading");
        keyFeature1heading.innerHTML = this.currentLang.keyFeature1heading;
        const keyFeature1 = document.getElementById("key-feature1");
        keyFeature1.innerHTML = this.currentLang.keyFeature1;
        const keyFeature2 = document.getElementById("key-feature2");
        keyFeature2.innerHTML = this.currentLang.keyFeature2;
        const keyFeature2heading = document.getElementById("key-feature2heading");
        keyFeature2heading.innerHTML = this.currentLang.keyFeature2heading;
        const keyFeature3 = document.getElementById("key-feature3");
        keyFeature3.innerHTML = this.currentLang.keyFeature3;
        const keyFeature3heading = document.getElementById("key-feature3heading");
        keyFeature3heading.innerHTML = this.currentLang.keyFeature3heading;
        const expl1 = document.getElementById("landing-page-explanation1");
        expl1.innerHTML = this.currentLang.landingPageExplanation1;
        const expl2 = document.getElementById("landing-page-explanation2");
        expl2.innerHTML = this.currentLang.landingPageExplanation2;
        const expl3 = document.getElementById("landing-page-explanation3");
        expl3.innerHTML = this.currentLang.landingPageExplanation3;
    }

    updateLanguageSelectorPage() {
        for (const circuitSet of circuitMapper.circuitSets) {
            const heading = document.getElementById(`${circuitSet.identifier}-heading`);
            heading.innerHTML = this.currentLang.carouselHeadings[circuitSet.identifier];
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

}