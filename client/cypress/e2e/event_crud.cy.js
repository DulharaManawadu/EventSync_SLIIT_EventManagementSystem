// =============================================================================
// cypress/e2e/event_crud.cy.js
//
// End-to-End automated UI tests for Event CRUD operations in EventSync.
//
// Test coverage:
//  ① CREATE  – Fill and submit the Create Event form (valid & invalid data)
//  ② READ    – View the Events listing page and verify events are displayed
//  ③ UPDATE  – Edit an existing event through the Admin Event Approval panel
//  ④ DELETE  – Delete an event through the Admin panel with modal confirmation
//  ⑤ STATUS  – Approve / Reject / Pending status transitions
//  ⑥ SEARCH  – Filter events by title using the search bar
//  ⑦ AUTH    – Verify route-level protection (unauthenticated redirect)
//
// How the tests are isolated:
//  • API calls are intercepted with cy.intercept() so no real DB
//    mutations happen when running the suite offline.
//  • Fixture data is loaded from cypress/fixtures/event.json.
//  • Auth is injected via cy.setAdminSession() / cy.setStudentSession().
// =============================================================================

const BASE_API = 'http://localhost:5000/api/events';

// ─── Shared mock events returned by the intercepted GET /api/events ──────────
const MOCK_EVENTS = [
  {
    _id: 'evt-001',
    title: 'Cypress Tech Fest 2026',
    description: 'A comprehensive automated testing event organized by the IT society.',
    category: 'Technical',
    eventType: 'Physical',
    faculty: 'Computing',
    department: 'Software Engineering',
    venue: 'Main Auditorium A',
    date: '2027-06-15T09:00:00.000Z',
    endDate: '2027-06-15T17:00:00.000Z',
    capacity: 150,
    organizerName: 'Dulhara Manawadu',
    organizerEmail: 'dulhara@eventsync.lk',
    phoneNumbers: ['0771234567'],
    societyName: 'SLIIT IT Society',
    status: 'Pending',
    budget: 50000,
    tags: ['testing', 'tech', 'workshops']
  },
  {
    _id: 'evt-002',
    title: 'Cultural Night 2026',
    description: 'Annual cultural night showcasing talent across all faculties.',
    category: 'Cultural',
    eventType: 'Physical',
    faculty: 'Business',
    department: 'Management',
    venue: 'Open Air Theatre',
    date: '2027-07-20T18:00:00.000Z',
    endDate: '2027-07-20T22:00:00.000Z',
    capacity: 500,
    organizerName: 'Dewmini Iddamalgoda',
    organizerEmail: 'dewmini@eventsync.lk',
    phoneNumbers: ['0779876543'],
    societyName: 'SLIIT Cultural Union',
    status: 'Approved',
    budget: 120000,
    tags: ['culture', 'music', 'dance']
  }
];

// ─────────────────────────────────────────────────────────────────────────────
describe(' Event CRUD — Automated UI Tests', () => {

  // Load fixture once for the whole describe block
  before(() => {
    cy.log('🔧 Loading test fixture data...');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1 — AUTHENTICATION GUARD TESTS
  // ═══════════════════════════════════════════════════════════════════════════
  describe(' Step 1: Authentication & Route Protection', () => {

    beforeEach(() => {
      cy.clearSession(); // ensure no session before each auth test
    });

    it('1.1 — Login page loads and shows required fields', () => {
      cy.visit('/login');

      cy.get('h2').should('contain.text', 'Member Login');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Login');

      cy.log('✅ Login page renders correctly with all required fields');
    });

    it('1.2 — Unauthenticated user is redirected away from /create-event', () => {
      // Try to navigate directly to the protected route
      cy.visit('/create-event');

      // The ProtectedRoute should redirect to /login
      cy.url().should('include', '/login');
      cy.log('✅ ProtectedRoute correctly redirected unauthenticated user to /login');
    });

    it('1.3 — Unauthenticated user is redirected away from /event-approval', () => {
      cy.visit('/event-approval');
      cy.url().should('include', '/login');
      cy.log('✅ Admin route /event-approval blocked for unauthenticated user');
    });

    it('1.4 — Login form shows error when credentials are empty', () => {
      cy.visit('/login');

      // Submit without filling in anything
      cy.get('button[type="submit"]').click();

      // The browser's native validation or the app should stop submission
      // The form uses `required` attributes, so we verify the email input is invalid
      cy.get('input[type="email"]').then(($el) => {
        expect($el[0].validity.valid).to.be.false;
      });

      cy.log('✅ Empty form correctly blocked by browser required-field validation');
    });

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2 — CREATE EVENT
  // ═══════════════════════════════════════════════════════════════════════════
  describe(' Step 2: Create Event (C in CRUD)', () => {

    beforeEach(() => {
      // Inject student session (Create Event is allowed for Admin & Student)
      cy.setStudentSession();

      // Intercept the POST to prevent real DB writes
      cy.intercept('POST', `${BASE_API}`, (req) => {
        req.reply({
          statusCode: 201,
          body: {
            success: true,
            data: {
              _id: 'evt-new-001',
              ...req.body,
              status: 'Pending'
            }
          }
        });
      }).as('createEvent');
    });

    it('2.1 — Create Event page loads with all form fields visible', () => {
      cy.visit('/create-event');

      cy.get('h2').should('contain.text', 'Create New Event');

      // Check all required fields are present
      cy.get('#title').should('be.visible');
      cy.get('#venue').should('be.visible');
      cy.get('#category').should('be.visible');
      cy.get('#eventType').should('be.visible');
      cy.get('#faculty').should('be.visible');
      cy.get('#date').should('be.visible');
      cy.get('#capacity').should('be.visible');
      cy.get('#organizerName').should('be.visible');
      cy.get('#phoneNumbers').should('be.visible');
      cy.get('#societyName').should('be.visible');
      cy.get('#description').should('be.visible');

      cy.log('✅ All Create Event form fields are visible');
    });

    it('2.2 — Validation error shown when required fields are empty', () => {
      cy.visit('/create-event');

      // Stub the window.alert call so Cypress does not get blocked by it
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });

      // Submit empty form
      cy.get('form#contact').submit();

      // Alert should have been called with validation errors
      cy.get('@alertStub').should('have.been.called');

      // The validation summary should appear in the DOM
      cy.get('.alert.alert-danger').should('be.visible');

      cy.log('✅ Validation errors are shown when required fields are empty');
    });

    it('2.3 — Validation: event title must be at least 3 characters', () => {
      cy.visit('/create-event');

      cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

      cy.get('#title').type('AB'); // 2 chars — should fail
      cy.get('form#contact').submit();

      cy.get('@alertStub').should('have.been.called');

      cy.log('✅ Short title correctly fails front-end validation');
    });

    it('2.4 — Validation: past date is rejected', () => {
      cy.visit('/create-event');

      cy.fixture('event').then((data) => {
        cy.window().then((win) => cy.stub(win, 'alert').as('alertStub'));

        // Fill all except date — set a past date
        cy.get('#title').type(data.newEvent.title);
        cy.get('#venue').type(data.newEvent.venue);
        cy.get('#description').type(data.newEvent.description);
        cy.get('#capacity').type(data.newEvent.capacity);
        cy.get('#organizerName').type(data.newEvent.organizerName);
        cy.get('#phoneNumbers').type(data.newEvent.phoneNumbers);
        cy.get('#societyName').type(data.newEvent.societyName);

        // Inject a clearly past date using native event so React state updates
        cy.get('#date').then(($el) => {
          const setter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 'value'
          ).set;
          setter.call($el[0], '2020-01-01T09:00');
          $el[0].dispatchEvent(new Event('input', { bubbles: true }));
          $el[0].dispatchEvent(new Event('change', { bubbles: true }));
        });

        cy.get('form#contact').submit();

        cy.get('@alertStub').should('have.been.called');
      });

      cy.log('✅ Past start date correctly rejected by validation');
    });

    it('2.5 — Successfully fills and submits the Create Event form', () => {
      cy.visit('/create-event');

      cy.fixture('event').then((data) => {
        const ev = data.newEvent;

        cy.fillCreateEventForm(ev);

        // Submit form
        cy.get('form#contact').submit();

        // Wait for the intercepted POST request
        cy.wait('@createEvent').then((interception) => {
          expect(interception.request.body.title).to.equal(ev.title);
          expect(interception.request.body.venue).to.equal(ev.venue);
          expect(interception.request.body.capacity).to.equal(parseInt(ev.capacity, 10));
          expect(interception.response.statusCode).to.equal(201);
        });

        // After successful creation the app navigates to /events
        cy.url().should('include', '/events');
      });

      cy.log('✅ Event created successfully, navigated to /events');
    });

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3 — READ EVENTS
  // ═══════════════════════════════════════════════════════════════════════════
  describe(' Step 3: Read / List Events (R in CRUD)', () => {

    it('3.1 — Public /events page loads without authentication', () => {
      cy.clearSession();
      cy.visit('/events');

      // The public events page should not require auth
      cy.url().should('include', '/events');
      cy.get('body').should('be.visible');

      cy.log('✅ Public /events page accessible without login');
    });

    it('3.2 — Admin Event Approval page shows event cards', () => {
      cy.setAdminSession();

      // Intercept the GET to return mock data
      cy.intercept('GET', `${BASE_API}`, {
        statusCode: 200,
        body: { success: true, data: MOCK_EVENTS }
      }).as('fetchEvents');

      cy.visit('/event-approval');

      cy.wait('@fetchEvents');

      // Both event titles should be visible on the page
      cy.contains(MOCK_EVENTS[0].title).should('be.visible');
      cy.contains(MOCK_EVENTS[1].title).should('be.visible');

      cy.log('✅ Event Approval dashboard renders events from the API');
    });

    it('3.3 — Empty state is shown when there are no events', () => {
      cy.setAdminSession();

      cy.intercept('GET', `${BASE_API}`, {
        statusCode: 200,
        body: { success: true, data: [] }
      }).as('fetchEmptyEvents');

      cy.visit('/event-approval');
      cy.wait('@fetchEmptyEvents');

      cy.contains('No events found').should('be.visible');

      cy.log('✅ Empty state message shown when event list is empty');
    });

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4 — UPDATE EVENT (EDIT)
  // ═══════════════════════════════════════════════════════════════════════════
  describe(' Step 4: Update / Edit Event (U in CRUD)', () => {

    beforeEach(() => {
      cy.setAdminSession();

      cy.intercept('GET', `${BASE_API}`, {
        statusCode: 200,
        body: { success: true, data: MOCK_EVENTS }
      }).as('fetchEvents');

      cy.visit('/event-approval');
      cy.wait('@fetchEvents');
    });

    it('4.1 — Edit button is present on each event card', () => {
      // Every card should have an Edit button
      cy.get('button').filter(':contains("Edit")').should('have.length.gte', 1);

      cy.log('✅ Edit buttons are visible on event cards');
    });

    it('4.2 — Clicking Edit opens the edit form / modal', () => {
      // Intercept the edit PUT call
      cy.intercept('PUT', `${BASE_API}/${MOCK_EVENTS[0]._id}`, (req) => {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: { ...MOCK_EVENTS[0], ...req.body }
          }
        });
      }).as('updateEvent');

      // Click the first Edit button
      cy.get('button').filter(':contains("Edit")').first().click();

      // The edit form / modal should appear
      cy.get('form, [class*="modal"], [style*="position: fixed"]')
        .should('be.visible');

      cy.log('✅ Edit form or modal opens after clicking Edit');
    });


    it('4.4 — Reject button opens reason modal before submitting', () => {
      // Reject requires a reason — it should open a modal
      cy.get('button').filter(':contains("Reject")').first().click();

      // A modal or dialog should appear asking for a reason
      cy.get('[style*="position: fixed"]').should('be.visible');

      cy.log('✅ Rejection modal opens before committing status change');
    });

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5 — DELETE EVENT
  // ═══════════════════════════════════════════════════════════════════════════
  describe(' Step 5: Delete Event (D in CRUD)', () => {

    beforeEach(() => {
      cy.setAdminSession();

      cy.intercept('GET', `${BASE_API}`, {
        statusCode: 200,
        body: { success: true, data: MOCK_EVENTS }
      }).as('fetchEvents');

      cy.visit('/event-approval');
      cy.wait('@fetchEvents');
    });

    it('5.1 — Delete button is present on each event card', () => {
      cy.get('button').filter(':contains("Delete")').should('have.length.gte', 1);

      cy.log('✅ Delete buttons are visible on event cards');
    });

    it('5.2 — Clicking Delete opens a confirmation modal', () => {
      cy.get('button').filter(':contains("Delete")').first().click();

      // The delete confirmation modal should appear
      cy.get('[style*="position: fixed"]').should('be.visible');

      cy.log('✅ Delete confirmation modal appears after clicking Delete');
    });

    it('5.3 — Cancelling the delete modal keeps the event in the list', () => {
      cy.get('button').filter(':contains("Delete")').first().click();

      // The modal should have a cancel button
      cy.get('[style*="position: fixed"]')
        .find('button')
        .filter(':contains("Cancel")')
        .click();

      // Event should still be visible
      cy.contains(MOCK_EVENTS[0].title).should('be.visible');

      cy.log('✅ Cancelling delete leaves the event intact');
    });

    it('5.4 — Confirming delete removes the event from the list', () => {
      // Intercept the DELETE call
      cy.intercept('DELETE', `${BASE_API}/${MOCK_EVENTS[0]._id}`, {
        statusCode: 200,
        body: { success: true, message: 'Event deleted successfully' }
      }).as('deleteEvent');

      cy.get('button').filter(':contains("Delete")').first().click();

      // Click the confirm button inside the modal
      cy.get('[style*="position: fixed"]')
        .find('button')
        .filter(':contains("Delete")')
        .last()
        .click();

      cy.wait('@deleteEvent').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
      });

      // The deleted event's title should no longer appear
      cy.contains(MOCK_EVENTS[0].title).should('not.exist');

      // Success message should appear
      cy.contains('Event deleted successfully').should('be.visible');

      cy.log('✅ Confirmed delete removes the event and shows success message');
    });

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6 — SEARCH & FILTER
  // ═══════════════════════════════════════════════════════════════════════════
  describe(' Step 6: Search & Filter Events', () => {

    beforeEach(() => {
      cy.setAdminSession();

      cy.intercept('GET', `${BASE_API}`, {
        statusCode: 200,
        body: { success: true, data: MOCK_EVENTS }
      }).as('fetchEvents');

      cy.visit('/event-approval');
      cy.wait('@fetchEvents');
    });

    it('6.1 — Search input narrows visible events by title', () => {
      cy.get('input[placeholder*="Search"]').type('Cypress Tech');

      // Only the matching card should be visible
      cy.contains(MOCK_EVENTS[0].title).should('be.visible');
      cy.contains(MOCK_EVENTS[1].title).should('not.exist');

      cy.log('✅ Search by title filters event list correctly');
    });

    it('6.2 — Clearing search restores all events', () => {
      cy.get('input[placeholder*="Search"]').type('Cypress Tech').clear();

      cy.contains(MOCK_EVENTS[0].title).should('be.visible');
      cy.contains(MOCK_EVENTS[1].title).should('be.visible');

      cy.log('✅ Clearing search shows all events again');
    });

    it('6.3 — Search by organizer name works', () => {
      cy.get('input[placeholder*="Search"]').type('Dewmini');

      cy.contains(MOCK_EVENTS[1].title).should('be.visible');
      cy.contains(MOCK_EVENTS[0].title).should('not.exist');

      cy.log('✅ Search by organizer name filters correctly');
    });

    it('6.4 — Status dropdown filters to Approved events only', () => {
      cy.get('select').filter(':has(option:contains("All Status"))').select('Approved');

      cy.contains(MOCK_EVENTS[1].title).should('be.visible'); // Approved
      cy.contains(MOCK_EVENTS[0].title).should('not.exist');  // Pending

      cy.log('✅ Status dropdown filters to Approved events only');
    });

    it('6.5 — Status dropdown filters to Pending events only', () => {
      cy.get('select').filter(':has(option:contains("All Status"))').select('Pending');

      cy.contains(MOCK_EVENTS[0].title).should('be.visible'); // Pending
      cy.contains(MOCK_EVENTS[1].title).should('not.exist');  // Approved

      cy.log('✅ Status dropdown filters to Pending events only');
    });

    it('6.6 — No results state when search has no matches', () => {
      cy.get('input[placeholder*="Search"]').type('zzz-no-match-xyz');

      cy.contains('No events found').should('be.visible');

      cy.log('✅ Empty search result shows "No events found" message');
    });

  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7 — NAVIGATION & UX CHECKS
  // ═══════════════════════════════════════════════════════════════════════════
  describe(' Step 7: Navigation & UX Validation', () => {

    it('7.1 — Home page loads correctly at root path', () => {
      cy.visit('/');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('body').should('be.visible');

      cy.log('✅ Home page / loads successfully');
    });

    it('7.2 — /events route is accessible publicly', () => {
      cy.clearSession();
      cy.visit('/events');
      cy.url().should('include', '/events');

      cy.log('✅ Public /events page accessible without auth');
    });

    it('7.3 — Create Event link navigates to the correct page (when authenticated)', () => {
      cy.setStudentSession();
      cy.visit('/create-event');
      cy.url().should('include', '/create-event');
      cy.get('h2').should('contain.text', 'Create New Event');

      cy.log('✅ Authenticated navigation to /create-event works');
    });

    it('7.4 — Create Event form has the correct submit button', () => {
      cy.setStudentSession();
      cy.visit('/create-event');

      cy.get('form#contact').find('button[type="submit"]').should('be.visible');

      cy.log('✅ Create Event form has a visible submit button');
    });

    it('7.5 — Admin sidebar is rendered on admin event approval page', () => {
      cy.setAdminSession();

      cy.intercept('GET', `${BASE_API}`, {
        statusCode: 200,
        body: { success: true, data: [] }
      }).as('fetchEvents');

      cy.visit('/event-approval');
      cy.wait('@fetchEvents');

      // AdminSidebar renders with a left margin on the main content div
      cy.get('[style*="margin-left: 260px"]').should('exist');

      cy.log('✅ Admin sidebar is present on the Event Approval page');
    });

  });

});
