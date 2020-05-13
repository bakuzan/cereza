import './type-defs';
import path from 'path';
import express from 'express';

const distPath = path.resolve(__dirname, '../dist');

export default (app: express.Application) => {
  app.use((req, _, next) => {
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
  });

  app.use(express.static(distPath));

  // Always return the main index.html, so router render the route in the client
  if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res, next) => {
      // if (req.url.includes('graphql')) {
      //   next();
      // }

      res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
  }
};
