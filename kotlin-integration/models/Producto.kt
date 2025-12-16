package com.tuapp.data.models

import com.google.gson.annotations.SerializedName

/**
 * Modelo de Producto
 */
data class Producto(
    @SerializedName("_id")
    val id: String? = null,
    
    @SerializedName("nombre")
    val nombre: String,
    
    @SerializedName("descripcion")
    val descripcion: String,
    
    @SerializedName("precio")
    val precio: Double,
    
    @SerializedName("categoria")
    val categoria: String,
    
    @SerializedName("stock")
    val stock: Int,
    
    @SerializedName("imagen")
    val imagen: String? = null,
    
    @SerializedName("activo")
    val activo: Boolean = true,
    
    @SerializedName("createdAt")
    val createdAt: String? = null,
    
    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

/**
 * Response paginada de productos
 */
data class ProductosResponse(
    @SerializedName("productos")
    val productos: List<Producto>,
    
    @SerializedName("total")
    val total: Int,
    
    @SerializedName("pagina")
    val pagina: Int,
    
    @SerializedName("totalPaginas")
    val totalPaginas: Int
)
