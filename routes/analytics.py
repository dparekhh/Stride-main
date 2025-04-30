from flask import Blueprint, request, jsonify
from app import db
from models import Bill, Expense, Vendor, Category, LineItem
from sqlalchemy import func, extract
import logging
from datetime import datetime, timedelta

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')
logger = logging.getLogger(__name__)

@analytics_bp.route('/summary', methods=['GET'])
def get_summary():
    """Get summary of bills and expenses"""
    # Get total bills amount
    total_bills = db.session.query(func.sum(Bill.amount)).scalar() or 0
    
    # Get total expenses amount
    total_expenses = db.session.query(func.sum(Expense.amount)).scalar() or 0
    
    # Get count of vendors
    vendor_count = Vendor.query.count()
    
    # Get count of bills
    bill_count = Bill.query.count()
    
    # Get count of expenses
    expense_count = Expense.query.count()
    
    return jsonify({
        'total_bills_amount': total_bills,
        'total_expenses_amount': total_expenses,
        'vendor_count': vendor_count,
        'bill_count': bill_count,
        'expense_count': expense_count
    })

@analytics_bp.route('/spend-by-category', methods=['GET'])
def spend_by_category():
    """Get spend breakdown by category"""
    # Period filter (default to last 30 days)
    period = request.args.get('period', 'month')
    
    # Calculate the date range based on the period
    today = datetime.utcnow()
    if period == 'week':
        start_date = today - timedelta(days=7)
    elif period == 'month':
        start_date = today - timedelta(days=30)
    elif period == 'quarter':
        start_date = today - timedelta(days=90)
    elif period == 'year':
        start_date = today - timedelta(days=365)
    else:
        start_date = today - timedelta(days=30)  # Default to month
    
    # Query for bill line items by category
    bill_spend = db.session.query(
        Category.name,
        func.sum(LineItem.amount).label('total')
    ).join(
        LineItem, Category.id == LineItem.category_id
    ).join(
        Bill, LineItem.bill_id == Bill.id
    ).filter(
        Bill.issue_date >= start_date.date()
    ).group_by(
        Category.name
    ).all()
    
    # Query for expenses by category
    expense_spend = db.session.query(
        Category.name,
        func.sum(Expense.amount).label('total')
    ).join(
        Category, Expense.category_id == Category.id
    ).filter(
        Expense.date >= start_date.date()
    ).group_by(
        Category.name
    ).all()
    
    # Combine the results
    categories = {}
    
    for name, total in bill_spend:
        if name in categories:
            categories[name] += total
        else:
            categories[name] = total
    
    for name, total in expense_spend:
        if name in categories:
            categories[name] += total
        else:
            categories[name] = total
    
    # Format the result for chart display
    result = [{'category': name, 'amount': amount} for name, amount in categories.items()]
    
    return jsonify({
        'period': period,
        'data': result
    })

@analytics_bp.route('/spend-over-time', methods=['GET'])
def spend_over_time():
    """Get spend over time"""
    # Period filter
    period = request.args.get('period', 'month')
    granularity = request.args.get('granularity', 'day')
    
    # Calculate the date range based on the period
    today = datetime.utcnow()
    if period == 'week':
        start_date = today - timedelta(days=7)
        if granularity == 'day':
            group_by = func.date(Bill.issue_date)
        else:
            group_by = func.date(Bill.issue_date)
    elif period == 'month':
        start_date = today - timedelta(days=30)
        if granularity == 'day':
            group_by = func.date(Bill.issue_date)
        else:
            group_by = func.date_trunc('week', Bill.issue_date)
    elif period == 'quarter':
        start_date = today - timedelta(days=90)
        if granularity == 'day':
            group_by = func.date(Bill.issue_date)
        elif granularity == 'week':
            group_by = func.date_trunc('week', Bill.issue_date)
        else:
            group_by = func.date_trunc('month', Bill.issue_date)
    elif period == 'year':
        start_date = today - timedelta(days=365)
        if granularity == 'day':
            group_by = func.date(Bill.issue_date)
        elif granularity == 'week':
            group_by = func.date_trunc('week', Bill.issue_date)
        elif granularity == 'month':
            group_by = func.date_trunc('month', Bill.issue_date)
        else:
            group_by = func.date_trunc('quarter', Bill.issue_date)
    else:
        start_date = today - timedelta(days=30)
        group_by = func.date(Bill.issue_date)
    
    # Query for bills over time
    bill_spend = db.session.query(
        func.date(Bill.issue_date).label('date'),
        func.sum(Bill.amount).label('total')
    ).filter(
        Bill.issue_date >= start_date.date()
    ).group_by(
        func.date(Bill.issue_date)
    ).order_by(
        func.date(Bill.issue_date)
    ).all()
    
    # Query for expenses over time
    expense_spend = db.session.query(
        func.date(Expense.date).label('date'),
        func.sum(Expense.amount).label('total')
    ).filter(
        Expense.date >= start_date.date()
    ).group_by(
        func.date(Expense.date)
    ).order_by(
        func.date(Expense.date)
    ).all()
    
    # Combine the results
    spend_by_date = {}
    
    for date, total in bill_spend:
        date_str = date.strftime('%Y-%m-%d')
        spend_by_date[date_str] = {
            'date': date_str,
            'bills': total,
            'expenses': 0,
            'total': total
        }
    
    for date, total in expense_spend:
        date_str = date.strftime('%Y-%m-%d')
        if date_str in spend_by_date:
            spend_by_date[date_str]['expenses'] = total
            spend_by_date[date_str]['total'] += total
        else:
            spend_by_date[date_str] = {
                'date': date_str,
                'bills': 0,
                'expenses': total,
                'total': total
            }
    
    # Format the result for chart display
    result = list(spend_by_date.values())
    result.sort(key=lambda x: x['date'])
    
    return jsonify({
        'period': period,
        'granularity': granularity,
        'data': result
    })

@analytics_bp.route('/vendor-analysis', methods=['GET'])
def vendor_analysis():
    """Get vendor spending analysis"""
    # Get top vendors by spend
    top_vendors = db.session.query(
        Vendor.id,
        Vendor.name,
        func.sum(Bill.amount).label('total_spend'),
        func.count(Bill.id).label('bill_count'),
        func.avg(Bill.amount).label('average_bill')
    ).join(
        Bill, Vendor.id == Bill.vendor_id
    ).group_by(
        Vendor.id, Vendor.name
    ).order_by(
        func.sum(Bill.amount).desc()
    ).limit(10).all()
    
    result = []
    for vendor_id, name, total_spend, bill_count, average_bill in top_vendors:
        result.append({
            'id': vendor_id,
            'name': name,
            'total_spend': total_spend,
            'bill_count': bill_count,
            'average_bill': average_bill
        })
    
    return jsonify({'top_vendors': result})

@analytics_bp.route('/category-trends', methods=['GET'])
def category_trends():
    """Get spending trends by category over time"""
    # Period filter (default to last 6 months)
    months = int(request.args.get('months', 6))
    
    # Calculate the start date
    today = datetime.utcnow()
    start_date = today - timedelta(days=30 * months)
    
    # Query for monthly spending by category
    monthly_category_spend = db.session.query(
        Category.name,
        func.date_trunc('month', Bill.issue_date).label('month'),
        func.sum(LineItem.amount).label('total')
    ).join(
        LineItem, Category.id == LineItem.category_id
    ).join(
        Bill, LineItem.bill_id == Bill.id
    ).filter(
        Bill.issue_date >= start_date.date()
    ).group_by(
        Category.name,
        func.date_trunc('month', Bill.issue_date)
    ).order_by(
        func.date_trunc('month', Bill.issue_date)
    ).all()
    
    # Organize data by month and category
    trends = {}
    categories = set()
    months_set = set()
    
    for category, month, total in monthly_category_spend:
        month_str = month.strftime('%Y-%m')
        months_set.add(month_str)
        categories.add(category)
        
        if month_str not in trends:
            trends[month_str] = {}
        
        trends[month_str][category] = total
    
    # Fill in missing data with zeros
    sorted_months = sorted(list(months_set))
    sorted_categories = sorted(list(categories))
    
    result = []
    for month in sorted_months:
        month_data = {'month': month}
        
        for category in sorted_categories:
            month_data[category] = trends.get(month, {}).get(category, 0)
        
        result.append(month_data)
    
    return jsonify({
        'categories': sorted_categories,
        'data': result
    })

@analytics_bp.route('/approval-metrics', methods=['GET'])
def approval_metrics():
    """Get approval process metrics"""
    # Query for bills by status
    bill_status = db.session.query(
        Bill.status,
        func.count(Bill.id).label('count')
    ).group_by(
        Bill.status
    ).all()
    
    # Query for expenses by status
    expense_status = db.session.query(
        Expense.status,
        func.count(Expense.id).label('count')
    ).group_by(
        Expense.status
    ).all()
    
    # Format the results
    bill_result = {status.value: count for status, count in bill_status}
    expense_result = {status.value: count for status, count in expense_status}
    
    return jsonify({
        'bills_by_status': bill_result,
        'expenses_by_status': expense_result
    })