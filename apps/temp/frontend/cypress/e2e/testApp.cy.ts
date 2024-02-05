describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
    cy.get('div').contains('This is a test app');
  });
});
