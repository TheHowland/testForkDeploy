
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

    async doLoadsAndImports() {
        await this.loadCircuits();
        await this.importPyodidePackages();
        await this.importSolverModule();
    }

    async loadCircuits() {
        let loadCircuits = "loading circuits";
        console.time(loadCircuits);

        //An array buffer containing the zipped circuit files fetched from the server.
        let cirArrBuff = await (await fetch(conf.sourceCircuitPath)).arrayBuffer();
        await state.pyodide.unpackArchive(cirArrBuff, ".zip");

        state.circuitFiles = state.pyodide.FS.readdir(`${conf.pyodideCircuitPath}`);
        state.circuitFiles = state.circuitFiles.filter((file) => file !== "." && file !== "..");
        console.timeEnd(loadCircuits);
    }

    async importPyodidePackages() {
        await this.load_packages(["sqlite3-1.0.0.zip"]);
        await this.import_packages();
    }

    async importSolverModule() {
        state.pyodide.FS.writeFile(conf.pyodideSolvePath, await (await fetch(conf.sourceSolvePath)).text());
        state.solve = await state.pyodide.pyimport("solve");
    }

    async import_packages() {
        let packages = ["matplotlib", "numpy", "sympy", "networkx", "IPython", "schemdraw", "ordered_set", "lcapy"];
        let progressBarContainer = document.getElementById("pgr-bar-container");
        // set the bar to 40% because we already did some stuff, just a ruff estimation
        // this will enable us to start the new calculation from a fixed point
        let basePercentage = 30;
        setPgrBarTo(basePercentage);

        let progress = 0;
        for(const packageName of packages){
            await state.pyodide.runPythonAsync("import " + packageName)
            progress += 1;
            console.log("finished:" + packageName)
            let percent = basePercentage + Math.floor((progress / packages.length) * (100 - basePercentage));
            setPgrBarTo(percent);
        }

        console.log("Imported: " + packages);

        progressBarContainer.style.display = "none";
        document.title = "Circuit Selection";
        pushPageViewMatomo("Ready");
        state.pyodideReady = true;
        state.pyodideLoading = false;
    }

    async load_packages(optAddNames) {
        let basePercentage = 10;
        setPgrBarTo(basePercentage);

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
            let percent = basePercentage + Math.floor(((progress / packages.length) * 100) / 5);
            setPgrBarTo(percent);
        };

        let packagePromises = packages.map(async function (packageName) {
            let pkgArrBuff = await (await fetch(conf.sourcePackageDir + packageName)).arrayBuffer();
            let packageExtension = packageName.slice(packageName.lastIndexOf("."), packageName.length);
            await state.pyodide.unpackArchive(pkgArrBuff, packageExtension);

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

        let url = `https://api.github.com/repos/${conf.gitHubUser}${conf.gitHubProject}contents/${path}`;
        if (!(await fetch(url+"/.htaccess")).ok) {
            url = `https://api.github.com/repos/${conf.gitHubUser}${conf.gitHubProject}contents/Pyodide/${path}`;
        }

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