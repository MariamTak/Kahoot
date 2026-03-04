describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:8100');
    cy.get('[data-test="quiz-card"]').should('have.length', 3);
    cy.get('[data-test="open-modal-button"]').click();
    cy.get('[data-test="confirm-create-quiz-button"]').should('be.disabled');
    cy.get('[data-test="quiz-title-input"]').type('My Quiz');
    cy.get('[data-test="quiz-description-input"]').type('My Description');
    cy.contains('Ajouter une question').click();
    cy.get('[data-test="confirm-create-quiz-button"]').should('be.enabled');

  });

});