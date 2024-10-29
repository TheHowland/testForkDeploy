class PackageManager {
    async fetchDirectoryListing(url, extension = "") {
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

    async fetchGitHubDirectoryContents(owner, repo, path, extension) {
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

    async import_packages(pyodide) {
        let packages = ["matplotlib", "numpy", "sympy", "networkx", "IPython", "schemdraw", "ordered_set", "lcapy"];
        let progressBarContainer = document.getElementById("pgr-bar-container");
        // set the bar to 40% because we already did some stuff
        // this will enable us to start the new calculation from a fixed point
        let basePercentage = 40;
        setPgrBarTo(basePercentage);

        let progress = 0;
        for(const packageName of packages){
            await pyodide.runPythonAsync("import " + packageName)
            progress += 1;
            console.log("finished:" + packageName)
            let percent = basePercentage + Math.floor((progress / packages.length) * (100 - basePercentage));
            setPgrBarTo(percent);
        }

        console.log("Imported: " + packages);

        progressBarContainer.style.display = "none";
        state.pyodideReady = true;
        //enableStartButtonsOnCircuitSelectors();
    }

    async load_packages(pyodide, optAddNames) {
        setPgrBarTo(0);

        let packageAddress = conf.packageDir;
        let packages = await this.fetchDirectoryListing(packageAddress, ".whl");

        if(Array.isArray(optAddNames)){
            for(let i = 0; i < optAddNames.length; i++){
                packages.push(optAddNames[i]);
            }
        }

        let progress = 0;
        const updateProgress = () => {
            progress += 1;
            let percent = Math.floor(((progress / packages.length) * 100) / 3);
            setPgrBarTo(percent);
        };

        let packagePromises = packages.map(async function (packageName) {
            let pkgArrBuff = await (await fetch(conf.packageDir + packageName)).arrayBuffer();
            let packageExtension = packageName.slice(packageName.lastIndexOf("."), packageName.length);
            await pyodide.unpackArchive(pkgArrBuff, packageExtension);

            updateProgress();
        });

        await Promise.all(packagePromises);
        console.log("Installed:" + packages);
    }
}