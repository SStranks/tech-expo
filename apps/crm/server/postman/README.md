# Postman

Postman collections and environments for exploring and testing the application's REST APIs.

## Getting started

- Import the example collection and environment into Postman
  - [`Development Collection`](./collections/example.dev.http.postman_collection.json)
  - [`Development Environment`](./environments/example.dev.postman_environment.json)
- Configure the required environment variable values
- Configure local vault secrets as required in the environment variables. See [Secure Environment Variables](#vault-secrets)
- Select the imported development environment using Postman's environment selector
- Initialize the Docker development environment [`README.md`](../../docker/README.md)

## Environment Variables

Non-secure environment variables, denoted by the unlocked padlock icon in the environments panel, are required for route functionality. For example, the body of the login route for the Root user contains:

```json
// Route: Routes/UserRoute/Login/Login - Root
{
  "email": "{{rootEmail}}",
  "password": "{{rootPassword}}"
}
```

The `rootEmail` variable should be populated with a suitable valid email address in the environment panel.

## Vault Secrets

The `rootPassword` variable is a secure environment variable. A local vault secret should be configured with a suitable name, and then selected within the `rootPassword` environment variable value cell.

```json
// Local vault secret
{
  "ROOT_PASSWORD": ""
}
```

All the secure environment variables, denoted by the locked padlock icon, require a corresponding vault secret.
