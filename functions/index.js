const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.token);
const currency = 'usd';
const amount = 7500;

const admin = require('firebase-admin');
admin.initializeApp();

exports.chargeCard = functions.firestore
  .document('/jobs/{jobId}/private/{privateDataId}')
  .onCreate((snap, context) => {
    // context.params.jobId
    // console.log(privateData, context.params.jobId);
    const privateData = snap.data();

    return stripe.charges
      .create(
        {
          amount: amount,
          currency: currency,
          description: 'Remote Work List Job Post',
          source: privateData.token
        },
        {
          idempotency_key: context.params.privateDataId
        }
      )
      .then(charge => {
        console.log(charge);

        return snap.ref.update({
          updated: true
        });
      })
      .catch(error => {
        console.log(error);

        return snap.ref.update({
          updated: false
        });
      });
  });
