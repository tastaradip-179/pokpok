import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

const SearchGrp = () => {
  return (
    <div className='w-full h-[59px] bg-white relative'>
      <AiOutlineSearch className='absolute text-para2 right-5 top-5 text-lg'/> 
      <input className='w-full h-full rounded-[20px] shadow-dark outline-0 pl-5' type="text" placeholder="Search any group"/>
    </div>
  )
}

export default SearchGrp
