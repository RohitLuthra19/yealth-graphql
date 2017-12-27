var Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      name: Joi.string().alphanum().min(3).max(30).required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required(),
      email: Joi.string().email(),
      city: Joi.string().required(),
      /* address: Joi.array(),
      otp: Joi.string(),
      verified: Joi.boolean(),
      orderId: Joi.object(),
      orderHistory: Joi.array(),
      orderId: Joi.object() */
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      name: Joi.string().alphanum().min(3).max(30).required(),
      mobileNumber: Joi.string().regex(/^[1-9][0-9]{9}$/).required(),
      email: Joi.string().email(),
      password: Joi.string().required(),
      city: Joi.string().required(),
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      mobileNumber: Joi.string().required(),
    }
  }
};
