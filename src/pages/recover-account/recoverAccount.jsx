import React from 'react'
import { useState } from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { getUsers, sendEmail } from '../../api';

function RecoverAccount() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [code, setCode] = useState()
  const [activationCode, setActivationCode] = useState(Math.floor(1000 + Math.random() * 9000))

  function checkEmail() {
    if (!email.match(/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/)) {
      return false
    } else {
      return true
    }
  }

  async function sendCode() {
    if (!checkEmail()) {
      return toast.error(`Invalid email`, {
        position: "top-center"
      })
    }
    const res1 = await getUsers({ email: email.toLowerCase().trim(), page: 1 });
    try {
      const id = res1.data.users[0].id;
    } catch (error) {
      return toast.error(`Your account was not found`, {
        position: "top-center"
      })
    }

    const tempCode = Math.floor(1000 + Math.random() * 9000);
    setActivationCode(tempCode);
    const res = await sendEmail({
      subject: `Recover your account on IAJES: Follow the steps to reset your password`,
      recipientList: email,
      text: `We have received a request to reset the password for your account on IAJES. To complete this process and regain access, please use the following verification code: ${tempCode}. Once you have verified your identity, you will be able to set a new password and access your account on IAJES again. If you did not request this change, please ignore this message or contact us immediately. Thank you! The IAJES team`,
      code: Math.floor(1000 + Math.random() * 9000),
    });
    return toast.success(`Code sent`, {
      position: "top-center"
    })
  }

  function successRestore() {
    toast.success(`Your account has been successfully recovered`, {
      position: "top-center"
    })
    const tempCode = Math.floor(1000 + Math.random() * 9000);
    setActivationCode(tempCode);
  }

  async function restorePassword(e) {
    e.preventDefault();
    const res = await getUsers({ email: email.toLowerCase().trim(), page: 1 });
    let id
    try {
      id = res.data.users[0].id;
    } catch (error) {
      return toast.error(`Your account was not found`, {
        position: "top-center"
      })
    }

    if (id) {
      let formData = new FormData();
      formData.append("password", password);
      formData.append("recover_password", true);
      if (password.length >= 8 && password == confirmPassword && code == activationCode) {
        let editUser = fetch(`https://deividcuello.pythonanywhere.com/api/auth/users/${id}/`, {
          credentials: "include",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          method: "PUT",
          body: formData,
        })
          .then((response) =>
            email && password && confirmPassword
              ? successRestore()
              : toast.error(`Error`, {
                position: "top-center"
              })
          )
          .catch((error) =>
            toast.error(`Error`, {
              position: "top-center"
            })
          );
      } else {
        if (password.length < 8) {
          return toast.error(`
                Minimum password length must be 8 characters`, {
            position: "top-center"
          })
        }
        else if (code != activationCode) {
          return toast.error(`Incorrect recovery code`, {
            position: "top-center"
          })
        }
        else if (password != confirmPassword) {
          return toast.error(`Passwords do not match`, {
            position: "top-center"
          })
        }
        toast.error(`Your account was found. Please enter the correct details.`, {
          position: "top-center"
        })
      }
    } else {
      toast.error(`Error`, {
        position: "top-center"
      })
    }
  }


  return (
    <section className="w-full min-h-[calc(100vh-65px)] bg-no-repeat bg-cover bg-center bg-[url('/media/images/homepage/hero.png')] text-white flex items-center justify-center">
      <form onSubmit={(event) => restorePassword(event)} className='mt-5 flex items-center justify-center flex-col gap-3 p-5 w-full sm:w-[40rem]'>
        <h2 className='border-b pb-3 border-white self-start w-full text-4xl font-normal'>Recover Account</h2>
        <div className='flex w-full'>
          <input type="text" placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
        </div>
        <div className='flex flex-col w-full'>
          <input type="text" placeholder='Code' onChange={(e) => setCode(e.target.value)} value={code} maxLength='4' className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
          <button
            type="button"
            className="text-blue-500 text-sm font-bold text-start break-words"
            onClick={sendCode}
          >
            Send code to:{" "}
            <span className="text-white">{email}</span>
          </button>
        </div>
        <div className='flex w-full'>
          <input type="password" placeholder='New password' onChange={(e) => setPassword(e.target.value)} value={password} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
        </div>
        <div className='flex w-full'>
          <input type="password" placeholder='Confirm new password' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none' />
        </div>
        <div className='w-full text-center'>
          <input type="submit" value='Recover account' className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer' />
        </div>
      </form>
      <ToastContainer />
    </section>
  )
}

export default RecoverAccount