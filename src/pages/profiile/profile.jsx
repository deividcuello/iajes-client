import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { checkLogin, sendEmail } from "../../api";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { IoMdArrowDropleft } from "react-icons/io";
import { AiFillBackward, AiFillHome } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "../not-found/not-found";
import { getUsers } from "../../api";

function Profile() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [userInfo, setUserInfo] = useState("");
  const [activationCode, setActivationCode] = useState(999999);

  useEffect(() => {
    async function getUserFunc() {
      const res = await checkLogin();
      setUserInfo(res.data.user);
      setUsername(res.data.user.username)
      setEmail(res.data.user.email)
      setName(res.data.user.name)
      setPhone(res.data.user.phone)
      setUniversity(res.data.user.university)
      setDepartment(res.data.user.department)
    }
    getUserFunc();
  }, []);

  async function sendCode() {
    const tempCode = Math.floor(1000 + Math.random() * 9000);
    setActivationCode(tempCode);
    const res = await sendEmail({
      subject: `Email Address Update Confirmation - IAJES`,
      recipientList: userInfo.email,
      text: `Your request to update your email address with IAJES has been received. To confirm this change, please use the following code: ${tempCode}. If you did not initiate this change, please disregard this message or contact our support team immediately. Thank you for choosing IAJES. Best regards, The IAJES Team`,
      code: Math.floor(1000 + Math.random() * 9000),
    });
    toast.success("Code sent", {
      position: "top-center",
    })
  }

  async function updateUser(e) {
    e.preventDefault();

    const res = await getUsers({ username_search: username.toLowerCase().trim(), page: 1 });
    if (res.data.users.length > 0) {
      return toast.error("User already exists", {
        position: "top-center",
      })
    }

    let formData = new FormData();
    formData.append("username", username.toLowerCase().replace(" ", ""));
    formData.append("update_username", true);
    if (username) {
      let editUser = fetch(
        `https://deividcuello.pythonanywhere.com/api/auth/users/${userInfo.id}/`,
        {
          credentials: "include",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          method: "PUT",
          body: formData,
        }
      )
        .then((response) =>
          username
            ? toast.success("Your username was successfully updated", {
              position: "top-center",
            })
            : toast.error("Error", {
              position: "top-center",
            })
        )
        .catch((error) =>
          toast.error("Error", { position: "top-center" })
        );
    } else {
      toast.error("Error", { position: "top-center" });
    }
  }

  async function updateEmail(e) {
    e.preventDefault();

    const res = await getUsers({ email_search: email.toLowerCase().trim(), page: 1 });
    if (res.data.users.length > 0) {
      return toast.error("Email already exists", {
        position: "top-center",
      })
    }

    let formData = new FormData();
    formData.append("email", email.toLowerCase().trim());
    formData.append("update_email", true);
    if (email && codeInput == activationCode) {
      let editUser = fetch(
        `https://deividcuello.pythonanywhere.com/api/auth/users/${userInfo.id}/`,
        {
          credentials: "include",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          method: "PUT",
          body: formData,
        }
      )
        .then((response) =>
          email
            ? toast.success("Your email was successfully updated", {
              position: "top-center",
            })
            : toast.error("Error", {
              position: "top-center",
            })
        )
        .catch((error) =>
          toast.error("Error", { position: "top-center" })
        );
      setActivationCode(Math.random())
    } else {
      if (!email) {
        toast.error("Email error", { position: "top-center" })
      }
      toast.error("Code error", { position: "top-center" })
    }

  }

  async function updatePassword(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("password", password);
    formData.append("update_password", true);
    if (password.length >= 8 && password == confirmPassword) {
      let editUser = fetch(
        `https://deividcuello.pythonanywhere.com/api/auth/users/${userInfo.id}/`,
        {
          credentials: "include",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          method: "PUT",
          body: formData,
        }
      )
        .then((response) =>
          password
            ? toast.success("Your password was successfully updated", {
              position: "top-center",
            })
            : toast.error("Passwords do not match", {
              position: "top-center",
            })
        )
        .catch((error) =>
          toast.error("Passwords do not match", { position: "top-center" })
        );
    } else if (password.length < 8) {
      toast.error("Minimum password length is 8", {
        position: "top-center",
      });
    } else {
      toast.error("Error", { position: "top-center" });
    }
  }

  async function updatePhone(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("phone", phone.toLowerCase().trim());
    formData.append("update_phone", true);

    if (phone) {
      let editUser = fetch(
        `https://deividcuello.pythonanywhere.com/api/auth/users/${userInfo.id}/`,
        {
          credentials: "include",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          method: "PUT",
          body: formData,
        }
      )
        .then((response) =>
          phone
            ? toast.success("Your phone number was successfully updated", {
              position: "top-center",
            })
            : toast.error("Error", {
              position: "top-center",
            })
        )
        .catch((error) =>
          toast.error("Error", { position: "top-center" })
        );
    } else {
      toast.error("Error", { position: "top-center" })
    }

  }

  async function updateName(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("name", name.replace(/\s+/g, ' ').trim());
    formData.append("update_name", true);

    if (phone) {
      let editUser = fetch(
        `https://deividcuello.pythonanywhere.com/api/auth/users/${userInfo.id}/`,
        {
          credentials: "include",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          method: "PUT",
          body: formData,
        }
      )
        .then((response) =>
          phone
            ? toast.success("Your name was successfully updated", {
              position: "top-center",
            })
            : toast.error("Error", {
              position: "top-center",
            })
        )
        .catch((error) =>
          toast.error("Error", { position: "top-center" })
        );
    } else {
      toast.error("Error", { position: "top-center" })
    }

  }

  async function updateUniversity(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("university", university.replace(/\s+/g, ' ').trim());
    formData.append("update_university", true);

    if (phone) {
      let editUser = fetch(
        `https://deividcuello.pythonanywhere.com/api/auth/users/${userInfo.id}/`,
        {
          credentials: "include",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          method: "PUT",
          body: formData,
        }
      )
        .then((response) =>
          phone
            ? toast.success("Your university was successfully updated", {
              position: "top-center",
            })
            : toast.error("Error", {
              position: "top-center",
            })
        )
        .catch((error) =>
          toast.error("Error", { position: "top-center" })
        );
    } else {
      toast.error("Error", { position: "top-center" })
    }

  }

  async function updateDepartment(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append("department", department.replace(/\s+/g, ' ').trim());
    formData.append("update_department", true);

    if (phone) {
      let editUser = fetch(
        `https://deividcuello.pythonanywhere.com/api/auth/users/${userInfo.id}/`,
        {
          credentials: "include",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
          method: "PUT",
          body: formData,
        }
      )
        .then((response) =>
          phone
            ? toast.success("Your department was successfully updated", {
              position: "top-center",
            })
            : toast.error("Error", {
              position: "top-center",
            })
        )
        .catch((error) =>
          toast.error("Error", { position: "top-center" })
        );
    } else {
      toast.error("Error", { position: "top-center" })
    }

  }

  return (
    <section className={`w-full min-h-[calc(100vh-65px)] bg-no-repeat bg-cover bg-center ${userInfo && "bg-[url('/media/images/homepage/hero.png')] text-white"} flex items-center justify-center`}>
      {userInfo && <div className="w-full container mx-auto max-w-[40rem] p-2 my-5">
        <div>
          <h1>Profile settings</h1>
        </div>
        <div className="w-full">
          <form
            action=""
            onSubmit={(event) => updateUser(event)}
            className="h-full w-full rounded-2xl"
          >
            <h3>Change Username</h3>
            <div className="flex flex-col">
              <label htmlFor="username">New Username</label>
              <input
                type="text"
                id="usernameInput"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none'
              />
            </div>
            <input
              type="submit"
              value="Save"
              className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer mt-1'
            />
          </form>
          <form
            action=""
            onSubmit={(event) => updatePassword(event)}
            className="h-full mt-5 rounded-2xl"
          >
            <h3>Change Password</h3>
            <div className="flex flex-col">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="passwordInput"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none'
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="password">Confirm Password</label>
              <input
                type="password"
                id="confirmPasswordInput"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none'
              />
            </div>
            <input
              type="submit"
              value="Save"
              className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer mt-1'
            />
          </form>
          <form
            action=""
            onSubmit={(event) => updateEmail(event)}
            className="h-full w-full mt-5 rounded-2xl"
          >
            <h3>Change Email</h3>
            <div className="flex flex-col">
              <label htmlFor="email">New email</label>
              <input
                type="email"
                id="emailInput"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none'
              />
            </div>
            <div className="flex flex-col mt-4">
              <label htmlFor="password">Verification Code</label>
              <input
                type="text"
                id="codeInput"
                value={codeInput}
                required
                onChange={(e) => setCodeInput(e.target.value)}
                maxLength='4'
                className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none'
              />
              <button
                type="button"
                className="text-blue-500 text-sm font-bold text-start break-words"
                onClick={sendCode}
              >
                Send code to:
                <span className="text-white">
                  {" "}
                  {userInfo.email}
                </span>
              </button>
            </div>
            <input
              type="submit"
              value="Save"
              className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer mt-1'
            />
          </form>
          <form
            action=""
            onSubmit={(event) => updatePhone(event)}
            className="h-full w-full mt-5 rounded-2xl"
          >
            <h3>Change Phone</h3>
            <div className="flex flex-col">
              <label htmlFor="phone">New Phone</label>
              <input
                type="text"
                id="phoneInput"
                value={phone}
                required
                onChange={(e) => setPhone(e.target.value)}
                className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none'
              />
            </div>
            <input
              type="submit"
              value="Save"
              className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer mt-1'
            />
          </form>
          <form
            action=""
            onSubmit={(event) => updateName(event)}
            className="h-full w-full mt-5 rounded-2xl"
          >
            <h3>Change Name</h3>
            <div className="flex flex-col">
              <label htmlFor="name">New Name</label>
              <input
                type="text"
                id="nameInput"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none'
              />
            </div>
            <input
              type="submit"
              value="Save"
              className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer mt-1'
            />
          </form>
          <form
            action=""
            onSubmit={(event) => updateUniversity(event)}
            className="h-full w-full mt-5 rounded-2xl"
          >
            <h3>Change University</h3>
            <div className="flex flex-col">
              <label htmlFor="name">New University</label>
              <input
                type="text"
                id="nameInput"
                value={university}
                required
                onChange={(e) => setUniversity(e.target.value)}
                className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none'
              />
            </div>
            <input
              type="submit"
              value="Save"
              className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer mt-1'
            />
          </form>
          <form
            action=""
            onSubmit={(event) => updateDepartment(event)}
            className="h-full w-full mt-5 rounded-2xl"
          >
            <h3>Change Department</h3>
            <div className="flex flex-col">
              <label htmlFor="name">New Department</label>
              <input
                type="text"
                id="nameInput"
                value={department}
                required
                onChange={(e) => setDepartment(e.target.value)}
                className='text-black dark:text-white bg-gray-200 p-2 w-full focus:outline-none'
              />
            </div>
            <input
              type="submit"
              value="Save"
              className='bg-primary sm:w-[15rem] text-center text-white py-2 px-2 cursor-pointer mt-1'
            />
          </form>
        </div>
      </div>
      }
      {!userInfo &&
        <NotFound />
      }
      <ToastContainer />
    </section>
  );
}

export default Profile;