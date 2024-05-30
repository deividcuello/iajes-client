import React from "react";
import { FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { getAllCenters } from "../../../api";
import { useSearchParams } from "react-router-dom";

function Centers() {

  const [centers, setCenters] = useState([])

  const [queryParameters] = useSearchParams();
  const [selectFilter, setSelectFilter] = useState("center");
  const [textFilter, setTextFilter] = useState('');
  const [textSearchFilter, setTextSearchFilter] = useState('');
  const [isFilter, setIsFilter] = useState(false);
  const [page, setPage] = useState('1');
  const baseCenterUrl = 'http://localhost:5173/resources/centers/'


  useEffect(() => {
    async function loadAllCenters() {
      const center = queryParameters.get("center");
      const director = queryParameters.get("director");

      let res = [{ data: "" }];
      if (center != null) {
        res = await getAllCenters({ center: center, isAdmin: false });
      } else if (director != null) {
        res = await getAllCenters({
          director: director,
          page: page,
          isAdmin: false,
        });
      }
      else if (director == null && center == null) {
        res = await getAllCenters({ page: page, isAdmin: false });
      }
      setCenters(res.data.centers)
    }
    loadAllCenters()
  }, [])

  async function submitFilter(e) {
    e.preventDefault();
    if (selectFilter == "all") {
      window.history.replaceState(
        "",
        "",
        `${baseCenterUrl}?page=1`
      );
    } else if (selectFilter == "center") {
      window.history.replaceState(
        "",
        "",
        `${baseCenterUrl}?center=${textFilter}&page=1`
      );
    } else if (selectFilter == "director") {
      window.history.replaceState(
        "",
        "",
        `${baseCenterUrl}?director=${textFilter}&page=1`
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
              className="font-semibold border-b border-black dark:border-white cursor-pointer"
            >
              <a href="/resources/centers">
                Centers, Labs, Institutes, Hubs, and Networks
              </a>
            </li>
            <li
              className="cursor-pointer"
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
            {/* <div className="mt-5">
                <div>
                  <form onSubmit={(event) => submitSearchFilter(event)} className="w-fit p-2">
                    <div className="flex flex-col gap-2 mt-3">
                      <div className="flex items-center gap-1 border-b-2 border-black">
                        <FaSearch size={'1.2rem'} />
                        <input type="text" placeholder="Search" onChange={(e) => setTextSearchFilter(e.target.value)} value={textSearchFilter} className="bg-transparent w-full" />
                        <input type="submit" value='Search' className="bg-primary text-white p-2 w-fit self-end cursor-pointer" />
                      </div>
                    </div>
                  </form>
                </div>
              </div> */}
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
                      <option value="center">Center</option>
                      <option value="director">Director</option>
                    </select>
                    <input type="submit" value='Apply' className="bg-white p-2 w-fit self-end cursor-pointer" />
                  </div>
                </form>}
              </div>
            </div>
            <div className="[&>*]:flex [&>*]:flex-col [&>*]:md:flex-row [&>*]:gap-5 [&>*]:mt-5">
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

          </div>
        </div>
      </div>
    </section>
  );
}

export default Centers;
