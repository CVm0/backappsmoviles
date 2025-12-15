#!/bin/bash

# Script para iniciar todos los microservicios en Linux/Mac

echo "🚀 Iniciando microservicios..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor, instala Node.js primero."
    exit 1
fi

# Verificar si MongoDB está corriendo
echo "📦 Verificando MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB no está corriendo. Por favor, inicia MongoDB primero."
    exit 1
fi

ROOT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Función para iniciar un servicio
start_service() {
    local service_name=$1
    local service_path=$2
    
    echo "▶️  Iniciando $service_name..."
    
    cd "$ROOT_PATH/$service_path" || exit
    
    # Verificar si existe .env, si no, copiar desde .env.example
    if [ ! -f .env ] && [ -f .env.example ]; then
        cp .env.example .env
        echo "📝 Creado archivo .env desde .env.example"
    fi
    
    # Verificar si node_modules existe
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependencias para $service_name..."
        npm install
    fi
    
    # Iniciar el servicio en segundo plano
    npm run dev &
    
    cd "$ROOT_PATH" || exit
    sleep 2
}

# Iniciar cada microservicio
start_service "Usuarios Service" "usuarios-service"
start_service "Productos Service" "productos-service"
start_service "Pedidos Service" "pedidos-service"

echo ""
echo "✅ Todos los microservicios están corriendo..."
echo ""
echo "Servicios:"
echo "  👤 Usuarios:  http://localhost:3001"
echo "  📦 Productos: http://localhost:3002"
echo "  🛒 Pedidos:   http://localhost:3003"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios."

# Esperar a que el usuario presione Ctrl+C
wait
