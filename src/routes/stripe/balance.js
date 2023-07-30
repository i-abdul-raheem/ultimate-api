const { Stripe } = require('../../handlers');

const router = require('express').Router();

const handler = new Stripe();

router.get('/', handler.balance.getBalance);

module.exports = {
  balance: router,
};
