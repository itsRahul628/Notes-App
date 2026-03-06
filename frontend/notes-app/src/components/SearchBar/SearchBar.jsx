import React from 'react'
import { FaSearchengin } from 'react-icons/fa6'
import { IoMdClose } from "react-icons/io";

function SearchBar({ value, onChange, handleSearch, onClearSearch }) {

  return (
    <div className='flex items-center justify-center gap-2 w-80 bg-slate-100 rounded-md'>
        <input type='text' className='w-full text-xs p-2 outline-none' 
         placeholder='Search Notes'
         value={value} onChange={onChange}
        />

        { value && (
        <IoMdClose size={20} className='cursor-pointer mr-4 hover:text-black' onClick={onClearSearch} />)}

        <FaSearchengin size={20} className='cursor-pointer mr-4 hover:text-black' onClick={handleSearch} /> 
    </div>
  )
}

export default SearchBar