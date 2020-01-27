import { db, stripe } from './config'
import * as functions from 'firebase-functions';

// export const test =  functions.firestore.document('alpineKnives/customerInfo').onWrite(change=>{
//     console.log(change.after.id)
// })

export const createStripeCustomer = functions.auth.user().onCreate(event => {
    const user = event
    const userRef = db.collection('alpineKnives')
        .doc('customerInfo')
        .collection('accounts')
        .doc(user.uid)

    return createCustomer(user)
        .then(customer => {
            const data = { stripeCustomerId: customer.id }
            return userRef.set(data, { merge: true })
        })
        .catch(console.log)
})

export const createStripeSource = functions.https.onCall(async (data) => {
    try {
        const x = await stripe.customers.createSource(
            data.stripeId, {source: data.token.id}
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
        console.log(x)
        return x
    }
    catch (err) {
        console.log("ERROR: " + err)
        return err
    }
})


// export async function getUserCharges(userId: string, limit?: number): Promise<any> {
//     const user = await getUser(userId).then()
//     if (user) {
//         const customreId = user.stripeCustomerId
//         return await stripe.charges.list({
//             limit,
//             customer: customreId
//         })
//     }
// }




// export const getUser = async (uid: string) => {
//     return await db.collection('alpineKnives').doc('customerInfo').collection('accounts').doc(uid).get().then(doc => doc.data())
// }

// export const getCustomer = async(uid: string) => {
//     const user = await getUser(uid)
//     return user
// }

// export const updateUser = async(uid: string, data: Object) => {
//     return await db.collection('alpineKnives').doc('customerInfo').collection('accounts').doc(uid).set(data, {merge: true})
// }

export const createCustomer = async (user: any) => {
    const customer = await stripe.customers.create({
        email: user.email,
        description: new Date().toISOString(),
        metadata: { firebaseUID: user.uid }
    })
    // await await db.collection('alpineKnives').doc('customerInfo').collection('accounts').add({
    //     user: "Name",
    //     email: user.email,
    //     paymentId: customer.id
    // })
    return customer
}

// export const getOrCreateCustomer = async(uid: string) => {
//     const user = await getUser(uid)
//     const customerId = user && user.stripeCustomerId
//     if (user && user.stripeCustomerId)
//         return stripe.customers.retrieve(customerId)
//     return createCustomer(uid)
// }