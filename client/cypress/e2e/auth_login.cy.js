// =============================================================================
// cypress/e2e/auth_login.cy.js
// Tests for the Login page – form rendering, validation, and redirects.
// API calls are fully intercepted so no real server is needed.
// =============================================================================

const API = 'http://localhost:5000/api/auth/login';

describe('Login Page', () => {

  // ── Visit the login page fresh before every test ─────────────────────────
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  // ── 1. Page Renders Correctly ─────────────────────────────────────────────
  it('renders the login form with all required elements', () => {
    cy.title().should('include', 'Login');
    cy.contains('h2', 'Member Login').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Login');
    cy.contains('Click here to register').should('be.visible');

    cy.screenshot('login-01-page-loaded');
  });

  // ── 2. Empty Form Validation ──────────────────────────────────────────────
  // Both inputs have `required` so native HTML5 validation fires before React.
  // We remove `required` first so the React JS validation can run and show its
  // own error message.
  it('shows an error when the form is submitted empty', () => {
    // Remove `required` so the browser does not intercept the submit
    cy.get('input[type="email"]').invoke('removeAttr', 'required');
    cy.get('input[type="password"]').invoke('removeAttr', 'required');

    cy.get('button[type="submit"]').click();

    // React's handleSubmit now runs and sets the error state
    cy.contains('Please enter both email and password.').should('be.visible');

    cy.screenshot('login-02-empty-form-error');
  });

  // ── 3. Missing Password Validation ───────────────────────────────────────
  it('shows an error when only email is filled', () => {
    // Remove `required` from password so React validation fires instead of browser
    cy.get('input[type="password"]').invoke('removeAttr', 'required');

    cy.get('input[type="email"]').type('test@eventsync.lk');
    cy.get('button[type="submit"]').click();

    cy.contains('Please enter both email and password.').should('be.visible');

    cy.screenshot('login-03-missing-password-error');
  });

  // ── 4. Invalid Credentials (mocked 401) ──────────────────────────────────
  it('shows an error message for wrong credentials', () => {
    cy.intercept('POST', API, {
      statusCode: 401,
      body: { message: 'Invalid email or password' }
    }).as('loginFail');

    cy.get('input[type="email"]').type('wrong@eventsync.lk');
    cy.get('input[type="password"]').type('WrongPass123!');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');
    cy.contains('Invalid email or password').should('be.visible');

    cy.screenshot('login-04-invalid-credentials-error');
  });

  // ── 5. Successful Admin Login → redirects to /# ──────────────────────────
  it('redirects to home after successful Admin login', () => {
    cy.intercept('POST', API, {
      statusCode: 200,
      body: {
        data: {
          token: 'mock-admin-token',
          user: {
            _id: 'admin-001',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@eventsync.lk',
            userType: 'Admin'
          }
        }
      }
    }).as('loginAdmin');

    cy.get('input[type="email"]').type('admin@eventsync.lk');
    cy.get('input[type="password"]').type('Admin@123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginAdmin');
    // Admin redirects to /#
    cy.url().should('include', '/');

    cy.screenshot('login-05-admin-login-success');
  });

  // ── 6. Successful Vendor Login → redirects to /vendor-dashboard ──────────
  it('redirects vendor to /vendor-dashboard after login', () => {
    // Mock all API calls the vendor-dashboard makes so the page doesn't error
    cy.intercept('GET', 'http://localhost:5000/api/events', {
      statusCode: 200,
      body: { success: true, data: [] }
    });
    cy.intercept('GET', 'http://localhost:5000/api/vendors/applications', {
      statusCode: 200,
      body: { success: true, data: [] }
    });

    cy.intercept('POST', API, {
      statusCode: 200,
      body: {
        data: {
          token: 'mock-vendor-token',
          user: {
            _id: 'vendor-001',
            firstName: 'Test',
            lastName: 'Vendor',
            email: 'vendor@eventsync.lk',
            userType: 'Vendor',
            brandName: 'Test Brand'
          }
        }
      }
    }).as('loginVendor');

    cy.get('input[type="email"]').type('vendor@eventsync.lk');
    cy.get('input[type="password"]').type('Vendor@123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginVendor');
    cy.url().should('include', '/vendor-dashboard');

    cy.screenshot('login-06-vendor-login-redirect');
  });

  // ── 7. Successful Student Login → redirects to /# ────────────────────────
  it('redirects student to home after login', () => {
    cy.intercept('POST', API, {
      statusCode: 200,
      body: {
        data: {
          token: 'mock-student-token',
          user: {
            _id: 'student-001',
            firstName: 'Test',
            lastName: 'Student',
            email: 'student@eventsync.lk',
            userType: 'Student'
          }
        }
      }
    }).as('loginStudent');

    cy.get('input[type="email"]').type('student@eventsync.lk');
    cy.get('input[type="password"]').type('Student@123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginStudent');
    cy.url().should('include', '/');

    cy.screenshot('login-07-student-login-redirect');
  });

  // ── 8. Loading State During Submission ───────────────────────────────────
  it('shows loading state while the login request is in progress', () => {
    cy.intercept('POST', API, (req) => {
      req.reply({
        delay: 800,
        statusCode: 200,
        body: {
          data: {
            token: 'mock-token',
            user: { _id: 'u1', userType: 'Admin', email: 'admin@eventsync.lk' }
          }
        }
      });
    }).as('loginSlow');

    cy.get('input[type="email"]').type('admin@eventsync.lk');
    cy.get('input[type="password"]').type('Admin@123');
    cy.get('button[type="submit"]').click();

    // Button text changes to "Logging in..." and becomes disabled
    cy.get('button[type="submit"]').should('contain', 'Logging in...');
    cy.get('button[type="submit"]').should('be.disabled');

    cy.screenshot('login-08-loading-state');
    cy.wait('@loginSlow');
  });

});
