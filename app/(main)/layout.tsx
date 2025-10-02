import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import React from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='relative'>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default MainLayout