// =============================================================================
// cypress/e2e/authorization.cy.js
// Tests that ProtectedRoute correctly blocks/allows access based on auth state
// and user role. Covers: unauthenticated, wrong role, and correct role access.
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// Mock API responses needed so protected pages don't error after access is
// granted. These are set up per describe block as needed.
// ─────────────────────────────────────────────────────────────────────────────

describe('Unauthenticated Access – Redirects to /login', () => {

  beforeEach(() => {
    // Make sure no session exists
    cy.clearLocalStorage();
  });

  it('redirects /user-management to /login when not logged in', () => {
    cy.visit('/user-management');
    cy.url().should('include', '/login');

    cy.screenshot('authz-01-unauthenticated-user-management');
  });

  it('redirects /vendor-management to /login when not logged in', () => {
    cy.visit('/vendor-management');
    cy.url().should('include', '/login');

    cy.screenshot('authz-02-unauthenticated-vendor-management');
  });

  it('redirects /vendor-dashboard to /login when not logged in', () => {
    cy.visit('/vendor-dashboard');
    cy.url().should('include', '/login');

    cy.screenshot('authz-03-unauthenticated-vendor-dashboard');
  });

  it('redirects /vendor-profile to /login when not logged in', () => {
    cy.visit('/vendor-profile');
    cy.url().should('include', '/login');

    cy.screenshot('authz-04-unauthenticated-vendor-profile');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Wrong Role Access – Redirects to /', () => {

  it('redirects a Student away from /user-management to home', () => {
    cy.visit('/login'); // establish window context
    cy.setStudentSession();
    cy.visit('/user-management');

    // ProtectedRoute sends wrong-role users to /
    cy.url().should('not.include', '/user-management');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');

    cy.screenshot('authz-05-student-blocked-from-user-management');
  });

  it('redirects a Student away from /vendor-management to home', () => {
    cy.visit('/login');
    cy.setStudentSession();
    cy.visit('/vendor-management');

    cy.url().should('not.include', '/vendor-management');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');

    cy.screenshot('authz-06-student-blocked-from-vendor-management');
  });

  it('redirects a Vendor away from /user-management to home', () => {
    cy.visit('/login');
    cy.setVendorSession();
    cy.visit('/user-management');

    cy.url().should('not.include', '/user-management');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');

    cy.screenshot('authz-07-vendor-blocked-from-user-management');
  });

  it('redirects a Vendor away from /vendor-management (admin-only) to home', () => {
    cy.visit('/login');
    cy.setVendorSession();
    cy.visit('/vendor-management');

    cy.url().should('not.include', '/vendor-management');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');

    cy.screenshot('authz-08-vendor-blocked-from-admin-vendor-management');
  });

  it('redirects an Admin away from /vendor-dashboard (vendor-only) to home', () => {
    cy.visit('/login');
    cy.setAdminSession();
    cy.visit('/vendor-dashboard');

    cy.url().should('not.include', '/vendor-dashboard');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');

    cy.screenshot('authz-09-admin-blocked-from-vendor-dashboard');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Correct Role Access – Page Loads Successfully', () => {

  it('allows an Admin to access /user-management', () => {
    cy.intercept('GET', 'http://localhost:5000/api/admin/users', {
      statusCode: 200,
      body: { success: true, data: [] }
    }).as('getUsers');

    cy.visit('/login');
    cy.setAdminSession();
    cy.visit('/user-management');

    // Should NOT redirect to login or home
    cy.url().should('include', '/user-management');
    cy.contains('User Management').should('be.visible');

    cy.screenshot('authz-10-admin-accesses-user-management');
  });

  it('allows an Admin to access /vendor-management', () => {
    cy.intercept('GET', 'http://localhost:5000/api/admin/vendors/applications', {
      statusCode: 200, body: { success: true, data: [] }
    });
    cy.intercept('GET', 'http://localhost:5000/api/admin/vendors/vendors', {
      statusCode: 200, body: { success: true, data: [] }
    });
    cy.intercept('GET', 'http://localhost:5000/api/events', {
      statusCode: 200, body: { success: true, data: [] }
    });

    cy.visit('/login');
    cy.setAdminSession();
    cy.visit('/vendor-management');

    cy.url().should('include', '/vendor-management');
    cy.contains('Vendor Management').should('be.visible');

    cy.screenshot('authz-11-admin-accesses-vendor-management');
  });

  it('allows a Vendor to access /vendor-dashboard', () => {
    cy.intercept('GET', 'http://localhost:5000/api/events', {
      statusCode: 200, body: { success: true, data: [] }
    });
    cy.intercept('GET', 'http://localhost:5000/api/vendors/applications', {
      statusCode: 200, body: { success: true, data: [] }
    });

    cy.visit('/login');
    cy.setVendorSession();
    cy.visit('/vendor-dashboard');

    cy.url().should('include', '/vendor-dashboard');
    cy.contains('Vendor Dashboard').should('be.visible');

    cy.screenshot('authz-12-vendor-accesses-vendor-dashboard');
  });

  it('allows a Vendor to access /vendor-profile', () => {
    cy.intercept('GET', 'http://localhost:5000/api/vendors/profile', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          _id: 'vendor-001',
          firstName: 'Test',
          lastName: 'Vendor',
          email: 'vendor@test.lk',
          brandName: 'My Brand',
          contactNumber: '0771234567'
        }
      }
    });
    cy.intercept('GET', 'http://localhost:5000/api/vendors/applications', {
      statusCode: 200, body: { success: true, data: [] }
    });

    cy.visit('/login');
    cy.setVendorSession();
    cy.visit('/vendor-profile');

    cy.url().should('include', '/vendor-profile');
    cy.contains('Vendor Profile').should('be.visible');

    cy.screenshot('authz-13-vendor-accesses-vendor-profile');
  });

});
