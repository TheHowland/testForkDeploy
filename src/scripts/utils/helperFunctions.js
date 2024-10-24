/*
Replaces non-alphanumeric characters in a selector string with underscores to ensure it is a valid CSS selector.
 */
function sanitizeSelector(selector) {
    return selector.replace(/[^\w-]/g, '_');
}

function setSvgColorMode(svgData) {
    if (foregroundColor === "white") {
        return svgData.replaceAll("black", "white");
    } else {
        return svgData.replaceAll("white", "black");
    }
}

function setSvgWidthTo(svgData, width) {
    // Search the string: width="dd.ddddpt"
    let match = svgData.match(/width="(\d*.\d*pt)"/);
    let foundWidth = match[1];   // dd.dddd
    return svgData.replace(foundWidth, width);   // replace dd.ddd with width
}

// Displays a temporary message to the user in a message box.
function showMessage(container, message, prio = "warning") {
    const msg = document.createElement('div');
    msg.classList.add("alert");
    msg.classList.add(`alert-${prio}`);
    msg.classList.add("fixed-bottom");
    msg.classList.add("m-5");
    msg.innerHTML = message;
    container.appendChild(msg);
    setTimeout(() => {
        msg.style.display = 'none';
    }, 3000);
}




