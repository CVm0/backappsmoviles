# 🚀 Despliegue en la Nube (Producción)

Esta guía explica cómo desplegar tu backend en diferentes plataformas cloud para que sea accesible desde cualquier lugar.

## ☁️ Opciones de Despliegue

### 1. Railway (Recomendado - Más Fácil)

Railway es una plataforma moderna que facilita el despliegue de aplicaciones Node.js.

#### Pasos:

1. **Crear cuenta en Railway:** https://railway.app

2. **Instalar Railway CLI:**
   ```powershell
   npm install -g @railway/cli
   ```

3. **Login:**
   ```powershell
   railway login
   ```

4. **Desplegar cada microservicio:**
   ```powershell
   # Usuarios Service
   cd usuarios-service
   railway init
   railway up
   
   # Productos Service
   cd ../productos-service
   railway init
   railway up
   
   # Pedidos Service
   cd ../pedidos-service
   railway init
   railway up
   ```

5. **Configurar variables de entorno en Railway Dashboard**

6. **Obtener las URLs públicas** (Railway las genera automáticamente)

**Costo:** Gratis para comenzar, luego ~$5/mes por servicio

---

### 2. Render

Render es otra excelente opción con plan gratuito.

#### Pasos:

1. **Crear cuenta:** https://render.com

2. **Crear un nuevo Web Service para cada microservicio**

3. **Conectar tu repositorio de GitHub**

4. **Configurar Build Command:**
   ```bash
   npm install
   ```

5. **Configurar Start Command:**
   ```bash
   npm start
   ```

6. **Agregar variables de entorno en el dashboard**

**Costo:** Plan gratuito disponible (con limitaciones), luego $7/mes por servicio

---

### 3. Heroku

Plataforma clásica, muy confiable.

#### Pasos:

1. **Instalar Heroku CLI:**
   ```powershell
   npm install -g heroku
   ```

2. **Login:**
   ```powershell
   heroku login
   ```

3. **Crear apps para cada microservicio:**
   ```powershell
   # Usuarios
   cd usuarios-service
   heroku create tu-app-usuarios
   git init
   heroku git:remote -a tu-app-usuarios
   
   # Productos
   cd ../productos-service
   heroku create tu-app-productos
   git init
   heroku git:remote -a tu-app-productos
   
   # Pedidos
   cd ../pedidos-service
   heroku create tu-app-pedidos
   git init
   heroku git:remote -a tu-app-pedidos
   ```

4. **Configurar variables de entorno:**
   ```powershell
   heroku config:set MONGODB_URI=tu_uri_mongodb
   heroku config:set JWT_SECRET=tu_secret
   ```

5. **Desplegar:**
   ```powershell
   git add .
   git commit -m "Deploy"
   git push heroku main
   ```

**Costo:** ~$7/mes por dyno después del plan gratuito

---

### 4. Microsoft Azure (App Service)

Ideal si ya usas servicios de Microsoft.

#### Pasos:

1. **Instalar Azure CLI:**
   ```powershell
   winget install Microsoft.AzureCLI
   ```

2. **Login:**
   ```powershell
   az login
   ```

3. **Crear Resource Group:**
   ```powershell
   az group create --name BackendAppMovil --location eastus
   ```

4. **Crear App Service Plan:**
   ```powershell
   az appservice plan create --name BackendPlan --resource-group BackendAppMovil --sku B1 --is-linux
   ```

5. **Crear Web Apps:**
   ```powershell
   az webapp create --resource-group BackendAppMovil --plan BackendPlan --name usuarios-api-app --runtime "NODE|18-lts"
   az webapp create --resource-group BackendAppMovil --plan BackendPlan --name productos-api-app --runtime "NODE|18-lts"
   az webapp create --resource-group BackendAppMovil --plan BackendPlan --name pedidos-api-app --runtime "NODE|18-lts"
   ```

6. **Configurar variables:**
   ```powershell
   az webapp config appsettings set --resource-group BackendAppMovil --name usuarios-api-app --settings MONGODB_URI="tu_uri"
   ```

7. **Desplegar:**
   ```powershell
   cd usuarios-service
   az webapp up --name usuarios-api-app --resource-group BackendAppMovil
   ```

**Costo:** Desde $13/mes (B1 tier)

---

### 5. AWS (Elastic Beanstalk)

Para escalabilidad empresarial.

#### Pasos:

1. **Instalar EB CLI:**
   ```powershell
   pip install awsebcli
   ```

2. **Inicializar:**
   ```powershell
   cd usuarios-service
   eb init -p node.js-18 tu-app-usuarios
   ```

3. **Crear entorno:**
   ```powershell
   eb create usuarios-env
   ```

4. **Configurar variables:**
   ```powershell
   eb setenv MONGODB_URI=tu_uri JWT_SECRET=tu_secret
   ```

5. **Desplegar:**
   ```powershell
   eb deploy
   ```

**Costo:** Variable, desde $12/mes

---

## 🗄️ MongoDB en la Nube

### MongoDB Atlas (Recomendado)

1. **Crear cuenta:** https://www.mongodb.com/cloud/atlas

2. **Crear un cluster gratuito** (512MB gratis)

3. **Configurar Network Access:**
   - Ir a "Network Access"
   - Click "Add IP Address"
   - Seleccionar "Allow Access from Anywhere" (0.0.0.0/0) para desarrollo
   - Para producción, agregar solo las IPs de tus servidores

4. **Crear Database User:**
   - Ir a "Database Access"
   - Crear usuario con contraseña

5. **Obtener Connection String:**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/nombre_db?retryWrites=true&w=majority
   ```

6. **Actualizar .env en cada servicio:**
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/usuarios_db
   ```

**Costo:** Gratis hasta 512MB, luego desde $9/mes

---

## 🔒 Configuración de Seguridad para Producción

### 1. Variables de Entorno

Nunca expongas credenciales en el código. Usa las configuraciones de variables de entorno de cada plataforma.

### 2. CORS

Actualiza la configuración de CORS en cada microservicio:

```javascript
// src/index.js
const corsOptions = {
  origin: [
    'https://tu-dominio.com',
    'http://localhost:3000' // solo para desarrollo
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

### 3. HTTPS

Todas las plataformas mencionadas proveen HTTPS automáticamente.

### 4. Rate Limiting

Instala y configura `express-rate-limit`:

```powershell
npm install express-rate-limit
```

```javascript
// src/index.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});

app.use('/api/', limiter);
```

### 5. Helmet

Para headers de seguridad:

```powershell
npm install helmet
```

```javascript
// src/index.js
const helmet = require('helmet');
app.use(helmet());
```

---

## 📱 Actualizar App Kotlin

Una vez desplegado, actualiza las URLs en tu app:

```kotlin
// ApiConfig.kt
object ApiConfig {
    // URLs de producción
    private const val BASE_URL_USUARIOS = "https://usuarios-api-app.azurewebsites.net/"
    private const val BASE_URL_PRODUCTOS = "https://productos-api-app.azurewebsites.net/"
    private const val BASE_URL_PEDIDOS = "https://pedidos-api-app.azurewebsites.net/"
    
    // También puedes usar una variable de entorno en Android
    private const val BASE_URL_USUARIOS = BuildConfig.API_URL_USUARIOS
}
```

En `build.gradle.kts`:

```kotlin
android {
    buildTypes {
        debug {
            buildConfigField("String", "API_URL_USUARIOS", "\"http://192.168.1.100:3001/\"")
        }
        release {
            buildConfigField("String", "API_URL_USUARIOS", "\"https://usuarios-api.com/\"")
        }
    }
}
```

---

## 🔍 Monitoreo

### Railway / Render
- Dashboard integrado con logs en tiempo real
- Métricas de CPU y memoria

### Heroku
```powershell
heroku logs --tail -a tu-app-usuarios
```

### Azure
```powershell
az webapp log tail --name usuarios-api-app --resource-group BackendAppMovil
```

### AWS
```powershell
eb logs
```

---

## 💰 Comparativa de Costos (mensual)

| Plataforma | Plan Gratuito | Costo Inicial | Escalable |
|------------|---------------|---------------|-----------|
| Railway    | ✅ Sí        | $5/servicio   | ✅        |
| Render     | ✅ Sí        | $7/servicio   | ✅        |
| Heroku     | ❌ No        | $7/servicio   | ✅        |
| Azure      | ❌ No        | $13/servicio  | ✅✅      |
| AWS EB     | ✅ 12 meses  | $12/servicio  | ✅✅✅    |

**Recomendación:** 
- **Para empezar:** Railway o Render (gratis)
- **Para producción pequeña:** Railway ($15/mes por los 3 servicios)
- **Para producción media/grande:** Azure o AWS

---

## 🎯 Checklist de Despliegue

- [ ] MongoDB Atlas configurado
- [ ] Variables de entorno configuradas
- [ ] CORS configurado correctamente
- [ ] Rate limiting activado
- [ ] Helmet instalado
- [ ] Logs configurados
- [ ] URLs actualizadas en app móvil
- [ ] Tests de endpoints funcionando
- [ ] Monitoreo configurado
- [ ] Backup de base de datos configurado

---

## 📚 Recursos Adicionales

- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Heroku Node.js Guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Azure App Service](https://docs.microsoft.com/azure/app-service/)
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk/)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/)
