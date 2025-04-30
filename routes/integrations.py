from flask import Blueprint, request, jsonify
from app import db
import logging
from models import WhatsAppSetting, ERPIntegration, Expense, Category, ExpenseStatus, User
from utils.whatsapp import process_whatsapp_webhook, send_whatsapp_message
from utils.erp_connectors import sync_with_erp
from services.ocr_service import OCRService, DocumentType
import base64
from datetime import datetime
import os
import uuid

integrations_bp = Blueprint('integrations', __name__, url_prefix='/api/integrations')
logger = logging.getLogger(__name__)

@integrations_bp.route('/whatsapp/webhook', methods=['GET', 'POST'])
def whatsapp_webhook():
    """Handle WhatsApp webhook events"""
    whatsapp_settings = WhatsAppSetting.query.first()
    
    if not whatsapp_settings or not whatsapp_settings.enabled:
        return jsonify({'error': 'WhatsApp integration is not configured'}), 400
    
    # For webhook verification (GET request)
    if request.method == 'GET':
        verify_token = request.args.get('hub.verify_token')
        if verify_token == whatsapp_settings.webhook_secret:
            return request.args.get('hub.challenge')
        return 'Invalid verification token', 401
    
    # Process incoming webhook (POST request)
    try:
        webhook_data = request.json
        logger.info(f"Received WhatsApp webhook: {webhook_data}")
        
        # Process the webhook
        result = process_whatsapp_webhook(webhook_data, whatsapp_settings)
        
        # Handle media messages (for receipt upload)
        if result and 'media' in result and 'from' in result:
            # Get the user by phone number
            phone = result['from']
            user = User.query.filter_by(phone=phone).first()
            
            if not user:
                error_msg = f"No user found with phone number {phone}"
                logger.error(error_msg)
                # Send response back to WhatsApp
                send_whatsapp_message(
                    whatsapp_settings,
                    phone,
                    "Sorry, your phone number is not registered in our system. Please contact your administrator."
                )
                return jsonify({'error': error_msg}), 400
            
            # Process the media (image)
            media_id = result['media']['id']
            mime_type = result['media']['mime_type']
            
            if 'image' in mime_type:
                # Download and process the image
                image_data = result['media']['data']
                # Save image to a file
                upload_dir = os.path.join('static', 'uploads')
                os.makedirs(upload_dir, exist_ok=True)
                
                filename = f"{uuid.uuid4()}.jpg"
                file_path = os.path.join(upload_dir, filename)
                
                with open(file_path, 'wb') as f:
                    f.write(base64.b64decode(image_data))
                
                # Process the image with OCR service
                ocr_service = OCRService(tenant_id=user.tenant_id)
                
                # Create a file-like object from the image data
                from io import BytesIO
                file_obj = BytesIO(base64.b64decode(image_data))
                file_obj.name = f"{uuid.uuid4()}.jpg"  # Add a name attribute for compatibility
                
                # Process using OCR service (stub implementation)
                ocr_result = ocr_service.process_document(
                    file=file_obj,
                    document_type="receipt",
                    use_nlp=False
                )
                
                # Use a default category since NLP categorization is removed
                category_name = "Uncategorized"
                confidence = 1.0
                
                # Get or create the category
                category = Category.query.filter_by(name=category_name).first()
                if not category:
                    category = Category(name=category_name)
                    db.session.add(category)
                    db.session.commit()
                
                # Extract amount from the OCR result
                amount = 0
                if 'total_amount' in ocr_result:
                    amount = ocr_result.get('total_amount', 0)
                elif 'amount' in ocr_result:
                    amount = ocr_result.get('amount', 0)
                
                # Create a description from vendor name or default
                description = ocr_result.get('vendor_name', 'Receipt via WhatsApp')
                
                # Create an expense record
                new_expense = Expense(
                    user_id=user.id,
                    amount=amount,
                    date=datetime.now().date(),
                    description=description,
                    category_id=category.id,
                    receipt_image=file_path,
                    status=ExpenseStatus.SUBMITTED,
                    whatsapp_message_id=result['message_id']
                )
                
                db.session.add(new_expense)
                db.session.commit()
                
                # Send confirmation back to WhatsApp
                send_whatsapp_message(
                    whatsapp_settings,
                    phone,
                    f"Thank you! Your receipt has been processed.\n\n"
                    f"Amount: ₹{amount}\n"
                    f"Category: {category_name}\n"
                    f"Status: Submitted for approval"
                )
                
                return jsonify({'success': True, 'expense_id': new_expense.id})
            else:
                # Unsupported media type
                send_whatsapp_message(
                    whatsapp_settings,
                    phone,
                    "Sorry, only image files are supported for receipt processing."
                )
                return jsonify({'error': 'Unsupported media type'}), 400
        
        return jsonify({'success': True})
        
    except Exception as e:
        logger.error(f"Error processing WhatsApp webhook: {str(e)}")
        return jsonify({'error': f'Failed to process webhook: {str(e)}'}), 500

@integrations_bp.route('/erp/sync/<int:integration_id>', methods=['POST'])
def erp_sync(integration_id):
    """Manually trigger ERP synchronization"""
    integration = ERPIntegration.query.get_or_404(integration_id)
    
    if not integration.enabled:
        return jsonify({'error': 'ERP integration is disabled'}), 400
    
    try:
        # Sync with the ERP system
        result = sync_with_erp(integration)
        
        # Update last sync timestamp
        integration.last_sync = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'Successfully synced with {integration.name}',
            'details': result
        })
        
    except Exception as e:
        logger.error(f"Error syncing with ERP {integration.name}: {str(e)}")
        return jsonify({'error': f'Failed to sync with ERP: {str(e)}'}), 500

@integrations_bp.route('/erp/test-connection/<int:integration_id>', methods=['GET'])
def test_erp_connection(integration_id):
    """Test connection to an ERP system"""
    integration = ERPIntegration.query.get_or_404(integration_id)
    
    try:
        # Test connection to the ERP system
        result = sync_with_erp(integration, test_only=True)
        
        return jsonify({
            'success': True,
            'message': f'Successfully connected to {integration.name}',
            'details': result
        })
        
    except Exception as e:
        logger.error(f"Error connecting to ERP {integration.name}: {str(e)}")
        return jsonify({'error': f'Failed to connect to ERP: {str(e)}'}), 500