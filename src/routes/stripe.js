const { Stripe } = require('../handlers');

const router = require('express').Router();

const handler = new Stripe();

router.get('/customers/find', handler.getSingleCustomer);
router.get('/customers/', handler.getAllCustomers);
router.post('/customers', handler.createCustomer);

module.exports = {
  stripe: router,
};
