import { useState, useEffect } from "react";
import Header from "./Header";
import styles from "../styles/updatemerchandise.module.css";
import SaveIcon from "@mui/icons-material/Save";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Link } from "react-router-dom";
import axios from "axios"; // Importa axios
import { number } from "yup";

const api = axios.create({ // Crea una instancia de axios
    baseURL: 'http://localhost:8080/api'
});