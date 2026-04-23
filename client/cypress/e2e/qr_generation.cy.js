// =============================================================================
// cypress/e2e/qr_generation.cy.js
//
// End-to-End automated UI tests for the QR registration and attendance workflow.
//
// Coverage:
//  1. Student registers for an approved event and receives a QR modal.
//  2. Student views existing registrations and reopens a QR code.
//  3. Admin opens QR Generation page and reviews attendance data.
//  4. Admin activates check-in for a selected event.
//  5. Admin confirms attendance using the manual QR token fallback.
//  6. Admin can trigger attendance CSV export.
//  7. Admin removes an invalid QR registration from the attendance table.
//
// Notes:
//  - API calls are intercepted, so these tests do not mutate the real database.
//  - The camera scanner itself is not automated; the manual token fallback covers
//    the same check-in API path without needing camera permissions.
// =============================================================================

const EVENTS_API = 'http://localhost:5000/api/events';
const QR_API = 'http://localhost:5000/api/event-registrations';

const APPROVED_EVENT = {
  _id: 'evt-qr-001',
  id: 'evt-qr-001',
  title: 'Cypress QR Summit 2026',
  description: 'A QR-enabled event used for Cypress attendance workflow tests.',
  category: 'Technical',
  eventType: 'Physical',
  faculty: 'Computing',
  department: 'Software Engineering',
  venue: 'Innovation Hall',
  date: '2027-08-15T09:00:00.000Z',
  endDate: '2027-08-15T12:00:00.000Z',
  capacity: 120,
  registrationCount: 1,
  attendanceCount: 0,
  organizerName: 'QR Admin',
  organizerEmail: 'qr.admin@eventsync.lk',
  phoneNumbers: ['0771234567'],
  societyName: 'SLIIT QR Society',
  status: 'Approved',
  qrEnabled: true,
  checkInActive: false,
  budget: 35000,
  tags: ['qr', 'attendance']
};

const STUDENT_REGISTRATION = {
  id: 'reg-qr-001',
  eventId: APPROVED_EVENT._id,
  studentId: 'student-001',
  studentUserId: 'IT23536234',
  studentName: 'Thusar Vibhuthi',
  studentEmail: 'thusarav@gmail.com',
  registeredAt: '2026-04-22T08:30:00.000Z',
  attendanceStatus: 'Registered',
  checkedInAt: null,
  checkedInBy: null,
  qrToken: 'mock-qr-token-for-cypress',
  qrVersion: 1,
  qrPayload: {
    registrationId: 'reg-qr-001',
    eventId: APPROVED_EVENT._id,
    eventTitle: APPROVED_EVENT.title,
    studentId: 'student-001',
    studentUserId: 'IT23536234',
    qrVersion: 1,
    qrToken: 'mock-qr-token-for-cypress'
  }
};

const ATTENDANCE_ROWS = [
  {
    id: STUDENT_REGISTRATION.id,
    studentId: STUDENT_REGISTRATION.studentUserId,
    studentName: STUDENT_REGISTRATION.studentName,
    studentEmail: STUDENT_REGISTRATION.studentEmail,
    registeredAt: STUDENT_REGISTRATION.registeredAt,
    attendanceStatus: 'Registered',
    checkedInAt: null
  }
];

const ACTIVE_SUMMARY_EVENT = {
  id: APPROVED_EVENT._id,
  title: APPROVED_EVENT.title,
  date: APPROVED_EVENT.date,
  venue: APPROVED_EVENT.venue,
  category: APPROVED_EVENT.category,
  faculty: APPROVED_EVENT.faculty,
  registered: 1,
  attended: 0,
  noShows: 1,
  checkInActive: true
};

const INACTIVE_SUMMARY_EVENT = {
  ...ACTIVE_SUMMARY_EVENT,
  checkInActive: false
};

const attendanceResponse = (rows = ATTENDANCE_ROWS) => ({
  success: true,
  message: 'Attendance table retrieved successfully',
  data: {
    event: APPROVED_EVENT,
    summary: {
      registered: rows.length,
      attended: rows.filter((row) => row.attendanceStatus === 'Attended').length,
      noShows: rows.filter((row) => row.attendanceStatus !== 'Attended').length
    },
    rows
  }
});

const setupStudentEvents = () => {
  cy.setStudentSession();
  cy.intercept('GET', EVENTS_API, {
    statusCode: 200,
    body: {
      success: true,
      data: [APPROVED_EVENT]
    }
  }).as('getEvents');
};

const setupAdminQrPage = (summaryEvent = INACTIVE_SUMMARY_EVENT, rows = ATTENDANCE_ROWS) => {
  cy.setAdminSession();
  cy.intercept('GET', `${QR_API}/admin/events/summary`, {
    statusCode: 200,
    body: {
      success: true,
      data: [summaryEvent]
    }
  }).as('getQrSummary');

  cy.intercept('GET', `${QR_API}/admin/events/${APPROVED_EVENT._id}/attendance`, {
    statusCode: 200,
    body: attendanceResponse(rows)
  }).as('getAttendance');
};

describe('QR Generation and Attendance Workflow', () => {
  describe('Student QR registration flow', () => {
    beforeEach(() => {
      setupStudentEvents();
    });

    it('creates a student event registration and displays the generated QR modal', () => {
      cy.intercept('POST', `${QR_API}/events/${APPROVED_EVENT._id}/register`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Registered for event successfully',
          data: {
            registration: STUDENT_REGISTRATION,
            event: {
              ...APPROVED_EVENT,
              registrationCount: 1
            },
            alreadyRegistered: false
          }
        }
      }).as('registerForEvent');

      cy.visit('/events');
      cy.wait('@getEvents');

      cy.contains(APPROVED_EVENT.title).should('be.visible');
      cy.contains('button', 'Register').click();
      cy.wait('@registerForEvent').its('request.method').should('equal', 'POST');

      cy.contains('Student Event QR').should('be.visible');
      cy.contains(APPROVED_EVENT.title).should('be.visible');
      cy.contains(STUDENT_REGISTRATION.studentName).should('be.visible');
      cy.contains(STUDENT_REGISTRATION.studentUserId).should('be.visible');
      cy.get('img[alt*="QR code"]').should('be.visible');
    });

    it('reopens an existing QR when the student clicks Check-In on a registered event', () => {
      cy.intercept('GET', `${QR_API}/events/${APPROVED_EVENT._id}/me`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Event QR retrieved successfully',
          data: {
            registration: STUDENT_REGISTRATION,
            event: APPROVED_EVENT
          }
        }
      }).as('getMyEventQr');

      cy.visit('/events');
      cy.wait('@getEvents');

      cy.contains(APPROVED_EVENT.title).should('be.visible');
      cy.contains('button', 'Check-In').click();
      cy.wait('@getMyEventQr');

      cy.contains('Student Event QR').should('be.visible');
      cy.contains('Present this QR code to the admin scanner').should('be.visible');
    });
  });

  describe('Student My Registrations page', () => {
    beforeEach(() => {
      cy.setStudentSession();
      cy.intercept('GET', `${QR_API}/me`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Student registrations retrieved successfully',
          data: [
            {
              registration: STUDENT_REGISTRATION,
              event: {
                ...APPROVED_EVENT,
                id: APPROVED_EVENT._id
              }
            }
          ]
        }
      }).as('getMyRegistrations');
    });

    it('lists a student registration and opens its QR code modal', () => {
      cy.visit('/my-registrations');
      cy.wait('@getMyRegistrations');

      cy.contains('My Registrations').should('be.visible');
      cy.contains(APPROVED_EVENT.title).should('be.visible');
      cy.contains(STUDENT_REGISTRATION.attendanceStatus).should('be.visible');
      cy.contains('button', 'View QR Code').click();

      cy.contains('Event QR').should('be.visible');
      cy.contains(APPROVED_EVENT.title).should('be.visible');
      cy.get('img[alt*="QR code"]').should('be.visible');
    });
  });

  describe('Admin QR Generation page', () => {
    it('shows QR event summary, inactive scan warning, and attendance rows', () => {
      setupAdminQrPage(INACTIVE_SUMMARY_EVENT);

      cy.visit('/qr-generation');
      cy.wait('@getQrSummary');
      cy.wait('@getAttendance');

      cy.contains('QR Generation & Attendance Table').should('be.visible');
      cy.contains(`${APPROVED_EVENT.title}: check-in is inactive`).should('be.visible');
      cy.contains('Scanning is disabled until you activate check-in').should('be.visible');
      cy.contains('Attendance Table').should('be.visible');
      cy.contains(STUDENT_REGISTRATION.studentUserId).should('be.visible');
      cy.contains(STUDENT_REGISTRATION.studentName).should('be.visible');
      cy.contains('Registered').should('be.visible');
      cy.get('#manual-qr-token').should('be.disabled');
      cy.contains('button', 'Confirm Attendance').should('be.disabled');
    });

    it('activates check-in for the selected event', () => {
      setupAdminQrPage(INACTIVE_SUMMARY_EVENT);
      cy.intercept('PATCH', `${QR_API}/admin/events/${APPROVED_EVENT._id}/check-in`, (req) => {
        expect(req.body.checkInActive).to.equal(true);
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            message: 'Check-in activated successfully',
            data: ACTIVE_SUMMARY_EVENT
          }
        });
      }).as('activateCheckIn');

      cy.visit('/qr-generation');
      cy.wait('@getQrSummary');

      cy.contains('button', 'Activate Check-In').click();
      cy.wait('@activateCheckIn');

      cy.contains(`Check-in activated for ${APPROVED_EVENT.title}.`).should('be.visible');
      cy.contains(`${APPROVED_EVENT.title}: check-in is active`).should('be.visible');
      cy.contains('button', 'Disable Check-In').should('be.visible');
    });

    it('confirms attendance using the manual QR token fallback', () => {
      const attendedRows = [
        {
          ...ATTENDANCE_ROWS[0],
          attendanceStatus: 'Attended',
          checkedInAt: '2026-04-22T09:00:00.000Z'
        }
      ];

      setupAdminQrPage(ACTIVE_SUMMARY_EVENT, ATTENDANCE_ROWS);
      cy.intercept('POST', `${QR_API}/check-in`, (req) => {
        expect(req.body.qrToken).to.equal(STUDENT_REGISTRATION.qrToken);
        expect(req.body.eventId).to.equal(APPROVED_EVENT._id);
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            message: 'Attendance confirmed successfully',
            data: {
              registration: {
                ...STUDENT_REGISTRATION,
                attendanceStatus: 'Attended',
                checkedInAt: '2026-04-22T09:00:00.000Z'
              },
              event: {
                ...APPROVED_EVENT,
                attendanceCount: 1
              }
            }
          }
        });
      }).as('manualCheckIn');

      cy.intercept('GET', `${QR_API}/admin/events/summary`, {
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
              ...ACTIVE_SUMMARY_EVENT,
              attended: 1,
              noShows: 0
            }
          ]
        }
      }).as('getUpdatedQrSummary');

      cy.intercept('GET', `${QR_API}/admin/events/${APPROVED_EVENT._id}/attendance`, {
        statusCode: 200,
        body: attendanceResponse(attendedRows)
      }).as('getUpdatedAttendance');

      cy.visit('/qr-generation');
      cy.wait('@getUpdatedQrSummary');
      cy.wait('@getUpdatedAttendance');

      cy.get('#manual-qr-token').should('not.be.disabled').type(STUDENT_REGISTRATION.qrToken);
      cy.contains('button', 'Confirm Attendance').click();
      cy.wait('@manualCheckIn');

      cy.contains(`${STUDENT_REGISTRATION.studentName} attendance was confirmed`).should('be.visible');
    });

    it('offers CSV export for the selected event attendance table', () => {
      setupAdminQrPage(ACTIVE_SUMMARY_EVENT, ATTENDANCE_ROWS);

      cy.visit('/qr-generation');
      cy.wait('@getQrSummary');
      cy.wait('@getAttendance');

      cy.contains('button', 'Export CSV').should('be.visible').and('not.be.disabled').click();
      cy.contains('There is no attendance data to export').should('not.exist');
    });

    it('removes a registration from the admin attendance table', () => {
      let summaryCallCount = 0;
      let attendanceCallCount = 0;

      cy.setAdminSession();
      cy.intercept('GET', `${QR_API}/admin/events/summary`, (req) => {
        summaryCallCount += 1;
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: [
              summaryCallCount === 1
                ? ACTIVE_SUMMARY_EVENT
                : {
                    ...ACTIVE_SUMMARY_EVENT,
                    registered: 0,
                    attended: 0,
                    noShows: 0
                  }
            ]
          }
        });
      }).as('getDeleteFlowSummary');

      cy.intercept('GET', `${QR_API}/admin/events/${APPROVED_EVENT._id}/attendance`, (req) => {
        attendanceCallCount += 1;
        req.reply({
          statusCode: 200,
          body: attendanceResponse(attendanceCallCount === 1 ? ATTENDANCE_ROWS : [])
        });
      }).as('getDeleteFlowAttendance');

      cy.intercept('DELETE', `${QR_API}/admin/registrations/${STUDENT_REGISTRATION.id}`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Registration removed successfully',
          data: {
            registrationId: STUDENT_REGISTRATION.id,
            event: {
              ...APPROVED_EVENT,
              registrationCount: 0,
              attendanceCount: 0
            }
          }
        }
      }).as('deleteRegistration');

      cy.visit('/qr-generation');
      cy.wait('@getDeleteFlowSummary');
      cy.wait('@getDeleteFlowAttendance');
      cy.contains(STUDENT_REGISTRATION.studentName).should('be.visible');

      cy.window().then((win) => {
        cy.stub(win, 'confirm').returns(true);
      });

      cy.contains('button', 'Remove').click();
      cy.wait('@deleteRegistration');
      cy.wait('@getDeleteFlowSummary');
      cy.wait('@getDeleteFlowAttendance');

      cy.contains(`${STUDENT_REGISTRATION.studentName}'s registration was removed successfully.`).should('be.visible');
      cy.contains('No students have registered for this event yet.').should('be.visible');
      cy.get('tbody').should('not.exist');
    });
  });
});
