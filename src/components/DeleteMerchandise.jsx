import { useState, useEffect } from 'react';
import Header from './Header';
import styles from '../styles/deletemerchandise.module.css';
import { Link } from 'react-router-dom';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from "axios"; // Importa axios

const api = axios.create({ // Crea una instancia de axios
    baseURL: 'http://localhost:8080/api'
});