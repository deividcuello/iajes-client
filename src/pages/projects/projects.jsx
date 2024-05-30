import React from 'react'
import { Link } from 'react-router-dom'

function Projects() {
    return (
        <section>
            <div>
                <div className="w-full h-[30rem] bg-[url('/media/images/projects/hero.png')] bg-no-repeat bg-cover bg-center text-white flex items-center">
                    <div className="container mx-auto px-5">
                        <h1 className="text-4xl sm:text-[64px] max-w-[900px] leading-tight sm:leading-none">
                            Projects
                        </h1>
                    </div>
                </div>
                <div className="mt-5">
                    <h2 className='container mx-auto px-5'>Regional Associations</h2>
                    <div className='text-white flex flex-col sm:flex-row  gap-2 sm:gap-0 flex-wrap items-center justify-center [&>*]:bg-[#C8A1A1] [&>*]:aspect-square [&>*]:rounded-full [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:border-4 [&>*]:sm:w-1/6 [&>*]:w-1/3 [&>*]:border-[#AE4D4D] sm:translate-x-[125px]'>
                        <div className='hover:z-30'>
                            <h3 className='text-xl sm:text-sm md:text-2xl'>KIRCHER</h3>
                        </div>
                        <div className='sm:-translate-x-[50px] sm:hover:z-30'>
                            <h3 className='text-xl sm:text-sm md:text-2xl'>JHEASA</h3>
                        </div>
                        <div className='sm:-translate-x-[100px] sm:hover:z-30'>
                            <h3 className='text-xl sm:text-sm md:text-2xl'>AUSJAL</h3>
                        </div>
                        <div className='sm:-translate-x-[150px] sm:hover:z-30'>
                            <h3 className='text-xl sm:text-sm md:text-2xl'>AJCU-API</h3>
                        </div>
                        <div className='sm:-translate-x-[200px] sm:hover:z-30'>
                            <h3 className='text-xl sm:text-sm md:text-2xl'>AJCU-AM</h3>
                        </div>
                        <div className='sm:-translate-x-[250px] sm:hover:z-30'>
                            <h3 className='text-xl sm:text-sm md:text-2xl'>AJCU</h3>
                        </div>
                    </div>
                </div>
                {/* <div className='mb-10 sm:mb-44 container mx-auto px-5'>
            <div className='container mx-auto px-5 mt-10 sm:mt-60'>
                <div>
                    <h1 className='text-center block sm:hidden text-[38px] mb-2'>Purpose</h1>
                </div>
                <div className='flex justify-center flex-col sm:flex-row items-center gap-10'>
                    <Link to='energy' className=' flex flex-col-reverse sm:flex-col'>
                        <h4 className='text-[25px] text-center mb-5'>Energy</h4>
                        <img src="/media/images/homepage/purpose1.png" alt="" />
                    </Link>
                    <Link to='water' className='relative sm:-top-32 flex flex-col-reverse sm:flex-col'>
                        <h4 className='text-[25px] text-center mb-5'>Water</h4>
                        <img src="/media/images/homepage/purpose2.png" alt=""/>
                    </Link>
                    <Link to='health' className=' flex flex-col-reverse sm:flex-col'>
                        <h4 className='text-[25px] text-center mb-5'>Health</h4>
                        <img src="/media/images/homepage/purpose3.png" alt="" />
                    </Link>
                </div>
                <div>
                    <h1 className='text-center hidden sm:block text-[38px]'>Purpose</h1>
                </div>
                <div className='flex justify-center flex-col sm:flex-row items-center gap-10 mt-10 sm:mt-0'>
                    <Link to='education'>
                        <img src="/media/images/homepage/purpose4.png" alt="" />
                        <h4 className='text-[25px] text-center mt-5'>Education</h4>
                    </Link>
                    <Link to='sustainable-construction' className='relative sm:-bottom-32'>
                        <img src="/media/images/homepage/purpose5.png" alt=""/>
                        <h4 className='text-[25px] text-center mt-5'>Sustainable<br></br>Construction</h4>
                    </Link>
                    <Link to='farming'>
                        <img src="/media/images/homepage/purpose6.png" alt="" />
                        <h4 className='text-[25px] text-center mt-5'>Farming</h4>
                    </Link>
                </div>
            </div>
        </div> */}
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
                        <div className='flex  justify-between flex-wrap flex-col sm:flex-row items-center gap-10 mt-20 md:px-16'>
                        </div>
                    </div>
                </div>
                <div className='container mx-auto px-5'>
                    <div className="bg-primary p-5">
                        <h3>Task Forces</h3>
                        <p className='text-xl'>Learn more about IAJES at <a href="https://www.iajes.org/about-iajes" target='_blank'>https://www.iajes.org/about-iajes</a></p>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mt-5 px-28 sm:px-16'>
                            <div>
                                <div className='w-full bg-gray-200 aspect-square'>
                                </div>
                                <p className='text-lg text-center'>Energy</p>
                            </div>
                            <div>
                                <div className='w-full bg-gray-200 aspect-square'>
                                </div>
                                <p className='text-lg text-center'>Artificial Intelligence & Humanity</p>
                            </div>
                            <div>
                                <div className='w-full bg-gray-200 aspect-square'>
                                </div>
                                <p className='text-lg text-center'>Engineering & Social Justice</p>
                            </div>
                            <div>
                                <div className='w-full bg-gray-200 aspect-square'>
                                </div>
                                <p className='text-lg text-center'>Healthcare</p>
                            </div>
                            <div>
                                <div className='w-full bg-gray-200 aspect-square'>
                                </div>
                                <p className='text-lg text-center'>Infrastructure</p>
                            </div>
                            <div>
                                <div className='w-full bg-gray-200 aspect-square'>
                                </div>
                                <p className='text-lg text-center'>Engineering, Ethics, & Spirituality</p>
                            </div>
                            <div>
                                <div className='w-full bg-gray-200 aspect-square'>
                                </div>
                                <p className='text-lg text-center'>Research & Academic Cooperation</p>
                            </div>
                            <div>
                                <div className='w-full bg-gray-200 aspect-square'>
                                </div>
                                <p className='text-lg text-center'>Humanitarian Engineering</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Projects