import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd, MdLocalShipping } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/images/No data-cuate.png";
import Nodata from "../../assets/images/no-data.svg";



const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isshown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isshown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false)


  const navigate = useNavigate();

  //Edit Note
  const handleEdit = (noteDetails) => {
    setOpenAddEditModel({ isshown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isshown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isshown: false,
      message: "",
    });
  };

  //Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  //Get All Notes.
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected Error occured");
    }
  };
  //without getallnotes our note will update in database, but not visible to screen.

  //Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted succefully", "delete");
        getAllNotes(); //fetches all the notes (old + new) from the database and updates the UI.
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected Error occured");
      }
    }
  };

  //Search for a Note
  const onSearchNote = async (query) => {
    try{
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if(response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    }catch (error) {
      console.log(error);
    }
  }

  //pinned
  const updateIsPinned = async (noteData) => {
     const noteId = noteData._id;
        try{
          const response = await axiosInstance.put("/update-note-pinned/" + noteId , {
              "isPinned": !noteData.isPinned,
          });

          if(response.data && response.data.message) {
              showToastMessage("Note Updated succefully")
              getAllNotes() //fetches all the notes (old + new) from the database and updates the UI.
          }
      }catch (error) {
        console.log(error)
      }
  }

  //clear input
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    getUserInfo();
    getAllNotes();
    return () => {};
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo}  onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>

      <div className="container max-w-7xl mx-auto px-6 py-8">
        { allNotes.length > 0 ? <div className="grid gap-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allNotes.map((item,index) => (
            <div className="transition-transform duration-200 hover:scale-[1.02]" key={index} >
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
              />
            </div>
          ))}
        </div>: <EmptyCard imgSrc={isSearch ? Nodata :  AddNotesImg} 
        message={isSearch ? `oops! No notes found matching your search.` : `start creating your first note! Click the add to join the down your
         thoughts, ideas, and reminders. Let"s get Started`}/>}
      </div>

      <button
        className="fixed bottom-8 right-8 w-14 h-14 flex items-center justify-center rounded-full 
                 bg-blue-600 hover:bg-blue-700 text-white shadow-lg 
                 transition-all duration-300 hover:scale-110"
        onClick={() => {
          setOpenAddEditModel({ isshown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-3xl" />
      </button>

      <Modal
        isOpen={openAddEditModel.isshown}
        onRequestClose={() => {}}
        contentLabel="Add/Edit Note"
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
          },
        }}
        className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] 
                 max-h-[80vh] bg-white rounded-2xl 
                 mx-auto mt-20 p-6 overflow-y-auto 
                 shadow-2xl transition-all duration-300"
      >
        <AddEditNotes
          type={openAddEditModel.type}
          noteData={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({ isshown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isshown={showToastMsg.isshown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
