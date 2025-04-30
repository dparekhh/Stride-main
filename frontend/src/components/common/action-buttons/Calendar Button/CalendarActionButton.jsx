import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * CalendarActionButton Component
 * 
 * A reusable button component that shows a calendar icon and manages 
 * a dropdown for date range selection.
 * 
 * Features:
 * - Calendar icon button with dropdown menu
 * - Predefined date range options (Today, Yesterday, This month, Last month)
 * - Custom date range with start/end date inputs
 * - Support for applying and resetting date filters
 * - Tooltips for better UX
 * - Outside click handling
 */
const CalendarActionButton = ({
  onDateRangeChange,
  initialDateRange = "Current month",
  position = "bottom",
  customDateFormat,
  tooltipText = "Calendar",
  className = "",
  disabled = false
}) => {
  // Dropdown state
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  
  // Calendar UI state
  const today = new Date();
  const [leftMonth, setLeftMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [rightMonth, setRightMonth] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 1));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectingStart, setSelectingStart] = useState(true);
  
  // Refs for click outside detection
  const calendarRef = useRef(null);
  const calendarButtonRef = useRef(null);

  // Date helper functions
  const getCurrentMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    };
  };

  const getLastMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
    return {
      start: firstDay.toISOString().split('T')[0],
      end: lastDay.toISOString().split('T')[0]
    };
  };

  const getToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return { start: today, end: today };
  };

  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    return { start: yesterdayStr, end: yesterdayStr };
  };
  
  // Calendar UI helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const navigateMonth = (direction) => {
    const newLeftMonth = new Date(leftMonth);
    newLeftMonth.setMonth(newLeftMonth.getMonth() + direction);
    setLeftMonth(newLeftMonth);
    
    const newRightMonth = new Date(newLeftMonth);
    newRightMonth.setMonth(newRightMonth.getMonth() + 1);
    setRightMonth(newRightMonth);
  };
  
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (date) => {
    if (!startDate && !endDate) return false;
    
    if (startDate && !endDate) {
      return date.getTime() === startDate.getTime();
    }
    
    if (startDate && endDate) {
      return date.getTime() >= startDate.getTime() && date.getTime() <= endDate.getTime();
    }
    
    return false;
  };
  
  const isInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime();
  };
  
  const handleDateClick = (date) => {
    if (selectingStart) {
      setStartDate(date);
      setEndDate(null);
      setSelectingStart(false);
      
      // Set customStartDate for the form
      setCustomStartDate(date.toISOString().split('T')[0]);
    } else {
      // Ensure end date is not before start date
      if (date < startDate) {
        setEndDate(startDate);
        setStartDate(date);
        
        // Update form values
        setCustomStartDate(date.toISOString().split('T')[0]);
        setCustomEndDate(startDate.toISOString().split('T')[0]);
      } else {
        setEndDate(date);
        
        // Update form value
        setCustomEndDate(date.toISOString().split('T')[0]);
      }
      setSelectingStart(true);
    }
  };

  // Function to handle date range selection
  const applyDateFilter = (range) => {
    setDateRange(range);

    if (range === "Custom range") {
      // Show custom date range UI and hide the dropdown
      setShowCustomDateRange(true);
      setShowCalendarDropdown(false);
      
      // Initialize with the current month in the calendar UI
      const currentMonthObj = getCurrentMonth();
      
      // Reset any previously selected dates
      setStartDate(null);
      setEndDate(null);
      setCustomStartDate("");
      setCustomEndDate("");
      
    } else {
      setShowCustomDateRange(false);
      setShowCalendarDropdown(false);
      
      // Apply date range filter based on selection
      let dateObj;
      switch (range) {
        case "Today":
          dateObj = getToday();
          break;
        case "Yesterday":
          dateObj = getYesterday();
          break;
        case "This month":
          dateObj = getCurrentMonth();
          break;
        case "Last month":
          dateObj = getLastMonth();
          break;
        default:
          // Default to current month
          dateObj = getCurrentMonth();
          break;
      }

      // Call the callback with the selected date range
      if (onDateRangeChange && dateObj) {
        onDateRangeChange({
          startDate: dateObj.start,
          endDate: dateObj.end,
          label: range
        });
      }
    }
  };

  // Reset date filters
  const resetDateFilters = () => {
    setDateRange("Current month");
    setCustomStartDate("");
    setCustomEndDate("");
    setShowCustomDateRange(false);

    // Reset to default (current month)
    const currentMonth = getCurrentMonth();
    if (onDateRangeChange) {
      onDateRangeChange({
        startDate: currentMonth.start,
        endDate: currentMonth.end,
        label: "Current month"
      });
    }
  };

  // Apply custom date range
  const applyCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      // Call the callback with the custom date range
      if (onDateRangeChange) {
        onDateRangeChange({
          startDate: customStartDate,
          endDate: customEndDate,
          label: "Custom range"
        });
      }

      setShowCustomDateRange(false);
      setShowCalendarDropdown(false);
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && 
          !calendarRef.current.contains(e.target) && 
          calendarButtonRef.current && 
          !calendarButtonRef.current.contains(e.target)) {
        setShowCalendarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Position class based on the position prop
  const positionClass = position === "top" 
    ? "bottom-full mb-2" 
    : "top-full mt-2";

  // Get ordinal suffix for day (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };
  
  // Format dates for display with ordinal day
  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const ordinalDay = getOrdinalSuffix(day);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
    return `${ordinalDay} ${month}'${year}`;
  };
  
  // Format month names for display
  const formatMonthYear = (date) => {
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
    return `${month}'${year}`;
  };
  
  // Format date range for the button
  const getButtonDisplayText = () => {
    const now = new Date();
    const currentMonthYear = formatMonthYear(now);
    
    // Create a date for last month
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);
    const lastMonthYear = formatMonthYear(lastMonth);
    
    if (dateRange === "Today") {
      return "Today";
    } else if (dateRange === "Yesterday") {
      return "Yesterday";
    } else if (dateRange === "This month") {
      return currentMonthYear;
    } else if (dateRange === "Last month") {
      return lastMonthYear;
    } else if (dateRange === "Custom range" && customStartDate && customEndDate) {
      const startDisplay = formatShortDate(customStartDate);
      const endDisplay = formatShortDate(customEndDate);
      return `${startDisplay} - ${endDisplay}`;
    }
    
    return null;
  };
  
  return (
    <div className={`relative ${className}`}>
      <button
        ref={calendarButtonRef}
        className={`${getButtonDisplayText() ? 'py-1 pl-2 pr-1' : 'p-2'} rounded-md hover:bg-gray-100 border border-gray-200 flex items-center gap-1 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        title={tooltipText}
        onClick={() => {
          if (!disabled) {
            if (showCustomDateRange) {
              // If custom date range UI is active, close it
              setShowCustomDateRange(false);
            }
            setShowCalendarDropdown(!showCalendarDropdown);
          }
        }}
        disabled={disabled}
        aria-label="Toggle calendar dropdown"
      >
        {getButtonDisplayText() ? (
          <>
            <Calendar size={16} className="mr-1" />
            <span className="text-xs">{getButtonDisplayText()}</span>
          </>
        ) : (
          <Calendar size={20} />
        )}
      </button>

      {/* Regular calendar dropdown */}
      {showCalendarDropdown && !showCustomDateRange && (
        <div 
          ref={calendarRef} 
          className={`absolute right-0 ${positionClass} w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10`}
          aria-label="Date range selection dropdown"
        >
          <div className="p-2">
            <p className="text-xs text-gray-500 mb-2">Select date range</p>
            {["Today", "Yesterday", "This month", "Last month", "Custom range"].map(range => (
              <button
                key={range}
                className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                  dateRange === range 
                    ? 'bg-orange-50 text-orange-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => applyDateFilter(range)}
              >
                {range}
              </button>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={resetDateFilters}
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Date Range UI */}
      {showCustomDateRange && (
        <div 
          ref={calendarRef} 
          className="absolute right-0 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-10"
          aria-label="Custom date range selection"
        >
          <div className="p-3">
            {/* Header with back button */}
            <div className="flex items-center mb-4">
              <button 
                onClick={() => {
                  setShowCustomDateRange(false);
                  setShowCalendarDropdown(true);
                }}
                className="p-1 text-gray-500 hover:text-gray-700 mr-2"
                aria-label="Back to date range options"
              >
                <ArrowLeft size={16} />
              </button>
              <span className="text-sm font-medium">Select date range</span>
            </div>
            
            {/* Custom Calendar UI */}
            <div className="mb-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <button 
                  onClick={() => navigateMonth(-12)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Previous year"
                >
                  <ChevronsLeft size={16} />
                </button>
                <button 
                  onClick={() => navigateMonth(-1)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-gray-600">{`${getMonthName(leftMonth)} — ${getMonthName(rightMonth)}`}</span>
                <button 
                  onClick={() => navigateMonth(1)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Next month"
                >
                  <ChevronRight size={16} />
                </button>
                <button 
                  onClick={() => navigateMonth(12)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Next year"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
              
              <div className="flex justify-between w-full">
                {/* Left month calendar */}
                <div className="w-1/2 pr-2">
                  <div className="text-xs text-center mb-2">{getMonthName(leftMonth)}</div>
                  <div className="grid grid-cols-7 gap-0">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={`left-${day}`} className="h-6 w-6 flex items-center justify-center text-[10px] text-gray-500">
                        {day}
                      </div>
                    ))}
                    
                    {Array.from({ length: getFirstDayOfMonth(leftMonth.getFullYear(), leftMonth.getMonth()) }).map((_, i) => (
                      <div key={`left-empty-${i}`} className="h-6 w-6"></div>
                    ))}
                    
                    {Array.from({ length: getDaysInMonth(leftMonth.getFullYear(), leftMonth.getMonth()) }).map((_, i) => {
                      const date = new Date(leftMonth.getFullYear(), leftMonth.getMonth(), i + 1);
                      const isCurrentDay = isToday(date);
                      const isDateSelected = isSelected(date);
                      const isDateInRange = isInRange(date);
                      
                      return (
                        <div 
                          key={`left-day-${i}`}
                          onClick={() => handleDateClick(date)}
                          className={`h-6 w-6 flex items-center justify-center text-[10px] cursor-pointer 
                            ${isCurrentDay ? 'text-orange-700 font-bold' : 'text-gray-700'}
                            ${isDateSelected && startDate && endDate && date.getTime() === startDate.getTime() ? 'bg-orange-600 text-white rounded-l-full' : ''}
                            ${isDateSelected && startDate && endDate && date.getTime() === endDate.getTime() ? 'bg-orange-600 text-white rounded-r-full' : ''}
                            ${isDateSelected && !(date.getTime() === startDate?.getTime() || date.getTime() === endDate?.getTime()) ? 'bg-orange-100' : ''}
                            ${isDateSelected && startDate && !endDate ? 'bg-orange-600 text-white rounded-full' : ''}
                            ${isDateInRange ? 'bg-orange-100' : ''}
                            hover:bg-gray-50
                          `}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Right month calendar */}
                <div className="w-1/2 pl-2">
                  <div className="text-xs text-center mb-2">{getMonthName(rightMonth)}</div>
                  <div className="grid grid-cols-7 gap-0">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={`right-${day}`} className="h-6 w-6 flex items-center justify-center text-[10px] text-gray-500">
                        {day}
                      </div>
                    ))}
                    
                    {Array.from({ length: getFirstDayOfMonth(rightMonth.getFullYear(), rightMonth.getMonth()) }).map((_, i) => (
                      <div key={`right-empty-${i}`} className="h-6 w-6"></div>
                    ))}
                    
                    {Array.from({ length: getDaysInMonth(rightMonth.getFullYear(), rightMonth.getMonth()) }).map((_, i) => {
                      const date = new Date(rightMonth.getFullYear(), rightMonth.getMonth(), i + 1);
                      const isCurrentDay = isToday(date);
                      const isDateSelected = isSelected(date);
                      const isDateInRange = isInRange(date);
                      
                      return (
                        <div 
                          key={`right-day-${i}`}
                          onClick={() => handleDateClick(date)}
                          className={`h-6 w-6 flex items-center justify-center text-[10px] cursor-pointer 
                            ${isCurrentDay ? 'text-orange-700 font-bold' : 'text-gray-700'}
                            ${isDateSelected && startDate && endDate && date.getTime() === startDate.getTime() ? 'bg-orange-600 text-white rounded-l-full' : ''}
                            ${isDateSelected && startDate && endDate && date.getTime() === endDate.getTime() ? 'bg-orange-600 text-white rounded-r-full' : ''}
                            ${isDateSelected && !(date.getTime() === startDate?.getTime() || date.getTime() === endDate?.getTime()) ? 'bg-orange-100' : ''}
                            ${isDateSelected && startDate && !endDate ? 'bg-orange-600 text-white rounded-full' : ''}
                            ${isDateInRange ? 'bg-orange-100' : ''}
                            hover:bg-gray-50
                          `}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mb-3">
              <span className="text-xs text-gray-600">
                {startDate && `${startDate.toLocaleDateString()}`}
                {startDate && endDate && ' — '}
                {endDate && `${endDate.toLocaleDateString()}`}
              </span>
              <button
                className="text-xs text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                  setCustomStartDate('');
                  setCustomEndDate('');
                }}
              >
                Reset
              </button>
            </div>
            
            <button
              className="w-full py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500"
              onClick={applyCustomDateRange}
              disabled={!customStartDate || !customEndDate}
              aria-label="Apply custom date range"
            >
              Apply Custom Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

CalendarActionButton.propTypes = {
  /** Callback function when date range changes */
  onDateRangeChange: PropTypes.func.isRequired,
  /** Initial date range selection */
  initialDateRange: PropTypes.string,
  /** Dropdown menu position (top or bottom) */
  position: PropTypes.oneOf(['top', 'bottom']),
  /** Optional date format override */
  customDateFormat: PropTypes.string,
  /** Tooltip text for the button */
  tooltipText: PropTypes.string,
  /** Optional CSS classes */
  className: PropTypes.string,
  /** Whether the button is disabled */
  disabled: PropTypes.bool
};

export default CalendarActionButton;