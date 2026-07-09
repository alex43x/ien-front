import { createBrowserRouter, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";
import AdminPatients from "./AdminPatients";
import AdminPatientDetail from "./AdminPatientDetail";
import AdminReports from "./AdminReports";
import AdminStores from "./AdminStores";
import AdminProducts from "./AdminProducts";
import AdminCodes from "./AdminCodes";
import AdminCreateBusinessAdmin from "./AdminCreateBusinessAdmin";
import Login from "./Login";
import Register from "./Register";
import Bienvenida from "./Bienvenida";
import Activar from "./Activar";
import Lectura from "./Lectura";
import Preguntas from "./Preguntas";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import AdminLayout from "../components/layout/AdminLayout";
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
      { path: "/lectura", element: <Lectura /> },
      { path: "/preguntas", element: <Preguntas /> },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "/admin", element: <Navigate to="/admin/dashboard" replace /> },
          { path: "/admin/dashboard", element: <AdminDashboard /> },
          { path: "/admin/pacientes", element: <AdminPatients /> },
          { path: "/admin/pacientes/:id", element: <AdminPatientDetail /> },
          { path: "/admin/reportes", element: <AdminReports /> },
          { path: "/admin/sucursales", element: <AdminStores /> },
          { path: "/admin/productos", element: <AdminProducts /> },
          { path: "/admin/codigos", element: <AdminCodes /> },
          { path: "/admin/crear-admin", element: <AdminCreateBusinessAdmin /> },
        ],
      },
    ],
  },
]);
