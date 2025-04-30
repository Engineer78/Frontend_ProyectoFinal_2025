import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Header from "../Header";
import styles from "../../styles/UpdateUsers.module.css";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import {
    listarPerfiles,
    listarRoles,
    listarTiposDocumento,
    actualizarPerfil,
    actualizarRol,
    actualizarTipoDocumento,
    actualizarEmpleadoPorDocumento
} from "../../api"; // Asegúrate de que la ruta sea correcta
import { buscarEmpleadoPorDocumento } from "../../api";


const UpdateUsers = () => {

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



    // Se define la función para abrir los modales de crear perfil, rol y tipo documento
    const handleOpenModalPerfil = () => {
        setPerfilModalOpen(true);
    };

    const handleOpenModalRol = () => {
        setRolModalOpen(true);
    };

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
            setUserNames(empleado.nombres || "");
            setUserLastName(empleado.apellidoPaterno || "");
            setUserSecondLastName(empleado.apellidoMaterno || "");
            setUserAlias(empleado.nombreUsuario || "");
            setUserPassword(""); // No cargamos la contraseña
            setUserPhone(empleado.telefonoMovil || "");
            setUserAddress(empleado.direccionResidencia || "");
            setUserEmergencyContact(empleado.contactoEmergencia || "");
            setUserContactPhone(empleado.telefonoContacto || "");
            setDocumentType(empleado.idtipoDocumento?.toString() || "");
            setRolType(empleado.idRol?.toString() || "");

            // Relacionar selects
            setDocumentType(empleado.idtipoDocumento); // ID
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

        try {
            const updatedEmpleado = {
                numeroDocumento: userID,
                nombres: userName,
                apellidoPaterno: userLastName,
                apellidoMaterno: userSecondLastName,
                nombreUsuario: userAlias,
                contraseñaUsuario: userPassword, // Esta sí sew envía
                telefonoMovil: userPhone,
                direccionResidencia: userAddress,
                contactoEmergencia: userEmergencyContact,
                telefonoContacto: userContactPhone,
                idRol: parseInt(rolType),
                idtipoDocumento: parseInt(documentType)
            };

            const response = await actualizarEmpleadoPorDocumento(userID, updatedEmpleado);

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
        if (!perfilNombre.trim() || !perfilDescripcion.trim()) {
            alert("⚠️ Completa todos los campos del perfil.");
            return;
        }

        try {
            const perfil = perfiles.find(p => p.nombrePerfil.toLowerCase() === perfilNombre.toLowerCase());

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

        try {
            const doc = documentTypes.find(d => d.nombre === nombreTipoDocumento);

            if (!doc) {
                alert("⚠️ No se encontró el tipo de documento.");
                return;
            }

            await actualizarTipoDocumento(doc.idTipoDocumento, {
                codigo: codigoTipoDocumento,
                nombre: nombreTipoDocumento
            });

            await cargarTiposDocumento();
            alert("✅ Tipo de documento actualizado.");
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

        try {
            const rol = roles.find(r => r.nombreRol.toLowerCase() === rolNombre.toLowerCase());

            if (!rol) {
                alert("⚠️ No se encontró el rol a actualizar.");
                return;
            }

            await actualizarRol(rol.idRol, {
                nombreRol: rolNombre,
                descripcion: rolDescripcion,
                perfilId: perfilSeleccionado,
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
    };

    // Función para limpiar los campos dentro del modal para crear roles.
    const handleClearRol = () => {
        setRolNombre("");
        setRolDescripcion("");
        setRolFiltro("");
        setPerfilSeleccionado("");
    };

    // Función para limpiar los campos dentro del modal para crear tipos de documento.
    const handleClearTipoDocumento = () => {
        setCodigoTipoDocumento("");
        setNombreTipoDocumento("");
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

    useEffect(() => {
        setActiveTab('actualizar');
    }, []);

    // Componente para actualizar productos del inventario.
    // Incluye navegación entre pestañas, formulario de búsqueda y edición de producto,
    // carga de imagen, y botones para guardar, limpiar o salir.
    return (
        <div className={styles.containerPrincipal}>
            {/* Encabezado del módulo */}
            <Header
                title="Módulo registro de usuarios"
                subtitle="Hardware Store Inventory FFIG"
                showLogo={true}
                showHelp={true}
            />

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
                            //disabled={isCodeDisabled} // Deshabilita el input si se busca un producto
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
                            />

                            <label className={styles.inputLabel}>Primer Apellido:</label>
                            <input
                                type="text"
                                placeholder="Primer Apellido (Obligatorio)"
                                value={userLastName}
                                onChange={(e) => setUserLastName(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Segundo Apellido :</label>
                            <input
                                type="text"
                                placeholder="Segundo Apellido (Opcional)"
                                value={userSecondLastName}
                                onChange={(e) => setUserSecondLastName(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Nombre de Usuario:</label>
                            <input
                                type="text"
                                placeholder="Nombre de Usuario (Obligatorio)"
                                value={userAlias}
                                onChange={(e) => setUserAlias(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Contraseña:</label>
                            <input
                                type="text"
                                placeholder="Contraseña (Obligatorio)"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Teléfono Móvil:</label>
                            <input
                                type="text"
                                placeholder="Teléfono Móvil (Obligatorio)"
                                value={userPhone}
                                onChange={(e) => setUserPhone(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Dirección de Residencia:</label>
                            <input
                                type="text"
                                placeholder="Dirección de Residencia (Obligatorio)"
                                value={userAddress}
                                onChange={(e) => setUserAddress(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Contacto de Emergencia:</label>
                            <input
                                type="text"
                                placeholder="Contacto de Emergencia (Obligatorio)"
                                value={userEmergencyContact}
                                onChange={(e) => setUserEmergencyContact(e.target.value)}
                                required
                                className={styles.input}
                            />

                            <label className={styles.inputLabel}>Teléfono de Contacto:</label>
                            <input
                                type="text"
                                placeholder="Teléfono de Contacto (Obligatorio)"
                                value={userContactPhone}
                                onChange={(e) => setUserContactPhone(e.target.value)}
                                required
                                className={styles.input}
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
                                            <option value="administrador">Administrador</option>
                                            <option value="almacenista">Almacenista</option>
                                            <option value="propietario">Propietario</option>
                                            <option value="vendedor">Vendedor</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            {/* Botones Abrir Modales */}
                            <div className={styles.formGroupButtos}>
                                <button
                                    className={styles.createButton}
                                    onClick={() => handleOpenModalTipoDocumento(true)}
                                >
                                    D.N.I&#8203;<AddIcon style={{ marginLeft: 8 }} />
                                </button>
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
                        <button className={styles.modalCloseButton} onClick={() => setModalTipoDocumentoOpen(false)}>
                            <CloseIcon />
                        </button>
                        <h2 style={{ textAlign: "center" }}>Crear Tipo de Documento</h2>
                        <div className={styles.modalFormGroup}>
                            <label>Código</label>
                            <input
                                type="text"
                                value={codigoTipoDocumento}
                                onChange={(e) => setCodigoTipoDocumento(e.target.value)}
                            />
                        </div>
                        <div className={styles.modalFormGroup}>
                            <label>Nombre</label>
                            <input
                                type="text"
                                value={nombreTipoDocumento}
                                onChange={(e) => setNombreTipoDocumento(e.target.value)}
                            />
                        </div>
                        <div className={styles.modalButtons}>
                            <button className={styles.modalButtonSave} onClick={handleUpdateTipoDocumento}>
                                Actualizar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button className={styles.clearButtonModal} onClick={handleClearTipoDocumento}>
                                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
                            </button>
                            <button className={styles.modalButtonExit} onClick={() => setModalTipoDocumentoOpen(false)}>
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
                        <button className={styles.modalCloseButton} onClick={() => setPerfilModalOpen(false)}>
                            <CloseIcon />
                        </button>

                        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Actualizar Perfil</h2>

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
                                onClick={handleUpdatePerfil}>
                                Actualizar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
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

            {/* Modal Actualizar Rol */}
            {isRolModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.modalCloseButton} onClick={() => setRolModalOpen(false)}>
                            <CloseIcon />
                        </button>

                        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Actualizar Rol</h2>
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
                                    onClick={handleUpdateRol}>
                                    Actualizar <SaveOutlinedIcon style={{ marginLeft: 8 }} />
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
        </div>
    );
}

export default UpdateUsers