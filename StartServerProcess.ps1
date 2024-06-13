$curDir = Get-Location
Set-Location $PSScriptRoot
if (Test-Path "server.pid"){
    try {
        Start-Process ./StopServerProcess.ps1
    }
    catch {
        Write-Output "Process does not exist anymore, delting file"
        Remove-Item "server.pid"
    }
}
$serverProcess = Start-Process .\StartServer.ps1 -PassThru
$serverProcess.Id | Out-File -FilePath "server.pid"
Set-Location $curDir