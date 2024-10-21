/// <reference types="cypress" />

describe('[constructor] add an ingredient correctly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('/');
  });
  it('should add bun correctly', () => {
    const bunPlacesInConstructor = ['top', 'bottom'];
    // Конструктор чист.
    bunPlacesInConstructor.forEach((place) => {
      cy.get(`[data-cy="constructor_bun-${place}"]`).should('not.exist');
    });
    // На месте будующех булок должен находиться плейсхолдер.
    bunPlacesInConstructor.forEach((place) => {
      cy.get(`[data-cy="constructor_bun-${place}_clear"]`)
        .contains('Выберите булки')
        .should('exist');
    });

    // Производим добавление булки в конструктор
    cy.get('[data-cy="bun"]').contains('Добавить').click();
    // Теперь булки появились в конструкторе
    bunPlacesInConstructor.forEach((place) => {
      cy.get(`[data-cy="constructor_bun-${place}"]`)
        .contains('Ингредиент - 1')
        .should('exist');
    });
    // При этом плейсхолдер удаляется из документа.
    bunPlacesInConstructor.forEach((place) => {
      cy.get(`[data-cy="constructor_bun-${place}_clear"]`).should('not.exist');
    });
  });

  it('should add (main or sauce*) correctly', () => {
    cy.get('[data-cy="constructor_ingredients-midle"]').should('not.exist');

    cy.get('[data-cy="constructor_ingredients-midle"]')
      .contains('Выберите начинку')
      .should('exist');

    cy.get('[data-cy="sauce"]').contains('Добавить').click();

    cy.get('[data-cy="constructor_ingredients-midle"]')
      .contains('Ингредиент - 4')
      .should('exist');

    cy.get('[data-cy="constructor_ingredients-midle"]')
      .contains('Выберите начинку')
      .should('not.exist');
  });
});

describe('[Modal window] open/close correctly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.viewport(1920, 1080);
    cy.visit('/');
  });
  it('should open modal by click on an ingredient card, then close by closeIcon', () => {
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="sauce"]').contains('Ингредиент - 4').click();
    cy.get('[data-cy="modal"]').contains('Ингредиент - 4').should('exist');

    cy.get('[data-cy="modal_close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('modal should be closed by overlay click', () => {
    cy.get('[data-cy="sauce"]').contains('Ингредиент - 4').click();
    cy.get('[data-cy="modal"]').should('exist');

    // Кликнуть по Overlay
    cy.get('body').click(10, 10); // Симулирует клик в левый верхний угол
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('[order] creates correctly', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    // Перехват Юзера
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    // Установка токена в куки
    cy.setCookie('accessToken', 'Bearer fakeToken');
    // Установка токенов в локальное хранилище
    cy.window().then((win: Window & typeof globalThis) => {
      win.localStorage.setItem('refreshToken', 'fake');
    });
    cy.viewport(1920, 1080);
    cy.visit('/');

    cy.get('[data-cy="bun"]').contains('Добавить').click();
    cy.get('[data-cy="sauce"]').contains('Добавить').click();
    cy.get('[data-cy="main"]').contains('Добавить').click();
  });
  // отчищаем локальное хранилище и куки
  afterEach(() => {
    cy.window().then((win: Window & typeof globalThis) => {
      win.localStorage.clear();
    });
    cy.clearCookie('accessToken');
  });

  it('should create order, then show modal with correct order number', () => {
    cy.intercept('POST', 'api/orders', {
      fixture: 'post_order.json'
    });
    cy.get('body').contains('Оформить заказ').click();
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="order_number"]').should('contain', '3000');
  });

  it('should close order modal, and constructor should be empty', () => {
    cy.intercept('POST', 'api/orders', {
      fixture: 'post_order.json'
    });
    cy.get('body').contains('Оформить заказ').click();
    cy.get('[data-cy="modal_close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="constructor_bun-top_clear"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-cy="constructor_ingredients-midle"]').should(
      'contain',
      'Выберите начинку'
    );
    cy.get('[data-cy="constructor_bun-bottom_clear"]').should(
      'contain',
      'Выберите булки'
    );
  });
});
