# 📱 Integración con Kotlin/Android

Esta guía explica cómo conectar tu aplicación Android desarrollada en Kotlin con el backend de microservicios.

## 🌐 Configuración de Red

### Obtener tu IP Local

**En Windows (PowerShell):**
```powershell
ipconfig
# Busca "Dirección IPv4" en tu adaptador de red activo
# Ejemplo: 192.168.1.100
```

**En Linux/Mac:**
```bash
ifconfig
# o
ip addr show
# Busca la IP de tu interfaz de red (normalmente wlan0 o eth0)
```

### URLs del Backend

Una vez que tengas tu IP local, las URLs serán:

```
Usuarios:  http://192.168.1.100:3001/api/usuarios
Productos: http://192.168.1.100:3002/api/productos
Pedidos:   http://192.168.1.100:3003/api/pedidos
```

**⚠️ IMPORTANTE:** Reemplaza `192.168.1.100` con tu IP local real.

## 🔧 Configuración en Kotlin

### 1. Agregar Dependencias (build.gradle.kts)

```kotlin
dependencies {
    // Retrofit para llamadas HTTP
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp para logging (útil para debugging)
    implementation("com.squareup.okhttp3:logging-interceptor:4.11.0")
    
    // Coroutines para operaciones asíncronas
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // ViewModel y LiveData
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.6.2")
}
```

### 2. Permisos de Internet (AndroidManifest.xml)

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Permisos necesarios -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Permitir tráfico HTTP (no solo HTTPS) para desarrollo -->
    <application
        android:usesCleartextTraffic="true"
        ...>
        ...
    </application>
</manifest>
```

### 3. Configuración de Retrofit

**ApiConfig.kt**
```kotlin
package com.tuapp.data.remote

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiConfig {
    // ⚠️ Reemplaza con tu IP local
    private const val BASE_URL_USUARIOS = "http://192.168.1.100:3001/"
    private const val BASE_URL_PRODUCTOS = "http://192.168.1.100:3002/"
    private const val BASE_URL_PEDIDOS = "http://192.168.1.100:3003/"
    
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
            .baseUrl(BASE_URL_USUARIOS)
            .client(getOkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(UsuariosApiService::class.java)
    }
    
    fun getProductosService(): ProductosApiService {
        return Retrofit.Builder()
            .baseUrl(BASE_URL_PRODUCTOS)
            .client(getOkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ProductosApiService::class.java)
    }
    
    fun getPedidosService(): PedidosApiService {
        return Retrofit.Builder()
            .baseUrl(BASE_URL_PEDIDOS)
            .client(getOkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(PedidosApiService::class.java)
    }
}
```

### 4. Modelos de Datos

**Usuario.kt**
```kotlin
package com.tuapp.data.model

import com.google.gson.annotations.SerializedName

data class Usuario(
    @SerializedName("_id")
    val id: String,
    val nombre: String,
    val apellido: String,
    val email: String,
    val telefono: String?,
    val direccion: Direccion?,
    val rol: String,
    val token: String?
)

data class Direccion(
    val calle: String,
    val ciudad: String,
    val estado: String,
    val codigoPostal: String,
    val pais: String
)

data class RegistroRequest(
    val nombre: String,
    val apellido: String,
    val email: String,
    val password: String,
    val telefono: String?,
    val direccion: Direccion?
)

data class LoginRequest(
    val email: String,
    val password: String
)
```

**Producto.kt**
```kotlin
package com.tuapp.data.model

import com.google.gson.annotations.SerializedName

data class Producto(
    @SerializedName("_id")
    val id: String,
    val nombre: String,
    val descripcion: String,
    val precio: Double,
    val categoria: String,
    val stock: Int,
    val imagenes: List<String>?,
    val marca: String?,
    val descuento: Int,
    val disponible: Boolean,
    val valoracion: Valoracion?
)

data class Valoracion(
    val promedio: Double,
    val numeroReviews: Int
)

data class ProductosResponse(
    val productos: List<Producto>,
    val paginaActual: Int,
    val totalPaginas: Int,
    val totalProductos: Int
)
```

**Pedido.kt**
```kotlin
package com.tuapp.data.model

import com.google.gson.annotations.SerializedName

data class Pedido(
    @SerializedName("_id")
    val id: String,
    val usuarioId: String,
    val productos: List<ProductoPedido>,
    val direccionEntrega: Direccion,
    val total: Double,
    val estado: String,
    val metodoPago: String,
    val estadoPago: String,
    val fechaPedido: String,
    val fechaEntregaEstimada: String?
)

data class ProductoPedido(
    val productoId: String,
    val nombre: String,
    val precio: Double,
    val cantidad: Int,
    val subtotal: Double
)

data class CrearPedidoRequest(
    val usuarioId: String,
    val productos: List<ProductoCarrito>,
    val direccionEntrega: Direccion,
    val metodoPago: String,
    val notas: String?
)

data class ProductoCarrito(
    val productoId: String,
    val cantidad: Int
)
```

### 5. Interfaces de API Service

**UsuariosApiService.kt**
```kotlin
package com.tuapp.data.remote

import com.tuapp.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface UsuariosApiService {
    
    @POST("api/usuarios/registro")
    suspend fun registrarUsuario(@Body request: RegistroRequest): Response<Usuario>
    
    @POST("api/usuarios/login")
    suspend fun loginUsuario(@Body request: LoginRequest): Response<Usuario>
    
    @GET("api/usuarios/perfil/{id}")
    suspend fun obtenerPerfil(@Path("id") usuarioId: String): Response<Usuario>
    
    @PUT("api/usuarios/perfil/{id}")
    suspend fun actualizarPerfil(
        @Path("id") usuarioId: String,
        @Body usuario: Usuario
    ): Response<Usuario>
}
```

**ProductosApiService.kt**
```kotlin
package com.tuapp.data.remote

import com.tuapp.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ProductosApiService {
    
    @GET("api/productos")
    suspend fun obtenerProductos(
        @Query("pagina") pagina: Int = 1,
        @Query("limite") limite: Int = 10,
        @Query("categoria") categoria: String? = null,
        @Query("disponible") disponible: Boolean? = null,
        @Query("buscar") buscar: String? = null
    ): Response<ProductosResponse>
    
    @GET("api/productos/{id}")
    suspend fun obtenerProductoPorId(@Path("id") productoId: String): Response<Producto>
    
    @GET("api/productos/categoria/{categoria}")
    suspend fun obtenerProductosPorCategoria(
        @Path("categoria") categoria: String
    ): Response<List<Producto>>
}
```

**PedidosApiService.kt**
```kotlin
package com.tuapp.data.remote

import com.tuapp.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface PedidosApiService {
    
    @POST("api/pedidos")
    suspend fun crearPedido(@Body request: CrearPedidoRequest): Response<Pedido>
    
    @GET("api/pedidos/usuario/{usuarioId}")
    suspend fun obtenerPedidosPorUsuario(
        @Path("usuarioId") usuarioId: String
    ): Response<List<Pedido>>
    
    @GET("api/pedidos/{id}")
    suspend fun obtenerPedidoPorId(@Path("id") pedidoId: String): Response<Pedido>
    
    @PATCH("api/pedidos/{id}/cancelar")
    suspend fun cancelarPedido(
        @Path("id") pedidoId: String,
        @Body motivo: Map<String, String>
    ): Response<Pedido>
}
```

### 6. Repository Pattern (Recomendado)

**UsuariosRepository.kt**
```kotlin
package com.tuapp.data.repository

import com.tuapp.data.model.*
import com.tuapp.data.remote.ApiConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UsuariosRepository {
    
    private val apiService = ApiConfig.getUsuariosService()
    
    suspend fun registrarUsuario(request: RegistroRequest): Result<Usuario> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.registrarUsuario(request)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Error: ${response.code()}"))
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
    
    suspend fun loginUsuario(email: String, password: String): Result<Usuario> {
        return withContext(Dispatchers.IO) {
            try {
                val request = LoginRequest(email, password)
                val response = apiService.loginUsuario(request)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Credenciales inválidas"))
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
    
    suspend fun obtenerPerfil(usuarioId: String): Result<Usuario> {
        return withContext(Dispatchers.IO) {
            try {
                val response = apiService.obtenerPerfil(usuarioId)
                if (response.isSuccessful && response.body() != null) {
                    Result.success(response.body()!!)
                } else {
                    Result.failure(Exception("Error: ${response.code()}"))
                }
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}
```

### 7. ViewModel Example

**LoginViewModel.kt**
```kotlin
package com.tuapp.ui.login

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tuapp.data.model.Usuario
import com.tuapp.data.repository.UsuariosRepository
import kotlinx.coroutines.launch

class LoginViewModel : ViewModel() {
    
    private val repository = UsuariosRepository()
    
    private val _loginResult = MutableLiveData<Result<Usuario>>()
    val loginResult: LiveData<Result<Usuario>> = _loginResult
    
    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading
    
    fun login(email: String, password: String) {
        viewModelScope.launch {
            _isLoading.value = true
            val result = repository.loginUsuario(email, password)
            _loginResult.value = result
            _isLoading.value = false
        }
    }
}
```

### 8. Uso en Activity/Fragment

**LoginActivity.kt**
```kotlin
package com.tuapp.ui.login

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.tuapp.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLoginBinding
    private val viewModel: LoginViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupObservers()
        setupListeners()
    }
    
    private fun setupObservers() {
        viewModel.loginResult.observe(this) { result ->
            result.onSuccess { usuario ->
                // Guardar token y datos del usuario
                Toast.makeText(this, "Bienvenido ${usuario.nombre}", Toast.LENGTH_SHORT).show()
                // Navegar a la pantalla principal
            }
            result.onFailure { error ->
                Toast.makeText(this, "Error: ${error.message}", Toast.LENGTH_SHORT).show()
            }
        }
        
        viewModel.isLoading.observe(this) { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.btnLogin.isEnabled = !isLoading
        }
    }
    
    private fun setupListeners() {
        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString()
            val password = binding.etPassword.text.toString()
            
            if (email.isNotEmpty() && password.isNotEmpty()) {
                viewModel.login(email, password)
            } else {
                Toast.makeText(this, "Completa todos los campos", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
```

## 🔐 Gestión de Token JWT

**SharedPreferences Helper:**

```kotlin
package com.tuapp.utils

import android.content.Context
import android.content.SharedPreferences

class SessionManager(context: Context) {
    
    private val prefs: SharedPreferences = 
        context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
    
    companion object {
        private const val KEY_TOKEN = "auth_token"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USER_NAME = "user_name"
        private const val KEY_USER_EMAIL = "user_email"
    }
    
    fun saveAuthToken(token: String) {
        prefs.edit().putString(KEY_TOKEN, token).apply()
    }
    
    fun getAuthToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }
    
    fun saveUserData(userId: String, name: String, email: String) {
        prefs.edit().apply {
            putString(KEY_USER_ID, userId)
            putString(KEY_USER_NAME, name)
            putString(KEY_USER_EMAIL, email)
            apply()
        }
    }
    
    fun getUserId(): String? {
        return prefs.getString(KEY_USER_ID, null)
    }
    
    fun isLoggedIn(): Boolean {
        return getAuthToken() != null
    }
    
    fun clearSession() {
        prefs.edit().clear().apply()
    }
}
```

## 🧪 Testing de Conectividad

**Función para verificar la conexión:**

```kotlin
package com.tuapp.utils

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL

object NetworkUtils {
    
    suspend fun checkBackendConnection(baseUrl: String): Boolean {
        return withContext(Dispatchers.IO) {
            try {
                val url = URL("$baseUrl/health")
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                connection.connectTimeout = 5000
                connection.readTimeout = 5000
                
                val responseCode = connection.responseCode
                connection.disconnect()
                
                responseCode == 200
            } catch (e: Exception) {
                false
            }
        }
    }
}
```

## ⚠️ Troubleshooting

### Error: "Unable to resolve host" o "Connection refused"

1. **Verifica que el backend esté corriendo:**
   ```powershell
   # En PowerShell
   netstat -an | findstr "3001 3002 3003"
   ```

2. **Verifica que el dispositivo Android esté en la misma red:**
   - El móvil debe estar conectado a la misma WiFi que tu PC
   - Si usas emulador, usa `10.0.2.2` en lugar de tu IP local

3. **Configura el firewall de Windows:**
   ```powershell
   # Permitir puerto 3001
   netsh advfirewall firewall add rule name="Node 3001" dir=in action=allow protocol=TCP localport=3001
   
   # Permitir puerto 3002
   netsh advfirewall firewall add rule name="Node 3002" dir=in action=allow protocol=TCP localport=3002
   
   # Permitir puerto 3003
   netsh advfirewall firewall add rule name="Node 3003" dir=in action=allow protocol=TCP localport=3003
   ```

### Si usas el Emulador de Android Studio:

```kotlin
// En ApiConfig.kt, usa 10.0.2.2 en lugar de tu IP local
private const val BASE_URL_USUARIOS = "http://10.0.2.2:3001/"
private const val BASE_URL_PRODUCTOS = "http://10.0.2.2:3002/"
private const val BASE_URL_PEDIDOS = "http://10.0.2.2:3003/"
```

### Si usas un dispositivo físico:

```kotlin
// En ApiConfig.kt, usa tu IP local real
private const val BASE_URL_USUARIOS = "http://192.168.1.100:3001/" // ⚠️ Cambia esta IP
```

## 📚 Recursos Adicionales

- [Retrofit Documentation](https://square.github.io/retrofit/)
- [Kotlin Coroutines](https://kotlinlang.org/docs/coroutines-overview.html)
- [Android ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [OkHttp](https://square.github.io/okhttp/)

## 🚀 Próximos Pasos

1. Implementar refresh token automático
2. Agregar caché local con Room Database
3. Implementar manejo de errores más robusto
4. Agregar interceptor para agregar automáticamente el token JWT
5. Implementar WorkManager para sincronización en segundo plano
