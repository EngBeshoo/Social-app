import { HeroUIProvider } from "@heroui/react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./componets/Layout/Layout";
import Login from "./auth/Login/Login";
import Home from "./pages/Home";
import Register from "./auth/Register/Register";
import Profile from "./pages/Profile";
import SinglePost from "./pages/SinglePost";
import Notfound from "./componets/Notfound/Notfound";
import { CounterContextProvider } from "./context/counterContext";
import { AuthContext, AuthProvider } from "./context/authContext";
import ProtectRoute from "./pages/ProtectRoute";
 import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

 const queryClient = new QueryClient()


let router = createBrowserRouter([
  {path:'/', element:<Layout/> , children:[
    {index:true , element:<Login/>},
    {path:'register',element:<Register/>},
    {path:'home',element: <ProtectRoute><Home/></ProtectRoute>},
    {path:'profile',element:<ProtectRoute><Profile/></ProtectRoute>},
    {path:'singlepost/:id',element:<ProtectRoute><SinglePost/></ProtectRoute>},
    {path:'*',element:<Notfound/>},
  ]}
])

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <AuthProvider>
        <CounterContextProvider>
            <RouterProvider router={router} />
        </CounterContextProvider>
        </AuthProvider>
      </HeroUIProvider>
    </QueryClientProvider>

    </>
  );
}

export default App;
