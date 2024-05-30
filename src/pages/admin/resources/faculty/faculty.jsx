import React from 'react'
import { useState, useEffect } from 'react'
import { FaChevronLeft } from 'react-icons/fa6'
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { CiFilter } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import Cookies from 'js-cookie'
import { getAllFaculty, deleteFaculty, getFaculty } from '../../../../api'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmAction from '../../../../components/confirm-action/confirm.action'
import { useSearchParams } from "react-router-dom";
import { pagination } from '../../../../utils/constants';

function FacultyAdmin() {
    const [queryParameters] = useSearchParams();
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [facultyCount, setFacultyCount] = useState([]);
    const [isFacultyModal, setIsFacultyModal] = useState(false)
    const [topic, setTopic] = useState('')
    const [topics, setTopics] = useState([])
    const [country, setCountry] = useState('')
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [university, setUniversity] = useState('')
    const [faculty, setFaculty] = useState([])
    const [action, setAction] = useState({ create: true })
    const [isFilter, setIsFilter] = useState(false);
    const [textFilter, setTextFilter] = useState('');
    const [selectFilter, setSelectFilter] = useState("all");
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
                setPage(facultyCount);
            } else {
                setPage(parseInt(queryParameters.get("page")) - 1);
            }
        } else if (action == "sum") {
            if (page == facultyCount) {
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
            if (facultyCount < 5) {
                setFilteredPagination(range(1, facultyCount + 1));
            } else if (p > 5 && p <= facultyCount - 5) {
                setFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
            } else if (p <= 5) {
                setFilteredPagination([1, 2, 3, 4, 5]);
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
                    setFilteredPagination(array);
                }
            }
        }
        checkPagination();
    }, [facultyCount]);

    useEffect(() => {
        async function loadFaculty() {
            const university = queryParameters.get("university");
            const facultyTitle = queryParameters.get("facultyTitle");
            const country = queryParameters.get("country");
            const topic = queryParameters.get("topic");
            const id = queryParameters.get("id");

            let res = [{ data: "" }];

            if (university != null) {
                res = await getAllFaculty({ university: university, isAdmin: true, page: page });
            } else if (facultyTitle != null) {
                res = await getAllFaculty({
                    faculty: facultyTitle,
                    page: page,
                    isAdmin: true,
                });
            } else if (country != null) {
                res = await getAllFaculty({
                    country: country,
                    page: page,
                    isAdmin: true,
                });
            } else if (topic != null) {
                res = await getAllFaculty({
                    topic: topic,
                    page: page,
                    isAdmin: true,
                });
            }
            else if (id != null) {
                res = await getAllFaculty({
                    id: id,
                    page: page,
                    isAdmin: true,
                });
            }
            else if (university == null && facultyTitle == null && country == null && topic == null && id == null) {

                res = await getAllFaculty({ page: page, isAdmin: true });
            }

            setFaculty(res.data.faculty)

            setFacultyCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );
        }
        loadFaculty()
    }, [])

    async function submitFilter(e) {
        e.preventDefault();

        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/faculty?page=1`
            );
        } else if (selectFilter == "university") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/faculty?university=${textFilter}&page=1`
            );
        } else if (selectFilter == "facultyTitle") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/faculty?facultyTitle=${textFilter}&page=1`
            );
        } else if (selectFilter == "email") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/faculty?email=${textFilter}&page=1`
            );
        } else if (selectFilter == "topic") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/faculty?topic=${textFilter}&page=1`
            );
        } else if (selectFilter == "country") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/faculty?country=${textFilter}&page=1`
            );
        } else if (selectFilter == "id") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/faculty?id=${textFilter}&page=1`
            );
        }

        window.location.reload(false);
    }

    const handlerDeleteConfirmModal = (bool) => {
        setIsDeleteConfirmModal(bool);
    };

    const createFaculty = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append("university", university);
        formData.append("email", email);
        formData.append("title", title);
        formData.append("country", country);
        formData.append("topics", topics.join(', '));

        if (action.create) {
            formData.append("hidden", true);
            fetch('https://deividcuello.pythonanywhere.com/api/faculty/', {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "POST",
                body: formData,
            })
                .then(
                    (response) => window.location.reload(false)
                )
                .catch((error) =>
                    console.clear()
                );
        } else if (action.edit) {
            formData.append("hidden", action.hidden);
            fetch(`https://deividcuello.pythonanywhere.com/api/faculty/${action.edit}/`, {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "PUT",
                body: formData,
            })
                .then((response) => window.location.reload(false)
                )
                .catch((error) =>
                    console.clear()
                );
        }
    };

    async function toggleHidden(id) {
        const documentData = await getFaculty({ id: id });
        const data = documentData.data;

        const jsonData = JSON.stringify({
            title: data.title,
            hidden: !data.hidden,
            email: data.email,
            country: data.country,
            topics: data.topics,
            university: data.university,
        });

        fetch(`https://deividcuello.pythonanywhere.com/api/faculty/${id}/`, {
            credentials: "include",
            headers: {
                "X-CSRFToken": Cookies.get("csrftoken"),
                Accept: "application/json, text/plain",
                "Content-Type": "application/json;charset=UTF-8",
            },
            method: "PUT",
            body: jsonData,
        })
            .then((response) => window.location.reload(false))
            .catch((error) =>
                toast.error("Error occurred", { position: "top-center" })
            );
    }

    async function editFaculty(id) {
        setIsFacultyModal(true);
        const getDocData = await getFaculty({ id: id });
        const data = getDocData.data;
        setAction({ create: false, edit: true })
        setTitle(data.title);
        setUniversity(data.university);
        setCountry(data.country);
        setTopics(data.topics.split(", "));
        setEmail(data.email);

        setAction({
            edit: id,
            hidden: data.hidden,
        });
    }

    function setIsFacultyModalFunc() {
        setAction({ create: true, edit: false })
        setIsFacultyModal(false)
        setTitle('');
        setUniversity('');
        setCountry('');
        setTopics([]);
        setTopic('')
        setEmail('');
    }

    function deleteFacultyFunc(id) {
        deleteFaculty(id);
    }

    function addTopic() {
        if (topic.replace(/\s+/g, ' ').trim() == '') {
            return
        }
        if (!(/^[A-Za-z0-9\s]*$/.test(topic))) {
            return toast.error("Only letters, spaces and numbers are allowed in topics", { position: "top-center" })
        }
        setTopics([
            ...topics,
            topic.trim()
        ]);
        setTopic('')
    }

    function removeTopic(index) {
        setTopics(
            topics.filter((item, idx) =>
                idx != index
            )
        );
    }

    return (
        <section className='container mx-auto mt-5 px-5'>
            {!isFacultyModal && <div>
                <div>
                    <button onClick={() => setIsFacultyModal(true)} className='btn dark:bg-primary !text-white bg-darkPrimary'>Create faculty</button>
                </div>
                <div className='mt-2'>
                    <h2>Faculty</h2>
                    <div className="mt-5 mb-5">
                        <p onClick={() => setIsFilter(true)} className="flex gap-2 items-center font-semibold cursor-pointer"><CiFilter /> Filter</p>
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
                                        name="facultyFilter"
                                        id="facultyFilter"
                                        className="focus:outline-none dark:bg-gray-950 w-fit"
                                        onChange={(e) => setSelectFilter(e.target.value)}
                                    >
                                        <option value="all">All</option>
                                        <option value="university">University</option>
                                        <option value="email">Email</option>
                                        <option value="facultyTitle">Title</option>
                                        <option value="country">Country</option>
                                        <option value="topic">Topic</option>
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
                                    <th>Title</th>
                                    <th>University</th>
                                    <th>Country</th>
                                    <th>Topics</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    faculty.map((item, index) => (

                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{item.title}</span></td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{item.university}</span></td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{item.country}</span></td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{item.topics}</span></td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{item.email}</span></td>
                                            <td>
                                                <div className='flex items-center justify-start gap-2'>
                                                    <button onClick={() => editFaculty(item.id)}
                                                        className='btn bg-blue-500'>Edit
                                                    </button>
                                                    <button onClick={() =>
                                                        setIsDeleteConfirmModal({
                                                            isDelete: true,
                                                            id: item.id,
                                                        })
                                                    } className='btn bg-red-500'>Delete</button>
                                                    <button onClick={() => toggleHidden(item.id)} className={`btn ${!item.hidden ? 'bg-gray-700' : 'bg-green-500'} !text-black`}>{!item.hidden ? 'Disable' : 'Enable'}</button>
                                                </div>
                                            </td>
                                        </tr>

                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {filteredPagination.length > 1 && <div className="mt-10">
                    <ul className="pagination">
                        <li>
                            <a
                                href={queryParameters.get("university") ? `/admin/resources/faculty?university=${queryParameters.get("university")}&page=${page}` :
                                    queryParameters.get("facultyTitle") ? `/admin/resources/faculty?facultyTitle=${queryParameters.get("facultyTitle")}&page=${page}` :
                                        queryParameters.get("email") ? `/admin/resources/faculty?year=${queryParameters.get("email")}&page=${page}` :
                                            queryParameters.get("topic") ? `/admin/resources/faculty?investigator=${queryParameters.get("topic")}&page=${page}` :
                                                queryParameters.get("country") ? `/admin/resources/faculty?country=${queryParameters.get("country")}&page=${page}` : queryParameters.get("id") ? `/admin/resources/faculty?id=${queryParameters.get("id")}&page=1` :
                                                    '/admin/resources/faculty?page=1'
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
                                        queryParameters.get("university") ? `/admin/resources/faculty?university=${queryParameters.get("university")}&page=${page}` :
                                            queryParameters.get("facultyTitle") ? `/admin/resources/faculty?facultyTitle=${queryParameters.get("facultyTitle")}&page=${page}` :
                                                queryParameters.get("email") ? `/admin/resources/faculty?email=${queryParameters.get("email")}&page=${page}` :
                                                    queryParameters.get("topic") ? `/admin/resources/faculty?topic=${queryParameters.get("topic")}&page=${page}` :
                                                        queryParameters.get("country") ? `/admin/resources/faculty?country=${queryParameters.get("country")}&page=${page}` : queryParameters.get("id") ? `/admin/resources/faculty?id=${queryParameters.get("id")}&page=1` :
                                                            '/admin/resources/faculty?page=1'}
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
                                        href={queryParameters.get("university") ? `/admin/resources/faculty?university=${queryParameters.get("university")}&page=${page}` :
                                            queryParameters.get("facultyTitle") ? `/admin/resources/faculty?facultyTitle=${queryParameters.get("facultyTitle")}&page=${page}` :
                                                queryParameters.get("email") ? `/admin/resources/faculty?email=${queryParameters.get("email")}&page=${page}` :
                                                    queryParameters.get("topic") ? `/admin/resources/faculty?topic=${queryParameters.get("topic")}&page=${page}` :
                                                        queryParameters.get("country") ? `/admin/resources/faculty?country=${queryParameters.get("country")}&page=${page}` : queryParameters.get("id") ? `/admin/resources/faculty?id=${queryParameters.get("id")}&page=1` :
                                                            '/admin/resources/faculty?page=1'
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
                                        queryParameters.get("university") ? `/admin/resources/faculty?university=${queryParameters.get("university")}&page=${page}` :
                                            queryParameters.get("facultyTitle") ? `/admin/resources/faculty?facultyTitle=${queryParameters.get("facultyTitle")}&page=${page}` :
                                                queryParameters.get("email") ? `/admin/resources/faculty?email=${queryParameters.get("email")}&page=${page}` :
                                                    queryParameters.get("topic") ? `/admin/resources/faculty?topic=${queryParameters.get("topic")}&page=${page}` :
                                                        queryParameters.get("country") ? `/admin/resources/faculty?country=${queryParameters.get("country")}&page=${page}` : queryParameters.get("id") ? `/admin/resources/faculty?id=${queryParameters.get("id")}&page=1` :
                                                            '/admin/resources/faculty?page=1'}
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
                                    queryParameters.get("university") ? `/admin/resources/faculty?university=${queryParameters.get("university")}&page=${facultyCount}` :
                                        queryParameters.get("facultyTitle") ? `/admin/resources/faculty?facultyTitle=${queryParameters.get("facultyTitle")}&page=${facultyCount}` :
                                            queryParameters.get("email") ? `/admin/resources/faculty?email=${queryParameters.get("email")}&page=${facultyCount}` :
                                                queryParameters.get("topic") ? `/admin/resources/faculty?topic=${queryParameters.get("topic")}&page=${facultyCount}` :
                                                    queryParameters.get("country") ? `/admin/resources/faculty?country=${queryParameters.get("country")}&page=${page}` : queryParameters.get("id") ? `/admin/resources/faculty?id=${queryParameters.get("id")}&page=1` :
                                                        '/admin/resources/faculty?page=1'}
                                className="!p-0"
                            >
                                <MdKeyboardDoubleArrowRight />
                            </a>
                        </li>
                    </ul>
                </div>}
            </div>}
            {isDeleteConfirmModal.isDelete && (
                <ConfirmAction handlerDeleteConfirmModal={handlerDeleteConfirmModal} isDeleteConfirmModal={isDeleteConfirmModal} deleteFunc={deleteFacultyFunc} text={'this faculty'} />
            )}
            {isFacultyModal && <div className='absolute top-0 x-50 right-0 left-0 bottom-0 bg-primary dark:bg-gray-900 overflow-y-auto'>
                <div className='container mx-auto px-5 w-full py-5'>
                    <button onClick={() => setIsFacultyModalFunc()} className='bg-darkPrimary dark:bg-gray-950 w-10 h-10 flex items-center justify-center rounded-full'>
                        <FaChevronLeft size={'2rem'} />
                    </button>
                    <h2>Create Faculty</h2>
                    <form onSubmit={createFaculty} className='form flex flex-col gap-3 [&>*]:flex [&>*]:flex-col min-w-[100%]'>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Title</label>
                            <input type="text" onChange={e => setTitle(e.target.value)} value={title} />
                        </div>

                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">University</label>
                            <input type="text" onChange={e => setUniversity(e.target.value)} value={university} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Email</label>
                            <input type="text" onChange={e => setEmail(e.target.value)} value={email} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Country</label>
                            <input type="text" onChange={e => setCountry(e.target.value)} value={country} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <div>
                                <label htmlFor="">Add topic</label><br></br>
                                <input onChange={(e) => setTopic(e.target.value)} value={topic} type="text" />
                                <button onClick={addTopic} type="button" className='bg-blue-500 py-1 font-semibold px-2 mt-4 sm:mt-0 sm:ml-5'>Add</button>
                                <ul className='flex flex-wrap gap-2 w-full md:w-[calc(100vw-12rem)]'>
                                    {topics.map((item, index) => {
                                        return <li key={index} className='flex gap-1'>
                                            <div className='bg-gray-200 dark:bg-gray-900 px-2'>
                                                {item}
                                            </div>
                                            <button type='button' onClick={() => removeTopic(index)} className='bg-red-500 w-6 font-semibold text-white text-sm aspect-square rounded-full'>X</button>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        <input type="submit" value={action.create ? `Create` : 'Edit'} className='max-w-[347.52px]' />
                    </form>
                </div>
            </div>}
            <ToastContainer />
        </section>
    )
}

export default FacultyAdmin