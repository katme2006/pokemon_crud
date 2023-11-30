import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Pokemon } from "./pages/Pokemon";
import { Home } from "./pages/Home";
import { Moves } from "./pages/Moves";
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "pokemon",
        element: <Pokemon/>,
      },
      {
        path: "moves",
        element: <Moves />,
      },
      {path:"login",
    element:<LoginPage/>},
    {
      path: "register", // Define the register path
      element: <RegisterPage />, // Assign RegisterPage component
    },
    ],
  },
]);

export default router;
