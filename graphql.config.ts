export default {
  projects: {
    crm: {
      schema: 'apps/crm/server/src/graphql/schema.graphql',
      documents: 'apps/crm/client/src/**/*.{graphql,js,ts,jsx,tsx}',
      extensions: {
        languageService: {
          enableValidation: false,
        },
      },
    },
  },
};
