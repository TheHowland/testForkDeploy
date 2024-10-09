async function fetchDirectoryListing(url, extension = "") {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(response)
            throw new Error('Network response was not ok');
        }
        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const fileLinks = doc.querySelectorAll('a');
        const fileNames = [];
        fileLinks.forEach(link => {
            const fileName = link.getAttribute('href');
            if (fileName && !fileName.endsWith('/')) {
                if (extension === "" || (extension !== "" && fileName.endsWith(extension))) {
                    fileNames.push(fileName);
                }
            }
        });
        return fileNames;
    } catch (error) {
        console.error('Error fetching directory listing:', error);
        return [];
    }
}

async function fetchGitHubDirectoryContents(owner, repo, path, extension) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error fetching GitHub directory contents: ${response.status}`);
        }
        const data = await response.json();
        return data.filter(file => file.name.endsWith(extension)).map(file => file.name);
    } catch (error) {
        console.error('Error fetching GitHub directory contents:', error);
        return [];
    }
}