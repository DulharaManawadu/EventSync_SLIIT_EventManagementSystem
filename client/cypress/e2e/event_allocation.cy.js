describe("Event Allocation Flow", () => {

    beforeEach(() => {
  
      // 🔐 Login
      cy.visit('/login');
  
      cy.get('input[type="email"]').type('admindulhara@gmail.com');
      cy.get('input[type="password"]').type('123Dul123#');
  
      cy.get('button[type="submit"]').click();
  
      cy.url({ timeout: 10000 }).should('not.include', '/login');
  
      // 📍 Go to allocation page
      cy.visit('/event-allocation');
  
      // ⏳ Wait for required data
      cy.intercept('GET', 'http://localhost:5000/api/events').as('getEvents');
      cy.intercept('GET', 'http://localhost:5000/api/venues').as('getVenues');
      cy.intercept('GET', 'http://localhost:5000/api/resources').as('getResources');
  
      cy.wait(['@getEvents', '@getVenues', '@getResources']);
    });
  
    // ─────────────────────────────────────────────
    // 1. Page loads
    // ─────────────────────────────────────────────
    it("loads allocation page", () => {
      cy.contains("Venue Management").should("be.visible");
    });
  
    // ─────────────────────────────────────────────
    // 2. Open assign modal
    // ─────────────────────────────────────────────
    it("opens assign modal", () => {
      cy.contains("Assign").first().click();
  
      cy.contains("Assign").should("be.visible");
      cy.contains("Venue").should("be.visible");
    });
  
    // ─────────────────────────────────────────────
    // 3. Validation: no venue
    // ─────────────────────────────────────────────
    it("shows error when venue is not selected", () => {
      cy.contains("Assign").first().click();
  
      cy.contains("Submit").click();
  
      cy.contains("Please select a venue").should("be.visible");
    });
  
    // ─────────────────────────────────────────────
    // 4. Add resource row
    // ─────────────────────────────────────────────
    it("adds resource row", () => {
      cy.contains("Assign").first().click();
  
      cy.contains("+ Add Resource").click();
  
      cy.get('select').should('exist');
      cy.get('input[type="number"]').should('exist');
    });
  
    // ─────────────────────────────────────────────
    // 5. Allocation (final fixed version)
    // ─────────────────────────────────────────────
    it("allocates resources to event", () => {
  
      cy.contains("Assign").first().click();
  
      // Select venue
      cy.get('select').first().select(1);
  
      // Add resource
      cy.contains("+ Add Resource").click();
  
      // Select resource
      cy.get('select').eq(1).select(1);
  
      // Enter quantity
      cy.get('input[type="number"]').clear().type("1");
  
      // Submit
      cy.contains("Submit").click();
  
      // ✅ Accept BOTH success messages
      cy.contains(
        /Allocated successfully|Allocation updated successfully/,
        { timeout: 5000 }
      ).should("be.visible");
  
    });
  
  });