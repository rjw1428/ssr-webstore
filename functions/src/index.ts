import * as customers from './customers';

exports.createStripeCustomer = customers.createStripeCustomer
// exports.createCustomer = customers.createCustomer
// exports.getUser = customers.getUser

exports.createCharge = customers.createStripeCharge
exports.createSource = customers.createStripeSource