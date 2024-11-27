
class PackageManager {

    constructor() {
        if (PackageManager.instance) {
            return PackageManager.instance;
        }
        else {
            PackageManager.instance = this;
            return PackageManager.instance
        }
    }

    static async getInstance(){
        return new PackageManager();
    }

    async initialize(){
        this.isGitHubPage = conf.isGitHubPage
        this.fetchDirectoryListing = this.isGitHubPage ? this.#fetchGitHubDirectoryContents : this.#fetchDirectoryListing
    }

    async doLoadsAndImports(pyodide) {
        await this.loadCircuits(pyodide);
        await this.importPyodidePackages(pyodide);
        await this.importSolverModule(pyodide);
    }

    async loadCircuits(pyodide) {
        let loadCircuits = "loading circuits";
        console.time(loadCircuits);

        //An array buffer containing the zipped circuit files fetched from the server.
        let cirArrBuff = await (await fetch(conf.sourceCircuitPath)).arrayBuffer();
        await pyodide.unpackArchive(cirArrBuff, ".zip");

        state.circuitFiles = pyodide.FS.readdir(`${conf.pyodideCircuitPath}`);
        state.circuitFiles = state.circuitFiles.filter((file) => file !== "." && file !== "..");
        console.timeEnd(loadCircuits);
    }

    async importPyodidePackages(pyodide) {
        await this.load_packages(pyodide, ["sqlite3-1.0.0.zip"]);
        await this.import_packages(pyodide);
    }

    async importSolverModule(pyodide) {
        pyodide.FS.writeFile(conf.pyodideSolvePath, await (await fetch(conf.sourceSolvePath)).text());
        state.solve = await pyodide.pyimport("solve");
    }

    async import_packages(pyodide) {
        let packages = ["matplotlib", "numpy", "sympy", "networkx", "IPython", "schemdraw", "ordered_set", "lcapy"];
        let progressBarContainer = document.getElementById("pgr-bar-container");
        // set the bar to 40% because we already did some stuff, just a ruff estimation
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
        document.title = "Circuit Selection - Ready";
        _paq.push(['setDocumentTitle', document.title]);
        _paq.push(['trackPageView']);
        state.pyodideReady = true;
        state.pyodideLoading = false;
    }

    async load_packages(pyodide, optAddNames) {
        setPgrBarTo(0);

        let packageAddress = conf.sourcePackageDir;
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
            let pkgArrBuff = await (await fetch(conf.sourcePackageDir + packageName)).arrayBuffer();
            let packageExtension = packageName.slice(packageName.lastIndexOf("."), packageName.length);
            await pyodide.unpackArchive(pkgArrBuff, packageExtension);

            updateProgress();
        });

        await Promise.all(packagePromises);
        console.log("Installed:" + packages);
    }

    async #fetchDirectoryListing(path, extension = "") {
        try {
            const response = await fetch(path);
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

    async #fetchGitHubDirectoryContents(path, extension) {

        const url = `https://api.github.com/repos/${conf.gitHubUser}${conf.gitHubProject}contents/${path}`;
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
}