import { usePermisos } from "../../components/admin/PermisosContext";
import PropTypes from "prop-types";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from '@mui/icons-material/Close';
import styles from "../../styles/modalstyles.module.css";

// Componente para mostrar un modal de permisos asignados
// Este componente muestra los permisos asignados al rol del usuario actual
const ReadOnlyPermissionModal = ({ onClose }) => {

    // Utiliza el contexto de permisos para obtener los permisos del usuario
    // El contexto proporciona una forma de acceder a los permisos sin necesidad de pasarlos como props
    const { permisos } = usePermisos();
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const rol = userData.rol || "No identificado";

    const nombresLegibles = {
        "CREAR_USUARIO": "Registrar usuarios",
        "CONSULTAR_USUARIO": "Consultar usuarios",
        "ACTUALIZAR_USUARIO": "Actualizar usuarios",
        "ELIMINAR_USUARIO": "Eliminar usuarios",

        "CREAR_TIPO_DOCUMENTO": "Crear tipo de documento",
        "CONSULTAR_TIPO_DOCUMENTO": "Consultar tipo de documento",
        "ACTUALIZAR_TIPO_DOCUMENTO": "Actualizar tipo de documento",

        "CREAR_PERFIL": "Crear perfiles",
        "CONSULTAR_PERFIL": "Consultar perfiles",
        "ACTUALIZAR_PERFIL": "Actualizar perfiles",
        "ELIMINAR_PERFIL": "Eliminar perfiles",

        "CREAR_ROL": "Crear roles",
        "CONSULTAR_ROL": "Consultar roles",
        "ACTUALIZAR_ROL": "Actualizar roles",

        "MODULO_USUARIOS": "Acceso al módulo de usuarios",
        "MODULO_INVENTARIO": "Acceso al módulo de inventario",

        "CREAR_PRODUCTO": "Registrar productos",
        "CONSULTAR_PRODUCTO": "Consultar productos",
        "ACTUALIZAR_PRODUCTO": "Actualizar productos",
        "ELIMINAR_PRODUCTO": "Eliminar productos",
        "EDITAR_PROVEEDOR": "Editar proveedores",
        "EDITAR_CATEGORIA": "Editar categorías",
        "VER_MOVIMIENTOS": "Ver trazabilidad (movimientos)",

        "CAMBIAR_CONTRASENA": "Cambiar contraseña",
        "VER_MANUALES": "Ver manuales del sistema",
        "VER_MI_PERFIL": "Ver mi perfil",
        "GESTIONAR_PERMISOS": "Gestionar permisos",
        "VER_PERMISOS_ASIGNADOS": "Ver permisos asignados",
        "VER_ACERCA_DE": "Ver créditos y agradecimientos",
        "MODULOS_INTEGRADOS": "Ver documentación técnica de APIs",
        "PLAN_DE_PRUEBAS": "Ver plan de pruebas",
        "CASOS_y_AMBIENTE_PRUEBAS": "Ver casos y ambiente de pruebas",
        "MANUAL_TECNICO_DEL_SISTEMA": "Ver manual técnico del sistema",
        "MANUAL_DEL_USUARIO": "Ver manual del usuario",

        "GESTIONAR_BASE_DATOS": "Gestionar base de datos",
        "EXPORTAR_BD": "Exportar base de datos",
        "IMPORTAR_BD": "Importar base de datos",
    };

    // Renderiza el modal con los permisos asignados al rol del usuario
    // Muestra un título, el rol del usuario y una lista de permisos asignados
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.modalCloseButton} onClick={onClose}>
                    <CloseIcon />
                </button>

                <h2 className={styles.title}>Permisos asignados</h2>
                <p><strong>Rol:</strong> {rol}</p>

                {permisos && permisos.length > 0 ? (
                    <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                        {permisos.map((permiso, index) => (
                            <li key={index}>{nombresLegibles[permiso] || permiso}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No se encontraron permisos asignados.</p>
                )}

                <div className={styles.modalButtonGroup}>
                    <button className={styles.modalButtonExit} onClick={onClose}>
                        Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                    </button>
                </div>
            </div>
        </div>
    );
};
// Componente ReadOnlyPermissionModal
// Este componente muestra un modal con los permisos asignados al rol del usuario actual
ReadOnlyPermissionModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ReadOnlyPermissionModal;
