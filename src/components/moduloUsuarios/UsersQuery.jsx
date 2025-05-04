import { useState, useEffect } from "react";
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

  //    - currentPage: controla la página actual de la tabla
  //    - rowsPerPage: número de filas por página
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // 2) Función para cambiar entre pestañas
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // 3) Efecto combinado para manejar la búsqueda dinámica y la selección de usuarios
  useEffect(() => {
    console.log('Ejecutando fetchData con filtros:', filters);

    // Verificar si no hay filtros activos
    const noFilters = Object.values(filters).every(v => !v);

    // Si no hay filtros o no se está buscando, limpiar los datos
    if (!isSearching || noFilters) {
      setData([]);
      setSelectedUser(null);
      ({
        nombreTipoDocumento: "",
        nombreUsuario: "",
        rol: "",
        nombreCompletos: "",
        telefono: "",
        direccion: "",
        contactoEmergencia: "",
        telefonoContacto: "",
      });
      return;
    }

    // Función para obtener los datos desde la API
    const fetchData = async () => {
      try {

        // Construir el nombre completo del usuario a partir de nombres y apellidos
        const nombreCompletos = `${filters.nombres} ${filters.apellidoPaterno} ${filters.apellidoMaterno}`.trim();

        // Hacer la solicitud a la API con los filtros actuales
        const response = await api.get(`/empleados`, {
          params: {
            nombreTipoDocumento: filters.nombreTipoDocumento || null,
            nombreUsuario: filters.nombreUsuario || null,
            rol: filters.rol || null,
            nombreCompletos: nombreCompletos || null,
            telefono: filters.telefonoMovil || null,
            direccion: filters.direccionResidencia || null,
            contactoEmergencia: filters.contactoEmergencia || null,
            telefonoContacto: filters.telefonoContacto || null,
          }
        });

        let lista = response.data || [];

        // Filtrar en frontend por número de documento si se proporcionó      
        if (filters.numeroDocumento) {
          lista = lista.filter(p =>
            p.numeroDocumento?.toString().includes(filters.numeroDocumento)
          );
        }

        // Actualizar el estado con la lista de resultados
        setData(lista);

        setCurrentPage(1); // Reinicia la paginación al hacer una búsqueda nueva

        // Si hay solo un resultado, seleccionarlo automáticamente
        setSelectedUser(lista.length === 1 ? lista[0] : null);

        // Lógica adicional: si hay filtros activos y resultados, mostrar el primer usuario en los inputs
        const hasActiveFilters = filters.numeroDocumento.trim() !== "";
        const itemsToShow = lista;

        // Si hay resultados, mostrar el primero en los campos deshabilitados
        if (hasActiveFilters && itemsToShow.length > 0) {
          const firstItem = itemsToShow[0];
          setSelectedUser({
            nombreTipoDocumento: firstItem.nombreTipoDocumento || "",
            nombreUsuario: firstItem.nombreUsuario || "",
            nombreRol: firstItem.nombreRol || "",
            nombres: `${firstItem.nombres} ${firstItem.apellidoPaterno} ${firstItem.apellidoMaterno}`.trim() || "",
            telefonoMovil: firstItem.telefonoMovil || "",
            direccionResidencia: firstItem.direccionResidencia || "",
            contactoEmergencia: firstItem.contactoEmergencia || "",
            telefonoContacto: firstItem.telefonoContacto || "",
          });
        } else {

          // Si no hay resultados, limpiar los campos de selección
          setSelectedUser({
            tipoDocumento: "",
            nombreUsuario: "",
            rol: "",
            nombresCompletos: "",
            telefono: "",
            direccion: "",
            contactoEmergencia: "",
            telefonoContacto: "",
          });
        }

      } catch (error) {
        console.error('Error al obtener datos:', error);

        // En caso de error, limpiar estados
        setData([]);
        setSelectedUser(null);
        ({
          tipoDocumento: "",
          nombreUsuario: "",
          rol: "",
          nombresCompletos: "",
          telefono: "",
          direccion: "",
          contactoEmergencia: "",
          telefonoContacto: "",
        });
      }
    };

    // Ejecutar la función de búsqueda
    fetchData();
  }, [filters, isSearching]);

  // 4) Handlers
  // Actualiza los filtros de búsqueda mientras el usuario escribe
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (!isSearching) setIsSearching(true);
  };

  // Selecciona un usuario al hacer clic en una fila y muestra solo ese usuario
  const handleRowClick = (item) => {
    setSelectedUser(item);
    setData([item]); // Mostrar solo el usuario seleccionado
  };

  // Limpia los filtros, detiene la búsqueda y deselecciona el usuario actual
  const handleClear = () => {
    setFilters({
      numeroDocumento: '',
      tipoDocumento: '',
      nombreUsuario: '',
      rol: '',
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefonoMovil: '',
      direccionResidencia: '',
      contactoEmergencia: '',
      telefonoContacto: '',
    });
    setIsSearching(false);
    setSelectedUser(null);
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
          className={`${styles.tabButton} ${activeTab === "registro" ? styles.active : ""
            }`}
          onClick={() => handleTabClick("registro")}
        >
          Registrar Usuarios
        </Link>
        <Link
          to="/users-query"
          className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""
            }`}
          onClick={() => handleTabClick("consulta")}
        >
          Consultar Usuarios
        </Link>
        <Link
          to="/update-users"
          className={`${styles.tabButton} ${activeTab === "actualizar" ? styles.active : ""
            }`}
          onClick={() => handleTabClick("actualizar")}
        >
          Actualizar Usuarios
        </Link>
        <Link
          to="/delete-users"
          className={`${styles.tabButton} ${activeTab === "eliminar" ? styles.active : ""
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
      {/*  {/* Etiqueta de paginación con total de registros y filas por página */}
      <div className={styles.topTableRow}>
      <p className={styles.labelPagination}>
        Total registros: {data.length} | Rows per page: {rowsPerPage}
      </p>
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
                value={filters.numeroDocumento || ""} // Vincula el valor con el estado de los filtros
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
                value={selectedUser ? selectedUser.nombreTipoDocumento : ""}
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
                value={selectedUser ? selectedUser.nombreUsuario : ''}
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
                value={selectedUser ? selectedUser.nombreRol : ""}
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
                value={selectedUser ? [selectedUser.nombres, selectedUser.apellidoPaterno, selectedUser.apellidoMaterno].filter(Boolean).join(" ") : ""}
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
                value={selectedUser ? selectedUser.telefonoMovil : ""}
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
                value={selectedUser ? selectedUser.direccionResidencia : ""}
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
                value={selectedUser ? selectedUser.contactoEmergencia : ""}
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
                value={selectedUser ? selectedUser.telefonoContacto : ""}
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
              data
                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((item, index) => (
                  <tr
                    key={item.idEmpleado || index} // Usa el idEmpleado o, si no, el índice
                    onClick={() => handleRowClick(item)} // Al hacer click, selecciona el usuario
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{item.numeroDocumento}</td>
                    <td>{item.nombreTipoDocumento}</td>
                    <td>{item.nombreUsuario}</td>
                    <td>{item.nombreRol}</td>
                    <td>{`${item.nombres} ${item.apellidoPaterno} ${item.apellidoMaterno}`.trim()}</td>
                    <td>{item.telefonoMovil}</td>
                    <td>{item.direccionResidencia}</td>
                    <td>{item.contactoEmergencia}</td>
                    <td>{item.telefonoContacto}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No se encontraron resultados
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                Realiza una búsqueda para ver los registros
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Paginación Table */}
      {isSearching && data.length > rowsPerPage && (
        <div className={styles.pagination}>
          <button
            className={styles.circleButton}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &#x276E; {/* flecha izquierda */}
          </button>

          {Array.from({ length: Math.ceil(data.length / rowsPerPage) }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          ))}

          <button
            className={styles.circleButton}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
            disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
          >
            &#x276F; {/* flecha derecha */}
          </button>
        </div>
      )}

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
