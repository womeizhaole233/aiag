$port = 5002
$url = "http://localhost:$port"
$projDir = "D:\AI\aiag\baisha_chenyan"

$existing = netstat -ano | Select-String ":$port\s" | Select-String "LISTENING"
if ($existing) {
    Write-Host "端口 $port 已被占用，游戏可能已在运行。" -ForegroundColor Yellow
    Write-Host "访问: $url/game" -ForegroundColor Cyan
    Start-Process "$url/game"
    exit
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projDir'; python app.py"
Start-Sleep -Seconds 3

Write-Host "白沙尘烟 · 游戏已启动" -ForegroundColor Green
Write-Host "  游戏页面:   $url/game" -ForegroundColor Cyan
Write-Host "  后台编辑器: $url/admin/bg" -ForegroundColor Cyan
Start-Process "$url/game"
