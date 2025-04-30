from flask import Blueprint, jsonify, request
from app import db
from models import User, UserRole, Bill, BillStatus, Approval, ApprovalStatus
from werkzeug.security import generate_password_hash
from datetime import datetime
import logging

clerks_bp = Blueprint('clerks', __name__, url_prefix='/api/clerks')
logger = logging.getLogger(__name__)

@clerks_bp.route('/', methods=['GET'])
def get_clerks():
    """Get all AP clerks"""
    clerks = User.query.filter_by(role=UserRole.AP_CLERK).all()
    result = []
    
    for clerk in clerks:
        result.append({
            'id': clerk.id,
            'username': clerk.username,
            'email': clerk.email,
            'phone': clerk.phone,
            'created_at': clerk.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    return jsonify({'clerks': result})

@clerks_bp.route('/<int:clerk_id>', methods=['GET'])
def get_clerk(clerk_id):
    """Get a specific AP clerk by ID"""
    clerk = User.query.filter_by(id=clerk_id, role=UserRole.AP_CLERK).first_or_404()
    
    result = {
        'id': clerk.id,
        'username': clerk.username,
        'email': clerk.email,
        'phone': clerk.phone,
        'created_at': clerk.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'updated_at': clerk.updated_at.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    return jsonify(result)

@clerks_bp.route('/', methods=['POST'])
def create_clerk():
    """Create a new AP clerk"""
    data = request.json
    
    # Check if username or email already exists
    existing_user = User.query.filter(
        (User.username == data['username']) | (User.email == data['email'])
    ).first()
    
    if existing_user:
        return jsonify({'error': 'Username or email already exists'}), 400
    
    # Create new clerk
    new_clerk = User(
        username=data['username'],
        email=data['email'],
        role=UserRole.AP_CLERK,
        phone=data.get('phone')
    )
    
    # Set password
    if 'password' in data:
        new_clerk.set_password(data['password'])
    
    db.session.add(new_clerk)
    db.session.commit()
    
    return jsonify({
        'id': new_clerk.id,
        'message': 'AP clerk created successfully'
    }), 201

@clerks_bp.route('/<int:clerk_id>', methods=['PUT'])
def update_clerk(clerk_id):
    """Update an existing AP clerk"""
    clerk = User.query.filter_by(id=clerk_id, role=UserRole.AP_CLERK).first_or_404()
    data = request.json
    
    # Check if username or email already exists for another user
    if 'username' in data and data['username'] != clerk.username:
        existing_user = User.query.filter_by(username=data['username']).first()
        if existing_user and existing_user.id != clerk_id:
            return jsonify({'error': 'Username already exists'}), 400
    
    if 'email' in data and data['email'] != clerk.email:
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != clerk_id:
            return jsonify({'error': 'Email already exists'}), 400
    
    # Update clerk fields
    if 'username' in data:
        clerk.username = data['username']
    if 'email' in data:
        clerk.email = data['email']
    if 'phone' in data:
        clerk.phone = data['phone']
    if 'password' in data:
        clerk.set_password(data['password'])
    
    clerk.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({
        'id': clerk.id,
        'message': 'AP clerk updated successfully'
    })

@clerks_bp.route('/<int:clerk_id>', methods=['DELETE'])
def delete_clerk(clerk_id):
    """Delete an AP clerk"""
    clerk = User.query.filter_by(id=clerk_id, role=UserRole.AP_CLERK).first_or_404()
    
    db.session.delete(clerk)
    db.session.commit()
    
    return jsonify({
        'message': 'AP clerk deleted successfully'
    })

@clerks_bp.route('/<int:clerk_id>/bills', methods=['GET'])
def get_clerk_bills(clerk_id):
    """Get bills assigned to a specific AP clerk"""
    clerk = User.query.filter_by(id=clerk_id, role=UserRole.AP_CLERK).first_or_404()
    
    # In a real application, you might have a more complex assignment system
    # For now, we'll just return all bills in DRAFT or SUBMITTED status
    bills = Bill.query.filter(
        Bill.status.in_([BillStatus.DRAFT, BillStatus.SUBMITTED])
    ).order_by(Bill.created_at.desc()).all()
    
    result = []
    for bill in bills:
        result.append({
            'id': bill.id,
            'bill_number': bill.bill_number,
            'vendor_id': bill.vendor_id,
            'amount': bill.amount,
            'currency': bill.currency,
            'issue_date': bill.issue_date.strftime('%Y-%m-%d') if bill.issue_date else None,
            'due_date': bill.due_date.strftime('%Y-%m-%d') if bill.due_date else None,
            'status': bill.status.value,
            'created_at': bill.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
    
    return jsonify({'bills': result})

@clerks_bp.route('/<int:clerk_id>/pending-approvals', methods=['GET'])
def get_clerk_pending_approvals(clerk_id):
    """Get pending bill approvals for a specific AP clerk"""
    clerk = User.query.filter_by(id=clerk_id, role=UserRole.AP_CLERK).first_or_404()
    
    # Get all approvals where clerk is the approver and status is pending
    approvals = Approval.query.filter_by(
        approver_id=clerk_id,
        status=ApprovalStatus.PENDING
    ).all()
    
    result = []
    for approval in approvals:
        if approval.bill_id:
            bill = Bill.query.get(approval.bill_id)
            if bill:
                result.append({
                    'approval_id': approval.id,
                    'bill_id': bill.id,
                    'bill_number': bill.bill_number,
                    'amount': bill.amount,
                    'currency': bill.currency,
                    'created_at': approval.created_at.strftime('%Y-%m-%d %H:%M:%S')
                })
    
    return jsonify({'pending_approvals': result})