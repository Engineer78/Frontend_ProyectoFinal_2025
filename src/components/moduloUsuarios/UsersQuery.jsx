import { useState, useEffect } from "react";
import { usePermisos } from "../../components/admin/PermisosContext";
import { Link } from "react-router-dom";
import Header from "../Header";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useInactivityLogout from "../../useInactivityLogout";
import useTokenAutoLogout from "../../useTokenAutoLogout";
import styles from "../../styles/usersquery.module.css";
import api from "../../api"; // Importar la instancia de API 


// Componente UsersQuery
// Este componente permite consultar usuarios registrados en el sistema
const UsersQuery = () => {

<<<<<<< HEAD
  // 1) Definición de estados principales del componente
  //    - activeTab: controla la pestaña activa
  const [activeTab, setActiveTab] = useState("consulta");

  //    - isSearching: indica si se está realizando una búsqueda
  const [isSearching, setIsSearching] = useState(false);

  //    - filters: contiene los filtros de búsqueda de usuarios
=======
  useInactivityLogout(); // Llamar al hook para manejar el logout por inactividad
  useTokenAutoLogout();  // Hook para expiración de token

  // Definición de estados principales del componente
  // activeTab: controla la pestaña activa
  const [activeTab, setActiveTab] = useState("consulta");

  // isSearching: indica si se está realizando una búsqueda
  const [isSearching, setIsSearching] = useState(false);

  // filters: contiene los filtros de búsqueda de usuarios
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
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
<<<<<<< HEAD

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
      setSelectedUser({
        nombreTipoDocumento: "",
        nombreUsuario: "",
        nombreRol: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        telefonoMovil: "",
        direccionResidencia: "",
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
            nombreTipoDocumento: "",
            nombreUsuario: "",
            nombreRol: "",
            nombres: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            telefonoMovil: "",
            direccionResidencia: "",
            contactoEmergencia: "",
            telefonoContacto: "",
          });
        }

      } catch (error) {
        console.error('Error al obtener datos:', error);

        // En caso de error, limpiar estados
        setData([]);
        setSelectedUser({
          nombreTipoDocumento: "",
          nombreUsuario: "",
          nombreRol: "",
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          telefonoMovil: "",
          direccionResidencia: "",
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
    setIsSearching(false);
    setSelectedUser(null);
  };
=======
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61

  const { tienePermiso } = usePermisos();

  // data: almacena los resultados de la búsqueda
  const [data, setData] = useState([]);

  // selectedUser: usuario seleccionado actualmente
  const [selectedUser, setSelectedUser] = useState(null);

  // currentPage: controla la página actual de la tabla
  // rowsPerPage: número de filas por página
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Función para cambiar entre pestañas
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Efecto combinado para manejar la búsqueda dinámica y la selección de usuarios
  useEffect(() => {
    console.log('Ejecutando fetchData con filtros:', filters);

    // Verificar si no hay filtros activos
    const noFilters = Object.values(filters).every(v => !v);

    // Si no hay filtros o no se está buscando, limpiar los datos
    if (!isSearching || noFilters) {
      setData([]);
      setSelectedUser({
        nombreTipoDocumento: "",
        nombreUsuario: "",
        nombreRol: "",
        nombres: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        telefonoMovil: "",
        direccionResidencia: "",
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
            nombreTipoDocumento: "",
            nombreUsuario: "",
            nombreRol: "",
            nombres: "",
            apellidoPaterno: "",
            apellidoMaterno: "",
            telefonoMovil: "",
            direccionResidencia: "",
            contactoEmergencia: "",
            telefonoContacto: "",
          });
        }

      } catch (error) {
        console.error('Error al obtener datos:', error);

        // En caso de error, limpiar estados
        setData([]);
        setSelectedUser({
          nombreTipoDocumento: "",
          nombreUsuario: "",
          nombreRol: "",
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          telefonoMovil: "",
          direccionResidencia: "",
          contactoEmergencia: "",
          telefonoContacto: "",
        });
      }
    };

    // Ejecutar la función de búsqueda
    fetchData();
  }, [filters, isSearching]);

  // Handlers
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
    setIsSearching(false);
    setSelectedUser(null);
  };

  // Renderiza el componente
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
<<<<<<< HEAD
          to="/users-registration"
          className={`${styles.tabButton} ${activeTab === "registro" ? styles.active : ""
            }`}
          onClick={() => handleTabClick("registro")}
=======
          to={tienePermiso("usuario:registrar") ? "/users-registration" : "#"}
          className={`${styles.tabButton} ${activeTab === "registro" ? styles.active : ""} ${!tienePermiso("usuario:registrar") ? styles.disabledTab : ""}`}
          onClick={(e) => {
            if (!tienePermiso("usuario:registrar")) e.preventDefault();
            else handleTabClick("registro");
          }}
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
        >
          Registrar Usuarios
        </Link>

        <Link
<<<<<<< HEAD
          to="/users-query"
          className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""
            }`}
          onClick={() => handleTabClick("consulta")}
=======
          to={tienePermiso("usuario:consultar") ? "/users-query" : "#"}
          className={`${styles.tabButton} ${activeTab === "consulta" ? styles.active : ""} ${!tienePermiso("usuario:consultar") ? styles.disabledTab : ""}`}
          onClick={(e) => {
            if (!tienePermiso("usuario:consultar")) e.preventDefault();
            else handleTabClick("consulta");
          }}
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
        >
          Consultar Usuarios
        </Link>

        <Link
<<<<<<< HEAD
          to="/update-users"
          className={`${styles.tabButton} ${activeTab === "actualizar" ? styles.active : ""
            }`}
          onClick={() => handleTabClick("actualizar")}
=======
          to={tienePermiso("usuario:editar") ? "/update-users" : "#"}
          className={`${styles.tabButton} ${activeTab === "actualizar" ? styles.active : ""} ${!tienePermiso("usuario:editar") ? styles.disabledTab : ""}`}
          onClick={(e) => {
            if (!tienePermiso("usuario:editar")) e.preventDefault();
            else handleTabClick("actualizar");
          }}
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
        >
          Actualizar Usuarios
        </Link>

        <Link
<<<<<<< HEAD
          to="/delete-users"
          className={`${styles.tabButton} ${activeTab === "eliminar" ? styles.active : ""
            }`}
          onClick={() => handleTabClick("eliminar")}
=======
          to={tienePermiso("usuario:eliminar") ? "/delete-users" : "#"}
          className={`${styles.tabButton} ${activeTab === "eliminar" ? styles.active : ""} ${!tienePermiso("usuario:eliminar") ? styles.disabledTab : ""}`}
          onClick={(e) => {
            if (!tienePermiso("usuario:eliminar")) e.preventDefault();
            else handleTabClick("eliminar");
          }}
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
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
<<<<<<< HEAD
=======

>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
      {/*  {/* Etiqueta de paginación con total de registros y filas por página */}
      <div className={styles.topTableRow}>
        <p className={styles.labelPagination}>
          Total registros: {data.length} | Filas por página {rowsPerPage}
        </p>
      </div>
<<<<<<< HEAD
=======

>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
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
<<<<<<< HEAD
=======

          {/* Muestra los resultados de la búsqueda o un mensaje si no hay resultados */}
>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
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
<<<<<<< HEAD
=======

>>>>>>> cd3f5be33869ab9d53e3e670a21974ec3fbc8b61
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
