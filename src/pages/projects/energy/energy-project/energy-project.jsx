import React from 'react'
import { useState, useEffect } from 'react'
import NotFound from '../../../not-found/not-found'
import { getProject } from '../../../../api'
import { useParams } from "react-router-dom";

function EnergyProject() {
  const urlPathname = window.location.pathname.split('/')
  const whichProject = urlPathname[urlPathname.length - 1]
  let { project_name } = useParams();
  const [projectData, setProjectData] = useState({})

  useEffect(() => {
    async function loadAllProject() {
      const res = await getProject({ slug: project_name })
      setProjectData(res.data)
    }

    loadAllProject()
  }, [])

  return (
    <section className='container mx-auto px-5'>
      {(Object.keys(projectData).length != 0 && !projectData.hidden) && <div>
        <div>
          <h1>{projectData.title}</h1>
          <p className='text-2xl'>{new Date(projectData.created_at).toLocaleDateString("en-US")}</p>
        </div>
        <div className='mt-5 md:flex items-start justify-start gap-16'>
          <div className='min-w-0 w-full items-start justify-start md:w-[30rem] shrink-0'>
            <img src={`https://deividcuello.pythonanywhere.com${projectData.image_url}`} alt="" className='w-full h-full object-cover' />
          </div>
          <div>
            <h2>{projectData.college}</h2>
            <h2 className="font-medium">{projectData.investigator}</h2>
            <p className="font-medium whitespace-pre-line">{projectData.email}</p>
            <h2 className="font-medium">{projectData.partner_organization}</h2>
            <i className="text-xl">{projectData.region}</i>
            <div className='mt-5'>
              <p className='italic'>Keywords:</p>
              <ul className='flex flex-wrap gap-1 items-start justify-start'>
                {projectData.keywords.split(", ").map((keyword, index) => {
                  return <li className='bg-gray-200 py-1 px-2 font-semibold w-fit'>{keyword}</li>
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className='mt-10 md:mt-0'>
          <h1 className='font-medium'>Executive Summary</h1>
          <p className='whitespace-pre-line'>{projectData.summary}</p>
        </div>
      </div>}
      {(Object.keys(projectData).length == 0 || projectData.hidden) && <NotFound />}
    </section>
  )
}

export default EnergyProject