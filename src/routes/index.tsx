import { Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

import Home from "../Page/Home";
import Login from "../Page/Login";
import SignUp from "../Page/Signup";
import ProfilePage from "../Page/ProfilePage";
import { ROUTES } from "../config/routes";
import {Quiz} from "../Page/Quiz";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<SignUp />} /> 
      <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      <Route path={ROUTES.QUIZ} element={<Quiz />} />
    </Route>
  )
);


export default router;
