import React, { useEffect, useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { MdArrowDropDownCircle, MdRemoveCircle } from 'react-icons/md'
import { getAuth } from "firebase/auth"
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database"
import { getStorage, ref as refer, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import Modal from 'react-modal'
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import BeatLoader from "react-spinners/BeatLoader"
import { activeUserChat } from "../slices/activeChat"

const MyGroups = () => {

  let [isOpenPic, setIsOpenPic] = useState(false);
  let [isOpenInfo, setIsOpenInfo] = useState(false);
  let [isOpenMembers, setIsOpenMembers] = useState(false);
  let [isOpenReq, setIsOpenReq] = useState(false);
  let [modalData, setModalData] = useState(null);
  let [loading, setLoading] = useState(false);
  let [file, setFile] = useState(null);
  let [filename, setFilename] = useState("");
  let [grpList, setGrpList] = useState([]);
  let [grpMembers, setGrpMembers] = useState([]);
  let [grpJoinRequests, setGrpJoinRequests] = useState([]);
  let [error, setError] = useState("");
  let [grpName, setGrpName] = useState("");
  let [grpTag, setGrpTag] = useState("");

  const db = getDatabase();
  const auth = getAuth();
  const storage = getStorage();
  const date = new Date();
  let dispatch = useDispatch();

  useEffect(() => {
    const groupRef = ref(db, "groups");
    const groupmemberRef = ref(db, "groupmembers");
    let arr = [];
    onValue(groupRef, (snapshot) => {
      snapshot.forEach((item) => {
        if (item.val().adminId === auth.currentUser.uid) {
          arr.push({ ...item.val(), grpId: item.key });
        }
      });
    });
    onValue(groupmemberRef, (snapshot) => {
      snapshot.forEach((item) => {
        if (item.val().userId === auth.currentUser.uid) {
          arr.push({ ...item.val(), grpId: item.key });
        }
      });
    });
    setGrpList(arr);
  }, []);


  function openModalPic() {
    setIsOpenPic(true);
  }
  function closeModalPic() {
    setIsOpenPic(false);
    setModalData(null);
    setLoading(false);
    setFile(null);
    setFilename("");
    setError("");
  }
  function openModalInfo() {
    setIsOpenInfo(true);
  }
  function closeModalInfo() {
    setIsOpenInfo(false);
  }
  function openModalMembers() {
    setIsOpenMembers(true);
  }
  function closeModalMembers() {
    setIsOpenMembers(false);
  }
  function openModalReq() {
    setIsOpenReq(true);
  }
  function closeModalReq() {
    setIsOpenReq(false);
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

  let handleGrpPicSelect = (e) => {
    if (e.target.files[0]){
        setFile(e.target.files[0]);
        setFilename(date.toISOString() + e.target.files[0].name);
    } 
  }
  let handleGrpPicUpload = async(e, item) => {
    e.preventDefault();
    if(file){
        setLoading(true);
        const path = `/groups/${filename}`;
        const storageRef = refer(storage, path);
        const uploadTask = uploadBytesResumable(storageRef, file); 
        uploadTask.on('state_changed', 
            (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            }, 
            (error) => {
                console.log(error)
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    set((ref(db, "groups/" + item.grpId)), {
                        grpName: item.grpName,
                        grpTag: item.grpTag,
                        adminName: item.adminName,
                        adminId: item.adminId,
                        grpPic: downloadURL,
                    }).then(() => {
                        toast.success(`Your group photo has been changed`, {
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
                }).catch((error) => {
                    console.log(error);
                });
                setModalData(null);
                setLoading(false);
                setIsOpenPic(false);
                setFile(null);
                setFilename("");
                setError("");
            }
        );
    }
    else{
        setError("Please select any Photo to continue");
    }
  }

  let handleGrpInfo = (e, item) => {
    e.preventDefault();
    if(grpName == ""){
        var name = item.grpName;
    }
    else{
        var name = grpName;
    }
    if(grpTag == ""){
        var tag = item.grpTag;
    }
    else{
        var tag = grpTag;
    }
    set((ref(db, "groups/" + item.grpId)), {
        grpName: name,
        grpTag: tag,
        adminName: item.adminName,
        adminId: item.adminId,
        grpPic: item.grpPic,
    }).then(() => {
        setModalData(null);
        setGrpName("");
        setGrpTag("");
        setIsOpenInfo(false);
        toast.success(`Group info has been updated`, {
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

  let handleMembers = (id) => {
    openModalMembers();
    const gmemberRef = ref(db, "groupmembers");
    onValue(gmemberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (id == item.val().grpId) {
          arr.push({...item.val(), gmemberkey: item.key});
        }
        setGrpMembers(arr);
      });
    });
  };

  let handleRequestsShow = (item) => {
    openModalReq();
    const reqRef = ref(db, "groupjoinrequests");
    onValue(reqRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((gitem) => {
        if (
          item.adminId == auth.currentUser.uid &&
          item.grpId == gitem.val().grpId
        ) {
          arr.push({ ...gitem.val(), key: gitem.key });
        }
      });
      setGrpJoinRequests(arr);
    });
  };

  let handleMemberReject = (item) => {
    remove(ref(db, "groupjoinrequests/" + item.key));
  };

  let handleMemberAccept = (item) => {
    set(push(ref(db, "groupmembers")), {
      adminId: item.adminId,
      grpId: item.grpId,
      grpName: item.grpName,
      grpTag: item.grpTag,
      grpPic: item.grpPic,
      userId: item.userId,
      userName: item.userName,
      userPic: item.userPic,
      key: item.key,
    }).then(() => {
      remove(ref(db, "groupjoinrequests/" + item.key));
      setIsOpenReq(false);
    });
  };

  let handleMemberRemove = (item) => {
    remove(ref(db, "groupmembers/" + item.gmemberkey));
  };

  let handleActiveChat = (item) => {
    let grpinfo = {};
    grpinfo.status = "group";
    grpinfo.id = item.grpId;
    grpinfo.name = item.grpName;
    grpinfo.pic = item.grpPic;
    grpinfo.tag = item.grpTag;
    dispatch(activeUserChat(grpinfo));
  };



  return (
    <>
    <div className='w-full h-[46vh] bg-white'>
        <div className='w-full h-full rounded-[20px] shadow-dark px-5 py-3.5'>
            <div className='flex flex-row justify-between'>
                <h4 className='text-black font-poppins text-xl font-semibold'>My Groups</h4>
                <BsThreeDotsVertical className='text-main text-xl'/>
            </div>
            {grpList.length == 0 
                ?
                <p className="bg-para2 p-2.5 rounded text-center text-lg text-white mt-5">
                    You have no groups
                </p>
                :
                grpList.map((item)=>(
                    <div key={item.grpId}>
                        <div className='flex flex-row justify-between my-3.5 border-b border-solid border-[rgba(0,0,0,0.25)] pb-3.5'>
                            <div className='w-1/4'>
                                <img className='w-[70px] h-[70px] rounded-full' src={item.grpPic} alt='img'/>
                            </div>
                            <div className='w-2/4 pt-2'>
                                <h6 onClick={() => handleActiveChat(item)} className='text-black font-poppins text-lg font-semibold cursor-pointer'>{item.grpName}</h6>
                                <p className='text-[rgba(77,77,77,0.75)] font-poppins text-sm font-medium'>{item.grpTag}</p>
                            </div>
                            <div className='w-1/4 pt-2'>
                                <div class="dropdown relative">
                                    <button 
                                        className="dropdown-toggle px-2 h-[30px] bg-main text-white font-semibold text-xl leading-tight rounded shadow-md hover:bg-mainTransparent hover:shadow-lg focus:bg-mainTransparent focus:shadow-lg focus:outline-none focus:ring-0 active:bg-mainTransparent active:shadow-lg active:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap"
                                        type="button"
                                        id="dropdownMenuButton1"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                    <MdArrowDropDownCircle/>
                                    </button>
                                    <ul className="dropdown-menu min-w-max absolute hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none"
                                        aria-labelledby="dropdownMenuButton1"
                                    >
                                        <li>
                                            <a className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                                                href="#"
                                                onClick={()=>{openModalInfo(); setModalData(item)}}
                                            >Edit Info
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                                            href="#"
                                            onClick={()=>{openModalPic(); setModalData(item)}}
                                            >Change Photo
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                                            href="#"
                                            onClick={() => handleRequestsShow(item)}
                                            >Requests
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100"
                                                href="#"
                                                onClick={()=>{handleMembers(item.grpId); setModalData(item)}}
                                            >Members
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <Modal isOpen={isOpenPic} onRequestClose={closeModalPic} style={customStyles} ariaHideApp={false}>
                            {error
                            ?
                            <div className='text-red-600 text-md mt-2'>{error}</div>
                            :
                            ""}
                            <div>
                                <input type="file" onChange={handleGrpPicSelect} className='border border-solid border-black w-full rounded-lg p-4 mt-6 mb-3'/>
                            </div>  
                            {loading
                            ?
                            <div className='my-3'>
                                <BeatLoader color="#5F35F5" />
                            </div>
                            :
                            <div className='flex flex-row gap-2 my-3'>
                                <button className='bg-main text-white font-poppins text-lg font-medium w-24 py-2 rounded-sm hover:bg-mainTransparent' onClick={(e)=>handleGrpPicUpload(e, modalData)}>Upload</button>
                                <button className='bg-gray-200 text-gray-800 font-poppins text-lg font-medium w-24 py-2 rounded-sm border border-solid border-gray-400 hover:bg-gray-100' onClick={closeModalPic}>Cancel</button>
                            </div>
                            }
                        </Modal>
                        <Modal isOpen={isOpenInfo} onRequestClose={closeModalInfo} style={customStyles} ariaHideApp={false}>
                            <div className='mt-4 mb-3'>
                                <label>Group Name</label>
                                <input type="text" className='border border-solid border-black w-full rounded-lg p-3 mt-1' onChange={(e)=>setGrpName(e.target.value)} defaultValue={modalData?modalData.grpName:""}/>
                            </div>  
                            <div className='mt-4 mb-5'>
                                <label>Group Tag</label>
                                <input type="text" className='border border-solid border-black w-full rounded-lg p-3 mt-1' onChange={(e)=>setGrpTag(e.target.value)} defaultValue={modalData?modalData.grpTag:""}/>
                            </div>
                            <div className='flex flex-row gap-2 my-3'>
                                <button className='bg-main text-white font-poppins text-lg font-medium w-24 py-2 rounded-sm hover:bg-mainTransparent' onClick={(e)=>handleGrpInfo(e, modalData)}>Save</button>
                                <button className='bg-gray-200 text-gray-800 font-poppins text-lg font-medium w-24 py-2 rounded-sm border border-solid border-gray-400 hover:bg-gray-100' onClick={closeModalInfo}>Cancel</button>
                            </div>
                        </Modal>
                        <Modal isOpen={isOpenMembers} onRequestClose={closeModalMembers} style={customStyles} ariaHideApp={false}>
                            <div className='mt-4 mb-3'>
                                <label>Members</label>
                            </div> 
                            <div class="flex justify-center">
                                <ul class="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
                                    <li class="px-6 py-2 border-b border-gray-200 w-full flex">
                                      <img className='w-[50px] h-[50px] rounded-full' src={item.adminPic} alt="dp"/>
                                      <h6 className='ml-2 mt-2'>{modalData?modalData.adminName:""} (admin)</h6>
                                    </li>
                                    {grpMembers.length == 0
                                    ?
                                    <p className="bg-para2 p-2.5 rounded text-center text-sm text-white mt-5">
                                        No other members to show
                                    </p>
                                    :
                                    grpMembers.map((item)=>(
                                      <li class="px-6 py-2 border-b border-gray-200 w-full flex">
                                        <img className='w-[50px] h-[50px] rounded-full' src={item.userPic} alt="dp"/>
                                        <h6 className='ml-2 mt-3'>{item.userName}</h6>
                                        <button className='bg-main text-white text-lg font-medium px-2 h-[26px] rounded-sm hover:bg-mainTransparent ml-auto mt-3'
                                          onClick={handleMemberRemove(item)}><MdRemoveCircle/></button>
                                      </li>
                                    ))
                                    }
                                </ul>
                                </div> 
                            <div className='flex flex-row gap-2 my-3 float-right'>
                                <button className='bg-gray-200 text-gray-800 font-poppins text-lg font-medium w-24 py-2 rounded-sm border border-solid border-gray-400 hover:bg-gray-100' onClick={closeModalMembers}>Close</button>
                            </div>
                        </Modal>
                        <Modal isOpen={isOpenReq} onRequestClose={closeModalReq} style={customStyles} ariaHideApp={false}>
                            <div className='mt-4 mb-3'>
                                <label>New Requests</label>
                            </div> 
                            <div class="flex justify-center">
                                <ul class="bg-white rounded-lg border border-gray-200 w-96 text-gray-900">
                                    {grpJoinRequests.map((item)=>(
                                        <li class="p-2 border-b border-gray-200 w-full">
                                            <div className='flex justify-between'>
                                                <div className='relative w-4/6'>
                                                    <img className='w-[50px] h-[50px] rounded-full' src={item.userPic} alt="dp"/>
                                                    <h6 className='absolute top-3 left-[55px] text-black font-poppins text-lg font-medium'>{item.userName}</h6>
                                                </div>
                                                <div className='flex w-2/6'>
                                                    <button className='bg-main text-white font-poppins text-sm font-medium px-2 rounded-sm hover:bg-mainTransparent'
                                                        onClick={() => handleMemberAccept(item)}>Accept</button>
                                                    <button className='bg-red-500 text-white font-poppins text-sm font-medium px-2 rounded-sm hover:bg-red-400'
                                                        onClick={() => handleMemberReject(item)}>Reject</button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                </div> 
                            <div className='flex flex-row gap-2 my-3 float-right'>
                                <button className='bg-gray-200 text-gray-800 font-poppins text-lg font-medium w-24 py-2 rounded-sm border border-solid border-gray-400 hover:bg-gray-100' onClick={closeModalReq}>Close</button>
                            </div>
                        </Modal>
                    </div>    
                ))
            }
        </div>  
    </div>
    </>
  )
}

export default MyGroups
