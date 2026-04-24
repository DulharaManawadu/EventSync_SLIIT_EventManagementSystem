// =============================================================================
// cypress/e2e/vendor_dashboard.cy.js
// Tests for the Vendor Dashboard, Vendor Profile, and Vendor Edit Profile pages.
// All API calls are intercepted. Uses cy.setVendorSession() for auth.
// =============================================================================

const EVENTS_API       = 'http://localhost:5000/api/events';
const APPS_API         = 'http://localhost:5000/api/vendors/applications';
const PROFILE_API      = 'http://localhost:5000/api/vendors/profile';

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_EVENTS = [
  {
    _id: 'evt-001',
    title: 'Tech Fest 2026',
    date: '2026-06-15T09:00:00Z',
    endDate: '2026-06-15T17:00:00Z',
    venue: 'Main Auditorium',
    status: 'Approved',
    capacity: 200
  },
  {
    _id: 'evt-002',
    title: 'Food Fair 2026',
    date: '2026-07-20T10:00:00Z',
    venue: 'Open Ground',
    status: 'Approved',
    capacity: 300
  }
];

const MOCK_APPLICATIONS = [
  {
    _id: 'app-001',
    event: { _id: 'evt-001', title: 'Tech Fest 2026' },
    eventTitle: 'Tech Fest 2026',
    status: 'Pending',
    stallName: 'Stall A1',
    foodType: 'Beverages'
  },
  {
    _id: 'app-002',
    event: { _id: 'evt-002', title: 'Food Fair 2026' },
    eventTitle: 'Food Fair 2026',
    status: 'Approved',
    stallName: 'Stall B3',
    foodType: 'Snacks'
  }
];

const MOCK_PROFILE = {
  _id: 'vendor-001',
  user: {
    _id: 'vendor-001',
    firstName: 'Test',
    lastName: 'Vendor',
    email: 'vendor@test.lk',
    contactNumber: '0771234567',
    brandName: 'My Brand',
    userId: 'VN12345678'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
describe('Vendor Dashboard – Page Structure', () => {

  beforeEach(() => {
    cy.intercept('GET', EVENTS_API, {
      statusCode: 200,
      body: { success: true, data: MOCK_EVENTS }
    }).as('getEvents');

    cy.intercept('GET', APPS_API, {
      statusCode: 200,
      body: { success: true, data: MOCK_APPLICATIONS }
    }).as('getApplications');

    cy.visit('/login');
    cy.setVendorSession();
    cy.visit('/vendor-dashboard');

    cy.wait('@getEvents');
    cy.wait('@getApplications');
  });

  it('renders the Vendor Dashboard page heading', () => {
    cy.contains('Vendor Dashboard').should('be.visible');

    cy.screenshot('vendordash-01-page-heading');
  });

  it('renders 4 stat cards with correct labels', () => {
    cy.contains('Total Applications').should('be.visible');
    cy.contains('Pending Applications').should('be.visible');
    cy.contains('Approved Applications').should('be.visible');
    cy.contains('Upcoming Events').should('be.visible');

    cy.screenshot('vendordash-02-stat-cards');
  });

  it('stat cards show correct counts from mock data', () => {
    // Total Applications: 2
    // Pending: 1 (app-001)
    // Approved: 1 (app-002)
    // Events: 2
    cy.get('.stat-content h3').eq(0).should('contain', '2'); // Total
    cy.get('.stat-content h3').eq(1).should('contain', '1'); // Pending
    cy.get('.stat-content h3').eq(2).should('contain', '1'); // Approved
    cy.get('.stat-content h3').eq(3).should('contain', '2'); // Events

    cy.screenshot('vendordash-03-stat-card-counts');
  });

  it('renders the "Your Applications" section heading', () => {
    cy.contains('Your Applications').should('be.visible');

    cy.screenshot('vendordash-04-applications-section');
  });

  it('renders application cards with event title, status, and stall', () => {
    cy.contains('Tech Fest 2026').should('be.visible');
    cy.contains('Food Fair 2026').should('be.visible');
    cy.contains('Pending').should('be.visible');
    cy.contains('Approved').should('be.visible');
    cy.contains('Stall A1').should('be.visible');
    cy.contains('Stall B3').should('be.visible');

    cy.screenshot('vendordash-05-application-cards');
  });

  it('renders a "Details" link for each application', () => {
    cy.contains('a', 'Details').should('be.visible');

    cy.screenshot('vendordash-06-details-links');
  });

  it('renders the "View Profile" button', () => {
    cy.contains('button', 'View Profile').should('be.visible');

    cy.screenshot('vendordash-07-view-profile-button');
  });

  it('clicking "View Profile" navigates to /vendor-profile', () => {
    cy.intercept('GET', PROFILE_API, {
      statusCode: 200,
      body: { success: true, data: MOCK_PROFILE }
    });

    cy.contains('button', 'View Profile').click();
    cy.url().should('include', '/vendor-profile');

    cy.screenshot('vendordash-08-navigate-to-profile');
  });

  it('renders the "Upcoming Events to Apply" section', () => {
    cy.contains('Upcoming Events').should('be.visible');

    cy.screenshot('vendordash-09-upcoming-events-section');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Vendor Dashboard – Empty State', () => {

  it('shows a "No applications yet" message when there are no applications', () => {
    cy.intercept('GET', EVENTS_API, {
      statusCode: 200,
      body: { success: true, data: MOCK_EVENTS }
    });
    cy.intercept('GET', APPS_API, {
      statusCode: 200,
      body: { success: true, data: [] } // empty
    }).as('emptyApps');

    cy.visit('/login');
    cy.setVendorSession();
    cy.visit('/vendor-dashboard');
    cy.wait('@emptyApps');

    cy.contains('No applications yet').should('be.visible');

    cy.screenshot('vendordash-10-empty-applications');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Vendor Profile Page', () => {

  beforeEach(() => {
    cy.intercept('GET', PROFILE_API, {
      statusCode: 200,
      body: { success: true, data: MOCK_PROFILE }
    }).as('getProfile');

    cy.intercept('GET', APPS_API, {
      statusCode: 200,
      body: { success: true, data: MOCK_APPLICATIONS }
    }).as('getApps');

    cy.visit('/login');
    cy.setVendorSession();
    cy.visit('/vendor-profile');

    cy.wait('@getProfile');
    cy.wait('@getApps');
  });

  it('renders the Vendor Profile page heading', () => {
    cy.contains('Vendor Profile').should('be.visible');

    cy.screenshot('vendorprofile-01-heading');
  });

  it('renders the vendor name from the session user', () => {
    // The profile header shows "Hello, {firstName}"
    cy.contains('Test').should('be.visible');

    cy.screenshot('vendorprofile-02-vendor-name');
  });

  it('renders the Personal Information section', () => {
    cy.contains('Personal Information').should('be.visible');

    cy.screenshot('vendorprofile-03-personal-info-section');
  });

  it('renders the Business Information section', () => {
    cy.contains('Business Information').should('be.visible');

    cy.screenshot('vendorprofile-04-business-info-section');
  });

  it('renders Edit Profile and Back to Dashboard buttons', () => {
    cy.contains('Edit Profile').should('be.visible');
    cy.contains('Back to Dashboard').should('be.visible');

    cy.screenshot('vendorprofile-05-action-buttons');
  });

  it('clicking Back to Dashboard navigates to /vendor-dashboard', () => {
    cy.intercept('GET', EVENTS_API, {
      statusCode: 200, body: { success: true, data: [] }
    });
    cy.intercept('GET', APPS_API, {
      statusCode: 200, body: { success: true, data: [] }
    });

    cy.contains('Back to Dashboard').click();
    cy.url().should('include', '/vendor-dashboard');

    cy.screenshot('vendorprofile-06-back-to-dashboard');
  });

  it('clicking Edit Profile navigates to /vendor-profile/edit', () => {
    cy.contains('Edit Profile').click();
    cy.url().should('include', '/vendor-profile/edit');

    cy.screenshot('vendorprofile-07-navigate-to-edit');
  });

});
