export default {
  projects: {
    crm: {
      documents: 'apps/crm/client/src/**/*.{graphql,js,ts,jsx,tsx}',
      schema: 'apps/crm/shared/src/graphql/typedefs/*.graphql',
      extensions: {
        languageService: {
          enableValidation: true,
        },
      },
    },
  },
};
