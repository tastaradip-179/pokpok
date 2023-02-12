import React, {useState, useEffect} from 'react';
import { BsThreeDotsVertical, BsMessenger } from 'react-icons/bs';
import { MdBlock } from 'react-icons/md';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { activeUserChat } from "../slices/activeChat";

const Friends = () => {

    const db = getDatabase(); 
    const auth = getAuth();
    let loginData = useSelector((state) => state.userLoginInfo.userInfo);
    let dispatch = useDispatch();
    let [friendList, setFriendList] = useState([]);

    useEffect(() => {
        const friendRef = ref(db, "friends");
        onValue(friendRef, (snapshot) => {
          let arr = [];
          snapshot.forEach((item) => {
            if (
              auth.currentUser.uid == item.val().receiverid ||
              auth.currentUser.uid == item.val().senderid
            ) {
              arr.push({ ...item.val(), key: item.key });
            }
          });
          setFriendList(arr);

          let userinfo = {};
          if (arr[0].receiverid == auth.currentUser.uid) {
            userinfo.status = "single";
            userinfo.id = arr[0].senderid;
            userinfo.name = arr[0].sendername;
            userinfo.pic = arr[0].senderpic;
          } else {
            userinfo.status = "single";
            userinfo.id = arr[0].receiverid;
            userinfo.name = arr[0].receivername;
            userinfo.pic = arr[0].receiverpic;
          }
          dispatch(activeUserChat(userinfo));
        });
    }, []);

    let handleBlock = (item) => {
      auth.currentUser.uid == item.senderid
      ? set(push(ref(db, "blockusers")), {
          block: item.receivername,
          blockid: item.receiverid,
          blockpic: item.receiverpic,
          blockby: item.sendername,
          blockbyid: item.senderid,
        }).then(() => {
          remove(ref(db, "friends/" + item.key));
          toast.danger(`You have blocked ${item.receivername}.`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        })
      : set(push(ref(db, "blockusers")), {
          block: item.sendername,
          blockid: item.senderid,
          blockpic: item.senderpic,
          blockby: item.receivername,
          blockbyid: item.receiverid,
        }).then(() => {
          remove(ref(db, "friends/" + item.key));
          toast.danger(`You have blocked ${item.sendername}.`, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        })
    }

    let handleActiveChat = (item) => {
      let userinfo = {};
      if (item.receiverid == auth.currentUser.uid) {
        userinfo.status = "single";
        userinfo.id = item.senderid;
        userinfo.name = item.sendername;
        userinfo.pic = item.senderpic;
      } else {
        userinfo.status = "single";
        userinfo.id = item.receiverid;
        userinfo.name = item.receivername;
        userinfo.pic = item.receiverpic;
      }
      dispatch(activeUserChat(userinfo));
    };


    return (
        <div className='w-full h-[46vh] bg-white'>
            <div className='w-full h-full rounded-[20px] shadow-dark px-5 py-3.5 overflow-y-auto'>
                <div className='flex flex-row justify-between'>
                    <h4 className='text-black font-poppins text-xl font-semibold'>Friends</h4>
                    <BsThreeDotsVertical className='text-main text-xl'/>
                </div>
                {friendList.length == 0
                ?
                <p className="bg-para2 p-2.5 rounded text-center text-xl text-white mt-5">
                      You don't have any friends :(
                </p>
                :
                friendList.map((item, index)=>(
                  <div className='flex flex-row justify-between my-3.5 border-b border-solid border-[rgba(0,0,0,0.25)] last:border-0 pb-3.5' key={index}>
                    {item.senderid == auth.currentUser.uid
                      ?
                      <>
                        <div className='w-1/5'>
                            <img className='w-[52px] h-[54px] rounded-full' src={item.receiverpic} alt='img'/>
                        </div>
                        <div className='w-[48%] pt-2'>
                            <h6 onClick={() => handleActiveChat(item)} className='text-black font-poppins text-md font-semibold cursor-pointer'>{item.receivername}</h6>
                            {/* <p className='text-[rgba(77,77,77,0.75)] font-poppins text-sm font-medium'>Dinner?</p> */}
                        </div>
                      </>
                      :
                      <>
                        <div className='w-1/5'>
                            <img className='w-[52px] h-[54px] rounded-full' src={item.senderpic} alt='img'/>
                        </div>
                        <div className='w-[48%] pt-2'>
                            <h6 onClick={() => handleActiveChat(item)} className='text-black font-poppins text-md font-semibold cursor-pointer'>{item.sendername}</h6>
                            {/* <p className='text-[rgba(77,77,77,0.75)] font-poppins text-sm font-medium'>Dinner?</p> */}
                        </div>
                      </>
                    }
                    <div className='w-[30%] pt-2'>
                      <div className='flex gap-x-1'>
                        <button onClick={() => handleBlock(item)} className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins text-xl font-semibold'>
                          <MdBlock/>
                        </button>
                        <button className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>
                          <BsMessenger/>
                        </button>
                      </div>
                        {/* <span className='text-[rgba(0,0,0,0.5)] font-poppins text-[10px] font-medium'>Today, 8:56pm</span> */}
                    </div>
                  </div>
                ))
                }
            </div> 
            <ToastContainer/> 
        </div>
    )
}

export default Friends
