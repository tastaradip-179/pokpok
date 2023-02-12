import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import moment from "moment/moment";
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiSendPlaneFill, RiAttachment2 } from 'react-icons/ri';

const Chat = () => {

  const db = getDatabase();
  const auth = getAuth();
  let data = useSelector((state) => state.activeUserChat.value);

  let [msg, setMsg] = useState("");
  let [singleMsgList, setSingleMsgList] = useState([]);
  let [groupMsgList, setGroupMsgList] = useState([]);

  useEffect(() => {
    const singlemsgRef = ref(db, "singlemsgs");
    onValue(singlemsgRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (
          (item.val().senderId == auth.currentUser.uid &&
            item.val().receiverId == data.id) ||
          (item.val().senderId == data.id &&
            item.val().receiverId == auth.currentUser.uid)
        ) {
          arr.push(item.val());
        }
      });
      setSingleMsgList(arr);
    });
  }, [data.id]);

  useEffect(() => {
    const groupmsgRef = ref(db, "groupmsgs");
    onValue(groupmsgRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val());
      });
      setGroupMsgList(arr);
    });
  }, [data.id]);


  let handleMsg = (e) => {
    setMsg(e.target.value);
  }

  let handleMsgSend = () => {
    if (data.status == "group") {
      set(push(ref(db, "groupmsgs")), {
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName,
        receiverName: data.name,
        receiverId: data.id,
        msg: msg,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      });
    } else {
      set(push(ref(db, "singlemsgs")), {
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName,
        receiverName: data.name,
        receiverId: data.id,
        msg: msg,
        date: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
      });
    }
    setMsg("");
  };


  return (
    <div className='w-full h-[956px] bg-white'>
        <div className='w-full h-full rounded-[20px] shadow-dark px-5 py-3.5'>
            <div className='flex gap-x-4 items-center border-b border-solid border-para2 pb-2.5 m-5'>
                <picture>
                  {data
                  ?
                  <img src={data.pic} alt='user' className='w-[70px] h-[70px] rounded'/>
                  :
                  <img src='images/user.png' alt='user' className='w-[70px] h-[70px] rounded'/>
                  }
                </picture>
                <div>
                  <h3 className="font-nunito font-bold text-xl">
                    {data ? data.name : "Select a group or friend"}
                  </h3>
                  <p className="font-nunito font-semibold text-sm">
                    { data.tag ? data.tag : "Online" }
                  </p>
                </div>
                <BsThreeDotsVertical className='ml-auto'/>
            </div>
            <div className="h-[75vh] overflow-y-scroll">
              {data.status == "group"
              ? groupMsgList.map((item, index) =>
                   (item.senderId == auth.currentUser.uid && item.receiverId == data.id)
                   ?
                      <div className="mt-5 flex justify-end" key={index}>
                        <div>
                          <p className="font-nunito font-medium text-xl text-white bg-main inline-block p-3.5 rounded-xl">
                            {item.msg}
                          </p>
                          <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                            {" "}
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                          </p>
                        </div>
                      </div>
                    : 
                    (item.senderId != auth.currentUser.uid)
                    ? 
                      <div className="mt-5" key={index}>
                        <p className="font-nunito font-medium text-xl bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                          {item.msg}
                        </p>
                        <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                          {" "}
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                     </div>
                     :
                     ""
              )
              : singleMsgList.map((item, index) =>
                    item.senderId == auth.currentUser.uid ? (
                      <div className="mt-5 flex justify-end" key={index}>
                        <div>
                          <p className="font-nunito font-medium text-xl text-white bg-main inline-block p-3.5 rounded-xl">
                            {item.msg}
                          </p>
                          <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                            {" "}
                            {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5" key={index}>
                        <p className="font-nunito font-medium text-xl bg-[#F1F1F1] inline-block p-3.5 rounded-xl">
                          {item.msg}
                        </p>
                        <p className="font-nunito font-medium text-sm text-[#bebebe] mt-1">
                          {" "}
                          {moment(item.date, "YYYYMMDD hh:mm").fromNow()}
                        </p>
                      </div>
                    )
              )}
            </div>
            <div className='flex mt-2.5'>
                <input type="text"
                  onChange={handleMsg}
                  className="border border-solid border-para2 bg-[#f1f1f1] w-[90%] p-2.5 rounded-lg"
                  placeholder="Write a msg"
                  value={msg}
                />
                <button onClick={handleMsgSend}
                  className="text-lg text-white bg-main p-2 rounded ml-2.5"
                  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Send"
                >
                  <RiSendPlaneFill/>
                </button>
                <button className="text-lg text-white bg-main p-2 rounded ml-2"
                  data-bs-toggle="tooltip" data-bs-placement="bottom" title="Attachment"
                >
                  <RiAttachment2/>
                </button>
            </div>
        </div>
    </div>
  )
}

export default Chat