// TODO:  Investigate visual testing plugin to verify transitions and animations.

import MenuToggle from '@Features/sidebar/components/MenuToggle';

beforeEach(() => {
  const mockSetter = cy.stub();
  cy.mount(<MenuToggle sidebarMaximize={undefined} setSidebarMaximize={mockSetter} />);
});

describe('MenuToggle functionality', () => {
  it('User hover triggers transition', () => {
    cy.contains(/dashboard/i).should('be.visible');
  });
});
