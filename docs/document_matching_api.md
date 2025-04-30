# Document Matching API

This document describes the document matching API endpoints for the Stride platform, which provide 2-way and 3-way matching capabilities with NLP-enhanced semantic comparison.

## Overview

Document matching is a critical process in accounts payable for validating invoices against purchase orders (2-way matching) and goods receipt notes (3-way matching). The Stride platform uses Document AI with Form Parser to perform intelligent matching that can:

1. Extract structured data from different document types
2. Semantically compare line items across documents
3. Identify discrepancies in quantities, prices, and amounts
4. Generate detailed matching reports with confidence scores

## Endpoints

### Document Matching Check

**Endpoint:** `/api/matching/check`

**Method:** `POST`

**Description:** Performs either 2-way or 3-way matching between business documents with NLP capabilities.

**Query Parameters:**
- `type` (optional): The type of matching to perform. Valid values:
  - `two_way` (default): Matches PO and Invoice
  - `three_way`: Matches PO, Invoice, and GRN
- `useNLP` (optional): Whether to use NLP capabilities. Valid values:
  - `true` (default): Uses Form Parser for semantic matching
  - `false`: Uses basic OCR for text-based matching

**Form Data:**
- For 2-way matching:
  - `po`: Purchase Order document file (PDF or image)
  - `invoice`: Invoice document file (PDF or image)
- For 3-way matching:
  - `po`: Purchase Order document file (PDF or image)
  - `invoice`: Invoice document file (PDF or image)
  - `grn`: Goods Receipt Note document file (PDF or image)

**Response:**
```json
{
  "success": true,
  "matching_type": "two_way",
  "nlp_enabled": true,
  "documents": {
    "po": {
      "document_file": "/path/to/po.pdf",
      "document_id": "PO-12345"
    },
    "invoice": {
      "document_file": "/path/to/invoice.pdf",
      "document_id": "INV-67890"
    }
  },
  "matching_results": {
    "match_status": "partial",
    "matched_items": [ /* Array of matched line items */ ],
    "unmatched_items": [ /* Array of unmatched line items */ ],
    "discrepancies": [
      {
        "field": "quantity",
        "item": "Laptop - Dell XPS 15",
        "po_value": 2,
        "invoice_value": 3,
        "difference": 1
      }
    ],
    "summary": {
      "total_po_items": 5,
      "matched_items_count": 4,
      "unmatched_items_count": 1,
      "discrepancies_count": 1,
      "match_percentage": 80.0
    }
  },
  "summary": "Documents partially match with 1 discrepancies found."
}
```

## Matching Algorithms

### Semantic Matching

When NLP is enabled, the API uses the following approach for matching line items:

1. Standardizes text by removing punctuation and noise
2. Performs exact match check
3. Checks if one description contains the other
4. Calculates Jaccard similarity between word sets
5. Considers items matching if similarity is above threshold (default: 0.7)

This allows for effective matching even when item descriptions have different wording.

### Discrepancy Detection

The API checks for discrepancies in:

- **Quantity**: Compares the number of items between documents
- **Unit Price**: Compares the price per unit
- **Amount**: Compares the total amount for the item

For 3-way matching, it additionally checks for quantity alignment across all three documents.

## Match Status

The API returns one of three match statuses:

- **complete**: All items matched with no discrepancies
- **partial**: Some items matched or there are discrepancies
- **none**: No matching items found

## Usage Best Practices

1. **Document Quality**: Ensure uploaded documents are clear and legible
2. **Processing Mode**: Always use NLP mode (`useNLP=true`) for semantic matching
3. **Error Handling**: Check both the `success` flag and `error` field in responses
4. **Discrepancy Review**: Always review the `discrepancies` array for detailed information
5. **Match Percentage**: Use the `match_percentage` in the summary to evaluate overall match quality

## Implementation Notes

- All document processing occurs in real-time
- Tenant isolation ensures data privacy
- Both PDF and image formats are supported
- Document processing logs are available for debugging