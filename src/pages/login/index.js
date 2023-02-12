import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import DotLoader from "react-spinners/DotLoader";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../../slices/loggedinUser';
import { getDatabase, ref, set } from "firebase/database";

const Login = () => {

    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    let [emailErr, setEmailErr] = useState("");
    let [passwordErr, setPasswordErr] = useState("");
    let [gmailErr, setGmailErr] = useState("");

    let [showPassword, setShowPassword] = useState(false);
    let [loading, setLoading] = useState(false);
    let [innerHeight, setInnerHeight] = useState("");

    const auth = getAuth();
    const db = getDatabase();
    const provider = new GoogleAuthProvider();
    let navigate = useNavigate();
    const dispatch = useDispatch();

    let handleEmail = (e) => {
        setEmail(e.target.value);
        setEmailErr("");
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
        if(!password){
            setPasswordErr("Password is required");
        }
        if(email && password){
            setLoading(true);
            signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                toast.success('Login successful! Wait for redirection..', {
                  position: "bottom-left",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                });
                setEmail("");
                setPassword("");
                setEmailErr("");
                setPasswordErr("");
                setLoading(false);
                dispatch(userLoginInfo(user.user));
                localStorage.setItem("userInfo", JSON.stringify(user));
                setTimeout(()=>{
                  navigate("/");
                }, 2000);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              if(errorMessage.includes("auth/user-not-found")){
                setEmailErr("Email not found");
              }
              if(errorMessage.includes("auth/wrong-password")){
                setPasswordErr("Password not matched");
              }
              setLoading(false);
            });
        }
    }

    let handleGoogleSignin = () => {
        signInWithPopup(auth, provider)
        .then(() => {
            navigate("/");
            const user = auth.currentUser
            dispatch(userLoginInfo(user));
            localStorage.setItem("userInfo", JSON.stringify(user));
            updateProfile(user, {
                displayName: user.name,
                photoURL: "https://tse1.mm.bing.net/th?id=OIP.jxhaxsSnh2OqMaz3PuPkawHaHa&pid=Api&P=0"
            }).then(() => {
                set(ref(db, 'users/' + user.uid), {
                    name: user.displayName,
                    email: user.email,
                    profile_picture : user.photoURL,
                });
                toast.success('Successfully logged-in! Please wait for redirection', {
                    position: "bottom-left",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const gmail = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            if(errorMessage){
                setGmailErr(errorMessage)
            }
            if(gmail){
                setGmailErr(gmail)
            }
            if(credential){
                setGmailErr(credential)
            }
        });
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
                          Login to your account!
                        </h3>
                        <div className='inline-flex gap-2 border-[0.83px] border-solid border-para1 rounded-xl p-6 my-7 cursor-pointer' onClick={handleGoogleSignin}>
                          <img src="images/g.png" alt="G"/>
                          <h6 className='text-para1 font-opensans font-semibold text-sm'>Login with Google</h6>
                        </div>
                        {gmailErr &&
                            <p className='font-opensans font-normal text-sm text-red-500'>{gmailErr}</p>
                        }
                        <div className='relative mb-10 md:mb-12 xl:mb-14 mt-7'>
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
                                Login to your account!
                            </button>
                            }
                        </div>
                        <div className='mt-[35px] text-center font-opensans font-normal text-sm'>
                            <p className='text-para1'>
                                Don’t have an account ? 
                                <span className='text-link'><Link to="/registration"> Sign up</Link></span>
                            </p>
                            <p className='text-para1 mt-3'>
                                <span className='text-link'><Link to="/forgetpassword"> Forgot your password?</Link></span>
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
                            src='images/login.png' 
                            alt='login' 
                            loading="lazy"/>
                        :
                        <img 
                            className='w-full h-full object-cover' 
                            src='images/login.png' 
                            alt='login' 
                            loading="lazy"/>
                        }
                    </picture>
                </div>
            </div>
        </>
    )
}

export default Login

