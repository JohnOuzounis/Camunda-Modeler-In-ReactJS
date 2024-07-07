import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import HomePage from "./Pages/HomePage";

function App() {

  const router = createBrowserRouter([
    { path: '/modeler', element: <HomePage /> },

    { path: '*', element: <Navigate to={"/modeler"} /> }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;