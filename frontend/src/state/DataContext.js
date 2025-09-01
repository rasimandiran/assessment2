import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchInfo, setSearchInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async (params = {}, signal) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 20,
        q: params.q || '',
        sortBy: params.sortBy || 'name',
        sortOrder: params.sortOrder || 'asc'
      });
      
      const res = await fetch(`http://localhost:4001/api/items?${queryParams}`, { 
        signal 
      });
      const json = await res.json();
      
      // Handle new response structure
      if (json.data) {
        setItems(json.data);
        setPagination(json.pagination);
        setSearchInfo(json.search);
      } else {
        // Fallback for old API structure
        setItems(json);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to fetch items:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{ 
      items, 
      pagination, 
      searchInfo, 
      loading, 
      fetchItems 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);