"""OCR processing routes for the Stride platform."""
from flask import Blueprint, request, jsonify, g, current_app
import logging
from utils.response_utils import standardize_response
from services.ocr_service import OCRService
from utils.error_utils import ApplicationError, ValidationError

logger = logging.getLogger(__name__)
ocr_bp = Blueprint('ocr', __name__, url_prefix='/api/ocr')

@ocr_bp.route('/upload-invoice', methods=['POST'])
def upload_invoice():
    """Upload an invoice and extract data using OCR and NLP."""
    # Validate input
    if 'invoice' not in request.files:
        raise ValidationError("No invoice file provided", {"invoice": "File is required"})
    
    file = request.files['invoice']
    if not file or not file.filename:
        raise ValidationError("No file selected", {"invoice": "Valid file is required"})

    # Parse parameters
    use_nlp_form = request.form.get('use_nlp', 'false').lower() == 'true'
    use_nlp_query = request.args.get('useNLP', 'false').lower() == 'true'
    use_nlp = use_nlp_form or use_nlp_query

    # Process the invoice
    try:
        ocr_service = OCRService(g.tenant_id)
        response_data = ocr_service.process_invoice_file(file, use_nlp)
        return standardize_response(
            data=response_data, 
            message="Invoice processed successfully", 
            success=True
        )
    except Exception as e:
        logger.error(f"Error in OCR processing: {str(e)}", exc_info=True)
        raise ApplicationError(
            message="File uploaded successfully, but automatic data extraction failed",
            status_code=500,
            extra_data={
                'error': str(e),
                'invoice_file': file.filename if file else None
            }
        )

@ocr_bp.route('/extract-invoice-details', methods=['POST'])
def extract_invoice_details():
    """Extract invoice details using OCR and match vendor against tenant's database."""
    # Validate input
    if 'invoice' not in request.files:
        raise ValidationError("No invoice file provided", {"invoice": "File is required"})
    
    file = request.files['invoice']
    if not file or not file.filename:
        raise ValidationError("No file selected", {"invoice": "Valid file is required"})

    # Parse parameters
    use_nlp = request.args.get('useNLP', 'false').lower() == 'true'

    # Process the invoice and match vendors
    try:
        ocr_service = OCRService(g.tenant_id)
        response_data = ocr_service.process_invoice_file(file, use_nlp)
        
        # Enhance the response with vendor matching data
        response_data['matching_vendors'] = (
            response_data.get('potential_vendors', []) if response_data.get('potential_vendors') 
            else ([response_data.get('vendor_details')] if response_data.get('vendor_exists') else [])
        )
        
        return standardize_response(
            data=response_data, 
            message="Invoice details extracted successfully",
            success=True
        )
    except Exception as e:
        logger.error(f"Error extracting invoice details: {str(e)}", exc_info=True)
        
        # Provide a minimal fallback response structure
        fallback_data = {
            'error_details': str(e),
            'extraction_status': 'failed'
        }
        
        raise ApplicationError(
            message="Failed to extract invoice details",
            status_code=500,
            extra_data=fallback_data
        )

@ocr_bp.route('/extract-text', methods=['POST'])
def extract_text():
    """Extract text content from a document without specific field extraction."""
    # Validate input
    if 'document' not in request.files:
        raise ValidationError("No document provided", {"document": "File is required"})
    
    file = request.files['document']
    if not file or not file.filename:
        raise ValidationError("No file selected", {"document": "Valid file is required"})
    
    # Process the document for text extraction
    try:
        ocr_service = OCRService(g.tenant_id)
        result = ocr_service.extract_text_from_document(file)
        
        return standardize_response(
            data=result, 
            message="Text extracted successfully",
            success=True
        )
    except ValueError as ve:
        logger.error(f"Validation error in text extraction: {str(ve)}")
        raise ValidationError(
            message=str(ve), 
            errors={"document": str(ve)}
        )
    except Exception as e:
        logger.error(f"Error extracting text: {str(e)}", exc_info=True)
        
        raise ApplicationError(
            message="Text extraction failed",
            status_code=500,
            extra_data={
                'error': str(e),
                'filename': file.filename if file else None
            }
        )


@ocr_bp.route('/health', methods=['GET'])
def health_check():
    """Check if the OCR service is available and properly configured."""
    try:
        ocr_service = OCRService(g.tenant_id)
        
        return standardize_response(
            data={
                'status': 'ok',
                'service_version': '1.0'
            },
            message="OCR service is available",
            success=True
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}", exc_info=True)
        
        raise ApplicationError(
            message="OCR service health check failed", 
            status_code=500,
            extra_data={'error': str(e)}
        )


@ocr_bp.route('/process', methods=['POST'])
def process_document():
    """Process a document using OCR and NLP based on the file type."""
    # Validate input
    if 'file' not in request.files:
        raise ValidationError("No file provided", {"file": "File is required"})
    
    file = request.files['file']
    if not file or not file.filename:
        raise ValidationError("No file selected", {"file": "Valid file is required"})
    
    # Parse parameters
    use_nlp_form = request.form.get('use_nlp', 'false').lower() == 'true'
    use_nlp_query = request.args.get('useNLP', 'false').lower() == 'true'
    use_nlp = use_nlp_form or use_nlp_query
    
    document_type = request.form.get('document_type', request.args.get('documentType', 'invoice'))
    
    # Process the document
    try:
        ocr_service = OCRService(g.tenant_id)
        result = ocr_service.process_document(file, document_type, use_nlp)
        
        if not result.get('success', False) and 'error' in result:
            return standardize_response(
                data={'error': result.get('error', 'Unknown error')}, 
                message="Document processing failed",
                success=False,
                status_code=500
            )
        
        return standardize_response(
            data=result, 
            message="Document processed successfully",
            success=True
        )
    except ValueError as ve:
        logger.error(f"Validation error in document processing: {str(ve)}")
        raise ValidationError(
            message=str(ve), 
            errors={"file": str(ve)}
        )
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}", exc_info=True)
        
        raise ApplicationError(
            message="Document processing failed",
            status_code=500,
            extra_data={
                'error': str(e),
                'filename': file.filename if file else None
            }
        )

@ocr_bp.route('/process-receipt', methods=['POST'])
def process_receipt():
    """Process a receipt file and extract data using OCR and NLP."""
    # Validate input
    if 'receipt' not in request.files:
        raise ValidationError("No receipt file provided", {"receipt": "File is required"})
    
    file = request.files['receipt']
    if not file or not file.filename:
        raise ValidationError("No file selected", {"receipt": "Valid file is required"})
    
    # Parse parameters
    use_nlp = request.form.get('use_nlp', request.args.get('use_nlp', 'false')).lower() == 'true'
    
    # Process the receipt
    try:
        ocr_service = OCRService(g.tenant_id)
        result = ocr_service.process_receipt(file, use_nlp)
        
        if not result.get('success', False):
            return standardize_response(
                data={'error': result.get('error', 'Unknown error')}, 
                message="Receipt processing failed",
                success=False,
                status_code=500
            )
        
        return standardize_response(
            data=result, 
            message="Receipt processed successfully",
            success=True
        )
    except ValueError as ve:
        logger.error(f"Validation error in receipt processing: {str(ve)}")
        raise ValidationError(
            message=str(ve), 
            errors={"receipt": str(ve)}
        )
    except Exception as e:
        logger.error(f"Error processing receipt: {str(e)}", exc_info=True)
        
        raise ApplicationError(
            message="Receipt processing failed",
            status_code=500,
            extra_data={
                'error': str(e),
                'filename': file.filename if file else None
            }
        )