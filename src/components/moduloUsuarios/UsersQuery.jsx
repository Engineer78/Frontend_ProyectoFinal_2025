import { useState } from "react";
import Header from "../Header";
import styles from "../../styles/usersquery.module.css";
import { Link } from "react-router-dom";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import axios from "axios";

// Crear instancia de Axios con la URL base del backend para facilitar las solicitudes HTTP
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Declarar el componente UsersQuery como función flecha para mayor consistencia con el estilo del proyecto
const UsersQuery = () => {

 // 1) Definición de estados principales del componente
//    - activeTab: controla la pestaña activa
const [activeTab, setActiveTab] = useState("consulta");

//    - isSearching: indica si se está realizando una búsqueda
const [isSearching, setIsSearching] = useState(false);

//    - filters: contiene los filtros de búsqueda de usuarios
const [filters, setFilters] = useState({
  numeroDocumento: '',
  nombreTipoDocumento: '',
  nombreUsuario: '',
  nombreRol: '',
  nombres: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  telefonoMovil: '',
  direccionResidencia: '',
  contactoEmergencia: '',
  telefonoContacto: '',
});

//    - data: almacena los resultados de la búsqueda
const [data, setData] = useState([]);

//    - selectedUser: usuario seleccionado actualmente
const [selectedUser, setSelectedUser] = useState(null);




  

  // Cambia la pestaña activa al hacer clic en una opción
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  // Estado para mostrar los datos del usuario seleccionado en los inputs deshabilitados
  const [HeaderInputs, setHeaderInputs] = useState({
    numeroDocumento: "",
    tipoDocumento : "",
    nombreUsuario: "",
    rol: "",
    nombreCompletos: "",
    telefono: "",
    direccion: "",
    contactoEmergencia: "",
    telefonoContacto: "",
  });

  // Limpia los filtros, los campos de entrada del encabezado y la tabla de resultados.
  // También reinicia el estado de búsqueda.
  const handleClear = () => {
    setFilters({
      numeroDocumento: "",
      tipoDocumento : "",
      nombreUsuario: "",
      rol: "",
      nombreCompletos: "",
      telefono: "",
      direccion: "",
      contactoEmergencia: "",
      telefonoContacto: "",
    });
    setIsSearching(false);
    setHeaderInputs({
      numeroDocumento: "",
      tipoDocumento : "",
      nombreUsuario: "",
      rol: "",
      nombreCompletos: "",
      telefono: "",
      direccion: "",
      contactoEmergencia: "",
      telefonoContacto: "",
    });
  };
  // Actualiza los filtros al escribir en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    if (!isSearching) setIsSearching(true);
}; 

// Carga los datos de los usuarios seleccionados en los filtros e inputs
const handleRowClick = (users) => {
    setFilters({
        numeroDocumento: users.numeroDocumento || '',
        tipoDocumento: users.tipoDocumento || '',
        nombreUsuario: users.nombreUsuario || '',
        rol: users.rol || '',
        nombreCompletos: users.nombreCompletos| '',
        telefono: users. telefono || '',
        direccion: users.direccion || '',
        contactoEmergencia: users.contactoEmergencia|| '',
        telefonoContacto: users.telefonoContacto || '',
    });

    setHeaderInputs({
        numeroDocumento: users.numeroDocumento || '',
        tipoDocumento: users.tipoDocumento || '',
        nombreUsuario: users.nombreUsuario || '',
        rol: users.rol || '',
        nombreCompletos: users.nombreCompletos| '',
        telefono: users. telefono || '',
        direccion: users.direccion || '',
        contactoEmergencia: users.contactoEmergencia|| '',
        telefonoContacto: users.telefonoContacto || '',
    });
};

  // Renderiza la vista principal del módulo de consulta de usuarios:
  // Incluye el header reutilizable, pestañas de navegación, tabla con filtros,
  return (
    <div className={styles.scrollContainer}>
      {/*Reutilizando el componenete Header.jsx de forma dinamica mediante routes-Dom.js*/}
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
          className={`${styles.tabButton} ${
            activeTab === "registro" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("registro")}
        >
          Registrar Usuarios
        </Link>

        <Link
          to="/users-query"
          className={`${styles.tabButton} ${
            activeTab === "consulta" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("consulta")}
        >
          Consultar Usuarios
        </Link>

        <Link
          to="/update-users"
          className={`${styles.tabButton} ${
            activeTab === "actualizar" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("actualizar")}
        >
          Actualizar Usuarios
        </Link>

        <Link
          to="/delete-users"
          className={`${styles.tabButton} ${
            activeTab === "eliminar" ? styles.active : ""
          }`}
          onClick={() => handleTabClick("eliminar")}
        >
          Eliminar Usuarios
        </Link>
      </div>
      {/* Contenido dependiendo de la pestaña activa */}
      <div className={styles.container}>
        <h2 className={styles.title}>
          Ingrese el Número de Identificación para realizar la
          consulta
        </h2>
      </div>
      {/* Tabla de consulta de usuarios */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              Selección
              <input type="checkbox" disabled />
            </th>

            <th>
              N° de Documento
              <input
                type="text"
                name="numeroDocumento"
                value={filters.numeroDocumento} // Vincula el valor con el estado de los filtros
                onChange={handleInputChange}
                placeholder="Buscar"
                style={{ fontStyle: "italic" }} // Esto aplica directamente el estilo en línea
              />
            </th>
            <th>
              Tipo de Documento
              <input
                type="text"
                name="tipoDocumento"
                /*value={selectedUser ? selectedUser.cantidad : ''}*/
                disabled
                placeholder="..."
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Nombre de Usuario
              <input
                type="text"
                name="nombreUsuario"
                /*value={selectedUser ? selectedUser.cantidad : ''}*/
                disabled
                placeholder="..."
                style={{ fontStyle: "italic" }}
              />
            </th>
            <th>
              Rol
              <input
                type="text"
                name="rol"
                /*value={selectedUser ? selectedUser.cantidad : ''}*/
                disabled
                placeholder="..."
                style={{ fontStyle: "italic" }}
              />
            </th>

            <th>
              Nombre(s) Completos
              <input
                type="text"
                name="nombreCompletos"
                /*value={selectedUser ? selectedUser.cantidad : ''}*/
                disabled
                placeholder="..."
                style={{ fontStyle: "italic" }}
              />
            </th>

            <th>
              Teléfono
              <input
                type="text"
                name="telefono"
                /*value={selectedUser  ? selectedUser.cantidad : ''}*/
                disabled
                placeholder="..."
                style={{ fontStyle: "italic" }}
              />
            </th>

            <th>
              Dirección
              <input
                type="text"
                name="direccion"
                /*value={selectedUser ? selectedUser.valorUnitarioProducto : ''}*/
                disabled
                placeholder="..."
                style={{ fontStyle: "italic" }}
              />
            </th>

            <th>
              Contacto de Emergencia
              <input
                type="text"
                name="contactoEmergencia"
                /*value={selectedUser  ? selectedUser.nombreProveedor : ''}*/
                disabled
                placeholder="..."
                style={{ fontStyle: "italic" }}
              />
            </th>

            <th>
              Teléfono de Contacto
              <input
                type="text"
                name="telefonoContacto"
                /*value={selectedUser ? selectedUser.nitProveedor : ''}*/
                disabled
                placeholder="..."
                style={{ fontStyle: "italic" }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {isSearching ? (
            data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{item.numeroDocumento}</td>
                  <td>{item.rol}</td>
                  <td>{item.nombreCompletos}</td>
                  <td>{item.telefono}</td>
                  <td>{item.direccion}</td>
                  <td>{item.contactoEmergencia}</td>
                  <td>{item.telefonoContacto}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No se encontraron resultados</td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan="10">Realiza una búsqueda para ver los registros</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Botones de acción */}
      <div className={styles.actionButtons}>
        {/*Botón para limpiar los inputs */}
        <button type="button" onClick={handleClear} className={styles.clearButton}>
          Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
        </button>
        {/*Botón para salir al modulo principal */}
        <button
          type="button"
          onClick={() => (window.location.href = "/menu-principal")}
          className={styles.exitButton}
        >
          Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
        </button>
      </div>
    </div>
  );
}

export default UsersQuery;
