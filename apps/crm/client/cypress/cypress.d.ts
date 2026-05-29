import type { Router } from '@tanstack/react-router';
import type { MountOptions, MountReturn } from 'cypress/react';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataTest('greeting')
       */
      dataTest(value: string): Chainable<JQuery<HTMLElement>>;
      // TODO:  Dual mount - to be implemented when Redux is added to App
      //   options?: MountOptions & { routerProps?: MemoryRouterProps } & { reduxStore?: EnhancedStore<RootState> }
      // ): Cypress.Chainable<MountReturn>;

      /**
       * Custom command
       * @example cy.getByTestId('banner')
       */
      getByTestId(dataTestSelector: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(component: React.ReactNode, options?: MountOptions & { router?: Router }): Cypress.Chainable<MountReturn>;
    }
  }
}
