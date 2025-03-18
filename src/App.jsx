import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage/index'
import IcazelerPage from './pages/IcazelerPage'
import MuracietlerPage from './pages/MuracietlerPage'
import FAQPage from './pages/FAQPage'
import ElaqePage from './pages/ElaqePage'
import HsCodesPage from './pages/HsCodes'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="hs-codes" element={<HsCodesPage />} />
          <Route path="icazeler" element={<IcazelerPage />} />
          <Route path="muracietler" element={<MuracietlerPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="elaqe" element={<ElaqePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
