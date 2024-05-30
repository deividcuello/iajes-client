import React from 'react'
import { FaUniversity } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { IoIosDocument } from "react-icons/io";
import { HiAcademicCap } from "react-icons/hi";
import { GiWorld } from "react-icons/gi";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ResourcesAdmin() {

  return (
    <section className='container mx-auto mt-5 px-5'>
        <div className='flex flex-wrap gap-2 [&>*]:bg-darkPrimary [&>*]:dark:bg-gray-950 [&>*]:rounded-xl [&>*]:p-2 [&>*]:flex [&>*]:flex-col [&>*]:items-center'>
            <Link to='programs'>
                <HiAcademicCap size={'2rem'}/>
                <span>Programs</span>
            </Link>
            <Link to='faculty'>
                <FaUniversity size={'2rem'}/>
                <span>Faculty</span>
            </Link>
            <Link to='videos'>
                <FaVideo size={'2rem'}/>
                <span>Videos</span>
            </Link>
            <Link to='documents'>
                <IoIosDocument size={'2rem'}/>
                <span>Documents</span>
            </Link>
            <Link to='regional-associations'>
                <GiWorld size={'2rem'}/>
                <span>Regional Associations</span>
            </Link>
        </div>
    </section>
  )
}

export default ResourcesAdmin