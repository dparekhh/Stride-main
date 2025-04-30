#!/bin/bash

# Set the tenant header for proper tenant identification
TENANT_ID=1

# Get the port from the Replit configuration
PORT=3000

# Use curl to upload a sample invoice to the local server with NLP enabled
curl -X POST \
  -H "X-Tenant-ID: $TENANT_ID" \
  -F "invoice=@attached_assets/credit-terms-invoice.jpg" \
  "http://localhost:$PORT/api/bills/extract-invoice-details?useNLP=true"

