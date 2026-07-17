# CRM: Client

## Required files

###### .env.dev.client

```ini
# .env.dev.client

NODE_ENV=development

# Webpack
WEBPACK_PREFIX=WEBPACK_DEV_
WEBPACK_DEV_ENV=development

# API Address
WEBPACK_DEV_API_HOST=localhost:4000

# %PUBLIC_URL%
WEBPACK_DEV_PUBLIC_URL=http://localhost:3000

# Rollbar SDK
WEBPACK_DEV_ROLLBAR_ENABLED=false
WEBPACK_DEV_ROLLBAR_POST_CLIENT_ITEM=xxxx
WEBPACK_DEV_ROLLBAR_POST_SERVER_ITEM=xxxx
```

###### .env.prod.client

```ini
# .env.prod.client

NODE_ENV=production

# Webpack
WEBPACK_PREFIX=WEBPACK_PROD_

# API Address
WEBPACK_PROD_API_HOST=localhost:8080

# PUBLIC_URL
WEBPACK_PROD_PUBLIC_URL=http://127.0.0.1:3443/

# Rollbar SDK
WEBPACK_PROD_ROLLBAR_ENABLED=true
WEBPACK_PROD_ROLLBAR_POST_CLIENT_ITEM=xxxx
WEBPACK_PROD_ROLLBAR_POST_SERVER_ITEM=xxxx
```

## Debugging

Add the following object to your 'configurations' array in the VSCode `launch.json`:

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Webpack Dev",
  "url": "http://localhost:3000",
  "sourceMaps": true,
  "trace": true,
  "skipFiles": ["${workspaceRoot}/<node_internals>/**", "${workspaceRoot}/node_modules/**"]
}
```
