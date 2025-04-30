import React, { createContext, useContext, useState, useCallback } from 'react';

// Z-index levels for different drawer layers
export const Z_INDEX_LEVELS = {
  BASE: 50,
  LEVEL_1: 60,
  LEVEL_2: 70,
  LEVEL_3: 80,
  LEVEL_4: 90,
  MODAL: 1000, // Higher z-index for modals to appear on top of all drawers
};

// Create the context
const DrawerContext = createContext();

/**
 * DrawerProvider component
 * Provides drawer management functionality to its children
 */
export const DrawerProvider = ({ children }) => {
  // State to keep track of active drawers in a stack - all drawers are standalone
  const [activeDrawerStack, setActiveDrawerStack] = useState([]);

  /**
   * Opens a drawer and adds it to the active drawers stack
   * @param {string} drawerId - Unique identifier for the drawer
   * @param {number} zIndexLevel - Z-index level for the drawer
   */
  const openDrawer = useCallback((drawerId, zIndexLevel = Z_INDEX_LEVELS.BASE) => {
    setActiveDrawerStack(prev => {
      // Check if drawer is already in the stack
      if (prev.some(drawer => drawer.id === drawerId)) {
        // Reorder the stack to bring this drawer to the top
        const filteredDrawers = prev.filter(drawer => drawer.id !== drawerId);
        return [...filteredDrawers, { 
          id: drawerId, 
          zIndex: zIndexLevel
        }];
      }
      // Add the new drawer to the top of the stack
      return [...prev, { 
        id: drawerId, 
        zIndex: zIndexLevel
      }];
    });
  }, []);

  /**
   * Closes a drawer and removes it from the active drawers stack
   * @param {string} drawerId - Unique identifier for the drawer
   */
  const closeDrawer = useCallback((drawerId) => {
    // Remove only the specified drawer
    setActiveDrawerStack(prev => 
      prev.filter(drawer => drawer.id !== drawerId)
    );
  }, []);

  /**
   * Gets the z-index for a drawer
   * @param {string} drawerId - Unique identifier for the drawer
   * @returns {number} - Z-index value for the drawer
   */
  const getZIndex = useCallback((drawerId) => {
    const drawer = activeDrawerStack.find(drawer => drawer.id === drawerId);
    return drawer ? drawer.zIndex : Z_INDEX_LEVELS.BASE;
  }, [activeDrawerStack]);

  /**
   * Checks if a drawer is the topmost one in the stack
   * @param {string} drawerId - Unique identifier for the drawer
   * @returns {boolean} - Whether the drawer is the topmost one
   */
  const isTopmostDrawer = useCallback((drawerId) => {
    if (activeDrawerStack.length === 0) return false;
    
    // Get the drawer with the highest z-index
    const sortedDrawers = [...activeDrawerStack].sort((a, b) => b.zIndex - a.zIndex);
    const topmostDrawer = sortedDrawers[0];
    
    // Check if this drawer is the topmost one
    return topmostDrawer && topmostDrawer.id === drawerId;
  }, [activeDrawerStack]);

  /**
   * Checks if a drawer should show its backdrop
   * This will only be true for the topmost drawer to prevent stacking of backdrops
   * @param {string} drawerId - Unique identifier for the drawer
   * @returns {boolean} - Whether the drawer should show its backdrop
   */
  const shouldShowBackdrop = useCallback((drawerId) => {
    // Only the topmost drawer should show a backdrop
    return isTopmostDrawer(drawerId);
  }, [isTopmostDrawer]);
  
  /**
   * Checks if a drawer is a nested drawer (not the first in the stack)
   * @param {string} drawerId - Unique identifier for the drawer
   * @returns {boolean} - Whether the drawer is nested
   */
  const isNestedDrawer = useCallback((drawerId) => {
    // If there's only one or no drawers, it can't be nested
    if (activeDrawerStack.length <= 1) return false;
    
    // Get the index of this drawer in the stack
    const index = activeDrawerStack.findIndex(drawer => drawer.id === drawerId);
    
    // If it's not found or it's the first item, it's not nested
    if (index <= 0) return false;
    
    // Otherwise it's a nested drawer
    return true;
  }, [activeDrawerStack]);

  // Value to be provided by the context
  const value = {
    activeDrawers: activeDrawerStack,
    openDrawer,
    closeDrawer,
    getZIndex,
    shouldShowBackdrop,
    isTopmostDrawer,
    isNestedDrawer,
  };

  return (
    <DrawerContext.Provider value={value}>
      {children}
    </DrawerContext.Provider>
  );
};

/**
 * Custom hook to use the drawer context
 */
export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

export default DrawerContext;