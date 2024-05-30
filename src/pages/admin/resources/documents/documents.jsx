import React from 'react'
import { useState, useEffect } from 'react'
import { FaChevronLeft } from 'react-icons/fa6'
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { CiFilter } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import Cookies from 'js-cookie'
import { deleteDoc, getAllDocs, getDoc } from '../../../../api'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmAction from '../../../../components/confirm-action/confirm.action'
import { useSearchParams } from "react-router-dom";
import { pagination } from '../../../../utils/constants';

function DocumentsAdmin() {
    const [queryParameters] = useSearchParams();
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [docsCount, setDocsCount] = useState([]);
    const [isDocModal, setIsDocModal] = useState(false)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [year, setYear] = useState(2024)
    const [docs, setDocs] = useState([])
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
            console.log(error);
        }
    };

    async function updatePage(action) {
        if (action == "subtract") {
            if (page == 1) {
                setPage(docsCount);
            } else {
                setPage(parseInt(queryParameters.get("page")) - 1);
            }
        } else if (action == "sum") {
            if (page == docsCount) {
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
            if (docsCount < 5) {
                setFilteredPagination(range(1, docsCount + 1));
            } else if (p > 5 && p <= docsCount - 5) {
                setFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
            } else if (p <= 5) {
                setFilteredPagination([1, 2, 3, 4, 5]);
            } else if (p > docsCount - 5) {
                const array = range(p, docsCount + 1);
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
    }, [docsCount]);

    useEffect(() => {
        async function loadDocs() {
            const author = queryParameters.get("author");
            const docTitle = queryParameters.get("title");
            const year = queryParameters.get("year");
            const id = queryParameters.get("id");

            let res = [{ data: "" }];

            if (docTitle != null) {
                res = await getAllDocs({ docTitle: docTitle, isAdmin: true, page: page });
            } else if (year != null) {
                res = await getAllDocs({
                    docYear: year,
                    page: page,
                    isAdmin: true,
                });
            } else if (author != null) {
                res = await getAllDocs({
                    docAuthor: author,
                    page: page,
                    isAdmin: true,
                });
            } else if (id != null) {
                res = await getAllDocs({
                    id: id,
                    page: page,
                    isAdmin: true,
                });
            }
            else if (docTitle == null && author == null && id == null) {
                res = await getAllDocs({ page: page, isAdmin: true });
            }

            setDocs(res.data.docs)
            setDocsCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );
        }
        loadDocs()
    }, [])

    async function submitFilter(e) {
        e.preventDefault();
        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/documents?page=1`
            );
        } else if (selectFilter == "title") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/documents?title=${textFilter}&page=1`
            );
        } else if (selectFilter == "author") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/documents?author=${textFilter}&page=1`
            );
        } else if (selectFilter == "year") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/documents?year=${textFilter}&page=1`
            );
        } else if (selectFilter == "id") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/documents?id=${textFilter}&page=1`
            );
        }

        window.location.reload(false);
    }

    const handlerDeleteConfirmModal = (bool) => {
        setIsDeleteConfirmModal(bool);
    };

    const uploadDoc = (event) => {
        event.preventDefault();
        const imageInput = document.querySelector("#imageInput");
        // let image = imageInput.files[0];
        const fileInput = document.querySelector("#fileInput");
        let file = fileInput.files[0];
        let formData = new FormData();
        // formData.append("cover_url", image);
        formData.append("title", title);
        formData.append("year", year);
        formData.append("author", author);
        formData.append("doc", file);

        if (title.length == 0) {
            return toast.error("Add a title", {
                position: "top-center",
            })
        }
        // else if(!image){
        //     return toast.error("Add a cover", {
        //         position: "top-center",
        //       })
        // } 
        else if (!file) {
            return toast.error("Add a doc", {
                position: "top-center",
            })
        }

        if (action.create) {
            formData.append("hidden", true);
            let newDocs = fetch('https://deividcuello.pythonanywhere.com/api/docs/', {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "POST",
                body: formData,
            })
                .then((res) => window.location.reload(false)
                )
                .catch((error) =>
                    console.log(error)
                );
        } else if (action.edit) {
            formData.append("hidden", action.hidden);
            const tempAction = {
                ...action,
                // isImageUrl: imageInput.files[0].name,
                isDocUrl: fileInput.files[0].name,
                // image: imageInput.files[0],
            };
            // formData.append("isImageUrl", tempAction.isImageUrl);
            formData.append("isDocUrl", tempAction.isDocUrl);

            fetch(`https://deividcuello.pythonanywhere.com/api/docs/${action.edit}/`, {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "PUT",
                body: formData,
            })
                .then((res) => window.location.reload(false)
                )
                .catch((error) =>
                    console.log(error)
                );
        }
    };

    async function editDoc(id) {
        setIsDocModal(true);
        const getDocData = await getDoc({ id: id });
        const data = getDocData.data;
        // const imageInput = document.querySelector("#imageInput");
        const fileInput = document.querySelector("#fileInput");
        setAction({ create: false, edit: true })
        setTitle(data.title);
        setAuthor(data.author);
        setYear(data.year);

        // let list = new DataTransfer();
        // let file = new File(["content"], `https://deividcuello.pythonanywhere.com${data.cover_url}`);
        // list.items.add(file);
        // let myFileList = list.files;
        // imageInput.files = myFileList;


        let list1 = new DataTransfer();
        let file1 = new File(["content"], `https://deividcuello.pythonanywhere.com${data.document}`);
        list1.items.add(file1);
        let myFileList1 = list1.files;
        fileInput.files = myFileList1;

        setAction({
            edit: id,
            hidden: data.hidden,
            author: data.author,
            // image: file.name,
            // isImageUrl: "",
            isDocUrl: "",
        });
    }

    function setIsDocModalFunc() {
        setAction({ create: true, edit: false })
        setIsDocModal(false)
        setTitle('');
        setAuthor('')
        setYear('')
    }

    async function toggleHidden(id) {
        const documentData = await getDoc({ id: id });
        const data = documentData.data;
        // let list = new DataTransfer();
        // let file = new File(["content"], `https://deividcuello.pythonanywhere.com${data.cover_url}`);
        // list.items.add(file);
        // let myFileList = list.files;

        let list1 = new DataTransfer();
        let file1 = new File(["content"], `https://deividcuello.pythonanywhere.com${data.document}`);
        list1.items.add(file1);
        let myFileList1 = list1.files;

        const jsonData = JSON.stringify({
            title: data.title,
            hidden: !data.hidden,
            year: data.year,
            author: data.author,
            // cover_url: myFileList,
            doc: myFileList1,
            // isImageUrl: file.name,
            isDocUrl: file1.name
        });
        fetch(`https://deividcuello.pythonanywhere.com/api/docs/${id}/`, {
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

    function deleteDocFunc(id) {
        deleteDoc(id);
    }

    return (
        <section className='container mx-auto mt-5 px-5'>
            {!isDocModal && <div>
                <div>
                    <button onClick={() => setIsDocModal(true)} className='btn dark:bg-primary !text-white bg-darkPrimary'>Upload document</button>
                </div>
                <div className='mt-2'>
                    <h2>Documents</h2>
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
                                        name="docsFilter"
                                        id="docsFilter"
                                        className="focus:outline-none dark:bg-gray-950 w-fit"
                                        onChange={(e) => setSelectFilter(e.target.value)}
                                    >
                                        <option value="all">All</option>
                                        <option value="title">Title</option>
                                        <option value="author">Author</option>
                                        <option value="year">Year</option>
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
                                    <th>Author</th>
                                    <th>Year</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docs.map((doc, index) => (
                                    <tr key={index}>
                                        <td>{doc.id}</td>
                                        <td className='max-w-[20rem]'><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'><a href={`https://deividcuello.pythonanywhere.com${doc.document}`} className='cursor-pointer underline'>{doc.title}</a></span></td>
                                        <td className='max-w-[20rem]'><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{doc.author}</span></td>
                                        <td><span className='max-w-[15rem] inline-block whitespace-nowrap overflow-x-auto'>{doc.year}</span></td>
                                        <td>
                                            <div className='flex items-center justify-start gap-2'>
                                                <button onClick={() => editDoc(doc.id)} className='btn bg-blue-500'>Edit</button>
                                                <button onClick={() =>
                                                    setIsDeleteConfirmModal({
                                                        isDelete: true,
                                                        id: doc.id,
                                                    })
                                                } className='btn bg-red-500'>Delete</button>
                                                <button onClick={() => toggleHidden(doc.id)} className={`btn ${!doc.hidden ? 'bg-gray-700' : 'bg-green-500'} !text-black`}>{!doc.hidden ? 'Disable' : 'Enable'}</button>
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
                                href={queryParameters.get("title") ? `/admin/resources/documents?title=${queryParameters.get("title")}&page=1` :
                                    queryParameters.get("author") ? `/admin/resources/documents?author=${queryParameters.get("author")}&page=1` :
                                        queryParameters.get("year") ? `/admin/resources/documents?year=${queryParameters.get("year")}&page=${page}` :
                                            queryParameters.get("id") ? `/admin/resources/documents?id=${queryParameters.get("id")}&page=${page}` :
                                                '/admin/resources/documents?page=1'
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
                                    href={queryParameters.get("title") ? `/admin/resources/documents?title=${queryParameters.get("title")}&page=${page}` :
                                        queryParameters.get("author") ? `/admin/resources/documents?author=${queryParameters.get("author")}&page=${page}` :
                                            queryParameters.get("year") ? `/admin/resources/documents?year=${queryParameters.get("year")}&page=${page}` :
                                                queryParameters.get("id") ? `/admin/resources/documents?id=${queryParameters.get("id")}&page=${page}` : `/admin/resources/documents?page=${docsCount}`
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
                                        href={queryParameters.get("title") ? `/admin/resources/documents?title=${queryParameters.get("title")}&page=${page}` :
                                            queryParameters.get("author") ? `/admin/resources/documents?author=${queryParameters.get("author")}&page=${page}` :
                                                queryParameters.get("year") ? `/admin/resources/documents?year=${queryParameters.get("year")}&page=${page}` :
                                                    queryParameters.get("id") ? `/admin/resources/documents?id=${queryParameters.get("id")}&page=${page}` : '/admin/resources/documents?page=1'
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
                                    href={queryParameters.get("title") ? `/admin/resources/documents?title=${queryParameters.get("title")}&page=${page}` :
                                        queryParameters.get("author") ? `/admin/resources/documents?author=${queryParameters.get("author")}&page=${page}` :
                                            queryParameters.get("year") ? `/admin/resources/documents?year=${queryParameters.get("year")}&page=${page}` :
                                                queryParameters.get("id") ? `/admin/resources/documents?id=${queryParameters.get("id")}&page=${page}` : '/admin/resources/documents?page=1'
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
                                href={queryParameters.get("title") ? `/admin/resources/documents?title=${queryParameters.get("title")}&page=${docsCount}` :
                                    queryParameters.get("author") ? `/admin/resources/documents?author=${queryParameters.get("author")}&page=${docsCount}` :
                                        queryParameters.get("year") ? `/admin/resources/documents?year=${queryParameters.get("year")}&page=${docsCount}` :
                                            queryParameters.get("id") ? `/admin/resources/documents?id=${queryParameters.get("id")}&page=${docsCount}` : `/admin/resources/documents?page=${docsCount}`
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
                <ConfirmAction handlerDeleteConfirmModal={handlerDeleteConfirmModal} isDeleteConfirmModal={isDeleteConfirmModal} deleteFunc={deleteDocFunc} text={'this document'} />
            )}
            {isDocModal && <div className='absolute top-0 x-50 right-0 left-0 bottom-0 bg-primary dark:bg-gray-900 overflow-y-auto'>
                <div className='container mx-auto px-5 w-full py-5'>
                    <button onClick={() => setIsDocModalFunc()} className='bg-darkPrimary dark:bg-gray-950 w-10 h-10 flex items-center justify-center rounded-full'>
                        <FaChevronLeft size={'2rem'} />
                    </button>
                    <h2>Upload doc</h2>
                    <form onSubmit={uploadDoc} className='form flex flex-col gap-3 [&>*]:flex [&>*]:flex-col min-w-[100%]'>
                        {/* <div className='max-w-[347.52px]'>
                            <label htmlFor="">Cover</label>
                            <input type="file" id='imageInput' accept="image/*" className='bg-transparent dark:bg-transparent' />
                        </div> */}
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Document</label>
                            <input type="file" id='fileInput' className='bg-transparent dark:bg-transparent' />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Title</label>
                            <input type="text" onChange={e => setTitle(e.target.value)} value={title} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Author</label>
                            <input type="text" onChange={e => setAuthor(e.target.value)} value={author} />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Year</label>
                            <input type="number" min="1900" max="2099" step="1" onChange={(e) => setYear(e.target.value)} value={year} />
                        </div>
                        <input type="submit" value={action.create ? `Upload` : 'Edit'} className='max-w-[347.52px]' />
                    </form>
                </div>
            </div>}
            <ToastContainer />
        </section>
    )
}

export default DocumentsAdmin