import React from 'react'
import { useState, useEffect } from 'react'
import { checkLogin, getAllProjects } from '../../api'
import { pagination } from '../../utils/constants'
import { useSearchParams, Link } from 'react-router-dom'
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'

function UserProjects() {
    const [queryParameters] = useSearchParams();
    const [myProjects, setMyProjects] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const [myPendings, setMyPendings] = useState([])
    const [projectsCount, setProjectsCount] = useState([]);
    const [pendingsCount, setPendingsCount] = useState([]);
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [pagePendings, setPagePendings] = useState(queryParameters.get("pagePendings") ? queryParameters.get("pagePendings") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [pendingsFilteredPagination, setPendingsFilteredPagination] = useState([]);

    function isInt(value) {
        const er = /^-?[0-9]+$/;
        return er.test(value);
    }

    const range = (start, stop, step = 1) => {
        try {
            return Array(Math.ceil((stop - start) / step))
                .fill(start)
                .map((x, y) => x + y * step);
        } catch (err) {
            console.clear();
        }
    };

    async function updatePage(action) {
        if (action == "subtract") {
            if (page == 1) {
                setPage(projectsCount);
            } else {
                setPage(parseInt(queryParameters.get("page")) - 1);
            }
        } else if (action == "sum") {
            if (page == projectsCount) {
                setPage(1);
            } else {
                if (queryParameters.get("page") == null) {
                    setPage(2);
                } else {
                    setPage(parseInt(queryParameters.get("page")) + 1);
                }
            }
        }
    }
    async function updatePendingPage(action) {
        if (action == "subtract") {
            if (pagePendings == 1) {
                setPagePendings(pendingsCount);
            } else {
                setPagePendings(parseInt(queryParameters.get("pagePendings")) - 1);
            }
        } else if (action == "sum") {
            if (pagePendings == pendingsCount) {
                setPagePendings(1);
            } else {
                if (queryParameters.get("pagePendings") == null) {
                    setPagePendings(2);
                } else {
                    setPagePendings(parseInt(queryParameters.get("pagePendings")) + 1);
                }
            }
        }
    }

    useEffect(() => {
        function checkPagination() {
            const p = Number(queryParameters.get("page"));
            if (projectsCount < 5) {
                setFilteredPagination(range(1, projectsCount + 1));
            } else if (p > 5 && p <= projectsCount - 5) {
                setFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
            } else if (p <= 5) {
                setFilteredPagination([1, 2, 3, 4, 5]);
            } else if (p > projectsCount - 5) {
                const array = range(p, projectsCount + 1);
                try {
                    if (array.length < 5) {
                        while (array.length < 5) {
                            array.unshift(array[0] - 1);
                        }
                    }
                } catch (err) {
                    ("");
                }
                if (array instanceof Array) {
                    setFilteredPagination(array);
                }
            }
        }
        checkPagination();
    }, [projectsCount]);

    useEffect(() => {
        function checkPagination() {
            const p = Number(queryParameters.get("page"));
            if (pendingsCount < 5) {
                setPendingsFilteredPagination(range(1, pendingsCount + 1));
            } else if (p > 5 && p <= pendingsCount - 5) {
                setPendingsFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
            } else if (p <= 5) {
                setPendingsFilteredPagination([1, 2, 3, 4, 5]);
            } else if (p > pendingsCount - 5) {
                const array = range(p, pendingsCount + 1);
                try {
                    if (array.length < 5) {
                        while (array.length < 5) {
                            array.unshift(array[0] - 1);
                        }
                    }
                } catch (err) {
                    ("");
                }
                if (array instanceof Array) {
                    setPendingsFilteredPagination(array);
                }
            }
        }
        checkPagination();
    }, [pendingsCount]);

    useEffect(() => {
        async function loadAllProjects() {
            try {
                const res = await checkLogin()
                setUserInfo(res.data.user)
                const res1 = await getAllProjects({ industry: true, approved: true, isAdmin: true, page: page, userId: res.data.user.id });
                setMyProjects(res1.data.projects)
                setProjectsCount(
                    isInt(res1.data.count / pagination.SIZE)
                        ? Math.floor(res1.data.count / pagination.SIZE)
                        : Math.floor(res1.data.count / pagination.SIZE) + 1
                );

                const res2 = await getAllProjects({ industry: true, approved: false, isAdmin: true, page: pagePendings, userId: res.data.user.id });
                setMyPendings(res2.data.projects)
                setPendingsCount(
                    isInt(res2.data.count / pagination.SIZE)
                        ? Math.floor(res2.data.count / pagination.SIZE)
                        : Math.floor(res2.data.count / pagination.SIZE) + 1
                );
            } catch (error) {
                window.location.href = '/login'
            }
        }

        loadAllProjects()

    }, [])

    function formatDateInWords(dateString) {
        // Array of month names
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Extract year, month, and day from the date
        const dateObject = new Date(dateString.split("-"));
        const year = dateObject.getFullYear();
        const monthIndex = dateObject.getMonth();
        const month = months[monthIndex];
        const day = dateObject.getDate();

        // Construct the date in words
        const dateInWords = `${month} ${day}, ${year}`;

        return dateInWords;
    }

    return (
        <section className='min-h-screen container mx-auto'>
            {userInfo.id && <div>
                <div className='mt-5'>
                    <h1>Welcome, {userInfo.name}</h1>
                    <h2 className='text-gray-500'>My Projects</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                        {myProjects.map((project, index) => {
                            return <a key={index} href={`/projects/${project.industry == 'sustainable_construction' ? 'sustainable-construction' : project.industry}/${project.slug}`}>
                                <div className='w-[20rem]'>
                                    <div className='w-[20rem] h-[15rem] overflow-hidden'>
                                        <img src={`https://deividcuello.pythonanywhere.com${project.image_url}`} className='w-full h-full object-cover' alt="" />
                                    </div>
                                    <h4>{project.title}</h4>
                                    <span className='text-gray-500'>Published on {formatDateInWords(project.published_date)}</span><br></br>
                                    <span className={`text-white px-2 py-1 mt-1 inline-block ${project.hidden ? 'bg-red-500' : 'bg-green-500'}`}>Project is {project.hidden ? 'hidden' : 'visible'}</span>
                                </div>
                            </a>
                        })}
                    </div>
                    {filteredPagination.length > 1 && <div className="mt-10">
                        <ul className="pagination">
                            <li>
                                <a
                                    href={
                                        `/my-projects?pagePendings=${pagePendings}&page=1`
                                    }
                                    onClick={() => updatePage("subtract")}
                                    className="!p-0"
                                >
                                    <MdKeyboardDoubleArrowLeft />
                                </a>
                            </li>
                            <li>
                                {
                                    <a
                                        href={
                                            `/my-projects?pagePendings=${pagePendings}&page=${page}`
                                        }
                                        onClick={() => updatePage("subtract")}
                                        className="!p-0"
                                    >
                                        <MdKeyboardArrowLeft />
                                    </a>
                                }
                            </li>
                            {filteredPagination.map((item, index) => (
                                <li key={index}>
                                    {
                                        <a
                                            href={
                                                `/my-projects?pagePendings=${pagePendings}&page=${page}`
                                            }
                                            onClick={(e) => setPage(e.target.textContent)}
                                            className={`${(queryParameters.get("page")
                                                ? queryParameters.get("page")
                                                : 1) == item && "active-page"
                                                }`}
                                        >
                                            {item}
                                        </a>
                                    }
                                </li>
                            ))}
                            <li>
                                {
                                    <a
                                        href={
                                            `/my-projects?pagePendings=${pagePendings}&page=${page}`
                                        }
                                        onClick={() => updatePage("sum")}
                                        className="!p-0"
                                    >
                                        <MdKeyboardArrowRight />
                                    </a>
                                }
                            </li>
                            <li>
                                <a
                                    href={
                                        `/my-projects?pagePendings=${pagePendings}&page=${projectsCount}`
                                    }
                                    onClick={() => updatePage("subtract")}
                                    className="!p-0"
                                >
                                    <MdKeyboardDoubleArrowRight />
                                </a>
                            </li>
                        </ul>
                    </div>}
                    <div className='mt-10'>
                        <h2 className='text-gray-500'>Create New Project</h2>
                        <Link to='/submit-project'>
                            <div className='aspect-square w-52 bg-gray-200 dark:bg-gray-900 flex items-center justify-center'>
                                <span className='text-5xl'>+</span>
                            </div>
                        </Link>
                    </div>

                    <div className='mt-10'>
                        <h2 className='text-gray-500'>Pendings Projects</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
                            {myPendings.map((project, index) => (
                                <div key={index}>
                                    <div className='w-[20rem]'>
                                        <div className='w-[20rem] h-[15rem] overflow-hidden'>
                                            <img src={`https://deividcuello.pythonanywhere.com${project.image_url}`} className='w-full h-full object-cover' alt="" />
                                        </div>
                                        <h4>{project.title}</h4>
                                    </div>
                                    <Link to={`https://iajes-testing.netlify.app/submit-project?slug=${project.slug}`} className='bg-primary py-1 px-2 mt-1 inline-block text-white'>Edit</Link>
                                </div>
                            ))}
                        </div>
                        {pendingsFilteredPagination.length > 1 && <div className="mt-10">
                            <ul className="pagination">
                                <li>
                                    <a
                                        href={
                                            `/my-projects?pagePendings=1&page=${page}`
                                        }
                                        onClick={() => updatePendingPage("subtract")}
                                        className="!p-0"
                                    >
                                        <MdKeyboardDoubleArrowLeft />
                                    </a>
                                </li>
                                <li>
                                    {
                                        <a
                                            href={
                                                `/my-projects?pagePendings=${pagePendings}&page=${page}`
                                            }
                                            onClick={() => updatePendingPage("subtract")}
                                            className="!p-0"
                                        >
                                            <MdKeyboardArrowLeft />
                                        </a>
                                    }
                                </li>
                                {pendingsFilteredPagination.map((item, index) => (
                                    <li key={index}>
                                        {
                                            <a
                                                href={
                                                    `/my-projects?pagePendings=${pagePendings}&page=${page}`
                                                }
                                                onClick={(e) => setPagePendings(e.target.textContent)}
                                                className={`${(queryParameters.get("pagePendings")
                                                    ? queryParameters.get("pagePendings")
                                                    : 1) == item && "active-page"
                                                    }`}
                                            >
                                                {item}
                                            </a>
                                        }
                                    </li>
                                ))}
                                <li>
                                    {
                                        <a
                                            href={
                                                `/my-projects?pagePendings=${pagePendings}&page=${page}`
                                            }
                                            onClick={() => updatePendingPage("sum")}
                                            className="!p-0"
                                        >
                                            <MdKeyboardArrowRight />
                                        </a>
                                    }
                                </li>
                                <li>
                                    <a
                                        href={
                                            `/my-projects?pagePendings=${pendingsCount}&page=${page}`
                                        }
                                        onClick={() => updatePendingPage("subtract")}
                                        className="!p-0"
                                    >
                                        <MdKeyboardDoubleArrowRight />
                                    </a>
                                </li>
                            </ul>
                        </div>}
                    </div>

                </div>
            </div>}
        </section>
    )
}

export default UserProjects