import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const TagInput = ({ tags, setTags }) => {

    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const addNewTag = () => {
        if(inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()])
            setInputValue("");
        }
    };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter'){
        addNewTag();
    }
  }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    }


  return (
    <div>

           {tags?.length > 0 && ( 
            <div className='flex items-center gap-2 flex-wrap mt-2'>
                {tags.map((tag,index) => (
                    <span key={index} className='flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-2'>
                        # {tag}
                        <button className=' border ml-2 mt-0.3  items-center rounded hover:bg-red-500 cursor-pointer' onClick={() => handleRemoveTag(tag)}>
                            <MdClose className='text-slate-950 hover:text-white' />
                        </button>
                    </span>
                ))}
            </div> )}

        <div className='flex items-center gap-4 mt-3'>
            <input type='text' className='text-sm bg-transparent border px-3 py-2 rounded outline-none' placeholder='Add Tags' 
            onChange={handleInputChange} 
            onKeyDown={handleKeyDown}
            value={inputValue}
            />

            <button className='w-8 h-8 flex items-center justify-center rounded border-blue-700 hover:bg-blue-700  border'
            onClick={() => addNewTag()} >
                <MdAdd className='text-2xl text-blue-700 hover:text-white cursor-pointer'/>
            </button>
        </div>
    </div>
  )
}

export default TagInput