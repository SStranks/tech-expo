// Import Cypress commands
import './commands.ts';

// Import required dependencies for components
import '@Sass/global-imports.scss';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
// import { EnhancedStore } from '@reduxjs/toolkit'
// import { RootState } from './src/StoreState'

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
