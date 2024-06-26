import React from 'react'
import Cookies from "js-cookie";
import { deleteProject, getAllProjects, getProject, checkLogin } from '../../../api'
import { useEffect, useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa6'
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { CiFilter } from 'react-icons/ci';
import { FaSearch } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmAction from '../../../components/confirm-action/confirm.action';
import { useSearchParams } from "react-router-dom";
import { pagination } from '../../../utils/constants';

function ProjectsAdmin() {
    const [queryParameters] = useSearchParams();
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [userInfo, setUserInfo] = useState({})
    const [projectsCount, setProjectsCount] = useState([]);
    const [isProjectModal, setIsProjectModal] = useState(false)
    const [projectsData, setProjectsData] = useState([])
    const [isWorking, setIsWorking] = useState(false)
    const [startYear, setStartYear] = useState('2016')
    const [endYear, setEndYear] = useState('2017')
    const [keywords, setKeywords] = useState([])
    const [keyword, setKeyword] = useState('')
    const [partnerOrganization, setPartnerOrganization] = useState('')
    const [title, setTitle] = useState('')
    const [college, setCollege] = useState('')
    const [investigator, setInvestigator] = useState('')
    const [region, setRegion] = useState('kircher')
    const [summary, setSummary] = useState('')
    const [industry, setIndustry] = useState('energy')
    const [email, setEmail] = useState('')
    const [action, setAction] = useState({ create: true, edit: false })
    const [isFilter, setIsFilter] = useState(false);
    const [textFilter, setTextFilter] = useState('');
    const [selectFilter, setSelectFilter] = useState("university");
    const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState({
        isDelete: false,
    });

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
        async function loadAllProjects() {
            // const res = await getAllProjects({ isAdmin: true, page: page })
            // setProjectsData(res.data.projects)

            const university = queryParameters.get("university");
            const association = queryParameters.get("association");
            const year = queryParameters.get("year");
            const investigator = queryParameters.get("investigator");
            const projectName = queryParameters.get("projectName");
            const id = queryParameters.get("id");
            let res = [{ data: "" }];
            if (university != null) {
                res = await getAllProjects({ university: university, industry: true, isAdmin: true, page: page, approved: true });
            } else if (association != null) {
                res = await getAllProjects({
                    association: association,
                    page: page,
                    isAdmin: true,
                    approved: true
                });
            } else if (year != null) {
                res = await getAllProjects({
                    year: year,
                    page: page,
                    isAdmin: true,
                    approved: true
                });
            } else if (investigator != null) {
                res = await getAllProjects({
                    investigator: investigator,
                    page: page,
                    isAdmin: true,
                    industry: true,
                    approved: true
                });
            } else if (projectName != null) {
                res = await getAllProjects({
                    projectName: projectName,
                    page: page,
                    isAdmin: true,
                    industry: true,
                    approved: true
                });
            } else if (id != null) {
                res = await getAllProjects({
                    id: id,
                    page: page,
                    isAdmin: true,
                    industry: true,
                    approved: true
                });
            }
            else if (university == null && association == null && year == null && investigator == null && id == null) {
                res = await getAllProjects({ page: page, isAdmin: true, approved: true });
            }

            setProjectsData(res.data.projects)

            setProjectsCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );

            const res1 = await checkLogin()
            setUserInfo(res1.data.user)
        }
        loadAllProjects()
    }, [])

    async function submitFilter(e) {
        e.preventDefault();
        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `/admin/projects/approved?page=1`
            );
        } else if (selectFilter == "university") {
            window.history.replaceState(
                "",
                "",
                `/admin/projects/approved?university=${textFilter}&page=1`
            );
        } else if (selectFilter == "association") {
            window.history.replaceState(
                "",
                "",
                `/admin/projects/approved?association=${textFilter}&page=1`
            );
        } else if (selectFilter == "year") {
            window.history.replaceState(
                "",
                "",
                `/admin/projects/approved?year=${textFilter}&page=1`
            );
        } else if (selectFilter == "investigator") {
            window.history.replaceState(
                "",
                "",
                `/admin/projects/approved?investigator=${textFilter}&page=1`
            );
        } else if (selectFilter == "id") {
            window.history.replaceState(
                "",
                "",
                `/admin/projects/approved?id=${textFilter}&page=1`
            );
        } else if (selectFilter == "projectName") {
            window.history.replaceState(
                "",
                "",
                `/admin/projects/approved?projectName=${textFilter}&page=1`
            );
        }

        window.location.reload(false);
    }

    const handlerDeleteConfirmModal = (bool) => {
        setIsDeleteConfirmModal(bool);
    };

    function checkEmail() {
        if (!email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
            return false
        } else {
            return true
        }
    }

    const createProject = (event) => {
        event.preventDefault();
        const imageInput = document.querySelector("#imageInput");
        let image = imageInput.files[0];
        let formData = new FormData();
        formData.append("image_url", image);
        formData.append("title", title);
        formData.append("college", college);
        formData.append("industry", industry);
        formData.append("investigator", investigator);
        formData.append("region", region);
        formData.append("summary", summary);
        formData.append("approved", true);
        formData.append("email", email);
        formData.append("start_year", startYear);
        formData.append("end_year", endYear);
        formData.append("partner_organization", partnerOrganization);
        formData.append("keywords", keywords.join(', '));
        formData.append("isWorking", isWorking);
        formData.append("approved", true);
        formData.append("user", userInfo.id)

        if (title.length == 0) {
            return toast.error("Add a title", {
                position: "top-center",
            })
        } else if (!image) {
            return toast.error("Add an image", {
                position: "top-center",
            })
        } else if (college.length == 0) {
            return toast.error("Add a college", {
                position: "top-center",
            })
        } else if (!industry) {
            return toast.error("Add an industry", {
                position: "top-center",
            })
        } else if (investigator.length == 0) {
            return toast.error("Add an investigator", {
                position: "top-center",
            })
        } else if (region.length == 0) {
            return toast.error("Add a region", {
                position: "top-center",
            })
        } else if (summary.length == 0) {
            return toast.error("Add a summary", {
                position: "top-center",
            })
        } else if (email.length == 0) {
            return toast.error("Add an email", {
                position: "top-center",
            })
        } else if (!checkEmail()) {
            return toast.error("Invalid email ", {
                position: "top-center",
            })
        }

        if (action.create) {
            formData.append("hidden", true);
            formData.append("published_date", new Date().toISOString().split('T')[0]);
            fetch('https://deividcuello.pythonanywhere.com/api/projects/', {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "POST",
                body: formData,
            })
                .then((res) => window.location.reload(false)
                )
                .catch((error) =>
                    console.clear()
                );
        }
        else if (action.edit) {
            formData.append("hidden", action.hidden);
            formData.append("published_date", action.published_date);
            const tempAction = {
                ...action,
                isImageUrl: imageInput.files[0].name,
                image: imageInput.files[0],
            };
            formData.append("isImageUrl", tempAction.isImageUrl);

            fetch(`https://deividcuello.pythonanywhere.com/api/projects/${action.edit}/`, {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "PUT",
                body: formData,
            })
                .then((res) => window.location.reload(false)
                )
                .catch((error) =>
                    console.clear()
                );
        }
    };

    function deleteProjectFunc(slug) {
        deleteProject(slug);
    }

    async function editProject(slug) {
        setIsProjectModal(true);
        const getProjectData = await getProject({ slug: slug });
        const data = getProjectData.data;
        const imageInput = document.querySelector("#imageInput");
        setAction({ create: false, edit: true })
        setTitle(data.title);
        setCollege(data.college)
        setIndustry(data.industry)
        setInvestigator(data.investigator)
        setStartYear(data.start_year)
        setEndYear(data.end_year)
        setPartnerOrganization(data.partner_organization)
        setKeywords(data.keywords.split(", "))
        setIsWorking(data.isWorking)
        setRegion(data.region)
        setSummary(data.summary)
        setEmail(data.email)

        let list = new DataTransfer();
        let file = new File(["content"], `https://deividcuello.pythonanywhere.com${data.image_url}`);
        list.items.add(file);
        let myFileList = list.files;
        imageInput.files = myFileList;
        setAction({
            edit: slug,
            hidden: data.hidden,
            published_date: data.published_date,
            approved: true,
            image: file.name,
            isImageUrl: "",
        });
    }

    function setIsProjectModalFunc() {
        setAction({ create: true, edit: false })
        setIsProjectModal(false)

        setTitle('');
        setCollege('')
        setIndustry('')
        setInvestigator('')
        setRegion('')
        setSummary('')
        setEmail('')

        setStartYear('')
        setEndYear('')
        setPartnerOrganization('')
        setKeywords([])
        setIsWorking('')
    }

    async function toggleHidden(slug) {
        const projectData = await getProject({ slug: slug });
        const data = projectData.data;
        let list = new DataTransfer();
        let file = new File(["content"], `https://deividcuello.pythonanywhere.com${data.image_url}`);
        list.items.add(file);
        let myFileList = list.files;

        const jsonData = JSON.stringify({
            title: data.title,
            hidden: !data.hidden,
            image_url: myFileList,
            isImageUrl: file.name,
            college: data.college,
            industry: data.industry,
            investigator: data.investigator,
            isWorking: data.isWorking,
            start_year: data.start_year,
            end_year: data.end_year,
            partner_organization: data.partner_organization,
            keywords: data.keywords,
            approved: data.approved,
            region: data.region,
            summary: data.summary,
            email: data.email,
            approved: data.approved,
            published_date: data.published_date
        });

        let editProject = fetch(`https://deividcuello.pythonanywhere.com/api/projects/${slug}/`, {
            credentials: "include",
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken"),
                Accept: "application/json, text/plain",
                "Content-Type": "application/json;charset=UTF-8",
            },
            method: "PUT",
            body: jsonData,
        })
            .then((res) => window.location.reload(false))
            .catch((error) =>
                toast.error("Error occurred", { position: toast.POSITION.TOP_CENTER })
            );
    }

    function addKeywork() {
        if (keyword.replace(/\s+/g, ' ').trim() == '') {
            return
        }
        if (!(/^[A-Za-z0-9\s]*$/.test(keyword))) {
            return toast.error("Only letters, spaces and numbers are allowed in topics", { position: "top-center" })
        }
        setKeywords([
            ...keywords,
            keyword.trim()
        ]);
        setKeyword('')
    }

    function removeKeyword(index) {
        setKeywords(
            keywords.filter((item, idx) =>
                idx != index
            )
        );
    }

    return (
        <section className='container mx-auto mt-5 px-5'>
            {!isProjectModal && <div className={`${isProjectModal && 'hidden'}`}>
                <div>
                    <button onClick={() => setIsProjectModal(true)} className='btn dark:bg-primary !text-white bg-darkPrimary'>Upload Project</button>
                </div>
                <div className='mt-2'>
                    <h2>Projects</h2>
                    <div className="mt-5 mb-5">
                        <p onClick={() => setIsFilter(true)} className="flex gap-2 items-center font-semibold cursor-pointer"><CiFilter /> Filters</p>
                        <div>
                            {isFilter && <form onSubmit={(event) => submitFilter(event)} className=" bg-darkPrimary w-fit p-2 relative">
                                <button onClick={() => setIsFilter(false)} className="absolute top-3 right-3">
                                    <IoMdClose size={'1.4rem'} />
                                </button>
                                <span className="text-white text-2xl">Filters</span>
                                <div className="flex flex-col gap-2 mt-3">
                                    <div className="flex items-center gap-1">
                                        <FaSearch size={'1.2rem'} />
                                        <input type="text" placeholder="Search" onChange={(e) => setTextFilter(e.target.value)} value={textFilter} className="bg-transparent dark:bg-transparent w-full" />
                                    </div>
                                    <select
                                        name="projectsFilter"
                                        id="projectsFilter"
                                        className="focus:outline-none dark:bg-gray-950 w-fit"
                                        onChange={(e) => setSelectFilter(e.target.value)}
                                    >
                                        <option value="all">All</option>
                                        <option value="university">University</option>
                                        <option value="association">Regional Associations</option>
                                        <option value="year">Year</option>
                                        <option value="investigator">Principal Investigator</option>
                                        <option value="projectName">Project name</option>
                                        <option value="id">Id</option>
                                    </select>
                                    <input type="submit" value='Apply' className="bg-white dark:text-black p-2 w-fit self-end cursor-pointer" />
                                </div>
                            </form>}
                        </div>
                    </div>
                    <div>
                        <table className='w-full'>
                            <thead>
                                <tr className='[&>*]:text-start'>
                                    <th>Id</th>
                                    <th>Project Name</th>
                                    <th>Industry</th>
                                    <th>Published date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectsData.map((project, index) => (
                                    <tr key={index}>
                                        <td>{project.id}</td>
                                        <td><span className='max-w-[15rem] md:max-w-[25rem] inline-block whitespace-nowrap overflow-x-auto'>{project.title}</span></td>
                                        {/* <td><span>First project</span></td> */}
                                        <td><span className='max-w-[15rem] md:max-w-[25rem] inline-block whitespace-nowrap overflow-x-auto'>{project.industry}</span></td>
                                        <td><span className='max-w-[15rem] md:max-w-[25rem] inline-block whitespace-nowrap overflow-x-auto'>{project.published_date}</span></td>
                                        <td>
                                            <div className='flex items-center justify-start gap-2'>
                                                <button onClick={() => editProject(project.slug)}
                                                    className='btn bg-blue-500'>Edit
                                                </button>
                                                <button onClick={() =>
                                                    setIsDeleteConfirmModal({
                                                        isDelete: true,
                                                        id: project.slug,
                                                    })
                                                } className='btn bg-red-500'>Delete
                                                </button>
                                                <button onClick={() => toggleHidden(project.slug)}
                                                    className={`btn ${!project.hidden ? 'bg-gray-700' : 'bg-green-500'} !text-black`}>{!project.hidden ? 'Disable' : 'Enable'}</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {filteredPagination.length > 1 && <div className="mt-10">
                    <ul className="pagination">
                        <li>
                            <a
                                href={
                                    queryParameters.get("university") ? `/admin/projects/approved?university=${queryParameters.get("university")}&page=1` :
                                        queryParameters.get("association") ? `/admin/projects/approved?association=${queryParameters.get("association")}&page=1` :
                                            queryParameters.get("year") ? `/admin/projects/approved?year=${queryParameters.get("year")}&page=` :
                                                queryParameters.get("investigator") ? `/admin/projects/approved?investigator=${queryParameters.get("investigator")}&page=1` :
                                                    queryParameters.get("id") ? `/admin/projects/approved?id=${queryParameters.get("id")}&page=1` : `/admin/projects/approved?page=1`
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
                                        queryParameters.get("university") ? `/admin/projects/approved?university=${queryParameters.get("university")}&page=${page}` :
                                            queryParameters.get("association") ? `/admin/projects/approved?association=${queryParameters.get("association")}&page=${page}` :
                                                queryParameters.get("year") ? `/admin/projects/approved?year=${queryParameters.get("year")}&page=${page}` :
                                                    queryParameters.get("investigator") ? `/admin/projects/approved?investigator=${queryParameters.get("investigator")}&page=${page}` :
                                                        queryParameters.get("id") ? `/admin/projects/approved?id=${queryParameters.get("id")}&page=1` :
                                                            queryParameters.get("projectName") ? `/admin/projects/approved?projectName=${queryParameters.get("projectName")}&page=${page}` : `/admin/projects/approved?page=${page}`
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
                                        href={queryParameters.get("university") ? `/admin/projects/approved?university=${queryParameters.get("university")}&page=${page}` :
                                            queryParameters.get("association") ? `/admin/projects/approved?association=${queryParameters.get("association")}&page=${page}` :
                                                queryParameters.get("year") ? `/admin/projects/approved?year=${queryParameters.get("year")}&page=${page}` :
                                                    queryParameters.get("investigator") ? `/admin/projects/approved?investigator=${queryParameters.get("investigator")}&page=${page}` :
                                                        queryParameters.get("id") ? `/admin/projects/approved?id=${queryParameters.get("id")}&page=1` :
                                                            queryParameters.get("projectName") ? `/admin/projects/approved?projectName=${queryParameters.get("projectName")}&page=${page}` : `/admin/projects/approved?page=${page}`
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
                                    href={queryParameters.get("university") ? `/admin/projects/approved?university=${queryParameters.get("university")}&page=${page}` :
                                        queryParameters.get("association") ? `/admin/projects/approved?association=${queryParameters.get("association")}&page=${page}` :
                                            queryParameters.get("year") ? `/admin/projects/approved?year=${queryParameters.get("year")}&page=${page}` :
                                                queryParameters.get("investigator") ? `/admin/projects/approved?investigator=${queryParameters.get("investigator")}&page=${page}` :
                                                    queryParameters.get("id") ? `/admin/projects/approved?id=${queryParameters.get("id")}&page=1` :
                                                        queryParameters.get("projectName") ? `/admin/projects/approved?projectName=${queryParameters.get("projectName")}&page=${page}` : `/admin/projects/approved?page=${page}`
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
                                href={queryParameters.get("university") ? `/admin/projects/approved?university=${queryParameters.get("university")}&page=${projectsCount}` :
                                    queryParameters.get("association") ? `/admin/projects/approved?association=${queryParameters.get("association")}&page=${projectsCount}` :
                                        queryParameters.get("year") ? `/admin/projects/approved?year=${queryParameters.get("year")}&page=${projectsCount}` :
                                            queryParameters.get("investigator") ? `/admin/projects/approved?investigator=${queryParameters.get("investigator")}&page=${projectsCount}` :
                                                queryParameters.get("id") ? `/admin/projects/approved?id=${queryParameters.get("id")}&page=1` :
                                                    queryParameters.get("projectName") ? `/admin/projects/approved?projectName=${queryParameters.get("projectName")}&page=${projectsCount}` : `/admin/projects/approved?page=1`
                                }
                                onClick={() => updatePage("subtract")}
                                className="!p-0"
                            >
                                <MdKeyboardDoubleArrowRight />
                            </a>
                        </li>
                    </ul>
                </div>}
            </div>}
            {isDeleteConfirmModal.isDelete && (
                <ConfirmAction handlerDeleteConfirmModal={handlerDeleteConfirmModal} isDeleteConfirmModal={isDeleteConfirmModal} deleteFunc={deleteProjectFunc} text={'this project'} />
            )}
            {isProjectModal && <div className='absolute top-0 x-50 right-0 left-0 bottom-0 bg-primary dark:bg-gray-900 overflow-y-auto'>
                <div className='container mx-auto px-5 w-full py-5'>
                    <button onClick={() => setIsProjectModalFunc()} className='bg-darkPrimary dark:bg-gray-950 w-10 h-10 flex items-center justify-center rounded-full'>
                        <FaChevronLeft size={'2rem'} />
                    </button>
                    <h2>Create project</h2>
                    <form onSubmit={createProject} className='form flex flex-col gap-3 [&>*]:flex [&>*]:flex-col min-w-[100%]'>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Project Name</label>
                            <input type="text" onChange={e => setTitle(e.target.value)} value={title} />
                        </div>
                        <div className="flex !flex-row gap-2 items-center">
                            <input
                                type="checkbox"
                                id="isWorking"
                                checked={isWorking}
                                onChange={(e) => setIsWorking(!isWorking)}
                            />
                            <label htmlFor="isWorking">Currently working on</label>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex flex-col gap-1 max-w-[347.52px]'>
                                <label htmlFor="">Start year</label>
                                <input onChange={(e) => setStartYear(e.target.value)} value={startYear} type="number" min="1900" max="2099" step="1" placeholder='Start year' />
                            </div>
                            <div className='flex flex-col gap-1 max-w-[347.52px]'>
                                <label htmlFor="">End year</label>
                                <input onChange={(e) => setEndYear(e.target.value)} value={endYear} type="number" min="1900" max="2099" step="1" placeholder='End year' />
                            </div>
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Image</label>
                            <input type="file" id='imageInput' accept="image/*" className='bg-transparent dark:bg-transparent' />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">University</label>
                            <input type="text" onChange={e => setCollege(e.target.value)} value={college} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Partner organization</label>
                            <input onChange={(e) => setPartnerOrganization(e.target.value)} value={partnerOrganization} type="text" />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Industry</label>
                            <select
                                name="status"
                                id="status"
                                className="focus:outline-none dark:bg-gray-950 w-fit"
                                onChange={(e) => setIndustry(e.target.value)}
                                value={industry}
                            >
                                <option value="energy">Energy</option>
                                <option value="water">Water</option>
                                <option value="health">Health</option>
                                <option value="education">Education</option>
                                <option value="sustainable_construction">Sustainable Construction</option>
                                <option value="farming">Farming</option>
                            </select>
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Investigator</label>
                            <input type="text" onChange={e => setInvestigator(e.target.value)} value={investigator} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Investigator email</label>
                            <input type="text" onChange={e => setEmail(e.target.value)} value={email} />
                        </div>
                        <div>
                            <div>
                                <label htmlFor="">Add keywords</label><br></br>
                                <input onChange={(e) => setKeyword(e.target.value)} value={keyword} type="text" />
                                <button onClick={addKeywork} type="button" className='bg-blue-500 py-1 font-semibold px-2 mt-4 sm:mt-0 sm:ml-5'>Add</button>
                                <ul className='flex gap-2'>
                                    {keywords.map((item, index) => {
                                        return <li key={index} className='flex gap-1'>
                                            <div className='bg-gray-200 dark:bg-gray-900 px-2'>
                                                {item}
                                            </div>
                                            <button type='button' onClick={() => removeKeyword(index)} className='bg-red-500 w-6 font-semibold text-white text-sm aspect-square rounded-full'>X</button>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Region</label>
                            <select
                                name="region"
                                id="region"
                                className="focus:outline-none dark:bg-gray-950 w-fit"
                                onChange={(e) => setRegion(e.target.value)}
                                value={region}
                            >
                                <option value="kircher">KIRCHER</option>
                                <option value="jheasa">JHEASA</option>
                                <option value="ausjal">AUSJAL</option>
                                <option value="ajcu-ap">AJCU-AP</option>
                                <option value="ajcu-am">AJCU-AM</option>
                                <option value="ajcu">AJCU</option>
                            </select>
                        </div>
                        <div className='w-full'>
                            <label htmlFor="">Summary</label>
                            <textarea name="" id="" onChange={e => setSummary(e.target.value)} value={summary} className='min-h-52'></textarea>
                        </div>
                        <input type="submit" value={action.create ? `Create` : 'Edit'} className='max-w-[347.52px]' />
                    </form>
                </div>
            </div>}
            <ToastContainer />
        </section>
    )





}

export default ProjectsAdmin