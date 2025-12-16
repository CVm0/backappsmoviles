package com.tuapp.data.remote

/**
 * Configuración de URLs de los microservicios
 * Cambia USE_PRODUCTION = false para usar servidor local
 */
object NetworkConfig {
    
    // 🚂 URLs de Producción (Railway)
    private const val USUARIOS_BASE_URL = "https://usuarios-service-production-7145.up.railway.app/"
    private const val PRODUCTOS_BASE_URL = "https://productos-service-production.up.railway.app/"
    private const val PEDIDOS_BASE_URL = "https://pedidos-service-production.up.railway.app/"  // Actualiza con tu URL real
    
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
