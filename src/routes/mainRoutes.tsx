
import React, { lazy } from 'react';
import Home from '../components/home'
import MainLayout from './layout';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Home />
    },{
      path: '/page/',
      element: <Home />
    },
    {
      path: '*',
      element: <Home />
    }

  ]
}

export default MainRoutes