import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from "../../assets/image/add-note.svg";
import NoDataImg from "../../assets/image/no-data.svg";
import { ToastContainer } from 'react-toastify';


function Home() {

  const [openAddEditModal, setOpenAddEditModal] =useState({isShown:false, type: "add", data:null});

  const [showToastMsg, setShowToatMsg] = useState({
    isShown:false,
    message:"",
    data:null,
    type:"add",
  })

  const[allNotes, setAllNotes]= useState([]);

  const[userInfo, setUserInfo]= useState(null);

  const[isSearch, setIsSearch]= useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails)=>{
    setOpenAddEditModal({isShown:true, data: noteDetails, type: "edit"});
  }

  const showToastMessage =(message, type)=>{
    setShowToatMsg({
      isShown:true,
      message,
      type,
    });
  }

  const handleCloseToast =()=>{
    setShowToatMsg({
      isShown:false,
      message:"",
    });
  }

  //Get user Info

  const getuserInfo = async()=>{
    try {
      const response = await axiosInstance.get("http://localhost:8000/api/auth/get-user");

      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/");
      }
    }
  }

  //get all notes
  const getAllNotes = async ()=>{
    try {
        
    const response = await axiosInstance.get("http://localhost:8000/api/auth/get-all-notes");

    if (response.data && response.data.notes) {
      setAllNotes(response.data.notes);
    }
  } catch (error) {
      console.log("An unexpected error occured, Please try again!")
  }
  }

  // delete notes
  const deleteNote = async (data)=>{
    const noteId = data._id
    try {
      const response = await axiosInstance.delete("http://localhost:8000/api/auth/delete-note/" + noteId)

      if (response.data && response.data.error) {
        showToastMessage("Notes Deleted Successfully", "delete")
        getAllNotes(); 
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        console.log("An unexpected error occured, Please try again!")        
      }
    }
  }

  // search a note
  const onSearchNote = async (query)=>{
    try {
      const response = await axiosInstance.get("http://localhost:8000/api/auth/search-notes", {
        params:{query},
      })

      if (response.data && response.data.notes) {
        setIsSearch(true)
        setAllNotes(response.data.notes)
      }

    } catch (error) {
      console.log(error)
    }
  }

  //Update Pinned
    const updateIsPinned = async (noteData)=>{
      const noteId = noteData._id
      try {
        const response = await axiosInstance.put("http://localhost:8000/api/auth/update-note-pinned/" + noteId ,{
          "isPinned": !noteData.isPinned
        })

        if (response.data && response.data.note) {
          showToastMessage("Notes Pinned Successfully")
          getAllNotes()
        }
        

      } catch (error) {
          console.log(error)
      }
    }

  const handleClearSearch = ()=>{
    setIsSearch(false)
    getAllNotes()
  }

  useEffect(()=>{
    getAllNotes();
    getuserInfo();
  },[])


  return (
    <>
    <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>

    <div className='container mx-auto'>
      {allNotes.length > 0 ? <div className='grid grid-cols-3 gap-4 mt-8 '>
        {allNotes.map((item,index)=>{
          return (
            <NoteCard
              key={item._id}  
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={()=> handleEdit(item)}
              onDelete={()=>{deleteNote(item)}}
              onPinNote={()=>{updateIsPinned(item)}}
              />
          )           
        })}
            </div>: 
            <EmptyCard 
            imgSrc={isSearch ? NoDataImg : AddNotesImg} 
            message={isSearch ? `Oops!!! No Notes found matching your search query` :`Start Creating your first Note! Click the "Add" button to start penning down your thoughts, ideas, to-do's Lets Get Started!!!`}/>}
    </div>

    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' 
            onClick={()=>{
              setOpenAddEditModal({isShown:true, type:"add", data:null});
            }}>
      <MdAdd className='text-[32px] text-white ' />
    </button>

    <Modal isOpen={openAddEditModal.isShown}
          onRequestClose={()=>{}}
          style={{
            overlay:{
              backgroundColor:"rgba(0,0,0,0.2)", 
            },
          }}
          ariaHideApp={false}
          contentLabel=""
          className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
    >
    <AddEditNotes 
    type={openAddEditModal.type}
    noteData={openAddEditModal.data}
    onClose={()=>{
      setOpenAddEditModal({isShown: false, type: "add", data:null });
    }}

    getAllNotes={getAllNotes}
    showToastMessage={showToastMessage}
    />
    </Modal>

    <Toast
      isShown={showToastMsg.isShown}
      message={showToastMsg.message}
      type={showToastMsg.type}
      onClose={handleCloseToast}
      />


    </>
    
  )
}

export default Home
