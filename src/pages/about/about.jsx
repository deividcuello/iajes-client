import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function About() {
  return (
    <section>
      <div>
        <div className="w-full h-[30rem] bg-[url('/media/images/about/hero.png')] bg-no-repeat bg-cover bg-center text-white flex items-center">
          <div className="container mx-auto px-5">
            <h1 className="text-4xl sm:text-[64px] max-w-[900px] leading-tight sm:leading-none">
              About Us
            </h1>
          </div>
        </div>
        <div className="container mx-auto px-2">
          <div className="mt-7">
            <h2 className="mb-4">What is IAJES?</h2>
            <p>One of the biggest challenges engineers face when addressing a community problem is how to relate with the community: how to define and explore the community s needs? How can we build collaborative solutions? How can we learn from their experiences? How to enhance community knowledge and avoid dependency? These are fundamental questions that, if addressed appropriately, will lead to sustainable, impactful and replicable projects.</p><br></br>
            <p>Engineer Jesuit Schools worldwide are not exempt from this reality. However, we as Jesuit institutions have a series of advantages for addressing community challenges: we are unified by our Jesuit values of social and environmental justice, we have a global presence, and we together have accumulated expertise and experiences to learn from.</p><br></br>
            <p className="font-semibold">The objective of the following  page is to build and facilitate the knowledge, experiences and information that can help Jesuit Engineering Schools worldwide to come together and learn from each other to have a bigger impact in the communities we serve.</p><br></br>
            <p>Learn more about IAJES at <a href="https://www.iajes.org/about iajes" className="underline text-blue-500">https://www.iajes.org/about iajes</a></p>
          </div>
          <div className="mt-7">
            <h2 className="mb-4">Task Forces</h2>
            <div className="flex flex-wrap gap-x-20 gap-y-20 justify-center">
              <div className="text-center w-52">
                <div className="h-52 w-52 bg-gray-200">
                  <img src="/media/images/about/task_forces/energy.jpg" alt="" className="w-full h-full object-cover"/>
                </div>
                <h4>Energy</h4>
              </div>
              <div className="text-center w-52">
                <div className="h-52 w-52 bg-gray-200">
                <img src="/media/images/about/task_forces/artificial_intelligence.jpg" alt="" className="w-full h-full object-cover"/>
                </div>
                <h4>Artificial Intelligence & Humanity</h4>
              </div>
              <div className="text-center w-52">
                <div className="h-52 w-52 bg-gray-200">
                <img src="/media/images/about/task_forces/social_justice.jpg" alt="" className="w-full h-full object-cover"/>
                </div>
                <h4>Engineering & Social Justice</h4>
              </div>
              <div className="text-center w-52">
                <div className="h-52 w-52 bg-gray-200">
                  <img src="/media/images/about/task_forces/healthcare.jpg" alt="" className="w-full h-full object-cover"/>
                </div>
                <h4>Healthcare</h4>
              </div>
              <div className="text-center w-52">
                <div className="h-52 w-52 bg-gray-200">
                <img src="/media/images/about/task_forces/infrastructure.jpg" alt="" className="w-full h-full object-cover"/>
                </div>
                <h4>Infrastructure</h4>
              </div>
              <div className="text-center w-52">
                <div className="h-52 w-52 bg-gray-200">
                <img src="/media/images/about/task_forces/spirituality.jpg" alt="" className="w-full h-full object-cover"/>
                </div>
                <h4>Engineering, Ethics, & Spirituality</h4>
              </div>
              <div className="text-center w-52">
                <div className="h-52 w-52 bg-gray-200">
                <img src="/media/images/about/task_forces/research.jpg" alt="" className="w-full h-full object-cover"/>
                </div>
                <h4>Research & Academic Cooperation</h4>
              </div>
            </div>
          </div>
          <div className="mt-7">
            <h2 className="mb-4">The Humanitarian Technology and Frugal Innovation Task Force</h2>
            <h3 className="text-gray-500">Who Are We?</h3>
            <p>The Humanitarian Technology and Frugal Innovation Task force is part of the task forces of the International Association of Jesuit Engineering Schools(IAJES). </p><br></br>
            <p><span className="font-seemibold">Our goal</span> is to facilitate the inspiration, collaboration, promotion, divulgation and support of humanitarian projects across Jesuits engineering schools to improve their impact and scope.</p>
            <p><span className="font-seemibold">Our vision</span>  is of a global and unified group of Jesuit engineering schools working together towards a common goal: the design, development and implementation of community technological products with the capability of changing lives
            </p><br></br>
            <p>We are planning to do so through the following specific activities:</p>
            {/* <ul className="list-disc [&>*]:whitespace-pre-wrap">
              <li>Develop and maintain a common digital space where projects on social and environmental justice worldwide are showcased with the goal of promoting and facilitating collaboration among Engineering Jesuit Universities.</li>
              <li>Create a digital space where to exchange courses content, academic exercises, workshops, labs, bibliography, etc related to technology for social and environmental justice for faculty members to utilize at their classrooms and in their community projects.Create a digital space where to exchange courses content, academic exercises, workshops, labs, bibliography, etc related to technology for social and environmental justice for faculty members to utilize at their classrooms and in their community projects.</li>
              <li>Create collaborative spaces on key topics related to social and environmental justice (such as water and sustainable energy) where faculty and students across Jesuit s engineering schools can share and discuss projects, experiences and technologies.</li>
              <li>Share information on conferences, white papers, documentaries, etc on social and environmental justice</li>
              <li>Facilitating strategic partnerships to support and/or fund humanitarian projects worldwide</li>
              <li>Promoting frameworks or problem solutions tools such as the Frugal Innovation framework and the Design Thinking Process as strategic tools to approach and design humanitarian projectsr</li>
              <li>Explore possibilities for collaborative teaching, including hybrid/online certificates.</li>
            </ul> */}
          </div>
          <div className="mt-4">
            <h2>Objectives</h2>
            <div className="flex justify-center items-center mt-5 text-white about__swiper">
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
                  640:{
                    slidesPerView:3,
                  },
                  768: {
                    slidesPerView: 5,
                  }
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
                <div className="bg-primary w-[10rem] mx-auto aspect-square rounded-full flex justify-center items-center">
                  <p className="text-xl">Develop</p>
                </div>
              </SwiperSlide>
              <SwiperSlide
              >
                <div className="bg-primary w-[10rem] mx-auto aspect-square rounded-full flex justify-center items-center">
                  <p className="text-xl">Create</p>
                </div>
              </SwiperSlide>
              <SwiperSlide
                >
                <div className="bg-primary w-[10rem] mx-auto aspect-square rounded-full flex justify-center items-center">
                  <p className="text-xl">Share</p>
                </div>
              </SwiperSlide>
              <SwiperSlide
              >
                <div className="bg-primary w-[10rem] mx-auto aspect-square rounded-full flex justify-center items-center">
                  <p className="text-xl">Facilitate</p>
                </div>
              </SwiperSlide>
              <SwiperSlide
                >
                <div className="bg-primary w-[10rem] mx-auto aspect-square rounded-full flex justify-center items-center">
                  <p className="text-xl">Promote</p>
                </div>
              </SwiperSlide>
              <SwiperSlide
              >
                <div className="bg-primary w-[10rem] mx-auto aspect-square rounded-full flex justify-center items-center">
                  <p className="text-xl">Explore</p>
                </div>
              </SwiperSlide>
              </Swiper>
            </div>
          </div>
          <div className="mt-7">
            <h2 className="mb-4">Coordinator Team</h2>
            <div className="flex flex-wrap gap-x-20 gap-y-20 justify-center">
              <div className="text-center w-fit">
                <div className="h-52 w-52 bg-gray-200">
                </div>
                <div>
                  <p>Name</p>
                  <p>University</p>
                  <p>Department</p>
                  <p>Email</p>
                </div>
              </div>
              <div className="text-center w-fit">
                <div className="h-52 w-52 bg-gray-200">
                </div>
                <div>
                  <p>Name</p>
                  <p>University</p>
                  <p>Department</p>
                  <p>Email</p>
                </div>
              </div>
              <div className="text-center w-fit">
                <div className="h-52 w-52 bg-gray-200">
                </div>
                <div>
                  <p>Name</p>
                  <p>University</p>
                  <p>Department</p>
                  <p>Email</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-7">
            <h2 className="mb-4">Student Developers</h2>
            <div className="flex flex-wrap gap-x-20 gap-y-20 justify-center">
              <div className="text-center w-fit">
                <div className="h-52 w-52 bg-gray-200">
                </div>
                <h4>Name</h4>
              </div>
              <div className="text-center w-fit">
                <div className="h-52 w-52 bg-gray-200">
                </div>
                <h4>Name</h4>
              </div>
              <div className="text-center w-fit">
                <div className="h-52 w-52 bg-gray-200">
                </div>
                <h4>Name</h4>
              </div>
              <div className="text-center w-fit">
                <div className="h-52 w-52 bg-gray-200">
                </div>
                <h4>Name</h4>
              </div>
              <div className="text-center w-fit">
                <div className="h-52 w-52 bg-gray-200">
                </div>
                <h4>Name</h4>
              </div>
              <div className="text-center w-fit">
                <div className="h-52 w-52 bg-gray-200">
                </div>
                <h4>Name</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
