import React from 'react'
import { getInitials } from '../../utils/Helper'

const ProfileInfo = ({userInfo, onLogout}) => {

  return (
    <div className='flex items-center gap-3'>
      <div className='w-16 h-12 flex items-center justify-center rounded-full text-slate-950 font-semibold bg-slate-100'>
        {getInitials(userInfo?.fullName)}
        </div>
        <div>
           <p className='text-sm font-medium'>{userInfo?.fullName}</p>
           <button className='text-slate-700 underline ' onClick={onLogout}>Logout</button> 
        </div>    

    </div>
  )
}

export default ProfileInfo
