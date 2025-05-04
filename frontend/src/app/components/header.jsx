'use client';
import React, { useState,useEffect } from "react";
import Link from "next/link";
import { useSelector,useDispatch } from "react-redux";
import { fetchUser } from '../redux/userSlice';
import { fetchHouses } from "../redux/houseSlice";
  
function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const   isAuthenticated=useSelector((state)=>state?.user?.isAuthenticated);
  console.log(useSelector((state)=>state.user),"HELLOOOO");
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchHouses());
  }, [dispatch]);

  return (
    <>
      <header className="bg-gray-800 h-20 w-full flex items-center justify-between top-0 text-white px-6">
       
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden focus:outline-none">

            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-white" />
              <div className="w-6 h-0.5 bg-white" />
              <div className="w-6 h-0.5 bg-white" />
            </div>
          </button>
          <h1 className="text-3xl font-bold">Housing</h1>
        </div>

        <nav className="hidden md:flex gap-6">
          <Link href="/" className="font-bold text-xl">Home</Link>
          <Link href={`/pages/${isAuthenticated ? 'history' : 'login'}`} className="font-bold text-xl">History</Link>
          <Link href={`/pages/${isAuthenticated ? 'listHouse': 'login'}`} className="font-bold text-xl">List House</Link>
          <Link href={`/pages/${isAuthenticated ? 'booking': 'login'}`} className="font-bold text-xl">My Booking</Link>
          {
            isAuthenticated ? <Link href="/pages/profile" className="font-bold text-xl">profile</Link> :
            <Link href="/pages/login" className="font-bold text-xl">Login</Link>
          }
         
         
        </nav>
      </header>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
        
          <button onClick={() => setSidebarOpen(false)} className="text-black text-xl font-bold">
            &times;
          </button>
        </div>
        <ul className="flex flex-col p-4 space-y-4 text-gray-800">

          <li><Link href="/" onClick={() => setSidebarOpen(false)} className="font-bold text-xl">Home</Link></li>
          <li><Link href={`/pages/${isAuthenticated ? 'history' : 'login'}`} onClick={() => setSidebarOpen(false)} className="font-bold text-xl">History</Link></li>
          <li><Link href={`/pages/${isAuthenticated ? 'listHouse': 'login'}`} onClick={() => setSidebarOpen(false)} className="font-bold text-xl">List House</Link></li>
            <li>
            <Link href={`/pages/${isAuthenticated ? 'booking': 'login'}`} onClick={() => setSidebarOpen(false)} className="font-bold text-xl">My Booking</Link>
            </li>
           <li>
           {
            isAuthenticated ? <Link href="/pages/profile" className="font-bold text-xl" onClick={() => setSidebarOpen(false)}>profile</Link> :
            <Link href="/pages/login" className="font-bold text-xl" onClick={() => setSidebarOpen(false)}>Login</Link>
          }
           </li>
        </ul>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Header;
