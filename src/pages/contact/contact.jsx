import React from 'react'
import { useState } from 'react';
import { sendEmail } from '../../api';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [university, setUniversity] = useState('');
    const [emailText, setEmailText] = useState('');

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
        <section>
            <div className="bg-[url('/media/images/homepage/hero.png')] text-white py-10 px-5">
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

export default Contact