import React from 'react'
import AdminNav from './AdminNav'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div>
        <div>
            <AdminNav/>
        </div>
        <div  >
       <Outlet/>
       </div> 
    </div>
  )
}
