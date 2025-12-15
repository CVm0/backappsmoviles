# Backend para Aplicación Móvil - Arquitectura de Microservicios

Este proyecto contiene el backend completo para una aplicación móvil, implementado usando una arquitectura de microservicios con Node.js, Express y MongoDB.

## 🏗️ Arquitectura

El backend está dividido en tres microservicios independientes:

1. **Usuarios Service** (Puerto 3001) - Gestión de usuarios y autenticación
2. **Productos Service** (Puerto 3002) - Gestión del catálogo de productos
3. **Pedidos Service** (Puerto 3003) - Gestión de pedidos y órdenes

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- MongoDB (v5.0 o superior)
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd backappsmoviles
```

### 2. Instalar dependencias en cada microservicio

```bash
# Usuarios Service
cd usuarios-service
npm install

# Productos Service
cd ../productos-service
npm install

# Pedidos Service
cd ../pedidos-service
npm install
```

### 3. Configurar variables de entorno

En cada microservicio, copia el archivo `.env.example` a `.env` y configura las variables:

```bash
# En cada carpeta de microservicio
cp .env.example .env
```

Edita cada archivo `.env` con tus configuraciones.

## 🌐 Configuración para Acceso desde Red Local

### Obtener tu IP Local

**En Windows:**
```powershell
ipconfig
# Busca "Dirección IPv4" - Ejemplo: 192.168.1.100
```

**En Linux/Mac:**
```bash
ifconfig
# o
ip addr show
```

### Configurar Firewall (Windows)

Para permitir que dispositivos móviles accedan al backend:

```powershell
# Permitir acceso a los puertos
netsh advfirewall firewall add rule name="Node 3001" dir=in action=allow protocol=TCP localport=3001
netsh advfirewall firewall add rule name="Node 3002" dir=in action=allow protocol=TCP localport=3002
netsh advfirewall firewall add rule name="Node 3003" dir=in action=allow protocol=TCP localport=3003
```

Una vez configurado, los servicios estarán disponibles en:
- `http://TU_IP_LOCAL:3001` - Usuarios
- `http://TU_IP_LOCAL:3002` - Productos
- `http://TU_IP_LOCAL:3003` - Pedidos

**⚠️ IMPORTANTE:** Asegúrate de que tu dispositivo móvil esté conectado a la misma red WiFi que tu computadora.

## 🔧 Configuración de MongoDB

Asegúrate de tener MongoDB corriendo. Puedes usar MongoDB Atlas (cloud) o una instancia local.

### Opción 1: MongoDB Local

```bash
# Instalar MongoDB en Windows
# Descargar desde: https://www.mongodb.com/try/download/community

# Iniciar MongoDB
mongod
```

### Opción 2: MongoDB Atlas (Recomendado)

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster gratuito
3. Obtén tu connection string
4. Actualiza `MONGODB_URI` en cada archivo `.env`

## ▶️ Ejecutar los Microservicios

### Desarrollo (con nodemon)

Abre 3 terminales diferentes:

```bash
# Terminal 1 - Usuarios Service
cd usuarios-service
npm run dev

# Terminal 2 - Productos Service
cd productos-service
npm run dev

# Terminal 3 - Pedidos Service
cd pedidos-service
npm run dev
```

### Producción

```bash
# En cada microservicio
npm start
```

## 📡 API Endpoints

### Usuarios Service (http://localhost:3001)

#### Autenticación
- `POST /api/usuarios/registro` - Registrar nuevo usuario
- `POST /api/usuarios/login` - Iniciar sesión

#### Gestión de Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios (Admin)
- `GET /api/usuarios/perfil/:id` - Obtener perfil de usuario
- `PUT /api/usuarios/perfil/:id` - Actualizar perfil
- `DELETE /api/usuarios/:id` - Eliminar usuario (Admin)

### Productos Service (http://localhost:3002)

- `GET /api/productos` - Obtener todos los productos (con paginación y filtros)
- `GET /api/productos/:id` - Obtener producto por ID
- `GET /api/productos/categoria/:categoria` - Obtener productos por categoría
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/:id` - Actualizar producto (Admin)
- `DELETE /api/productos/:id` - Eliminar producto (Admin)
- `PATCH /api/productos/:id/stock` - Actualizar stock

### Pedidos Service (http://localhost:3003)

- `POST /api/pedidos` - Crear nuevo pedido
- `GET /api/pedidos` - Obtener todos los pedidos (con paginación)
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `GET /api/pedidos/usuario/:usuarioId` - Obtener pedidos de un usuario
- `PATCH /api/pedidos/:id/estado` - Actualizar estado del pedido (Admin)
- `PATCH /api/pedidos/:id/cancelar` - Cancelar pedido
- `GET /api/pedidos/estadisticas/resumen` - Obtener estadísticas (Admin)

## 📝 Ejemplos de Uso

### Registrar un Usuario

```bash
curl -X POST http://localhost:3001/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "password": "123456",
    "telefono": "555-1234"
  }'
```

### Crear un Producto

```bash
curl -X POST http://localhost:3002/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "iPhone 15",
    "descripcion": "Último modelo de iPhone",
    "precio": 999.99,
    "categoria": "Electrónica",
    "stock": 50,
    "marca": "Apple"
  }'
```

### Crear un Pedido

```bash
curl -X POST http://localhost:3003/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "user_id_here",
    "productos": [
      {
        "productoId": "product_id_here",
        "cantidad": 2
      }
    ],
    "direccionEntrega": {
      "calle": "Calle Principal 123",
      "ciudad": "Ciudad",
      "estado": "Estado",
      "codigoPostal": "12345",
      "pais": "País"
    },
    "metodoPago": "tarjeta"
  }'
```

## 🔒 Seguridad

- Las contraseñas se encriptan usando bcrypt
- Se utiliza JWT para autenticación
- Variables sensibles se almacenan en archivos `.env`
- CORS habilitado para conexiones desde aplicaciones móviles

## 🧪 Testing

```bash
# En cada microservicio
npm test
```

## 📦 Estructura del Proyecto

```
backappsmoviles/
├── usuarios-service/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── usuarios.controller.js
│   │   ├── models/
│   │   │   └── Usuario.js
│   │   ├── routes/
│   │   │   └── usuarios.routes.js
│   │   └── index.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── productos-service/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── pedidos-service/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
└── README.md
```

## 🚧 Próximas Mejoras

- [ ] Implementar middleware de autenticación JWT
- [ ] Agregar validación de datos con express-validator
- [ ] Implementar rate limiting
- [ ] Agregar logs centralizados
- [ ] Implementar caché con Redis
- [ ] Agregar documentación con Swagger
- [ ] Implementar tests unitarios y de integración
- [ ] Agregar CI/CD pipeline
- [ ] Implementar API Gateway

## 📄 Licencia

ISC

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## � Integración con Aplicación Móvil (Kotlin/Android)

Para integrar este backend con tu aplicación Android en Kotlin, consulta la guía completa en:
**[KOTLIN_INTEGRATION.md](KOTLIN_INTEGRATION.md)**

La guía incluye:
- ✅ Configuración de Retrofit y dependencias
- ✅ Modelos de datos Kotlin
- ✅ Interfaces de API Service
- ✅ Repository Pattern y ViewModels
- ✅ Gestión de tokens JWT
- ✅ Ejemplos de código completos
- ✅ Troubleshooting para conexión desde dispositivos móviles

### URLs para tu App Móvil

Reemplaza `192.168.1.100` con tu IP local real:

```kotlin
// ApiConfig.kt
private const val BASE_URL_USUARIOS = "http://192.168.1.100:3001/"
private const val BASE_URL_PRODUCTOS = "http://192.168.1.100:3002/"
private const val BASE_URL_PEDIDOS = "http://192.168.1.100:3003/"

// Si usas emulador de Android Studio:
private const val BASE_URL_USUARIOS = "http://10.0.2.2:3001/"
```

## �📞 Soporte

Para preguntas o soporte, por favor contacta a [tu-email@example.com]
