// Simulate the backend response with vendor data
const simulatedResponse = {
  "success": true,
  "extracted_data": {
    "vendor_name": "Sassy SAAS Vendor, Inc.",
    "vendor_address": "123 SaaS Street, Cloud City",
    "vendor_gstin": "29ABCDE1234F1Z1",
    "invoice_number": "INV-12345",
    "invoice_date": "2025-03-10",
    "due_date": "2025-04-10",
    "po_number": "PO-9876",
    "eway_bill_number": "",
    "payment_terms": "Net 30",
    "payment_mode": "Bank Transfer",
    "total_amount": 5000,
    "subtotal_amount": 4500,
    "tax_amount": 500,
    "cgst_amount": 250,
    "sgst_amount": 250,
    "igst_amount": 0,
    "line_items": [
      {
        "description": "SaaS Subscription - Premium",
        "quantity": 1,
        "unit_price": 4500,
        "amount": 4500,
        "tax_rate": 0.11,
        "tax_amount": 500,
        "category_id": null
      }
    ],
    "confidence_scores": {}
  },
  "processing_type": "ocr",
  "vendor_exists": false,
  "vendor_details": null,
  "potential_vendors": [],
  "matching_vendors": []
};

// Log the response
console.log("Simulated response with vendor name:");
console.log(JSON.stringify(simulatedResponse, null, 2));

// Verify the condition that's relevant for the frontend
const loading = false;
const vendorExists = simulatedResponse.vendor_exists;
const extractedData = simulatedResponse.extracted_data;

console.log("\nChecking rendering condition:");
console.log(`!loading && vendorExists === false && extractedData && extractedData.vendor_name`);
console.log(`${!loading} && ${vendorExists === false} && ${Boolean(extractedData)} && ${Boolean(extractedData.vendor_name)}`);
console.log(`Condition satisfied: ${!loading && vendorExists === false && extractedData && extractedData.vendor_name}`);
