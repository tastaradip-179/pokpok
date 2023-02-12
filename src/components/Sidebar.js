import React, { useState, useEffect } from 'react'
import { AiOutlineHome, AiOutlineMessage, AiOutlineBell, AiOutlineSetting, AiOutlineCloudUpload } from "react-icons/ai"
import { GoSignOut } from "react-icons/go"
import { useNavigate, Link } from 'react-router-dom'
import { getAuth, updateProfile, signOut } from "firebase/auth"
import Modal from 'react-modal'
import { useDispatch, useSelector } from 'react-redux';
import { userLoginInfo } from '../slices/loggedinUser'
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDatabase, ref, set } from "firebase/database";
import { getStorage, ref as refer, uploadString, getDownloadURL } from "firebase/storage";
import BeatLoader from "react-spinners/BeatLoader";


const Sidebar = (props, { active }) => {

  const auth = getAuth();
  const db = getDatabase();
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const storage = getStorage();
  let loginData = useSelector((state) => state.userLoginInfo.userInfo);

  const [image, setImage] = useState("");
  const [cropData, setCropData] = useState("");
  const [cropper, setCropper] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  let [loading, setLoading] = useState(false);

  useEffect(()=>{
    console.log(active)
  }, [])


  let handleSignout = () => {
    signOut(auth).then(() => {
      dispatch(userLoginInfo(null));
      localStorage.removeItem("userInfo");
      navigate("/login");
    }).catch((error) => {
      console.log(error);
    });
  }

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
    setImage("");
    setCropData("");
  }
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      width: 'auto',
      height: 'auto',
    },
  };


  const handleSelectImage = (e) => {
      e.preventDefault();
      setCropData("#");
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
  };
  const getCropData = () => {
    setLoading(true);
    const user = auth.currentUser;
    const storageRef = refer(storage, user.uid);
    
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      // Data URL string
      const message = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message, 'data_url').then((snapshot) => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(storageRef).then((downloadURL) => {
          console.log('File available at', downloadURL);
          updateProfile(user, {
            photoURL: downloadURL,
          }).then(() => {
            setLoading(false);
            setIsOpen(false);
            setCropData("");
            set(ref(db, 'users/' + user.uid), {
              name: user.displayName,
              email: user.email,
              profile_picture : downloadURL,
            });
            localStorage.setItem("userInfo", JSON.stringify(user));
          }).catch((error) => {
            console.log(error);
          });
        });
      });
    }
  };
  
  return (
    <>
      <div className='w-full h-full bg-main rounded-2xl'>
        <div className='py-10'>
            <picture className='relative'>
                {auth.currentUser != null
                ?
                <img className='mx-auto w-[100px] h-[100px] rounded-full' src={auth.currentUser.photoURL} alt={props.name}/>
                : 
                <img className='mx-auto w-[100px] h-[100px] rounded-full' src={loginData.photoURL} alt={props.name}/>    
                }
                <AiOutlineCloudUpload onClick={openModal} className='absolute text-white border border-solid border-main rounded-full bg-mainTransparent text-3xl cursor-pointer bottom-4 right-10 hover:bg-main'/>
            </picture> 
            <h3 className='mx-auto mt-4 text-center text-white font-poppins text-xl font-semibold'>{props.name}</h3>
        </div>
        <div className='py-8'>
            <div
              className={`${
                active == "home" &&
                "relative z-10  after:absolute after:top-0 after:left-0 after:bg-white after:w-[242%] after:h-full after:content-[''] text-center flex flex-col items-center after:z-[-1] p-10 after:rounded-2xl before:absolute before:top-0 before:right-[-32px] before:rounded before:bg-primary before:w-[15px] before:h-full before:content-[''] before:shadow-lg shadow-cyan-500/50"
              }`}
            >
              <Link to="/">
                <AiOutlineHome
                  className={`${
                    active == "home"
                      ? "mx-auto text-3xl xl:text-5xl xl:text-main"
                      : "mx-auto text-3xl xl:text-5xl text-white"
                  }`}
                />
              </Link>
            </div>
        </div>
        <div className='py-8'>
            <div
              className={`${
                active == "messages" &&
                "relative z-10  after:absolute after:top-0 after:left-0 after:bg-white after:w-[242%] after:h-full after:content-[''] text-center flex flex-col items-center after:z-[-1] p-10 after:rounded-2xl before:absolute before:top-0 before:right-[-32px] before:rounded before:bg-primary before:w-[15px] before:h-full before:content-[''] before:shadow-lg shadow-cyan-500/50"
              }`}
            >
              <Link to="/messages">
                <AiOutlineMessage
                  className={`${
                    active == "messages"
                      ? "mx-auto text-3xl xl:text-5xl text-main"
                      : "mx-auto text-3xl xl:text-5xl text-white"
                  }`}
                />
              </Link>
            </div>    
        </div>
        <div className='py-8'>
            <AiOutlineBell className='mx-auto text-white text-5xl cursor-pointer'/>
        </div>
        <div className='py-8'>
            <AiOutlineSetting className='mx-auto text-white text-5xl cursor-pointer'/>
        </div>
        <div className='py-8'>
            <GoSignOut className='mx-auto text-white text-5xl cursor-pointer' onClick={handleSignout}/>
        </div>
      </div>

      <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
            ariaHideApp={false}
      >
            <div>
                {cropData
                ?
                  <div className='mx-auto w-[100px] h-[100px] rounded-full img-preview overflow-hidden'></div>
                :
                <picture>
                  {auth.currentUser != null
                  ?
                  <img className='mx-auto w-[100px] h-[100px] rounded-full' src={auth.currentUser.photoURL} alt="img"/>
                  :
                  <img className='mx-auto w-[100px] h-[100px] rounded-full' src={loginData.photoURL} alt="img"/>
                  }
                </picture>
                }
            </div>
            <div>
              <input type="file" onChange={handleSelectImage} className='border border-solid border-black w-full rounded-lg p-4 mt-6 mb-3'/>
            </div>
            <div>
              {cropData
              ?
                <Cropper
                  style={{ height: 400, width: "100%" }}
                  zoomTo={0.5}
                  initialAspectRatio={1}
                  preview=".img-preview"
                  src={image}
                  viewMode={1}
                  minCropBoxHeight={10}
                  minCropBoxWidth={10}
                  background={false}
                  responsive={true}
                  autoCropArea={1}
                  checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                  onInitialized={(instance) => {
                    setCropper(instance);
                  }}
                  guides={true}
                />
              :
              ""
              }
            </div>
            {loading
            ?
            <div className='my-3'>
              <BeatLoader color="#5F35F5" />
            </div>
            :
            <div className='flex flex-row gap-2 my-3'>
              <button className='bg-main text-white font-poppins text-lg font-medium w-24 py-2 rounded-sm hover:bg-mainTransparent' onClick={getCropData}>Upload</button>
              <button className='bg-gray-200 text-gray-800 font-poppins text-lg font-medium w-24 py-2 rounded-sm border border-solid border-gray-400 hover:bg-gray-100' onClick={closeModal}>Cancel</button>
            </div>
            }
            
      </Modal>
    </>
  )
}

export default Sidebar
