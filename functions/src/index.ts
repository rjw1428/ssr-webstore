import * as customers from './customers';
import * as helpers from './helpers';

exports.addStripeCustomer = customers.createStripeCustomer
// exports.createCustomer = customers.createCustomer
// exports.getUser = customers.getUser

exports.createCharge = customers.createStripeCharge
exports.createSource = customers.createStripeSource

// exports.resizeImage = helpers.resizeImage

exports.test = helpers.test