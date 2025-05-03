import { useState, useEffect } from 'react';
import Header from '../Header';
import styles from '../../styles/merchandisequery.module.css';
import { Link } from 'react-router-dom';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SearchIcon from '@mui/icons-material/Search';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';

// Instancia de axios para tu API
const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

const MerchandiseQuery = () => {
  // 1) Estados principales
  const [activeTab, setActiveTab] = useState('consulta');
  const [filters, setFilters] = useState({
    codigoProducto: '',
    nombreCategoria: '',
    nombreProducto: '',
    nitProveedor: '',
    nombreProveedor: '',
    telefonoProveedor: '',
    direccionProveedor: '',
    cantidad: '',
    valorUnitarioProducto: '',
    valorTotalProducto: '',
  });
  const [data, setData] = useState([]);                  // Población de la tabla
  const [selectedProduct, setSelectedProduct] = useState(null); // Fila única o clickeada
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [searchMode, setSearchMode] = useState('normal');  // 'normal' o 'advanced'
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;


  // 2) Manejo de pestañas
  const handleTabClick = (tab) => setActiveTab(tab);

  // 3) Efecto combinado para fetch dinámico según modo de búsqueda
  useEffect(() => {
    const noFilters = Object.values(filters).every(v => !v);
    if (!isSearching || noFilters) {
      setData([]);
      setSelectedProduct(null);
      return;
    }

    const fetchData = async () => {
      try {
        let resp;

        // 4) Si los filtros principales están llenos, usar búsqueda normal
        if (filters.codigoProducto || filters.nombreCategoria || filters.nombreProducto) {
          resp = await api.get('/productos/buscar', {
            params: {
              nombreCategoria: filters.nombreCategoria || null,
              nombreProducto: filters.nombreProducto || null,
              nitProveedor: filters.nitProveedor || null,
              nombreProveedor: filters.nombreProveedor || null,
              telefonoProveedor: filters.telefonoProveedor || null,
              direccionProveedor: filters.direccionProveedor || null,
              cantidad: filters.cantidad || null,
              valorUnitarioProducto: filters.valorUnitarioProducto || null,
              valorTotalProducto: filters.valorTotalProducto || null,
            }
          });
        } else {
          // 5) Sino, usar búsqueda avanzada
          resp = await api.get('/productos/busqueda-avanzada', {
            params: {
              nitProveedor: filters.nitProveedor || null,
              nombreProveedor: filters.nombreProveedor || null,
              cantidad: filters.cantidad || null,
              valorUnitarioProducto: filters.valorUnitarioProducto || null,
              valorTotalProducto: filters.valorTotalProducto || null,
            }
          });
        }

        let lista = resp.data || [];

        // 6) Filtrado adicional por código en frontend si es necesario
        if (filters.codigoProducto) {
          lista = lista.filter(p =>
            p.codigoProducto.toString().includes(filters.codigoProducto)
          );
        }

        setData(lista);

        setCurrentPage(1); // Reinicia la paginación al hacer una búsqueda nueva


        // 7) Siempre tomar el primer resultado
        if (lista.length > 0) {
          setSelectedProduct(lista[0]);
        } else {
          setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setData([]);
        setSelectedProduct(null);
      }
    };


    fetchData();
  }, [filters, isSearching, searchMode]);

  // 8) Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (!isSearching) setIsSearching(true);
  };

  const handleRowClick = (item) => {
    setSelectedProduct(item);
    // 9) Cerrar modal avanzado
    setIsAdvancedSearchOpen(false);
  };

  const handleClear = () => {
    setFilters({
      codigoProducto: '',
      nombreCategoria: '',
      nombreProducto: '',
      nitProveedor: '',
      nombreProveedor: '',
      telefonoProveedor: '',
      direccionProveedor: '',
      cantidad: '',
      valorUnitarioProducto: '',
      valorTotalProducto: '',
    });
    setIsSearching(false);
    setSearchMode('normal');
    setSelectedProduct(null);
  };

  const openAdvancedSearchModal = () => {
    setSearchMode('advanced');
    setIsAdvancedSearchOpen(true);
  };
  const closeAdvancedSearchModal = () => setIsAdvancedSearchOpen(false);
  const closeModalImage = () => setModalImage(null);
  const handleImageClick = (url) => setModalImage(url);

  // 10) Render
  return (
    <div className={styles.scrollContainer}>
      <Header
        title="Módulo registro de inventario"
        subtitle="Hardware Store Inventory FFIG"
        showLogo
        showHelp
      />

      <div className={styles.tabs}>
        <Link
          to="/inventory-registration"
          className={`${styles.tabButton} ${activeTab === 'registro' ? styles.active : ''}`}
          onClick={() => handleTabClick('registro')}
        >Registrar Inventario</Link>
        <Link
          to="/merchandise-query"
          className={`${styles.tabButton} ${activeTab === 'consulta' ? styles.active : ''}`}
          onClick={() => handleTabClick('consulta')}
        >Consultar Inventario</Link>
        <Link
          to="/update-merchandise"
          className={`${styles.tabButton} ${activeTab === 'actualizar' ? styles.active : ''}`}
          onClick={() => handleTabClick('actualizar')}
        >Actualizar Inventario</Link>
        <Link
          to="/delete-merchandise"
          className={`${styles.tabButton} ${activeTab === 'eliminar' ? styles.active : ''}`}
          onClick={() => handleTabClick('eliminar')}
        >Eliminar Inventario</Link>
      </div>

      <div className={styles.container}>
        <h2 className={styles.title}>
          Ingrese un dato en la casilla correspondiente para realizar la consulta
        </h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Selección<input type="checkbox" disabled /></th>
            <th>Código
              <input
                type="text"
                name="codigoProducto"
                value={filters.codigoProducto}
                onChange={handleInputChange}
                placeholder="Buscar"
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Categoría
              <input
                type="text"
                name="nombreCategoria"
                value={filters.nombreCategoria}
                onChange={handleInputChange}
                placeholder="Buscar"
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Producto
              <input
                type="text"
                name="nombreProducto"
                value={filters.nombreProducto}
                onChange={handleInputChange}
                placeholder="Buscar"
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Existencias
              <input
                type="text"
                value={selectedProduct?.cantidad || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Valor Unit.
              <input
                type="text"
                value={selectedProduct?.valorUnitarioProducto || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Valor Tot. 
              <input
                type="text"
                value={selectedProduct?.valorTotalProducto || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Proveedor
              <input
                type="text"
                value={selectedProduct?.nombreProveedor || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>NIT Prov.
              <input
                type="text"
                value={selectedProduct?.nitProveedor || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Tel. Prov.
              <input
                type="text"
                value={selectedProduct?.telefonoProveedor || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Dir. Prov.
              <input
                type="text"
                value={selectedProduct?.direccionProveedor || ''}
                disabled
                placeholder="..."
                style={{ fontStyle: 'italic' }}
              />
            </th>
            <th>Img.</th>
          </tr>
        </thead>
        <tbody>
          {isSearching
            ? data.length > 0
              ? data
                .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
                .map((item, i) => (
                  <tr key={i} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
                    <td><input type="checkbox" /></td>
                    <td>{item.codigoProducto}</td>
                    <td>{item.nombreCategoria}</td>
                    <td>{item.nombreProducto}</td>
                    <td>{item.cantidad}</td>
                    <td>{item.valorUnitarioProducto}</td>
                    <td>{item.valorTotalProducto}</td>
                    <td>{item.nombreProveedor}</td>
                    <td>{item.nitProveedor}</td>
                    <td>{item.telefonoProveedor}</td>
                    <td>{item.direccionProveedor}</td>
                    <td>
                      {item.imagen
                        ? <a href="#" onClick={e => { e.preventDefault(); handleImageClick(item.imagen); }}>Ver Imagen</a>
                        : 'No disponible'}
                    </td>
                  </tr>
                ))
              : <tr><td colSpan="12">No se encontraron resultados</td></tr>
            : <tr><td colSpan="12">Realiza una búsqueda para ver los registros</td></tr>
          }
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

      {/* Modal de imagen */}
      {modalImage && (
        <div className={styles.modal} onClick={closeModalImage}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            {modalImage.startsWith('data:image')
              ? <img src={modalImage} alt="Producto" className={styles.modalImage} />
              : <p>Imagen no disponible</p>
            }
            <button className={styles.closeButton} onClick={closeModalImage}>Cerrar X</button>
          </div>
        </div>
      )}

      {/* Modal búsqueda avanzada */}
      {isAdvancedSearchOpen && (
        <div className={styles['advanced-search-modal']} onClick={closeAdvancedSearchModal}>
          <div className={styles['modalContent-advance']} onClick={e => e.stopPropagation()}>
            <h3>Búsqueda Avanzada</h3>
            <div className={styles['advanced-search-modal-controls']}>
              <button onClick={handleClear} className={styles['advanced-search-clear-button']}>
                Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
              </button>
              <button onClick={closeAdvancedSearchModal} className={styles['close-button']}>X</button>
            </div>
            <form className="advance-form">
              <label htmlFor="nit">NIT</label>
              <input name="nitProveedor" value={filters.nitProveedor} onChange={handleInputChange} placeholder="Buscar por NIT" style={{ fontStyle: 'italic' }} />
              <label htmlFor="proveedor">Proveedor</label>
              <input name="nombreProveedor" value={filters.nombreProveedor} onChange={handleInputChange} placeholder="Buscar por nombre" style={{ fontStyle: 'italic' }} />
              <label htmlFor="existencia">Existencias</label>
              <input name="cantidad" value={filters.cantidad} onChange={handleInputChange} placeholder="Buscar por existencias" style={{ fontStyle: 'italic' }} />
              <label htmlFor="valorUnitario">Valor Unitario</label>
              <input name="valorUnitarioProducto" value={filters.valorUnitarioProducto} onChange={handleInputChange} placeholder="Buscar por valor unitario" style={{ fontStyle: 'italic' }} />
              <label htmlFor="valorTotal">Valor Total</label>
              <input name="valorTotalProducto" value={filters.valorTotalProducto} onChange={handleInputChange} placeholder="Buscar por valor total" style={{ fontStyle: 'italic' }} />
            </form>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className={styles.actionButtons}>
        <button onClick={openAdvancedSearchModal} className={styles.advancedSearchButton}>
          Buscar <SearchIcon style={{ marginLeft: 8 }} />
        </button>
        <button onClick={handleClear} className={styles.clearButton}>
          Limpiar <CleaningServicesIcon style={{ marginLeft: 8 }} />
        </button>
        <button onClick={() => window.location.href = '/menu-principal'} className={styles.exitButton}>
          Salir <ExitToAppIcon style={{ marginLeft: 8 }} />
        </button>
      </div>
    </div>
  );
};

export default MerchandiseQuery;
