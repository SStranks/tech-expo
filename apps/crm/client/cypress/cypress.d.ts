import { MountOptions, MountReturn } from 'cypress/react';
import { MemoryRouterProps, MemoryRouter } from 'react-router-dom';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        component: React.ReactNode,
        options?: MountOptions & { routerProps?: MemoryRouterProps }
      ): Cypress.Chainable<MountReturn>;
      // TODO:  Dual mount - to be implemented when Redux is added to App
      //   options?: MountOptions & { routerProps?: MemoryRouterProps } & { reduxStore?: EnhancedStore<RootState> }
      // ): Cypress.Chainable<MountReturn>;

      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataTest('greeting')
       */
      dataTest(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
