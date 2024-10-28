$curDir = Get-Location
Set-Location $PSScriptRoot
if (Test-Path "server.pid"){
    $serverProcessId = Get-Content -Path "server.pid"
    $process = Get-Process -Id $serverProcessId -ErrorAction SilentlyContinue
    $childProcesses = Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $serverProcessId }
    foreach ($child in $childProcesses) {
        Stop-Process -Id $child.ProcessId -Force
    }
    Stop-Process -Id $process.Id
    Remove-Item "server.pid"
}
Set-Location $curDir