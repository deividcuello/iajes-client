import React from "react";
import { IoMenuSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkLogin } from "../../api";
import { FaChevronDown, FaChevronUp, FaUser } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { CiLogout } from "react-icons/ci";

function Navbar() {
  const [isDropDownUser, setIsDropDwonUser] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const [projectsDropdown, setProjectDropdown] = useState(false)
  const [resourcesDropdown, setResourcesDropdown] = useState(false)
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

  useEffect(() => {
    async function userData() {
      try {
        const res = await checkLogin()
        setUserInfo(res.data.user)
      } catch (error) {
        console.clear()
      }
    }

    async function isLogged() {
      try {
        const res = await checkLogin();
        setUserInfo(res.data.user);
      } catch (error) {
        console.clear()
      }
    }

    isLogged();
    userData()
  }, [])

  // useEffect(() => {
  //   async function isLogged() {
  //     try {
  //       const res = await checkLogin();
  //       setUserInfo(res.data.user);
  //     } catch (error) {
  //       // console.clear()
  //     }
  //   }

  //   isLogged();
  // }, []);


  function submitLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.reload(false)
  }

  return (
    <header
      className={`bg-primary text-white py-2 z-50 sticky right-0 left-0 top-0`}
    >
      <div className={`mx-auto px-5 flex flex-row ${screenSize < 980 ? 'flex-col justify-between gap-6' : 'gap-16'}`}>
        <div className={`flex justify-between items-center`}>
          <Link to="/">
            <img
              src="/media/images/logo.png"
              alt=""
              className="md:min-w-[13rem] md:min-h-auto h-14 object-cover"
            />
          </Link>

          {screenSize < 980 && (
            <div>
              {!isMenu ? (
                <button onClick={() => setIsMenu(!isMenu)}>
                  <IoMenuSharp size={"2rem"} />
                </button>
              ) : (
                <button onClick={() => setIsMenu(!isMenu)}>
                  <IoMdClose size={"2rem"} />
                </button>
              )}
            </div>
          )}
        </div>
        {(isMenu || screenSize >= 980) && (
          <nav className={`flex-grow ${screenSize > 980 && 'pb-0'}`}>
            <ul className={`flex flex-row ${screenSize < 980 && 'flex-col gap-0'} justify-between`}>
              <li>
                <Link to="/about" onClick={() => { setIsDropDwonUser(false); setProjectDropdown(false); setResourcesDropdown(false); setIsMenu(false) }}>About Us</Link>
              </li>
              <li className="relative">
                {/* <Link to="/resources/centers">Resources</Link> */}
                <span onClick={() => { setResourcesDropdown(!resourcesDropdown); setProjectDropdown(false); setIsDropDwonUser(false) }} className="cursor-pointer">Resources</span>
                {resourcesDropdown && <ul className={`flex flex-col gap-2 ${screenSize > 980 && 'absolute'} mt-5 bg-primary p-2`}>
                  <li>
                    <Link onClick={() => { setResourcesDropdown(false); setIsMenu(false) }} to="/resources/programs">Programs at Jesuit Schools</Link>
                  </li>
                  <li>
                    <Link onClick={() => { setResourcesDropdown(false); setIsMenu(false) }} to="/resources/academic">Academic Resources</Link>
                  </li>
                  <li>
                    <Link onClick={() => { setResourcesDropdown(false); setIsMenu(false) }} to="/resources/regional-associations/kircher">Regional Associations</Link>
                  </li>
                </ul>}
              </li>
              <li className="">
                {/* <Link to="/projects">Engineering Projects</Link> */}
                <span onClick={() => { setProjectDropdown(!projectsDropdown); setResourcesDropdown(false); setIsDropDwonUser(false) }} className="cursor-pointer">Engineering Projects</span>
                {projectsDropdown && <ul className={`flex flex-col gap-2 ${screenSize > 980 && 'absolute'} mt-5 bg-primary p-2`}>
                  <li>
                    <Link onClick={() => { setProjectDropdown(false); setIsMenu(false) }} to="/projects/energy">Energy</Link>
                  </li>
                  <li>
                    <Link onClick={() => { setProjectDropdown(false); setIsMenu(false) }} to="/projects/water">Water</Link>
                  </li>
                  <li>
                    <Link onClick={() => { setProjectDropdown(false); setIsMenu(false) }} to="/projects/health">Health</Link>
                  </li>
                  <li>
                    <Link onClick={() => { setProjectDropdown(false); setIsMenu(false) }} to="/projects/education">Education</Link>
                  </li>
                  <li>
                    <Link onClick={() => { setProjectDropdown(false); setIsMenu(false) }} to="/projects/sustainable-construction">Sustainable construction</Link>
                  </li>
                  <li>
                    <Link onClick={() => { setProjectDropdown(false); setIsMenu(false) }} to="/projects/farming">Farming</Link>
                  </li>
                </ul>}
              </li>
              <li>
                <Link to="/news" onClick={() => { setIsDropDwonUser(false); setProjectDropdown(false); setResourcesDropdown(false); setIsMenu(false) }}>News</Link>
              </li>
              <li>
                <Link to="/submit-project" onClick={() => { setIsDropDwonUser(false); setProjectDropdown(false); setResourcesDropdown(false); setIsMenu(false) }}>Submit Projects</Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => { setIsDropDwonUser(false); setProjectDropdown(false); setResourcesDropdown(false); setIsMenu(false) }}>Contact Us</Link>
              </li>
              {!userInfo.username ? <li>
                <Link to="/Login" onClick={() => { setIsDropDwonUser(false); setProjectDropdown(false); setResourcesDropdown(false); setIsMenu(false) }}>Login</Link>
              </li> :
                <li className="relative">
                  <span onClick={() => { setIsDropDwonUser(!isDropDownUser); setProjectDropdown(false); setResourcesDropdown(false) }} className="cursor-pointer flex items-center gap-2"> Hi, {userInfo.username} {!isDropDownUser ? <FaChevronDown /> : <FaChevronUp />}</span>
                  {isDropDownUser &&
                    <div className={`w-fit ${screenSize > 980 && 'absolute'} flex flex-col gap-1 bg-primary px-4 py-2`}>
                      <a href='/profile' onClick={() => setIsMenu(false)} className="flex items-center gap-2">
                        <FaUser /><span>Profile</span>
                      </a>
                      {userInfo.adminAccount &&
                        <a href='/admin/dashboard' onClick={() => setIsMenu(false)} className="flex items-center gap-2">
                          <MdAdminPanelSettings /><span>Admin</span>
                        </a>
                      }
                      <button className="flex items-center gap-2" onClick={submitLogout}>
                        <CiLogout /><span>Sign out</span>
                      </button>
                    </div>
                  }
                </li>}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
