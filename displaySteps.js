/*
Displays the current step of the circuit simplification process using the provided JSON and SVG files.
 */
function display_step(pyodide, jsonFilePath_Z,svgFilePath,jsonFilePath_VC=null) {
    const contentCol = document.getElementById("content-col");


    console.log(jsonFilePath_VC);

    try {
        // Lade die JSON-Datei und logge den Inhalt
        let jsonDataString = pyodide.FS.readFile(jsonFilePath_Z, { encoding: "utf8" });
        const jsonData = JSON.parse(jsonDataString);


        // Instanziiere SolutionObject und SolutionObject_UI
        let data = new SolutionObject(
            jsonData.name1, jsonData.name2, jsonData.newName,
            jsonData.value1, jsonData.value2, jsonData.result,
            jsonData.relation, jsonData.latexEquation
        );

        let data_vc=null;

        if(jsonFilePath_VC != null){
            //Lade UI-JSON-Datei und logge den Inhalt
            let jsonDataString_VC = pyodide.FS.readFile(jsonFilePath_VC, { encoding: "utf8" });
            let jsonData_VC = JSON.parse(jsonDataString_VC);
            data_vc = new SolutionObject_VC(
                jsonData_VC.oldNames, jsonData_VC.names1, jsonData_VC.names2,
                jsonData_VC.oldValues, jsonData_VC.values1, jsonData_VC.values2,
                jsonData_VC.convOldValue, jsonData_VC.convValue1, jsonData_VC.convValue2,
                jsonData_VC.relation, jsonData_VC.equation
            );
        }
        else{
            data_vc = new SolutionObject_VC();
        }

        // Lade die SVG-Datei
        const svgData = pyodide.FS.readFile(svgFilePath, { encoding: "utf8" });

        // Baue das UI auf
        const circuitContainer = document.createElement('div');
        circuitContainer.classList.add('circuit-container');
        circuitContainer.classList.add("row"); // use flexbox property for scaling display sizes
        circuitContainer.classList.add("justify-content-center"); // centers the content
        circuitContainer.classList.add("my-1"); // centers the content


        const svgDiv = document.createElement('div');
        svgDiv.id = "svgDiv";
        svgDiv.classList.add("svg-container");
        svgDiv.classList.add("p-2");
        svgDiv.style.width = "350px";
        svgDiv.style.maxWidth = "350px";  // To make the border limit on tablets and bigger screens
        let whiteSvgData = svgData.replaceAll("black", "white");
        svgDiv.innerHTML = whiteSvgData;


        const sanitizedSvgFilePath = sanitizeSelector(svgFilePath);
        circuitContainer.appendChild(svgDiv);
        contentCol.append(circuitContainer)

        const clickedElementsContainer = document.createElement('div');
        clickedElementsContainer.className = 'clicked-elements-container';
        clickedElementsContainer.id = "clickedElementsContainer";
        clickedElementsContainer.classList.add("text-light");
        clickedElementsContainer.classList.add("text-center");
        clickedElementsContainer.classList.add("py-1");
        clickedElementsContainer.classList.add("mb-5");
        clickedElementsContainer.innerHTML = `<h3>Next elements</h3><ul id="clicked-elements-list-${sanitizedSvgFilePath}"></ul>`;

        //paragraph_Z(data, jsonFilePath_Z, contentCol);

        const pathElements = svgDiv.querySelectorAll('path');
        const filteredPaths = Array.from(pathElements).filter(path => path.getAttribute('class') !== 'na');

        if (filteredPaths.length === 1) {
            const congratsMessage = document.createElement('p');
            congratsMessage.innerHTML = 'Well done, you finished the circuit!';
            clickedElementsContainer.appendChild(congratsMessage);
        }


        contentCol.appendChild(clickedElementsContainer);

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
                        rect.style.pointerEvents = "none";  // to make selecting the element behind it possible
                        rect.style.fill = "#FFC107";
                        rect.style.fillOpacity = "0.3";

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
        MathJax.typeset();


    } catch (error) {
        console.error('Error fetching data:', error);
        contentCol.textContent = 'Error loading content';
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
