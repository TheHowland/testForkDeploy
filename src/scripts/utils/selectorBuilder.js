class SelectorBuilder {
    constructor() {
    }

    // ############################# Necessary function for outside ###############################

    buildSelectorsForAllCircuitSets() {
        for (const circuitSet of CircuitSets.reverse()) {
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
                    <span class="carousel-control-prev-icon" aria-hidden="true" style="background-color: black;"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button id="${identifier}-next-btn" class="carousel-control-next" type="button" data-bs-target="#${identifier}-carousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true" style="background-color: black;"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
            `;
    }

    createCarouselElements(identifier) {
        let carouselElementString = "";
        for (const circuitSet of CircuitSets) {
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
}
