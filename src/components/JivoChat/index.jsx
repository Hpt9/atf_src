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
  const initializeJivoWithUser = () => {
    if (window.jivo_api && user) {
      try {
        // Only call if the method exists (Pro plan)
        if (typeof window.jivo_api.setUserToken === 'function') {
          window.jivo_api.setUserToken(user.id.toString());
        }
        if (typeof window.jivo_api.setUserInfo === 'function') {
          window.jivo_api.setUserInfo({
            name: `${user.name} ${user.surname}`,
            email: user.email,
            ...(user.phone && { phone: user.phone })
          });
        }
      } catch (error) {
        console.error('Error initializing Jivo:', error);
      }
    }
  };

  // Effect to handle user state changes
  useEffect(() => {
    if (!user) {
      removeJivoElements();
    } else {
      // Initialize Jivo with user data when user logs in
      initializeJivoWithUser();
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
        console.log('Jivo script loaded');
        // Wait for Jivo API to be available
        const checkJivoApi = setInterval(() => {
          if (window.jivo_api) {
            console.log('Jivo API available');
            clearInterval(checkJivoApi);
            initializeJivoWithUser();
          }
        }, 100);

        // Clear interval after 5 seconds if Jivo API doesn't become available
        setTimeout(() => {
          clearInterval(checkJivoApi);
          if (!window.jivo_api) {
            console.error('Jivo API failed to initialize');
          }
        }, 5000);
      };

      script.onerror = (error) => {
        console.error('Error loading Jivo script:', error);
      };

      document.body.appendChild(script);

      // Poll for the Jivo button for up to 10 seconds
      const waitForJivoButton = (retries = 100) => {
        const jivoButton = document.querySelector('#jivo_chat_widget');
        if (jivoButton) {
          console.log('Jivo button found');
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
        } else if (retries > 0) {
          setTimeout(() => waitForJivoButton(retries - 1), 100);
        } else {
          console.log('Jivo button not found after polling');
        }
      };

      // Start polling for the Jivo button
      waitForJivoButton();
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