export default {
  projects: {
    crm: {
      documents: 'apps/crm/client/src/**/*.{graphql,js,ts,jsx,tsx}',
      schema: 'apps/crm/server/src/graphql/typedefs/*.graphql',
      extensions: {
        languageService: {
          enableValidation: false,
        },
      },
    },
  },
};
