import React from "react";
import { FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { getAllVideos } from "../../../api";
import { useSearchParams } from "react-router-dom";

function Video() {

    const [videos, setVideos] = useState([])

    const [queryParameters] = useSearchParams();
    const [selectFilter, setSelectFilter] = useState("videoTitle");
    const [textFilter, setTextFilter] = useState('');
    const [textSearchFilter, setTextSearchFilter] = useState('');
    const [isFilter, setIsFilter] = useState(false);
    const [page, setPage] = useState('1');
    const baseVideoUrl = 'http://localhost:5173/resources/videos/'


    useEffect(() => {
        async function loadAllVideos() {
            const videoTitle = queryParameters.get("videoTitle");

            let res = [{ data: "" }];
            if (videoTitle != null) {
                res = await getAllVideos({ videoTitle: videoTitle, isAdmin: false, page: 1 });
            }
            else if (videoTitle == null) {
                res = await getAllVideos({ isAdmin: false, page: 1 });
            }
            setVideos(res.data.videos)
        }
        loadAllVideos()
    }, [])

    async function submitFilter(e) {
        e.preventDefault();
        if (selectFilter == "all") {
            window.history.replaceState(
                "",
                "",
                `${baseVideoUrl}?page=1`
            );
        } else if (selectFilter == "videoTitle") {
            window.history.replaceState(
                "",
                "",
                `${baseVideoUrl}?videoTitle=${textFilter}&page=1`
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
                    <ul className="flex flex-col md:flex-row gap-5 md:gap-20 [&>*]:text-xl  [&>*]:w-fit">
                        <li
                            className="cursor-pointer"
                        >
                            <a href="/resources/centers">
                                Centers, Labs, Institutes, Hubs, and Networks
                            </a>
                        </li>
                        <li
                            className="font-semibold border-b border-black dark:border-white cursor-pointer"
                        >
                            <a href="/resources/videos">Videos</a>

                        </li>
                        <li
                            className="cursor-pointer"
                        >
                            <a href="/resources/documents">Documents</a>
                        </li>
                    </ul>
                    <div className="mt-14">
                        <div className="mt-5">
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
                                            <option value="videoTitle">Title</option>
                                        </select>
                                        <input type="submit" value='Apply' className="bg-white p-2 w-fit self-end cursor-pointer" />
                                    </div>
                                </form>}
                            </div>
                        </div>
                        <div
                            id="video-wrapper"
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-5"
                        >
                            {
                                videos.map((video, index) => (
                                    <div
                                        id="video-1"
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
            </div>
        </section>
    );
}

export default Video;
