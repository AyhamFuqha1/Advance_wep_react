import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Dashboard from "../Page/Dashboard";
import Subject from "../Page/Subject";
import Navbar from "../components/Navbar";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<><Navbar/> <Outlet/></>}>
      <Route element={<Dashboard />} path="dashboard" />
      <Route element={<Subject/>} path="subject/:id" />
    </Route>,
  ),
);

export default router;
