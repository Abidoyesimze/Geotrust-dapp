// PropertyRefreshContext.jsx
import React, { createContext, useContext, useState } from 'react';

const PropertyRefreshContext = createContext();

export const PropertyRefreshProvider = ({ children }) => {
  // This number increases each time we need to refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh
  const refreshProperties = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <PropertyRefreshContext.Provider value={{ refreshTrigger, refreshProperties }}>
      {children}
    </PropertyRefreshContext.Provider>
  );
};

// Custom hook to use the context
export const usePropertyRefresh = () => {
  const context = useContext(PropertyRefreshContext);
  if (!context) {
    throw new Error('usePropertyRefresh must be used within a PropertyRefreshProvider');
  }
  return context;
};