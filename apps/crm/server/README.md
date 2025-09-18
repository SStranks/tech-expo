# CRM: Server

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
