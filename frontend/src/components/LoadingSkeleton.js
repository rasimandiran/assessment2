import React from 'react';

// Base skeleton component
export const Skeleton = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = '',
  ...props 
}) => (
  <div
    className={`skeleton ${className}`}
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: '#f0f0f0',
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeleton-loading 1.5s infinite',
      ...props.style
    }}
    {...props}
  />
);

// Item list skeleton
export const ItemListSkeleton = ({ count = 10 }) => (
  <div style={{ padding: '20px' }}>
    <style>
      {`
        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}
    </style>
    
    {/* Search bar skeleton */}
    <div style={{ marginBottom: '20px' }}>
      <Skeleton width="400px" height="44px" borderRadius="4px" />
    </div>

    {/* Results info skeleton */}
    <div style={{ marginBottom: '10px' }}>
      <Skeleton width="200px" height="16px" />
    </div>

    {/* Item list skeleton */}
    <div style={{ marginBottom: '20px' }}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          style={{
            padding: '16px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          {/* Item name */}
          <Skeleton 
            width={`${Math.random() * 100 + 150}px`} 
            height="18px" 
            style={{ flex: 1, maxWidth: '300px' }}
          />
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* Category */}
            <Skeleton width="80px" height="24px" borderRadius="12px" />
            {/* Price */}
            <Skeleton width="60px" height="18px" />
          </div>
        </div>
      ))}
    </div>

    {/* Pagination skeleton */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: '20px',
      borderTop: '1px solid #eee'
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Skeleton width="80px" height="36px" borderRadius="4px" />
        <Skeleton width="100px" height="16px" />
        <Skeleton width="80px" height="36px" borderRadius="4px" />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Skeleton width="100px" height="16px" />
        <Skeleton width="120px" height="32px" borderRadius="4px" />
      </div>
    </div>
  </div>
);

// Single item detail skeleton
export const ItemDetailSkeleton = () => (
  <div style={{ padding: '20px', maxWidth: '600px' }}>
    <style>
      {`
        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}
    </style>
    
    {/* Back button */}
    <div style={{ marginBottom: '20px' }}>
      <Skeleton width="80px" height="32px" borderRadius="4px" />
    </div>

    {/* Title */}
    <Skeleton width="300px" height="32px" style={{ marginBottom: '20px' }} />

    {/* Details */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <Skeleton width="80px" height="16px" style={{ marginBottom: '8px' }} />
        <Skeleton width="200px" height="20px" />
      </div>
      
      <div>
        <Skeleton width="60px" height="16px" style={{ marginBottom: '8px' }} />
        <Skeleton width="120px" height="24px" borderRadius="12px" />
      </div>
      
      <div>
        <Skeleton width="40px" height="16px" style={{ marginBottom: '8px' }} />
        <Skeleton width="100px" height="24px" />
      </div>
    </div>
  </div>
);

// Search loading state
export const SearchLoadingSkeleton = () => (
  <div style={{ padding: '10px 0', textAlign: 'center' }}>
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#f8f9fa',
      borderRadius: '20px',
      fontSize: '14px',
      color: '#666'
    }}>
      <div style={{
        width: '16px',
        height: '16px',
        border: '2px solid #e0e0e0',
        borderTop: '2px solid #007bff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      Searching...
    </div>
    
    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

// Empty state component
export const EmptyState = ({ 
  icon = "📭", 
  title = "No items found", 
  description = "Try adjusting your search or filters",
  action = null 
}) => (
  <div style={{
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
      {icon}
    </div>
    <h3 style={{ 
      margin: '0 0 8px 0', 
      fontSize: '20px', 
      fontWeight: '600',
      color: '#333'
    }}>
      {title}
    </h3>
    <p style={{ 
      margin: '0 0 24px 0', 
      fontSize: '16px',
      maxWidth: '400px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      {description}
    </p>
    {action}
  </div>
);

// Error state component  
export const ErrorState = ({ 
  error, 
  onRetry,
  title = "Something went wrong",
  description = "We couldn't load the data. Please try again." 
}) => (
  <div style={{
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
      ⚠️
    </div>
    <h3 style={{ 
      margin: '0 0 8px 0', 
      fontSize: '20px', 
      fontWeight: '600',
      color: '#d73527'
    }}>
      {title}
    </h3>
    <p style={{ 
      margin: '0 0 8px 0', 
      fontSize: '16px',
      maxWidth: '400px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      {description}
    </p>
    {error && (
      <p style={{ 
        fontSize: '14px', 
        color: '#999', 
        fontFamily: 'monospace',
        marginBottom: '24px'
      }}>
        {error.message}
      </p>
    )}
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        Try Again
      </button>
    )}
  </div>
);