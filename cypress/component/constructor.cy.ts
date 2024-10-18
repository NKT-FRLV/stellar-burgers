/// <reference types="cypress" />

describe('[constructor] add an ingredient correctly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('http://localhost:4000/');
  });
  it('should add bun correctly', () => {
    cy.get('[data-cy="bun"]').contains('Добавить').click();
    cy.get('[data-cy="constructor_bun-top"]')
      .contains('Ингредиент - 1')
      .should('exist');
  });
});
