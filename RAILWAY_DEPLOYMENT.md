# 🚂 Guía Completa de Despliegue en Railway

## Paso a Paso para Desplegar los 3 Microservicios

### 📋 Pre-requisitos

1. Cuenta en Railway: https://railway.app (puedes usar tu cuenta de GitHub)
2. Cuenta en MongoDB Atlas: https://mongodb.com/cloud/atlas (gratis)
3. Código subido a GitHub (opcional pero recomendado)

---

## 🗄️ PASO 1: Configurar MongoDB Atlas

### 1.1 Crear Base de Datos en la Nube

1. Ve a https://mongodb.com/cloud/atlas
2. Crea una cuenta o inicia sesión
3. Click en **"Build a Database"**
4. Selecciona **"M0 Free"** (gratis, 512MB)
5. Elige una región cercana (ejemplo: AWS - US East)
6. Click en **"Create"**

### 1.2 Configurar Acceso

1. **Network Access:**
   - En el menú lateral: "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

2. **Database User:**
   - En el menú lateral: "Database Access"
   - Click "Add New Database User"
   - Username: `admin` (o el que prefieras)
   - Password: Genera una contraseña segura o usa la autogenerada
   - **¡GUARDA ESTA CONTRASEÑA!**
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

### 1.3 Obtener Connection Strings

1. Ve a "Database" en el menú lateral
2. Click en **"Connect"** en tu cluster
3. Selecciona **"Connect your application"**
4. Copia el connection string (se verá así):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Crea 3 connection strings** (uno para cada microservicio):
   ```
   mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/usuarios_db?retryWrites=true&w=majority
   
   mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/productos_db?retryWrites=true&w=majority
   
   mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/pedidos_db?retryWrites=true&w=majority
   ```

**⚠️ Importante:** Reemplaza `<password>` con tu contraseña real y `xxxxx` con tu cluster ID.

---

## 🚂 PASO 2: Desplegar en Railway

### 2.1 Subir Código a GitHub (Recomendado)

```powershell
# En la carpeta raíz de backappsmoviles
git init
git add .
git commit -m "Initial commit - Backend microservices"

# Crea un repositorio en GitHub y luego:
git remote add origin https://github.com/TU_USUARIO/backappsmoviles.git
git branch -M main
git push -u origin main
```

### 2.2 Desplegar Servicio de Usuarios

1. Ve a https://railway.app
2. Click en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a tu GitHub
5. Selecciona tu repositorio `backappsmoviles`
6. Railway detectará múltiples servicios, selecciona **"usuarios-service"**
7. Click en el proyecto creado

**Configurar Variables de Entorno:**
1. Click en tu servicio
2. Ve a la pestaña **"Variables"**
3. Agrega las siguientes variables:

```
PORT=3001
HOST=0.0.0.0
MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/usuarios_db?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_muy_segura_y_larga_12345
NODE_ENV=production
```

4. Click en **"Deploy"**

**Obtener URL Pública:**
1. Ve a la pestaña **"Settings"**
2. En **"Networking"** → Click **"Generate Domain"**
3. Se generará algo como: `usuarios-service-production.up.railway.app`
4. **¡GUARDA ESTA URL!** La necesitarás después

### 2.3 Desplegar Servicio de Productos

1. En tu proyecto Railway, click **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Selecciona el mismo repositorio
4. Railway preguntará qué servicio desplegar, selecciona **"productos-service"**

**Configurar Variables:**
```
PORT=3002
HOST=0.0.0.0
MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/productos_db?retryWrites=true&w=majority
NODE_ENV=production
```

**Generar Dominio:**
- Settings → Networking → Generate Domain
- Ejemplo: `productos-service-production.up.railway.app`
- **¡GUARDA ESTA URL!**

### 2.4 Desplegar Servicio de Pedidos

1. En tu proyecto Railway, click **"+ New"**
2. Selecciona **"GitHub Repo"**
3. Selecciona el mismo repositorio
4. Selecciona **"pedidos-service"**

**⚠️ IMPORTANTE - Configurar Variables con URLs de Producción:**

```
PORT=3003
HOST=0.0.0.0
MONGODB_URI=mongodb+srv://admin:TU_PASSWORD@cluster0.xxxxx.mongodb.net/pedidos_db?retryWrites=true&w=majority
NODE_ENV=production
USUARIOS_SERVICE_URL=https://usuarios-service-production.up.railway.app
PRODUCTOS_SERVICE_URL=https://productos-service-production.up.railway.app
```

**⚠️ Cambia las URLs** por las que Railway generó para tus servicios.

**Generar Dominio:**
- Settings → Networking → Generate Domain
- Ejemplo: `pedidos-service-production.up.railway.app`
- **¡GUARDA ESTA URL!**

---

## 🔧 PASO 3: Verificar que Todo Funcione

### 3.1 Probar Health Checks

Abre en tu navegador:

```
https://usuarios-service-production.up.railway.app/health
https://productos-service-production.up.railway.app/health
https://pedidos-service-production.up.railway.app/health
```

Deberías ver algo como:
```json
{
  "status": "OK",
  "service": "Usuarios Service"
}
```

### 3.2 Probar Registro de Usuario

Usa Postman, Thunder Client o curl:

```powershell
curl -X POST https://usuarios-service-production.up.railway.app/api/usuarios/registro `
  -H "Content-Type: application/json" `
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@test.com",
    "password": "123456",
    "telefono": "555-1234"
  }'
```

### 3.3 Ver Logs en Railway

1. Click en cada servicio en Railway
2. Ve a la pestaña **"Deployments"**
3. Click en el deployment activo
4. Verás los logs en tiempo real

---

## 📱 PASO 4: Actualizar App Kotlin

### 4.1 Crear Archivo de Configuración

En tu proyecto Android, crea un archivo para las URLs:

**NetworkConfig.kt**
```kotlin
package com.tuapp.data.remote

object NetworkConfig {
    
    // 🚂 URLs de Producción (Railway)
    private const val USUARIOS_BASE_URL = "https://usuarios-service-production.up.railway.app/"
    private const val PRODUCTOS_BASE_URL = "https://productos-service-production.up.railway.app/"
    private const val PEDIDOS_BASE_URL = "https://pedidos-service-production.up.railway.app/"
    
    // 🏠 URLs de Desarrollo Local
    private const val USUARIOS_BASE_URL_LOCAL = "http://192.168.1.100:3001/"
    private const val PRODUCTOS_BASE_URL_LOCAL = "http://192.168.1.100:3002/"
    private const val PEDIDOS_BASE_URL_LOCAL = "http://192.168.1.100:3003/"
    
    // 🔄 Cambiar entre desarrollo y producción
    private const val USE_PRODUCTION = true // Cambia a false para desarrollo local
    
    fun getUsuariosUrl(): String {
        return if (USE_PRODUCTION) USUARIOS_BASE_URL else USUARIOS_BASE_URL_LOCAL
    }
    
    fun getProductosUrl(): String {
        return if (USE_PRODUCTION) PRODUCTOS_BASE_URL else PRODUCTOS_BASE_URL_LOCAL
    }
    
    fun getPedidosUrl(): String {
        return if (USE_PRODUCTION) PEDIDOS_BASE_URL else PEDIDOS_BASE_URL_LOCAL
    }
}
```

### 4.2 Actualizar ApiConfig.kt

```kotlin
package com.tuapp.data.remote

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiConfig {
    
    private fun getOkHttpClient(): OkHttpClient {
        val loggingInterceptor = HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        }
        
        return OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()
    }
    
    fun getUsuariosService(): UsuariosApiService {
        return Retrofit.Builder()
            .baseUrl(NetworkConfig.getUsuariosUrl())
            .client(getOkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(UsuariosApiService::class.java)
    }
    
    fun getProductosService(): ProductosApiService {
        return Retrofit.Builder()
            .baseUrl(NetworkConfig.getProductosUrl())
            .client(getOkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ProductosApiService::class.java)
    }
    
    fun getPedidosService(): PedidosApiService {
        return Retrofit.Builder()
            .baseUrl(NetworkConfig.getPedidosUrl())
            .client(getOkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(PedidosApiService::class.java)
    }
}
```

### 4.3 AndroidManifest.xml

Como ahora usas HTTPS, puedes quitar `usesCleartextTraffic`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.TuApp">
        <!-- Ya no necesitas usesCleartextTraffic con HTTPS -->
        ...
    </application>
</manifest>
```

---

## 🎯 PASO 5: Usar BuildConfig para Ambientes

### 5.1 Configurar build.gradle.kts

```kotlin
android {
    namespace = "com.tuapp"
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.tuapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    
    buildTypes {
        debug {
            buildConfigField("String", "API_USUARIOS_URL", "\"http://192.168.1.100:3001/\"")
            buildConfigField("String", "API_PRODUCTOS_URL", "\"http://192.168.1.100:3002/\"")
            buildConfigField("String", "API_PEDIDOS_URL", "\"http://192.168.1.100:3003/\"")
        }
        release {
            isMinifyEnabled = true
            buildConfigField("String", "API_USUARIOS_URL", "\"https://usuarios-service-production.up.railway.app/\"")
            buildConfigField("String", "API_PRODUCTOS_URL", "\"https://productos-service-production.up.railway.app/\"")
            buildConfigField("String", "API_PEDIDOS_URL", "\"https://pedidos-service-production.up.railway.app/\"")
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    
    buildFeatures {
        buildConfig = true
    }
}
```

### 5.2 Usar BuildConfig en tu código

```kotlin
object NetworkConfig {
    fun getUsuariosUrl(): String = BuildConfig.API_USUARIOS_URL
    fun getProductosUrl(): String = BuildConfig.API_PRODUCTOS_URL
    fun getPedidosUrl(): String = BuildConfig.API_PEDIDOS_URL
}
```

Ahora cuando compiles en **Debug**, usará localhost. Cuando compiles en **Release**, usará Railway.

---

## 📊 PASO 6: Monitoreo y Mantenimiento

### Ver Logs en Railway

```
1. Entra a railway.app
2. Click en tu proyecto
3. Click en cada servicio
4. Ve a "Deployments"
5. Click en el deployment activo
6. Verás logs en tiempo real
```

### Actualizar el Código

```powershell
# Hacer cambios en tu código local
git add .
git commit -m "Descripción de cambios"
git push origin main

# Railway automáticamente detectará el cambio y redesplegarár
```

### Ver Métricas

En Railway Dashboard para cada servicio:
- **Deployments**: Historial de despliegues
- **Metrics**: CPU, RAM, Network
- **Settings**: Configuración y variables

---

## 💰 Costos de Railway

- **Plan Gratuito**: $5 de crédito gratuito al mes
- **Hobby Plan**: $5/mes por servicio después del crédito
- **Estimado para 3 servicios**: ~$15/mes (después del período gratuito)

### Optimizar Costos

Railway cobra por tiempo de ejecución:
- Considera combinar microservicios si el tráfico es bajo
- Usa el plan gratuito de MongoDB Atlas
- Monitorea el uso en el Dashboard

---

## 🔧 Troubleshooting

### Error: "Application failed to respond"

1. Verifica los logs en Railway
2. Asegúrate de que `PORT` esté configurado correctamente
3. Verifica que `HOST=0.0.0.0`

### Error: "MongoServerError: Authentication failed"

1. Verifica tu contraseña de MongoDB
2. Asegúrate de que la IP 0.0.0.0/0 esté permitida en Network Access
3. Verifica que el usuario tenga permisos

### Error: "Cannot connect to other microservices"

1. Verifica que las URLs en `USUARIOS_SERVICE_URL` y `PRODUCTOS_SERVICE_URL` sean correctas
2. Asegúrate de usar `https://` (no `http://`)
3. Verifica que todos los servicios estén desplegados y funcionando

### La app móvil no puede conectarse

1. Verifica que uses las URLs correctas con `https://`
2. Comprueba los logs en Logcat
3. Verifica que tengas permisos de Internet en AndroidManifest
4. Prueba primero con Postman para asegurarte de que la API funciona

---

## ✅ Checklist Final

- [ ] MongoDB Atlas configurado con acceso 0.0.0.0/0
- [ ] Usuario de MongoDB creado con contraseña guardada
- [ ] 3 connection strings creadas (usuarios, productos, pedidos)
- [ ] Código subido a GitHub
- [ ] Usuarios Service desplegado en Railway con variables configuradas
- [ ] Productos Service desplegado en Railway con variables configuradas
- [ ] Pedidos Service desplegado con URLs de usuarios y productos
- [ ] Dominios generados para los 3 servicios
- [ ] Health checks funcionando
- [ ] Test de registro de usuario exitoso
- [ ] NetworkConfig.kt actualizado en app Kotlin con URLs de producción
- [ ] BuildConfig configurado (opcional pero recomendado)
- [ ] App móvil testeada con las APIs en producción

---

## 🎉 ¡Listo!

Ahora tu backend está en la nube y accesible desde cualquier lugar. Tu app móvil puede conectarse desde cualquier red WiFi o datos móviles.

**URLs finales:**
```
Usuarios:  https://usuarios-service-production.up.railway.app/api/usuarios
Productos: https://productos-service-production.up.railway.app/api/productos
Pedidos:   https://pedidos-service-production.up.railway.app/api/pedidos
```

**Próximos pasos recomendados:**
1. Configurar un dominio personalizado (opcional)
2. Implementar CI/CD con GitHub Actions
3. Agregar tests automatizados
4. Configurar alertas de monitoreo
5. Implementar backup automático de MongoDB
