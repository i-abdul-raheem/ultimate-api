const router = require('express').Router();
const { customers } = require('./customers');
const { balance } = require('./balance');
const { balanceTransaction } = require('./balanceTransaction');

router.use('/customers', customers);
router.use('/balance', balance);
router.use('/transactions', balanceTransaction);

module.exports = {
  stripe: router,
};
