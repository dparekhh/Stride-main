import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MoreVertical } from 'lucide-react';

/**
 * AccountingStrideCard_3dotsButton - A reusable dropdown menu button component
 * 
 * This component displays a three-dots menu button that opens a dropdown menu
 * with configurable menu items. It handles outside clicks to automatically close
 * the menu and supports positioning the dropdown above or below the button.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.menuItems - Array of menu items to display
 * @param {string} props.position - Position of the dropdown menu ('top' or 'bottom')
 */
const AccountingStrideCard_3dotsButton = ({ menuItems, position = 'bottom' }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Toggle the menu display
  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  // Check if there are any selected transactions when a menu item is clicked
  const handleMenuItemClick = (onClick) => {
    setShowMenu(false);
    
    // Call the onClick handler if it exists
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
        aria-label="More actions"
      >
        <MoreVertical size={16} className="text-gray-700" />
      </button>
      
      {showMenu && (
        <div 
          ref={menuRef}
          className={`absolute ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 w-56 bg-white rounded-md shadow-lg overflow-hidden border border-gray-200 z-50`}
          style={{ minWidth: '220px' }}
        >
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuItemClick(item.onClick)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

AccountingStrideCard_3dotsButton.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func
    })
  ).isRequired,
  position: PropTypes.oneOf(['top', 'bottom'])
};

export default AccountingStrideCard_3dotsButton;