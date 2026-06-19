$port = 5002

$pids = netstat -ano | Select-String ":$port\s" | Select-String "LISTENING" | ForEach-Object {
    $_ -split '\s+' | Select-Object -Last 1
} | Where-Object { $_ -match '^\d+$' } | Select-Object -Unique

if ($pids) {
    foreach ($p in $pids) {
        taskkill /F /PID $p 2>$null
        Write-Host "已关闭 Flask 进程 (PID: $p)" -ForegroundColor Green
    }
}

# Also kill python processes (Flask reloader may spawn child processes)
Get-Process -Name python -ErrorAction SilentlyContinue | ForEach-Object {
    taskkill /F /PID $_.Id 2>$null
    Write-Host "已关闭 Python 进程 (PID: $($_.Id))" -ForegroundColor Green
}

Write-Host "白沙尘烟 · 游戏已关闭" -ForegroundColor Green
