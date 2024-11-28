import React, {useState} from 'react'
import {useNavigate} from "react-router-dom"
import ProfileInfo from './Cards/ProfileInfo'
import SearchBar from "./SearchBar.jsx"
function Navbar({userInfo, onSearchNote, handleClearSearch}) {

  const[searchQuery, setSearchQuery] = useState("")

  const navigate = useNavigate();

  const onLogout =()=>{
    localStorage.clear();
    navigate("/")
  }

  const handleSearch =()=>{
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = ()=>{
    setSearchQuery("")
    handleClearSearch()
  }
  return (
    <>
    <div className='bg-white flex items-center px-6 py-2 justify-between drop-shadow-sm '>
      <h2 className='text-xl font-medium text-black py-2'>Notes</h2>
    
      <SearchBar value={searchQuery} 
      onChange={({target})=>{setSearchQuery(target.value)}}
      handleSearch={handleSearch}
      onClearSearch = {onClearSearch}
      />
    {userInfo &&
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
    </>
    
  )
}

export default Navbar
