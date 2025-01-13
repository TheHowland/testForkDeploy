class Configurations {
    constructor() {
        if (Configurations.instance) {
            return Configurations.instance;
        }
        else {
            Configurations.instance = this;
            return Configurations.instance
        }
    }

    static async getInstance(){
        return new Configurations();
    }

    async initialize(){
        this.subdomain = window.location.hostname.split('.').slice(0, -2).join('.');
        this.secondLevelDomain = window.location.hostname.replace("\.(io|org)","").split(".")[1] || "";
        this.srcRootPath = window.location.pathname;
        if (this.srcRootPath !== null && this.srcRootPath.endsWith("index.html")) {
            this.srcRootPath = this.srcRootPath.replace("index.html", "");
            if (!this.srcRootPath.endsWith("/")) {
                this.srcRootPath += "/";
            }
        }

        let conf = await this.loadConf()

        this.sourceCircuitPath = this.gitHubProject + conf.sourceCircuitPath;
        this.sourceSolvePath = this.gitHubProject + conf.sourceSolvePath;
        this.sourcePackageDir = conf.sourcePackageDir;

        this.pyodideCircuitPath = conf.pyodideCircuitPath;
        this.pyodideSolutionsPath = conf.pyodideSolutionsPath;
        this.pyodideSolvePath = "/" + conf.pyodideSolvePath;
    }

    async loadConf() {
        let test = await fetch(this.srcRootPath + "src/conf/conf.json");
        return await test.json();
    }

    get isGitHubPage(){
        return this.secondLevelDomain === "github";
    }

    get gitHubUser() {
        return this.subdomain;
    }

    get gitHubProject() {
        return this.srcRootPath;
    }
}