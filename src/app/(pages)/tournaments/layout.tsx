import Header from '@/components/header'
import Sidebar from '@/components/sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col h-dvh'>
      <Header></Header>
      <div className='flex h-screen flex-row'>
        <Sidebar></Sidebar>
        <>{children}</>
      </div>
    </div>
  )
}
