import { db, stripe } from './config'
import * as functions from 'firebase-functions';

// export const createStripeCustomer = functions.auth.user().onCreate(event => {
//     const user = event
//     const userRef = db.collection('alpineKnives')
//         .doc('customerInfo')
//         .collection('accounts')
//         .doc(user.uid)

//     return userRef.get()
//         .then(userDoc => {
//             console.log(userDoc)
//             return createCustomer(userDoc)
//                 .then(customer => {
//                     const data = { stripeCustomerId: customer.id }
//                     return userRef.set(data, { merge: true })
//                 })
//                 .catch(console.log)
//         })
//         .catch(console.log)
// })

export const createStripeCustomer = functions.https.onCall(async (data) => {
        console.log(data)
        const userRef = db.collection('alpineKnives')
            .doc('customerInfo')
            .collection('accounts')
            .doc(data.uid)
    
        return userRef.get()
            .then(userDoc => {
                console.log(userDoc)
                return createCustomer(data)
                    .then(customer => {
                        const userUpdate = { stripeCustomerId: customer.id }
                        userRef.set(userUpdate, { merge: true }).catch(console.log)
                        return customer.id
                    })
                    .catch(console.log)
            })
            .catch(console.log)
    })

export const createStripeSource = functions.https.onCall(async (data) => {
    try {
        const x = await stripe.customers.createSource(
            data.stripeId, { source: data.token.id }
        )
        return x
    }
    catch (err) {
        console.log("ERROR: " + err)
        return err
    }
})


export const createStripeCharge = functions.https.onCall(async (data, context) => {
    try {
        const x = await stripe.charges.create({
            amount: data.amount,
            currency: 'usd',
            description: 'Website Charge',
            customer: data.customer,
            statement_descriptor: 'Alpine Custom Knives',
        })
        return x
    }
    catch (err) {
        console.log("ERROR: " + err)
        return err
    }
})


export const createCustomer = async (user: any) => {
    const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        description: new Date().toISOString(),
        metadata: { firebaseUID: user.uid }
    })

    return customer
}
