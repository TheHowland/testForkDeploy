class SelectorBuilder {
    constructor() {
    }

    // ############################# Necessary function for outside ###############################

    buildAccordionSelectors() {
        let accordion = document.createElement("div");
        accordion.classList.add("accordion", "accordion-flush", "mt-5");
        accordion.id =  "selector-accordion";

        for (let circuitSet of circuitMapper.circuitSets) {
            if (circuitSet.identifier === circuitMapper.selectorIds.quick) continue; // already built
            let item = this.buildAccordionItem(circuitSet.identifier);
            accordion.appendChild(item);
        }

        return accordion;
    }

    buildAccordionItem(identifier) {
        let accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");
        accordionItem.innerHTML = `
            <h2 class="accordion-header" id="flush-heading-${identifier}">
                <button id="${identifier}-acc-btn" class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse-${identifier}" aria-expanded="false" aria-controls="flush-collapse-${identifier}">
                    ${languageManager.currentLang.selectorHeadings[identifier]}
                </button>
            </h2>
            <div id="flush-collapse-${identifier}" class="accordion-collapse collapse" aria-labelledby="flush-heading-${identifier}" data-bs-parent="#selector-accordion" style="">
                <div class="accordion-body">
                    <!-- OVERVIEW BUTTON button onclick="document.getElementById('overviewBtnModal').blur()" id="overviewBtnModal" type="button" class="btn mt-1 mb-3 btn-primary" data-bs-toggle="modal" data-bs-target="#overviewModal">OVERVIEW</--button-->
                    ${this.createCarousel(identifier)}
                </div>
            </div>`;
        return accordionItem;
    }


    buildSelectorsForAllCircuitSets() {
        // Build the quick selector outside accordion
        this.buildSelector(circuitMapper.selectorIds.quick);

        let accordion = this.buildAccordionSelectors();

        const quickCarousel = document.getElementById("quick-carousel");
        quickCarousel.insertAdjacentElement("afterend", accordion);
    }

    // ################################ Helper functions ###########################################

    buildSelector(identifier) {
        const pgrBar = document.getElementById("pgr-bar-container");
        const heading = this.createHeadingContainer(identifier);
        const carousel = this.createCarouselContainer();

        carousel.innerHTML = this.createCarousel(identifier);

        pgrBar.insertAdjacentElement("afterend", heading);
        heading.insertAdjacentElement("afterend", carousel);
    }


    createHeadingContainer(identifier) {
        const heading = document.createElement("p");
        heading.id = `${identifier}-heading`;
        heading.classList.add("pt-3");
        heading.classList.add("big-heading");
        return heading;
    }

    createCarouselContainer() {
        const carousel = document.createElement("div");
        carousel.classList.add("container-fluid");
        carousel.classList.add("h-50");
        carousel.classList.add("mb-5");
        carousel.classList.add("selector-container");
        return carousel;
    }

    createCarousel(identifier) {
        const carouselElements = this.createCarouselElements(identifier);
        return `
            <div id="${identifier}-carousel" class="carousel slide" data-interval="false">
                <div class="carousel-inner">
                    ${carouselElements}                    
                </div>
                <button id="${identifier}-prev-btn" class="carousel-control-prev" type="button" data-bs-target="#${identifier}-carousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true" style="background-color: ${colors.prevNextBtnBackgroundColor};"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button id="${identifier}-next-btn" class="carousel-control-next" type="button" data-bs-target="#${identifier}-carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true" style="background-color: ${colors.prevNextBtnBackgroundColor};"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            `;
    }

    createCarouselElements(identifier) {
        let carouselElementString = "";
        for (const circuitSet of circuitMapper.circuitSets) {
            if (circuitSet.identifier !== identifier) continue;
            // Create selector for the circuitSet with identifier
            for (const circuit of circuitSet.set) {
                // For each circuit inside the set, create the carousel element
                carouselElementString += this.createCarouselItemForCircuit(circuit);
            }
        }

        // Make the first element active
        carouselElementString = carouselElementString.replace("carousel-item justify", "carousel-item active justify");

        return carouselElementString;
    }

    adaptSelectorFrameColor() {
        // Adapt border color if darkmode changed before selector is built
        if (!document.getElementById("darkmode-switch").checked) {
            const svgSelectors = document.getElementsByClassName("svg-selector");
            for (const svgSelector of svgSelectors) {
                svgSelector.style.borderColor = colors.currentForeground;
            }
        }
    }

    createCarouselItemForCircuit(circuit) {
        return `<div class="carousel-item justify-content-center">
                    <div id="${circuit.btnOverlay}" class="img-overlay">
                        <button id="${circuit.btn}" class="btn btn-warning text-dark px-5 circuitStartBtn">start</button>
                    </div>
                    <div id="${circuit.circuitDivID}" class="svg-selector mx-auto">
                    </div>
                </div>`;
    }

    // ######################### Setup #######################################
    setupSelector(circuitSet, pageManager) {
        for (const [idx, circuit] of circuitSet.set.entries()) {
            this._showFirstQuickCircuitAsSelected(idx, circuitSet);
            this.setupSpecificCircuitSelector(circuit, pageManager, pageManager.pyodide);
        }
        if (moreThanOneCircuitInSet(circuitSet)) {
            this.setupNextAndPrevButtons(circuitSet);
        } else {
            this.hideNextAndPrevButtons(circuitSet);
        }
    }

    _showFirstQuickCircuitAsSelected(idx, circuitSet) {
        if ((idx === 0) && (circuitSet.identifier === circuitMapper.selectorIds.quick)) {
            this.showCircuitAsSelected(document.getElementById(circuitSet.set[0].circuitDivID),
                document.getElementById(circuitSet.set[0].btnOverlay));
        }
    }

    setupSpecificCircuitSelector(circuitMap, pageManager, pyodide) {
        const circuitDiv = document.getElementById(circuitMap.circuitDivID);
        const startBtn = document.getElementById(circuitMap.btn);
        const btnOverlay = document.getElementById(circuitMap.btnOverlay);

        // Fill div with svg
        let svgData = pyodide.FS.readFile(circuitMap.overViewSvgFile, {encoding: "utf8"});
        svgData = setSvgWidthTo(svgData, "100%");
        svgData = setSvgColorMode(svgData);
        circuitDiv.innerHTML = svgData;
        this.hideSvgArrows(circuitDiv);

        this.setupSelectionCircuit(circuitDiv, startBtn, btnOverlay);
        startBtn.addEventListener("click", () =>
            this.circuitSelectorStartButtonPressed(circuitMap, pageManager))
    }

    hideSvgArrows(circuitDiv) {
        let arrows = circuitDiv.getElementsByClassName("arrow");
        for (let arrow of arrows) arrow.style.display = "none";
    }

    resetSelectorSelections(circuitSet) {
        for (const circuit of circuitSet) {
            this.resetSelection(circuit);
        }
    }

    setupNextAndPrevButtons(circuitSet) {
        const next = document.getElementById(`${circuitSet.identifier}-next-btn`);
        const prev = document.getElementById(`${circuitSet.identifier}-prev-btn`);

        next.addEventListener("click", () => {
            this.resetSelectorSelections(circuitSet.set);
        })
        prev.addEventListener("click", () => {
            this.resetSelectorSelections(circuitSet.set);
        })
    }

    hideNextAndPrevButtons(circuitSet) {
        const next = document.getElementById(`${circuitSet.identifier}-next-btn`);
        const prev = document.getElementById(`${circuitSet.identifier}-prev-btn`);
        next.hidden = true;
        prev.hidden = true;
    }

    circuitSelectorStartButtonPressed(circuitMap, pageManager){
        document.title = "Simplifier";
        pushPageViewMatomo(circuitMap.selectorGroup + "/" + circuitMap.circuitFile)
        clearSimplifierPageContent();
        state.currentCircuitMap = circuitMap;
        state.pictureCounter = 0;
        state.allValuesMap = new Map();
        if (state.pyodideReady) {
            startSolving(pageManager.pyodide);
        }

        pageManager.disableSettings();
        const selectorPage = document.getElementById("select-page-container");
        const simplifierPage = document.getElementById("simplifier-page-container");
        setTimeout(() => {
            simplifierPage.style.display = "block";
            simplifierPage.classList.add("slide-in-right");
            selectorPage.classList.add("slide-out-left");
            selectorPage.style.opacity = "0.1";
        }, 300);

        setTimeout(() => {
            selectorPage.style.display = "none";
            scrollBodyToTop();
        }, 800);

    }

    showCircuitAsSelected(circuit, btnOverlay) {
        circuit.style.borderColor = colors.keyYellow;
        circuit.style.opacity = "0.5";
        btnOverlay.style.display = "block"
    }
    showCircuitAsUnselected(circuit, btnOverlay) {
        circuit.style.borderColor = colors.currentForeground;
        circuit.style.opacity = "1";
        btnOverlay.style.display = "none"
    }

    setupSelectionCircuit(circuit, startBtn, startBtnOverlay) {
        circuit.addEventListener("click", () => {this.showCircuitAsSelected(circuit, startBtnOverlay)})
        startBtnOverlay.addEventListener("click", () => {this.showCircuitAsUnselected(circuit, startBtnOverlay)})
    }

    resetSelection(circuitMap) {
        const circuit = document.getElementById(circuitMap.circuitDivID);
        const overlay = document.getElementById(circuitMap.btnOverlay);
        circuit.style.borderColor = colors.currentForeground;
        circuit.style.opacity = "1";
        overlay.style.display = "none";
    }

}
