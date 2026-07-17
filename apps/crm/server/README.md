# CRM: Server

## Required files

###### .env.dev.server

```ini
# ..dev.server

NODE_ENV=development

# NodeJS Express
JWT_AUTH_EXPIRES=0000m
JWT_REFRESH_EXPIRES=0000d
JWT_COOKIE_AUTH_ID=xxxx
JWT_COOKIE_AUTH_EXPIRES=0000h
JWT_COOKIE_REFRESH_ID=xxxx
JWT_COOKIE_REFRESH_EXPIRES=0000d
PASSWORD_RESET_EXPIRES=0000m

# Postgres
POSTGRES_PASSWORD_RESET_EXPIRES=0000m

# Rollbar Logging
ROLLBAR_ENABLED=false
ROLLBAR_POST_SERVER_ITEM=xxxx

# Pino Logging
PINO_LOG_LEVEL=trace

# NodeMailer
NODEMAILER_PORT=xxxx
NODEMAILER_HOST=mailpit
NODEMAILER_SECURE=false
```

###### .env.prod.server

```ini
# .prod.server

NODE_ENV=production

# NodeJS Express
JWT_AUTH_EXPIRES=0000m
JWT_REFRESH_EXPIRES=0000d
JWT_COOKIE_AUTH_ID=xxxx
JWT_COOKIE_AUTH_EXPIRES=0000h
JWT_COOKIE_REFRESH_ID=xxxx
JWT_COOKIE_REFRESH_EXPIRES=0000d
PASSWORD_RESET_EXPIRES=0000m

# Postgres
POSTGRES_PASSWORD_RESET_EXPIRES=0000m

# Rollbar Logging
ROLLBAR_ENABLED=true
ROLLBAR_POST_SERVER_ITEM=xxxx
ROLLBAR_READ=xxxx
ROLLBAR_WRITE=xxxx

# Pino Logging
PINO_LOG_LEVEL=error
```

## Debugging

Add the following object to your 'configurations' array in the VSCode `launch.json`:

```json
{
  "name": "Node.js",
  "type": "node",
  "request": "attach",
  "port": 9229,
  "restart": true,
  "skipFiles": [
    // Node.js internal core modules
    "<node_internals>/**",
    // Ignore all dependencies (optional)
    "${workspaceFolder}/node_modules/**"
  ]
}
```

## Tooling

### Postman

<!-- // TODO: Generate/Export Postman config for project and export. Strip any passwords/secure data  -->
