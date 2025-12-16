package com.tuapp.data.remote.api

import com.tuapp.data.models.*
import retrofit2.Response
import retrofit2.http.*

/**
 * API Service para el microservicio de Usuarios
 */
interface UsuariosApiService {
    
    @POST("api/usuarios/registro")
    suspend fun registro(
        @Body request: RegistroRequest
    ): Response<AuthResponse>
    
    @POST("api/usuarios/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<AuthResponse>
    
    @GET("api/usuarios")
    suspend fun obtenerUsuarios(
        @Header("Authorization") token: String
    ): Response<List<Usuario>>
    
    @GET("api/usuarios/{id}")
    suspend fun obtenerUsuarioPorId(
        @Path("id") id: String,
        @Header("Authorization") token: String
    ): Response<Usuario>
    
    @PUT("api/usuarios/{id}")
    suspend fun actualizarUsuario(
        @Path("id") id: String,
        @Body usuario: Usuario,
        @Header("Authorization") token: String
    ): Response<Usuario>
    
    @DELETE("api/usuarios/{id}")
    suspend fun eliminarUsuario(
        @Path("id") id: String,
        @Header("Authorization") token: String
    ): Response<Map<String, String>>
    
    @GET("health")
    suspend fun healthCheck(): Response<Map<String, String>>
}
