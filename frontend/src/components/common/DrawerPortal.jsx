import React from 'react';
import { createPortal } from 'react-dom';

/**
 * DrawerPortal Component
 * 
 * This component uses React's createPortal to render its children at the document body level,
 * outside of any parent component's DOM hierarchy. This prevents issues with nested
 * drawers inheriting constraints from their parent components.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render in the portal
 * @returns {React.ReactPortal} Portal rendering children at document body level
 */
const DrawerPortal = ({ children }) => {
  return createPortal(
    children,
    document.body
  );
};

export default DrawerPortal;