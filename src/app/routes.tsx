import { createBrowserRouter, Navigate } from "react-router";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Bienvenida from "./Bienvenida";
import Activar from "./Activar";
import Lectura from "./Lectura";
import Preguntas from "./Preguntas";

export const router = createBrowserRouter([
  { path: "/",           element: <Navigate to="/login" replace /> },
  { path: "/login",      Component: Login },
  { path: "/bienvenida", Component: Bienvenida },
  { path: "/activar",    Component: Activar },
  { path: "/dashboard",  Component: Dashboard },
  { path: "/lectura",    Component: Lectura },
  { path: "/preguntas",  Component: Preguntas },
]);
