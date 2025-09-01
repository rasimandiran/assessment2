import React, { memo } from 'react';
import { List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Link } from 'react-router-dom';

// Memoized row component for performance
const Row = ({ index, style, data }) => {
  const item = data[index];
  
  if (!item) return null;
  
  return (
    <div style={style}>
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid #eee',
          height: '100%'
        }}
      >
        <Link 
          to={`/items/${item.id}`}
          style={{ 
            textDecoration: 'none', 
            color: '#0066cc',
            flex: 1
          }}
        >
          {item.name}
        </Link>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {item.category && (
            <span style={{ 
              padding: '2px 8px',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {item.category}
            </span>
          )}
          {item.price && (
            <span style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
              ${item.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

function VirtualizedItemList({ items = [], height = 600 }) {
  // Ensure items is always an array
  const itemsArray = Array.isArray(items) ? items : [];
  
  // Calculate container height - can be responsive
  const containerHeight = height === 'auto' 
    ? window.innerHeight - 250 // Subtract header, search bar, pagination
    : height;

  // If no items, show empty state
  if (itemsArray.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No items to display</div>;
  }

  // If using auto height, use AutoSizer
  if (height === 'auto') {
    return (
      <div style={{ flex: 1, height: '100%', minHeight: '400px' }}>
        <AutoSizer>
          {({ height: autoHeight, width }) => (
            <List
              height={autoHeight}
              itemCount={itemsArray.length}
              itemSize={60}
              width={width}
              itemData={itemsArray}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
    );
  }

  // Fixed height version
  return (
    <List
      height={containerHeight}
      itemCount={itemsArray.length}
      itemSize={60}
      width="100%"
      itemData={itemsArray}
    >
      {Row}
    </List>
  );
}

export default VirtualizedItemList;