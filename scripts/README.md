# Scripts de Inicio Rápido

Este directorio contiene scripts para facilitar el inicio y gestión de los microservicios.

## Windows (PowerShell)

### Iniciar todos los servicios

```powershell
.\start-all-services.ps1
```

### Detener todos los servicios

```powershell
# Presiona Ctrl+C en cada terminal
```

## Linux/Mac (Bash)

### Iniciar todos los servicios

```bash
chmod +x start-all-services.sh
./start-all-services.sh
```

## Docker

### Iniciar con Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```
