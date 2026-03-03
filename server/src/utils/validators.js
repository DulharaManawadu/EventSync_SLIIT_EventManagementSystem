/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId format
 */
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Validate date format (ISO 8601)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate capacity
 * @param {number} capacity - Capacity to validate
 * @returns {boolean} True if valid capacity
 */
function isValidCapacity(capacity) {
  return Number.isInteger(capacity) && capacity >= 1 && capacity <= 100000;
}

/**
 * Validate event category
 * @param {string} category - Category to validate
 * @returns {boolean} True if valid category
 */
function isValidCategory(category) {
  const validCategories = [
    'Technical', 'Cultural', 'Sports', 'Workshop', 
    'Seminar', 'Competition', 'Conference', 'Other'
  ];
  return validCategories.includes(category);
}

/**
 * Validate event type
 * @param {string} eventType - Event type to validate
 * @returns {boolean} True if valid event type
 */
function isValidEventType(eventType) {
  const validTypes = ['Physical', 'Virtual', 'Hybrid'];
  return validTypes.includes(eventType);
}

/**
 * Validate faculty
 * @param {string} faculty - Faculty to validate
 * @returns {boolean} True if valid faculty
 */
function isValidFaculty(faculty) {
  const validFaculties = [
    'Computing', 'Engineering', 'Business', 'Architecture',
    'Hospitality', 'Science', 'Other'
  ];
  return validFaculties.includes(faculty);
}

/**
 * Validate budget
 * @param {number} budget - Budget to validate
 * @returns {boolean} True if valid budget
 */
function isValidBudget(budget) {
  return typeof budget === 'number' && budget >= 0;
}

module.exports = {
  isValidEmail,
  isValidObjectId,
  isValidDate,
  isValidCapacity,
  isValidCategory,
  isValidEventType,
  isValidFaculty,
  isValidBudget
};
