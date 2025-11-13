import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import { Authentication } from "./pages/Authentication";
import ProfilePage from "./pages/ProfilePage";
import AdminChatPage from "./pages/AdminChatPage";
import { Toaster } from 'react-hot-toast';
import { RouteGuard } from './components/RouteGuard';
import AdminRouteGuard from './components/AdminRouteGuard';
import { VerifyEmail } from "./pages/VerifEmail";
import AllAdverts from "./pages/Transportation/AllAdverts";
import AdvertDetail from "./pages/Transportation/AdvertDetail";
import { NewUpdate } from "./pages/NewUpdate";
import EntreperneurIndex from "./pages/Persons/Entreperneur";
import IndividualIndex from "./pages/Persons/İndividual";
import LegalIndex from "./pages/Persons/Legal";
import IndividualDetailIndex from "./pages/Persons/İndividual/detailIndex";
import LegalDetailIndex from "./pages/Persons/Legal/detailIndex";
import EntreperneurDetailIndex from "./pages/Persons/Entreperneur/detailIndex";
import NotFoundPage from "./pages/NotFound";
import Orders from "./pages/Orders/order";
import OrderDetail from "./pages/Orders/orderDetail";
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
            <Route path="/yeni-elan" element={
              <RouteGuard>
                <PageTransition>
                  <NewUpdate />
                </PageTransition>
              </RouteGuard>
            } />
            <Route path="/dasinma/elanlar" element={
              <PageTransition>
                <AllAdverts />
              </PageTransition>
            } />
            <Route path="/dasinma/elanlar/:type/:slug" element={
              <PageTransition>
                <AdvertDetail />
              </PageTransition>
            } />
            <Route path="/dasinma/fiziki-sexs-elanlari" element={<Navigate to="/dasinma/elanlar" replace />} />
            <Route path="/dasinma/huquqi-sexs-elanlari" element={<Navigate to="/dasinma/elanlar" replace />} />
            <Route path="/dasinma/sahibkar-sexs-elanlari" element={<Navigate to="/dasinma/elanlar" replace />} />
            <Route path="/dasinma/fiziki-sexs-elanlari/:slug" element={
              <PageTransition>
                <AdvertDetail />
              </PageTransition>
            } />
            <Route path="/sifarisler" element={
              <PageTransition>
                <Orders/>
              </PageTransition>
            } />
            <Route path="/sifarisler/:slug" element={
              <PageTransition>
                <OrderDetail />
              </PageTransition>
            } />
            <Route path="/dasinma/huquqi-sexs-elanlari/:slug" element={
              <PageTransition>
                <AdvertDetail />
              </PageTransition>
            } />
            <Route path="/dasinma/sahibkar-sexs-elanlari/:slug" element={
              <PageTransition>
                <AdvertDetail />
              </PageTransition>
            } />


            <Route path="/sexsler/fiziki-sexsler" element={
              <PageTransition>
                < IndividualIndex />
              </PageTransition>
            } />
            <Route path="/sexsler/huquqi-sexsler" element={
              <PageTransition>
                < LegalIndex />
              </PageTransition>
            } />
            <Route path="/sexsler/sahibkarlar" element={
              <PageTransition>
                < EntreperneurIndex />
              </PageTransition>
            } />
            <Route path="/sexsler/fiziki-sexsler/:slug" element={
              <PageTransition>
                < IndividualDetailIndex />
              </PageTransition>
            } />
            <Route path="/sexsler/huquqi-sexsler/:slug" element={
              <PageTransition>
                < LegalDetailIndex />
              </PageTransition>
            } />
            <Route path="/sexsler/sahibkarlar/:slug" element={
              <PageTransition>
                < EntreperneurDetailIndex />
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
            <Route path="/verify-email" element={
              <PageTransition>
                <VerifyEmail />
              </PageTransition>
            } />
            <Route path="/profile" element={
              <ProfilePage />
            } />
          <Route path="*" element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          } />
          </Route>
          
          <Route path="/giris" element={<Authentication />}></Route>
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
