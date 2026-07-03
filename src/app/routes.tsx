import { createBrowserRouter, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import Login from "./Login";
import Register from "./Register";
import Bienvenida from "./Bienvenida";
import Activar from "./Activar";
import Lectura from "./Lectura";
import Preguntas from "./Preguntas";

export const router = createBrowserRouter([
  { path: "/",           element: <Navigate to="/login" replace /> },
  { path: "/login",      element: <Login /> },
  { path: "/register",   element: <Register /> },
  { path: "/bienvenida", element: <Bienvenida /> },
  { path: "/activar",    element: <Activar /> },
  { path: "/dashboard",  element: <Dashboard /> },
  { path: "/admin",      element: <AdminDashboard /> },
  { path: "/lectura",    element: <Lectura /> },
  { path: "/preguntas",  element: <Preguntas /> },
]);
