package com.tuapp.data.remote.api

import com.tuapp.data.models.Producto
import com.tuapp.data.models.ProductosResponse
import retrofit2.Response
import retrofit2.http.*

/**
 * API Service para el microservicio de Productos
 */
interface ProductosApiService {
    
    @GET("api/productos")
    suspend fun obtenerProductos(
        @Query("pagina") pagina: Int = 1,
        @Query("limite") limite: Int = 10,
        @Query("categoria") categoria: String? = null,
        @Query("buscar") buscar: String? = null
    ): Response<ProductosResponse>
    
    @GET("api/productos/{id}")
    suspend fun obtenerProductoPorId(
        @Path("id") id: String
    ): Response<Producto>
    
    @POST("api/productos")
    suspend fun crearProducto(
        @Body producto: Producto,
        @Header("Authorization") token: String
    ): Response<Producto>
    
    @PUT("api/productos/{id}")
    suspend fun actualizarProducto(
        @Path("id") id: String,
        @Body producto: Producto,
        @Header("Authorization") token: String
    ): Response<Producto>
    
    @DELETE("api/productos/{id}")
    suspend fun eliminarProducto(
        @Path("id") id: String,
        @Header("Authorization") token: String
    ): Response<Map<String, String>>
    
    @GET("api/productos/categoria/{categoria}")
    suspend fun obtenerProductosPorCategoria(
        @Path("categoria") categoria: String,
        @Query("pagina") pagina: Int = 1,
        @Query("limite") limite: Int = 10
    ): Response<ProductosResponse>
    
    @GET("health")
    suspend fun healthCheck(): Response<Map<String, String>>
}
