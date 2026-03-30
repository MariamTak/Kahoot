describe('Login E2E', () => {

  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login form', () => {
    cy.get('ion-input[formcontrolname="email"]').should('exist');
    cy.get('ion-input[formcontrolname="password"]').should('exist');
    cy.get('ion-button[type="submit"]').should('exist');
  });

  it('should login with valid credentials', () => {
    cy.fixture('user').then((user) => {
      cy.get('ion-input[formcontrolname="email"]')
        .find('input.native-input').type(user.email);
      cy.get('ion-input[formcontrolname="password"]')
        .find('input.native-input').type(user.password);
      cy.get('ion-button[type="submit"]').click();
      cy.url().should('include', '/home');
    });
  });

  it('should show error with wrong credentials', () => {
    cy.get('ion-input[formcontrolname="email"]')
      .find('input.native-input').type('wrong@email.com');
    cy.get('ion-input[formcontrolname="password"]')
      .find('input.native-input').type('wrongpassword');
    cy.get('ion-button[type="submit"]').click();
    cy.get('ion-toast', { timeout: 10000 }).should('be.visible'); 
  });

  it('should not submit with empty fields', () => {
    cy.get('ion-button[type="submit"]').click();
    cy.url().should('include', '/login');
  });

});