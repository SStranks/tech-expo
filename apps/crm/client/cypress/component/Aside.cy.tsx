import DefaultLayout from '@Layouts/DefaultLayout';

import { Aside } from '../../src/features/sidebar/Aside';

beforeEach(() => {
  cy.mount(<DefaultLayout header={<></>} aside={<Aside />} />);
});

describe('Sidebar menu functionality', () => {
  it('Menu hide/reveal animation upon toggle btn click', () => {
    cy.contains(/dashboard/i).should('be.visible');
  });
});
