import { createBrowserRouter, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import Login from "./Login";
import Register from "./Register";
import Bienvenida from "./Bienvenida";
import Activar from "./Activar";
import Lectura from "./Lectura";
import Preguntas from "./Preguntas";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  {
    element: <PublicRoute />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/bienvenida", element: <Bienvenida /> },
      { path: "/activar", element: <Activar /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/lectura", element: <Lectura /> },
      { path: "/preguntas", element: <Preguntas /> },
    ],
  }
]);
