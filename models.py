from datetime import datetime
from app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import enum

class TenantStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRIAL = "trial"
    SUSPENDED = "suspended"

class Tenant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    subdomain = db.Column(db.String(64), unique=True, nullable=False)
    display_name = db.Column(db.String(100))
    status = db.Column(db.Enum(TenantStatus), default=TenantStatus.TRIAL)
    subscription_plan = db.Column(db.String(50))
    subscription_end_date = db.Column(db.Date)
    logo_url = db.Column(db.String(200))
    primary_contact_email = db.Column(db.String(120))
    primary_contact_phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    state = db.Column(db.String(100))
    country = db.Column(db.String(100))
    postal_code = db.Column(db.String(20))
    gstin = db.Column(db.String(15))  # India-specific: GST Identification Number
    pan = db.Column(db.String(10))    # India-specific: Permanent Account Number
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = db.relationship('User', backref='tenant', lazy=True)
    
    def __repr__(self):
        return f'<Tenant {self.name}>'

class UserRole(enum.Enum):
    ADMIN = "admin"
    APPROVER = "approver"
    AP_CLERK = "ap_clerk"
    EMPLOYEE = "employee"

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(256))
    role = db.Column(db.Enum(UserRole), default=UserRole.EMPLOYEE)
    phone = db.Column(db.String(20))
    # Add tenant_id as a foreign key
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    expenses = db.relationship('Expense', backref='user', lazy=True)
    approvals = db.relationship('Approval', backref='approver', lazy=True)
    
    # Create a unique constraint for username and email per tenant
    __table_args__ = (
        db.UniqueConstraint('username', 'tenant_id', name='uix_user_username_tenant'),
        db.UniqueConstraint('email', 'tenant_id', name='uix_user_email_tenant'),
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Vendor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    gstin = db.Column(db.String(15))  # GSTIN for Indian vendors
    pan = db.Column(db.String(10))    # PAN for Indian vendors
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    category = db.Column(db.String(50))
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    bills = db.relationship('Bill', backref='vendor', lazy=True)
    tenant = db.relationship('Tenant', backref='vendors', lazy=True)
    
    # Add unique constraint for vendor name within a tenant
    __table_args__ = (
        db.UniqueConstraint('name', 'tenant_id', name='uix_vendor_name_tenant'),
    )

class BillStatus(enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"

class Bill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bill_number = db.Column(db.String(100), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('vendor.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default="INR")  # Default to Indian Rupees
    issue_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum(BillStatus), default=BillStatus.DRAFT)
    invoice_file = db.Column(db.String(200))  # Path to the uploaded invoice file
    notes = db.Column(db.Text)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    line_items = db.relationship('LineItem', backref='bill', lazy=True)
    approval = db.relationship('Approval', backref='bill', uselist=False, lazy=True)
    tenant = db.relationship('Tenant', backref='bills', lazy=True)
    
    # Add unique constraint for bill_number within a tenant
    __table_args__ = (
        db.UniqueConstraint('bill_number', 'tenant_id', name='uix_bill_number_tenant'),
    )

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    
    # Relationships
    line_items = db.relationship('LineItem', backref='category', lazy=True)
    expenses = db.relationship('Expense', backref='category', lazy=True)
    tenant = db.relationship('Tenant', backref='categories', lazy=True)
    
    # Add unique constraint for category name within a tenant
    __table_args__ = (
        db.UniqueConstraint('name', 'tenant_id', name='uix_category_name_tenant'),
    )

class LineItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bill_id = db.Column(db.Integer, db.ForeignKey('bill.id'), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Float, default=1.0)
    unit_price = db.Column(db.Float, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    tax_rate = db.Column(db.Float, default=0.0)
    tax_amount = db.Column(db.Float, default=0.0)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ExpenseStatus(enum.Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    REIMBURSED = "reimbursed"

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default="INR")
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))
    receipt_image = db.Column(db.String(200))  # Path to the uploaded receipt image
    status = db.Column(db.Enum(ExpenseStatus), default=ExpenseStatus.DRAFT)
    notes = db.Column(db.Text)
    whatsapp_message_id = db.Column(db.String(100))  # For WhatsApp integration
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    approval = db.relationship('Approval', backref='expense', uselist=False, lazy=True)
    tenant = db.relationship('Tenant', backref='expenses', lazy=True)

class ApprovalType(enum.Enum):
    BILL = "bill"
    EXPENSE = "expense"

class ApprovalStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Approval(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    approver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.Enum(ApprovalType), nullable=False)
    bill_id = db.Column(db.Integer, db.ForeignKey('bill.id'))
    expense_id = db.Column(db.Integer, db.ForeignKey('expense.id'))
    status = db.Column(db.Enum(ApprovalStatus), default=ApprovalStatus.PENDING)
    notes = db.Column(db.Text)
    approval_date = db.Column(db.DateTime)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with tenant
    tenant = db.relationship('Tenant', backref='approvals', lazy=True)

class ERPIntegration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # e.g., Tally, Netsuite, SAP
    api_key = db.Column(db.String(200))
    api_url = db.Column(db.String(200))
    username = db.Column(db.String(100))
    password_hash = db.Column(db.String(256))
    enabled = db.Column(db.Boolean, default=False)
    last_sync = db.Column(db.DateTime)
    settings = db.Column(db.JSON)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship with tenant
    tenant = db.relationship('Tenant', backref='erp_integrations', lazy=True)
    
    # Add unique constraint for integration name within a tenant
    __table_args__ = (
        db.UniqueConstraint('name', 'tenant_id', name='uix_integration_name_tenant'),
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

class AccountingSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    fiscal_year_start = db.Column(db.Date)
    chart_of_accounts = db.Column(db.JSON)
    tax_settings = db.Column(db.JSON)  # GST configurations for India
    default_approval_threshold = db.Column(db.Float)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with tenant
    tenant = db.relationship('Tenant', backref='accounting_settings', lazy=True)
    
    # Ensure only one settings record per tenant
    __table_args__ = (
        db.UniqueConstraint('tenant_id', name='uix_accounting_settings_tenant'),
    )

class WhatsAppSetting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    api_key = db.Column(db.String(200))
    phone_number_id = db.Column(db.String(100))
    webhook_secret = db.Column(db.String(100))
    enabled = db.Column(db.Boolean, default=False)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with tenant
    tenant = db.relationship('Tenant', backref='whatsapp_settings', uselist=False, lazy=True)
    
    # Ensure only one settings record per tenant
    __table_args__ = (
        db.UniqueConstraint('tenant_id', name='uix_whatsapp_settings_tenant'),
    )

class Document(db.Model):
    """
    Model for document processing with OCR
    """
    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255))
    document_type = db.Column(db.String(50))  # invoice, receipt, purchase_order, etc.
    status = db.Column(db.String(20), default='pending')  # pending, processing, completed, failed
    result = db.Column(db.Text)  # JSON result from OCR processing
    processed_at = db.Column(db.DateTime)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with tenant
    tenant = db.relationship('Tenant', backref='documents', lazy=True)

class Attachment(db.Model):
    """
    Model for file attachments related to bills
    """
    id = db.Column(db.Integer, primary_key=True)
    bill_id = db.Column(db.Integer, db.ForeignKey('bill.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255))
    file_type = db.Column(db.String(50))  # invoice, receipt, supporting_doc, etc.
    description = db.Column(db.Text)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    bill = db.relationship('Bill', backref='attachments', lazy=True)
    tenant = db.relationship('Tenant', backref='bill_attachments', lazy=True)
    
class TaxRate(db.Model):
    """
    Model for tax rates (GST rates for India)
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)  # e.g., "GST 18%", "IGST 5%"
    rate = db.Column(db.Float, nullable=False)  # e.g., 0.18 for 18%
    code = db.Column(db.String(20))  # Tax code for accounting purposes
    description = db.Column(db.Text)
    is_default = db.Column(db.Boolean, default=False)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with tenant
    tenant = db.relationship('Tenant', backref='tax_rates', lazy=True)
    
    # Add unique constraint for tax rate name within a tenant
    __table_args__ = (
        db.UniqueConstraint('name', 'tenant_id', name='uix_tax_rate_name_tenant'),
    )
    
class ChartOfAccount(db.Model):
    """
    Model for chart of accounts
    """
    id = db.Column(db.Integer, primary_key=True)
    account_number = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    account_type = db.Column(db.String(50), nullable=False)  # Asset, Liability, Equity, Revenue, Expense
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('chart_of_account.id'), nullable=True)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    parent = db.relationship('ChartOfAccount', remote_side=[id], backref='children', lazy=True)
    tenant = db.relationship('Tenant', backref='chart_of_accounts', lazy=True)
    
    # Add unique constraint for account number within a tenant
    __table_args__ = (
        db.UniqueConstraint('account_number', 'tenant_id', name='uix_account_number_tenant'),
    )

class TenantSettings(db.Model):
    """
    Model for general tenant settings
    """
    id = db.Column(db.Integer, primary_key=True)
    # General settings
    date_format = db.Column(db.String(20), default="DD/MM/YYYY")
    currency_code = db.Column(db.String(3), default="INR")
    timezone = db.Column(db.String(50), default="Asia/Kolkata")
    language = db.Column(db.String(10), default="en-IN")
    # Feature flags
    enable_whatsapp = db.Column(db.Boolean, default=False)
    enable_ocr = db.Column(db.Boolean, default=True)
    enable_nlp = db.Column(db.Boolean, default=False)
    # UI preferences
    theme = db.Column(db.String(20), default="light")
    sidebar_collapsed = db.Column(db.Boolean, default=False)
    # Company info
    company_name = db.Column(db.String(100), nullable=True)
    logo_url = db.Column(db.String(255), nullable=True)
    primary_color = db.Column(db.String(20), default="#4F46E5")
    secondary_color = db.Column(db.String(20), default="#10B981")
    time_zone = db.Column(db.String(50), default="Asia/Kolkata")
    # Additional settings stored as JSON
    custom_settings = db.Column(db.JSON, nullable=True)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with tenant
    tenant = db.relationship('Tenant', backref='settings', uselist=False, lazy=True)
    
    # Ensure only one settings record per tenant
    __table_args__ = (
        db.UniqueConstraint('tenant_id', name='uix_tenant_settings'),
    )

class EmailTemplate(db.Model):
    """
    Model for email templates
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    template_type = db.Column(db.String(50), nullable=False)  # bill_approval, expense_approval, etc.
    is_active = db.Column(db.Boolean, default=True)
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with tenant
    tenant = db.relationship('Tenant', backref='email_templates', lazy=True)
    
    # Add unique constraint for template name and type within a tenant
    __table_args__ = (
        db.UniqueConstraint('name', 'template_type', 'tenant_id', name='uix_email_template_tenant'),
    )

class WorkflowStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DRAFT = "draft"

class Workflow(db.Model):
    """
    Model for approval workflows
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    workflow_type = db.Column(db.String(50), nullable=False)  # bill, expense, etc.
    status = db.Column(db.Enum(WorkflowStatus), default=WorkflowStatus.DRAFT)
    steps = db.Column(db.JSON)  # JSON array of approval steps
    conditions = db.Column(db.JSON)  # JSON conditions for workflow triggers
    # Add tenant_id for multi-tenancy
    tenant_id = db.Column(db.Integer, db.ForeignKey('tenant.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship with tenant
    tenant = db.relationship('Tenant', backref='workflows', lazy=True)
    
    # Add unique constraint for workflow name within a tenant
    __table_args__ = (
        db.UniqueConstraint('name', 'tenant_id', name='uix_workflow_name_tenant'),
    )
