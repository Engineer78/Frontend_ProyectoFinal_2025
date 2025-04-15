import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Header from "./Header";
import styles from "../styles/inventoryregistration.module.css";
import SaveIcon from '@mui/icons-material/Save';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from "axios";

function InventoryRegistration() {

    // Se instancia axios para realizar las peticiones a la API
    // Se define la URL base de la API
    const api = axios.create({
        baseURL: 'http://localhost:8080/api'
      });


      
  return (
    <div>InventoryRegistration</div>
  )
}

export default InventoryRegistration