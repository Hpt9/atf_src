import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import HsCodesPage from "./pages/HsCodes";
import IcazelerPage from "./pages/IcazelerPage";
import MuracietlerPage from "./pages/MuracietlerPage";
import FAQPage from "./pages/FAQPage";
import ElaqePage from "./pages/ElaqePage";
import PageTransition from "./components/PageTransition";
import './App.css'
import { Authentication } from "./pages/Authentication";
import ProfilePage from "./pages/ProfilePage";
import AdminChatPage from "./pages/AdminChatPage";
import { Toaster } from 'react-hot-toast';
import { RouteGuard } from './components/RouteGuard';
import AdminRouteGuard from './components/AdminRouteGuard';

function App() {
  const location = useLocation();
  
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#3F3F3F',
          },
          success: {
            iconTheme: {
              primary: '#2E92A0',
              secondary: '#fff',
            },
          },
        }}
      />
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
                <RouteGuard>
                  <MuracietlerPage />
                </RouteGuard>
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
            <Route path="/profile" element={
                  <ProfilePage />
            } />
          </Route>
          <Route path='*' element={<div>Not Found</div>}></Route>
          <Route path="/giris" element={<Authentication/>}></Route>
          <Route path="/admin/chat" element={
            <AdminRouteGuard>
              <AdminChatPage />
            </AdminRouteGuard>
          }></Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
