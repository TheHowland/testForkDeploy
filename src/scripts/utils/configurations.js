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

        this.sourceCircuitPath = conf.sourceCircuitPath;
        this.sourceSolvePath = conf.sourceSolvePath;
        this.sourcePackageDir = conf.sourcePackageDir;
        this.gitHubUser = conf.gitHubUser;
        this.gitHubProject = conf.gitHubProject;

        this.pyodideCircuitPath = conf.pyodideCircuitPath;
        this.pyodideSolutionsPath = conf.pyodideSolutionsPath;
        this.pyodideSolvePath = conf.pyodideSolvePath;
    }

    static async loadConf() {
        let loc = window.location.pathname;
        let dir = loc.substring(0, loc.lastIndexOf('/'));
        let test = await fetch("/src/conf/conf.json");
        let conf = await test.json()
        console.log(conf);
        return conf;
    }
}