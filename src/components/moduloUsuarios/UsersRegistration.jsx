import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { usePermisos } from "../../components/admin/PermisosContext";
import Header from "../Header";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useInactivityLogout from "../../useInactivityLogout";
import useTokenAutoLogout from "../../useTokenAutoLogout";
import styles from "../../styles/usersRegistration.module.css";
import {
    listarPerfiles,
    crearPerfil,
    listarRoles,
    crearRol,
    crearTipoDocumento,
    listarTiposDocumento,
    crearEmpleado,
    listarEmpleados
} from "../../api"; // Importar las funciones de la API


// se crea el componente UsersRegistration
const UsersRegistration = () => {

    useInactivityLogout(); // Hook para manejar el logout por inactividad
    useTokenAutoLogout();  // Hook para expiración de token

    // Se definen los estados para los campos del formulario
    const [userID, setUserID] = useState("");
    const [userName, setUserNames] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userSecondLastName, setUserSecondLastName] = useState("");
    const [userAlias, setUserAlias] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userPhone, setUserPhone] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [userEmergencyContact, setUserEmergencyContact] = useState("");
    const [userContactPhone, setUserContactPhone] = useState("");
    const [usuarios, setUsuarios] = useState([]); //almacena los usuarios existentes
    const [documentType, setDocumentType] = useState(""); //almacena el código del tipo de documento
    const [documentTypes, setDocumentTypes] = useState([]); //almacena el nombre del tipo de documento
    const [rolType, setRolType] = useState("");

    // Estados de modal Perfil
    const [isPerfilModalOpen, setPerfilModalOpen] = useState(false);
    const [perfilNombre, setPerfilNombre] = useState("");
    const [perfilDescripcion, setPerfilDescripcion] = useState("");
    const [caracteresRestantesPerfil, setCaracteresRestantesPerfil] = useState(255); // Limite de caracteres
    const [perfilFiltro, setPerfilFiltro] = useState("");
    const [perfilSeleccionado, setPerfilSeleccionado] = useState("");
    const [perfiles, setPerfiles] = useState([]);

    // Estados de modal Rol
    const [isRolModalOpen, setRolModalOpen] = useState(false);
    const [rolNombre, setRolNombre] = useState("");
    const [rolDescripcion, setRolDescripcion] = useState("");
    const [caracteresRestantesRol, setCaracteresRestantesRol] = useState(255); // Limite de caracteres
    const [rolFiltro, setRolFiltro] = useState("");
    const [roles, setRoles] = useState([]);

    // Estados de modal tipo de documento
    const [isModalTipoDocumentoOpen, setModalTipoDocumentoOpen] = useState(false);
    const [codigoTipoDocumento, setCodigoTipoDocumento] = useState("");
    const [nombreTipoDocumento, setNombreTipoDocumento] = useState("");
    const [documentoFiltro, setDocumentoFiltro] = useState("");

    // Estados para mostrar tooltip y manejar visibilidad de contraseña
    const [showTooltip, setShowTooltip] = useState(false);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [contrasena, setContrasena] = useState("");

    // Hook para manejar permisos
    // Se importa el hook usePermisos para verificar los permisos del usuario actual
    const { tienePermiso } = usePermisos();

    // Estado para manejar la pestaña activa
    const [activeTab, setActiveTab] = useState("registro");

    // Se define la función para abrir los modales de crear perfil, rol y tipo documento
    const handleOpenModalPerfil = () => {
        setPerfilModalOpen(true);
    };

    // Función para abrir el modal de crear rol
    const handleOpenModalRol = () => {
        setRolModalOpen(true);
    };

    // Función para abrir el modal de crear tipo de documento
    const handleOpenModalTipoDocumento = () => {
        setModalTipoDocumentoOpen(true);
    };

    // Manejar cambio de pestaña
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Se utiliza el hook useEffect para establecer la pestaña activa al cargar el componente 
    // y los hooks basicos para cargar perfiles, roles y tipos de documento.
    useEffect(() => {
        setActiveTab("registro");
        cargarPerfiles();
        cargarRoles();
        cargarTiposDocumento();
    }, []);

    // Se define la funcióm para cargar tipos de documento
    const cargarTiposDocumento = async () => {
        try {
            const response = await listarTiposDocumento();
            setDocumentTypes(response.data);
        } catch (error) {
            console.error("Error cargando tipos de documento:", error);
        }
    };

    // Cargar Perfiles existentes
    const cargarPerfiles = async () => {
        try {
            const response = await listarPerfiles();
            setPerfiles(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error cargando perfiles:", error);
        }
    };

    // Cargar Roles existentes
    const cargarRoles = async () => {
        try {
            const response = await listarRoles();
            setRoles(response.data);
        } catch (error) {
            console.error("Error cargando roles:", error);
        }
    };

    // Cargar Usuarios existentes
    // Se utiliza el hook useEffect para cargar los usuarios existentes al iniciar el componente
    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const response = await listarEmpleados(); // 👈 asegúrate que esta función exista en api.js
                setUsuarios(response.data);
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
            }
        };

        cargarUsuarios();
    }, []);


    // Función para Guardar Tipo de Documento
    const handleSaveTipoDocumento = async () => {
        if (!codigoTipoDocumento || !nombreTipoDocumento) {
            alert("⚠️ Completa todos los campos.");
            return;
        }

        // Verificar si el tipo de documento ya existe
        const duplicado = documentTypes.find(
            (d) =>
                d.codigo.toLowerCase() === codigoTipoDocumento.toLowerCase() ||
                d.nombre.toLowerCase() === nombreTipoDocumento.toLowerCase()
        );

        if (duplicado) {
            alert("⚠️ Ya existe un tipo de documento con ese código o nombre.");
            return;
        }

        try {
            await crearTipoDocumento({
                codigo: codigoTipoDocumento,
                nombre: nombreTipoDocumento
            });
            await cargarTiposDocumento(); // Recargar el select principal
            alert("✅ Tipo de documento creado exitosamente.");
            setModalTipoDocumentoOpen(false);
        } catch (error) {
            console.error("Error creando tipo de documento:", error);
            alert("❌ Error al crear tipo de documento.");
        }
    };

    // Función para Guardar Perfil
    const handleSavePerfil = async () => {

        // Validar que el nombre y la descripción no estén vacíos
        // Si están vacíos, mostrar un mensaje de alerta y no continuar con la creación del perfil
        if (!perfilNombre.trim() || !perfilDescripcion.trim()) {
            alert("⚠️ Por favor completa el nombre y la descripción del perfil antes de guardar.");
            return;
        }

        // Verificar si el perfil ya existe
        const duplicado = perfiles.find(
            (d) =>
                d.nombrePerfil.toLowerCase() === perfilNombre.toLowerCase() ||
                d.descripcion.toLowerCase() === perfilDescripcion.toLowerCase()
        );

        if (duplicado) {
            alert("⚠️ Ya existe un perfil con ese nombre y esa descripción.");
            return;
        }

        try {
            await crearPerfil({
                nombrePerfil: perfilNombre,
                descripcion: perfilDescripcion
            });
            await cargarPerfiles(); // 📢 recargar perfiles después de guardar
            alert("✅ Perfil creado exitosamente.");
            setPerfilNombre("");
            setPerfilDescripcion("");
            setPerfilModalOpen(false);
        } catch (error) {
            console.error("Error guardando perfil:", error);
            alert("❌ Error al guardar el perfil.");
        }
    };

    // Función para Guardar Rol
    const handleSaveRol = async () => {
        if (!rolNombre.trim() || !rolDescripcion.trim() || !perfilSeleccionado) {
            alert("⚠️ Por favor completa todos los campos del rol antes de guardar.");
            return;
        }

        // Verificar si el rol ya exists
        const duplicado = roles.find(
            (d) =>
                d.nombreRol.toLowerCase() === rolNombre.toLowerCase() ||
                d.descripcion.toLowerCase() === rolDescripcion.toLowerCase()
        );

        if (duplicado) {
            alert("⚠️ Ya existe un rol con ese nombre y descripción.");
            return;
        }

        try {
            await crearRol({
                nombreRol: rolNombre,
                descripcion: rolDescripcion,
                idPerfil: perfilSeleccionado // Enviar el perfil asignado junto con el rol
            });
            await cargarRoles(); // 📢 recargar roles después de guardar
            alert("✅ Rol creado exitosamente.");
            setRolNombre("");
            setRolDescripcion("");
            setPerfilSeleccionado(""); // Limpiar selección de perfil
            setRolModalOpen(false);
        } catch (error) {
            console.error("Error guardando rol:", error);
            alert("❌ Error al guardar el rol.");
        }
    };

    // Función para guardar el empleado
    // Se crea el objeto que se enviará al backend y se llama a la API para crear el empleado.
    const handleSaveUser = async () => {

        const usuarioDuplicado = usuarios.find(
            (u) =>
                u.numeroDocumento === userID || // Duplicado por número de documento
                u.nombreUsuario === userAlias   // Duplicado por alias (correo)
        );

        if (usuarioDuplicado) {
            alert("⚠️ Ya existe un usuario con ese número de identificación o nombre de usuario.");
            return;
        }

        try {

            // ☑️ Validar que el nombre de usaurio (alias) sea un correo electrónico válido
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userAlias)) {
                alert("⚠️ El nombre de usuario debe ser un correo electrónico válido");
                return;
            }

            // Creamos el objeto 🙍🏻 que se enviará al backend
            const newUser = {
                numeroDocumento: userID,
                nombres: userName,
                apellidoPaterno: userLastName,
                apellidoMaterno: userSecondLastName,
                nombreUsuario: userAlias,
                contrasena: userPassword,
                telefonoMovil: userPhone,
                direccionResidencia: userAddress,
                contactoEmergencia: userEmergencyContact,
                telefonoContacto: userContactPhone,
                idTipoDocumento: documentType,  // cuidado aquí, hay que verificar si se necesita convertirlo a ID🔍
                idRol: rolType,                 // cuidado aquí también... verificar🔍
            };

            // Llamamos a la API
            await crearEmpleado(newUser);

            alert("✅ Usuario registrado exitosamente.");
            handleClear(); // 🔥 Limpiamos el formulario después de guardar🧹
        } catch (error) {
            console.error("Error registrando el usuario:", error);
            alert("❌ Hubo un error al registrar el usuario. Intenta nuevamente.");
        }
    };

    // Función para limpiar los campos dentro del modal para crear perfiles.
    const handleClearPerfil = () => {
        setPerfilNombre("");
        setPerfilDescripcion("");
        setPerfilFiltro("");
        setCaracteresRestantesPerfil(255);
    };

    // Función para limpiar los campos dentro del modal para crear roles.
    const handleClearRol = () => {
        setRolNombre("");
        setRolDescripcion("");
        setRolFiltro("");
        setPerfilSeleccionado("");
        setCaracteresRestantesRol(255);
    };

    // Función para limpiar los campos dentro del modal para crear tipos de documento.
    const handleClearTipoDocumento = () => {
        setDocumentoFiltro("");
        setCodigoTipoDocumento("");
        setNombreTipoDocumento("");
    };

    // Función para limpiar los campos de el formulario de registro de usuarios. 🧹
    const handleClear = () => {
        // Datos principales
        setUserID("");
        setUserNames("");
        setUserLastName("");
        setUserSecondLastName("");
        setUserAlias("");
        setUserPassword("");
        setUserPhone("");
        setUserAddress("");
        setUserEmergencyContact("");
        setUserContactPhone("");

        // Selects
        setDocumentType("");
        setRolType("");
    };

    // Se utiliza el hook useEffect para establecer la pestaña activa al cargar el componente
    useEffect(() => {
        setActiveTab('registro');
    }, []);

    // Se renderiza el componente
    return (
        <>
            <Header
                title="Módulo registro de usuarios"
                subtitle="Hardware Store Inventory FFIG"
                showLogo={true}
                showHelp={true}
            />

            {/* Pestañas debajo del header */}
            <div className={styles.tabs}>
                <Link
                    to={tienePermiso("usuario:registrar") ? "/users-registration" : "#"}
                    className={`${styles.tabButton} ${activeTab === "registro" ? styles.active : ""} ${!tienePermiso("usuario:registrar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("usuario:registrar")) e.preventDefault();
                        else handleTabClick("registro");
                    }}
                >
                    Registrar Usuarios
                </Link>

                <Link
                    to={tienePermiso("usuario:consultar") ? "/users-query" : "#"}
                    className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""} ${!tienePermiso("usuario:consultar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("usuario:consultar")) e.preventDefault();
                        else handleTabClick("consulta");
                    }}
                >
                    Consultar Usuarios
                </Link>

                <Link
                    to={tienePermiso("usuario:editar") ? "/update-users" : "#"}
                    className={`${styles.tabButton} ${activeTab === "actualizar" ? styles.active : ""} ${!tienePermiso("usuario:editar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("usuario:editar")) e.preventDefault();
                        else handleTabClick("actualizar");
                    }}
                >
                    Actualizar Usuarios
                </Link>

                <Link
                    to={tienePermiso("usuario:eliminar") ? "/delete-users" : "#"}
                    className={`${styles.tabButton} ${activeTab === "eliminar" ? styles.active : ""} ${!tienePermiso("usuario:eliminar") ? styles.disabledTab : ""}`}
                    onClick={(e) => {
                        if (!tienePermiso("usuario:eliminar")) e.preventDefault();
                        else handleTabClick("eliminar");
                    }}
                >
                    Eliminar Usuarios
                </Link>
            </div>

            {/* Contenido dependiendo de la pestaña activa */}
            {activeTab === "registro" && (
                <div className={styles.container}>
                    <h2 className={styles.title}>
                        Ingrese la información solicitada para crear el registro
                    </h2>

                    <div className={styles.formContainer}>
                        <form className={styles.formLeft}>
                            <label className={styles.inputLabel}>Número de Documento:</label>
                            <input
                                type="text"
                                placeholder="Número de Documento (Obligatorio)"
                                value={userID}
                                onChange={(e) => setUserID(e.target.value)}
                                required
                                className={styles.input}
                                title="Solo letras y números. No se permiten espacios, puntos, comas ni apóstrofos."
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Nombre(s):</label>
                            <input
                                type="text"
                                placeholder="Nombre(s) (Obligatorio)"
                                value={userName}
                                onChange={(e) => setUserNames(e.target.value)}
                                required
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Primer Apellido:</label>
                            <input
                                type="text"
                                placeholder="Primer Apellido (Obligatorio)"
                                value={userLastName}
                                onChange={(e) => setUserLastName(e.target.value)}
                                required
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Segundo Apellido :</label>
                            <input
                                type="text"
                                placeholder="Segundo Apellido (Opcional)"
                                value={userSecondLastName}
                                onChange={(e) => setUserSecondLastName(e.target.value)}
                                required
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Nombre de Usuario:</label>
                            <input
                                type="text"
                                placeholder="Nombre de Usuario (Obligatorio)"
                                value={userAlias}
                                onChange={(e) => setUserAlias(e.target.value)}
                                required
                                className={styles.input}
                                title="Debe ingresar un correo electrónico válido (Ej: nombre@dominio.com)"
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Contraseña:</label>
                            <div className={styles.passwordInputWrapperUser}>
                                <input
                                    type={mostrarContrasena ? "text" : "password"}
                                    value={contrasena}
                                    onFocus={() => setShowTooltip(true)}
                                    onBlur={() => setShowTooltip(false)}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    placeholder="Contraseña (Obligatorio)"
                                    className={styles.input}
                                />
                                <span
                                    className={styles.togglePasswordIconUser}
                                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                >
                                    {mostrarContrasena ? <VisibilityOff /> : <Visibility />}
                                </span>

                                {showTooltip && (
                                    <div className={styles.tooltipPassword}>
                                        Debe tener entre 8 y 16 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales.
                                    </div>
                                )}
                            </div>

                            <label className={styles.inputLabel}>Teléfono Móvil:</label>
                            <input
                                type="text"
                                placeholder="Teléfono Móvil (Obligatorio)"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                                required
                                className={styles.input}
                                title="Ingrese un número de celular colombiano sin el código de país. Debe contener exactamente 10 dígitos numéricos."
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Dirección de Residencia:</label>
                            <input
                                type="text"
                                placeholder="Dirección de Residencia (Obligatorio)"
                                value={userAddress}
                                onChange={(e) => setUserAddress(e.target.value)}
                                required
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Contacto de Emergencia:</label>
                            <input
                                type="text"
                                placeholder="Contacto de Emergencia (Obligatorio)"
                                value={userEmergencyContact}
                                onChange={(e) => setUserEmergencyContact(e.target.value)}
                                required
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Teléfono de Contacto:</label>
                            <input
                                type="text"
                                placeholder="Teléfono de Contacto (Obligatorio)"
                                value={userContactPhone}
                                onChange={(e) => setUserContactPhone(e.target.value)}
                                required
                                className={styles.input}
                                title="Ingrese un número de celular colombiano sin el código de país. Debe contener exactamente 10 dígitos numéricos."
                                style={{ fontStyle: 'italic' }}
                            />
                        </form>

                        <form className={styles.formRight} noValidate>
                            <div className={styles.selectGroup}>
                                <div className={styles.formGroup}>
                                    <label className={styles.inputLabel}>Tipo de Documento</label>
                                    <div className={styles.selectWrapper}>
                                        <select id="tipoDocumento"
                                            className={styles.select}
                                            value={documentType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                            required
                                        >
                                            <option value=""> Seleccione un Tipo de Documento </option>
                                            {documentTypes.map((tipo) => (
                                                <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento}>
                                                    {tipo.nombre} - ({tipo.codigo})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.inputLabel}>Tipo de Rol</label>
                                    <div className={styles.selectWrapper}>
                                        <select id="tipoRol"
                                            className={styles.select}
                                            value={rolType}
                                            onChange={(e) => setRolType(e.target.value)}
                                            required
                                        >
                                            <option value=""> Seleccione un Rol </option>
                                            {roles.map((rol) => (
                                                <option key={rol.idRol} value={rol.idRol}>
                                                    {rol.nombreRol}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Botones Abrir Modales */}
                            <div className={styles.formGroupButtos}>
                                {tienePermiso("tipoDocumento:crear") && (

                                    <button
                                        type="Button"
                                        className={styles.createButton}
                                        onClick={() => handleOpenModalTipoDocumento(true)}
                                    >
                                        D.N.I&#8203;<AddIcon style={{ marginLeft: 8 }} />
                                    </button>
                                )}

                                {tienePermiso("perfil:crear") && (
                                    <button type="button"
                                        className={styles.createButton}
                                        onClick={handleOpenModalPerfil}
                                    >
                                        Perfil <AddIcon style={{ marginLeft: 8 }} />
                                    </button>
                                )}

                                {tienePermiso("rol:crear") && (
                                    <button type="button"
                                        className={styles.createButton}
                                        onClick={handleOpenModalRol}
                                    >
                                        Roles<AddIcon style={{ marginLeft: 8 }} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Botones de Acción para el formulario principal */}
                    <div className={styles.actionButtons}>
                        <button type="button" onClick={handleSaveUser} className={styles.saveButton}>
                            Guardar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                        </button>
                        <button type="button" onClick={handleClear} className={styles.clearButton}>
                            Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                        </button>
                        <button
                            type="button"
                            onClick={() => (window.location.href = "/menu-principal")}
                            className={styles.exitButton}
                        >
                            Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Crear Tipo de Documento */}
            {isModalTipoDocumentoOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button
                            className={styles.modalCloseButton}
                            onClick={() => {
                                setModalTipoDocumentoOpen(false);
                                handleClearTipoDocumento();
                            }}
                        >
                            <CloseIcon />
                        </button>
                        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                            Crear Tipo de Documento
                        </h2>

                        {/* Búsqueda (solo lectura) */}
                        <div className={styles.modalFormGroup}>
                            <label htmlFor="BuscarDocumento" className={styles.labelModal}>
                                Buscar tipo de documento
                            </label>
                            <input
                                type="text"
                                id="BuscarDocumento"
                                placeholder="Buscar Tipo de Documento"
                                value={documentoFiltro}
                                onChange={(e) => setDocumentoFiltro(e.target.value)}
                                className={styles.input}
                                style={{ fontStyle: "italic" }}
                            />
                        </div>

                        {/* Lista solo informativa, sin onClick */}
                        {documentoFiltro.trim() !== "" && (
                            <ul>
                                {documentTypes
                                    .filter((doc) =>
                                        doc.nombre.toLowerCase().includes(documentoFiltro.toLowerCase())
                                    )
                                    .map((doc) => (
                                        <li key={doc.idTipoDocumento}>
                                            {doc.nombre} ({doc.codigo})
                                        </li>
                                    ))}
                                {documentTypes.filter((doc) =>
                                    doc.nombre.toLowerCase().includes(documentoFiltro.toLowerCase())
                                ).length === 0 && (
                                        <li style={{ fontStyle: "italic", color: "gray" }}>
                                            No se encontraron coincidencias
                                        </li>
                                    )}
                            </ul>
                        )}

                        {/* Campos para crear yipo documento */}
                        <div className={styles.modalFormGroup}>
                            <label htmlFor="codigo" className={styles.labelModal}>
                                Nomenclatura
                            </label>
                            <input
                                type="text"
                                value={codigoTipoDocumento}
                                onChange={(e) => setCodigoTipoDocumento(e.target.value)}
                                placeholder="Nomenclatura Ejemplo: CC (Obligatorio)"
                                className={styles.input}
                                style={{ fontStyle: "italic" }}
                            />
                        </div>
                        <div className={styles.modalFormGroup}>
                            <label htmlFor="Nombre" className={styles.labelModal}>
                                Nombre tipo documento
                            </label>
                            <input
                                type="text"
                                value={nombreTipoDocumento}
                                onChange={(e) => setNombreTipoDocumento(e.target.value)}
                                placeholder="Nombre del Tipo de Documento (Obligatorio)"
                                className={styles.input}
                                style={{ fontStyle: "italic" }}
                            />
                        </div>

                        <div className={styles.modalButtons}>
                            <button
                                className={styles.modalButtonSave}
                                onClick={handleSaveTipoDocumento}
                            >
                                Guardar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button
                                className={styles.clearButtonModal}
                                onClick={() => {
                                    setModalTipoDocumentoOpen(false);

                                }}
                            >
                                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button
                                className={styles.modalButtonExit}
                                onClick={() => {
                                    setModalTipoDocumentoOpen(false);
                                    handleClearTipoDocumento();

                                }}
                            >
                                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                            </button>
                        </div>
                    </div>
                </div >
            )}

            {/* Modal Crear Perfil */}
            {
                isPerfilModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button className={styles.modalCloseButton}
                                onClick={() => {
                                    setPerfilModalOpen(false);
                                    handleClearPerfil();
                                }}
                            >
                                <CloseIcon />
                            </button>

                            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Crear Perfil</h2>

                            <div className={styles.modalFormGroup}>
                                <label htmlFor="BuscarPerfil" className={styles.labelModal}>Buscar perfil</label>
                                <input
                                    className="{styles.inputModalBuscar}"
                                    type="text"
                                    id="BuscarPerfil"
                                    placeholder="Buscar Perfil"
                                    value={perfilFiltro}
                                    onChange={(e) => setPerfilFiltro(e.target.value)}
                                />
                            </div>
                            {perfilFiltro.trim() !== "" && (
                                <ul>
                                    {Array.isArray(perfiles) && perfiles.filter((perfil) =>
                                        perfil.nombrePerfil.toLowerCase().includes(perfilFiltro.toLowerCase())
                                    ).map((perfil) => (
                                        <li key={perfil.idPerfil}>{perfil.nombrePerfil}</li>
                                    ))}
                                </ul>
                            )}

                            <div className={styles.modalFormGroup}>
                                <label htmlFor="NombrePerfil" className={styles.labelModal}>Nombre perfil</label>
                                <input
                                    type="text"
                                    id="NombrePerfil"
                                    placeholder="Nombre del Perfil"
                                    value={perfilNombre}
                                    onChange={(e) => setPerfilNombre(e.target.value)}
                                />
                            </div>

                            <div className={styles.modalFormGroup}>
                                <label htmlFor="DescripcionPerfil" className={styles.labelModal}>Descripción perfil</label>
                                <p className={styles.charCounter}>
                                    Caracteres Restantes: {caracteresRestantesPerfil}
                                </p>
                                <textarea
                                    id="DescripcionPerfil"
                                    placeholder="Descripción"
                                    value={perfilDescripcion}
                                    onChange={(e) => {
                                        setPerfilDescripcion(e.target.value);
                                        setCaracteresRestantesPerfil(255 - e.target.value.length);
                                    }}
                                    maxLength={255}
                                    className={styles.textareaModal}
                                />
                            </div>
                            <div className={styles.modalButtons}>
                                <button className={styles.modalButtonSave}
                                    onClick={handleSavePerfil}>
                                    Guardar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                                </button>
                                <button className={styles.clearButtonModal}
                                    onClick={handleClearPerfil}>
                                    Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                                </button>
                                <button className={styles.modalButtonExit}
                                    onClick={() => {
                                        setPerfilModalOpen(false);
                                        handleClearPerfil();
                                    }}
                                >
                                    Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Modal Crear Rol */}
            {
                isRolModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button className={styles.modalCloseButton}
                                onClick={() => {
                                    setRolModalOpen(false)
                                    handleClearRol();
                                }}
                            >
                                <CloseIcon />
                            </button>

                            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Crear Rol</h2>
                            <div className={styles.modalFormGroup}>
                                <div className={styles.selectGroupRol}>
                                    <div className={styles.formGroupRol}>
                                        <label htmlFor="PerfilRol" className={styles.labelModal}>Seleccione un perfil para asignarlo al rol</label>
                                        <div className={styles.selectWrapperRol}>
                                            <select
                                                id="PerfilRol"
                                                className={styles.selectPerfil}
                                                value={perfilSeleccionado}
                                                onChange={(e) => setPerfilSeleccionado(parseInt(e.target.value, 10))}
                                            >
                                                <option value="">Seleccionar Perfil</option>
                                                {perfiles.map((perfil) => (
                                                    <option key={perfil.idPerfil} value={perfil.idPerfil}>
                                                        {perfil.nombrePerfil}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.modalFormGroup}>
                                    <label htmlFor="BuscarRol" className={styles.labelModal}>Buscar Rol</label>
                                    <input
                                        type="text"
                                        id="BuscarRol"
                                        placeholder="Buscar Rol"
                                        value={rolFiltro}
                                        onChange={(e) => setRolFiltro(e.target.value)}
                                    />
                                </div>
                                {rolFiltro.trim() !== "" && (
                                    <ul>
                                        {Array.isArray(roles) && roles.filter((rol) =>
                                            rol.nombreRol.toLowerCase().includes(rolFiltro.toLowerCase())
                                        ).map((rol) => (
                                            <li key={rol.idRol}>{rol.nombreRol}</li>
                                        ))}
                                    </ul>
                                )}
                                <div className={styles.modalFormGroup}>
                                    <label htmlFor="NombreRol" className={styles.labelModal}>Nombre Rol</label>
                                    <input
                                        type="text"
                                        id="NombreRol"
                                        placeholder="Nombre del Rol"
                                        value={rolNombre}
                                        onChange={(e) => setRolNombre(e.target.value)}
                                    />
                                </div>
                                <div className={styles.modalFormGroup}>
                                    <label htmlFor="DescripcionRol" className={styles.labelModal}>Descripción Rol</label>
                                    <p className={styles.charCounter}>
                                        Caracteres Restantes: {caracteresRestantesRol}
                                    </p>
                                    <textarea
                                        id="DescripcionRol"
                                        placeholder="Descripción"
                                        value={rolDescripcion}
                                        onChange={(e) => {
                                            setRolDescripcion(e.target.value);
                                            setCaracteresRestantesRol(255 - e.target.value.length);
                                        }}
                                        maxLength={255}
                                        className={styles.textareaModal}
                                    />
                                </div>
                                <div className={styles.modalButtonsRol}>
                                    <button className={styles.modalButtonSave}
                                        onClick={handleSaveRol}>
                                        Guardar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                                    </button>
                                    <button className={styles.clearButtonModal}
                                        onClick={handleClearRol}>
                                        Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                                    </button>
                                    <button className={styles.modalButtonExit}
                                        onClick={() => {
                                            setRolModalOpen(false)
                                            handleClearRol();
                                        }}
                                    >
                                        Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default UsersRegistration