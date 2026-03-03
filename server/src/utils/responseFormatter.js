/**
 * Response formatter utilities
 * Standardizes API responses across the application
 */

/**
 * Format a successful response
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted response
 */
function successResponse(data = null, message = 'Success', statusCode = 200) {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString()
  };
}

/**
 * Format an error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Additional error details
 * @returns {Object} Formatted error response
 */
function errorResponse(message = 'An error occurred', statusCode = 500, errors = null) {
  return {
    success: false,
    statusCode,
    message,
    errors,
    timestamp: new Date().toISOString()
  };
}

/**
 * Format a paginated response
 * @param {Array} data - Response data
 * @param {number} total - Total items count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {string} message - Response message
 * @returns {Object} Formatted paginated response
 */
function paginatedResponse(data, total, page, limit, message = 'Success') {
  const pages = Math.ceil(total / limit);
  
  return {
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      pages,
      hasNextPage: page < pages,
      hasPreviousPage: page > 1
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Format an analytics response
 * @param {Object} analytics - Analytics data
 * @param {string} message - Response message
 * @returns {Object} Formatted analytics response
 */
function analyticsResponse(analytics, message = 'Analytics retrieved successfully') {
  return {
    success: true,
    message,
    data: analytics,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  analyticsResponse
};
