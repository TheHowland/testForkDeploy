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
        let conf = await Configurations.loadConf()

        this.subdomain = window.location.hostname.split('.').slice(0, -2).join('.');
        this.secondLevelDomain = window.location.hostname.replace("\.(io|org)","").split(".")[1] || "";
        this.pathName = window.location.pathname;

        this.sourceCircuitPath = this.gitHubProject + conf.sourceCircuitPath;
        this.sourceSolvePath = this.gitHubProject + conf.sourceSolvePath;
        this.sourcePackageDir = conf.sourcePackageDir;

        this.pyodideCircuitPath = conf.pyodideCircuitPath;
        this.pyodideSolutionsPath = conf.pyodideSolutionsPath;
        this.pyodideSolvePath = "/" + conf.pyodideSolvePath;
    }

    static async loadConf() {
        let projectPath = window.location.pathname;
        let test = await fetch(projectPath + "src/conf/conf.json");
        return await test.json();
    }

    get isGitHubPage(){
        return this.secondLevelDomain === "github";
    }

    get gitHubUser() {
        return this.subdomain;
    }

    get gitHubProject() {
        return this.pathName;
    }
}