import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { sendEmail, getAllProjects } from '../../api';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function Homepage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [university, setUniversity] = useState('');
    const [emailText, setEmailText] = useState('');
    const [projects, setProjects] = useState([])


    useEffect(() => {
        async function loadProjects() {
            const res = await getAllProjects({ isAdmin: false, page: 1 })
            setProjects(res.data.projects)
        }

        loadProjects()
    }, [])

    const toTitleCase = (phrase) => {
        return phrase
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    async function sendEmailFunc(e) {
        e.preventDefault()
        if (!name.trim() || !emailText.trim() || !university.trim() || !email.trim()) {
            return toast.error("Fill all fields", {
                position: "top-center",
            })
        }
        const res = await sendEmail({ subject: `${toTitleCase(name.trim())} Message sent a message`, recipientList: 'sdgde.official@gmail.com', text: `Name: ${name}, Email ${email}, University ${university}. Message: ${emailText}`, code: Math.floor(1000 + Math.random() * 9000) })

        toast.success("Email sent", {
            position: "top-center",
        })

        setName('')
        setEmail('')
        setUniversity('')
        setEmailText('')
    }

    return (
        <section className='homepage'>
            <div className='hero'>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    pagination={{
                        clickable: true,
                    }}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper"
                >
                    <SwiperSlide
                    >
                        <div className={`w-full h-[calc(100vh-76px)] bg-no-repeat bg-cover bg-center bg-[url('/media/images/homepage/hero.png')] text-white flex items-center`}>
                            <div className='container mx-auto px-5 '>
                                <h1 className='text-4xl sm:text-[64px] max-w-[900px] leading-tight sm:leading-none'>Humanitarian Technology & Frugal Innovation</h1>
                                <p className='text-xl sm:text-[40px] mt-7 md:mt-14'>An IAJES Task Force</p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <div className={`w-full h-[calc(100vh-76px)] bg-no-repeat bg-cover bg-center bg-[url('/media/images/homepage/hero1.png')] text-white dark:text-white flex items-center`}>
                            <div className='container mx-auto px-5'>
                                <h1 className='text-4xl sm:text-[64px] max-w-[900px] leading-tight sm:leading-none'>Humanitarian Technology & Frugal Innovation</h1>
                                <p className='text-xl sm:text-[40px] mt-7 md:mt-14'>An IAJES Task Force</p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <div className={`w-full h-[calc(100vh-76px)] bg-no-repeat bg-cover bg-center bg-[url('/media/images/homepage/hero2.png')] text-white dark:text-white flex items-center`}>
                            <div className='container mx-auto px-5'>
                                <h1 className='text-4xl sm:text-[64px] max-w-[900px] leading-tight sm:leading-none'>Humanitarian Technology & Frugal Innovation</h1>
                                <p className='text-xl sm:text-[40px] mt-7 md:mt-14'>An IAJES Task Force</p>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <div className={`w-full h-[calc(100vh-76px)] bg-no-repeat bg-cover bg-center bg-[url('/media/images/homepage/hero3.png')] text-white dark:text-white flex items-center`}>
                            <div className='container mx-auto px-5'>
                                <h1 className='text-4xl sm:text-[64px] max-w-[900px] leading-tight sm:leading-none'>Humanitarian Technology & Frugal Innovation</h1>
                                <p className='text-xl sm:text-[40px] mt-7 md:mt-14'>An IAJES Task Force</p>
                            </div>
                        </div>
                    </SwiperSlide>

                </Swiper>
            </div>
            <div className='container mx-auto mt-10 font-normal px-5'>
                <p>At our Task Force, we are more than just engineers; We are architects of innovation, builders of dreams, and creators of solutions. With a relentless commitment to excellence, we navigate the complexities of the modern world with a blend of expertise, creativity, and cutting edge technology.</p><br></br>
                <p>At the heart of our approach is a dedication to sustainability, efficiency, and forward-thinking design. We take pride in fostering a collaborative environment that encourages ingenuity, values diversity, and embraces the spirit of continuous improvement.</p><br></br>
                <p>As we embark on each project we do so with a sense of purpose – to make a positive impact on the world through transformative engineering. Join us on this journey of innovation, where we shape the future through the power of engineering expertise and unwavering dedication to excellence.</p>
            </div>
            <div className='mx-auto mt-10 container px-5'>
                <h2 className='mb-2'>Social Justice Engineering Projects Worldwide</h2>
                {projects.length == 0 && <h1 className='text-center mt-20 mb-20'>Nothing to see here</h1>}
                {projects.length <= 3 && projects.length > 0 && <div className='mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center [&>*]:min-h-[30rem] [&>*]:pb-10 [&>*]:bg-gray-200 [&>*]:dark:bg-gray-900'>
                    {projects.map((project, index) => (
                        <div key={index} className='w-5/6 mx-auto relative h-[33rem] bg-gray-200 dark:bg-gray-900'>
                            <div>

                                <div className='w-full h-[15rem]'>
                                    <img src={`https://deividcuello.pythonanywhere.com${project.image_url}`} alt="" className='w-full h-full object-cover' />
                                </div>
                                <div className='px-4 py-4 h-[14.3rem] overflow-y-auto'>
                                    <div>
                                        <h4>{project.title}</h4>
                                        <p>{project.summary.slice(0, 100)}</p>
                                    </div>
                                    <div className='absolute bottom-4'>
                                        <a href={`projects/${project.industry == 'sustainable_construction' ? 'sustainable-construction' : project.industry
                                            }/${project.slug}`} className='bg-primary p-1 text-white'>Learn More</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>}
                {projects.length > 3 &&
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
                            projects.slice(0, 6).map((project, index) => (
                                <div key={index}>
                                    <SwiperSlide
                                        className="cursor-pointer"
                                    >
                                        <div className='w-5/6 mx-auto relative h-[33rem] bg-gray-200 dark:bg-gray-900'>
                                            <div>

                                                <div className='w-full h-[15rem]'>
                                                    <img src={`https://deividcuello.pythonanywhere.com${project.image_url}`} alt="" className='w-full h-full object-cover' />
                                                </div>
                                                <div className='px-4 py-4 h-[14.3rem] overflow-y-auto'>
                                                    <div>
                                                        <h4>{project.title}</h4>
                                                        <p>{project.summary.slice(0, 100)}</p>
                                                    </div>
                                                    <div className='absolute bottom-4'>
                                                        <a href={`projects/${project.industry == 'sustainable_construction' ? 'sustainable-construction' : project.industry
                                                            }/${project.slug}`} className='bg-primary p-1 text-white'>Learn More</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                </div>
                            ))
                        }
                    </Swiper>}
            </div>
            <div className='container mx-auto px-5'>
                <div className='container mx-auto px-5 mt-10'>
                    <div>
                        <h2 className='mb-2'>Project Purposes</h2>
                    </div>
                    <div className='grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 sm:gap-5 md:px-16'>
                        <Link to='/projects/energy' className='flex flex-col items-center justify-start'>
                            <img src="/media/images/homepage/purpose1.png" alt="" />
                            <h4 className='text-[25px] text-center mb-5'>Energy</h4>
                        </Link>
                        <Link to='/projects/water' className='flex flex-col items-center justify-start'>
                            <img src="/media/images/homepage/purpose2.png" alt="" />
                            <h4 className='text-[25px] text-center mb-5'>Water</h4>
                        </Link>
                        <Link to='/projects/Health' className=' flex flex-col items-center justify-start'>
                            <img src="/media/images/homepage/purpose3.png" alt="" />
                            <h4 className='text-[25px] text-center mb-5'>Health</h4>
                        </Link>
                        <Link to='/projects/education' className=' flex flex-col items-center justify-start'>
                            <img src="/media/images/homepage/purpose4.png" alt="" />
                            <h4 className='text-[25px] text-center mt-5'>Education</h4>
                        </Link>
                        <Link to='/projects/sustainable-construction' className=' flex flex-col items-center justify-start'>
                            <img src="/media/images/homepage/purpose5.png" alt="" />
                            <h4 className='text-[25px] text-center mt-5'>Sustainable<br></br>Construction</h4>
                        </Link>
                        <Link to='/projects/farming' className=' flex flex-col items-center justify-start'>
                            <img src="/media/images/homepage/purpose6.png" alt="" />
                            <h4 className='text-[25px] text-center mt-5'>Farming</h4>
                        </Link>
                    </div>
                    <div className='flex justify-between flex-wrap flex-col sm:flex-row items-center gap-10 mt-20 md:px-16'>
                    </div>
                </div>
            </div>
            <div>
                <div className='container mx-auto px-5'>
                    <h2>Project Location Map</h2>
                </div>
                <div className='w-full'>
                    <img src="/media/images/homepage/locations.png" alt="" className='w-full h-full object-cover' />
                </div>
            </div>
            <div className="bg-[url('/media/images/homepage/hero.png')] mt-20 text-white py-10 px-5">
                <div className='container mx-auto'>
                    <h2 className="text-[38px] relative after:content-[''] inline-block after:absolute after:h-1 after:w-[calc(100%+20rem)] after:bottom-0 after:bg-white after:left-0">Contact Us</h2>
                    <form onSubmit={(e) => sendEmailFunc(e)} className='mt-5 flex flex-col gap-3'>
                        <div className='flex'>
                            <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} value={name} className='bg-white/50 placeholder-white text-white p-2 w-full md:w-[40rem] focus:outline-none' />
                        </div>
                        <div className='flex'>
                            <input type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} className='bg-white/50 placeholder-white text-white p-2 w-full md:w-[40rem] focus:outline-none' />
                        </div>
                        <div className='flex'>
                            <input type="text" placeholder='University/Department' onChange={(e) => setUniversity(e.target.value)} value={university} className='bg-white/50 placeholder-white text-white p-2 w-full md:w-[45rem] focus:outline-none' />
                        </div>
                        <div className='flex'>
                            <textarea placeholder='Your message' onChange={(e) => setEmailText(e.target.value)} value={emailText} className='bg-white/50 placeholder-white text-white p-2 w-full md:w-[45rem] rounded-none h-44 focus:outline-none'></textarea>
                        </div>
                        <div>
                            <input type="submit" value='Send' className='bg-primary py-1 px-8 cursor-pointer' />
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </section>
    )
}

export default Homepage