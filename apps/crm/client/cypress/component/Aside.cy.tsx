import { Aside } from '@Features/sidebar/Aside';
import DefaultLayout from '@Layouts/DefaultLayout';

beforeEach(() => {
  cy.mount(<DefaultLayout header={<></>} aside={<Aside />} />);
});

describe('Sidebar menu functionality', () => {
  it('Menu hide/reveal animation upon toggle btn click', () => {
    cy.contains(/dashboard/i).should('be.visible');
  });
});
