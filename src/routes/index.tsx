// import {useGiraf} from '../giraff'

import React, { useEffect, useState } from "react"
import { useRoutes } from "react-router-dom"
import MainRoutes from "./mainRoutes"

function ThemeRoutes(){
    
    return useRoutes([MainRoutes])
    // return useRoutes([gHead.logedIn ? MainRoutes : AuthRoutes])

}
export default ThemeRoutes