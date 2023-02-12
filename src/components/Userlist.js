import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsThreeDotsVertical, BsPlusLg, BsMessenger } from 'react-icons/bs';
import { MdPendingActions, MdCancelPresentation } from 'react-icons/md';
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useSelector } from 'react-redux';

const Userlist = () => {

  const db = getDatabase(); 
  const auth = getAuth();
  const date = new Date();
  let loginData = useSelector((state) => state.userLoginInfo.userInfo);
  
  let [userList, setUserList] = useState([]);
  let [requestList, setRequestList] = useState([]);
  let [sendRequestList, setSendRequestList] = useState([]);
  let [friendList, setFriendList] = useState([]);
  let [uid, setUID] = useState("");
  let [filterUserList, setFilterUserList] = useState([]);  

  useEffect(()=>{
    if(auth.currentUser != null){
      setUID(auth.currentUser.uid);
    }
    else if(loginData.uid){
      setUID(loginData.uid);
    }
    else if(loginData.user.uid){
      setUID(loginData.user.uid);
    }
  }, [])

  useEffect(()=>{
    const userRef = ref(db, "users/");
    const requestRef = ref(db, "friendrequests/");
    const friendRef = ref(db, "friends");

    onValue(userRef, (snapshot) => {
        let userArr = [];
        snapshot.forEach((item) => {
            if (item.key !== uid) {
              userArr.push({ ...item.val(), id: item.key });
            }
        });
        setUserList(userArr);
      }
    );

    onValue(requestRef, (snapshot2) => {
        let requestArr = [], sendRequestArr = [];
        snapshot2.forEach((item2) => {
            if (item2.val().receiverid === uid) {
              requestArr.push( item2.val().senderid + item2.val().receiverid );
            }
            if (item2.val().senderid === uid) {
              sendRequestArr.push( item2.val().receiverid + item2.val().senderid );
            }
        });
        setRequestList(requestArr);
        setSendRequestList(sendRequestArr);
      }
    );

    onValue(friendRef, (snapshot3) => {
        let friendArr = [];
        snapshot3.forEach((item3) => {
          if (item3.val().receiverid === uid || item3.val().senderid === uid) {
            friendArr.push(item3.val().receiverid + item3.val().senderid);
          }
        });
        setFriendList(friendArr);
      }
    );

  }, [uid]);


  let handleSendFriendRequest = (item) => {
    set(push(ref(db, "friendrequests")), {
      sendername: auth.currentUser.displayName,
      senderid: auth.currentUser.uid,
      senderemail: auth.currentUser.email,
      senderpic: auth.currentUser.photoURL,
      receiverid: item.id,
      receivername: item.name,
      receiverpic: item.profile_picture,
      sentat: date.toLocaleString(),
    });
  };

  let handleSearch = (e) => {
    let searchArr = [];
    if(e.target.value.length == 0){
        setFilterUserList([]);
    }
    userList.filter((item)=>{
        if(item.name.toLowerCase().includes(e.target.value.toLowerCase())){
            searchArr.push(item);
            setFilterUserList(searchArr);
        }
    })
  }

  return (
    <>
      <div className='w-full h-[59px] bg-white relative'>
        <AiOutlineSearch className='absolute text-para2 right-5 top-5 text-lg'
          onClick={handleSearch}/> 
        <input className='w-full h-full rounded-[20px] shadow-dark outline-0 pl-5' 
          type="text" placeholder="Search any user"
          onChange={handleSearch}/>
      </div>
      <div className='w-full h-[347px] bg-white'>
        <div className='w-full h-full rounded-[20px] shadow-dark px-5 py-3.5 overflow-y-auto'>
            <div className='flex flex-row justify-between'>
                <h4 className='text-black font-poppins text-xl font-semibold'>User List</h4>
                <BsThreeDotsVertical className='text-main text-xl'/>
            </div>
            {userList.length == 0
            ?
              <p className="bg-para2 p-2.5 rounded text-center text-xl text-white mt-5">
                No User Available
              </p>
            :
            filterUserList.length != 0 
            ?
            filterUserList.map((item, index) => (
              <div className='flex flex-row justify-between my-2.5 border-b border-solid border-[rgba(0,0,0,0.25)] last:border-0 pb-3.5' key={index}>
                  <div className='w-1/5'>
                      <img className='w-[52px] h-[54px] rounded-full' src={item.profile_picture} alt='img'/>
                  </div>
                  <div className='w-3/5 pt-2'>
                      <h6 className='text-black font-poppins text-md font-semibold'>{item.name}</h6>
                      <p className='text-[rgba(0,0,0,0.5)] font-poppins text-[10px] font-medium'>{item.email}</p>
                  </div>
                  <div className='w-1/5 pt-2'>
                    {
                      requestList.includes(item.id + uid)
                      ?
                      <button className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>
                        <MdPendingActions/>
                      </button>
                      :
                      sendRequestList.includes(item.id + uid)
                      ?
                      <button className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>
                        <MdCancelPresentation/>
                      </button>
                      :
                      friendList.includes(item.id + uid) || friendList.includes(uid + item.id)
                      ?
                      <button className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>
                        <BsMessenger/>
                      </button>
                      :
                      <button onClick={() => handleSendFriendRequest(item)} className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>
                        <BsPlusLg/>
                      </button>
                    }
                  </div>
              </div>
            ))
            :
            userList.map((item, index) => (
                <div className='flex flex-row justify-between my-2.5 border-b border-solid border-[rgba(0,0,0,0.25)] last:border-0 pb-3.5' key={index}>
                    <div className='w-1/5'>
                        <img className='w-[52px] h-[54px] rounded-full' src={item.profile_picture} alt='img'/>
                    </div>
                    <div className='w-3/5 pt-2'>
                        <h6 className='text-black font-poppins text-md font-semibold'>{item.name}</h6>
                        <p className='text-[rgba(0,0,0,0.5)] font-poppins text-[10px] font-medium'>{item.email}</p>
                    </div>
                    <div className='w-1/5 pt-2'>
                      {
                        requestList.includes(item.id + uid)
                        ?
                        <button className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>
                          <MdPendingActions/>
                        </button>
                        :
                        sendRequestList.includes(item.id + uid)
                        ?
                        <button className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>
                          <MdCancelPresentation/>
                        </button>
                        :
                        friendList.includes(item.id + uid) || friendList.includes(uid + item.id)
                        ?
                        <button className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>
                          <BsMessenger/>
                        </button>
                        :
                        <button onClick={() => handleSendFriendRequest(item)} className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>
                          <BsPlusLg/>
                        </button>
                      }
                    </div>
                </div>
            ))}
          </div>  
      </div>
    </>
  )
}

export default Userlist
