import React, { useState, useEffect } from 'react';
import Collapse from 'react-collapse'; // Assuming a collapse library is used

function CollapseLineItem({ index, lineItem, onRemove, onChange, errors }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div key={index} className="line-item">
      <div onClick={() => setIsOpen(!isOpen)} className="line-item-header">
        {/* ... other elements ... */}
        <span>Amount: {lineItem.amount}</span>  {/*Removed bold and hardcoded 00*/}
        {/* ... other elements ... */}
      </div>
      <Collapse isOpened={isOpen}>
        <div className="line-item-details">
          <div>
            <label htmlFor={`description-${index}`}>Description:</label>
            <input
              type="text"
              id={`description-${index}`}
              value={lineItem.description}
              onChange={(e) => onChange('description', e.target.value)}
            />
            {errors.description && <span className="error">{errors.description}</span>}
          </div>
          {/* Removed Location, Category, Customer fields */}
          {/* ... other details ... */}
        </div>
      </Collapse>
    </div>
  );
}


function CreateBill() {
  const [lineItems, setLineItems] = useState([{ description: '', amount: '' }]);
  const [lineItemErrors, setLineItemErrors] = useState({});

  const handleRemoveLineItem = (index) => {
    // ...
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index][field] = value;
    setLineItems(updatedLineItems);
  };

  const renderLineItems = () => {
    return lineItems.map((item, index) => (
      <div key={index} >
        <CollapseLineItem
          index={index}
          lineItem={item}
          onRemove={() => handleRemoveLineItem(index)}
          onChange={(field, value) => handleLineItemChange(index, field, value)}
          errors={lineItemErrors[index] || {}}
        />
      </div>
    ));
  };

  // ... other state and functions ...

  return (
    <div>
      {/* ... other elements ... */}
      <div className="line-items">
        {renderLineItems()}
      </div>
      {/* ... other elements ... */}
    </div>
  );
}

export default CreateBill;