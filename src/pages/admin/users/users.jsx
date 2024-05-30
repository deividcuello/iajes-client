import React, { useState, useEffect } from 'react'
import { FaChevronLeft } from "react-icons/fa6";
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { CiFilter } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import { getUsers, getUser, deleteUser, checkLogin } from '../../../api';
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmAction from '../../../components/confirm-action/confirm.action';
import { useSearchParams } from "react-router-dom";
import { pagination } from '../../../utils/constants';

function Users() {
    const [queryParameters] = useSearchParams();
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [usersCount, setUsersCount] = useState([]);
    const [isUserModal, setIsUserModal] = useState(false)
    const [users, setUsers] = useState([])
    const [userInfo, setUserInfo] = useState([])
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [university, setUniversity] = useState('')
    const [name, setName] = useState('')
    const [department, setDepartment] = useState('')
    const [phone, setPhone] = useState('')
    const [action, setAction] = useState([])
    const [isFilter, setIsFilter] = useState(false);
    const [textFilter, setTextFilter] = useState('');
    const [selectFilter, setSelectFilter] = useState("all");
    const [isCheckedAdminInput, setIsCheckedAdminInput] = useState(false);
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
                setPage(usersCount);
            } else {
                setPage(parseInt(queryParameters.get("page")) - 1);
            }
        } else if (action == "sum") {
            if (page == usersCount) {
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
            if (usersCount < 5) {
                setFilteredPagination(range(1, usersCount + 1));
            } else if (p > 5 && p <= usersCount - 5) {
                setFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
            } else if (p <= 5) {
                setFilteredPagination([1, 2, 3, 4, 5]);
            } else if (p > usersCount - 5) {
                const array = range(p, usersCount + 1);
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
    }, [usersCount]);

    useEffect(() => {
        async function getUsersList() {
            const username_q = queryParameters.get("username");
            const email_q = queryParameters.get("email");
            const id = queryParameters.get("id");

            let res = [{ data: "" }];

            if (username_q != null) {
                res = await getUsers({ username: username_q, isAdmin: true, page: page });
            } else if (email_q != null) {
                res = await getUsers({
                    email: email_q,
                    page: page,
                    isAdmin: true,
                });
            } else if (id != null) {
                res = await getUsers({
                    id: id,
                    page: page,
                    isAdmin: true,
                });
            }
            else if (username_q == null && email_q == null && id == null) {

                res = await getUsers({ page: page, isAdmin: true });
            }

            setUsers(res.data.users)

            setUsersCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );
        }

        async function isLogged() {
            const res = await checkLogin()
            setUserInfo(res.data.user)
        }

        isLogged()
        getUsersList()
    }, [])

    async function submitFilter(e) {
        e.preventDefault();

        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `/admin/users?page=1`
            );
        } else if (selectFilter == "username") {
            window.history.replaceState(
                "",
                "",
                `/admin/users?username=${textFilter}&page=1`
            );
        } else if (selectFilter == "email") {
            window.history.replaceState(
                "",
                "",
                `/admin/users?email=${textFilter}&page=1`
            );
        } else if (selectFilter == "id") {
            window.history.replaceState(
                "",
                "",
                `/admin/users?id=${textFilter}&page=1`
            );
        }
        window.location.reload(false);
    }

    async function submitUser(e) {
        e.preventDefault()
        if ((username && email && password.length >= 8 && password == confirmPassword) || (username && email && (password.length >= 8 || password.length == 0) && password == confirmPassword && action.edit)) {
            try {
                let formData = new FormData();
                formData.append("email", email.toLowerCase().trim());
                formData.append("username", username.toLowerCase().replace(" ", ""));
                formData.append("phone", phone);
                formData.append("university", university);
                formData.append("password", password);
                formData.append("name", name);
                formData.append("department", department);
                formData.append("adminAccount", userInfo.id == 1 ? true : isCheckedAdminInput);
                if (action.create) {
                    formData.append("isDelete", true);
                    // formData.append("status", 'INTERNAL');
                    let newUser = fetch('https://deividcuello.pythonanywhere.com/api/auth/register', {
                        credentials: "include",
                        headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                        method: "POST",
                        body: formData,
                    }).then(response =>
                        response.ok ? confirmUser() : toast.error(`Error`, {
                            position: "top-center"
                        })
                    )
                } else if (action.edit) {
                    formData.append("isDelete", action.isDelete);
                    // formData.append("status", action.status);
                    // if (action.tempEmail != email) {
                    //     if (code != ActivationCode) {
                    //         return toast.error(`Wrong code`, {
                    //             position: "top-center"
                    //         })
                    //     }
                    // }
                    let editUser = fetch(
                        `https://deividcuello.pythonanywhere.com/api/auth/users/${action.id}/`,
                        {
                            credentials: "include",
                            headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                            method: "PUT",
                            body: formData,
                        }
                    ).then((response) =>
                        (email && username && response.ok)
                            ? window.location.reload(false)
                            : toast.error(`Error`, {
                                position: "top-center"
                            })
                    ).catch((error) => toast.error(`Error`, {
                        position: "top-center"
                    }));
                }
            } catch (error) {
                toast.error(`Error`, {
                    position: "top-center"
                })
            }
        } else {

            if (password.length < 8) {
                return toast.error("Password must have 8 characters minimum", {
                    position: "top-center",
                });
            } else if (password != confirmPassword) {
                return toast.error("Passwords do not match", {
                    position: "top-center",
                });
            }
            toast.error(`Error`, {
                position: "top-center"
            })
        }
    }

    async function editUser(id) {
        const res = await getUser(id)
        const data = res.data
        if (userInfo.id != 1 && data.id == 1) {
            return toast.error(`You can not edit this user`, {
                position: "top-center"
            })
        }
        setIsUserModal(true)
        setUsername(data.username)
        setEmail(data.email)
        setPhone(data.phone)
        setUniversity(data.university)
        setName(data.name)
        setDepartment(data.department)
        setIsCheckedAdminInput(data.adminAccount != false ? true : false);
        setAction({ create: false, edit: true, id: id, status: data.status, isDelete: data.isDelete, adminAccount: data.adminAccount, tempEmail: data.email })
    }

    function setIsUserModalFunc() {
        if (!action.create) {
            setAction({ create: true, edit: false })
            setUsername('')
            setEmail('')
        }
        setIsUserModal(!isUserModal)
    }

    const handlerDeleteConfirmModal = (bool) => {
        setIsDeleteConfirmModal(bool);
    };

    async function deleteUserFunc(id) {
        const userData = await getUser(id);
        const data = userData.data;
        if (data.isDelete == false) {
            return toast.error("This user can't be deleted", {
                position: "top-center",
            })
        }
        deleteUser(id);
    }

    return (
        <section className='container mx-auto mt-5 px-5'>
            {!isUserModal && <div>
                <div className='mt-2'>
                    <h2>User Management</h2>
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
                                        name="usersFilter"
                                        id="usersFilter"
                                        className="focus:outline-none dark:bg-gray-950 w-fit"
                                        onChange={(e) => setSelectFilter(e.target.value)}
                                    >
                                        <option value="all">All</option>
                                        <option value="username">Username</option>
                                        <option value="email">Email</option>
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
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Admin</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.id}</td>
                                        <td className='max-w-[14rem] overflow-x-auto'>
                                            <span className='p-[0.5rem]'>
                                                {user.username}
                                            </span>
                                        </td>

                                        <td className='max-w-[20rem] overflow-x-auto'>
                                            <span className='p-[0.5rem]'>
                                                {user.email}
                                            </span>
                                        </td>
                                        <td className='max-w-[10rem] overflow-x-auto'>
                                            <span className='p-[0.5rem]'>
                                                {user.adminAccount ? 'Yes' : 'No'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className='flex items-center justify-start gap-2'>
                                                <button onClick={() => editUser(user.id)} className='btn bg-blue-500'>Edit</button>
                                                <button onClick={() =>
                                                    setIsDeleteConfirmModal({
                                                        isDelete: true,
                                                        id: user.id,
                                                    })
                                                } className='btn bg-red-500'>Delete</button>
                                                {/* <button className='btn bg-gray-700 !text-white'>Enable</button> */}
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
                                href={queryParameters.get("username") ? `/admin/users?username=${queryParameters.get("username")}&page=1` : queryParameters.get("email") ? `/admin/users?email=${queryParameters.get("email")}&page=1` :
                                    queryParameters.get("id") ? `/admin/users?id=${queryParameters.get("id")}&page=1` : '/admin/users?page=1'
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
                                    href={queryParameters.get("username") ? `/admin/users?username=${queryParameters.get("username")}&page=${page}` : queryParameters.get("email") ? `/admin/users?email=${queryParameters.get("email")}&page=${page}` :
                                        queryParameters.get("id") ? `/admin/users?id=${queryParameters.get("id")}&page=${page}` : `/admin/users?page=${page}`
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
                                        href={queryParameters.get("username") ? `/admin/users?username=${queryParameters.get("username")}&page=${page}` : queryParameters.get("email") ? `/admin/users?email=${queryParameters.get("email")}&page=${page}` :
                                            queryParameters.get("id") ? `/admin/users?id=${queryParameters.get("id")}&page=${page}` : `/admin/users?page=${page}`
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
                                    href={queryParameters.get("username") ? `/admin/users?username=${queryParameters.get("username")}&page=${page}` : queryParameters.get("email") ? `/admin/users?email=${queryParameters.get("email")}&page=${page}` :
                                        queryParameters.get("id") ? `/admin/users?id=${queryParameters.get("id")}&page=${page}` : `/admin/users?page=${page}`
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
                                href={queryParameters.get("username") ? `/admin/users?username=${queryParameters.get("username")}&page=${usersCount}` : queryParameters.get("email") ? `/admin/users?email=${queryParameters.get("email")}&page=${usersCount}` :
                                    queryParameters.get("id") ? `/admin/users?id=${queryParameters.get("id")}&page=${usersCount}` : `/admin/users?page=${usersCount}`
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
                <ConfirmAction handlerDeleteConfirmModal={handlerDeleteConfirmModal} isDeleteConfirmModal={isDeleteConfirmModal} deleteFunc={deleteUserFunc} text={'this user'} />
            )}
            {isUserModal && <div className='absolute top-0 right-0 left-0 bottom-0 bg-primary dark:bg-gray-900'>
                <div className='container mx-auto mt-5 px-5'>
                    <button onClick={() => setIsUserModal(false)} className='bg-darkPrimary dark:bg-gray-950 w-10 h-10 flex items-center justify-center rounded-full'>
                        <FaChevronLeft size={'2rem'} />
                    </button>
                    <h2>Add user</h2>
                    <form onSubmit={(e) => submitUser(e)} className='form flex flex-col gap-3 [&>*]:flex [&>*]:flex-col'>
                        <div>
                            <label htmlFor="">Username</label>
                            <input type="text" onChange={(e) => setUsername(e.target.value)} value={username} readOnly />
                        </div>
                        <div>
                            <label htmlFor="">Email <span className='text-sm text-red-800 font-bold bg-black px-1 py-[0.1rem] rounded-2xl'>Read-only</span></label>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} readOnly />
                        </div>
                        <div>
                            <label htmlFor="">Password</label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                        </div>
                        <div>
                            <label htmlFor="">Confirm password</label>
                            <input type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                        </div>
                        <div>
                            <label htmlFor="">Name</label>
                            <input type="text" onChange={(e) => setName(e.target.value)} value={name} readOnly />
                        </div>
                        <div>
                            <label htmlFor="">Phone</label>
                            <input type="text" onChange={(e) => setPhone(e.target.value)} value={phone} readOnly />
                        </div>
                        <div>
                            <label htmlFor="">University</label>
                            <input type="text" onChange={(e) => setUniversity(e.target.value)} value={university} readOnly />
                        </div>
                        <div>
                            <label htmlFor="">Department</label>
                            <input type="text" onChange={(e) => setDepartment(e.target.value)} value={department} readOnly />
                        </div>
                        <div className="flex !flex-row gap-2 items-center">
                            <input
                                type="checkbox"
                                id="admin"
                                checked={isCheckedAdminInput}
                                onChange={(e) => setIsCheckedAdminInput(!isCheckedAdminInput)}
                            />
                            <label htmlFor="admin">Admin</label>
                        </div>
                        <input type="submit" value={action.create ? `Create` : 'Edit'} />
                    </form>
                </div>
            </div>}
            <ToastContainer />
        </section>
    )
}

export default Users