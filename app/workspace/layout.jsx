import React from 'react'
import AppSidebar from './_components/AppSidebar.jsx'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppHeader from './_components/AppHeader.jsx'

const Workspacelayout = ({children}) => {
  return (
    <SidebarProvider>
      <AppSidebar/>
    <div className='w-full'>
      <AppHeader/>
      {children}</div>
    </SidebarProvider>
  )
}

export default Workspacelayout