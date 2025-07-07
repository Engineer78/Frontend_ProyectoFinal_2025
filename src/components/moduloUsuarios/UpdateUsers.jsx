import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { buscarEmpleadoPorDocumento } from "../../api";
import { usePermisos } from "../../components/admin/PermisosContext";
import Header from "../Header";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useInactivityLogout from "../../useInactivityLogout";
import useTokenAutoLogout from "../../useTokenAutoLogout";
import styles from "../../styles/UpdateUsers.module.css";
import {
    listarPerfiles,
    listarRoles,
    listarTiposDocumento,
    listarEmpleados,
    actualizarPerfil,
    actualizarRol,
    actualizarTipoDocumento,
    actualizarEmpleadoPorDocumento
} from "../../api"; // Importar las funciones de la API 


// Componente para actualizar usuarios
const UpdateUsers = () => {

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
    const [documentType, setDocumentType] = useState(""); //almacena el código del tipo de documento
    const [documentTypes, setDocumentTypes] = useState([]); //almacena el nombre del tipo de documento
    const [rolType, setRolType] = useState("");
    const [originalUserID, setOriginalUserID] = useState("");

    // Estados de modal Perfil
    const [isPerfilModalOpen, setPerfilModalOpen] = useState(false);
    const [perfilNombre, setPerfilNombre] = useState("");
    const [perfilDescripcion, setPerfilDescripcion] = useState("");
    const [caracteresRestantesPerfil, setCaracteresRestantesPerfil] = useState(255); // Limite de caracteres
    const [perfilFiltro, setPerfilFiltro] = useState("");
    const [perfilSeleccionado, setPerfilSeleccionado] = useState("");
    const [perfilIdSeleccionado, setPerfilIdSeleccionado] = useState(null);
    const [perfiles, setPerfiles] = useState([]);

    // Estados de modal Rol
    const [isRolModalOpen, setRolModalOpen] = useState(false);
    const [rolNombre, setRolNombre] = useState("");
    const [rolDescripcion, setRolDescripcion] = useState("");
    const [caracteresRestantesRol, setCaracteresRestantesRol] = useState(255); // Limite de caracteres
    const [rolFiltro, setRolFiltro] = useState("");
    const [roles, setRoles] = useState([]);
    const [rolIdSeleccionado, setRolIdSeleccionado] = useState(null);

    // Estados de modal tipo de documento
    const [isModalTipoDocumentoOpen, setModalTipoDocumentoOpen] = useState(false);
    const [codigoTipoDocumento, setCodigoTipoDocumento] = useState("");
    const [nombreTipoDocumento, setNombreTipoDocumento] = useState("");
    const [tipoDocumentoIdSeleccionado, setTipoDocumentoIdSeleccionado] = useState(null);
    const [documentoFiltro, setDocumentoFiltro] = useState("");

    // Estados para mostrar tooltip y manejar visibilidad de contraseña
    const [showTooltip, setShowTooltip] = useState(false);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [contrasena, setContrasena] = useState("");

    // Hook para manejar permisos de usuario
    const { tienePermiso } = usePermisos();

    // Estado para manejar la pestaña activa
    const [activeTab, setActiveTab] = useState("registro");

    // Se define la función para abrir los modales de crear perfil, rol y tipo documento
    const handleOpenModalPerfil = () => {
        setPerfilModalOpen(true);
    };

    // Función para abrir el modal de rol
    const handleOpenModalRol = () => {
        setRolModalOpen(true);
    };

    // Función para abrir el modal de tipo de documento
    const handleOpenModalTipoDocumento = () => {
        setModalTipoDocumentoOpen(true);
    };

    // Manejar cambio de pestaña
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Función para cargar los tipos de documento, perfiles y roles.
    useEffect(() => {
        setActiveTab('actualizar');
        cargarTiposDocumento();
        cargarPerfiles();
        cargarRoles();
    }, []);

    // Función para cargar los tipos de documento usando los endpoints de la API
    const cargarTiposDocumento = async () => {
        try {
            const response = await listarTiposDocumento();
            setDocumentTypes(response.data);
            console.log('📄 Document types cargados:', response.data);
        } catch (error) {
            console.error("Error al cargar tipos de documento:", error);
        }
    };

    // Función para cargar los perfiles usando los endpoints de la API
    const cargarPerfiles = async () => {
        try {
            const response = await listarPerfiles();
            setPerfiles(response.data);
        } catch (error) {
            console.error("Error al cargar perfiles:", error);
        }
    };

    // Función para cargar los roles usando los endpoints de la API
    const cargarRoles = async () => {
        try {
            const response = await listarRoles();
            setRoles(response.data);
        } catch (error) {
            console.error("Error al cargar roles:", error);
        }
    };

    // Efecto para verificar si el tipo de documento seleccionado existe en la lista
    useEffect(() => {
        if (documentTypes.length > 0 && documentType) {
            const existe = documentTypes.some(doc => doc.idTipoDocumento === parseInt(documentType));
            if (!existe) {
                // Si no existe en la lista, resetea
                setDocumentType('');
            }
        }
    }, [documentTypes, documentType]);


    // Función para buscar un empleado por su número de documento
    // y cargar los datos en el formulario.
    const handleSearch = async () => {
        const trimmedUserID = userID.trim();

        if (!trimmedUserID) {
            alert("⚠️ Por favor, ingrese el número de documento para buscar.");
            return;
        }

        try {
            const response = await buscarEmpleadoPorDocumento(trimmedUserID);
            const empleado = response.data;

            if (!empleado) {
                alert("No se encontró un empleado con ese número de documento.");
                return;
            }

            // Rellenar campos
            setUserID(empleado.numeroDocumento || "");
            setOriginalUserID(empleado.numeroDocumento); // <-- Aquí se guarda el documento actual
            setUserNames(empleado.nombres || "");
            setUserLastName(empleado.apellidoPaterno || "");
            setUserSecondLastName(empleado.apellidoMaterno || "");
            setUserAlias(empleado.nombreUsuario || "");
            setUserPassword(""); // No cargamos la contraseña
            setUserPhone(empleado.telefonoMovil || "");
            setUserAddress(empleado.direccionResidencia || "");
            setUserEmergencyContact(empleado.contactoEmergencia || "");
            setUserContactPhone(empleado.telefonoContacto || "");
            setDocumentType(empleado.idTipoDocumento?.toString() || "");
            setRolType(empleado.idRol?.toString() || "");

            // Relacionar selects
            setDocumentType(empleado.idTipoDocumento); // ID
            setRolType(empleado.idRol); // ID

            alert("✅ Usuario encontrado. Ahora puedes actualizarlo.");
        } catch (error) {
            console.error("Error al buscar el Usuario:", error);
            alert("❌ Error al buscar el Usuario.");
        }
    };

    // Función para validar los campos del formulario antes de enviar la solicitud de actualización.
    // Se asegura de que todos los campos obligatorios estén completos.
    const validateFields = () => {
        return (
            userID &&
            userName &&
            userLastName &&
            userSecondLastName &&
            userAlias &&
            userPassword &&
            userPhone &&
            userAddress &&
            userEmergencyContact &&
            userContactPhone &&
            documentType &&
            rolType
        );
    };

    // Función para validar los campos del formulario
    const handleSave = async () => {
        if (!validateFields()) {
            alert("⚠️ Por favor, completa todos los campos obligatorios.");
            return;
        }

        const empleados = await listarEmpleados();

        // Validar duplicado de número de documento (excepto el mismo que se está actualizando)
        const documentoRepetido = empleados.data.find(
            (emp) => emp.numeroDocumento === userID && emp.nombreUsuario !== userAlias
        );

        // Validar duplicado de alias (correo) en otro usuario
        const aliasRepetido = empleados.data.find(
            (emp) => emp.nombreUsuario === userAlias && emp.numeroDocumento !== originalUserID
        );

        // Validar duplicado de número de documento
        if (documentoRepetido) {
            alert("⚠️ Ya existe un usuario con ese número de documento.");
            return;
        }

        if (aliasRepetido) {
            alert("⚠️ Ya existe un usuario con ese nombre de usuario (correo).");
            return;
        }

        try {
            console.log("Datos a enviar:", {
                userID, userPassword, // verifica que haya contraseña
                // ...otros campos
            });
            const updatedEmpleado = {
                numeroDocumento: userID,
                nombres: userName,
                apellidoPaterno: userLastName,
                apellidoMaterno: userSecondLastName,
                nombreUsuario: userAlias,
                contrasena: userPassword, // Esta sí sew envía
                telefonoMovil: userPhone,
                direccionResidencia: userAddress,
                contactoEmergencia: userEmergencyContact,
                telefonoContacto: userContactPhone,
                idRol: parseInt(rolType),
                idtipoDocumento: parseInt(documentType)
            };

            const response = await actualizarEmpleadoPorDocumento(originalUserID, updatedEmpleado);

            if (response.status === 200) {
                alert("✅ Usuario actualizado exitosamente.");
                handleClear();
            } else {
                alert("❌ Error al actualizar el empleado.");
            }
        } catch (error) {
            console.error("Error al actualizar el empleado:", error);
            alert("❌ Error al actualizar el empleado.");
        }
    };

    // función para actualizar perfil desde el modal.
    const handleUpdatePerfil = async () => {
        if (!perfilNombre.trim() || !perfilDescripcion.trim() || !perfilIdSeleccionado) {
            alert("⚠️ Completa todos los campos y selecciona un perfil de la lista.");
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
            const perfil = perfiles.find(p => p.idPerfil === perfilIdSeleccionado);

            if (!perfil) {
                alert("⚠️ No se encontró el perfil a actualizar.");
                return;
            }

            await actualizarPerfil(perfil.idPerfil, {
                nombrePerfil: perfilNombre,
                descripcion: perfilDescripcion,
            });

            await cargarPerfiles();
            alert("✅ Perfil actualizado exitosamente.");
            handleClearPerfil();
            setPerfilModalOpen(false);
        } catch (error) {
            console.error("Error actualizando perfil:", error);
            alert("❌ Error al actualizar el perfil.");
        }
    };

    // función para actualizar tipo de documento desde el modal.
    const handleUpdateTipoDocumento = async () => {
        if (!codigoTipoDocumento.trim() || !nombreTipoDocumento.trim()) {
            alert("⚠️ Completa los campos del tipo de documento.");
            return;
        }

        if (!tipoDocumentoIdSeleccionado) {
            alert("⚠️ Debes seleccionar un tipo de documento antes de actualizar.");
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
            await actualizarTipoDocumento(tipoDocumentoIdSeleccionado, {
                codigo: codigoTipoDocumento,
                nombre: nombreTipoDocumento
            });

            await cargarTiposDocumento();
            alert("✅ Tipo de documento actualizado.");
            handleClearTipoDocumento();
            setModalTipoDocumentoOpen(false);
        } catch (error) {
            console.error("Error actualizando tipo de documento:", error);
            alert("❌ Error al actualizar tipo de documento.");
        }
    };

    // Función para actualizar rol desde el modal.
    const handleUpdateRol = async () => {

        if (!rolNombre.trim() || !rolDescripcion.trim() || !perfilSeleccionado) {
            alert("⚠️ Completa todos los campos del rol.");
            return;
        }

        if (!rolIdSeleccionado) {
            alert("⚠️ No se encontró el rol a actualizar.");
            return;
        }

        const rol = roles.find(r => r.idRol === rolIdSeleccionado);

        if (!rol) {
            alert("⚠️ El rol seleccionado no se encuentra en la lista.");
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

            await actualizarRol(rol.idRol, {
                nombreRol: rolNombre,
                descripcion: rolDescripcion,
                idPerfil: perfilSeleccionado,
            });

            await cargarRoles();
            alert("✅ Rol actualizado exitosamente.");
            handleClearRol();
            setRolModalOpen(false);
        } catch (error) {
            console.error("Error actualizando rol:", error);
            alert("❌ Error al actualizar el rol.");
        }
    };

    // Función para limpiar los campos dentro del modal para crear perfiles.
    const handleClearPerfil = () => {
        setPerfilNombre("");
        setPerfilDescripcion("");
        setPerfilFiltro("");
        setPerfilIdSeleccionado(null);
        setCaracteresRestantesPerfil(255);
    };

    // Función para limpiar los campos dentro del modal para crear roles.
    const handleClearRol = () => {
        setRolNombre("");
        setRolDescripcion("");
        setRolFiltro("");
        setPerfilSeleccionado("");
        setRolIdSeleccionado(null);
        setCaracteresRestantesRol(255);
    };

    // Función para limpiar los campos dentro del modal para crear tipos de documento.
    const handleClearTipoDocumento = () => {
        setCodigoTipoDocumento("");
        setNombreTipoDocumento("");
        setDocumentoFiltro("");
        setTipoDocumentoIdSeleccionado(null);
    };

    // Función para limpiar los campos del formulario
    const handleClear = () => {
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
        setDocumentType("");
        setRolType("");
    };

    // Hook para manejar permisos de usuario
    useEffect(() => {
        setActiveTab('actualizar');
    }, []);

    // Renderizar el componente
    return (
        <div className={styles.containerPrincipal}>
            {/* Encabezado del módulo */}
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

            {/* Contenido del formulario de actualización de usuarios */}
            {activeTab === "actualizar" && (
                <div className={styles.container}>
                    <h2 className={styles.title}>
                        Ingrese el Número de Identificación para buscar y actualizar el registro
                    </h2>

                    <div className={styles.formContainer}>
                        <form className={styles.formLeft}>
                            <label className={styles.inputLabel}>Número de Identificación:</label>
                            <input
                                type="text"
                                placeholder="Número de Identificación (Obligatorio)"
                                value={userID}
                                onChange={(e) => setUserID(e.target.value)}
                                required
                                className={styles.input}
                                title="Debe conteber números y/o letras, no debe contener puntos ni comas, ni apóstrofo"
                                style={{ fontStyle: 'italic' }}
                            />

                            <button
                                type="button"
                                onClick={handleSearch}
                                className={styles.searchButton}
                            >
                                Buscar <SearchIcon style={{ marginLeft: 5 }} />
                            </button>

                            <label className={styles.inputLabel}>Nombre(s):</label>
                            <input
                                type="text"
                                placeholder="Nombre(s)"
                                value={userName}
                                onChange={(e) => setUserNames(e.target.value)}
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
                                    style={{ fontStyle: 'italic' }}
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
                                        <select
                                            id="tipoDocumento"
                                            className={styles.select}
                                            value={documentType}
                                            onChange={(e) => setDocumentType(e.target.value)}
                                            required
                                        >
                                            <option value=""> Seleccione un Tipo de Documento </option>
                                            {documentTypes.map((tipo) => (
                                                <option key={tipo.idTipoDocumento} value={tipo.idTipoDocumento.toString()}>
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
                                        type="button"
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

                    {/* Botones de acción para guardar, limpiar y salir */}
                    <div className={styles.actionButtons}>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Actualizar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                        </button>
                        <button className={styles.clearButton} onClick={handleClear}>
                            Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                        </button>
                        <button
                            type="button"
                            onClick={() => (window.location.href = "/menu-principal")}
                            className={styles.exitButton} >
                            Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                        </button>
                    </div>
                </div>
            )}
            {/* Modal Actualizar Tipo de Documento */}
            {isModalTipoDocumentoOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.modalCloseButton}
                            onClick={() => {
                                setModalTipoDocumentoOpen(false);
                                handleClearTipoDocumento();
                            }}
                        >
                            <CloseIcon />
                        </button>
                        <h2 style={{ textAlign: "center", marginBottom: '1rem' }}>Actualizar Tipo de Documento</h2>

                        <div className={styles.modalFormGroup}>
                            <label htmlFor="BuscarDocumento" className={styles.labelModal}>Buscar tipo de documento</label>
                            <input
                                type="text"
                                id="BuscarDocumento"
                                placeholder="Buscar Tipo de Documento (Obligatorio)"
                                value={documentoFiltro}
                                onChange={(e) => setDocumentoFiltro(e.target.value)}
                            />
                        </div>

                        {/* Lista dinámica que se muestra solo si hay texto en el input */}
                        {documentoFiltro.trim() !== "" && (
                            <ul className={styles.listaResultados}>
                                {documentTypes
                                    .filter((doc) =>
                                        doc.nombre.toLowerCase().includes(documentoFiltro.toLowerCase())
                                    )
                                    .map((doc) => (
                                        <li
                                            key={doc.idTipoDocumento}
                                            onClick={() => {
                                                setCodigoTipoDocumento(doc.codigo);
                                                setNombreTipoDocumento(doc.nombre);
                                                setTipoDocumentoIdSeleccionado(doc.idTipoDocumento);
                                            }}
                                        >
                                            {doc.nombre}
                                        </li>
                                    ))}
                            </ul>
                        )}
                        <div className={styles.modalFormGroup}>
                            <label htmlFor="codigo" className={styles.labelModal}>Nomenclatura</label>
                            <input
                                type="text"
                                value={codigoTipoDocumento}
                                onChange={(e) => setCodigoTipoDocumento(e.target.value)}
                                placeholder="Nomenclatura Ejemplo: CC (Obligatorio)"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.modalFormGroup}>
                            <label tmlFor="codigo" className={styles.labelModal}>Nombre</label>
                            <input
                                type="text"
                                value={nombreTipoDocumento}
                                onChange={(e) => setNombreTipoDocumento(e.target.value)}
                                placeholder="Nombre Tipo de Documento (Obligatorio)"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.modalButtons}>
                            <button className={styles.modalButtonSave} onClick={handleUpdateTipoDocumento}>
                                Actualizar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button className={styles.clearButtonModal} onClick={handleClearTipoDocumento}>
                                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button className={styles.modalButtonExit}
                                onClick={() => {
                                    setModalTipoDocumentoOpen(false);
                                    handleClearTipoDocumento();
                                }}
                            >
                                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Actualizar Perfil */}
            {isPerfilModalOpen && (
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

                        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Actualizar Perfil</h2>

                        <div className={styles.modalFormGroup}>
                            <label htmlFor="BuscarPerfil" className={styles.labelModal}>Buscar Perfil</label>
                            <input
                                className={styles.inputModalBuscar}
                                type="text"
                                id="BuscarPerfil"
                                placeholder="Buscar Perfil"
                                value={perfilFiltro}
                                onChange={(e) => setPerfilFiltro(e.target.value)}
                            />
                        </div>
                        {perfilFiltro.trim() !== "" && (
                            <ul className={styles.listaResultados}>
                                {perfiles
                                    .filter((perfil) =>
                                        perfil.nombrePerfil.toLowerCase().includes(perfilFiltro.toLowerCase())
                                    )
                                    .map((perfil) => (
                                        <li
                                            key={perfil.idPerfil}
                                            onClick={() => {
                                                setPerfilNombre(perfil.nombrePerfil);
                                                setPerfilDescripcion(perfil.descripcion);
                                                setPerfilIdSeleccionado(perfil.idPerfil);
                                            }}
                                        >
                                            {perfil.nombrePerfil}
                                        </li>
                                    ))}
                            </ul>
                        )}

                        <div className={styles.modalFormGroup}>
                            <label htmlFor="NombrePerfil" className={styles.labelModal}>Nombre Perfil</label>
                            <input
                                type="text"
                                id="NombrePerfil"
                                placeholder="Nombre del Perfil (Obligatorio)"
                                value={perfilNombre}
                                onChange={(e) => setPerfilNombre(e.target.value)}
                            />
                        </div>

                        <div className={styles.modalFormGroup}>
                            <label htmlFor="DescripcionPerfil" className={styles.labelModal}>Descripción Perfil</label>
                            <p className={styles.charCounter}>
                                Caracteres Restantes: {caracteresRestantesPerfil}
                            </p>
                            <textarea
                                id="DescripcionPerfil"
                                placeholder="Descripción del Perfil (Obligatorio)"
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
                                onClick={handleUpdatePerfil}>
                                Actualizar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
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
            )}

            {/* Modal Actualizar Rol */}
            {isRolModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.modalCloseButton}
                            onClick={() => {
                                setRolModalOpen(false);
                                handleClearRol();
                            }}
                        >
                            <CloseIcon />
                        </button>

                        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Actualizar Rol</h2>
                        <div className={styles.modalFormGroup}>
                            <div className={styles.selectGroupRol}>
                                <div className={styles.formGroupRol}>
                                    <label htmlFor="PerfilRol" className={styles.labelModal}>Seleccione un Perfil para asignarlo al Rol (Obligatorio)</label>
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
                                <ul className={styles.listaResultados}>
                                    {roles
                                        .filter((rol) =>
                                            rol.nombreRol.toLowerCase().includes(rolFiltro.toLowerCase())
                                        )
                                        .map((rol) => (
                                            <li
                                                key={rol.idRol}
                                                onClick={() => {
                                                    {/*alert("Seleccionaste: " + rol.nombreRol);*/ }
                                                    {/*console.log("ROL ID:", rol.idRol);*/ }
                                                    setRolNombre(rol.nombreRol);
                                                    setRolDescripcion(rol.descripcion);
                                                    setRolIdSeleccionado(rol.idRol); // asegúrate que sea ID
                                                }}
                                            >
                                                {rol.nombreRol}
                                            </li>
                                        ))}
                                </ul>
                            )}
                            <div className={styles.modalFormGroup}>
                                <label htmlFor="NombreRol" className={styles.labelModal}>Nombre Rol</label>
                                <input
                                    type="text"
                                    id="NombreRol"
                                    placeholder="Nombre del Rol (Obligatorio)"
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
                                    placeholder="Descripción del Rol (Obligatorio)"
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
                                    onClick={handleUpdateRol}>
                                    Actualizar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                                </button>
                                <button className={styles.clearButtonModal}
                                    onClick={handleClearRol}>
                                    Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                                </button>
                                <button className={styles.modalButtonExit}
                                    onClick={() => {
                                        setRolModalOpen(false);
                                        handleClearRol();
                                    }}
                                >
                                    Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UpdateUsers