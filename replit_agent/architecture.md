# Architecture

## Overview

Stride is a spend management platform designed for Indian businesses to handle bills, invoices, receipts, and vendors. The application follows a modern web architecture with a Flask backend API and a React frontend. It provides features for bill processing, expense tracking, vendor management, approval workflows, and analytics, with special emphasis on OCR-based document processing and integrations with accounting systems like Tally ERP.

## System Architecture

The system follows a client-server architecture with clearly separated frontend and backend components:

### Backend Architecture

- **Framework**: Python Flask with Flask-SQLAlchemy ORM
- **API Design**: RESTful API structure with blueprint-based route organization
- **Authentication**: Flask-Login for user session management
- **Database**: SQL database (configurable via environment variables)
- **File Storage**: Local file system for temporary storage of uploaded invoices/receipts
- **AI Features**: OpenAI integration for OCR and NLP processing of documents

### Frontend Architecture

- **Framework**: React with functional components and hooks
- **State Management**: React's useState and useEffect hooks
- **UI Components**: Custom components with Tailwind CSS for styling
- **API Client**: Axios for HTTP requests to the backend API

### Communication Architecture

- **Protocol**: HTTP/HTTPS
- **Data Format**: JSON for API requests and responses
- **CORS**: Enabled for development and production

## Key Components

### Backend Components

1. **App Core (`app.py`)**: 
   - Initializes Flask application
   - Configures database connection
   - Sets up CORS and other middlewares
   - Registers route blueprints

2. **Data Models (`models.py`)**: 
   - User model with role-based permissions
   - Bill, Expense, and Vendor models for core business logic
   - Supporting models for approvals, categories, and integrations

3. **API Routes**:
   - `/api/bills`: Bill and invoice management
   - `/api/clerks`: AP clerk user management
   - `/api/analytics`: Reporting and analytics
   - `/api/settings`: Application configuration
   - `/api/integrations`: External system integrations

4. **Utility Services**:
   - `utils/ocr.py`: Image processing for invoices/receipts
   - `utils/nlp.py`: Natural language processing for data extraction
   - `utils/erp_connectors.py`: Integrations with ERP systems
   - `utils/whatsapp.py`: WhatsApp integration for receipt collection

### Frontend Components

1. **Core Components**:
   - `App.js`: Main application component
   - `MainContent.js`: Central content display
   - `Sidebar.js`: Navigation menu
   - `Dashboard.js`: Main dashboard view

2. **Feature Components**:
   - `BillManager.js`: Bill management interface
   - `InvoicePreview.js`: Invoice display and actions
   - `AnalyticsView.js`: Reports and analytics

3. **Settings Components**:
   - `SettingsModal.js`: Settings configuration UI
   - `Approvals.js`: Approval workflow configuration
   - `Accounting.js`: Accounting integration settings
   - `Importing.js`: Import configuration for bills and data

## Data Flow

### Bill Processing Flow

1. User uploads an invoice via UI or WhatsApp/email integrations
2. Backend processes the document using OCR/NLP to extract data
3. Extracted data is presented to the user for verification
4. User confirms the data and submits the bill
5. Bill enters the approval workflow based on configured rules
6. Upon approval, the bill is marked for payment
7. Payment information is synced with accounting systems

### Approval Workflow

1. Bills requiring approval are flagged based on configured rules
2. Notifications are sent to designated approvers
3. Approvers review and take action (approve/reject/request changes)
4. Multi-step approval workflows support sequential approvals
5. Bills move to payment stage after all approvals are received

### ERP Integration Flow

1. Bills and expenses are prepared for synchronization
2. ERP connector translates data to ERP-compatible format
3. Data is sent to the ERP system via API
4. Response from ERP is processed and stored
5. Synchronization status is updated in the application

## External Dependencies

### Third-Party Services

1. **OpenAI API**:
   - Used for OCR document processing
   - Used for NLP to extract structured data from invoices
   - Configured via environment variables

2. **WhatsApp Business API**:
   - Integration for receiving invoices and receipts
   - Support for two-way communication with users

3. **ERP Systems**:
   - Tally ERP integration for accounting
   - Support for other ERP systems via connectors

### Libraries and Frameworks

1. **Backend**:
   - Flask: Web framework
   - SQLAlchemy: ORM for database operations
   - Gunicorn: WSGI HTTP server
   - Flask-CORS: Cross-origin resource sharing

2. **Frontend**:
   - React: UI framework
   - Axios: HTTP client
   - Tailwind CSS: Utility-first CSS framework
   - Chart.js: Data visualization

## Deployment Strategy

The application uses a containerized deployment approach:

1. **Environment Configuration**:
   - Environment variables for configuration
   - Separate configurations for development and production

2. **Server Setup**:
   - Gunicorn as the production WSGI server
   - Port binding for Replit/container environments

3. **Frontend Deployment**:
   - Static file serving for production builds
   - Development server with hot reloading for development

4. **Database Strategy**:
   - External database connection via environment variables
   - Connection pooling for performance
   - Database migration support

5. **Scaling Considerations**:
   - Auto-scaling enabled in deployment configuration
   - Connection pool recycling for long-running instances

### Development Workflow

1. Frontend development using Node.js toolchain
2. Backend development with Python
3. Workflow configuration in `.replit` for simplified development
4. Parallel task execution for full-stack development