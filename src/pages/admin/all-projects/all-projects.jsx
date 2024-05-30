import React from 'react'
import { FaProjectDiagram } from "react-icons/fa";
import { MdOutlinePendingActions } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function AllProjectsAdmin() {

  return (
    <section className='container mx-auto mt-5 px-5'>
      <div className='flex flex-wrap gap-2 [&>*]:bg-darkPrimary [&>*]:dark:bg-gray-950 [&>*]:rounded-xl [&>*]:p-2 [&>*]:flex [&>*]:flex-col [&>*]:items-center'>
        <Link to='approved'>
          <FaProjectDiagram size={'2rem'} />
          <span>Projects</span>
        </Link>
        <Link to='pendings'>
          <MdOutlinePendingActions size={'2rem'} />
          <span>Pendings</span>
        </Link>
      </div>
    </section>
  )
}

export default AllProjectsAdmin