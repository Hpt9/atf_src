import { createBrowserRouter } from 'react-router-dom';
import AdminChat from '../components/AdminChat';
import PrivateRoute from '../components/PrivateRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/admin/chat",
        element: <PrivateRoute><AdminChat /></PrivateRoute>
      },
    ]
  }
]); 