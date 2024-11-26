import React from "react";
import { FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { getAllDocs, getAllCenters, getAllVideos } from "../../api";
import { useSearchParams } from "react-router-dom";

function Resources() {
  const [activeTab, setActiveTab] = useState(0);
  const [isVideoModal, setIsVideoModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState({});
  const [docs, setDocs] = useState([])
  const [centers, setCenters] = useState([])
  const [videos, setVideos] = useState([])
  
  const [textSearchDocsFilter, setTextSearchDocsFilter] = useState('')
  
  const [queryParameters] = useSearchParams();
  const [selectFilter, setSelectFilter] = useState("university");
  const [textFilter, setTextFilter] = useState('');
  const [textSearchFilter, setTextSearchFilter] = useState('');
  const [isFilter, setIsFilter] = useState(false);
  const [page, setPage] = useState('1');
  const baseHealthUrl = 'https://iajes-testing.netlify.app/resources/health/'
  const industry = 'health'


  useEffect(() => {
    async function loadDocs() {
      const res = await getAllDocs()
      setDocs(res.data.docs)
    }

    async function loadCenters() {
      const res = await getAllCenters()
      setCenters(res.data.centers)
    }

    async function loadVideos() {
      const res = await getAllVideos()
      setVideos(res.data.videos)
    }

    loadDocs()
    loadCenters()
    loadVideos()
  }, [])

  function updateVideoModal(id) {

    const video = document.querySelector(`#${id}`).querySelector("video");

    const [docs, setDocs] = useState(false)



    setActiveVideo(id);
    setVideoCurrentTime({
      currentTime: video.currentTime,
      isPaused: video.paused,
    });
    if (video.paused) {
      video.play();
    }
    setIsVideoModal(1);
  }


  useEffect(() => {
    try {
      const videoModal = document
        .querySelector("#video-modal")
        .querySelector("video");
      videoModal.currentTime = videoCurrentTime.currentTime;
      if (videoCurrentTime.isPaused == false) {
        videoModal.play();
      }
    } catch (error) {
      return;
    }
  }, [isVideoModal]);

  function stopPlayingVideo(e) {
    const videos = document
      .querySelector("#video-wrapper")
      .querySelectorAll("video");

    videos.forEach((video) => {
      if (video.id != e.target.id) {
        if (!document.querySelector(`#${video.id}`).paused) {
          document.querySelector(`#${video.id}`).pause()
        }
      }
    });
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
              id="0"
              onClick={(e) => setActiveTab(e.target.id)}
              className={`${activeTab == 0 && "font-semibold border-b border-black dark:border-white"
                } cursor-pointer`}
            >
              Centers, Labs, Institutes, Hubs, and Networks
            </li>
            <li
              id="1"
              onClick={(e) => setActiveTab(e.target.id)}
              className={`${activeTab == 1 && "font-semibold border-b border-black dark:border-white"
                } cursor-pointer`}
            >
              Videos
            </li>
            <li
              id="2"
              onClick={(e) => setActiveTab(e.target.id)}
              className={`${activeTab == 2 && "font-semibold border-b border-black dark:border-white"
                } cursor-pointer`}
            >
              Documents
            </li>
          </ul>
          <div className="mt-14">
            {activeTab == 0 && (
              <div className="[&>*]:flex [&>*]:flex-col [&>*]:md:flex-row [&>*]:gap-5 [&>*]:mt-5">
                <div className="mt-5">
                  <div>
                    <form onSubmit={(event) => submitSearchDocsFilter(event)} className="w-fit p-2">
                      <div className="flex flex-col gap-2 mt-3">
                        <div className="flex items-center gap-1 border-b-2 border-black">
                          <FaSearch size={'1.2rem'} />
                          <input type="text" placeholder="Search" onChange={(e) => setTextSearchDocsFilter(e.target.value)} value={textSearchFilter} className="bg-transparent w-full" />
                          <input type="submit" value='Search' className="bg-primary text-white p-2 w-fit self-end cursor-pointer" />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
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
                          <option value="university">University</option>
                          <option value="association">Regional Associations</option>
                          <option value="year">Year</option>
                          <option value="investigator">Principal Investigator</option>
                        </select>
                        <input type="submit" value='Apply' className="bg-white p-2 w-fit self-end cursor-pointer" />
                      </div>
                    </form>}
                  </div>
                </div>
                {
                  centers.map((center, index) => (
                    <div>
                      <div className="max-w-[25rem]">
                        <img
                          src={`https://deividcuello.pythonanywhere.com${center.cover_url}`}
                          alt=""
                        />
                      </div>
                      <div className="mt-7">
                        <h3>{center.center}</h3>
                        <p>{center.description}</p>
                        <p>{center.director}</p>
                      </div>
                    </div>
                  ))
                }

              </div>
            )}
            {activeTab == 1 && (
              <div>
                <div>
                  <h2>Videos about Humanitarian Engineering & Technology</h2>
                  <form action="">
                    <div className="flex gap-2 mt-5 border-b border-black dark:border-white w-fit items-center pb-1">
                      <FaSearch />
                      <input
                        type="text"
                        placeholder="search"
                        className="focus:outline-none"
                      />
                    </div>
                  </form>
                  <div>
                    <p className="flex items-center gap-2 text-xl font-medium mt-2">
                      <CiFilter /> Filter
                    </p>
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
                    {/* <div
                      id="video-2"
                      onClick={(e) => updateVideoModal("video-1")}
                      className="cursor-pointer"
                    >
                      <div className="w-full h-48 sm:h-60 md:h-72">
                        <video
                          id="videoID-2"
                          onPlay={(e) => stopPlayingVideo(e)}
                          controls
                          className="w-full h-full object-cover"
                        >
                          <source
                            src="/media/videos/resources/video.mp4"
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <h4>Title of video</h4>
                    </div>
                    <div
                      id="video-3"
                      onClick={(e) => updateVideoModal("video-1")}
                      className="cursor-pointer"
                    >
                      <div className="w-full h-48 sm:h-60 md:h-72">
                        <video
                          id="videoID-3"
                          onPlay={(e) => stopPlayingVideo(e)}
                          controls className="w-full h-full object-cover">
                          <source
                            src="/media/videos/resources/video.mp4"
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <h4>Title of video</h4>
                    </div> */}
                  </div>
                </div>
                {isVideoModal != false && (
                  <div
                    id="video-modal"
                    className="bg-[url('/media/images/homepage/hero.png')] w-full h-screen fixed right-0 z-50 top-0 left-0 bottom-0 text-white"
                  >
                    <div className="bg-gray-100 bg-opacity-5 backdrop-blur-sm">
                      <button
                        onClick={() => setIsVideoModal(false)}
                        className="absolute right-5 top-5"
                      >
                        <IoMdClose size={"2.5rem"} />
                      </button>
                      <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
                        <div className=" bg-gray-200 w-[calc(100%-10rem)] h-[calc(100vh-10rem)]">
                          <video
                            controls
                            className="w-full h-full object-cover"
                          >
                            <source
                              src="/media/videos/resources/video.mp4"
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                        <h2 className="bg-gray-950 px-5 py-1 rounded-3xl bg-opacity-70 backdrop-blur-sm">
                          Title of video
                        </h2>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab == 2 && (
              <div>
                <h2>Documents on Humanitarian Engineering & Technology</h2>
                <form action="">
                  <div className="flex gap-2 mt-5 border-b border-black dark:border-white w-fit items-center pb-1">
                    <FaSearch />
                    <input
                      type="text"
                      placeholder="search"
                      className="focus:outline-none"
                    />
                  </div>
                </form>
                <div>
                  <p className="flex items-center gap-2 text-xl font-medium mt-2">
                    <CiFilter /> Filter
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-[9rem] mt-5">
                  {
                    docs.map((doc, index) => (
                      <a href={`https://deividcuello.pythonanywhere.com${doc.document}`} target="_blank">
                        <div>
                          <div className="bg-gray-200 w-full md:w-56 h-72">
                            <img src={`https://deividcuello.pythonanywhere.com${doc.cover_url}`} alt="" className="w-full h-full object-cover" />
                          </div>
                          <h4>{doc.title}</h4>
                        </div>
                      </a>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Resources;
