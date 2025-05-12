import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Toast from '../Toast';

const JivoChat = () => {
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const location = useLocation();

  // Check if current path is auth-related
  const isAuthPage = location.pathname === '/login' || 
                    location.pathname === '/register' || 
                    location.pathname === '/forgot-password';

  // Function to remove Jivo elements
  const removeJivoElements = () => {
    const jivoScript = document.querySelector('script[src="//code.jivosite.com/widget/TuiC7XnLP8"]');
    if (jivoScript) {
      jivoScript.remove();
    }

    const jivoElements = document.querySelectorAll('[id^="jivo"]');
    jivoElements.forEach(element => element.remove());

    if (window.jivo_api) {
      window.jivo_api = undefined;
    }
  };

  // Function to initialize Jivo with user data
  // const initializeJivoWithUser = () => {
  //   if (window.jivo_api && user) {
  //     // Set user token to load their specific chat history
  //     window.jivo_api.setUserToken(user.id.toString());
  //     // Set user info with only available properties
  //     window.jivo_api.setUserInfo({
  //       name: `${user.name} ${user.surname}`,
  //       // Only include phone if it exists
  //       ...(user.phone && { phone: user.phone })
  //     });
  //   }
  // };

  // Effect to handle user state changes
  useEffect(() => {
    if (!user) {
      removeJivoElements();
    } else {
      // Initialize Jivo with user data when user logs in
      // initializeJivoWithUser();
    }
  }, [user]); // This effect runs whenever user state changes

  // Effect to handle Jivo initialization and cleanup
  useEffect(() => {
    // Remove Jivo elements if on auth page or user is not authorized
    if (isAuthPage || !user) {
      removeJivoElements();
      return;
    }

    // Function to handle Jivo widget click
    const handleJivoClick = (e) => {
      // Check if the click is on a Jivo element or its children
      const jivoElement = e.target.closest('[id^="jivo"]');
      if (jivoElement) {
        if (!user) {
          e.preventDefault();
          e.stopPropagation();
          setShowToast(true);
          // Auto-hide toast after 3 seconds
          setTimeout(() => {
            setShowToast(false);
          }, 3000);
        }
      }
    };

    // Add click listener to document
    document.addEventListener('mousedown', handleJivoClick);

    // Initialize Jivo script
    const initializeJivo = () => {
      // Remove any existing Jivo elements first
      removeJivoElements();

      // Create and append new script
      const script = document.createElement('script');
      script.src = '//code.jivosite.com/widget/TuiC7XnLP8';
      script.async = true;
      script.onload = () => {
        // Wait for Jivo API to be available
        const checkJivoApi = setInterval(() => {
          if (window.jivo_api) {
            clearInterval(checkJivoApi);
            // initializeJivoWithUser();
          }
        }, 100);
      };
      document.body.appendChild(script);

      // Add a small delay to ensure the script is loaded
      setTimeout(() => {
        // Add click listener to the Jivo button specifically
        const jivoButton = document.querySelector('#jivo_chat_widget');
        if (jivoButton) {
          jivoButton.addEventListener('click', (e) => {
            if (!user) {
              e.preventDefault();
              e.stopPropagation();
              setShowToast(true);
              setTimeout(() => {
                setShowToast(false);
              }, 3000);
            }
          });
        }
      }, 1000);
    };

    // Initialize Jivo for logged-in users
    initializeJivo();

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleJivoClick);
      removeJivoElements();
    };
  }, [user, isAuthPage]); // Re-run effect when user state or route changes

  // Don't render anything on auth pages or for unauthorized users
  if (isAuthPage || !user) {
    return null;
  }

  return (
    <Toast 
      message="Please log in to use the chat feature"
      isVisible={showToast}
      onClose={() => setShowToast(false)}
    />
  );
};

export default JivoChat; 