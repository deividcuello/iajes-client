import React from "react";
import { FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { useState, useEffect } from "react";
import { getAllDocs, getAllVideos } from "../../../api";
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules';
import { pagination } from '../../../utils/constants';

function Academic() {

    const [docs, setDocs] = useState([])
    const [videos, setVideos] = useState([])

    const [queryParameters] = useSearchParams();
    const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
    const [filteredPagination, setFilteredPagination] = useState([]);
    const [docsCount, setDocsCount] = useState([]);
    const [selectFilter, setSelectFilter] = useState("all");
    const [textFilter, setTextFilter] = useState('');
    const [textSearchFilter, setTextSearchFilter] = useState('');
    const [isFilter, setIsFilter] = useState(false);
    const [pageDoc, setPageDoc] = useState('1');
    const baseDocUrl = 'http://localhost:5173/resources/academic/'

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
        async function loadAllDocs() {
            const docTitle = queryParameters.get("docTitle");
            const docAuthor = queryParameters.get("docAuthor");
            const docYear = queryParameters.get("docYear");
            let res = [{ data: "" }];
            if (docTitle != null) {
                res = await getAllDocs({ docTitle: docTitle, isAdmin: false, page: page });
            }
            else if (docAuthor != null) {
                res = await getAllDocs({ docAuthor: docAuthor, isAdmin: false, page: page });
            }
            else if (docYear != null) {
                res = await getAllDocs({ docYear: docYear, isAdmin: false, page: page });
            }
            else if (docTitle == null) {
                res = await getAllDocs({ pageDoc: pageDoc, isAdmin: false, page: page });
            }
            setDocs(res.data.docs)
            setDocsCount(
                isInt(res.data.count / pagination.SIZE)
                    ? Math.floor(res.data.count / pagination.SIZE)
                    : Math.floor(res.data.count / pagination.SIZE) + 1
            );
        }

        async function loadAllVideos() {
            const videoTitle = queryParameters.get("videoTitle");

            let res = [{ data: "" }];
            if (videoTitle != null) {
                res = await getAllVideos({ videoTitle: videoTitle, isAdmin: false, page: 1, isPagination: false });
            }
            else if (videoTitle == null) {
                res = await getAllVideos({ isAdmin: false, page: 1, isPagination: false });
            }
            setVideos(res.data.videos)
        }

        loadAllVideos()
        loadAllDocs()
    }, [])

    async function submitFilter(e) {
        e.preventDefault();
        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `${baseDocUrl}?page=1`
            );
        } else if (selectFilter == "docTitle") {
            window.history.replaceState(
                "",
                "",
                `${baseDocUrl}?docTitle=${textFilter}&page=1`
            );
        } else if (selectFilter == "docAuthor") {
            window.history.replaceState(
                "",
                "",
                `${baseDocUrl}?docAuthor=${textFilter}&page=1`
            );
        } else if (selectFilter == "docYear") {
            window.history.replaceState(
                "",
                "",
                `${baseDocUrl}?docYear=${textFilter}&page=1`
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
                    <h2>Videos</h2>
                    <div>
                        <div className="mt-5">
                        </div>
                        <div
                            id="video-wrapper"
                            className={`${videos.length < 4 && 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10'} mt-5`}
                        >
                            {videos.length > 3 &&
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={30}
                                    loop={true}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    breakpoints={{
                                        0: {
                                            slidesPerView: 1,
                                        },
                                        640: {
                                            slidesPerView: 2,
                                        },
                                        768: {
                                            slidesPerView: 3,
                                        }
                                    }}
                                    navigation={true}
                                    modules={[Pagination, Navigation]}
                                    className="mySwiper"
                                >
                                    {
                                        videos.map((video, index) => (
                                            <SwiperSlide
                                                key={index}
                                                className="cursor-pointer"
                                            >
                                                <div className="w-full h-48 sm:h-60 md:h-72">
                                                    <iframe className="w-full h-full object-cover" src={`${video.video_url}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                                </div>
                                                <h4>{video.title}</h4>
                                            </SwiperSlide>
                                        ))
                                    }
                                </Swiper>
                            }
                            {videos.length < 4 &&
                                videos.map((video, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer"
                                    >
                                        <div className="w-full h-48 sm:h-60 md:h-72">
                                            <iframe className="w-full h-full object-cover" src={`${video.video_url}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                        </div>
                                        <h4>{video.title}</h4>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="container mx-auto mt-10 px-2">
                    <h2>Documents</h2>
                    <div>
                        <div className="mt-5 mb-4">
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
                                            <option value="docTitle">Title</option>
                                            <option value="docAuthor">Author</option>
                                            <option value="docYear">Year</option>
                                        </select>
                                        <input type="submit" value='Apply' className="bg-white p-2 w-fit self-end cursor-pointer" />
                                    </div>
                                </form>}
                            </div>
                        </div>
                        <div>
                            <table className='w-full'>
                                <thead>
                                    <tr className='[&>*]:text-start'>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Year</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {docs.map((doc, index) => (
                                        <tr key={index}>
                                            <td><a href={`https://deividcuello.pythonanywhere.com${doc.document}`} className="underline">{doc.title}</a></td>
                                            <td className='max-w-[20rem]'><span className=' whitespace-nowrap inline-block w-full overflow-x-auto'>{doc.author}</span></td>
                                            <td><span>{doc.year}</span></td>
                                            <td>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {filteredPagination.length > 1 && <div className="mt-10">
                    <ul className="pagination">
                        <li>
                            <a
                                href={queryParameters.get("docAuthor") ? `/resources/academic?docAuthor=${queryParameters.get("docAuthor")}&page=1` :
                                    queryParameters.get("docYear") ? `/resources/academic?docYear=${queryParameters.get("docYear")}&page=1` :
                                        queryParameters.get("docTitle") ? `/resources/academic?docTitle=${queryParameters.get("docTitle")}&page=1` : `/resources/academic?page=1`}
                                onClick={() => updatePage("subtract")}
                                className="!p-0"
                            >
                                <MdKeyboardDoubleArrowLeft />
                            </a>
                        </li>
                        <li>
                            {
                                <a
                                    href={queryParameters.get("docAuthor") ? `/resources/academic?docAuthor=${queryParameters.get("docAuthor")}&page=${page}` :
                                        queryParameters.get("docYear") ? `/resources/academic?docYear=${queryParameters.get("docYear")}&page=${page}` :
                                            queryParameters.get("docTitle") ? `/resources/academic?docTitle=${queryParameters.get("docTitle")}&page=${page}` : `/resources/academic?page=${page}`}
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
                                        href={queryParameters.get("docAuthor") ? `/resources/academic?docAuthor=${queryParameters.get("docAuthor")}&page=${page}` :
                                            queryParameters.get("docYear") ? `/resources/academic?docYear=${queryParameters.get("docYear")}&page=${page}` :
                                                queryParameters.get("docTitle") ? `/resources/academic?docTitle=${queryParameters.get("docTitle")}&page=${page}` : `/resources/academic?page=${page}`}
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
                                    href={queryParameters.get("docAuthor") ? `/resources/academic?docAuthor=${queryParameters.get("docAuthor")}&page=${page}` :
                                        queryParameters.get("docYear") ? `/resources/academic?docYear=${queryParameters.get("docYear")}&page=${page}` :
                                            queryParameters.get("docTitle") ? `/resources/academic?docTitle=${queryParameters.get("docTitle")}&page=${page}` : `/resources/academic?page=${page}`}
                                    onClick={() => updatePage("sum")}
                                    className="!p-0"
                                >
                                    <MdKeyboardArrowRight />
                                </a>
                            }
                        </li>
                        <li>
                            <a
                                href={queryParameters.get("docAuthor") ? `/resources/academic?docAuthor=${queryParameters.get("docAuthor")}&page=${docsCount}` :
                                    queryParameters.get("docYear") ? `/resources/academic?docYear=${queryParameters.get("docYear")}&page=${docsCount}` :
                                        queryParameters.get("docTitle") ? `/resources/academic?docTitle=${queryParameters.get("docTitle")}&page=${docsCount}` : `/resources/academic?page=${docsCount}`}
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
    );
}

export default Academic;
