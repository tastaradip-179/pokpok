import React, {useState, useEffect} from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';


const BlockedUsers = () => {

    const db = getDatabase(); 
    const auth = getAuth();
    let loginData = useSelector((state) => state.userLoginInfo.userInfo);

    let [blockList, setBlockList] = useState([]);

    useEffect(()=>{
        const blockRef = ref(db, "blockusers");
        onValue(blockRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((item) => {
            if (item.val().blockbyid == auth.currentUser.uid) {
                arr.push({
                    id: item.key,
                    block: item.val().block,
                    blockid: item.val().blockid,
                    blockpic: item.val().blockpic,
                    authuser: "y",
                });
            } 
            else {
                arr.push({
                    id: item.key,
                    block: item.val().blockby,
                    blockbyid: item.val().blockbyid,
                    blockpic: item.val().blockpic,
                    authuser: "n",
                });
            }
        });
        setBlockList(arr);
        });
    }, [])

    let handleUnblock = (item) => {
        set(push(ref(db, "friends")), {
            sendername: item.block,
            senderid: item.blockid,
            senderpic: item.blockpic,
            receiverid: auth.currentUser.uid,
            receivername: auth.currentUser.displayName,
            receiverpic: auth.currentUser.photoURL,
            date: `${new Date().getDate()}/${
              new Date().getMonth() + 1
            }/${new Date().getFullYear()}`,
        }).then(() => {
            remove(ref(db, "blockusers/" + item.id));
            toast.success(`You are now friends with ${item.block}.`, {
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
        <div className='w-full h-[46vh] bg-white'>
            <div className='w-full h-full rounded-[20px] shadow-dark px-5 py-3.5'>
                <div className='flex flex-row justify-between'>
                    <h4 className='text-black font-poppins text-xl font-semibold'>Blocked Users</h4>
                    <BsThreeDotsVertical className='text-main text-xl'/>
                </div>
                {blockList.length == 0
                ?
                <p className="bg-para2 p-2.5 rounded text-center text-xl text-white mt-5">
                      Your blocklist is empty
                </p>
                :
                blockList.map((item, index)=>(
                    <div className='flex flex-row justify-between my-2.5 border-b border-solid border-[rgba(0,0,0,0.25)] last:border-0 pb-3.5' key={index}>
                        <div className='w-1/5'>
                            <img className='w-[52px] h-[54px] rounded-full' src={item.blockpic} alt='img'/>
                        </div>
                        <div className='w-[48%] pt-2'>
                            <h6 className='text-black font-poppins text-md font-semibold'>{item.block}</h6>
                            <p className='text-[rgba(0,0,0,0.5)] font-poppins text-[10px] font-medium'>Today, 8:56pm</p>
                        </div>
                        <div className='w-[30%] pt-2'>
                            {item.authuser == "y"
                            ?
                            <button onClick={() => handleUnblock(item)} className='px-2 h-[30px] text-white bg-main rounded-[5px] font-poppins font-semibold'>unblock</button>
                            :
                            ""
                            }
                           
                        </div>
                    </div>
                ))
                }
            </div>  
            <ToastContainer/> 
        </div>
    )
}

export default BlockedUsers
