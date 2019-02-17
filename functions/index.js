const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const stripe = require('stripe')(functions.config().stripe.token);
const currency = 'usd';
const amount = 7500;

const admin = require('firebase-admin');
admin.initializeApp();

exports.charge = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const token = req.body.token,
      privateDataId = req.body.privateDataId,
      jobId = req.body.jobId;

    return stripe.charges
      .create(
        {
          amount: amount,
          currency: currency,
          description: 'Remote Work List Job Post',
          source: token
        },
        {
          idempotency_key: privateDataId
        }
      )
      .then(charge => {
        console.log(charge);

        /*eslint-disable */
        return admin.firestore()
          .collection(`jobs/${jobId}/private`)
          .doc(privateDataId)
          .update({ updated: true })
          .then(() => {
            return res.status(200).send({
              chargeSuccess: true
            });
          });
        /*eslint-enable */
      })
      .catch(error => {
        console.log(error);

        /*eslint-disable */
        return admin.firestore()
          .collection(`jobs/${jobId}/private`)
          .doc(privateDataId)
          .update({ updated: false })
          .then(() => {
            return res.status(200).send({
              chargeSuccess: false
            });
          });
        /*eslint-enable */
      });
  });
});
