param (
[string]$commitMessage
)
# server adresses
$localURL = 'http://localhost:8000'
$releaseURL = 'https://thehowland.github.io/InskaLE'



# remeber directory that called the script
$curDir = Get-Location
# set location of skript as current directory
Set-Location $PSScriptRoot

# set folder path where the release shall be copied to (GitHubPage repo, submodule of Inskale project)
$destinationPath = Resolve-Path -Path "..\..\GitHubPageRelease"

# set the patht to the files that shall be copied (Pyodide files)
$sourcePath = Resolve-Path -Path "..\"

# remove all files from destination folder
Get-ChildItem -Path $destinationPath -Exclude '.git' -Recurse | Remove-Item -Recurse -Force
Write-Host "removed all files except .git from destination"

# update Circuits.zip
Set-Location $sourcePath
Compress-Archive -Path ".\Circuits" ".\Circuits.zip" -Force

# copie files from source to destination folder
$excludeList = @(".git", "Circuits", "Scripts", ".idea", "GzipSimplePythonHttpServer.py")
Copy-Item -Path "$sourcePath\*" -Destination $destinationPath -Recurse -Force -Exclude $excludeList
Write-Host "Files copied to source"

# update url in index.html
$indexPath = Join-Path $destinationPath "index.html"
if (Test-Path $indexPath) {
    $toReplace = '<script src="'+$localURL+'/pyodide.js"></script>'
    $replaceString = '<script src="'+$releaseURL+'/pyodide.js"></script>'
    (Get-Content $indexPath) -replace $toReplace, $replaceString  | Set-Content $indexPath
    Write-Host "updated url in index.html"
} else {
    Write-Host "index.html not found" -ForegroundColor Red
    return
}

# update url in main.js
$mainJsPath = Join-Path $destinationPath "src\scripts\main.js"
if (Test-Path $mainJsPath) {
    $toReplace = 'let serverAddress = "'+$localURL+'"'
    $replaceString = 'let serverAddress = "'+$releaseURL+'"'
    (Get-Content $mainJsPath) -replace $toReplace, $replaceString | Set-Content $mainJsPath
    Write-Host "updated url in main.js"
} else {
    Write-Host "main.js not found" -ForegroundColor Red
    return
}

# update fetch directory listing function in loadPackages.js
$loadPackagesJsPath = Join-Path $destinationPath "src\scripts\utils\loadPackages.js"
if (Test-Path $loadPackagesJsPath) {
    (Get-Content $loadPackagesJsPath) -replace 'fetchDirectoryListing\(packageAddress, ".whl"\);', "fetchGitHubDirectoryContents('TheHowland', 'InskaLE', 'Packages', '.whl');"| Set-Content $loadPackagesJsPath
    Write-Host "updated fetch direcotry listing function in loadPackages.js"
} else {
    Write-Host "loadPackages.js not found" -ForegroundColor Red
    return
}

Set-Location $destinationPath

# if no commit message with parameter of skript ask for it
if (-not $commitMessage){
 $commitMessage = Read-Host "Gib eine Commit-Nachricht ein"
}

git pull
git add .
git status
git commit -m $commitMessage
git push

Write-Host "files copied to GitHub Page folder, commited and pushed new site should be online in a few minutes" -ForegroundColor Green

# reset the directory where the skript was called
Set-Location $curDir