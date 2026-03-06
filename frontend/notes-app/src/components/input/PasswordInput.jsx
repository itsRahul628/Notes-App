import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from "react-icons/fa6"

const PasswordInput = ( {value, onChange, placeholder} ) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  }


  return (
    <div className='flex items-center bg-transparent border-[1.5px] mb-3 rounded'>
        <input 
        value={value}  onChange={onChange} placeholder={placeholder || "password"}
        type={isShowPassword ? "text" : "password"}
        className='w-full text-sm bg-transparent  px-5 py-2.5 outline-none '
        />

    {isShowPassword ? <FaRegEye 
        size={20}
        className="text-primary cursor-pointer mr-2"
        onClick={() => toggleShowPassword()}
    />: <FaRegEyeSlash
        size={20}
        className='text-primary cursor-pointer mr-2'
        onClick={() => toggleShowPassword()}
    />}
    </div>

  )
}

export default PasswordInput