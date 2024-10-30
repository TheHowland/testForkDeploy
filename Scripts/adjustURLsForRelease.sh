#!/bin/sh

# Define variables
localURL="http://local.url"               # Set your local URL
releaseURL="http://release.url"           # Set your release URL

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

# Update URL in main.js
mainJsPath="./src/scripts/main.js"
if [ -f $mainJsPath ]; then
    toReplace='let serverAddress = "'$localURL'"'
    replaceString='let serverAddress = "'$releaseURL'"'
    sed -i "s|$toReplace|$replaceString|g" "$mainJsPath"
    echo "Updated URL in main.js"
else
    echo "main.js not found" >&2
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