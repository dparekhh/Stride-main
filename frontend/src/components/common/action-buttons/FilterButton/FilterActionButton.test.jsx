import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterActionButton from './FilterActionButton';

// Mock data
const mockColumns = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Status', accessor: 'status' },
  { Header: 'Date', accessor: 'date', filterName: 'Date Range' }
];

const mockSuggestedFilters = [
  { id: 'recent', label: 'Recent Items' },
  { id: 'flagged', label: 'Flagged Items' }
];

describe('FilterActionButton', () => {
  const mockOnFilterChange = jest.fn();
  
  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });
  
  test('renders without crashing', () => {
    render(
      <FilterActionButton
        columns={mockColumns}
        onFilterChange={mockOnFilterChange}
      />
    );
    expect(screen.getByLabelText('Toggle filter dropdown')).toBeInTheDocument();
  });
  
  test('shows dropdown when button is clicked', () => {
    render(
      <FilterActionButton
        columns={mockColumns}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const button = screen.getByLabelText('Toggle filter dropdown');
    fireEvent.click(button);
    
    expect(screen.getByLabelText('Filter selection dropdown')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });
  
  test('renders suggested filters when provided', () => {
    render(
      <FilterActionButton
        columns={mockColumns}
        onFilterChange={mockOnFilterChange}
        customSuggestedFilters={mockSuggestedFilters}
      />
    );
    
    const button = screen.getByLabelText('Toggle filter dropdown');
    fireEvent.click(button);
    
    expect(screen.getByText('Suggested')).toBeInTheDocument();
    expect(screen.getByText('Recent Items')).toBeInTheDocument();
    expect(screen.getByText('Flagged Items')).toBeInTheDocument();
  });
  
  test('calls onFilterChange when a filter is selected', () => {
    render(
      <FilterActionButton
        columns={mockColumns}
        onFilterChange={mockOnFilterChange}
        customSuggestedFilters={mockSuggestedFilters}
      />
    );
    
    const button = screen.getByLabelText('Toggle filter dropdown');
    fireEvent.click(button);
    
    const flaggedButton = screen.getByText('Flagged Items');
    fireEvent.click(flaggedButton);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('flagged');
  });
  
  test('filters columns based on search input', () => {
    render(
      <FilterActionButton
        columns={mockColumns}
        onFilterChange={mockOnFilterChange}
      />
    );
    
    const button = screen.getByLabelText('Toggle filter dropdown');
    fireEvent.click(button);
    
    // Should show all columns initially
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    
    // Filter for 'date'
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'date' } });
    
    // Only Date Range should be visible now
    expect(screen.queryByText('Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Status')).not.toBeInTheDocument();
    expect(screen.getByText('Date Range')).toBeInTheDocument();
  });
  
  test('is disabled when disabled prop is true', () => {
    render(
      <FilterActionButton
        columns={mockColumns}
        onFilterChange={mockOnFilterChange}
        disabled={true}
      />
    );
    
    const button = screen.getByLabelText('Toggle filter dropdown');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    // Dropdown should not appear when disabled
    expect(screen.queryByLabelText('Filter selection dropdown')).not.toBeInTheDocument();
  });
});