
<<<<<<< HEAD
import {
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import Dashboard from "../Page/Dashboard";
import Subject from "../Page/Subject";
import Navbar from "../components/Navbar";
=======
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

>>>>>>> 4780c24656d87a4d25ff029f3a41394ccb91122d
import Home from "../Page/Home";
import { ROUTES } from "../config/routes";
import Login from "../Page/Login";
import SignUp from "../Page/Signup";
import ProfilePage from "../Page/ProfilePage";
<<<<<<< HEAD
import SummariesPage from "../Page/SummariesPage";
import QuizzesPage from "../Page/QuizzesPage";

=======
import Analytics from "../Page/Analytics";
import StudyPlan from "../Page/StudyPlan";
import { ROUTES } from "../config/routes";
>>>>>>> 4780c24656d87a4d25ff029f3a41394ccb91122d
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<><Navbar/> <Outlet/></>}>
      <Route element={<Dashboard />} path="dashboard" />
      <Route element={<Subject/>} path="subject/:id" />
      <Route element={<SummariesPage />} path="summaries" />
      <Route element={<QuizzesPage />} path="quizzes" />

<<<<<<< HEAD
       <Route path={ROUTES.HOME} element={<Home />} />
  
    <Route path={ROUTES.PROFILE} element={<ProfilePage />} />


    </Route>,

     <Route path={ROUTES.LOGIN} element={<Login />} />
   <Route path={ROUTES.SIGNUP} element={<SignUp />} /> 
   </>
  ),
=======
    <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<SignUp />} /> 
       <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
       <Route path="/analytics" element={<Analytics />} />
       <Route path="/study-plan" element={<StudyPlan />} />
    </Route>
  )
>>>>>>> 4780c24656d87a4d25ff029f3a41394ccb91122d
);

export default router;

