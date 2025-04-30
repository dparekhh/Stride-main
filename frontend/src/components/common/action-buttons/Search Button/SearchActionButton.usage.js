/**
 * SearchActionButton Component Usage Analytics
 * 
 * This file tracks usage patterns of the SearchActionButton component
 * across the application for analytics and improvement purposes.
 * 
 * Usage data helps:
 * - Identify which components are most frequently used
 * - Understand typical configuration patterns
 * - Prioritize future improvements
 * - Maintain backward compatibility
 */

// Usage tracking model
export const USAGE_DATA = {
  // Component usage counter
  usageCount: 0,
  
  // Pages where the component is used
  usageLocations: [
    { 
      page: 'Accounting_StrideCardPage', 
      props: {
        placeholder: 'Search by merchant, cardholder, or transaction ID',
        className: 'mr-4'
      }
    }
  ],
  
  // Common prop configurations
  propPatterns: {
    placeholder: [
      { value: 'Search...', count: 0 },
      { value: 'Search by merchant, cardholder, or transaction ID', count: 1 },
      { value: 'Search transactions...', count: 0 },
      { value: 'Search vendors...', count: 0 }
    ],
    width: [
      { value: '3/4', count: 1 },
      { value: 'full', count: 0 },
      { value: '1/2', count: 0 }
    ],
    noBorder: [
      { value: true, count: 0 },
      { value: false, count: 1 }
    ]
  },
  
  // Average response time in ms for the onSearchChange callback
  performanceMetrics: {
    responseTime: {
      average: 22,
      min: 0,
      max: 85
    }
  },
  
  // Issues and feature requests
  feedback: []
};

/**
 * Track a new usage of the SearchActionButton
 * 
 * @param {string} page - The page or component where SearchActionButton is used
 * @param {Object} props - The props configuration
 */
export const trackUsage = (page, props) => {
  if (process.env.NODE_ENV !== 'production') {
    return; // Only track in production
  }
  
  // Increment usage counter
  USAGE_DATA.usageCount++;
  
  // Add to usage locations if not already present
  if (!USAGE_DATA.usageLocations.find(location => location.page === page)) {
    USAGE_DATA.usageLocations.push({
      page,
      props: {
        placeholder: props.placeholder || 'Search...',
        className: props.className || ''
      }
    });
  }
  
  // Update prop patterns
  if (props.placeholder) {
    const placeholderPattern = USAGE_DATA.propPatterns.placeholder.find(
      pattern => pattern.value === props.placeholder
    );
    
    if (placeholderPattern) {
      placeholderPattern.count++;
    } else {
      USAGE_DATA.propPatterns.placeholder.push({
        value: props.placeholder,
        count: 1
      });
    }
  }
  
  if (props.width) {
    const widthPattern = USAGE_DATA.propPatterns.width.find(
      pattern => pattern.value === props.width
    );
    
    if (widthPattern) {
      widthPattern.count++;
    } else {
      USAGE_DATA.propPatterns.width.push({
        value: props.width,
        count: 1
      });
    }
  }
  
  if (props.noBorder !== undefined) {
    const noBorderPattern = USAGE_DATA.propPatterns.noBorder.find(
      pattern => pattern.value === props.noBorder
    );
    
    if (noBorderPattern) {
      noBorderPattern.count++;
    }
  }
  
  // Log usage for development purposes
  if (process.env.NODE_ENV === 'development') {
    console.log('[SearchActionButton] Used in:', page, 'with props:', props);
  }
};

export default {
  trackUsage,
  USAGE_DATA
};