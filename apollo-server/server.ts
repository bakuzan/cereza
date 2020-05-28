import './type-defs';
import path from 'path';
import express from 'express';

import { Environment } from './constants';
import { streamVideo } from './stream';

const distPath =
  process.env.NODE_ENV === Environment.Production
    ? path.resolve(__dirname, '../../dist')
    : path.resolve(__dirname, '../dist');

export default (app: express.Application) => {
  app.use((req, _, next) => {
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
  });

  app.use(express.static(distPath));

  // Streaming
  app.get('/video/:key', streamVideo);

  // Always return the main index.html, so router render the route in the client
  if (process.env.NODE_ENV === Environment.Production) {
    app.get('/index.html', (_, res) =>
      res.sendFile(path.resolve(distPath, 'index.html'))
    );

    app.get('*', (_, res) =>
      res.sendFile(path.resolve(distPath, 'index.html'))
    );
  }
};
