'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from '../redux/userSlice';
import { fetchHouses } from "../redux/houseSlice";

function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state?.user?.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchHouses());
  }, [dispatch]);

  return (
    <>
      
      <header className="bg-gray-800 h-20 w-full flex items-center justify-between top-0 text-white px-6 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden focus:outline-none">
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-white" />
              <div className="w-6 h-0.5 bg-white" />
              <div className="w-6 h-0.5 bg-white" />
            </div>
          </button>
          <h1 className="text-3xl font-bold tracking-wide">Housing</h1>
        </div>

        <nav className="hidden md:flex gap-6">
          <NavLink href="/" label="Home" />
          <NavLink href={`/pages/${isAuthenticated ? 'history' : 'login'}`} label="History" />
          <NavLink href={`/pages/${isAuthenticated ? 'listHouse' : 'login'}`} label="List House" />
          <NavLink href={`/pages/${isAuthenticated ? 'booking' : 'login'}`} label="My Booking" />
          <NavLink href={`/pages/${isAuthenticated ? 'profile' : 'login'}`} label={isAuthenticated ? 'Profile' : 'Login'} />
        </nav>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={() => setSidebarOpen(false)} className="text-black text-2xl font-bold">
            &times;
          </button>
        </div>

        <ul className="flex flex-col p-4 space-y-4 text-gray-800">
          <SidebarLink href="/" label="Home" setSidebarOpen={setSidebarOpen} />
          <SidebarLink href={`/pages/${isAuthenticated ? 'history' : 'login'}`} label="History" setSidebarOpen={setSidebarOpen} />
          <SidebarLink href={`/pages/${isAuthenticated ? 'listHouse' : 'login'}`} label="List House" setSidebarOpen={setSidebarOpen} />
          <SidebarLink href={`/pages/${isAuthenticated ? 'booking' : 'login'}`} label="My Booking" setSidebarOpen={setSidebarOpen} />
          <SidebarLink href={`/pages/${isAuthenticated ? 'profile' : 'login'}`} label={isAuthenticated ? 'Profile' : 'Login'} setSidebarOpen={setSidebarOpen} />
        </ul>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}

const NavLink = ({ href, label }) => (
  <Link
    href={href}
    className="font-semibold text-lg hover:text-amber-400 hover:underline transition-all duration-200 ease-in-out focus:outline-none focus:text-amber-300"
  >
    {label}
  </Link>
);

const SidebarLink = ({ href, label, setSidebarOpen }) => (
  <li>
    <Link
      href={href}
      onClick={() => setSidebarOpen(false)}
      className="font-semibold text-lg hover:text-blue-600 hover:underline focus:text-blue-700 transition-all duration-150"
    >
      {label}
    </Link>
  </li>
);

export default Header;
