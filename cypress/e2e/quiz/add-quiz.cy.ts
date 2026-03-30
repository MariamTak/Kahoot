describe('Create Quiz E2E', () => {

  beforeEach(() => {
    cy.fixture('user').then((user) => {
      cy.login(user.email, user.password);
    });
  });

  it('should open create quiz modal', () => {
    cy.get('ion-fab-button').click();
    cy.get('create-quiz-modal').should('exist');
  });

  it('should create a quiz with one question', () => {
    cy.get('ion-fab-button').click({ force: true });

    cy.get('ion-input.kh-title-input')
      .find('input.native-input')
      .type('cypress test quiz'); // ← titlecase → "Cypress Test Quiz"

    cy.get('ion-textarea.kh-description-input')
      .find('textarea').type('Description du quiz test', { force: true });

    cy.get('ion-input.kh-question-input')
      .first()
      .find('input.native-input')
      .clear({ force: true })
      .type('Quelle est la capitale de la France ?', { force: true });

    cy.get('ion-input.kh-choice-input').eq(0)
      .find('input.native-input').clear({ force: true }).type('Paris', { force: true });
    cy.get('ion-input.kh-choice-input').eq(1)
      .find('input.native-input').clear({ force: true }).type('Londres', { force: true });
    cy.get('ion-input.kh-choice-input').eq(2)
      .find('input.native-input').clear({ force: true }).type('Berlin', { force: true });
    cy.get('ion-input.kh-choice-input').eq(3)
      .find('input.native-input').clear({ force: true }).type('Madrid', { force: true });

    cy.get('ion-radio.kh-radio').first().click({ force: true });

    cy.get('[data-testid="confirm-create-quiz-button"]').click({ force: true });

    cy.get('create-quiz-modal').should('not.exist');
    cy.get('quiz-card .kh-quiz-title', { timeout: 15000 }) // ← timeout augmenté pour Firebase
      .should('contain', 'Cypress Test Quiz');
  });

  it('should add a question', () => {
    cy.get('ion-fab-button').click({ force: true });

    cy.get('ion-input.kh-title-input')
      .find('input.native-input').type('Quiz avec plusieurs questions', { force: true });

    cy.get('button.kh-add-question-btn').click({ force: true });

    cy.get('ion-input.kh-question-input').should('have.length.greaterThan', 1);
  });

  it('should remove a question', () => {
    cy.get('ion-fab-button').click({ force: true });

    cy.get('ion-input.kh-title-input')
      .find('input.native-input').type('Quiz test suppression', { force: true });

    cy.get('button.kh-add-question-btn').click({ force: true });
    cy.get('ion-input.kh-question-input').should('have.length', 2);

    cy.get('button.kh-remove-question-btn').last().click({ force: true });
    cy.get('ion-input.kh-question-input').should('have.length', 1);
  });

  it('should add a choice to a question', () => {
    cy.get('ion-fab-button').click({ force: true });

    cy.get('ion-input.kh-choice-input').should('have.length', 4);

    cy.get('button.kh-add-choice-btn').first().click({ force: true });
    cy.get('ion-input.kh-choice-input').should('have.length', 5);
  });

  it('should cancel and not save', () => {
    cy.get('ion-fab-button').click({ force: true });

    cy.get('ion-input.kh-title-input')
      .find('input.native-input').type('Quiz annulé', { force: true });

    cy.get('[data-testid="cancel-create-quiz-button"]').click({ force: true });

    cy.get('create-quiz-modal').should('not.exist');
    cy.get('quiz-card').should('not.contain', 'Quiz annulé');
  });

});