import React from 'react'
import Sidebar from '../../components/Sidebar';
import SearchGrp from '../../components/SearchGrp';
import MyGroups from '../../components/MyGroups';
import Friends from '../../components/Friends';
import Chat from '../../components/Chat';

const Message = () => {
  return (
    <div className='max-w-container sm:max-w-smContainer md:max-w-mdContainer lg:max-w-lgContainer xl:max-w-xlContainer 2xl:max-w-xxlContainer mx-auto'>
        <div className='flex flex-row justify-between w-full h-screen py-9'>
            <div className='w-[186px]'>
              <Sidebar/>
            </div>
            <div className='w-[427px] flex flex-col gap-y-11'>
              <SearchGrp/>
              <MyGroups/>
              <Friends/>
            </div>
            <div className='w-[689px] flex flex-col gap-y-11'>
              <Chat/>
            </div>
        </div>
    </div>
  )
}

export default Message