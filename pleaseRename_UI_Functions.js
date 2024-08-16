function sanitizeSelector(selector) {
    return selector.replace(/[^\w-]/g, '_');
}

function populateCircuitSelector() {
    const circuitSelector = document.getElementById('circuit-selector');
    circuitSelector.innerHTML = '<option value="" disabled selected>Select Circuit</option>';

    circuitFiles.forEach(file => {
        const option = document.createElement('option');
        option.value = file;
        option.text = file.replace('.txt', '');
        circuitSelector.appendChild(option);
    });
}

function resetClickedElements(svgDiv, clickedElementsContainer) {
    const boundingBoxes = svgDiv.querySelectorAll('.bounding-box');
    if (boundingBoxes.length > 0) {
        boundingBoxes.forEach(box => box.remove());
    }

    const clickedElementsList = clickedElementsContainer.querySelector('ul');
    if (clickedElementsList) {
        clickedElementsList.innerHTML = '';
    } else {
        console.warn('clickedElementsContainer ul-Liste nicht gefunden');
    }
    selectedElements = [];
}
function showMessage(message) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}