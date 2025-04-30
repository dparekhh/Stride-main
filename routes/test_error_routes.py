"""Routes for testing error handling."""
from flask import Blueprint, request, jsonify
from utils.error_utils import ApplicationError, ValidationError, NotFoundError, AuthorizationError
from utils.response_utils import standardize_response

test_error_bp = Blueprint('test_error', __name__, url_prefix='/api/test-errors')

@test_error_bp.route('/validation-error', methods=['GET'])
def test_validation_error():
    """Test a validation error."""
    field_errors = {
        "name": "Name cannot be empty",
        "email": "Invalid email format"
    }
    raise ValidationError("Validation failed", field_errors)

@test_error_bp.route('/not-found-error', methods=['GET'])
def test_not_found_error():
    """Test a not found error."""
    raise NotFoundError("User", 12345)

@test_error_bp.route('/auth-error', methods=['GET'])
def test_auth_error():
    """Test an authorization error."""
    raise AuthorizationError("You do not have permission to access this resource")

@test_error_bp.route('/general-app-error', methods=['GET'])
def test_general_app_error():
    """Test a general application error."""
    raise ApplicationError(
        message="An application error occurred",
        status_code=500,
        extra_data={"reason": "testing", "error_code": "TEST001"}
    )

@test_error_bp.route('/unhandled-error', methods=['GET'])
def test_unhandled_error():
    """Test an unhandled exception."""
    # This will trigger a 500 error
    non_existent_var = undefined_variable  # noqa
    return standardize_response(data={"result": "This should never be returned"})