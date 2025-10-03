import { Header } from '@/components/layout/Header'
import React from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative'>
      <Header />
      {children}
    </div>
  )
}

export default MainLayout