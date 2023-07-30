const { Stripe } = require('../../handlers');

const router = require('express').Router();

const handler = new Stripe();

router.get('/', handler.customer.getAllCustomers);
router.get('/find', handler.customer.getSingleCustomer);
router.get('/search', handler.customer.searchCustomer);
router.post('/', handler.customer.createCustomer);
router.put('/', handler.customer.updateCustomer);
router.delete('/', handler.customer.deleteCustomer);

module.exports = {
  customers: router,
};
