import { Helmet } from 'react-helmet-async';
import AdminChatInterface from '../components/AdminChatInterface';

const AdminChatPage = () => {
  return (
    <>
      <Helmet>
        <title>Admin Chat | ATF Platform</title>
        <meta name="description" content="Admin chat interface for ATF Platform" />
      </Helmet>
      
      <AdminChatInterface />
    </>
  );
};

export default AdminChatPage; 