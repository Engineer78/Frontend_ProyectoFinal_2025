import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Header from "../Header";
import styles from "../../styles/usersRegistration.module.css";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";

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
    const [documentType, setDocumentType] = useState("");
    const [rolType, setRolType] = useState("");
    const [activeTab, setActiveTab] = useState("registro");

    // Estados de modal Perfil
    const [isPerfilModalOpen, setPerfilModalOpen] = useState(false);
    const [perfilNombre, setPerfilNombre] = useState("");
    const [perfilDescripcion, setPerfilDescripcion] = useState("");
    const [perfilFiltro, setPerfilFiltro] = useState("");
    const [perfiles, setPerfiles] = useState([]);

    // Estados de modal Rol
    const [isRolModalOpen, setRolModalOpen] = useState(false);
    const [rolNombre, setRolNombre] = useState("");
    const [rolDescripcion, setRolDescripcion] = useState("");
    const [rolFiltro, setRolFiltro] = useState("");
    const [roles, setRoles] = useState([]);

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

    // Se define una función para validar los campos vacios del formulario.
    {/*const validateFields = () => {
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
    };*/}

    // Limpiar el formulario
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

    // Se utiliza el hook useEffect para establecer la pestaña activa al cargar el componente 
    // y los hooks basicos para cargar perfiles y roles.
    useEffect(() => {
        setActiveTab("registro");
        cargarPerfiles();
        cargarRoles();
    }, []);

    // Cargar Perfiles existentes
    const cargarPerfiles = async () => {
        try {
            const response = await axios.get("/api/perfiles/buscar");
            setPerfiles(response.data);
        } catch (error) {
            console.error("Error cargando perfiles:", error);
        }
    };

    // Cargar Roles existentes
    const cargarRoles = async () => {
        try {
            const response = await axios.get("/api/roles/buscar");
            setRoles(response.data);
        } catch (error) {
            console.error("Error cargando roles:", error);
        }
    };

    // Guardar Perfil
    const handleSavePerfil = async () => {
        try {
            await axios.post("/api/perfiles", { nombrePerfil: perfilNombre, descripcion: perfilDescripcion });
            cargarPerfiles();
            setPerfilNombre("");
            setPerfilDescripcion("");
            setPerfilModalOpen(false);
        } catch (error) {
            console.error("Error guardando perfil:", error);
        }
    };

    // Guardar Rol
    const handleSaveRol = async () => {
        try {
            await axios.post("/api/roles", { nombreRol: rolNombre, descripcion: rolDescripcion });
            cargarRoles();
            setRolNombre("");
            setRolDescripcion("");
            setRolModalOpen(false);
        } catch (error) {
            console.error("Error guardando rol:", error);
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
                                            <option value="CC">Cédula de Ciudadanía (CC)</option>
                                            <option value="CE">Cédula de Extranjería (CE)</option>
                                            <option value="PAS">Pasaporte (PA)</option>
                                            <option value="TI">Tarjeta de Identidad (TI)</option>
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
                            <button type="button"
                                className={styles.createButton}
                                onClick={handleOpenModalPerfil}
                            >
                                <AddIcon style={{ marginLeft: 8 }} /> Crear Perfil
                            </button>
                            <button type="button"
                                className={styles.createButton}
                                onClick={handleOpenModalRol}
                            >
                                <AddIcon style={{ marginLeft: 8 }} /> Crear Rol
                            </button>
                        </form>
                    </div>

                    {/* Botones Acción */}
                    <div className={styles.actionButtons}>
                        <button type="button" /*onClick={handleSave}*/ className={styles.saveButton}>
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
                        <h2>Crear Perfil</h2>
                        <input type="text" placeholder="Buscar Perfil" value={perfilFiltro} onChange={(e) => setPerfilFiltro(e.target.value)} />
                        <input type="text" placeholder="Nombre del Perfil" value={perfilNombre} onChange={(e) => setPerfilNombre(e.target.value)} />
                        <textarea placeholder="Descripción" value={perfilDescripcion} onChange={(e) => setPerfilDescripcion(e.target.value)} />
                        <ul>
                            {Array.isArray(perfiles) && perfiles.filter((perfil) =>
                                perfil.nombrePerfil.toLowerCase().includes(perfilFiltro.toLowerCase())
                            ).map((perfil) => (
                                <li key={perfil.idPerfil}>{perfil.nombrePerfil}</li>
                            ))}
                        </ul>
                        <div className="style.modalButtons">
                            <button className={styles.modalButtonSave}
                                onClick={handleSavePerfil}>
                                Guardar
                            </button>
                            <button className={styles.modalButtonExit}
                                onClick={() => setPerfilModalOpen(false)}>
                                Salir
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
                        <h2>Crear Rol</h2>
                        <input type="text" placeholder="Buscar Rol" value={rolFiltro} onChange={(e) => setRolFiltro(e.target.value)} />
                        <input type="text" placeholder="Nombre del Rol" value={rolNombre} onChange={(e) => setRolNombre(e.target.value)} />
                        <textarea placeholder="Descripción" value={rolDescripcion} onChange={(e) => setRolDescripcion(e.target.value)} />
                        <ul>
                            {Array.isArray(roles) && roles.filter((rol) =>
                                rol.nombreRol.toLowerCase().includes(rolFiltro.toLowerCase())
                            ).map((rol) => (
                                <li key={rol.idRol}>{rol.nombreRol}</li>
                            ))}
                        </ul>
                        <div className="style.modalButtons">
                            <button className={styles.modalButtonSave}
                                onClick={handleSaveRol}>
                                Guardar
                            </button>
                            <button className={styles.modalButtonExit}
                                onClick={() => setRolModalOpen(false)}>
                                Salir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UsersRegistration