# Script para iniciar todos los microservicios en Windows

Write-Host "🚀 Iniciando microservicios..." -ForegroundColor Green

# Verificar si Node.js está instalado
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js no está instalado. Por favor, instala Node.js primero." -ForegroundColor Red
    exit 1
}

# Verificar si MongoDB está corriendo
Write-Host "📦 Verificando MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "⚠️  MongoDB no está corriendo. Iniciando MongoDB..." -ForegroundColor Yellow
    Start-Process mongod -WindowStyle Hidden
    Start-Sleep -Seconds 3
}

$rootPath = Split-Path -Parent $PSScriptRoot

# Función para iniciar un servicio
function Start-Service {
    param (
        [string]$serviceName,
        [string]$servicePath
    )
    
    Write-Host "▶️  Iniciando $serviceName..." -ForegroundColor Cyan
    
    $fullPath = Join-Path $rootPath $servicePath
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "❌ No se encontró el directorio: $fullPath" -ForegroundColor Red
        return
    }
    
    # Verificar si existe .env, si no, copiar desde .env.example
    $envFile = Join-Path $fullPath ".env"
    $envExample = Join-Path $fullPath ".env.example"
    
    if (-not (Test-Path $envFile) -and (Test-Path $envExample)) {
        Copy-Item $envExample $envFile
        Write-Host "📝 Creado archivo .env desde .env.example" -ForegroundColor Yellow
    }
    
    # Verificar si node_modules existe
    $nodeModules = Join-Path $fullPath "node_modules"
    if (-not (Test-Path $nodeModules)) {
        Write-Host "📦 Instalando dependencias para $serviceName..." -ForegroundColor Yellow
        Push-Location $fullPath
        npm install
        Pop-Location
    }
    
    # Iniciar el servicio en una nueva ventana
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; npm run dev"
}

# Iniciar cada microservicio
Start-Service -serviceName "Usuarios Service" -servicePath "usuarios-service"
Start-Sleep -Seconds 2

Start-Service -serviceName "Productos Service" -servicePath "productos-service"
Start-Sleep -Seconds 2

Start-Service -serviceName "Pedidos Service" -servicePath "pedidos-service"

Write-Host ""
Write-Host "✅ Todos los microservicios están iniciando..." -ForegroundColor Green
Write-Host ""
Write-Host "Servicios:" -ForegroundColor Cyan
Write-Host "  👤 Usuarios:  http://localhost:3001" -ForegroundColor White
Write-Host "  📦 Productos: http://localhost:3002" -ForegroundColor White
Write-Host "  🛒 Pedidos:   http://localhost:3003" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C en cada ventana para detener los servicios." -ForegroundColor Yellow
