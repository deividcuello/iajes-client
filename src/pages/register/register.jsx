import React from 'react'
import { useState } from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { sendEmail, getUsers } from '../../api';

function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [code, setCode] = useState('')
    const [activationCode, setActivationCode] = useState(Math.random());
    const [confirmPassword, setConfirmPassword] = useState('')
    const [department, setDepartment] = useState('')
    const [university, setUniversity] = useState('')
    const [phone, setPhone] = useState('')

    async function submitUser(e) {
        e.preventDefault()
        const res1 = await getUsers({ email: email.toLowerCase().trim(), page: 1 });
        const res2 = await getUsers({ username: username.toLowerCase().trim(), page: 1 });
        try {
            if (res1.data.users.length == 1) {
                return toast.error(`Email already exists`, {
                    position: "top-center"
                })
            } else if (res2.data.users.length == 1) {
                return toast.error(`Username already exists`, {
                    position: "top-center"
                })
            }

            // const id = res1.data.users[0].id;
        } catch (error) {
            console.clear()

        }
        if (password == confirmPassword && password.length > 8 && username && phone && university && department && email && code == activationCode) {
            try {
                let formData = new FormData();
                formData.append("name", name.replace(/\s+/g, ' ').trim());
                formData.append("email", email.toLowerCase().replace(" ", ""));
                formData.append("username", username.toLowerCase().replace(" ", ""));
                formData.append("password", password);
                formData.append("isDelete", true);
                formData.append("adminAccount", false);
                formData.append("phone", phone);
                formData.append("university", university.replace(/\s+/g, ' ').trim());
                formData.append("department", department.replace(/\s+/g, ' ').trim());

                let newUser = fetch('https://deividcuello.pythonanywhere.com/api/auth/register', {
                    credentials: "include",
                    headers: { "X-CSRFToken": Cookies.get("csrftoken") },
                    method: "POST",
                    body: formData,
                }).then(res => res.ok ? goToLogin() : toast.error(`User exists`, {
                    position: "top-center"
                })
                )
            } catch (error) {
                toast.error(`Error`, {
                    position: "top-center"
                })
                console.clear()
            }
        }
        if (!email) {
            toast.error(`Email error`, {
                position: "top-center"
            })
        }
        else if (!username) {
            toast.error(`Username error`, {
                position: "top-center"
            })
        }
        else if (!phone) {
            toast.error(`Phone error`, {
                position: "top-center"
            })
        }
        else if (!university) {
            toast.error(`University error`, {
                position: "top-center"
            })
        }
        else if (!department) {
            toast.error(`Department error`, {
                position: "top-center"
            })
        } else if (password.length <= 8) {
            toast.error(`Password must be greater than 8 characters`, {
                position: "top-center"
            })
        }
        else if (password != confirmPassword) {
            toast.error(`Confirm password error`, {
                position: "top-center"
            })
        }
        else if (activationCode != code) {
            toast.error(`Code error`, {
                position: "top-center"
            })
        }
    }

    function checkEmail() {
        if (!email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
            return false
        } else {
            return true
        }
    }

    async function sendCode() {
        const res1 = await getUsers({ email: email.toLowerCase().trim(), page: 1 });
        try {
            if (res1.data.users.length == 1) {
                return toast.error(`Email already exists`, {
                    position: "top-center"
                })
            }

            // const id = res1.data.users[0].id;
        } catch (error) {
            console.clear()

        }
        if (!checkEmail()) {
            return toast.error(`Invalid email`, {
                position: "top-center"
            })
        }

        const tempCode = Math.floor(1000 + Math.random() * 9000);
        setActivationCode(tempCode);
        const res = await sendEmail({
            subject: `Verification Code for Account Creation - IAJES`,
            recipientList: email,
            text: `Hello! To complete your registration on IAJES, please use the following verification code: ${tempCode}. If you have any questions, feel free to contact us. Thank you for joining our community!`,
            code: Math.floor(1000 + Math.random() * 9000),
        });
        toast.success("Code sent", {
            position: "top-center",
        })
    }

    function goToLogin() {
        window.location.href = '/login'
    }

    return (
        <section className="w-full min-h-[calc(100vh-65px)] bg-no-repeat bg-cover bg-center bg-[url('/media/images/homepage/hero.png')] text-white flex justify-center">
            <form onSubmit={(e) => submitUser(e)} className='mt-5 flex items-center justify-center flex-col gap-3 p-5 w-full sm:w-[40rem]'>
                <h2 className='border-b pb-3 border-white self-start w-full text-4xl font-normal'>Create account</h2>
                <div className='flex w-full'>
                    <input type="text" placeholder='Name' onChange={(e) => setName(e.target.value)} value={name} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='flex w-full'>
                    <input type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='flex w-full'>
                    <input type="text" placeholder='Username' onChange={(e) => setUsername(e.target.value)} value={username} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='flex w-full'>
                    <input type="text" placeholder='Phone' onChange={(e) => setPhone(e.target.value)} value={phone} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='flex w-full'>
                    <input type="text" placeholder='University' onChange={(e) => setUniversity(e.target.value)} value={university} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='flex w-full'>
                    <input type="text" placeholder='Department' onChange={(e) => setDepartment(e.target.value)} value={department} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='flex w-full'>
                    <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} value={password} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='flex w-full'>
                    <input type="password" placeholder='Confirm Password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                </div>
                <div className='flex flex-col w-full'>
                    <input type="text" placeholder='Code' onChange={(e) => setCode(e.target.value)} value={code} maxLength="4" className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
                    <button
                        type="button"
                        className="text-blue-500 text-sm font-bold text-start break-words"
                        onClick={sendCode}
                    >
                        Send code to:{" "}
                        <span className="text-white">{email}</span>
                    </button>
                </div>

                <div className='w-full text-center'>
                    <input type="submit" value='Create account' className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer' />
                </div>
            </form>
            <ToastContainer />
        </section>
    )
}

export default Register