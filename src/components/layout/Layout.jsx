import React from "react";
import { useLocation, Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import AsideAdmin from "../admin/AsideAdmin";
import { CiLight, CiDark } from "react-icons/ci";
import { useState, useEffect } from "react";
import { checkLogin } from "../../api";
import NotFound from "../../pages/not-found/not-found";

function Layout() {
  const location = useLocation()
  const [isDark, setIsDark] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  useEffect(() => {
    const html = document.querySelector("html");
    setIsDark(
      JSON.parse(localStorage.getItem("dark")) != null
        ? JSON.parse(localStorage.getItem("dark"))
        : false
    );
    if (JSON.parse(localStorage.getItem("dark")) == true) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    async function checkUser() {
      try {
        const res = await checkLogin()
        setUserInfo(res.data.user.adminAccount)
      } catch (error) {
      }
    }

    checkUser()
  }, []);

  function toggleDark() {
    localStorage.setItem("dark", !JSON.parse(isDark));
    setIsDark(JSON.parse(localStorage.getItem("dark")));
    checkHTMLdarkClass();
  }

  function checkHTMLdarkClass() {
    const html = document.querySelector("html");
    if (isDark) {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
  }

  return (
    <>
      {((!location.pathname.toLowerCase().startsWith('/admin') || !userInfo)) &&
        <div className="relative">
          {<Navbar />}
          {!location.pathname.toLowerCase().startsWith('/admin') ? <Outlet /> : <NotFound />}
          {<Footer />}
          <button onClick={toggleDark} className=" w-10 h-10 aspect-square flex items-center justify-center  dark:bg-white text-white dark:text-black bg-gray-950 bg-opacity-20 drop-shadow-md backdrop-blur-md z-[100] fixed top-[calc(100vh-5rem)] rounded-full right-5">
            {isDark ? <CiLight size={'1.5rem'} /> :
              <CiDark size={'1.5rem'} />
            }
          </button>
        </div>
      }

      {((location.pathname.toLowerCase().startsWith('/admin') && userInfo)) &&
        <div className="flex gap-2 relative">
          {((location.pathname != '/login/' && location.pathname != '/login' && location.pathname != '/registrar' && location.pathname != '/recover-account' && location.pathname.toLowerCase() != '/recuperar-cuenta')) &&
            <AsideAdmin />}
          <main className='relative flex-grow ml-4 bg-primary dark:bg-gray-900 mt-5 mr-5 h-[calc(100vh-2.5rem)] overflow-y-auto rounded-xl'>
            <Outlet />
            <button onClick={toggleDark} className=" w-10 h-10 aspect-square flex items-center justify-center  dark:bg-white bg-gray-950 bg-opacity-20 drop-shadow-md backdrop-blur-md z-[100] fixed top-[calc(100vh-5.2rem)] rounded-full right-7 text-white dark:text-black">
              {isDark ? <CiLight size={'1.5rem'} /> :
                <CiDark size={'1.5rem'} />
              }
            </button>
          </main>
        </div>
      }
      <ScrollRestoration />

    </>
  );
}

export default Layout;
