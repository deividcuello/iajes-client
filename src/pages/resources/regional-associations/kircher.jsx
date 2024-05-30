import React from 'react'
import { Link } from 'react-router-dom'
import { getAllRegionalAssociations } from '../../../api'
import { useState, useEffect } from 'react'
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { CiFilter } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'
import { useSearchParams } from 'react-router-dom'
import { pagination } from '../../../utils/constants'

function KircherAssociation() {
    const [queryParameters] = useSearchParams();
    const [videos, setVideos] = useState([])
    const [videosCount, setVideosCount] = useState(0)
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [isFilter, setIsFilter] = useState(false);
    const [textFilter, setTextFilter] = useState('');
    const [selectFilter, setSelectFilter] = useState("all");

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
            let res = [{ data: "" }];

            if (videoTitle != null) {
                res = await getAllRegionalAssociations({ isAdmin: false, page: page, videoRegion: 'kircher', videoTitle: videoTitle })
            }
            else if (videoTitle == null) {
                res = await getAllRegionalAssociations({ isAdmin: false, page: page, videoRegion: 'kircher' })
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
                `/resources/regional-associations/kircher?page=1`
            );
        } else if (selectFilter == "videoTitle") {
            window.history.replaceState(
                "",
                "",
                `/resources/regional-associations/kircher?videoTitle=${textFilter}&page=1`
            );
        }

        window.location.reload(false);
    }

    return (
        <section className='min-h-screen'>
            <div className="w-full h-[30rem] bg-[url('/media/images/resources/hero.png')] bg-no-repeat bg-cover bg-center text-white flex items-center">
                <div className="container mx-auto px-5">
                    <h1 className="text-4xl sm:text-[64px] max-w-[900px] leading-tight sm:leading-none">
                        Regional Associations
                    </h1>
                </div>
            </div>
            <div className='container mx-auto'>
                <ul className='flex gap-5 [&>*]:text-[1rem] [&>*]:mb-2 overflow-x-auto'>
                    <li className='font-semibold border-b-2 border-black dark:border-white'><Link to='/resources/regional-associations/kircher'>KIRCHER</Link></li>
                    <li><Link to='/resources/regional-associations/jheasa'>JHEASA</Link></li>
                    <li><Link to='/resources/regional-associations/ausjal'>AUSJAL</Link></li>
                    <li><Link to='/resources/regional-associations/ajcu-ap'>AJCU-AP</Link></li>
                    <li><Link to='/resources/regional-associations/ajcu-am'>AJCU-AM</Link></li>
                    <li><Link to='/resources/regional-associations/ajcu'>AJCU</Link></li>
                </ul>
                <div className='mt-7'>
                    <h2>KIRCHER (Europe and the Near East)</h2>
                </div>
                <div>
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
                                    </select>
                                    <input type="submit" value='Apply' className="bg-white dark:text-black p-2 w-fit self-end cursor-pointer" />
                                </div>
                            </form>}
                        </div>
                    </div>
                </div>
                <div className='flex items-start justify-center w-full my-10'>
                    <img src="/media/images/regional_associations/kircher.png" alt="" className='max-w-[40rem]' />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
                    {
                        videos.map((video, index) => (
                            <div key={index}>
                                <div className="w-full h-48 sm:h-60 md:h-72">
                                    <iframe className="w-full h-full object-cover" src={`${video.video_url}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                </div>
                                <h4>{video.title}</h4>
                            </div>
                        ))
                    }
                </div>
                {filteredPagination.length > 1 && <div className="mt-10">
                    <ul className="pagination">
                        <li>
                            <a
                                href={queryParameters.get("videoTitle") ? `/resources/regional-associations/kircher?videoTitle=${queryParameters.get("videoTitle")}&page=1` :
                                    queryParameters.get("id") ? `/resources/regional-associations/kircher?id=${queryParameters.get("id")}&page=1` : '/resources/regional-associations/kircher?page=1'}
                                onClick={() => updatePage("subtract")}
                                className="!p-0"
                            >
                                <MdKeyboardDoubleArrowLeft />
                            </a>
                        </li>
                        <li>
                            {
                                <a
                                    href={queryParameters.get("videoTitle") ? `/resources/regional-associations/kircher?videoTitle=${queryParameters.get("videoTitle")}&page=${page}` : queryParameters.get("videoRegion") ? `/resources/regional-associations/kircher?videoRegion=${queryParameters.get("videoRegion")}&page=${page}` :
                                        queryParameters.get("id") ? `/resources/regional-associations/kircher?id=${queryParameters.get("id")}&page=${page}` :
                                            (queryParameters.get("page") == '1' && queryParameters.get("videoTitle")) ?
                                                `/resources/regional-associations/kircher?videoTitle=${videoTitle}&page=${videosCount}` : `/resources/regional-associations/kircher?page=${videosCount}`}
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
                                        href={queryParameters.get("videoTitle") ? `/resources/regional-associations/kircher?videoTitle=${queryParameters.get("videoTitle")}&page=${page}` :
                                            queryParameters.get("id") ? `/resources/regional-associations?id=${queryParameters.get("id")}&page=${page}` : queryParameters.get("videoRegion") ? `/resources/regional-associations/kircher?videoRegion=${queryParameters.get("videoRegion")}&page=${page}` :
                                                (queryParameters.get("page") == '1' && queryParameters.get("videoTitle")) ?
                                                    `/resources/regional-associations/kircher?videoTitle=${videoTitle}&page=${page}` : `/resources/regional-associations/kircher?page=${page}`}
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
                                    href={queryParameters.get("videoTitle") ? `/resources/regional-associations/kircher?videoTitle=${queryParameters.get("videoTitle")}&page=${page}` : queryParameters.get("videoRegion") ? `/resources/regional-associations/kircher?videoRegion=${queryParameters.get("videoRegion")}&page=${page}` :
                                        queryParameters.get("id") ? `/resources/regional-associations/kircher?id=${queryParameters.get("id")}&page=${page}` :
                                            (queryParameters.get("page") == `${videosCount}` && queryParameters.get("videoTitle")) ?
                                                `/resources/regional-associations/kircher?videoTitle=${videoTitle}&page=1` : `/resources/regional-associations/kircher?page=1`}
                                    onClick={() => updatePage("sum")}
                                    className="!p-0"
                                >
                                    <MdKeyboardArrowRight />
                                </a>
                            }
                        </li>
                        <li>
                            <a
                                href={queryParameters.get("videoTitle") ? `/resources/regional-associations/kircher?videoTitle=${queryParameters.get("videoTitle")}&page=${videosCount}` : queryParameters.get("videoRegion") ? `/resources/regional-associations/kircher?videoRegion=${queryParameters.get("videoRegion")}&page=1` :
                                    queryParameters.get("id") ? `/resources/regional-associations/kircher?id=${queryParameters.get("id")}&page=${videosCount}` :
                                        (queryParameters.get("page") == `${videosCount}` && queryParameters.get("videoTitle")) ?
                                            `/resources/regional-associations/kircher?videoTitle=${videoTitle}&page=${videosCount}` : `/resources/regional-associations/kircher?page=${videosCount}`}
                                onClick={() => updatePage("subtract")}
                                className="!p-0"
                            >
                                <MdKeyboardDoubleArrowRight />
                            </a>
                        </li>
                    </ul>
                </div>}
            </div>
        </section>
    )
}

export default KircherAssociation