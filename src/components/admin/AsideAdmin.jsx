import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useState, useEffect } from 'react';

function AsideAdmin() {
    const [isMenu, setIsMenu] = useState(false)
    const [screenSize, setScreenSize] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    function submitLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = '/';
    }

    return (
        <aside className={`h-screen fixed z-50 md:sticky top-0 ${isMenu || screenSize >= 768 ? 'w-48' : 'w-0'}`}>
            {!isMenu ?
                <button onClick={() => setIsMenu(true)} className='bg-white text-black aspect-square md:hidden mx-auto z-[99] mt-7 ml-5 flex items-center justify-center absolute rounded-full p-2'>
                    <IoMdMenu size={'1.5rem'} />
                </button>
                :
                <button onClick={() => setIsMenu(false)} className='bg-white text-black md:hidden mx-auto z-[99] bg-customBlack inline-block w-fit mt-7 ml-5 absolute rounded-full aspect-square p-2'>
                    <IoMdClose size={'1.5rem'} />
                </button>
            }
            {(isMenu || screenSize >= 768) && <div className='bg-primary overflow-y-auto dark:bg-gray-900 h-[calc(100vh-2.5rem)] mt-5 ml-5 p-2 rounded-xl'>
                <div>
                    <img src="/media/images/logo1_nobg.png" alt="" className='w-32 mx-auto' />
                </div>
                <nav className='mt-5 container mx-auto'>
                    <ul className='[&>*]:px-1 [&>*]:py-2 [&>*]:font-medium [&>*]:text-lg'>
                        <li><Link to='/' className='inline-block bg-gray-950 text-white px-2 py-1 rounded-xl font-semibold'>Homepage</Link></li>
                        <li className='rounded-2xl'><NavLink to='/admin/dashboard' className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }>Dashboard</NavLink></li>
                        <li className='rounded-2xl'><NavLink to='/admin/users' className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }>Users</NavLink></li>
                        <li className='rounded-2xl'><NavLink to='/admin/resources' className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }>Resources</NavLink></li>
                        <li className='rounded-2xl'><NavLink to='/admin/projects' className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }>Projects</NavLink></li>
                        <li className='rounded-2xl'><NavLink to='/admin/news' className={({ isActive, isPending }) =>
                            isPending ? "pending" : isActive ? "active" : ""
                        }>News</NavLink></li>
                        <li><button onClick={submitLogout} className='bg-gray-950 text-white px-2 py-1 rounded-xl'>Sign out</button></li>
                    </ul>
                </nav>
            </div>}


        </aside>
    )
}

export default AsideAdmin