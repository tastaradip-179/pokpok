import React, { useEffect, useState } from 'react';
import { BsPlusLg } from 'react-icons/bs';
import Modal from 'react-modal';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';


const Groups = () => {

    const db = getDatabase();
    const auth = getAuth();

    let [modalIsOpen, setModalIsOpen] = useState(false);
    let [grpName, setGrpName] = useState("");
    let [grpTag, setGrpTag] = useState("");
    let [grpList, setGrpList] = useState([]);
    let [loading, setLoading] = useState(false);
    let [error, setError] = useState("");

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
    }; 

    let openModal = () => {
        setModalIsOpen(true);
    }
    let closeModal = () => {
        setModalIsOpen(false);
    }

    let handleCreateGroup = () => {
        if(grpName != "" && grpTag != ""){
            set(push(ref(db, "groups")), {
                grpName: grpName,
                grpTag: grpTag,
                adminName: auth.currentUser.displayName,
                adminId: auth.currentUser.uid,
                grpPic: "images/group2.png",
                adminPic: auth.currentUser.photoURL,
            }).then(() => {
                  setModalIsOpen(false);
                  toast.success(`Your group is created`, {
                      position: "bottom-center",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                  });
                  setError("");
            });
        }
        else{
            setError("Please fill all the fields")
        }
    };
    
    useEffect(() => {
        const groupRef = ref(db, "groups");
        onValue(groupRef, (snapshot) => {
          let arr = [];
          snapshot.forEach((item) => {
            if (item.val().adminId != auth.currentUser.uid) {
              arr.push({ ...item.val(), grpId: item.key });
            }
          });
          setGrpList(arr);
        });
    }, []);

    let handleGroupJoin = (item) => {
        set(push(ref(db, "groupjoinrequests")), {
          adminId: item.adminId,
          grpId: item.grpId,
          grpName: item.grpName,
          grpTag: item.grpTag,
          grpPic: item.grpPic,
          userId: auth.currentUser.uid,
          userName: auth.currentUser.displayName,
          userPic: auth.currentUser.photoURL,
        }).then(() => {
            toast.success(`Your request has been sent to the group admin`, {
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
      };


    
    return (
        <div className='w-full h-[347px] bg-white'>
            <div className='w-full h-full rounded-[20px] shadow-dark px-5 py-3.5'>
                <div className='flex flex-row justify-between'>
                    <h4 className='text-black font-poppins text-xl font-semibold'>Group List</h4>
                    <button onClick={openModal} className='text-main text-xl border-2 border-solid border-para2 px-2 rounded-md'>Create New</button>
                </div>
                {grpList.length == 0 
                ?
                <p className="bg-para2 p-2.5 rounded text-center text-md text-white mt-5">
                    No Groups Available created by others
                </p>
                :
                grpList.map((item)=>(
                    <div className='flex flex-row justify-between my-3.5 border-b border-solid border-[rgba(0,0,0,0.25)] pb-3.5'>
                        <div className='w-1/4'>
                            <img className='w-[70px] h-[70px] rounded-full' src={item.grpPic} alt='img'/>
                        </div>
                        <div className='w-2/4 pt-2'>
                            <h6 className='text-black font-poppins text-lg font-semibold'>{item.grpName}</h6>
                            <p className='text-[rgba(77,77,77,0.75)] font-poppins text-sm font-medium'>{item.grpTag}</p>
                        </div>
                        <div className='w-1/4 pt-2'>
                            <button onClick={() => handleGroupJoin(item)}
                                className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins text-xl font-semibold' 
                                data-bs-toggle="tooltip" data-bs-placement="bottom" title="Join">
                                    <BsPlusLg/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>  
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                <div className='flex flex-col gap-4 m-5'>
                    {error
                    ?
                    <span className='text-red-600 text-md mb-2'>{error}</span>
                    :
                    ""}
                    <input onChange={(e) => setGrpName(e.target.value)}
                        placeholder='Group Name'
                        className='border border-solid border-para1 w-[340px] rounded-lg px-8 py-4 text-lg'/>
                    <input onChange={(e) => setGrpTag(e.target.value)}
                        placeholder='Group Tagline'
                        className='border border-solid border-para1 w-[340px] rounded-lg px-8 py-4 text-lg'/>    
                    {loading
                    ?
                    <div className='my-3'>
                        <BeatLoader color="#5F35F5" />
                    </div>
                    :
                    <div className='flex justify-end gap-1'>   
                        <button className='border border-solid border-main px-3 py-1 text-white bg-main text-lg rounded-sm'
                            onClick={handleCreateGroup}>Save</button>
                        <button className='border border-solid border-para2 px-3 py-1 text-para1 bg-transparent text-lg rounded-sm'
                            onClick={closeModal}>Close</button>
                    </div>
                    }
                </div>
            </Modal>
            <ToastContainer/> 
        </div>
    )
}

export default Groups
