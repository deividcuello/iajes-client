import React from 'react'
import { useEffect, useState } from 'react'
import { deleteRegionalAssociation, getAllRegionalAssociations, getRegionalAssociation } from '../../../../api'
import { FaChevronLeft } from 'react-icons/fa'
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { CiFilter } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import Cookies from 'js-cookie'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmAction from '../../../../components/confirm-action/confirm.action'
import { useSearchParams } from "react-router-dom";
import { pagination } from '../../../../utils/constants'

function RegionalAssociationAdmin() {
    const [queryParameters] = useSearchParams();
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [videosCount, setVideosCount] = useState(0)
    const [isVideoModal, setIsVideoModal] = useState(false)
    const [videos, setVideos] = useState([])
    const [videoUrl, setVideoUrl] = useState('')
    const [region, setRegion] = useState('kircher')
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
                setPage(videosCount);
            } else {
                setPage(parseInt(queryParameters.get("page")) - 1);
            }
        } else if (action == "sum") {
            if (page == videosCount) {
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
            if (videosCount < 5) {
                setFilteredPagination(range(1, videosCount + 1));
            } else if (p > 5 && p <= videosCount - 5) {
                setFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
            } else if (p <= 5) {
                setFilteredPagination([1, 2, 3, 4, 5]);
            } else if (p > videosCount - 5) {
                const array = range(p, videosCount + 1);
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
    }, [videosCount]);

    useEffect(() => {
        async function loadVideos() {

            const videoTitle = queryParameters.get("videoTitle");
            const id = queryParameters.get("id");

            let res = [{ data: "" }];

            if (videoTitle != null) {
                res = await getAllRegionalAssociations({
                    videoTitle: videoTitle,
                    page: page,
                    isAdmin: true,
                });
            }
            else if (id != null) {
                res = await getAllRegionalAssociations({
                    id: id,
                    page: page,
                    isAdmin: true,
                });
            }
            else if (videoTitle == null && id == null) {
                res = await getAllRegionalAssociations({ page: page, isAdmin: true });
            }

            setVideos(res.data.videos)

            setVideosCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );
        }

        loadVideos()
    }, [])

    async function submitFilter(e) {
        e.preventDefault();

        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/regional-associations?page=1`
            );
        } else if (selectFilter == "videoTitle") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/regional-associations?videoTitle=${textFilter}&page=1`
            );
        } else if (selectFilter == "id") {
            window.history.replaceState(
                "",
                "",
                `/admin/resources/regional-associations?id=${textFilter}&page=1`
            );
        }

        window.location.reload(false);
    }

    const handlerDeleteConfirmModal = (bool) => {
        setIsDeleteConfirmModal(bool);
    };

    const createVideo = (event) => {

        event.preventDefault();
        let formData = new FormData();
        formData.append("title", title);
        formData.append("video_url", videoUrl);
        formData.append("region", region);
        if (title.length == 0) {
            return toast.error("Add a title", {
                position: "top-center",
            })
        } else if (videoUrl.length == 0) {
            return toast.error("Add an valid url", {
                position: "top-center",
            })
        }

        if (action.create) {
            formData.append("hidden", true);
            fetch('https://deividcuello.pythonanywhere.com/api/regionalasociations/', {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "POST",
                body: formData,
            })
                .then((response) => response.ok ? window.location.reload(false) : toast.error("Invalid url", {
                    position: "top-center",
                })
                )
                .catch((error) =>
                    toast.error("Invalid url", {
                        position: "top-center",
                    })
                );
        } else if (action.edit) {
            formData.append("hidden", action.hidden);
            fetch(`https://deividcuello.pythonanywhere.com/api/regionalasociations/${action.edit}/`, {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "PUT",
                body: formData,
            })
                .then((response) => response.ok ? window.location.reload(false) : toast.error("Invalid url", {
                    position: "top-center",
                })
                )
                .catch((error) =>
                    console.clear()
                );
        }
    };

    async function editVideo(id) {
        setIsVideoModal(true);
        const getVideoData = await getRegionalAssociation({ id: id, page: 1 });
        const data = getVideoData.data;
        setAction({ create: false, edit: id, hidden: data.hidden })
        setTitle(data.title);
        setVideoUrl(data.video_url);
        setRegion(data.region);
    }

    function setIsVideoModalFunc() {
        setAction({ create: true, edit: false })
        setIsVideoModal(false)
        setTitle('');
        setVideoUrl('');
        setRegion('');
    }

    async function toggleHidden(id) {
        const documentData = await getRegionalAssociation({ id: id });
        const data = documentData.data;

        const jsonData = JSON.stringify({
            title: data.title,
            video_url: data.video_url,
            region: data.region,
            hidden: !data.hidden,
        });

        fetch(`https://deividcuello.pythonanywhere.com/api/regionalasociations/${id}/`, {
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

    function deleteVideoFunc(id) {
        deleteRegionalAssociation(id);
    }

    return (
        <section className='container mx-auto mt-5 px-5'>
            {!isVideoModal && <div>
                <div>
                    <button onClick={() => setIsVideoModal(true)} className='btn dark:bg-primary !text-white bg-darkPrimary'>Upload video</button>
                </div>
                <div className='mt-2'>
                    <h2>Regional Association Videos</h2>
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
                                        name="videosFilter"
                                        id="videosFilter"
                                        className="focus:outline-none dark:bg-gray-950 w-fit"
                                        onChange={(e) => setSelectFilter(e.target.value)}
                                    >
                                        <option value="all">All</option>
                                        <option value="videoTitle">Title</option>
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
                                    <th>Region</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    videos.map((video, index) => (
                                        <tr key={index}>
                                            <td>{video.id}</td>
                                            <td><span className='max-w-[15rem] md:max-w-[35rem] inline-block whitespace-nowrap overflow-x-auto'>{video.title}</span></td>
                                            <td><span className='max-w-[15rem] md:max-w-[35rem] inline-block whitespace-nowrap overflow-x-auto'>{video.region.toUpperCase()}</span></td>
                                            <td>
                                                <div className='flex items-center justify-start gap-2'>
                                                    <button onClick={() => editVideo(video.id)} className='btn bg-blue-500'>Edit</button>
                                                    <button onClick={() =>
                                                        setIsDeleteConfirmModal({
                                                            isDelete: true,
                                                            id: video.id,
                                                        })
                                                    } className='btn bg-red-500'>Delete</button>
                                                    <button onClick={() => toggleHidden(video.id)} className={`btn ${!video.hidden ? 'bg-gray-700' : 'bg-green-500'} !text-black`}>{!video.hidden ? 'Disable' : 'Enable'}</button>
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
                                href={queryParameters.get("videoTitle") ? `/admin/resources/regional-associations?videoTitle=${queryParameters.get("videoTitle")}&page=1` :
                                    queryParameters.get("id") ? `/admin/resources/regional-associations?id=${queryParameters.get("id")}&page=1` : '/admin/resources/regional-associations?page=1'}
                                onClick={() => updatePage("subtract")}
                                className="!p-0"
                            >
                                <MdKeyboardDoubleArrowLeft />
                            </a>
                        </li>
                        <li>
                            {
                                <a
                                    href={queryParameters.get("videoTitle") ? `/admin/resources/regional-associations?videoTitle=${queryParameters.get("videoTitle")}&page=${page}` : queryParameters.get("videoRegion") ? `/admin/resources/regional-associations?videoRegion=${queryParameters.get("videoRegion")}&page=${page}` :
                                        queryParameters.get("id") ? `/admin/resources/regional-associations?id=${queryParameters.get("id")}&page=${page}` :
                                            (queryParameters.get("page") == '1' && queryParameters.get("videoTitle")) ?
                                                `/admin/resources/regional-associations?videoTitle=${videoTitle}&page=${videosCount}` : `/admin/resources/regional-associations?page=${videosCount}`}
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
                                        href={queryParameters.get("videoTitle") ? `/admin/resources/regional-associations?videoTitle=${queryParameters.get("videoTitle")}&page=${page}` :
                                            queryParameters.get("id") ? `/admin/resources/regional-associations?id=${queryParameters.get("id")}&page=${page}` : queryParameters.get("videoRegion") ? `/admin/resources/regional-associations?videoRegion=${queryParameters.get("videoRegion")}&page=${page}` :
                                                (queryParameters.get("page") == '1' && queryParameters.get("videoTitle")) ?
                                                    `/admin/resources/regional-associations?videoTitle=${videoTitle}&page=${page}` : `/admin/resources/regional-associations?page=${page}`}
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
                                    href={queryParameters.get("videoTitle") ? `/admin/resources/regional-associations?videoTitle=${queryParameters.get("videoTitle")}&page=${page}` : queryParameters.get("videoRegion") ? `/admin/resources/regional-associations?videoRegion=${queryParameters.get("videoRegion")}&page=${page}` :
                                        queryParameters.get("id") ? `/admin/resources/regional-associations?id=${queryParameters.get("id")}&page=${page}` :
                                            (queryParameters.get("page") == `${videosCount}` && queryParameters.get("videoTitle")) ?
                                                `/admin/resources/regional-associations?videoTitle=${videoTitle}&page=1` : `/admin/resources/regional-associations?page=1`}
                                    onClick={() => updatePage("sum")}
                                    className="!p-0"
                                >
                                    <MdKeyboardArrowRight />
                                </a>
                            }
                        </li>
                        <li>
                            <a
                                href={queryParameters.get("videoTitle") ? `/admin/resources/regional-associations?videoTitle=${queryParameters.get("videoTitle")}&page=${videosCount}` : queryParameters.get("videoRegion") ? `/admin/resources/regional-associations?videoRegion=${queryParameters.get("videoRegion")}&page=1` :
                                    queryParameters.get("id") ? `/admin/resources/regional-associations?id=${queryParameters.get("id")}&page=${videosCount}` :
                                        (queryParameters.get("page") == `${videosCount}` && queryParameters.get("videoTitle")) ?
                                            `/admin/resources/regional-associations?videoTitle=${videoTitle}&page=${videosCount}` : `/admin/resources/regional-associations?page=${videosCount}`}
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
                <ConfirmAction handlerDeleteConfirmModal={handlerDeleteConfirmModal} isDeleteConfirmModal={isDeleteConfirmModal} deleteFunc={deleteVideoFunc} text={'this video'} />
            )}
            {isVideoModal && <div className='absolute top-0 x-50 right-0 left-0 bottom-0 bg-primary dark:bg-gray-900 overflow-y-auto'>
                <div className='container mx-auto px-5 w-full py-5'>
                    <button onClick={() => setIsVideoModalFunc()} className='bg-darkPrimary dark:bg-gray-950 w-10 h-10 flex items-center justify-center rounded-full'>
                        <FaChevronLeft size={'2rem'} />
                    </button>
                    <h2>Create Video</h2>
                    <form onSubmit={(event) => createVideo(event)} className='form flex flex-col gap-3 [&>*]:flex [&>*]:flex-col min-w-[100%]'>
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Title</label>
                            <input type="text" onChange={e => setTitle(e.target.value)} value={title} />
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
                        <div className='max-w-[347.52px]'>
                            <label htmlFor="">Video</label>
                            <input type="text" onChange={e => setVideoUrl(e.target.value)} value={videoUrl} />
                        </div>
                        <input type="submit" value={action.create ? `Upload` : 'Edit'} className='max-w-[347.52px]' />
                    </form>
                </div>
            </div>}
            <ToastContainer />
        </section>
    )
}

export default RegionalAssociationAdmin