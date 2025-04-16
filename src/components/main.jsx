import '../styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Usamos Routes en lugar de Switch
import Header from '../components/Header'; // Importación del componente Header
import LoginForm from '../components/moduloInventario/LoginForm';
import MenuPcpal from '../components/MenuPcpal';
import Footer from '../components/Footer';
import InventoryRegistration from '../components/moduloInventario/InventoryRegistration'; // Componente de registro de inventario
import MerchandiseQuery from '../components/moduloInventario/MerchandiseQuery'; // Componente de consulta de mercancía
import UpdateMerchandise from '../components/UpdateMerchandise'; // Componente de actualización de mercancía
import DeleteMerchandise from '../components/DeleteMerchandise'; // Componente de eliminación de mercancancia

// Inicializa un usuario predeterminado en el localStorage
const initializeDefaultUser = () => {
  const defaultUser = { username: 'admin@gmail.com', password: '12345' };

  if (!localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify(defaultUser));
  }
};

initializeDefaultUser();


// Se crea la clase principal de la aplicación
// Se utiliza StrictMode para detectar problemas potenciales en la aplicación
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Ruta para el Login */}
        <Route
          path="/login"
          element={
            <>
              <Header title="Bienvenidos a" subtitle="Hardware Store Inventory FFIG" />
              <LoginForm />
            </>
          }
        />

        {/* Ruta para la página de inicio */}
        <Route
          path="/"
          element={
            <>
              <Header title="Bienvenidos a" subtitle="Hardware Store Inventory FFIG" />
              <LoginForm />
            </>
          }
        />

        {/* Ruta para el menú principal */}
        <Route
          path="/menu-principal"
          element={<MenuPcpal />}
        />

        {/* Ruta para el registro de inventario */}
        <Route
          path="/inventory-registration"
          element={<InventoryRegistration />}
        />

        {/* Ruta para la consulta de mercancía */}
        <Route
          path="/merchandise-query"
          element={<MerchandiseQuery />}
        />

        {/* Ruta para la actualización de mercancía */}
        <Route
          path="/update-merchandise"
          element={<UpdateMerchandise />}
        />

        {/* Ruta para la eliminación de mercancía */}
        <Route
          path="/delete-merchandise"
          element={<DeleteMerchandise />}
        />
        {/* Ruta para el registro de usuarios */}
        <Route
          path="/users-registration"
          element={<UsersRegistration />}
        />
        {/* Ruta para la consulta de usuarios */}
        {/*<Route
          path="/users-query"
          element={<UsersQuery />}
        />*/}
        {/* Ruta para la actualización de usuarios */}
        {/*<Route
          path="/update-users"
          element={<UpdateUsers />}
        />*/}
        {/* Ruta para la eliminación de usuarios */}
        {/*<Route
          path="/delete-users"
          element={<DeleteUsers />}
        />*/}
      </Routes>
    </Router>

    {/* Footer que aparece en todas las páginas */}
    <Footer />
  </StrictMode>

);
