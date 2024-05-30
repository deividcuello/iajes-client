import React from 'react'
import { useLocation } from "react-router-dom";

function Footer() {
    const location = useLocation()
    const d = new Date();
  return (
    <footer className={`bg-primary ${(!location.pathname.toLowerCase().startsWith('/login') && !location.pathname.toLowerCase().startsWith('/register') && !location.pathname.toLowerCase().startsWith('/recover-account') && !location.pathname.toLowerCase().startsWith('/contact') && !location.pathname.toLowerCase().startsWith('/profile')) && 'mt-10'} min-h-[7rem]`}>
        <div className='md:flex flex-col container mx-auto relative px-5'>
            <div className='min-h-[7rem] flex items-center'>      
                <div className=''>
                    <img src="/media/images/logo.png" alt="" className='w-full h-full object-cover'/>
                </div>
            </div>
            <div className='text-white font-semibold md:flex justify-end md:absolute right-0 bottom-0 pb-2'>
                <span>Copyright © {d.getFullYear()}, Task Force. All Rights Reserved</span>
            </div>
        </div>
    </footer>
  )
}

export default Footer