const { Auth } = require('../handlers');

const router = require('express').Router();

const handler = new Auth();

router.get('/', handler.refreshToken);
router.post('/', handler.login);

module.exports = {
  auth: router,
};
