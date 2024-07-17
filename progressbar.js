function updateProgressBar(percentage) {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = percentage + '%';
    progressBar.textContent = percentage + '%';
}

function removeProgressBar() {
    const container = document.getElementById('progress-container');
    if (container) {
        container.remove();
    }
}

function createProgressBar(infoText) {
    const container = document.createElement('div');
    container.id = 'progress-container';

    const bar = document.createElement('div');
    bar.id = 'progress-bar';
    bar.textContent = '0%';

    container.appendChild(bar);
    document.body.appendChild(container);

    container.style.display = 'block';
}