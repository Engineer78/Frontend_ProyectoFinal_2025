import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Cambiar si tu API tiene otra URL base
});

// ==================== Módulo Inventario ====================

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


// ==================== Módulo Usuarios ====================

// ---- Perfiles ----

// Listar todos los perfiles
export const listarPerfiles = () => api.get('/perfiles/buscar');

// Obtener perfil por ID
export const obtenerPerfilPorId = (id) => api.get(`/perfiles/${id}`);

// Crear nuevo perfil
export const crearPerfil = (perfilData) => api.post('/perfiles', perfilData);

// Actualizar perfil
export const actualizarPerfil = (id, perfilData) => api.put(`/perfiles/${id}`, perfilData);

// Eliminar perfil
export const eliminarPerfil = (id) => api.delete(`/perfiles/${id}`);

// ---- Roles ----

// Listar todos los roles
export const listarRoles = () => api.get('/roles/buscar');

// Obtener rol por ID
export const obtenerRolPorId = (id) => api.get(`/roles/${id}`);

// Buscar roles por nombre (nombre parcial)
export const buscarRolesPorNombre = (nombre) => api.get(`/roles/buscar/${nombre}`);

// Crear nuevo rol
export const crearRol = (rolData) => api.post('/roles', rolData);

// Actualizar rol
export const actualizarRol = (id, rolData) => api.put(`/roles/${id}`, rolData);

// Eliminar rol
export const eliminarRol = (id) => api.delete(`/roles/${id}`);

// ---- Tipo de Documento ----

// Listar tipos de documento
export const listarTiposDocumento = () => api.get('/tipo-documento');

// Obtener tipo de documento por ID
export const obtenerTipoDocumentoPorId = (id) => api.get(`/tipo-documento/${id}`);

// Crear tipo de documento
export const crearTipoDocumento = (tipoDocumentoData) => api.post('/tipo-documento', tipoDocumentoData);

// Actualizar tipo de documento
export const actualizarTipoDocumento = (id, tipoDocumentoData) => api.put(`/tipo-documento/${id}`, tipoDocumentoData);

// Eliminar tipo de documento
export const eliminarTipoDocumento = (id) => api.delete(`/tipo-documento/${id}`);

// ---- Usuario ----

// Crear nuevo usuario
export const crearUsuario = (usuarioData) => api.post('/usuarios', usuarioData);

// ---- Empleados ----

// Listar empleados
export const listarEmpleados = () => api.get('/empleados');

// Buscar empleado por ID
export const buscarEmpleadoPorId = (id) => api.get(`/empleados/${id}`);

// Buscar empleado por número de documento
export const buscarEmpleadoPorDocumento = (numeroDocumento) => api.get(`/empleados/documento/${numeroDocumento}`);

// Crear nuevo empleado
export const crearEmpleado = (empleadoData) => api.post('/empleados', empleadoData);

// Actualizar empleado por ID
export const actualizarEmpleadoPorId = (id, empleadoData) => api.put(`/empleados/${id}`, empleadoData);

// Actualizar empleado por documento
export const actualizarEmpleadoPorDocumento = (numeroDocumento, empleadoData) => api.put(`/empleados/documento/${numeroDocumento}`, empleadoData);

// Eliminar empleado por ID
export const eliminarEmpleado = (id) => api.delete(`/empleados/${id}`);
