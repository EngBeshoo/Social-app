import React from 'react'
import Navbar from './../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom';
import Home from '../../pages/Home';

export default function Layout() {
  return <>

{/* <Navbar/> */}
<Navbar>
<Home/>
</Navbar>


<Outlet/>
<Footer/>

  
  
  </>
}
