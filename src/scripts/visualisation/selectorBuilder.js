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
            let modal = this.buildOverviewModal(circuitSet);
            accordion.appendChild(item);
            document.body.appendChild(modal);  // needs to be on the top level to work
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
                    <div class="container vcCheckBox" style="text-align: left; max-width: 350px; padding: 0; color:${colors.currentForeground};">
                        <button onclick="document.getElementById('${identifier}-overviewModal').blur()" id="${identifier}-overviewModalBtn" type="button" 
                            class="btn my-1 btn-primary modalOverviewBtn" data-bs-toggle="modal" data-bs-target="#${identifier}-overviewModal">
                                ${languageManager.currentLang.overviewModalBtn}
                        </button>
                    </div>
                    ${this.createCarousel(identifier)}
                </div>
            </div>`;
        return accordionItem;
    }

    buildOverviewModal(circuitSet) {
        let id = circuitSet.identifier;
        let modal = document.createElement("div");
        modal.classList.add("modal", "fade", "modal-xl");
        modal.id = `${id}-overviewModal`;
        modal.tabIndex = "-1";
        modal.setAttribute("aria-labelledby", `${id}-overviewModalLabel`);
        modal.setAttribute("aria-hidden", "true");

        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header" style="background: ${colors.currentBackground}; color: white;">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" style="background: ${colors.currentBackground}; color: white;">
                        ${this.generateOverviewGrid(circuitSet)}
                    </div>
                    <div class="modal-footer justify-content-center" style="background: ${colors.currentBackground}">
                        <button id="${id}-overviewCloseBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            ${languageManager.currentLang.closeBtn}
                        </button>
                    </div>
                </div>
            </div>
                `;
        return modal;
    }

    generateOverviewGrid(circuitSet) {
        let grid = document.createElement("div");
        grid.classList.add("row");
        for (let circuit of circuitSet.set) {
            let col = document.createElement("div");
            col.classList.add("col-md-4", "col-sm-6",  "col-12",  "mb-4", "text-center", "justify-content-center");
            col.innerHTML = `
                <div id="${circuit.circuitDivID}-overviewModal" class="svg-selector mx-auto"></div>
                <button id="${circuit.btn}-modalBtn" onclick="document.getElementById('${circuit.btn}-modalBtn').blur()" class="btn btn-warning text-dark px-5 circuitStartBtnModal">start</button>
                `;
            grid.appendChild(col);
        }
        return grid.outerHTML;
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
        heading.classList.add("pt-3", "big-heading");
        return heading;
    }

    createCarouselContainer() {
        const carousel = document.createElement("div");
        carousel.classList.add("container-fluid", "h-50", "mb-5", "selector-container");
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
            this.setupSpecificCircuitSelector(circuit, pageManager);
            this._showFirstCircuitAsSelected(idx, circuitSet);
        }
        if (moreThanOneCircuitInSet(circuitSet)) {
            this.setupNextAndPrevButtons(circuitSet);
        } else {
            this.hideNextAndPrevButtons(circuitSet);
        }
    }

    _showFirstCircuitAsSelected(idx, circuitSet) {
        if ((idx === 0)) {
            this.showCircuitAsSelected(document.getElementById(circuitSet.set[0].circuitDivID),
                document.getElementById(circuitSet.set[0].btnOverlay));
        }
    }

    setupSpecificCircuitSelector(circuitMap, pageManager) {
        const circuitDiv = document.getElementById(circuitMap.circuitDivID);
        const startBtn = document.getElementById(circuitMap.btn);
        const btnOverlay = document.getElementById(circuitMap.btnOverlay);

        // Fill div with svg
        let svgData = state.pyodide.FS.readFile(circuitMap.overViewSvgFile, {encoding: "utf8"});
        svgData = setSvgWidthTo(svgData, "100%");
        svgData = setSvgColorMode(svgData);
        circuitDiv.innerHTML = svgData;
        this.addVoltFreqOverlay(circuitDiv, circuitMap);

        hideSvgArrows(circuitDiv);
        hideLabels(circuitDiv);

        // Setup specific circuit in overview modal
        this.setupOverviewModalCircuit(circuitMap, circuitDiv, pageManager);

        this.setupSelectionCircuit(circuitDiv, startBtn, btnOverlay);
        startBtn.addEventListener("click", () =>
            this.circuitSelectorStartButtonPressed(circuitMap, pageManager))
    }

    addVoltFreqOverlay(circuitDiv, circuitMap) {
        // Add voltage and frequency overlay for R, L, C and mixed Circuits
        if ([circuitMapper.selectorIds.quick, circuitMapper.selectorIds.symbolic].includes(circuitMap.selectorGroup)){
            // nothing here
        } else {
            if (circuitMap.frequency === undefined || circuitMap.frequency === null) {
                circuitDiv.insertBefore(this.createVoltOverlay(circuitMap), circuitDiv.firstChild);
            } else {
                circuitDiv.insertBefore(this.createVoltFreqOverlay(circuitMap), circuitDiv.firstChild);
            }
        }
    }

    createVoltOverlay(circuitMap) {
        let div = document.createElement("div");
        div.id = `${circuitMap.btnOverlay}-volt-freq`;
        div.classList.add("volt-freq-overlay");
        div.innerHTML = `<p style="color: ${colors.currentForeground}; position:absolute; top:20px; right: 0; ">${circuitMap.voltage}</p>`;
        return div;
    }

    createVoltFreqOverlay(circuitMap) {
        let div = document.createElement("div");
        div.id = `${circuitMap.btnOverlay}-volt-freq`;
        div.classList.add("volt-freq-overlay");
        div.innerHTML = `<p style="color: ${colors.currentForeground}; position:absolute; top:20px; right: 0; ">${circuitMap.voltage}</p>
                         <p style="color: ${colors.currentForeground}; position:absolute; top:40px; right: 0; ">${circuitMap.frequency}</p>`;
        return div;
    }

    setupOverviewModalCircuit(circuitMap, circuitDiv, pageManager) {
        if (circuitMap.selectorGroup !== circuitMapper.selectorIds.quick) {
            const gridElement = document.getElementById(`${circuitMap.circuitDivID}-overviewModal`);
            gridElement.innerHTML = circuitDiv.innerHTML;  // copy svg without arrows to modal
            const overviewStartBtn = document.getElementById(`${circuitMap.btn}-modalBtn`);
            overviewStartBtn.addEventListener("click", () => {
                // we need the bootstrap modal instance in order to close it
                const modal = document.getElementById(`${circuitMap.selectorGroup}-overviewModal`);
                var modalInstance = bootstrap.Modal.getInstance(modal) || new bootstrap.Modal(modal);
                modalInstance.hide();
                this.circuitSelectorStartButtonPressed(circuitMap, pageManager);
            });
        }
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
            startSolving();
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
        btnOverlay.style.display = "block";
        if (!(btnOverlay.id.includes(circuitMapper.selectorIds.quick) || btnOverlay.id.includes(circuitMapper.selectorIds.symbolic))) {
            document.getElementById(`${btnOverlay.id}-volt-freq`).style.opacity = "0.5";
        }
    }
    showCircuitAsUnselected(circuit, btnOverlay) {
        circuit.style.borderColor = colors.currentForeground;
        circuit.style.opacity = "1";
        btnOverlay.style.display = "none";
        if (!(btnOverlay.id.includes(circuitMapper.selectorIds.quick) || btnOverlay.id.includes(circuitMapper.selectorIds.symbolic))) {
            document.getElementById(`${btnOverlay.id}-volt-freq`).style.opacity = "1";
        }
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
        if (!(circuitMap.selectorGroup === circuitMapper.selectorIds.quick) || (circuitMap.selectorGroup === circuitMapper.selectorIds.symbolic)) {
            document.getElementById(`${circuitMap.btnOverlay}-volt-freq`).style.opacity = "1";
        }
    }

}
