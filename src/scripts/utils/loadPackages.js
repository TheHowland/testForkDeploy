async function load_packages(pyodide, optAddNames) {
    createProgressBar("Loading Pyodide packages, please wait ...");
    updateProgressBar(0);
    let packageAddress = serverAddress + "/Packages/";
    let packages = await fetchDirectoryListing(packageAddress, ".whl");

    if(Array.isArray(optAddNames)){
        for(let i = 0; i < optAddNames.length; i++){
            packages.push(optAddNames[i]);
        }
    }

    let progress = 0;
    const updateProgress = () => {
        progress += 1;
        updateProgressBar(Math.floor((progress / packages.length) * 100));
    };

    let packagePromises = packages.map(async function (packageName) {
        let pkgArrBuff = await (await fetch(serverAddress + "/Packages/" + packageName)).arrayBuffer();
        let packageExtension = packageName.slice(packageName.lastIndexOf("."), packageName.length);
        await pyodide.unpackArchive(pkgArrBuff, packageExtension);
        updateProgress();
    });

    await Promise.all(packagePromises);
    console.log("Installed:" + packages);
    removeProgressBar();
}