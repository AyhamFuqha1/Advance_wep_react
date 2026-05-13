import { Outlet, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

import Home from "../Page/Home";
import { ROUTES } from "../config/routes";
import Login from "../Page/Login";
import SignUp from "../Page/Signup";
import ProfilePage from "../Page/ProfilePage";
import Dashboard from "../Page/Dashboard";
import Subject from "../Page/Subject";
import Navbar from "../components/Navbar";
import SummariesPage from "../Page/SummariesPage";
import QuizzesPage from "../Page/QuizzesPage";
import Analytics from "../Page/Analytics";
import StudyPlan from "../Page/StudyPlan";
import {Quiz} from "../Page/Quiz";
import { QuizResult } from "../Page/Result";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<><Navbar /><Outlet /></>}>
        <Route element={<Dashboard />} path="dashboard" />
        <Route element={<Subject />} path="subject/:id" />
        <Route element={<SummariesPage />} path="summaries" />
        <Route element={<QuizzesPage />} path="quizzes" />
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
      </Route>

      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<SignUp />} />
       <Route path={ROUTES.QUIZ} element={<Quiz />} />
   
      <Route path="/results/:resultId" element={<QuizResult />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/study-plan" element={<StudyPlan />} />
    </>
  )
);

export default router;