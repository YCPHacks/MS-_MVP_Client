require('dotenv').config();

const express = require('express');
const {
  auth
} = require('express-openid-connect');
const fastify = require('fastify')({ logger: true });

const { router } = require('./router.js');

// Configuring the express-openid-client SDK
const authConfig = {
  auth0Logout: true,
  authRequired: true,
  authorizationParams: {
    response_type: 'code',
    audience: 'https://tue-nov-28-api',
    scope: 'openid email profile'
  }
};

// Configuring application hosting variables
const port = process.env.PORT;

fastify.register(require("@fastify/view"), {
  engine: {
    pug: require("pug"),
  },
});

fastify.register(require('@fastify/express'))
  .after(() => {
    fastify.use(express.urlencoded({ extended: false }));
    fastify.use(express.json());

    fastify.use(auth(authConfig));

    fastify.use(router);
  });

fastify.listen({ port });
