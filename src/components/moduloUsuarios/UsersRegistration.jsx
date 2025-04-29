import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Header from "../Header";
import styles from "../../styles/usersRegistration.module.css";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import {
    listarPerfiles,
    crearPerfil,
    listarRoles,
    crearRol,
    listarTiposDocumento,
    crearEmpleado
} from "../../api"; // Asegúrate de que la ruta sea correcta

// se crea el componente UsersRegistration
const UsersRegistration = () => {

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

    const [activeTab, setActiveTab] = useState("registro");

    // Estados de modal Perfil
    const [isPerfilModalOpen, setPerfilModalOpen] = useState(false);
    const [perfilNombre, setPerfilNombre] = useState("");
    const [perfilDescripcion, setPerfilDescripcion] = useState("");
    const [perfilFiltro, setPerfilFiltro] = useState("");
    const [perfilSeleccionado, setPerfilSeleccionado] = useState("");
    const [perfiles, setPerfiles] = useState([]);

    // Estados de modal Rol
    const [isRolModalOpen, setRolModalOpen] = useState(false);
    const [rolNombre, setRolNombre] = useState("");
    const [rolDescripcion, setRolDescripcion] = useState("");
    const [rolFiltro, setRolFiltro] = useState("");
    const [roles, setRoles] = useState([]);

    // Estados de modal tipo de documento
    const [isModalTipoDocumentoOpen, setModalTipoDocumentoOpen] = useState(false);
    const [codigoTipoDocumento, setCodigoTipoDocumento] = useState("");
    const [nombreTipoDocumento, setNombreTipoDocumento] = useState("");


    // Se define la función para abrir los modales de crear perfil y rol
    const handleOpenModalPerfil = () => {
        setPerfilModalOpen(true);
    };

    const handleOpenModalRol = () => {
        setRolModalOpen(true);
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

    // Guardar Perfil
    const handleSavePerfil = async () => {

        // Validar que el nombre y la descripción no estén vacíos
        // Si están vacíos, mostrar un mensaje de alerta y no continuar con la creación del perfil
        if (!perfilNombre.trim() || !perfilDescripcion.trim()) {
            alert("⚠️ Por favor completa el nombre y la descripción del perfil antes de guardar.");
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

    // Guardar Rol
    const handleSaveRol = async () => {
        if (!rolNombre.trim() || !rolDescripcion.trim() || !perfilSeleccionado) {
            alert("⚠️ Por favor completa todos los campos del rol antes de guardar.");
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
    };

    // Función para limpiar los campos dentro del modal para crear roles.
    const handleClearRol = () => {
        setRolNombre("");
        setRolDescripcion("");
        setRolFiltro("");
        setPerfilSeleccionado("");
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
                    to="/users-registration"
                    className={`${styles.tabButton} ${activeTab === "registro" ? styles.active : ""}`}
                    onClick={() => handleTabClick("registro")}
                >
                    Registrar Usuarios
                </Link>

                <Link
                    to="/users-query"
                    className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""}`}
                    onClick={() => handleTabClick("consulta")}
                >
                    Consultar Usuarios
                </Link>

                <Link
                    to="/update-users"
                    className={`${styles.tabButton} ${activeTab === "actualizar" ? styles.active : ""}`}
                    onClick={() => handleTabClick("actualizar")}
                >
                    Actualizar Usuarios
                </Link>

                <Link
                    to="/delete-users"
                    className={`${styles.tabButton} ${activeTab === "eliminar" ? styles.active : ""}`}
                    onClick={() => handleTabClick("eliminar")}
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
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Contraseña:</label>
                            <input
                                type="text"
                                placeholder="Contraseña (Obligatorio)"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                                required
                                className={styles.input}
                                style={{ fontStyle: 'italic' }}
                            />

                            <label className={styles.inputLabel}>Teléfono Móvil:</label>
                            <input
                                type="text"
                                placeholder="Teléfono Móvil (Obligatorio)"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                                required
                                className={styles.input}
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
                                style={{ fontStyle: 'italic' }}
                            />
                        </form>

                        <form className={styles.formRight}>
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
                            <button type="button"
                                className={styles.createButton}
                                onClick={handleOpenModalPerfil}
                            >
                                Perfil <AddIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button type="button"
                                className={styles.createButton}
                                onClick={handleOpenModalRol}
                            >
                                Roles<AddIcon style={{ marginLeft: 8 }} />
                            </button>
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
            {/* Modal Crear Perfil */}
            {isPerfilModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.modalCloseButton} onClick={() => setPerfilModalOpen(false)}>
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
                            <textarea
                                id="DescripcionPerfil"
                                placeholder="Descripción"
                                value={perfilDescripcion}
                                onChange={(e) => setPerfilDescripcion(e.target.value)}
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
                                onClick={() => setPerfilModalOpen(false)}>
                                Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Crear Rol */}
            {isRolModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.modalCloseButton} onClick={() => setRolModalOpen(false)}>
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
                                            <option value="">Seleccionar perfil</option>
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
                                <textarea
                                    id="DescripcionRol"
                                    placeholder="Descripción"
                                    value={rolDescripcion}
                                    onChange={(e) => setRolDescripcion(e.target.value)}
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
                                    onClick={() => setRolModalOpen(false)}>
                                    Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UsersRegistration