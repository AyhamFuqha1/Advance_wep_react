
import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

import Home from "../Page/Home";
import Login from "../Page/Login";
import SignUp from "../Page/Signup";
import ProfilePage from "../Page/ProfilePage";
import Analytics from "../Page/Analytics";
import StudyPlan from "../Page/StudyPlan";
import { ROUTES } from "../config/routes";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>

    <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<SignUp />} /> 
       <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
       <Route path="/analytics" element={<Analytics />} />
       <Route path="/study-plan" element={<StudyPlan />} />
    </Route>
  )
);

export default router;

