// =============================================================================
// cypress/e2e/auth_registration.cy.js
// Tests for the Registration pages – selection screen, all 4 form types,
// validation rules, and mocked successful submission.
// No real server needed – all API calls are intercepted.
// =============================================================================

const API_BASE = 'http://localhost:5000/api/auth/register';

describe('Registration Selection Page', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/register');
  });

  it('renders the registration selection page with 4 user type cards', () => {
    cy.title().should('include', 'Register');
    cy.contains('h1', 'Create Your Account').should('be.visible');

    // All 4 user type cards must be present
    cy.contains('Student').should('be.visible');
    cy.contains('Admin').should('be.visible');
    cy.contains('Vendor').should('be.visible');
    cy.contains('Sponsor').should('be.visible');

    cy.screenshot('register-01-selection-page');
  });

  it('clicking Student card navigates to /register/student', () => {
    cy.contains('a', 'Student').click();
    cy.url().should('include', '/register/student');

    cy.screenshot('register-02-navigate-to-student');
  });

  it('clicking Vendor card navigates to /register/vendor', () => {
    cy.contains('a', 'Vendor').click();
    cy.url().should('include', '/register/vendor');

    cy.screenshot('register-03-navigate-to-vendor');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Student Registration Form', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/register/student');
  });

  it('renders the student registration form with all required fields', () => {
    cy.title().should('include', 'Student Registration');
    cy.contains('h2', 'Student Registration').should('be.visible');

    // Common fields
    cy.contains('.form-label', 'First Name').should('be.visible');
    cy.contains('.form-label', 'Last Name').should('be.visible');
    cy.contains('.form-label', 'Email').should('be.visible');
    cy.contains('.form-label', 'Contact Number').should('be.visible');

    // Student-specific fields
    cy.contains('.form-label', 'Faculty').should('be.visible');
    cy.contains('.form-label', 'Academic Year').should('be.visible');

    // Password fields
    cy.contains('.form-label', 'Password').should('be.visible');
    cy.contains('.form-label', 'Confirm Password').should('be.visible');

    // Submit button
    cy.get('button[type="submit"]').should('contain', 'Register');

    cy.screenshot('register-04-student-form-fields');
  });

  it('shows password requirement rules as the user types', () => {
    cy.contains('.form-label', 'Password').next('input').type('abc');

    // Requirements panel must be visible
    cy.contains('Password Requirements').should('be.visible');
    cy.contains('Minimum 8 characters').should('be.visible');
    cy.contains('At least 1 uppercase letter').should('be.visible');

    cy.screenshot('register-05-student-password-rules-visible');
  });

  it('shows error when submitting with an invalid Sri Lankan phone number', () => {
    cy.intercept('POST', `${API_BASE}/student`, { statusCode: 400, body: { message: 'Rejected' } });

    cy.contains('.form-label', 'First Name').next('input').type('John');
    cy.contains('.form-label', 'Last Name').next('input').type('Doe');
    cy.get('input[type="email"]').type('john@student.lk');
    cy.get('input[type="tel"]').type('12345'); // invalid – not 10 digits

    // Fill passwords that pass validation
    cy.get('input[type="password"]').first().type('ValidPass1!');
    cy.get('input[type="password"]').last().type('ValidPass1!');

    cy.get('button[type="submit"]').click();

    cy.contains('Contact number must be a 10 digit Sri Lankan number.').should('be.visible');

    cy.screenshot('register-06-student-invalid-phone');
  });

  it('shows error when passwords do not match', () => {
    cy.contains('.form-label', 'First Name').next('input').type('John');
    cy.contains('.form-label', 'Last Name').next('input').type('Doe');
    cy.get('input[type="email"]').type('john@student.lk');
    cy.get('input[type="tel"]').type('0771234567');

    cy.get('input[type="password"]').first().type('ValidPass1!');
    cy.get('input[type="password"]').last().type('DifferentPass1!');

    cy.get('button[type="submit"]').click();

    cy.contains('Passwords do not match.').should('be.visible');

    cy.screenshot('register-07-student-password-mismatch');
  });

  it('successfully registers a student and redirects to home', () => {
    cy.intercept('POST', `${API_BASE}/student`, {
      statusCode: 201,
      body: {
        data: {
          token: 'mock-student-token',
          user: {
            _id: 'student-001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@student.lk',
            userType: 'Student'
          }
        }
      }
    }).as('registerStudent');

    cy.contains('.form-label', 'First Name').next('input').type('John');
    cy.contains('.form-label', 'Last Name').next('input').type('Doe');
    cy.get('input[type="email"]').type('john@student.lk');
    cy.get('input[type="tel"]').type('0771234567');

    // Faculty is Computing by default → prefix IT
    cy.contains('.form-label', 'User ID').next('input').clear().type('IT12345678');

    cy.get('input[type="password"]').first().type('ValidPass1!');
    cy.get('input[type="password"]').last().type('ValidPass1!');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerStudent');

    // Student is redirected to /# (home)
    cy.contains('Registration successful').should('be.visible');

    cy.screenshot('register-08-student-success-message');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Vendor Registration Form', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/register/vendor');
  });

  it('renders the vendor registration form with brand name and certificate fields', () => {
    cy.title().should('include', 'Vendor Registration');
    cy.contains('h2', 'Vendor Registration').should('be.visible');

    // Vendor-specific fields
    cy.contains('.form-label', 'Brand Name').should('be.visible');
    cy.contains('.form-label', 'Food Safety Certificate').should('be.visible');
    cy.get('input[type="file"]').should('exist');

    cy.screenshot('register-09-vendor-form-fields');
  });

  it('shows error when food safety certificate is missing on submission', () => {
    cy.contains('.form-label', 'First Name').next('input').type('Vendor');
    cy.contains('.form-label', 'Last Name').next('input').type('User');
    cy.get('input[type="email"]').type('vendor@test.lk');
    cy.get('input[type="tel"]').type('0771234567');
    cy.contains('.form-label', 'Brand Name').next('input').type('My Brand');

    cy.get('input[type="password"]').first().type('ValidPass1!');
    cy.get('input[type="password"]').last().type('ValidPass1!');

    // Do NOT attach a certificate file
    cy.get('button[type="submit"]').click();

    cy.contains('Food safety certificate is required.').should('be.visible');

    cy.screenshot('register-10-vendor-missing-certificate');
  });

  it('successfully registers a vendor and redirects to vendor dashboard', () => {
    cy.intercept('GET', 'http://localhost:5000/api/events', {
      statusCode: 200, body: { success: true, data: [] }
    });
    cy.intercept('GET', 'http://localhost:5000/api/vendors/applications', {
      statusCode: 200, body: { success: true, data: [] }
    });
    cy.intercept('POST', `${API_BASE}/vendor`, {
      statusCode: 201,
      body: {
        data: {
          token: 'mock-vendor-token',
          user: {
            _id: 'vendor-001',
            firstName: 'Vendor',
            lastName: 'User',
            email: 'vendor@test.lk',
            userType: 'Vendor',
            brandName: 'My Brand'
          }
        }
      }
    }).as('registerVendor');

    cy.contains('.form-label', 'First Name').next('input').type('Vendor');
    cy.contains('.form-label', 'Last Name').next('input').type('User');
    cy.get('input[type="email"]').type('vendor@test.lk');
    cy.get('input[type="tel"]').type('0771234567');
    cy.contains('.form-label', 'Brand Name').next('input').type('My Brand');

    // Attach a dummy file as the certificate
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('fake-cert-content'),
      fileName: 'certificate.pdf',
      mimeType: 'application/pdf'
    });

    cy.get('input[type="password"]').first().type('ValidPass1!');
    cy.get('input[type="password"]').last().type('ValidPass1!');

    cy.get('button[type="submit"]').click();

    cy.wait('@registerVendor');

    cy.url().should('include', '/vendor-dashboard');

    cy.screenshot('register-11-vendor-registration-success');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Admin Registration Form', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/register/admin');
  });

  it('renders the admin registration form with auto-generated User ID', () => {
    cy.title().should('include', 'Admin Registration');
    cy.contains('h2', 'Admin Registration').should('be.visible');

    // User ID is auto-generated and readonly for admin
    cy.contains('.form-label', 'User ID').next('input').should('have.attr', 'readonly');

    // User ID must start with AD
    cy.contains('.form-label', 'User ID').next('input').invoke('val').should('match', /^AD\d+/);

    cy.screenshot('register-12-admin-form-auto-id');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Sponsor Registration Form', () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/register/sponsor');
  });

  it('renders the sponsor registration form with company-specific fields', () => {
    cy.title().should('include', 'Sponsor Registration');
    cy.contains('h2', 'Sponsor Registration').should('be.visible');

    // Sponsor-specific
    cy.contains('.form-label', 'Brand / Company Name').should('be.visible');
    cy.contains('.form-label', 'Brand / Company Email').should('be.visible');

    // Personal and contact
    cy.contains('.form-label', 'Personal Email').should('be.visible');
    cy.contains('.form-label', 'Contact Number').should('be.visible');

    cy.screenshot('register-13-sponsor-form-fields');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Invalid Registration Type', () => {

  it('shows an error message for an unrecognized user type in the URL', () => {
    cy.clearLocalStorage();
    cy.visit('/register/hacker');

    cy.contains('Invalid registration type').should('be.visible');
    cy.contains('selection').should('be.visible'); // link back to /register

    cy.screenshot('register-14-invalid-type-message');
  });

});
