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
          <Link href="/" className="">Home</Link>
          <Link href={`/pages/${isAuthenticated ? 'history' : 'login'}`} className="">History</Link>
          <Link href={`/pages/${isAuthenticated ? 'addHouse': 'login'}`} className="">Post House</Link>
          {
            isAuthenticated ? <Link href="/pages/profile" className="">profile</Link> :
            <Link href="/pages/login" className="">Login</Link>
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
          <li><Link href="/" onClick={() => setSidebarOpen(false)}>Home</Link></li>
          <li><Link href="/pages/history" onClick={() => setSidebarOpen(false)}>Buy</Link></li>
          <li><Link href="/pages/addHouse" onClick={() => setSidebarOpen(false)}>Rent</Link></li>
         
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
