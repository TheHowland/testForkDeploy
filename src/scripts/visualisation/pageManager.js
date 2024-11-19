class PageManager {
    constructor(document) {
        this.landingPage = document.getElementById("landing-page-container");
        this.selectPage = document.getElementById("select-page-container");
        this.simplifierPage = document.getElementById("simplifier-page-container");
        this.cheatSheet = document.getElementById("cheat-sheet-container");
        this.languageSelect = document.getElementById("Dropdown");
        this.darkModeSwitch = document.getElementById("darkmode-switch");
        this.activeLangFlag = document.getElementById("activeLanguageFlag");
        this.pages = [this.landingPage, this.selectPage, this.simplifierPage, this.cheatSheet]
    }

    showLandingPage() {
        this.landingPage.style.display = "block";
        this.selectPage.style.display = "none";
        this.simplifierPage.style.display = "none";
        this.cheatSheet.style.display = "none";
        this.enableSettings();
        for (let feature of document.querySelectorAll(".feature-container")) {
            feature.classList.remove("visible");
        }
        document.title = "simpliPFy";
    }

    showSelectPage() {
        this.landingPage.style.display = "none";
        this.selectPage.style.display = "block";
        this.simplifierPage.style.display = "none";
        this.cheatSheet.style.display = "none";
        this.enableSettings();
        document.title = "Selection";
    }

    showSimplifierPage() {
        this.landingPage.style.display = "none";
        this.selectPage.style.display = "none";
        this.simplifierPage.style.display = "block";
        this.cheatSheet.style.display = "none";
        this.disableSettings();
        document.title = "Simplifier";
    }

    showCheatSheet() {
        this.landingPage.style.display = "none";
        this.selectPage.style.display = "none";
        this.simplifierPage.style.display = "none";
        this.cheatSheet.style.display = "block";
        this.enableSettings();
        document.title = "Cheat Sheet";
    }

    disableSettings() {
        this.languageSelect.disabled = true;
        this.darkModeSwitch.disabled = true;
        this.activeLangFlag.style.filter = "brightness(0.5)";
    }

    enableSettings() {
        this.languageSelect.disabled = false;
        this.darkModeSwitch.disabled = false;
        this.activeLangFlag.style.filter = "brightness(1)";
    }

    setPyodide(pyodide) {
        this.pyodide = pyodide
    }

    // ########################## Setups ########################################
    setupLandingPage() {
        if (localStorage.getItem('consentMode') !== null) {
            document.getElementById("cookie-banner").style.display = "none";
        } else {
            document.getElementById("cookie-banner").style.display = "block";
            addCookieBtnFunctionality();
        }
        languageManager.updateLanguageLandingPage();

        const landingStartButton = document.getElementById("start-button");
        landingStartButton.addEventListener("click", async () => {
            await this.setupLandingPageStartBtn(this.pyodide)
        })
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    for (let feature of document.querySelectorAll(".feature-container")) {
                        feature.classList.add("visible");
                    }
                }
            });
        }, { threshold: 1});

        const trigger = document.getElementById("trigger");
        observer.observe(trigger);

        const activeFlagIcon = document.getElementById("activeLanguageFlag");
        if (languageManager.currentLang === german) {
            activeFlagIcon.setAttribute("src", "src/resources/navigation/germany.png");
        }
        else if (languageManager.currentLang === english) {
            activeFlagIcon.setAttribute("src", "src/resources/navigation/uk.png");
        }

    }

    async setupLandingPageStartBtn(pyodide) {
        this.showSelectPage();
        hideAllSelectors();
        const note = showWaitingNote();

        // Import packages/scripts, create selector svgs
        await packageManager.doLoadsAndImports(pyodide);
        await createSvgsForSelectors(pyodide);

        showAllSelectors();
        note.remove();

        pageManager.setupSelectPage();
    }

    setupSelectPage() {
        for (const circuitSet of circuitMapper.circuitSets) {
            this.updateSelectorHeadings(circuitSet.identifier);
            selectorBuilder.setupSelector(circuitSet, this);
        }
    }

    updateSelectorHeadings(circuitSetId) {
        const heading = document.getElementById(`${circuitSetId}-heading`);
        heading.innerHTML = languageManager.currentLang.carouselHeadings[circuitSetId];
    }

    setupNavigation() {
        const navHomeLink = document.getElementById("nav-home");
        const navSimplifierLink = document.getElementById("nav-select");
        const navCheatLink = document.getElementById("nav-cheat");
        const navLogo = document.getElementById("nav-logo");
        const selectEnglish = document.getElementById("select-english");
        const selectGerman = document.getElementById("select-german");

        navHomeLink.addEventListener("click", () => {
            checkIfSimplifierPageNeedsReset(this.pyodide);  // must be in front of page change
            closeNavbar();
            this.showLandingPage();
        })
        navSimplifierLink.addEventListener("click", () => {
            checkIfSimplifierPageNeedsReset(this.pyodide);  // must be in front of page change
            closeNavbar();
            this.showSelectPage();
        })
        navCheatLink.addEventListener("click", () => {
            checkIfSimplifierPageNeedsReset();
            closeNavbar();
            this.showCheatSheet();
        })
        navLogo.addEventListener("click", () => {
            checkIfSimplifierPageNeedsReset(this.pyodide);  // must be in front of page change
            closeNavbar();
            this.showLandingPage();
        })
        selectEnglish.addEventListener("click", () => {
            languageManager.currentLang = english;
            const activeFlagIcon = document.getElementById("activeLanguageFlag");
            activeFlagIcon.setAttribute("src", "src/resources/navigation/uk.png");
            closeNavbar();
            languageManager.updatesLanguageFields();
        })
        selectGerman.addEventListener("click", () => {
            languageManager.currentLang = german;
            const activeFlagIcon = document.getElementById("activeLanguageFlag");
            activeFlagIcon.setAttribute("src", "src/resources/navigation/germany.png");
            closeNavbar();
            languageManager.updatesLanguageFields();
        })

        const toggler = document.getElementById("nav-toggler");
        toggler.addEventListener("click", () => {
            this.updatePagesOpacity();
        })
    }

    updatePagesOpacity() {
        const toggler = document.getElementById("nav-toggler");
        for (let page of this.pages) {
            if (toggler.classList.contains("collapsed")) {
                page.style.opacity = "1";
            } else {
                page.style.opacity = "0.3";
            }
        }
    }

    setupCheatSheet() {
        languageManager.updateLanguageCheatSheetPage();

        // Substitution table
        const resSer = document.getElementById("resistorSeries");
        const resPar = document.getElementById("resistorParallel");
        const capSer = document.getElementById("capacitorSeries");
        const capPar = document.getElementById("capacitorParallel");
        const indSer = document.getElementById("inductorSeries");
        const indPar = document.getElementById("inductorParallel");

        resSer.innerHTML = "$$R = R1 + R2 + ...$$";
        resPar.innerHTML = "$$\\frac{1}{R} = \\frac{1}{R1} + \\frac{1}{R2} + ...$$";

        capSer.innerHTML = "$$\\frac{1}{C} = \\frac{1}{C1} + \\frac{1}{C2} + ...$$";
        capPar.innerHTML = "$$C = C1 + C2 + ...$$";

        indSer.innerHTML = "$$L = L1 + L2 + ...$$";
        indPar.innerHTML = "$$\\frac{1}{L} = \\frac{1}{L1} + \\frac{1}{L2} + ...$$";

        const pSub = document.getElementById("pSub");
        pSub.innerHTML = "<br><br><br>"

        // Complex R X table
        const resRes = document.getElementById("resistorResistance");
        resRes.innerHTML = "$$R$$";
        const resRea = document.getElementById("resistorReactance");
        resRea.innerHTML = "$$0$$";

        const capRes = document.getElementById("capacitorResistance");
        capRes.innerHTML = "$$0$$";
        const capRea = document.getElementById("capacitorReactance");
        capRea.innerHTML = "$$-\\frac{1}{ \\omega \\cdot C}$$";

        const indRes = document.getElementById("inductorResistance");
        indRes.innerHTML = "$$0$$";
        const indRea = document.getElementById("inductorReactance");
        indRea.innerHTML = "$$ \\omega \\cdot L$$";

        const pRX = document.getElementById("pRX");
        pRX.innerHTML = "$$\\underline{Z} = R + j \\cdot X$$"
        pRX.style.color = "white";

        MathJax.typeset();
    }
}
