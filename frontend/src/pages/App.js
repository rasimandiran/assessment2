import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import { theme } from '../styles/theme';
import '../styles/responsive.css';

function App() {
  const location = useLocation();
  
  return (
    <DataProvider>
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: theme.colors.backgroundLight,
        fontFamily: theme.typography.fontFamily
      }}>
        {/* Navigation Header */}
        <nav 
          role="banner"
          style={{
            backgroundColor: theme.colors.white,
            borderBottom: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.sm,
            position: 'sticky',
            top: 0,
            zIndex: theme.zIndex.dropdown
          }}
        >
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Link 
              to="/"
              style={{
                textDecoration: 'none',
                color: theme.colors.textPrimary,
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.bold,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm
              }}
              aria-label="Go to Items Catalog home"
            >
              <span role="img" aria-label="Catalog">📚</span>
              Items Catalog
            </Link>
            
            {/* Breadcrumb navigation */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.sm
            }}>
              <Link 
                to="/"
                style={{
                  color: location.pathname === '/' 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary,
                  textDecoration: 'none',
                  fontWeight: location.pathname === '/' 
                    ? theme.typography.fontWeight.medium 
                    : theme.typography.fontWeight.normal
                }}
              >
                Home
              </Link>
              {location.pathname.startsWith('/items/') && (
                <>
                  <span aria-hidden="true">›</span>
                  <span style={{ color: theme.colors.primary }}>
                    Item Details
                  </span>
                </>
              )}
            </div>
          </div>
        </nav>
        
        {/* Main Content */}
        <main role="main">
          <Routes>
            <Route path="/" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetail />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer 
          role="contentinfo"
          style={{
            backgroundColor: theme.colors.white,
            borderTop: `1px solid ${theme.colors.borderLight}`,
            marginTop: theme.spacing.xxl,
            padding: theme.spacing.xl
          }}
        >
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSize.sm
          }}>
            <p style={{ margin: 0 }}>
              Items Catalog • Built with React • Optimized for Performance
            </p>
          </div>
        </footer>
      </div>
    </DataProvider>
  );
}

export default App;