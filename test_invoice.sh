#!/bin/bash

# Set the tenant header for proper tenant identification
TENANT_ID=1

# Use curl to upload a sample invoice
curl -X POST   -H "X-Tenant-ID: $TENANT_ID"   -F "invoice=@sample_invoice.jpg"   "https://$REPL_SLUG.$REPL_OWNER.repl.co/api/bills/extract-invoice-details"   -v

