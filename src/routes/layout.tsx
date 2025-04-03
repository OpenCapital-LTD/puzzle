import Cookies from 'js-cookie'
import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom"

const MainLayout = () => {
    useEffect(()=>{
        Cookies.remove("fun")
        localStorage.removeItem('fun')
    },[])
    return (
        <div className="app_container">
                <Outlet />
        </div>
    )
}

export default MainLayout