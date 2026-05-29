export default {
  projects: {
    crm: {
      documents: 'apps/crm/client/src/**/*.{graphql,js,ts,jsx,tsx}',
      extensions: {
        languageService: {
          enableValidation: true,
        },
      },
      schema: 'apps/crm/shared/src/graphql/typedefs/*.graphql',
    },
  },
};
