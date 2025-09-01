import React, { useEffect, useState, useCallback } from 'react';
import { useData } from '../state/DataContext';
import { Link, useSearchParams } from 'react-router-dom';
import { debounce } from '../utils/debounce';
import VirtualizedItemList from '../components/VirtualizedItemList';
import { 
  ItemListSkeleton, 
  SearchLoadingSkeleton, 
  EmptyState, 
  ErrorState 
} from '../components/LoadingSkeleton';
import { theme, commonStyles } from '../styles/theme';

function Items() {
  const { items, pagination, loading, fetchItems } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Get URL parameters
  const page = parseInt(searchParams.get('page')) || 1;
  const search = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit')) || 20;
  
  // Local search input state
  const [searchInput, setSearchInput] = useState(search);
  
  // Determine if we should use virtualization
  const shouldVirtualize = items.length > 50;
  
  // Debounced search handler with loading state
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchLoading(true);
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
      // Clear search loading after a short delay
      setTimeout(() => setSearchLoading(false), 500);
    }, 300),
    [setSearchParams]
  );
  
  // Handle search input with accessibility
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchInput('');
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.delete('q');
      params.set('page', '1');
      return params;
    });
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('page', newPage.toString());
      return params;
    });
    
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Retry function for error state
  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  useEffect(() => {
    const abortController = new AbortController();

    const loadItems = async () => {
      try {
        setError(null);
        await fetchItems(
          { page, q: search, limit },
          abortController.signal
        );
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error);
        }
      }
    };

    loadItems();

    return () => {
      abortController.abort();
    };
  }, [fetchItems, page, search, limit]);

  // Show loading skeleton on initial load
  if (loading && !items.length && !error) {
    return <ItemListSkeleton />;
  }

  // Show error state
  if (error && !items.length) {
    return (
      <ErrorState 
        error={error}
        onRetry={handleRetry}
        title="Failed to load items"
        description="We couldn't fetch the items. Please check your connection and try again."
      />
    );
  }

  // Regular list rendering for small datasets
  const renderRegularList = () => (
    <div style={{ 
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      boxShadow: theme.shadows.sm,
      overflow: 'hidden'
    }}>
      {items.map((item, index) => (
        <div 
          key={item.id} 
          style={{ 
            padding: theme.spacing.lg,
            borderBottom: index < items.length - 1 ? `1px solid ${theme.colors.borderLight}` : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'background-color 0.2s ease',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = theme.colors.gray50}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <Link 
            to={`/items/${item.id}`}
            style={{ 
              textDecoration: 'none', 
              color: theme.colors.primary,
              fontSize: theme.typography.fontSize.md,
              fontWeight: theme.typography.fontWeight.medium,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
            onFocus={(e) => e.target.style.outline = `2px solid ${theme.colors.primary}`}
            onBlur={(e) => e.target.style.outline = 'none'}
          >
            <span role="img" aria-label="Item">📦</span>
            {item.name}
          </Link>
          
          <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
            {item.category && (
              <span style={{ 
                ...commonStyles.badge.base,
                ...commonStyles.badge.variants.secondary
              }}>
                {item.category}
              </span>
            )}
            {item.price && (
              <span style={{ 
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.success,
                fontSize: theme.typography.fontSize.md
              }}>
                ${item.price}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: theme.colors.backgroundLight,
      fontFamily: theme.typography.fontFamily
    }}>
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto',
        padding: theme.spacing.lg
      }}>
        {/* Header */}
        <header style={{ marginBottom: theme.spacing.xl }}>
          <h1 style={{ 
            fontSize: theme.typography.fontSize.xxxl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: theme.spacing.sm
          }}>
            Items Catalog
          </h1>
          <p style={{ 
            fontSize: theme.typography.fontSize.lg,
            color: theme.colors.textSecondary,
            margin: 0
          }}>
            Discover and explore our collection
          </p>
        </header>
        
        {/* Search Section */}
        <div style={{ 
          backgroundColor: theme.colors.white,
          padding: theme.spacing.xl,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.sm,
          marginBottom: theme.spacing.xl
        }}>
          <div style={{ position: 'relative', maxWidth: '500px' }}>
            <label 
              htmlFor="search-input"
              style={{ 
                display: 'block',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.textPrimary,
                marginBottom: theme.spacing.sm
              }}
            >
              Search Items
            </label>
            
            <div style={{ position: 'relative' }}>
              <input
                id="search-input"
                type="text"
                placeholder="Search by name or category..."
                value={searchInput}
                onChange={handleSearchChange}
                style={{
                  ...commonStyles.input.base,
                  paddingLeft: '40px',
                  paddingRight: searchInput ? '40px' : theme.spacing.md,
                  fontSize: theme.typography.fontSize.md
                }}
                aria-describedby={searchLoading ? "search-status" : undefined}
                autoComplete="off"
              />
              
              {/* Search icon */}
              <span 
                style={{ 
                  position: 'absolute',
                  left: theme.spacing.md,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: theme.colors.textMuted,
                  pointerEvents: 'none'
                }}
                aria-hidden="true"
              >
                🔍
              </span>
              
              {/* Clear button */}
              {searchInput && (
                <button
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: theme.spacing.sm,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: theme.spacing.xs,
                    borderRadius: theme.borderRadius.circle,
                    color: theme.colors.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Search loading indicator */}
            {searchLoading && (
              <div id="search-status" aria-live="polite" style={{ marginTop: theme.spacing.sm }}>
                <SearchLoadingSkeleton />
              </div>
            )}
          </div>
        </div>
        
        {/* Results Section */}
        <main>
          {/* Loading state during search/pagination */}
          {loading && items.length > 0 && (
            <div style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: theme.colors.info,
              color: theme.colors.white,
              padding: theme.spacing.sm,
              textAlign: 'center',
              fontSize: theme.typography.fontSize.sm,
              zIndex: theme.zIndex.toast
            }}>
              Loading...
            </div>
          )}
          
          {/* No results state */}
          {!loading && items.length === 0 ? (
            <EmptyState 
              icon={search ? "🔍" : "📭"}
              title={search ? "No matching items found" : "No items available"}
              description={search ? 
                `No items match "${search}". Try a different search term.` :
                "There are no items to display at the moment."
              }
              action={search ? (
                <button
                  onClick={clearSearch}
                  style={{
                    ...commonStyles.button.primary,
                    backgroundColor: theme.colors.secondary,
                    borderColor: theme.colors.secondary
                  }}
                >
                  Clear Search
                </button>
              ) : null}
            />
          ) : (
            <>
              {/* Results Info */}
              {pagination && (
                <div style={{ 
                  marginBottom: theme.spacing.lg,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: theme.spacing.md
                }}>
                  <div>
                    <p style={{ 
                      color: theme.colors.textSecondary, 
                      margin: 0,
                      fontSize: theme.typography.fontSize.md
                    }}>
                      Showing <strong>{items.length}</strong> of <strong>{pagination.totalItems}</strong> items
                      {search && (
                        <span> matching <strong>"{search}"</strong></span>
                      )}
                    </p>
                    
                    {shouldVirtualize && (
                      <p style={{ 
                        color: theme.colors.primary, 
                        fontSize: theme.typography.fontSize.sm,
                        margin: `${theme.spacing.xs} 0 0 0`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.xs
                      }}>
                        <span role="img" aria-label="Performance">⚡</span>
                        Using virtualization for better performance
                      </p>
                    )}
                  </div>
                  
                  {/* Sort options could go here */}
                </div>
              )}
              
              {/* Items List - Virtualized or Regular */}
              <div style={{ marginBottom: theme.spacing.xl }}>
                {shouldVirtualize ? (
                  <div style={{ 
                    backgroundColor: theme.colors.white,
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadows.sm,
                    overflow: 'hidden',
                    minHeight: '600px'
                  }}>
                    <VirtualizedItemList 
                      items={items} 
                      height="600px"
                    />
                  </div>
                ) : (
                  renderRegularList()
                )}
              </div>
              
              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <nav 
                  role="navigation" 
                  aria-label="Items pagination"
                  style={{ 
                    backgroundColor: theme.colors.white,
                    padding: theme.spacing.xl,
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadows.sm,
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: theme.spacing.lg
                  }}
                >
                  {/* Page navigation */}
                  <div style={{ display: 'flex', gap: theme.spacing.md, alignItems: 'center' }}>
                    <button 
                      onClick={() => handlePageChange(page - 1)}
                      disabled={!pagination.hasPrevPage}
                      style={{
                        ...commonStyles.button.secondary,
                        ...(!pagination.hasPrevPage && {
                          opacity: 0.5,
                          cursor: 'not-allowed'
                        })
                      }}
                      aria-label="Go to previous page"
                    >
                      ← Previous
                    </button>
                    
                    <span style={{ 
                      color: theme.colors.textPrimary,
                      fontSize: theme.typography.fontSize.md
                    }}>
                      Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
                    </span>
                    
                    <button 
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!pagination.hasNextPage}
                      style={{
                        ...commonStyles.button.secondary,
                        ...(!pagination.hasNextPage && {
                          opacity: 0.5,
                          cursor: 'not-allowed'
                        })
                      }}
                      aria-label="Go to next page"
                    >
                      Next →
                    </button>
                  </div>
                  
                  {/* Items per page selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                    <label 
                      htmlFor="limit-select" 
                      style={{ 
                        fontSize: theme.typography.fontSize.md,
                        color: theme.colors.textPrimary
                      }}
                    >
                      Items per page:
                    </label>
                    <select 
                      id="limit-select"
                      value={limit}
                      onChange={handleLimitChange}
                      style={{
                        ...commonStyles.input.base,
                        width: 'auto',
                        minWidth: '100px'
                      }}
                      aria-label="Select number of items per page"
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="500">500 (Virtualized)</option>
                    </select>
                  </div>
                </nav>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Items;