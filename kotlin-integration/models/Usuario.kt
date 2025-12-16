package com.tuapp.data.models

import com.google.gson.annotations.SerializedName

/**
 * Modelo de Usuario
 */
data class Usuario(
    @SerializedName("_id")
    val id: String? = null,
    
    @SerializedName("nombre")
    val nombre: String,
    
    @SerializedName("apellido")
    val apellido: String,
    
    @SerializedName("email")
    val email: String,
    
    @SerializedName("password")
    val password: String? = null,  // No se devuelve en las respuestas
    
    @SerializedName("telefono")
    val telefono: String,
    
    @SerializedName("createdAt")
    val createdAt: String? = null,
    
    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

/**
 * Request para registro de usuario
 */
data class RegistroRequest(
    val nombre: String,
    val apellido: String,
    val email: String,
    val password: String,
    val telefono: String
)

/**
 * Request para login
 */
data class LoginRequest(
    val email: String,
    val password: String
)

/**
 * Response de autenticación
 */
data class AuthResponse(
    @SerializedName("token")
    val token: String,
    
    @SerializedName("usuario")
    val usuario: Usuario
)
