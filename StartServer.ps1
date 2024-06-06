Write-Output "--- Pyodide-Core server with GZIP compression ---"
Set-Location $(Split-Path -Path $MyInvocation.MyCommand.Path -Parent)
python .\GzipSimplePythonHttpServer.py