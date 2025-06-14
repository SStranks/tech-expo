import http from 'node:http';

import express from './express.js';

export default http.createServer(express);
