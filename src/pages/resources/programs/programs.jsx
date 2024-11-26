import React from "react";
import { FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { getAllCenters, getAllFaculty } from "../../../api";
import { useSearchParams } from "react-router-dom";
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { pagination } from "../../../utils/constants";

function Programs() {

    const [queryParameters] = useSearchParams();
    const [centers, setCenters] = useState([])
    const [centersCount, setCentersCount] = useState([])
    const [facultyCount, setFacultyCount] = useState([])
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [facultyPage, setFacultyPage] = useState(queryParameters.get("facultyPage") ? queryParameters.get("facultyPage") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [facultyFilteredPagination, setFacultyFilteredPagination] = useState([]);
    const [facultyState, setFacultyState] = useState([])
    const [selectFilter, setSelectFilter] = useState("all");
    const [textFilter, setTextFilter] = useState('');
    const [textSearchFilter, setTextSearchFilter] = useState('');
    const [isFilter, setIsFilter] = useState(false);
    const baseCenterUrl = 'https://iajes-testing.netlify.app/resources/programs'

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
                setPage(centersCount);
            } else {
                setPage(parseInt(queryParameters.get("page")) - 1);
            }
        } else if (action == "sum") {
            if (page == centersCount) {
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

    async function updateFacultyPage(action) {
        if (action == "subtract") {
            if (facultyPage == 1) {
                setFacultyPage(facultyCount);
            } else {
                setFacultyPage(parseInt(queryParameters.get("facultyPage")) - 1);
            }
        } else if (action == "sum") {
            if (page == facultyCount) {
                setFacultyPage(1);
            } else {
                if (queryParameters.get("facultyPage") == null) {
                    setFacultyPage(2);
                } else {
                    setFacultyPage(parseInt(queryParameters.get("facultyPage")) + 1);
                }
            }
        }
    }

    useEffect(() => {
        function checkPagination() {
            const p = Number(queryParameters.get("page"));
            if (centersCount < 5) {
                setFilteredPagination(range(1, centersCount + 1));
            } else if (p > 5 && p <= centersCount - 5) {
                setFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
            } else if (p <= 5) {
                setFilteredPagination([1, 2, 3, 4, 5]);
            } else if (p > centersCount - 5) {
                const array = range(p, centersCount + 1);
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
    }, [centersCount]);


    useEffect(() => {
        function checkPagination() {
            const p = Number(queryParameters.get("facultyPage"));
            if (facultyCount < 5) {
                setFacultyFilteredPagination(range(1, facultyCount + 1));
            } else if (p > 5 && p <= facultyCount - 5) {
                setFacultyFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
            } else if (p <= 5) {
                setFacultyFilteredPagination([1, 2, 3, 4, 5]);
            } else if (p > facultyCount - 5) {
                const array = range(p, facultyCount + 1);
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
                    setFacultyFilteredPagination(array);
                }
            }
        }
        checkPagination();
    }, [facultyCount]);

    useEffect(() => {
        async function loadAllFaculty() {
            const faculty = queryParameters.get("facultyTitle");
            const topic = queryParameters.get("topic");
            const email = queryParameters.get("email");
            const country = queryParameters.get("country");
            const university = queryParameters.get("university");

            let res = [{ data: "" }];
            if (university != null) {
                res = await getAllFaculty({ university: university, isAdmin: false, page: facultyPage });
            } else if (topic != null) {
                res = await getAllFaculty({
                    topic: topic,
                    page: facultyPage,
                    isAdmin: false,
                });
            } else if (email != null) {
                res = await getAllFaculty({
                    email: email,
                    page: facultyPage,
                    isAdmin: false,
                });
            } else if (country != null) {
                res = await getAllFaculty({
                    country: country,
                    page: facultyPage,
                    isAdmin: false,
                });
            } else if (faculty != null) {
                res = await getAllFaculty({
                    faculty: faculty,
                    page: facultyPage,
                    isAdmin: false,
                });
            }
            else if (faculty == null && country == null && email == null && topic == null && university == null) {
                res = await getAllFaculty({ page: facultyPage, isAdmin: false });
            }
            setFacultyState(res.data.faculty)
            setFacultyCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );

        }

        async function loadAllCenters() {

            const res = await getAllCenters({ isAdmin: false, page: page });
            setCenters(res.data.centers)

            setCentersCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );

        }
        loadAllFaculty()
        loadAllCenters()
    }, [])

    async function submitFilter(e) {
        e.preventDefault();

        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `${baseCenterUrl}?page=${page}`
            );
        } else if (selectFilter == "facultyTitle") {
            window.history.replaceState(
                "",
                "",
                `${baseCenterUrl}?facultyTitle=${textFilter}&page=1`
            );
        } else if (selectFilter == "topic") {
            window.history.replaceState(
                "",
                "",
                `${baseCenterUrl}?topic=${textFilter}&page=1`
            );
        } else if (selectFilter == "email") {
            window.history.replaceState(
                "",
                "",
                `${baseCenterUrl}?email=${textFilter}&page=1`
            );
        } else if (selectFilter == "country") {
            window.history.replaceState(
                "",
                "",
                `${baseCenterUrl}?country=${textFilter}&page=1`
            );
        } else if (selectFilter == "university") {
            window.history.replaceState(
                "",
                "",
                `${baseCenterUrl}?university=${textFilter}&page=1`
            );
        }

        window.location.reload(false);
    }

    return (
        <section>
            <div>
                <div className="w-full h-[30rem] bg-[url('/media/images/resources/hero.png')] bg-no-repeat bg-cover bg-center text-white flex items-center">
                    <div className="container mx-auto px-5">
                        <h1 className="text-4xl sm:text-[64px] max-w-[900px] leading-tight sm:leading-none">
                            Resources
                        </h1>
                    </div>
                </div>
                <div className="container mx-auto mt-10 px-2">
                    <div className="mt-14">
                        <div className="mt-5">
                            <h2>Programs at Jesuit Schools</h2>
                            <h3 className="mt-5 mb-3 text-gray-500">Programs</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-5">
                            {
                                centers.map((center, index) => (
                                    <div key={index}>
                                        <div className="max-w-[25rem] h-[20rem] overflow-hidden">
                                            <img
                                                src={`https://deividcuello.pythonanywhere.com${center.cover_url}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="">
                                            <h3>{center.center}</h3>
                                            <div className="flex flex-col gap-1">
                                                <p>{center.program_name}</p>
                                                <p>{center.location}</p>
                                                <p>{center.phone}</p>
                                                <p>{center.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        {filteredPagination.length > 1 && <div className="mt-10">
                            <ul className="pagination">
                                <li>
                                    <a
                                        href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=1&facultyPage=${facultyPage}` :
                                            queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=1&facultyPage=${facultyPage}` :
                                                queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=1&facultyPage=${facultyPage}` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=1&facultyPage=${facultyPage}` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=1&facultyPage=${facultyPage}` : `/resources/programs?page=1&facultyPage=${facultyPage}`}
                                        onClick={() => updatePage("subtract")}
                                        className="!p-0"
                                    >
                                        <MdKeyboardDoubleArrowLeft />
                                    </a>
                                </li>
                                <li>
                                    {
                                        <a
                                            href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=${page}&facultyPage=${facultyPage}` :
                                                queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=${page}&facultyPage=${facultyPage}` :
                                                    queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=${page}&facultyPage=${facultyPage}` : `/resources/programs?page=${page}&facultyPage=${facultyPage}`}
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
                                                href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=${page}&facultyPage=${facultyPage}` :
                                                    queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=${page}&facultyPage=${facultyPage}` :
                                                        queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=${page}&facultyPage=${facultyPage}` : `/resources/programs?page=${page}&facultyPage=${facultyPage}`}
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
                                            href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=${page}&facultyPage=${facultyPage}` :
                                                queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=${page}&facultyPage=${facultyPage}` :
                                                    queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=${page}&facultyPage=${facultyPage}` : `/resources/programs?page=${page}&facultyPage=${facultyPage}`}
                                            onClick={() => updatePage("sum")}
                                            className="!p-0"
                                        >
                                            <MdKeyboardArrowRight />
                                        </a>
                                    }
                                </li>
                                <li>
                                    <a
                                        href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=${centersCount}&facultyPage=1` :
                                            queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=${centersCount}&facultyPage=1` :
                                                queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=${centersCount}&facultyPage=1` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=${centersCount}&facultyPage=1` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=${centersCount}&facultyPage=1` : `/resources/programs?page=${centersCount}&facultyPage=1`}
                                        onClick={() => updatePage("subtract")}
                                        className="!p-0"
                                    >
                                        <MdKeyboardDoubleArrowRight />
                                    </a>
                                </li>
                            </ul>
                        </div>}
                    </div>
                    <div className="mt-14">
                        <div className="mt-5">
                            <h3 className="mt-5 mb-3 text-gray-500">Faculty</h3>
                            <p onClick={() => setIsFilter(true)} className="flex gap-2 items-center font-semibold cursor-pointer"><CiFilter /> Filter</p>
                            <div>
                                {isFilter && <form onSubmit={(event) => submitFilter(event)} className="bg-primary w-fit p-2 relative">
                                    <button onClick={() => setIsFilter(false)} className="absolute top-3 right-3">
                                        <IoMdClose size={'1.4rem'} />
                                    </button>
                                    <span className="text-white text-2xl">Filters</span>
                                    <div className="flex flex-col gap-2 mt-3">
                                        <div className="flex items-center gap-1">
                                            <FaSearch size={'1.2rem'} />
                                            <input type="text" placeholder="Search" onChange={(e) => setTextFilter(e.target.value)} value={textFilter} className="bg-transparent w-full" />
                                        </div>
                                        <select
                                            name="projectsFilter"
                                            id="projectsFilter"
                                            className="focus:outline-none dark:bg-gray-950 w-fit"
                                            onChange={(e) => setSelectFilter(e.target.value)}
                                        >
                                            <option value="all">All</option>
                                            <option value="facultyTitle">Faculty name</option>
                                            <option value="university">University</option>
                                            <option value="topic">Topic</option>
                                            <option value="email">Email</option>
                                            <option value="country">Country</option>
                                        </select>
                                        <input type="submit" value='Apply' className="bg-white p-2 w-fit self-end cursor-pointer" />
                                    </div>
                                </form>}
                            </div>
                        </div>
                        <div className="mt-5 grid grid-cols-1 sm:gri
                        d-cols-2 md:grid-cols-3 gap-x-4 gap-y-20">
                            {facultyState.map((item, index) => (
                                <div key={index} className="flex flex-col gap-3">
                                    <h4>{item.title}</h4>
                                    <p>{item.university}</p>
                                    <p>{item.topics}</p>
                                    <p>{item.country}</p>
                                    <p>{item.email}</p>
                                </div>
                            ))}
                        </div>
                        {facultyFilteredPagination.length > 1 && <div className="mt-10">
                            <ul className="pagination">
                                <li>
                                    <a
                                        href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=${page}&facultyPage=1` :
                                            queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=${page}&facultyPage=1` :
                                                queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=${page}&facultyPage=1` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=${page}&facultyPage=1` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=${page}&facultyPage=1` : `/resources/programs?page=${page}&facultyPage=1`}
                                        onClick={() => updateFacultyPage("subtract")}
                                        className="!p-0"
                                    >
                                        <MdKeyboardDoubleArrowLeft />
                                    </a>
                                </li>
                                <li>
                                    {
                                        <a
                                            href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=${page}&facultyPage=${facultyPage}` :
                                                queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=${page}&facultyPage=${facultyPage}` :
                                                    queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=${page}&facultyPage=${facultyPage}` : `/resources/programs?page=${page}&facultyPage=${facultyPage}`}
                                            onClick={() => updateFacultyPage("subtract")}
                                            className="!p-0"
                                        >
                                            <MdKeyboardArrowLeft />
                                        </a>
                                    }
                                </li>
                                {facultyFilteredPagination.map((item, index) => (
                                    <li key={index}>
                                        {
                                            <a
                                                href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=${page}&facultyPage=${facultyPage}` :
                                                    queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=${page}&facultyPage=${facultyPage}` :
                                                        queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=${page}&facultyPage=${facultyPage}` : `/resources/programs?page=${page}&facultyPage=${facultyPage}`}
                                                onClick={(e) => setFacultyPage(e.target.textContent)}
                                                className={`${(queryParameters.get("facultyPage")
                                                    ? queryParameters.get("facultyPage")
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
                                            href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=${page}&facultyPage=${facultyPage}` :
                                                queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=${page}&facultyPage=${facultyPage}` :
                                                    queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=${page}&facultyPage=${facultyPage}` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=${page}&facultyPage=${facultyPage}` : `/resources/programs?page=${page}&facultyPage=${facultyPage}`}
                                            onClick={() => updateFacultyPage("sum")}
                                            className="!p-0"
                                        >
                                            <MdKeyboardArrowRight />
                                        </a>
                                    }
                                </li>
                                <li>
                                    <a
                                        href={queryParameters.get("facultyTitle") ? `/resources/facultyTitle?=${queryParameters.get("facultyTitle")}&page=${centersCount}&facultyPage=1` :
                                            queryParameters.get("university") ? `/resources/programs?university=${queryParameters.get("university")}&page=${centersCount}&facultyPage=1` :
                                                queryParameters.get("topic") ? `/resources/programs?topic=${queryParameters.get("topic")}&page=${centersCount}&facultyPage=1` : queryParameters.get("email") ? `/resources/programs?email=${queryParameters.get("email")}&page=${centersCount}&facultyPage=1` : queryParameters.get("country") ? `/resources/programs?country=${queryParameters.get("country")}&page=${centersCount}&facultyPage=1` : `/resources/programs?page=${centersCount}&facultyPage=1`}
                                        onClick={() => updateFacultyPage("subtract")}
                                        className="!p-0"
                                    >
                                        <MdKeyboardDoubleArrowRight />
                                    </a>
                                </li>
                            </ul>
                        </div>}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Programs;
