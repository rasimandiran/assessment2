import React, { memo } from 'react';
import { List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Link } from 'react-router-dom';
import { theme, commonStyles } from '../styles/theme';

// Memoized row component for performance
const Row = ({ index, style, data }) => {
  const item = data[index];
  const isEven = index % 2 === 0;
  
  if (!item) return null;
  
  return (
    <div style={style}>
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: theme.spacing.lg,
          borderBottom: `1px solid ${theme.colors.borderLight}`,
          backgroundColor: isEven ? theme.colors.white : theme.colors.gray50,
          height: '100%',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = theme.colors.primaryLight;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = isEven ? theme.colors.white : theme.colors.gray50;
        }}
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
          onFocus={(e) => {
            e.target.style.outline = `2px solid ${theme.colors.primary}`;
            e.target.style.outlineOffset = '2px';
          }}
          onBlur={(e) => {
            e.target.style.outline = 'none';
          }}
        >
          <span role="img" aria-label="Item">📦</span>
          {item.name}
        </Link>
        
        <div style={{ 
          display: 'flex', 
          gap: theme.spacing.md, 
          alignItems: 'center' 
        }}>
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
              fontSize: theme.typography.fontSize.md,
              minWidth: '80px', 
              textAlign: 'right'
            }}>
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