# 📱 Integración Kotlin - Backend Microservicios

## 🚀 Configuración Rápida

### 1. Agrega las dependencias a tu `build.gradle.kts` (módulo app)

```kotlin
dependencies {
    // Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.11.0")
    
    // Gson
    implementation("com.google.code.gson:gson:2.10.1")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // ViewModel y LiveData
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.6.2")
}
```

### 2. Copia los archivos a tu proyecto Android

```
tu-proyecto-android/
├── app/
│   └── src/
│       └── main/
│           └── java/
│               └── com/tuapp/
│                   ├── data/
│                   │   ├── models/
│                   │   │   ├── Usuario.kt
│                   │   │   ├── Producto.kt
│                   │   │   └── Pedido.kt
│                   │   └── remote/
│                   │       ├── NetworkConfig.kt
│                   │       ├── ApiConfig.kt
│                   │       └── api/
│                   │           ├── UsuariosApiService.kt
│                   │           ├── ProductosApiService.kt
│                   │           └── PedidosApiService.kt
```

### 3. Actualiza `AndroidManifest.xml`

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/Theme.TuApp">
        <!-- No necesitas usesCleartextTraffic porque usas HTTPS -->
    </application>
</manifest>
```

### 4. Actualiza las URLs en `NetworkConfig.kt`

⚠️ **IMPORTANTE**: Obtén el dominio de pedidos-service desde Railway y actualiza:

```kotlin
private const val PEDIDOS_BASE_URL = "https://TU-PEDIDOS-SERVICE.up.railway.app/"
```

---

## 📖 Ejemplos de Uso

### Registro de Usuario

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class RegistroViewModel : ViewModel() {
    
    private val api = ApiConfig.getUsuariosService()
    
    fun registrarUsuario(
        nombre: String,
        apellido: String,
        email: String,
        password: String,
        telefono: String
    ) {
        viewModelScope.launch {
            try {
                val request = RegistroRequest(nombre, apellido, email, password, telefono)
                val response = api.registro(request)
                
                if (response.isSuccessful) {
                    val authResponse = response.body()
                    val token = authResponse?.token
                    val usuario = authResponse?.usuario
                    
                    // Guardar token en SharedPreferences
                    // Navegar a pantalla principal
                    println("✅ Usuario registrado: ${usuario?.nombre}")
                    println("🔑 Token: $token")
                } else {
                    println("❌ Error: ${response.code()}")
                }
            } catch (e: Exception) {
                println("❌ Error de red: ${e.message}")
            }
        }
    }
}
```

### Login de Usuario

```kotlin
class LoginViewModel : ViewModel() {
    
    private val api = ApiConfig.getUsuariosService()
    
    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                val request = LoginRequest(email, password)
                val response = api.login(request)
                
                if (response.isSuccessful) {
                    val authResponse = response.body()
                    val token = authResponse?.token
                    
                    // Guardar token
                    println("✅ Login exitoso")
                    println("🔑 Token: $token")
                } else {
                    println("❌ Credenciales incorrectas")
                }
            } catch (e: Exception) {
                println("❌ Error: ${e.message}")
            }
        }
    }
}
```

### Listar Productos

```kotlin
class ProductosViewModel : ViewModel() {
    
    private val api = ApiConfig.getProductosService()
    
    fun obtenerProductos(pagina: Int = 1, categoria: String? = null) {
        viewModelScope.launch {
            try {
                val response = api.obtenerProductos(
                    pagina = pagina,
                    limite = 20,
                    categoria = categoria
                )
                
                if (response.isSuccessful) {
                    val data = response.body()
                    val productos = data?.productos
                    val total = data?.total
                    
                    println("✅ ${productos?.size} productos obtenidos de $total")
                    productos?.forEach { producto ->
                        println("📦 ${producto.nombre} - $${producto.precio}")
                    }
                }
            } catch (e: Exception) {
                println("❌ Error: ${e.message}")
            }
        }
    }
}
```

### Crear Pedido

```kotlin
class PedidosViewModel : ViewModel() {
    
    private val api = ApiConfig.getPedidosService()
    
    fun crearPedido(
        usuarioId: String,
        items: List<ItemPedidoRequest>,
        direccion: String,
        token: String
    ) {
        viewModelScope.launch {
            try {
                val request = CrearPedidoRequest(usuarioId, items, direccion)
                val response = api.crearPedido(request, "Bearer $token")
                
                if (response.isSuccessful) {
                    val pedido = response.body()
                    println("✅ Pedido creado: ${pedido?.id}")
                    println("💰 Total: $${pedido?.total}")
                    println("📍 Estado: ${pedido?.estado}")
                } else {
                    println("❌ Error: ${response.code()}")
                }
            } catch (e: Exception) {
                println("❌ Error: ${e.message}")
            }
        }
    }
}
```

### Ejemplo de Flujo Completo

```kotlin
// En tu Activity o Fragment
class MainActivity : AppCompatActivity() {
    
    private val registroViewModel: RegistroViewModel by viewModels()
    private val productosViewModel: ProductosViewModel by viewModels()
    private val pedidosViewModel: PedidosViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // 1. Registrar usuario
        registroViewModel.registrarUsuario(
            nombre = "Juan",
            apellido = "Pérez",
            email = "juan@test.com",
            password = "123456",
            telefono = "555-1234"
        )
        
        // 2. Listar productos
        productosViewModel.obtenerProductos(pagina = 1, categoria = "Electrónica")
        
        // 3. Crear pedido (después de login)
        val items = listOf(
            ItemPedidoRequest(productoId = "producto123", cantidad = 2),
            ItemPedidoRequest(productoId = "producto456", cantidad = 1)
        )
        
        pedidosViewModel.crearPedido(
            usuarioId = "usuario123",
            items = items,
            direccion = "Calle 123",
            token = "tu_token_aqui"
        )
    }
}
```

---

## 🔐 Manejo de Autenticación

### Guardar Token en SharedPreferences

```kotlin
class TokenManager(private val context: Context) {
    
    private val prefs = context.getSharedPreferences("auth", Context.MODE_PRIVATE)
    
    fun saveToken(token: String) {
        prefs.edit().putString("token", token).apply()
    }
    
    fun getToken(): String? {
        return prefs.getString("token", null)
    }
    
    fun clearToken() {
        prefs.edit().remove("token").apply()
    }
    
    fun isLoggedIn(): Boolean {
        return getToken() != null
    }
}
```

### Uso con ViewModels

```kotlin
class AuthViewModel(application: Application) : AndroidViewModel(application) {
    
    private val tokenManager = TokenManager(application)
    private val api = ApiConfig.getUsuariosService()
    
    fun login(email: String, password: String) {
        viewModelScope.launch {
            try {
                val response = api.login(LoginRequest(email, password))
                if (response.isSuccessful) {
                    val token = response.body()?.token
                    token?.let { tokenManager.saveToken(it) }
                }
            } catch (e: Exception) {
                // Manejar error
            }
        }
    }
    
    fun logout() {
        tokenManager.clearToken()
    }
}
```

---

## 🔄 Cambiar entre Desarrollo y Producción

### Método 1: Usando NetworkConfig

```kotlin
// En NetworkConfig.kt
private const val USE_PRODUCTION = true  // false para localhost
```

### Método 2: Usando BuildConfig (Recomendado)

En `build.gradle.kts`:

```kotlin
android {
    buildTypes {
        debug {
            buildConfigField("String", "API_USUARIOS_URL", "\"http://192.168.1.100:3001/\"")
            buildConfigField("String", "API_PRODUCTOS_URL", "\"http://192.168.1.100:3002/\"")
            buildConfigField("String", "API_PEDIDOS_URL", "\"http://192.168.1.100:3003/\"")
        }
        release {
            buildConfigField("String", "API_USUARIOS_URL", "\"https://usuarios-service-production-7145.up.railway.app/\"")
            buildConfigField("String", "API_PRODUCTOS_URL", "\"https://productos-service-production.up.railway.app/\"")
            buildConfigField("String", "API_PEDIDOS_URL", "\"https://pedidos-service-production.up.railway.app/\"")
        }
    }
    
    buildFeatures {
        buildConfig = true
    }
}
```

Luego en `NetworkConfig.kt`:

```kotlin
object NetworkConfig {
    fun getUsuariosUrl(): String = BuildConfig.API_USUARIOS_URL
    fun getProductosUrl(): String = BuildConfig.API_PRODUCTOS_URL
    fun getPedidosUrl(): String = BuildConfig.API_PEDIDOS_URL
}
```

---

## 🎯 URLs de tus Servicios

```
Usuarios:  https://usuarios-service-production-7145.up.railway.app/
Productos: https://productos-service-production.up.railway.app/
Pedidos:   https://pedidos-service-production-XXXX.up.railway.app/  ⚠️ Actualiza esto
```

---

## ✅ Checklist de Integración

- [ ] Dependencias agregadas a `build.gradle.kts`
- [ ] Archivos copiados a tu proyecto
- [ ] Permisos de Internet en `AndroidManifest.xml`
- [ ] URL de pedidos-service actualizada en `NetworkConfig.kt`
- [ ] Sync de Gradle exitoso
- [ ] Prueba de registro de usuario
- [ ] Prueba de login
- [ ] Prueba de listado de productos
- [ ] Prueba de creación de pedido
- [ ] Manejo de tokens implementado

---

## 🐛 Troubleshooting

### Error: "Unable to resolve host"
- Verifica permisos de Internet
- Comprueba las URLs en `NetworkConfig.kt`
- Verifica conectividad a internet del dispositivo

### Error 401: Unauthorized
- Verifica que estés enviando el token correctamente: `"Bearer $token"`
- Asegúrate de que el token no haya expirado

### Error 404: Not Found
- Verifica que las rutas de las APIs sean correctas
- Comprueba que los servicios estén desplegados en Railway

### Error de CORS
- No debería ocurrir porque CORS está configurado en el backend
- Si ocurre, verifica que uses `https://` en producción

---

¡Listo! Tu app Kotlin ya puede conectarse a tu backend en Railway 🚀
