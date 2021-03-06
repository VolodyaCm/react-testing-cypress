/* eslint-disable jest/valid-expect */
/* eslint-disable no-undef */

const axios = require('axios');
const APP_URL = 'http://localhost:3000/';

const createBooks = () => {
    const books = [
      { name: 'Refactoring', id: 1 },
      { name: 'Domain-driven design', id: 2 },
    ];

    return books.map(item => (
      axios.post(
        'http://localhost:8080/books',
        item,
        { headers: { 'Content-Type': 'application/json' } })
    ))
  }

describe('Bookish App', () => {
  before(() => {
    return axios
      .delete('http://localhost:8080/books?_cleanup=true')
      .catch((err) => err);
  })

  afterEach(() => {
    return axios
      .delete('http://localhost:8080/books?_cleanup=true')
      .catch((err) => err);
  })

  beforeEach(() => createBooks());
  after(() => createBooks());


  it('Visits the bookish', () => {
    cy.visit(APP_URL);
    cy.get('h2[data-test="heading"]').contains('Bookish')
  })

  it('Shows a book list', () => {
    cy.visit(APP_URL);
    cy.get('div[data-test="book-list"]').should('exist');
    cy.get('div.book-item').should('have.length', 2);
    cy.get('div.book-item').should((books) => {
      expect(books).to.have.length(2);

      const titles = [...books].map((b) => b.querySelector('h2').innerHTML);
      expect(titles).to.deep.equal(['Refactoring', 'Domain-driven design']);
    });
  })

  it('Goes to the detail page', () => {
    cy.visit(APP_URL);
    cy.get('div.book-item').contains('View Details').eq(0).click();
    cy.url().should('include', '/books/1');
    cy.get('h2.book-title').contains('Refactoring');
  })

  it('Searches for a title', () => {
    cy.visit(APP_URL);
    cy.get('div.book-item').should('have.length', 2);
    cy.get('[data-test="search"] input').type('design');
    cy.get('div.book-item').should('have.length', 1);
    cy.get('div.book-item').eq(0).contains('Domain-driven design');
  })
})
