import React from "react";
import { FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { getAllDocs } from "../../../api";
import { useSearchParams } from "react-router-dom";

function Documents() {

    const [docs, setDocs] = useState([])

    const [queryParameters] = useSearchParams();
    const [selectFilter, setSelectFilter] = useState("docTitle");
    const [textFilter, setTextFilter] = useState('');
    const [textSearchFilter, setTextSearchFilter] = useState('');
    const [isFilter, setIsFilter] = useState(false);
    const [page, setPage] = useState('1');
    const baseDocUrl = 'http://localhost:5173/resources/documents/'


    useEffect(() => {
        async function loadAllDocs() {
            const docTitle = queryParameters.get("docTitle");

            let res = [{ data: "" }];
            if (docTitle != null) {
                res = await getAllDocs({ docTitle: docTitle, isAdmin: false });
            }
            else if (docTitle == null) {
                res = await getAllDocs({ page: page, isAdmin: false });
            }
            setDocs(res.data.docs)
        }
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
                            className="cursor-pointer"
                        >
                            <a href="/resources/videos">Videos</a>

                        </li>
                        <li
                            className="font-semibold border-b border-black dark:border-white cursor-pointer"
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
                                            <option value="docTitle">Title</option>
                                        </select>
                                        <input type="submit" value='Apply' className="bg-white p-2 w-fit self-end cursor-pointer" />
                                    </div>
                                </form>}
                            </div>
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
                </div>
            </div>
        </section>
    );
}

export default Documents;
