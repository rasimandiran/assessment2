import React, { useEffect, useState, useCallback } from 'react';
import { useData } from '../state/DataContext';
import { Link, useSearchParams } from 'react-router-dom';
import { debounce } from '../utils/debounce';

function Items() {
  const { items, pagination, loading, fetchItems } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get URL parameters
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit')) || 20;
  
  // Local search input state
  const [searchInput, setSearchInput] = useState(search);
  
  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        if (value) {
          params.set('q', value);
          params.set('page', '1'); // Reset to page 1 on new search
        } else {
          params.delete('q');
        }
        return params;
      });
    }, 300),
    [setSearchParams]
  );
  
  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage.toString());
      return params;
    });
  };
  
  // Handle limit change
  const handleLimitChange = (e) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('limit', e.target.value);
      params.set('page', '1'); // Reset to page 1 on limit change
      return params;
    });
  };

  useEffect(() => {
    const abortController = new AbortController();

    const loadItems = async () => {
      await fetchItems(
        { page, q: search, limit },
        abortController.signal
      );
    };

    loadItems();

    return () => {
      abortController.abort();
    };
  }, [fetchItems, page, search, limit]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Items</h1>
      
      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search items by name or category..."
          value={searchInput}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      {/* Loading State */}
      {loading && <p>Loading...</p>}
      
      {/* Results */}
      {!loading && items.length === 0 ? (
        <p>No items found{search ? ` for "${search}"` : ''}</p>
      ) : !loading && (
        <>
          {/* Results Info */}
          {pagination && (
            <p style={{ color: '#666', marginBottom: '10px' }}>
              Showing {items.length} of {pagination.totalItems} items
              {search && ` matching "${search}"`}
            </p>
          )}
          
          {/* Items List */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map(item => (
              <li 
                key={item.id} 
                style={{ 
                  padding: '10px', 
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Link 
                  to={`/items/${item.id}`}
                  style={{ textDecoration: 'none', color: '#0066cc' }}
                >
                  {item.name}
                </Link>
                <div>
                  {item.category && (
                    <span style={{ 
                      marginRight: '10px', 
                      padding: '2px 8px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}>
                      {item.category}
                    </span>
                  )}
                  {item.price && (
                    <span style={{ fontWeight: 'bold' }}>
                      ${item.price}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
          
          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div style={{ 
              marginTop: '20px', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!pagination.hasPrevPage}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: pagination.hasPrevPage ? '#fff' : '#f5f5f5',
                    cursor: pagination.hasPrevPage ? 'pointer' : 'not-allowed',
                    opacity: pagination.hasPrevPage ? 1 : 0.5
                  }}
                >
                  Previous
                </button>
                
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button 
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!pagination.hasNextPage}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: pagination.hasNextPage ? '#fff' : '#f5f5f5',
                    cursor: pagination.hasNextPage ? 'pointer' : 'not-allowed',
                    opacity: pagination.hasNextPage ? 1 : 0.5
                  }}
                >
                  Next
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label htmlFor="limit-select">Items per page:</label>
                <select 
                  id="limit-select"
                  value={limit}
                  onChange={handleLimitChange}
                  style={{
                    padding: '6px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Items;