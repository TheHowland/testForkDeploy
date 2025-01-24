param (
[string]$pythonPath
)
if($pythonPath){
    Set-Alias pythonPath $pythonPath
}
else{
    Set-Alias pythonPath python
    Set-Alias pytest pytest
}

$curDir = Get-Location
Set-Location $PSScriptRoot

pythonPath .\generateSVGFiles.py

Set-Location $curDir