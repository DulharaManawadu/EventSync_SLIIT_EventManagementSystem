describe("Resource Management Flow", () => {

    beforeEach(() => {
      cy.visit('/login');
  
      cy.get('input[type="email"]').type('admindulhara@gmail.com');
      cy.get('input[type="password"]').type('123Dul123#');
  
      cy.get('button[type="submit"]').click();
  
      cy.url({ timeout: 10000 }).should('not.include', '/login');
  
      cy.visit('/resources');
  
      cy.intercept('GET', 'http://localhost:5000/api/resources').as('getResources');
      cy.wait('@getResources');
    });
  
    it("loads resource page", () => {
      cy.contains("Resource Management").should("be.visible");
      cy.contains("+ Add Resource").should("be.visible");
    });
  
    it("opens add resource modal", () => {
      cy.contains("+ Add Resource").click();
      cy.contains("Add Resource").should("be.visible");
      cy.get('input[placeholder="Name"]').should("be.visible");
    });
  
    it("shows validation error for empty form", () => {
      cy.contains("+ Add Resource").click();
      cy.contains("Create").click();
      cy.contains("Name is required").should("be.visible");
    });
  
    it("creates a resource successfully", () => {
      cy.contains("+ Add Resource").click();
  
      cy.get('input[placeholder="Name"]').type("Speaker");
      cy.get('select').first().select("Audio");
  
      cy.get('input[placeholder="Total Quantity"]').type("10");
      cy.get('input[placeholder="Available Quantity"]').type("10");
  
      cy.contains("Create").click();
  
      cy.contains("Resource created", { timeout: 5000 }).should("be.visible");
    });
  
    it("opens edit modal", () => {
      cy.contains("Edit").first().click();
  
      cy.contains("Edit Resource").should("be.visible");
  
      cy.get('input[placeholder="Name"]').clear().type("Updated Resource");
  
      cy.contains("Update").click();
  
      cy.contains("Resource updated", { timeout: 5000 }).should("be.visible");
    });
  
    it("deletes a resource", () => {
      cy.on('window:confirm', () => true);
  
      cy.contains("Delete").first().click();
  
      cy.contains("Deleted", { timeout: 5000 }).should("be.visible");
    });
  
  });