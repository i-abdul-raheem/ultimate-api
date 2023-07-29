const { User } = require('../handlers');

const router = require('express').Router();

const handler = new User();

// Get all users
router.get('/', handler.getAllUsers);

// Get user by username of id
router.get('/find', handler.getUserByIdOrUsername);

// Block user by username
router.patch('/block', handler.blockUser);

// Unblock user by username
router.patch('/unblock', handler.unblockUser);

// Undate password by username
router.patch('/update-password', handler.updatePassword);

// Create new user
router.post('/', handler.createUser);

module.exports = {
  users: router,
};
