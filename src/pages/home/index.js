import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from '../../components/Sidebar';
import SearchGrp from '../../components/SearchGrp';
import Groups from '../../components/Groups';
import MyGroups from '../../components/MyGroups';
import Friends from '../../components/Friends';
import Requests from '../../components/Requests';
import Userlist from '../../components/Userlist';
import BlockedUsers from '../../components/BlockedUsers';
import Modal from 'react-modal';
import { FiAlertCircle } from "react-icons/fi";


const Home = () => {

  let [name, setName] = useState("");
  let [dp, setDP] = useState("");
  let [emailVerified, setEmailVerified] = useState(true);

  const auth = getAuth();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let navigate = useNavigate();

  useEffect(()=>{
    if(!data){
        navigate("/login")
    }
  }, []);

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName);
        setDP(user.photoURL);
        setEmailVerified(user.emailVerified);
      } else {
        // User is signed out
        // ...
      }
    });
  }, [])


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }



  return (
    <>
      {emailVerified
      ?
      <div className='max-w-container sm:max-w-smContainer md:max-w-mdContainer lg:max-w-lgContainer xl:max-w-xlContainer 2xl:max-w-xxlContainer mx-auto'>
        <div className='flex flex-row justify-between w-full h-screen py-9'>
            <div className='w-[186px]'>
              <Sidebar name={name} dp={dp}/>
            </div>
            <div className='w-[427px] flex flex-col gap-y-11'>
              <SearchGrp/>
              <Groups/>
              <MyGroups/>
            </div>
            <div className='w-[344px] flex flex-col gap-y-11'>
              <Friends/>
              <Requests/>
            </div>
            <div className='w-[344px] flex flex-col gap-y-6'>
              <Userlist/>
              <BlockedUsers/>
            </div>
        </div>
      </div>
      :
      <>
      <Modal
      isOpen={true}
      style={customStyles}
      shouldCloseOnOverlayClick={false} 
      ariaHideApp={false}
      >
        <div className='flex flex-col gap-2 my-5'>
          <FiAlertCircle className='text-5xl font-bold text-red-500 mx-auto'/>
          <h2 className='text-2xl text-black'>Please verify your Email first</h2>
        </div>
      </Modal>
      <div className='max-w-container sm:max-w-smContainer md:max-w-mdContainer lg:max-w-lgContainer xl:max-w-xlContainer 2xl:max-w-xxlContainer mx-auto'>
        <div className='flex flex-row justify-between w-full h-screen py-9'>
            <div className='w-[186px]'>
              <Sidebar name={name} dp={dp}/>
            </div>
            <div className='w-[427px] flex flex-col gap-y-11'>
              <SearchGrp/>
              <Groups/>
              <Requests/>
            </div>
            <div className='w-[344px] flex flex-col gap-y-11'>
              <Friends/>
            </div>
            <div className='w-[344px] flex flex-col gap-y-11'>
              <Userlist/>
              <BlockedUsers/>
            </div>
        </div>
      </div>
    </>
    }
    </>
  )
}

export default Home
