import { createBrowserRouter, Navigate } from "react-router";
import { lazy } from "react";
import { useAuth } from "../context/AuthContext";
const Dashboard = lazy(() => import("./Dashboard"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));
const AdminPatients = lazy(() => import("./AdminPatients"));
const AdminPatientDetail = lazy(() => import("./AdminPatientDetail"));
const AdminSimulation = lazy(() => import("./AdminSimulation"));
const AdminReports = lazy(() => import("./AdminReports"));
const AdminStores = lazy(() => import("./AdminStores"));
const AdminProducts = lazy(() => import("./AdminProducts"));
const AdminCodes = lazy(() => import("./AdminCodes"));
const AdminEmails = lazy(() => import("./AdminEmails"));
const AdminUsuarios = lazy(() => import("./AdminUsuarios"));
const AdminGrupos = lazy(() => import("./AdminGrupos"));
const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const Bienvenida = lazy(() => import("./Bienvenida"));
const Activar = lazy(() => import("./Activar"));
const Horario = lazy(() => import("./Horario"));
const Lectura = lazy(() => import("./Lectura"));
const BloqueIntro = lazy(() => import("./BloqueIntro"));
const BloqueCierre = lazy(() => import("./BloqueCierre"));
const Preguntas = lazy(() => import("./Preguntas"));
import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import AdminLayout from "../components/layout/AdminLayout";
import PatientLayout from "../components/layout/PatientLayout";
const Cuenta = lazy(() => import("./Cuenta"));
const ForgotPassword = lazy(() => import("./ForgotPassword"));
const ResetPassword = lazy(() => import("./ResetPassword"));
import PublicRoute from "../components/PublicRoute";
import GlobalErrorBoundary from "../components/GlobalErrorBoundary";

function AdminIndex() {
  const { user } = useAuth();
  const target = user?.rol === "moderador_tienda" ? "/admin/productos" : "/admin/dashboard";
  return <Navigate to={target} replace />;
}

export const router = createBrowserRouter([
  {
    errorElement: <GlobalErrorBoundary />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },
      {
        element: <PublicRoute />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/activar", element: <Activar /> },
          { path: "/register", element: <Register /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password", element: <ResetPassword /> },
        ],
      },
      { path: "/horario", element: <Horario /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/bienvenida", element: <Bienvenida /> },
          { path: "/lectura", element: <Lectura /> },
          { path: "/lectura/:diaNumero", element: <Lectura /> },
          { path: "/bloque-intro", element: <BloqueIntro /> },
          { path: "/bloque-cierre", element: <BloqueCierre /> },
          { path: "/preguntas", element: <Preguntas /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <PatientLayout />,
            children: [
              { path: "/dashboard", element: <Dashboard /> },
              { path: "/cuenta", element: <Cuenta /> },
            ],
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: "/admin", element: <AdminIndex /> },
              { path: "/admin/dashboard", element: <AdminDashboard /> },
              { path: "/admin/pacientes", element: <AdminPatients /> },
              { path: "/admin/pacientes/:id", element: <AdminPatientDetail /> },
              { path: "/admin/simulacion", element: <AdminSimulation /> },
              { path: "/admin/reportes", element: <AdminReports /> },
              { path: "/admin/sucursales", element: <AdminStores /> },
              { path: "/admin/productos", element: <AdminProducts /> },
              { path: "/admin/codigos", element: <AdminCodes /> },
              { path: "/admin/plantillas", element: <AdminEmails /> },
              { path: "/admin/grupos", element: <AdminGrupos /> },
              { path: "/admin/usuarios", element: <AdminUsuarios /> },
            ],
          },
        ],
      },
    ],
  },
]);
