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

        this.gitHubUser = window.location.host.split(".")[0];
        this.gitHubProject = window.location.pathname;

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
        let conf = await test.json()
        console.log(conf);
        return conf;
    }
}