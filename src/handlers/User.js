const Response = require('./Response');
const { User: UserModel } = require('../model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

class User extends Response {
  hashPassword = (password) => {
    return bcrypt
      .hash(password, process.env.BCRYPT_SALT)
      .then((hash) => {
        return hash;
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
  };
  validatePassword = (password, hashed) => bcrypt.compare(password, hashed);
  getAllUsers = async (req, res) => {
    try {
      const users = await UserModel.find();
      if (users.length < 1) {
        return this.sendResponse(res, 'No users found', null);
      }
      return this.sendResponse(
        res,
        null,
        users.map(
          ({
            _id,
            username,
            blocked,
            lastLogin,
            createdAt,
            updatedAt,
            __v,
          }) => ({
            _id,
            username,
            blocked,
            lastLogin,
            createdAt,
            updatedAt,
            __v,
          })
        )
      );
    } catch (err) {
      return this.sendResponse(res, 'Internal Server Error', err, 500);
    }
  };
  getUserByIdOrUsername = async (req, res) => {
    try {
      const { id, username } = req.query;
      if (!id && !username) {
        return this.sendResponse(
          res,
          'User id/username is required',
          null,
          400
        );
      }
      if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return this.sendResponse(res, 'Invalid user id', null, 400);
      }
      let user = null;
      if (id && username) {
        user = await UserModel.findOne({ _id: id, username });
      } else if (id) {
        user = await UserModel.findOne({ _id: id });
      } else {
        user = await UserModel.findOne({ username });
      }
      if (!user) {
        return this.sendResponse(res, 'User not found', null, 404);
      }
      delete user?.password;
      return this.sendResponse(res, null, user);
    } catch (err) {
      return this.sendResponse(res, 'Internal Server Error', err, 500);
    }
  };
  blockUser = async (req, res) => {
    try {
      const { username } = req.query;
      if (!username) {
        return this.sendResponse(res, 'Username is required', null, 400);
      }
      const user = await UserModel.findOne({ username });
      if (!user) {
        return this.sendResponse(res, 'User not found', null, 404);
      }
      if (user?.blocked) {
        return this.sendResponse(res, 'User is already blocked', null, 400);
      }
      await UserModel.updateOne(
        { username },
        { $set: { blocked: true, updatedAt: Date.now() } }
      );
      return this.sendResponse(res, 'User has been blocked', null, 200);
    } catch (err) {
      return this.sendResponse(res, 'Internal Server Error', err, 500);
    }
  };
  unblockUser = async (req, res) => {
    try {
      const { username } = req.query;
      if (!username) {
        return this.sendResponse(res, 'Username is required', null, 400);
      }
      const user = await UserModel.findOne({ username });
      if (!user) {
        return this.sendResponse(res, 'User not found', null, 404);
      }
      if (!user?.blocked) {
        return this.sendResponse(res, 'User is not blocked', null, 400);
      }
      await UserModel.updateOne(
        { username },
        { $set: { blocked: false, updatedAt: Date.now() } }
      );
      return this.sendResponse(res, 'User has been unblocked', null, 200);
    } catch (err) {
      return this.sendResponse(res, 'Internal Server Error', err, 500);
    }
  };
  updatePassword = async (req, res) => {
    try {
      const { username, password, password1, password2 } = req.body;
      if (!username) {
        return this.sendResponse(res, 'Username is required', null, 400);
      }
      const user = await UserModel.findOne({ username });
      if (!user) {
        return this.sendResponse(res, 'User not found', null, 404);
      }
      if (!password) {
        return this.sendResponse(
          res,
          'Current password is required',
          null,
          400
        );
      }
      const result = await this.validatePassword(password, user?.password);
      if (!result) {
        return this.sendResponse(
          res,
          'Current password is not correct',
          null,
          400
        );
      }
      if (!password1) {
        return this.sendResponse(res, 'New password is required', null, 400);
      }
      if (!password2) {
        return this.sendResponse(
          res,
          'Confirm password is required',
          null,
          400
        );
      }
      if (password1 !== password2) {
        return this.sendResponse(
          res,
          'New password and confirm password should match',
          null,
          400
        );
      }
      if (password1.length < 8) {
        return this.sendResponse(
          res,
          'Password length should be 8 or greater',
          null,
          400
        );
      }
      const timestamp = Date.now();
      const newPassword = await this.hashPassword(password1);
      await UserModel.updateOne(
        { username },
        {
          $set: {
            password: newPassword,
            updatedAt: timestamp,
          },
        }
      );
      return this.sendResponse(res, 'Password updated', null, 200);
    } catch (err) {
      return this.sendResponse(res, 'Internal Server Error', err, 500);
    }
  };
  createUser = async (req, res) => {
    try {
      const { username, password1, password2 } = req.body;
      if (!username) {
        return this.sendResponse(res, 'Username is required', null, 400);
      }
      const user = await UserModel.findOne({ username });
      if (user) {
        return this.sendResponse(res, 'Username already exist', null, 404);
      }
      if (!password1) {
        return this.sendResponse(res, 'New password is required', null, 400);
      }
      if (!password2) {
        return this.sendResponse(
          res,
          'Confirm password is required',
          null,
          400
        );
      }
      if (password1 !== password2) {
        return this.sendResponse(
          res,
          'New password and confirm password should match',
          null,
          400
        );
      }
      if (password1.length < 8) {
        return this.sendResponse(
          res,
          'Password length should be 8 or greater',
          null,
          400
        );
      }
      const password = await this.hashPassword(password1);
      const newUser = new UserModel({
        username,
        password,
      });
      const query = await newUser.save();
      if (query) {
        return this.sendResponse(res, 'User created', query, 201);
      } else {
        return this.sendResponse(res, 'Unknown Error', null, 520);
      }
    } catch (err) {
      return this.sendResponse(res, 'Internal Server Error', err, 500);
    }
  };
}

module.exports = {
  User,
};
