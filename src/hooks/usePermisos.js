import { useEffect, useState } from 'react';
import { getLoggedUserData } from '../auth/authUtils';
import api from '../api'; // Import your API utility

// componente personalizado para obtener permisos del usuario 
const usePermisos = () => {

  // Estado para almacenar los permisos del usuario
  // y el id del rol del usuario logueado
  const [permisos, setPermisos] = useState([]);
  const { idRol } = getLoggedUserData();

  // Efecto para obtener los permisos del usuario al cargar el componente
  // o cuando cambie el idRol
  useEffect(() => {
    if (!idRol) return;

    // Función para obtener los permisos del usuario desde la API
    // y almacenarlos en el estado y en localStorage
    const fetchPermisos = async () => {
      try {
        const response = await api.get(`/permisos/por-rol/${idRol}`);
        setPermisos(response.data);
        localStorage.setItem('permisos', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error al obtener permisos:', error);
      }
    };

    fetchPermisos();
  }, [idRol]);

  return permisos;
};

export default usePermisos;
