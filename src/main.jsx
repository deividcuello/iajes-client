import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
// import interceptor from "./interceptor";
import Homepage from "./pages/homepage/homepage";
import Layout from "./components/layout/Layout";
import NotFound from "./pages/not-found/not-found";
import About from "./pages/about/about";
import Resources from "./pages/resources/resources";
import News from "./pages/news/news";
import Projects from "./pages/projects/projects";
import Energy from "./pages/projects/energy/energy";
import EnergyProject from "./pages/projects/energy/energy-project/energy-project";
import Water from "./pages/projects/water/water";
import WaterProject from "./pages/projects/water/water-project/water-project";
import Health from "./pages/projects/health/health";
import HealthProject from "./pages/projects/health/health-project/health-project";
import Education from "./pages/projects/education/education";
import EducationProject from "./pages/projects/education/education-project/education-project";
import SustainableConstruction from "./pages/projects/sustainable-construction/sustainable-construction";
import SustainableConstructionProject from "./pages/projects/sustainable-construction/sustainable-construction-project/sustainable-construction-project";
import Farming from "./pages/projects/farming/farming";
import FarmingProject from "./pages/projects/farming/farming-project/farming-project";
import NewsDetail from "./pages/news/news-detail.jsx/news-detail";
import Dashboard from "./pages/admin/dashboard/dashboard";
import Users from "./pages/admin/users/users";
import ResourcesAdmin from "./pages/admin/resources/resources";
import CentersAdmin from "./pages/admin/resources/centers/centers";
import Programs from "./pages/resources/programs/programs";
import VideosAdmin from "./pages/admin/resources/videos/videos";
import DocumentsAdmin from "./pages/admin/resources/documents/documents";
import ProjectsAdmin from "./pages/admin/projects/projects";
import NewsAdmin from "./pages/admin/news/news";
import Centers from "./pages/resources/centers/centers";
import Video from "./pages/resources/video/video";
import Documents from "./pages/resources/documents/documents";
import Contact from "./pages/contact/contact";
import SubmitProject from "./pages/submitProject/submitProject";
import Login from "./pages/login/login";
import Profile from "./pages/profiile/profile";
import Register from "./pages/register/register";
import RecoverAccount from "./pages/recover-account/recoverAccount";
import Academic from "./pages/resources/academic/academic";
import FacultyAdmin from "./pages/admin/resources/faculty/faculty";
import SubmitProjectAdmin from "./pages/admin/submit-project/submit-project";
import { getUsers, checkLogin } from "./api";
import Cookies from "js-cookie";
import AllProjectsAdmin from "./pages/admin/all-projects/all-projects";
import UserProjects from "./pages/user-projects/user-projects";
import RegionalAssociationAdmin from "./pages/admin/resources/regional-association/regional-association";
import KircherAssociation from "./pages/resources/regional-associations/kircher";
import JheasaAssociation from "./pages/resources/regional-associations/jheasa";
import AjcuApAssociation from "./pages/resources/regional-associations/ajcu-ap";
import AusjalAssociation from "./pages/resources/regional-associations/ausjal";
import AjcuAmAssociation from "./pages/resources/regional-associations/ajcu-am";
import AjcuAssociation from "./pages/resources/regional-associations/ajcu";

let userInfo = false

async function checkAdmin() {
  
  try {
    const res = await getUsers({isAdmin: false, page:1})
    if (res.data.count == 0) { 
      let formData = new FormData();
      formData.append("email", 'allammorales@gmail.com');
      formData.append("username", 'allanmorales');
      formData.append("password", 'adminadmin');
      formData.append("isDelete", false);
      formData.append("adminAccount", true);
      formData.append("name", 'Allan Morales');
      formData.append("university", 'Santa Clara University');
      formData.append("phone", '000-000-0000');
      formData.append("department", 'Frugal Innovation');
      
      let newUser = fetch('https://deividcuello.pythonanywhere.com/api/auth/register', {
        credentials: "include",
        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
        method: "POST",
        body: formData,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

checkAdmin()

async function isLogged() {
  try {
    const res = await checkLogin();
    userInfo = res.data.user.adminAccount;
  } catch (error) {
    console.log(err)
    userInfo = false
  }
}

isLogged();

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/submit-project",
        element: <SubmitProject />,
      },
      {
        path: "/my-projects",
        element: <UserProjects />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/recover-account",
        element: <RecoverAccount />,
      },
      // {
      //   path: "/resources",
      //   element: <Resources />,
      // },
      {
        path: "/resources/centers",
        element: <Centers />,
      },
      {
        path: "/resources/programs",
        element: <Programs />,
      },
      {
        path: "/resources/academic",
        element: <Academic />,
      },
      {
        path: "/resources/regional-associations/kircher",
        element: <KircherAssociation />,
      },
      {
        path: "/resources/regional-associations/jheasa",
        element: <JheasaAssociation />,
      },
      {
        path: "/resources/regional-associations/ausjal",
        element: <AusjalAssociation />,
      },
      {
        path: "/resources/regional-associations/ajcu-ap",
        element: <AjcuApAssociation />,
      },
      {
        path: "/resources/regional-associations/ajcu-am",
        element: <AjcuAmAssociation />,
      },
      {
        path: "/resources/regional-associations/ajcu",
        element: <AjcuAssociation />,
      },
      // {
      //   path: "/resources/videos",
      //   element: <Video />,
      // },
      // {
      //   path: "/resources/documents",
      //   element: <Documents />,
      // },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/news/:news_title",
        element: <NewsDetail />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/projects/energy",
        element: <Energy />,
      },
      {
        path: "/projects/energy/:project_name",
        element: <EnergyProject />,
      },
      {
        path: "/projects/water",
        element: <Water />,
      },
      {
        path: "/projects/water/:project_name",
        element: <WaterProject />,
      },
      {
        path: "/projects/health",
        element: <Health />,
      },
      {
        path: "/projects/health/:project_name",
        element: <HealthProject />,
      },
      {
        path: "/projects/education",
        element: <Education />,
      },
      {
        path: "/projects/education/:project_name",
        element: <EducationProject />,
      },
      {
        path: "/projects/sustainable-construction",
        element: <SustainableConstruction />
      },
      {
        path: "/projects/sustainable-construction/:project_name",
        element: <SustainableConstructionProject />
      },
      {
        path: "/projects/farming",
        element: <Farming />
      },
      {
        path: "/projects/farming/:project_name",
        element: <FarmingProject />
      },
      {
        path: "/admin/dashboard",
        element: <Dashboard />
      },
      {
        path: "/admin/users",
        element: <Users />
      },
      {
        path: "/admin/resources",
        element: <ResourcesAdmin />
      },
      {
        path: "/admin/resources/programs",
        element: <CentersAdmin />
      },
      {
        path: "/admin/resources/faculty",
        element: <FacultyAdmin />,
      },
      {
        path: "/admin/resources/videos",
        element: <VideosAdmin />
      },
      {
        path: "/admin/resources/documents",
        element: <DocumentsAdmin />
      },
      {
        path: "/admin/resources/regional-associations",
        element: <RegionalAssociationAdmin />
      },
      {
        path: "/admin/projects/approved",
        element: <ProjectsAdmin />
      },
      {
        path: "/admin/projects/pendings",
        element: <SubmitProjectAdmin />
      },
      {
        path: "/admin/projects",
        element: <AllProjectsAdmin />
      },
      {
        path: "/admin/news",
        element: <NewsAdmin />
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
