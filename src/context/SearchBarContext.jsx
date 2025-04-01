import { createContext, useState, useContext } from 'react';

const SearchBarContext = createContext();

export const SearchBarProvider = ({ children }) => {
  const [searchBar, setSearchBar] = useState(null);

  return (
    <SearchBarContext.Provider value={{ searchBar, setSearchBar }}>
      {children}
    </SearchBarContext.Provider>
  );
};

export const useSearchBar = () => useContext(SearchBarContext); 