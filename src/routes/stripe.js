const { Stripe } = require('../handlers');

const router = require('express').Router();

const handler = new Stripe();

router.get('/customers/', handler.getAllCustomers);
router.get('/customers/find', handler.getSingleCustomer);
router.get('/customers/search', handler.searchCustomer);
router.post('/customers', handler.createCustomer);
router.put('/customers', handler.updateCustomer);
router.delete('/customers', handler.deleteCustomer);

module.exports = {
  stripe: router,
};
