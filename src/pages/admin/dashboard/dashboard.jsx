import React from 'react'
import { useState, useEffect } from 'react'
import { getAllCenters, getAllDocs, getAllRegionalAssociations, getAllFaculty, getAllNews, getAllProjects, getAllVideos, getUsers } from '../../../api';

function Dashboard() {
    const [usersCount, setUsersCount] = useState(0)
    const [projectsCount, setProjectsCount] = useState(0)
    const [pendingsProjectsCount, setPendingsProjectsCount] = useState(0)
    const [resourcesCount, setResourcesCount] = useState(0)
    const [newsCount, setNewsCount] = useState(0)

    useEffect(() => {
        async function loadUsers() {
            const res = await getUsers({ isAdmin: true, page: 1 })
            setUsersCount(res.data.count)
        }

        async function loadProjects() {
            const res = await getAllProjects({ isAdmin: true, page: 1, approved: true })
            setProjectsCount(res.data.count)
        }

        async function loadPendingsProjects() {
            const res = await getAllProjects({ isAdmin: true, page: 1, approved: false })
            setPendingsProjectsCount(res.data.count)
        }

        async function loadResources() {
            const res = await getAllVideos({ isAdmin: true, page: 1 })
            const res1 = await getAllCenters({ isAdmin: true, page: 1 })
            const res2 = await getAllDocs({ isAdmin: true, page: 1 })
            const res3 = await getAllFaculty({ isAdmin: true, page: 1 })
            const res4 = await getAllRegionalAssociations({ isAdmin: true, page: 1 })
            setResourcesCount(res.data.count + res1.data.count + res2.data.count + res3.data.count + res4.data.count)
        }

        async function loadNews() {
            const res = await getAllNews({ isAdmin: true, page: 1 })
            setNewsCount(res.data.count)
        }

        loadUsers()
        loadProjects()
        loadPendingsProjects()
        loadResources()
        loadNews()
    }, [])

    return (
        <section className='container mx-auto mt-5 px-5'>
            <div className='flex flex-wrap gap-2 [&>*]:bg-darkPrimary [&>*]:dark:bg-gray-950'>
                <div className='bg-blackBodyBg w-[15rem] h-[8rem] p-5 flex flex-col justify-between rounded-2xl'>
                    <span className='text-6xl'>{usersCount}</span>
                    <span className='text-end text-xl font-semibold'>Users</span>
                </div>
                <div className='bg-blackBodyBg w-[15rem] h-[8rem] p-5 flex flex-col justify-between rounded-2xl'>
                    <span className='text-6xl'>{resourcesCount}</span>
                    <span className='text-end text-xl font-semibold'>Resources</span>
                </div>
                <div className='bg-blackBodyBg w-[15rem] h-[8rem] p-5 flex flex-col justify-between rounded-2xl'>
                    <span className='text-6xl'>{projectsCount}</span>
                    <span className='text-end text-xl font-semibold'>Approved Projects</span>
                </div>
                <div className='bg-blackBodyBg w-[15rem] h-[8rem] p-5 flex flex-col justify-between rounded-2xl'>
                    <span className='text-6xl'>{pendingsProjectsCount}</span>
                    <span className='text-end text-xl font-semibold'>Pendings Projects</span>
                </div>
                <div className='bg-blackBodyBg w-[15rem] h-[8rem] p-5 flex flex-col justify-between rounded-2xl'>
                    <span className='text-6xl'>{newsCount}</span>
                    <span className='text-end text-xl font-semibold'>News</span>
                </div>
            </div>
        </section>
    )
}

export default Dashboard