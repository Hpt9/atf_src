import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ChatBot from './ChatBot'
import JivoChat from './JivoChat'
import { SearchBarProvider } from '../context/SearchBarContext'

const Layout = () => {
  return (
    <SearchBarProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
        {/* <ChatBot /> */}
        <JivoChat />
      </div>
    </SearchBarProvider>
  )
}

export default Layout 