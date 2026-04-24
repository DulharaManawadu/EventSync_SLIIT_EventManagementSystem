// =============================================================================
// cypress/e2e/vendor_management.cy.js
// Tests for the Admin → Vendor Management page.
// Covers: page load, status tabs, filter bar, application cards, navigation.
// All API calls are intercepted with mock data.
// =============================================================================

const APPS_API     = 'http://localhost:5000/api/admin/vendors/applications';
const VENDORS_API  = 'http://localhost:5000/api/admin/vendors/vendors';
const EVENTS_API   = 'http://localhost:5000/api/events';

// ── Mock vendor list ─────────────────────────────────────────────────────────
const MOCK_VENDORS = [
  { _id: 'v1', firstName: 'Carol', lastName: 'Vendor', brandName: 'Carol Foods' },
  { _id: 'v2', firstName: 'Mike',  lastName: 'Foods',  brandName: 'Mike Bites'  }
];

// ── Mock events list ─────────────────────────────────────────────────────────
const MOCK_EVENTS = [
  { _id: 'evt-001', title: 'Tech Fest 2026', date: '2026-06-15T09:00:00Z' },
  { _id: 'evt-002', title: 'Food Fair 2026', date: '2026-07-20T10:00:00Z' }
];

// ── Mock vendor applications ─────────────────────────────────────────────────
const MOCK_APPLICATIONS = [
  {
    _id: 'app-001',
    vendor: { _id: 'v1', firstName: 'Carol', lastName: 'Vendor', brandName: 'Carol Foods' },
    event:  { _id: 'evt-001', title: 'Tech Fest 2026' },
    status: 'Pending',
    stallName: 'Stall A1',
    foodType: 'Beverages',
    eventDate: '2026-06-15T09:00:00Z',
    appliedAt: '2026-05-01T08:00:00Z'
  },
  {
    _id: 'app-002',
    vendor: { _id: 'v2', firstName: 'Mike', lastName: 'Foods', brandName: 'Mike Bites' },
    event:  { _id: 'evt-002', title: 'Food Fair 2026' },
    status: 'Approved',
    stallName: 'Stall B3',
    foodType: 'Snacks',
    eventDate: '2026-07-20T10:00:00Z',
    appliedAt: '2026-05-10T10:00:00Z'
  },
  {
    _id: 'app-003',
    vendor: { _id: 'v1', firstName: 'Carol', lastName: 'Vendor', brandName: 'Carol Foods' },
    event:  { _id: 'evt-001', title: 'Tech Fest 2026' },
    status: 'Declined',
    stallName: 'Stall C2',
    foodType: 'Meals',
    eventDate: '2026-06-15T09:00:00Z',
    appliedAt: '2026-05-12T11:00:00Z'
  }
];

// ── Shared setup ──────────────────────────────────────────────────────────────
function setupAdminVendorPage() {
  cy.intercept('GET', APPS_API, {
    statusCode: 200,
    body: { success: true, data: MOCK_APPLICATIONS }
  }).as('getApps');

  cy.intercept('GET', VENDORS_API, {
    statusCode: 200,
    body: { success: true, data: MOCK_VENDORS }
  }).as('getVendors');

  cy.intercept('GET', EVENTS_API, {
    statusCode: 200,
    body: { success: true, data: MOCK_EVENTS }
  }).as('getEvents');

  cy.visit('/login');
  cy.setAdminSession();
  cy.visit('/vendor-management');

  cy.wait('@getApps');
  cy.wait('@getVendors');
  cy.wait('@getEvents');
}

function getStatusTab(label) {
  return cy.get('button').filter((_, el) => {
    const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
    return text.startsWith(label) && /\d/.test(text);
  }).first();
}

// ─────────────────────────────────────────────────────────────────────────────
describe('Vendor Management – Page Structure', () => {

  beforeEach(() => {
    setupAdminVendorPage();
  });

  it('renders the page heading and subtitle', () => {
    cy.contains('h1', 'Vendor Management').should('be.visible');
    cy.contains('Review and manage vendor stall applications').should('be.visible');

    cy.screenshot('vendormgmt-01-page-heading');
  });

  it('renders the 4 status tabs', () => {
    getStatusTab('All Applications').should('be.visible');
    getStatusTab('Pending').should('be.visible');
    getStatusTab('Approved').should('be.visible');
    getStatusTab('Denied').should('be.visible');

    cy.screenshot('vendormgmt-02-status-tabs');
  });

  it('renders the filter bar with Vendor Brand, Event Name, and Event Date controls', () => {
    cy.contains('Vendor Brand').should('be.visible');
    cy.contains('Event Name').should('be.visible');
    cy.contains('Event Date').should('be.visible');

    cy.screenshot('vendormgmt-03-filter-bar');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Vendor Management – Application Cards', () => {

  beforeEach(() => {
    setupAdminVendorPage();
  });

  it('shows all 3 application cards by default (All Applications tab)', () => {
    cy.contains('Carol Foods').should('be.visible');
    cy.contains('Mike Bites').should('be.visible');
    // Carol Foods appears in 2 applications so it appears twice
    cy.contains('Stall A1').should('be.visible');
    cy.contains('Stall B3').should('be.visible');
    cy.contains('Stall C2').should('be.visible');

    cy.screenshot('vendormgmt-04-all-application-cards');
  });

  it('application cards display status badges', () => {
    cy.contains('Pending').should('be.visible');
    cy.contains('Approved').should('be.visible');
    cy.contains('Declined').should('be.visible');

    cy.screenshot('vendormgmt-05-status-badges');
  });

  it('application cards display event names', () => {
    cy.contains('Tech Fest 2026').should('be.visible');
    cy.contains('Food Fair 2026').should('be.visible');

    cy.screenshot('vendormgmt-06-event-names-on-cards');
  });

  it('application cards display food type and stall name', () => {
    cy.contains('Beverages').should('be.visible');
    cy.contains('Snacks').should('be.visible');

    cy.screenshot('vendormgmt-07-food-type-stall-name');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Vendor Management – Status Tab Filtering', () => {

  beforeEach(() => {
    setupAdminVendorPage();
  });

  it('clicking Pending tab shows only Pending applications', () => {
    getStatusTab('Pending').click();

    cy.contains('Stall A1').should('be.visible');     // app-001 is Pending
    cy.contains('Stall B3').should('not.exist');       // app-002 is Approved
    cy.contains('Stall C2').should('not.exist');       // app-003 is Declined

    cy.screenshot('vendormgmt-08-pending-tab-filter');
  });

  it('clicking Approved tab shows only Approved applications', () => {
    getStatusTab('Approved').click();

    cy.contains('Stall B3').should('be.visible');     // app-002 is Approved
    cy.contains('Stall A1').should('not.exist');
    cy.contains('Stall C2').should('not.exist');

    cy.screenshot('vendormgmt-09-approved-tab-filter');
  });

  it('clicking Denied tab shows only Declined applications', () => {
    getStatusTab('Denied').click();

    cy.contains('Stall C2').should('be.visible');     // app-003 is Declined
    cy.contains('Stall A1').should('not.exist');
    cy.contains('Stall B3').should('not.exist');

    cy.screenshot('vendormgmt-10-denied-tab-filter');
  });

  it('clicking All Applications tab restores full list', () => {
    getStatusTab('Pending').click();
    getStatusTab('All Applications').click();

    cy.contains('Stall A1').should('be.visible');
    cy.contains('Stall B3').should('be.visible');
    cy.contains('Stall C2').should('be.visible');

    cy.screenshot('vendormgmt-11-back-to-all-applications');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Vendor Management – Empty State', () => {

  it('shows "No Applications Found" when there are no applications', () => {
    cy.intercept('GET', APPS_API, {
      statusCode: 200, body: { success: true, data: [] }
    });
    cy.intercept('GET', VENDORS_API, {
      statusCode: 200, body: { success: true, data: [] }
    });
    cy.intercept('GET', EVENTS_API, {
      statusCode: 200, body: { success: true, data: [] }
    }).as('emptySetup');

    cy.visit('/login');
    cy.setAdminSession();
    cy.visit('/vendor-management');
    cy.wait('@emptySetup');

    cy.contains('No Applications Found').should('be.visible');

    cy.screenshot('vendormgmt-12-empty-state');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('Vendor Management – Card Click Navigation', () => {

  beforeEach(() => {
    setupAdminVendorPage();
  });

  it('clicking an application card navigates to the detail page', () => {
    // Mock the detail page API (VendorApplicationDetailsAdmin will fetch this)
    cy.intercept('GET', `http://localhost:5000/api/admin/vendors/applications/app-001`, {
      statusCode: 200,
      body: {
        success: true,
        data: {
          _id: 'app-001',
          vendor: MOCK_VENDORS[0],
          event: MOCK_EVENTS[0],
          status: 'Pending',
          stallName: 'Stall A1',
          foodType: 'Beverages'
        }
      }
    });

    // Click the first card (Stall A1 – Pending)
    cy.contains('Stall A1').click();

    cy.url().should('include', '/vendor-application-admin/app-001');

    cy.screenshot('vendormgmt-13-card-click-navigates');
  });

});
