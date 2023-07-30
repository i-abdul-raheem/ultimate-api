const { Customer } = require('./Customer');
const { Balance } = require('./Balance');
const { BalanceTransaction } = require('./BalanceTransaction');

class Stripe {
  customer = new Customer();
  balance = new Balance();
  balanceTransactions = new BalanceTransaction();
}

module.exports = Stripe;
