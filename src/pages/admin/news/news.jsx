import React, { useState, useEffect } from 'react'
import { FaChevronLeft } from "react-icons/fa6";
import CkEditorComp from '../../../components/ckeditor/ckeditor';
import Cookies from 'js-cookie';
import { deleteNews, getAllNews, getNews } from '../../../api';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiFilter } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import ConfirmAction from '../../../components/confirm-action/confirm.action';
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { pagination } from '../../../utils/constants';
import { useSearchParams } from 'react-router-dom';

function NewsAdmin() {
    const [queryParameters] = useSearchParams();
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [newsCount, setNewsCount] = useState([]);
    const [isNewsModal, setIsNewsModal] = useState(false);
    const [newsBody, setNewsBody] = useState('')
    const [titleInput, setTitleInput] = useState("");
    const [news, setNews] = useState([])
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
                setPage(newsCount);
            } else {
                setPage(parseInt(queryParameters.get("page")) - 1);
            }
        } else if (action == "sum") {
            if (page == newsCount) {
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
            if (newsCount < 5) {
                setFilteredPagination(range(1, newsCount + 1));
            } else if (p > 5 && p <= newsCount - 5) {
                setFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
            } else if (p <= 5) {
                setFilteredPagination([1, 2, 3, 4, 5]);
            } else if (p > newsCount - 5) {
                const array = range(p, newsCount + 1);
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
    }, [newsCount]);

    useEffect(() => {
        async function loadNews() {
            const headline = queryParameters.get("headline");
            const id = queryParameters.get("id");
            const created_at = queryParameters.get("created_at");

            let res = [{ data: "" }];

            if (headline != null) {
                res = await getAllNews({ headline: headline, isAdmin: true, page: page });
            } else if (id != null) {
                res = await getAllNews({
                    id: id,
                    page: page,
                    isAdmin: true,
                });
            } else if (created_at != null) {
                res = await getAllNews({
                    created_at: created_at,
                    page: page,
                    isAdmin: true,
                });
            }
            else if (headline == null && created_at == null && id == null) {
                res = await getAllNews({ page: page, isAdmin: true });
            }

            setNews(res.data.news)

            setNewsCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );
        }
        loadNews()

    }, [])

    async function submitFilter(e) {
        e.preventDefault();
        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `/admin/news?page=1`
            );
        } else if (selectFilter == "headline") {
            window.history.replaceState(
                "",
                "",
                `/admin/news?headline=${textFilter}&page=1`
            );
        } else if (selectFilter == "id") {
            window.history.replaceState(
                "",
                "",
                `/admin/news?id=${textFilter}&page=1`
            );
        } else if (selectFilter == "created_at") {
            window.history.replaceState(
                "",
                "",
                `/admin/news?created_at=${textFilter}&page=1`
            );
        }

        window.location.reload(false);
    }

    const handlerDeleteConfirmModal = (bool) => {
        setIsDeleteConfirmModal(bool);
    };

    const createNews = (event) => {
        event.preventDefault();
        const imageInput = document.querySelector("#imageInput");
        const descriptionInput = document.querySelectorAll(".ck-content > *");
        const title = titleInput;
        let image = imageInput.files[0];
        let formData = new FormData();
        let descriptionInputHTML = "";
        descriptionInput.forEach((element) => {
            descriptionInputHTML += `${element.outerHTML}`;
        });
        formData.append("image_url", image);
        formData.append("title", title);
        formData.append("description", descriptionInputHTML);
        if (title.length == 0) {
            return toast.error("Add a headline", {
                position: "top-center",
            })
        } else if (descriptionInputHTML.length == 0) {
            return toast.error("Add a description", {
                position: "top-center",
            })
        }

        if (action.create) {
            formData.append("hidden", true);
            let newNews = fetch('https://deividcuello.pythonanywhere.com/api/news/', {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "POST",
                body: formData,
            })
                .then(
                    (res) => window.location.reload(false)
                )
                .catch((error) =>
                    console.clear()
                );
        } else if (action.edit) {
            const tempAction = {
                ...action,
                isImageUrl: imageInput.files[0].name,
                image: imageInput.files[0],
            };
            formData.append("isImageUrl", tempAction.isImageUrl);
            formData.append("hidden", action.hidden);
            fetch(`https://deividcuello.pythonanywhere.com/api/news/${action.edit}/`, {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "PUT",
                body: formData,
            })
                .then(
                    (res) => window.location.reload(false)
                )
                .catch((error) =>
                    console.clear()
                );
        }
    }

    async function editNews(slug) {
        setIsNewsModal(true);
        const getNewsData = await getNews({ slug: slug });
        const data = getNewsData.data;
        const imageInput = document.querySelector("#imageInput");
        setAction({ create: false, edit: true })
        setTitleInput(data.title);
        setNewsBody(data.description)

        let list = new DataTransfer();
        let file = new File(["content"], `https://deividcuello.pythonanywhere.com${data.image_url}`);
        list.items.add(file);
        let myFileList = list.files;
        imageInput.files = myFileList;
        setAction({
            edit: slug,
            hidden: data.hidden,
            image: file.name,
            isImageUrl: "",
        });
    }

    function deleteNewsFunc(slug) {
        deleteNews(slug);
    }

    function setIsNewsModalFunc() {
        setAction({ create: true, edit: false })
        setIsNewsModal(false)

        setTitleInput('');
        setNewsBody('')
    }

    async function toggleHidden(slug) {
        const newsData = await getNews({ slug: slug });
        const data = newsData.data;
        let list = new DataTransfer();
        let file = new File(["content"], `https://deividcuello.pythonanywhere.com${data.image_url}`);
        list.items.add(file);
        let myFileList = list.files;

        const jsonData = JSON.stringify({
            hidden: !data.hidden,
            image_url: myFileList,
            isImageUrl: file.name,
            description: data.description,
            title: data.title,
        });
        let editNews = fetch(`https://deividcuello.pythonanywhere.com/api/news/${slug}/`, {
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
                toast.error("An error occurred", { position: toast.POSITION.TOP_CENTER })
            );
    }

    return (
        <section className='container mx-auto mt-5 px-5 news-container'>
            {!isNewsModal && <div>
                <div>
                    <button onClick={() => setIsNewsModal(true)} className='btn dark:bg-primary !text-white bg-darkPrimary'>Create news</button>
                </div>
                <div className='mt-2'>
                    <h2>News</h2>
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
                                        name="newsFilter"
                                        id="newsFilter"
                                        className="focus:outline-none dark:bg-gray-950 w-fit"
                                        onChange={(e) => setSelectFilter(e.target.value)}
                                    >
                                        <option value="all">All</option>
                                        <option value="headline">Headline</option>
                                        <option value="created_at">Created at</option>
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
                                    <th>Created at</th>
                                    <th>Headline</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    news.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td><span className='max-w-[10rem] inline-block whitespace-nowrap overflow-x-auto'>{item.created_at.slice(0, 10)}</span></td>
                                            <td><span className='max-w-[15rem] md:max-w-[25rem] inline-block whitespace-nowrap overflow-x-auto'>{item.title}</span></td>
                                            <td>
                                                <div className='flex items-center justify-start gap-2'>
                                                    <button onClick={() => editNews(item.slug)} className='btn bg-blue-500'>Edit</button>
                                                    <button onClick={() =>
                                                        setIsDeleteConfirmModal({
                                                            isDelete: true,
                                                            id: item.slug,
                                                        })
                                                    } className='btn bg-red-500'>Delete</button>
                                                    <button onClick={() => toggleHidden(item.slug)} className={`btn ${!item.hidden ? 'bg-gray-700' : 'bg-green-500'} !text-black`}>{!item.hidden ? 'Disable' : 'Enable'}</button>
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
                                href={queryParameters.get("headline") ? `/admin/news?headline=${queryParameters.get("headline")}&page=1` : queryParameters.get("created_at") ? `/admin/news?created_at=${queryParameters.get("created_at")}&page=1` :
                                    queryParameters.get("id") ? `/admin/news?id=${queryParameters.get("id")}&page=1` : '/admin/resources/news?page=1'
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
                                    href={queryParameters.get("headline") ? `/admin/news?headline=${queryParameters.get("headline")}&page=${page}` : queryParameters.get("created_at") ? `/admin/news?created_at=${queryParameters.get("created_at")}&page=${page}` :
                                        queryParameters.get("id") ? `/admin/news?id=${queryParameters.get("id")}&page=${page}` : `/admin/resources/news?page=${page}`
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
                                        href={queryParameters.get("headline") ? `/admin/news?headline=${queryParameters.get("headline")}&page=${page}` : queryParameters.get("created_at") ? `/admin/news?created_at=${queryParameters.get("created_at")}&page=${page}` :
                                            queryParameters.get("id") ? `/admin/news?id=${queryParameters.get("id")}&page=${page}` : `/admin/resources/news?page=${page}`
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
                                    href={queryParameters.get("headline") ? `/admin/news?headline=${queryParameters.get("headline")}&page=${page}` : queryParameters.get("created_at") ? `/admin/news?created_at=${queryParameters.get("created_at")}&page=${page}` :
                                        queryParameters.get("id") ? `/admin/news?id=${queryParameters.get("id")}&page=${page}` : `/admin/resources/news?page=${page}`
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
                                href={queryParameters.get("headline") ? `/admin/news?headline=${queryParameters.get("headline")}&page=${newsCount}` : queryParameters.get("created_at") ? `/admin/news?created_at=${queryParameters.get("created_at")}&page=${newsCount}` :
                                    queryParameters.get("id") ? `/admin/news?id=${queryParameters.get("id")}&page=${newsCount}` : `/admin/resources/news?page=${newsCount}`
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
                <ConfirmAction handlerDeleteConfirmModal={handlerDeleteConfirmModal} isDeleteConfirmModal={isDeleteConfirmModal} deleteFunc={deleteNewsFunc} text={'this news'} />
            )}
            {isNewsModal && <div className='absolute top-0 right-0 left-0 bottom-0 bg-primary dark:bg-gray-900'>
                <div className='container mx-auto mt-5 px-5 w-full'>
                    <button onClick={() => setIsNewsModalFunc()} className='bg-darkPrimary dark:bg-gray-950 w-10 h-10 flex items-center justify-center rounded-full'>
                        <FaChevronLeft size={'2rem'} />
                    </button>
                    <h2>Create news</h2>
                    <form onSubmit={(event) => createNews(event)} className='form flex flex-col gap-3 [&>*]:flex [&>*]:flex-col min-w-[100%]'>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Image</label>
                            <input type="file" id='imageInput' accept="image/*" className='bg-transparent dark:bg-transparent' />
                        </div>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Headline</label>
                            <input type="text" onChange={(e) => setTitleInput(e.target.value)} value={titleInput} />
                        </div>
                        <div>
                            <label htmlFor="">Body</label>
                            <CkEditorComp description={newsBody} />
                        </div>
                        <input type="submit" value={action.create ? `Create` : 'Edit'} />
                    </form>
                </div>
            </div>}
            <ToastContainer />
        </section>
    )
}

export default NewsAdmin