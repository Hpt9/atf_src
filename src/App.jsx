import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import HsCodesPage from "./pages/HsCodes";
import IcazelerPage from "./pages/IcazelerPage";
import MuracietlerPage from "./pages/MuracietlerPage";
import FAQPage from "./pages/FAQPage";
import ElaqePage from "./pages/ElaqePage";
import PageTransition from "./components/PageTransition";
import './App.css'

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index key={"salam"} element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          } />
          <Route path="/hs-codes" element={
            <PageTransition>
              <HsCodesPage />
            </PageTransition>
          } />
          <Route path="/icazeler" element={
            <PageTransition>
              <IcazelerPage />
            </PageTransition>
          } />
          <Route path="/muracietler" element={
            <PageTransition>
              <MuracietlerPage />
            </PageTransition>
          } />
          <Route path="/faq" element={
            <PageTransition>
              <FAQPage />
            </PageTransition>
          } />
          <Route path="/elaqe" element={
            <PageTransition>
              <ElaqePage />
            </PageTransition>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
