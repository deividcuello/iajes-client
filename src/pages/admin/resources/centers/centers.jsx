import React from 'react'
import { useState, useEffect } from 'react'
import { FaChevronLeft } from 'react-icons/fa6'
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { CiFilter } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import Cookies from 'js-cookie'
import { deleteCenter, getAllCenters, getCenter } from '../../../../api'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmAction from '../../../../components/confirm-action/confirm.action'
import { useSearchParams } from "react-router-dom";
import { pagination } from '../../../../utils/constants';

function CentersAdmin() {
    const [queryParameters] = useSearchParams();
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [centersCount, setCentersCount] = useState([]);
    const [isCenterModal, setIsCenterModal] = useState(false)
    const [location, setLocation] = useState('')
    const [email, setEmail] = useState('')
    const [programName, setProgramName] = useState('')
    const [phone, setPhone] = useState('')
    const [center, setCenter] = useState('')
    const [centers, setCenters] = useState([])
    const [title, setTitle] = useState('')
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
        async function loadCenters() {
            const center = queryParameters.get("center");
            const director = queryParameters.get("director");
            const phone = queryParameters.get("phone");
            const id = queryParameters.get("id");

            let res = [{ data: "" }];

            // const res = await getAllCenters({isAdmin:true, page:page})
            // setCenters(res.data.centers)

            if (center != null) {
                res = await getAllCenters({ center: center, isAdmin: true, page: page });
            } else if (phone != null) {
                res = await getAllCenters({
                    phone: phone,
                    page: page,
                    isAdmin: true,
                });
            } else if (director != null) {
                res = await getAllCenters({
                    director: director,
                    page: page,
                    isAdmin: true,
                });
            } else if (id != null) {
                res = await getAllCenters({
                    id: id,
                    page: page,
                    isAdmin: true,
                });
            }
            else if (center == null && phone == null && id == null) {

                res = await getAllCenters({ page: page, isAdmin: true });
            }

            setCenters(res.data.centers)

            setCentersCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );
        }
        loadCenters()
    }, [])

    const handlerDeleteConfirmModal = (bool) => {
        setIsDeleteConfirmModal(bool);
    };

    async function submitFilter(e) {
        e.preventDefault();
        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/programs?page=1`
            );
        } else if (selectFilter == "center") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/programs?center=${textFilter}&page=1`
            );
        } else if (selectFilter == "phone") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/programs?phone=${textFilter}&page=1`
            );
        } else if (selectFilter == "director") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/programs?director=${textFilter}&page=1`
            );
        } else if (selectFilter == "id") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/programs?id=${textFilter}&page=1`
            );
        }

        window.location.reload(false);
    }

    function checkEmail() {
        if (!email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
            return false
        } else {
            return true
        }
    }

    const createCenter = (event) => {
        event.preventDefault();
        const imageInput = document.querySelector("#imageInput");
        let image = imageInput.files[0];
        let formData = new FormData();
        formData.append("cover_url", image);
        // formData.append("title", title);
        formData.append("program_name", programName);
        formData.append("phone", phone);
        formData.append("location", location);
        formData.append("email", email);
        formData.append("center", center);
        if (center.length == 0) {
            return toast.error("Add a center", {
                position: "top-center",
            })
        } else if (!image) {
            return toast.error("Add an image", {
                position: "top-center",
            })
        } else if (location.length == 0) {
            return toast.error("Add a location", {
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
        } else if (programName.length == 0) {
            return toast.error("Add a program name", {
                position: "top-center",
            })
        }

        if (action.create) {
            formData.append("hidden", true);
            fetch('https://deividcuello.pythonanywhere.com/api/centers/', {
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
            const tempAction = {
                ...action,
                isImageUrl: imageInput.files[0].name,
                image: imageInput.files[0],
            };
            formData.append("isImageUrl", tempAction.isImageUrl);

            fetch(`https://deividcuello.pythonanywhere.com/api/centers/${action.edit}/`, {
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
        const documentData = await getCenter({ id: id });
        const data = documentData.data;
        let list = new DataTransfer();
        let file = new File(["content"], `https://deividcuello.pythonanywhere.com${data.cover_url}`);
        list.items.add(file);
        let myFileList = list.files;

        const jsonData = JSON.stringify({
            title: data.title,
            hidden: !data.hidden,
            cover_url: myFileList,
            center: data.center,
            phone: data.phone,
            program_name: data.program_name,
            location: data.location,
            email: data.email,
            isImageUrl: file.name,
        });

        fetch(`https://deividcuello.pythonanywhere.com/api/centers/${id}/`, {
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
                toast.error("Error occurred", { position: toast.POSITION.TOP_CENTER })
            );
    }

    async function editCenter(id) {
        setIsCenterModal(true);
        const getDocData = await getCenter({ id: id });
        const data = getDocData.data;
        const imageInput = document.querySelector("#imageInput");
        setAction({ create: false, edit: true })
        setTitle(data.title);
        setLocation(data.location);
        setProgramName(data.program_name);
        setEmail(data.email);
        setCenter(data.center);
        setPhone(data.phone);

        let list = new DataTransfer();
        let file = new File(["content"], `https://deividcuello.pythonanywhere.com${data.cover_url}`);
        list.items.add(file);
        let myFileList = list.files;
        imageInput.files = myFileList;

        setAction({
            edit: id,
            hidden: data.hidden,
            image: file.name,
            isImageUrl: "",
        });
    }

    function setIsCenterModalFunc() {
        setAction({ create: true, edit: false })
        setIsCenterModal(false)
        setTitle('');
        setDescription('');
        setPhone('');
        setDirector('');
        setCenter('');
    }

    function deleteCenterFunc(id) {
        deleteCenter(id);
    }



    return (
        <section className='container mx-auto mt-5 px-5'>
            {!isCenterModal && <div>
                <div>
                    <button onClick={() => setIsCenterModal(true)} className='btn dark:bg-primary !text-white bg-darkPrimary'>Create program</button>
                </div>
                <div className='mt-2'>
                    <h2>Programs</h2>

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
                                        name="centersFilter"
                                        id="centersFilter"
                                        className="focus:outline-none dark:bg-gray-950 w-fit"
                                        onChange={(e) => setSelectFilter(e.target.value)}
                                    >
                                        <option value="all">All</option>
                                        <option value="center">Center</option>
                                        <option value="phone">Phone</option>
                                        <option value="director">Director</option>
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
                                    <th>Center</th>
                                    <th>Phone</th>
                                    <th>Name of program</th>
                                    <th>Location</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    centers.map((center, index) => (
                                        <tr key={index}>
                                            <td>{center.id}</td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{center.center}</span></td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{center.phone}</span></td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{center.program_name}</span></td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{center.location}</span></td>
                                            <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{center.email}</span></td>
                                            <td>
                                                <div className='flex items-center justify-start gap-2'>
                                                    <button onClick={() => editCenter(center.id)}
                                                        className='btn bg-blue-500'>Edit
                                                    </button>
                                                    <button onClick={() =>
                                                        setIsDeleteConfirmModal({
                                                            isDelete: true,
                                                            id: center.id,
                                                        })
                                                    } className='btn bg-red-500'>Delete
                                                    </button>
                                                    <button onClick={() => toggleHidden(center.id)}
                                                        className={`btn ${!center.hidden ? 'bg-gray-700' : 'bg-green-500'} !text-black`}>{!center.hidden ? 'Disable' : 'Enable'}</button>
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
                                href={queryParameters.get("center") ? `/admin/resources/programs?center=${queryParameters.get("center")}&page=1` :
                                    queryParameters.get("director") ? `/admin/resources/programs?director=${queryParameters.get("director")}&page=1` :
                                        queryParameters.get("phone") ? `/admin/resources/programs?phone=${queryParameters.get("phone")}&page=1` :
                                            queryParameters.get("id") ? `/admin/resources/programs?id=${queryParameters.get("id")}&page=1` : `/admin/resources/programs?page=${page}`}
                                onClick={() => updatePage("subtract")}
                                className="!p-0"
                            >
                                <MdKeyboardDoubleArrowLeft />
                            </a>
                        </li>
                        <li>
                            {
                                <a
                                    href={queryParameters.get("center") ? `/admin/resources/programs?center=${queryParameters.get("center")}&page=${page}` :
                                        queryParameters.get("director") ? `/admin/resources/programs?director=${queryParameters.get("director")}&page=${page}` :
                                            queryParameters.get("phone") ? `/admin/resources/programs?phone=${queryParameters.get("phone")}&page=${page}` :
                                                queryParameters.get("id") ? `/admin/resources/programs?id=${queryParameters.get("id")}&page=${page}` : `/admin/resources/programs?page=${page}`}
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
                                        href={queryParameters.get("center") ? `/admin/resources/programs?center=${queryParameters.get("center")}&page=${page}` :
                                            queryParameters.get("director") ? `/admin/resources/programs?director=${queryParameters.get("director")}&page=${page}` :
                                                queryParameters.get("phone") ? `/admin/resources/programs?phone=${queryParameters.get("phone")}&page=${page}` :
                                                    queryParameters.get("id") ? `/admin/resources/programs?id=${queryParameters.get("id")}&page=${page}` : `/admin/resources/programs?page=${page}`}
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
                                    href={queryParameters.get("center") ? `/admin/resources/programs?center=${queryParameters.get("center")}&page=${page}` :
                                        queryParameters.get("director") ? `/admin/resources/programs?director=${queryParameters.get("director")}&page=${page}` :
                                            queryParameters.get("phone") ? `/admin/resources/programs?phone=${queryParameters.get("phone")}&page=${page}` :
                                                queryParameters.get("id") ? `/admin/resources/programs?id=${queryParameters.get("id")}&page=${page}` : `/admin/resources/programs?page=${page}`}
                                    onClick={() => updatePage("sum")}
                                    className="!p-0"
                                >
                                    <MdKeyboardArrowRight />
                                </a>
                            }
                        </li>
                        <li>
                            <a
                                href={queryParameters.get("center") ? `/admin/resources/programs?center=${queryParameters.get("center")}&page=${centersCount}` :
                                    queryParameters.get("director") ? `/admin/resources/programs?director=${queryParameters.get("director")}&page=${centersCount}` :
                                        queryParameters.get("phone") ? `/admin/resources/programs?phone=${queryParameters.get("phone")}&page=${centersCount}` :
                                            queryParameters.get("id") ? `/admin/resources/programs?id=${queryParameters.get("id")}&page=${centersCount}` : `/admin/resources/programs?page=${centersCount}`}
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
                <ConfirmAction handlerDeleteConfirmModal={handlerDeleteConfirmModal} isDeleteConfirmModal={isDeleteConfirmModal} deleteFunc={deleteCenterFunc} text={'this center'} />
            )}
            {isCenterModal && <div className='absolute top-0 x-50 right-0 left-0 bottom-0 bg-primary dark:bg-gray-900 overflow-y-auto'>
                <div className='container mx-auto px-5 w-full py-5'>
                    <button onClick={() => setIsCenterModalFunc()} className='bg-darkPrimary dark:bg-gray-950 w-10 h-10 flex items-center justify-center rounded-full'>
                        <FaChevronLeft size={'2rem'} />
                    </button>
                    <h2>Create program</h2>
                    <form onSubmit={createCenter} className='form flex flex-col gap-3 [&>*]:flex [&>*]:flex-col min-w-[100%]'>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Center</label>
                            <input type="text" onChange={e => setCenter(e.target.value)} value={center} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Cover image</label>
                            <input type="file" id='imageInput' accept="image/*" className='bg-transparent dark:bg-transparent' />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Program name</label>
                            <input type="text" onChange={e => setProgramName(e.target.value)} value={programName} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Phone</label>
                            <input type="text" onChange={e => setPhone(e.target.value)} value={phone} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Location</label>
                            <input type="text" onChange={e => setLocation(e.target.value)} value={location} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Email</label>
                            <input type="text" onChange={e => setEmail(e.target.value)} value={email} />
                        </div>
                        <input type="submit" value={action.create ? `Create` : 'Edit'} className='max-w-[347.52px]' />
                    </form>
                </div>
            </div>}
            <ToastContainer />
        </section>
    )






}

export default CentersAdmin





