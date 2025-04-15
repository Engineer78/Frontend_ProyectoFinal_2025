import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Cambiar si tu API tiene otra URL base
});

// ----------------------
// **Endpoints para Categorías**
// ----------------------

// Obtener categoría por nombre
export const getCategoriaPorNombre = (nombre) => api.get(`/categorias/nombre/${nombre}`);

// Obtener categoría por ID
export const getCategoriaPorId = (id) => api.get(`/categorias/id/${id}`);

// Crear una nueva categoría
export const crearCategoria = (datosCategoria) => api.post('/categorias', datosCategoria);

// Actualizar una categoría
export const actualizarCategoria = (id, datosActualizados) =>
  api.put(`/categorias/${id}`, datosActualizados);

// Eliminar una categoría
export const eliminarCategoria = (id) => api.delete(`/categorias/${id}`);

// ----------------------
// **Endpoints para Proveedores**
// ----------------------

// Obtener proveedor por nit
export const getProveedorPorNit = (nit) => api.get(`/proveedores/nit/${nit}`);

// Obtener proveedor por nombre
export const getProveedorPorNombre = (nombre) => api.get(`/proveedores/nombre/${nombre}`);

// Obtener proveedor por ID
export const getProveedorPorId = (id) => api.get(`/proveedores/${id}`);

// Crear un nuevo proveedor
export const crearProveedor = (datosProveedor) => api.post('/proveedores', datosProveedor);

// Actualizar un proveedor
export const actualizarProveedor = (id, datosActualizados) =>
  api.put(`/proveedores/${id}`, datosActualizados);

// Eliminar un proveedor
export const eliminarProveedor = (id) => api.delete(`/proveedores/${id}`);

// ----------------------
// **Endpoints para Productos**
// ----------------------

// Obtener producto por código
export const getProductoPorCodigo = (codigo) => api.get(`/productos/codigo/${codigo}`);

// Obtener producto por nombre
export const getProductoPorNombre = (nombre) => api.get(`/productos/nombre/${nombre}`);

// Obtener producto por ID
export const getProductoPorId = (id) => api.get(`/productos/id/${id}`);

// Crear un nuevo producto
export const crearProducto = (datosProducto) => api.post('/productos', datosProducto);

// Actualizar un producto
export const actualizarProducto = (id, datosActualizados) =>
  api.put(`/productos/${id}`, datosActualizados);

// Eliminar un producto
export const eliminarProducto = (id) => api.delete(`/productos/${id}`);
