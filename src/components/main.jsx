import '../styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PermisosProvider } from '../components/admin/PermisosContext';
import Header from '../components/Header';
import LoginForm from '../components/moduloInventario/LoginForm';
import MenuPcpal from '../components/MenuPcpal';
import Footer from '../components/Footer';
import InventoryRegistration from '../components/moduloInventario/InventoryRegistration';
import MerchandiseQuery from '../components/moduloInventario/MerchandiseQuery';
import UpdateMerchandise from '../components/moduloInventario/UpdateMerchandise';
import DeleteMerchandise from '../components/moduloInventario/DeleteMerchandise';
import UsersRegistration from '../components/moduloUsuarios/UsersRegistration';
import UsersQuery from '../components/moduloUsuarios/UsersQuery';
import UpdateUsers from '../components/moduloUsuarios/UpdateUsers';
import DeleteUsers from '../components/moduloUsuarios/DeleteUsers';


// Se crea la clase principal de la aplicación
// Se utiliza StrictMode para detectar problemas potenciales en la aplicación
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <PermisosProvider>
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

          {/* --------------RUTAS PARA EL MÓDULO DE INVENTARIO --------------*/}

          {/* Ruta para el registro de inventario */}
          <Route
            path="/inventory-registration"
            element={<InventoryRegistration />}
          />

          {/* Ruta para la consulta de inventario */}
          <Route
            path="/merchandise-query"
            element={<MerchandiseQuery />}
          />

          {/* Ruta para la actualización de inventario */}
          <Route
            path="/update-merchandise"
            element={<UpdateMerchandise />}
          />

          {/* Ruta para la eliminación de inventario */}
          <Route
            path="/delete-merchandise"
            element={<DeleteMerchandise />}
          />

          {/* --------------RUTAS PARA EL MÓDULO DE USUARIOS --------------*/}

          {/* Ruta para el registro de usuarios */}
          <Route
            path="/users-registration"
            element={<UsersRegistration />}
          />

          {/*Ruta para la consulta de usuarios */}
          <Route
            path="/users-query"
            element={<UsersQuery />}
          />

          {/* Ruta para la actualización de usuarios */}
          <Route
            path="/update-users"
            element={<UpdateUsers />}
          />

          {/* Ruta para la eliminación de usuarios */}
          <Route
            path="/delete-users"
            element={<DeleteUsers />}
          />
        </Routes>


        {/* Footer que aparece en todas las páginas */}
        <Footer />

      </PermisosProvider>
    </Router>
  </StrictMode>
);
