import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllProjects } from "../../../api";
import { CiFilter } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { pagination } from '../../../utils/constants';

function Energy() {

  const [queryParameters] = useSearchParams();
  const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
  const [filteredPagination, setFilteredPagination] = useState([]);
  const [projectsCount, setProjectsCount] = useState([]);
  const [projectsData, setProjectsData] = useState([])
  const [selectFilter, setSelectFilter] = useState("all");
  const [textFilter, setTextFilter] = useState('');
  const [textSearchFilter, setTextSearchFilter] = useState('');
  const [isFilter, setIsFilter] = useState(false);
  const baseEnergyUrl = 'http://localhost:5173/projects/energy/'

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
        setPage(projectsCount);
      } else {
        setPage(parseInt(queryParameters.get("page")) - 1);
      }
    } else if (action == "sum") {
      if (page == projectsCount) {
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
      if (projectsCount < 5) {
        setFilteredPagination(range(1, projectsCount + 1));
      } else if (p > 5 && p <= projectsCount - 5) {
        setFilteredPagination([p - 2, p - 1, p, p + 1, p + 2]);
      } else if (p <= 5) {
        setFilteredPagination([1, 2, 3, 4, 5]);
      } else if (p > projectsCount - 5) {
        const array = range(p, projectsCount + 1);
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
  }, [projectsCount]);

  useEffect(() => {
    async function loadAllProjects() {
      const university = queryParameters.get("university");
      const association = queryParameters.get("association");
      const start_year = queryParameters.get("start_year");
      const end_year = queryParameters.get("end_year");
      const keyword = queryParameters.get("keyword");
      const investigator = queryParameters.get("investigator");
      const projectName = queryParameters.get("projectName");

      // const res = await getAllProjects({industry : 'energy'})

      let res = [{ data: "" }];
      if (university != null) {
        res = await getAllProjects({ industry: 'energy', university: university.replace(/\s+/g, ' ').trim(), isAdmin: false, approved: true, page: page });
      } else if (association != null) {
        res = await getAllProjects({
          industry: 'energy',
          association: association.replace(/\s+/g, ' ').trim(),
          page: page,
          isAdmin: false,
          approved: true
        });
      } else if (start_year != null) {
        res = await getAllProjects({
          industry: 'energy',
          start_year: start_year.replace(/\s+/g, ' ').trim(),
          page: page,
          isAdmin: false,
          approved: true
        });
      } else if (end_year != null) {
        res = await getAllProjects({
          industry: 'energy',
          end_year: end_year.replace(/\s+/g, ' ').trim(),
          page: page,
          isAdmin: false,
          approved: true
        });
      } else if (keyword != null) {
        res = await getAllProjects({
          industry: 'energy',
          keyword: keyword.replace(/\s+/g, ' ').trim(),
          page: page,
          isAdmin: false,
          approved: true
        });
      } else if (investigator != null) {
        res = await getAllProjects({
          industry: 'energy',
          investigator: investigator.replace(/\s+/g, ' ').trim(),
          page: page,
          isAdmin: false,
          approved: true
        });
      } else if (projectName != null) {
        res = await getAllProjects({
          industry: 'energy',
          projectName: projectName.replace(/\s+/g, ' ').trim(),
          page: page,
          isAdmin: false,
          approved: true
        });
      }
      else if (university == null && association == null && keyword == null && start_year == null && end_year == null && investigator == null) {
        res = await getAllProjects({ page: page, industry: 'energy', isAdmin: false, approved: true });
      }
      setProjectsData(res.data.projects)

      setProjectsCount(
        isInt(res.data.count / pagination.SIZE)
          ? Math.floor(res.data.count / pagination.SIZE)
          : Math.floor(res.data.count / pagination.SIZE) + 1
      );
    }
    loadAllProjects()
  }, [])

  async function submitFilter(e) {
    e.preventDefault();
    if (selectFilter == "all") {
      window.history.replaceState(
        "",
        "",
        `${baseEnergyUrl}?page=1`
      );
    } else if (selectFilter == "university") {
      window.history.replaceState(
        "",
        "",
        `${baseEnergyUrl}?university=${textFilter.replace(/\s+/g, ' ').trim()}&page=1`
      );
    } else if (selectFilter == "association") {
      window.history.replaceState(
        "",
        "",
        `${baseEnergyUrl}?association=${textFilter.replace(/\s+/g, ' ').trim()}&page=1`
      );
    } else if (selectFilter == "keyword") {
      window.history.replaceState(
        "",
        "",
        `${baseEnergyUrl}?keyword=${textFilter.replace(/\s+/g, ' ').trim()}&page=1`
      );
    } else if (selectFilter == "start_year") {
      window.history.replaceState(
        "",
        "",
        `${baseEnergyUrl}?start_year=${textFilter.replace(/\s+/g, ' ').trim()}&page=1`
      );
    } else if (selectFilter == "end_year") {
      window.history.replaceState(
        "",
        "",
        `${baseEnergyUrl}?end_year=${textFilter.replace(/\s+/g, ' ').trim()}&page=1`
      );
    } else if (selectFilter == "investigator") {
      window.history.replaceState(
        "",
        "",
        `${baseEnergyUrl}?investigator=${textFilter.replace(/\s+/g, ' ').trim()}&page=1`
      );
    }

    window.location.reload(false);
  }

  async function submitSearchFilter(e) {
    e.preventDefault();
    if (textSearchFilter.length > 0) {
      window.history.replaceState(
        "",
        "",
        `${baseEnergyUrl}?projectName=${textSearchFilter.replace(/\s+/g, ' ').trim()}&page=1`
      );
    } else {
      window.history.replaceState(
        "",
        "",
        `${baseEnergyUrl}`
      );
    }

    window.location.reload(false);
  }

  const handlerDeleteConfirmModal = (bool) => {
    setIsDeleteConfirmModal(bool);
  };

  return (
    <section>
      <div>
        <div className="w-full h-[30rem] bg-[url('/media/images/projects/energy/hero.png')] bg-no-repeat bg-cover bg-center text-white flex items-center">
          <div className="container mx-auto px-5">
            <h1 className="text-4xl sm:text-[64px] max-w-[900px] leading-tight sm:leading-none">
              Energy
            </h1>
          </div>
        </div>
        <div className="container mx-auto mt-10 px-5">
          <div className="mt-14">
            <div className="flex justify-center items-start">
              <img src="/media/images/projects/energy/energy-map.png" alt="" />
            </div>
          </div>
          <div className="mt-5">
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
                    <option value="all">All</option>
                    <option value="university">University</option>
                    <option value="keyword">Keyword</option>
                    <option value="association">Regional Associations</option>
                    <option value="start_year">Start Year</option>
                    <option value="end_year">End Year</option>
                    <option value="investigator">Principal Investigator</option>
                  </select>
                  <input type="submit" value='Apply' className="bg-white p-2 w-fit self-end cursor-pointer" />
                </div>
              </form>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mt-5">
            {
              projectsData.map((project, index) => (
                <Link key={index} to={`/projects/energy/${project.slug}`}>
                  <div className="h-52">
                    <img src={`https://deividcuello.pythonanywhere.com${project.image_url}`} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h4>{project.title}</h4>
                  <p>Learn More</p>
                </Link>
              ))
            }
          </div>
        </div>
        {filteredPagination.length > 1 && <div className="mt-10">
          <ul className="pagination">
            <li>
              <a
                href={queryParameters.get("keyword") ? `/projects/energy?keyword=${queryParameters.get("keyword")}&page=1` : queryParameters.get("projectName") ? `/projects/energy?projectName=${queryParameters.get("projectName")}&page=1` : queryParameters.get("university") ? `/projects/energy?university=${queryParameters.get("university")}&page=1` :
                  queryParameters.get("association") ? `/projects/energy?association=${queryParameters.get("association")}&page=1` : queryParameters.get("start_year") ? `/projects/energy?start_year=${queryParameters.get("start_year")}&page=1` : queryParameters.get("end_year") ? `/projects/energy?end_year=${queryParameters.get("end_year")}&page=1` : queryParameters.get("investigator") ? `/projects/energy?investigator=${queryParameters.get("investigator")}&page=1`
                    : '/projects/energy?page=1'
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
                  href={queryParameters.get("keyword") ? `/projects/energy?keyword=${queryParameters.get("keyword")}&page=${page}` : queryParameters.get("projectName") ? `/projects/energy?projectName=${queryParameters.get("projectName")}&page=${page}` : queryParameters.get("university") ? `/projects/energy?university=${queryParameters.get("university")}&page=${page}` :
                    queryParameters.get("association") ? `/projects/energy?association=${queryParameters.get("association")}&page=${page}` : queryParameters.get("start_year") ? `/projects/energy?start_year=${queryParameters.get("start_year")}&page=${page}` : queryParameters.get("end_year") ? `/projects/energy?end_year=${queryParameters.get("end_year")}&page=${page}` : queryParameters.get("investigator") ? `/projects/energy?investigator=${queryParameters.get("investigator")}&page=${page}`
                      : `/projects/energy?page=${page}`
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
                    href={queryParameters.get("keyword") ? `/projects/energy?keyword=${queryParameters.get("keyword")}&page=${page}` : queryParameters.get("projectName") ? `/projects/energy?projectName=${queryParameters.get("projectName")}&page=${page}` : queryParameters.get("university") ? `/projects/energy?university=${queryParameters.get("university")}&page=${page}` :
                      queryParameters.get("association") ? `/projects/energy?association=${queryParameters.get("association")}&page=${page}` : queryParameters.get("start_year") ? `/projects/energy?start_year=${queryParameters.get("start_year")}&page=${page}` : queryParameters.get("end_year") ? `/projects/energy?end_year=${queryParameters.get("end_year")}&page=${page}` : queryParameters.get("investigator") ? `/projects/energy?investigator=${queryParameters.get("investigator")}&page=${page}`
                        : `/projects/energy?page=${page}`
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
                  href={queryParameters.get("keyword") ? `/projects/energy?keyword=${queryParameters.get("keyword")}&page=${page}` : queryParameters.get("projectName") ? `/projects/energy?projectName=${queryParameters.get("projectName")}&page=${page}` : queryParameters.get("university") ? `/projects/energy?university=${queryParameters.get("university")}&page=${page}` :
                    queryParameters.get("association") ? `/projects/energy?association=${queryParameters.get("association")}&page=${page}` : queryParameters.get("start_year") ? `/projects/energy?start_year=${queryParameters.get("start_year")}&page=${page}` : queryParameters.get("end_year") ? `/projects/energy?end_year=${queryParameters.get("end_year")}&page=${page}` : queryParameters.get("investigator") ? `/projects/energy?investigator=${queryParameters.get("investigator")}&page=${page}`
                      : `/projects/energy?page=${page}`
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
                href={queryParameters.get("keyword") ? `/projects/energy?keyword=${queryParameters.get("keyword")}&page=${projectsCount}` : queryParameters.get("projectName") ? `/projects/energy?projectName=${queryParameters.get("projectName")}&page=${projectsCount}` : queryParameters.get("university") ? `/projects/energy?university=${queryParameters.get("university")}&page=${projectsCount}` :
                  queryParameters.get("association") ? `/projects/energy?association=${queryParameters.get("association")}&page=${projectsCount}` : queryParameters.get("start_year") ? `/projects/energy?start_year=${queryParameters.get("start_year")}&page=${projectsCount}` : queryParameters.get("end_year") ? `/projects/energy?end_year=${queryParameters.get("end_year")}&page=${projectsCount}` : queryParameters.get("investigator") ? `/projects/energy?investigator=${queryParameters.get("investigator")}&page=${projectsCount}`
                    : `/projects/energy?page=${projectsCount}`
                }
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

export default Energy;
