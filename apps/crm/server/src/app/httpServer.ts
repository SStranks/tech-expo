import type { ServerOptions } from 'node:https';

import http from 'node:http';
import https from 'node:https';

import express from './express.js';

const { NODE_ENV } = process.env;

import fs from 'node:fs';
import { createSecureContext } from 'node:tls';

function httpsServerOptions(): ServerOptions {
  let secureContext;
  try {
    secureContext = createSecureContext({
      ca: fs.readFileSync('/certs/expressjs-ca'),
      cert: fs.readFileSync('/certs/server-expressjs.crt'),
      key: fs.readFileSync('/certs/server-expressjs.key'),
    });
    console.log('[httpsServer] Secure context created');
  } catch (error) {
    console.log('[httpsServer] Failed to create secure context:', error);
  }

  const serverOptions: ServerOptions = {
    rejectUnauthorized: true,
    requestCert: true,
    secureContext,
  };

  return serverOptions;
}

const server =
  NODE_ENV === 'production' ? https.createServer(httpsServerOptions(), express) : http.createServer({}, express);

export default server;
