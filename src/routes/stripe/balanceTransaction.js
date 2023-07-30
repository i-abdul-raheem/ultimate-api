const { Stripe } = require('../../handlers');

const router = require('express').Router();

const handler = new Stripe();

router.get('/', handler.balanceTransactions.getAllTransactions);
router.get('/find', handler.balanceTransactions.retrieveTransaction);

module.exports = {
  balanceTransaction: router,
};
