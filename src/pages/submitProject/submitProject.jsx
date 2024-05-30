import React from 'react'
import { useState, useEffect } from 'react'
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkLogin, getProject } from '../../api';
import { Link, useSearchParams } from 'react-router-dom';

function SubmitProject() {
    const [queryParameters] = useSearchParams();
    const [title, setTitle] = useState('')
    const [college, setCollege] = useState('')
    const [investigator, setInvestigator] = useState('')
    const [region, setRegion] = useState('kircher')
    const [isWorking, setIsWorking] = useState(false)
    const [startYear, setStartYear] = useState('2016')
    const [endYear, setEndYear] = useState('2017')
    const [keywords, setKeywords] = useState([])
    const [partnerOrganization, setPartnerOrganization] = useState('')
    const [summary, setSummary] = useState('')
    const [industry, setIndustry] = useState('energy')
    const [keyword, setKeyword] = useState('')
    const [email, setEmail] = useState('')
    const [action, setAction] = useState({ create: true, edit: false })
    const [userId, setUserId] = useState('');

    useEffect(() => {
        async function isLogged() {
            let res1 = {}
            try {
                res1 = await checkLogin()
                setUserId(res1.data.user.id)

            } catch (error) {
                window.location.href = '/login'
            }
            try {
                const slugParam = queryParameters.get("slug");
                const res = await getProject({ slug: slugParam })

                if (slugParam && res.data.approved == false && res.data.user == res1.data.user.id) {

                    setAction({ create: false, edit: true })
                    const imageInput = document.querySelector("#imageInput");
                    let list = new DataTransfer();
                    let file = new File(["content"], `https://deividcuello.pythonanywhere.com${res.data.image_url}`);
                    list.items.add(file);
                    let myFileList = list.files;
                    imageInput.files = myFileList;

                    let formData = new FormData();
                    setTitle(res.data.title)
                    setCollege(res.data.college)
                    setIndustry(res.data.industry)
                    setInvestigator(res.data.investigator)
                    setRegion(res.data.region)
                    setSummary(res.data.summary)
                    setEmail(res.data.email)
                    setPartnerOrganization(res.data.partner_organization)
                    setStartYear(res.data.start_year)
                    setEndYear(res.data.end_year)
                    setIsWorking(res.data.isWorking)
                    setKeywords(res.data.keywords.split(", "))
                } else {
                    console.log()
                }



            } catch (error) {
                console.log(error)
            }

        }

        isLogged()
    }, [])

    function checkEmail() {
        if (!email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
            return false
        } else {
            return true
        }
    }

    const createProject = async (event) => {
        event.preventDefault();
        const imageInput = document.querySelector("#imageInput");
        let image = imageInput.files[0];
        let formData = new FormData();
        formData.append("hidden", true);
        formData.append("image_url", image);
        formData.append("published_date", "any");
        formData.append("title", title);
        formData.append("college", college);
        formData.append("industry", industry);
        formData.append("investigator", investigator);
        formData.append("region", region);
        formData.append("summary", summary);
        formData.append("approved", false);
        formData.append("email", email);
        formData.append("partner_organization", partnerOrganization);
        formData.append("start_year", startYear);
        formData.append("end_year", endYear);
        formData.append("isWorking", isWorking);
        formData.append("keywords", keywords.join(', '))
        formData.append("user", userId);

        if (title.length == 0) {
            return toast.error("Add a title", {
                position: "top-center",
            })
        } else if (!image) {
            return toast.error("Add an image", {
                position: "top-center",
            })
        } else if (keywords.length == 0) {
            return toast.error("Add keywords", {
                position: "top-center",
            })
        } else if (partnerOrganization.length == 0) {
            return toast.error("Add a partner organization", {
                position: "top-center",
            })
        } else if (college.length == 0) {
            return toast.error("Add a college", {
                position: "top-center",
            })
        } else if (!industry) {
            return toast.error("Add an industry", {
                position: "top-center",
            })
        } else if (investigator.length == 0) {
            return toast.error("Add an investigator", {
                position: "top-center",
            })
        } else if (partnerOrganization.length == 0) {
            return toast.error("Add a partner organization", {
                position: "top-center",
            })
        } else if (region.length == 0) {
            return toast.error("Add a region", {
                position: "top-center",
            })
        } else if (summary.length == 0) {
            return toast.error("Add a summary", {
                position: "top-center",
            })
        } else if (email.length == 0) {
            return toast.error("Add an email", {
                position: "top-center",
            })
        } else if (!checkEmail()) {
            return toast.error("Invalid email ", {
                position: "top-center",
            })
        }

        if (action.create) {

            fetch('https://deividcuello.pythonanywhere.com/api/projects/', {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "POST",
                body: formData,
            })
                .then((res) => res.ok ? window.location.reload(false) : toast.error("An error occurred. There may be a url conflict, try changing the project name or uploading the project another day or uploading other image", {
                    position: "top-center",
                })
                )
                .catch((error) =>
                    toast.error("An error occurred. There may be a url conflict, try changing the project name or uploading the project another day or uploading other image", {
                        position: "top-center",
                    })
                );
        }
        else if (action.edit) {
            formData.append("isImageUrl", imageInput.files[0].name);
            // formData.append("published_date", new Date().toISOString().split('T')[0]);

            fetch(`https://deividcuello.pythonanywhere.com/api/projects/${queryParameters.get("slug")}/`, {
                credentials: "include",
                headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                method: "PUT",
                body: formData,
            })
                .then((res) => window.location.href = '/my-projects'
                )
                .catch((error) =>
                    console.log(error)
                );
        }
    };

    function addKeywork() {
        if (keyword.replace(/\s+/g, ' ').trim() == '') {
            return
        }
        setKeywords([
            ...keywords,
            keyword
        ]);
        setKeyword('')
    }

    function removeKeyword(index) {
        setKeywords(
            keywords.filter((item, idx) =>
                idx != index
            )
        );
    }

    return (
        <section className='min-h-screen'>
            {userId && <div className="py-10 px-5">
                <div className='container mx-auto'>
                    <div><Link to='/my-projects' className='bg-primary text-white py-1 px-2'>My projects</Link></div>
                    <h2 className="text-[38px] relative after:content-[''] inline-block after:absolute after:h-1 after:w-[calc(100%+20rem)] after:bottom-0 after:bg-white after:left-0">New Project</h2>
                    <form onSubmit={(e) => createProject(e)} className='mt-5 flex flex-col gap-3'>
                        <div className='flex'>
                            <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Name of Project' className='bg-gray-200 p-2 w-full md:w-[45rem] focus:outline-none dark:!bg-gray-900' />
                        </div>
                        <div className="flex !flex-row gap-2 items-center">
                            <input
                                type="checkbox"
                                id="admin"
                                checked={isWorking}
                                onChange={(e) => setIsWorking(!isWorking)}
                            />
                            <label htmlFor="admin">Currently working on</label>
                        </div>
                        <div className='flex gap-2'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="">Start year</label>
                                <input onChange={(e) => setStartYear(e.target.value)} value={startYear} type="number" min="1900" max="2099" step="1" placeholder='Start year' className='bg-gray-200 p-2 w-full md:w-[8rem] focus:outline-none dark:!bg-gray-900' />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="">End year</label>
                                <input onChange={(e) => setEndYear(e.target.value)} value={endYear} type="number" min="1900" max="2099" step="1" placeholder='End year' className='bg-gray-200 p-2 w-full md:w-[8rem] focus:outline-none dark:!bg-gray-900' />
                            </div>
                        </div>
                        <div className='flex'>
                            <input onChange={(e) => setCollege(e.target.value)} value={college} type="text" placeholder='University' className='bg-gray-200 p-2 w-full md:w-[45rem] focus:outline-none dark:!bg-gray-900' />
                        </div>
                        <div className='flex'>
                            <input onChange={(e) => setInvestigator(e.target.value)} value={investigator} type="text" placeholder='Principal Investigator/Faculty Member' className='bg-gray-200 p-2 w-full md:w-[45rem] focus:outline-none dark:!bg-gray-900' />
                        </div>
                        <div className='flex'>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder='Investigator email' className='bg-gray-200 p-2 w-full md:w-[45rem] focus:outline-none dark:!bg-gray-900' />
                        </div>
                        <div className='flex'>
                            <div>
                                <input onChange={(e) => setKeyword(e.target.value)} value={keyword} type="text" placeholder='Add Keyword' className='bg-gray-200 p-2 w-full sm:w-[30rem] focus:outline-none dark:!bg-gray-900' />
                                <button onClick={addKeywork} type="button" className='bg-blue-500 py-1 font-semibold px-2 mt-4 sm:mt-0 sm:ml-5'>Add</button>
                                <ul className='flex gap-2'>
                                    {keywords.map((item, index) => {
                                        return <li key={index} className='flex gap-1'>
                                            <div className='bg-gray-200 dark:bg-gray-900 px-2'>
                                                {item}
                                            </div>
                                            <button type='button' onClick={() => removeKeyword(index)} className='bg-red-500 w-6 font-semibold text-white text-sm aspect-square rounded-full'>X</button>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className='flex'>
                            <input onChange={(e) => setPartnerOrganization(e.target.value)} value={partnerOrganization} type="text" placeholder='Partner Organization' className='bg-gray-200 p-2 w-full md:w-[45rem] focus:outline-none dark:!bg-gray-900' />
                        </div>
                        <div className='flex'>
                            <textarea onChange={(e) => setSummary(e.target.value)} value={summary} placeholder='Executive Summary' className='bg-gray-200 p-2 w-full md:w-[45rem] rounded-none h-44 focus:outline-none dark:!bg-gray-900'></textarea>
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="">Image</label>
                            <input type="file" id='imageInput' accept="image/*" className=' p-2 w-full md:w-[45rem] rounded-none focus:outline-none' />
                        </div>
                        <div className='flex flex-col'>
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
                        <div className='flex flex-col'>
                            <label htmlFor="">Industry</label>
                            <select
                                name="industry"
                                id="industry"
                                className="focus:outline-none dark:bg-gray-950 w-fit"
                                onChange={(e) => setIndustry(e.target.value)}
                                value={industry}
                            >
                                <option value="energy">Energy</option>
                                <option value="water">Water</option>
                                <option value="health">Health</option>
                                <option value="education">Education</option>
                                <option value="sustainable_construction">Sustainable Construction</option>
                                <option value="farming">Farming</option>
                            </select>
                        </div>
                        <div>
                            <input type="submit" value='Submit for Review' className='bg-primary text-white cursor-pointer py-1 px-8' />
                        </div>
                    </form>
                </div>
            </div>}
            <ToastContainer />
        </section>
    )
}

export default SubmitProject