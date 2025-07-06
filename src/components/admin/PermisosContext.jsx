import { createContext, useContext, useState, useEffect } from "react";

// Se crea el contexto de permisos
export const PermisosContext = createContext();

// Hook personalizado para acceder fácil al contexto
export const usePermisos = () => useContext(PermisosContext);

// Componente proveedor
export const PermisosProvider = ({ children }) => {
  const [permisos, setPermisos] = useState([]);

  // Efecto para obtener el token del localStorage y decodificarlo
  // para extraer los permisos
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token obtenido del localStorage:", token); // 👈
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Payload decodificado:", payload); // 👈
        if (payload.permisos) {
          setPermisos(payload.permisos);
        }
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    }
  }, []);

  // Función para verificar si el usuario tiene un permiso específico
  // Recibe una clave que representa el permiso y devuelve true o false
  const tienePermiso = (clave) => {
    const mapa = {
      // 👉 Registro de usuarios
      "usuario:registrar": "CREAR_USUARIO",
      "usuario:consultar": "CONSULTAR_USUARIO",
      "usuario:editar": "ACTUALIZAR_USUARIO",
      "usuario:eliminar": "ELIMINAR_USUARIO",

      // 👉 Tipos de documento
      "tipoDocumento:crear": "CREAR_TIPO_DOCUMENTO",
      "tipoDocumento:consultar": "CONSULTAR_TIPO_DOCUMENTO",
      "tipoDocumento:editar": "ACTUALIZAR_TIPO_DOCUMENTO",

      // 👉 Perfiles (roles/permisos)
      "perfil:crear": "CREAR_PERFIL",
      "perfil:consultar": "CONSULTAR_PERFIL",
      "perfil:editar": "ACTUALIZAR_PERFIL",
      "perfil:eliminar": "ELIMINAR_PERFIL",

      // 👉 Roles
      "rol:consultar": "CONSULTAR_ROL",
      "rol:crear": "CREAR_ROL",
      "rol:editar": "ACTUALIZAR_ROL",

      // 👉 Accesos por módulo
      "modulo:usuarios": "MODULO_USUARIOS",
      "modulo:inventario": "MODULO_INVENTARIO",

      // 👉 Inventario
      "inventario:registrar": "CREAR_PRODUCTO",
      "inventario:consultar": "CONSULTAR_PRODUCTO",
      "inventario:editar": "ACTUALIZAR_PRODUCTO",
      "inventario:eliminar": "ELIMINAR_PRODUCTO",
      "inventario:proveedor": "EDITAR_PROVEEDOR",
      "inventario:categoria": "EDITAR_CATEGORIA",
      "inventario:verMovimientos": "VER_MOVIMIENTOS",

      // 👉 Otros Insignia
      "insignia:verMiPerfil": "VER_MI_PERFIL",
      "insignia:gestionarPermisos": "GESTIONAR_PERMISOS",
      "insignia:verLoQuePuedoHacer": "VER_PERMISOS_ASIGNADOS",
      "insignia:verAcercaDe": "VER_ACERCA_DE",
      "usuario:cambiarContrasena": "CAMBIAR_CONTRASEÑA",
      "manuales:ver": "VER_MANUALES",
      "documentacion:modulos": "MODULOS_INTEGRADOS",
      "documentacion:planPruebas": "PLAN_DE_PRUEBAS",
      "documentacion:casosAmbiente": "CASOS_y_AMBIENTE_PRUEBAS",
      "documentacion:manualTecnico": "MANUAL_TECNICO_DEL_SISTEMA",
      "documentacion:manualUsuario": "MANUAL_DEL_USUARIO",

      // 👉 Backup Base de Datos
      "backup:exportar": "EXPORTAR_BD",
      "backup:importar": "IMPORTAR_BD",
      "backup:gestionar": "GESTIONAR_BASE_DATOS",

    };

    return permisos.includes(mapa[clave]);
  };

  // Mostrar los permisos en la consola para depuración
  console.log("🧾 Manuales visibles:");
  console.log({
    modulos: tienePermiso("documentacion:modulos"),
    planPruebas: tienePermiso("documentacion:planPruebas"),
    casosAmbiente: tienePermiso("documentacion:casosAmbiente"),
    manualTecnico: tienePermiso("documentacion:manualTecnico"),
    manualUsuario: tienePermiso("documentacion:manualUsuario"),
  });

  // Mostrar los permisos en la consola para depuración
  return (
    <PermisosContext.Provider value={{ permisos, tienePermiso }}>
      {children}
    </PermisosContext.Provider>

  );
};
