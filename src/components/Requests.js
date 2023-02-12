import React, {useState, useEffect} from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const Requests = () => {

    const db = getDatabase(); 
    const auth = getAuth();
    let loginData = useSelector((state) => state.userLoginInfo.userInfo);

    let [requestList, setRequestList] = useState([]);
  
    useEffect(()=>{
      const requestRef = ref(db, "friendrequests/");
      onValue(requestRef, (snapshot) => {
          let arr = [];
          snapshot.forEach((item) => {
              if (item.val().receiverid === loginData.uid) {
                arr.push({ ...item.val(), id: item.key });
              }
          });
          setRequestList(arr);
        }
      );
    }, [loginData.uid]);

    let handleAcceptFriendRequest = (item) => {
        set(push(ref(db, "friends")), {
            id: item.id,
            sendername: item.sendername,
            senderid: item.senderid,
            senderpic: item.senderpic,
            receiverid: item.receiverid,
            receivername: item.receivername,
            receiverpic: item.receiverpic,
            date: `${new Date().getDate()}/${
              new Date().getMonth() + 1
            }/${new Date().getFullYear()}`,
        }).then(() => {
            remove(ref(db, "friendrequests/" + item.id));
            toast.success(`You are now friends with ${item.sendername}.`, {
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
            <div className='w-full h-[46vh] bg-white'>
                <div className='w-full h-full rounded-[20px] shadow-dark px-5 py-3.5 overflow-y-auto'>
                    <div className='flex flex-row justify-between'>
                        <h4 className='text-black font-poppins text-xl font-semibold'>Friend Requests</h4>
                        <BsThreeDotsVertical className='text-main text-xl'/>
                    </div>
                    {requestList.length == 0
                    ?
                    <p className="bg-para2 p-2.5 rounded text-center text-xl text-white mt-5">
                        No Friend Request Available
                    </p>
                    :
                    requestList.map((item, index)=>(
                        <div className='flex flex-row justify-between my-3.5 border-b border-solid border-[rgba(0,0,0,0.25)] pb-3.5' key={index}>
                            <div className='w-1/4'>
                                <img className='w-[70px] h-[70px] rounded-full' src={item.senderpic} alt='img'/>
                            </div>
                            <div className='w-2/4 pt-2'>
                                <h6 className='text-black font-poppins text-lg font-semibold'>{item.sendername}</h6>
                                <p className='text-[rgba(77,77,77,0.75)] font-poppins text-sm font-medium'>{item.sentat}</p>
                            </div>
                            <div className='w-1/4 pt-2'>
                                <button onClick={() => handleAcceptFriendRequest(item)} className='w-[87px] h-[30px] text-white bg-main rounded-[5px] font-poppins text-xl font-semibold'>Accept</button>
                            </div>
                        </div>
                    ))}
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
        </>
    )
}

export default Requests
