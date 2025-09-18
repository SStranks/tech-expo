# CRM: Client

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
