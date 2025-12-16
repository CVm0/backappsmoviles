package com.tuapp.data.models

import com.google.gson.annotations.SerializedName

/**
 * Modelo de Pedido
 */
data class Pedido(
    @SerializedName("_id")
    val id: String? = null,
    
    @SerializedName("usuario")
    val usuario: Usuario,
    
    @SerializedName("items")
    val items: List<ItemPedido>,
    
    @SerializedName("total")
    val total: Double,
    
    @SerializedName("estado")
    val estado: String,  // "pendiente", "confirmado", "enviado", "entregado", "cancelado"
    
    @SerializedName("direccionEnvio")
    val direccionEnvio: String,
    
    @SerializedName("createdAt")
    val createdAt: String? = null,
    
    @SerializedName("updatedAt")
    val updatedAt: String? = null
)

/**
 * Item individual del pedido
 */
data class ItemPedido(
    @SerializedName("producto")
    val producto: Producto,
    
    @SerializedName("cantidad")
    val cantidad: Int,
    
    @SerializedName("precioUnitario")
    val precioUnitario: Double
)

/**
 * Request para crear pedido
 */
data class CrearPedidoRequest(
    @SerializedName("usuarioId")
    val usuarioId: String,
    
    @SerializedName("items")
    val items: List<ItemPedidoRequest>,
    
    @SerializedName("direccionEnvio")
    val direccionEnvio: String
)

data class ItemPedidoRequest(
    @SerializedName("productoId")
    val productoId: String,
    
    @SerializedName("cantidad")
    val cantidad: Int
)
