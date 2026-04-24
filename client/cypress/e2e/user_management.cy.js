// =============================================================================
// cypress/e2e/user_management.cy.js
// Tests for the Admin → User Management page.
// Covers: page load, stat cards, role tabs, search bar, and user table rows.
// All API calls are intercepted with mock data.
// =============================================================================

const API = 'http://localhost:5000/api/admin/users';

// ── Realistic mock user list covering all 4 roles ───────────────────────────
const MOCK_USERS = [
  {
    _id: 'u1', firstName: 'Alice', lastName: 'Admin',
    email: 'alice@eventsync.lk', userType: 'Admin', userId: 'AD11111111',
    createdAt: '2025-01-10T08:00:00Z'
  },
  {
    _id: 'u2', firstName: 'Bob', lastName: 'Student',
    email: 'bob@student.lk', userType: 'Student', userId: 'IT22222222',
    faculty: 'Computing', createdAt: '2025-02-14T10:30:00Z'
  },
  {
    _id: 'u3', firstName: 'Carol', lastName: 'Vendor',
    email: 'carol@vendor.lk', userType: 'Vendor', userId: 'VN33333333',
    brandName: 'Carol Foods', createdAt: '2025-03-05T09:00:00Z'
  },
  {
    _id: 'u4', firstName: 'Dave', lastName: 'Sponsor',
    email: 'dave@sponsor.lk', userType: 'Sponsor', userId: 'SP44444444',
    companyName: 'Dave Corp', createdAt: '2025-04-01T11:00:00Z'
  },
  {
    _id: 'u5', firstName: 'Eve', lastName: 'Student2',
    email: 'eve@student.lk', userType: 'Student', userId: 'EN55555555',
    faculty: 'Engineering', createdAt: '2025-04-15T14:00:00Z'
  },
];

// ── Shared setup: inject admin session + mock the users API ──────────────────
function setupAdminWithUsers() {
  cy.intercept('GET', API, {
    statusCode: 200,
    body: { success: true, data: MOCK_USERS }
  }).as('getUsers');

  cy.visit('/login');
  cy.setAdminSession();
  cy.visit('/user-management');
  cy.wait('@getUsers');
}

// ─────────────────────────────────────────────────────────────────────────────
describe('User Management – Page Structure', () => {

  beforeEach(() => {
    setupAdminWithUsers();
  });

  it('renders the page title and subtitle', () => {
    cy.contains('h1', 'User Management').should('be.visible');
    cy.contains('View and manage all existing users').should('be.visible');

    cy.screenshot('usermgmt-01-page-title');
  });

  it('renders 5 stat cards (Total, Admins, Students, Vendors, Sponsors)', () => {
    cy.contains('Total Users').should('be.visible');
    cy.contains('Admins').should('be.visible');
    cy.contains('Students').should('be.visible');
    cy.contains('Vendors').should('be.visible');
    cy.contains('Sponsors').should('be.visible');

    cy.screenshot('usermgmt-02-stat-cards');
  });

  it('stat card values match the mock data counts', () => {
    // Total = 5, Admins = 1, Students = 2, Vendors = 1, Sponsors = 1
    // The stat cards render the count values as large numbers
    // We check by finding the label and verifying the sibling number
    cy.contains('Total Users').parent().contains('5');
    cy.contains('Students').parent().contains('2');

    cy.screenshot('usermgmt-03-stat-card-values');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('User Management – Role Tabs', () => {

  beforeEach(() => {
    setupAdminWithUsers();
  });

  it('renders all 5 role tab buttons', () => {
    cy.contains('button', 'All Users').should('be.visible');
    cy.contains('button', 'Admins').should('be.visible');
    cy.contains('button', 'Students').should('be.visible');
    cy.contains('button', 'Vendors').should('be.visible');
    cy.contains('button', 'Sponsors').should('be.visible');

    cy.screenshot('usermgmt-04-role-tabs');
  });

  it('shows all 5 users by default on the All Users tab', () => {
    // All 5 mock users should be visible in the table
    cy.contains('Alice Admin').should('be.visible');
    cy.contains('Bob Student').should('be.visible');
    cy.contains('Carol Vendor').should('be.visible');
    cy.contains('Dave Sponsor').should('be.visible');
    cy.contains('Eve Student2').should('be.visible');

    cy.screenshot('usermgmt-05-all-users-visible');
  });

  it('clicking the Admins tab filters the list to show only admins', () => {
    cy.contains('button', 'Admins').click();

    cy.contains('Alice Admin').should('be.visible');
    // Students and vendors should not be in the list
    cy.contains('Bob Student').should('not.exist');
    cy.contains('Carol Vendor').should('not.exist');

    cy.screenshot('usermgmt-06-admins-tab-filter');
  });

  it('clicking the Students tab shows only students', () => {
    cy.contains('button', 'Students').click();

    cy.contains('Bob Student').should('be.visible');
    cy.contains('Eve Student2').should('be.visible');
    cy.contains('Alice Admin').should('not.exist');

    cy.screenshot('usermgmt-07-students-tab-filter');
  });

  it('clicking the Vendors tab shows only vendors', () => {
    cy.contains('button', 'Vendors').click();

    cy.contains('Carol Vendor').should('be.visible');
    cy.contains('Bob Student').should('not.exist');

    cy.screenshot('usermgmt-08-vendors-tab-filter');
  });

  it('clicking back to All Users tab shows everyone again', () => {
    cy.contains('button', 'Admins').click();
    cy.contains('button', 'All Users').click();

    cy.contains('Alice Admin').should('be.visible');
    cy.contains('Bob Student').should('be.visible');
    cy.contains('Carol Vendor').should('be.visible');

    cy.screenshot('usermgmt-09-back-to-all-users');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('User Management – Search', () => {

  beforeEach(() => {
    setupAdminWithUsers();
  });

  it('renders the search input', () => {
    cy.get('input[type="text"][placeholder*="John"]').should('be.visible');

    cy.screenshot('usermgmt-10-search-bar-visible');
  });

  it('filters users by name when typing in the search box', () => {
    cy.get('input[type="text"][placeholder*="John"]').type('alice');

    cy.contains('Alice Admin').should('be.visible');
    cy.contains('Bob Student').should('not.exist');

    cy.screenshot('usermgmt-11-search-by-name');
  });

  it('filters users by email', () => {
    cy.get('input[type="text"][placeholder*="John"]').type('carol@vendor.lk');

    cy.contains('Carol Vendor').should('be.visible');
    cy.contains('Alice Admin').should('not.exist');

    cy.screenshot('usermgmt-12-search-by-email');
  });

  it('shows no results message when search matches nothing', () => {
    cy.get('input[type="text"][placeholder*="John"]').type('zzznomatch');

    // No user rows should appear
    cy.contains('Alice Admin').should('not.exist');
    cy.contains('Bob Student').should('not.exist');

    cy.screenshot('usermgmt-13-search-no-results');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
describe('User Management – Table Rows and Role Badges', () => {

  beforeEach(() => {
    setupAdminWithUsers();
  });

  it('displays email addresses in the table', () => {
    cy.contains('alice@eventsync.lk').should('be.visible');
    cy.contains('bob@student.lk').should('be.visible');
    cy.contains('carol@vendor.lk').should('be.visible');

    cy.screenshot('usermgmt-14-emails-visible');
  });

  it('displays role badges for each user', () => {
    // Each user type has a badge. We check that at least one of each is visible.
    cy.contains('Admin').should('be.visible');
    cy.contains('Student').should('be.visible');
    cy.contains('Vendor').should('be.visible');
    cy.contains('Sponsor').should('be.visible');

    cy.screenshot('usermgmt-15-role-badges');
  });

});
