// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/react18';
import { MountOptions, MountReturn } from 'cypress/react';
import { MemoryRouterProps, MemoryRouter } from 'react-router-dom';
// import { EnhancedStore } from '@reduxjs/toolkit'
// import { RootState } from './src/StoreState'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
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
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options;

  const wrapped = <MemoryRouter {...routerProps}>{component}</MemoryRouter>;

  return mount(wrapped, mountOptions);
});

// TODO:  To be merged as a dual mount - when Redux added to App.
// Cypress.Commands.add('mount', (component, options = {}) => {
//   // Use the default store if one is not provided
//   const { reduxStore = getStore(), ...mountOptions } = options

//   const wrapped = <Provider store={reduxStore}>{component}</Provider>

//   return mount(wrapped, mountOptions)
// })
