class LanguageManager {
    currentLang = german;

    updatesLanguageFields() {
        this.updateLanguageLandingPage();
        this.updateLanguageSelectorPage();
        this.updateLanguageCheatSheetPage();
    }

    updateLanguageLandingPage() {
        document.getElementById("cookie-banner-title").innerHTML = this.currentLang.cookies.title;
        document.getElementById("cookie-banner-text").innerHTML = this.currentLang.cookies.text;
        document.getElementById("btn-cookies-all").innerHTML = this.currentLang.cookies.acceptAll;
        document.getElementById("btn-cookies-none").innerHTML = this.currentLang.cookies.rejectAll;
        if (document.getElementById("cookie-options").style.display === "block") {
            this.updateConsentOptions();
            document.getElementById("btn-cookies-some").innerHTML = this.currentLang.cookies.applySome;
        } else {
            document.getElementById("btn-cookies-some").innerHTML = this.currentLang.cookies.customize;
        }
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

    updateConsentOptions() {
        document.getElementById("label-necessary").innerHTML = this.currentLang.cookies.necessary;
        document.getElementById("label-analytics").innerHTML = this.currentLang.cookies.analytics;
        document.getElementById("label-pref").innerHTML = this.currentLang.cookies.preferences;
        document.getElementById("label-marketing").innerHTML = this.currentLang.cookies.marketing;
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