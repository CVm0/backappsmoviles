# Cloudinary Configuration Guide

## Configuración de Cloudinary

Para habilitar el upload de imágenes, necesitas configurar Cloudinary:

### 1. Crear cuenta en Cloudinary
1. Ve a https://cloudinary.com/
2. Crea una cuenta gratuita (incluye 25GB de almacenamiento)

### 2. Obtener credenciales
En tu Dashboard de Cloudinary encontrarás:
- **Cloud Name**: tu_cloud_name
- **API Key**: tu_api_key
- **API Secret**: tu_api_secret

### 3. Configurar variables de entorno

#### Para desarrollo local:
Crea o edita `.env` en `productos-service/`:

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

#### Para Railway (Producción):
1. Ve a tu proyecto en Railway
2. Selecciona el servicio `productos-service`
3. Ve a **Variables**
4. Agrega:
   - `CLOUDINARY_CLOUD_NAME` = tu_cloud_name
   - `CLOUDINARY_API_KEY` = tu_api_key  
   - `CLOUDINARY_API_SECRET` = tu_api_secret

### 4. Endpoints disponibles

#### Subir imagen
```
POST /api/productos/upload
Content-Type: multipart/form-data
Body: { imagen: [archivo] }

Response:
{
  "mensaje": "Imagen subida exitosamente",
  "url": "https://res.cloudinary.com/...",
  "public_id": "huertabeja_productos/..."
}
```

#### Eliminar imagen
```
DELETE /api/productos/upload/:public_id
Response: { "mensaje": "Imagen eliminada exitosamente" }
```

### 5. Limitaciones
- Tamaño máximo: 5MB por imagen
- Formatos permitidos: JPEG, JPG, PNG, GIF, WEBP
- Imágenes se optimizan automáticamente (800x800px max, calidad auto)
- Folder: `huertabeja_productos`
