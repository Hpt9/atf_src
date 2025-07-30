// Cookie utility functions for token management
export const setCookie = (name, value, options = {}) => {
  const defaultOptions = {
    path: '/',
    secure: true, // Only send over HTTPS
    sameSite: 'strict', // Protect against CSRF
    httpOnly: false, // Allow JavaScript access (needed for client-side)
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    ...options
  };

  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (defaultOptions.path) cookieString += `; path=${defaultOptions.path}`;
  if (defaultOptions.secure) cookieString += '; secure';
  if (defaultOptions.sameSite) cookieString += `; samesite=${defaultOptions.sameSite}`;
  if (defaultOptions.maxAge) cookieString += `; max-age=${defaultOptions.maxAge}`;
  if (defaultOptions.domain) cookieString += `; domain=${defaultOptions.domain}`;

  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

export const removeCookie = (name, options = {}) => {
  const defaultOptions = {
    path: '/',
    ...options
  };

  // Set the cookie with an expired date to remove it
  setCookie(name, '', { 
    ...defaultOptions, 
    maxAge: -1 
  });
};

// Token-specific cookie functions
export const setTokenCookie = (token) => {
  setCookie('auth_token', token, {
    maxAge: 3 * 24 * 60 * 60, // 7 days
    secure: true,
    sameSite: 'strict'
  });
};

export const getTokenCookie = () => {
  return getCookie('auth_token');
};

export const removeTokenCookie = () => {
  removeCookie('auth_token');
}; 