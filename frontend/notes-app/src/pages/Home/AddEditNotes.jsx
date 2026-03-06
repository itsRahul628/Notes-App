import React, { useState } from 'react'
import TagInput from '../../components/input/TagInput'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';


const AddEditNotes = ({ type, noteData ,getAllNotes, onClose, showToastMessage }) => {

    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null);

    //Add Note
    const addNewNote = async () => {
        try{
            const response = await axiosInstance.post("/add-note", {
                title,content,tags,
                //send data to backend to create new note with this data
            });

            if(response.data && response.data.message) {
               showToastMessage("Note added succefully")
               getAllNotes() //fetches all the notes (old + new) from the database and updates the UI.
               onClose()
            }
        }catch (error) {
            if(error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    //Edit Note
    const editNote = async () => {
        const noteId = noteData._id;
         try{
            const response = await axiosInstance.put("/edit-note/" + noteId , {
                title,content,tags,
                //send data to backend to create new note with this data
            });

            if(response.data && response.data.message) {
                showToastMessage("Note Updated succefully")
               getAllNotes() //fetches all the notes (old + new) from the database and updates the UI.
               onClose()
            }
        }catch (error) {
            if(error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    };

    const handleAddnote = () => {
        if(!title) {
            setError("please Enter the title");
            return;
        }
        if(!content) {
            setError("Please Enter the content");
            return;
        }

        setError("");

        if(type === "edit"){
            editNote()
        }else {
            addNewNote()
        }
    }

  return (
    <div className='relative'>

        <button className='w-10 h-10  rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-200' 
        onClick={onClose} >
            < MdClose className='text-xl text-slate-400' />
        </button>

        <div className='flex flex-col gap-2'>
           <label className='input-lable'>TITLE</label>
           <input
            type='text'
            className='text-2xl text-slate-950 outline-none' 
            placeholder='Go to gym at 5'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
           />
        </div>

        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-lable'>CONTENT</label>
            <textarea 
             type="text"
             className='text-sm text-slate-950 outline-none bg-slate-100 p-2 '
             placeholder='content'
             rows={10}
             value={content}
             onChange={(e) => setContent(e.target.value)}
            />
        </div>

        <div className='mt-3'>
            <lable className="input-label">TAGS</lable>
            <TagInput tags={tags} setTags={setTags} />
        </div>

        {error && <p className='text-red-500 text-xs pt-4'>{error}</p>}

        <button className='btn-primary font-medium mt-2 p-3' onClick={handleAddnote} > 
           {type === 'edit' ? 'UPDATE' :'ADD'}
        </button>

    </div>
  )
}

export default AddEditNotes