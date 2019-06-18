const crypto = require('crypto');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const axios = require('axios');
const mailgun = require('mailgun-js');
const sanitizeHtml = require('sanitize-html');
const stripHtml = require('string-strip-html');
const stripe = require('stripe')(functions.config().stripe.token);
const currency = 'usd';
const amount = 7500;

const admin = require('firebase-admin');
admin.initializeApp();

const sanitizePost = post => {
  const {
    companyName,
    companyUrl,
    description,
    howToApply,
    title,
    applyUrl,
    ...rest
  } = post;

  return {
    applyUrl: stripHtml(applyUrl),
    companyName: stripHtml(companyName),
    companyUrl: stripHtml(companyUrl),
    description: sanitizeHtml(description),
    howToApply: sanitizeHtml(howToApply),
    title: stripHtml(title),
    ...rest
  };
};

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
        status: post.status,
        createDate: post.createDate,
        slug: post.slug
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

const mailGunResponse = (error, body) => {
  console.log(error, body);
};

const sendEmail = (to, subject, text) => {
  const apiKey = functions.config().mailgun.key;
  const domain = functions.config().mailgun.domain;
  const from = functions.config().mailgun.from;
  const mg = mailgun({
    apiKey,
    domain
  });

  mg.messages().send(
    {
      from,
      to,
      subject,
      text
    },
    mailGunResponse
  );
};

const sendUserNotification = (email, post, postId) => {
  const subject = 'Your job listing was received and is being reviewed';
  const text = `
    Thank you for submitting your listing for ${post.title}!

    We are currently reviewing your post and will notify you when it is approved.

    You can view the status of your post here:
    https://remote-job-board.netlify.com/status/${postId}
  `;

  sendEmail(email, subject, text);
};

const sendUserApproveNotification = (email, post) => {
  const subject = 'Your job listing was approved';
  const text = `
    Your job listing for ${post.title} was approved!

    You may view your listing here:
    https://remote-job-board.netlify.com/job/${post.slug}
  `;

  sendEmail(email, subject, text);
};

const sendAdminNotification = (email, post, postId) => {
  const adminEmail = functions.config().mailgun.adminto;

  const hmac = crypto.createHash('sha256', functions.config().rjb.key);
  const signature = hmac.update(postId).digest('hex');

  const subject = 'New post submission';
  const text = `
    Title: ${post.title}
    User: ${email}
    Post ID: ${postId}
    Console: https://console.firebase.google.com/project/remote-job-board/
    Approve: https://us-central1-remote-job-board.cloudfunctions.net/approvePost?sig=${signature}&id=${postId}
    Description: ${stripHtml(post.description)}
    How To Apply: ${stripHtml(post.howToApply)}
    Apply Url: ${post.applyUrl}
    Company Name: ${post.companyName}
    Company Url: ${post.companyUrl}
  `;

  sendEmail(adminEmail, subject, text);
};

const netlifyBuildHook = () => {
  const webhookUrl =
    'https://api.netlify.com/build_hooks/5cd5c6d47d9014f060cddc2c';

  axios.post(webhookUrl, {});
};

const netlifyApprovedBuildHook = () => {
  const webhookUrl =
    'https://api.netlify.com/build_hooks/5d08676e5d59683481631eeb';

  axios.post(webhookUrl, {});
};

/*eslint-disable */
exports.processNewPost = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const token = req.body.token;
    const post = req.body.post;
    const userEmail = req.body.email;
    const idempotencyKey = post.slug + post.createDate;
    const resPackage = {
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

          const safePost = sanitizePost(post);
          
          return createJobPost(safePost, charge, userEmail)
            .then(postId => {

              if (postId) {
                resPackage.postId = postId;
                resPackage.message = 'success';

                netlifyBuildHook();
                sendAdminNotification(userEmail, post, postId);
                sendUserNotification(userEmail, post, postId);
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

exports.approvePost = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const { sig, id } = req.query;

    const hmac = crypto.createHash('sha256', functions.config().rjb.key);
    const computedSignature = hmac.update(id).digest('hex');

    const computedSignatureBuffer = Buffer.from(computedSignature, 'hex');
    const retrievedSignatureBuffer = Buffer.from(sig, 'hex');
    const valid = crypto.timingSafeEqual(
      computedSignatureBuffer,
      retrievedSignatureBuffer
    );

    if (valid) {
      const store = admin.firestore();
      const batch = store.batch();

      const postRef = store.collection('jobs').doc(id);
      batch.update(postRef, {
        status: 'published'
      });

      const statusRef = store.collection('status').doc(id);
      batch.update(statusRef, {
        status: 'published'
      });

      return batch
        .commit()
        .then(async () => {
          netlifyApprovedBuildHook();

          const privateData = await store
            .collection('private')
            .doc(id)
            .get();
          const post = await postRef.get();

          if (privateData.exists && post.exists) {
            sendUserApproveNotification(privateData.data().user, post.data());
          }

          return res.status(200).send({
            message: `Post of ${id} published`
          });
        })
        .catch(err => {
          return res.status(200).send({
            error: true,
            message: JSON.stringify(err)
          });
        });
    }

    return res.status(200).send({
      error: true,
      message: 'Not valid'
    });
  });
});
