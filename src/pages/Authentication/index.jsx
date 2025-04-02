import React, { useState } from 'react'
import AUTH_IMG from '../../assets/images/AUTHIMG.svg'
export const Authentication = () => {
    const [login,setLogin] = useState(true)
  return (
    <div className='w-full flex justify-center max-h-screen'>
        <div className='w-full max-w-[1920px] flex gap-x-[100px] p-[60px]'>
            <div className='w-[50%] flex justify-center'>
                <img src={AUTH_IMG} className='' alt="" />
            </div>
            <div>
                
            </div>
        </div>
    </div>
  )
}
