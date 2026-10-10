Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'python.exe' -and $_.CommandLine -like '*verify-production.py*' } | ForEach-Object { Stop-Process -Id $_.ProcessId }
