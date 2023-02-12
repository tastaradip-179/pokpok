import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import DotLoader from "react-spinners/DotLoader";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";


const Registration = () => {

    let [email, setEmail] = useState("");
    let [fullname, setFullname] = useState("");
    let [password, setPassword] = useState("");

    let [emailErr, setEmailErr] = useState("");
    let [fullnameErr, setFullnameErr] = useState("");
    let [passwordErr, setPasswordErr] = useState("");

    let [showPassword, setShowPassword] = useState(false);
    let [loading, setLoading] = useState(false);
    let [innerHeight, setInnerHeight] = useState("");

    const auth = getAuth();
    const db = getDatabase();

    let handleEmail = (e) => {
        setEmail(e.target.value);
        setEmailErr("");
    }
    let handleFullname = (e) => {
        setFullname(e.target.value);
        setFullnameErr("");
    }
    let handlePassword = (e) => {
        setPassword(e.target.value);
        setPasswordErr("");
    }

    let handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    let handleSubmit = (e) => {
        if(!email){
            setEmailErr("Email is required");
        }
        else if(email){
            if(!email.toLowerCase().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
                 setEmailErr("Email is not valid")
            }
        }
        if(!fullname){
            setFullnameErr("Fullname is required");
        }
        if(!password){
            setPasswordErr("Password is required");
        }
        else if(password){
          if(!password.match(/^(?=.*[a-z])/)){
            setPasswordErr("Password must contain a lower case letter")
          }
          else if(!password.match(/^(?=.*[A-Z])/)){
            setPasswordErr("Password must contain an upper case letter")
          }
          else if(!password.match(/^(?=.*[0-9])/)){
            setPasswordErr("Password must contain a number")
          }
          else if(!password.match(/^(?=.{8,})/)){
            setPasswordErr("Minimum 8 characters are needed")
          }
        }
        if(email && fullname && password && email.toLowerCase().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) 
            && password.match(/^(?=.*[a-z])/) && password.match(/^(?=.*[A-Z])/) && password.match(/^(?=.*[0-9])/) && password.match(/^(?=.{8,})/)){
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                const user = auth.currentUser;
                updateProfile(user, {
                    displayName: fullname,
                    photoURL: "https://tse1.mm.bing.net/th?id=OIP.jxhaxsSnh2OqMaz3PuPkawHaHa&pid=Api&P=0"
                }).then(() => {
                    set(ref(db, 'users/' + user.uid), {
                        name: user.displayName,
                        email: user.email,
                        profile_picture : user.photoURL,
                    });
                    toast.success('Successfully registered! Please verify your email address.', {
                        position: "bottom-left",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                    });
                    sendEmailVerification(user);
                    setLoading(false);
                    setEmail("");
                    setFullname("");
                    setPassword("");
                    setEmailErr("");
                    setFullnameErr("");
                    setPasswordErr("");
                }).catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorMessage.includes("auth/email-already-in-use")){
                    setEmailErr("Try another email. This one has already been used")
                }
                setLoading(false);
            });
        }
    }

    useEffect(()=>{
        setInnerHeight(window.innerHeight);
    }, []);
    

    return (
        <>
            <div className='flex'>
                <div className='w-full md:w-2/4 flex items-center min-h-screen'>
                    <div className='w-full md:w-[368px] mx-auto px-5 py-8 lg:px-0 lg:py-10 xl:py-0'>
                        <h3 className='w-full xl:w-[497px] font-nunito font-bold text-[34px] leading-[47px] text-heading mb-3.5'>
                            Get started with easily register
                        </h3>
                        <p className='font-nunito font-normal text-xl text-para2 mb-12 xl:mb-16'>
                            Free register and you can enjoy it
                        </p>
                        <div className='relative mb-10 md:mb-12 xl:mb-14'>
                            <label className='w-[136px] text-center font-nunito font-semibold text-sm text-form absolute -top-[10px] left-[31px] bg-white'>
                                Email Address
                            </label>
                            <input type='email' 
                                   onChange={handleEmail} 
                                   className='w-full h-[82px] font-nunito font-semibold text-xl text-form border-[1.7px] border-solid border-form rounded-lg pl-[52px]' 
                                   value={email}/>
                                   {emailErr &&
                                   <p className='font-opensans font-normal text-sm text-red-500 mt-1'>{emailErr}</p>
                                   }
                        </div>
                        <div className='relative mb-10 md:mb-12 xl:mb-14'>
                            <label className='w-[136px] text-center font-nunito font-semibold text-sm text-form absolute -top-[10px] left-[31px] bg-white'>
                                Full name
                            </label>
                            <input type='text' 
                                   onChange={handleFullname} 
                                   className='w-full h-[82px] font-nunito font-semibold text-xl text-form border-[1.7px] border-solid border-form rounded-lg pl-[52px]' 
                                   value={fullname}/>
                                   {fullnameErr &&
                                   <p className='font-opensans font-normal text-sm text-red-500 mt-1'>{fullnameErr}</p>
                                   }
                        </div>
                        <div className='relative mb-10 md:mb-12 xl:mb-14'>
                            <label className='w-[136px] text-center font-nunito font-semibold text-sm text-form absolute -top-[10px] left-[31px] bg-white'>
                                Password
                            </label>
                            {showPassword
                            ?
                            <>
                                <input type="text" 
                                   onChange={handlePassword} 
                                   className='w-full h-[82px] font-nunito font-semibold text-xl text-form border-[1.7px] border-solid border-form rounded-lg pl-[52px]' 
                                   value={password}/>
                                <AiOutlineEyeInvisible className='absolute top-8 right-3 text-gray-500 cursor-pointer' onClick={handleShowPassword}/>
                            </>
                            :
                            <>
                                <input type="password" 
                                   onChange={handlePassword} 
                                   className='w-full h-[82px] font-nunito font-semibold text-xl text-form border-[1.7px] border-solid border-form rounded-lg pl-[52px]' 
                                   value={password}/>
                                <AiOutlineEye className='absolute top-8 right-3 text-gray-500 cursor-pointer' onClick={handleShowPassword}/>
                            </>
                            }
                            {passwordErr &&
                                <p className='font-opensans font-normal text-sm text-red-500 mt-1'>{passwordErr}</p>
                            }
                        </div>
                        <div>                            
                            {loading
                            ?
                            <div>
                                <DotLoader  className='mx-auto' color="#5F35F5" />
                            </div>
                            :
                            <button onClick={handleSubmit} className='w-full h-16 text-white bg-main font-nunito font-semibold text-lg border border-solid border-main rounded-full'>
                                Sign up
                            </button>
                            }
                        </div>
                        <div className='mt-[35px] text-center font-opensans font-normal text-sm'>
                            <p className='text-para1'>
                                Already  have an account ? <span className='text-link'><Link to="/login">Sign In</Link></span>
                            </p>
                        </div>
                    </div>
                    <ToastContainer
                        position="bottom-left"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                    />
                </div>
                <div className='w-2/4 hidden md:block'>
                    <picture>
                        {innerHeight > 800
                        ?
                        <img 
                            className='w-full h-screen object-cover' 
                            src='images/registration.png' 
                            alt='registration' 
                            loading="lazy"/>
                        :
                        <img 
                            className='w-full h-full object-cover' 
                            src='images/registration.png' 
                            alt='registration' 
                            loading="lazy"/>
                        }
                    </picture>
                </div>
            </div>
        </>
    )
}

export default Registration
