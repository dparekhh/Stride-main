import os
import logging
import requests
import json
import base64
from datetime import datetime

logger = logging.getLogger(__name__)

def process_whatsapp_webhook(webhook_data, settings):
    """Process incoming WhatsApp webhook data"""
    try:
        # Check if this is a valid WhatsApp message
        if 'entry' not in webhook_data or not webhook_data['entry']:
            return None
        
        entry = webhook_data['entry'][0]
        if 'changes' not in entry or not entry['changes']:
            return None
        
        change = entry['changes'][0]
        if 'value' not in change or 'messages' not in change['value'] or not change['value']['messages']:
            return None
        
        # Get the message
        message = change['value']['messages'][0]
        sender = message['from']
        
        result = {
            'from': sender,
            'message_id': message['id'],
            'timestamp': datetime.fromtimestamp(int(message['timestamp'])),
            'type': message['type']
        }
        
        # Handle different message types
        if message['type'] == 'text':
            result['text'] = message['text']['body']
            logger.info(f"Received WhatsApp text message from {sender}: {result['text']}")
            
        elif message['type'] == 'image':
            # Get image metadata
            result['media'] = {
                'id': message['image']['id'],
                'mime_type': message['image'].get('mime_type', 'image/jpeg')
            }
            
            # Download the media
            media_data = download_whatsapp_media(
                message['image']['id'],
                settings.api_key,
                settings.phone_number_id
            )
            
            if media_data:
                result['media']['data'] = media_data
                logger.info(f"Received WhatsApp image from {sender}")
            else:
                logger.error(f"Failed to download media from WhatsApp message: {message['id']}")
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing WhatsApp webhook: {str(e)}")
        return None

def download_whatsapp_media(media_id, api_key, phone_number_id):
    """Download media from WhatsApp using the Media API"""
    try:
        # First get the media URL
        url = f"https://graph.facebook.com/v17.0/{media_id}"
        headers = {
            'Authorization': f'Bearer {api_key}'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        media_url = response.json().get('url')
        if not media_url:
            logger.error(f"No URL found for media ID: {media_id}")
            return None
        
        # Now download the actual media
        media_response = requests.get(
            media_url,
            headers=headers
        )
        media_response.raise_for_status()
        
        # Return as base64 for easier handling
        return base64.b64encode(media_response.content).decode('utf-8')
        
    except Exception as e:
        logger.error(f"Error downloading WhatsApp media: {str(e)}")
        return None

def send_whatsapp_message(settings, to, message):
    """Send a WhatsApp message using the WhatsApp Business API"""
    try:
        url = f"https://graph.facebook.com/v17.0/{settings.phone_number_id}/messages"
        
        headers = {
            'Authorization': f'Bearer {settings.api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'messaging_product': 'whatsapp',
            'recipient_type': 'individual',
            'to': to,
            'type': 'text',
            'text': {
                'body': message
            }
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        logger.info(f"WhatsApp message sent to {to}")
        return response.json()
        
    except Exception as e:
        logger.error(f"Error sending WhatsApp message: {str(e)}")
        return None

def send_whatsapp_template(settings, to, template_name, components=None):
    """Send a WhatsApp template message"""
    try:
        url = f"https://graph.facebook.com/v17.0/{settings.phone_number_id}/messages"
        
        headers = {
            'Authorization': f'Bearer {settings.api_key}',
            'Content-Type': 'application/json'
        }
        
        data = {
            'messaging_product': 'whatsapp',
            'recipient_type': 'individual',
            'to': to,
            'type': 'template',
            'template': {
                'name': template_name,
                'language': {
                    'code': 'en'
                }
            }
        }
        
        if components:
            data['template']['components'] = components
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        logger.info(f"WhatsApp template message sent to {to}")
        return response.json()
        
    except Exception as e:
        logger.error(f"Error sending WhatsApp template message: {str(e)}")
        return None

def send_approval_request(settings, to, expense_data):
    """Send an approval request via WhatsApp"""
    try:
        # Format the expense data into a readable message
        message = (
            f"*Expense Approval Request*\n\n"
            f"Vendor: {expense_data.get('vendor_name', 'Unknown')}\n"
            f"Amount: ₹{expense_data.get('amount', '0.00')}\n"
            f"Date: {expense_data.get('date', 'Unknown')}\n"
            f"Category: {expense_data.get('category', 'Uncategorized')}\n\n"
            f"Reply with 'APPROVE {expense_data.get('id')}' to approve or "
            f"'REJECT {expense_data.get('id')}' to reject this expense."
        )
        
        return send_whatsapp_message(settings, to, message)
        
    except Exception as e:
        logger.error(f"Error sending approval request via WhatsApp: {str(e)}")
        return None
