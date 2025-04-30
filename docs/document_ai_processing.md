# Document AI Processing in Stride

This document provides an overview of how Document AI processing works in the Stride platform, including the dual processing modes (basic OCR and advanced NLP) and API usage.

## Overview

Stride integrates with Google Document AI to provide intelligent document processing capabilities. The system supports two processing modes:

1. **Basic OCR Mode** (`useNLP=false`): Uses the Document AI Enterprise Document OCR processor for efficient text extraction.
2. **Advanced NLP Mode** (`useNLP=true`): Uses the Document AI Form Parser with enhanced NLP capabilities for deeper document understanding, entity extraction, and form field recognition.

## Document Types Supported

The system can process multiple document types:

- Invoices 
- Receipts
- Purchase Orders (POs)
- Goods Receipt Notes (GRNs)
- Expense Policies

## API Usage

All document processing endpoints support the `useNLP` parameter to control the processing mode:

```
POST /api/documents/invoices/extract?useNLP=true
```

### Request Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `useNLP` | Boolean | When set to `true`, enables advanced NLP processing. Default is `false`. |
| `document` | File | The document file to process (PDF, JPG, JPEG, PNG) |

### Response Structure

The response includes:

- Basic extracted information (common for both modes)
- NLP-specific information (when `useNLP=true`)
  - Entity extraction
  - Structured data with higher confidence
  - Domain-specific analysis (policy compliance, PO matching, etc.)

#### Sample Response with NLP Enabled

```json
{
  "success": true,
  "document_file": "/path/to/file.jpg",
  "document_type": "invoice",
  "vendor_exists": true,
  "vendor_details": {...},
  "nlp_enabled": true,
  "extracted_data": {
    "raw_text": "...",
    "invoice_number": "INV-12345",
    "invoice_date": "2023-01-15",
    "total_amount": 5000.00,
    "entities": {
      "supplier": [{"value": "Acme Corp", "confidence": 0.95}],
      "invoice_id": [{"value": "INV-12345", "confidence": 0.98}]
    }
  }
}
```

## Bills API Integration

The Bills API also supports the `useNLP` parameter for invoice extraction:

```
POST /api/bills/invoices/extract?useNLP=true
```

This returns structured invoice data and can optionally match the document against vendors in the system.

## Benefits of NLP Processing

When `useNLP=true`:

1. **Enhanced Entity Recognition**: More accurate extraction of named entities like organizations, people, dates, and monetary values.
2. **Form Field Identification**: Better identification of form fields and their values.
3. **Domain-Specific Processing**: Special handling for expense policies, including rule extraction and compliance checking.
4. **Document Matching**: Support for 2-way matching (PO to Invoice) and 3-way matching (PO to GRN to Invoice).
5. **Higher Confidence Scores**: Generally provides higher confidence in extracted data.

## Technical Implementation

The system uses a unified Document AI integration that supports both OCR and NLP capabilities through different processors:

- OCR Processor ID: Configured via `DOCUMENT_AI_OCR_PROCESSOR_ID`
- Form Parser ID: Configured via `DOCUMENT_AI_FORM_PARSER_ID`

All credentials are managed through the `GOOGLE_APPLICATION_CREDENTIALS_JSON` environment variable.

## Error Handling

If Document AI processing fails, the system returns an error response with details about the failure. The `success` field will be `false` and an `error` field will contain the error message.

## Performance Considerations

- NLP processing is more resource-intensive and may take longer than basic OCR processing.
- For simple text extraction needs, consider using basic OCR mode (`useNLP=false`).
- For complex documents requiring deep understanding, use NLP mode (`useNLP=true`).

## Testing

You can test Document AI processing using the provided test scripts:
- `simple_test.py`: Simple integration test
- `test_nlp_processing.py`: Compares OCR vs NLP processing
- `api_test.py`: Tests the REST API endpoints