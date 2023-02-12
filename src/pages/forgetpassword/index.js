import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const Forgetpassword = () => {

    let [email, setEmail] = useState("");
    let [emailErr, setEmailErr] = useState("");

    const auth = getAuth();
    let navigate = useNavigate();

    let handleEmail = (e) => {
        setEmail(e.target.value);
        setEmailErr("");
    }

    let handleSubmit = () => {
        if (!email) {
            setEmailErr("Email is required");
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast.success('Password reset email sent!! Check your email..', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setEmail("");
                setEmailErr("");
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage, {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            });
    }

    return (
        <>

            <div className='w-full flex items-center min-h-screen'>
                <div className='w-full md:w-[368px] mx-auto px-5 py-8 lg:px-0 lg:py-10 xl:py-0'>
                    <h3 className='w-full xl:w-[497px] font-nunito font-bold text-[34px] leading-[47px] text-heading mb-14'>
                        Forgot password?
                    </h3>
                    <div className='relative mb-5 md:mb-6 xl:mb-7 mt-7'>
                        <label className='w-[136px] text-center font-nunito font-semibold text-sm text-form absolute -top-[10px] left-[31px] bg-white'>
                            Email Address
                        </label>
                        <input type='email'
                            onChange={handleEmail}
                            className='w-full h-[82px] font-nunito font-semibold text-xl text-form border-[1.7px] border-solid border-form rounded-lg pl-[52px]'
                            value={email} />
                        {emailErr &&
                            <p className='font-opensans font-normal text-sm text-red-500 mt-1'>{emailErr}</p>
                        }
                    </div>
                    <div>
                        <button onClick={handleSubmit} className='w-full h-14 text-white bg-main font-nunito font-semibold text-lg border border-solid border-main rounded-full'>
                            Submit
                        </button>
                    </div>
                    <div className='mt-5 text-center font-opensans font-normal text-sm'>
                        <p className='text-para1'>
                            <span className='text-link'><Link to="/login">Back to login</Link></span>
                        </p>
                    </div>
                </div>
                <ToastContainer />
            </div>


        </>
    )
}

export default Forgetpassword
