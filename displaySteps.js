function display_step(pyodide, jsonFilePath, svgFilePath, contentDivName = 'simplification') {
    const contentDiv = document.getElementById(contentDivName);
    contentDiv.innerHTML = '';

    try {
        let jsonDataString = pyodide.FS.readFile(jsonFilePath, { encoding: "utf8" });
        const jsonData = JSON.parse(jsonDataString);
        let data = new SolutionObject(jsonData.name1, jsonData.name2, jsonData.newName, jsonData.value1, jsonData.value2,
            jsonData.result, jsonData.relation, jsonData.latexEquation);

        const svgData = pyodide.FS.readFile(svgFilePath, { encoding: "utf8" });

        let relationText = "";
        if (!data.isNull()) {
            if (data.noFormat().relation === "parallel") {
                relationText = "Die Elemente sind parallel zueinander";
            } else if (data.noFormat().relation === "series") {
                relationText = "Die Elemente sind in Reihe zueinander";
            } else if (data.noFormat().relation === null) {
                relationText = "Keine Beziehung zwischen den Elementen";
            } else {
                throw Error("Unknown relation type");
            }
        }

        const circuitContainer = document.createElement('div');
        circuitContainer.className = 'circuit-container';

        const svgDiv = document.createElement('div');
        svgDiv.className = 'svg-container';
        svgDiv.innerHTML = svgData;

        const sanitizedSvgFilePath = sanitizeSelector(svgFilePath);
        circuitContainer.appendChild(svgDiv);

        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'description-container';

        // Only append the paragraph if it's not a step0.json file
        if (!jsonFilePath.toLowerCase().includes('step0.json')) {
            const paragraph = document.createElement('p');
            paragraph.innerHTML = `Die Elemente ${data.inline().name1} und ${data.inline().name2}<br>
              wurden zu ${data.inline().newName} zusammengefasst<br>
              ${data.inline().name1}&nbsp= ${data.inline().value1}<br>
              ${data.inline().name2}&nbsp= ${data.inline().value2}<br>
              ${data.inline().newName}&nbsp= ${data.inline().result}<br>
              ${relationText}<br>
              Rechnung:<br>
              ${data.inline().latexEquation}`;
            descriptionContainer.appendChild(paragraph);
        }

        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-container';
        contentContainer.appendChild(circuitContainer);
        contentContainer.appendChild(descriptionContainer);
        contentDiv.appendChild(contentContainer);

        if (mode === 'user') {
            const clickedElementsContainer = document.createElement('div');
            clickedElementsContainer.className = 'clicked-elements-container';
            clickedElementsContainer.innerHTML = `<h3>Ausgew&auml;hlte Elemente</h3><ul id="clicked-elements-list-${sanitizedSvgFilePath}"></ul>`;

            // Count path elements with id different from 'default_id'
            const pathElements = svgDiv.querySelectorAll('path');
            const filteredPaths = Array.from(pathElements).filter(path => path.getAttribute('class') !== 'na');

            if (filteredPaths.length === 1) {
                // If there is only one path element left, display a congratulatory message
                const congratsMessage = document.createElement('p');
                congratsMessage.innerHTML = 'Herzlichen Gl\u00FCckwunsch! Sie haben den Schaltkreis vollst&auml;ndig vereinfacht.';
                clickedElementsContainer.appendChild(congratsMessage);
            }

            const resetButton = document.createElement('button');
            resetButton.className = 'reset-button';
            resetButton.textContent = 'Reset';
            resetButton.addEventListener('click', () => {
                resetClickedElements(svgDiv, clickedElementsContainer);
            });

            const checkButton = document.createElement('button');
            checkButton.className = 'check-button';
            checkButton.textContent = 'Check';
            checkButton.addEventListener('click', async () => {
                setTimeout(() => {
                    resetClickedElements(svgDiv, clickedElementsContainer);
                }, 100);  // Kurze Verzögerung, um sicherzustellen, dass das DOM bereit ist
                if (selectedElements.length === 2) {
                    const canSimplify = await stepSolve.simplifyTwoCpts(selectedElements).toJs();
                    if (canSimplify[0]) {
                        display_step(pyodide, canSimplify[1], canSimplify[2]);
                    } else {
                        showMessage("Die ausgew\u00E4hlten Elemente k\u00F6nnen nicht vereinfacht werden.");
                    }
                } else {
                    showMessage('Bitte w\u00E4hlen Sie genau zwei Elemente aus!');
                }
                MathJax.typeset();
            });

            // Append the buttons after the congratulatory message
            clickedElementsContainer.appendChild(resetButton);
            clickedElementsContainer.appendChild(checkButton);

            descriptionContainer.appendChild(clickedElementsContainer);

            if (filteredPaths.length > 1) {
                const clickedElementsList = clickedElementsContainer.querySelector(`#clicked-elements-list-${sanitizedSvgFilePath}`);

                pathElements.forEach(pathElement => {
                    pathElement.style.pointerEvents = 'bounding-box';
                    pathElement.style.cursor = 'pointer';

                    pathElement.addEventListener('click', () => {
                        const bboxId = `bbox-${pathElement.getAttribute('id') || Math.random().toString(36).substr(2, 9)}`;
                        const existingBox = document.getElementById(bboxId);
                        if (existingBox) {
                            existingBox.remove();
                            const listItem = document.querySelector(`li[data-bbox-id="${bboxId}"]`);
                            if (listItem) {
                                listItem.remove();
                                selectedElements = selectedElements.filter(e => e !== pathElement.getAttribute('id'));
                            }
                        } else {
                            const bbox = pathElement.getBBox();
                            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                            rect.setAttribute('x', bbox.x);
                            rect.setAttribute('y', bbox.y);
                            rect.setAttribute('width', bbox.width);
                            rect.setAttribute('height', bbox.height);
                            rect.setAttribute('id', bboxId);
                            rect.classList.add('bounding-box');
                            pathElement.parentNode.insertBefore(rect, pathElement.nextSibling);

                            const value = pathElement.getAttribute('class') || 'na';
                            const listItem = document.createElement('li');
                            listItem.innerHTML = `${pathElement.getAttribute('id') || 'no id'} = \\(${value}\\)`;
                            listItem.setAttribute('data-bbox-id', bboxId);
                            clickedElementsList.appendChild(listItem);
                            selectedElements.push(pathElement.getAttribute('id') || 'no id');
                        }
                        MathJax.typeset();
                    });
                });
            }
        }
        MathJax.typeset();
    } catch (error) {
        console.error('Error fetching data:', error);
        contentDiv.textContent = 'Error loading content';
    }
}

async function display_steps(pyodide) {
    let files = await pyodide.FS.readdir("Solutions");
    while (files[0] === "." || files[0] === "..") {
        files.splice(0, 1);
    }

    let jsonFiles = [];
    let svgFiles = [];
    files.forEach((file) => {
        if (file.search(".+\\.json") >= 0) {
            jsonFiles.push(file);
        }
        if (file.search(".+\\.svg") >= 0) {
            svgFiles.push(file);
        }
    });

    for (let i = 0; i < jsonFiles.length; i++) {
        if (jsonFiles[i].replace(".json", "") !== svgFiles[i].replace(".svg", "")) {
            pyodide.FS.rmdir("Solutions");
            throw new Error("Files did not match, Solutions cleared please try again");
        }
        display_step(pyodide, "Solutions/" + jsonFiles[i], "Solutions/" + svgFiles[i]);
    }

    MathJax.typeset();
}
