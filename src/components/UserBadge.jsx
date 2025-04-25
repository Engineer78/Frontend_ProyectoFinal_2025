import React from 'react'
import '../style/UserBadge.css';


const UserBadge = ({ nombreCompleto, rol }) => {

    // Función para obtener las iniciales del nombre completo
    // Separa el nombre completo en partes y toma la primera letra del primer nombre y la primera letra del primer apellido
    // Si no hay nombre o apellido, devuelve una cadena vacía
    const obtenerIniciales = (nombreCompleto) => {
        const partes = nombreCompleto.trim().split(' ');

        const inicialNombre = partes[0]?.[0]?.toUpperCase() || '';
        const inicialApellido = partes[1]?.[0]?.toUpperCase() || '';

        return inicialNombre + inicialApellido;
    };

    return (
        <div>UserBadge</div>
    )
}

export default UserBadge