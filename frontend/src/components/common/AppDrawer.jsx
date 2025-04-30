import React, { useId } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useDrawer, Z_INDEX_LEVELS } from '../../contexts/DrawerContext';

/**
 * Reusable drawer component that slides in from the right
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked (optional)
 * @param {React.ReactNode} props.title - Title to display in the drawer header
 * @param {React.ReactNode} props.description - Optional description to display in the drawer header
 * @param {React.ReactNode} props.children - Content to display in the drawer
 * @param {React.ReactNode} props.footer - Optional footer content for fixed footer
 * @param {React.ReactNode} props.headerActions - Optional actions to display in the header (right side)
 * @param {String} props.headerPrefix - Optional prefix label for back button (e.g. "Back to Dashboard")
 * @param {String} props.width - Width of the drawer (default: 1/2 of screen)
 * @param {boolean} props.showCloseButton - Whether to show the close button (default: true)
 * @param {boolean} props.showBackButton - Whether to show the back button (default: false)
 * @param {boolean} props.isNestedDrawer - Explicitly set whether this is a nested drawer (overrides auto-detection)
 * @param {String} props.contentPadding - Padding for the content area (default: 'p-6')
 * @param {number} props.zIndex - Z-index for the drawer (default: 50)
 * @param {String} props.id - Optional unique ID for the drawer (auto-generated if not provided)
 * @param {boolean} props.usePortal - Whether this drawer is using a portal (default: false)
 * @returns {React.ReactElement} Drawer component
 */
const AppDrawer = ({ 
  isOpen, 
  onClose, 
  onBack,
  title, 
  description, 
  children, 
  footer,
  headerActions,
  headerPrefix,
  width = 'md:w-1/2', // Default width for drawers
  showCloseButton = true,
  showBackButton = false,
  isNestedDrawer = null, // Can explicitly set this to override detection
  contentPadding = 'p-6',
  zIndex = Z_INDEX_LEVELS.BASE,
  id: propId,
  usePortal = false
}) => {
  // Generate a unique ID for this drawer if not provided
  const generatedId = useId();
  const drawerId = propId || `drawer-${generatedId}`;
  
  // Get drawer context to manage backdrops and z-index
  const { 
    openDrawer, 
    closeDrawer, 
    shouldShowBackdrop, 
    getZIndex,
    isNestedDrawer: checkIsNestedDrawer
  } = useDrawer();
  
  // Handle back button click
  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };
  
  // Register/unregister this drawer with the context when opened/closed
  React.useEffect(() => {
    if (isOpen) {
      // Register the drawer with the context
      openDrawer(drawerId, zIndex);
    }
    
    // Clean up function that runs when component unmounts or dependencies change
    return () => {
      // Only close the drawer if it was opened
      if (isOpen) {
        closeDrawer(drawerId);
      }
    };
  }, [isOpen, drawerId, zIndex, openDrawer, closeDrawer]);
  
  if (!isOpen) return null;
  
  // Determine if this drawer should show a backdrop
  const showBackdrop = shouldShowBackdrop(drawerId);
  
  // Get the actual z-index from the drawer context to ensure proper stacking
  const actualZIndex = getZIndex(drawerId);

  // Should we show the back button (either explicitly set or if onBack is provided)
  const shouldShowBackButton = showBackButton || Boolean(onBack);
  
  // Determine if this is a nested drawer (from context or by explicit prop)
  const isNested = isNestedDrawer !== null ? isNestedDrawer : checkIsNestedDrawer(drawerId);

  return (
    <div 
      className={`fixed inset-0 flex justify-end overflow-hidden drawer-container`} 
      style={{ zIndex: actualZIndex }}
      data-drawer-id={drawerId}
    >
      {/* Backdrop with blur - only shown for topmost drawer */}
      {showBackdrop && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm transition-opacity drawer-backdrop"
          onClick={onClose}
          data-backdrop-for={drawerId}
        ></div>
      )}
      
      {/* Drawer content */}
      <div 
        className={`relative w-full ${width} bg-white shadow-xl h-full flex flex-col drawer-content`}
        style={{
          animation: 'slideInFromRight 0.3s ease-out forwards',
          maxWidth: '50%',
        }}
        data-drawer-content-id={drawerId}
        data-width={width}
        data-nested-drawer={isNested ? 'true' : 'false'}
      >
        {/* Header - only shown if title is provided or if back button is present */}
        {(title || shouldShowBackButton) && (
          <>
            <div className="py-4 px-6 bg-white border-b border-gray-200">
              {isNested ? (
                // Nested drawer header layout - back button and close on the same line, title below
                <>
                  {/* Top row with back button and close button */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      {shouldShowBackButton && (
                        <button 
                          onClick={handleBack}
                          className="text-gray-500 hover:text-gray-700 flex items-center"
                        >
                          <ArrowLeft size={18} className="mr-2" />
                          <span>{headerPrefix || "Back"}</span>
                        </button>
                      )}
                    </div>
                    
                    {showCloseButton && (
                      <button
                        className="text-gray-500 hover:text-gray-700 p-1"
                        onClick={onClose}
                        aria-label="Close"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  
                  {/* Title and description on second row */}
                  {title && (
                    <div>
                      <h2 className="text-xl font-bold">{title}</h2>
                      {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
                    </div>
                  )}
                </>
              ) : (
                // Primary drawer header layout - title and close on the same line
                <>
                  {/* Back button (if applicable) - separate row */}
                  {shouldShowBackButton && (
                    <div className="mb-3">
                      <button 
                        onClick={handleBack}
                        className="text-gray-500 hover:text-gray-700 flex items-center"
                      >
                        <ArrowLeft size={18} className="mr-2" />
                        <span>{headerPrefix || "Back"}</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Title and close button on same line */}
                  <div className="flex items-center justify-between">
                    {title && (
                      <div className="flex-1">
                        <h2 className="text-xl font-bold">{title}</h2>
                        {description && <p className="text-gray-500 text-sm mt-1">{description}</p>}
                      </div>
                    )}
                    
                    {showCloseButton && (
                      <button
                        className="text-gray-500 hover:text-gray-700 p-1 ml-2"
                        onClick={onClose}
                        aria-label="Close"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Header actions - below header */}
            {headerActions && (
              <div className="bg-white">
                {headerActions}
              </div>
            )}
          </>
        )}
        
        {/* Scrollable content */}
        <div className={`flex-1 overflow-y-auto ${contentPadding}`}>
          {children}
        </div>
        
        {/* Footer if provided */}
        {footer && (
          <div className="border-t border-gray-200 p-4 bg-white">
            {footer}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AppDrawer;