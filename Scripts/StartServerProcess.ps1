$curDir = Get-Location
Set-Location $PSScriptRoot

if (Test-Path "server.pid") {
    $filePid = Get-Content "server.pid"
    try {
        Get-Process -Id $filePid -ErrorAction Stop | Out-Null
        Write-Output "Server is running with PID $filePid"
    } catch {
        Write-Output "Server with PID $filePid is not running, deleting file"
        Remove-Item "server.pid"
        $serverProcess = Start-Process .\StartServer.ps1 -PassThru
        $serverProcess.Id | Out-File -FilePath "server.pid"
    }
} else {
    $serverProcess = Start-Process .\StartServer.ps1 -PassThru
    $serverProcess.Id | Out-File -FilePath "server.pid"
}

Set-Location $curDir
