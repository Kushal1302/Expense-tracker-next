"use client"
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import React from 'react'

const Logout = () => {
  return (
    <>
    <button onClick={() => signOut()} className='text-white'><LogOut size={20} /></button>
    </>
  )
}

export default Logout
