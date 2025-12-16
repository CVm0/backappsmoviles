package com.tuapp.data.remote.api

import com.tuapp.data.models.CrearPedidoRequest
import com.tuapp.data.models.Pedido
import retrofit2.Response
import retrofit2.http.*

/**
 * API Service para el microservicio de Pedidos
 */
interface PedidosApiService {
    
    @POST("api/pedidos")
    suspend fun crearPedido(
        @Body request: CrearPedidoRequest,
        @Header("Authorization") token: String
    ): Response<Pedido>
    
    @GET("api/pedidos")
    suspend fun obtenerPedidos(
        @Header("Authorization") token: String
    ): Response<List<Pedido>>
    
    @GET("api/pedidos/{id}")
    suspend fun obtenerPedidoPorId(
        @Path("id") id: String,
        @Header("Authorization") token: String
    ): Response<Pedido>
    
    @GET("api/pedidos/usuario/{usuarioId}")
    suspend fun obtenerPedidosPorUsuario(
        @Path("usuarioId") usuarioId: String,
        @Header("Authorization") token: String
    ): Response<List<Pedido>>
    
    @PUT("api/pedidos/{id}/estado")
    suspend fun actualizarEstado(
        @Path("id") id: String,
        @Body estado: Map<String, String>,  // {"estado": "confirmado"}
        @Header("Authorization") token: String
    ): Response<Pedido>
    
    @DELETE("api/pedidos/{id}")
    suspend fun cancelarPedido(
        @Path("id") id: String,
        @Header("Authorization") token: String
    ): Response<Map<String, String>>
    
    @GET("api/pedidos/estadisticas/totales")
    suspend fun obtenerEstadisticas(
        @Header("Authorization") token: String
    ): Response<Map<String, Any>>
    
    @GET("health")
    suspend fun healthCheck(): Response<Map<String, String>>
}
