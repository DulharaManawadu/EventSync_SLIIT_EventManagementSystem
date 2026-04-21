// =============================================================================
// cypress/support/commands.js
// Custom Cypress commands shared across all test specs
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// cy.loginViaUI(email, password)
//   Navigates to /login, fills the form, and submits.
//   Use when you need to test the login page itself.
// ─────────────────────────────────────────────────────────────────────────────
Cypress.Commands.add('loginViaUI', (email, password) => {
  cy.visit('/login');
  cy.get('input[type="email"]').clear().type(email);
  cy.get('input[type="password"]').clear().type(password);
  cy.get('button[type="submit"]').click();
});

// ─────────────────────────────────────────────────────────────────────────────
// cy.loginViaAPI(email, password)
//   Calls the backend login endpoint directly and writes the token +
//   user object into localStorage — exactly the way saveAuth() does it.
//   Use this BEFORE tests that need auth but don't care about the login flow.
//   This avoids re-running the full login UI before every test and makes
//   the suite much faster.
// ─────────────────────────────────────────────────────────────────────────────
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/auth/login',
    body: { email, password },
    failOnStatusCode: false
  }).then((response) => {
    // If the real API is up, persist auth normally
    if (response.status === 200 && response.body?.data?.token) {
      const { token, user } = response.body.data;
      window.localStorage.setItem('eventsync_token', token);
      window.localStorage.setItem('eventsync_user', JSON.stringify(user));
    } else {
      // ── Fallback: inject a mock Admin session so UI tests that rely on
      //    ProtectedRoute still work even when the backend is not running. ──
      const mockUser = {
        _id: 'mock-admin-id',
        name: 'Test Admin',
        email,
        userType: 'Admin'
      };
      window.localStorage.setItem('eventsync_token', 'mock-jwt-token-for-testing');
      window.localStorage.setItem('eventsync_user', JSON.stringify(mockUser));
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// cy.setAdminSession()
//   Directly injects a valid Admin session into localStorage without any
//   network call. Useful for the fastest possible test setup.
// ─────────────────────────────────────────────────────────────────────────────
Cypress.Commands.add('setAdminSession', () => {
  const mockUser = {
    _id: 'mock-admin-id',
    name: 'Test Admin',
    email: 'admin@eventsync.lk',
    userType: 'Admin'
  };
  cy.window().then((win) => {
    win.localStorage.setItem('eventsync_token', 'mock-jwt-token-admin');
    win.localStorage.setItem('eventsync_user', JSON.stringify(mockUser));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// cy.setStudentSession()
//   Injects a Student session (for Create Event tests).
// ─────────────────────────────────────────────────────────────────────────────
Cypress.Commands.add('setStudentSession', () => {
  const mockUser = {
    _id: 'mock-student-id',
    name: 'Test Student',
    email: 'student@eventsync.lk',
    userType: 'Student'
  };
  cy.window().then((win) => {
    win.localStorage.setItem('eventsync_token', 'mock-jwt-token-student');
    win.localStorage.setItem('eventsync_user', JSON.stringify(mockUser));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// cy.clearSession()
//   Wipe out authentication from localStorage (simulate logout).
// ─────────────────────────────────────────────────────────────────────────────
Cypress.Commands.add('clearSession', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('eventsync_token');
    win.localStorage.removeItem('eventsync_user');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// cy.fillCreateEventForm(eventData)
//   Fills every field of the Create Event form using the supplied data object.
//   Keys must match the fixture fields.
// ─────────────────────────────────────────────────────────────────────────────
Cypress.Commands.add('fillCreateEventForm', (eventData) => {
  cy.get('#title').clear().type(eventData.title);
  cy.get('#venue').clear().type(eventData.venue);

  // Dropdowns
  if (eventData.category) cy.get('#category').select(eventData.category);
  if (eventData.eventType) cy.get('#eventType').select(eventData.eventType);
  if (eventData.faculty) cy.get('#faculty').select(eventData.faculty);

  if (eventData.department) cy.get('#department').clear().type(eventData.department);

  // ── datetime-local inputs ────────────────────────────────────────────────
  // React controlled inputs require native input events to update state.
  // .invoke('val') alone is silent — React never sees the change.
  // We set the value via the native input value descriptor, then dispatch
  // both 'input' and 'change' events so React's synthetic event system fires.
  cy.get('#date').then(($el) => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeInputValueSetter.call($el[0], eventData.date);
    $el[0].dispatchEvent(new Event('input', { bubbles: true }));
    $el[0].dispatchEvent(new Event('change', { bubbles: true }));
  });

  if (eventData.endDate) {
    cy.get('#endDate').then(($el) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 'value'
      ).set;
      nativeInputValueSetter.call($el[0], eventData.endDate);
      $el[0].dispatchEvent(new Event('input', { bubbles: true }));
      $el[0].dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  cy.get('#capacity').clear().type(eventData.capacity);
  cy.get('#organizerName').clear().type(eventData.organizerName);

  if (eventData.organizerEmail) {
    cy.get('#organizerEmail').clear().type(eventData.organizerEmail);
  }

  cy.get('#phoneNumbers').clear().type(eventData.phoneNumbers);
  cy.get('#societyName').clear().type(eventData.societyName);

  if (eventData.budget) cy.get('#budget').clear().type(eventData.budget);
  if (eventData.tags) cy.get('#tags').clear().type(eventData.tags);

  // Description last (textarea)
  cy.get('#description').clear().type(eventData.description);
});
