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
    svgDiv.querySelectorAll('.bounding-box').forEach(box => box.remove());
    clickedElementsContainer.querySelector('ul').innerHTML = '';
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