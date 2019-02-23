const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const stripe = require('stripe')(functions.config().stripe.token);
const currency = 'usd';
const amount = 7500;

const admin = require('firebase-admin');
admin.initializeApp();

const createJobPost = async (post, stripeCharge, userEmail) => {
  try {
    const store = admin.firestore();
    const newPost = await store.collection('jobs').add(post);

    // Save public readable post status
    await store
      .collection('status')
      .doc(newPost.id)
      .set({
        title: post.title,
        status: post.publishStatus,
        createDate: post.createDate
      });

    // Save private post data
    await store
      .collection('private')
      .doc(newPost.id)
      .set({
        title: post.title,
        user: userEmail,
        stripeId: stripeCharge.id,
        amount: stripeCharge.amount
      });

    return newPost.id;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

/*eslint-disable */
exports.processNewPost = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const token = req.body.token,
      post = req.body.post,
      userEmail = req.body.email,
      idempotencyKey = post.slug + post.createDate,
      resPackage = {
        error: false,
        errorType: '',
        chargeSuccess: false,
        postCreate: false,
        postId: false,
        message: ''
      };

    return stripe.charges
      .create(
        {
          amount: amount,
          currency: currency,
          description: 'Remote Work List Job Post',
          source: token
        },
        {
          idempotency_key: idempotencyKey
        }
      )
      .then(
        charge => {
          console.log(charge);
          resPackage.chargeSuccess = true;
          resPackage.message = 'charge successful';
          
          return createJobPost(post, charge, userEmail)
            .then(postId => {

              if (postId) {
                resPackage.postId = postId;
                resPackage.message = 'success';
              } else {
                resPackage.errorType = 'post';
              }

              return res.status(200).send(resPackage);
            });
        },
        err => {
          console.log(err);
          resPackage.error = true;

          switch (err.type) {
            case 'StripeCardError':
              // A declined card error
              resPackage.errorType = 'card';
              resPackage.message = err.message; // => e.g. "Your card's expiration year is invalid."
              break;
            case 'RateLimitError':
            // Too many requests made to the API too quickly
            case 'StripeInvalidRequestError':
            // Invalid parameters were supplied to Stripe's API
            case 'StripeAPIError':
            // An error occurred internally with Stripe's API
            case 'StripeConnectionError':
            // Some kind of error occurred during the HTTPS communication
            case 'StripeAuthenticationError':
            // You probably used an incorrect API key
            default:
              // Handle any other types of unexpected errors
              resPackage.errorType = 'stripe';
              resPackage.message = 'Stripe Error';
              break;
          }

          return res.status(200).send(resPackage);
        }
      )
      .catch(err => {
        console.log(err);
        resPackage.error = true;
        resPackage.errorType = 'other';
        resPackage.message = 'catch error';

        return res.status(200).send(resPackage);
      });
  });
});
/*eslint-enable */
