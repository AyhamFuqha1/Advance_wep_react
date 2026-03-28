import {Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route
      element={<h3>one Page</h3>}
      path="/"
    />
    <Route
      element={<h3 >twoPage</h3>}
      path="/contact"
    />
    </>
  )
);


export default router;
