//
// This is the main script.
// Start with:
//
// node index.js
//
//

const tracer = require('./tracer')('otel-nodejs');

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const {logger} = require("./logger");
const {sendNotFound} = require("./util");


const app = express();

// Using bodyParser to parse JSON bodies into JS objects.
app.use(bodyParser.json());

// log HTTP requests
app.use(logger);

// activate sub-routes
app.get("/api/example", (req, res) => {
  const span = tracer.startSpan('makeRequest');
  const clientReq = http.get({host: 'localhost', port: 4000, path: '/api/example', timeout: 1000}, clientRes => {
    const body = [];
    clientRes.on('data', (chunk) => body.push(chunk));
    clientRes.on('end', () => {
      res.send({
        foo: body.toString(),
      });
      span.end();
    });
  });

  clientReq.on('error', err => {
    console.log('Error when requesting from backend:', err);
    res.status(500).send('Server Error');
  });
});

// map every other route and return 404
app.use("/*", (req, res) => sendNotFound(req, res));

// add error handler for uncaught errors
app.use("/*", (err, req, res, _next) => {
  console.error("Unknown error occurred:", req.method, req.url, err);
  res.status(500).send({error: String(err)});
});

// start server
const port = process.argv[2] || 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
