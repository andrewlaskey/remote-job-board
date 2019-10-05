const stage = 'dev';
const crypto = require('crypto');
const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const axios = require('axios');
const mailgun = require('mailgun-js');
const sanitizeHtml = require('sanitize-html');
const stripHtml = require('string-strip-html');
const admin = require('firebase-admin');

const setStage = key => {
  return `${stage}_${key}`;
};

const config = functions.config();
const RJB_KEY = config[setStage('rjb')].key;
const STRIPE_TOKEN = config[setStage('stripe')].token;
const MAILGUN_KEY = config[setStage('mailgun')].key;
const MAILGUN_DOMAIN = config[setStage('mailgun')].domain;
const MAILGUN_FROM = config[setStage('mailgun')].from;
const MAILGUN_ADMIN_EMAIL = config[setStage('mailgun')].adminto;

const stripe = require('stripe')(STRIPE_TOKEN);
const currency = 'usd';
const amount = 7500;

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
    const jobsColl = setStage('jobs');
    const statusColl = setStage('status');
    const privateColl = setStage('private');
    const newPost = await store.collection(jobsColl).add(post);

    // Save public readable post status
    await store
      .collection(statusColl)
      .doc(newPost.id)
      .set({
        title: post.title,
        status: post.status,
        createDate: post.createDate,
        slug: post.slug
      });

    // Save private post data
    await store
      .collection(privateColl)
      .doc(newPost.id)
      .set({
        title: post.title,
        user: userEmail,
        stripeId: stripeCharge.id,
        amount: stripeCharge.amount
      });

    return newPost.id;
  } catch (err) {
    console.log('createJobPost ERROR');
    console.log(err);
    console.log(post, newPost, stripCharge);
    return undefined;
  }
};

const mailGunResponse = (error, body) => {
  console.log('mailGunResponse');
  console.log(error, body);
};

const sendEmail = (to, subject, text) => {
  const apiKey = MAILGUN_KEY;
  const domain = MAILGUN_DOMAIN;
  const from = MAILGUN_FROM;
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
  const { title } = post;
  const subject = 'Your job listing was received and is being reviewed';
  const text = `
    Thank you for submitting your listing for ${title}!

    We are currently reviewing your post and will notify you when it is approved.

    You can view the status of your post here:
    https://remote-job-board.netlify.com/status/${postId}
  `;

  sendEmail(email, subject, text);
};

const sendUserApproveNotification = (email, post) => {
  const { title, slug } = post;
  const subject = 'Your job listing was approved';
  const text = `
    Your job listing for ${title} was approved!

    You may view your listing here:
    https://remote-job-board.netlify.com/job/${slug}
  `;

  sendEmail(email, subject, text);
};

const sendAdminNotification = (email, post, postId) => {
  const {
    title,
    description,
    howToApply,
    applyUrl,
    companyName,
    companyUrl
  } = post;
  const adminEmail = MAILGUN_ADMIN_EMAIL;

  const hmac = crypto.createHash('sha256', RJB_KEY);
  const signature = hmac.update(postId).digest('hex');

  const subject = 'New post submission';

  const api = 'https://us-central1-remote-job-board.cloudfunctions.net';
  const endpoint = setStage('approvePost');
  const query = `sig=${signature}&id=${postId}`;
  const approveUrl = `${api}/${endpoint}?${query}`;

  const text = `
    Title: ${title}
    User: ${email}
    Post ID: ${postId}
    Console: https://console.firebase.google.com/project/remote-job-board/
    Approve: ${approveUrl}
    Description: ${stripHtml(description)}
    How To Apply: ${stripHtml(howToApply)}
    Apply Url: ${applyUrl}
    Company Name: ${companyName}
    Company Url: ${companyUrl}
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

// Functions
/*eslint-disable */
const processNewPost = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const { body } = req; 
    const { token, post, email: userEmail } = body;
    const { slug, createDate } = post;
    const idempotencyKey = `${slug}${createDate}`;
    const resPackage = {
      error: false,
      errorType: '',
      chargeSuccess: false,
      postCreate: false,
      postId: false,
      message: ''
    };

    console.log('CREATING NEW POST')
    console.log(post);

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
          console.log('Stripe Charge Response');
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
          console.log('Stripe ERROR');
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
        console.log('Other ERROR');
        console.log(err);
        resPackage.error = true;
        resPackage.errorType = 'other';
        resPackage.message = 'catch error';

        return res.status(200).send(resPackage);
      });
  });
});
/*eslint-enable */

const approvePost = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const { sig, id } = req.query;

    const hmac = crypto.createHash('sha256', RJB_KEY);
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
      const jobsColl = setStage('jobs');
      const statusColl = setStage('status');
      const privateColl = setStage('private');

      const postRef = store.collection(jobsColl).doc(id);
      batch.update(postRef, {
        status: 'published'
      });

      const statusRef = store.collection(statusColl).doc(id);
      batch.update(statusRef, {
        status: 'published'
      });

      return batch
        .commit()
        .then(async () => {
          netlifyApprovedBuildHook();

          const privateData = await store
            .collection(privateColl)
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

exports[setStage('processNewPost')] = processNewPost;
exports[setStage('approvePost')] = approvePost;
