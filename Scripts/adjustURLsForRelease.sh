#!/bin/sh

# Define variables
localURL="http://localhost:8000"
releaseURL="https://thehowland.github.io/InskaLE"

# Update URL in index.html
indexPath="./index.html"
if [ -f $indexPath ]; then
    toReplace='<script src="'$localURL'/pyodide.js"></script>'
    replaceString='<script src="'$releaseURL'/pyodide.js"></script>'
    sed -i "s|$toReplace|$replaceString|g" "$indexPath"
    echo "Updated URL in index.html"
else
    echo "index.html not found" >&2
    exit 1
fi

# Update URL in configurations.js
configJsPath="./src/scripts/utils/configurations.js"
if [ -f $configJsPath ]; then
    toReplace='this.serverAddress = "'$localURL'"'
    replaceString='this.serverAddress = "'$releaseURL'"'
    sed -i "s|$toReplace|$replaceString|g" "$configJsPath"
    echo "Updated URL in configurations.js"
else
    echo "configurations.js not found" >&2
    exit 1
fi

# Update fetch directory listing function in loadPackages.js
loadPackagesJsPath="./src/scripts/utils/packageManager.js"
if [ -f $loadPackagesJsPath ]; then
    sed -i 's|fetchDirectoryListing(packageAddress, ".whl");|fetchGitHubDirectoryContents("TheHowland", "InskaLE", "Packages", ".whl");|g' "$loadPackagesJsPath"
    echo "Updated fetch directory listing function in loadPackages.js"
else
    echo "loadPackages.js not found" >&2
    exit 1
fi