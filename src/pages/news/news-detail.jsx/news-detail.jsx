import React, { useEffect, useState } from "react";
import Parser from "html-react-parser";
import { useParams } from "react-router-dom";
import { getNews } from "../../../api";

function NewsDetail() {
  const urlPathname = window.location.pathname.split('/')
  let { news_title } = useParams();
  const [news, setNews] = useState({})

  useEffect(() => {
    async function loadNews() {
      const res = await getNews({ slug: news_title })
      setNews(res.data)
    }

    loadNews()
  }, [])

  return (
    <section className="container mx-auto mt-10">
      <div className="w-3/4">
        <div>
          <h1>
            {news.title}
          </h1>
        </div>
        <div>
          <div className="w-[550px] h-[300px]">
            <img src={`https://deividcuello.pythonanywhere.com${news.image_url}`} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="mt-5">{Parser(`${news.description}`)}</div>
      </div>
    </section>
  );
}

export default NewsDetail;
