class SelectorBuilder {
    constructor() {
    }

    // ############################# Necessary function for outside ###############################

    buildSelectorsForAllCircuitSets() {
        for (const circuitSet of circuitMapper.circuitSets.reverse()) {
            this.buildSelector(circuitSet.identifier);
        }
    }

    // ################################ Helper functions ###########################################

    buildSelector(identifier) {
        const pgrBar = document.getElementById("pgr-bar-container");
        const heading = this.createHeadingContainer(identifier);
        const carousel = this.createCarouselContainer();

        carousel.innerHTML = this.createSelectorBody(identifier);

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

    createSelectorBody(identifier) {
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
        for (const circuit of circuitSet.set) {
            this.setupSpecificCircuitSelector(circuit, pageManager, pageManager.pyodide);
        }
        if (moreThanOneCircuitInSet(circuitSet)) {
            this.setupNextAndPrevButtons(circuitSet);
        } else {
            this.hideNextAndPrevButtons(circuitSet);
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
            this.circuitSelectorStartButtonPressed(circuitMap.circuitFile, circuitMap, pageManager))
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

    circuitSelectorStartButtonPressed(circuitName, circuitMap, pageManager){
        document.title = "Simplifier";
        pushPageViewMatomo(circuitMap.selectorGroup + "/" + circuitName);
        clearSimplifierPageContent();
        state.currentCircuit = circuitName;
        state.currentCircuitMap = circuitMap;
        state.pictureCounter = 0;
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
