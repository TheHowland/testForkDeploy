class Configurations {
    constructor() {
        if (Configurations.instance){
            return Configurations.instance;
        }
        else {
            console.log("Access to Configurations before Init")
        }
    }

    static async initialize(){
        let conf = await Configurations.loadConf()

        this.sourceCircuitPath = conf.sourceCircuitPath;
        this.sourceSolvePath = conf.sourceSolvePath;
        this.sourcePackageDir = conf.sourcePackageDir;
        this.gitHubUser = conf.gitHubUser;
        this.gitHubProject = conf.gitHubProject;

        this.pyodideCircuitPath = conf.pyodideCircuitPath;
        this.pyodideSolutionsPath = conf.pyodideSolutionsPath;
        this.pyodideSolvePath = conf.pyodideSolvePath;

        Configurations.instance = this;
    }

    static async loadConf() {
        let test = await fetch("/src/resources/conf/conf.json");
        let conf = await test.json()
        console.log(conf);
        return conf;
    }
}