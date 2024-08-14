import { createBrowserRouter } from "react-router-dom";
import Home from "../src/pages/Home";
import Library from "../src/pages/Library";
import App from "../src/App";
import Login from "./pages/Login";
import Cadastro from "./pages/SignUp";
import CartPage from "./pages/CartPage";
import EditProfile from "./pages/EditProfile";

const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"/",
                element:<Home/>,
            },
            {
                path:"/library",
                element:<Library/>,
            },
            {
                path:"/signin",
                element:<Login/>,
            },
            {
                path:"/signup",
                element:<Cadastro/>,
            }, 
            {
                path:"/profile",
                element:<EditProfile/>
            },
            {
                path:"/cart",
                element:<CartPage/>,
            }, 
        ]
    }
])

export default router;