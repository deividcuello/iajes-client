import React from "react";
import { useState, useEffect } from "react";
import Parser from "html-react-parser";
import { getAllNews } from "../../api";
import { MdKeyboardDoubleArrowLeft, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowRight } from 'react-icons/md'
import { pagination } from "../../utils/constants";
import { useSearchParams } from 'react-router-dom';

function News() {
  const [queryParameters] = useSearchParams();
  const [page, setPage] = useState(queryParameters.get("page") ? queryParameters.get("page") : 1);
  const [filteredPagination, setFilteredPagination] = useState([]);
  const [newsCount, setNewsCount] = useState([]);
  const [news, setNews] = useState([])

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
      console.log(err)
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
      const res = await getAllNews({ isAdmin: false, page: page })
      setNews(res.data.news)

      setNewsCount(
        isInt(res.data.count / pagination.SIZE)
          ? Math.floor(res.data.count / pagination.SIZE)
          : Math.floor(res.data.count / pagination.SIZE) + 1
      );
    }

    loadNews()
  }, [])

  return (
    <section>
      {news.length > 0 && <div className="container mx-auto mt-10 px-5 min-h-[calc(100vh-101.36px-65.14px)]">
        <div>
          <h1 className="text-4xl sm:text-[50px] max-w-[900px] leading-tight sm:leading-none">
            News
          </h1>
        </div>
        {
          news.map((item, index) => (
            <div key={index} className="w-fit flex flex-col md:flex-row gap-5 mt-5">
              <div>
                <p className="text-2xl border-b border-black pb-2 mb-2">
                  {new Date(item.created_at).toLocaleDateString("en-US")}
                </p>
                <div className=" w-[346px] h-[220px]">
                  <img src={`https://deividcuello.pythonanywhere.com${item.image_url}`} alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:mt-[37.19px]">
                <h2>{item.title}</h2>
                <div>
                  <p
                    className="inline"
                    dangerouslySetInnerHTML={{
                      __html: item.description
                        .replace(/(<([^>]+)>)/gi, "")
                        .substring(0, 300),
                    }}
                  ></p><span> </span>
                  <a href={`/news/${item.slug}`} className="text-blue-500 underline">Read more</a>
                </div>
              </div>
            </div>
          ))
        }
        {/* {NEWSINFO.map((item, index) => {
          return (
            <div className="w-fit flex flex-col md:flex-row gap-5 mt-5">
              <div>
                <p className="text-2xl border-b border-black pb-2 mb-2">
                  {item.date}
                </p>
                <div className="bg-gray-200 w-[346px] h-[220px]"></div>
              </div>
              <div className="md:mt-[37.19px]">
                <h2>{item.headline}</h2>
                <div>
                  <p
                    className="inline"
                    dangerouslySetInnerHTML={{
                      __html: item.description
                        .replace(/(<([^>]+)>)/gi, "")
                        .substring(0, 300),
                    }}
                  ></p>
                  <a href={`/news/${item.id}/${item.headline}`} className="text-blue-500 underline">Read more</a>
                </div>
              </div>
            </div>
          );
        })} */}
      </div>}
      {news.length == 0 && <div className="container mx-auto mt-10 px-5 min-h-[calc(100vh-101.36px-65.14px)] flex items-center justify-center">
        <h1>Nothing to see here</h1>
      </div>}
      {filteredPagination.length > 1 && <div className="mt-10">
        <ul className="pagination">
          <li>
            <a
              href={`/news`}
              onClick={() => updatePage("subtract")}
              className="!p-0"
            >
              <MdKeyboardDoubleArrowLeft />
            </a>
          </li>
          <li>
            {
              <a
                href={queryParameters.get(
                  "page") ? `/news?page=${page}` : `/news?page=${newsCount}`}
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
                  href={`/news?page=${item}`}
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
                href={`/news?page=${page}`}
                onClick={() => updatePage("sum")}
                className="!p-0"
              >
                <MdKeyboardArrowRight />
              </a>
            }
          </li>
          <li>
            <a
              href={`/news?page=${newsCount}`}
              onClick={() => updatePage("subtract")}
              className="!p-0"
            >
              <MdKeyboardDoubleArrowRight />
            </a>
          </li>
        </ul>
      </div>}
    </section>
  );
}

export default News;
