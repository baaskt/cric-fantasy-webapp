import Header from '@/components/header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col h-dvh'>
      <Header></Header>
      <>{children}</>
    </div>
  )
}
