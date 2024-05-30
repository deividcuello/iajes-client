import React from 'react'
import { useState } from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { getToken } from '../../api';

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function submitLogin(e) {
        e.preventDefault()
        try {
            const res = await getToken({ email: email.toLowerCase(), password })
            if (res.data.access) {
                localStorage.setItem("accessToken", res.data.access);
                localStorage.setItem("refreshToken", res.data.refresh);
                window.location.href = '/'
            }
        } catch (error) {
            toast.error(`Incorrect data`, {
                position: "top-center"
            })
            console.log(error)
        }
    }
    return (
        <section className="w-full min-h-[calc(100vh)] bg-no-repeat bg-cover bg-center bg-[url('/media/images/homepage/hero.png')] text-white flex items-center justify-center">
            <form onSubmit={(e) => submitLogin(e)} className='mt-5 flex items-center justify-center flex-col gap-3 p-5 w-full sm:w-[40rem]'>
                <h2 className='border-b pb-3 border-white self-start w-full text-4xl font-normal'>Login</h2>
                <div className='flex w-full'>
                    <input type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='flex w-full'>
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='self-start'>
                    <a href="/recover-account" className='border-b border-white '>Forgot password?</a>
                </div>
                <div className='w-full text-center'>
                    <input type="submit" value='Login' className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer' />
                </div>
                <div className='self-start mt-5'>
                    <span>No account?</span>
                </div>
                <div className='w-full'>
                    <a href="/register" className='bg-white text-primary p-2 inline-block text-center font-semibold w-full'>Create account</a>
                </div>
            </form>
            <ToastContainer />
        </section>
    )
}

export default Login